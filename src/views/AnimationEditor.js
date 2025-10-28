import { el, clear } from '../ui/dom.js';
import { AnimationCurve } from '../core/animation/curves.js';
import { AnimationLayer, AnimationTrack } from '../core/animation/layers.js';

export function AnimationEditor({ state }) {
  const container = el('div', 'h-full grid grid-rows-[40px_1fr_200px] grid-cols-[1fr_360px] gap-2 p-2');
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Animation Editor');

  const toolbar = el('div', 'col-span-2 flex items-center gap-2 px-2 glass rounded', [
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 transition', '+ New Clip'),
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 transition', '+ Add Track'),
    el('button', 'px-3 py-1.5 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 transition', '+ Add Layer'),
    el('div', 'flex items-center gap-2 ml-4', [
      el('button', 'p-1 rounded hover:bg-slate-400/10 transition', '⏮️'),
      el('button', 'p-1 rounded hover:bg-slate-400/10 transition', '⏯️'),
      el('button', 'p-1 rounded hover:bg-slate-400/10 transition', '⏭️'),
      el('span', 'text-sm text-slate-300', 'Frame: '),
      el('input', 'w-16 px-2 py-1 text-sm rounded bg-slate-800 border border-slate-600', [])
    ]),
    el('div', 'ml-auto flex items-center gap-2', [
      el('select', 'px-2 py-1 text-sm rounded bg-slate-800 border border-slate-600', [
        el('option', '', 'Linear'),
        el('option', '', 'Bezier'),
        el('option', '', 'Step')
      ]),
      el('button', 'px-3 py-1.5 text-sm rounded gradient-btn text-white font-medium', 'Apply')
    ])
  ]);

  const viewport = el('div', 'row-start-2 border rounded bg-gradient-to-br from-slate-900 to-slate-950', [
    el('canvas', 'w-full h-full')
  ]);
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', 'Animation Preview');
  viewport.firstChild.id = 'preview';

  const inspector = el('div', 'row-start-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100', '🔧 Properties'),
    el('div', 'p-4 space-y-4', [
      el('div', 'space-y-2', [
        el('label', 'block text-sm text-slate-300', 'Curve Type'),
        el('select', 'w-full px-2 py-1 rounded bg-slate-800 border border-slate-600', [
          el('option', '', 'Linear'),
          el('option', '', 'Bezier'),
          el('option', '', 'Step')
        ])
      ]),
      el('div', 'space-y-2', [
        el('label', 'block text-sm text-slate-300', 'Value'),
        el('input', 'w-full px-2 py-1 rounded bg-slate-800 border border-slate-600', [])
      ]),
      el('div', 'space-y-2', [
        el('label', 'block text-sm text-slate-300', 'Time'),
        el('input', 'w-full px-2 py-1 rounded bg-slate-800 border border-slate-600', [])
      ]),
      el('div', 'pt-2', [
        el('button', 'px-3 py-1.5 text-sm rounded gradient-btn text-white font-medium w-full', 'Update Keyframe')
      ])
    ])
  ]);

  const timeline = el('div', 'col-span-2 border rounded glass-dark overflow-auto scrollbar-thin', [
    el('div', 'p-2 border-b border-slate-700/50 font-semibold text-slate-100 flex items-center justify-between', [
      el('span', '', '⏱️ Timeline'),
      el('div', 'text-xs space-x-2', [
        el('button', 'px-2 py-1 rounded border border-slate-400/30 hover:bg-slate-400/10', 'Zoom In'),
        el('button', 'px-2 py-1 rounded border border-slate-400/30 hover:bg-slate-400/10', 'Zoom Out'),
        el('button', 'px-2 py-1 rounded border border-slate-400/30 hover:bg-slate-400/10', 'Fit'),
      ])
    ]),
    el('div', 'relative', [
      // Layers panel
      el('div', 'absolute left-0 top-0 bottom-0 w-48 border-r border-slate-700/50 bg-slate-800/50', [
        el('div', 'p-2 border-b border-slate-700/50', [
          el('div', 'text-xs text-slate-500', 'Layers')
        ]),
        el('div', 'p-2 space-y-1', [
          el('div', 'flex items-center justify-between p-1 rounded hover:bg-slate-700/30', [
            el('span', 'text-sm', 'Base Layer'),
            el('input', 'w-12 text-xs bg-slate-700 rounded px-1', [])
          ]),
          el('div', 'flex items-center justify-between p-1 rounded hover:bg-slate-700/30', [
            el('span', 'text-sm', 'Upper Body'),
            el('input', 'w-12 text-xs bg-slate-700 rounded px-1', [])
          ])
        ])
      ]),
      // Timeline grid
      el('div', 'ml-48 p-2', [
        el('div', 'grid gap-y-1', [
          // Ruler
          el('div', 'h-6 border-b border-slate-700/50 relative', [
            ...Array(10).fill(0).map((_, i) => 
              el('div', `absolute top-0 bottom-0 border-l border-slate-700/50 flex items-end pb-1`, [
                el('span', 'text-xs text-slate-500', i * 10)
              ])
            )
          ]),
          // Tracks
          ...['Position.X', 'Position.Y', 'Position.Z', 'Rotation.X', 'Rotation.Y', 'Rotation.Z', 'Scale.X', 'Scale.Y', 'Scale.Z'].map(name =>
            el('div', 'flex', [
              el('div', 'w-32 pr-2 text-sm text-slate-400 flex items-center', name),
              el('div', 'flex-1 h-8 bg-slate-800 rounded relative', [])
            ])
          )
        ])
      ])
    ])
  ]);

  container.appendChild(toolbar);
  container.appendChild(viewport);
  container.appendChild(inspector);
  container.appendChild(timeline);

  // Initialize animation data structure
  const animation = {
    layers: [
      new AnimationLayer('Base Layer'),
      new AnimationLayer('Upper Body')
    ],
    currentFrame: 0,
    totalFrames: 100,
    fps: 30,
    isPlaying: false
  };

  // Setup preview canvas
  const canvas = viewport.querySelector('#preview');
  const ctx = canvas.getContext('2d');

  function updatePreview() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Evaluate all visible layers at current frame
    const time = animation.currentFrame / animation.fps;
    animation.layers.forEach(layer => {
      if (layer.visible) {
        const values = layer.evaluate(time);
        if (values) {
          // Draw preview...
        }
      }
    });
  }

  // Setup timeline interactivity
  const timelineContent = timeline.querySelector('.ml-48');
  timelineContent.addEventListener('click', (e) => {
    const bounds = timelineContent.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    animation.currentFrame = Math.floor((x / bounds.width) * animation.totalFrames);
    updatePreview();
  });

  // Setup playback controls
  const [prevFrame, playPause, nextFrame] = toolbar.querySelector('.ml-4').children;
  
  prevFrame.addEventListener('click', () => {
    animation.currentFrame = Math.max(0, animation.currentFrame - 1);
    updatePreview();
  });

  nextFrame.addEventListener('click', () => {
    animation.currentFrame = Math.min(animation.totalFrames - 1, animation.currentFrame + 1);
    updatePreview();
  });

  let playInterval;
  playPause.addEventListener('click', () => {
    animation.isPlaying = !animation.isPlaying;
    if (animation.isPlaying) {
      playInterval = setInterval(() => {
        animation.currentFrame = (animation.currentFrame + 1) % animation.totalFrames;
        updatePreview();
      }, 1000 / animation.fps);
    } else {
      clearInterval(playInterval);
    }
  });

  // Initial render
  updatePreview();
  
  return container;
}
