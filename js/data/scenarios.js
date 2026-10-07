// "Where do we use each breaker?" – scenarios. Breaker ids refer to breakers.js.
import { L } from '../core/store.js';

const S = (id, name, desc, items) => ({ id, name, desc, items });
const it = (role, ids, note) => ({ role, ids, note });

export const scenarios = [
  S('house', L('House', 'منزل'), L('Final circuits fed from a consumer unit.', 'دوائر نهائية من لوحة المستهلك.'), [
    it(L('Incomer / main switch', 'القاطع الرئيسي'), ['mccb', 'mcb'], L('Depends on supply size; supply authority rules apply.', 'يعتمد على حجم التغذية؛ وتسري لوائح شركة الكهرباء.')),
    it(L('Socket & wet-area circuits', 'دوائر القوابس والأماكن الرطبة'), ['rcbo', 'rccb'], L('30 mA RCD commonly required by installation rules – follow local code.', 'غالبًا يُطلب RCD 30 مللي أمبير – اتبع الكود المحلي.')),
    it(L('Lighting circuits', 'دوائر الإضاءة'), ['mcb'], L('Often B or C curve per load inrush.', 'غالبًا منحنى B أو C حسب اندفاع الحمل.')),
  ]),
  S('apartment', L('Apartment', 'شقة'), L('Apartment distribution board with per-circuit protection.', 'لوحة توزيع الشقة بحماية لكل دائرة.'), [
    it(L('Apartment incomer', 'قاطع الشقة الرئيسي'), ['mcb', 'rccb'], L('RCCB with upstream overcurrent protection, or RCBOs per circuit.', 'RCCB مع حماية تيار زائد أمامية، أو RCBO لكل دائرة.')),
    it(L('Air-conditioner / kitchen', 'تكييف / مطبخ'), ['mcb', 'rcbo'], L('Curve and rating per load datasheet.', 'المنحنى والتيار حسب بيانات الحمل.')),
  ]),
  S('factory', L('Factory', 'مصنع'), L('Transformer → main LV board → MCCs → motors, with MV upstream.', 'محول ← لوحة LV رئيسية ← MCC ← محركات، مع MV في الأمام.'), [
    it(L('Main incomer', 'القاطع الرئيسي'), ['acb', 'mccb'], L('ACB for high current/Icw; MCCB for smaller plants.', 'ACB للتيار العالي/Icw؛ وMCCB للمصانع الأصغر.')),
    it(L('Motor feeder', 'مغذي محرك'), ['mccb', 'mpcb'], L('Appropriate protection + contactor coordination.', 'حماية مناسبة + تنسيق مع الكونتاكتور.')),
    it(L('MV motor', 'محرك MV'), ['vcb'], L('MV switchgear with VCB + relay.', 'لوحة MV بـ VCB + ريليه.')),
    it(L('Transformer MV side', 'جهة MV للمحول'), ['vcb', 'sf6-mv'], L('VCB/SF6 depending on system and installation.', 'VCB/SF6 حسب المنظومة والتركيب.')),
  ]),
  S('mcc', L('MCC (Motor Control Center)', 'MCC (مركز التحكم بالمحركات)'), L('Group of motor starters.', 'مجموعة مشغلات محركات.') , [
    it(L('Each starter', 'كل مشغل'), ['mpcb', 'mccb'], L('MPCB/MCCB + contactor + overload relay arrangement.', 'تركيب MPCB/MCCB + كونتاكتور + ريليه حمل زائد.')),
    it(L('MCC incomer', 'رئيسي MCC'), ['acb', 'mccb'], L('Rated for the MCC bus short-circuit withstand.', 'مقنن لتحمل قصر قضبان MCC.')),
  ]),
  S('mdb', L('MDB (Main Distribution Board)', 'MDB (لوحة التوزيع الرئيسية)'), L('Splits power to sub-boards and large loads.', 'توزع القدرة على اللوحات الفرعية والأحمال الكبيرة.'), [
    it(L('Incomer & bus-tie', 'الرئيسي ووصلة القضبان'), ['acb'], L('Often ACB; LSIG with selectivity.', 'غالبًا ACB؛ وLSIG مع انتقائية.')),
    it(L('Outgoing feeders', 'المغذيات الخارجة'), ['mccb'], L('Adjustable trip units coordinated with the incomer.', 'وحدات فصل قابلة للضبط ومنسقة مع الرئيسي.')),
    it(L('Final circuits', 'الدوائر النهائية'), ['mcb', 'rcbo'], L('Per load and local rules.', 'حسب الحمل واللوائح.')),
  ]),
  S('transformer', L('Transformer', 'محول'), L('Distribution transformer with protection on both sides.', 'محول توزيع بحماية على الجانبين.'), [
    it(L('MV side', 'جهة MV'), ['vcb', 'sf6-mv'], L('Breaker (or fuse-switch on smaller units) + relay.', 'قاطع (أو فيوز-مفتاح للوحدات الصغيرة) + ريليه.')),
    it(L('LV side', 'جهة LV'), ['acb', 'mccb'], L('Main incomer protecting the board.', 'القاطع الرئيسي لحماية اللوحة.')),
  ]),
  S('motor', L('Motor', 'محرك'), L('Protection and starting equipment.', 'حماية ومعدات تشغيل.'), [
    it(L('LV motor', 'محرك LV'), ['mpcb', 'mccb'], L('Overload + short-circuit + phase loss.', 'حمل زائد + قصر + فقد طور.')),
    it(L('MV motor', 'محرك MV'), ['vcb'], L('Relay protection (thermal, locked rotor, earth fault).', 'حماية بالريليه (حراري، دوار مقفل، عطل أرضي).')),
  ]),
  S('generator', L('Generator', 'مولد'), L('From standby sets to power-plant units.', 'من مجموعات الاحتياط إلى وحدات المحطات.'), [
    it(L('LV standby set', 'مجموعة احتياط LV'), ['mccb', 'acb'], L('Check generator fault contribution & trip settings.', 'افحص مساهمة المولد في القصر وضبط الفصل.')),
    it(L('Power-plant unit', 'وحدة محطة'), ['gcb'], L('Generator circuit-breaker between generator and step-up transformer.', 'قاطع مولد بين المولد ومحول الرفع.')),
  ]),
  S('solar', L('Solar plant', 'محطة شمسية'), L('PV strings, combiner boxes, inverters, AC collection.', 'سلاسل PV وصناديق تجميع وإنفرتر وتجميع AC.'), [
    it(L('String / DC side', 'جهة DC'), ['pv-dc', 'dc-lv'], L('DC-rated devices only; polarity & voltage per datasheet.', 'أجهزة مقننة للـ DC فقط؛ والقطبية والجهد حسب الكتالوج.')),
    it(L('Inverter AC output', 'خرج AC للإنفرتر'), ['mccb', 'acb'], L('Type of RCD per inverter documentation (Type B or inverter-integrated detection).', 'نوع RCD حسب وثائق الإنفرتر (نوع B أو كشف مدمج).')),
    it(L('MV collection', 'تجميع MV'), ['vcb'], L('MV switchgear to the grid.', 'لوحات MV نحو الشبكة.')),
  ]),
  S('substation', L('Substation', 'محطة'), L('MV and HV substations.', 'محطات MV وHV.'), [
    it(L('MV switchgear', 'لوحات MV'), ['vcb', 'sf6-mv'], L('Metal-enclosed per IEC 62271-200.', 'مغلقة معدنيًا حسب IEC 62271-200.')),
    it(L('HV bays', 'خلايا HV'), ['sf6-hv', 'live-tank', 'dead-tank', 'gis-cb'], L('AIS or GIS depending on site.', 'AIS أو GIS حسب الموقع.')),
  ]),
  S('distribution', L('Distribution network', 'شبكة التوزيع'), L('Feeders, ring-mains and overhead lines.', 'مغذيات وحلقات وخطوط هوائية.'), [
    it(L('Primary feeders', 'المغذيات الأولية'), ['vcb'], L('Relay with auto-reclose on overhead feeders.', 'ريليه مع إعادة إغلاق آلي على المغذيات الهوائية.')),
    it(L('Ring-main units', 'وحدات الحلقة'), ['sf6-mv', 'vcb'], L('Load-break switches/fuses/breakers depending on design.', 'مفاتيح حمل/فيوزات/قواطع حسب التصميم.')),
  ]),
  S('transmission', L('Transmission grid', 'شبكة النقل'), L('High and extra-high voltage lines.', 'خطوط الجهد العالي والفائق.'), [
    it(L('Line bays', 'خلايا الخطوط'), ['sf6-hv', 'live-tank', 'dead-tank', 'dcb'], L('Single-pole operation and auto-reclose common at higher voltages.', 'التشغيل أحادي القطب وإعادة الإغلاق شائعان في الجهود الأعلى.')),
    it(L('Urban / compact', 'حضري / مدمج'), ['gis-cb'], L('GIS where space is limited.', 'GIS حيث المساحة محدودة.')),
    it(L('DC grids', 'شبكات DC'), ['hvdc-cb'], L('Emerging technology.', 'تقنية ناشئة.')),
  ]),
];
