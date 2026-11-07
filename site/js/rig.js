// Живой Серпу: данные хвоста, ядро рига и «жизнь». Взято из Серпу/serpu_live.html без изменений.
const TAIL={"pts": [[632.0, 646.0], [633.95, 645.57], [635.9, 645.13], [637.86, 644.7], [639.81, 644.26], [641.76, 643.83], [643.71, 643.4], [645.67, 642.96], [647.62, 642.53], [649.57, 642.1], [651.52, 641.66], [653.48, 641.23], [655.43, 640.79], [657.38, 640.36], [659.33, 639.93], [661.29, 639.49], [663.24, 639.06], [665.19, 638.62], [667.14, 638.19], [669.07, 637.67], [670.98, 637.07], [672.89, 636.47], [674.8, 635.88], [676.71, 635.28], [678.62, 634.68], [680.52, 634.09], [682.43, 633.49], [684.34, 632.89], [686.25, 632.3], [688.16, 631.7], [690.07, 631.1], [691.98, 630.51], [693.89, 629.91], [695.8, 629.31], [697.71, 628.72], [699.61, 628.12], [701.33, 627.11], [702.99, 626.01], [704.66, 624.9], [706.32, 623.79], [707.98, 622.68], [709.65, 621.57], [711.31, 620.46], [712.98, 619.35], [714.64, 618.24], [716.3, 617.13], [717.97, 616.02], [719.63, 614.91], [721.3, 613.8], [722.96, 612.69], [724.47, 611.41], [725.72, 609.85], [726.97, 608.29], [728.22, 606.73], [729.47, 605.17], [730.72, 603.6], [731.97, 602.04], [733.22, 600.48], [734.46, 598.92], [735.71, 597.36], [736.96, 595.8], [738.21, 594.23], [739.46, 592.67], [740.41, 590.94], [741.13, 589.07], [741.86, 587.21], [742.58, 585.34], [743.3, 583.48], [744.03, 581.61], [744.75, 579.75], [745.47, 577.89], [746.2, 576.02], [746.92, 574.16], [747.64, 572.29], [748.37, 570.43], [749.09, 568.56], [749.81, 566.7], [750.41, 564.79], [751.07, 562.9], [751.81, 561.05], [752.57, 559.19], [753.31, 557.34], [754.02, 555.47], [754.73, 553.6], [755.44, 551.73], [756.13, 549.85], [756.76, 547.95], [757.25, 546.01], [757.7, 544.07], [758.16, 542.12], [758.62, 540.17], [759.07, 538.22], [759.53, 536.28], [759.99, 534.33], [760.45, 532.39], [760.91, 530.44], [761.37, 528.49], [761.83, 526.55], [762.29, 524.6], [762.75, 522.65], [763.2, 520.71], [763.66, 518.76], [764.11, 516.81], [764.56, 514.86], [765.01, 512.91], [765.45, 510.96], [765.89, 509.01], [766.33, 507.06], [766.8, 505.12], [767.37, 503.2], [768.02, 501.31], [768.76, 499.45], [769.58, 497.63], [770.49, 495.85], [771.49, 494.11], [772.57, 492.43], [773.73, 490.8], [774.96, 489.22], [776.27, 487.71], [777.65, 486.27], [779.1, 484.89], [780.61, 483.58], [782.19, 482.35], [783.83, 481.2], [785.52, 480.14], [787.26, 479.15], [789.05, 478.26], [790.88, 477.46], [792.75, 476.75], [794.65, 476.13], [796.59, 475.61], [798.54, 475.2], [800.52, 474.88], [802.5, 474.66], [804.5, 474.55], [806.5, 474.54], [808.5, 474.63], [810.49, 474.83], [812.46, 475.14], [814.42, 475.54], [816.36, 476.05], [818.26, 476.67], [820.13, 477.38], [821.95, 478.19], [823.74, 479.1], [825.46, 480.1], [827.14, 481.2], [828.75, 482.39], [830.29, 483.66], [831.76, 485.02], [833.15, 486.46], [834.45, 487.97], [835.68, 489.55], [836.81, 491.2], [837.84, 492.91], [838.78, 494.68], [839.61, 496.5], [840.34, 498.36], [840.96, 500.26], [841.46, 502.2], [841.85, 504.16], [842.13, 506.14], [842.29, 508.13], [842.33, 510.13], [842.25, 512.13], [842.04, 514.12], [841.72, 516.09], [841.28, 518.04], [840.72, 519.96], [840.05, 521.85], [839.25, 523.68], [838.35, 525.46], [837.33, 527.19], [836.21, 528.84], [834.98, 530.42], [833.66, 531.92], [832.24, 533.33], [830.73, 534.64], [829.14, 535.86], [827.48, 536.96], [825.74, 537.95], [823.94, 538.83], [822.09, 539.58], [820.19, 540.2], [818.25, 540.69]], "sK": 174.0, "L": 368.0};const MOUTH_D="M436.50,391.00C457.85,420.36 485.83,416.68 511.90,398.60C537.97,416.68 565.95,420.36 587.30,391.00";const META={"tap": {"desc": "Нажатие кнопки", "sec": 0.12}, "pill_taken": {"desc": "Приём отмечен ✔", "sec": 1.1}, "streak_up": {"desc": "Серия +1 🔥", "sec": 1.35}, "milestone": {"desc": "Рекорд / достижение 🏆", "sec": 1.95}, "reminder": {"desc": "Напоминание: пора принять 💊", "sec": 1.7}, "missed": {"desc": "Пропуск приёма (мягко, без драмы)", "sec": 1.34}, "warning": {"desc": "Осторожно / несовместимо ⚠", "sec": 0.8}, "serpu_hiss": {"desc": "Фирменное «сссп!» Серпу 🐍", "sec": 0.7}, "serpu_happy": {"desc": "Серпу радуется (хи-хи)", "sec": 0.9}, "freeze": {"desc": "Заморозка серии ❄", "sec": 1.9}, "whoosh": {"desc": "Переход между экранами", "sec": 0.4}, "scan": {"desc": "Распознаю лекарство по фото 📷", "sec": 1.3}, "confetti": {"desc": "Конфетти 🎉", "sec": 1.25}, "coin": {"desc": "Награда / очки ⭐", "sec": 0.85}};
;
// ===================== Serpu rig core: draws one pose =====================
// renderPose(p) takes plain numbers (see P0) and updates the SVG. Used by the live page and the sticker renderer.
(function () {
const $ = id => document.getElementById(id);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t;
const sstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const f2 = v => (Math.round(v * 100) / 100).toString();

const P0 = { rootX: 0, rootY: 0, rootR: 0, sq: 0, br: 0,
  hx: 0, hy: 0, hr: 0, lookX: 0, lookY: 0,
  lid: 0, lidL: null, lidR: null, tilt: 0, tiltL: null, tiltR: null,
  happy: 0, shut: 0, winkL: 0, winkR: 0, eyeS: 1, blink: 0, pupilS: 1,
  heart: 0, star: 0, eyeFxS: 1, spiral: 0, spiralRot: 0, teary: 0, tearL: -1, tearR: -1, cry: 0, cryPh: 0,
  frown: 0, open: 0, o: 0, oS: 1, wave: 0, wavePh: 0, smirk: 0, mw: 1,
  cheek: 1, blush: 0, tailA: 0.07, tailB: 0, tailPh: 0, flick: 0, tongue: 0, tgv: 1, tgWig: 0,
  tint: null, ground: 1 };

// ---------- path parsing / deformation ----------
function parse(d) { const tok = d.match(/[MCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []; const cmds = [], xy = []; let i = 0;
  while (i < tok.length) { const c = tok[i++]; if (c === 'Z' || c === 'z') { cmds.push('Z'); continue; } const n = c === 'M' ? 1 : 3; cmds.push(c);
    for (let k = 0; k < n; k++) { xy.push(+tok[i++], +tok[i++]); } } return { cmds, xy: Float64Array.from(xy) }; }
function build(cmds, xy) { let s = '', j = 0; for (const c of cmds) { if (c === 'Z') { s += 'Z'; continue; } const n = c === 'M' ? 1 : 3; s += c;
    for (let k = 0; k < n; k++) { s += f2(xy[j]) + ',' + f2(xy[j + 1]) + (k < n - 1 ? ' ' : ''); j += 2; } } return s; }
const neckPaths = [], tailPaths = [];
document.querySelectorAll('#serpu [data-def]').forEach(el => { const p = parse(el.getAttribute('d')); const o = { el, ...p, out: new Float64Array(p.xy.length) };
  (el.dataset.def === 'tail' ? tailPaths : neckPaths).push(o); });
neckPaths.forEach(o => { o.w = new Float64Array(o.xy.length / 2);
  for (let i = 0; i < o.w.length; i++) { const x = o.xy[2 * i], y = o.xy[2 * i + 1];
    o.w[i] = sstep(690, 500, y) * sstep(330, 400, x) * (1 - sstep(650, 705, x)); } });
const TP = TAIL.pts, NT = TP.length, sArr = new Float64Array(NT);
for (let i = 1; i < NT; i++) sArr[i] = sArr[i - 1] + Math.hypot(TP[i][0] - TP[i - 1][0], TP[i][1] - TP[i - 1][1]);
tailPaths.forEach(o => { const n = o.xy.length / 2; o.bi = new Int32Array(n); o.dx = new Float64Array(n); o.dy = new Float64Array(n);
  for (let j = 0; j < n; j++) { const x = o.xy[2 * j], y = o.xy[2 * j + 1]; let best = 1e18, bi = 0;
    for (let i = 0; i < NT; i++) { const dx = x - TP[i][0], dy = y - TP[i][1], dd = dx * dx + dy * dy; if (dd < best) { best = dd; bi = i; } }
    o.bi[j] = bi; o.dx[j] = x - TP[bi][0]; o.dy[j] = y - TP[bi][1]; } });
const ramp = new Float64Array(NT); for (let i = 0; i < NT; i++) ramp[i] = sstep(TAIL.sK, TAIL.sK + 50, sArr[i]) * clamp((sArr[i] - TAIL.sK) / (TAIL.L - TAIL.sK), 0, 1);
const cx_ = new Float64Array(NT), cy_ = new Float64Array(NT), beta = new Float64Array(NT);

// ---------- mouth: two halves sampled, so the cute "w" cusp stays sharp ----------
const M0 = parse(MOUTH_D).xy; // M p0 C c1 c2 p1 C c3 c4 p2
const bez = (a, b, c, d, t) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
const NS = 12, half = [[0, 2, 4, 6], [6, 8, 10, 12]].map(ix => { const pts = [];
  for (let k = 0; k <= NS; k++) { const t = k / NS; pts.push([bez(M0[ix[0]], M0[ix[1]], M0[ix[2]], M0[ix[3]], t), bez(M0[ix[0] + 1], M0[ix[1] + 1], M0[ix[2] + 1], M0[ix[3] + 1], t)]); } return pts; });
const mx0 = M0[0], mx1 = M0[12];
function crPath(pts, first) { // Catmull-Rom through pts -> cubic segments
  let s = first ? `M${f2(pts[0][0])},${f2(pts[0][1])}` : '';
  for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    s += `C${f2(p1[0] + (p2[0] - p0[0]) / 6)},${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)},${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])},${f2(p2[1])}`; }
  return s; }

// ---------- palette swap (super-gold, frozen ...) ----------
const palEls = [...document.querySelectorAll('#root [fill], #root [stroke], #ground')].filter(el => !el.closest('#fxBack,#fxMid,#fxFront,#headAcc,#faceAcc,#tears,[id^=heartEye],[id^=starEye]'))
  .map(el => ({ el, f: (el.getAttribute('fill') || '').toUpperCase(), s: (el.getAttribute('stroke') || '').toUpperCase() }));
function setPalette(map) { map = map || {}; const up = {}; for (const k in map) up[k.toUpperCase()] = map[k];
  for (const o of palEls) { if (o.f && o.f.startsWith('#')) o.el.setAttribute('fill', up[o.f] || o.f); if (o.s && o.s.startsWith('#')) o.el.setAttribute('stroke', up[o.s] || o.s); } }

// ---------- cached elements ----------
const E = {}; for (const s of ['L', 'R']) { const g = $('eye' + s); E[s] = { ex: +g.dataset.cx, ey: +g.dataset.cy, pcx: +g.dataset.pcx, pcy: +g.dataset.pcy,
  open: $('eyeOpen' + s), closed: $('closed' + s), pupil: $('pupil' + s), hl: $('hl' + s), lid: $('lid' + s), lash: $('lash' + s), spiral: $('spiral' + s),
  pool: $('pool' + s), poolHl: $('poolHl' + s), heart: $('heartEye' + s), star: $('starEye' + s), cry: $('cry' + s), cryO: $('cryO' + s), cryI: $('cryI' + s), cryD: $('cryD' + s), tear: $('tear' + s) }; }
const mLine = $('mouthLine'), mOpen = $('mouthOpen'), mClip = $('mouthOpenClip'), mO = $('mouthO'), tongueEl = $('tongue'), mTongue = $('mouthTongue');
const cheeks = [...document.querySelectorAll('.cheek')], root = $('root'), head = $('head'), face = $('face'), ground = $('ground'), blushG = $('blush'), headTint = $('headTint');

function headApply(H, x, y) { // scale about (512,505) -> rotate about (512,470) -> translate
  let px = 512 + (x - 512) * H.sx, py = 505 + (y - 505) * H.sy; const a = H.r * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const qx = 512 + (px - 512) * c - (py - 470) * s, qy = 470 + (px - 512) * s + (py - 470) * c; return [qx + H.x, qy + H.y]; }
let lastH = { x: 0, y: 0, r: 0, sx: 1, sy: 1 }, lastRoot = { x: 0, y: 0, r: 0, sx: 1, sy: 1 };
// point given in head-local coords -> root coords (and -> svg coords via rootApply)
function rootApply(R, x, y) { let px = 512 + (x - 512) * R.sx, py = 890 + (y - 890) * R.sy; const a = R.r * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const qx = 512 + (px - 512) * c - (py - 890) * s, qy = 890 + (px - 512) * s + (py - 890) * c; return [qx + R.x, qy + R.y]; }
const headPoint = (x, y) => { const q = headApply(lastH, x, y); return rootApply(lastRoot, q[0], q[1]); };

function renderPose(q) {
  const p = Object.assign({}, P0, q);
  // whole body: breathing + squash & stretch from the ground
  const rsx = 1 + 0.006 * p.br + p.sq * 0.9, rsy = 1 - 0.008 * p.br - p.sq;
  lastRoot = { x: p.rootX, y: p.rootY, r: p.rootR, sx: rsx, sy: rsy };
  root.setAttribute('transform', `translate(${f2(p.rootX)} ${f2(p.rootY)}) rotate(${f2(p.rootR)} 512 890) translate(512 890) scale(${(Math.round(rsx * 1000) / 1000)} ${(Math.round(rsy * 1000) / 1000)}) translate(-512 -890)`);
  const gk = clamp(1 + p.rootY / 240, 0.5, 1.08);
  ground.setAttribute('transform', `translate(${f2(p.rootX)} 0) translate(512 893) scale(${f2(gk * (1 + p.sq * 0.6))} ${f2(gk)}) translate(-512 -893)`);
  ground.setAttribute('opacity', f2(0.13 * gk * p.ground));
  // head
  const H = { x: p.hx + p.lookX * 5, y: p.hy, r: p.hr + p.lookX * 3, sx: 1 + p.sq * 0.35, sy: 1 - p.sq * 0.35 }; lastH = H;
  head.setAttribute('transform', `translate(${f2(H.x)} ${f2(H.y)}) rotate(${f2(H.r)} 512 470) translate(512 505) scale(${f2(H.sx)} ${f2(H.sy)}) translate(-512 -505)`);
  // neck "bone": linear-blend skinning between the fixed coil and the head transform
  for (const o of neckPaths) { const xy = o.xy, out = o.out, w = o.w;
    for (let i = 0; i < w.length; i++) { const x = xy[2 * i], y = xy[2 * i + 1], wi = w[i];
      if (wi < 1e-4) { out[2 * i] = x; out[2 * i + 1] = y; continue; } const hq = headApply(H, x, y); out[2 * i] = x + (hq[0] - x) * wi; out[2 * i + 1] = y + (hq[1] - y) * wi; }
    o.el.setAttribute('d', build(o.cmds, out)); }
  // tail "bones": chain of rotations with a travelling wave; exact rest pose when beta = 0
  for (let i = 0; i < NT; i++) { const r = ramp[i]; beta[i] = r * (p.tailB + p.flick + p.tailA * Math.sin(p.tailPh - sArr[i] / 70)) + r * r * 0.5 * p.flick; }
  cx_[0] = TP[0][0]; cy_[0] = TP[0][1];
  for (let i = 1; i < NT; i++) { const a = 0.5 * (beta[i - 1] + beta[i]), c = Math.cos(a), s = Math.sin(a), vx = TP[i][0] - TP[i - 1][0], vy = TP[i][1] - TP[i - 1][1];
    cx_[i] = cx_[i - 1] + vx * c - vy * s; cy_[i] = cy_[i - 1] + vx * s + vy * c; }
  for (const o of tailPaths) { const out = o.out, n = o.bi.length;
    for (let j = 0; j < n; j++) { const i = o.bi[j], c = Math.cos(beta[i]), s = Math.sin(beta[i]); out[2 * j] = cx_[i] + o.dx[j] * c - o.dy[j] * s; out[2 * j + 1] = cy_[i] + o.dx[j] * s + o.dy[j] * c; }
    o.el.setAttribute('d', build(o.cmds, out)); }
  // face: faux-3D parallax (features slide further than the head outline)
  const lx = p.lookX, ly = p.lookY;
  face.setAttribute('transform', `translate(${f2(lx * 7)} ${f2(ly * 4)})`);
  if (p.tint) { headTint.setAttribute('opacity', f2(p.tint.a)); $('tint0').setAttribute('stop-color', p.tint.c); $('tint1').setAttribute('stop-color', p.tint.c); $('tint1').setAttribute('offset', f2(p.tint.y || 0.75)); }
  else headTint.setAttribute('opacity', '0');
  for (const s of ['L', 'R']) { const e = E[s], ex = e.ex, ey = e.ey, sgn = s === 'L' ? 1 : -1;
    const wink = s === 'L' ? p.winkL : p.winkR, hap = clamp(Math.max(p.happy, wink), 0, 1), shut = clamp(p.shut, 0, 1);
    const cl = clamp(hap + shut, 0, 1), kk = shut / (hap + shut + 1e-6), fxv = clamp(Math.max(p.heart, p.star), 0, 1);
    // eye squeezes shut first, then swaps to the closed arc (no ghosting)
    e.open.setAttribute('transform', `translate(${ex} ${ey}) scale(${f2(p.eyeS)} ${f2(p.eyeS * (1 - p.blink) * (1 - 0.92 * sstep(0, 0.6, cl)))}) translate(${-ex} ${-ey})`);
    e.open.setAttribute('opacity', f2(clamp(1 - (cl - 0.45) * 5, 0, 1) * (1 - fxv)));
    const sc = 0.6 + 0.4 * cl, hw = 31 * sc, y0 = ey + lerp(12, 2, kk) * sc, yc = ey + lerp(-30, 26, kk) * sc;
    e.closed.setAttribute('opacity', f2(clamp((cl - 0.42) * 5, 0, 1) * (1 - fxv)));
    e.closed.setAttribute('d', `M${f2(ex - hw)},${f2(y0)}Q${ex},${f2(yc)} ${f2(ex + hw)},${f2(y0)}`);
    const ps = p.pupilS;
    e.pupil.setAttribute('transform', `translate(${f2(lx * 13)} ${f2(ly * 11)}) translate(${e.pcx} ${e.pcy}) scale(${f2(ps)}) translate(${-e.pcx} ${-e.pcy})`);
    e.pupil.setAttribute('opacity', f2(1 - p.spiral));
    const hs = 1 + 0.35 * p.teary;
    e.hl.setAttribute('transform', `translate(${f2(lx * 5)} ${f2(ly * 4)}) translate(${e.pcx} ${e.pcy}) scale(${f2(hs * Math.min(1, 0.4 + ps * 0.6))}) translate(${-e.pcx} ${-e.pcy})`);
    e.hl.setAttribute('opacity', f2(1 - p.spiral));
    e.spiral.setAttribute('opacity', f2(p.spiral)); e.spiral.setAttribute('transform', `translate(${ex} ${ey}) rotate(${f2(p.spiralRot * sgn)}) scale(${f2(sgn)} 1)`);
    // teary pool along the lower lid
    if (p.teary > 0.01) { const yt = ey + 66 - 40 * p.teary, a = 70;
      e.pool.setAttribute('d', `M${ex - a},${f2(yt + 6)}Q${ex - 30},${f2(yt - 8)} ${ex},${f2(yt + 2)}T${ex + a},${f2(yt)}L${ex + a},${ey + 80}L${ex - a},${ey + 80}Z`);
      e.pool.setAttribute('opacity', f2(0.9 * p.teary)); e.poolHl.setAttribute('d', `M${ex - 30},${f2(yt + 14)}Q${ex - 12},${f2(yt + 8)} ${ex + 6},${f2(yt + 14)}`);
      e.poolHl.setAttribute('opacity', f2(p.teary)); } else { e.pool.setAttribute('opacity', '0'); e.poolHl.setAttribute('opacity', '0'); }
    // heart / star eyes
    e.heart.setAttribute('opacity', p.heart > 0.01 ? '1' : '0'); e.heart.setAttribute('transform', `translate(${ex} ${ey + 4}) scale(${f2(p.heart * p.eyeFxS)})`);
    e.star.setAttribute('opacity', p.star > 0.01 ? '1' : '0'); e.star.setAttribute('transform', `translate(${ex} ${ey}) rotate(${f2(-10 * sgn)}) scale(${f2(p.star * p.eyeFxS)})`);
    // eyelid: skin-coloured lid sliding down (clipped by a slightly larger oval), lash line on its edge
    const L = clamp(s === 'L' ? (p.lidL ?? p.lid) : (p.lidR ?? p.lid), 0, 1), tl = s === 'L' ? (p.tiltL ?? p.tilt) : (p.tiltR ?? p.tilt);
    const b = 66, a = 56, yl = ey - b + L * 2 * b, dep = 16 * clamp(L * 5, 0, 1), rot = `rotate(${f2(tl * sgn)} ${ex} ${ey})`;
    e.lid.setAttribute('d', `M${ex - a - 40},${ey - b - 80}H${ex + a + 40}V${f2(yl)}Q${ex},${f2(yl + dep)} ${ex - a - 40},${f2(yl)}Z`); e.lid.setAttribute('transform', rot);
    e.lash.setAttribute('d', `M${ex - a - 40},${f2(yl)}Q${ex},${f2(yl + dep)} ${ex + a + 40},${f2(yl)}`); e.lash.setAttribute('transform', rot);
    e.lash.setAttribute('opacity', f2(clamp((L - 0.04) * 8, 0, 1)));
    // crying fountains (Duolingo style): arcs shooting sideways from the eye corners
    if (p.cry > 0.01) { const d = -sgn, k = p.cry, x0 = ex + d * 40, y0c = ey + 26, x2 = ex + d * (70 + 100 * k), y2 = ey + 40 + 125 * k, xc = ex + d * (60 + 85 * k), yc2 = ey - 30 * k;
      const path = `M${f2(x0)},${f2(y0c)}Q${f2(xc)},${f2(yc2)} ${f2(x2)},${f2(y2)}`;
      e.cry.setAttribute('opacity', f2(clamp(k * 3, 0, 1))); e.cryO.setAttribute('d', path); e.cryI.setAttribute('d', path);
      e.cryI.setAttribute('stroke-dashoffset', f2(-p.cryPh * 44));
      const u = (p.cryPh % 1), dx = x2 + d * 14 * u, dy = y2 + 20 + 70 * u * u;
      e.cryD.setAttribute('cx', f2(dx)); e.cryD.setAttribute('cy', f2(dy)); e.cryD.setAttribute('opacity', f2(1 - u)); }
    else e.cry.setAttribute('opacity', '0');
    const tp = s === 'L' ? p.tearL : p.tearR;
    if (tp >= 0) { const tx = ex - sgn * 18 + sgn * 6 * tp, ty = ey + 62 + 95 * tp;
      e.tear.setAttribute('opacity', f2(clamp(tp * 8, 0, 1) * clamp((1 - tp) * 5, 0, 1)));
      e.tear.setAttribute('transform', `translate(${f2(tx)} ${f2(ty)}) scale(${f2(0.8 + 0.3 * Math.min(1, tp * 3))})`); }
    else e.tear.setAttribute('opacity', '0'); }
  cheeks.forEach(c => { const x = +c.getAttribute('cx'), y = +c.getAttribute('cy'), k = p.cheek; c.setAttribute('transform', `translate(${x} ${y}) scale(${f2(k)}) translate(${-x} ${-y})`); });
  blushG.setAttribute('opacity', f2(p.blush));
  // mouth: smile <-> frown, smirk, wavy, width; open "D" mouth; little "o"
  const fr = clamp(p.frown, 0, 1), ym = 404;
  const pts = half.map(h => h.map(([x, y]) => { const u = (x - mx0) / (mx1 - mx0);
    let yy = lerp(y, 2 * ym - y + 6, fr) - p.smirk * (u - 0.5) * 36 + p.wave * 7 * Math.sin(2 * Math.PI * 2.5 * u + p.wavePh) * Math.pow(Math.sin(Math.PI * u), 0.6);
    return [512 + (x - 512) * p.mw, yy]; }));
  const lineD = crPath(pts[0], true) + crPath(pts[1], false);
  const A = pts[0][0], Z = pts[1][pts[1].length - 1];
  const op = clamp(p.open, 0, 1.3), oo = clamp(p.o, 0, 1), oa = clamp(oo * 3.5, 0, 1), depth = 78 * op;
  const openD = lineD + `C${f2(Z[0] - 10)},${f2(Z[1] + depth)} ${f2(A[0] + 10)},${f2(A[1] + depth)} ${f2(A[0])},${f2(A[1])}Z`;
  mLine.setAttribute('d', lineD); mLine.setAttribute('opacity', f2(1 - oa));
  mOpen.setAttribute('d', op > 0.01 ? openD : ''); mClip.setAttribute('d', op > 0.01 ? openD : '');
  mTongue.setAttribute('cy', f2(400 + 0.8 * depth)); mTongue.setAttribute('ry', f2(4 + 0.2 * depth));
  mO.setAttribute('opacity', f2(oa)); mO.setAttribute('transform', `translate(511.9 408) scale(${f2((0.35 + 0.65 * oo) * p.oS)} ${f2((0.35 + 0.65 * oo) * p.oS * (p.oSy || 1))}) translate(-511.9 -408)`);
  const tg = p.tongue, tv = clamp(p.tgv, 0, 1.6) * clamp(1 - op * 3 - oa * 1.5, 0, 1);
  tongueEl.setAttribute('opacity', f2(clamp(tv * 5, 0, 1)));
  tongueEl.setAttribute('transform', `translate(512 404) rotate(${f2(p.tgWig + Math.sin(p.tgPh || 0) * 6 * tg)}) scale(${f2(0.85 + 0.15 * Math.min(1, tv) + 0.06 * tg)} ${f2(Math.max(0.001, tv * (1 + 0.75 * tg)))}) translate(-512 -404)`);
}

window.SerpuCore = { renderPose, setPalette, headPoint, headApply, P0, eyes: E, clamp, lerp, sstep, f2 };
})();


// ===================== Serpu live driver (springs, states, reactions, idle life, sounds) =====================
(function () {
const $ = id => document.getElementById(id);
const { renderPose, clamp, lerp } = SerpuCore;
let seed = (Date.now() & 0xffff) | 1; const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
// ---------- springs (blend everything smoothly, like a state machine's blend) ----------
class Spring { constructor(v, f = 3, z = 1) { this.v = v; this.t = v; this.vel = 0; this.f = f; this.z = z; }
  step(dt) { const w = 2 * Math.PI * this.f; this.vel += (-w * w * (this.v - this.t) - 2 * this.z * w * this.vel) * dt; this.v += this.vel * dt; } }
const SP = {};
const sp = (k, v, f, z) => (SP[k] = new Spring(v, f, z));
sp('hx', 0, 2.2, 0.8); sp('hy', 0, 2.0, 0.75); sp('hr', 0, 2.0, 0.7); sp('lookX', 0, 2.6, 0.85); sp('lookY', 0, 2.6, 0.85);
sp('lid', 0, 3.0, 1); sp('tilt', 0, 3.0, 1); sp('happy', 0, 4.0, 0.9); sp('frown', 0, 3.0, 1); sp('open', 0, 5.0, 0.8);
sp('o', 0, 4.0, 0.8); sp('cheek', 1, 3.0, 0.6); sp('eyeS', 1, 4.0, 0.5); sp('tailAmp', 0.07, 1.0, 1); sp('tailBend', 0, 1.6, 0.6);
sp('tailHz', 0.45, 0.8, 1); sp('bob', 1, 1.0, 1); sp('shut', 0, 2.2, 1); sp('tgv', 1, 3.5, 0.9);
sp('heart', 0, 3.2, 0.55); sp('star', 0, 3.2, 0.55); sp('spiral', 0, 2.4, 1); sp('blush', 0, 2.0, 1); sp('teary', 0, 1.6, 1);
sp('wave', 0, 2.5, 1); sp('smirk', 0, 3, 1); sp('pupilS', 1, 3, 0.7); sp('sway', 0, 1.2, 1);

// ---------- states (targets) ----------
const DEF = { lid: 0, tilt: 0, happy: 0, frown: 0, open: 0, o: 0, cheek: 1, tailAmp: 0.07, tailBend: 0, tailHz: 0.45, eyeS: 1, hy: 0, hr: 0, bob: 1, shut: 0, tgv: 0,
  heart: 0, star: 0, spiral: 0, blush: 0, teary: 0, wave: 0, smirk: 0, pupilS: 1, sway: 0 };
const STATES = {
  idle:      { tgv: 1 },
  happy:     { happy: 1, open: 0.8, cheek: 1.25, tailAmp: 0.16, tailBend: -0.04, tailHz: 1.5, hy: -6, bob: 1.6, tgv: 1 },
  love:      { heart: 1, blush: 1, open: 0.35, cheek: 1.35, tailAmp: 0.15, tailBend: -0.05, tailHz: 1.2, hy: -4, bob: 1.4 },
  party:     { star: 1, open: 1, cheek: 1.3, tailAmp: 0.22, tailBend: -0.06, tailHz: 2.4, hy: -8, bob: 2.2, sway: 1 },
  dizzy:     { spiral: 1, wave: 1, cheek: 0.9, tailAmp: 0.05, tailBend: 0.12, tailHz: 0.5, hy: 8, bob: 0.4, sway: 0.6 },
  shy:       { happy: 0.75, blush: 1, cheek: 1.35, tailAmp: 0.12, tailHz: 1.0, hy: 2, hr: -4, tgv: 1 },
  think:     { lid: 0.18, smirk: 0.6, tilt: 6, tailAmp: 0.05, tailHz: 0.6, hr: 6, hy: -2, tgv: 0 },
  sad:       { lid: 0.42, tilt: -14, frown: 1, cheek: 0.7, tailAmp: 0.03, tailBend: 0.22, tailHz: 0.3, hy: 16, hr: -5, bob: 0.5, teary: 0.7 },
  worried:   { lid: 0.16, tilt: -18, frown: 0.55, cheek: 0.9, tailAmp: 0.09, tailBend: 0.05, tailHz: 2.2, eyeS: 1.04, hy: 4, hr: 2, bob: 0.6 },
  sleepy:    { lid: 0.58, tilt: 4, cheek: 0.9, tailAmp: 0.03, tailBend: 0.1, tailHz: 0.3, hy: 8, hr: -4, bob: 0.5 },
  yawn:      { lid: 0.7, open: 1.15, cheek: 0.9, tailAmp: 0.03, tailBend: 0.1, tailHz: 0.3, hy: -6, hr: -3, bob: 0.3 },
  asleep:    { shut: 1, o: 0.42, cheek: 0.95, tailAmp: 0.02, tailBend: 0.14, tailHz: 0.22, hy: 14, hr: -7, bob: 0.3 },
  surprised: { o: 1, cheek: 0.8, tailAmp: 0.04, tailBend: -0.14, tailHz: 0.8, eyeS: 1.12, hy: -12, bob: 0.8, pupilS: 0.75 },
  angry:     { lid: 0.3, tilt: 16, frown: 0.7, cheek: 0.8, tailAmp: 0.14, tailBend: -0.06, tailHz: 3.0, hy: 2, bob: 0.5 },
};
for (const k in STATES) STATES[k] = Object.assign({}, DEF, STATES[k]);
let base = 'idle', cur = 'idle', curUntil = 0;
function applyState(name) { cur = name; const s = STATES[name]; for (const k in s) if (SP[k]) SP[k].t = s[k]; }
function setState(name, dur) { if (dur) { applyState(name); curUntil = T + dur; } else { base = name; curUntil = 0; applyState(name); } }

// ---------- one-shot keyframe tracks (anticipation -> action -> follow-through) ----------
const EASE = { lin: t => t, out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t, io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); } };
const OFF = {}; let tracks = [];
function play(trk) { const t0 = T; for (const k in trk) tracks.push({ k, keys: trk[k], t0 }); }
function evalTracks() { for (const k in OFF) OFF[k] = 0; tracks = tracks.filter(tr => { const t = T - tr.t0, K = tr.keys; let v;
    if (t >= K[K.length - 1][0]) { v = K[K.length - 1][1]; OFF[tr.k] = (OFF[tr.k] || 0) + v; return false; }
    for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const a = K[i - 1], b = K[i]; v = lerp(a[1], b[1], (EASE[b[2] || 'io'])((t - a[0]) / (b[0] - a[0]))); break; }
    OFF[tr.k] = (OFF[tr.k] || 0) + v; return true; }); }
const o_ = k => OFF[k] || 0;
const hop = (h = 60, d = 1) => play({ rootY: [[0, 0], [0.09 * d, 7, 'out'], [0.3 * d, -h, 'out'], [0.5 * d, 0, 'in'], [0.58 * d, 5, 'out'], [0.72 * d, 0, 'io']],
  sq: [[0, 0], [0.09 * d, 0.12, 'out'], [0.2 * d, -0.08, 'out'], [0.45 * d, 0, 'io'], [0.52 * d, 0.07, 'out'], [0.75 * d, 0, 'back']],
  hyO: [[0, 0], [0.12 * d, 10, 'out'], [0.32 * d, -10, 'out'], [0.55 * d, 6, 'io'], [0.8 * d, 0, 'back']] });
const shake = () => play({ hxO: [[0, 0], [0.08, -16, 'out'], [0.2, 14, 'io'], [0.32, -10, 'io'], [0.44, 6, 'io'], [0.58, 0, 'io']],
  hrO: [[0, 0], [0.08, -5, 'out'], [0.2, 5, 'io'], [0.32, -3, 'io'], [0.44, 2, 'io'], [0.58, 0, 'io']] });
const tilt = () => play({ hrO: [[0, 0], [0.25, 9, 'out'], [0.6, 7, 'io'], [1.0, 0, 'back']], hxO: [[0, 0], [0.25, 8, 'out'], [1.0, 0, 'io']] });
const tongueFlick = () => play({ tongue: [[0, 0], [0.07, 1, 'out'], [0.14, 0.35, 'io'], [0.21, 1, 'io'], [0.32, 0, 'in']] });
const tailFlick = (a = 0.35) => play({ flick: [[0, 0], [0.12, -a * 0.4, 'out'], [0.32, a, 'out'], [0.7, -a * 0.25, 'io'], [1.1, 0, 'io']] });
const blinkNow = () => play({ blink: [[0, 0], [0.06, 0.92, 'in'], [0.13, 0.92], [0.22, 0, 'out']] });
const wink = () => play({ winkL: [[0, 0], [0.1, 1, 'out'], [0.55, 1], [0.75, 0, 'io']], smirkO: [[0, 0], [0.1, 0.7, 'out'], [0.55, 0.7], [0.8, 0, 'io']] });
const wiggle = (n = 4, a = 7, d = 0.26) => { const k = [[0, 0]]; for (let i = 1; i <= n; i++) k.push([i * d, (i % 2 ? a : -a) * (1 - i / (n + 2)), 'io']); k.push([(n + 1) * d, 0, 'io']);
  const kx = k.map(([t, v]) => [t, v * 2.6, 'io']); play({ rootR: k, rootX: kx }); };
const spinHop = () => { hop(95, 1.15); play({ rootR: [[0, 0], [0.12, -6, 'out'], [0.45, 14, 'out'], [0.8, -4, 'io'], [1.1, 0, 'back']] }); };

// ---------- sounds ----------
let muted = false; const cache = {};
function snd(n, user) { if ((muted && !user) || window.__REC) return; const a = (cache[n] = cache[n] || new Audio('sounds/' + n + '.mp3')); try { a.volume = 0.6; a.currentTime = 0; a.play().catch(() => {}); } catch (e) {} }

// ---------- fx (DOM) ----------
const fx = $('fx');
function confetti(n = 26) { const col = ['#FF5A8A', '#FFC83D', '#4CC9F0', '#7BE495', '#FF9F43', '#B066F2'];
  for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'conf'; d.style.background = col[i % col.length];
    const a = rnd() * Math.PI * 2, r = 140 + rnd() * 170; d.style.setProperty('--x', Math.cos(a) * r + 'px'); d.style.setProperty('--y', (Math.sin(a) * r - 70) + 'px');
    d.style.setProperty('--r', (rnd() * 720 - 360) + 'deg'); fx.appendChild(d); setTimeout(() => d.remove(), 1400); } }
function floatText(t, cls = 'plus') { const d = document.createElement('div'); d.className = cls; d.textContent = t; fx.appendChild(d); setTimeout(() => d.remove(), 2300); }
function hearts(n = 5) { for (let i = 0; i < n; i++) setTimeout(() => { const d = document.createElement('div'); d.className = 'heart-fx'; d.textContent = '♥'; d.style.setProperty('--c', pick(['#b650f8', '#2fb36f', '#fe89a7', '#8a3fe8']));
  d.style.setProperty('--x', (rnd() * 160 - 80) + 'px'); d.style.setProperty('--s', (0.7 + rnd() * 0.7).toFixed(2)); d.style.left = (38 + rnd() * 24) + '%';
  fx.appendChild(d); setTimeout(() => d.remove(), 2000); }, i * 110); }
function stars(n = 8) { for (let i = 0; i < n; i++) { const d = document.createElement('div'); d.className = 'star-fx'; const a = rnd() * Math.PI * 2, r = 110 + rnd() * 120;
  d.style.setProperty('--x', Math.cos(a) * r + 'px'); d.style.setProperty('--y', Math.sin(a) * r - 60 + 'px'); d.textContent = pick(['✦', '★', '✧']); fx.appendChild(d); setTimeout(() => d.remove(), 1300); } }

// ---------- speech bubble ----------
let bubbleT = 0;
function say(text, ms = 2600) {
  const b = document.querySelector('[data-bubble]'); if (!b || !text) return;
  b.textContent = text; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  clearTimeout(bubbleT); if (ms) bubbleT = setTimeout(() => b.classList.remove('pop'), ms);
  document.dispatchEvent(new CustomEvent('serpu:say', { detail: text }));
}

// ---------- reactions (what the app triggers) ----------
let talkUntil = 0, sleeping = false, tapN = 0, lastPointer = -99, combo = 0, lastTap = -9, busyUntil = 0;
const TAP_LINES = ['Хи-хи, щекотно!', 'Я не кусаюсь', 'Ещё разок!', 'Ссс-спасибо!', 'Покажи мне упаковку', 'Прыг!'];
const ACT = {
  tap() {
    if (sleeping) return ACT.wake();
    if (T < busyUntil) return;
    combo = T - lastTap < 0.7 ? combo + 1 : 1; lastTap = T;
    if (combo >= 9) { combo = 0; return ACT.dizzy(); }
    if (combo === 6) return ACT.party();
    if (combo === 3) return ACT.love();
    const r = rnd();
    if (r < 0.14) { setState('happy', 1.2); wink(); tongueFlick(); say('Хи-хи'); snd('serpu_hiss', true); return; }
    if (r < 0.26) { setState('happy', 1.2); spinHop(); tailFlick(0.45); say('Уиии!'); snd('serpu_happy', true); return; }
    if (r < 0.36) { setState('happy', 1.4); wiggle(4, 5); say('Танцую!'); snd('serpu_happy', true); return; }
    setState('happy', 1.1); hop(42 + rnd() * 30, 0.9); tailFlick(0.3); if (combo === 1) say(pick(TAP_LINES), 1800); snd(tapN++ % 2 ? 'serpu_hiss' : 'serpu_happy', true);
  },
  love()    { setState('love', 2.4); hop(55, 1); hearts(7); tailFlick(0.4); say('Я тебя тоже люблю!'); snd('streak_up', true); },
  party()   { setState('party', 2.6); hop(90, 1.1); later(0.6, () => hop(60, 0.9)); wiggle(6, 6, 0.22); confetti(36); stars(10); say('Вечеринка!'); snd('confetti', true); },
  dizzy()   { busyUntil = T + 2.6; setState('dizzy', 2.6); shake(); wiggle(5, 4, 0.3); floatText('@', 'dizzy-fx'); say('Ой… голова кружится'); snd('freeze', true); },
  pet()     { if (sleeping || T < busyUntil) return; setState('shy', 2.0); hearts(3); if (rnd() < 0.5) say(pick(['Мрр… то есть, ссс', 'Приятно!', 'Ещё погладь'])); },
  pill()    { setState('happy', 2.2); hop(70, 1); later(0.62, () => hop(45, 0.85)); later(0.25, () => { confetti(22); snd('confetti'); }); tailFlick(0.4); snd('pill_taken'); },
  streak()  { setState('happy', 1.4); hop(52, 0.95); floatText('+1'); snd('streak_up'); },
  record()  { setState('surprised', 0.35); later(0.35, () => { setState('happy', 2.4); hop(110, 1.25); later(0.35, () => confetti(44)); tailFlick(0.5); }); snd('milestone'); },
  remind()  { setState('worried', 1.8); tilt(); talkUntil = T + 1.5; tailFlick(0.25); snd('reminder'); },
  missed()  { setState('sad', 3.2); snd('missed'); },
  sad()     { setState('sad', 2.6); },
  think()   { setState('think', 3.5); tilt(); },
  found()   { setState('happy', 1.6); hop(46, 0.9); tailFlick(0.35); },
  warn()    { setState('angry', 1.6); shake(); later(0.6, shake); snd('warning'); },
  freeze()  { setState('surprised', 2.0); document.body.classList.add('frozen'); later(2.0, () => document.body.classList.remove('frozen')); snd('freeze'); },
  talk()    { talkUntil = T + 2.4; tilt(); },
  surprised() { if (sleeping) return; setState('surprised', 0.6); },
  sleep()   { if (sleeping) return; sleeping = true; setState('yawn', 1.4); say('Ааа-ууу… *зевает*', 1600); later(1.4, () => { if (sleeping) setState('sleepy'); }); later(3.0, () => { if (sleeping) { setState('asleep'); say('Zzz…', 0); } }); },
  wake_quiet() { if (!sleeping) return; sleeping = false; setState('idle'); },
  wake()    { if (!sleeping) return; sleeping = false; setState('surprised', 0.6); hop(36, 0.8); later(0.6, () => setState('idle')); say(pick(['Ой! Я не спал!', 'А? Что? Я тут!', 'Доброе утро!'])); snd('serpu_hiss', true); },
};
let queue = []; const later = (dt, fn) => queue.push({ t: T + dt, fn });

// ---------- idle life: blinks, glances, tongue & tail flicks, falling asleep ----------
let nextBlink = 1.2, nextGlance = 0.8, nextTongue = 4, nextFlick = 6, nextZ = 0, lastActive = 0, nextFidget = 12;
const SLEEP_AFTER = 28;
function idleLife() {
  if (T > nextBlink) { if (!sleeping) blinkNow(); if (rnd() < 0.22) later(0.28, blinkNow); nextBlink = T + 2.2 + rnd() * 3.8; }
  if (T - lastPointer > 1.6 && T > nextGlance) { SP.lookX.t = rnd() < 0.35 ? 0 : (rnd() * 2 - 1) * 0.9; SP.lookY.t = (rnd() * 2 - 1) * 0.5; nextGlance = T + 1.2 + rnd() * 2.6; }
  if (!sleeping && T > nextTongue) { if (SP.tgv.t > 0.5) tongueFlick(); nextTongue = T + 6 + rnd() * 7; }
  if (!sleeping && T > nextFlick) { tailFlick(0.18 + rnd() * 0.12); nextFlick = T + 7 + rnd() * 6; }
  if (!sleeping && cur === 'idle' && T > nextFidget && T - lastActive > 6) { const f = rnd(); if (f < 0.4) { tilt(); } else if (f < 0.7) { wiggle(2, 3, 0.35); } else { hop(18, 0.7); } nextFidget = T + 9 + rnd() * 9; }
  if (!sleeping && T - lastActive > SLEEP_AFTER && T > busyUntil) ACT.sleep();
  if (sleeping && T > nextZ && cur === 'asleep') { floatText(pick(['z', 'Z', 'z']), 'zz'); nextZ = T + 1.1; SP.lookX.t = 0; SP.lookY.t = 0.3; }
}
function activity(strong) { lastActive = T; if (sleeping && strong) ACT.wake(); }

// ---------- pose from springs ----------
function render() {
  const br = Math.sin(T * 2 * Math.PI / 3.2);
  const bobY = -4.5 * SP.bob.v * (0.5 + 0.5 * Math.sin(T * 2 * Math.PI / 2.6)), swayR = 1.3 * Math.sin(T * 2 * Math.PI / 5.3);
  const sw = SP.sway.v, swing = Math.sin(T * 2 * Math.PI * 1.1);
  let op = clamp(SP.open.v + (T < talkUntil ? 0.12 + 0.5 * Math.abs(Math.sin(T * 2 * Math.PI * 3.6)) * (0.6 + 0.4 * Math.sin(T * 7.3)) : 0), 0, 1.2);
  renderPose({ rootY: o_('rootY'), rootX: o_('rootX') + sw * 14 * swing, rootR: o_('rootR') + sw * 5 * swing, sq: o_('sq'), br,
    hx: SP.hx.v + o_('hxO'), hy: SP.hy.v + o_('hyO') + bobY, hr: SP.hr.v + o_('hrO') + swayR - sw * 6 * swing,
    lookX: SP.lookX.v, lookY: SP.lookY.v, lid: SP.lid.v, tilt: SP.tilt.v,
    happy: SP.happy.v, shut: SP.shut.v, eyeS: SP.eyeS.v, blink: o_('blink'), winkL: o_('winkL'), pupilS: SP.pupilS.v,
    heart: Math.max(0, SP.heart.v), star: Math.max(0, SP.star.v), eyeFxS: 1 + 0.08 * Math.sin(T * 9),
    spiral: clamp(SP.spiral.v, 0, 1), spiralRot: T * 420, teary: clamp(SP.teary.v, 0, 1), blush: clamp(SP.blush.v, 0, 1),
    frown: SP.frown.v, open: op, o: SP.o.v + (sleeping ? 0.08 * br : 0), cheek: SP.cheek.v,
    wave: SP.wave.v, wavePh: T * 6, smirk: SP.smirk.v + o_('smirkO'),
    tailA: SP.tailAmp.v, tailB: SP.tailBend.v, tailPh: ph, flick: o_('flick'),
    tongue: o_('tongue'), tgPh: T * 40, tgv: SP.tgv.v });
}

// ---------- main loop ----------
let T = 0, ph = 0; const DT = 1 / 120;
function step(dt) { let n = Math.max(1, Math.round(dt / DT));
  for (let k = 0; k < n; k++) { T += DT; if (curUntil && T > curUntil) { curUntil = 0; applyState(sleeping ? 'asleep' : base); }
    queue = queue.filter(q => (T >= q.t ? (q.fn(), false) : true)); idleLife(); evalTracks(); for (const key in SP) SP[key].step(DT); ph += 2 * Math.PI * SP.tailHz.v * DT; }
  render(); }
let lastTs = null, visible = true;
const stageEl = $('stage');
if ('IntersectionObserver' in window && stageEl) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stageEl);
function loop(ts) { if (!window.__REC) { const dt = lastTs == null ? 1 / 60 : Math.min(0.05, (ts - lastTs) / 1000); lastTs = ts; if (visible && !document.hidden) step(dt); } requestAnimationFrame(loop); }
requestAnimationFrame(loop);
if (matchMedia('(prefers-reduced-motion: reduce)').matches) SP.bob.t = 0.3;
const hour = new Date().getHours(); if (hour >= 23 || hour < 6) { lastActive = -SLEEP_AFTER + 6; }

// ---------- input: eyes follow the pointer / finger, petting, waking ----------
const svgEl = $('serpu');
let petDist = 0, petT = 0, lastPX = null, lastPY = null;
addEventListener('pointermove', e => { const r = svgEl.getBoundingClientRect(); if (!r.width) return;
  const hx = r.left + r.width * 0.5, hy = r.top + r.height * 0.3;
  SP.lookX.t = clamp((e.clientX - hx) / (r.width * 0.55), -1, 1); SP.lookY.t = clamp((e.clientY - hy) / (r.height * 0.55), -1, 1); lastPointer = T; activity(false);
  // поглаживание: курсор быстро водят туда-сюда над головой
  const inHead = e.clientX > r.left + r.width * 0.28 && e.clientX < r.right - r.width * 0.28 && e.clientY > r.top + r.height * 0.1 && e.clientY < r.top + r.height * 0.5;
  if (inHead && lastPX != null) { petDist += Math.hypot(e.clientX - lastPX, e.clientY - lastPY); if (T - petT > 1.4) petDist *= 0.5; petT = T;
    if (petDist > r.width * 2.4) { petDist = 0; ACT.pet(); } }
  lastPX = e.clientX; lastPY = e.clientY; }, { passive: true });
let lastScrollY = scrollY, lastScrollT = 0;
addEventListener('scroll', () => { activity(false); const v = Math.abs(scrollY - lastScrollY); lastScrollY = scrollY;
  if (v > 220 && T - lastScrollT > 3 && !sleeping) { lastScrollT = T; ACT.surprised(); } }, { passive: true });
addEventListener('keydown', () => activity(true));
addEventListener('pointerdown', e => { if (!svgEl.contains(e.target)) activity(true); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) lastActive = T; });
let pressFired = false;
svgEl.addEventListener('click', () => { lastActive = T; if (pressFired) { pressFired = false; return; } ACT.tap(); });
// долгое нажатие — сердечки
let pressT = 0; svgEl.addEventListener('pointerdown', () => { clearTimeout(pressT); pressFired = false; pressT = setTimeout(() => { if (!sleeping) { pressFired = true; ACT.love(); } }, 650); });
['pointerup', 'pointerleave', 'pointercancel'].forEach(t => svgEl.addEventListener(t, () => clearTimeout(pressT)));

window.Serpu = { state: setState, trigger: n => { lastActive = T; return ACT[n] && ACT[n](); }, say, step, mute: v => (muted = v),
  get time() { return T; }, get asleep() { return sleeping; }, setVisible: v => (visible = v) };
})();
