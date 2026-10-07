import { h } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { search, resultTitle, resultSub } from '../core/search.js';
import { PageHead, Empty } from '../components/common.js';
import { SearchBar } from '../components/tools.js';

const typeLabel = { breaker: ['Breaker', 'قاطع'], term: ['Glossary', 'قاموس'], marking: ['Marking', 'علامة'], interview: ['Interview', 'مقابلة'] };
export function SearchPage({ query }) {
  const q = query.q || '';
  const res = q ? search(q) : [];
  const list = h('ul', { class: 'results' }, res.map((r) => h('li', {}, h('a', { class: 'card lift res', href: r.route }, h('span', { class: 'chip' }, tx(...typeLabel[r.type])), h('b', {}, resultTitle(r)), h('small', { class: 'muted' }, resultSub(r))))));
  return h('div', { class: 'wrap narrow' }, PageHead(tx('Search', 'بحث'), q ? tx(`${res.length} results for “${q}”`, `${res.length} نتيجة لـ «${q}»`) : tx('Try: 16A, C curve, Icu, IΔn, 30mA, 630A, 11kV', 'جرّب: 16A، منحنى C، Icu، IΔn، 30mA، 630A، 11kV')),
    SearchBar({ initial: q, live: false, autofocus: !q, onSubmit: (v) => { location.hash = `#/search?q=${encodeURIComponent(v)}`; } }),
    q && !res.length ? Empty(tx('No results. Try a breaker name (MCB, VCB), a rating (16A, 11kV) or a term (Icu, LSIG).', 'لا توجد نتائج. جرّب اسم قاطع (MCB، VCB) أو قيمة (16A، 11kV) أو مصطلحًا (Icu، LSIG).')) : list);
}
