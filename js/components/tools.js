// FilterPanel, SearchBar, QuizCard components.
import { h, debounce } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { icon } from '../core/icons.js';
import { search, resultTitle, resultSub } from '../core/search.js';

export function FilterPanel(defs, sel, onChange) {
  const root = h('div', { class: 'filters card' });
  const head = h('div', { class: 'filters-head' }, h('strong', {}, tx('Filters', 'عوامل التصفية')), h('button', { class: 'btn-link', type: 'button', onClick: () => { Object.keys(sel).forEach((k) => sel[k].clear()); root.querySelectorAll('input').forEach((i) => (i.checked = false)); onChange(); } }, tx('Reset', 'إعادة ضبط')));
  root.append(head);
  Object.entries(defs).forEach(([key, def]) => {
    sel[key] = sel[key] || new Set();
    root.append(h('fieldset', { class: 'fgroup' }, h('legend', {}, t(def.label)),
      h('div', { class: 'chips' }, def.opts.map(([v, label]) => {
        const id = `f-${key}-${v}`;
        const inp = h('input', { type: 'checkbox', id, checked: sel[key].has(v), onChange: (e) => { e.target.checked ? sel[key].add(v) : sel[key].delete(v); onChange(); } });
        return h('label', { class: 'fchip', for: id }, inp, h('span', {}, t(label)));
      }))));
  });
  return root;
}

export function SearchBar({ initial = '', placeholder, onSubmit, live = true, autofocus = false } = {}) {
  const input = h('input', { type: 'search', class: 'search-in', placeholder: placeholder || tx('Search: MCB, 16A, C curve, Icu, VCB, SF6, LSIG, IΔn, 30mA, 630A, 11kV…', 'ابحث: MCB، 16A، منحنى C، Icu، VCB، SF6، LSIG، IΔn، 30mA، 630A، 11kV…'), value: initial, 'aria-label': tx('Search the encyclopedia', 'ابحث في الموسوعة'), autocomplete: 'off', enterkeyhint: 'search' });
  const list = h('ul', { class: 'suggest', role: 'listbox', hidden: true });
  const form = h('form', { class: 'searchbar', role: 'search', onSubmit: (e) => { e.preventDefault(); list.hidden = true; (onSubmit || ((q) => { location.hash = `#/search?q=${encodeURIComponent(q)}`; }))(input.value.trim()); } },
    h('span', { class: 'si', html: icon.search }), input, h('button', { class: 'btn btn-primary btn-sm', type: 'submit' }, tx('Search', 'بحث')), list);
  const upd = debounce(() => {
    if (!live) return;
    const q = input.value.trim();
    const r = q ? search(q).slice(0, 6) : [];
    list.replaceChildren(...r.map((x) => h('li', { role: 'option' }, h('a', { href: x.route, onClick: () => { list.hidden = true; } }, h('b', {}, resultTitle(x)), h('small', {}, resultSub(x))))));
    list.hidden = !r.length;
  }, 120);
  input.addEventListener('input', upd);
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) list.hidden = true; });
  if (autofocus) setTimeout(() => input.focus(), 50);
  return form;
}

/* One quiz question with instant feedback. onAnswer(correctBool) is called once. */
export function QuizCard({ q, index, total, onAnswer, onNext, last }) {
  const order = q.opts.map((o, i) => ({ o, i })).sort(() => Math.random() - 0.5);
  const fb = h('div', { class: 'quiz-fb', 'aria-live': 'polite' });
  const next = h('button', { class: 'btn btn-primary', type: 'button', hidden: true, onClick: onNext }, last ? tx('See score', 'عرض النتيجة') : tx('Next', 'التالي'));
  let done = false;
  const btns = order.map(({ o, i }) => h('button', { class: 'opt', type: 'button', onClick: (e) => {
    if (done) return; done = true;
    const ok = i === q.a;
    btns.forEach((b, k) => { b.disabled = true; if (order[k].i === q.a) b.classList.add('right'); });
    if (!ok) e.currentTarget.classList.add('wrong');
    fb.replaceChildren(h('strong', { class: ok ? 'ok' : 'bad' }, ok ? tx('Correct', 'صحيح') : tx('Wrong', 'خطأ')), ' — ', t(q.e));
    next.hidden = false; next.focus();
    onAnswer(ok);
  } }, t(o)));
  return h('div', { class: 'quiz-card card' },
    h('div', { class: 'quiz-meta' }, h('span', { class: 'brand-mini' }, 'POWER ACADEMY'), h('span', {}, `${index + 1} / ${total}`)),
    h('div', { class: 'progress' }, h('i', { style: { width: `${(index / total) * 100}%` } })),
    h('h3', { class: 'quiz-q' }, t(q.q)), h('div', { class: 'opts' }, btns), fb, h('div', { class: 'quiz-actions' }, next));
}
