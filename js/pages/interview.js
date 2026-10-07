import { h } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { interview } from '../data/interview.js';
import { PageHead, SafetyNotice } from '../components/common.js';

export function InterviewPage({ query }) {
  const cards = interview.map((x, n) => {
    const ans = h('div', { class: 'iv-ans', hidden: true }, h('p', {}, h('strong', {}, tx('Answer: ', 'الإجابة: ')), t(x.a)),
      h('p', {}, h('strong', {}, tx('Engineering explanation: ', 'الشرح الهندسي: ')), t(x.e)), h('p', { class: 'mistake' }, h('strong', {}, tx('Common mistake: ', 'خطأ شائع: ')), t(x.m)));
    const btn = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', 'aria-expanded': 'false', onClick: () => { ans.hidden = !ans.hidden; btn.setAttribute('aria-expanded', String(!ans.hidden)); btn.textContent = ans.hidden ? tx('Show Answer', 'اعرض الإجابة') : tx('Hide Answer', 'أخفِ الإجابة'); } }, tx('Show Answer', 'اعرض الإجابة'));
    const c = h('article', { class: `card iv ${query.q === x.id ? 'hl' : ''}`, id: `iv-${x.id}` }, h('span', { class: 'brand-mini' }, `Q${n + 1}`), h('h3', {}, t(x.q)), btn, ans);
    if (query.q === x.id) { ans.hidden = false; btn.textContent = tx('Hide Answer', 'أخفِ الإجابة'); btn.setAttribute('aria-expanded', 'true'); }
    return c;
  });
  const page = h('div', { class: 'wrap' }, PageHead(tx('Interview Mode', 'وضع المقابلات'), tx('Try answering first, then reveal the answer and the engineering explanation.', 'حاول الإجابة أولًا ثم اعرض الإجابة والشرح الهندسي.')), h('div', { class: 'grid g2' }, cards), SafetyNotice());
  setTimeout(() => { const el = page.querySelector('.hl'); if (el) el.scrollIntoView({ block: 'center' }); }, 60);
  return page;
}
