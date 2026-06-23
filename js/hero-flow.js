/* AXIS — Hero flow  (Liquid Gradient · WebGL)
   Negro dominante · azules izquierda · naranjas derecha
   Blanco solo en bordes/inferior · sin rosa/magenta
*/
(function () {
  const canvas = document.getElementById("heroFlow");
  if (!canvas) return;
  const hero   = document.getElementById("hero");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let gl = null;
  if (!reduce) {
    try {
      gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    } catch (e) {}
  }
  if (!gl) { hero.classList.add("no-webgl"); return; }

  const VS = `attribute vec2 p; varying vec2 vUv;
void main(){
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

  const FS = `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uReveal;
uniform float uPress;

/* Paleta Axis — SOLO azules y naranjas */
vec3 BLUES[3];
vec3 ORNG[3];

float grain(vec2 uv, float t) {
  vec2 g = uv * uResolution * 0.5;
  return fract(sin(dot(g + t, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
}

void main() {
  /* Definir paleta (GLSL 1.0 no soporta init de arrays) */
  BLUES[0] = vec3(0.000, 0.251, 0.769); /* #0040C4 */
  BLUES[1] = vec3(0.000, 0.369, 0.878); /* #005EE0 */
  BLUES[2] = vec3(0.000, 0.200, 0.600); /* #003399 */
  ORNG[0]  = vec3(0.847, 0.361, 0.227); /* #D85C3A */
  ORNG[1]  = vec3(0.878, 0.408, 0.251); /* #E06840 */
  ORNG[2]  = vec3(0.722, 0.278, 0.180); /* #B8472E */

  vec3 DN = vec3(0.004, 0.010, 0.028); /* dark navy base */

  vec2 uv = vUv;

  /* ── Ripple en cursor ────────────────────────── */
  vec2  dm   = uv - uMouse;
  float md   = length(dm);
  float rip  = sin(md * 22.0 - uTime * 3.2) * 0.028 * uReveal / (md * 4.0 + 0.6);
  float wav  = sin(md * 16.0 - uTime * 2.1) * 0.018 * uReveal / (md * 5.0 + 0.8);
  float prs  = uPress * 0.016 / (md * 6.0 + 0.9);
  float tot  = clamp(rip + wav + prs, -0.30, 0.30);
  vec2 wdir  = md > 0.001 ? normalize(dm) : vec2(0.0, 1.0);
  uv += wdir * tot;

  float t   = uTime;
  float spd = 0.36;

  /* ── 6 blobs azules — orbitan la mitad IZQUIERDA ── */
  vec3 blueCol = vec3(0.0);
  float bpos[6*2];
  /* cx, cy por blob — todos con x biasado hacia 0–0.40 */
  bpos[0]  = 0.10 + sin(t*spd*0.41)*0.18; bpos[1]  = 0.20 + cos(t*spd*0.53)*0.30;
  bpos[2]  = 0.22 + cos(t*spd*0.61)*0.20; bpos[3]  = 0.10 + sin(t*spd*0.47)*0.20;
  bpos[4]  = 0.30 + sin(t*spd*0.37)*0.22; bpos[5]  = 0.35 + cos(t*spd*0.57)*0.32;
  bpos[6]  = 0.08 + cos(t*spd*0.49)*0.12; bpos[7]  = 0.55 + sin(t*spd*0.43)*0.38;
  bpos[8]  = 0.35 + sin(t*spd*0.71)*0.18; bpos[9]  = 0.08 + cos(t*spd*0.63)*0.12;
  bpos[10] = 0.18 + cos(t*spd*0.39)*0.14; bpos[11] = 0.72 + sin(t*spd*0.59)*0.28;

  for (int i = 0; i < 6; i++) {
    vec2 bc   = vec2(bpos[i*2], bpos[i*2+1]);
    float d   = length(uv - bc);
    float inf  = 1.0 - smoothstep(0.0, 0.60, d);
    float anim = 0.45 + 0.30 * sin(t*spd*float(i)*0.17 + float(i));
    blueCol += BLUES[int(mod(float(i), 3.0))] * inf * anim * 0.42;
  }

  /* ── 6 blobs naranjas — orbitan la mitad DERECHA ── */
  vec3 orngCol = vec3(0.0);
  float opos[6*2];
  opos[0]  = 0.90 + sin(t*spd*0.43)*0.18; opos[1]  = 0.20 + cos(t*spd*0.51)*0.30;
  opos[2]  = 0.78 + cos(t*spd*0.59)*0.20; opos[3]  = 0.10 + sin(t*spd*0.45)*0.20;
  opos[4]  = 0.70 + sin(t*spd*0.35)*0.22; opos[5]  = 0.35 + cos(t*spd*0.55)*0.32;
  opos[6]  = 0.92 + cos(t*spd*0.47)*0.08; opos[7]  = 0.55 + sin(t*spd*0.41)*0.38;
  opos[8]  = 0.65 + sin(t*spd*0.69)*0.18; opos[9]  = 0.08 + cos(t*spd*0.61)*0.12;
  opos[10] = 0.82 + cos(t*spd*0.37)*0.14; opos[11] = 0.72 + sin(t*spd*0.57)*0.28;

  for (int i = 0; i < 6; i++) {
    vec2 oc   = vec2(opos[i*2], opos[i*2+1]);
    float d   = length(uv - oc);
    float inf  = 1.0 - smoothstep(0.0, 0.60, d);
    float anim = 0.45 + 0.30 * cos(t*spd*float(i)*0.17 + float(i));
    orngCol += ORNG[int(mod(float(i), 3.0))] * inf * anim * 0.42;
  }

  vec3 color = blueCol + orngCol;

  /* ── Cap antes de saturar: evita blanco en centro ─── */
  color = min(color, vec3(0.88));

  /* ── Vignette inverso: centro oscuro, bordes luminosos ─── */
  float cx    = length(uv - vec2(0.5, 0.45));
  float vig   = smoothstep(0.10, 0.75, cx);       /* 0=center, 1=edges */
  color *= (0.30 + 0.70 * vig);

  /* ── Glow de borde inferior (warm white) ──────────── */
  float bEdge = smoothstep(0.60, 1.0, uv.y);
  color += vec3(0.55, 0.45, 0.38) * bEdge * 0.52;

  /* ── Glow de borde izquierdo (azul) ──────────────── */
  float lEdge = smoothstep(0.25, 0.0, uv.x);
  color += BLUES[0] * lEdge * 0.45;

  /* ── Glow de borde derecho (naranja) ─────────────── */
  float rEdge = smoothstep(0.75, 1.0, uv.x);
  color += ORNG[0] * rEdge * 0.42;

  /* ── Gamma Framer (pow 0.92) ─────────────────────── */
  color = pow(clamp(color, 0.0, 1.0), vec3(0.92));

  /* ── Mix hacia dark navy: negro domina el centro ─── */
  float brightness = dot(color, vec3(0.299, 0.587, 0.114));
  float mixF = max(brightness * 0.95, 0.18) * (0.72 + uReveal * 0.28);
  color = mix(DN, color, mixF);

  /* ── Grain ───────────────────────────────────────── */
  color += grain(vUv, uTime) * 0.018;

  /* ── Press brightening ───────────────────────────── */
  color = mix(color, min(color * 1.30, vec3(1.0)), uPress);

  gl_FragColor = vec4(clamp(color, vec3(0.0), vec3(1.0)), 1.0);
}`.trim();

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[axis hero-flow]", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER,   VS);
  const fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { hero.classList.add("no-webgl"); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[axis hero-flow]", gl.getProgramInfoLog(prog));
    hero.classList.add("no-webgl"); return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes    = gl.getUniformLocation(prog, "uResolution");
  const uTime   = gl.getUniformLocation(prog, "uTime");
  const uMouse  = gl.getUniformLocation(prog, "uMouse");
  const uReveal = gl.getUniformLocation(prog, "uReveal");
  const uPress  = gl.getUniformLocation(prog, "uPress");

  function resize() {
    const dpr   = Math.min(window.devicePixelRatio || 1, 1.5);
    const scale = 0.55;
    canvas.width  = Math.max(1, Math.floor(hero.clientWidth  * dpr * scale));
    canvas.height = Math.max(1, Math.floor(hero.clientHeight * dpr * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  let tmx = 0.5, tmy = 0.5, mx = 0.5, my = 0.5;
  let target = 0, reveal = 0;
  let ptarget = 0, press = 0;
  let raf = null;
  const start = performance.now();

  function frame(now) {
    mx     += (tmx    - mx)     * 0.06;
    my     += (tmy    - my)     * 0.06;
    reveal += (target - reveal) * 0.05;
    press  += (ptarget - press) * 0.10;

    gl.uniform2f(uRes,    canvas.width, canvas.height);
    gl.uniform1f(uTime,   (now - start) / 1000);
    gl.uniform2f(uMouse,  mx, my);
    gl.uniform1f(uReveal, reveal);
    gl.uniform1f(uPress,  press);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    else if (!raf)       { raf = requestAnimationFrame(frame); }
  });

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tmx = (e.clientX - r.left) / r.width;
    tmy = (e.clientY - r.top)  / r.height;
    target = 1;
  });
  hero.addEventListener("pointerleave", () => { target  = 0; });
  hero.addEventListener("pointerdown",  () => { ptarget = 1; });
  window.addEventListener("pointerup",  () => { ptarget = 0; });
})();
