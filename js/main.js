import { h } from './core/dom.js';
import { store, t, tx, L } from './core/store.js';
import { icon } from './core/icons.js';
import { route, start, parse } from './core/router.js';
import { WA_URL, WA_NUMBER } from './components/common.js';
import { HomePage } from './pages/home.js';
import { MapPage } from './pages/map.js';
import { BreakersPage } from './pages/breakers.js';
import { BreakerPage } from './pages/breaker.js';
import { ComparePage } from './pages/compare.js';
import { LabPage } from './pages/lab.js';
import { ReadPage } from './pages/read.js';
import { GlossaryPage } from './pages/glossary.js';
import { DevicesPage } from './pages/devices.js';
import { AppsPage } from './pages/apps.js';
import { CasesPage } from './pages/cases.js';
import { QuizPage } from './pages/quiz.js';
import { InterviewPage } from './pages/interview.js';
import { StandardsPage } from './pages/standards.js';
import { SearchPage } from './pages/search.js';
import { byId } from './data/breakers.js';

store.init();

route('/', HomePage);
route('/map', MapPage);
route('/breakers', BreakersPage);
route('/breaker/:id', BreakerPage);
route('/compare', ComparePage);
route('/lab', LabPage);
route('/read', ReadPage);
route('/glossary', GlossaryPage);
route('/devices', DevicesPage);
route('/apps', AppsPage);
route('/cases', CasesPage);
route('/quiz', QuizPage);
route('/interview', InterviewPage);
route('/standards', StandardsPage);
route('/search', SearchPage);

const main = [
  ['/', L('Home', 'الرئيسية')], ['/map', L('Map', 'الخريطة')], ['/breakers', L('Breakers', 'القواطع')], ['/compare', L('Compare', 'مقارنة')], ['/lab', L('Lab', 'المعمل')], ['/quiz', L('Quiz', 'اختبار')],
];
const more = [
  ['/read', L('Read this breaker', 'اقرأ القاطع')], ['/glossary', L('Glossary & markings', 'القاموس والعلامات')], ['/devices', L('Devices & RCD types', 'الأجهزة وأنواع RCD')],
  ['/apps', L('Applications & wizard', 'التطبيقات والمساعد')], ['/cases', L('Case studies', 'حالات عملية')], ['/interview', L('Interview mode', 'وضع المقابلات')], ['/standards', L('Standards & contact', 'المعايير والتواصل')],
];

const header = document.getElementById('site-header');
const footer = document.getElementById('site-footer');
const bottom = document.getElementById('bottom-nav');

function active(path, p) { return p === '/' ? path === '/' : path.startsWith(p); }

function drawHeader() {
  const { path } = parse();
  const link = ([p, l]) => h('a', { href: `#${p}`, class: active(path, p) ? 'on' : '', 'aria-current': active(path, p) ? 'page' : null }, t(l));
  const drawer = h('div', { class: 'drawer', id: 'drawer', hidden: true }, [...main, ...more].map(link));
  const moreMenu = h('div', { class: 'more-menu', hidden: true }, more.map(link));
  const moreBtn = h('button', { class: 'nav-more', type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false', onClick: (e) => { e.stopPropagation(); moreMenu.hidden = !moreMenu.hidden; moreBtn.setAttribute('aria-expanded', String(!moreMenu.hidden)); } }, tx('More', 'المزيد'), h('span', { html: icon.chevron, class: 'chev-down' }));
  const menuBtn = h('button', { class: 'icon-btn menu-btn', type: 'button', 'aria-label': tx('Menu', 'القائمة'), 'aria-expanded': 'false', 'aria-controls': 'drawer', html: icon.menu, onClick: () => { drawer.hidden = !drawer.hidden; menuBtn.setAttribute('aria-expanded', String(!drawer.hidden)); } });
  document.addEventListener('click', () => { moreMenu.hidden = true; moreBtn.setAttribute('aria-expanded', 'false'); }, { once: true });
  header.replaceChildren(h('div', { class: 'wrap head-in' },
    h('a', { class: 'brand', href: '#/', 'aria-label': 'POWER ACADEMY' }, h('span', { class: 'pa-mark' }, 'PA'), h('span', { class: 'brand-t' }, h('b', {}, 'POWER ACADEMY'), h('small', {}, 'CIRCUIT BREAKER ENCYCLOPEDIA'))),
    h('nav', { class: 'nav', 'aria-label': 'Main' }, main.map(link), h('div', { class: 'more-wrap' }, moreBtn, moreMenu)),
    h('div', { class: 'head-tools' },
      h('a', { class: 'icon-btn', href: '#/search', 'aria-label': tx('Search', 'بحث'), html: icon.search }),
      h('button', { class: 'lang-btn', type: 'button', 'aria-label': 'Switch language', onClick: () => store.setLang(store.isAr ? 'en' : 'ar') }, store.isAr ? 'English' : 'العربية'),
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': tx('Toggle theme', 'تبديل المظهر'), html: store.theme === 'dark' ? icon.sun : icon.moon, onClick: () => store.toggleTheme() }),
      menuBtn)),
    drawer);
}

function drawFooter() {
  footer.replaceChildren(h('div', { class: 'wrap foot-in' },
    h('div', { class: 'foot-brand' }, h('a', { class: 'brand', href: '#/' }, h('span', { class: 'pa-mark' }, 'PA'), h('span', { class: 'brand-t' }, h('b', {}, 'POWER ACADEMY'))),
      h('p', { class: 'muted ltr' }, 'Electrical Power • Industrial Automation • Practical Engineering'),
      h('p', { class: 'muted small' }, tx('Educational content. Not a substitute for standards, datasheets or qualified engineering review.', 'محتوى تعليمي. لا يغني عن المعايير والكتالوجات والمراجعة الهندسية المؤهلة.'))),
    h('nav', { class: 'foot-links', 'aria-label': 'Footer' }, [['/standards', L('About & Standards', 'عن الموقع والمعايير')], ['/standards', L('Contact', 'تواصل')], ['/quiz', L('Quiz', 'اختبار')], ['/compare', L('Compare', 'مقارنة')], ['/glossary', L('Glossary', 'القاموس')]].map(([p, l]) => h('a', { href: `#${p}` }, t(l)))),
    h('div', { class: 'foot-contact' }, h('a', { class: 'wa', href: WA_URL, target: '_blank', rel: 'noopener noreferrer', dir: 'ltr' }, h('span', { html: icon.wa }), WA_NUMBER),
      h('a', { class: 'btn btn-primary', href: WA_URL, target: '_blank', rel: 'noopener noreferrer' }, 'CONTACT POWER ACADEMY'))),
    h('div', { class: 'wrap copy muted small' }, `© ${new Date().getFullYear()} POWER ACADEMY`));
}

function drawBottom() {
  const { path } = parse();
  bottom.replaceChildren(...[['/', 'home', L('Home', 'الرئيسية')], ['/breakers', 'grid', L('Breakers', 'القواطع')], ['/compare', 'compare', L('Compare', 'مقارنة')], ['/quiz', 'quiz', L('Quiz', 'اختبار')], ['/search', 'search', L('Search', 'بحث')]]
    .map(([p, ic, l]) => h('a', { href: `#${p}`, class: active(path, p) ? 'on' : '', 'aria-current': active(path, p) ? 'page' : null }, h('span', { html: icon[ic] }), h('small', {}, t(l)))));
}

function chrome() { drawHeader(); drawFooter(); drawBottom(); }

const titles = { '/map': L('Circuit Breaker Map', 'خريطة القواطع'), '/breakers': L('Circuit Breakers', 'القواطع'), '/compare': L('Compare Breakers', 'مقارنة القواطع'), '/lab': L('Interactive Lab', 'المعمل التفاعلي'), '/read': L('Read This Breaker', 'اقرأ القاطع'),
  '/glossary': L('Glossary & Markings', 'القاموس والعلامات'), '/devices': L('Switching Devices & RCD Types', 'أجهزة الفصل وأنواع RCD'), '/apps': L('Applications & Selection Wizard', 'التطبيقات ومساعد الاختيار'), '/cases': L('Case Studies', 'حالات عملية'),
  '/quiz': L('Quiz', 'اختبار'), '/interview': L('Interview Mode', 'وضع المقابلات'), '/standards': L('Standards & Contact', 'المعايير والتواصل'), '/search': L('Search', 'بحث') };
document.addEventListener('route', (e) => {
  chrome();
  const { path, params } = e.detail;
  const base = 'POWER ACADEMY';
  let ti = titles[path] ? t(titles[path]) : null;
  if (path.startsWith('/breaker/') && byId[params.id]) ti = `${byId[params.id].name} – ${byId[params.id].fullEn}`;
  document.title = ti ? `${ti} | ${base}` : `${base} | Circuit Breaker Encyclopedia`;
  const m = document.querySelector('main'); if (m) m.focus({ preventScroll: true });
});
store.subscribe(() => chrome());

start(); window.__paOk = true;
const loader = document.getElementById('loader');
const t0 = performance.now();
const hide = () => { loader.classList.add('done'); setTimeout(() => loader.remove(), 700); };
const fin = () => setTimeout(hide, Math.max(0, 1400 - (performance.now() - t0)));
document.readyState === 'complete' ? fin() : window.addEventListener('load', fin);
