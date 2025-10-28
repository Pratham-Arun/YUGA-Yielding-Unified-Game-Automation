import { SUPPORTED_LANGUAGES } from './languages.js';

export class CodeGenerator {
  constructor() {
    this.languages = SUPPORTED_LANGUAGES;
    this.contextCache = new Map();
  }

  async generateCode(prompt, language = 'csharp', templateType = null) {
    const lang = this.languages[language];
    if (!lang) {
      throw new Error(`Language ${language} is not supported`);
    }

    // Analyze prompt for context
    const context = await this.analyzeContext(prompt);
    
    // Select template if requested
    let template = '';
    if (templateType && lang.templates[templateType]) {
      template = lang.templates[templateType];
    }

    // Generate code (stub - would connect to real AI service)
    const code = this.generateFromTemplate(template, {
      name: context.name || 'GeneratedCode',
      initialization: '// TODO: Add initialization code',
      update: '// TODO: Add update code',
      methods: '// TODO: Add methods',
      properties: '// TODO: Add properties',
      implementation: '// TODO: Add implementation'
    });

    return {
      language,
      code,
      context
    };
  }

  async analyzeContext(prompt) {
    // Cache check
    if (this.contextCache.has(prompt)) {
      return this.contextCache.get(prompt);
    }

    // Basic context analysis (stub - would use AI for real analysis)
    const context = {
      name: this.extractName(prompt),
      type: this.inferType(prompt),
      requirements: this.extractRequirements(prompt),
      complexity: this.assessComplexity(prompt)
    };

    // Cache the result
    this.contextCache.set(prompt, context);
    return context;
  }

  generateFromTemplate(template, params) {
    if (!template) return '// Generated code will appear here';
    return template.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
  }

  extractName(prompt) {
    const words = prompt.split(' ');
    return words.find(w => /^[A-Z][a-zA-Z]*$/.test(w)) || 'Generated';
  }

  inferType(prompt) {
    if (prompt.toLowerCase().includes('component')) return 'component';
    if (prompt.toLowerCase().includes('data')) return 'scriptableObject';
    if (prompt.toLowerCase().includes('interface')) return 'interface';
    return 'class';
  }

  extractRequirements(prompt) {
    const requirements = [];
    if (prompt.toLowerCase().includes('movement')) requirements.push('Movement');
    if (prompt.toLowerCase().includes('combat')) requirements.push('Combat');
    if (prompt.toLowerCase().includes('inventory')) requirements.push('Inventory');
    return requirements;
  }

  assessComplexity(prompt) {
    const words = prompt.split(' ').length;
    if (words < 10) return 'simple';
    if (words < 20) return 'moderate';
    return 'complex';
  }

  getSupportedLanguages() {
    return Object.entries(this.languages).map(([id, lang]) => ({
      id,
      name: lang.name,
      extension: lang.fileExtension
    }));
  }

  getTemplatesForLanguage(language) {
    return Object.keys(this.languages[language]?.templates || {});
  }
}