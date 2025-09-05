/**
 * Advanced Markdown Preview Test Suite
 * Comprehensive tests for all components and functionality
 */

import { MarkdownLexer, MarkdownParser, HTMLRenderer, SyntaxHighlighter, MarkdownPreview } from './markdown-preview-index.js';

// Test runner utility
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async run() {
        console.log('🧪 Running Advanced Markdown Preview Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const runner = new TestRunner();

// MarkdownLexer Tests
runner.test('MarkdownLexer - Initialize', () => {
    const lexer = new MarkdownLexer();
    
    if (!lexer.tokens || !Array.isArray(lexer.tokens)) {
        throw new Error('Tokens should be initialized as array');
    }
    
    if (lexer.position !== 0) {
        throw new Error('Position should start at 0');
    }
});

runner.test('MarkdownLexer - Tokenize simple heading', () => {
    const lexer = new MarkdownLexer();
    const tokens = lexer.tokenize('# Hello World');
    
    if (tokens.length !== 1) {
        throw new Error('Should generate 1 token for simple heading');
    }
    
    if (tokens[0].type !== 'HEADING') {
        throw new Error('Should generate HEADING token');
    }
    
    if (tokens[0].data.level !== 1) {
        throw new Error('Should detect level 1 heading');
    }
    
    if (tokens[0].data.text !== 'Hello World') {
        throw new Error('Should extract heading text correctly');
    }
});

runner.test('MarkdownLexer - Tokenize multiple headings', () => {
    const lexer = new MarkdownLexer();
    const markdown = `# Heading 1
## Heading 2
### Heading 3`;
    
    const tokens = lexer.tokenize(markdown);
    
    if (tokens.length !== 3) {
        throw new Error('Should generate 3 tokens for 3 headings');
    }
    
    const levels = tokens.map(t => t.data.level);
    if (JSON.stringify(levels) !== JSON.stringify([1, 2, 3])) {
        throw new Error('Should detect correct heading levels');
    }
});

runner.test('MarkdownLexer - Tokenize code block', () => {
    const lexer = new MarkdownLexer();
    const markdown = '```javascript\nconsole.log("Hello");\n```';
    
    const tokens = lexer.tokenize(markdown);
    
    if (tokens.length !== 1) {
        throw new Error('Should generate 1 token for code block');
    }
    
    if (tokens[0].type !== 'CODE_BLOCK') {
        throw new Error('Should generate CODE_BLOCK token');
    }
    
    if (tokens[0].data.language !== 'javascript') {
        throw new Error('Should detect language correctly');
    }
    
    if (tokens[0].data.content !== 'console.log("Hello");') {
        throw new Error('Should extract code content correctly');
    }
});

runner.test('MarkdownLexer - Tokenize emphasis', () => {
    const lexer = new MarkdownLexer();
    const markdown = 'This is *italic* and **bold** text.';
    
    const tokens = lexer.tokenize(markdown);
    
    // Should have paragraph with emphasis tokens
    if (tokens.length !== 1) {
        throw new Error('Should generate 1 paragraph token');
    }
    
    if (tokens[0].type !== 'PARAGRAPH') {
        throw new Error('Should generate PARAGRAPH token');
    }
});

runner.test('MarkdownLexer - Tokenize links', () => {
    const lexer = new MarkdownLexer();
    const markdown = '[Google](https://google.com)';
    
    const tokens = lexer.tokenize(markdown);
    
    if (tokens.length !== 1) {
        throw new Error('Should generate 1 paragraph token');
    }
    
    if (tokens[0].type !== 'PARAGRAPH') {
        throw new Error('Should generate PARAGRAPH token');
    }
});

runner.test('MarkdownLexer - Tokenize lists', () => {
    const lexer = new MarkdownLexer();
    const markdown = `- Item 1
- Item 2
- Item 3`;
    
    const tokens = lexer.tokenize(markdown);
    
    if (tokens.length !== 1) {
        throw new Error('Should generate 1 list token');
    }
    
    if (tokens[0].type !== 'LIST') {
        throw new Error('Should generate LIST token');
    }
    
    if (tokens[0].data.items.length !== 3) {
        throw new Error('Should detect 3 list items');
    }
});

// MarkdownParser Tests
runner.test('MarkdownParser - Initialize', () => {
    const parser = new MarkdownParser();
    
    if (!parser.tokens || !Array.isArray(parser.tokens)) {
        throw new Error('Tokens should be initialized as array');
    }
    
    if (parser.current !== 0) {
        throw new Error('Current should start at 0');
    }
});

runner.test('MarkdownParser - Parse simple document', () => {
    const lexer = new MarkdownLexer();
    const parser = new MarkdownParser();
    
    const tokens = lexer.tokenize('# Hello World\n\nThis is a paragraph.');
    const ast = parser.parse(tokens);
    
    if (ast.type !== 'document') {
        throw new Error('Root should be document type');
    }
    
    if (!ast.children || ast.children.length !== 2) {
        throw new Error('Should have 2 children (heading and paragraph)');
    }
    
    if (ast.children[0].type !== 'heading') {
        throw new Error('First child should be heading');
    }
    
    if (ast.children[1].type !== 'paragraph') {
        throw new Error('Second child should be paragraph');
    }
});

runner.test('MarkdownParser - Parse heading with inline content', () => {
    const lexer = new MarkdownLexer();
    const parser = new MarkdownParser();
    
    const tokens = lexer.tokenize('# Hello *World*');
    const ast = parser.parse(tokens);
    
    const heading = ast.children[0];
    if (heading.type !== 'heading') {
        throw new Error('Should be heading type');
    }
    
    if (heading.depth !== 1) {
        throw new Error('Should have depth 1');
    }
    
    if (!heading.children || heading.children.length === 0) {
        throw new Error('Should have children');
    }
});

// HTMLRenderer Tests
runner.test('HTMLRenderer - Initialize', () => {
    const renderer = new HTMLRenderer();
    
    if (!renderer.options) {
        throw new Error('Options should be initialized');
    }
    
    if (!renderer.syntaxHighlighter) {
        throw new Error('Syntax highlighter should be initialized');
    }
});

runner.test('HTMLRenderer - Render simple heading', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'heading',
        depth: 1,
        children: [{
            type: 'text',
            value: 'Hello World'
        }]
    };
    
    const html = renderer.render(ast);
    
    if (!html.includes('<h1')) {
        throw new Error('Should render h1 tag');
    }
    
    if (!html.includes('Hello World')) {
        throw new Error('Should include heading text');
    }
    
    if (!html.includes('id=')) {
        throw new Error('Should generate anchor ID');
    }
});

runner.test('HTMLRenderer - Render paragraph', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'paragraph',
        children: [{
            type: 'text',
            value: 'This is a paragraph.'
        }]
    };
    
    const html = renderer.render(ast);
    
    if (!html.includes('<p>')) {
        throw new Error('Should render p tag');
    }
    
    if (!html.includes('This is a paragraph.')) {
        throw new Error('Should include paragraph text');
    }
});

runner.test('HTMLRenderer - Render emphasis', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'emphasis',
        children: [{
            type: 'text',
            value: 'italic text'
        }]
    };
    
    const html = renderer.render(ast);
    
    if (!html.includes('<em>')) {
        throw new Error('Should render em tag');
    }
    
    if (!html.includes('italic text')) {
        throw new Error('Should include emphasis text');
    }
});

runner.test('HTMLRenderer - Render strong', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'strong',
        children: [{
            type: 'text',
            value: 'bold text'
        }]
    };
    
    const html = renderer.render(ast);
    
    if (!html.includes('<strong>')) {
        throw new Error('Should render strong tag');
    }
    
    if (!html.includes('bold text')) {
        throw new Error('Should include strong text');
    }
});

runner.test('HTMLRenderer - Render link', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'link',
        url: 'https://example.com',
        title: 'Example',
        children: [{
            type: 'text',
            value: 'Click here'
        }]
    };
    
    const html = renderer.render(ast);
    
    if (!html.includes('<a ')) {
        throw new Error('Should render a tag');
    }
    
    if (!html.includes('href="https://example.com"')) {
        throw new Error('Should include href attribute');
    }
    
    if (!html.includes('title="Example"')) {
        throw new Error('Should include title attribute');
    }
    
    if (!html.includes('Click here')) {
        throw new Error('Should include link text');
    }
});

runner.test('HTMLRenderer - Render code block', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'code',
        lang: 'javascript',
        value: 'console.log("Hello");'
    };
    
    const html = renderer.render(ast);
    
    if (!html.includes('<pre>')) {
        throw new Error('Should render pre tag');
    }
    
    if (!html.includes('<code')) {
        throw new Error('Should render code tag');
    }
    
    if (!html.includes('language-javascript')) {
        throw new Error('Should include language class');
    }
    
    if (!html.includes('console.log("Hello");')) {
        throw new Error('Should include code content');
    }
});

runner.test('HTMLRenderer - HTML escaping', () => {
    const renderer = new HTMLRenderer();
    const ast = {
        type: 'text',
        value: '<script>alert("xss")</script>'
    };
    
    const html = renderer.render(ast);
    
    if (html.includes('<script>')) {
        throw new Error('Should escape HTML tags');
    }
    
    if (!html.includes('&lt;script&gt;')) {
        throw new Error('Should properly escape HTML');
    }
});

// SyntaxHighlighter Tests
runner.test('SyntaxHighlighter - Initialize', () => {
    const highlighter = new SyntaxHighlighter();
    
    if (!highlighter.languagePatterns) {
        throw new Error('Language patterns should be initialized');
    }
    
    if (!highlighter.cssClasses) {
        throw new Error('CSS classes should be initialized');
    }
});

runner.test('SyntaxHighlighter - Highlight JavaScript', () => {
    const highlighter = new SyntaxHighlighter();
    const code = 'function hello() { return "world"; }';
    
    const highlighted = highlighter.highlight(code, 'javascript');
    
    if (!highlighted.includes('<span')) {
        throw new Error('Should add highlighting spans');
    }
    
    if (!highlighted.includes('hljs-keyword')) {
        throw new Error('Should highlight keywords');
    }
    
    if (!highlighted.includes('hljs-string')) {
        throw new Error('Should highlight strings');
    }
});

runner.test('SyntaxHighlighter - Highlight Python', () => {
    const highlighter = new SyntaxHighlighter();
    const code = 'def hello():\n    return "world"';
    
    const highlighted = highlighter.highlight(code, 'python');
    
    if (!highlighted.includes('<span')) {
        throw new Error('Should add highlighting spans');
    }
    
    if (!highlighted.includes('hljs-keyword')) {
        throw new Error('Should highlight keywords');
    }
});

runner.test('SyntaxHighlighter - Handle unknown language', () => {
    const highlighter = new SyntaxHighlighter();
    const code = 'some random code';
    
    const highlighted = highlighter.highlight(code, 'unknown');
    
    if (highlighted.includes('<span')) {
        throw new Error('Should not add highlighting for unknown language');
    }
    
    if (!highlighted.includes('some random code')) {
        throw new Error('Should return original code');
    }
});

runner.test('SyntaxHighlighter - Get supported languages', () => {
    const highlighter = new SyntaxHighlighter();
    const languages = highlighter.getSupportedLanguages();
    
    if (!Array.isArray(languages)) {
        throw new Error('Should return array of languages');
    }
    
    if (languages.length === 0) {
        throw new Error('Should have supported languages');
    }
    
    if (!languages.includes('javascript')) {
        throw new Error('Should include JavaScript');
    }
    
    if (!languages.includes('python')) {
        throw new Error('Should include Python');
    }
});

// MarkdownPreview Integration Tests
runner.test('MarkdownPreview - Initialize', () => {
    const preview = new MarkdownPreview();
    
    if (!preview.lexer) {
        throw new Error('Lexer should be initialized');
    }
    
    if (!preview.parser) {
        throw new Error('Parser should be initialized');
    }
    
    if (!preview.renderer) {
        throw new Error('Renderer should be initialized');
    }
});

runner.test('MarkdownPreview - Generate simple preview', () => {
    const preview = new MarkdownPreview();
    const markdown = '# Hello World\n\nThis is a **bold** statement.';
    
    const result = preview.generatePreview(markdown);
    
    if (!result.success) {
        throw new Error('Should generate preview successfully');
    }
    
    if (!result.html) {
        throw new Error('Should return HTML content');
    }
    
    if (!result.html.includes('<h1')) {
        throw new Error('Should render heading');
    }
    
    if (!result.html.includes('<strong>')) {
        throw new Error('Should render bold text');
    }
    
    if (!result.html.includes('Hello World')) {
        throw new Error('Should include heading text');
    }
});

runner.test('MarkdownPreview - Generate preview with code', () => {
    const preview = new MarkdownPreview();
    const markdown = '```javascript\nconsole.log("Hello");\n```';
    
    const result = preview.generatePreview(markdown);
    
    if (!result.success) {
        throw new Error('Should generate preview successfully');
    }
    
    if (!result.html.includes('<pre>')) {
        throw new Error('Should render code block');
    }
    
    if (!result.html.includes('language-javascript')) {
        throw new Error('Should include language class');
    }
});

runner.test('MarkdownPreview - Handle errors gracefully', () => {
    const preview = new MarkdownPreview();
    
    // Test with invalid input that might cause errors
    const result = preview.generatePreview(null);
    
    if (result.success) {
        throw new Error('Should handle errors gracefully');
    }
    
    if (!result.error) {
        throw new Error('Should return error message');
    }
    
    if (!result.html) {
        throw new Error('Should return error HTML');
    }
});

runner.test('MarkdownPreview - Caching works', () => {
    const preview = new MarkdownPreview();
    const markdown = '# Test';
    
    const result1 = preview.generatePreview(markdown);
    const result2 = preview.generatePreview(markdown);
    
    if (!result1.success || !result2.success) {
        throw new Error('Both results should be successful');
    }
    
    if (!result2.cached) {
        throw new Error('Second result should be cached');
    }
    
    if (result1.html !== result2.html) {
        throw new Error('Cached result should be identical');
    }
});

runner.test('MarkdownPreview - Theme support', () => {
    const preview = new MarkdownPreview();
    const markdown = '# Test';
    
    const lightResult = preview.generatePreview(markdown, { theme: 'github' });
    const darkResult = preview.generatePreview(markdown, { theme: 'dark' });
    
    if (!lightResult.success || !darkResult.success) {
        throw new Error('Both themes should work');
    }
    
    if (lightResult.html === darkResult.html) {
        throw new Error('Different themes should produce different HTML');
    }
});

runner.test('MarkdownPreview - Static method', () => {
    const markdown = '# Static Test';
    const result = MarkdownPreview.createPreview(markdown);
    
    if (!result.success) {
        throw new Error('Static method should work');
    }
    
    if (!result.html) {
        throw new Error('Static method should return HTML');
    }
});

runner.test('MarkdownPreview - Get default options', () => {
    const options = MarkdownPreview.getDefaultOptions();
    
    if (!options.theme) {
        throw new Error('Should have default theme');
    }
    
    if (options.sanitize === undefined) {
        throw new Error('Should have sanitize option');
    }
    
    if (options.targetBlank === undefined) {
        throw new Error('Should have targetBlank option');
    }
});

// Integration Tests
runner.test('Integration - Full markdown document', () => {
    const preview = new MarkdownPreview();
    const markdown = `# Main Heading

This is a paragraph with **bold** and *italic* text.

## Subheading

- List item 1
- List item 2
- List item 3

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

[Visit Google](https://google.com)

> This is a blockquote with some text.

---

### Another Heading

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |`;

    const result = preview.generatePreview(markdown);
    
    if (!result.success) {
        throw new Error('Should process full document successfully');
    }
    
    if (!result.html.includes('<h1')) {
        throw new Error('Should render main heading');
    }
    
    if (!result.html.includes('<h2')) {
        throw new Error('Should render subheading');
    }
    
    if (!result.html.includes('<h3')) {
        throw new Error('Should render another heading');
    }
    
    if (!result.html.includes('<ul>')) {
        throw new Error('Should render unordered list');
    }
    
    if (!result.html.includes('<pre>')) {
        throw new Error('Should render code block');
    }
    
    if (!result.html.includes('<a ')) {
        throw new Error('Should render link');
    }
    
    if (!result.html.includes('<blockquote>')) {
        throw new Error('Should render blockquote');
    }
    
    if (!result.html.includes('<hr>')) {
        throw new Error('Should render horizontal rule');
    }
    
    if (!result.html.includes('<table>')) {
        throw new Error('Should render table');
    }
});

runner.test('Integration - Performance test', () => {
    const preview = new MarkdownPreview();
    const markdown = '# Test\n\n'.repeat(100); // Large document
    
    const start = Date.now();
    const result = preview.generatePreview(markdown);
    const duration = Date.now() - start;
    
    if (!result.success) {
        throw new Error('Should handle large documents');
    }
    
    if (duration > 1000) { // 1 second
        throw new Error('Should process large documents quickly');
    }
});

// Run all tests
runner.run().then(success => {
    if (success) {
        console.log('\n🎉 All tests passed! Advanced Markdown Preview is working correctly.');
    } else {
        console.log('\n❌ Some tests failed. Please review the errors above.');
        process.exit(1);
    }
}).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
});
