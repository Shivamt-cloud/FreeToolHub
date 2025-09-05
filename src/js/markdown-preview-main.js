/**
 * Main Markdown Preview System
 * Integrates lexer, parser, renderer, and syntax highlighter
 */

import { MarkdownLexer } from './advanced-markdown-preview.js';
import { MarkdownParser, HTMLRenderer } from './markdown-parser-renderer.js';
import { SyntaxHighlighter } from './markdown-syntax-highlighter.js';

/**
 * Main Markdown Preview System
 */
class MarkdownPreview {
    constructor() {
        this.lexer = new MarkdownLexer();
        this.parser = new MarkdownParser();
        this.renderer = new HTMLRenderer();
        this.lastProcessedText = '';
        this.lastHtmlOutput = '';
        this.debounceDelay = 300; // milliseconds
        this.updateTimer = null;
    }

    generatePreview(markdownText, options = {}) {
        try {
            // Apply options
            if (options.sanitize !== undefined) {
                this.renderer.options.sanitize = options.sanitize;
            }
            
            if (options.targetBlank !== undefined) {
                this.renderer.options.targetBlank = options.targetBlank;
            }
            
            if (options.baseUrl !== undefined) {
                this.renderer.options.baseUrl = options.baseUrl;
            }
            
            // Check if we need to reprocess
            if (markdownText === this.lastProcessedText) {
                return {
                    success: true,
                    html: this.lastHtmlOutput,
                    cached: true
                };
            }
            
            // Process markdown through pipeline
            const tokens = this.lexer.tokenize(markdownText);
            const ast = this.parser.parse(tokens);
            const html = this.renderer.render(ast);
            
            // Add CSS for styling and syntax highlighting
            const styledHtml = this.wrapWithStyles(html, options);
            
            // Cache results
            this.lastProcessedText = markdownText;
            this.lastHtmlOutput = styledHtml;
            
            return {
                success: true,
                html: styledHtml,
                ast: ast,
                tokenCount: tokens.length,
                cached: false
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                html: this.generateErrorHtml(error.message)
            };
        }
    }

    wrapWithStyles(htmlContent, options) {
        const theme = options.theme || 'github';
        
        // Base markdown styles
        let baseCss = `
        <style>
        .markdown-preview {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            padding: 20px;
            background-color: #ffffff;
        }
        
        .markdown-preview h1, .markdown-preview h2, .markdown-preview h3,
        .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
            color: #24292e;
        }
        
        .markdown-preview h1 { 
            font-size: 2em; 
            border-bottom: 1px solid #eaecef; 
            padding-bottom: 0.3em; 
        }
        .markdown-preview h2 { 
            font-size: 1.5em; 
            border-bottom: 1px solid #eaecef; 
            padding-bottom: 0.3em; 
        }
        .markdown-preview h3 { font-size: 1.25em; }
        .markdown-preview h4 { font-size: 1em; }
        .markdown-preview h5 { font-size: 0.875em; }
        .markdown-preview h6 { font-size: 0.85em; color: #6a737d; }
        
        .markdown-preview p { 
            margin-bottom: 16px; 
        }
        
        .markdown-preview pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid #e1e4e8;
        }
        
        .markdown-preview code {
            background-color: rgba(175,184,193,0.2);
            border-radius: 3px;
            font-size: 85%;
            margin: 0;
            padding: 0.2em 0.4em;
            font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
        }
        
        .markdown-preview pre code {
            background-color: transparent;
            border: 0;
            display: inline;
            line-height: inherit;
            margin: 0;
            overflow: visible;
            padding: 0;
            word-wrap: normal;
        }
        
        .markdown-preview blockquote {
            border-left: 4px solid #dfe2e5;
            margin: 0;
            padding: 0 16px;
            color: #6a737d;
        }
        
        .markdown-preview a {
            color: #0366d6;
            text-decoration: none;
        }
        
        .markdown-preview a:hover {
            text-decoration: underline;
        }
        
        .markdown-preview img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
        }
        
        .markdown-preview ul, .markdown-preview ol {
            margin-bottom: 16px;
            padding-left: 2em;
        }
        
        .markdown-preview li {
            margin-bottom: 0.25em;
        }
        
        .markdown-preview hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #e1e4e8;
            border: 0;
        }
        
        .markdown-preview table {
            border-spacing: 0;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        
        .markdown-preview table th,
        .markdown-preview table td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }
        
        .markdown-preview table th {
            font-weight: 600;
            background-color: #f6f8fa;
        }
        `;
        
        // Syntax highlighting CSS
        const syntaxCss = `
        .hljs-keyword { color: #d73a49; font-weight: bold; }
        .hljs-string { color: #032f62; }
        .hljs-comment { color: #6f42c1; font-style: italic; }
        .hljs-number { color: #005cc5; }
        .hljs-function { color: #6f42c1; }
        .hljs-variable { color: #e36209; }
        .hljs-tag { color: #22863a; }
        .hljs-attribute { color: #6f42c1; }
        .hljs-selector { color: #6f42c1; }
        .hljs-property { color: #005cc5; }
        .hljs-value { color: #032f62; }
        .hljs-key { color: #d73a49; }
        .hljs-boolean { color: #005cc5; }
        `;
        
        // Theme-specific overrides
        if (theme === 'dark') {
            baseCss += `
            .markdown-preview {
                background-color: #0d1117;
                color: #c9d1d9;
            }
            .markdown-preview h1, .markdown-preview h2, .markdown-preview h3,
            .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
                color: #f0f6fc;
            }
            .markdown-preview h1, .markdown-preview h2 {
                border-bottom-color: #30363d;
            }
            .markdown-preview pre {
                background-color: #161b22;
                border-color: #30363d;
            }
            .markdown-preview code {
                background-color: rgba(110,118,129,0.4);
            }
            .markdown-preview blockquote {
                border-left-color: #30363d;
                color: #8b949e;
            }
            .markdown-preview a {
                color: #58a6ff;
            }
            .markdown-preview hr {
                background-color: #30363d;
            }
            .markdown-preview table th,
            .markdown-preview table td {
                border-color: #30363d;
            }
            .markdown-preview table th {
                background-color: #161b22;
            }
            `;
        }
        
        return `
        ${baseCss}
        ${syntaxCss}
        </style>
        <div class="markdown-preview">
            ${htmlContent}
        </div>
        `;
    }

    debouncedUpdate(markdownText, callback, options = {}) {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
        
        this.updateTimer = setTimeout(() => {
            this.performUpdate(markdownText, callback, options);
        }, this.debounceDelay);
    }

    performUpdate(markdownText, callback, options) {
        const result = this.generatePreview(markdownText, options);
        callback(result);
        this.updateTimer = null;
    }

    generateErrorHtml(errorMessage) {
        const escapedError = this.renderer.escapeHtml(errorMessage);
        return `
        <div style="color: #d73a49; background: #ffeef0; border: 1px solid #fdaeb7; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <strong>Markdown Parse Error:</strong><br>
            <code>${escapedError}</code>
        </div>
        `;
    }

    // Utility methods
    getSupportedLanguages() {
        return this.renderer.syntaxHighlighter.getSupportedLanguages();
    }

    addLanguageSupport(language, patterns) {
        this.renderer.syntaxHighlighter.addLanguageSupport(language, patterns);
    }

    setOptions(options) {
        Object.assign(this.renderer.options, options);
    }

    clearCache() {
        this.lastProcessedText = '';
        this.lastHtmlOutput = '';
    }

    // Static utility methods
    static createPreview(markdownText, options = {}) {
        const preview = new MarkdownPreview();
        return preview.generatePreview(markdownText, options);
    }

    static getDefaultOptions() {
        return {
            theme: 'github',
            sanitize: true,
            targetBlank: true,
            baseUrl: '',
            syntaxHighlighting: true
        };
    }
}

// Export the main class
export { MarkdownPreview };
