// Search engine over breakers, glossary, markings and interview questions.
// Understands plain text and numeric queries like "16A", "630A", "30mA", "11kV".
import { t } from './store.js';
import { breakers } from '../data/breakers.js';
import { glossary } from '../data/glossary.js';
import { markings } from '../data/markings.js';
import { interview } from '../data/interview.js';

const norm = (s) => String(s || '').toLowerCase()
  .replace(/δ/g, 'd').replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}\s.+\-/]/gu, ' ')
  .replace(/(\d)\s+(ma|ka|kv|a|v)\b/g, '$1$2').replace(/\s+/g, ' ').trim();

let index = null;
function build() {
  index = [];
  for (const b of breakers) {
    const hay = norm([b.name, b.fullEn, b.ar, t(b.fullEn), b.keywords.join(' '), b.standards.join(' '), b.arc.join(' '), b.protection.join(' '), b.voltageClass.join(' '),
      b.what.en, b.what.ar, b.tech.en, b.tech.ar, b.markings.map((m) => m.k).join(' ')].join(' '));
    index.push({ type: 'breaker', id: b.id, b, hay, route: `#/breaker/${b.id}` });
  }
  for (const g of glossary) index.push({ type: 'term', id: g.id, g, hay: norm([g.name, g.ar, g.simple.en, g.simple.ar, g.eng.en].join(' ')), route: `#/glossary?term=${g.id}` });
  for (const m of markings) index.push({ type: 'marking', id: m.k, m, hay: norm([m.k, m.d.en, m.d.ar].join(' ')), route: `#/glossary?mark=${encodeURIComponent(m.k)}` });
  for (const q of interview) index.push({ type: 'interview', id: q.id, q, hay: norm([q.q.en, q.q.ar, q.a.en].join(' ')), route: `#/interview?q=${q.id}` });
}

const NUM = /^(\d+(?:\.\d+)?)(ma|ka|kv|a|v)$/;
export function search(raw) {
  if (!index) build();
  const q = norm(raw);
  if (!q) return [];
  const tokens = q.split(' ');
  const res = [];
  const numTok = tokens.map((x) => x.match(NUM)).filter(Boolean)[0];
  for (const it of index) {
    let score = 0;
    const exact = it.type === 'breaker' && (norm(it.b.name) === q || it.id === q);
    if (exact) score += 100;
    // text tokens
    let allIn = true;
    for (const tk of tokens) {
      if (NUM.test(tk)) continue;
      if (it.hay.includes(tk)) score += (it.type === 'breaker' && norm(it.b.name).includes(tk)) ? 10 : 4; else allIn = false;
    }
    const textTokens = tokens.filter((x) => !NUM.test(x));
    if (textTokens.length && !allIn) score = Math.min(score, 0) - 1; // all text tokens must match
    // numeric
    if (numTok && it.type === 'breaker') {
      const v = parseFloat(numTok[1]);
      const u = numTok[2];
      const b = it.b;
      if (u === 'a' && b.rangeA && v >= b.rangeA[0] && v <= b.rangeA[1]) score += 8;
      else if (u === 'kv' && b.rangeKV && v >= b.rangeKV[0] && v <= b.rangeKV[1]) score += 8;
      else if (u === 'v' && b.rangeKV && v / 1000 >= b.rangeKV[0] && v / 1000 <= b.rangeKV[1]) score += 6;
      else if (u === 'ma' && b.protection.includes('residual') && v >= 6 && v <= 1000) score += 8;
      else if (u === 'ka' && it.hay.includes(`${numTok[1]}ka`)) score += 6;
      else if (!textTokens.length) score = 0;
    } else if (numTok && !textTokens.length) {
      score = it.hay.includes(numTok[0]) ? 3 : 0;
    }
    if (score > 0) res.push({ ...it, score });
  }
  return res.sort((a, b) => b.score - a.score).slice(0, 40);
}

export function resultTitle(r) {
  if (r.type === 'breaker') return `${r.b.name} – ${t(r.b.fullEn) || r.b.fullEn}`;
  if (r.type === 'term') return `${r.g.name}${r.g.ar && r.g.ar !== r.g.name ? ' · ' + r.g.ar : ''}`;
  if (r.type === 'marking') return r.m.k;
  return t(r.q.q);
}
export function resultSub(r) {
  if (r.type === 'breaker') return t(r.b.voltageText);
  if (r.type === 'term') return t(r.g.simple);
  if (r.type === 'marking') return t(r.m.d);
  return t(r.q.a);
}
