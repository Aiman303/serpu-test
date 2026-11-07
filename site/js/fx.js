/* Serpuru · живой фон с таблетками (режим «с таблетками») и мини-Серпу в шапке и подвале */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  let mouseX = -9999, mouseY = -9999;
  addEventListener("pointermove", (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  addEventListener("pointerleave", () => { mouseX = mouseY = -9999; });

  /* ================= живой фон: таблетки, капсулы, плюсики, искры ================= */
  const cv = document.createElement("canvas");
  cv.className = "bg-canvas"; cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, DPR = 1, parts = [], COLORS = [];
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    COLORS = [1, 2, 3, 4].map((i) => cs.getPropertyValue(`--fx-${i}`).trim() || "#b066f2");
  };
  const KINDS = ["capsule", "capsule", "pill", "pill", "cross", "spark", "spark", "ring", "dot", "dot"];
  function spawn(p, initial) {
    p.z = 0.35 + Math.random() * 0.65;
    p.kind = KINDS[(Math.random() * KINDS.length) | 0];
    p.s = (p.kind === "dot" ? 3 : p.kind === "spark" ? 7 : p.kind === "ring" ? 10 : 13) * (0.6 + p.z * 0.9);
    p.x = Math.random() * W;
    p.y = initial ? Math.random() * H : H + 40;
    p.vx = (Math.random() - 0.5) * 0.12;
    p.vy = -(0.08 + Math.random() * 0.22) * p.z;
    p.a = Math.random() * Math.PI * 2;
    p.va = (Math.random() - 0.5) * 0.006;
    p.c = (Math.random() * COLORS.length) | 0;
    p.c2 = (p.c + 1 + ((Math.random() * (COLORS.length - 1)) | 0)) % COLORS.length;
    p.al = 0.16 + p.z * 0.3;
    p.tw = Math.random() * Math.PI * 2;
    p.ox = 0; p.oy = 0;
    return p;
  }
  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(clamp((W * H) / 30000, 14, 48));
    while (parts.length < n) parts.push(spawn({}, true));
    parts.length = n;
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function draw(p, t) {
    const s = p.s, col = COLORS[p.c], col2 = COLORS[p.c2];
    ctx.save();
    ctx.translate(p.x + p.ox, p.y + p.oy);
    ctx.rotate(p.a);
    ctx.globalAlpha = p.al * (p.kind === "spark" ? 0.6 + 0.4 * Math.sin(t * 0.003 + p.tw) : 1);
    if (p.kind === "capsule") {
      const w = s * 2.6, h = s;
      ctx.save(); roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.clip();
      ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w / 2, h);
      ctx.fillStyle = col2; ctx.fillRect(0, -h / 2, w / 2, h);
      ctx.globalAlpha *= 0.5; ctx.fillStyle = "#fff"; ctx.fillRect(-w / 2 + h * 0.3, -h * 0.32, w - h * 0.6, h * 0.16);
      ctx.restore();
    } else if (p.kind === "pill") {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha *= 0.55; ctx.strokeStyle = "#fff"; ctx.lineWidth = Math.max(1, s * 0.12); ctx.beginPath(); ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0); ctx.stroke();
    } else if (p.kind === "cross") {
      ctx.fillStyle = col; const a = s * 0.9, b = s * 0.32;
      roundRect(-a, -b, a * 2, b * 2, b * 0.6); ctx.fill(); roundRect(-b, -a, b * 2, a * 2, b * 0.6); ctx.fill();
    } else if (p.kind === "spark") {
      ctx.fillStyle = col; ctx.beginPath();
      for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.28 : s; const an = (i * Math.PI) / 4; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); }
      ctx.closePath(); ctx.fill();
    } else if (p.kind === "ring") {
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, s * 0.18); ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  const fxOn = () => document.documentElement.dataset.fx !== "off";
  let running = true, last = 0, scrollDelta = 0, lastSY = scrollY;
  addEventListener("scroll", () => { scrollDelta += scrollY - lastSY; lastSY = scrollY; }, { passive: true });
  function frame(t) {
    if (!running || !fxOn()) { running = false; return; }
    const dt = Math.min(50, t - (last || t)); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.1 - scrollDelta * p.z * 0.3; p.a += p.va * dt * 0.06;
      if (p.y > H + 60) p.y -= H + 100;
      // курсор мягко расталкивает частицы
      const dx = p.x + p.ox - mouseX, dy = p.y + p.oy - mouseY, d2 = dx * dx + dy * dy, R = 150;
      if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 2.2 * p.z; p.ox += (dx / d) * f; p.oy += (dy / d) * f; }
      p.ox *= 0.96; p.oy *= 0.96;
      if (p.y < -60 || p.x < -80 || p.x > W + 80) spawn(p, false);
      draw(p, t);
    }
    scrollDelta = 0;
    requestAnimationFrame(frame);
  }
  readColors(); resize();
  addEventListener("resize", () => { resize(); if (reduce) parts.forEach((p) => draw(p, 0)); });
  new MutationObserver(() => { readColors(); if (fxOn() && !running && !reduce && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-fx"] });
  document.addEventListener("visibilitychange", () => { const want = !document.hidden && !reduce && fxOn(); if (want && !running) { running = true; last = 0; requestAnimationFrame(frame); } else if (!want) running = false; });
  if (reduce) { running = false; parts.forEach((p) => draw(p, 0)); } else requestAnimationFrame(frame);

  /* ================= мини-Серпу: моргает и следит за курсором ================= */
  const heads = [...document.querySelectorAll(".mini-head")].map((svg) => ({
    follow: !svg.closest(".nav"),
    svg, pupils: [...svg.querySelectorAll(".hd-pupil")], hls: [...svg.querySelectorAll(".hd-hl")], face: svg.querySelector(".hd-face"),
    lx: 0, ly: 0,
  }));
  function blink(h) { h.svg.classList.add("blink"); setTimeout(() => h.svg.classList.remove("blink"), 170); }
  heads.forEach((h) => {
    const loop = () => { if (!document.hidden) { blink(h); if (Math.random() < 0.25) setTimeout(() => blink(h), 260); } setTimeout(loop, 2200 + Math.random() * 4200); };
    setTimeout(loop, 800 + Math.random() * 2500);
  });
  let headRaf = 0;
  function aimHeads() {
    headRaf = 0;
    for (const h of heads) {
      if (!h.follow) continue;
      const r = h.svg.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
      const tx = mouseX < -999 ? 0 : clamp((mouseX - cx) / 260, -1, 1), ty = mouseY < -999 ? 0 : clamp((mouseY - cy) / 220, -1, 1);
      h.lx += (tx - h.lx) * 0.35; h.ly += (ty - h.ly) * 0.35;
      h.pupils.forEach((p) => p.setAttribute("transform", `translate(${(h.lx * 15).toFixed(1)} ${(h.ly * 12).toFixed(1)})`));
      h.hls.forEach((p) => p.setAttribute("transform", `translate(${(h.lx * 6).toFixed(1)} ${(h.ly * 5).toFixed(1)})`));
      if (h.face) h.face.setAttribute("transform", `translate(${(h.lx * 8).toFixed(1)} ${(h.ly * 6).toFixed(1)})`);
    }
  }
  addEventListener("pointermove", () => { if (!headRaf) headRaf = requestAnimationFrame(aimHeads); }, { passive: true });
  addEventListener("scroll", () => { if (!headRaf) headRaf = requestAnimationFrame(aimHeads); }, { passive: true });
  document.querySelectorAll(".logo").forEach((l) => l.addEventListener("pointerenter", () => {
    const svg = l.querySelector(".mini-head"); if (!svg) return; svg.classList.remove("boing"); void svg.getBoundingClientRect(); svg.classList.add("boing");
  }));

  // Серпу выглядывает из-за подвала
  const peek = document.querySelector(".peek");
  if (peek) {
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach((en) => peek.classList.toggle("up", en.isIntersecting)), { threshold: 0.15 }).observe(document.querySelector(".footer"));
    const LINES = ["Пока-пока!", "Не забудь про аптечку!", "Ссс-спасибо, что зашёл!", "Будь здоров!", "Пей водичку!"];
    let i = 0;
    peek.addEventListener("click", () => {
      peek.classList.remove("boing"); void peek.offsetWidth; peek.classList.add("boing");
      const tip = document.createElement("span"); tip.className = "peek-tip"; tip.textContent = LINES[i++ % LINES.length];
      peek.appendChild(tip); setTimeout(() => tip.remove(), 1900);
      for (let k = 0; k < 5; k++) { const h = document.createElement("span"); h.className = "peek-heart"; h.textContent = "\u2665"; h.style.setProperty("--c", k % 2 ? "#2fb36f" : "#b650f8"); h.style.setProperty("--x", `${(Math.random() * 120 - 60).toFixed(0)}px`); h.style.animationDelay = `${k * 80}ms`; peek.appendChild(h); setTimeout(() => h.remove(), 1600); }
    });
  }

})();

