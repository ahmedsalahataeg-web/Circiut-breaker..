// Minimal hash router with page transitions.
import { clear } from './dom.js';
import { store } from './store.js';

const routes = [];
let current = null;

export function route(pattern, handler) {
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:([a-z]+)/gi, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ rx, keys, handler });
}
export function parse() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path, query: Object.fromEntries(new URLSearchParams(qs || '')) };
}
export function go(path) { location.hash = path; }
export function currentRoute() { return current; }

export function render() {
  const { path, query } = parse();
  const app = document.getElementById('app');
  for (const r of routes) {
    const m = path.match(r.rx);
    if (!m) continue;
    const params = {};
    r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
    current = { path, params, query };
    clear(app);
    const page = r.handler({ params, query, path });
    page.classList.add('page');
    app.append(page);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    document.dispatchEvent(new CustomEvent('route', { detail: current }));
    return;
  }
  location.hash = '#/';
}
export function start() {
  window.addEventListener('hashchange', render);
  store.subscribe((what) => { if (what === 'lang') render(); });
  render();
}
