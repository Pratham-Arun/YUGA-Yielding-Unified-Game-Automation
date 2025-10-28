export function createRouter(routes) {
  const routeMap = new Map(routes.map(r => [r.path, r]));
  const listeners = new Set();
  let windowListenerAdded = false;

  function parseHash() {
    const path = location.hash.replace('#', '') || '/';
    return routeMap.get(path) || routeMap.get('/');
  }

  function currentRoute() {
    return parseHash();
  }

  function onRouteChange(cb) {
    listeners.add(cb);
    // ensure single window listener
    if (!windowListenerAdded) {
      windowListenerAdded = true;
      window.addEventListener('hashchange', () => {
        const route = parseHash();
        listeners.forEach(l => l(route));
      });
    }
    // return unsubscribe function
    return () => listeners.delete(cb);
  }

  return { onRouteChange, currentRoute };
}

export function navigate(path) {
  if (!path.startsWith('/')) path = '/' + path;
  location.hash = path;
}
