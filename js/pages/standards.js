import { h } from '../core/dom.js';
import { t, tx } from '../core/store.js';
import { standards } from '../data/reference.js';
import { PageHead, Section, SafetyNotice, WA_URL, WA_NUMBER } from '../components/common.js';

export function StandardsPage() {
  return h('div', { class: 'wrap' },
    PageHead(tx('Standards & References', 'المعايير والمراجع'), tx('Standards referenced in this encyclopedia. Always consult the current official edition.', 'المعايير المشار إليها في الموسوعة. ارجع دائمًا إلى النسخة الرسمية الحالية.')),
    h('div', { class: 'grid g2' }, standards.map((s) => h('div', { class: 'card std' }, h('code', {}, s.n), h('p', {}, t(s.t)), s.url ? h('a', { class: 'btn-link', href: s.url, target: '_blank', rel: 'noopener noreferrer' }, tx('IEC Webstore ↗', 'متجر IEC ↗')) : null))),
    h('p', { class: 'muted small' }, tx('Links point to the general IEC Webstore; search the standard number there. Standard titles are summarised – use the official text for requirements.', 'الروابط تؤدي إلى متجر IEC العام؛ ابحث برقم المعيار. العناوين ملخصة – استخدم النص الرسمي للمتطلبات.')),
    Section('acc', tx('About the content & accuracy', 'عن المحتوى والدقة'),
      h('div', { class: 'card' }, h('ul', {}, [
        tx('Educational content – not a substitute for standards, manufacturer datasheets or engineering design.', 'محتوى تعليمي – وليس بديلًا عن المعايير وكتالوجات الشركات والتصميم الهندسي.'),
        tx('Where a value depends on the manufacturer or model, it is flagged as such rather than guessed.', 'القيم التي تعتمد على الشركة أو الموديل مُعلَّمة بذلك دون تخمين.'),
        tx('Manufacturer-specific codes (e.g. MX, OF, SD) are labelled and are not IEC definitions.', 'الأكواد الخاصة بالشركات (مثل MX وOF وSD) مُعلَّمة وليست تعريفات IEC.'),
        tx('Illustrations are original schematic drawings, not photographs of specific products.', 'الرسوم أصلية تخطيطية وليست صورًا لمنتجات بعينها.'),
        tx('Voltage-class boundaries vary by standard, utility and region.', 'حدود فئات الجهد تختلف حسب المعيار والجهة والمنطقة.'),
      ].map((x) => h('li', {}, x))))),
    Section('contact', tx('Contact POWER ACADEMY', 'تواصل مع POWER ACADEMY'), h('div', { class: 'card' }, h('p', {}, 'WhatsApp: ', h('a', { href: WA_URL, target: '_blank', rel: 'noopener noreferrer', dir: 'ltr' }, WA_NUMBER)),
      h('a', { class: 'btn btn-primary', href: WA_URL, target: '_blank', rel: 'noopener noreferrer' }, 'CONTACT POWER ACADEMY'))),
    SafetyNotice());
}
