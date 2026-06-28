/* AXIS — System card fluid effect
   Lightweight 2D-canvas fluid gradient per story card.
   Same Axis palette as the hero. Renders only while card is hovered.
   Approach: 64×96 noise-displaced gradient → upscaled + blurred → atmospheric veil.
*/
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Axis gradient palette (same as hero) ────────────────────────────── */

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

  /* ── Card fluid class ────────────────────────────────────────────────── */

  const OFF_W = 64;
  const OFF_H = 96;

  /* Precomputed row/col buffers — reused across all renders */
  const rowDU = new Float32Array(OFF_H);
  const rowDV = new Float32Array(OFF_H);
  const colDU = new Float32Array(OFF_W);
  const colDV = new Float32Array(OFF_W);

  class CardFluid {
    constructor(canvas, card) {
      this.canvas = canvas;
      this.ctx    = canvas.getContext('2d');
      this.card   = card;

      /* Low-res offscreen pixel buffer */
      this.off    = document.createElement('canvas');
      this.off.width  = OFF_W;
      this.off.height = OFF_H;
      this.offCtx = this.off.getContext('2d');
      this.img    = this.offCtx.createImageData(OFF_W, OFF_H);

      /* Stagger each card's animation phase so they don't all look identical */
      this.t      = Math.random() * 600;
      this.mouseX = 0.5;
      this.mouseY = 0.5;
      this.raf    = null;
      this.lastTs = null;
      this.active = false;

      card.addEventListener('pointerenter', () => {
        this.active = true;
        if (!this.raf) this._start();
      });
      card.addEventListener('pointerleave', () => {
        this.active = false;
        /* Loop continues until the CSS slide-out transition finishes (~560ms) */
        setTimeout(() => {
          if (!this.active && this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          }
        }, 580);
      });
      card.addEventListener('pointermove', (e) => {
        const r    = card.getBoundingClientRect();
        this.mouseX = (e.clientX - r.left) / r.width;
        this.mouseY = (e.clientY - r.top)  / r.height;
      });
    }

    _start() {
      this.lastTs = performance.now();
      const loop  = (now) => {
        const dt   = Math.min((now - this.lastTs) / 1000, 0.05);
        this.lastTs = now;
        this.t     += dt;
        this._render();
        this.raf   = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }

    _render() {
      const d  = this.img.data;
      const t  = this.t;
      const mx = this.mouseX;
      const my = this.mouseY;

      /* Global hue position — same COLOR_CHANGE rate as the hero */
      const gradC = (Math.cos(t * 0.8) + 1) * 0.5;

      /* Precompute per-row and per-column displacement (reduces sin/cos count ~97%) */
      for (let iy = 0; iy < OFF_H; iy++) {
        const ny   = iy / (OFF_H - 1);
        rowDU[iy]  = Math.sin(ny * 2.1 + t * 0.31) * 0.30
                   + Math.cos(ny * 0.9 + t * 0.17) * 0.12;
        rowDV[iy]  = Math.cos(ny * 1.4 + t * 0.19) * 0.13;
      }
      for (let ix = 0; ix < OFF_W; ix++) {
        const nx   = ix / (OFF_W - 1);
        colDU[ix]  = Math.cos(nx * 0.8 + t * 0.11) * 0.07;
        colDV[ix]  = Math.cos(nx * 1.8 + t * 0.25) * 0.28
                   + Math.sin(nx * 1.1 + t * 0.22) * 0.10;
      }

      const mdu = (mx - 0.5) * 0.20;
      const mdv = (my - 0.5) * 0.15;

      for (let iy = 0; iy < OFF_H; iy++) {
        const ny  = iy / (OFF_H - 1);
        const rdu = rowDU[iy], rdv = rowDV[iy];

        for (let ix = 0; ix < OFF_W; ix++) {
          const nx = ix / (OFF_W - 1);
          const u  = nx + rdu + colDU[ix] + mdu;
          const v  = ny + rdv + colDV[ix] + mdv;

          /* Palette coordinate — smooth, bounded, time-drifting */
          let pT = 0.5
            + Math.sin(u * 1.6 + v * 1.2 + t * 0.35) * 0.42
            + (gradC - 0.5) * 0.18;
          pT = Math.max(0, Math.min(1, pT));

          const [r, g, b] = sampleGrad(pT);

          /* Soft luminosity — prevents flat solid-color look */
          const lum = 0.38 + Math.sin(u * 2.5 + v * 1.7 + t * 0.28) * 0.34;

          /* Vignette: dark edges, lit centre */
          const vx  = nx - 0.5, vy = ny - 0.5;
          const vig = Math.max(0, 1 - (vx * vx + vy * vy) * 3.8);

          const f   = Math.max(0, Math.min(1, lum * vig));

          const idx  = (iy * OFF_W + ix) * 4;
          d[idx]     = Math.round(r * 255);
          d[idx + 1] = Math.round(g * 255);
          d[idx + 2] = Math.round(b * 255);
          d[idx + 3] = Math.round(Math.min(1, f * 1.4) * 255); /* alpha = luminance */
        }
      }

      this.offCtx.putImageData(this.img, 0, 0);

      /* Scale low-res buffer to card size with a heavy blur → atmospheric veil */
      const W = this.canvas.width;
      const H = this.canvas.height;
      const p = 18; /* bleed padding to hide blur edge artifacts */

      this.ctx.clearRect(0, 0, W, H);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';

      /* ctx.filter is widely supported; older Safari falls back to smooth upscale only */
      if (typeof this.ctx.filter !== 'undefined') {
        this.ctx.filter = 'blur(13px)';
      }
      this.ctx.drawImage(this.off, -p, -p, W + p * 2, H + p * 2);
      if (typeof this.ctx.filter !== 'undefined') {
        this.ctx.filter = 'none';
      }
    }
  }

  /* ── Mount on each story card ────────────────────────────────────────── */

  document.querySelectorAll('.story').forEach(card => {
    const bg = card.querySelector('.story__bg');
    if (!bg) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'story__canvas';
    bg.appendChild(canvas);

    function resize() {
      canvas.width  = Math.max(1, card.offsetWidth);
      canvas.height = Math.max(1, card.offsetHeight);
    }
    resize();
    new ResizeObserver(resize).observe(card);

    new CardFluid(canvas, card);
  });
})();
