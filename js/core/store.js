// Global state: language + theme (persisted). Pages re-render on change.
const KEY = 'pa.prefs';
const listeners = new Set();
let prefs = { lang: 'ar', theme: 'dark' };
try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { /* ignore */ }

function apply() {
  const r = document.documentElement;
  r.lang = prefs.lang;
  r.dir = prefs.lang === 'ar' ? 'rtl' : 'ltr';
  r.setAttribute('data-theme', prefs.theme);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = prefs.theme === 'dark' ? '#060b16' : '#f2f6fc';
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* private mode */ } }

export const store = {
  get lang() { return prefs.lang; },
  get theme() { return prefs.theme; },
  get isAr() { return prefs.lang === 'ar'; },
  setLang(l) { prefs.lang = l; save(); apply(); listeners.forEach((f) => f('lang')); },
  setTheme(t) { prefs.theme = t; save(); apply(); listeners.forEach((f) => f('theme')); },
  toggleTheme() { this.setTheme(prefs.theme === 'dark' ? 'light' : 'dark'); },
  subscribe(f) { listeners.add(f); return () => listeners.delete(f); },
  init: apply,
};

/** Pick the current-language string from {en, ar} (or return a plain string). */
export function t(x) {
  if (x == null) return '';
  if (typeof x === 'string') return x;
  return x[prefs.lang] ?? x.en ?? '';
}
/** Inline bilingual literal: tx('Compare', 'قارن') */
export const tx = (en, ar) => (prefs.lang === 'ar' ? ar : en);
/** Build a bilingual pair. */
export const L = (en, ar) => ({ en, ar });
/** Arabic UI shows the English technical term next to the Arabic name. */
export function termName(b) {
  if (prefs.lang === 'ar') return `${b.ar} — ${b.name}`;
  return `${b.name} – ${b.fullEn}`;
}
