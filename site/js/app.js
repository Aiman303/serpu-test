/* Serpuru · логика сайта (без сборки, чистый JS) */
(() => {
  "use strict";
  const C = window.SERPURU;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (n) => `<svg aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const fmt = (n) => Number(n).toLocaleString("ru-RU");
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem("serpuru-" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("serpuru-" + k, JSON.stringify(v)); } catch {} },
  };
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const today = () => new Date().toISOString().slice(0, 10);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= данные ================= */
  let ROWS = null;
  const norm = (s) => String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[®™©]/g, "").replace(/[^0-9a-zа-я]+/g, " ").trim();
  const LAT = [["sch", "щ"], ["sh", "ш"], ["ch", "ч"], ["zh", "ж"], ["ts", "ц"], ["ya", "я"], ["yu", "ю"], ["yo", "е"], ["kh", "х"], ["ph", "ф"], ["a", "а"], ["b", "б"], ["c", "к"], ["d", "д"], ["e", "е"], ["f", "ф"], ["g", "г"], ["h", "х"], ["i", "и"], ["j", "дж"], ["k", "к"], ["l", "л"], ["m", "м"], ["n", "н"], ["o", "о"], ["p", "п"], ["q", "к"], ["r", "р"], ["s", "с"], ["t", "т"], ["u", "у"], ["v", "в"], ["w", "в"], ["x", "кс"], ["y", "и"], ["z", "з"]];
  const translit = (s) => { let o = ""; for (let i = 0; i < s.length;) { const hit = LAT.find(([l]) => s.startsWith(l, i)); if (hit) { o += hit[1]; i += hit[0].length; } else { o += s[i]; i++; } } return o; };
  const FORM_RX = /,|\s(?=(табл|таб\.|капс|р-р|раствор|сироп|мазь|крем|гель|суппоз|свечи|порош|пор\.|капли|спрей|аэрозол|суспенз|лиофил|драже|гранул|пастил|эмульс|концентрат|шипуч|жеват|д\/|для\s))/i;
  function splitName(name) {
    const n = name.replace(/\s+/g, " ").trim();
    const m = n.match(FORM_RX);
    if (m && m.index >= 2) {
      const title = n.slice(0, m.index).trim();
      let sub = n.slice(m.index).replace(/^[,\s]+/, "");
      sub = sub.charAt(0).toUpperCase() + sub.slice(1);
      return { title, sub };
    }
    return { title: n, sub: "" };
  }
  function formOf(n) {
    const s = n.toLowerCase();
    if (/глазн/.test(s)) return "Глазные капли";
    if (/ушн/.test(s)) return "Ушные капли";
    if (/назал|для носа|в нос/.test(s)) return "Для носа";
    if (/инъекц|инфуз|ампул|в\/в|в\/м|внутривен|внутримыш|д\/ин|для ин|лиофил|подкожн/.test(s)) return "Инъекции";
    if (/спрей|аэрозол|ингал/.test(s)) return "Спрей";
    if (/сироп/.test(s)) return "Сироп";
    if (/суспенз/.test(s)) return "Суспензия";
    if (/мазь/.test(s)) return "Мазь";
    if (/крем/.test(s)) return "Крем";
    if (/гель/.test(s)) return "Гель";
    if (/суппоз|свеч/.test(s)) return "Свечи";
    if (/капс/.test(s)) return "Капсулы";
    if (/табл|таб\.|таб\b|драже|пастил/.test(s)) return "Таблетки";
    if (/порош|пор\.|саше|гранул|\bпак/.test(s)) return "Порошок";
    if (/капли/.test(s)) return "Капли";
    if (/раствор|р-р/.test(s)) return "Раствор";
    return "";
  }
  function prep(r, i) {
    const [name, mnn, prod, country, price, bc, img, reg] = r;
    const n = norm(name), m = norm(mnn);
    const { title, sub } = splitName(name);
    return { i, name, mnn, prod, country, price, bc, img, reg, n, m, w: n.split(" "), mw: m ? m.split(" ") : [], title, sub, form: formOf(name), b: n.split(" ")[0] || "" };
  }
  const tri = (w) => { const s = `  ${w} `; const set = new Set(); for (let i = 0; i < s.length - 2; i++) set.add(s.slice(i, i + 3)); return set; };
  let BRANDS = null;
  const dataReady = fetch("data/drugs.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((j) => {
      ROWS = j.rows.map(prep);
      BRANDS = new Map();
      for (const r of ROWS) { if (r.b.length >= 4) { if (!BRANDS.has(r.b)) BRANDS.set(r.b, []); BRANDS.get(r.b).push(r.i); } }
      return ROWS;
    })
    .catch(() => { ROWS = []; return ROWS; });

  function scoreRow(r, toks, full) {
    let s = 0;
    if (r.n.startsWith(full)) s = 100; else if (r.m && r.m.startsWith(full)) s = 80;
    for (const t of toks) {
      let hit = 0;
      for (const w of r.w) if (w.startsWith(t)) { hit = 2; break; }
      if (!hit) for (const w of r.mw) if (w.startsWith(t)) { hit = 2; break; }
      if (!hit && t.length >= 3 && r.n.includes(t)) hit = 1;
      if (!hit) return 0;
      s += hit * 10;
    }
    if (r.img >= 0) s += 3;
    if (r.price) s += 2;
    if (r.form && r.form !== "Инъекции") s += 1;
    return s;
  }
  // Подсказки по симптомам: ТОЛЬКО безрецептурные средства для справки.
  // Темы, где нужен врач (давление, сердце, антибиотики, печень, мигрень), сюда не добавлять:
  // Серпу не подбирает лечение. Ключ — начало слова («болит», «боль» → «бол»), не подстрока.
  const INDICATIONS = {
    "грипп": ["парацетамол", "ибупрофен", "терафлю", "колдрекс", "фервекс"],
    "простуд": ["парацетамол", "ибупрофен", "терафлю", "колдрекс", "фервекс"],
    "орви": ["парацетамол", "ибупрофен"],
    "температур": ["парацетамол", "ибупрофен"],
    "жар": ["парацетамол", "ибупрофен"],
    "бол": ["парацетамол", "ибупрофен", "нурофен", "цитрамон", "но шпа", "дротаверин"],
    "голов": ["парацетамол", "ибупрофен", "цитрамон"],
    "живот": ["но шпа", "дротаверин", "эспумизан", "смектит"],
    "изжог": ["алмагель", "ренни", "маалокс"],
    "спазм": ["но шпа", "дротаверин"],
    "вздут": ["эспумизан"],
    "пищевар": ["мезим", "панкреатин"],
    "аллерг": ["лоратадин", "цетиризин", "дезлоратадин"],
    "зуд": ["лоратадин", "цетиризин"],
    "кашл": ["амброксол", "лазолван", "ацетилцистеин", "бромгексин", "мукалтин"],
    "мокрот": ["амброксол", "ацетилцистеин", "бромгексин"],
    "горл": ["стрепсилс", "граммидин", "септолете", "гексорал", "лизобакт", "тантум"],
    "насморк": ["ксилометазолин", "оксиметазолин", "називин", "отривин", "аква марис"],
    "сопл": ["ксилометазолин", "називин", "аква марис"],
    "заложен": ["ксилометазолин", "оксиметазолин", "називин", "отривин"],
    "диаре": ["смектит", "энтерол"],
    "понос": ["смектит", "энтерол"],
    "успоко": ["валериана", "пустырник", "глицин"],
    "нерв": ["валериана", "пустырник", "глицин"],
    "витамин": ["аскорбиновая кислота", "компливит", "супрадин"]
  };
  const symptomKeys = (v) => {
    const words = v.split(" ");
    const keys = Object.keys(INDICATIONS).filter((k) => words.some((w) => w.startsWith(k)));
    // «болит горло» — это про горло, а не про обезболивающие вообще
    return keys.length > 1 ? keys.filter((k) => k !== "бол") : keys;
  };
  // Уколы, капельницы и вагинальные формы в подсказки по симптомам не попадают
  const NOT_SELF_CARE = /инъек|инфуз|д\/инф|внутривен|внутримыш|в\/в|в\/м|ампул|парентер|вагин|концентрат/;
  let lastSymptomSearch = false;
  function search(q) {
    lastSymptomSearch = false;
    if (!ROWS) return [];
    const raw = q.trim();
    if (!raw) return [];
    const digits = raw.replace(/\s/g, "");
    if (/^\d{8,14}$/.test(digits)) return byBarcode(digits);
    const v1 = norm(raw);
    const variants = [v1];
    if (/[a-z]/.test(v1)) variants.push(translit(v1));
    const best = new Map();

    // 1. Умный поиск по симптомам / описанию («таблетки от гриппа», «от давления»)
    const targetKws = new Set();
    for (const k of symptomKeys(v1)) for (const w of INDICATIONS[k]) targetKws.add(w);
    lastSymptomSearch = targetKws.size > 0;
    const wantsForm = formOf(v1);
    if (targetKws.size) {
      for (const r of ROWS) {
        if (NOT_SELF_CARE.test(`${r.form || ""} ${r.sub || ""}`.toLowerCase())) continue;
        for (const kw of targetKws) {
          if (r.n.includes(kw) || (r.m && r.m.includes(kw))) {
            let s = 70;
            if (wantsForm && r.form && r.form.toLowerCase().includes(wantsForm.toLowerCase())) s += 25;
            if (r.price) s += 5;
            if (s > (best.get(r.i) || 0)) best.set(r.i, s);
            break;
          }
        }
      }
    }

    // 2. Прямой поиск по словам
    for (const v of variants) {
      const toks = v.split(" ").filter((t) => t && t !== "от" && t !== "для" && t !== "при");
      if (!toks.length) continue;
      for (const r of ROWS) { const s = scoreRow(r, toks, v); if (s > (best.get(r.i) || 0)) best.set(r.i, s); }
    }
    if (best.size < 3) {
      const v = variants[variants.length - 1].split(" ")[0];
      if (v && v.length >= 4) {
        const A = tri(v);
        for (const [b, ids] of BRANDS) {
          const B = tri(b); let inter = 0; for (const x of A) if (B.has(x)) inter++;
          const sim = inter / (A.size + B.size - inter);
          if (sim >= 0.38) for (const id of ids) if (!best.has(id)) best.set(id, Math.round(sim * 30));
        }
      }
    }
    return [...best.entries()].sort((a, b) => b[1] - a[1] || ROWS[a[0]].name.length - ROWS[b[0]].name.length).map(([i]) => ROWS[i]);
  }
  function byBarcode(code) {
    if (!ROWS) return [];
    const c = code.replace(/^0+/, "");
    return ROWS.filter((r) => r.bc && r.bc.split(",").some((b) => b.replace(/^0+/, "") === c));
  }
  const imgSrc = (r) => (r && r.img >= 0 ? `img/d/${r.img}.webp` : "img/serpu/pill.webp");
  const priceText = (r) => (r.price ? `≈ ${fmt(r.price)} сом` : "");
  // нет фото — рисуем аккуратную «упаковку» своего цвета с названием и формой
  const HUES = [262, 280, 300, 322, 340, 205, 188, 168, 228, 246];
  const hue = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return HUES[h % HUES.length]; };
  const FORM_ICO = { "Таблетки": "pill", "Капсулы": "pill", "Сироп": "bowl", "Суспензия": "bowl", "Глазные капли": "eye", "Ушные капли": "eye", "Для носа": "wind", "Спрей": "wind", "Мазь": "bandage", "Крем": "bandage", "Гель": "bandage", "Инъекции": "plus", "Порошок": "sparkle", "Капли": "eye", "Раствор": "bowl", "Свечи": "pill" };
  function pkg(r) {
    const word = (r.title.replace(/[®™]/g, "").split(/[\s,(]/).find((w) => w.length > 1) || r.title).slice(0, 14);
    return `<div class="pkg" style="--h:${hue(r.b || r.title)}" aria-hidden="true"><span class="pkg-band"></span><span class="pkg-ico">${icon(FORM_ICO[r.form] || "pill")}</span><span class="pkg-name">${esc(word)}</span><span class="pkg-form">${esc(r.form || "Лекарство")}</span></div>`;
  }
  const pic = (r, cls = "pic") => r.img >= 0
    ? `<div class="${cls}"><img src="${imgSrc(r)}" alt="${esc(r.title)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='img/serpu/pill.webp';this.parentNode.classList.add('empty')"></div>`
    : `<div class="${cls} gen">${pkg(r)}</div>`;

  /* ================= общие элементы ================= */
  const toastEl = $("[data-toast]");
  let toastT;
  function toast(text, sticker = "happy") {
    $("img", toastEl).src = `img/serpu/${sticker}.webp`;
    $("[data-toast-text]", toastEl).textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2800);
  }
  function fillStatic() {
    $$("[data-owners]").forEach((e) => (e.textContent = C.owners));
    $$("[data-email]").forEach((e) => { e.innerHTML = `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`; });
    $$("[data-count]").forEach((e) => (e.textContent = fmt(C.drugsCount)));
    dataReady.then((rows) => { if (rows.length) $$("[data-count]").forEach((e) => (e.textContent = fmt(rows.length))); });
  }

  // оформление: светлая/тёмная × с живым фоном/без
  const themeBtn = $("[data-theme-toggle]"), themeMenu = $("[data-theme-menu]");
  const curMode = () => `${document.documentElement.dataset.theme || "light"}-${document.documentElement.dataset.fx || "on"}`;
  function syncThemeIcon() {
    const dark = document.documentElement.dataset.theme === "dark";
    $("use", themeBtn).setAttribute("href", dark ? "#i-sun" : "#i-moon");
    $$(".theme-opt", themeMenu).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.mode === curMode())));
  }
  const setThemeMenu = (open) => { themeMenu.classList.toggle("open", open); themeBtn.setAttribute("aria-expanded", String(open)); };
  themeBtn.addEventListener("click", (e) => { e.stopPropagation(); setThemeMenu(!themeMenu.classList.contains("open")); });
  themeMenu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-mode]"); if (!b) return;
    const [t, f] = b.dataset.mode.split("-");
    document.documentElement.dataset.theme = t; document.documentElement.dataset.fx = f;
    try { localStorage.setItem("serpuru-theme", t); localStorage.setItem("serpuru-fx", f); } catch {}
    syncThemeIcon(); setThemeMenu(false);
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".theme-wrap")) setThemeMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setThemeMenu(false); });
  syncThemeIcon();

  // версия для слабовидящих: крупнее текст и элементы, выше контраст, без движущегося фона
  function syncA11y() {
    const on = document.documentElement.dataset.a11y === "on";
    $$("[data-a11y-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(on)));
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-a11y-toggle]")) return;
    const on = document.documentElement.dataset.a11y !== "on";
    document.documentElement.dataset.a11y = on ? "on" : "off";
    try { localStorage.setItem("serpuru-a11y", on ? "on" : "off"); } catch {}
    syncA11y(); setThemeMenu(false);
    toast(on ? "Включена версия для слабовидящих" : "Обычная версия", on ? "doctor" : "happy");
  });
  syncA11y();

  // мобильное меню
  const menuBtn = $(".nav-menu"), panel = $("#m-panel");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", String(!open));
    $$(".m-link", panel).forEach((a, i) => { a.style.transitionDelay = open && !reduceMotion ? `${Math.min(i * 60, 340)}ms` : "0ms"; });
    document.body.style.overflow = open ? "hidden" : "";
  }
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  panel.addEventListener("click", (e) => { if (e.target.closest("a,button")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // «скачать Серпу»
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-download]");
    if (!b) return;
    const a = document.createElement("a");
    a.href = "img/serpu/Serpu.png"; a.download = "Serpu.png";
    document.body.appendChild(a); a.click(); a.remove();
    toast("Держите Серпу! Приложение уже в пути", "love");
  });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-back]")) { if (history.length > 1) history.back(); else location.hash = ""; } });

  // появление при прокрутке
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" }) : null;
  const watchReveal = (root = document) => $$(".reveal:not(.in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  /* ================= аккаунт (Supabase) ================= */
  let sb = null, SESSION = null;
  function initSupabase() {
    if (sb || !window.supabase) return sb;
    try {
      sb = window.supabase.createClient(C.supabaseUrl, C.publishableKey, { auth: { persistSession: true, detectSessionInUrl: true, flowType: "pkce" } });
      sb.auth.getSession().then(({ data }) => {
        SESSION = data.session;
        onAuth();
        if (SESSION && (location.hash === "#login" || location.hash.includes("access_token=") || location.search.includes("code="))) {
          if (location.search.includes("code=") || location.hash.includes("access_token=")) {
            history.replaceState(null, document.title, location.pathname);
          }
          location.hash = "me";
          toast("Вход выполнен успешно!", "love");
        }
      }).catch(() => {});
      sb.auth.onAuthStateChange((event, s) => {
        SESSION = s;
        onAuth();
        if (event === "SIGNED_IN") {
          if (location.hash === "#login" || location.hash.includes("access_token=") || location.search.includes("code=")) {
            if (location.search.includes("code=") || location.hash.includes("access_token=")) {
              history.replaceState(null, document.title, location.pathname);
            }
            location.hash = "me";
            toast("Вход выполнен успешно!", "love");
          }
        }
      });
    } catch { sb = null; }
    return sb;
  }
  function onAuth() {
    const email = SESSION?.user?.email || SESSION?.user?.user_metadata?.name || "";
    const label = $("[data-account-label]"), btn = $("[data-account-btn]"), ml = $("[data-account-mlink]");
    if (SESSION) {
      label.textContent = (email.split("@")[0] || "Профиль").slice(0, 14);
      btn.setAttribute("href", "#me"); btn.setAttribute("aria-label", "Моя аптечка и профиль");
      ml.setAttribute("href", "#me"); ml.lastChild.textContent = "Профиль";
      syncKit();
      if (current === "login") location.hash = "me";
    } else {
      label.textContent = "Войти";
      btn.setAttribute("href", "#login"); btn.setAttribute("aria-label", "Войти");
      ml.setAttribute("href", "#login"); ml.lastChild.textContent = "Войти";
    }
    if (current === "me") renderMe();
  }
  const redirectTo = () => location.origin + location.pathname;

  /* ================= ИИ ================= */
  async function ai(body) {
    const headers = { "Content-Type": "application/json", apikey: C.publishableKey };
    if (SESSION?.access_token) headers.Authorization = "Bearer " + SESSION.access_token;
    let res;
    try { res = await fetch(C.aiFunction, { method: "POST", headers, body: JSON.stringify(body) }); }
    catch { throw new Error("Нет связи с Серпу. Проверьте интернет и попробуйте ещё раз."); }
    let j = null;
    try { j = await res.json(); } catch {}
    if (!res.ok || !j || !j.ok) throw new Error((j && j.message) || "Серпу сейчас не может ответить. Попробуйте через минуту.");
    return j.data;
  }

  /* ================= аптечка и история ================= */
  const keyOf = (r) => `${r.reg}|${r.name}`;
  const getKit = () => store.get("kit", []);
  const setKit = (k) => store.set("kit", k);
  const inKit = (r) => getKit().some((x) => x.key === keyOf(r));
  function findRow(item) { if (!ROWS) return null; return ROWS.find((r) => keyOf(r) === item.key) || ROWS.find((r) => r.name === item.name) || null; }
  function toggleKit(r) {
    let k = getKit();
    if (inKit(r)) { k = k.filter((x) => x.key !== keyOf(r)); setKit(k); remoteKit("delete", { reg: r.reg, name: r.name }); toast("Убрали из аптечки", "sad"); return false; }
    k.unshift({ key: keyOf(r), reg: r.reg, name: r.name, mnn: r.mnn, exp: "", added: today() });
    setKit(k); remoteKit("upsert", { reg: r.reg, name: r.name, mnn: r.mnn, expires_on: null });
    toast("Добавили в аптечку", "happy");
    serpu("love");
    return true;
  }
  async function remoteKit(op, row) {
    if (!sb || !SESSION) return;
    try {
      if (op === "delete") await sb.from("user_meds").delete().eq("reg", row.reg);
      else await sb.from("user_meds").upsert({ reg: row.reg, name: row.name, mnn: row.mnn || null, expires_on: row.expires_on || null }, { onConflict: "user_id,reg" });
    } catch {}
  }
  async function syncKit() {
    if (!sb || !SESSION) return;
    try {
      const { data, error } = await sb.from("user_meds").select("reg,name,mnn,expires_on");
      if (error) return;
      const local = getKit();
      for (const m of data) if (!local.some((x) => x.reg === m.reg)) local.push({ key: `${m.reg}|${m.name}`, reg: m.reg, name: m.name, mnn: m.mnn, exp: m.expires_on || "", added: today() });
      for (const x of local) if (!data.some((m) => m.reg === x.reg)) remoteKit("upsert", { reg: x.reg, name: x.name, mnn: x.mnn, expires_on: x.exp || null });
      setKit(local);
      if (current === "me") renderMe();
    } catch {}
  }
  function pushRecent(r) { const rec = store.get("recent", []).filter((k) => k !== keyOf(r)); rec.unshift(keyOf(r)); store.set("recent", rec.slice(0, 10)); }
  const daysLeft = (d) => Math.ceil((new Date(d + "T00:00:00") - new Date(today() + "T00:00:00")) / 864e5);
  function expBadge(exp) {
    if (!exp) return `<span class="badge">Срок годности не указан</span>`;
    const d = daysLeft(exp);
    if (d < 0) return `<span class="badge danger">Срок годности истёк</span>`;
    if (d <= 30) return `<span class="badge warn">Истекает через ${d} ${plural(d, "день", "дня", "дней")}</span>`;
    return `<span class="badge ok">Годен до ${exp.split("-").reverse().join(".")}</span>`;
  }

  /* ================= главная ================= */
  const TIPS = [
    ["Храните лекарства не в ванной: от влаги и тепла они портятся быстрее.", "thinking"],
    ["Раз в полгода разбирайте домашнюю аптечку и убирайте просроченное.", "doctor"],
    ["Рассказывайте врачу обо всех лекарствах, даже о витаминах и травах.", "doctor"],
    ["Антибиотики не помогают от вирусов, например от обычной простуды.", "thinking"],
    ["Не делитесь своими лекарствами: то, что помогло вам, может навредить другому.", "worried"],
    ["Сохраняйте коробку и инструкцию, пока принимаете лекарство.", "pill"],
    ["Пропустили приём? Посмотрите в инструкции, что делать, и не принимайте двойную порцию без совета врача.", "thinking"],
    ["Перед поездкой возьмите лекарства с запасом на пару дней.", "happy"],
    ["Держите детские лекарства отдельно от взрослых, чтобы не перепутать.", "love"],
    ["Сироп отмеряйте мерной ложкой или шприцем из упаковки, а не столовой ложкой.", "pill"],
    ["Принимайте лекарства при хорошем свете, особенно ночью: так меньше шанс перепутать.", "sleepy"],
    ["Запишите дату начала курса: врачу будет проще разобраться.", "doctor"],
    ["Таблетку надёжнее запивать обычной водой, если в инструкции не сказано иначе.", "pill"],
    ["Сыпь или отёк после лекарства — повод сразу обратиться к врачу. Отёк лица или трудно дышать — звоните 103.", "warning"],
    ["При температуре пейте больше жидкости: тёплая вода, чай, морс.", "sick"],
    ["Проветривайте комнату, даже когда болеете.", "morning"],
    ["Аптечка в машине тоже стареет: проверьте её срок годности.", "thinking"],
    ["Не храните таблетки без упаковки: потом трудно понять, что это.", "surprised"],
    ["Фармацевт может бесплатно подсказать, как сочетаются ваши лекарства.", "doctor"],
    ["Таблетку с оболочкой обычно не делят. Сначала проверьте инструкцию.", "thinking"],
    ["Лекарства, которым нужен холод, не замораживайте: так они могут испортиться.", "surprised"],
  ];
  const FAQ = [
    ["Serpuru — это врач?", "Нет. Serpuru — справочник: он помогает понять, что за лекарство у вас в руках, и подсказывает, когда идти к врачу. Диагнозов он не ставит и лечение не назначает."],
    ["Откуда данные о лекарствах?", "Из государственного реестра лекарственных средств и каталога предельных цен Министерства здравоохранения Кыргызской Республики. Мы убрали медицинские изделия и повторы."],
    ["Насколько точна цена?", "Это ориентир из каталога предельных цен Минздрава КР. В конкретной аптеке может быть дешевле или дороже. Цена есть не у всех лекарств."],
    ["Почему Серпу не говорит, сколько принимать?", "Дозировку назначает врач с учётом возраста, веса и болезней. Сколько и как часто — смотрите в инструкции или спросите врача."],
    ["Что происходит с моим фото?", "Фото нужно только чтобы прочитать название. Мы передаём его в Google Gemini и не храним у себя. Снимайте только упаковку, без документов."],
    ["Можно пользоваться без регистрации?", "Да. Поиск, сканирование и вопросы работают без входа, а аптечка хранится в вашем браузере. Аккаунт нужен, чтобы она была на всех устройствах."],
    ["Что делать, если лекарства нет в базе?", "Проверьте написание или отсканируйте штрихкод. Если препарата всё равно нет, его могли не зарегистрировать в Кыргызстане: уточните у фармацевта."],
    ["Когда выйдет приложение?", "Скоро. В приложении Серпу будет напоминать о приёме и сообщать родным, если таблетка пропущена."],
  ];
  const SHELF_ICONS = { thermometer: "thermo", flower: "flower", wind: "wind", bowl: "bowl", sun: "sun", heart: "heart", bandage: "bandage", eye: "eye" };
  const SHELF_NOTES = { heart: "Эти лекарства назначает врач.", eyes: "Капли с антибиотиком или гормоном — только по назначению врача." };
  let shelves = null, homeDone = false;
  const shelvesReady = fetch("data/shelves.json").then((r) => r.json()).then((j) => (shelves = j)).catch(() => (shelves = []));

  function greet() {
    const h = new Date().getHours();
    return h < 5 ? "Доброй ночи" : h < 12 ? "Доброе утро" : h < 18 ? "Добрый день" : "Добрый вечер";
  }
  function visitStreak() {
    const v = store.get("visits", { last: "", n: 0 });
    const t = today();
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    if (v.last !== t) { v.n = v.last === y ? v.n + 1 : 1; v.last = t; store.set("visits", v); }
    return v.n;
  }
  function renderKitSummary() {
    const k = getKit(), el = $("[data-kit-summary]");
    if (!k.length) { el.textContent = "Соберите свою аптечку: Серпу напомнит, когда у лекарства закончится срок годности."; return; }
    const bad = k.filter((x) => x.exp && daysLeft(x.exp) < 0).length, soon = k.filter((x) => x.exp && daysLeft(x.exp) >= 0 && daysLeft(x.exp) <= 30).length;
    let t = `В аптечке ${k.length} ${plural(k.length, "лекарство", "лекарства", "лекарств")}.`;
    if (bad) t += ` У ${bad} истёк срок годности.`; else if (soon) t += ` У ${soon} скоро истечёт срок.`; else t += " Со сроками всё в порядке.";
    el.textContent = t;
  }
  function renderHome() {
    $("[data-greet]").textContent = greet();
    const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    const [tip, st] = TIPS[doy % TIPS.length];
    $("[data-tip]").textContent = tip;
    const n = visitStreak();
    $("[data-streak]").textContent = n === 1 ? "Первый день с Серпу" : `${n} ${plural(n, "день", "дня", "дней")} подряд с Серпу`;
    renderKitSummary();
    if (homeDone) return;
    homeDone = true;
    $("[data-faq]").innerHTML = FAQ.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}${icon("plus")}</summary><p>${esc(a)}</p></details>`).join("");
    initTagline();
    loadShelves();
    watchReveal();
  }
  async function loadShelves() {
    await shelvesReady;
    await dataReady;
    const box = $("[data-shelves]"), chips = $("[data-shelf-chips]");
    if (!shelves.length || !ROWS.length) { box.innerHTML = `<p class="muted">Витрины не загрузились. Обновите страницу.</p>`; return; }
    chips.innerHTML = shelves.map((s) => `<button class="chip" type="button" data-shelf-jump="${s.key}">${icon(SHELF_ICONS[s.icon] || "pill")}${esc(s.title)}</button>`).join("");
    box.innerHTML = shelves.map((s) => `
      <div class="shelf reveal" id="shelf-${s.key}">
        <div class="shelf-head">
          <div class="shelf-title"><span class="ico">${icon(SHELF_ICONS[s.icon] || "pill")}</span><div><h3 class="title-1">${esc(s.title)}</h3>${SHELF_NOTES[s.key] ? `<p class="shelf-note">${SHELF_NOTES[s.key]}</p>` : ""}</div></div>
          <a class="btn btn-ghost btn-sm" href="#cat-${s.key}">Все ${fmt(s.total)}${icon("right")}</a>
        </div>
        <div class="rail">${s.ids.map((i) => ROWS[i]).filter(Boolean).map(productCard).join("")}</div>
      </div>`).join("");
    watchReveal(box);
  }
  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-shelf-jump]");
    if (j) { $(`#shelf-${j.dataset.shelfJump}`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
  });
  // короткая подпись: форма и дозировка без повторов названия
  const shortSub = (r) => (r.sub || r.form || "").slice(0, 80);
  function productCard(r) {
    return `<a class="pcard" href="#drug-${r.i}">${pic(r)}<span class="nm">${esc(r.title)}</span><span class="mn">${esc(shortSub(r) || r.mnn)}</span><span class="pd">${esc([r.prod, r.country].filter(Boolean).join(" · ") || "Производитель не указан")}</span><span class="pr${r.price ? "" : " none"}">${r.price ? priceText(r) : "Цена в аптеке"}</span></a>`;
  }

  // слоган: слова загораются по мере прокрутки
  function initTagline() {
    const el = $("[data-tagline]");
    if (!el || el.dataset.ready) return;
    el.dataset.ready = "1";
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w${i >= 2 && i <= 3 ? "" : ""}">${esc(w)}</span>`).join(" ");
    const spans = $$(".w", el);
    spans.slice(-3).forEach((s) => s.classList.add("acc"));
    if (reduceMotion) { spans.forEach((s) => s.classList.add("lit")); return; }
    let ticking = false;
    const update = () => {
      ticking = false;
      if (current !== "home") return;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("lit", i < lit));
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ================= Серпу-компаньон ================= */
  // На главной Серпу живёт в герое, на остальных страницах — в уголке экрана и реагирует на то, что происходит.
  const stage = $("#stage"), heroSlot = $(".stage-wrap"), dock = $("[data-dock]"), dockSlot = $("[data-dock-slot]"), dockBubble = $("[data-dock-bubble]");
  const serpu = (n) => { try { window.Serpu?.trigger(n); } catch {} };
  let dockT = 0;
  const say = (t, ms = 2800) => {
    if (!t) return;
    try { window.Serpu?.say(t, ms); } catch {}
  };
  document.addEventListener("serpu:say", (e) => {
    if (!dock || current === "home" || store.get("dock-hidden", false)) return;
    dockBubble.textContent = e.detail; dock.classList.add("talk");
    clearTimeout(dockT); dockT = setTimeout(() => dock.classList.remove("talk"), 2800);
  });
  function placeStage(view) {
    if (!stage || !dock) return;
    const home = view === "home", hidden = store.get("dock-hidden", false);
    if (home && stage.parentNode !== heroSlot) heroSlot.prepend(stage);
    if (!home && stage.parentNode !== dockSlot) dockSlot.appendChild(stage);
    dock.classList.toggle("on", !home);
    dock.classList.toggle("min", !home && hidden);
  }
  $("[data-dock-toggle]")?.addEventListener("click", () => {
    const h = !store.get("dock-hidden", false); store.set("dock-hidden", h); dock.classList.toggle("min", h);
    if (!h) say("Я снова тут!");
  });
  const HELLO = { search: ["Что ищем? Я помогу!", "Напиши название — найду", "Хочешь, покажу весь каталог?"], scan: ["Покажи мне коробку", "Я умею читать упаковки!"], ask: ["Как ты себя чувствуешь?", "Расскажи, что беспокоит"], me: ["Проверим сроки годности?", "Твоя аптечка тут"], login: ["Войдёшь? Я запомню аптечку"], drug: ["Спроси меня про это лекарство"], apteki: ["Найдём аптеку поближе?", "Нажми на аптеку — проложу маршрут"] };
  const pickOne = (a) => a[(Math.random() * a.length) | 0];

  /* ================= поиск и каталог ================= */
  const PAGE = 36;
  const state = { q: "", filter: "all", cat: "", sort: "best", shown: PAGE };
  const FILTERS = [["all", "Все формы"], ["price", "С ценой"], ["photo", "С фото"], ["Таблетки", "Таблетки"], ["Капсулы", "Капсулы"], ["Сироп", "Сироп"], ["Капли", "Капли"], ["cream", "Мазь, крем, гель"], ["Спрей", "Спрей"], ["Свечи", "Свечи"], ["Порошок", "Порошок"]];
  const SORTS = [["best", "Сначала лучшее"], ["az", "По алфавиту"], ["cheap", "Сначала дешевле"], ["exp", "Сначала дороже"]];
  const POPULAR = ["Парацетамол", "Ибупрофен", "Лоратадин", "Омепразол", "Амброксол", "Витамин D3", "Панкреатин", "Цетиризин"];
  const applyFilter = (list) => {
    const f = state.filter;
    if (f === "all") return list;
    if (f === "price") return list.filter((r) => r.price);
    if (f === "photo") return list.filter((r) => r.img >= 0);
    if (f === "cream") return list.filter((r) => ["Мазь", "Крем", "Гель"].includes(r.form));
    if (f === "Капли") return list.filter((r) => /Капли/.test(r.form));
    return list.filter((r) => r.form === f);
  };
  const coll = new Intl.Collator("ru", { sensitivity: "base", numeric: true });
  function sortList(list, searching) {
    const s = state.sort;
    if (s === "best" && searching) return list;
    const a = list.slice();
    if (s === "az") return a.sort((x, y) => coll.compare(x.title, y.title) || coll.compare(x.sub, y.sub));
    if (s === "cheap") return a.sort((x, y) => (x.price || 1e9) - (y.price || 1e9) || coll.compare(x.title, y.title));
    if (s === "exp") return a.sort((x, y) => (y.price || 0) - (x.price || 0) || coll.compare(x.title, y.title));
    return a.sort((x, y) => (y.img >= 0) - (x.img >= 0) || !!y.price - !!x.price || coll.compare(x.title, y.title));
  }
  function hl(text, q) {
    const t = esc(text);
    const toks = norm(q).split(" ").filter((x) => x.length >= 2).slice(0, 3);
    if (!toks.length) return t;
    try { return t.replace(new RegExp(`(${toks.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi"), "<mark>$1</mark>"); } catch { return t; }
  }
  function resultItem(r, q = "") {
    const meta = [r.mnn, r.prod, r.country].filter(Boolean).join(" · ");
    return `<a class="ritem" href="#drug-${r.i}">${pic(r)}<div class="t"><div class="nm">${hl(r.title, q)}</div><div class="sub">${esc(r.sub || r.form || "")}</div>${meta ? `<div class="meta">${esc(meta)}</div>` : ""}</div>${r.price ? `<span class="pr">${priceText(r)}</span>` : `<span class="pr none">Цена в аптеке</span>`}</a>`;
  }
  const shelfOf = (k) => (shelves || []).find((s) => s.key === k);
  function renderFilters() {
    $("[data-filters]").innerHTML = FILTERS.map(([k, t]) => `<button class="chip chip-sm" type="button" data-filter="${k}" aria-pressed="${state.filter === k}">${t}</button>`).join("");
    const cats = $("[data-cats]");
    if (cats && shelves) cats.innerHTML = `<button class="cat${state.cat ? "" : " on"}" type="button" data-cat="">${icon("kit")}<span>Все лекарства</span><b>${fmt(ROWS ? ROWS.length : C.drugsCount)}</b></button>` +
      shelves.map((s) => `<button class="cat${state.cat === s.key ? " on" : ""}" type="button" data-cat="${s.key}">${icon(SHELF_ICONS[s.icon] || "pill")}<span>${esc(s.title)}</span><b>${fmt(s.total)}</b></button>`).join("");
    const on = cats && $(".cat.on", cats);
    if (on && cats.scrollWidth > cats.clientWidth) cats.scrollTo({ left: on.offsetLeft - 16, behavior: "auto" });
    const sel = $("[data-sort]");
    if (sel && !sel.options.length) sel.innerHTML = SORTS.map(([k, t]) => `<option value="${k}">${t}</option>`).join("");
    if (sel) sel.value = state.sort;
  }
  let memoKey = "", memoList = [], lastReactQ = null;
  const reactSoon = debounce((q, n) => {
    if (current !== "search" || q === lastReactQ) return;
    lastReactQ = q;
    if (!q) return;
    if (n) { serpu("found"); say(n === 1 ? "Нашёл! Вот оно" : `Нашёл ${fmt(n)} ${plural(n, "препарат", "препарата", "препаратов")}!`); }
    else { serpu("sad"); say("Хм… такого не знаю. Проверь написание?"); }
  }, 700);
  function listFor(q) {
    const key = `${q}|${state.cat}|${state.filter}|${state.sort}|${ROWS.length}`;
    if (key === memoKey) return memoList;
    let base;
    if (q) base = search(q); else if (state.cat) base = (shelfOf(state.cat)?.all || []).map((i) => ROWS[i]).filter(Boolean); else base = ROWS;
    if (q && state.cat) { const allow = new Set(shelfOf(state.cat)?.all || []); base = base.filter((r) => allow.has(r.i)); }
    memoKey = key; memoList = sortList(applyFilter(base), !!q);
    return memoList;
  }
  async function runSearch(append) {
    const out = $("[data-results]"), meta = $("[data-search-meta]"), more = $("[data-more]"), title = $("[data-search-title]");
    const q = state.q.trim();
    try { sessionStorage.setItem("serpuru-q", q); } catch {}
    if (!ROWS || !shelves) {
      out.className = "results grid";
      out.innerHTML = Array.from({ length: 8 }, () => `<div class="sk sk-card"></div>`).join("");
      await dataReady; await shelvesReady; renderFilters();
    }
    const shelf = shelfOf(state.cat);
    title.textContent = q ? "Поиск лекарства" : shelf ? shelf.title : "Каталог лекарств";
    $("[data-popular]").innerHTML = q ? "" : `<span class="caption-4 faint">Часто ищут:</span>${POPULAR.map((p) => `<button class="chip chip-sm" type="button" data-q="${esc(p)}">${esc(p)}</button>`).join("")}`;
    const all = listFor(q);
    reactSoon(q, all.length);
    if (!all.length) {
      meta.textContent = "";
      more.hidden = true;
      out.className = "results";
      out.innerHTML = `<div class="empty-state"><img src="img/serpu/thinking.webp" alt=""><h2 class="heading-6">${q ? `Серпу не нашёл «${esc(q)}»` : "Здесь пока пусто"}</h2><p class="muted">${q ? "Проверьте написание или попробуйте действующее вещество. Ещё можно отсканировать упаковку." : "Попробуйте другой фильтр."}</p><div class="row" style="justify-content:center">${q ? `<a class="btn btn-primary" href="#scan">${icon("camera")}Сканировать</a>` : ""}${state.filter !== "all" ? `<button class="btn btn-ghost" type="button" data-filter="all">Сбросить фильтр</button>` : ""}${state.cat ? `<button class="btn btn-ghost" type="button" data-cat="">Искать во всём каталоге</button>` : ""}</div></div>`;
      return;
    }
    const word = plural(all.length, "препарат", "препарата", "препаратов");
    meta.innerHTML = q ? `Найдено <b>${fmt(all.length)}</b> ${word}${shelf ? ` в разделе «${esc(shelf.title)}»` : ""}${lastSymptomSearch ? `<span class="note warnline" style="margin-top:12px">${icon("info")}<span>По симптому показаны безрецептурные средства — только для справки. Что подходит именно вам, подскажет фармацевт или врач. Если плохо прямо сейчас — 103.</span></span>` : ""}` : `<b>${fmt(all.length)}</b> ${word} · ${fmt(all.filter((r) => r.img >= 0).length)} с фото`;
    const grid = !q;
    out.className = grid ? "results grid" : "results";
    const render = grid ? productCard : (r) => resultItem(r, q);
    if (append) {
      const from = out.children.length;
      out.insertAdjacentHTML("beforeend", all.slice(from, state.shown).map(render).join(""));
    } else out.innerHTML = all.slice(0, state.shown).map(render).join("");
    more.hidden = all.length <= state.shown;
    more.textContent = `Показать ещё (${fmt(all.length - Math.min(all.length, state.shown))})`;
  }
  const runSearchSoon = debounce(() => runSearch(false), 140);
  function renderSearch(cat) {
    const inp = $("#q-page");
    if (cat !== undefined) { state.cat = cat; state.q = ""; state.filter = "all"; }
    else if (!state.q) { try { state.q = sessionStorage.getItem("serpuru-q") || ""; } catch {} }
    inp.value = state.q;
    state.shown = PAGE;
    if (ROWS && shelves) renderFilters();
    runSearch(false);
    if (matchMedia("(min-width: 900px)").matches && cat === undefined) setTimeout(() => inp.focus({ preventScroll: true }), 50);
  }
  $("#q-page").addEventListener("input", (e) => { state.q = e.target.value; state.shown = PAGE; runSearchSoon(); });
  $("[data-sort]")?.addEventListener("change", (e) => { state.sort = e.target.value; state.shown = PAGE; runSearch(false); });
  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-filter]");
    if (f) { state.filter = f.dataset.filter; state.shown = PAGE; renderFilters(); runSearch(false); }
    const c = e.target.closest("[data-cat]");
    if (c) {
      state.cat = c.dataset.cat; state.shown = PAGE; renderFilters(); runSearch(false);
      history.replaceState(null, "", state.cat ? `#cat-${state.cat}` : "#search");
      const s = shelfOf(state.cat); if (s && !state.q) say(`${s.title}: ${fmt(s.total)} ${plural(s.total, "препарат", "препарата", "препаратов")}`);
    }
    const q = e.target.closest("[data-q]");
    if (q) { state.q = q.dataset.q; if (current === "search") { $("#q-page").value = state.q; runSearch(false); } else location.hash = "search"; }
  });
  $("[data-more]").addEventListener("click", () => { state.shown += PAGE; runSearch(true); });
  // бесконечная прокрутка: подгружаем следующую порцию, когда кнопка «ещё» показалась на экране
  if ("IntersectionObserver" in window) new IntersectionObserver((es) => { if (es[0].isIntersecting && current === "search" && !$("[data-more]").hidden) { state.shown += PAGE; runSearch(true); } }, { rootMargin: "600px 0px" }).observe($("[data-more]"));
  $$("[data-search-form]").forEach((f) => {
    f.addEventListener("submit", (e) => { e.preventDefault(); const v = f.q.value.trim(); state.q = v; if (current !== "search") location.hash = "search"; else runSearch(); });
    if (f.dataset.searchForm !== "page") f.q.addEventListener("input", debounce(() => { const v = f.q.value.trim(); if (v.length >= 3) { state.q = v; location.hash = "search"; } }, 650));
  });

  /* ================= карточка препарата ================= */
  const TOPIC_CHIPS = [["what", "Что это за лекарство"], ["how", "Как принимать"], ["alcohol", "Можно с алкоголем?"], ["food", "С едой или без?"], ["side", "Побочные эффекты"], ["mix", "С чем нельзя сочетать"], ["kids", "Детям и беременным"]];
  const MEMO = {
    oral: ["Запивайте обычной водой, если в инструкции не сказано иначе.", "Не делите и не разжёвывайте таблетку с оболочкой, если это не разрешено в инструкции."],
    liquid: ["Суспензию взбалтывайте перед приёмом.", "Отмеряйте мерной ложкой или шприцем из упаковки, а не столовой ложкой.", "После вскрытия флакона проверьте в инструкции, сколько его можно хранить."],
    eye: ["Мойте руки перед закапыванием.", "Не касайтесь кончиком флакона глаза и ресниц.", "Носите линзы? Уточните в инструкции, нужно ли их снимать."],
    nose: ["Не пользуйтесь одним флаконом вдвоём.", "Сосудосуживающие средства не применяйте дольше срока из инструкции."],
    skin: ["Наносите на чистую сухую кожу.", "Не наносите на открытые раны и слизистые, если в инструкции этого нет."],
    supp: ["Проверьте в инструкции, где хранить: многие свечи держат в холодильнике."],
    inj: ["Инъекции делает медицинский работник или человек, которого он обучил."],
  };
  function memoFor(r) {
    const f = r.form;
    const base = /Глазн|Ушн/.test(f) ? MEMO.eye : f === "Для носа" || f === "Спрей" ? MEMO.nose : ["Мазь", "Крем", "Гель"].includes(f) ? MEMO.skin : f === "Свечи" ? MEMO.supp : f === "Инъекции" ? MEMO.inj : ["Сироп", "Суспензия"].includes(f) ? MEMO.liquid : ["Таблетки", "Капсулы", "Порошок"].includes(f) ? MEMO.oral : [];
    return [...base, "Перед первым приёмом прочитайте инструкцию-вкладыш.", "Проверьте срок годности на упаковке.", "Храните в недоступном для детей месте."];
  }
  function analogsOf(r) {
    if (!r.m || r.m.length < 4 || /комбинирован/.test(r.m)) return [];
    return ROWS.filter((x) => x.i !== r.i && x.m === r.m).sort((a, b) => (b.price ? 1 : 0) - (a.price ? 1 : 0) || (a.price || 0) - (b.price || 0) || (b.img >= 0) - (a.img >= 0));
  }
  async function renderDrug(i) {
    const box = $("[data-drug]");
    if (!ROWS) { box.innerHTML = `<div class="drug-top"><div class="sk" style="aspect-ratio:1;max-width:360px;border-radius:24px"></div><div><div class="sk sk-line" style="width:70%;height:32px"></div><div class="sk sk-line" style="width:40%"></div><div class="sk sk-line" style="width:90%;height:80px"></div></div></div>`; await dataReady; }
    const r = ROWS[i];
    if (!r) { show("notfound"); return; }
    document.title = `${r.title} — Serpuru`;
    pushRecent(r);
    const an = analogsOf(r);
    const firstBc = (r.bc || "").split(",")[0];
    box.innerHTML = `
      <button class="back" type="button" data-back>${icon("left")}Назад</button>
      <div class="drug-top">
        ${pic(r, "drug-pic")}
        <div class="stack-16">
          <div class="chips">${r.form ? `<span class="badge accent">${esc(r.form)}</span>` : ""}${r.mnn ? `<span class="badge">МНН: ${esc(r.mnn)}</span>` : ""}</div>
          <h1 class="heading-3">${esc(r.title)}</h1>
          ${r.sub ? `<p class="body-2 muted">${esc(r.sub)}</p>` : ""}
          <div class="price-box">
            ${r.price ? `<span class="big">≈ ${fmt(r.price)} сом</span><span class="caption-1 muted">Ориентир по каталогу цен Минздрава КР. В аптеке может быть дешевле или дороже.</span>` : `${icon("info")}<span class="caption-1 muted">Цены на это лекарство нет в каталоге Минздрава КР. Уточните в аптеке.</span>`}
          </div>
          <div class="facts">
            <div class="fact"><div class="k">Производитель</div><div class="v">${esc(r.prod || "Не указан")}</div></div>
            <div class="fact"><div class="k">Страна</div><div class="v">${esc(r.country || "Не указана")}</div></div>
            <div class="fact"><div class="k">Рег. номер</div><div class="v">${esc(r.reg)}</div></div>
            <div class="fact"><div class="k">Штрихкод</div><div class="v">${esc(firstBc || "Нет в реестре")}</div></div>
          </div>
          <div class="row">
            <button class="btn ${inKit(r) ? "btn-soft" : "btn-primary"}" type="button" data-kit-toggle>${icon(inKit(r) ? "check" : "plus")}<span>${inKit(r) ? "В аптечке" : "В мою аптечку"}</span></button>
            <button class="btn btn-ghost" type="button" data-copy-link>${icon("copy")}Ссылка</button>
          </div>
        </div>
      </div>
      <div class="drug-cols">
        <section class="card stack-16" aria-labelledby="ask-title">
          <div class="ask-head"><img src="img/serpu/thinking.webp" alt=""><div><h2 class="heading-6" id="ask-title">Спросить Серпу</h2><p class="caption-1 muted">Справка об этом лекарстве простыми словами</p></div></div>
          <div class="chips">${TOPIC_CHIPS.map(([k, t]) => `<button class="chip" type="button" data-topic="${k}">${esc(t)}</button>`).join("")}</div>
          <form class="ask-form" data-ask-form><input class="field" name="q" maxlength="300" placeholder="Свой вопрос про это лекарство" aria-label="Свой вопрос"><button class="btn btn-primary" type="submit" aria-label="Спросить">${icon("right")}</button></form>
          <div data-answer aria-live="polite"></div>
          <p class="caption-5 faint">Справка Серпу не заменяет врача. Сколько и как часто принимать — по инструкции или как назначил врач.</p>
        </section>
        <div class="stack-24">
          <section class="card buy" aria-labelledby="buy-title">
            <h2 class="title-1" id="buy-title">Где купить</h2>
            <div class="buy-sum" data-buy-sum aria-live="polite"><span class="sk sk-line" style="width:70%"></span></div>
            <p class="caption-1 muted">На карте — аптеки Бишкека, где оно есть, и цены, сначала дешевле. Маршрут — в 2ГИС, Google или Яндекс Картах.</p>
            <div class="row">
              <a class="btn btn-primary" href="#apteki-${i}">${icon("map")}Где есть и почём</a>
            </div>
          </section>
          <section class="card-soft stack-16" aria-labelledby="memo-title">
            <h2 class="title-1" id="memo-title">Памятка без ИИ</h2>
            <ul class="memo">${memoFor(r).map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
          </section>
          <section class="stack-16" aria-labelledby="an-title">
            <h2 class="title-1" id="an-title">С тем же действующим веществом</h2>
            ${an.length ? `<div class="analogs">${an.slice(0, 10).map((x) => `<a class="analog" href="#drug-${x.i}"><span class="nm">${esc(x.title)} <span class="faint">${esc(x.sub)}</span></span><span class="pr">${x.price ? priceText(x) : ""}</span></a>`).join("")}</div>
              ${an.length > 10 ? `<a class="btn btn-ghost btn-sm" href="#search" data-q-set="${esc(r.mnn)}">Все ${an.length}${icon("right")}</a>` : ""}
              <div class="note">${icon("info")}<span>Замену лекарства согласуйте с врачом или фармацевтом.</span></div>`
              : `<p class="muted body-6">${r.mnn ? "Других препаратов с этим веществом в реестре нет." : "Действующее вещество не указано в реестре. Спросите Серпу: «Что это за лекарство»."}</p>`}
          </section>
        </div>
      </div>`;
    const ans = $("[data-answer]", box);
    const ask = async (body, label) => {
      serpu("think"); say("Дай подумать…", 0);
      ans.innerHTML = `<div class="answer"><p class="title-4">${esc(label)}</p><div class="sk sk-line" style="width:92%"></div><div class="sk sk-line" style="width:80%"></div><div class="sk sk-line" style="width:64%"></div></div>`;
      try {
        const d = await ai({ kind: "ask", drug: { name: r.name, mnn: r.mnn, producer: r.prod, country: r.country }, ...body });
        serpu("talk"); say("Вот что я знаю");
        ans.innerHTML = `<div class="answer"><p class="title-4">${esc(label)}</p><p style="margin-top:8px">${esc(d.answer)}</p>${d.points?.length ? `<ul>${d.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}${d.warning ? `<div class="note warn warnline">${icon("alert")}<span>${esc(d.warning)}</span></div>` : ""}${d.ask_doctor ? `<div class="note warnline">${icon("info")}<span>Этот вопрос лучше обсудить с врачом.</span></div>` : ""}</div>`;
      } catch (e) {
        serpu("sad"); say("Не получилось ответить");
        ans.innerHTML = `<div class="note warn">${icon("alert")}<span>${esc(e.message)}</span></div>`;
      }
    };
    $$("[data-topic]", box).forEach((b) => b.addEventListener("click", () => { $$("[data-topic]", box).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); ask({ topic: b.dataset.topic }, b.textContent); }));
    $("[data-ask-form]", box).addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.q.value.trim(); if (v.length < 3) { e.target.q.focus(); return; } ask({ question: v }, v); });
    $("[data-kit-toggle]", box).addEventListener("click", (e) => { const on = toggleKit(r); const b = e.currentTarget; b.className = `btn ${on ? "btn-soft" : "btn-primary"}`; b.innerHTML = `${icon(on ? "check" : "plus")}<span>${on ? "В аптечке" : "В мою аптечку"}</span>`; });
    $("[data-copy-link]", box).addEventListener("click", async () => { try { await navigator.clipboard.writeText(location.href); toast("Ссылка скопирована", "yes"); } catch { toast("Не получилось скопировать. Скопируйте адрес из строки браузера", "thinking"); } });
    $("[data-q-set]", box)?.addEventListener("click", (e) => { state.q = e.currentTarget.dataset.qSet; });
    // Сразу показать, есть ли в аптеках и почём (справочник apteki.kg)
    (async () => {
      const sum = $("[data-buy-sum]", box);
      try {
        const res = await stockResolve(r.name || r.title, r.mnn, `${r.title} ${r.sub || ""}`);
        if (!sum.isConnected) return;
        if (!res.variants.length) {
          sum.innerHTML = res.known
            ? `<span>Есть в каталоге аптек, но цену сейчас не сообщила ни одна аптека Бишкека.</span><br><span class="caption-1 muted">Позвоните в ближайшую — номера на карте.</span>`
            : `<span class="muted">Нет в справочнике цен аптек Бишкека — возможно, продаётся только в больницах или под другим названием.</span>`;
          return;
        }
        const v = res.variants[0];
        const offers = (await stockGet({ slug: v.slug })).offers;
        if (!sum.isConnected) return;
        const prices = offers.map((o) => o.price).filter((x) => x != null);
        sum.innerHTML = `${res.mode === "mnn" ? `<span class="caption-1 muted">Точно такого нет — с тем же веществом:</span><br>` : ""}<b>${esc(v.title)}</b><br>есть в <b>${offers.length}</b> ${plural(offers.length, "аптеке", "аптеках", "аптеках")}${prices.length ? `, от <b class="buy-price">${som(Math.min(...prices))}</b>` : ""}`;
      } catch { if (sum.isConnected) sum.innerHTML = `<span class="muted">Цены сейчас не загрузились — откройте карту, попробуем ещё раз.</span>`; }
    })();
  }


  /* ================= аптеки на карте ================= */
  // Поиск на apteki.kg: по короткому торговому названию — так находится больше предложений.
  // (старый переход на apteki.kg больше не используется — цены показываем сами)
  const aptekiUrl = (r) => `https://apteki.kg/search?q=${encodeURIComponent((r.name || r.title || "").split(/[,(]/)[0].trim())}`;
  const CITY = [42.8746, 74.5698];
  const routeUrl = (app, p) => app === "2gis" ? `https://2gis.kg/bishkek/directions/points/%7C${p.lon}%2C${p.lat}`
    : app === "google" ? `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`
    : `https://yandex.ru/maps/?rtext=~${p.lat}%2C${p.lon}&rtt=auto`;
  const routeBtns = (p) => `<div class="ph-acts">
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${routeUrl("2gis", p)}"><span class="mapdot m2gis"></span>2ГИС</a>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${routeUrl("google", p)}"><span class="mapdot mgoogle"></span>Google</a>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="${routeUrl("yandex", p)}"><span class="mapdot myandex"></span>Яндекс</a>
      ${p.p ? `<a class="btn btn-ghost" href="tel:${esc(p.p.replace(/[^\d+]/g, ""))}">${icon("phone")}Позвонить</a>` : ""}
    </div>`;
  const km = (a, b) => { const R = 6371, t = Math.PI / 180, dLa = (b[0] - a[0]) * t, dLo = (b[1] - a[1]) * t; const h = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const kmText = (d) => d < 1 ? `${Math.max(50, Math.round(d * 20) * 50)} м` : `${d.toFixed(1).replace(".", ",")} км`;
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const is24 = (p) => /24\/7|круглос/i.test(p.h);
  const ph = { list: null, map: null, L: null, tiles: null, markers: [], me: null, meMarker: null, filter: "all", q: "", sel: -1, drug: null };
  let leafletReady = null;
  function loadLeaflet() {
    if (leafletReady) return leafletReady;
    leafletReady = new Promise((ok, fail) => {
      const css = document.createElement("link");
      css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);
      const js = document.createElement("script");
      js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      js.onload = () => ok(window.L); js.onerror = () => { leafletReady = null; fail(new Error("map")); };
      document.head.appendChild(js);
    });
    return leafletReady;
  }
  function pharmItems() {
    const q = ph.q.toLowerCase();
    let a = ph.list.map((p, i) => ({ p, i, d: ph.me ? km(ph.me, [p.lat, p.lon]) : null }));
    if (ph.filter === "24") a = a.filter((x) => is24(x.p));
    if (ph.filter === "named") a = a.filter((x) => x.p.n !== "Аптека");
    if (q) a = a.filter((x) => `${x.p.n} ${x.p.a}`.toLowerCase().includes(q));
    a.sort((x, y) => ph.me ? x.d - y.d : (x.p.n === "Аптека") - (y.p.n === "Аптека") || x.p.n.localeCompare(y.p.n, "ru"));
    return a;
  }
  function phSub(p) {
    const bits = [];
    if (p.a) bits.push(esc(p.a));
    if (p.h) bits.push(is24(p) ? "круглосуточно" : esc(p.h));
    return bits.join(" · ") || "Адрес уточните в 2ГИС";
  }
  function renderPharmList() {
    if (st.q) return stockList(); // режим «где купить»: список цен
    const items = pharmItems(), shown = items.slice(0, 60);
    $("[data-pharm-meta]").textContent = items.length
      ? `${ph.me ? "Ближе всего к вам" : "Найдено"}: ${items.length} ${plural(items.length, "аптека", "аптеки", "аптек")}${items.length > shown.length ? ` · показаны первые ${shown.length}` : ""}`
      : "Ничего не нашлось. Попробуйте другое название или улицу.";
    $("[data-pharm-list]").innerHTML = shown.map(({ p, i, d }) => `
      <div class="ph${i === ph.sel ? " on" : ""}" data-ph="${i}">
        <button class="ph-head" type="button" data-ph-go="${i}">
          <span class="ph-ico">${icon(is24(p) ? "flame" : "store")}</span>
          <span style="min-width:0"><span class="ph-name">${esc(p.n)}</span><br><span class="ph-sub">${phSub(p)}</span></span>
          ${d != null ? `<span class="ph-km">${kmText(d)}</span>` : ""}
        </button>
        ${i === ph.sel ? routeBtns(p) : ""}
      </div>`).join("");
    const vis = new Set(items.map((x) => x.i));
    ph.markers.forEach((m, i) => { if (!m) return; const on = vis.has(i); if (on && !ph.map.hasLayer(m)) m.addTo(ph.map); else if (!on && ph.map.hasLayer(m)) m.remove(); });
  }
  function pinIcon(p, on) { return ph.L.divIcon({ className: "", html: `<div class="pin${is24(p) ? " h24" : ""}${on ? " on" : ""}"></div>`, iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -22] }); }
  function selectPharm(i, fly = true) {
    const prev = ph.sel; ph.sel = i;
    if (prev >= 0 && ph.markers[prev]) ph.markers[prev].setIcon(pinIcon(ph.list[prev], false));
    const p = ph.list[i], m = ph.markers[i];
    if (m) {
      m.setIcon(pinIcon(p, true));
      if (fly) {
        // Сначала долетаем, потом открываем подсказку: иначе автосдвиг попапа спорит с анимацией.
        if (ph.map) {
          ph.map.closePopup();
          ph.map.once("moveend", () => m.openPopup());
          ph.map.flyTo([p.lat, p.lon], Math.max(ph.map.getZoom(), 16), { duration: 0.6 });
        }
        // На телефоне карта над списком — показываем её.
        if (innerWidth < 900) { const box = $("[data-pharm-map]"); window.scrollTo({ top: box.getBoundingClientRect().top + scrollY - 88, behavior: "smooth" }); }
      } else m.openPopup();
    }
    renderPharmList();
    if (!fly || innerWidth >= 900) $(`[data-ph="${i}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  // ---------- где купить: наличие и цены (справочник apteki.kg через функцию serpu-stock) ----------
  const stockQueryOf = (name) => {
    const q = String(name || "").split(/[,(]/)[0].replace(/®/g, "").trim();
    return /[a-z]/i.test(q) && !/[а-яё]/i.test(q) ? translit(q.toLowerCase()) : q; // справочник понимает только кириллицу
  };
  const stockCache = new Map();
  async function stockGet(params) {
    const key = JSON.stringify(params);
    if (stockCache.has(key)) return stockCache.get(key);
    if (params.slug && params.slug.startsWith("local:")) {
      return { ok: true, title: "", offers: [], source: "Выгрузка сети аптек Бишкека" };
    }
    const r = await fetch(`${C.supabaseUrl}/functions/v1/serpu-stock?${new URLSearchParams(params)}`, { headers: { apikey: C.publishableKey } });
    const j = await r.json().catch(() => ({ ok: false }));
    if (!j.ok) throw new Error(j.error || "Справочник цен сейчас недоступен");
    stockCache.set(key, j);
    return j;
  }
  const som = (p) => `${Number.isInteger(p) ? p : p.toFixed(2)} сом`;
  const st = { q: "", mode: "name", variants: [], variant: null, offers: null, loading: false, error: "", layer: null, markers: [] };
  const offerTitle = (o) => o.chain && !o.pharmacy.includes(o.chain) ? `${o.chain} · ${o.pharmacy}` : o.pharmacy;
  const offerPopup = (o) => `<div class="ph-name">${esc(offerTitle(o))}</div><div class="ph-sub">${esc(o.address)}${o.hours ? ` · ${esc(o.hours)}` : ""}</div>
    <div class="offer-price">${o.price == null ? "Цена уточняется" : som(o.price)}${o.status ? ` <span>${esc(o.status)}</span>` : ""}</div>
    ${o.lat != null ? routeBtns({ lat: o.lat, lon: o.lon, p: o.phone }) : ""}
    ${o.buyUrl ? `<a class="btn btn-ghost btn-sm" style="margin-top:6px" target="_blank" rel="noopener" href="${esc(o.buyUrl)}">${icon("store")}Заказать на сайте аптеки</a>` : ""}`;
  function stockBanner() {
    const box = $("[data-pharm-drug]");
    if (!st.q) {
      box.innerHTML = `<form class="pharm-find" data-stock-form><label class="searchbar"><svg><use href="#i-pill"/></svg><input type="search" name="q" placeholder="Где купить лекарство? Например, ибупрофен" aria-label="Лекарство" autocomplete="off"></label><button class="btn btn-primary" type="submit">${icon("search")}Найти</button></form>`;
      return;
    }
    const head = st.loading ? `<span>Ищу <b>${esc(st.q)}</b> по аптекам Бишкека…</span>`
      : st.error ? `<span>${esc(st.error)}</span>`
      : st.offers ? `<span>${st.mode === "mnn" ? `Точно «${esc(st.q)}» нет в справочнике — показываю с тем же действующим веществом: ` : ""}<b>${esc(st.variant?.title || st.q)}</b> — есть в ${st.offers.length} ${plural(st.offers.length, "аптеке", "аптеках", "аптеках")}${st.offers[0]?.price != null ? `, от <b>${som(st.offers[0].price)}</b>` : ""}</span>` : "";
    box.innerHTML = `<div class="pharm-drug">${head}<button class="btn btn-ghost btn-sm" type="button" data-stock-clear>${icon("close")}Все аптеки</button></div>
      ${st.variants.length > 1 ? `<div class="chips scroll" style="margin-top:10px">${st.variants.slice(0, 8).map((v, k) => `<button class="chip" type="button" data-stock-v="${k}" aria-pressed="${v === st.variant}">${esc(v.title)}${v.minPrice != null ? ` · от ${som(v.minPrice)}` : ""}</button>`).join("")}</div>` : ""}
      <p class="caption-5 faint" style="margin-top:8px">Цены и наличие справочные (apteki.kg), обновляются с сайтов аптек. Перед поездкой лучше позвонить в аптеку.</p>`;
  }
  function stockList() {
    const offers = st.offers || [];
    const rows = offers.map((o, k) => ({ o, k, d: ph.me && o.lat != null ? km(ph.me, [o.lat, o.lon]) : null }));
    if (ph.me) rows.sort((a, b) => (a.o.price ?? 1e9) - (b.o.price ?? 1e9) || (a.d ?? 1e9) - (b.d ?? 1e9));
    $("[data-pharm-meta]").textContent = st.loading ? "Ищу…" : offers.length ? "Сначала дешевле. Нажмите на аптеку — цена, маршрут, звонок." : "";
    $("[data-pharm-list]").innerHTML = rows.map(({ o, k, d }) => `
      <div class="ph" data-offer="${k}">
        <button class="ph-head" type="button" data-offer-go="${k}">
          <span class="ph-ico">${icon("store")}</span>
          <span style="min-width:0"><span class="ph-name">${esc(offerTitle(o))}</span><br><span class="ph-sub">${esc(o.address)}${d != null ? ` · ${kmText(d)}` : ""}</span></span>
          <span class="ph-km">${o.price == null ? "—" : som(o.price)}</span>
        </button>
      </div>`).join("");
  }
  function stockMarkers() {
    if (!ph.map) return;
    if (st.layer) st.layer.remove();
    const showAll = !st.q;
    ph.markers.forEach((m) => { if (!m) return; if (showAll && !ph.map.hasLayer(m)) m.addTo(ph.map); if (!showAll && ph.map.hasLayer(m)) m.remove(); });
    if (showAll || !st.offers) return;
    st.layer = ph.L.layerGroup().addTo(ph.map);
    st.markers = st.offers.map((o) => o.lat == null ? null : ph.L.marker([o.lat, o.lon], {
      icon: ph.L.divIcon({ className: "", html: `<div class="price-pin-wrap"><div class="price-pin">${o.price == null ? "?" : som(o.price)}</div></div>`, iconSize: [84, 30], iconAnchor: [42, 15], popupAnchor: [0, -14] }),
      title: `${offerTitle(o)} — ${o.price == null ? "цена уточняется" : som(o.price)}`, keyboard: true,
    }).bindPopup(offerPopup(o)).addTo(st.layer));
    const pts = st.offers.filter((o) => o.lat != null).map((o) => [o.lat, o.lon]);
    if (pts.length) ph.map.fitBounds(pts, { padding: [30, 30], maxZoom: 15 });
  }
  function stockRender() {
    stockBanner();
    // фильтры аптек (улица, круглосуточные) в режиме «где купить» не нужны
    $(".pharm-tools").hidden = !!st.q; $("[data-pharm-filters]").hidden = !!st.q;
    if (st.q) stockList(); else renderPharmList();
    stockMarkers();
  }
  async function stockPick(v) {
    st.variant = v; st.offers = null; st.loading = true; st.error = ""; stockRender();
    try {
      const j = await stockGet({ slug: v.slug });
      if (st.variant !== v) return;
      st.offers = j.offers.slice().sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
      if (!st.offers.length) st.error = "Сейчас этого варианта нет в аптеках Бишкека";
    } catch (e) { st.error = e.message; }
    st.loading = false; stockRender();
    if (st.offers?.length) { serpu("found"); say(`Нашёл в ${st.offers.length} ${plural(st.offers.length, "аптеке", "аптеках", "аптеках")}!`); }
  }
  // Подбор запроса для справочника цен: названия в реестре и в аптеках пишут по-разному
  // («Глирайд-4, таблетки, 4 мг» → «Глирайд»). Общие слова («таблетки», «масло») запросом не бывают.
  const STOCK_STOP = /^(таблетки|таблетка|капсулы|раствор|порошок|масло|мазь|гель|сироп|капли|спрей|витамин|витамины|вакцина|концентрат|набор|система|субстанция|лиофилизат|суспензия|крем|настойка|экстракт|сбор|чай)$/i;
  const cleanName = (n) => String(n || "").split(/[,(]/)[0].replace(/[®™]/g, "").replace(/\s*№.*$/, "")
    .replace(/\s+\d[\d.,]*\s*(мг|мл|г|мкг|%|ме)?(\s.*)?$/i, "").replace(/\s+/g, " ").trim().replace(/^[-\s]+|[-\s]+$/g, "");
  function stockCandidates(name, mnn) {
    const out = [];
    const add = (q, mode) => { q = stockQueryOf(q); if (q.length >= 3 && !STOCK_STOP.test(q) && !out.some((c) => c.q === q)) out.push({ q, mode }); };
    const c1 = cleanName(name); add(c1, "name");
    const c2 = c1.replace(/[-\s]+[\wа-яё]*\d[\wа-яё]*$/i, "").replace(/\s+[a-zа-я]{1,2}r$/i, "").trim(); add(c2, "name");
    const w = (c2 || c1).split(" ")[0]; if (w.length >= 4) add(w, "name");
    if (w.includes("-") && w.split("-")[0].length >= 5) add(w.split("-")[0], "name");
    if (mnn) add(cleanName(String(mnn).split("+")[0]), "mnn");
    return out;
  }
  // Вариант с той же дозировкой, упаковкой и формой, что в карточке реестра
  function scoreVariant(v, full) {
    const t = v.title.toLowerCase(), f = String(full || "").toLowerCase();
    let sc = Math.min(v.count, 200) / 200;
    for (const m of f.matchAll(/(\d+[.,]?\d*)\s*(мг|мл|г|мкг|%)/g)) if (t.includes(m[1].replace(",", "."))) sc += 2;
    const pack = f.match(/№\s*(\d+)/); if (pack && t.includes(`№${pack[1]}`)) sc += 2;
    for (const form of ["таблетк", "капсул", "сироп", "суспенз", "мазь", "гель", "крем", "раствор", "спрей", "капли", "порошок", "свеч", "суппозит"]) if (f.includes(form) && t.includes(form)) sc += 1.5;
    return sc;
  }
  // Найти лекарство в справочнике цен: по названию, потом по действующему веществу (с пометкой)
  async function stockResolve(name, mnn, full) {
    let known = null; // есть в каталоге apteki.kg, но ни одна аптека не сообщила цену
    for (const c of stockCandidates(name, mnn)) {
      let items;
      try { items = (await stockGet({ q: c.q })).items; } catch (e) { throw e; }
      const word = c.q.split(" ")[0].toLowerCase().slice(0, 6);
      const same = items.filter((x) => x.title.toLowerCase().includes(word));
      const ok = same.filter((x) => x.count > 0);
      if (ok.length) return { q: c.q, mode: c.mode, variants: ok.sort((a, b) => scoreVariant(b, full) - scoreVariant(a, full)) };
      if (same.length && c.mode === "name") known = known || same[0].title;
    }
    // Если в apteki.kg нет цен — ищем в локальной базе аптек Бишкека (pharmacies.json)
    const local = await resolveLocalStock(name, mnn);
    if (local) return local;

    return { q: cleanName(name), mode: null, variants: [], known };
  }
  async function resolveLocalStock(name, mnn) {
    try {
      if (!ph.list) {
        ph.list = (await (await fetch("data/pharmacies.json")).json()).map((p) => ({ ...p, n: cap(p.n.replace(/^["«„']+|["»“']+$/g, "").trim() || "Аптека") }));
      }
      if (!ph.list || !ph.list.length) return null;
      for (const c of stockCandidates(name, mnn)) {
        const queryWord = c.q.toLowerCase().trim();
        if (queryWord.length < 3) continue;
        const matchingOffers = [];
        let bestTitle = "";
        let minP = Infinity;
        for (const p of ph.list) {
          for (const m of (p.meds || [])) {
            const medName = (m.n || "").toLowerCase();
            if (medName.includes(queryWord)) {
              if (!bestTitle) bestTitle = m.n;
              const numMatch = String(m.p || "").match(/\d+([.,]\d+)?/);
              const parsedP = numMatch ? parseFloat(numMatch[0].replace(",", ".")) : null;
              if (parsedP != null && parsedP < minP) minP = parsedP;
              matchingOffers.push({
                pharmacy: p.n,
                chain: p.net || "Лекарь",
                address: p.a || "",
                price: parsedP,
                status: m.q || "в наличии",
                lat: p.lat,
                lon: p.lon,
                phone: p.p || "",
                hours: p.h || (p.is24 ? "круглосуточно" : ""),
                buyUrl: null
              });
            }
          }
        }
        if (matchingOffers.length) {
          matchingOffers.sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
          const slug = `local:${encodeURIComponent(c.q)}`;
          const title = bestTitle || c.q;
          const minPrice = Number.isFinite(minP) ? minP : null;
          const item = {
            slug,
            title,
            mnn: mnn || "",
            minPrice,
            count: matchingOffers.length,
            img: null
          };
          stockCache.set(JSON.stringify({ slug }), { ok: true, title, offers: matchingOffers, source: "Выгрузка сети аптек Бишкека" });
          return { q: c.q, mode: c.mode || "local", variants: [item] };
        }
      }
    } catch (_) {}
    return null;
  }
  async function stockFind(name, mnn = "", full = "") {
    const label = cleanName(name) || stockQueryOf(name);
    if (label.length < 2) return;
    Object.assign(st, { q: label, mode: "name", variants: [], variant: null, offers: null, loading: true, error: "" });
    stockRender();
    try {
      const r = await stockResolve(name, mnn, full || name);
      if (st.q !== label) return;
      st.variants = r.variants; st.mode = r.mode;
      if (!r.variants.length) {
        st.loading = false;
        st.error = r.known ? `«${label}»: Есть в каталоге аптек, но цену сейчас не сообщила ни одна аптека Бишкека. Позвоните в ближайшую — на карте все аптеки с телефонами.` : `«${label}» нет в справочнике цен аптек Бишкека — возможно, продаётся только в больницах или под другим названием. Уточните в ближайшей аптеке.`;
        // цен нет — оставляем на карте все аптеки, чтобы можно было позвонить
        st.q = ""; stockRender(); $("[data-pharm-drug]").insertAdjacentHTML("afterbegin", `<div class="pharm-drug" style="margin-bottom:12px"><span>${esc(st.error)}</span></div>`); return;
      }
      await stockPick(r.variants[0]);
    } catch (e) { st.loading = false; st.error = e.message; stockRender(); }
  }
  function stockClear() { Object.assign(st, { q: "", variants: [], variant: null, offers: null, loading: false, error: "" }); if (location.hash !== "#apteki") history.replaceState(null, "", "#apteki"); stockRender(); }
  $("[data-pharm-drug]")?.addEventListener("submit", (e) => { if (e.target.matches("[data-stock-form]")) { e.preventDefault(); stockFind(e.target.q.value); } });
  $("[data-pharm-drug]")?.addEventListener("click", (e) => {
    if (e.target.closest("[data-stock-clear]")) return stockClear();
    const v = e.target.closest("[data-stock-v]"); if (v) stockPick(st.variants[+v.dataset.stockV]);
  });
  $("[data-pharm-list]")?.addEventListener("click", (e) => {
    const b = e.target.closest("[data-offer-go]"); if (!b) return;
    const k = +b.dataset.offerGo, o = st.offers[k], m = st.markers[k];
    if (m && ph.map) {
      ph.map.closePopup(); ph.map.once("moveend", () => m.openPopup()); ph.map.flyTo([o.lat, o.lon], 16, { duration: 0.6 });
      if (innerWidth < 900) { const box = $("[data-pharm-map]"); window.scrollTo({ top: box.getBoundingClientRect().top + scrollY - 88, behavior: "smooth" }); }
    }
  });

  async function renderPharm(drugIdx) {
    ph.drug = drugIdx ?? null;
    let drugRow = null;
    if (ph.drug != null) {
      if (!ROWS) await dataReady;
      drugRow = ROWS[ph.drug] || null;
    }
    if (!ph.list) {
      try { ph.list = (await (await fetch("data/pharmacies.json")).json()).map((p) => ({ ...p, n: cap(p.n.replace(/^["«„']+|["»“']+$/g, "").trim() || "Аптека") })); } catch { $("[data-pharm-meta]").textContent = "Не удалось загрузить список аптек. Обновите страницу."; return; }
    }
    if (!ph.map) {
      let L;
      try { L = await loadLeaflet(); } catch { $(".pharm-map-msg").textContent = "Карта не загрузилась — проверьте интернет. Список аптек ниже работает."; }
      if (L && !ph.map) {
        ph.L = L;
        $(".pharm-map-msg")?.remove();
        ph.map = L.map($("[data-pharm-map]"), { zoomControl: true, attributionControl: true }).setView(CITY, 13);
        // Тайлы OpenStreetMap; в тёмной теме их перекрашивает CSS-фильтр (.leaflet-tile-pane).
        ph.tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(ph.map);
        ph.markers = ph.list.map((p, i) => L.marker([p.lat, p.lon], { icon: pinIcon(p, false), title: p.n, keyboard: true })
          .bindPopup(`<div class="ph-name">${esc(p.n)}</div><div class="ph-sub">${phSub(p)}</div>${routeBtns(p)}`)
          .on("click", () => selectPharm(i, false)).addTo(ph.map));
      }
    }
    if (ph.map) setTimeout(() => ph.map.invalidateSize(), 50);
    if (drugRow) stockFind(drugRow.name || drugRow.title, drugRow.mnn, `${drugRow.title} ${drugRow.sub || ""}`);
    else if (!st.q) stockRender();
    else stockRender();
  }
  if (!$("[data-pharm-list]")) console.warn("pharm view missing");
  else {
    $("[data-pharm-list]").addEventListener("click", (e) => { const b = e.target.closest("[data-ph-go]"); if (b) selectPharm(+b.dataset.phGo); });
    $("[data-pharm-q]").addEventListener("input", (e) => { ph.q = e.target.value.trim(); if (ph.list) renderPharmList(); });
    $("[data-pharm-filters]").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pf]"); if (!b) return;
      ph.filter = b.dataset.pf;
      $$("[data-pf]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (ph.list) renderPharmList();
    });
    $("[data-pharm-near]").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (!navigator.geolocation) { toast("Браузер не умеет определять место. Найдите аптеку по улице", "thinking"); return; }
      btn.disabled = true;
      navigator.geolocation.getCurrentPosition((pos) => {
        btn.disabled = false;
        ph.me = [pos.coords.latitude, pos.coords.longitude];
        if (km(ph.me, CITY) > 60) toast("Вы далеко от Бишкека — показываю расстояния до аптек города", "thinking");
        if (ph.map) {
          if (ph.meMarker) ph.meMarker.remove();
          ph.meMarker = ph.L.marker(ph.me, { icon: ph.L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18] }), title: "Вы здесь", zIndexOffset: 1000 }).addTo(ph.map);
          const near = pharmItems().slice(0, 5).map((x) => [x.p.lat, x.p.lon]);
          ph.map.fitBounds([ph.me, ...near], { padding: [40, 40], maxZoom: 16 });
        }
        renderPharmList();
        serpu("found"); say("Вот аптеки рядом с тобой!");
      }, () => { btn.disabled = false; toast("Не получилось узнать, где вы. Разрешите доступ к местоположению или найдите аптеку по улице", "sad"); }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
  }

  /* ================= скан ================= */
  const scanOut = $("[data-scan-out]");
  const fileInput = $("[data-file]"), drop = $("[data-drop]");
  fileInput.addEventListener("change", () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("drag"); }));
  drop.addEventListener("drop", (e) => { const f = e.dataTransfer?.files?.[0]; if (f) handleFile(f); });

  const steps = (n) => `<div class="progress-steps">${["Ищу штрихкод", "Читаю упаковку", "Сверяю с реестром"].map((t, i) => `<div class="ps ${i < n ? "done" : i === n ? "on" : ""}">${icon(i < n ? "check" : "sparkle")}${t}</div>`).join("")}</div>`;
  let lastScanUrl = null;
  async function loadImage(file) {
    if (lastScanUrl) {
      try { URL.revokeObjectURL(lastScanUrl); } catch (_) {}
      lastScanUrl = null;
    }
    const url = URL.createObjectURL(file);
    lastScanUrl = url;
    const img = new Image();
    // onload надёжнее decode(): decode() может «зависнуть» во вкладке в фоне
    await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url; if (img.complete && img.naturalWidth) ok(); });
    return { img, url };
  }
  function toJpeg(img, max = 1280) {
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85).split(",")[1];
  }
  async function findBarcode(img) {
    if (!("BarcodeDetector" in window)) return [];
    try {
      const sup = await window.BarcodeDetector.getSupportedFormats();
      const formats = ["ean_13", "ean_8", "upc_a", "upc_e", "data_matrix", "code_128"].filter((f) => sup.includes(f));
      if (!formats.length) return [];
      const codes = await new window.BarcodeDetector({ formats }).detect(img);
      const out = [];
      for (const c of codes) {
        const v = c.rawValue || "";
        const gs1 = v.match(/01(\d{14})/);
        if (gs1) out.push(gs1[1].replace(/^0/, ""));
        else if (/^\d{8,14}$/.test(v)) out.push(v);
      }
      return out;
    } catch { return []; }
  }
  async function handleFile(file) {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      scanOut.innerHTML = `<div class="note warn">${icon("alert")}<span>Файл слишком большой (максимум 25 МБ). Пожалуйста, выберите фото меньшего размера.</span></div>`;
      return;
    }
    if (!/^image\//.test(file.type)) { scanOut.innerHTML = `<div class="note warn">${icon("alert")}<span>Это не похоже на фото. Выберите картинку JPG или PNG.</span></div>`; return; }
    let loaded;
    try { loaded = await loadImage(file); } catch { scanOut.innerHTML = `<div class="note warn">${icon("alert")}<span>Не получилось открыть фото. Попробуйте другое.</span></div>`; return; }
    const head = `<div class="scan-preview"><img src="${loaded.url}" alt="Ваше фото упаковки"><div class="beam"></div></div>`;
    const set = (n, extra = "") => { scanOut.innerHTML = `<div class="stack-16">${head}${steps(n)}${extra}</div>`; };
    set(0);
    await dataReady;
    const codes = await findBarcode(loaded.img);
    for (const c of codes) { const hit = byBarcode(c); if (hit.length) return scanResult(loaded.url, hit, { barcode: c }); }
    set(1);
    serpu("think"); say("Читаю упаковку…", 0);
    let d;
    try { d = await ai({ kind: "scan", image: toJpeg(loaded.img), mime: "image/jpeg" }); }
    catch (e) {
      scanOut.innerHTML = `<div class="stack-16">${head.replace('<div class="beam"></div>', "")}<div class="note warn">${icon("alert")}<span>${esc(e.message)}</span></div><a class="btn btn-ghost" href="#search">${icon("search")}Найти по названию</a></div>`;
      return;
    }
    set(2);
    let hits = d.barcode ? byBarcode(d.barcode) : [];
    if (!hits.length && d.name) {
      hits = search(d.name);
      if (d.dose) { const dn = norm(d.dose); hits.sort((a, b) => (b.n.includes(dn) ? 1 : 0) - (a.n.includes(dn) ? 1 : 0)); }
    }
    if (!hits.length && d.mnn) hits = search(d.mnn);
    scanResult(loaded.url, hits.slice(0, 6), d);
  }
  function scanResult(url, hits, d) {
    const thumb = `<div class="scan-preview" style="max-height:220px"><img src="${url}" alt="Ваше фото упаковки" style="max-height:220px"></div>`;
    if (!hits.length) {
      const read = d && (d.name || d.mnn) ? `<p class="muted">Серпу прочитал: <b>${esc([d.name, d.dose].filter(Boolean).join(" "))}</b>${d.mnn ? `, вещество: ${esc(d.mnn)}` : ""}.</p>` : "";
      scanOut.innerHTML = `<div class="stack-16">${thumb}<div class="empty-state" style="padding:24px 0"><img src="img/serpu/thinking.webp" alt=""><h2 class="heading-6">${d && d.is_medicine === false ? "Похоже, на фото не лекарство" : "В реестре не нашли"}</h2>${read}<p class="muted">Попробуйте снять название крупнее или найдите по названию. Если препарата нет в реестре, его могли не зарегистрировать в Кыргызстане.</p><div class="row" style="justify-content:center"><label class="btn btn-primary" for="rescan">${icon("camera")}Снять ещё раз</label><a class="btn btn-ghost" href="#search" ${d && d.name ? `data-q-set="${esc(d.name)}"` : ""}>${icon("search")}Найти по названию</a></div></div></div>`;
      $("[data-q-set]", scanOut)?.addEventListener("click", (e) => { state.q = e.currentTarget.dataset.qSet; });
      return;
    }
    const one = hits.length === 1;
    serpu(one ? "party" : "found"); say(one ? "Нашёл!" : "Кажется, одно из этих");
    scanOut.innerHTML = `<div class="stack-16">${thumb}
      <div class="row"><img src="img/serpu/${one ? "party" : "happy"}.webp" alt="" style="width:64px;height:64px"><div><h2 class="heading-6">${one ? "Нашли!" : "Похоже, это одно из этих"}</h2><p class="caption-1 muted">${one ? "Откройте карточку, чтобы спросить Серпу" : "Выберите вашу упаковку"}</p></div></div>
      <div class="results">${hits.map((r) => resultItem(r)).join("")}</div>
      <label class="btn btn-ghost" for="rescan">${icon("camera")}Сканировать другое</label></div>`;
  }
  // скрытый второй input для «снять ещё раз»
  const re = document.createElement("input");
  re.type = "file"; re.accept = "image/*"; re.capture = "environment"; re.id = "rescan"; re.className = "sr-only";
  re.addEventListener("change", () => { if (re.files[0]) handleFile(re.files[0]); re.value = ""; });
  document.body.appendChild(re);

  /* ================= самочувствие ================= */
  const FEEL_CHIPS = ["Температура", "Болит горло", "Насморк", "Кашель", "Головная боль", "Изжога", "Аллергия", "Расстройство желудка"];
  const feelForm = $("[data-feel-form]"), feelOut = $("[data-feel-out]"), feelErr = $("[data-feel-error]");
  $("[data-feel-chips]").innerHTML = FEEL_CHIPS.map((c) => `<button class="chip" type="button" data-feel-chip="${esc(c)}">${icon("plus")}${esc(c)}</button>`).join("");
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-feel-chip]");
    if (!c) return;
    const ta = feelForm.text;
    ta.value = (ta.value.trim() ? ta.value.trim().replace(/[.,]?$/, ", ") : "") + c.dataset.feelChip.toLowerCase();
    ta.focus();
  });
  feelForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = feelForm.text.value.trim();
    feelErr.textContent = "";
    if (text.length < 3) { feelErr.textContent = "Опишите самочувствие хотя бы парой слов."; feelForm.text.focus(); return; }
    const btn = $("button[type=submit]", feelForm);
    btn.setAttribute("aria-busy", "true");
    serpu("think"); say("Слушаю внимательно…", 0);
    feelOut.innerHTML = `<div class="card stack-16"><div class="ask-head"><img src="img/serpu/thinking.webp" alt=""><p class="title-3">Серпу думает…</p></div><div class="sk sk-line" style="width:90%"></div><div class="sk sk-line" style="width:76%"></div><div class="sk sk-line" style="width:84%"></div></div>`;
    try {
      const d = await ai({ kind: "symptoms", text });
      await dataReady;
      if (d.urgent) { serpu("remind"); say("Пожалуйста, позвони 103!", 5000); } else { serpu("talk"); say("Вот что можно сделать"); }
      const otc = (d.otc || []).map((o) => {
        const n = search(o.mnn).length;
        return `<div class="card stack-8"><p class="title-2">${esc(o.mnn)}</p><p>${esc(o.why)}</p>${o.caution ? `<p class="body-6 muted">${esc(o.caution)}</p>` : ""}${n ? `<a class="btn btn-ghost btn-sm" href="#search" data-q-set="${esc(o.mnn)}">${icon("search")}В реестре: ${fmt(n)} ${plural(n, "препарат", "препарата", "препаратов")}</a>` : ""}</div>`;
      }).join("");
      feelOut.innerHTML = `<div class="stack-24">
        ${d.urgent ? `<div class="urgent">${icon("alert")}<div class="stack-8"><p class="title-2">Нужна срочная помощь</p><p>${esc(d.urgent_text || "Позвоните в скорую помощь.")}</p><p class="title-3">Скорая: 103 · Единый номер: 112</p></div></div>` : ""}
        <div class="card stack-16">
          <div class="ask-head"><img src="img/serpu/${d.urgent ? "worried" : "doctor"}.webp" alt=""><p class="body-2">${esc(d.understood)}</p></div>
          ${d.self_care?.length ? `<div class="stack-8"><p class="title-3">Что можно сделать сейчас</p><ul class="list-check">${d.self_care.map((s) => `<li>${icon("check")}<span>${esc(s)}</span></li>`).join("")}</ul></div>` : ""}
        </div>
        ${otc ? `<div class="stack-8"><p class="title-3">Безрецептурные средства, о которых стоит спросить фармацевта</p><p class="caption-1 muted">Без доз: сколько и как принимать — по инструкции. Детям, беременным и при хронических болезнях — сначала к врачу.</p><div class="otc">${otc}</div></div>` : ""}
        ${d.see_doctor_when?.length ? `<div class="card-soft stack-8"><p class="title-3">Когда идти к врачу</p><ul class="list-dot">${d.see_doctor_when.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>` : ""}
        <div class="note">${icon("info")}<span><b>${esc(d.closing)}</b></span></div>
      </div>`;
      $$("[data-q-set]", feelOut).forEach((a) => a.addEventListener("click", (ev) => { state.q = ev.currentTarget.dataset.qSet; }));
    } catch (err) {
      feelOut.innerHTML = `<div class="note warn">${icon("alert")}<span>${esc(err.message)} Если плохо прямо сейчас — звоните 103.</span></div>`;
    } finally { btn.removeAttribute("aria-busy"); }
  });

  /* ================= вход ================= */
  const emailForm = $("[data-email-form]"), authErr = $("[data-auth-error]"), otpWrap = $("[data-otp-wrap]");
  let otpSentTo = "";
  const authMsg = (e) => {
    const m = String(e?.message || e || "");
    if (/rate|too many|security purposes/i.test(m)) return "Слишком много попыток. Подождите минуту и попробуйте снова.";
    if (/invalid|expired|otp|token/i.test(m)) return "Код не подошёл или устарел. Запросите новый.";
    if (/provider is not enabled|unsupported provider|not enabled/i.test(m)) return "Этот способ входа ещё настраивается. Пока войдите по почте.";
    if (/fetch|network|failed/i.test(m)) return "Нет связи с сервером входа. Проверьте интернет и попробуйте ещё раз.";
    return "Не получилось войти. Попробуйте ещё раз или другой способ.";
  };
  function setBusy(b, on) { b.toggleAttribute("disabled", on); b.setAttribute("aria-busy", String(on)); }
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    authErr.textContent = "";
    const email = emailForm.email.value.trim();
    const btn = $("[data-email-submit]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { authErr.textContent = "Проверьте адрес почты: похоже, в нём ошибка."; emailForm.email.focus(); return; }
    if (!initSupabase()) { authErr.textContent = "Вход временно недоступен. Обновите страницу и попробуйте снова."; return; }
    setBusy(btn, true);
    try {
      if (!otpSentTo || otpSentTo !== email) {
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo(), shouldCreateUser: true } });
        if (error) throw error;
        otpSentTo = email;
        otpWrap.hidden = false;
        $("span", btn).textContent = "Войти";
        emailForm.code.focus();
        toast("Письмо отправлено. Введите код или нажмите ссылку в письме", "yes");
      } else {
        const token = emailForm.code.value.replace(/\D/g, "");
        if (token.length < 6) { authErr.textContent = "Введите код из письма полностью (6 цифр)."; emailForm.code.focus(); return; }
        let { error } = await sb.auth.verifyOtp({ email, token, type: "email" });
        if (error) {
          const res = await sb.auth.verifyOtp({ email, token, type: "signup" });
          if (!res.error) error = null;
        }
        if (error) throw error;
        toast("Вы вошли. Серпу рад вас видеть", "love");
        location.hash = "me";
      }
    } catch (err) { authErr.textContent = authMsg(err); }
    finally { setBusy(btn, false); }
  });
  emailForm.email.addEventListener("input", () => { if (otpSentTo && emailForm.email.value.trim() !== otpSentTo) { otpSentTo = ""; otpWrap.hidden = true; $("span", $("[data-email-submit]")).textContent = "Получить код"; } });
  emailForm.code.addEventListener("input", () => {
    const digits = emailForm.code.value.replace(/\D/g, "");
    if (digits.length === 6) {
      emailForm.requestSubmit();
    }
  });
  $$("[data-oauth]").forEach((b) => b.addEventListener("click", async () => {
    authErr.textContent = "";
    if (!initSupabase()) { authErr.textContent = "Вход временно недоступен. Обновите страницу и попробуйте снова."; return; }
    setBusy(b, true);
    try {
      const provider = b.dataset.oauth === "google" ? "google" : C.telegramProvider;
      const targetRedirect = location.origin + location.pathname;
      const options = { redirectTo: targetRedirect };
      if (provider === "google") {
        options.queryParams = {
          prompt: "select_account",
          access_type: "offline",
        };
      }
      const { error } = await sb.auth.signInWithOAuth({ provider, options });
      if (error) throw error;
    } catch (err) { authErr.textContent = authMsg(err); setBusy(b, false); }
  }));

  /* ================= аптечка ================= */
  async function renderMe() {
    const acc = $("[data-account-box]");
    if (SESSION) {
      acc.innerHTML = `<div class="note">${icon("shield")}<span>Вы вошли как <b>${esc(SESSION.user.email || "пользователь")}</b>. Аптечка сохраняется в аккаунте.</span><button class="btn btn-ghost btn-sm" type="button" data-logout style="margin-left:auto">${icon("logout")}Выйти</button></div>`;
      $("[data-logout]", acc).addEventListener("click", async () => { try { await sb.auth.signOut(); } catch {} toast("Вы вышли из аккаунта", "sleepy"); });
    } else {
      acc.innerHTML = `<div class="note">${icon("info")}<span>Аптечка хранится в этом браузере. <a href="#login">Войдите</a>, чтобы она была на всех устройствах и в приложении.</span></div>`;
    }
    const list = $("[data-kit]");
    await dataReady;
    const kit = getKit();
    if (!kit.length) {
      list.innerHTML = `<div class="empty-state card"><img src="img/serpu/pill.webp" alt=""><h2 class="heading-6">Аптечка пока пустая</h2><p class="muted">Добавьте лекарства, которые есть дома, и укажите срок годности. Серпу подскажет, когда что-то пора заменить.</p><div class="row" style="justify-content:center"><a class="btn btn-primary" href="#scan">${icon("camera")}Сканировать</a><a class="btn btn-ghost" href="#search">${icon("search")}Найти</a></div></div>`;
    } else {
      list.innerHTML = kit.map((x, n) => {
        const r = findRow(x);
        const p = r ? pic(r) : `<div class="pic empty"><img src="img/serpu/pill.webp" alt=""></div>`;
        const title = r ? r.title : x.name;
        return `<div class="kit-item">${p}<div style="min-width:0"><a class="title-3" href="${r ? `#drug-${r.i}` : "#search"}" style="color:var(--ink)">${esc(title)}</a><div style="margin-top:4px">${expBadge(x.exp)}</div></div>
          <div class="ctrl"><label class="caption-4 muted" for="exp-${n}">Годен до</label><input class="field" type="date" id="exp-${n}" value="${esc(x.exp)}" data-exp="${n}"><button class="icon-btn" type="button" data-del="${n}" aria-label="Убрать ${esc(title)} из аптечки">${icon("trash")}</button></div></div>`;
      }).join("");
    }
    const rec = store.get("recent", []).map((k) => ROWS.find((r) => keyOf(r) === k)).filter(Boolean).slice(0, 8);
    $("[data-recent]").innerHTML = rec.length ? `<h2 class="title-1" style="margin-bottom:16px">Вы недавно смотрели</h2><div class="rail">${rec.map(productCard).join("")}</div>` : "";
  }
  $("[data-kit]").addEventListener("change", (e) => {
    const inp = e.target.closest("[data-exp]");
    if (!inp) return;
    const kit = getKit(), x = kit[+inp.dataset.exp];
    if (!x) return;
    x.exp = inp.value; setKit(kit);
    remoteKit("upsert", { reg: x.reg, name: x.name, mnn: x.mnn, expires_on: x.exp || null });
    renderMe();
  });
  $("[data-kit]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-del]");
    if (!b) return;
    const kit = getKit(), x = kit.splice(+b.dataset.del, 1)[0];
    setKit(kit);
    if (x) remoteKit("delete", { reg: x.reg });
    toast("Убрали из аптечки", "sad");
    renderMe();
  });

  /* ================= роутер ================= */
  const TITLES = { home: "Serpuru — поймите своё лекарство с одного фото", search: "Поиск лекарства — Serpuru", scan: "Сканировать упаковку — Serpuru", ask: "Самочувствие — Serpuru", login: "Вход — Serpuru", me: "Моя аптечка — Serpuru", apteki: "Аптеки Бишкека на карте — Serpuru", privacy: "Политика конфиденциальности — Serpuru", terms: "Условия использования — Serpuru", notfound: "Страница не найдена — Serpuru" };
  let current = null;
  function show(view, arg) {
    $$(".view").forEach((v) => v.classList.toggle("on", v.dataset.view === view));
    $$("[data-route-link]").forEach((a) => { if (a.dataset.routeLink === view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const prev = current;
    current = view;
    if (TITLES[view]) document.title = TITLES[view];
    if (prev !== null) window.scrollTo({ top: 0, behavior: "auto" });
    if (window.Serpu) try { window.Serpu.mute(view !== "home"); } catch {}
    placeStage(view);
    if (prev !== view && HELLO[view] && Math.random() < 0.8) setTimeout(() => say(pickOne(HELLO[view])), 600);
    document.body.dataset.view = view;
    if (view === "home") renderHome();
    else if (view === "search") renderSearch(arg);
    else if (view === "drug") renderDrug(arg);
    else if (view === "me") renderMe();
    else if (view === "apteki") renderPharm(arg);
    else if (view === "login") initSupabase();
    watchReveal();
  }
  function route() {
    const rawHash = location.hash;
    if (rawHash && (rawHash.includes("access_token=") || rawHash.includes("error_description="))) {
      initSupabase();
      show("login");
      return;
    }
    if (location.search && location.search.includes("code=")) {
      initSupabase();
      show("login");
      return;
    }

    let h;
    try {
      h = decodeURIComponent(rawHash.slice(1));
    } catch (_) {
      h = rawHash.slice(1);
    }
    setMenu(false);
    if (h === "main") { $("#main").focus(); return; }
    if (!h) return show("home");
    const m = h.match(/^drug-(\d+)$/);
    if (m) return show("drug", +m[1]);
    const c = h.match(/^cat-([a-z]+)$/);
    if (c) return show("search", c[1]);
    const ap = h.match(/^apteki(?:-(\d+))?$/);
    if (ap) return show("apteki", ap[1] != null ? +ap[1] : undefined);
    if (["search", "scan", "ask", "login", "me", "privacy", "terms"].includes(h)) return show(h);
    show("notfound");
  }
  addEventListener("hashchange", route);

  fillStatic();
  route();
  // клиент Supabase подключаем, когда скрипт загрузится: так вход сохраняется между визитами
  if (window.supabase) initSupabase(); else addEventListener("load", () => initSupabase());
})();
