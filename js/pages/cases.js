import { h } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { cases } from '../data/cases.js';
import { PageHead, Accordion, SafetyNotice } from '../components/common.js';

const list = (title, arr) => h('div', { class: 'case-b' }, h('h4', {}, title), h('ul', {}, (t(arr) || []).map((x) => h('li', {}, x))));
export function CasesPage() {
  return h('div', { class: 'wrap' },
    PageHead(tx('Real-World Case Studies', 'حالات عملية'), tx('Generalised, educational troubleshooting scenarios.', 'سيناريوهات تعليمية معممة لاستكشاف الأعطال.')),
    Accordion(cases.map((c) => ({ title: t(c.title), body: h('div', { class: 'case' }, h('p', {}, h('strong', {}, tx('Problem: ', 'المشكلة: ')), t(c.problem)),
      h('div', { class: 'grid g3' }, list(tx('Symptoms', 'الأعراض'), c.symptoms), list(tx('Possible causes', 'أسباب محتملة'), c.causes), list(tx('Investigation', 'خطوات الفحص'), c.investigation)),
      h('p', {}, h('strong', {}, tx('Concept: ', 'المفهوم: ')), t(c.concept)), h('p', { class: 'lesson' }, h('strong', {}, tx('Lesson: ', 'الدرس: ')), t(c.lesson))) })), true),
    SafetyNotice());
}
