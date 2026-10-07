// Original technical illustrations (SVG, theme-aware via CSS variables) + hotspot annotations.
// No third-party photos are used, so no image is attributed to any manufacturer.
import { L } from '../core/store.js';

const ST = 'stroke="var(--diag-stroke)" stroke-width="1.6"';
const BODY = 'fill="var(--diag-body)"';
const BODY2 = 'fill="var(--diag-body-2)"';
const FF = 'font-family="Inter, Cairo, sans-serif"';
const tx = (x, y, s, size = 11, anchor = 'middle', fill = 'var(--text)', extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" ${FF} ${extra}>${s}</text>`;
const wrap = (vb, inner, label) => `<svg viewBox="0 0 ${vb[0]} ${vb[1]}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;
const leaders = (hs) => hs.map((h) => `<line x1="${h.mx}" y1="${h.my}" x2="${h.px}" y2="${h.py}" stroke="var(--cyan)" stroke-width="1" stroke-dasharray="3 3" opacity=".75"/><circle cx="${h.px}" cy="${h.py}" r="3" fill="var(--cyan)"/>`).join('');
const H = (n, px, py, mx, my, t, x) => ({ n, px, py, mx, my, t, x });

/* ============================ MCB ============================ */
const mcbHS = [
  H(1, 200, 196, 40, 196, L('Manufacturer', 'الشركة المصنعة'), L('The maker’s name/logo. Ordering codes, accessory compatibility and the meaning of some marks are manufacturer-specific — always read that maker’s datasheet.', 'اسم/شعار الشركة المصنعة. أكواد الطلب وتوافق الملحقات ومعنى بعض العلامات خاصة بكل شركة — اقرأ كتالوج الشركة دائمًا.')),
  H(2, 200, 214, 40, 232, L('Product family', 'العائلة (Series)'), L('The range/series name. Ratings, curves, accessories and terminal sizes vary between families.', 'اسم السلسلة. تختلف القدرات والمنحنيات والملحقات وأحجام الأطراف بين العائلات.')),
  H(3, 218, 262, 360, 232, L('Rated current In', 'التيار المقنن In'), L('“16” = 16 A: the current the breaker carries continuously at its reference ambient temperature (commonly 30 °C – check the datasheet). Size it to the cable and load, not only the load.', '«16» = 16 أمبير: التيار الذي يحمله القاطع باستمرار عند حرارة محيط مرجعية (غالبًا 30 °م – راجع الكتالوج). يُختار حسب الكابل والحمل وليس الحمل فقط.')),
  H(4, 184, 262, 40, 268, L('Trip curve (C)', 'منحنى الفصل (C)'), L('“C” sets the instantaneous magnetic band: 5–10 × In (IEC 60898-1). B = 3–5, D = 10–20. C16 suits circuits with moderate inrush such as some inductive loads — final choice depends on design, load and short-circuit level.', '«C» يحدد نطاق الفصل المغناطيسي اللحظي: 5–10 × In (IEC 60898-1). B = 3–5 وD = 10–20. C16 مناسب لدوائر بتيار اندفاع متوسط مثل بعض الأحمال الحثية — والاختيار النهائي حسب التصميم والحمل ومستوى القصر.')),
  H(5, 200, 296, 360, 296, L('Breaking capacity (Icn)', 'قدرة القطع (Icn)'), L('The boxed number is Icn in amps: 6000 = 6 kA under IEC 60898-1 test conditions. It must be ≥ the prospective short-circuit current at the installation point.', 'الرقم داخل المربع هو Icn بالأمبير: 6000 = 6 كيلو أمبير بشروط IEC 60898-1. ويجب أن يكون ≥ تيار القصر المتوقع في موقع التركيب.')),
  H(6, 172, 332, 40, 332, L('Number of poles', 'عدد الأقطاب'), L('1P = one protected/switched pole. 2P, 3P, 4P and 1P+N/3P+N variants exist; whether the neutral must be switched depends on installation rules.', '1P = قطب واحد محمي/مفصول. وتوجد 2P و3P و4P ونسخ 1P+N/3P+N؛ وفصل النيوترال يعتمد على كودات التركيب.')),
  H(7, 200, 316, 360, 322, L('Rated voltage', 'الجهد المقنن'), L('230/400V~ : 230 V for one pole (phase–neutral), 400 V for multi-pole between phases, AC. Regional systems differ.', '230/400V~ : 230 فولت لقطب واحد (طور-نيوترال) و400 فولت لعدة أقطاب بين الأطوار، AC. تختلف الأنظمة حسب الدولة.')),
  H(8, 200, 346, 40, 368, L('Standard', 'المعيار'), L('IEC 60898-1: AC circuit-breakers for overcurrent protection in household and similar installations. Some products are dual-marked (e.g., also IEC 60947-2).', 'IEC 60898-1: قواطع AC للحماية من التيار الزائد في المنازل والتركيبات المماثلة. وبعض المنتجات مزدوجة العلامات (مثل IEC 60947-2 أيضًا).')),
  H(9, 200, 126, 360, 126, L('ON / OFF handle', 'مقبض ON / OFF'), L('I = ON, O = OFF. On many designs a tripped breaker rests in a middle position (some show a colored flag) — reset by moving to OFF then ON, after finding the cause.', 'I = ON وO = OFF. في تصاميم كثيرة يستقر القاطع المفصول في وضع وسط (وبعضها يُظهر علامة ملونة) — تُعاد التهيئة بنقله إلى OFF ثم ON بعد معرفة السبب.')),
  H(10, 200, 62, 360, 70, L('Terminal', 'الأطراف'), L('Screw/clamp terminal. Conductor size range and tightening torque are model-specific — follow the datasheet.', 'طرف بمسمار/مشبك. مدى مقاس الموصل وعزم الربط خاص بالموديل — اتبع الكتالوج.')),
  H(11, 170, 40, 60, 24, L('Line (supply)', 'Line (المصدر)'), L('Supply side, usually the top (1, 3, 5). AC MCBs are normally not polarity-sensitive, but DC breakers and devices with electronics may be — obey the Line/Load marking.', 'جهة المصدر وتكون غالبًا العلوية (1 و3 و5). قواطع AC عادةً لا تتأثر بالقطبية لكن قواطع DC والأجهزة الإلكترونية قد تتأثر — التزم بعلامة Line/Load.')),
  H(12, 200, 418, 360, 430, L('Load', 'Load (الحمل)'), L('Load side, usually the bottom (2, 4, 6).', 'جهة الحمل وتكون غالبًا السفلية (2 و4 و6).')),
  H(13, 226, 372, 360, 372, L('Wiring diagram', 'مخطط التوصيل'), L('Internal-circuit symbol: thermal (bimetal) and magnetic (coil) release with the switching contact. Poles are shown as in the datasheet.', 'رمز الدائرة الداخلية: ريليه حراري (ثنائي المعدن) ومغناطيسي (ملف) مع ملامس القطع. وتُبين الأقطاب كما في الكتالوج.')),
  H(14, 174, 372, 40, 404, L('Certification markings', 'علامات الاعتماد'), L('Marks of conformity (e.g., CE, national approvals). They are declarations by the maker/certifier — verify the certificate for your market.', 'علامات المطابقة (مثل CE واعتمادات وطنية). وهي إقرارات من الشركة/الجهة المانحة — تحقق من الشهادة لسوقك.')),
];
const mcbSVG = () => wrap([400, 480], `
  <rect x="20" y="225" width="360" height="30" rx="3" fill="var(--diag-body-2)" opacity=".6"/>
  <rect x="150" y="40" width="100" height="400" rx="9" ${BODY} ${ST}/>
  <rect x="160" y="48" width="80" height="26" rx="4" ${BODY2} ${ST}/><circle cx="200" cy="61" r="7" fill="none" ${ST}/><path d="M195 61h10M200 56v10" ${ST}/>
  <rect x="160" y="406" width="80" height="26" rx="4" ${BODY2} ${ST}/><circle cx="200" cy="419" r="7" fill="none" ${ST}/><path d="M195 419h10M200 414v10" ${ST}/>
  <rect x="172" y="88" width="56" height="76" rx="6" fill="var(--bg)" ${ST}/><rect x="188" y="94" width="24" height="38" rx="4" fill="var(--blue)"/>${tx(200, 150, 'I – O', 10, 'middle', 'var(--muted)')}
  ${tx(200, 199, 'MANUFACTURER', 10, 'middle', 'var(--cyan)', 'font-weight="700" letter-spacing="1"')}${tx(200, 214, 'PRODUCT FAMILY', 8, 'middle', 'var(--muted)')}
  ${tx(190, 270, 'C16', 26, 'middle', 'var(--text)', 'font-weight="700"')}
  <rect x="172" y="284" width="56" height="18" rx="2" fill="none" ${ST}/>${tx(200, 297, '6000', 12, 'middle', 'var(--text)', 'font-weight="600"')}
  ${tx(200, 320, '230/400V~', 10)}${tx(200, 350, 'IEC 60898-1', 9, 'middle', 'var(--muted)')}${tx(172, 336, '1P', 11, 'middle', 'var(--text)', 'font-weight="700"')}
  <g transform="translate(212 358)" fill="none" ${ST}><path d="M0 8h6M6 8l8-8M14 8h6M8 2v-2M10 14a4 4 0 0 1 8 0"/></g>
  ${tx(174, 376, 'CE', 10, 'middle', 'var(--text)', 'font-weight="700"')}
  ${tx(200, 436, '2', 8, 'middle', 'var(--muted)')}${tx(200, 38, '1', 8, 'middle', 'var(--muted)')}
  ${leaders(mcbHS)}
  ${mcbHS.map((h) => `<text x="${h.mx}" y="${h.my + 4}" font-size="1" fill="none">.</text>`).join('')}
`, 'Annotated miniature circuit breaker front view');

/* ============================ MCCB ============================ */
const mccbHS = [
  H(1, 200, 90, 40, 70, L('Handle', 'المقبض'), L('Toggle handle with ON / OFF / TRIPPED positions; the mechanism is trip-free and quick-make/quick-break regardless of how fast you move the handle.', 'مقبض ذو أوضاع ON / OFF / TRIPPED؛ والآلية حرة الفصل وسريعة الوصل/الفصل مهما كانت سرعة تحريك المقبض.')),
  H(2, 200, 180, 360, 160, L('Trip unit', 'وحدة الفصل'), L('Thermal-magnetic (dials for thermal/magnetic) or electronic (Ir, Isd, Ii, Ig…). Settings and curve shapes are manufacturer-specific.', 'حرارية-مغناطيسية (قراص للحراري/المغناطيسي) أو إلكترونية (Ir وIsd وIi وIg…). والضبط وأشكال المنحنيات خاصة بكل شركة.')),
  H(3, 130, 27, 40, 27, L('Line terminals', 'أطراف المصدر'), L('Often the top; check polarity/“line” markings in the datasheet (some electronic trip units require a specific feed direction).', 'غالبًا العلوية؛ راجع علامات «line» في الكتالوج (بعض الوحدات الإلكترونية تتطلب اتجاه تغذية محددًا).')),
  H(4, 100, 200, 40, 200, L('Molded case', 'العلبة المصبوبة'), L('Insulating housing with phase barriers; its size is called the “frame”. Frame sizes and naming are manufacturer-specific.', 'علبة عازلة بحواجز بين الأطوار؛ ويسمى حجمها «frame». وأحجام الإطارات وتسمياتها خاصة بكل شركة.')),
  H(5, 200, 270, 360, 270, L('Rating plate', 'لوحة البيانات'), L('Shows In, Ue, Ui, Uimp, Icu/Ics (often per voltage), standard and category. Read Icu/Ics at your system voltage.', 'تبين In وUe وUi وUimp وIcu/Ics (غالبًا لكل جهد) والمعيار والفئة. اقرأ Icu/Ics عند جهد منظومتك.')),
  H(6, 316, 150, 360, 110, L('Accessory slots', 'فتحات الملحقات'), L('Shunt trip, undervoltage release, auxiliary/alarm contacts, motor operator, rotary handle — availability depends on manufacturer/model.', 'Shunt trip وUVR وملامسات مساعدة/إنذار ومحرك تشغيل ومقبض دوار — التوفر يعتمد على الشركة/الموديل.')),
  H(7, 130, 333, 40, 350, L('Load terminals', 'أطراف الحمل'), L('Load side connections; lugs/busbar adapters vary by model.', 'توصيلات جهة الحمل؛ وتختلف المسامير/محولات القضبان حسب الموديل.')),
  H(8, 200, 130, 40, 130, L('Mechanism & contacts (inside)', 'الآلية والملامسات (داخل)'), L('Inside: operating mechanism, main contacts per pole, arc chutes with splitter plates.', 'بالداخل: آلية التشغيل وملامسات رئيسية لكل قطب وحجرات إطفاء بصفائح.')),
];
const mccbSVG = () => wrap([400, 380], `
  <rect x="90" y="36" width="220" height="288" rx="12" ${BODY} ${ST}/>
  ${[105, 175, 245].map((x) => `<rect x="${x}" y="14" width="50" height="22" rx="3" ${BODY2} ${ST}/><rect x="${x}" y="324" width="50" height="22" rx="3" ${BODY2} ${ST}/>`).join('')}
  <rect x="150" y="58" width="100" height="62" rx="8" fill="var(--bg)" ${ST}/><rect x="188" y="64" width="24" height="50" rx="4" fill="var(--blue)"/>${tx(200, 132, 'ON · OFF · TRIP', 8, 'middle', 'var(--muted)')}
  <rect x="116" y="142" width="168" height="80" rx="8" ${BODY2} ${ST}/>
  ${[[158, 'Ir'], [200, 'Isd'], [242, 'Ii']].map(([x, l]) => `<circle cx="${x}" cy="176" r="17" fill="var(--bg)" ${ST}/><path d="M${x} 176l9-9" ${ST}/>${tx(x, 210, l, 10)}`).join('')}
  <rect x="116" y="236" width="168" height="72" rx="6" fill="none" stroke="var(--line-strong)" stroke-dasharray="4 3"/>
  ${tx(200, 256, 'In · Ue · Ui · Uimp', 10)}${tx(200, 274, 'Icu / Ics  @ Ue', 10, 'middle', 'var(--cyan)')}${tx(200, 292, 'IEC 60947-2', 9, 'middle', 'var(--muted)')}
  <rect x="310" y="104" width="30" height="100" rx="5" ${BODY2} ${ST}/>${tx(325, 160, 'ACC', 8, 'middle', 'var(--muted)', 'transform="rotate(-90 325 160)"')}
  <path d="M155 40v280M245 40v280" stroke="var(--line)" stroke-dasharray="2 4"/>
  ${leaders(mccbHS)}
`, 'Annotated molded case circuit breaker front view');

/* ============================ ACB ============================ */
const acbHS = [
  H(1, 210, 65, 40, 50, L('Arc chute', 'حجرة الإطفاء'), L('Splitter-plate chutes above each pole: arc is driven in, lengthened, cooled and extinguished in air.', 'حجرات بصفائح فوق كل قطب: يُدفع القوس إليها فيطول ويبرد وينطفئ في الهواء.')),
  H(2, 210, 125, 380, 100, L('Trip unit', 'وحدة الفصل'), L('Electronic LSIG unit with display, settings, metering/communication options (manufacturer-specific).', 'وحدة LSIG إلكترونية بشاشة وضبط وخيارات قياس/اتصال (خاصة بالشركة).')),
  H(3, 150, 188, 40, 150, L('ON (close) button', 'زر الإغلاق ON'), L('Releases the charged closing spring (via the closing release) to close the main contacts.', 'يحرر زنبرك الإغلاق المشحون (عبر ملف الإغلاق) لإغلاق الملامسات الرئيسية.')),
  H(4, 190, 188, 40, 188, L('OFF (open) button', 'زر الفتح OFF'), L('Opens the breaker mechanically via the opening release.', 'يفتح القاطع ميكانيكيًا عبر ريليه الفتح.')),
  H(5, 240, 188, 380, 160, L('Spring-charged indicator', 'مؤشر شحن الزنبرك'), L('Shows whether the closing spring is charged (by the charging motor or by hand).', 'يبين هل زنبرك الإغلاق مشحون (بمحرك الشحن أو يدويًا).')),
  H(6, 317, 207, 380, 220, L('Charging handle', 'ذراع الشحن'), L('Manual spring charging when no motor/aux supply is available.', 'شحن يدوي للزنبرك عند عدم توفر محرك/تغذية مساعدة.')),
  H(7, 210, 255, 40, 250, L('Nameplate', 'لوحة البيانات'), L('Ue, Ui, Uimp, In, Icu, Ics, Icw, category B/A, standard. Icw is key for selectivity.', 'Ue وUi وUimp وIn وIcu وIcs وIcw وفئة B/A والمعيار. وIcw أساسية للانتقائية.')),
  H(8, 210, 336, 380, 336, L('Draw-out rails / cradle', 'قضبان/حامل السحب'), L('Withdrawable version: breaker slides in a cradle between connected / test / disconnected positions with safety interlocks.', 'النسخة القابلة للسحب: ينزلق القاطع على حامل بين أوضاع connected / test / disconnected مع إقفالات أمان.')),
  H(9, 99, 255, 40, 300, L('Accessory compartment', 'حجرة الملحقات'), L('Closing coil, shunt trip, undervoltage release, auxiliary contacts — manufacturer-specific codes (e.g., XF/MX/MN in some ranges).', 'ملف الإغلاق وshunt trip وUVR وملامسات مساعدة — برموز خاصة بالشركة (مثل XF/MX/MN في بعض العائلات).')),
  H(10, 140, 37, 40, 20, L('Main terminals', 'الأطراف الرئيسية'), L('Rear/top-bottom busbar connections carrying thousands of amps.', 'توصيلات قضبان خلفية/علوية-سفلية تحمل آلاف الأمبيرات.')),
];
const acbSVG = () => wrap([420, 380], `
  <rect x="80" y="40" width="260" height="280" rx="6" ${BODY} ${ST}/>
  ${[120, 190, 260].map((x) => `<rect x="${x}" y="24" width="40" height="16" rx="2" ${BODY2} ${ST}/>`).join('')}
  <rect x="100" y="50" width="220" height="30" rx="3" fill="var(--bg)" ${ST}/>${Array.from({ length: 14 }, (_, i) => `<path d="M${108 + i * 15} 54v22" stroke="var(--diag-stroke)" opacity=".55"/>`).join('')}
  <rect x="110" y="95" width="200" height="60" rx="5" ${BODY2} ${ST}/><rect x="122" y="105" width="90" height="26" rx="2" fill="var(--bg)" ${ST}/>${tx(167, 123, 'LSIG', 12, 'middle', 'var(--green)', 'font-weight="700"')}${[232, 252, 272, 292].map((x) => `<circle cx="${x}" cy="118" r="7" fill="none" ${ST}/>`).join('')}
  <circle cx="150" cy="188" r="12" fill="var(--green)" opacity=".85"/>${tx(150, 192, 'I', 11, 'middle', '#031', 'font-weight="700"')}
  <circle cx="190" cy="188" r="12" fill="var(--red)" opacity=".85"/>${tx(190, 192, 'O', 11, 'middle', '#200', 'font-weight="700"')}
  <rect x="226" y="178" width="30" height="20" rx="3" fill="var(--amber)" opacity=".8"/>${tx(241, 192, 'CHG', 8, 'middle', '#210')}
  <rect x="300" y="200" width="34" height="14" rx="3" fill="var(--blue)"/>
  <rect x="110" y="222" width="200" height="66" rx="5" fill="none" stroke="var(--line-strong)" stroke-dasharray="4 3"/>${tx(210, 244, 'Ue · Ui · Uimp · In', 10)}${tx(210, 262, 'Icu · Ics · Icw', 10, 'middle', 'var(--cyan)')}${tx(210, 278, 'IEC 60947-2', 9, 'middle', 'var(--muted)')}
  <rect x="88" y="225" width="14" height="60" rx="2" ${BODY2} ${ST}/>
  <rect x="60" y="330" width="300" height="12" rx="3" ${BODY2} ${ST}/><rect x="70" y="320" width="280" height="10" fill="none" ${ST} stroke-dasharray="6 4"/>
  ${leaders(acbHS)}
`, 'Annotated air circuit breaker front view');

/* ============================ RCCB schematic ============================ */
const rccbHS = [
  H(1, 70, 90, 40, 40, L('Phase conductor', 'موصل الطور'), L('Carries load current through the toroid. For 3-phase devices, all phases pass through it.', 'يحمل تيار الحمل عبر القلب الحلقي. وفي الأجهزة ثلاثية الأطوار تمر كل الأطوار عبره.')),
  H(2, 70, 150, 40, 200, L('Neutral conductor', 'موصل النيوترال'), L('Must pass through the toroid; the sum of all currents must be zero in a healthy circuit.', 'يجب أن يمر عبر القلب؛ ومجموع كل التيارات صفر في الدائرة السليمة.')),
  H(3, 200, 120, 200, 30, L('Toroidal transformer', 'المحول الحلقي'), L('Summation CT: residual current induces a voltage in its secondary winding.', 'محول جامع: التيار المتبقي يحث جهدًا في ملفه الثانوي.')),
  H(4, 290, 190, 340, 230, L('Sensitive release', 'الريليه الحساس'), L('Polarised relay/electronics that trips the mechanism when residual current reaches IΔn.', 'ريليه مستقطب/إلكترونيات تفصل الآلية عند بلوغ التيار المتبقي IΔn.')),
  H(5, 200, 190, 130, 240, L('Test button', 'زر الاختبار'), L('Creates a known imbalance through a resistor to verify the device trips.', 'يخلق اختلالًا معلومًا عبر مقاومة للتحقق من أن الجهاز يفصل.')),
  H(6, 330, 90, 380, 40, L('Contacts / mechanism', 'الملامسات/الآلية'), L('Opens all poles, including the neutral.', 'يفتح جميع الأقطاب بما فيها النيوترال.')),
];
const rccbSVG = () => wrap([420, 280], `
  <path d="M30 90H175M225 90H300M300 90l26-12M340 90H400" fill="none" stroke="var(--amber)" stroke-width="3"/>
  <path d="M30 150H175M225 150H300M300 150l26-12M340 150H400" fill="none" stroke="var(--blue)" stroke-width="3"/>
  ${tx(18, 94, 'L', 12, 'middle', 'var(--amber)', 'font-weight="700"')}${tx(18, 154, 'N', 12, 'middle', 'var(--blue)', 'font-weight="700"')}
  <ellipse cx="200" cy="120" rx="26" ry="52" fill="none" stroke="var(--cyan)" stroke-width="3"/><ellipse cx="200" cy="120" rx="26" ry="52" fill="none" stroke="var(--cyan)" opacity=".25" stroke-width="9"/>
  <path d="M200 172v18h70" fill="none" ${ST}/>
  <rect x="270" y="176" width="56" height="30" rx="4" ${BODY2} ${ST}/>${tx(298, 195, 'RELEASE', 8, 'middle', 'var(--text)')}
  <path d="M326 190h20v-100" fill="none" stroke="var(--diag-stroke)" stroke-dasharray="4 3"/>
  <path d="M175 150v50h50v-40" fill="none" ${ST}/><rect x="188" y="186" width="24" height="12" rx="2" fill="var(--bg)" ${ST}/><circle cx="200" cy="215" r="9" fill="var(--amber)" opacity=".85"/>${tx(200, 219, 'T', 10, 'middle', '#210', 'font-weight="700"')}
  ${leaders(rccbHS)}
`, 'RCCB schematic: toroid, release and test circuit');

/* ============================ VCB cutaway ============================ */
const vcbHS = [
  H(1, 200, 58, 40, 50, L('Fixed terminal / stem', 'الطرف الثابت / الساق'), L('Fixed conductor bringing current from the busbar side into the fixed contact.', 'موصل ثابت يوصل التيار من جهة القضبان إلى الملامس الثابت.')),
  H(2, 200, 154, 40, 120, L('Fixed contact', 'الملامس الثابت'), L('Stationary contact disc (typically a copper–chromium alloy) that carries current when closed and takes the arc when opening.', 'قرص ملامس ثابت (غالبًا سبيكة نحاس-كروم) يحمل التيار عند الإغلاق ويتحمل القوس عند الفتح.')),
  H(3, 200, 268, 360, 268, L('MOVING CONTACT', 'الملامس المتحرك'), L('Moves axially (millimetres of travel) to open/close the gap. It is driven by the breaker mechanism through the bellows-sealed stem. When the gap opens, a metal-vapour arc forms between the fixed and moving contacts.', 'يتحرك محوريًا (مسافة ملليمترات) لفتح/غلق الفاصل. تحركه آلية القاطع عبر ساق محكمة بالمنفاخ. وعند فتح الفاصل يتكون قوس بخار معدن بين الملامس الثابت والمتحرك.')),
  H(4, 200, 322, 360, 322, L('Bellows', 'المنفاخ'), L('Flexible stainless-steel bellows: lets the moving stem travel while keeping the vacuum sealed. Its mechanical life limits the number of operations.', 'منفاخ فولاذي مرن: يسمح بحركة الساق مع إحكام الفراغ. وعمره الميكانيكي يحدد عدد العمليات.')),
  H(5, 157, 210, 40, 210, L('Vapour shield', 'درع البخار'), L('Metal cylinder that condenses metal vapour and keeps it off the insulating envelope, preserving dielectric strength.', 'أسطوانة معدنية تكثف بخار المعدن وتمنعه من الوصول للغلاف العازل فتحافظ على قوة العزل.')),
  H(6, 142, 270, 40, 290, L('Insulating envelope', 'الغلاف العازل'), L('Ceramic (or other insulating) cylinder that holds the vacuum and insulates the two contact ends.', 'أسطوانة خزفية (أو عازلة أخرى) تحافظ على الفراغ وتعزل طرفي الملامسات.')),
  H(7, 232, 210, 360, 200, L('VACUUM', 'الفراغ (VACUUM)'), L('Why vacuum works: with almost no gas molecules there is little to ionise, so once the current reaches zero the metal vapour condenses within microseconds and the gap recovers dielectric strength extremely fast. A short gap (millimetres) therefore withstands the transient recovery voltage. This gives short arcing time and low contact wear.', 'لماذا ينجح الفراغ: بغياب الجزيئات الغازية تقريبًا لا يوجد ما يتأين، فبمجرد وصول التيار للصفر يتكثف بخار المعدن خلال ميكروثوانٍ ويستعيد الفاصل قوته العازلة بسرعة هائلة. لذلك يتحمل فاصل قصير (ملليمترات) جهد الاسترداد العابر. والنتيجة زمن قوس قصير وتآكل ملامسات قليل.')),
  H(8, 200, 210, 40, 160, L('Arc (metal vapour)', 'القوس (بخار معدن)'), L('When contacts separate under current, a metal-vapour arc bridges the gap until current zero.', 'عند انفصال الملامسات تحت تيار يجسر قوس بخار معدن الفاصل حتى صفر التيار.')),
  H(9, 200, 404, 360, 404, L('Insulating push rod', 'قضيب الدفع العازل'), L('Insulated link between the live moving stem and the grounded operating mechanism.', 'وصلة عازلة بين الساق المتحركة الحية وآلية التشغيل المؤرضة.')),
  H(10, 200, 106, 360, 70, L('End cap / seal', 'غطاء الطرف / الإحكام'), L('Metal end flanges brazed to the ceramic to seal the vacuum.', 'شفتان معدنيتان ملحومتان بالخزف لإحكام الفراغ.')),
];
const vcbSVG = () => wrap([400, 460], `
  <rect x="190" y="30" width="20" height="78" ${BODY2} ${ST}/>
  <rect x="140" y="106" width="120" height="250" rx="4" ${BODY} ${ST}/>
  <rect x="130" y="98" width="140" height="14" rx="3" ${BODY2} ${ST}/><rect x="130" y="350" width="140" height="14" rx="3" ${BODY2} ${ST}/>
  <rect x="155" y="128" width="90" height="160" fill="none" stroke="var(--cyan)" stroke-dasharray="5 4" opacity=".8"/>
  ${tx(225, 236, 'vacuum', 9, 'middle', 'var(--muted)', 'font-style="italic"')}
  <rect x="172" y="150" width="56" height="12" rx="2" fill="var(--amber)" opacity=".85" stroke="var(--diag-stroke)"/>
  <rect x="190" y="162" width="20" height="14" ${BODY2}/>
  <path d="M200 176l-7 12 14 10-14 12 14 10-7 10" fill="none" stroke="var(--amber)" stroke-width="3" class="arc-flicker"/>
  <rect x="172" y="256" width="56" height="12" rx="2" fill="var(--amber)" opacity=".85" stroke="var(--diag-stroke)"/>
  <rect x="190" y="268" width="20" height="86" ${BODY2} ${ST}/>
  <path d="M170 292h60l-10 6h-40zM170 304h60l-10 6h-40zM170 316h60l-10 6h-40zM170 328h60l-10 6h-40z" fill="none" ${ST} opacity=".95"/>
  <rect x="190" y="364" width="20" height="60" rx="2" fill="var(--diag-body-2)" ${ST} stroke-dasharray="4 3"/>${tx(200, 442, 'to mechanism', 9, 'middle', 'var(--muted)')}
  ${leaders(vcbHS)}
`, 'Vacuum interrupter cutaway');

/* ============================ SF6 puffer cutaway ============================ */
const sf6HS = [
  H(1, 100, 170, 40, 120, L('Fixed arcing contact', 'ملامس القوس الثابت'), L('Stationary contact on which the arc root sits when contacts separate.', 'ملامس ثابت يستقر عليه جذر القوس عند انفصال الملامسات.')),
  H(2, 225, 150, 225, 40, L('Insulating nozzle', 'الفوهة العازلة'), L('PTFE-type nozzle guiding the SF6 blast along the arc.', 'فوهة (من نوع PTFE) توجه نفخة SF6 على امتداد القوس.')),
  H(3, 270, 170, 270, 290, L('Moving contact', 'الملامس المتحرك'), L('Tubular moving contact that withdraws from the fixed contact.', 'ملامس متحرك أنبوبي ينسحب من الملامس الثابت.')),
  H(4, 340, 140, 400, 60, L('Puffer cylinder', 'أسطوانة الـ puffer'), L('Gas volume compressed during the opening stroke (puffer principle).', 'حجم غاز يُضغط أثناء شوط الفتح (مبدأ puffer).')),
  H(5, 334, 170, 334, 290, L('Piston', 'المكبس'), L('Fixed piston relative to the moving cylinder: opening motion compresses the SF6 and blasts it through the nozzle.', 'مكبس ثابت نسبةً للأسطوانة المتحركة: حركة الفتح تضغط SF6 وتنفخه عبر الفوهة.')),
  H(6, 410, 170, 420, 290, L('Insulating drive rod', 'قضيب الدفع العازل'), L('Links the operating mechanism (spring/hydraulic) to the moving parts.', 'يربط آلية التشغيل (زنبركية/هيدروليكية) بالأجزاء المتحركة.')),
  H(7, 170, 118, 120, 40, L('SF6 gas', 'غاز SF6'), L('High dielectric strength and strong arc-cooling; monitored by a density/pressure device. Greenhouse gas — handle per IEC 62271-4.', 'عزل عالٍ وتبريد قوي للقوس؛ ويُراقب بجهاز كثافة/ضغط. غاز دفيئة — يُتداول وفق IEC 62271-4.')),
  H(8, 60, 100, 40, 40, L('Insulating housing', 'الغلاف العازل'), L('Porcelain/composite housing (live tank) or grounded enclosure (dead tank/GIS) holding the gas.', 'غلاف خزفي/مركب (live tank) أو غلاف مؤرض (dead tank/GIS) يحتوي الغاز.')),
];
const sf6SVG = () => wrap([460, 320], `
  <rect x="40" y="90" width="380" height="160" rx="20" ${BODY} ${ST}/>
  ${Array.from({ length: 24 }, (_, i) => `<circle cx="${60 + (i % 8) * 14}" cy="${108 + Math.floor(i / 8) * 11}" r="1.6" fill="var(--cyan)" opacity=".55"/>`).join('')}
  <rect x="58" y="160" width="100" height="20" rx="4" fill="var(--amber)" opacity=".85" stroke="var(--diag-stroke)"/>
  <path d="M185 130h70l10 28v24l-10 28h-70l20-28v-24z" fill="var(--bg)" ${ST} opacity=".9"/>
  <rect x="230" y="160" width="150" height="20" rx="4" fill="var(--amber)" opacity=".85" stroke="var(--diag-stroke)"/>
  <rect x="300" y="128" width="84" height="84" rx="4" ${BODY2} ${ST}/><rect x="330" y="132" width="8" height="76" fill="var(--blue)"/>
  <rect x="384" y="165" width="50" height="10" rx="3" fill="var(--diag-body-2)" ${ST}/>
  <path d="M158 170h60" stroke="var(--cyan)" stroke-width="2.5" stroke-dasharray="4 4" class="arc-flicker"/>
  ${leaders(sf6HS)}
`, 'SF6 puffer interrupter cutaway');

/* ============================ GIS bay ============================ */
const gisHS = [
  H(1, 260, 62, 40, 40, L('Busbar', 'القضبان'), L('Gas-insulated tubular conductor linking bays; often three phases in one enclosure (MV/HV designs vary).', 'موصل أنبوبي معزول بالغاز يربط الخلايا؛ وغالبًا تكون الأطوار الثلاثة في غلاف واحد (تختلف التصاميم).')),
  H(2, 130, 120, 40, 120, L('Disconnector', 'الفاصل'), L('Isolates the breaker/bay from the busbar; operated off-load; position is indicated.', 'يعزل القاطع/الخلية عن القضبان؛ يعمل بدون حمل؛ مع مؤشر وضع.')),
  H(3, 230, 190, 40, 200, L('Circuit breaker', 'القاطع'), L('SF6 interrupter module with stored-energy mechanism; interrupts load and fault current.', 'وحدة قطع SF6 بآلية طاقة مخزنة؛ تقطع تيارات الحمل والعطل.')),
  H(4, 350, 190, 470, 130, L('Earthing switch', 'سكينة التأريض'), L('Earths isolated sections for safe maintenance; fast-acting types can make fault current.', 'تؤرض الأقسام المعزولة للصيانة الآمنة؛ وبعض الأنواع السريعة تصل على تيار عطل.')),
  H(5, 200, 270, 40, 290, L('Current transformer', 'محول التيار CT'), L('Supplies measurement and protection currents (ring-type around the conductor).', 'يوفر تيارات القياس والحماية (نوع حلقي حول الموصل).')),
  H(6, 420, 210, 470, 250, L('Voltage transformer', 'محول الجهد VT'), L('Supplies voltage signals for measurement/protection/synchronising.', 'يوفر إشارات الجهد للقياس/الحماية/المزامنة.')),
  H(7, 240, 330, 40, 340, L('Cable termination', 'نهاية الكابل'), L('Connects the bay to the power cable via a sealing end/plug-in termination.', 'يربط الخلية بكابل القدرة عبر نهاية مغلقة/توصيل قابل للإدخال.')),
];
const gisSVG = () => wrap([520, 380], `
  <defs>
    <linearGradient id="gtube" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--diag-body-2)"/><stop offset=".5" stop-color="var(--diag-body)"/><stop offset="1" stop-color="var(--diag-body-2)"/></linearGradient>
    <linearGradient id="gtubeV" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="var(--diag-body-2)"/><stop offset=".5" stop-color="var(--diag-body)"/><stop offset="1" stop-color="var(--diag-body-2)"/></linearGradient>
  </defs>
  <rect x="40" y="48" width="440" height="28" rx="14" fill="url(#gtube)" ${ST}/>
  <rect x="116" y="76" width="28" height="66" fill="url(#gtubeV)" ${ST}/><circle cx="130" cy="110" r="8" fill="var(--amber)" opacity=".85"/>
  <rect x="116" y="142" width="28" height="46" fill="url(#gtubeV)" ${ST}/>
  <rect x="100" y="170" width="260" height="46" rx="23" fill="url(#gtube)" ${ST}/><rect x="214" y="170" width="32" height="46" fill="var(--diag-body-2)" ${ST}/>
  <rect x="334" y="148" width="32" height="38" rx="4" fill="url(#gtubeV)" ${ST}/><path d="M350 186v-20" stroke="var(--green)" stroke-width="2.5"/>
  <rect x="186" y="216" width="28" height="44" fill="url(#gtubeV)" ${ST}/>
  <ellipse cx="200" cy="268" rx="34" ry="12" fill="none" stroke="var(--cyan)" stroke-width="3"/><ellipse cx="200" cy="268" rx="34" ry="12" fill="none" stroke="var(--cyan)" stroke-width="8" opacity=".2"/>
  <rect x="186" y="276" width="28" height="30" fill="url(#gtubeV)" ${ST}/>
  <rect x="396" y="200" width="46" height="26" rx="13" fill="url(#gtube)" ${ST}/><rect x="408" y="176" width="22" height="24" fill="url(#gtubeV)" ${ST}/>
  <path d="M330 130v-54" stroke="var(--diag-stroke)" stroke-dasharray="3 3" opacity=".5"/>
  <path d="M232 306l10 20h-24z" ${BODY2} ${ST}/><rect x="228" y="326" width="8" height="30" fill="var(--amber)" opacity=".85"/>${tx(232, 372, 'cable', 9, 'middle', 'var(--muted)')}
  <path d="M200 216v-0" stroke="none"/>
  ${leaders(gisHS)}
  <path d="M232 306H220" stroke="none"/>
`, '3D-style schematic of a gas-insulated switchgear bay');

/* ============================ Live tank / Dead tank (comparison visuals) ============================ */
export const liveTankSVG = () => wrap([300, 320], `
  <rect x="50" y="290" width="200" height="14" rx="3" ${BODY2} ${ST}/>
  <rect x="136" y="170" width="28" height="120" rx="3" ${BODY} ${ST}/>${Array.from({ length: 6 }, (_, i) => `<path d="M132 ${182 + i * 18}h36" ${ST}/>`).join('')}
  <rect x="70" y="140" width="160" height="32" rx="16" ${BODY} ${ST}/>${tx(150, 160, 'interrupter', 9, 'middle', 'var(--cyan)')}
  <path d="M40 156h30M230 156h30" stroke="var(--amber)" stroke-width="3"/><circle cx="40" cy="156" r="4" fill="var(--amber)"/><circle cx="260" cy="156" r="4" fill="var(--amber)"/>
  <rect x="190" y="240" width="40" height="50" rx="4" ${BODY2} ${ST}/>${tx(210, 270, 'CT', 10)}
  ${tx(150, 124, 'LIVE TANK', 13, 'middle', 'var(--cyan)', 'font-weight="700" letter-spacing="1"')}${tx(150, 316, 'interrupter at line potential', 9, 'middle', 'var(--muted)')}
`, 'Live tank breaker schematic');
export const deadTankSVG = () => wrap([300, 320], `
  <rect x="50" y="290" width="200" height="14" rx="3" ${BODY2} ${ST}/>
  <rect x="60" y="190" width="180" height="100" rx="50" ${BODY} ${ST}/>${tx(150, 246, 'interrupter (grounded tank)', 9, 'middle', 'var(--cyan)')}
  <rect x="82" y="120" width="26" height="72" rx="3" ${BODY2} ${ST}/><rect x="192" y="120" width="26" height="72" rx="3" ${BODY2} ${ST}/>
  <ellipse cx="95" cy="170" rx="22" ry="8" fill="none" stroke="var(--green)" stroke-width="2.5"/><ellipse cx="205" cy="170" rx="22" ry="8" fill="none" stroke="var(--green)" stroke-width="2.5"/>
  <path d="M95 120v-24M205 120v-24" stroke="var(--amber)" stroke-width="3"/><circle cx="95" cy="96" r="4" fill="var(--amber)"/><circle cx="205" cy="96" r="4" fill="var(--amber)"/>
  ${tx(150, 76, 'DEAD TANK', 13, 'middle', 'var(--cyan)', 'font-weight="700" letter-spacing="1"')}${tx(150, 316, 'bushing CTs, grounded tank', 9, 'middle', 'var(--muted)')}
`, 'Dead tank breaker schematic');

/* ============================ Generic medium schematic (oil, air-mv, airblast, dc, hvdc, gcb ...) ============================ */
const mediumSVG = (kind) => {
  const fills = {
    oil: '<rect x="40" y="60" width="220" height="160" rx="8" fill="var(--amber)" opacity=".18"/>' + Array.from({ length: 5 }, (_, i) => `<path d="M50 ${90 + i * 26}q15 -8 30 0t30 0t30 0t30 0t30 0t30 0" fill="none" stroke="var(--amber)" opacity=".5"/>`).join(''),
    airblast: Array.from({ length: 6 }, (_, i) => `<path d="M${60 + i * 30} 40v50" stroke="var(--cyan)" stroke-width="2" marker-end="url(#arr)"/><path d="M${60 + i * 30} 250v-50" stroke="var(--cyan)" stroke-width="2" marker-end="url(#arr)"/>`).join(''),
    air: Array.from({ length: 5 }, (_, i) => `<path d="M${80 + i * 34} 70v-0 60" stroke="var(--diag-stroke)" opacity=".5"/>`).join('') + '<rect x="70" y="60" width="160" height="40" fill="none" ' + ST + ' stroke-dasharray="3 3"/>',
    dc: '<path d="M70 70q80 -40 160 0" fill="none" stroke="var(--violet)" stroke-width="2"/><path d="M80 210q70 40 140 0" fill="none" stroke="var(--violet)" stroke-width="2"/>',
    hvdc: '<rect x="60" y="210" width="180" height="26" rx="4" ' + BODY2 + ' ' + ST + '/>' + tx(150, 228, 'solid-state / arresters', 10, 'middle', 'var(--cyan)'),
    sf6: Array.from({ length: 30 }, (_, i) => `<circle cx="${60 + (i % 10) * 20}" cy="${80 + Math.floor(i / 10) * 40}" r="2" fill="var(--cyan)" opacity=".6"/>`).join(''),
    vacuum: '',
  };
  return wrap([300, 280], `
    <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="var(--cyan)"/></marker></defs>
    <rect x="30" y="50" width="240" height="180" rx="12" ${BODY} ${ST}/>
    ${fills[kind] || ''}
    <rect x="40" y="136" width="90" height="14" rx="3" fill="var(--amber)" opacity=".85" stroke="var(--diag-stroke)"/>
    <path d="M130 143l22-18" stroke="var(--amber)" stroke-width="5" stroke-linecap="round"/>
    <path d="M155 128l7 10-9 5 9 5-7 10" fill="none" stroke="var(--amber)" stroke-width="2.5" class="arc-flicker"/>
    <rect x="166" y="136" width="94" height="14" rx="3" fill="var(--amber)" opacity=".85" stroke="var(--diag-stroke)"/>
  `, 'Arc interruption schematic');
};

/* ============================ Wiring / protection-chain diagrams ============================ */
export const wiringSVG = (id) => {
  if (id === 'mcb' || id === 'mccb') return wrap([420, 230], `
    ${tx(210, 22, 'Single-line: supply → breaker → cable → load', 11, 'middle', 'var(--muted)')}
    <path d="M30 110H110M150 110H300" stroke="var(--amber)" stroke-width="3"/>
    <rect x="110" y="86" width="40" height="48" rx="6" ${BODY} ${ST}/><path d="M118 124l22-30" stroke="var(--cyan)" stroke-width="3"/>${tx(130, 150, id.toUpperCase(), 10)}
    <circle cx="330" cy="110" r="26" ${BODY2} ${ST}/>${tx(330, 114, 'LOAD', 9)}<path d="M300 110h4" stroke="var(--amber)" stroke-width="3"/>
    <path d="M30 170H300" stroke="var(--blue)" stroke-width="3"/>${tx(20, 114, 'L', 12, 'middle', 'var(--amber)')}${tx(20, 174, 'N', 12, 'middle', 'var(--blue)')}
    <path d="M30 200H300" stroke="var(--green)" stroke-width="3" stroke-dasharray="6 4"/>${tx(20, 204, 'PE', 12, 'middle', 'var(--green)')}
    ${tx(210, 224, 'Line on top (1), Load at bottom (2) – follow the marking on the device', 9, 'middle', 'var(--muted)')}
  `, 'Wiring single-line diagram');
  if (id === 'rccb' || id === 'rcbo') return wrap([420, 230], `
    ${tx(210, 22, 'RCD: L and N pass through the device – never bypass N', 11, 'middle', 'var(--muted)')}
    <path d="M30 80H400" stroke="var(--amber)" stroke-width="3"/><path d="M30 130H400" stroke="var(--blue)" stroke-width="3"/>
    <rect x="150" y="56" width="120" height="100" rx="8" ${BODY} ${ST}/><ellipse cx="210" cy="105" rx="18" ry="34" fill="none" stroke="var(--cyan)" stroke-width="3"/>${tx(210, 172, id.toUpperCase(), 11)}
    <path d="M30 195H400" stroke="var(--green)" stroke-width="3" stroke-dasharray="6 4"/>${tx(20, 84, 'L', 12, 'middle', 'var(--amber)')}${tx(20, 134, 'N', 12, 'middle', 'var(--blue)')}${tx(20, 199, 'PE', 12, 'middle', 'var(--green)')}
    ${tx(210, 222, 'RCCB needs an upstream MCB/fuse for overcurrent protection', 9, 'middle', 'var(--muted)')}
  `, 'RCD wiring diagram');
  if (id === 'mpcb') return wrap([420, 240], `
    ${tx(210, 20, 'Motor starter: MPCB → contactor → motor', 11, 'middle', 'var(--muted)')}
    <path d="M60 40v36M60 100v36M60 160v30" stroke="var(--amber)" stroke-width="3"/>
    <rect x="30" y="76" width="60" height="24" rx="5" ${BODY} ${ST}/>${tx(60, 92, 'MPCB', 10)}
    <rect x="30" y="136" width="60" height="24" rx="5" ${BODY} ${ST}/>${tx(60, 152, 'K1', 10)}
    <circle cx="60" cy="210" r="22" ${BODY2} ${ST}/>${tx(60, 214, 'M', 14)}
    <rect x="170" y="130" width="160" height="40" rx="6" fill="none" stroke="var(--line-strong)" stroke-dasharray="4 3"/>${tx(250, 154, 'coil K1 (control circuit)', 10, 'middle', 'var(--muted)')}
    ${tx(250, 80, 'Dial = motor rated current', 11, 'middle', 'var(--cyan)')}${tx(250, 100, 'Coordination: Type 1 / Type 2', 10, 'middle', 'var(--muted)')}
  `, 'Motor starter wiring');
  if (id === 'vcb' || id === 'sf6-mv' || id === 'gcb') return wrap([440, 250], `
    ${tx(220, 20, 'MV protection chain', 11, 'middle', 'var(--muted)')}
    <path d="M20 70H420" stroke="var(--amber)" stroke-width="3"/>
    <circle cx="100" cy="70" r="14" fill="none" stroke="var(--cyan)" stroke-width="3"/>${tx(100, 52, 'CT', 11)}
    <rect x="300" y="52" width="46" height="36" rx="6" ${BODY} ${ST}/>${tx(323, 74, 'CB', 12, 'middle', 'var(--text)', 'font-weight="700"')}
    <path d="M100 84v66H190" fill="none" stroke="var(--cyan)" stroke-dasharray="5 4"/>
    <rect x="190" y="130" width="100" height="44" rx="6" ${BODY2} ${ST}/>${tx(240, 150, 'RELAY', 11)}${tx(240, 166, '50/51 · 50N/51N', 8, 'middle', 'var(--muted)')}
    <path d="M290 152h33V88" fill="none" stroke="var(--red)" stroke-width="2" marker-end="url(#a2)"/>${tx(340, 140, 'trip coil', 9, 'start', 'var(--red)')}
    <defs><marker id="a2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="var(--red)"/></marker></defs>
    ${tx(220, 214, 'CT → relay decides → trip coil → breaker opens. Needs a reliable auxiliary supply.', 9, 'middle', 'var(--muted)')}
  `, 'CT relay breaker chain');
  if (id === 'dc-lv' || id === 'pv-dc') return wrap([420, 230], `
    ${tx(210, 20, 'DC breaker: poles in series per manufacturer diagram (illustrative)', 11, 'middle', 'var(--muted)')}
    <path d="M30 70H120M170 70H220M270 70H400" stroke="var(--amber)" stroke-width="3"/>
    <rect x="120" y="50" width="50" height="40" rx="6" ${BODY} ${ST}/>${tx(145, 74, '+ pole', 9)}
    <rect x="220" y="50" width="50" height="40" rx="6" ${BODY} ${ST}/>${tx(245, 74, '+ pole', 9)}
    ${tx(22, 74, '+', 16, 'middle', 'var(--red)', 'font-weight="700"')}
    <path d="M30 150H400" stroke="var(--blue)" stroke-width="3"/>${tx(22, 154, '–', 16, 'middle', 'var(--blue)', 'font-weight="700"')}
    ${tx(210, 200, 'Polarity and series wiring are model-specific – follow the label and datasheet.', 9, 'middle', 'var(--muted)')}
  `, 'DC breaker wiring concept');
  return null;
};

export const annotated = {
  mcb: { vb: [400, 480], build: mcbSVG, hs: mcbHS, title: L('Annotated MCB', 'MCB موضح بالرموز') },
  mccb: { vb: [400, 380], build: mccbSVG, hs: mccbHS, title: L('MCCB anatomy', 'تشريح MCCB') },
  acb: { vb: [420, 380], build: acbSVG, hs: acbHS, title: L('ACB anatomy', 'تشريح ACB') },
  rccb: { vb: [420, 280], build: rccbSVG, hs: rccbHS, title: L('RCCB schematic', 'مخطط RCCB') },
  vcb: { vb: [400, 460], build: vcbSVG, hs: vcbHS, title: L('Vacuum interrupter cutaway', 'قطاع داخلي لمفرغ VCB') },
  sf6: { vb: [460, 320], build: sf6SVG, hs: sf6HS, title: L('SF6 puffer interrupter', 'وحدة قطع SF6 نوع puffer') },
  gis: { vb: [520, 380], build: gisSVG, hs: gisHS, title: L('GIS bay (3D-style schematic)', 'خلية GIS (مخطط ثلاثي الأبعاد)') },
};
annotated.rcbo = annotated.rccb;

/* diagram lookup for breaker detail pages */
export function diagramFor(b) {
  if (annotated[b.diagram]) return { type: 'annotated', key: b.diagram };
  const mediumMap = { oil: 'oil', 'air-mv': 'air', airblast: 'airblast', dc: 'dc', pv: 'dc', hvdc: 'hvdc', gcb: 'vacuum', elcb: 'air', mpcb: 'air', 'live-tank': 'sf6', 'dead-tank': 'sf6' };
  return { type: 'static', svg: mediumSVG(mediumMap[b.diagram] || 'air') };
}
export { mediumSVG };

/* ============================ Thumbnails for cards ============================ */
const th = (inner) => `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
const T = {
  mcb: () => th(`<rect x="46" y="8" width="28" height="74" rx="4" ${BODY} ${ST}/><rect x="52" y="18" width="16" height="16" rx="2" fill="var(--blue)"/><text x="60" y="52" font-size="9" text-anchor="middle" fill="var(--text)" ${FF} font-weight="700">C16</text><rect x="50" y="8" width="20" height="5" ${BODY2}/><rect x="50" y="77" width="20" height="5" ${BODY2}/>`),
  mccb: () => th(`<rect x="22" y="12" width="76" height="66" rx="8" ${BODY} ${ST}/><rect x="50" y="20" width="20" height="16" rx="3" fill="var(--blue)"/><rect x="30" y="44" width="60" height="24" rx="3" ${BODY2} ${ST}/><circle cx="46" cy="56" r="6" fill="none" ${ST}/><circle cx="74" cy="56" r="6" fill="none" ${ST}/>`),
  acb: () => th(`<rect x="14" y="8" width="92" height="70" rx="4" ${BODY} ${ST}/><rect x="24" y="16" width="72" height="14" rx="2" fill="var(--bg)" ${ST}/><circle cx="38" cy="46" r="6" fill="var(--green)"/><circle cx="56" cy="46" r="6" fill="var(--red)"/><rect x="72" y="40" width="22" height="12" rx="2" fill="var(--amber)" opacity=".8"/><rect x="8" y="80" width="104" height="5" rx="2" ${BODY2} ${ST}/>`),
  rccb: () => th(`<rect x="34" y="10" width="52" height="70" rx="5" ${BODY} ${ST}/><rect x="42" y="18" width="16" height="14" rx="2" fill="var(--blue)"/><circle cx="68" cy="40" r="7" fill="var(--amber)" opacity=".85"/><text x="68" y="43" font-size="8" text-anchor="middle" fill="#210" ${FF} font-weight="700">T</text><text x="60" y="64" font-size="8" text-anchor="middle" fill="var(--text)" ${FF}>30mA</text>`),
  vcb: () => th(`<rect x="46" y="8" width="28" height="74" rx="4" ${BODY} ${ST}/><rect x="40" y="6" width="40" height="6" ${BODY2} ${ST}/><rect x="40" y="78" width="40" height="6" ${BODY2} ${ST}/><rect x="53" y="30" width="14" height="4" fill="var(--amber)"/><rect x="53" y="54" width="14" height="4" fill="var(--amber)"/><path d="M60 34l-3 6 6 5-6 5 3 3" fill="none" stroke="var(--amber)" stroke-width="1.6"/>`),
  sf6: () => th(`<rect x="10" y="30" width="100" height="30" rx="14" ${BODY} ${ST}/><circle cx="30" cy="40" r="1.6" fill="var(--cyan)"/><circle cx="44" cy="50" r="1.6" fill="var(--cyan)"/><circle cx="66" cy="40" r="1.6" fill="var(--cyan)"/><path d="M26 45h68" stroke="var(--amber)" stroke-width="3"/>`),
  gis: () => th(`<rect x="8" y="14" width="104" height="12" rx="6" ${BODY} ${ST}/><rect x="30" y="26" width="10" height="22" ${BODY2} ${ST}/><rect x="22" y="44" width="76" height="18" rx="9" ${BODY} ${ST}/><rect x="50" y="62" width="10" height="18" ${BODY2} ${ST}/>`),
  live: () => th(`<rect x="52" y="34" width="16" height="44" ${BODY} ${ST}/><rect x="22" y="22" width="76" height="14" rx="7" ${BODY2} ${ST}/><rect x="30" y="78" width="60" height="6" ${BODY2}/>`),
  dead: () => th(`<rect x="20" y="42" width="80" height="36" rx="18" ${BODY} ${ST}/><rect x="32" y="20" width="10" height="24" ${BODY2} ${ST}/><rect x="78" y="20" width="10" height="24" ${BODY2} ${ST}/><ellipse cx="37" cy="36" rx="9" ry="3" fill="none" stroke="var(--green)" stroke-width="1.6"/><ellipse cx="83" cy="36" rx="9" ry="3" fill="none" stroke="var(--green)" stroke-width="1.6"/>`),
  generic: () => th(`<rect x="22" y="14" width="76" height="62" rx="8" ${BODY} ${ST}/><path d="M34 45h22l16-14" stroke="var(--amber)" stroke-width="3" fill="none"/><path d="M72 45h14" stroke="var(--amber)" stroke-width="3"/>`),
};
export function thumbFor(b) {
  const map = { mcb: 'mcb', mccb: 'mccb', acb: 'acb', rccb: 'rccb', rcbo: 'rccb', elcb: 'rccb', mpcb: 'mccb', dc: 'mccb', pv: 'mccb', vcb: 'vcb', sf6: 'sf6', 'air-mv': 'vcb', oil: 'generic', airblast: 'generic', 'live-tank': 'live', 'dead-tank': 'dead', gis: 'gis', gcb: 'vcb', hvdc: 'generic' };
  return (T[map[b.diagram]] || T.generic)();
}
