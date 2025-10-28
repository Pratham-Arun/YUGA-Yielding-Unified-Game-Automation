import { el, clear } from '../ui/dom.js';
import { IntelliSense } from '../core/intellisense.js';

export function ScriptEditor({ state }) {
  const container = el('div', 'h-full grid grid-rows-[40px_1fr] grid-cols-[260px_1fr] gap-2 p-2');
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Script Editor');

  const toolbar = el('div', 'col-span-2 flex items-center gap-2 px-2 glass rounded', [
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 focus:ring-2 focus:ring-slate-400/50 transition', '+ New Script'),
    el('button', 'px-3 py-1.5 text-sm rounded gradient-btn text-white font-medium focus:ring-2 focus:ring-indigo-500/50', '💾 Save'),
    el('div', 'ml-auto text-xs text-slate-400', '✨ AI suggestions enabled')
  ]);
  toolbar.firstChild.id = 'new';
  toolbar.children[1].id = 'save';

  const tree = el('div', 'row-start-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '📁 Files'),
    el('div', 'p-2 text-sm space-y-1')
  ]);
  tree.setAttribute('role', 'tree');
  tree.setAttribute('aria-label', 'Script Files');
  tree.lastChild.id = 'list';

  const editorWrap = el('div', 'row-start-2 border rounded glass-dark overflow-hidden flex flex-col', [
    el('div', 'flex gap-2 border-b border-slate-700/50 p-2 text-sm overflow-auto'),
    el('div', 'flex-1')
  ]);
  editorWrap.setAttribute('role', 'main');
  editorWrap.firstChild.id = 'tabs';
  editorWrap.lastChild.id = 'editor';

  el.appendChild(toolbar);
  el.appendChild(tree);
  el.appendChild(editorWrap);

  const list = tree.querySelector('#list');
  const tabs = editorWrap.querySelector('#tabs');
  const editorDiv = editorWrap.querySelector('#editor');

  let files = state.state.scripts.length ? state.state.scripts : [
    { id: 'Player.cs', language: 'csharp', content: `using System;\nclass Player { void Update() { /* TODO */ } }` },
    { id: 'Enemy.cs', language: 'csharp', content: `class Enemy { void Attack() { } }` },
  ];
  let openId = files[0].id;

  function renderList() {
    clear(list);
    files.forEach((f, index) => {
      const item = el('div', 
        `px-2 py-1 rounded cursor-pointer focus:ring-2 focus:ring-indigo-500/50 ${f.id===openId?'bg-slate-100 dark:bg-slate-800':'hover:bg-slate-700/30'}`,
        f.id
      );
      item.dataset.id = f.id;
      item.setAttribute('role', 'treeitem');
      item.setAttribute('aria-selected', f.id === openId);
      item.tabIndex = 0;

      const handleSelect = () => {
        openId = item.dataset.id;
        renderTabs();
        loadEditor();
      };

      item.addEventListener('click', handleSelect);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });

      list.appendChild(item);
    });
  }

  function renderTabs() {
    clear(tabs);
    files.forEach(f => {
      const b = el('button',
        `px-2 py-1 rounded focus:ring-2 focus:ring-indigo-500/50 ${f.id===openId?'bg-slate-200 dark:bg-slate-800':'hover:bg-slate-700/30'}`,
        f.id
      );
      b.dataset.id = f.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', f.id === openId);
      b.addEventListener('click', () => {
        openId = b.dataset.id;
        loadEditor();
        renderTabs();
      });
      tabs.appendChild(b);
    });
  }

  let view = null;
  function loadEditor() {
    clear(editorDiv);
    const ta = el('textarea', 'w-full h-full p-2 font-mono text-sm outline-none bg-slate-800/50 text-slate-100 border-none focus:ring-2 focus:ring-indigo-500/50');
    ta.value = files.find(f=>f.id===openId).content;
    ta.setAttribute('aria-label', `Editing ${openId}`);
    ta.spellcheck = false;
    ta.addEventListener('input', ()=> {
      files.find(f=>f.id===openId).content = ta.value;
    });
    editorDiv.appendChild(ta);
    
    // Initialize IntelliSense
    const intellisense = new IntelliSense(ta, files.find(f=>f.id===openId).language);
    intellisense.attach();
  }

  toolbar.querySelector('#new').addEventListener('click', ()=>{
    const name = prompt('Script name (e.g., NewScript.cs)');
    if (!name) return;
    files.push({ id: name, language: 'csharp', content: '// New script' });
    openId = name;
    renderList(); renderTabs(); loadEditor();
  });

  toolbar.querySelector('#save').addEventListener('click', ()=>{
    state.update(s => ({ ...s, scripts: files }));
    const notification = el('div', 'fixed top-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded shadow-lg', 'Saved to local storage');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  });

  renderList(); renderTabs(); loadEditor();
  return container;
}
