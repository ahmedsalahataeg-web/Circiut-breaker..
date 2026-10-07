import { h, clear } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { levels, quiz } from '../data/quiz.js';
import { PageHead } from '../components/common.js';
import { QuizCard } from '../components/tools.js';

export function QuizPage() {
  const box = h('div', { class: 'quiz-box' });
  function menu() {
    clear(box);
    box.append(h('div', { class: 'grid g2' }, levels.map((l) => {
      const n = quiz.filter((q) => q.level === l.id).length;
      return h('button', { class: 'card lift lvl-card', type: 'button', onClick: () => run(l.id) }, h('span', { class: 'brand-mini' }, 'POWER ACADEMY'), h('h3', {}, t(l.name)), h('p', { class: 'muted' }, tx(`${n} questions`, `${n} أسئلة`)));
    })), h('button', { class: 'btn btn-primary', type: 'button', onClick: () => run('all') }, tx('Mixed challenge (all levels)', 'تحدٍّ شامل (كل المستويات)')));
  }
  function run(level) {
    const qs = [...quiz.filter((q) => level === 'all' || q.level === level)].sort(() => Math.random() - 0.5).slice(0, level === 'all' ? 12 : 99);
    let i = 0, score = 0, answered = false;
    const wrong = [];
    function step() {
      clear(box);
      if (i >= qs.length) {
        const pct = Math.round((score / qs.length) * 100);
        const msg = pct >= 80 ? tx('Excellent – you think like a protection engineer!', 'ممتاز – تفكر كمهندس حماية!') : pct >= 50 ? tx('Good – review the explanations below.', 'جيد – راجع الشرح أدناه.') : tx('Keep learning – explore the encyclopedia and retry.', 'واصل التعلم – استكشف الموسوعة وأعد المحاولة.');
        box.append(h('div', { class: 'card score' }, h('h2', {}, `${score} / ${qs.length}`), h('div', { class: 'progress big' }, h('i', { style: { width: `${pct}%` } })), h('p', {}, `${pct}% — ${msg}`),
          wrong.length ? h('div', {}, h('h4', {}, tx('Review', 'مراجعة')), h('ul', {}, wrong.map((q) => h('li', {}, h('strong', {}, t(q.q)), ' — ', t(q.e))))) : null,
          h('div', { class: 'row-gap' }, h('button', { class: 'btn btn-primary', type: 'button', onClick: () => run(level) }, tx('Retry', 'إعادة')), h('button', { class: 'btn btn-ghost', type: 'button', onClick: menu }, tx('Levels', 'المستويات')))));
        return;
      }
      answered = false;
      const q = qs[i];
      box.append(QuizCard({ q, index: i, total: qs.length, last: i === qs.length - 1, onAnswer: (ok) => { if (answered) return; answered = true; if (ok) score++; else wrong.push(q); }, onNext: () => { i++; step(); } }));
    }
    step();
  }
  menu();
  return h('div', { class: 'wrap narrow' }, PageHead(tx('Test Your Knowledge', 'اختبر معلوماتك'), tx('Four levels from beginner to protection engineer.', 'أربعة مستويات من المبتدئ إلى مهندس الحماية.')), box);
}
