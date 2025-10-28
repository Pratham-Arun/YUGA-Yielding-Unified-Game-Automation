import { el, clear } from '../ui/dom.js';
import { NodeSystem } from '../core/nodes/node-system.js';
import { NODE_TYPES } from '../core/nodes/node-types.js';

export function VisualScripting() {
  // Initialize node system
  const nodeSystem = new NodeSystem();
  const container = el('div', 'h-full grid grid-cols-[1fr_320px] grid-rows-[40px_1fr] gap-2 p-2');
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Visual Scripting Editor');

  const toolbar = el('div', 'col-span-2 flex items-center gap-2 px-2 glass rounded', [
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 focus:ring-2 focus:ring-slate-400/50 transition', '+ Add Node'),
    el('select', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 bg-slate-800', [
      el('option', '', 'Event Nodes'),
      ...Object.values(NODE_TYPES.EVENT).map(n => el('option', '', n.title)),
      el('option', '', 'Function Nodes'),
      ...Object.values(NODE_TYPES.FUNCTION).map(n => el('option', '', n.title)),
      el('option', '', 'Math Nodes'),
      ...Object.values(NODE_TYPES.MATH).map(n => el('option', '', n.title)),
      el('option', '', 'Logic Nodes'),
      ...Object.values(NODE_TYPES.LOGIC).map(n => el('option', '', n.title))
    ]),
    el('button', 'px-3 py-1.5 text-sm rounded gradient-btn text-white font-medium', '▶️ Execute'),
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10', '🔄 Reset'),
    el('div', 'ml-auto flex items-center gap-2', [
      el('span', 'text-xs text-slate-400', 'Real-time Execution:'),
      el('input', 'w-4 h-4', [])
    ])
  ]);
  toolbar.firstChild.id = 'add';

  const canvas = el('div', 'row-start-2 border rounded bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden');
  canvas.setAttribute('role', 'region');
  canvas.setAttribute('aria-label', 'Visual Script Canvas');

  const inspector = el('div', 'row-start-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '🔧 Inspector'),
    el('div', 'p-2 text-sm text-slate-400', 'Select a node.')
  ]);
  inspector.setAttribute('role', 'complementary');
  inspector.setAttribute('aria-label', 'Node Inspector');
  inspector.lastChild.id = 'props';

  el.appendChild(toolbar); el.appendChild(canvas); el.appendChild(inspector);

  let nodes = [
    { id: 'n1', x: 80, y: 60, ...NODE_TYPES.EVENT.START },
    { id: 'n2', x: 340, y: 220, ...NODE_TYPES.FUNCTION.PRINT, inputs: { message: 'Hello World' } }
  ];
  
  // Add initial nodes to system
  nodes.forEach(node => nodeSystem.addNode(node));
  
  // Initialize connection
  nodeSystem.connect('n1', 'trigger', 'n2', 'message');

  function renderNodes() {
    clear(canvas);
    
    // Draw connections first
    const svg = el('svg', 'absolute inset-0 pointer-events-none');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    nodeSystem.connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from.nodeId);
      const toNode = nodes.find(n => n.id === conn.to.nodeId);
      if (fromNode && toNode) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', '#6366f1');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        
        // Calculate path
        const fromX = fromNode.x + 160;
        const fromY = fromNode.y + 30;
        const toX = toNode.x;
        const toY = toNode.y + 30;
        const cp1x = fromX + 50;
        const cp2x = toX - 50;
        
        path.setAttribute('d', `M ${fromX} ${fromY} C ${cp1x} ${fromY}, ${cp2x} ${toY}, ${toX} ${toY}`);
        svg.appendChild(path);
      }
    });
    canvas.appendChild(svg);

    // Then render nodes
    nodes.forEach(n => {
      const nodeState = nodeSystem.getNodeState(n.id);
      const node = el('div', 'absolute bg-white dark:bg-slate-800 text-sm rounded shadow border min-w-[160px] focus:ring-2 focus:ring-indigo-500/50', [
        el('div', `px-2 py-1 border-b font-medium ${nodeState !== null ? 'bg-emerald-500/20' : ''}`, n.title),
        el('div', 'p-2 space-y-2', [
          // Inputs
          ...(n.inputs ? Object.entries(n.inputs).map(([key, value]) => 
            el('div', 'flex items-center gap-2', [
              el('span', 'text-xs text-slate-500', key),
              el('input', 'flex-1 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-700', [])
            ])
          ) : []),
          // Outputs
          ...(n.outputs ? n.outputs.map(output => 
            el('div', 'flex items-center justify-between', [
              el('span', 'text-xs text-slate-500', output),
              el('span', 'text-xs text-emerald-500', nodeState !== null ? '⚡' : '')
            ])
          ) : [])
        ])
      ]);
      node.style.left = n.x + 'px';
      node.style.top = n.y + 'px';
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', `Visual script node: ${n.title}`);
      node.tabIndex = 0;
      
      makeDraggable(node, n);
      canvas.appendChild(node);
    });
  }

  function makeDraggable(el, data) {
    let dragging = false;
    let ox = 0, oy = 0;

    function handleDragStart(e) {
      dragging = true;
      ox = e.offsetX;
      oy = e.offsetY;
      el.style.cursor = 'move';
      el.setAttribute('aria-grabbed', 'true');
    }

    function handleDragEnd() {
      dragging = false;
      el.style.cursor = '';
      el.setAttribute('aria-grabbed', 'false');
    }

    function handleDragMove(e) {
      if (!dragging) return;
      data.x = e.clientX - canvas.getBoundingClientRect().left - ox;
      data.y = e.clientY - canvas.getBoundingClientRect().top - oy;
      el.style.left = data.x + 'px';
      el.style.top = data.y + 'px';
    }

    el.addEventListener('mousedown', handleDragStart);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('mousemove', handleDragMove);

    // Keyboard navigation
    el.addEventListener('keydown', e => {
      const STEP = 10;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          data.x -= STEP;
          el.style.left = data.x + 'px';
          break;
        case 'ArrowRight':
          e.preventDefault();
          data.x += STEP;
          el.style.left = data.x + 'px';
          break;
        case 'ArrowUp':
          e.preventDefault();
          data.y -= STEP;
          el.style.top = data.y + 'px';
          break;
        case 'ArrowDown':
          e.preventDefault();
          data.y += STEP;
          el.style.top = data.y + 'px';
          break;
      }
    });
  }

  // Add node button
  const [addBtn, nodeSelect, executeBtn, resetBtn, realTimeToggle] = toolbar.children;
  
  addBtn.addEventListener('click', () => {
    const selection = nodeSelect.value;
    const nodeType = Object.values(NODE_TYPES)
      .flatMap(category => Object.values(category))
      .find(n => n.title === selection);
      
    if (nodeType) {
      const newNode = {
        id: 'n' + (nodes.length + 1),
        x: 160,
        y: 120,
        ...nodeType,
        inputs: nodeType.inputs ? Object.fromEntries(nodeType.inputs.map(i => [i, ''])) : {}
      };
      nodes.push(newNode);
      nodeSystem.addNode(newNode);
      renderNodes();
    }
  });

  // Execute button
  executeBtn.addEventListener('click', () => {
    nodeSystem.execute('n1').then(() => renderNodes());
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    nodeSystem.clearState();
    renderNodes();
  });

  // Real-time execution toggle
  const toggleCheckbox = realTimeToggle.querySelector('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.addEventListener('change', () => {
    if (toggleCheckbox.checked) {
      // Start real-time execution
      const interval = setInterval(() => {
        if (toggleCheckbox.checked) {
          nodeSystem.execute('n1').then(() => renderNodes());
        } else {
          clearInterval(interval);
        }
      }, 1000 / 30); // 30 FPS
    }
  });

  renderNodes();
  return container;
}
