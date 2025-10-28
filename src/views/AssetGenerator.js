import { el, clear } from '../ui/dom.js';
import { AssetGenerator as Generator } from '../core/asset-generator.js';

export function AssetGenerator() {
  const generator = new Generator();
  
  const container = el('div', 'h-full p-4 grid grid-rows-[auto_1fr] gap-4');
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Asset Generator');

  const form = el('div', 'glass rounded p-4 space-y-4', [
    // Main controls
    el('div', 'grid grid-cols-1 md:grid-cols-2 gap-4', [
      // Left column - Main inputs
      el('div', 'space-y-4', [
        // Prompt input
        el('div', 'space-y-2', [
          el('label', 'text-sm text-slate-400', 'Asset Description'),
          el('textarea', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 placeholder-slate-500 h-20 resize-none', [])
        ]),
        // Asset type
        el('div', 'space-y-2', [
          el('label', 'text-sm text-slate-400', 'Asset Type'),
          el('select', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 text-sm',
            generator.getAssetTypes().map(type =>
              el('option', '', type.name)
            )
          )
        ])
      ]),
      // Right column - Style settings
      el('div', 'space-y-4', [
        // Art style
        el('div', 'space-y-2', [
          el('label', 'text-sm text-slate-400', 'Art Style'),
          el('select', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 text-sm',
            generator.getSupportedStyles().map(style =>
              el('option', '', style.name)
            )
          )
        ]),
        // Quality settings
        el('div', 'space-y-2', [
          el('label', 'text-sm text-slate-400', 'Quality'),
          el('select', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 text-sm',
            generator.getQualitySettings().map(quality =>
              el('option', '', `${quality.name} (${quality.resolution}px)`)
            )
          )
        ])
      ])
    ]),
    // Action buttons
    el('div', 'flex justify-end gap-2', [
      el('button', 'px-4 py-2 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10', '💾 Save Settings'),
      el('button', 'px-4 py-2 text-sm rounded gradient-btn text-white font-medium', '✨ Generate')
    ])
  ]);

  const out = el('div', 'glass rounded p-4 overflow-auto scrollbar-thin space-y-4', [
    // Header with queue info
    el('div', 'flex items-center justify-between', [
      el('div', 'text-sm text-slate-400', 'Generated Assets'),
      el('div', 'text-xs text-slate-500', 'Queue: 0 active, 0 pending')
    ]),
    // Asset grid
    el('div', 'grid grid-cols-2 md:grid-cols-4 gap-4', []),
    // Task queue
    el('div', 'space-y-2', [
      el('div', 'text-sm text-slate-400 mb-2', 'Generation Queue'),
      el('div', 'space-y-2', [])
    ])
  ]);

  container.append(form, out);

  const [prompt, typeSelect, styleSelect, qualitySelect] = form.getElementsByTagName('select');
  const [saveBtn, genBtn] = form.lastChild.children;
  const grid = out.children[1];
  const queue = out.lastChild.lastChild;

  // Generate button handler
  genBtn.addEventListener('click', async () => {
    const description = form.querySelector('textarea').value.trim();
    if (!description) return;

    const settings = {
      type: generator.getAssetTypes()[typeSelect.selectedIndex].id,
      style: generator.getSupportedStyles()[styleSelect.selectedIndex].id,
      quality: generator.getQualitySettings()[qualitySelect.selectedIndex].id
    };

    try {
      genBtn.disabled = true;
      const task = await generator.generateAsset(description, settings);
      
      // Add task to queue display
      const taskEl = el('div', 'p-2 rounded bg-slate-800/50 text-sm', [
        el('div', 'flex items-center justify-between', [
          el('div', 'text-slate-300', description),
          el('div', 'text-xs text-slate-500', 'Processing...')
        ]),
        el('div', 'mt-2 h-1 rounded-full bg-slate-700', [
          el('div', 'h-full rounded-full bg-indigo-500 transition-all duration-200', [])
        ])
      ]);
      
      const progressBar = taskEl.lastChild.firstChild;
      queue.appendChild(taskEl);

      // Update progress
      const updateProgress = setInterval(() => {
        const status = generator.getTaskStatus(task.id);
        if (status) {
          progressBar.style.width = `${status.progress}%`;
          if (status.status === 'completed') {
            clearInterval(updateProgress);
            taskEl.remove();
            
            // Add to grid
            const asset = el('div', 'aspect-square rounded border border-slate-400/30 bg-slate-800 p-2 space-y-2', [
              el('div', 'h-full rounded bg-slate-900 flex items-center justify-center', [
                el('img', 'max-w-full max-h-full', [])
              ]),
              el('div', 'text-xs text-slate-400 truncate', description)
            ]);
            asset.firstChild.firstChild.src = status.result.preview;
            grid.appendChild(asset);
          } else if (status.status === 'failed') {
            clearInterval(updateProgress);
            taskEl.firstChild.lastChild.textContent = 'Failed: ' + status.error;
            taskEl.firstChild.lastChild.className = 'text-xs text-red-500';
            setTimeout(() => taskEl.remove(), 5000);
          }
        }
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      genBtn.disabled = false;
    }
  });

  // Save settings button handler
  saveBtn.addEventListener('click', () => {
    const settings = {
      type: typeSelect.value,
      style: styleSelect.value,
      quality: qualitySelect.value
    };
    localStorage.setItem('assetGeneratorSettings', JSON.stringify(settings));
    
    const notification = el('div', 'fixed top-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded shadow-lg', 'Settings saved');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  });

  // Load saved settings
  try {
    const saved = JSON.parse(localStorage.getItem('assetGeneratorSettings'));
    if (saved) {
      typeSelect.value = saved.type;
      styleSelect.value = saved.style;
      qualitySelect.value = saved.quality;
    }
  } catch (error) {
    console.error('Failed to load saved settings:', error);
  }

  return container;
}
