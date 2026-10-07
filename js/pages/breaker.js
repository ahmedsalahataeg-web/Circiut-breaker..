import { h } from '../core/dom.js';
import { t, tx, L, termName } from '../core/store.js';
import { byId } from '../data/breakers.js';
import { scenarios } from '../data/scenarios.js';
import { interview } from '../data/interview.js';
import { thumbFor } from '../data/diagrams.js';
import { Breadcrumbs, VoltageBadge, LegacyTag, SpecCard, SafetyNotice, Tabs, Accordion, DiagramViewer, WiringDiagram, BreakerCard, Pills } from '../components/common.js';
import { OpenCloseDemo, MechanismDemo } from '../components/demos.js';

const protLabels = {
  overload: L('Overload', 'حمل زائد'), short: L('Short circuit', 'قصر'), earth: L('Earth fault', 'عطل أرضي'), residual: L('Residual current', 'تيار متبقٍ'),
  motor: L('Motor protection', 'حماية محركات'), relay: L('Relay-driven (CT + relay)', 'بالريليه (CT + ريليه)'), selective: L('Selectivity (Icw)', 'انتقائية (Icw)'),
};

export function BreakerPage({ params }) {
  const b = byId[params.id];
  if (!b) return h('div', { class: 'wrap' }, h('p', {}, 'Not found'), h('a', { href: '#/breakers' }, tx('Back to breakers', 'العودة للقواطع')));
  const secs = [];
  const sec = (id, title, ...body) => { const el = h('section', { class: 'sec', id: `s-${id}` }, h('h2', { class: 'sec-title' }, title), ...body); secs.push([id, title, el]); return el; };

  const specs = h('div', { class: 'specs' },
    SpecCard(tx('Voltage class', 'فئة الجهد'), h('span', {}, b.voltageClass.map(VoltageBadge))),
    SpecCard(tx('Typical voltage range', 'مدى الجهد النموذجي'), t(b.voltageText)),
    SpecCard(tx('Current range', 'مدى التيار'), t(b.currentText)),
    SpecCard(tx('Breaking technology', 'تقنية القطع'), t(b.tech)),
    SpecCard(tx('Arc medium', 'وسيط القوس'), Pills(b.arc.map((a) => a.toUpperCase()))),
    SpecCard(tx('Protection method', 'طريقة الحماية'), t(b.protText)),
    SpecCard(tx('Standards', 'المعايير'), b.standards.join(' • ')),
    SpecCard(tx('Poles / AC-DC', 'الأقطاب / AC-DC'), `${b.poles.join(', ')} • ${b.acdc.map((x) => x.toUpperCase()).join('/')}`));

  const hero = h('header', { class: 'bhero' },
    h('div', { class: 'bhero-img card', html: thumbFor(b), role: 'img', 'aria-label': `${b.name} illustration` }),
    h('div', { class: 'bhero-txt' },
      Breadcrumbs([[tx('Home', 'الرئيسية'), '#/'], [tx('Breakers', 'القواطع'), '#/breakers'], [b.name]]),
      h('div', { class: 'bcard-top' }, b.voltageClass.map(VoltageBadge), b.legacy ? LegacyTag() : null, h('span', { class: 'brand-mini' }, 'POWER ACADEMY')),
      h('h1', {}, termName(b)),
      h('p', { class: 'lead' }, t(b.what))));

  const diagramTabs = [{ label: tx('Anatomy', 'التشريح'), content: () => DiagramViewer(b) }];
  const wkey = ['sf6-hv', 'live-tank', 'dead-tank', 'gis-cb', 'dcb'].includes(b.id) ? 'vcb' : b.id;
  const wd = WiringDiagram(wkey);
  if (wd) diagramTabs.push({ label: tx('Wiring / protection', 'التوصيل / الحماية'), content: () => wd });

  const relIds = b.related.filter((id) => byId[id]);
  const qs = b.interview.map((id) => interview.find((x) => x.id === id)).filter(Boolean);

  const page = h('div', { class: 'wrap bpage' },
    hero,
    b.warn ? h('aside', { class: 'safety danger', role: 'alert' }, h('strong', {}, tx('WARNING', 'تحذير')), h('p', {}, t(b.warn))) : null,
    h('div', { class: 'specs-wrap' }, h('h2', { class: 'sr-only' }, 'Quick specs'), specs),
    h('div', { class: 'secnav', role: 'navigation', 'aria-label': 'Sections' }),
    sec('what', tx('What is it?', 'ما هو؟'), h('p', {}, t(b.what)), h('p', { class: 'muted' }, h('strong', {}, tx('Why use it: ', 'لماذا يُستخدم: ')), t(b.why))),
    sec('how', tx('How it works', 'كيف يعمل'),
      h('ol', { class: 'steps' }, b.how.map((s) => h('li', {}, t(s)))),
      b.id === 'acb' ? MechanismDemo() : OpenCloseDemo(b)),
    sec('anatomy', tx('Internal anatomy', 'التشريح الداخلي'), Tabs(diagramTabs),
      h('div', { class: 'grid g3 parts' }, b.parts.map((p) => h('div', { class: 'card part' }, h('h4', {}, t(p.t)), h('p', { class: 'muted small' }, t(p.x)))))),
    sec('markings', tx('Markings', 'العلامات'),
      h('div', { class: 'grid g2' }, b.markings.map((m) => h('div', { class: 'card mk' }, h('code', {}, m.k), h('p', {}, t(m.x))))),
      b.id === 'mcb' ? h('a', { class: 'btn btn-ghost', href: '#/read' }, tx('Try the “Read this breaker” tool', 'جرّب أداة «اقرأ بيانات القاطع»')) : h('a', { class: 'btn btn-ghost btn-sm', href: '#/glossary' }, tx('All markings explained', 'شرح كل العلامات'))),
    sec('apps', tx('Applications', 'التطبيقات'),
      h('div', { class: 'chips' }, b.apps.map((a) => { const s = scenarios.find((x) => x.id === a); return s ? h('a', { class: 'chip link', href: `#/apps?s=${a}` }, t(s.name)) : null; }))),
    sec('prot', tx('Protection', 'الحماية'), h('p', {}, t(b.protText)), Pills(b.protection.map((p) => t(protLabels[p])))),
    sec('pros', tx('Advantages & limitations', 'المميزات والعيوب'),
      h('div', { class: 'grid g2' },
        h('div', { class: 'card pro' }, h('h4', {}, tx('Advantages', 'المميزات')), h('ul', {}, b.adv.map((x) => h('li', {}, t(x))))),
        h('div', { class: 'card con' }, h('h4', {}, tx('Limitations', 'العيوب')), h('ul', {}, b.lim.map((x) => h('li', {}, t(x))))))),
    b.extras.length ? sec('more', tx('Learn more', 'اعرف أكثر'), Accordion(b.extras.map((e) => ({ title: t(e.title), body: h('p', {}, t(e.body)) })), true)) : null,
    sec('cmp', tx('Compare', 'مقارنة'), h('div', { class: 'row-gap' }, relIds.slice(0, 3).map((id) => h('a', { class: 'btn btn-ghost btn-sm', href: `#/compare?ids=${b.id},${id}` }, `${b.name} vs ${byId[id].name}`)))),
    sec('ex', tx('Real-world example', 'مثال عملي'), h('div', { class: 'card ex' }, t(b.example))),
    qs.length ? sec('int', tx('Interview questions', 'أسئلة المقابلات'), Accordion(qs.map((x) => ({ title: t(x.q), body: h('div', {}, h('p', {}, t(x.a)), h('p', { class: 'muted' }, t(x.e)), h('p', { class: 'mistake' }, h('strong', {}, tx('Common mistake: ', 'خطأ شائع: ')), t(x.m))) })))) : null,
    sec('rel', tx('Related breakers', 'قواطع ذات صلة'), h('div', { class: 'grid g3' }, relIds.map((id) => BreakerCard(byId[id])))),
    SafetyNotice(b.warn));

  const nav = page.querySelector('.secnav');
  secs.forEach(([id, title, el]) => nav.append(h('button', { type: 'button', class: 'chip link', onClick: () => el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, title)));
  return page;
}
