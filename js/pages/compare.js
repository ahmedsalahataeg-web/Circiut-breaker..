import { h, clear } from '../core/dom.js';
import { t, tx, termName } from '../core/store.js';
import { breakers, byId } from '../data/breakers.js';
import { compareData, presets } from '../data/compare.js';
import { thumbFor } from '../data/diagrams.js';
import { PageHead, VoltageBadge, EduNotice, Empty, Pills } from '../components/common.js';

const rows = [
  [tx('Voltage class', 'فئة الجهد'), (b) => h('span', {}, b.voltageClass.map(VoltageBadge))],
  [tx('Typical voltage', 'الجهد النموذجي'), (b) => t(b.voltageText)],
  [tx('Current range', 'مدى التيار'), (b) => t(b.currentText)],
  [tx('Breaking technology', 'تقنية القطع'), (b) => t(b.tech)],
  [tx('Arc medium', 'وسيط القوس'), (b) => Pills(b.arc.map((a) => a.toUpperCase()))],
  [tx('Protection', 'الحماية'), (b) => t(b.protText)],
  [tx('Trip unit', 'وحدة الفصل'), (b) => t(compareData[b.id]?.trip)],
  [tx('Breaking capacity', 'قدرة القطع'), (b) => t(compareData[b.id]?.bc)],
  [tx('Standards', 'المعايير'), (b) => b.standards.join(' • ')],
  [tx('Poles / AC-DC', 'الأقطاب / AC-DC'), (b) => `${b.poles.join(', ')} • ${b.acdc.map((x) => x.toUpperCase()).join('/')}`],
  [tx('Installation', 'التركيب'), (b) => t(compareData[b.id]?.inst)],
  [tx('Maintenance', 'الصيانة'), (b) => t(compareData[b.id]?.maint)],
  [tx('Advantages', 'المميزات'), (b) => h('ul', {}, b.adv.slice(0, 3).map((x) => h('li', {}, t(x))))],
  [tx('Limitations', 'العيوب'), (b) => h('ul', {}, b.lim.slice(0, 3).map((x) => h('li', {}, t(x))))],
  [tx('Typical use', 'استخدام نموذجي'), (b) => t(b.example)],
];

export function ComparePage({ query }) {
  let sel = (query.ids || '').split(',').filter((id) => byId[id]).slice(0, 3);
  if (sel.length < 2 && !query.ids) sel = ['mcb', 'mccb'];
  const out = h('div', { class: 'cmp-out' });
  const chips = h('div', { class: 'chips cmp-chips' });
  const pre = h('div', { class: 'chips' });
  const sync = () => { try { history.replaceState(null, '', `#/compare?ids=${sel.join(',')}`); } catch (e) { /* ignore */ } };
  function toggle(id) {
    if (sel.includes(id)) sel = sel.filter((x) => x !== id);
    else { sel.push(id); if (sel.length > 3) sel.shift(); }
    draw();
  }
  function draw() {
    sync();
    clear(chips);
    breakers.forEach((b) => chips.append(h('button', { type: 'button', class: `chip link ${sel.includes(b.id) ? 'on' : ''}`, 'aria-pressed': sel.includes(b.id), onClick: () => toggle(b.id) }, b.name)));
    clear(out);
    if (sel.length < 2) { out.append(Empty(tx('Select at least 2 breakers (up to 3) to compare.', 'اختر قاطعين على الأقل (حتى 3) للمقارنة.'))); return; }
    const list = sel.map((id) => byId[id]);
    const head = h('tr', {}, h('th', {}, ''), list.map((b) => h('th', { scope: 'col', class: 'cmp-head' },
      h('div', { class: 'cmp-thumb', html: thumbFor(b) }), h('a', { href: `#/breaker/${b.id}` }, termName(b)))));
    const body = rows.map(([label, fn]) => h('tr', {}, h('th', { scope: 'row' }, label), list.map((b) => h('td', { 'data-label': b.name }, fn(b) || '—'))));
    out.append(h('div', { class: 'table-wrap' }, h('table', { class: 'tbl cmp-tbl' }, h('thead', {}, head), h('tbody', {}, body))),
      h('p', { class: 'muted small' }, tx('Values are typical/indicative. Exact ratings depend on manufacturer/model and the applicable standard.', 'القيم نموذجية/إرشادية. القدرات الدقيقة تعتمد على الشركة/الموديل والمعيار المطبق.')));
  }
  presets.forEach((p) => pre.append(h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onClick: () => { sel = [...p.ids]; draw(); } }, p.n)));
  draw();
  return h('div', { class: 'wrap' },
    PageHead(tx('Compare Breakers', 'قارن القواطع'), tx('Pick 2–3 breaker families for a side-by-side comparison.', 'اختر 2–3 عائلات قواطع لمقارنة جنبًا إلى جنب.')),
    h('h3', { class: 'small-h' }, tx('Quick comparisons', 'مقارنات سريعة')), pre,
    h('h3', { class: 'small-h' }, tx('Choose breakers (max 3)', 'اختر القواطع (حتى 3)')), chips, out, EduNotice());
}
