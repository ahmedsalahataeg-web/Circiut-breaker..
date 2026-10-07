// Interactive demos: open/close, ACB mechanism, LSIG curve, arc interruption, breaking capacity, calculators.
import { h } from '../core/dom.js';
import { t, tx, L } from '../core/store.js';
import { mediumSVG } from '../data/diagrams.js';

const fmt = (n, d = 2) => (Number.isFinite(n) ? Number(n.toPrecision(d + 1)).toString() : '–');

/* ---------------- Open / Close demo (generic) ---------------- */
export function OpenCloseDemo() {
  const state = h('strong', { class: 'ocd-state' }, '');
  const svg = h('div', { class: 'ocd-svg', html: `<svg viewBox="0 0 300 130" role="img" aria-label="Breaker contacts animation">
    <path d="M10 80H90M210 80H290" stroke="var(--amber)" stroke-width="3"/>
    <circle cx="90" cy="80" r="5" fill="var(--cyan)"/><circle cx="210" cy="80" r="5" fill="var(--cyan)"/>
    <g class="blade-g" style="transform-origin:90px 80px"><path d="M90 80H210" stroke="var(--amber)" stroke-width="5" stroke-linecap="round"/></g>
    <path class="arc-shape" d="M200 78l8 -8 -6 -8 8 -8" fill="none" stroke="var(--amber)" stroke-width="3"/>
  </svg>` });
  const root = h('div', { class: 'demo ocd card' }, h('h4', {}, tx('Breaker opening / closing', 'فتح وإغلاق القاطع')), svg, state);
  const g = svg.querySelector('.blade-g'); const arc = svg.querySelector('.arc-shape');
  let closed = true;
  function set(c, label) {
    closed = c;
    g.style.transform = c ? 'rotate(0deg)' : 'rotate(-28deg)';
    if (!c) { arc.classList.add('show'); setTimeout(() => arc.classList.remove('show'), 500); }
    state.textContent = label || (c ? tx('CLOSED – current flows', 'مغلق – التيار يمر') : tx('OPEN – circuit interrupted', 'مفتوح – الدائرة مقطوعة'));
  }
  set(true);
  root.append(h('div', { class: 'row-gap' },
    h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => set(true) }, tx('Close', 'إغلاق')),
    h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => set(false) }, tx('Open (manual)', 'فتح (يدوي)')),
    h('button', { class: 'btn btn-primary btn-sm', type: 'button', onClick: () => set(false, tx('TRIPPED by protection – find the cause before resetting', 'فصل بالحماية – اعرف السبب قبل إعادة التشغيل')) }, tx('Simulate fault trip', 'محاكاة فصل عطل'))));
  return root;
}

/* ---------------- ACB spring-charging mechanism ---------------- */
export function MechanismDemo() {
  const status = h('p', { class: 'ocd-state' });
  const svgBox = h('div', { class: 'ocd-svg' });
  let st = 0; // 0 discharged/open, 1 charged/open, 2 closed (spring discharged), 3 tripped
  const label = [
    L('OPEN – spring discharged', 'مفتوح – الزنبرك غير مشحون'), L('OPEN – spring charged (ready to close)', 'مفتوح – الزنبرك مشحون (جاهز للإغلاق)'),
    L('CLOSED – energy released to close contacts', 'مغلق – تحررت الطاقة لإغلاق الملامسات'), L('TRIPPED – opened by the trip unit / opening release', 'مفصول – فتح بواسطة وحدة الفصل / ملف الفتح'),
  ];
  function draw() {
    const compressed = st === 1;
    const sp = (len) => { let d = 'M30 40'; const n = 8, w = len / n; for (let i = 0; i < n; i++) d += `l${w / 2} ${i % 2 ? 14 : -14} l${w / 2} ${i % 2 ? -14 : 14}`; return d; };
    const closed = st === 2;
    svgBox.innerHTML = `<svg viewBox="0 0 360 150" role="img" aria-label="ACB stored-energy mechanism">
      <rect x="20" y="20" width="130" height="40" rx="6" fill="var(--diag-body)" stroke="var(--diag-stroke)"/>
      <path d="${sp(compressed ? 70 : 118)}" transform="translate(0 0)" fill="none" stroke="${compressed ? 'var(--amber)' : 'var(--diag-stroke)'}" stroke-width="3"/>
      <text x="85" y="84" font-size="11" text-anchor="middle" fill="var(--muted)" font-family="Inter,Cairo,sans-serif">${tx('closing spring', 'زنبرك الإغلاق')}</text>
      <path d="M190 100H230M310 100H350" stroke="var(--amber)" stroke-width="3"/><circle cx="230" cy="100" r="5" fill="var(--cyan)"/><circle cx="310" cy="100" r="5" fill="var(--cyan)"/>
      <path d="M230 100L${closed ? '310 100' : '300 70'}" stroke="var(--amber)" stroke-width="5" stroke-linecap="round" style="transition:all .4s"/>
      <text x="270" y="130" font-size="11" text-anchor="middle" fill="var(--muted)" font-family="Inter,Cairo,sans-serif">${tx('main contacts', 'الملامسات الرئيسية')}</text></svg>`;
    status.textContent = t(label[st]);
  }
  const b = (txt, fn, cls = 'btn-ghost') => h('button', { class: `btn ${cls} btn-sm`, type: 'button', onClick: fn }, txt);
  draw();
  return h('div', { class: 'demo card' }, h('h4', {}, tx('ACB stored-energy mechanism', 'آلية الطاقة المخزنة في ACB')), svgBox, status,
    h('div', { class: 'row-gap' },
      b(tx('1. Charge spring', '1. اشحن الزنبرك'), () => { if (st === 0 || st === 3) { st = 1; draw(); } }),
      b(tx('2. Close', '2. إغلاق'), () => { if (st === 1) { st = 2; draw(); } else status.textContent = tx('Charge the spring first.', 'اشحن الزنبرك أولًا.'); }),
      b(tx('3. Trip / Open', '3. فصل / فتح'), () => { if (st === 2) { st = 3; draw(); } }, 'btn-primary')),
    h('p', { class: 'muted small' }, tx('A motor (or hand lever) charges the spring; the closing release lets it close the contacts independent of operator speed. Release/auxiliary codes are manufacturer-specific.', 'محرك (أو ذراع يدوي) يشحن الزنبرك؛ وملف الإغلاق يتيح له إغلاق الملامسات بمعزل عن سرعة المشغل. وأكواد الملفات والملامسات المساعدة خاصة بكل شركة.')));
}

/* ---------------- LSIG curve ---------------- */
export function LSIGChart() {
  const In = 1000;
  const P = { ir: 0.8, tr: 8, isd: 5, tsd: 0.2, ii: 8, ig: 0.4, tg: 0.2, fault: 6000 };
  const defs = [
    ['ir', 'Ir', tx('Long-time pickup Ir (× In)', 'عتبة الزمن الطويل Ir (× In)'), 0.4, 1, 0.05],
    ['tr', 'tr', tx('Long-time delay tr (s @ 6 × Ir)', 'تأخير الزمن الطويل tr (ث عند 6 × Ir)'), 0.5, 24, 0.5],
    ['isd', 'Isd', tx('Short-time pickup Isd (× Ir)', 'عتبة الزمن القصير Isd (× Ir)'), 1.5, 10, 0.5],
    ['tsd', 'tsd', tx('Short-time delay tsd (s)', 'تأخير الزمن القصير tsd (ث)'), 0.05, 0.4, 0.05],
    ['ii', 'Ii', tx('Instantaneous pickup Ii (× In)', 'العتبة اللحظية Ii (× In)'), 2, 15, 0.5],
    ['ig', 'Ig', tx('Ground-fault pickup Ig (× In)', 'عتبة العطل الأرضي Ig (× In)'), 0.2, 1, 0.05],
    ['tg', 'tg', tx('Ground-fault delay tg (s)', 'تأخير العطل الأرضي tg (ث)'), 0.1, 0.8, 0.1],
  ];
  const chart = h('div', { class: 'lsig-chart' });
  const readout = h('p', { class: 'readout', 'aria-live': 'polite' });
  const W = 640, H = 380, ml = 58, mr = 16, mt = 14, mb = 42, xmin = 200, xmax = 100000, ymin = 0.01, ymax = 10000;
  const px = (I) => ml + ((Math.log10(I) - Math.log10(xmin)) / (Math.log10(xmax) - Math.log10(xmin))) * (W - ml - mr);
  const py = (s) => H - mb - ((Math.log10(s) - Math.log10(ymin)) / (Math.log10(ymax) - Math.log10(ymin))) * (H - mt - mb);
  const tripTime = (I) => {
    const Ir = P.ir * In, Isd = P.isd * Ir, Ii = Math.max(P.ii * In, Isd);
    if (I < Ir * 1.05) return { t: Infinity, f: 'none' };
    const tl = P.tr * Math.pow((6 * Ir) / I, 2);
    if (I >= Ii) return { t: 0.02, f: 'I' };
    if (I >= Isd) return tl < P.tsd ? { t: tl, f: 'L' } : { t: P.tsd, f: 'S' };
    return { t: Math.min(tl, ymax), f: 'L' };
  };
  function draw() {
    const Ir = P.ir * In, Isd = P.isd * Ir, Ii = Math.max(P.ii * In, Isd), Ig = P.ig * In;
    const pts = [];
    const add = (I) => { if (I >= xmin && I <= xmax) { const r = tripTime(I); pts.push([I, Math.min(r.t, ymax)]); } };
    for (let i = 0; i <= 160; i++) add(Ir * 1.05 * Math.pow(xmax / (Ir * 1.05), i / 160));
    [Isd * 0.999, Isd, Ii * 0.999, Ii].forEach(add);
    pts.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`).join('');
    const xt = [200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
    const yt = [0.01, 0.1, 1, 10, 100, 1000, 10000];
    const fr = tripTime(P.fault);
    const grid = xt.map((x) => `<line x1="${px(x)}" x2="${px(x)}" y1="${mt}" y2="${H - mb}" stroke="var(--line)"/><text x="${px(x)}" y="${H - mb + 15}" font-size="10" text-anchor="middle" fill="var(--muted)">${x >= 1000 ? x / 1000 + 'k' : x}</text>`).join('')
      + yt.map((y) => `<line y1="${py(y)}" y2="${py(y)}" x1="${ml}" x2="${W - mr}" stroke="var(--line)"/><text x="${ml - 6}" y="${py(y) + 3}" font-size="10" text-anchor="end" fill="var(--muted)">${y}</text>`).join('');
    const gline = Ig >= xmin ? `<path d="M${px(Ig)} ${py(P.tg)}H${px(xmax)}" stroke="var(--green)" stroke-width="2" stroke-dasharray="6 4" fill="none"/><text x="${px(Math.min(Ig * 1.4, 60000))}" y="${py(P.tg) - 6}" font-size="10" fill="var(--green)">G</text>` : '';
    const mark = Number.isFinite(fr.t) ? `<line x1="${px(P.fault)}" x2="${px(P.fault)}" y1="${mt}" y2="${H - mb}" stroke="var(--red)" stroke-dasharray="3 3"/><circle cx="${px(P.fault)}" cy="${py(fr.t)}" r="5" fill="var(--red)"/>` : `<line x1="${px(P.fault)}" x2="${px(P.fault)}" y1="${mt}" y2="${H - mb}" stroke="var(--red)" stroke-dasharray="3 3"/>`;
    chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="LSIG time-current curve">
      ${grid}<rect x="${ml}" y="${mt}" width="${W - ml - mr}" height="${H - mt - mb}" fill="none" stroke="var(--line-strong)"/>
      <path d="${path}" fill="none" stroke="var(--cyan)" stroke-width="2.6"/>${gline}${mark}
      <text x="${(W + ml) / 2}" y="${H - 6}" font-size="11" text-anchor="middle" fill="var(--text)">${tx('Current (A)', 'التيار (أمبير)')}</text>
      <text transform="translate(14 ${H / 2}) rotate(-90)" font-size="11" text-anchor="middle" fill="var(--text)">${tx('Time (s)', 'الزمن (ث)')}</text>
      <text x="${px(Ir)}" y="${mt + 12}" font-size="10" text-anchor="middle" fill="var(--amber)">Ir</text><line x1="${px(Ir)}" x2="${px(Ir)}" y1="${mt + 14}" y2="${H - mb}" stroke="var(--amber)" opacity=".4"/>
    </svg>`;
    const which = { L: tx('Long-time (overload)', 'الزمن الطويل (حمل زائد)'), S: tx('Short-time (delayed)', 'الزمن القصير (مؤخر)'), I: tx('Instantaneous', 'لحظي'), none: tx('No trip (below Ir)', 'لا فصل (أقل من Ir)') }[fr.f];
    readout.innerHTML = `${tx('Fault current', 'تيار العطل')}: <b>${fmt(P.fault, 3)} A</b> → ${Number.isFinite(fr.t) ? `${tx('trips in', 'يفصل خلال')} <b>${fmt(fr.t, 2)} s</b> — ${which}` : which}.`;
  }
  const sliders = defs.map(([k, , label, min, max, step]) => {
    const val = h('output', {}, String(P[k]));
    const inp = h('input', { type: 'range', min, max, step, value: P[k], 'aria-label': label, onInput: (e) => { P[k] = parseFloat(e.target.value); val.textContent = e.target.value; draw(); } });
    return h('label', { class: 'slider' }, h('span', {}, label, ' ', val), inp);
  });
  const fval = h('output', {}, '6000 A');
  const fin = h('input', { type: 'range', min: 0, max: 100, step: 1, value: 50, 'aria-label': tx('Fault current', 'تيار العطل'), onInput: (e) => { P.fault = Math.round(Math.pow(10, Math.log10(300) + (e.target.value / 100) * (Math.log10(80000) - Math.log10(300)))); fval.textContent = P.fault + ' A'; draw(); } });
  P.fault = Math.round(Math.pow(10, Math.log10(300) + 0.5 * (Math.log10(80000) - Math.log10(300))));
  fval.textContent = P.fault + ' A';
  draw();
  return h('div', { class: 'demo card' }, h('h4', {}, tx('Interactive LSIG time-current curve', 'منحنى LSIG التفاعلي (زمن-تيار)')),
    h('p', { class: 'muted small' }, tx('Illustrative breaker with In = 1000 A. Long-time follows an I²t shape; real curve shapes, tolerances and options are manufacturer-specific.', 'قاطع توضيحي بـ In = 1000 أمبير. الزمن الطويل بشكل I²t؛ وأشكال المنحنيات والتسامحات والخيارات الحقيقية خاصة بكل شركة.')),
    h('div', { class: 'lsig' }, chart, h('div', { class: 'sliders' }, sliders, h('label', { class: 'slider red' }, h('span', {}, tx('Fault current', 'تيار العطل'), ' ', fval), fin))), readout);
}

/* ---------------- Arc interruption ---------------- */
const stages = [
  { n: L('Arc formation', 'تكوّن القوس'), d: L('Contacts begin to separate; the gap ionises and the current continues through a thin arc.', 'تبدأ الملامسات بالانفصال؛ يتأين الفاصل ويستمر التيار عبر قوس رفيع.') },
  { n: L('Arc stretching', 'استطالة القوس'), d: L('The gap widens; the arc is lengthened, raising arc voltage.', 'يتسع الفاصل ويطول القوس فيرتفع جهده.') },
  { n: L('Arc cooling', 'تبريد القوس'), d: L('The medium cools and de-ionises the arc (splitting, gas blast, vapour condensation or oil gas).', 'يبرد الوسيط القوس ويزيل تأينه (تجزئة أو نفخ غاز أو تكثيف بخار أو غاز الزيت).') },
  { n: L('Current zero', 'صفر التيار'), d: L('AC current passes through zero: the arc has least energy and can extinguish.', 'يمر تيار AC بالصفر: يكون القوس عند أقل طاقة ويمكنه الانطفاء.') },
  { n: L('Dielectric recovery', 'استعادة العزل'), d: L('The gap rapidly regains insulation strength as the plasma decays.', 'يستعيد الفاصل قوته العازلة بسرعة مع تلاشي البلازما.') },
  { n: L('TRV', 'جهد الاسترداد العابر TRV'), d: L('The transient recovery voltage appears across the gap; if the gap recovers faster, the arc does not re-strike.', 'يظهر جهد الاسترداد العابر على الفاصل؛ فإن استعاد العزل أسرع منه لا يعود القوس.') },
];
const mediaNotes = {
  air: L('Air: the arc is driven (by magnetic forces and thermal buoyancy) into an arc chute where steel splitter plates divide it into many short arcs, raising total arc voltage and cooling it.', 'الهواء: يُدفع القوس (بقوى مغناطيسية وطفو حراري) إلى حجرة إطفاء حيث تقسمه صفائح فولاذية إلى أقواس قصيرة كثيرة فيرتفع جهده الكلي ويبرد.'),
  vacuum: L('Vacuum: the arc is a short metal-vapour arc; vapour condenses on contacts and shield within microseconds after current zero, so the gap recovers very quickly.', 'الفراغ: القوس قصير من بخار المعدن؛ يتكثف البخار على الملامسات والدرع خلال ميكروثوانٍ بعد صفر التيار فيستعيد الفاصل عزله بسرعة كبيرة.'),
  sf6: L('SF6: gas flow (puffer/self-blast) cools the arc and the gas captures free electrons (electronegativity), giving fast dielectric recovery.', 'SF6: تدفق الغاز (puffer/self-blast) يبرد القوس والغاز يلتقط الإلكترونات الحرة (سالب كهربيًا) فتسريع استعادة العزل.'),
  oil: L('Oil: the arc decomposes oil into gas (mostly hydrogen). The gas bubble cools the arc and its pressure assists extinction; maintenance and fire risk are drawbacks.', 'الزيت: يحلل القوس الزيت إلى غاز (معظمه هيدروجين). وتبرد الفقاعة القوس ويساعد ضغطها على الإطفاء؛ ومن العيوب الصيانة وخطر الحريق.'),
};
function arcScene(medium, s) {
  const gap = [18, 56, 84, 100, 110, 110][s];
  const cx = 150, y = 90, lx = cx - gap / 2, rx = cx + gap / 2;
  const arcOn = s <= 2, fading = s === 3;
  let deco = '', arc = '';
  if (medium === 'air') {
    deco = Array.from({ length: 6 }, (_, i) => `<path d="M${95 + i * 22} 22v${s >= 1 ? 30 : 12}" stroke="var(--diag-stroke)" opacity=".6" stroke-width="3"/>`).join('');
    arc = arcOn ? (s === 0 ? `<path d="M${lx} ${y}L${rx} ${y}" stroke="var(--amber)" stroke-width="4" class="arc-flicker"/>` : s === 1 ? `<path d="M${lx} ${y}Q${cx} ${y - 38} ${rx} ${y}" stroke="var(--amber)" stroke-width="4" fill="none" class="arc-flicker"/>` : [0, 1, 2].map((i) => `<path d="M${lx + i * 22} ${y - 20}l8 -10 8 10" stroke="var(--amber)" stroke-width="3" fill="none" class="arc-flicker"/>`).join('')) : '';
  } else if (medium === 'vacuum') {
    deco = '<rect x="80" y="40" width="140" height="100" rx="8" fill="none" stroke="var(--cyan)" stroke-dasharray="5 4"/>';
    if (s >= 3) deco += Array.from({ length: 10 }, (_, i) => `<circle cx="${90 + i * 13}" cy="${s >= 4 ? 44 : 60 + (i % 3) * 8}" r="1.6" fill="var(--amber)" opacity=".7"/>`).join('');
    arc = arcOn ? `<path d="M${lx} ${y - 8}L${rx} ${y - 14}L${rx} ${y + 14}L${lx} ${y + 8}z" fill="var(--amber)" opacity=".55" class="arc-flicker"/>` : '';
  } else if (medium === 'sf6') {
    deco = Array.from({ length: 14 }, (_, i) => `<circle cx="${60 + (i % 7) * 30}" cy="${48 + Math.floor(i / 7) * 80}" r="2" fill="var(--cyan)" opacity=".5"/>`).join('');
    if (s >= 1 && s <= 3) deco += [60, 120].map((yy) => `<path d="M120 ${yy}L${s === 1 ? 150 : 170} ${y}" stroke="var(--cyan)" stroke-width="2" opacity=".8" marker-end="url(#ar)"/>`).join('');
    arc = arcOn ? `<path d="M${lx} ${y}L${rx} ${y}" stroke="var(--amber)" stroke-width="${s === 2 ? 2 : 4}" class="arc-flicker"/>` : '';
  } else {
    deco = '<rect x="50" y="40" width="200" height="110" rx="8" fill="var(--amber)" opacity=".15"/>';
    if (s >= 1 && s <= 3) deco += Array.from({ length: 7 }, (_, i) => `<circle cx="${cx - 24 + i * 8}" cy="${y - 20 + (i % 3) * 12}" r="${4 + (s) * 1.5}" fill="none" stroke="var(--amber)" opacity=".8"/>`).join('') + `<text x="${cx}" y="${y + 44}" font-size="10" text-anchor="middle" fill="var(--amber)">H₂ gas</text>`;
    arc = arcOn ? `<path d="M${lx} ${y}L${rx} ${y}" stroke="var(--amber)" stroke-width="3" class="arc-flicker"/>` : '';
  }
  if (fading) arc = `<path d="M${lx} ${y}L${rx} ${y}" stroke="var(--amber)" stroke-width="1.5" stroke-dasharray="2 5" opacity=".6"/>`;
  // waveform strip
  const wf = Array.from({ length: 61 }, (_, i) => { const x = 20 + i * 4.3; const k = i / 60 * 4 * Math.PI; return `${i ? 'L' : 'M'}${x.toFixed(1)} ${(172 - Math.sin(k) * 14 * (s >= 4 ? 0 : 1)).toFixed(1)}`; }).join('');
  const trv = s === 5 ? `<path d="M${20} 172Q 80 130 120 172T 220 150T 280 160" fill="none" stroke="var(--red)" stroke-width="2"/><text x="236" y="136" font-size="10" fill="var(--red)">TRV</text>` : '';
  return `<svg viewBox="0 0 300 200" role="img" aria-label="Arc interruption in ${medium}">
    <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="var(--cyan)"/></marker></defs>
    <rect x="30" y="20" width="240" height="140" rx="10" fill="var(--diag-body)" stroke="var(--diag-stroke)"/>${deco}
    <rect x="30" y="${y - 6}" width="${lx - 30}" height="12" fill="var(--amber)" opacity=".85"/><rect x="${rx}" y="${y - 6}" width="${270 - rx}" height="12" fill="var(--amber)" opacity=".85"/>${arc}
    <path d="${wf}" fill="none" stroke="var(--blue)" stroke-width="1.6" opacity=".9"/>${trv}
    <line x1="${20 + (s <= 2 ? 40 : s === 3 ? 140 : 220)}" x2="${20 + (s <= 2 ? 40 : s === 3 ? 140 : 220)}" y1="152" y2="196" stroke="var(--red)" stroke-dasharray="2 3"/></svg>`;
}
export function ArcDemo() {
  let medium = 'air', s = 0, timer = null;
  const scene = h('div', { class: 'arc-scene' });
  const cap = h('div', { class: 'arc-cap', 'aria-live': 'polite' });
  const stagesBox = h('ol', { class: 'arc-stages' });
  const mediumBtns = h('div', { class: 'seg', role: 'tablist' });
  const play = h('button', { class: 'btn btn-primary btn-sm', type: 'button', onClick: () => toggle() }, tx('▶ Play', '▶ تشغيل'));
  function draw() {
    scene.innerHTML = arcScene(medium, s);
    cap.replaceChildren(h('h4', {}, `${s + 1}. ${t(stages[s].n)}`), h('p', {}, t(stages[s].d)), h('p', { class: 'muted small' }, t(mediaNotes[medium])));
    [...stagesBox.children].forEach((li, i) => li.classList.toggle('on', i === s));
    [...mediumBtns.children].forEach((b) => b.classList.toggle('on', b.dataset.m === medium));
  }
  function toggle() {
    if (timer) { clearInterval(timer); timer = null; play.textContent = tx('▶ Play', '▶ تشغيل'); return; }
    play.textContent = tx('❚❚ Pause', '❚❚ إيقاف مؤقت');
    timer = setInterval(() => { s = (s + 1) % stages.length; draw(); if (!document.body.contains(scene)) { clearInterval(timer); timer = null; } }, 1900);
  }
  [['air', tx('AIR', 'هواء')], ['vacuum', tx('VACUUM', 'فراغ')], ['sf6', 'SF6'], ['oil', tx('OIL', 'زيت')]].forEach(([m, lab]) => mediumBtns.append(h('button', { class: 'seg-b', type: 'button', 'data-m': m, onClick: () => { medium = m; s = 0; draw(); } }, lab)));
  stages.forEach((st, i) => stagesBox.append(h('li', {}, h('button', { type: 'button', onClick: () => { s = i; draw(); } }, t(st.n)))));
  draw();
  return h('div', { class: 'demo card' }, h('h4', {}, tx('Arc interruption by medium', 'إطفاء القوس حسب الوسيط')), mediumBtns, h('div', { class: 'arc-grid' }, scene, cap), stagesBox, play);
}

/* ---------------- Breaking capacity animation ---------------- */
export function BreakingDemo() {
  const W = 640, H = 230;
  const f = 3, tEnd = 5, ts = 2.5, ti = 2.78;
  const iT = (tm) => {
    const w = 2 * Math.PI * f * tm;
    if (tm < 1.25) return Math.sin(w);
    if (tm < ts) return 2.2 * Math.sin(w);
    if (tm < ti) return 6.5 * (Math.sin(w) + 0.8 * Math.exp(-(tm - ts) / 0.25));
    return 0;
  };
  const pts = []; for (let i = 0; i <= 1000; i++) { const tm = (i / 1000) * tEnd; const v = Math.max(-7, Math.min(7.5, iT(tm))); pts.push(`${i ? 'L' : 'M'}${(20 + (tm / tEnd) * (W - 40)).toFixed(1)} ${(H / 2 - v * 13).toFixed(1)}`); }
  const phases = [
    [0, L('Normal current', 'تيار طبيعي'), L('Load current well below In: the breaker simply carries it.', 'تيار حمل أقل بكثير من In: القاطع يحمله ببساطة.')],
    [1.25, L('Overload', 'حمل زائد'), L('Current above In for a while: thermal element heats; trips after a delay (inverse time).', 'تيار أعلى من In لفترة: يسخن العنصر الحراري ويفصل بعد تأخير (زمن عكسي).')],
    [ts, L('Short circuit', 'قصر'), L('Current rises to many times In with a DC offset: instantaneous (magnetic) trip.', 'يرتفع التيار لأضعاف In مع مركبة DC: فصل لحظي (مغناطيسي).')],
    [ti - 0.15, L('Breaker interruption', 'قطع القاطع'), L('Contacts part and the arc is driven into the arc chute; breaking capacity (Icn/Icu) must exceed the prospective current.', 'تنفصل الملامسات ويُدفع القوس لحجرة الإطفاء؛ ويجب أن تتجاوز قدرة القطع (Icn/Icu) التيار المتوقع.')],
    [ti + 0.05, L('Arc extinction', 'انطفاء القوس'), L('Current is forced to zero and does not return: the fault is cleared.', 'يُجبر التيار على الصفر ولا يعود: أُزيل العطل.')],
  ];
  const svg = h('div', { class: 'bc-svg', html: `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fault current waveform">
    <line x1="20" x2="${W - 20}" y1="${H / 2}" y2="${H / 2}" stroke="var(--line-strong)"/>
    <defs><clipPath id="bcclip"><rect id="bcrect" x="0" y="0" width="0" height="${H}"/></clipPath></defs>
    <path d="${pts.join('')}" fill="none" stroke="var(--cyan)" stroke-width="2.2" clip-path="url(#bcclip)"/>
    ${phases.map(([tm, n]) => `<line x1="${20 + (tm / tEnd) * (W - 40)}" x2="${20 + (tm / tEnd) * (W - 40)}" y1="10" y2="${H - 10}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${22 + (tm / tEnd) * (W - 40)}" y="22" font-size="10" fill="var(--muted)">${t(n)}</text>`).join('')}
  </svg>` });
  const cap = h('div', { class: 'arc-cap', 'aria-live': 'polite' });
  const rect = svg.querySelector('#bcrect');
  let raf = 0;
  function show(i) { cap.replaceChildren(h('h4', {}, `${i + 1}. ${t(phases[i][1])}`), h('p', {}, t(phases[i][2]))); }
  function play() {
    cancelAnimationFrame(raf); const t0 = performance.now(); const dur = 9000;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur); const tm = p * tEnd;
      rect.setAttribute('width', String(20 + p * (W - 40)));
      let idx = 0; phases.forEach(([pt], i) => { if (tm >= pt) idx = i; }); show(idx);
      if (p < 1 && document.body.contains(svg)) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  rect.setAttribute('width', String(W)); show(0);
  return h('div', { class: 'demo card' }, h('h4', {}, tx('From normal current to arc extinction', 'من التيار الطبيعي إلى انطفاء القوس')), svg, cap,
    h('button', { class: 'btn btn-primary btn-sm', type: 'button', onClick: play }, tx('▶ Play', '▶ تشغيل')));
}

/* ---------------- Calculators (educational) ---------------- */
function field(label, input) { return h('label', { class: 'fld' }, h('span', {}, label), input); }
const num = (v, on) => h('input', { type: 'number', value: v, min: 0, step: 'any', inputMode: 'decimal', onInput: on });
export function Calculators() {
  /* power / current */
  const a = { sys: '3', V: 400, kW: 15, pf: 0.85 };
  const out1 = h('p', { class: 'readout' });
  const calc1 = () => { const I = a.sys === '3' ? (a.kW * 1000) / (Math.sqrt(3) * a.V * a.pf) : (a.kW * 1000) / (a.V * a.pf); out1.innerHTML = `${tx('Design current', 'تيار التصميم')} Ib ≈ <b>${fmt(I, 3)} A</b>`; };
  /* short circuit */
  const b = { kva: 1000, V: 400, z: 5 };
  const out2 = h('p', { class: 'readout' });
  const calc2 = () => { const I = (b.kva * 1000) / (Math.sqrt(3) * b.V * (b.z / 100)); out2.innerHTML = `${tx('Max. prospective short-circuit current at transformer secondary', 'أقصى تيار قصر متوقع عند ثانوي المحول')} ≈ <b>${fmt(I / 1000, 3)} kA</b><br><small>${tx('Infinite-source, bolted three-phase; ignores cable impedance and motor contribution.', 'مصدر لانهائي وقصر ثلاثي مباشر؛ يتجاهل معاوقة الكابلات ومساهمة المحركات.')}</small>`; };
  /* selection */
  const c = { Ib: 28, Iz: 41, Isc: 6, Icn: 6 };
  const out3 = h('div', { class: 'readout' });
  const std = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
  const calc3 = () => {
    const pick = std.find((x) => x >= c.Ib);
    const msgs = [];
    if (!pick) msgs.push(tx('Ib exceeds the standard MCB list – consider an MCCB/ACB.', 'Ib أكبر من قائمة MCB القياسية – فكّر في MCCB/ACB.'));
    else if (pick > c.Iz) msgs.push(tx(`Next standard In (${pick} A) exceeds cable capacity Iz (${c.Iz} A): increase cable size.`, `قيمة In القياسية التالية (${pick} أمبير) تتجاوز سعة الكابل Iz (${c.Iz} أمبير): كبّر مقطع الكابل.`));
    else msgs.push(tx(`Candidate In = ${pick} A (Ib ≤ In ≤ Iz).`, `In المرشح = ${pick} أمبير (Ib ≤ In ≤ Iz).`));
    msgs.push(c.Icn >= c.Isc ? tx('Breaking capacity ≥ prospective short-circuit current ✔', 'قدرة القطع ≥ تيار القصر المتوقع ✔') : tx('Breaking capacity is LOWER than the prospective short-circuit current ✘ – select a higher rating or an approved back-up arrangement.', 'قدرة القطع أقل من تيار القصر المتوقع ✘ – اختر قدرة أعلى أو ترتيب back-up معتمد.'));
    out3.replaceChildren(h('ul', {}, msgs.map((m) => h('li', {}, m))), h('p', { class: 'muted small' }, tx('Also check: curve vs load inrush, fault-loop impedance, selectivity, ambient derating, voltage drop.', 'افحص أيضًا: المنحنى مقابل اندفاع الحمل، ومعاوقة حلقة العطل، والانتقائية، وتخفيض الحرارة، وهبوط الجهد.')));
  };
  calc1(); calc2(); calc3();
  const sel = h('select', { class: 'select', onChange: (e) => { a.sys = e.target.value; calc1(); } }, h('option', { value: '3' }, tx('Three-phase', 'ثلاثي الأطوار')), h('option', { value: '1' }, tx('Single-phase', 'أحادي الطور')));
  return h('div', { class: 'grid g3 calcs' },
    h('div', { class: 'card calc' }, h('h4', {}, tx('Power → current', 'القدرة ← التيار')), field(tx('System', 'النظام'), sel), field(tx('Voltage (V, line-line for 3φ)', 'الجهد (فولت، بين الأطوار للثلاثي)'), num(a.V, (e) => { a.V = +e.target.value; calc1(); })), field('kW', num(a.kW, (e) => { a.kW = +e.target.value; calc1(); })), field(tx('Power factor', 'معامل القدرة'), num(a.pf, (e) => { a.pf = Math.min(1, Math.max(0.1, +e.target.value || 1)); calc1(); })), out1),
    h('div', { class: 'card calc' }, h('h4', {}, tx('Short-circuit basics', 'أساسيات تيار القصر')), field('kVA', num(b.kva, (e) => { b.kva = +e.target.value; calc2(); })), field(tx('Secondary voltage (V)', 'جهد الثانوي (فولت)'), num(b.V, (e) => { b.V = +e.target.value; calc2(); })), field('%Z', num(b.z, (e) => { b.z = +e.target.value || 1; calc2(); })), out2),
    h('div', { class: 'card calc' }, h('h4', {}, tx('Breaker selection basics (MCB)', 'أساسيات اختيار القاطع (MCB)')), field('Ib (A)', num(c.Ib, (e) => { c.Ib = +e.target.value; calc3(); })), field(tx('Cable capacity Iz (A)', 'سعة الكابل Iz (أمبير)'), num(c.Iz, (e) => { c.Iz = +e.target.value; calc3(); })), field(tx('Prospective Isc (kA)', 'تيار القصر المتوقع (كيلو أمبير)'), num(c.Isc, (e) => { c.Isc = +e.target.value; calc3(); })), field(tx('Breaker Icn/Icu (kA)', 'قدرة قطع القاطع (كيلو أمبير)'), num(c.Icn, (e) => { c.Icn = +e.target.value; calc3(); })), out3));
}
export { mediumSVG };
