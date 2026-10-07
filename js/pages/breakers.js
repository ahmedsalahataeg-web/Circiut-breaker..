import { h, clear } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { breakers, filterDefs, applyFilters } from '../data/breakers.js';
import { search } from '../core/search.js';
import { PageHead, BreakerCard, Empty } from '../components/common.js';
import { FilterPanel, SearchBar } from '../components/tools.js';

export function BreakersPage({ query }) {
  const sel = {};
  Object.keys(filterDefs).forEach((k) => (sel[k] = new Set()));
  if (query.cls) sel.cls.add(query.cls);
  let q = query.q || '';
  let sort = 'default';
  const grid = h('div', { class: 'grid g3 bgrid' });
  const count = h('p', { class: 'muted small', 'aria-live': 'polite' });
  function render() {
    let list = breakers;
    if (q) { const hits = search(q).filter((r) => r.type === 'breaker'); list = hits.map((r) => r.b); }
    list = applyFilters(list, sel);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'voltage') { const o = { lv: 0, mv: 1, hv: 2, ehv: 3 }; list = [...list].sort((a, b) => o[a.voltageClass[0]] - o[b.voltageClass[0]]); }
    clear(grid);
    if (!list.length) grid.append(Empty(tx('No breakers match these filters.', 'لا توجد قواطع مطابقة لهذه المرشحات.')));
    list.forEach((b) => grid.append(BreakerCard(b)));
    count.textContent = tx(`${list.length} of ${breakers.length} breaker families`, `${list.length} من ${breakers.length} عائلة قواطع`);
  }
  const filters = FilterPanel(filterDefs, sel, render);
  const toggle = h('button', { class: 'btn btn-ghost btn-sm filter-toggle', type: 'button', onClick: () => filters.classList.toggle('open') }, tx('Filters', 'عوامل التصفية'));
  const sortSel = h('select', { class: 'select', 'aria-label': tx('Sort', 'ترتيب'), onChange: (e) => { sort = e.target.value; render(); } },
    h('option', { value: 'default' }, tx('Default order', 'الترتيب الافتراضي')), h('option', { value: 'name' }, tx('Name', 'الاسم')), h('option', { value: 'voltage' }, tx('Voltage class', 'فئة الجهد')));
  render();
  return h('div', { class: 'wrap' },
    PageHead(tx('Circuit Breakers', 'القواطع الكهربائية'), tx('Comprehensive coverage of major circuit-breaker families and technologies. Filter by voltage class, current range, arc medium and more.', 'تغطية شاملة لعائلات وتقنيات القواطع الرئيسية. صفِّ حسب فئة الجهد ومدى التيار ووسيط القوس وغيرها.')),
    h('div', { class: 'toolbar' }, SearchBar({ initial: q, live: false, onSubmit: (v) => { q = v; render(); } }), sortSel, toggle),
    h('div', { class: 'split' }, h('aside', { class: 'side' }, filters), h('div', { class: 'main' }, count, grid)),
    h('p', { class: 'muted small' }, tx('Current ranges are typical/indicative; exact ratings depend on manufacturer/model.', 'مدى التيارات نموذجي/إرشادي؛ والقدرات الدقيقة تعتمد على الشركة/الموديل.')));
}
