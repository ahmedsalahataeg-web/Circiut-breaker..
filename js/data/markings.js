// "What do all these letters mean?" – generic (standard-based) vs manufacturer-specific marks.
import { L } from '../core/store.js';

const S = (k, en, ar) => ({ k, mfr: false, d: L(en, ar) });
const M = (k, en, ar, ex) => ({ k, mfr: true, d: L(en, ar), ex });

export const markings = [
  S('Ue', 'Rated operational voltage – the voltage the breaker’s ratings refer to.', 'جهد التشغيل المقنن – الجهد الذي تُنسب إليه قدرات القاطع.'),
  S('Ui', 'Rated insulation voltage – reference for dielectric tests; ≥ Ue.', 'جهد العزل المقنن – مرجع اختبارات العزل؛ ≥ Ue.'),
  S('Uimp', 'Rated impulse withstand voltage (transient overvoltage withstand). Value depends on manufacturer/model.', 'جهد تحمل النبضة المقنن (فرط الجهد العابر). القيمة تعتمد على الشركة/الموديل.'),
  S('In', 'Rated current of the breaker (or trip-unit rating/plug). For MCBs it is the number after the curve letter.', 'التيار المقنن للقاطع (أو لوحدة الفصل). في MCB هو الرقم بعد حرف المنحنى.'),
  S('Ir', 'Adjustable long-time pickup setting (often a fraction of In) in thermal/electronic trip units.', 'ضبط عتبة الزمن الطويل القابل للتعديل (غالبًا جزء من In) في وحدات الفصل الحرارية/الإلكترونية.'),
  S('Isd', 'Short-time pickup current (S function) – the level above which the short-time delay applies.', 'تيار عتبة الزمن القصير (وظيفة S) – المستوى الذي يبدأ عنده التأخير القصير.'),
  S('Ii', 'Instantaneous pickup current (I function) – trips with no intentional delay.', 'تيار العتبة اللحظية (وظيفة I) – يفصل دون تأخير مقصود.'),
  S('Ig', 'Ground-fault pickup current (G function).', 'تيار عتبة العطل الأرضي (وظيفة G).'),
  S('IΔn', 'Rated residual operating current of an RCD (e.g., 30 mA). Trips between 0.5 × and 1 × IΔn.', 'تيار التشغيل المتبقي المقنن لـ RCD (مثل 30 مللي أمبير). يفصل بين 0.5 و1 × IΔn.'),
  S('Icu', 'Ultimate short-circuit breaking capacity (IEC 60947-2).', 'قدرة القطع القصوى للقصر (IEC 60947-2).'),
  S('Ics', 'Service short-circuit breaking capacity, stated as % of Icu (IEC 60947-2).', 'قدرة القطع الخدمية للقصر كنسبة من Icu (IEC 60947-2).'),
  S('Icw', 'Rated short-time withstand current (typically 1 s).', 'تيار تحمل الزمن القصير المقنن (غالبًا 1 ثانية).'),
  S('Icm', 'Rated short-circuit making capacity (peak).', 'قدرة الوصل المقننة على القصر (ذروة).'),
  S('Icn', 'Rated short-circuit capacity of MCBs per IEC 60898-1 (boxed number, in amps).', 'قدرة القصر المقننة لـ MCB حسب IEC 60898-1 (رقم داخل مربع بالأمبير).'),
  S('LSIG', 'Electronic protection functions: Long, Short, Instantaneous, Ground.', 'وظائف الحماية الإلكترونية: Long وShort وInstantaneous وGround.'),
  S('L', 'Long-time (overload) protection – inverse time.', 'حماية الزمن الطويل (الحمل الزائد) – زمن عكسي.'),
  S('S', 'Short-time protection – intentionally delayed for selectivity.', 'حماية الزمن القصير – مؤخرة عمدًا للانتقائية.'),
  S('I', 'Instantaneous protection.', 'حماية لحظية.'),
  S('G', 'Ground-fault protection.', 'حماية العطل الأرضي.'),
  S('AC', 'Alternating current (often marked with “~”).', 'تيار متردد (يُشار إليه غالبًا بـ «~»).'),
  S('DC', 'Direct current (often marked “=” or “DC”). Only use a breaker explicitly rated for DC.', 'تيار مستمر (يُشار إليه بـ «=» أو DC). استخدم فقط قاطعًا مقننًا صراحةً لـ DC.'),
  S('1P / 2P / 3P / 4P', 'Number of protected/switched poles (1P+N and 3P+N include a switched/unprotected neutral depending on model).', 'عدد الأقطاب المحمية/المفصولة (1P+N و3P+N تتضمن نيوترال مفصولًا/غير محمي حسب الموديل).'),
  S('N', 'Neutral conductor/terminal.', 'موصل/طرف النيوترال.'),
  S('PE', 'Protective earth conductor (IEC symbol PE).', 'موصل التأريض الوقائي (رمز IEC: PE).'),
  S('Trip', 'Tripped condition/indicator, or the trip unit/trip signal.', 'حالة/مؤشر الفصل، أو وحدة/إشارة الفصل.'),
  S('Aux', 'Auxiliary contact/supply – used for indication, interlocking or control.', 'ملامس/تغذية مساعدة – للإشارة أو الإقفال أو التحكم.'),
  S('UVR', 'Undervoltage release – trips (or prevents closing) when supply voltage drops below a threshold.', 'ملف الجهد المنخفض – يفصل (أو يمنع الإغلاق) عند هبوط الجهد دون عتبة.'),
  M('MX', 'Manufacturer-specific designation. In Schneider Electric ranges MX = shunt (opening) release. Other manufacturers use different codes.', 'تسمية خاصة بالشركة. في عائلات Schneider Electric تعني MX ملف الفصل (shunt release). الشركات الأخرى تستخدم رموزًا مختلفة.', 'Schneider Electric'),
  M('OF', 'Manufacturer-specific designation. In Schneider Electric ranges OF = ON/OFF indication contact.', 'تسمية خاصة بالشركة. في Schneider Electric تعني OF ملامس إشارة ON/OFF.', 'Schneider Electric'),
  M('SD', 'Manufacturer-specific designation. In Schneider Electric ranges SD = trip-indication contact (any trip).', 'تسمية خاصة بالشركة. في Schneider Electric تعني SD ملامس إشارة الفصل (أي فصل).', 'Schneider Electric'),
  M('SDE', 'Manufacturer-specific designation. In Schneider Electric ranges SDE = fault-trip indication contact (trip due to an electrical fault).', 'تسمية خاصة بالشركة. في Schneider Electric تعني SDE ملامس إشارة فصل العطل الكهربائي.', 'Schneider Electric'),
  M('MCH', 'Manufacturer-specific designation. In Schneider Electric ACB ranges MCH = spring-charging gear motor.', 'تسمية خاصة بالشركة. في ACB من Schneider Electric تعني MCH محرك شحن الزنبرك.', 'Schneider Electric'),
  M('XF / MN', 'Manufacturer-specific designations. In Schneider Electric ranges XF = closing coil, MN = undervoltage release.', 'تسميات خاصة بالشركة. في Schneider Electric: XF ملف الإغلاق وMN ملف الجهد المنخفض.', 'Schneider Electric'),
];

/* Example annotated nameplate for "READ THIS BREAKER" */
export const readBreakerLabels = [
  { id: 'c16', text: 'C16', x: 16, y: 38, title: L('C16', 'C16'), body: L('C = trip curve (instantaneous trip band 5–10 × In per IEC 60898-1). 16 = rated current In = 16 A. Practical: suited to circuits with moderate inrush; final selection depends on load, cable, and the short-circuit level.', 'C = منحنى الفصل (نطاق الفصل اللحظي 5–10 × In حسب IEC 60898-1). 16 = التيار المقنن In = 16 أمبير. عمليًا: مناسب لدوائر بتيار اندفاع متوسط؛ والاختيار النهائي يعتمد على الحمل والكابل ومستوى القصر.') },
  { id: 'icn', text: '6000', x: 42, y: 54, title: L('6000 (boxed)', '6000 (داخل مربع)'), body: L('Rated short-circuit capacity Icn = 6000 A = 6 kA, tested per IEC 60898-1 conditions. It must be ≥ the prospective short-circuit current where the MCB is installed. Do not assume a 6 kA value without the boxed marking/datasheet.', 'قدرة القصر المقننة Icn = 6000 أمبير = 6 كيلو أمبير حسب شروط IEC 60898-1. ويجب أن تكون ≥ تيار القصر المتوقع في موقع التركيب. لا تفترض قيمة 6 كيلو أمبير دون العلامة/الكتالوج.') },
  { id: 'volt', text: '230/400V~', x: 16, y: 70, title: L('230/400V~', '230/400V~'), body: L('Voltage designation: 230 V for single-pole use (phase-neutral), 400 V between phases in multi-pole use, AC (~). Region-dependent: other systems use e.g. 120/240 V.', 'تسمية الجهد: 230 فولت للاستخدام أحادي القطب (طور-نيوترال) و400 فولت بين الأطوار للأقطاب المتعددة، AC (~). يختلف حسب الدولة: أنظمة أخرى مثل 120/240 فولت.') },
  { id: 'std', text: 'IEC 60898-1', x: 16, y: 86, title: L('IEC 60898-1', 'IEC 60898-1'), body: L('The standard for AC circuit-breakers for overcurrent protection in household and similar installations. If a different standard (e.g., IEC 60947-2) is printed, ratings must be read per that standard.', 'معيار قواطع AC للحماية من التيار الزائد للمنازل والتركيبات المماثلة. إن كُتب معيار آخر (مثل IEC 60947-2) فتُقرأ القدرات وفقه.') },
  { id: 'pole', text: '1P', x: 70, y: 86, title: L('1P', '1P'), body: L('One pole: protects and switches one phase conductor only. The neutral is not switched. Check installation rules for whether neutral switching is required.', 'قطب واحد: يحمي ويفصل موصل طور واحد فقط ولا يفصل النيوترال. راجع كودات التركيب لمعرفة هل فصل النيوترال مطلوب.') },
];
