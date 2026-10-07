import { h } from '../core/dom.js';
import { tx } from '../core/store.js';
import { PageHead, Section, SafetyNotice, EduNotice } from '../components/common.js';
import { LSIGChart, ArcDemo, BreakingDemo, MechanismDemo, Calculators, OpenCloseDemo } from '../components/demos.js';

export function LabPage() {
  return h('div', { class: 'wrap' },
    PageHead(tx('Interactive Lab', 'المعمل التفاعلي'), tx('Hands-on simulations. They illustrate concepts – they are not design tools.', 'محاكاة تفاعلية توضح المفاهيم – وليست أدوات تصميم.')),
    Section('lsig', tx('ACB trip curve – LSIG', 'منحنى فصل ACB – LSIG'), LSIGChart()),
    Section('arc', tx('Arc interruption by medium', 'إطفاء القوس حسب الوسيط'), ArcDemo()),
    Section('bc', tx('Breaking capacity animation', 'محاكاة قدرة القطع'), BreakingDemo()),
    Section('mech', tx('Closing & opening mechanism', 'آلية الإغلاق والفتح'), MechanismDemo()),
    Section('oc', tx('Open / Close', 'فتح / إغلاق'), OpenCloseDemo()),
    Section('calc', tx('Educational calculators', 'حاسبات تعليمية'), Calculators(), EduNotice()),
    SafetyNotice());
}
