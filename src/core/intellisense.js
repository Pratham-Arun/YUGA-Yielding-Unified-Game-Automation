// AI-powered code suggestions and IntelliSense provider
import { el } from '../ui/dom.js';

const LANGUAGE_DEFINITIONS = {
  csharp: {
    keywords: ['abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'void', 'volatile', 'while'],
    commonSnippets: [
      { label: 'class', snippet: 'class ${1:Name}\n{\n    ${0}\n}' },
      { label: 'ctor', snippet: 'public ${1:Name}()\n{\n    ${0}\n}' },
      { label: 'prop', snippet: 'public ${1:int} ${2:PropertyName} { get; set; }${0}' },
      { label: 'method', snippet: 'public ${1:void} ${2:MethodName}(${3:params})\n{\n    ${0}\n}' }
    ]
  }
};

export class IntelliSense {
  constructor(editor, language = 'csharp') {
    this.editor = editor;
    this.language = language;
    this.definitions = LANGUAGE_DEFINITIONS[language];
    this.suggestionBox = null;
    this.currentSuggestions = [];
    this.selectedIndex = 0;
  }

  attach() {
    this.editor.addEventListener('input', () => this.onInput());
    this.editor.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  onInput() {
    const pos = this.editor.selectionStart;
    const text = this.editor.value;
    const wordStart = text.lastIndexOf(' ', pos - 1) + 1;
    const currentWord = text.slice(wordStart, pos).toLowerCase();

    if (currentWord.length < 2) {
      this.hideSuggestions();
      return;
    }

    this.showSuggestions(currentWord, this.editor.getBoundingClientRect());
  }

  onKeyDown(e) {
    if (!this.suggestionBox) return;

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentSuggestions.length - 1);
        this.updateSelection();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateSelection();
        break;
      case 'Enter':
      case 'Tab':
        if (this.currentSuggestions.length) {
          e.preventDefault();
          this.applySuggestion(this.currentSuggestions[this.selectedIndex]);
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  showSuggestions(word, editorRect) {
    this.currentSuggestions = [
      ...this.definitions.keywords.filter(k => k.startsWith(word)),
      ...this.definitions.commonSnippets.filter(s => s.label.startsWith(word))
    ];

    if (!this.currentSuggestions.length) {
      this.hideSuggestions();
      return;
    }

    if (!this.suggestionBox) {
      this.suggestionBox = el('div', 'fixed bg-slate-800 border border-slate-600 rounded shadow-xl overflow-hidden z-50 w-64');
      document.body.appendChild(this.suggestionBox);
    }

    this.selectedIndex = 0;
    this.renderSuggestions(editorRect);
  }

  renderSuggestions(editorRect) {
    if (!this.suggestionBox) return;

    const lineHeight = parseInt(getComputedStyle(this.editor).lineHeight);
    const lines = this.editor.value.substr(0, this.editor.selectionStart).split('\n');
    const currentLine = lines.length;
    
    const top = editorRect.top + (currentLine * lineHeight);
    const left = editorRect.left + 40; // Approximate character width offset

    this.suggestionBox.style.top = `${top}px`;
    this.suggestionBox.style.left = `${left}px`;
    
    this.suggestionBox.innerHTML = '';
    this.currentSuggestions.forEach((suggestion, i) => {
      const item = el('div', 
        `px-2 py-1 cursor-pointer ${i === this.selectedIndex ? 'bg-indigo-500 text-white' : 'hover:bg-slate-700'}`,
        suggestion.label || suggestion
      );
      item.addEventListener('click', () => this.applySuggestion(suggestion));
      this.suggestionBox.appendChild(item);
    });
  }

  applySuggestion(suggestion) {
    const pos = this.editor.selectionStart;
    const text = this.editor.value;
    const wordStart = text.lastIndexOf(' ', pos - 1) + 1;
    const before = text.slice(0, wordStart);
    const after = text.slice(pos);
    const insert = suggestion.snippet || suggestion;

    this.editor.value = before + insert + after;
    this.editor.selectionStart = this.editor.selectionEnd = wordStart + insert.length;
    this.hideSuggestions();

    // Trigger editor's input event to save changes
    this.editor.dispatchEvent(new Event('input'));
  }

  hideSuggestions() {
    if (this.suggestionBox) {
      this.suggestionBox.remove();
      this.suggestionBox = null;
    }
  }

  updateSelection() {
    Array.from(this.suggestionBox.children).forEach((item, i) => {
      if (i === this.selectedIndex) {
        item.classList.add('bg-indigo-500', 'text-white');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-indigo-500', 'text-white');
      }
    });
  }
}