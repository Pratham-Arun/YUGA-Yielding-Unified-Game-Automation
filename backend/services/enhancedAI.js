import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ProjectAnalyzer from './projectAnalyzer.js';

/**
 * Enhanced AI Service
 * Provides context-aware code generation, explanation, and multi-file support
 */
class EnhancedAI {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
    this.anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
    this.google = process.env.GOOGLE_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) : null;
  }

  /**
   * Generate code with project context
   */
  async generateWithContext(options) {
    const {
      prompt,
      model,
      language,
      projectPath,
      includeTests = false,
      multiFile = false
    } = options;

    // Analyze project if path provided
    let context = null;
    if (projectPath) {
      const analyzer = new ProjectAnalyzer(projectPath);
      await analyzer.analyze();
      context = analyzer.getContextSummary();
    }

    // Build enhanced prompt
    const enhancedPrompt = this.buildEnhancedPrompt({
      prompt,
      language,
      context,
      includeTests,
      multiFile
    });

    // Generate with selected AI
    const result = await this.generate(model, enhancedPrompt, language);

    // Parse response
    return this.parseResponse(result, { includeTests, multiFile });
  }

  /**
   * Build enhanced prompt with context
   */
  buildEnhancedPrompt(options) {
    const { prompt, language, context, includeTests, multiFile } = options;

    const languageMap = {
      'csharp': 'C# for Unity',
      'cpp': 'C++ for Unreal Engine or game development',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python'
    };

    const languageContext = languageMap[language] || language;

    let enhancedPrompt = `You are an expert game developer specializing in ${languageContext}.

`;

    // Add project context if available
    if (context) {
      enhancedPrompt += `PROJECT CONTEXT:
- Total Classes: ${context.totalClasses}
- Total Functions: ${context.totalFunctions}
- Frameworks: ${context.frameworks.join(', ') || 'None detected'}
- Naming Convention: ${context.style.namingConvention}
- Existing Classes: ${context.existingClasses.join(', ')}
- Common Imports: ${context.commonImports.join(', ')}

`;
    }

    enhancedPrompt += `REQUIREMENTS:
1. Generate clean, well-commented ${languageContext} code
2. Follow ${context?.style.namingConvention || 'standard'} naming conventions
3. Include proper error handling
4. Add inline documentation
5. Follow game development best practices
${includeTests ? '6. Include unit tests\n' : ''}${multiFile ? '7. Generate multiple related files if needed\n' : ''}
USER REQUEST:
${prompt}

`;

    if (multiFile) {
      enhancedPrompt += `
FORMAT YOUR RESPONSE AS JSON:
{
  "files": [
    {
      "name": "FileName.ext",
      "content": "file content here",
      "description": "what this file does"
    }
  ],
  "explanation": "overall explanation"
}
`;
    } else {
      enhancedPrompt += `
Return ONLY the code, no markdown formatting, no explanations outside the code comments.
`;
    }

    return enhancedPrompt;
  }

  /**
   * Generate code using selected AI model
   */
  async generate(model, prompt, language) {
    if (model?.includes('gpt')) {
      return await this.generateWithOpenAI(model, prompt);
    } else if (model?.includes('claude')) {
      return await this.generateWithClaude(model, prompt);
    } else if (model?.includes('gemini')) {
      return await this.generateWithGemini(model, prompt);
    } else {
      throw new Error('Unsupported AI model');
    }
  }

  /**
   * Generate with OpenAI
   */
  async generateWithOpenAI(model, prompt) {
    if (!this.openai) throw new Error('OpenAI API key not configured');

    const completion = await this.openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert game development AI assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    return completion.choices[0].message.content;
  }

  /**
   * Generate with Claude
   */
  async generateWithClaude(model, prompt) {
    if (!this.anthropic) throw new Error('Anthropic API key not configured');

    const message = await this.anthropic.messages.create({
      model: model || 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    return message.content[0].text;
  }

  /**
   * Generate with Gemini
   */
  async generateWithGemini(model, prompt) {
    if (!this.google) throw new Error('Google API key not configured');

    const geminiModel = this.google.getGenerativeModel({ 
      model: model || 'gemini-1.5-pro' 
    });

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Parse AI response
   */
  parseResponse(response, options) {
    const { includeTests, multiFile } = options;

    // Try to parse as JSON for multi-file
    if (multiFile) {
      try {
        // Extract JSON from markdown code blocks if present
        let jsonStr = response;
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1];
        }

        const parsed = JSON.parse(jsonStr);
        return {
          files: parsed.files || [],
          explanation: parsed.explanation || ''
        };
      } catch (error) {
        // Fallback: treat as single file
        return {
          files: [{
            name: 'GeneratedCode.cs',
            content: this.cleanCode(response),
            description: 'Generated code'
          }],
          explanation: 'Code generated successfully'
        };
      }
    }

    // Single file response
    return {
      code: this.cleanCode(response),
      explanation: 'Code generated successfully'
    };
  }

  /**
   * Clean code from markdown formatting
   */
  cleanCode(code) {
    // Remove markdown code blocks
    code = code.replace(/```[a-z]*\n?/g, '');
    code = code.trim();
    return code;
  }

  /**
   * Explain existing code
   */
  async explainCode(code, language, model = 'gpt-4') {
    const prompt = `Explain this ${language} game development code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. **Overview**: What does this code do?
2. **Key Components**: Explain each major part
3. **Best Practices**: What's done well?
4. **Improvements**: What could be better?
5. **Usage**: How to use this code?

Format your response in markdown.`;

    const explanation = await this.generate(model, prompt, language);
    return explanation;
  }

  /**
   * Refactor code with suggestions
   */
  async refactorCode(code, language, model = 'gpt-4') {
    const prompt = `Refactor this ${language} game code following best practices:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Refactored code with improvements
2. List of changes made
3. Explanation of why each change improves the code

Return as JSON:
{
  "refactoredCode": "improved code here",
  "changes": ["change 1", "change 2"],
  "explanation": "overall explanation"
}`;

    const result = await this.generate(model, prompt, language);
    
    try {
      const parsed = JSON.parse(this.cleanCode(result));
      return parsed;
    } catch (error) {
      return {
        refactoredCode: this.cleanCode(result),
        changes: [],
        explanation: 'Code refactored'
      };
    }
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(code, language, model = 'gpt-4') {
    const prompt = `Generate comprehensive documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Summary
2. Class/Function descriptions
3. Parameters and return values
4. Usage examples
5. Notes and warnings

Format as markdown.`;

    const docs = await this.generate(model, prompt, language);
    return docs;
  }

  /**
   * Generate unit tests
   */
  async generateTests(code, language, model = 'gpt-4') {
    const testFrameworks = {
      'csharp': 'NUnit',
      'cpp': 'Google Test',
      'javascript': 'Jest',
      'typescript': 'Jest',
      'python': 'pytest'
    };

    const framework = testFrameworks[language] || 'standard testing framework';

    const prompt = `Generate unit tests for this ${language} code using ${framework}:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Test setup
2. Test cases for main functionality
3. Edge case tests
4. Error handling tests

Return complete test file.`;

    const tests = await this.generate(model, prompt, language);
    return this.cleanCode(tests);
  }
}

export default EnhancedAI;
