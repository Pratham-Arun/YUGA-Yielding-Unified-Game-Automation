import { Scene } from '../core/Scene.js';
import { MeshNode, CameraNode, LightNode } from '../core/Node.js';
import { RendererComponent, TransformComponent } from '../core/Component.js';
import { el, clear } from '../ui/dom.js';
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js?module';

export function Engine({ state }) {
  const el = document.createElement('div');
  el.className = 'h-full grid grid-cols-[280px_1fr_320px] grid-rows-[40px_1fr_160px] gap-2 p-2';
  el.setAttribute('role', 'application');
  el.setAttribute('aria-label', 'Game Engine Editor');

  // Toolbar
  const toolbar = el('div', 'col-span-3 flex items-center gap-2 px-2 glass rounded', [
    el('button', 'px-3 py-1.5 text-sm rounded bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50 transition', '▶ Play'),
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 focus:ring-2 focus:ring-slate-400/50 transition', '⏸ Pause'),
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 focus:ring-2 focus:ring-slate-400/50 transition', '⏹ Stop'),
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 focus:ring-2 focus:ring-slate-400/50 transition', '+ Add Node'),
    el('div', 'ml-auto text-xs text-slate-300', [
      'FPS: ',
      el('span', 'font-mono text-emerald-400', '0')
    ])
  ]);
  
  // Add ids to buttons
  const [playBtn, pauseBtn, stopBtn, addNodeBtn, fpsContainer] = toolbar.children;
  playBtn.id = 'play';
  pauseBtn.id = 'pause';
  stopBtn.id = 'stop';
  addNodeBtn.id = 'addNode';
  fpsContainer.lastChild.id = 'fps';

  // Hierarchy
  const hierarchy = el('div', 'row-span-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '🌳 Hierarchy'),
    el('div', 'p-2 text-sm space-y-1')
  ]);
  hierarchy.setAttribute('role', 'tree');
  hierarchy.setAttribute('aria-label', 'Scene Hierarchy');
  hierarchy.lastChild.id = 'tree';

  // Viewport
  const viewport = el('div', 'row-span-2 border rounded bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden', [
    el('canvas', 'w-full h-full block')
  ]);
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', 'Game Viewport');
  viewport.firstChild.id = 'canvas';

  // Inspector
  const inspector = el('div', 'row-span-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '🔧 Inspector'),
    el('div', 'p-2 text-sm space-y-2')
  ]);
  inspector.setAttribute('role', 'complementary');
  inspector.setAttribute('aria-label', 'Object Inspector');
  inspector.lastChild.id = 'props';

  // Assets
  const assets = el('div', 'col-span-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '📦 Assets'),
    el('div', 'p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2')
  ]);
  assets.lastChild.id = 'assetList';

  // Console
  const consolePanel = el('div', 'border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '📋 Console'),
    el('pre', 'p-2 text-xs text-slate-400 font-mono')
  ]);
  consolePanel.lastChild.id = 'log';

  el.appendChild(toolbar);
  el.appendChild(hierarchy);
  el.appendChild(viewport);
  el.appendChild(inspector);
  el.appendChild(assets);
  el.appendChild(consolePanel);

  // DOM references
  const tree = hierarchy.querySelector('#tree');
  const props = inspector.querySelector('#props');
  const assetList = assets.querySelector('#assetList');
  const log = consolePanel.querySelector('#log');
  const fpsEl = toolbar.querySelector('#fps');
  const canvas = viewport.querySelector('#canvas');

  // Initialize scene
  const scene = new Scene('Main');
  
  // Create default nodes
  const camera = scene.createNode('CameraNode', 'Main Camera');
  camera.transform.position = [5, 5, 5];
  
  const cube = scene.createNode('MeshNode', 'Cube');
  cube.transform.position = [0, 0, 0];
  
  const light = scene.createNode('LightNode', 'Directional Light');
  light.transform.position = [5, 5, 5];

  let selectedNodeId = cube.id;
  let renderer, threeScene, threeCamera, threeCube, threeLight;

  function logMessage(msg) {
    log.textContent += `\n${new Date().toLocaleTimeString()} - ${msg}`;
    log.scrollTop = log.scrollHeight;
  }

  function renderHierarchy() {
    const hierarchy = scene.getHierarchy();
    clear(tree);
    
    const renderNode = (node, depth = 0) => {
      const nodeEl = el('div', 
        `px-2 py-1 rounded cursor-pointer transition ${node.id === selectedNodeId ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700/30'} focus:ring-2 focus:ring-indigo-500/50`,
        `${node.name} (${node.nodeType})`
      );
      nodeEl.style.paddingLeft = (depth * 12 + 8) + 'px';
      nodeEl.setAttribute('role', 'treeitem');
      nodeEl.setAttribute('aria-selected', node.id === selectedNodeId);
      nodeEl.tabIndex = 0;

      const selectNode = () => {
        selectedNodeId = node.id;
        renderHierarchy();
        renderInspector();
      };

      nodeEl.addEventListener('click', selectNode);
      nodeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectNode();
        }
      });
      tree.appendChild(nodeEl);
      
      node.children.forEach(child => renderNode(child, depth + 1));
    };
    
    renderNode(hierarchy);
  }

  function renderInspector() {
    const node = scene.getNode(selectedNodeId);
    if (!node) return;

    // Clear props
    clear(props);

    const title = el('div', 'text-sm font-semibold mb-3 text-slate-100', node.name);
    const type = el('div', 'text-xs text-slate-400 mb-2', `Type: ${node.nodeType}`);
    const container = el('div', 'space-y-3');

    // Transform section
    const transformWrap = el('div');
    const transformLabel = el('div', 'text-xs font-medium text-slate-300 mb-1', 'Transform');
    transformWrap.appendChild(transformLabel);

    ['position', 'rotation', 'scale'].forEach(k => {
      const v = node.transform[k];
      const row = el('div', 'mb-2');
      const lbl = el('label', 'text-xs text-slate-400 mb-1 block', 
        k.charAt(0).toUpperCase() + k.slice(1)
      );
      row.appendChild(lbl);

      const inputs = el('div', 'flex gap-1');

      ['X', 'Y', 'Z'].forEach((axis, i) => {
        const inp = el('input', 'flex-1 px-1 py-0.5 rounded border border-slate-600 bg-slate-800/50 text-slate-100 text-xs');
        inp.type = 'number';
        inp.step = '0.1';
        inp.value = String(v[i]);
        inp.dataset.k = k;
        inp.dataset.i = String(i);
        inp.addEventListener('input', () => {
          const kk = inp.dataset.k;
          const ii = +inp.dataset.i;
          const n = scene.getNode(selectedNodeId);
          n.transform[kk][ii] = parseFloat(inp.value);
          if (threeCube && kk === 'position') threeCube.position.fromArray(n.transform[kk]);
          if (threeCube && kk === 'rotation') threeCube.rotation.set(...n.transform[kk]);
          if (threeCube && kk === 'scale') threeCube.scale.fromArray(n.transform[kk]);
        });
        inputs.appendChild(inp);
      });

      row.appendChild(inputs);
      transformWrap.appendChild(row);
    });

    // Properties section
    const propsWrap = el('div');
    const propsLabel = el('div', 'text-xs font-medium text-slate-300 mb-1', 'Properties');
    propsWrap.appendChild(propsLabel);

    const propsContent = el('div', 'text-xs text-slate-400');
    const entries = Object.entries(node.properties);
    if (entries.length > 0) {
      entries.forEach(([k, v]) => {
        propsContent.appendChild(el('div', null, `${k}: ${v}`));
      });
    } else {
      propsContent.textContent = 'No properties';
    }
    propsWrap.appendChild(propsContent);

    container.appendChild(transformWrap);
    container.appendChild(propsWrap);

    props.appendChild(title);
    props.appendChild(type);
    props.appendChild(container);
  }

  function renderAssets() {
    const assets = [
      { id: 'mat-1', name: 'Default Material', type: 'Material' },
      { id: 'mesh-1', name: 'Cube Mesh', type: 'Mesh' },
      { id: 'mesh-2', name: 'Sphere Mesh', type: 'Mesh' },
      { id: 'tex-1', name: 'Grid Texture', type: 'Texture' },
    ];
    clear(assetList);
    assets.forEach(a => {
      const item = el('div', 'p-2 rounded border border-slate-600/50 bg-slate-800/30 text-xs hover:bg-slate-800/60 transition cursor-pointer', [
        el('div', 'font-medium text-slate-100', a.name),
        el('div', 'text-slate-400 text-xs', a.type)
      ]);
      assetList.appendChild(item);
    });
  }

  function initThree() {
    try {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x0f172a, 1);

      threeScene = new THREE.Scene();
      threeScene.background = new THREE.Color(0x0f172a);

      threeCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      threeCamera.position.set(5, 5, 5);
      threeCamera.lookAt(0, 0, 0);

      // Grid
      const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
      threeScene.add(gridHelper);

      // Axes
      const axesHelper = new THREE.AxesHelper(3);
      threeScene.add(axesHelper);

      // Cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.3,
        roughness: 0.4
      });
      threeCube = new THREE.Mesh(geometry, material);
      threeScene.add(threeCube);

      // Lighting
      threeLight = new THREE.DirectionalLight(0xffffff, 1);
      threeLight.position.set(5, 5, 5);
      threeLight.castShadow = true;
      threeScene.add(threeLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      threeScene.add(ambientLight);

      // Attach OrbitControls
      const controls = new OrbitControls(threeCamera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      logMessage('✅ Three.js initialized');
      animate();
    } catch (err) {
      logMessage('❌ Error: ' + err.message);
    }
  }

  let last = performance.now();
  let frames = 0;

  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    frames++;
    if (now - last >= 1000) {
      fpsEl.textContent = String(frames);
      frames = 0;
      last = now;
    }

    if (renderer && threeScene && threeCamera) {
      renderer.render(threeScene, threeCamera);
    }
  }

  function onResize() {
    if (!renderer || !threeCamera) return;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    renderer.setSize(width, height);
    threeCamera.aspect = width / height;
    threeCamera.updateProjectionMatrix();
  }

  window.addEventListener('resize', onResize);

  // Event handlers
  toolbar.querySelector('#play').addEventListener('click', () => logMessage('▶️ Play'));
  toolbar.querySelector('#pause').addEventListener('click', () => logMessage('⏸️ Pause'));
  toolbar.querySelector('#stop').addEventListener('click', () => logMessage('⏹️ Stop'));
  toolbar.querySelector('#addNode').addEventListener('click', () => {
    const nodeType = prompt('Node type (MeshNode, CameraNode, LightNode, Node3D):', 'MeshNode');
    if (nodeType) {
      const newNode = scene.createNode(nodeType, `New ${nodeType}`);
      logMessage(`✨ Created ${nodeType}`);
      renderHierarchy();
    }
  });

  // Initialize
  renderHierarchy();
  renderInspector();
  renderAssets();
  initThree();

  return el;
}
