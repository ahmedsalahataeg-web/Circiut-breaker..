// Aggregated breaker database + filter definitions.
import { L } from '../core/store.js';
import { lvBreakers } from './breakers-lv.js';
import { mvBreakers } from './breakers-mv.js';
import { hvBreakers } from './breakers-hv.js';

function normalize(b) {
  return {
    extras: [], warn: null, related: [], interview: [], keywords: [],
    ...b,
    voltageClass: [...new Set(b.voltageClass.map((c) => (c === 'uhv' ? 'ehv' : c)))],
  };
}
export const breakers = [...lvBreakers, ...mvBreakers, ...hvBreakers].map(normalize);
export const byId = Object.fromEntries(breakers.map((b) => [b.id, b]));

export const filterDefs = {
  cls: { label: L('Voltage class', 'فئة الجهد'), opts: [
    ['lv', L('LV', 'LV منخفض')], ['mv', L('MV', 'MV متوسط')], ['hv', L('HV', 'HV عالٍ')], ['ehv', L('EHV / UHV', 'EHV / UHV فائق')],
  ] },
  band: { label: L('Current range (typical)', 'مدى التيار (نموذجي)'), opts: [
    ['low', L('Low (≤ ~125 A)', 'منخفض (≤ ~125 أمبير)')], ['mid', L('Medium (~125–1600 A)', 'متوسط (~125–1600 أمبير)')], ['high', L('High (> ~1600 A)', 'عالٍ (> ~1600 أمبير)')],
  ] },
  acdc: { label: L('AC / DC', 'AC / DC'), opts: [['ac', L('AC', 'AC')], ['dc', L('DC', 'DC')]] },
  arc: { label: L('Arc medium', 'وسيط إطفاء القوس'), opts: [
    ['air', L('Air', 'هواء')], ['vacuum', L('Vacuum', 'فراغ')], ['sf6', L('SF6', 'SF6')], ['oil', L('Oil', 'زيت')], ['airblast', L('Compressed air', 'هواء مضغوط')], ['none', L('Hybrid/solid-state', 'هجين/شبه موصل')],
  ] },
  protection: { label: L('Protection function', 'وظيفة الحماية'), opts: [
    ['overload', L('Overload', 'حمل زائد')], ['short', L('Short circuit', 'قصر')], ['earth', L('Earth fault', 'عطل أرضي')], ['residual', L('Residual current', 'تيار متبقٍ')], ['motor', L('Motor', 'محركات')], ['relay', L('Relay-driven', 'بالريليه')], ['selective', L('Selectivity (Icw)', 'انتقائية (Icw)')],
  ] },
  poles: { label: L('Poles', 'الأقطاب'), opts: [['1P', '1P'], ['2P', '2P'], ['3P', '3P'], ['4P', '4P']] },
  loc: { label: L('Indoor / Outdoor', 'داخلي / خارجي'), opts: [['indoor', L('Indoor', 'داخلي')], ['outdoor', L('Outdoor', 'خارجي')]] },
  legacy: { label: L('Status', 'الحالة'), opts: [['current', L('Current technology', 'تقنية حالية')], ['legacy', L('Historical / Legacy', 'تاريخي / قديم')]] },
};

export const classLabel = {
  lv: L('Low Voltage', 'جهد منخفض'), mv: L('Medium Voltage', 'جهد متوسط'), hv: L('High Voltage', 'جهد عالٍ'), ehv: L('EHV / UHV', 'جهد فائق EHV / UHV'),
};

export function applyFilters(list, sel) {
  return list.filter((b) => {
    if (sel.cls?.size && !b.voltageClass.some((c) => sel.cls.has(c))) return false;
    if (sel.band?.size && !b.currentBand.some((c) => sel.band.has(c))) return false;
    if (sel.acdc?.size && !b.acdc.some((c) => sel.acdc.has(c))) return false;
    if (sel.arc?.size && !b.arc.some((c) => sel.arc.has(c))) return false;
    if (sel.protection?.size && !b.protection.some((c) => sel.protection.has(c))) return false;
    if (sel.poles?.size && !b.poles.some((c) => sel.poles.has(c))) return false;
    if (sel.loc?.size && !b.loc.some((c) => sel.loc.has(c))) return false;
    if (sel.legacy?.size && !sel.legacy.has(b.legacy ? 'legacy' : 'current')) return false;
    return true;
  });
}
