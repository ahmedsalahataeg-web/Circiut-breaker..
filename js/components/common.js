// Reusable UI components.
import { h } from '../core/dom.js';
import { t, tx, L, termName } from '../core/store.js';
import { icon } from '../core/icons.js';
import { classLabel } from '../data/breakers.js';
import { glossary } from '../data/glossary.js';
import { thumbFor, annotated, wiringSVG, diagramFor } from '../data/diagrams.js';

export const WA_URL = 'https://wa.me/201226930012';
export const WA_NUMBER = '+201226930012';

export function SafetyNotice(extra) {
  return h('aside', { class: 'safety', role: 'note' },
    h('span', { class: 'safety-ico', html: icon.warn }),
    h('div', {},
      h('strong', {}, tx('Safety notice', 'تنبيه السلامة')),
      h('p', {}, tx('Electrical protection equipment must be selected, installed, tested, and maintained by qualified personnel according to applicable standards, manufacturer instructions, and local regulations.',
        'يجب اختيار معدات الحماية الكهربائية وتركيبها واختبارها وصيانتها بواسطة أفراد مؤهلين وفقًا للمعايير المطبقة وتعليمات الشركة المصنعة واللوائح المحلية.')),
      extra ? h('p', { class: 'safety-extra' }, t(extra)) : null));
}
export function EduNotice() {
  return h('p', { class: 'edu-note' }, icon.info ? h('span', { html: icon.info }) : null,
    tx('Preliminary educational selection only. Final selection must be based on system calculations, applicable standards, manufacturer data, and qualified engineering review.',
      'اختيار تعليمي أولي فقط. يجب أن يعتمد الاختيار النهائي على حسابات المنظومة والمعايير المطبقة وبيانات الشركة المصنعة ومراجعة هندسية مؤهلة.'));
}

export function VoltageBadge(cls) {
  return h('span', { class: `vbadge ${cls}` }, t(classLabel[cls]) || cls.toUpperCase());
}
export const LegacyTag = () => h('span', { class: 'vbadge legacy' }, tx('Historical / Legacy', 'تاريخي / قديم'));

export function Section(id, title, ...body) {
  return h('section', { class: 'sec', id }, h('h2', { class: 'sec-title' }, title), ...body);
}
export function PageHead(title, sub, crumbs = []) {
  return h('header', { class: 'page-head' },
    Breadcrumbs([[tx('Home', 'الرئيسية'), '#/'], ...crumbs, [title]]),
    h('h1', {}, title), sub ? h('p', { class: 'lead' }, sub) : null);
}
export function Breadcrumbs(items) {
  return h('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, items.map(([label, href], i) =>
    [i ? h('span', { class: 'sep', 'aria-hidden': 'true' }, '/') : null, href ? h('a', { href }, label) : h('span', { 'aria-current': 'page' }, label)]));
}

export function Tabs(tabs, initial = 0) {
  const root = h('div', { class: 'tabs' });
  const bar = h('div', { class: 'tab-bar', role: 'tablist' });
  const panels = h('div', { class: 'tab-panels' });
  const btns = [], pans = [];
  tabs.forEach((tb, i) => {
    const b = h('button', { class: 'tab', role: 'tab', type: 'button', 'aria-selected': 'false', onClick: () => select(i) }, tb.label);
    const p = h('div', { class: 'tab-panel', role: 'tabpanel', hidden: true }, typeof tb.content === 'function' ? tb.content() : tb.content);
    btns.push(b); pans.push(p); bar.append(b); panels.append(p);
  });
  function select(i) {
    btns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.classList.toggle('on', i === j); pans[j].hidden = i !== j; });
  }
  bar.addEventListener('keydown', (e) => {
    const cur = btns.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const d = (e.key === 'ArrowRight' ? 1 : -1) * (document.documentElement.dir === 'rtl' ? -1 : 1); const n = (cur + d + btns.length) % btns.length; select(n); btns[n].focus(); }
  });
  root.append(bar, panels); select(initial);
  return root;
}

export function Accordion(items, openFirst = false) {
  return h('div', { class: 'acc' }, items.map((it, i) =>
    h('details', { class: 'acc-item', open: openFirst && i === 0 }, h('summary', {}, it.title, h('span', { class: 'chev', html: icon.chevron })), h('div', { class: 'acc-body' }, it.body))));
}

/* Glossary term with popover */
export function GlossaryTerm(id, label) {
  const g = glossary.find((x) => x.id === id);
  if (!g) return h('span', {}, label || id);
  const pop = h('span', { class: 'term-pop', role: 'tooltip' }, h('strong', {}, g.name), h('span', {}, t(g.simple)), h('a', { href: `#/glossary?term=${g.id}` }, tx('More →', 'المزيد ←')));
  return h('span', { class: 'term', tabindex: '0' }, label || g.name, pop);
}

export function SpecCard(label, value, hint) {
  return h('div', { class: 'spec' }, h('div', { class: 'spec-k' }, label), h('div', { class: 'spec-v' }, value), hint ? h('div', { class: 'spec-h' }, hint) : null);
}

export function BreakerCard(b, opts = {}) {
  return h('a', { class: 'bcard card lift', href: `#/breaker/${b.id}`, 'aria-label': `${b.name} – ${b.fullEn}` },
    h('div', { class: 'bcard-img', html: thumbFor(b), role: 'img', 'aria-label': `${b.name} illustration` }),
    h('div', { class: 'bcard-body' },
      h('div', { class: 'bcard-top' }, b.voltageClass.map(VoltageBadge), b.legacy ? LegacyTag() : null),
      h('h3', {}, termName(b)),
      h('p', { class: 'muted small' }, t(b.voltageText)),
      h('div', { class: 'chips' }, b.arc.map((a) => h('span', { class: 'chip' }, a.toUpperCase())), b.acdc.map((a) => h('span', { class: 'chip alt' }, a.toUpperCase()))),
      opts.compare ? h('span', { class: 'muted small' }, '') : null));
}

/* Annotated image with clickable hotspots + info card */
export function AnnotatedImage(key, opts = {}) {
  const d = annotated[key];
  if (!d) return h('div', {});
  const [W, Hh] = d.vb;
  const wrap = h('div', { class: 'ann', dir: 'ltr' });
  const stage = h('div', { class: 'ann-stage', html: d.build(), style: { aspectRatio: `${W} / ${Hh}` } });
  const card = h('div', { class: 'ann-card card', dir: document.documentElement.dir, 'aria-live': 'polite' });
  const markers = [];
  const legend = h('ol', { class: 'ann-legend', dir: document.documentElement.dir });
  function pick(i) {
    const hs = d.hs[i];
    card.replaceChildren(h('div', { class: 'ann-n' }, hs.n), h('h4', {}, t(hs.t)), h('p', {}, t(hs.x)));
    markers.forEach((m, j) => m.classList.toggle('on', j === i));
    [...legend.children].forEach((li, j) => li.classList.toggle('on', j === i));
  }
  d.hs.forEach((hs, i) => {
    const m = h('button', { class: 'hs', type: 'button', style: { left: `${(hs.mx / W) * 100}%`, top: `${(hs.my / Hh) * 100}%` }, 'aria-label': `${hs.n}: ${t(hs.t)}`, onClick: () => pick(i) }, hs.n);
    markers.push(m); stage.append(m);
    legend.append(h('li', {}, h('button', { type: 'button', onClick: () => pick(i) }, h('b', {}, hs.n), ' ', t(hs.t))));
  });
  wrap.append(stage);
  const side = h('div', { class: 'ann-side' }, card, legend);
  const box = h('div', { class: 'ann-wrap' }, wrap, side);
  pick(Math.min(opts.start || 0, d.hs.length - 1));
  if (opts.select) opts.select(pick, d.hs);
  return box;
}

export function StaticDiagram(svg, caption) {
  return h('figure', { class: 'fig' }, h('div', { class: 'fig-img', html: svg }), caption ? h('figcaption', {}, t(caption)) : null);
}

export function WiringDiagram(id) {
  const s = wiringSVG(id);
  return s ? StaticDiagram(s, L('Wiring / protection concept (illustrative)', 'مخطط التوصيل / مفهوم الحماية (توضيحي)')) : null;
}

export function DiagramViewer(b) {
  const d = diagramFor(b);
  if (d.type === 'annotated') return AnnotatedImage(d.key);
  return StaticDiagram(d.svg, L('Schematic illustration – the contacts, the medium and the arc.', 'رسم توضيحي – الملامسات والوسيط والقوس.'));
}

export function Pills(items) { return h('div', { class: 'chips' }, items.map((x) => h('span', { class: 'chip' }, x))); }

export function Empty(msg) { return h('div', { class: 'empty card' }, msg); }
