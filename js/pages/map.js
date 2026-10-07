import { h } from '../core/dom.js';
import { t, tx, L } from '../core/store.js';
import { breakers, byId } from '../data/breakers.js';
import { voltageClasses, voltageDisclaimer } from '../data/reference.js';
import { PageHead, Section, SafetyNotice, StaticDiagram, Tabs } from '../components/common.js';
import { liveTankSVG, deadTankSVG } from '../data/diagrams.js';

const tree = [
  { id: 'lv', t: L('LOW VOLTAGE', 'الجهد المنخفض'), sub: L('≤ 1000 V AC / 1500 V DC – IEC 60947-2 (MCB: IEC 60898-1)', '≤ 1000 فولت AC / 1500 فولت DC – IEC 60947-2 (وMCB: IEC 60898-1)'),
    items: ['mcb', 'mccb', 'acb', 'rccb', 'rcbo', 'mpcb', 'dc-lv', 'pv-dc', 'elcb'] },
  { id: 'mv', t: L('MEDIUM VOLTAGE', 'الجهد المتوسط'), sub: L('> 1 kV to ~52 kV in practice – IEC 62271-100 / 62271-200', '> 1 كيلو فولت حتى ~52 كيلو فولت عمليًا – IEC 62271-100 / 62271-200'),
    items: ['vcb', 'sf6-mv', 'air-mv', 'oil-cb', 'gcb', { devices: true, l: L('Load Break Switch / Switching Devices', 'مفتاح الحمل / أجهزة الفصل') }] },
  { id: 'hv', t: L('HIGH VOLTAGE', 'الجهد العالي'), sub: L('Roughly 72.5–245 kV in practice – IEC 62271-100', 'نحو 72.5–245 كيلو فولت عمليًا – IEC 62271-100'),
    items: ['sf6-hv', 'airblast', 'oil-cb', { id: 'vcb', l: L('Vacuum applications where applicable', 'تطبيقات الفراغ حيث ينطبق') }, 'gis-cb', 'dead-tank', 'live-tank'] },
  { id: 'ehv', t: L('EXTRA / ULTRA HIGH VOLTAGE', 'الجهد الفائق EHV / UHV'), sub: L('~300 kV and above (conventions vary)', '~300 كيلو فولت فأكثر (والأعراف تختلف)'),
    items: [{ id: 'sf6-hv', l: L('High-voltage SF6', 'SF6 للجهد العالي') }, 'gis-cb', 'dcb', 'hvdc-cb'] },
];

function VoltageMap() {
  const box = h('div', { class: 'vmap card' });
  const bar = h('div', { class: 'vbar', role: 'tablist' });
  const detail = h('div', { class: 'vdetail', 'aria-live': 'polite' });
  const btns = [];
  const pick = (i) => {
    const v = voltageClasses[i];
    btns.forEach((b, j) => b.classList.toggle('on', i === j));
    detail.replaceChildren(h('h3', {}, t(v.name)), h('p', { class: 'mono' }, t(v.range)), h('p', {}, t(v.note)), h('p', { class: 'muted' }, tx('Typical breakers: ', 'قواطع نموذجية: '), v.examples),
      h('a', { class: 'btn btn-ghost btn-sm', href: `#/breakers?cls=${v.id}` }, tx('Show breakers', 'اعرض القواطع')));
  };
  voltageClasses.forEach((v, i) => { const b = h('button', { class: `vseg ${v.id}`, type: 'button', role: 'tab', onClick: () => pick(i) }, h('b', {}, v.id.toUpperCase()), h('small', {}, t(v.range))); btns.push(b); bar.append(b); });
  box.append(bar, detail, h('p', { class: 'muted small' }, tx('IEC-oriented classification. ', 'تصنيف موجّه بمعايير IEC. '), t(voltageDisclaimer)));
  pick(0);
  return box;
}

function Transition(a, b, mark, note) {
  return h('div', { class: 'transition', 'aria-hidden': 'false' }, h('span', { class: 'tv' }, a), h('span', { class: 'tarrow' }, '↓'), h('span', { class: 'tmark' }, mark), h('span', { class: 'tarrow' }, '↓'), h('span', { class: 'tv' }, b), note ? h('p', { class: 'muted small' }, note) : null);
}

export function MapPage() {
  const col = (g) => h('div', { class: `tree-col ${g.id}` }, h('h3', {}, t(g.t)), h('p', { class: 'muted small' }, t(g.sub)), h('ul', { class: 'tree-list' }, g.items.map((it) => {
    if (typeof it === 'string') { const b = byId[it]; return h('li', {}, h('a', { href: `#/breaker/${b.id}` }, b.name, h('small', {}, ' ' + t(b.ar)), b.legacy ? h('em', { class: 'legacy-tag' }, tx('legacy', 'قديم')) : null)); }
    if (it.devices) return h('li', {}, h('a', { href: '#/devices' }, t(it.l)));
    return h('li', {}, h('a', { href: `#/breaker/${it.id}` }, t(it.l)));
  })));
  return h('div', { class: 'wrap' },
    PageHead(tx('Circuit Breaker Map', 'خريطة القواطع'), tx('A visual classification of circuit-breaker families by voltage level.', 'تصنيف مرئي لعائلات القواطع حسب مستوى الجهد.')),
    h('div', { class: 'note card' }, tx('Classifications are not identical worldwide. LV/MV/HV boundaries vary by standard, utility and region. IEC 60947-2 covers low-voltage circuit-breakers up to 1000 V AC / 1500 V DC, while IEC 62271-100 covers AC circuit-breakers above 1000 V.',
      'التصنيفات ليست متطابقة عالميًا. تختلف حدود LV/MV/HV حسب المعيار والجهة والمنطقة. تغطي IEC 60947-2 القواطع منخفضة الجهد حتى 1000 فولت AC / 1500 فولت DC، بينما تغطي IEC 62271-100 قواطع AC فوق 1000 فولت.')),
    h('div', { class: 'tree' }, tree.map((g, i) => [col(g), i < tree.length - 1 ? h('div', { class: 'tree-arrow', 'aria-hidden': 'true' }, '↓') : null])),
    Section('vm', tx('Interactive voltage map', 'خريطة الجهد التفاعلية'), VoltageMap()),
    Section('tr', tx('Voltage transitions', 'الانتقال بين الجهود'),
      h('div', { class: 'grid g2' },
        Transition('LOW VOLTAGE', 'MEDIUM VOLTAGE', '1000 V', tx('Above 1000 V the breaker standard changes (IEC 62271-100) and protection typically becomes CT + relay + breaker instead of a built-in thermal-magnetic trip unit.', 'فوق 1000 فولت يتغير معيار القواطع (IEC 62271-100) وتصبح الحماية عادةً CT + ريليه + قاطع بدل وحدة فصل حرارية-مغناطيسية مدمجة.')),
        Transition('MEDIUM VOLTAGE', 'HIGH VOLTAGE', '~52 kV', tx('Indicative boundary only – IEC 62271-200 covers metal-enclosed switchgear up to 52 kV; utilities define MV/HV differently.', 'حد إرشادي فقط – IEC 62271-200 تغطي اللوحات المعدنية حتى 52 كيلو فولت؛ والشركات تعرّف MV/HV بشكل مختلف.')))),
    Section('lvd', tx('Live tank vs Dead tank', 'Live tank مقابل Dead tank'),
      h('div', { class: 'grid g2' }, StaticDiagram(liveTankSVG(), L('Live tank: interrupter at line potential in an insulating column.', 'Live tank: وحدة القطع عند جهد الخط داخل عمود عازل.')), StaticDiagram(deadTankSVG(), L('Dead tank: interrupter in a grounded metal tank, bushing CTs.', 'Dead tank: وحدة القطع في خزان معدني مؤرض مع CT بوشينج.'))),
      h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, h('th', {}, ''), h('th', {}, 'Live tank'), h('th', {}, 'Dead tank'))),
        h('tbody', {}, [
          [tx('Construction', 'الإنشاء'), tx('Interrupter in an insulator column at line potential', 'وحدة القطع في عمود عازل عند جهد الخط'), tx('Interrupter in a grounded metal tank', 'وحدة القطع في خزان معدني مؤرض')],
          [tx('Insulation arrangement', 'ترتيب العزل'), tx('Porcelain/composite column to ground', 'عمود خزفي/مركب نحو الأرض'), tx('Bushings + tank at earth potential', 'بوشينج + خزان عند جهد الأرض')],
          [tx('CT arrangement', 'ترتيب CT'), tx('Typically separate free-standing CTs', 'غالبًا CT منفصلة'), tx('Bushing CTs can be integrated', 'يمكن دمج CT في البوشينج')],
          [tx('Footprint', 'المساحة'), tx('Often larger with separate CTs', 'غالبًا أكبر مع CT منفصلة'), tx('Often more compact bay; heavier unit', 'غالبًا خلية أكثر تدمجًا؛ ووحدة أثقل')],
          [tx('Applications', 'التطبيقات'), tx('Widely used in AIS substations', 'شائع في محطات AIS'), tx('Common in North America and seismic regions', 'شائع في أمريكا الشمالية والمناطق الزلزالية')],
          [tx('Maintenance', 'الصيانة'), tx('Per manufacturer; external access to interrupter', 'حسب الشركة؛ وصول خارجي لوحدة القطع'), tx('Per manufacturer; bushing/CT access', 'حسب الشركة؛ وصول للبوشينج/CT')],
          [tx('Typical configurations', 'تشكيلات نموذجية'), tx('Line bays, bus-coupler bays in AIS', 'خلايا خطوط ووصلات قضبان في AIS'), tx('Same, often where CT integration is preferred', 'مثلها، غالبًا حيث يُفضل دمج CT')],
        ].map((r) => h('tr', {}, h('th', {}, r[0]), h('td', {}, r[1]), h('td', {}, r[2])))))),
      h('p', { class: 'muted small' }, tx('General tendencies – specific designs and utility practice vary.', 'ميول عامة – والتصاميم وممارسات الشركات تختلف.'))),
    SafetyNotice(tx('MV/HV: lethal voltages. Only qualified personnel under permit-to-work with approved isolation and earthing.', 'MV/HV: جهود قاتلة. فقط أفراد مؤهلون بتصريح عمل وعزل وتأريض معتمد.')));
}
