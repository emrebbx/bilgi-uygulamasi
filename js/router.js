window.Router = (() => {
  const routes = new Map();
  let fallback = () => {};
  const normalize = value => (value || '#/home').replace(/^#\/?/, '').replace(/^\//, '') || 'home';
  function add(pattern, handler) { routes.set(pattern, handler); return api; }
  function setFallback(handler) { fallback = handler; return api; }
  function match(path) {
    for (const [pattern, handler] of routes) {
      const keys = [];
      const regex = new RegExp(`^${pattern.replace(/:([^/]+)/g, (_, key) => { keys.push(key); return '([^/]+)'; })}$`);
      const result = path.match(regex);
      if (result) return { handler, params: Object.fromEntries(keys.map((k,i) => [k, result[i+1]])) };
    }
  }
  function resolve() { const path = normalize(location.hash); const found = match(path); found ? found.handler(found.params, path) : fallback(path); window.scrollTo(0,0); }
  function go(path) {
    const target = `#/${normalize(path)}`;
    if (location.hash === target) resolve();
    else location.hash = target;
  }
  function back(fallbackPath='home') { history.length > 2 ? history.back() : go(fallbackPath); }
  function start() { addEventListener('hashchange', resolve); if (!location.hash) history.replaceState(null,'','#/home'); resolve(); }
  const api = { add, setFallback, go, back, start };
  return api;
})();
