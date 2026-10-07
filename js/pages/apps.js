import { h, clear } from '../core/dom.js';
import { t, tx, L, termName } from '../core/store.js';
import { byId } from '../data/breakers.js';
import { scenarios } from '../data/scenarios.js';
import { PageHead, Section, EduNotice, SafetyNotice } from '../components/common.js';

function Scenarios(sel) {
  const detail = h('div', { class: 'card sc-detail', 'aria-live': 'polite' });
  const bar = h('div', { class: 'chips sc-bar' });
  const btns = {};
  function pick(id) {
    const s = scenarios.find((x) => x.id === id) || scenarios[0];
    Object.entries(btns).forEach(([k, b]) => b.classList.toggle('on', k === s.id));
    detail.replaceChildren(h('h3', {}, t(s.name)), h('p', { class: 'muted' }, t(s.desc)),
      h('div', { class: 'sc-items' }, s.items.map((it) => h('div', { class: 'sc-item' }, h('strong', {}, t(it.role)),
        h('div', { class: 'chips' }, it.ids.map((i) => byId[i] ? h('a', { class: 'chip link', href: `#/breaker/${i}` }, byId[i].name) : null)), h('p', { class: 'muted small' }, t(it.note))))));
  }
  scenarios.forEach((s) => { const b = h('button', { type: 'button', class: 'chip link', onClick: () => pick(s.id) }, t(s.name)); btns[s.id] = b; bar.append(b); });
  pick(sel);
  return h('div', {}, bar, detail);
}

/* ---------- Selection wizard (educational, rule based) ---------- */
const O = (v, en, ar) => ({ v, l: L(en, ar) });
const steps = [
  { k: 'volt', q: L('System voltage level?', 'مستوى جهد المنظومة؟'), o: [O('lv', 'Low voltage (≤ 1000 V AC / 1500 V DC)', 'منخفض (≤ 1000 فولت AC / 1500 فولت DC)'), O('mv', 'Medium voltage (> 1 kV to ~52 kV)', 'متوسط (> 1 كيلو فولت حتى ~52)'), O('hv', 'High voltage (> ~52 kV)', 'عالٍ (> ~52 كيلو فولت)')] },
  { k: 'sup', q: L('Supply type?', 'نوع التغذية؟'), o: [O('ac', 'AC', 'AC'), O('dc', 'DC (batteries, PV, traction)', 'DC (بطاريات، شمسي، جر)')] },
  { k: 'cur', q: L('Rated current (LV)?', 'التيار المقنن (LV)؟'), o: [O('s', 'Up to ~125 A', 'حتى ~125 أمبير'), O('m', '~125 A to ~1600 A', 'من ~125 إلى ~1600 أمبير'), O('l', 'Above ~1600 A', 'فوق ~1600 أمبير')] },
  { k: 'load', q: L('What is being protected?', 'ما الذي يتم حمايته؟'), o: [O('final', 'Final circuit (lighting, sockets)', 'دائرة نهائية (إضاءة، قوابس)'), O('feeder', 'Feeder / main incomer', 'مغذٍّ / قاطع رئيسي'), O('motor', 'Motor', 'محرك'), O('gen', 'Generator', 'مولد'), O('trafo', 'Transformer / line', 'محول / خط')] },
  { k: 'leak', q: L('Need earth-leakage / shock protection?', 'هل تحتاج حماية من التسرب الأرضي/الصعق؟'), o: [O('y', 'Yes', 'نعم'), O('n', 'No / handled elsewhere', 'لا / تُنفذ في مكان آخر')] },
  { k: 'fault', q: L('Prospective short-circuit level (from calculation)?', 'مستوى القصر المتوقع (من الحساب)؟'), o: [O('low', 'Low (a few kA)', 'منخفض (بضعة كيلو أمبير)'), O('mid', 'Medium (up to ~50 kA)', 'متوسط (حتى ~50 كيلو أمبير)'), O('high', 'High (> ~50 kA)', 'مرتفع (> ~50 كيلو أمبير)')] },
  { k: 'env', q: L('Installation environment?', 'بيئة التركيب؟'), o: [O('panel', 'Indoor panel / switchgear', 'لوحة داخلية / switchgear'), O('out', 'Outdoor yard / substation', 'ساحة خارجية / محطة'), O('compact', 'Space-limited / harsh (compact)', 'مساحة محدودة / قاسية (مدمج)')] },
  { k: 'remote', q: L('Remote control / relay protection required?', 'هل تحتاج تحكمًا عن بعد/حماية بريليه؟'), o: [O('y', 'Yes', 'نعم'), O('n', 'No', 'لا')] },
  { k: 'freq', q: L('Frequent switching operations?', 'عمليات تشغيل متكررة؟'), o: [O('y', 'Yes', 'نعم'), O('n', 'Rarely', 'نادرًا')] },
  { k: 'sel', q: L('Time selectivity with downstream devices needed?', 'هل تحتاج انتقائية زمنية مع الأجهزة التالية؟'), o: [O('y', 'Yes', 'نعم'), O('n', 'No', 'لا')] },
  { k: 'maint', q: L('Maintenance expectation?', 'توقعات الصيانة؟'), o: [O('min', 'Minimal', 'قليلة'), O('sched', 'Scheduled maintenance is acceptable', 'مقبول صيانة مجدولة')] },
];

function recommend(a) {
  const r = [];
  const add = (id, why) => byId[id] && r.push({ id, why });
  if (a.volt === 'lv') {
    if (a.sup === 'dc') add('dc-lv', L('Only breakers explicitly rated for the DC voltage/polarity/time-constant are acceptable.', 'يجب استخدام قواطع مقننة صراحة لجهد DC وقطبيته وثابت الزمن.')), a.load !== 'motor' && add('pv-dc', L('If this is a PV string/array, use PV-rated DC protection.', 'إن كانت سلسلة/مصفوفة شمسية فاستخدم حماية DC مخصصة للشمسي.'));
    else {
      if (a.load === 'motor') { add('mpcb', L('Motor-protection circuit-breaker: adjustable thermal + magnetic, phase-loss sensitive; usually with a contactor.', 'قاطع حماية المحركات: حراري قابل للضبط + مغناطيسي، حساس لفقد الطور؛ غالبًا مع كونتاكتور.')); if (a.cur !== 's') add('mccb', L('Larger motors: MCCB with motor-type trip unit per manufacturer data.', 'محركات أكبر: MCCB بوحدة فصل للمحركات حسب الشركة.')); }
      else if (a.cur === 's' && a.fault !== 'high') {
        if (a.leak === 'y') add('rcbo', L('Overcurrent + residual-current protection in one device per circuit.', 'حماية تيار زائد + تيار متبقٍ في جهاز واحد لكل دائرة.')), add('rccb', L('Alternative: RCCB with upstream overcurrent protection covering several circuits.', 'بديل: RCCB مع حماية تيار زائد أمامية لعدة دوائر.'));
        add('mcb', L('Standard choice for final circuits; choose curve (B/C/D) by inrush and Icn ≥ prospective fault.', 'اختيار قياسي للدوائر النهائية؛ اختر المنحنى (B/C/D) حسب الاندفاع وIcn ≥ تيار القصر.'));
      } else if (a.cur === 'l' || a.sel === 'y' && a.cur !== 's' || a.fault === 'high' && a.cur === 'm') {
        add('acb', L('Highest ratings, adjustable LSIG and Icw for time selectivity on main/bus-coupler duties.', 'أعلى القدرات مع LSIG قابل للضبط وIcw للانتقائية الزمنية للمدخل الرئيسي/ربط القضبان.')); if (a.cur !== 'l') add('mccb', L('Electronic-trip MCCB can serve mid-range feeders if Icw/selectivity is sufficient.', 'MCCB بوحدة إلكترونية قد يخدم المغذيات المتوسطة إن كانت Icw/الانتقائية كافية.'));
      } else { add('mccb', L('Typical for feeders and mid-range currents with higher breaking capacity.', 'مناسب للمغذيات والتيارات المتوسطة وقدرات قطع أعلى.')); if (a.leak === 'y') add('rccb', L('Add residual-current protection where required (integrated RCD module or separate).', 'أضف حماية تيار متبقٍ عند الحاجة (وحدة RCD مدمجة أو منفصلة).')); }
    }
  } else if (a.volt === 'mv') {
    add('vcb', L('Common for MV indoor switchgear: long life, low maintenance, frequent-operation capable; driven by CT + protection relay.', 'شائع في لوحات MV الداخلية: عمر طويل وصيانة قليلة ويتحمل التشغيل المتكرر؛ ويعمل بـ CT + ريليه.'));
    if (a.env === 'compact') add('sf6-mv', L('SF6 MV breakers/GIS suit compact or harsh sites; observe SF6 handling and regulations.', 'قواطع SF6 للـ MV/GIS تناسب المواقع المدمجة/القاسية؛ مع مراعاة التعامل مع SF6 واللوائح.'));
    if (a.load === 'gen') add('gcb', L('Generator circuit-breaker for high-current generator duty (IEC/IEEE 62271-37-013).', 'قاطع مولد لخدمة تيارات المولدات العالية (IEC/IEEE 62271-37-013).'));
    if (a.freq === 'n' && a.env === 'out') add('sf6-mv', L('Outdoor MV feeders may use SF6 or vacuum designs depending on utility practice.', 'مغذيات MV الخارجية قد تستخدم SF6 أو فراغ حسب ممارسة الشركة.'));
  } else {
    if (a.env === 'compact') add('gis-cb', L('GIS: compact, enclosed, suited to space-limited, polluted or indoor substations.', 'GIS: مدمج ومغلق ومناسب للمساحات المحدودة والملوثة والمحطات الداخلية.'));
    else { add('sf6-hv', L('SF6 is the dominant technology at HV/EHV.', 'SF6 هو التقنية السائدة في HV/EHV.')); add('dead-tank', L('Dead-tank layout where CT integration/seismic robustness is preferred.', 'تصميم Dead-tank حيث يُفضَّل دمج CT أو تحمل الزلازل.')); add('live-tank', L('Live-tank layout is widely used in AIS substations.', 'تصميم Live-tank شائع في محطات AIS.')); }
  }
  return r;
}

function Wizard() {
  const a = {}; let i = 0;
  const box = h('div', { class: 'card wizard' });
  function show() {
    clear(box);
    if (i >= steps.length) {
      const rec = recommend(a);
      box.append(h('h3', {}, tx('Preliminary suggestions', 'اقتراحات أولية')),
        rec.length ? h('div', { class: 'grid g2' }, rec.map((x, n) => h('a', { class: 'card lift rec', href: `#/breaker/${x.id}` }, h('span', { class: 'vbadge lv' }, `#${n + 1}`), h('h4', {}, termName(byId[x.id])), h('p', { class: 'muted small' }, t(x.why))))) : h('p', {}, tx('No clear match – review the encyclopedia.', 'لا توجد مطابقة واضحة – راجع الموسوعة.')),
        EduNotice(), h('button', { class: 'btn btn-ghost', type: 'button', onClick: () => { i = 0; Object.keys(a).forEach((k) => delete a[k]); show(); } }, tx('Start over', 'ابدأ من جديد')));
      return;
    }
    const s = steps[i];
    box.append(h('div', { class: 'quiz-meta' }, h('span', {}, tx(`Question ${i + 1} of ${steps.length}`, `سؤال ${i + 1} من ${steps.length}`))),
      h('div', { class: 'progress' }, h('i', { style: { width: `${(i / steps.length) * 100}%` } })), h('h3', {}, t(s.q)),
      h('div', { class: 'opts' }, s.o.map((o) => h('button', { class: 'opt', type: 'button', onClick: () => { a[s.k] = o.v; i++; show(); } }, t(o.l)))),
      i ? h('button', { class: 'btn-link', type: 'button', onClick: () => { i--; show(); } }, tx('← Back', '→ رجوع')) : null);
  }
  show();
  return box;
}

export function AppsPage({ query }) {
  return h('div', { class: 'wrap' },
    PageHead(tx('Where Do We Use Each Breaker?', 'أين نستخدم كل قاطع؟'), tx('Pick a scenario to see typical breaker roles, then try the selection wizard.', 'اختر سيناريو لترى أدوار القواطع النموذجية، ثم جرّب مساعد الاختيار.')),
    Section('sc', tx('Scenarios', 'السيناريوهات'), Scenarios(query.s)),
    Section('wiz', tx('Breaker selection wizard', 'مساعد اختيار القاطع'), Wizard()),
    SafetyNotice());
}
