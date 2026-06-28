/* AXIS — Hero fluid simulation v7 — bounded dye accumulation
   Physics: Navier-Stokes, ping-pong FBOs, semi-Lagrangian advection, Jacobi pressure.
   Color: 1D gradient texture sampled via cos(time). Single RGB dye field.
   Accumulation: bounded mix (not additive). Finite circular falloff (not gaussian fog).
   Phases: large start-dye that fades → low-opacity noise emitter proportional to movement.
*/
(function () {
  'use strict';

  const canvas = document.getElementById('heroFlow');
  if (!canvas) return;
  const hero = document.getElementById('hero');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.classList.add('no-webgl');
    return;
  }

  let gl;
  try {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: false });
  } catch (e) {}
  if (!gl) { hero.classList.add('no-webgl'); return; }

  const extFloat = gl.getExtension('OES_texture_float');
  const extHalf  = gl.getExtension('OES_texture_half_float');

  /* Detect best FBO-renderable format: float → half-float → 8-bit fallback.
     Chrome accepts OES_texture_float for sampling but may fail framebuffer
     completeness check for rendering — always falls back to UNSIGNED_BYTE. */
  function detectFBOType() {
    function testFBO(type) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, type, null);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteTexture(tex); gl.deleteFramebuffer(fb);
      return ok;
    }
    if (extFloat && testFBO(gl.FLOAT))                          return gl.FLOAT;
    if (extHalf  && testFBO(extHalf.HALF_FLOAT_OES))            return extHalf.HALF_FLOAT_OES;
    return gl.UNSIGNED_BYTE; /* always renderable; bounded mix() keeps values in [0,1] */
  }
  const FTYPE = detectFBOType();

  const linearOk = FTYPE === gl.FLOAT
    ? !!gl.getExtension('OES_texture_float_linear')
    : FTYPE === (extHalf && extHalf.HALF_FLOAT_OES)
      ? !!gl.getExtension('OES_texture_half_float_linear')
      : true; /* UNSIGNED_BYTE always supports LINEAR */
  const FILTER = linearOk ? gl.LINEAR : gl.NEAREST;

  /* ── Shaders ───────────────────────────────────────────────────────────── */

  const VS = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }`;

  const FS_ADVECT = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform float uDt;
    uniform float uDissipation;
    void main() {
      vec2 vel   = texture2D(uVelocity, vUv).xy;
      vec2 coord = vUv - vel * uDt;
      coord = clamp(coord, 0.001, 0.999);
      gl_FragColor = texture2D(uSource, coord) * uDissipation;
    }`;

  /* Dye splat: finite circular falloff + bounded mix — no additive blowout */
  const FS_DYE_SPLAT = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform vec2  uPoint;
    uniform vec3  uColor;
    uniform float uOpacity;
    uniform float uRadius;
    uniform float uAspect;
    void main() {
      vec2 circle = (vUv - uPoint) / uRadius;
      circle.x *= uAspect;
      float d = 1.0 - min(length(circle), 1.0);
      d *= d;
      float alpha = d * uOpacity;
      vec3 dst = texture2D(uTarget, vUv).rgb;
      gl_FragColor = vec4(mix(dst, uColor, alpha), 1.0);
    }`;

  /* Velocity splat: additive (velocities superpose correctly) */
  const FS_VEL_SPLAT = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform vec2  uPoint;
    uniform vec2  uVelocity;
    uniform float uRadius;
    uniform float uAspect;
    void main() {
      vec2 circle = (vUv - uPoint) / uRadius;
      circle.x *= uAspect;
      float d = 1.0 - min(length(circle), 1.0);
      d *= d;
      vec2 dst = texture2D(uTarget, vUv).xy;
      gl_FragColor = vec4(dst + uVelocity * d, 0.0, 1.0);
    }`;

  const FS_DIVERGENCE = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    void main() {
      float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
      float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
      float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
      float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`;

  const FS_PRESSURE = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 uTexelSize;
    void main() {
      float L = texture2D(uPressure, vUv - vec2(uTexelSize.x * 2.0, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(uTexelSize.x * 2.0, 0.0)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y * 2.0)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y * 2.0)).x;
      float div = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
    }`;

  const FS_GRADIENT_SUB = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;
    void main() {
      float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
      vec2 vel = texture2D(uVelocity, vUv).xy;
      gl_FragColor = vec4(vel - 0.5 * vec2(R - L, T - B), 0.0, 1.0);
    }`;

  /* Display: fluid color → exposure tone-map → grain → vignette
     Tone-map keeps bright areas soft and prevents white blowout. */
  const FS_DISPLAY = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uDye;
    uniform float uTime;

    void main() {
      vec3 BG = vec3(0.000, 0.010, 0.048);

      /* 1. Raw dye */
      vec3 col = texture2D(uDye, vUv).rgb;

      /* 2. Soft exposure tone-map — rolls off highlights before clipping */
      col = col / (col + vec3(0.55));

      /* 3. Vignette toward background */
      vec2  uvc = vUv - 0.5;
      float vig = 1.0 - smoothstep(0.20, 0.72, length(uvc) * 1.5);
      float presence = smoothstep(0.0, 0.04, length(col));
      col = mix(BG, col, vig * presence);

      /* 4. Cinematic grain — two fine octaves, fades with luminance, absent in pure black */
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      float grainMask = smoothstep(0.0, 0.12, lum); /* absent in near-black, full in midtones */
      vec2 gp = vUv * 890.0 + uTime * 0.17;
      float g1 = fract(sin(dot(gp,             vec2(12.9898, 78.233))) * 43758.5453);
      float g2 = fract(sin(dot(gp * 0.47 + 3.1, vec2(39.346, 11.135))) * 43758.5453);
      float grain = (g1 * 0.65 + g2 * 0.35) * 2.0 - 1.0;
      col += grain * 0.014 * grainMask;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }`;

  /* ── Compile & link ────────────────────────────────────────────────────── */

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[axis fluid]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function program(fsSrc) {
    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn('[axis fluid]', gl.getProgramInfoLog(p));
      return null;
    }
    p.u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      p.u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return p;
  }

  const pAdvect    = program(FS_ADVECT);
  const pDyeSplat  = program(FS_DYE_SPLAT);
  const pVelSplat  = program(FS_VEL_SPLAT);
  const pDiverg    = program(FS_DIVERGENCE);
  const pPressure  = program(FS_PRESSURE);
  const pGradSub   = program(FS_GRADIENT_SUB);
  const pDisplay   = program(FS_DISPLAY);

  if (!pAdvect || !pDyeSplat || !pVelSplat || !pDiverg || !pPressure || !pGradSub || !pDisplay) {
    hero.classList.add('no-webgl');
    return;
  }

  /* ── Full-screen quad ──────────────────────────────────────────────────── */

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  function draw(prog, target, uniforms) {
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.w, target.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    let unit = 0;
    for (const [k, v] of Object.entries(uniforms)) {
      const loc = prog.u[k];
      if (loc == null) continue;
      if (typeof v === 'number') {
        gl.uniform1f(loc, v);
      } else if (v && v.tex !== undefined) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, v.tex);
        gl.uniform1i(loc, unit++);
      } else if (Array.isArray(v)) {
        if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
        else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
      }
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /* ── FBO helpers ───────────────────────────────────────────────────────── */

  function fbo(w, h, filter) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, FTYPE, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return ok ? { tex, fbo: fb, w, h } : null;
  }

  function doubleFBO(w, h, filter) {
    let a = fbo(w, h, filter), b = fbo(w, h, filter);
    if (!a || !b) return null;
    return {
      get read()  { return a; },
      get write() { return b; },
      swap()      { const t = a; a = b; b = t; }
    };
  }

  /* ── 1D gradient palette ───────────────────────────────────────────────── */

  const GRAD_STOPS = [
    [0.00, [0x2E, 0x5B, 0xFF]],
    [0.18, [0x00, 0x33, 0x99]],
    [0.38, [0x00, 0x12, 0x33]],
    [0.50, [0x00, 0x00, 0x00]],
    [0.62, [0x2A, 0x09, 0x04]],
    [0.78, [0xB8, 0x47, 0x2E]],
    [0.90, [0xFF, 0x6A, 0x2C]],
    [1.00, [0xF5, 0xB2, 0x74]],
  ];

  function sampleGrad(t) {
    t = Math.max(0, Math.min(1, t));
    let s0 = GRAD_STOPS[0], s1 = GRAD_STOPS[GRAD_STOPS.length - 1];
    for (let j = 0; j < GRAD_STOPS.length - 1; j++) {
      if (t >= GRAD_STOPS[j][0] && t <= GRAD_STOPS[j + 1][0]) {
        s0 = GRAD_STOPS[j]; s1 = GRAD_STOPS[j + 1]; break;
      }
    }
    const span = s1[0] - s0[0];
    const f = span < 0.0001 ? 0 : (t - s0[0]) / span;
    return [
      (s0[1][0] + (s1[1][0] - s0[1][0]) * f) / 255,
      (s0[1][1] + (s1[1][1] - s0[1][1]) * f) / 255,
      (s0[1][2] + (s1[1][2] - s0[1][2]) * f) / 255,
    ];
  }

  /* ── Config ────────────────────────────────────────────────────────────── */

  const SIM_SCALE    = 0.35;
  const JACOBI_ITERS = 20;
  const VEL_DISS     = 0.978;
  const DYE_DISS     = 0.991;

  const COLOR_CHANGE = 0.0008;
  const TIME_OFFSET  = Math.random() * 20000;

  /* START_DYE: large plume that builds the initial mass */
  const START_DURATION = 6000;
  const START_OPACITY  = 0.28;  /* bounded mix — can't blow out, push harder */
  const START_RADIUS   = 0.42;
  const START_VEL_R    = 0.45;

  /* FAKE_POINTER: movement-driven, always-on maintenance emitter */
  const AUTO_RADIUS        = 0.32;
  const AUTO_VEL_R         = 0.36;
  const AUTO_VEL_SCALE     = 0.16;
  const AUTO_OPACITY_BASE  = 0.035; /* visible baseline at rest */
  const AUTO_OPACITY_MAX   = 0.09;  /* boosted on movement */

  /* Mouse */
  const MOUSE_RADIUS    = 0.09;
  const MOUSE_VEL_R     = 0.12;
  const MOUSE_VEL_SCALE = 0.9;
  const MOUSE_OPACITY   = 0.22;

  let simW, simH, velFBO, dyeFBO, divgFBO, presFBO;

  function initSim() {
    simW    = Math.max(1, Math.floor(canvas.width  * SIM_SCALE));
    simH    = Math.max(1, Math.floor(canvas.height * SIM_SCALE));
    velFBO  = doubleFBO(simW, simH, FILTER);
    dyeFBO  = doubleFBO(simW, simH, FILTER);
    divgFBO = fbo(simW, simH, gl.NEAREST);
    presFBO = doubleFBO(simW, simH, gl.NEAREST);
    if (!velFBO || !dyeFBO || !divgFBO || !presFBO) hero.classList.add('no-webgl');
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.max(1, Math.floor(hero.clientWidth  * dpr));
    canvas.height = Math.max(1, Math.floor(hero.clientHeight * dpr));
    initSim();
  }
  resize();
  new ResizeObserver(resize).observe(hero);

  /* ── Splat helpers ─────────────────────────────────────────────────────── */

  const asp = () => simW / simH;

  function splatDye(x, y, rgb, opacity, radius) {
    draw(pDyeSplat, dyeFBO.write, {
      uTarget: dyeFBO.read,
      uPoint:   [x, y],
      uColor:   rgb,
      uOpacity: opacity,
      uRadius:  radius,
      uAspect:  asp(),
    });
    dyeFBO.swap();
  }

  function splatVel(x, y, vx, vy, radius) {
    draw(pVelSplat, velFBO.write, {
      uTarget:   velFBO.read,
      uPoint:    [x, y],
      uVelocity: [vx, vy],
      uRadius:   radius,
      uAspect:   asp(),
    });
    velFBO.swap();
  }

  /* ── Autonomous emitters ───────────────────────────────────────────────── */

  let prevAutoX = null, prevAutoY = null;
  let prevMovLen = 0;

  function stepAuto(timeMs, dt) {
    /* Normalise opacity to 60 fps so accumulation rate is frame-rate independent.
       Without this, a 120 Hz browser applies 2× more mix() ops per second → 2× faster saturation. */
    const dtScale = Math.min(dt * 60.0, 2.0);

    const gradC = (Math.cos(timeMs * COLOR_CHANGE) + 1) * 0.5;
    const rgb   = sampleGrad(gradC);
    const t     = (timeMs + TIME_OFFSET) * 0.000125;
    const dim   = simW > simH ? 0.35 : 0.50;

    /* ── Phase 1: START_DYE — large plume that fades out ── */
    if (timeMs < START_DURATION) {
      /* Exponential fade: full at t=0, ~0 at t=START_DURATION */
      const fade = Math.exp(-4.0 * timeMs / START_DURATION);
      const op   = START_OPACITY * fade * dtScale;

      /* Slow drift position for the start dye */
      const sx = 0.5 + Math.sin(t * 0.3) * 0.25;
      const sy = 0.5 + Math.cos(t * 0.2) * 0.18 / asp();
      splatDye(sx, sy, rgb, op, START_RADIUS);
      splatVel(sx, sy, Math.sin(t * 0.7) * 0.08, Math.cos(t * 0.5) * 0.08, START_VEL_R);
    }

    /* ── Phase 2: FAKE_POINTER — noise emitter, opacity from movement ── */
    const x = 0.5 + Math.sin(t * 0.7) * dim;
    const y = 0.5 + Math.cos(t * 0.9) * dim / asp();

    let movLen = 0;
    if (prevAutoX !== null) {
      movLen = Math.hypot(x - prevAutoX, y - prevAutoY);
    }
    /* Smooth movement signal */
    prevMovLen = prevMovLen * 0.85 + movLen * 0.15;

    const autoOp = (AUTO_OPACITY_BASE + Math.min(prevMovLen * 80, AUTO_OPACITY_MAX)) * dtScale;
    splatDye(x, y, rgb, autoOp, AUTO_RADIUS);

    if (prevAutoX !== null) {
      const vx = ((x - prevAutoX) / dt) * AUTO_VEL_SCALE;
      const vy = ((y - prevAutoY) / dt) * AUTO_VEL_SCALE;
      splatVel(x, y, vx, vy, AUTO_VEL_R);
    }
    prevAutoX = x;
    prevAutoY = y;
  }

  /* ── Mouse ─────────────────────────────────────────────────────────────── */

  let mOn = false;
  let mPrev = null, mCurr = { x: 0.5, y: 0.5 };
  let mDx = 0, mDy = 0;

  hero.addEventListener('pointermove', (e) => {
    const r  = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1.0 - (e.clientY - r.top) / r.height;
    if (mPrev) { mDx = nx - mPrev.x; mDy = ny - mPrev.y; }
    mCurr = { x: nx, y: ny };
    mOn   = true;
    mPrev = { x: nx, y: ny };
  });
  hero.addEventListener('pointerleave', () => { mOn = false; mPrev = null; });

  function stepMouse(timeMs, dt) {
    if (!mOn) return;
    const speed = Math.hypot(mDx, mDy);
    if (speed < 0.0002) return;

    const dtScale = Math.min(dt * 60.0, 2.0);
    const c   = (Math.cos(timeMs * COLOR_CHANGE) + 1) * 0.5;
    const rgb = sampleGrad(c);

    /* Anisotropic ribbon: 4 samples distributed along the drag direction.
       Each sample uses a smaller radius than the old single blob, and the
       opacity tapers toward the tail — produces a soft elongated veil. */
    const N     = 4;
    const tailR = MOUSE_RADIUS * 0.55;  /* narrower than single blob */
    for (let i = 0; i < N; i++) {
      const t   = i / (N - 1);          /* 0 = tail, 1 = tip */
      const sx  = mCurr.x - mDx * (1 - t);
      const sy  = mCurr.y - mDy * (1 - t);
      const op  = MOUSE_OPACITY * (0.3 + 0.7 * t) * dtScale;
      splatDye(sx, sy, rgb, op, tailR);
    }

    splatVel(
      mCurr.x, mCurr.y,
      (mDx / dt) * MOUSE_VEL_SCALE,
      (mDy / dt) * MOUSE_VEL_SCALE,
      MOUSE_VEL_R
    );
    mDx = 0; mDy = 0;
  }

  /* ── Simulation step ───────────────────────────────────────────────────── */

  function step(dt, timeMs) {
    const ts = [1.0 / simW, 1.0 / simH];

    stepAuto(timeMs, dt);
    stepMouse(timeMs, dt);

    draw(pAdvect, velFBO.write, {
      uVelocity: velFBO.read, uSource: velFBO.read, uDt: dt, uDissipation: VEL_DISS
    });
    velFBO.swap();

    draw(pAdvect, dyeFBO.write, {
      uVelocity: velFBO.read, uSource: dyeFBO.read, uDt: dt, uDissipation: DYE_DISS
    });
    dyeFBO.swap();

    draw(pDiverg, divgFBO, { uVelocity: velFBO.read, uTexelSize: ts });

    for (let i = 0; i < JACOBI_ITERS; i++) {
      draw(pPressure, presFBO.write, {
        uPressure: presFBO.read, uDivergence: divgFBO, uTexelSize: ts
      });
      presFBO.swap();
    }

    draw(pGradSub, velFBO.write, {
      uPressure: presFBO.read, uVelocity: velFBO.read, uTexelSize: ts
    });
    velFBO.swap();
  }

  /* ── Render loop ───────────────────────────────────────────────────────── */

  let raf = null, lastT = null;
  const t0 = performance.now();

  function frame(now) {
    const timeMs = now - t0;
    const dt = lastT !== null ? Math.min((now - lastT) / 1000, 0.05) : 0.016;
    lastT = now;

    step(dt, timeMs);

    draw(pDisplay, null, {
      uDye:  dyeFBO.read,
      uTime: timeMs / 1000,
    });

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; lastT = null; }
    else if (!raf) { raf = requestAnimationFrame(frame); }
  });
})();
