(function () {
  if (window.__pwInit) return;
  window.__pwInit = true;

  const outer  = document.getElementById('pw_long');
  const sticky = document.getElementById('pw-sticky');
  const canvas = document.getElementById('pw-canvas');
  const ctx    = canvas.getContext('2d');

  /* ── Config ────────────────────────────────────────────── */
  const N_MIN = 4, N_MAX = 12;
  const C_LINE = 'white', C_AXLE = 'white', C_FILL = 'transparent';
  const MOBILE_BP = 767, TABLET_BP = 991;
  const MARGIN_X = 0, BOTTOM_MARGIN = 360, VERTICAL_POS = 0.50;
  const SMOOTHING = 0.2;
  const STOP_EPSILON = 0.0005;
  const SCROLL_OFFSET_DESKTOP = 0.25, SCROLL_OFFSET_MOBILE = 0;
  const PHASE2 = 0.3;

  /* ── State ─────────────────────────────────────────────── */
  let W, H, R, dpr = 1;
  let isMobile = false, isTabletOrMobile = false;
  let targetProgress = 0, progress = 0;
  let rafId = null;
  let scrollDirty = false;
  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Cached geometry — recomputed only on resize */
  let scrollable = 0, offsetFrac = 0, xLeft = 0, xRight = 0, tEntry = 0;
  let vertsCache = new Float32Array(0);

  const easeInOut = t => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── Precompute ideal-vertex tables (constant per n) ───── */
  const idealCache = {};
  function idealVerts(n, r) {
    let base = idealCache[n];
    if (!base) {
      base = new Float64Array(n * 2);
      for (let i = 0; i < n; i++) {
        const a = Math.PI / 2 + (2 * Math.PI * i) / n;
        base[i * 2] = Math.cos(a);
        base[i * 2 + 1] = Math.sin(a);
      }
      idealCache[n] = base;
    }
    const v = new Float64Array(n * 2);
    for (let i = 0; i < n * 2; i++) v[i] = base[i] * r;
    return v;
  }

  function alignedIdealVerts(n, r, refx, refy) {
    const raw = idealVerts(n, r);
    const refAngle = Math.atan2(refy, refx);
    let best = 0, bestDiff = Infinity;
    for (let o = 0; o < n; o++) {
      const a = Math.atan2(raw[o * 2 + 1], raw[o * 2]);
      let d = Math.abs(a - refAngle);
      if (d > Math.PI) d = 2 * Math.PI - d;
      if (d < bestDiff) { bestDiff = d; best = o; }
    }
    const out = new Float64Array(n * 2);
    for (let i = 0; i < n; i++) {
      const s = ((i + best) % n) * 2;
      out[i * 2] = raw[s]; out[i * 2 + 1] = raw[s + 1];
    }
    return out;
  }

  /* Returns Float64Array [x0,y0,x1,y1,...] of length 2*count */
  function continuousVerts(nf, r) {
    const nLo = Math.floor(nf);
    const frac = nf - nLo;
    if (frac < 1e-9) return idealVerts(nLo, r);

    const nHi = nLo + 1;
    const base = idealVerts(nLo, r);
    const start = new Float64Array(nHi * 2);
    // insert midpoint of edge 0-1 at index 1
    start[0] = base[0]; start[1] = base[1];
    start[2] = (base[0] + base[2]) / 2;
    start[3] = (base[1] + base[3]) / 2;
    for (let i = 2; i < nHi; i++) {
      start[i * 2] = base[(i - 1) * 2];
      start[i * 2 + 1] = base[(i - 1) * 2 + 1];
    }
    const target = alignedIdealVerts(nHi, r, base[0], base[1]);
    const out = new Float64Array(nHi * 2);
    for (let i = 0; i < nHi * 2; i++) out[i] = lerp(start[i], target[i], frac);
    return out;
  }

  /* ── Resize — DPR-aware, caches scroll geometry ────────── */
  function resize() {
    dpr = window.devicePixelRatio || 1;
    const cssW = sticky.clientWidth || window.innerWidth;
    const cssH = sticky.clientHeight || window.innerHeight;

    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width  = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap  = 'round';

    W = cssW; H = cssH;
    isMobile = W <= MOBILE_BP;
    isTabletOrMobile = W <= TABLET_BP;

    const RADIUS_SCALE = isMobile ? 0.13 * 1.2 : 0.13;
    R = Math.min(W, H) * RADIUS_SCALE;

    // cache scroll-derived constants
    scrollable = Math.max(0, outer.offsetHeight - window.innerHeight);
    offsetFrac = isMobile ? SCROLL_OFFSET_MOBILE : SCROLL_OFFSET_DESKTOP;
    // On mobile the whole shape is visible just inside the left edge at the
    // start (center one radius in); desktop keeps its roll-in entrance.
    xLeft  = isMobile ? R : -R;
    xRight = W - MARGIN_X - R;
    // Even pacing on mobile: small fixed head-start before the morph begins,
    // so shape-change spreads evenly across the scroll instead of cramming
    // into the back half.
    tEntry = isMobile ? 0.05 : (2 * R + MARGIN_X) / (xRight - xLeft);

    updateTargetProgress();
    render(progress);
  }

  /* ── Scroll → targetProgress ───────────────────────────── */
  function updateTargetProgress() {
    const rect = outer.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top);
    const rawProgress = scrollable > 0 ? Math.min(1, scrolled / scrollable) : 0;
    targetProgress = Math.max(0, (rawProgress - offsetFrac) / (1 - offsetFrac));

    if (prefersReduced) { progress = targetProgress; render(progress); return; }
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  function onScroll() {
    if (scrollDirty) return;
    scrollDirty = true;
    requestAnimationFrame(() => { scrollDirty = false; updateTargetProgress(); });
  }

  /* ── Animation loop ────────────────────────────────────── */
  function animate() {
    progress = lerp(progress, targetProgress, SMOOTHING);
    if (Math.abs(targetProgress - progress) < STOP_EPSILON) progress = targetProgress;

    render(progress);

    rafId = Math.abs(targetProgress - progress) >= STOP_EPSILON
      ? requestAnimationFrame(animate)
      : null;
  }

  /* ── Render ────────────────────────────────────────────── */
  function render(p) {
    const t = p < 0 ? 0 : p > 1 ? 1 : p;
    const span = xRight - xLeft;
    const wheelX = lerp(xLeft, xRight, t);

    const tMorphRaw = Math.max(0, (t - tEntry) / (1 - tEntry));
    const tMorph = easeInOut(Math.min(1, tMorphRaw));

    const tPoly = Math.min(tMorph / PHASE2, 1);
    const tCirc = Math.max(0, (tMorph - PHASE2) / (1 - PHASE2));
    const circT = easeInOut(tCirc);

    const nf = N_MIN + tPoly * (N_MAX - N_MIN);
    const nLo = Math.floor(nf);
    const nHi = Math.min(N_MAX, nLo + 1);
    const frac = nf - nLo;

    const sLo = 2 * R * Math.sin(Math.PI / nLo);
    const sHi = 2 * R * Math.sin(Math.PI / nHi);
    const s = lerp(sLo, sHi, frac);

    const aLo = R * Math.cos(Math.PI / nLo);
    const aHi = R * Math.cos(Math.PI / nHi);
    const a = lerp(aLo, aHi, frac);

    const bottomMargin = isMobile ? 340 : BOTTOM_MARGIN;
    const roadPeakY = (H - bottomMargin) * VERTICAL_POS + a;
    const axleY = roadPeakY - (a + (R - a) * circT);

    ctx.clearRect(0, 0, W, H);

    /* ── road (catenary arches) ── */
    const firstPeakX = xLeft + Math.ceil((-xLeft - s) / s) * s;
    const numArches  = Math.ceil((W + s * 2) / s) + 2;
    const steps = Math.max(48, Math.round(s));
    const invA = 1 / a;
    const oneMinusCirc = 1 - circT;

    ctx.beginPath();
    for (let ai = 0; ai < numArches; ai++) {
      const peakX = firstPeakX + ai * s;
      const archLeft = peakX - s / 2;
      for (let si = 0; si <= steps; si++) {
        const frac2 = si / steps;
        const lx = archLeft + frac2 * s;
        const localX = lx - peakX;
        const catenaryY = roadPeakY + a * Math.cosh(localX * invA) - a;
        const worldY = catenaryY * oneMinusCirc + roadPeakY * circT;
        if (si === 0) ctx.moveTo(lx, worldY);
        else ctx.lineTo(lx, worldY);
      }
    }
    ctx.strokeStyle = C_LINE;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* ── rolling shape ── */
    const d = t * span;
    const rotation = (d / s) * (2 * Math.PI / nf) - Math.PI / nf;
    const verts = continuousVerts(nf, R);
    const vCount = verts.length / 2;

    ctx.save();
    ctx.translate(wheelX, axleY);
    ctx.rotate(rotation);
    ctx.beginPath();

    if (circT < 0.999) {
      const STEPS = isMobile ? 90 : 360;
      const per = vCount / STEPS;
      for (let i = 0; i <= STEPS; i++) {
        const vi = i * per;
        const vi0 = Math.floor(vi) % vCount;
        const vi1 = (vi0 + 1) % vCount;
        const vf = vi - Math.floor(vi);
        const px = lerp(verts[vi0 * 2], verts[vi1 * 2], vf);
        const py = lerp(verts[vi0 * 2 + 1], verts[vi1 * 2 + 1], vf);
        const pr = Math.sqrt(px * px + py * py);
        const scale = lerp(pr, R, circT) / pr;
        const bx = px * scale, by = py * scale;
        if (i === 0) ctx.moveTo(bx, by);
        else ctx.lineTo(bx, by);
      }
      ctx.closePath();
    } else {
      ctx.arc(0, 0, R, 0, Math.PI * 2);
    }

    if (!isTabletOrMobile) { ctx.fillStyle = C_FILL; ctx.fill(); }
    ctx.strokeStyle = C_LINE;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = C_LINE;
    ctx.fill();
    ctx.restore();

    /* ── axle guide ── */
    ctx.save();
    ctx.strokeStyle = C_AXLE;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    ctx.moveTo(0, axleY);
    ctx.lineTo(W, axleY);
    ctx.stroke();
    ctx.restore();
  }

  /* ── Wiring ────────────────────────────────────────────── */
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  resize();
})();
