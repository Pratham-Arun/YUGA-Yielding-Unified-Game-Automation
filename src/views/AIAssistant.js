import { el, clear } from '../ui/dom.js';
import { CodeGenerator } from '../core/code-generator.js';

export function AIAssistant() {
  const generator = new CodeGenerator();
  const container = el('div', 'h-full p-4 grid grid-rows-[auto_1fr] gap-4');
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'AI Assistant');

  const form = el('div', 'glass rounded p-4 space-y-4');
  
  // Language and template selection
  const controls = el('div', 'flex gap-4', [
    el('div', 'flex-1 space-y-2', [
      el('label', 'text-sm text-slate-400', 'Programming Language'),
      el('select', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100', 
        generator.getSupportedLanguages().map(lang =>
          el('option', '', lang.name)
        )
      )
    ]),
    el('div', 'flex-1 space-y-2', [
      el('label', 'text-sm text-slate-400', 'Template'),
      el('select', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100',
        generator.getTemplatesForLanguage('csharp').map(template =>
          el('option', '', template)
        )
      )
    ])
  ]);

  // Prompt input
  const inputWrap = el('div', 'flex gap-2', [
    el('div', 'flex-1 space-y-2', [
      el('label', 'text-sm text-slate-400', 'Describe Your Code'),
      el('textarea', 'w-full px-3 py-2 rounded border border-slate-400/30 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 h-20 resize-none', [])
    ])
  ]);
  
  const input = inputWrap.querySelector('textarea');
  input.id = 'prompt';
  input.placeholder = 'Describe the functionality you want (e.g., "Create an NPC that follows the player when nearby and attacks within range")';
  input.setAttribute('aria-label', 'AI prompt input');

  // Generate button
  const buttonWrap = el('div', 'flex justify-end gap-2', [
    el('button', 'px-4 py-2 text-sm rounded border border-slate-400/30 hover:bg-slate-400/10', '💾 Save to Templates'),
    el('button', 'px-4 py-2 text-sm rounded gradient-btn text-white font-medium focus:ring-2 focus:ring-indigo-500/50', '✨ Generate')
  ]);
  
  const [saveBtn, genBtn] = buttonWrap.children;
  genBtn.id = 'gen';

  form.append(controls, inputWrap, buttonWrap);

  const out = el('div', 'glass rounded p-4 overflow-auto scrollbar-thin space-y-4', [
    el('div', 'flex items-center justify-between', [
      el('div', 'text-sm text-slate-400', 'Generated Code'),
      el('div', 'flex gap-2', [
        el('button', 'px-3 py-1 text-xs rounded border border-slate-400/30 hover:bg-slate-400/10', '📋 Copy'),
        el('button', 'px-3 py-1 text-xs rounded border border-slate-400/30 hover:bg-slate-400/10', '📥 Download')
      ])
    ]),
    el('pre', 'text-xs text-slate-300 font-mono p-4 bg-slate-800/50 rounded'),
    el('div', 'text-sm text-slate-400', [
      el('div', 'font-medium mb-1', 'Context Analysis'),
      el('div', 'space-y-1 text-xs', [])
    ])
  ]);
  out.setAttribute('role', 'region');
  out.setAttribute('aria-label', 'Generated code output');
  out.lastChild.id = 'result';

  container.append(form, out);

  // Add keyboard support
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      genBtn.click();
    }
  });

  // Update templates when language changes
  const [langSelect, templateSelect] = form.firstChild.getElementsByTagName('select');
  langSelect.addEventListener('change', () => {
    const templates = generator.getTemplatesForLanguage(langSelect.value);
    clear(templateSelect);
    templates.forEach(template => {
      templateSelect.appendChild(el('option', '', template));
    });
  });

  // Generate button handler
  genBtn.addEventListener('click', async () => {
    const prompt = input.value.trim();
    if (!prompt) return;
    
    const language = langSelect.value;
    const template = templateSelect.value;
    
    try {
      genBtn.disabled = true;
      genBtn.textContent = '⌛ Generating...';
      
      const result = await generator.generateCode(prompt, language, template);
      
      // Update code display
      const codeEl = out.children[1];
      codeEl.textContent = result.code;
      
      // Update context analysis
      const contextEl = out.lastChild.lastChild;
      clear(contextEl);
      contextEl.appendChild(el('div', 'text-slate-400', `Name: ${result.context.name}`));
      contextEl.appendChild(el('div', 'text-slate-400', `Type: ${result.context.type}`));
      contextEl.appendChild(el('div', 'text-slate-400', `Complexity: ${result.context.complexity}`));
      if (result.context.requirements.length) {
        contextEl.appendChild(el('div', 'text-slate-400', 
          `Requirements: ${result.context.requirements.join(', ')}`
        ));
      }
      
      // Setup copy button
      const [copyBtn, downloadBtn] = out.firstChild.lastChild.children;
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(result.code);
        copyBtn.textContent = '✅ Copied';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
      };
      
      // Setup download button
      downloadBtn.onclick = () => {
        const blob = new Blob([result.code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.context.name}${SUPPORTED_LANGUAGES[language].fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
      };
      
      // Announce to screen readers
      const status = el('div', 'sr-only', 'Code generated successfully');
      status.setAttribute('role', 'status');
      container.appendChild(status);
      setTimeout(() => status.remove(), 1000);
    } catch (error) {
      console.error(error);
      const errorEl = el('div', 'text-red-500 text-sm', error.message);
      out.insertBefore(errorEl, out.firstChild);
      setTimeout(() => errorEl.remove(), 5000);
    } finally {
      genBtn.disabled = false;
      genBtn.textContent = '✨ Generate';
    }
  });

  // Save template button handler
  saveBtn.addEventListener('click', () => {
    const name = prompt('Enter template name:');
    if (!name) return;
    
    // TODO: Implement template saving
    const notification = el('div', 'fixed top-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded shadow-lg', 'Template saved');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  });

  return container;
}
