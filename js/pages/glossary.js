import { h, clear } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { glossary } from '../data/glossary.js';
import { markings } from '../data/markings.js';
import { PageHead, Section, Empty, SafetyNotice } from '../components/common.js';

export function GlossaryPage({ query }) {
  let q = '', mf = query.mark ? 'all' : 'all';
  const gl = h('div', { class: 'grid g2' });
  const mk = h('div', { class: 'grid g3' });
  const norm = (s) => String(s).toLowerCase();
  function drawG() {
    clear(gl);
    const list = glossary.filter((g) => !q || norm([g.name, g.ar, t(g.simple), t(g.eng)].join(' ')).includes(q));
    if (!list.length) gl.append(Empty(tx('No terms found.', 'لا توجد مصطلحات.')));
    list.forEach((g) => gl.append(h('article', { class: `card gterm ${query.term === g.id ? 'hl' : ''}`, id: `g-${g.id}` },
      h('h3', {}, g.name, h('small', { class: 'ar-name' }, ` ${g.ar}`)), h('p', {}, h('strong', {}, tx('Simple: ', 'ببساطة: ')), t(g.simple)),
      h('p', {}, h('strong', {}, tx('Engineering: ', 'هندسيًا: ')), t(g.eng)), h('p', { class: 'muted' }, h('strong', {}, tx('Example: ', 'مثال: ')), t(g.ex)))));
  }
  function drawM() {
    clear(mk);
    markings.filter((m) => (mf === 'all' || (mf === 'mfr') === m.mfr) && (!q || norm(m.k + t(m.d)).includes(q))).forEach((m) =>
      mk.append(h('div', { class: `card mk ${query.mark === m.k ? 'hl' : ''}` }, h('code', {}, m.k),
        h('span', { class: `vbadge ${m.mfr ? 'mv' : 'lv'}` }, m.mfr ? tx('Manufacturer-specific', 'خاص بالشركة') : tx('Standard / generic', 'قياسي / عام')),
        h('p', {}, t(m.d)), m.mfr && m.ex ? h('p', { class: 'muted small' }, tx('Example: ', 'مثال: ') + m.ex) : null)));
    if (!mk.children.length) mk.append(Empty(tx('No markings found.', 'لا توجد علامات.')));
  }
  const seg = h('div', { class: 'seg' }, [['all', tx('All', 'الكل')], ['std', tx('Standard', 'قياسي')], ['mfr', tx('Manufacturer-specific', 'خاص بالشركة')]].map(([v, l]) =>
    h('button', { type: 'button', class: `seg-b ${v === mf ? 'on' : ''}`, onClick: (e) => { mf = v; seg.querySelectorAll('.seg-b').forEach((b) => b.classList.toggle('on', b === e.currentTarget)); drawM(); } }, l)));
  const input = h('input', { type: 'search', class: 'search-in solo', placeholder: tx('Filter terms and markings…', 'صفِّ المصطلحات والعلامات…'), 'aria-label': tx('Filter', 'تصفية'), onInput: (e) => { q = e.target.value.toLowerCase().trim(); drawG(); drawM(); } });
  drawG(); drawM();
  const page = h('div', { class: 'wrap' },
    PageHead(tx('Glossary & Markings', 'القاموس والعلامات'), tx('Plain-language and engineering explanations.', 'شرح مبسط وهندسي.')), input,
    Section('terms', tx('Glossary', 'القاموس'), gl),
    Section('marks', tx('WHAT DO ALL THESE LETTERS MEAN?', 'ماذا تعني كل هذه الحروف؟'), seg,
      h('p', { class: 'muted small' }, tx('Codes marked “Manufacturer-specific” are not defined by IEC; meanings differ between manufacturers – check the catalogue.', 'الأكواد «الخاصة بالشركة» غير معرّفة في IEC وتختلف بين الشركات – راجع الكتالوج.')), mk),
    SafetyNotice());
  setTimeout(() => { const el = page.querySelector('.hl'); if (el) el.scrollIntoView({ block: 'center' }); }, 60);
  return page;
}
