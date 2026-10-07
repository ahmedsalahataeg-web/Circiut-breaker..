import { h } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { devices, deviceCols, rcdTypes } from '../data/reference.js';
import { PageHead, Section, SafetyNotice } from '../components/common.js';

export function DevicesPage() {
  const matrix = h('div', { class: 'table-wrap' }, h('table', { class: 'tbl dev-tbl' },
    h('thead', {}, h('tr', {}, h('th', {}, tx('Device', 'الجهاز')), deviceCols.map((c) => h('th', {}, t(c.t))))),
    h('tbody', {}, devices.map((d) => h('tr', {}, h('th', { scope: 'row' }, t(d.name)), deviceCols.map((c) => h('td', { 'data-label': t(c.t) }, t(d.cells[c.k]))))))));
  const rcdTable = h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' },
    h('thead', {}, h('tr', {}, h('th', {}, tx('Type', 'النوع')), h('th', {}, tx('Detects', 'يكشف')), h('th', {}, tx('Typical loads', 'أحمال نموذجية')), h('th', {}, tx('Caution', 'تنبيه')))),
    h('tbody', {}, rcdTypes.map((r) => h('tr', {}, h('th', { scope: 'row' }, r.name), h('td', { 'data-label': tx('Detects', 'يكشف') }, t(r.detects)), h('td', { 'data-label': tx('Typical loads', 'أحمال نموذجية') }, t(r.loads)), h('td', { 'data-label': tx('Caution', 'تنبيه') }, t(r.caution)))))));
  return h('div', { class: 'wrap' },
    PageHead(tx('Switching Devices & RCD Types', 'أجهزة الفصل وأنواع RCD'), tx('Not every switching device is a circuit-breaker.', 'ليس كل جهاز فصل قاطعًا.')),
    Section('dev', tx('Switching devices matrix', 'مصفوفة أجهزة الفصل'), matrix, h('p', { class: 'muted small' }, tx('Capabilities are generic and depend on rating/design; check the relevant standard and datasheet.', 'القدرات عامة وتعتمد على التصميم/القدرة؛ راجع المعيار والكتالوج.'))),
    Section('rcd', tx('RCD types: AC, A, F, B', 'أنواع RCD: AC وA وF وB'),
      h('div', { class: 'grid g4' }, rcdTypes.map((r) => h('div', { class: 'card rcd' }, h('h3', {}, r.name), h('p', {}, t(r.detects)), h('p', { class: 'muted small' }, t(r.loads)), h('p', { class: 'small warn-t' }, t(r.caution))))),
      h('p', { class: 'muted' }, tx('Coverage is nested: AC ⊂ A ⊂ F ⊂ B. Local rules may require a minimum type for specific loads (e.g. EV charging) – follow them.', 'التغطية متداخلة: AC ⊂ A ⊂ F ⊂ B. قد تفرض اللوائح المحلية نوعًا أدنى لأحمال معينة (مثل شحن السيارات) – اتبعها.')), rcdTable),
    SafetyNotice());
}
