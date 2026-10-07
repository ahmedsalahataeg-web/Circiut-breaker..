import { h, clear } from '../core/dom.js';
import { t, tx, L, termName } from '../core/store.js';
import { byId } from '../data/breakers.js';
import { readBreakerLabels } from '../data/markings.js';
import { thumbFor } from '../data/diagrams.js';
import { PageHead, Section, SafetyNotice } from '../components/common.js';

function NamePlate() {
  const info = h('div', { class: 'card read-info', 'aria-live': 'polite' }, h('p', { class: 'muted' }, tx('Tap any marking on the breaker to decode it.', 'اضغط على أي علامة على القاطع لفك شفرتها.')));
  const btns = [];
  const face = h('div', { class: 'nameplate', dir: 'ltr' },
    h('div', { class: 'np-brand' }, 'POWER ACADEMY'), h('div', { class: 'np-toggle' }),
    readBreakerLabels.map((l) => {
      const b = h('button', { type: 'button', class: `np-mark ${l.id === 'icn' ? 'boxed' : ''}`, style: { left: `${l.x}%`, top: `${l.y}%` }, onClick: () => {
        btns.forEach((x) => x.classList.toggle('on', x === b));
        info.replaceChildren(h('h3', {}, t(l.title)), h('p', {}, t(l.body)));
      } }, l.text);
      btns.push(b); return b;
    }));
  return h('div', { class: 'read-wrap' }, face, info);
}

const clues = {
  mcb: L('Small DIN-rail module, single toggle, “C16”-type marking.', 'وحدة صغيرة DIN-rail برافعة واحدة وعلامة مثل C16.'),
  mccb: L('Molded insulated case, larger frame, handle with trip-unit dials.', 'علبة مصبوبة عازلة بإطار أكبر ومقبض مع أقراص ضبط.'),
  acb: L('Large open-frame/withdrawable unit with arc chutes and spring-charging handle.', 'وحدة كبيرة مفتوحة/سحب مع حجرات قوس ومقبض شحن النابض.'),
  rccb: L('Module with a TEST button and IΔn marking, no overcurrent trip curve.', 'وحدة بزر TEST وعلامة IΔn ولا يوجد منحنى تيار زائد.'),
  vcb: L('Sealed vacuum bottle on insulating poles with operating mechanism box.', 'مفرغ مغلق على أعمدة عازلة مع صندوق آلية التشغيل.'),
  'sf6-hv': L('Horizontal gas-filled interrupter chamber with insulator ends.', 'غرفة قطع أفقية مملوءة بالغاز بنهايات عازلة.'),
  'gis-cb': L('Compact metal-enclosed gas-insulated bay.', 'خلية معدنية مغلقة معزولة بالغاز.'),
  'live-tank': L('Interrupter on top of an insulator column at line potential.', 'وحدة القطع أعلى عمود عازل عند جهد الخط.'),
  'dead-tank': L('Grounded metal tank with bushings on top.', 'خزان معدني مؤرض مع بوشينج في الأعلى.'),
  'oil-cb': L('Tank-type legacy unit (historical oil circuit-breaker).', 'وحدة قديمة بخزان (قاطع زيت تاريخي).'),
};

function Identify() {
  const ids = Object.keys(clues);
  let order = [...ids].sort(() => Math.random() - 0.5), i = 0, score = 0;
  const box = h('div', { class: 'card ident' });
  function show() {
    clear(box);
    if (i >= order.length) {
      box.append(h('h3', {}, tx(`Score: ${score} / ${order.length}`, `النتيجة: ${score} / ${order.length}`)), h('button', { class: 'btn btn-primary', type: 'button', onClick: () => { order = [...ids].sort(() => Math.random() - 0.5); i = 0; score = 0; show(); } }, tx('Play again', 'العب مجددًا')));
      return;
    }
    const id = order[i];
    const opts = [id, ...ids.filter((x) => x !== id).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    const fb = h('div', { class: 'quiz-fb', 'aria-live': 'polite' });
    const next = h('button', { class: 'btn btn-primary', type: 'button', hidden: true, onClick: () => { i++; show(); } }, tx('Next', 'التالي'));
    const bs = opts.map((o) => h('button', { class: 'opt', type: 'button', onClick: (e) => {
      bs.forEach((b, k) => { b.disabled = true; if (opts[k] === id) b.classList.add('right'); });
      const ok = o === id; if (ok) score++; else e.currentTarget.classList.add('wrong');
      fb.replaceChildren(h('strong', { class: ok ? 'ok' : 'bad' }, ok ? tx('Correct', 'صحيح') : tx('Not quite', 'ليست الإجابة')), ' — ',
        t(clues[id]), ' ', ok ? '' : tx(`You chose ${byId[o].name}: ${t(byId[o].what)}`, `اخترت ${byId[o].name}: ${t(byId[o].what)}`),
        ' ', h('a', { href: `#/breaker/${id}` }, tx('Learn more →', 'المزيد ←')));
      next.hidden = false;
    } }, termName(byId[o])));
    box.append(h('div', { class: 'quiz-meta' }, h('span', {}, `${i + 1} / ${order.length}`), h('span', {}, tx('Score', 'النتيجة') + ' ' + score)),
      h('div', { class: 'ident-img', html: thumbFor(byId[id]), role: 'img', 'aria-label': tx('Breaker illustration', 'رسم القاطع') }),
      h('h3', {}, tx('Can you identify this breaker?', 'هل تستطيع تحديد هذا القاطع؟')), h('div', { class: 'opts' }, bs), fb, next);
  }
  show();
  return box;
}

export function ReadPage() {
  return h('div', { class: 'wrap' },
    PageHead(tx('Read This Breaker', 'اقرأ بيانات القاطع'), tx('Decode what is printed on a breaker and test your visual recognition.', 'فك شفرة ما هو مكتوب على القاطع واختبر قدرتك على التعرف عليه.')),
    Section('np', tx('Decode the markings', 'فك شفرة العلامات'), NamePlate(), h('p', { class: 'muted small' }, tx('Example nameplate for illustration. Manufacturer markings and layouts differ – always read the datasheet.', 'لوحة بيانات توضيحية. تختلف علامات وتخطيط الشركات – اقرأ الكتالوج دائمًا.')),
      h('a', { class: 'btn btn-ghost btn-sm', href: '#/glossary' }, tx('What do all these letters mean?', 'ماذا تعني كل هذه الحروف؟'))),
    Section('id', tx('Can you identify this breaker?', 'هل تستطيع تحديد هذا القاطع؟'), Identify()),
    SafetyNotice());
}
