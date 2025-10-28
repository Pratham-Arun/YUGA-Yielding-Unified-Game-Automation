import { navigate } from '../router.js';

import { el, clear } from '../ui/dom.js';
import { navigate } from '../router.js';

export function Dashboard() {
  const container = el('div', 'h-full overflow-y-auto p-6 space-y-6');
  container.setAttribute('role', 'main');
  container.setAttribute('aria-label', 'Dashboard');

  // Header
  const header = el('div', 'flex items-center justify-between', [
    el('div', '', [
      el('h1', 'text-4xl font-bold gradient-text mb-1', 'Dashboard'),
      el('p', 'text-slate-400', 'Welcome to YUGA Engine - Yielding Unified Game Automation')
    ]),
    el('div', 'flex gap-2', [
      el('a', 'px-4 py-2 rounded gradient-btn text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500/50', 'New Project'),
      el('a', 'px-4 py-2 rounded border border-slate-400/30 hover:bg-slate-400/10 text-sm transition focus:ring-2 focus:ring-slate-400/50', 'Open Engine')
    ])
  ]);

  const [newLink, openLink] = header.lastChild.children;
  newLink.href = '#/new-project';
  openLink.href = '#/engine';
  el.appendChild(header);

  // Feature cards
  const cardsWrap = el('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4');
  cardsWrap.setAttribute('role', 'list');
  cardsWrap.setAttribute('aria-label', 'Feature shortcuts');

  const cards = [
    {t:'Engine', p:'/engine', d:'3D editor, hierarchy, inspector', icon:'🎮'},
    {t:'Script Editor', p:'/script-editor', d:'Code with syntax highlighting', icon:'💻'},
    {t:'Animation', p:'/animation-editor', d:'Timeline and curves', icon:'🎬'},
    {t:'Visual Scripting', p:'/visual-scripting', d:'Node-based logic', icon:'🔗'},
    {t:'AI Assistant', p:'/ai-code-assistant', d:'Prompt-to-code', icon:'🤖'},
    {t:'Asset Generator', p:'/asset-generator', d:'AI art and models', icon:'🎨'},
    {t:'New Project', p:'/new-project', d:'Templates and setup', icon:'🚀'},
  ];
  cards.forEach(c => {
    const card = el('a', 
      'p-4 rounded card-gradient hover:shadow-lg hover:shadow-indigo-500/20 transition group focus:ring-2 focus:ring-indigo-500/50',
      [
        el('div', 'text-2xl mb-2 group-hover:scale-110 transition', c.icon),
        el('div', 'font-semibold text-slate-100', c.t),
        el('div', 'text-sm text-slate-400', c.d)
      ]
    );
    card.href = `#${c.p}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `${c.t}: ${c.d}`);
    cardsWrap.appendChild(card);
  });
  el.appendChild(cardsWrap);

  // Lower panels
  const lower = el('div', 'grid grid-cols-1 lg:grid-cols-3 gap-4');
  lower.setAttribute('role', 'complementary');
  lower.setAttribute('aria-label', 'Dashboard panels');

  const panels = [
    {title:'📊 Recent Projects', body:'Local storage persistence demo.'},
    {title:'⚡ Performance', body:'Real-time stats planned.'},
    {title:'📰 News', body:'Welcome to YUGA MVP v1.0'}
  ];
  panels.forEach(pan => {
    const panel = el('div', 'p-4 rounded card-gradient', [
      el('div', 'font-semibold text-slate-100 mb-2', pan.title),
      el('div', 'text-sm text-slate-400', pan.body)
    ]);
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', pan.title);
    lower.appendChild(panel);
  });
  
  container.append(header, cardsWrap, lower);
  return container;
}
