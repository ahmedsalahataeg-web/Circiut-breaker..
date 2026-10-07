import { h, countUp, onVisible, reveal } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { icon } from '../core/icons.js';
import { breakers } from '../data/breakers.js';
import { glossary } from '../data/glossary.js';
import { quiz } from '../data/quiz.js';
import { interview } from '../data/interview.js';
import { cases } from '../data/cases.js';
import { voltageClasses, voltageDisclaimer } from '../data/reference.js';
import { BreakerCard, SafetyNotice, Section } from '../components/common.js';
import { SearchBar } from '../components/tools.js';

function heroBg() {
  const lines = Array.from({ length: 7 }, (_, i) => `<path class="flow" style="animation-delay:${i * .6}s" d="M0 ${60 + i * 52}H${240 + (i % 3) * 40}l16-14h40l16 14H1000"/>`).join('');
  const levels = [['EHV/UHV', 52], ['HV', 150], ['MV', 250], ['LV', 350]].map(([l, y]) => `<text x="40" y="${y}" class="lvl">${l}</text><line x1="110" x2="1000" y1="${y - 4}" y2="${y - 4}" stroke="var(--line)" stroke-dasharray="2 8"/>`).join('');
  return `<svg viewBox="0 0 1000 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    ${levels}${lines}
    <g class="schem" transform="translate(690 150)">
      <circle cx="0" cy="0" r="5" fill="var(--cyan)"/><path d="M0 0v40" stroke="var(--cyan)" stroke-width="3"/>
      <path d="M0 40l22-30" stroke="var(--amber)" stroke-width="4" stroke-linecap="round" class="blade"/>
      <path d="M0 62v60" stroke="var(--cyan)" stroke-width="3"/><circle cx="0" cy="62" r="5" fill="var(--cyan)"/>
      <path d="M10 28l8 8-8 8 8 8" fill="none" stroke="var(--amber)" stroke-width="2" class="arc-flicker"/>
    </g></svg>`;
}

export function HomePage() {
  const stat = (n, label) => { const v = h('b', {}, '0'); const box = h('div', { class: 'stat' }, v, h('span', {}, label)); onVisible(box, () => countUp(v, n)); return box; };
  const root = h('div', { class: 'home' });
  root.append(
    h('section', { class: 'hero' },
      h('div', { class: 'hero-bg', html: heroBg() }),
      h('div', { class: 'wrap hero-in' },
        h('div', { class: 'hero-logo' }, h('span', { class: 'pa-mark' }, 'PA'), h('span', { class: 'pa-word' }, 'POWER ACADEMY')),
        h('h1', { class: 'hero-title' }, h('span', { class: 'ltr grad' }, 'CIRCUIT BREAKER'), ' ', h('span', { class: 'ltr' }, 'ENCYCLOPEDIA')),
        h('p', { class: 'hero-tag' }, tx('From MCB to high-voltage breakers', 'من الـ MCB إلى قواطع الجهد العالي')),
        h('p', { class: 'hero-sub' }, tx('Your interactive guide to circuit breakers: types, symbols, ratings and applications in power and protection systems.', 'دليلك التفاعلي لفهم القواطع الكهربائية، أنواعها، رموزها، مواصفاتها، واستخداماتها في أنظمة القدرة والحماية.')),
        h('div', { class: 'hero-cta' },
          h('a', { class: 'btn btn-primary', href: '#/breakers' }, 'EXPLORE CIRCUIT BREAKERS'),
          h('a', { class: 'btn btn-ghost', href: '#/compare' }, 'COMPARE BREAKERS'),
          h('a', { class: 'btn btn-ghost', href: '#/quiz' }, 'TEST YOUR KNOWLEDGE')),
        h('div', { class: 'hero-search' }, SearchBar({})))),
    h('div', { class: 'wrap' },
      h('div', { class: 'stats' },
        stat(breakers.length, tx('Breaker families', 'عائلات القواطع')), stat(glossary.length, tx('Glossary terms', 'مصطلحات')), stat(quiz.length, tx('Quiz questions', 'أسئلة اختبار')), stat(interview.length, tx('Interview questions', 'أسئلة مقابلات')), stat(cases.length, tx('Case studies', 'حالات عملية'))),
      Section('vmap', tx('Voltage classes', 'فئات الجهد'),
        h('div', { class: 'grid g4' }, voltageClasses.map((v) => h('a', { class: 'card lift vc', href: `#/breakers?cls=${v.id}` }, h('span', { class: `vbadge ${v.id}` }, v.id.toUpperCase()), h('h3', {}, t(v.name)), h('p', { class: 'mono small' }, t(v.range)), h('p', { class: 'muted small' }, v.examples)))),
        h('p', { class: 'muted small' }, t(voltageDisclaimer))),
      Section('feat', tx('Explore the encyclopedia', 'استكشف الموسوعة'),
        h('div', { class: 'grid g4' }, [
          ['#/map', 'grid', tx('Circuit Breaker Map', 'خريطة القواطع'), tx('LV → MV → HV → EHV classification tree.', 'شجرة التصنيف من LV إلى EHV.')],
          ['#/lab', 'lab', tx('Interactive Lab', 'المعمل التفاعلي'), tx('LSIG curve, arc interruption, breaking capacity, calculators.', 'منحنى LSIG وإطفاء القوس وقدرة القطع والحاسبات.')],
          ['#/read', 'search', tx('Read this breaker', 'اقرأ بيانات القاطع'), tx('Decode markings and identify breaker types.', 'فك شفرة العلامات وتعرّف على أنواع القواطع.')],
          ['#/apps', 'bolt', tx('Applications & wizard', 'التطبيقات والمساعد'), tx('Where each breaker is used + selection wizard.', 'أين يُستخدم كل قاطع + مساعد الاختيار.')],
          ['#/compare', 'compare', tx('Compare breakers', 'قارن القواطع'), tx('Side-by-side matrix for 2–3 breakers.', 'مصفوفة مقارنة لقاطعين أو ثلاثة.')],
          ['#/glossary', 'book', tx('Glossary & markings', 'القاموس والعلامات'), tx('What do all these letters mean?', 'ماذا تعني كل هذه الحروف؟')],
          ['#/cases', 'warn', tx('Case studies', 'حالات عملية'), tx('Real engineering problems and lessons.', 'مشكلات هندسية حقيقية ودروس.')],
          ['#/interview', 'quiz', tx('Interview mode', 'وضع المقابلات'), tx('Questions with engineering explanations.', 'أسئلة مع شرح هندسي.')],
        ].map(([href, ic, title, d]) => h('a', { class: 'card lift feat', href }, h('span', { class: 'feat-ico', html: icon[ic] }), h('h3', {}, title), h('p', { class: 'muted small' }, d))))),
      Section('top', tx('Start with the essentials', 'ابدأ بالأساسيات'),
        h('div', { class: 'grid g3' }, ['mcb', 'mccb', 'acb', 'rccb', 'vcb', 'sf6-hv'].map((id) => BreakerCard(breakers.find((b) => b.id === id)))),
        h('p', { class: 'muted small' }, tx('Comprehensive coverage of major circuit-breaker families and technologies.', 'تغطية شاملة لعائلات وتقنيات القواطع الرئيسية.'))),
      SafetyNotice(),
      h('section', { class: 'finale' },
        h('h2', { class: 'ltr' }, "DON'T JUST MEMORIZE BREAKERS."),
        h('h2', { class: 'ltr grad' }, 'UNDERSTAND WHY THEY TRIP.'),
        h('p', { class: 'pa-line ltr' }, 'POWER ACADEMY'),
        h('p', { class: 'muted ltr' }, 'Learn Electrical Power. Understand Protection. Think Like an Engineer.'),
        h('a', { class: 'btn btn-primary', href: '#/breakers' }, 'START LEARNING'))));
  reveal(root);
  return root;
}
