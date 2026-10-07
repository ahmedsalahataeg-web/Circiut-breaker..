// Reference datasets: RCD types, switching-device matrix, voltage classes, standards.
import { L } from '../core/store.js';

/* ---------- RCD types (waveform sensitivity) ---------- */
export const rcdTypes = [
  { id: 'AC', name: 'Type AC', detects: L('Sinusoidal AC residual current only', 'تيار متبقٍ جيبي AC فقط'), loads: L('Simple resistive/inductive AC loads without rectifiers or inverters, where local rules still permit Type AC', 'أحمال AC بسيطة بدون مقوّمات أو إنفرتر، وحيث تسمح اللوائح المحلية'), caution: L('May not respond to pulsating or smooth DC leakage from electronic loads; many regions restrict or discourage it for new work.', 'قد لا يستجيب لتسرب نابض أو مستمر من الأحمال الإلكترونية؛ وتقيّده أو تثبّط استخدامه مناطق كثيرة في الأعمال الجديدة.'), wave: 'ac' },
  { id: 'A', name: 'Type A', detects: L('Type AC + pulsating DC residual current', 'نوع AC + تيار متبقٍ DC نابض'), loads: L('Many single-phase electronic loads with rectifier stages (appliances, lighting drivers, some EV supply equipment)', 'أحمال إلكترونية أحادية الطور كثيرة بمرحلة تقويم (أجهزة منزلية، دوائر إضاءة، بعض تجهيزات شحن السيارات)'), caution: L('Does not cover smooth DC or the composite multi-frequency currents of some converters.', 'لا يغطي DC الأملس ولا التيارات المركبة متعددة الترددات لبعض المحولات.'), wave: 'a' },
  { id: 'F', name: 'Type F', detects: L('Type A + composite (mixed-frequency) residual currents, with improved disturbance immunity (IEC 62423)', 'نوع A + تيارات متبقية مركبة (ترددات مختلطة) مع مناعة أفضل للاضطرابات (IEC 62423)'), loads: L('Single-phase frequency-converter loads (phase–neutral), e.g., some variable-speed appliance/pump drives', 'أحمال محول تردد أحادية الطور (طور–نيوترال) مثل بعض محركات السرعة المتغيرة'), caution: L('Not a substitute for Type B where smooth DC can occur.', 'ليس بديلًا لنوع B حيث يمكن ظهور DC أملس.'), wave: 'f' },
  { id: 'B', name: 'Type B', detects: L('Type F + smooth DC + sinusoidal residual current up to 1000 Hz (IEC 62423)', 'نوع F + DC أملس + تيار متبقٍ جيبي حتى 1000 هرتز (IEC 62423)'), loads: L('Some three-phase rectifier-based loads: VFDs, PV inverters, UPS, EV charging, power-electronic systems — follow equipment manufacturer instructions', 'بعض الأحمال ثلاثية الأطوار القائمة على مقوّمات: VFD، إنفرتر PV، UPS، شحن السيارات، منظومات إلكترونيات القدرة — اتبع تعليمات الشركة المصنعة للجهاز'), caution: L('Selection must come from the equipment documentation (e.g., some EV chargers integrate DC-leakage detection per IEC 62955 instead).', 'يجب أن يأتي الاختيار من وثائق الجهاز (مثلًا بعض شواحن السيارات تدمج كشف تسرب DC وفق IEC 62955 بدلًا من ذلك).'), wave: 'b' },
];

/* ---------- Switching devices matrix (don't call every switch a "circuit breaker") ---------- */
export const deviceCols = [
  { k: 'load', t: L('Makes/breaks load current', 'يصل/يقطع تيار الحمل') },
  { k: 'fault', t: L('Breaks fault current', 'يقطع تيار العطل') },
  { k: 'auto', t: L('Automatic trip on fault', 'فصل تلقائي عند العطل') },
  { k: 'iso', t: L('Provides isolation', 'يوفر عزلًا') },
  { k: 'use', t: L('Typical use', 'الاستخدام النموذجي') },
  { k: 'std', t: L('Standards (examples)', 'معايير (أمثلة)') },
];
export const devices = [
  { id: 'cb', name: L('Circuit Breaker', 'القاطع (Circuit Breaker)'), cells: { load: L('Yes', 'نعم'), fault: L('Yes (rated)', 'نعم (حسب القدرة)'), auto: L('Yes (trip unit / relay)', 'نعم (وحدة فصل / ريليه)'), iso: L('Only if designed & marked for isolation (LV) or by withdrawn/disconnecting designs', 'فقط إذا صُمم ووُسم للعزل (LV) أو بالسحب/تصاميم العزل'), use: L('Protection & switching of circuits', 'حماية وتشغيل الدوائر'), std: 'IEC 60947-2, 60898-1, 62271-100' } },
  { id: 'lbs', name: L('Load Break Switch', 'مفتاح فصل تحت الحمل (LBS)'), cells: { load: L('Yes (rated)', 'نعم (حسب القدرة)'), fault: L('No (may make fault current)', 'لا (قد يصل على القصر)'), auto: L('No (unless fuse-combination striker)', 'لا (إلا مع تركيب فيوز بقاذف)'), iso: L('Often yes (with earthing switch options)', 'غالبًا نعم (مع سكينة تأريض اختياريًا)'), use: L('Ring-main/MV switching, with or without fuses', 'تشغيل حلقات/MV بفيوزات أو بدونها'), std: 'IEC 62271-103, IEC 60947-3' } },
  { id: 'iso', name: L('Disconnector / Isolator', 'فاصل / عازل (Disconnector)'), cells: { load: L('No (only negligible currents)', 'لا (تيارات مهملة فقط)'), fault: L('No', 'لا'), auto: L('No', 'لا'), iso: L('Yes – visible/indicated gap', 'نعم – فاصل مرئي/مؤشر'), use: L('Isolate equipment for maintenance (after the breaker opens)', 'عزل المعدات للصيانة (بعد فتح القاطع)'), std: 'IEC 62271-102' } },
  { id: 'es', name: L('Earthing Switch', 'سكينة التأريض'), cells: { load: L('No', 'لا'), fault: L('No (some types can make fault current)', 'لا (بعض الأنواع تصل على القصر)'), auto: L('No', 'لا'), iso: L('Earths an isolated section', 'يؤرض قسمًا معزولًا'), use: L('Safety earthing during maintenance', 'تأريض سلامة أثناء الصيانة'), std: 'IEC 62271-102' } },
  { id: 'rec', name: L('Recloser', 'Recloser'), cells: { load: L('Yes', 'نعم'), fault: L('Yes (rated)', 'نعم (حسب القدرة)'), auto: L('Yes + automatic reclosing sequences', 'نعم + إعادة إغلاق آلية'), iso: L('Not by itself', 'ليس بذاته'), use: L('Overhead distribution lines: clears transient faults and re-energises', 'خطوط توزيع هوائية: يزيل الأعطال العابرة ويعيد التغذية'), std: 'IEC 62271-111, IEEE C37.60' } },
  { id: 'fuse', name: L('Fuse', 'الفيوز'), cells: { load: L('No', 'لا'), fault: L('Yes (single-shot, often current-limiting)', 'نعم (مرة واحدة، غالبًا محدد للتيار)'), auto: L('Yes (melts)', 'نعم (ينصهر)'), iso: L('No (except fuse-switch/disconnector assemblies)', 'لا (إلا في مجموعات فيوز-فاصل)'), use: L('Short-circuit / overload protection, backup protection', 'حماية قصر / حمل زائد وحماية احتياطية'), std: 'IEC 60269, IEC 60282-1' } },
  { id: 'cont', name: L('Contactor', 'الكونتاكتور'), cells: { load: L('Yes – frequent switching', 'نعم – تشغيل متكرر'), fault: L('No – needs a short-circuit protective device', 'لا – يحتاج جهاز حماية قصر'), auto: L('No (with overload relay: overload only)', 'لا (مع ريليه حمل زائد: حمل زائد فقط)'), iso: L('No', 'لا'), use: L('Frequent motor/load switching', 'تشغيل متكرر للمحركات والأحمال'), std: 'IEC 60947-4-1, IEC 62271-106' } },
];

/* ---------- Voltage classes (IEC-oriented, indicative only) ---------- */
export const voltageClasses = [
  { id: 'lv', name: L('Low Voltage (LV)', 'جهد منخفض (LV)'), range: L('≤ 1000 V AC / 1500 V DC', '≤ 1000 فولت AC / 1500 فولت DC'), note: L('IEC 60947-2 covers circuit-breakers up to 1000 V AC / 1500 V DC; IEC 60898-1 covers household MCBs up to 440 V AC.', 'IEC 60947-2 تغطي القواطع حتى 1000 فولت AC / 1500 فولت DC؛ وIEC 60898-1 تغطي MCB المنزلية حتى 440 فولت AC.'), examples: 'MCB, MCCB, ACB, RCCB, RCBO, MPCB', pos: 0.1 },
  { id: 'mv', name: L('Medium Voltage (MV)', 'جهد متوسط (MV)'), range: L('> 1 kV up to roughly 52 kV (practice)', '> 1 كيلو فولت حتى نحو 52 كيلو فولت (عمليًا)'), note: L('IEC treats everything above 1000 V as “high voltage”; “MV” is a common practical subdivision (IEC 62271-200 covers metal-enclosed switchgear above 1 kV up to 52 kV). Limits differ by utility and region.', 'تعتبر IEC كل ما فوق 1000 فولت «جهدًا عاليًا»؛ و«MV» تقسيم عملي شائع (IEC 62271-200 تغطي اللوحات المعدنية فوق 1 كيلو فولت حتى 52 كيلو فولت). والحدود تختلف حسب الشركة والمنطقة.'), examples: 'VCB, SF6 MV, GCB, RMU', pos: 0.35 },
  { id: 'hv', name: L('High Voltage (HV)', 'جهد عالٍ (HV)'), range: L('Above ~52 kV up to ~245 kV (practice)', 'فوق ~52 كيلو فولت حتى ~245 كيلو فولت (عمليًا)'), note: L('IEC 62271-100 covers AC breakers above 1000 V. HV in common transmission usage often means 72.5–245 kV; definitions vary.', 'IEC 62271-100 تغطي قواطع AC فوق 1000 فولت. وHV في النقل غالبًا تعني 72.5–245 كيلو فولت؛ والتعريفات تختلف.'), examples: 'SF6 live/dead tank, GIS', pos: 0.62 },
  { id: 'ehv', name: L('EHV / UHV', 'جهد فائق (EHV / UHV)'), range: L('~300 kV and above; UHV commonly ≥ 800–1000 kV', '~300 كيلو فولت فأكثر؛ وUHV غالبًا ≥ 800–1000 كيلو فولت'), note: L('EHV and UHV thresholds are conventions, not universal IEC classes.', 'عتبات EHV وUHV أعراف وليست فئات IEC عامة.'), examples: 'HV SF6 multi-break, GIS, DCB, HVDC breakers', pos: 0.9 },
];
export const voltageDisclaimer = L('Voltage-class terminology can vary by standard, utility, and region.', 'مصطلحات فئات الجهد قد تختلف حسب المعيار والجهة والمنطقة.');

/* ---------- Standards & references ---------- */
const IEC = 'https://webstore.iec.ch/';
export const standards = [
  { n: 'IEC 60947-2', t: L('Low-voltage switchgear and controlgear – Part 2: Circuit-breakers (up to 1000 V AC / 1500 V DC; instructed/skilled persons)', 'مفاتيح التحكم منخفضة الجهد – الجزء 2: القواطع (حتى 1000 فولت AC / 1500 فولت DC؛ لأشخاص مدرَّبين/مؤهلين)'), url: IEC },
  { n: 'IEC 60898-1', t: L('Circuit-breakers for overcurrent protection for household and similar installations – Part 1: AC operation', 'قواطع الحماية من التيار الزائد للمنازل والتركيبات المماثلة – الجزء 1: تيار متردد'), url: IEC },
  { n: 'IEC 60898-2', t: L('…Part 2: Circuit-breakers for AC and DC operation', '…الجزء 2: قواطع للتيار المتردد والمستمر'), url: IEC },
  { n: 'IEC 61008-1', t: L('Residual current operated circuit-breakers without integral overcurrent protection (RCCB)', 'قواطع التيار المتبقي بدون حماية تيار زائد مدمجة (RCCB)'), url: IEC },
  { n: 'IEC 61009-1', t: L('Residual current operated circuit-breakers with integral overcurrent protection (RCBO)', 'قواطع التيار المتبقي مع حماية تيار زائد مدمجة (RCBO)'), url: IEC },
  { n: 'IEC 62423', t: L('Type F and Type B residual current operated circuit-breakers (used with 61008-1/61009-1)', 'قواطع التيار المتبقي نوع F ونوع B (تُستخدم مع 61008-1/61009-1)'), url: IEC },
  { n: 'IEC 60755', t: L('General requirements for residual current operated protective devices', 'متطلبات عامة لأجهزة الحماية بالتيار المتبقي'), url: IEC },
  { n: 'IEC 60947-4-1', t: L('Contactors and motor-starters – electromechanical', 'الكونتاكتورات ومشغلات المحركات – كهروميكانيكية'), url: IEC },
  { n: 'IEC 60947-3', t: L('Switches, disconnectors, switch-disconnectors and fuse-combination units', 'المفاتيح والفاصلات ومفاتيح-فاصلات ووحدات الفيوز'), url: IEC },
  { n: 'IEC 62271 series', t: L('High-voltage switchgear and controlgear (series)', 'مفاتيح التحكم عالية الجهد (سلسلة)'), url: IEC },
  { n: 'IEC 62271-100', t: L('Alternating-current circuit-breakers (above 1000 V, 50/60 Hz)', 'قواطع التيار المتردد (فوق 1000 فولت، 50/60 هرتز)'), url: IEC },
  { n: 'IEC 62271-200', t: L('AC metal-enclosed switchgear and controlgear for rated voltages above 1 kV up to and including 52 kV', 'لوحات معدنية مغلقة AC للجهود فوق 1 كيلو فولت حتى 52 كيلو فولت'), url: IEC },
  { n: 'IEC 62271-102', t: L('Alternating current disconnectors and earthing switches', 'فاصلات وسكاكين تأريض للتيار المتردد'), url: IEC },
  { n: 'IEC 62271-103', t: L('Switches for rated voltages above 1 kV up to and including 52 kV', 'مفاتيح للجهود فوق 1 كيلو فولت حتى 52 كيلو فولت'), url: IEC },
  { n: 'IEC 62271-203', t: L('Gas-insulated metal-enclosed switchgear for rated voltages above 52 kV', 'لوحات معدنية معزولة بالغاز للجهود فوق 52 كيلو فولت'), url: IEC },
  { n: 'IEC/IEEE 62271-37-013', t: L('Alternating-current generator circuit-breakers', 'قواطع مولدات التيار المتردد'), url: IEC },
  { n: 'IEC 62271-4', t: L('Handling procedures for SF6 and its mixtures', 'إجراءات التعامل مع SF6 وخلائطه'), url: IEC },
  { n: 'IEC 62271-111', t: L('Automatic circuit reclosers and fault interrupters for AC systems', 'ريكلوزر وقواطع أعطال آلية لمنظومات AC'), url: IEC },
  { n: 'IEC 60269', t: L('Low-voltage fuses (series)', 'فيوزات الجهد المنخفض (سلسلة)'), url: IEC },
  { n: 'IEC 60364', t: L('Low-voltage electrical installations (series) – e.g., RCD requirements; national codes may differ', 'التركيبات الكهربائية منخفضة الجهد (سلسلة) – مثل متطلبات RCD؛ والكودات الوطنية قد تختلف'), url: IEC },
  { n: 'IEC 61992', t: L('Railway applications – Fixed installations – DC switchgear (series)', 'تطبيقات السكك الحديدية – منشآت ثابتة – مفاتيح DC (سلسلة)'), url: IEC },
  { n: 'UL 489 / NEC (North America)', t: L('North American standard for molded-case breakers and the installation code; terminology and ratings differ from IEC.', 'المعيار الأمريكي للقواطع المصبوبة وكود التركيب؛ والمصطلحات والقدرات تختلف عن IEC.'), url: 'https://www.ul.com/' },
];
