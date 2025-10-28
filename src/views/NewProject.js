import { el, clear } from '../ui/dom.js';
import { TemplateGenerator } from '../core/template-generator.js';

export function NewProject({ state }) {
  const templateGen = new TemplateGenerator();
  
  const container = el('div', 'h-full p-4 flex items-center justify-center');
  
  // Main form container
  const formContainer = el('div', 'max-w-4xl w-full glass rounded p-6 grid grid-cols-[2fr_1fr] gap-6');

  // Left side - Main form
  const mainForm = el('div', 'space-y-6', [
    // Header
    el('div', '', [
      el('h1', 'text-3xl font-bold gradient-text mb-2', 'Create New Project'),
      el('p', 'text-slate-400', 'Start your game development journey with YUGA')
    ]),

    // Form fields
    el('div', 'space-y-4', [
      // Project Name
      el('div', 'space-y-2', [
        el('label', 'text-sm font-semibold text-slate-100', 'Project Name'),
        el('input', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 placeholder-slate-500', [])
      ]),

      // Template Selection
      el('div', 'space-y-2', [
        el('label', 'text-sm font-semibold text-slate-100', 'Template'),
        el('select', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100',
          templateGen.getAvailableTemplates().map(t =>
            el('option', '', t.name)
          )
        )
      ]),

      // Features
      el('div', 'space-y-2', [
        el('label', 'text-sm font-semibold text-slate-100', 'AI Generation Options'),
        el('div', 'space-y-2', [
          el('label', 'flex items-center gap-2 text-sm text-slate-300', [
            el('input', 'form-checkbox rounded border-slate-400/30 bg-slate-800/50', []),
            'Generate starter assets'
          ]),
          el('label', 'flex items-center gap-2 text-sm text-slate-300', [
            el('input', 'form-checkbox rounded border-slate-400/30 bg-slate-800/50', []),
            'Generate example scripts'
          ]),
          el('label', 'flex items-center gap-2 text-sm text-slate-300', [
            el('input', 'form-checkbox rounded border-slate-400/30 bg-slate-800/50', []),
            'Generate documentation'
          ])
        ])
      ]),

      // Description
      el('div', 'space-y-2', [
        el('label', 'text-sm font-semibold text-slate-100', 'Project Description (for AI)'),
        el('textarea', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 placeholder-slate-500 h-20 resize-none', [])
      ])
    ]),

    // Buttons
    el('div', 'flex gap-2 pt-2', [
      el('button', 'px-4 py-2 text-sm rounded gradient-btn text-white font-medium', '🚀 Create Project'),
      el('button', 'px-4 py-2 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 transition', '📥 Export JSON'),
      el('label', 'px-4 py-2 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10 transition cursor-pointer', [
        '📤 Import JSON',
        el('input', 'hidden', [])
      ])
    ])
  ]);

  // Right side - Template preview
  const preview = el('div', 'space-y-4', [
    el('div', 'text-sm font-semibold text-slate-100 mb-2', 'Template Preview'),
    el('div', 'space-y-4 text-sm', [])
  ]);

  formContainer.append(mainForm, preview);
  container.appendChild(formContainer);

  // Get form elements
  const [nameInput, templateSelect, , descInput] = mainForm.querySelectorAll('input, select, div, textarea');
  const [createBtn, exportBtn, importLabel] = mainForm.lastChild.children;
  const importInput = importLabel.lastChild;
  importInput.type = 'file';
  importInput.accept = 'application/json';
  
  // Setup template preview
  function updatePreview() {
    const template = templateGen.getTemplateById(
      templateGen.getAvailableTemplates()[templateSelect.selectedIndex].id
    );
    
    if (template) {
      clear(preview.lastChild);
      
      // Features
      preview.lastChild.appendChild(
        el('div', 'rounded bg-slate-800/50 p-3 space-y-2', [
          el('div', 'text-slate-300 font-medium', 'Features'),
          el('div', 'space-y-1', 
            template.features.map(f => 
              el('div', 'text-slate-400 flex items-center gap-2', [
                el('span', 'text-emerald-500', '✓'),
                f
              ])
            )
          )
        ])
      );

      // Structure
      preview.lastChild.appendChild(
        el('div', 'rounded bg-slate-800/50 p-3 space-y-2', [
          el('div', 'text-slate-300 font-medium', 'Project Structure'),
          el('div', 'space-y-1 font-mono text-xs', [
            el('div', 'text-slate-400', 'Scenes/'),
            ...template.scenes.map(s => 
              el('div', 'text-slate-400 pl-4', `└─ ${s}`)
            ),
            el('div', 'text-slate-400 mt-1', 'Assets/'),
            ...Object.entries(template.defaultAssets).map(([category, items]) => [
              el('div', 'text-slate-400 pl-4', `└─ ${category}/`),
              ...items.map(item =>
                el('div', 'text-slate-400 pl-8', `└─ ${item}`)
              )
            ]).flat()
          ])
        ])
      );
    }
  }

  // Initialize preview
  updatePreview();
  templateSelect.addEventListener('change', updatePreview);

  // Create project handler
  createBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim() || 'Untitled';
    const templateId = templateGen.getAvailableTemplates()[templateSelect.selectedIndex].id;
    const description = descInput.value.trim();
    const [generateAssets, generateScripts, generateDocs] = 
      mainForm.querySelectorAll('input[type="checkbox"]');

    try {
      createBtn.disabled = true;
      createBtn.textContent = '⌛ Creating...';

      const project = await templateGen.generateProject(templateId, {
        name,
        description,
        generateAssets: generateAssets.checked,
        generateScripts: generateScripts.checked,
        generateDocs: generateDocs.checked
      });

      // Update state
      state.update(s => ({
        ...s,
        project: {
          name: project.name,
          template: project.template,
          createdAt: project.createdAt
        },
        scenes: project.scenes,
        scripts: project.scripts,
        assets: project.assets
      }));

      // Show success message
      const notification = el('div', 'fixed top-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded shadow-lg', 'Project created successfully');
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

    } catch (error) {
      console.error(error);
      alert('Failed to create project: ' + error.message);
    } finally {
      createBtn.disabled = false;
      createBtn.textContent = '🚀 Create Project';
    }
  });

  // Export handler
  exportBtn.addEventListener('click', () => {
    const data = {
      Project: state.state.project,
      Scene: state.state.scenes,
      Asset: state.state.assets,
      Script: state.state.scripts,
      Animation: state.state.animations,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'YUGA_Export.json';
    a.click();
  });

  // Import handler
  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        state.update(s => ({
          ...s,
          project: data.Project || s.project,
          scenes: data.Scene || s.scenes,
          assets: data.Asset || s.assets,
          scripts: data.Script || s.scripts,
          animations: data.Animation || s.animations,
        }));
        
        const notification = el('div', 'fixed top-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded shadow-lg', 'Project imported successfully');
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } catch (error) {
        console.error(error);
        alert('Invalid project file');
      }
    };
    reader.readAsText(file);
  });

  return container;
}
