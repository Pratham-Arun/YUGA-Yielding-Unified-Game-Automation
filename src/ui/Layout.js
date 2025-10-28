import { navigate } from '../router.js';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'layout-dashboard' },
  { path: '/engine', label: 'Engine', icon: 'box' },
  { path: '/script-editor', label: 'Script Editor', icon: 'code-2' },
  { path: '/animation-editor', label: 'Animation', icon: 'clapperboard' },
  { path: '/visual-scripting', label: 'Visual Scripting', icon: 'workflow' },
  { path: '/ai-code-assistant', label: 'AI Assistant', icon: 'bot' },
  { path: '/asset-generator', label: 'Asset Generator', icon: 'shapes' },
  { path: '/new-project', label: 'New Project', icon: 'plus-square' },
];

import { el, clear } from './dom.js';
export function Layout({ route, routes, content }) {
  const container = el('div', 'h-screen grid grid-cols-[260px_1fr] grid-rows-[56px_1fr]');
  container.setAttribute('role', 'application');

  const top = el('div', 'col-span-2 flex items-center justify-between px-4 glass border-b');
  
  // left branding
  const branding = el('div', 'flex items-center gap-3 py-2', [
    el('img', 'w-10 h-10 rounded-full', []),
    el('div', '', [
      el('div', 'gradient-text font-bold text-lg', 'YUGA Engine'),
      el('div', 'text-xs text-slate-300', 'Yielding Unified Game Automation')
    ])
  ]);
  branding.firstChild.src = 'https://i.ibb.co/SXq1Z7Mj/Untitled-design.png';
  branding.firstChild.alt = 'YUGA';

  // right controls
  const topControls = el('div', 'flex items-center gap-2', [
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 focus:ring-2 focus:ring-slate-400/50 transition', '🌙 Theme'),
    el('a', 'px-3 py-1.5 text-sm rounded gradient-btn text-white font-medium focus:ring-2 focus:ring-indigo-500/50', '📊 Dashboard')
  ]);
  
  topControls.firstChild.id = 'themeToggle';
  topControls.firstChild.setAttribute('aria-label', 'Toggle theme');
  topControls.lastChild.href = '#/';

  top.append(branding, topControls);

  const side = el('aside', 'row-span-1 col-start-1 row-start-2 border-r border-slate-700/50 glass-dark overflow-y-auto scrollbar-thin', [
    el('nav', 'p-2 space-y-1')
  ]);
  side.setAttribute('aria-label', 'Main Navigation');

  const nav = side.firstChild;
  nav.setAttribute('role', 'navigation');

  navItems.forEach(item => {
    const navItem = el('a', 
      `flex items-center gap-3 px-3 py-2 rounded transition ${route.path===item.path ? 'nav-item-active' : 'hover:bg-slate-700/20'} focus:ring-2 focus:ring-indigo-500/50`,
      [
        el('span', 'w-4 h-4'),
        el('span', 'text-sm', item.label)
      ]
    );
    
    navItem.href = `#${item.path}`;
    navItem.dataset.path = item.path;
    navItem.firstChild.dataset.icon = item.icon;
    
    // Accessibility
    navItem.setAttribute('role', 'link');
    navItem.setAttribute('aria-label', item.label);
    if (route.path === item.path) {
      navItem.setAttribute('aria-current', 'page');
    }
    
    nav.appendChild(navItem);
  });

  const main = el('main', 'row-start-2 col-start-2 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900');
  main.setAttribute('role', 'main');
  main.appendChild(content);

  container.append(top, side, main);

  // Theme toggle with accessibility improvements
  const themeBtn = top.querySelector('#themeToggle');
  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    themeBtn.setAttribute('aria-pressed', isDark);
    
    // Announce theme change to screen readers
    const status = el('div', 'sr-only', `Theme changed to ${isDark ? 'dark' : 'light'} mode`);
    status.setAttribute('role', 'status');
    container.appendChild(status);
    setTimeout(() => status.remove(), 1000);
  });

  return container;
}
