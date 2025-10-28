import { createRouter, navigate } from './router.js';
import { AppStateProvider } from './state-enhanced.js';
import { Layout } from './ui/Layout.js';
import { Dashboard } from './views/Dashboard.js';
import { Engine } from './views/Engine.js';
import { ScriptEditor } from './views/ScriptEditor.js';
import { AnimationEditor } from './views/AnimationEditor.js';
import { VisualScripting } from './views/VisualScripting.js';
import { AIAssistant } from './views/AIAssistant.js';
import { AssetGenerator } from './views/AssetGenerator.js';
import { NewProject } from './views/NewProject.js';

const routes = [
  { path: '/', component: Dashboard, title: 'Dashboard' },
  { path: '/engine', component: Engine, title: 'Engine' },
  { path: '/script-editor', component: ScriptEditor, title: 'Script Editor' },
  { path: '/animation-editor', component: AnimationEditor, title: 'Animation Editor' },
  { path: '/visual-scripting', component: VisualScripting, title: 'Visual Scripting' },
  { path: '/ai-code-assistant', component: AIAssistant, title: 'AI Code Assistant' },
  { path: '/asset-generator', component: AssetGenerator, title: 'Asset Generator' },
  { path: '/new-project', component: NewProject, title: 'New Project' },
];

const app = document.getElementById('app');

function render(route, state) {
  document.title = `YUGA • ${route?.title || 'Engine'}`;
  app.innerHTML = '';
  app.appendChild(Layout({ route, routes, content: route.component({ state }) }));
}

const { onRouteChange, currentRoute } = createRouter(routes);

AppStateProvider((state) => {
  render(currentRoute(), state);
  const unsubscribeRoute = onRouteChange((route) => render(route, state));

  // Ensure cleanup of router listener and autosave on unload
  window.addEventListener('beforeunload', () => {
    if (typeof unsubscribeRoute === 'function') unsubscribeRoute();
    if (state && typeof state.clearAutoSave === 'function') state.clearAutoSave();
  });
});

// For deep linking when opening via file://, ensure hash routing
if (!location.hash && !sessionStorage.getItem('yuga_initial_routed')) {
  // Only auto-navigate on first boot to avoid overriding deep links
  navigate('/');
  sessionStorage.setItem('yuga_initial_routed', '1');
}
