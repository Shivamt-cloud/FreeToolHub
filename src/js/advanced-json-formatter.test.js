/**
 * Advanced JSON Formatter Test Suite
 * Comprehensive tests for all JSON processing operations
 */

import { 
    AdvancedJSONProcessor, 
    JSONTokenizer, 
    JSONParser, 
    JSONFormatter, 
    JSONMinifier, 
    JSONSyntaxHighlighter,
    JSONUtils,
    JSONSyntaxError 
} from './advanced-json-formatter.js';

/**
 * Test runner and utilities
 */
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }
    
    async runTests() {
        console.log('🧪 Running Advanced JSON Formatter Tests...\n');
        
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

/**
 * JSON Tokenizer Tests
 */
runner.addTest('JSON Tokenizer - Basic Structure', () => {
    const tokenizer = new JSONTokenizer();
    const tokens = tokenizer.tokenize('{"name":"John","age":30}');
    
    const expectedTypes = ['LEFT_BRACE', 'STRING', 'COLON', 'STRING', 'COMMA', 'STRING', 'COLON', 'NUMBER', 'RIGHT_BRACE', 'EOF'];
    const actualTypes = tokens.map(t => t.type);
    
    if (JSON.stringify(actualTypes) !== JSON.stringify(expectedTypes)) {
        throw new Error(`Expected token types ${expectedTypes}, got ${actualTypes}`);
    }
});

runner.addTest('JSON Tokenizer - String Escaping', () => {
    const tokenizer = new JSONTokenizer();
    const tokens = tokenizer.tokenize('"Hello\\nWorld\\"Test"');
    
    const stringToken = tokens.find(t => t.type === 'STRING');
    if (!stringToken || stringToken.value !== '"Hello\\nWorld\\"Test"') {
        throw new Error('String escaping not handled correctly');
    }
});

runner.addTest('JSON Tokenizer - Number Parsing', () => {
    const tokenizer = new JSONTokenizer();
    const tokens = tokenizer.tokenize('123.45e-2');
    
    const numberToken = tokens.find(t => t.type === 'NUMBER');
    if (!numberToken || numberToken.value !== '123.45e-2') {
        throw new Error('Number parsing not handled correctly');
    }
});

runner.addTest('JSON Tokenizer - Position Tracking', () => {
    const tokenizer = new JSONTokenizer();
    const tokens = tokenizer.tokenize('{\n  "key": "value"\n}');
    
    const keyToken = tokens.find(t => t.value === '"key"');
    if (!keyToken || keyToken.line !== 2 || keyToken.column !== 3) {
        throw new Error('Position tracking not working correctly');
    }
});

runner.addTest('JSON Tokenizer - Error Handling', () => {
    const tokenizer = new JSONTokenizer();
    const tokens = tokenizer.tokenize('{"incomplete": "string');
    
    const invalidToken = tokens.find(t => t.type === 'INVALID');
    if (!invalidToken || !invalidToken.error) {
        throw new Error('Error handling not working correctly');
    }
});

/**
 * JSON Parser Tests
 */
runner.addTest('JSON Parser - Valid Object', () => {
    const tokenizer = new JSONTokenizer();
    const parser = new JSONParser();
    
    const tokens = tokenizer.tokenize('{"name":"John","age":30}');
    const result = parser.parse(tokens);
    
    if (!result.success || result.value.name !== 'John' || result.value.age !== 30) {
        throw new Error('Valid object parsing failed');
    }
});

runner.addTest('JSON Parser - Valid Array', () => {
    const tokenizer = new JSONTokenizer();
    const parser = new JSONParser();
    
    const tokens = tokenizer.tokenize('[1,2,3,"test"]');
    const result = parser.parse(tokens);
    
    if (!result.success || !Array.isArray(result.value) || result.value.length !== 4) {
        throw new Error('Valid array parsing failed');
    }
});

runner.addTest('JSON Parser - Nested Structure', () => {
    const tokenizer = new JSONTokenizer();
    const parser = new JSONParser();
    
    const tokens = tokenizer.tokenize('{"users":[{"name":"John","active":true}]}');
    const result = parser.parse(tokens);
    
    if (!result.success || !result.value.users || !Array.isArray(result.value.users)) {
        throw new Error('Nested structure parsing failed');
    }
});

runner.addTest('JSON Parser - Error Detection', () => {
    const tokenizer = new JSONTokenizer();
    const parser = new JSONParser();
    
    const tokens = tokenizer.tokenize('{"name":"John",}'); // Trailing comma
    const result = parser.parse(tokens);
    
    if (result.success || result.errors.length === 0) {
        throw new Error('Error detection not working correctly');
    }
});

runner.addTest('JSON Parser - Empty Structures', () => {
    const tokenizer = new JSONTokenizer();
    const parser = new JSONParser();
    
    const tokens = tokenizer.tokenize('{"empty":{},"array":[]}');
    const result = parser.parse(tokens);
    
    if (!result.success || Object.keys(result.value.empty).length !== 0 || result.value.array.length !== 0) {
        throw new Error('Empty structures parsing failed');
    }
});

/**
 * JSON Formatter Tests
 */
runner.addTest('JSON Formatter - Basic Formatting', () => {
    const formatter = new JSONFormatter();
    const result = formatter.format('{"name":"John","age":30}', { max_line_length: 20 });
    
    if (!result.success || !result.formatted.includes('\n')) {
        throw new Error('Basic formatting failed');
    }
});

runner.addTest('JSON Formatter - Custom Indentation', () => {
    const formatter = new JSONFormatter();
    const result = formatter.format('{"name":"John","age":30}', { indent_size: 4, max_line_length: 20 });
    
    if (!result.success || !result.formatted.includes('    ')) {
        throw new Error('Custom indentation failed');
    }
});

runner.addTest('JSON Formatter - Key Sorting', () => {
    const formatter = new JSONFormatter();
    const result = formatter.format('{"z":"last","a":"first"}', { sort_keys: true });
    
    if (!result.success || result.formatted.indexOf('"a"') > result.formatted.indexOf('"z"')) {
        throw new Error('Key sorting failed');
    }
});

runner.addTest('JSON Formatter - Inline Small Objects', () => {
    const formatter = new JSONFormatter();
    const result = formatter.format('{"a":1}', { max_line_length: 15 });
    
    if (!result.success || result.formatted.includes('\n')) {
        throw new Error('Inline formatting failed');
    }
});

runner.addTest('JSON Formatter - String Escaping', () => {
    const formatter = new JSONFormatter();
    const result = formatter.format({ "test": "line1\nline2" });
    
    if (!result.success || !result.formatted.includes('\\n')) {
        throw new Error('String escaping in formatting failed');
    }
});

/**
 * JSON Minifier Tests
 */
runner.addTest('JSON Minifier - Basic Minification', () => {
    const minifier = new JSONMinifier();
    const result = minifier.minify('{\n  "name": "John",\n  "age": 30\n}');
    
    if (!result.success || result.minified.includes('\n') || result.minified.includes(' ')) {
        throw new Error('Basic minification failed');
    }
});

runner.addTest('JSON Minifier - Compression Ratio', () => {
    const minifier = new JSONMinifier();
    const result = minifier.minify('{\n  "name": "John",\n  "age": 30\n}');
    
    if (!result.success || typeof result.compression_ratio !== 'number' || result.compression_ratio <= 0) {
        throw new Error('Compression ratio calculation failed');
    }
});

runner.addTest('JSON Minifier - Complex Structure', () => {
    const minifier = new JSONMinifier();
    const complexJson = '{\n  "users": [\n    {\n      "name": "John",\n      "active": true\n    }\n  ]\n}';
    const result = minifier.minify(complexJson);
    
    if (!result.success || result.minified.length >= complexJson.length) {
        throw new Error('Complex structure minification failed');
    }
});

runner.addTest('JSON Minifier - Error Handling', () => {
    const minifier = new JSONMinifier();
    const result = minifier.minify('{"invalid": json}');
    
    if (result.success) {
        throw new Error('Error handling in minifier failed');
    }
});

/**
 * JSON Syntax Highlighter Tests
 */
runner.addTest('JSON Syntax Highlighter - Basic Highlighting', () => {
    const highlighter = new JSONSyntaxHighlighter();
    const result = highlighter.highlightHtml('{"name":"John"}');
    
    if (!result.includes('<span') || !result.includes('style=')) {
        throw new Error('Basic syntax highlighting failed');
    }
});

runner.addTest('JSON Syntax Highlighter - Color Classes', () => {
    const highlighter = new JSONSyntaxHighlighter();
    const result = highlighter.highlightHtml('{"string":"value","number":123}');
    
    if (!result.includes('class="string"') || !result.includes('class="number"')) {
        throw new Error('Color class assignment failed');
    }
});

runner.addTest('JSON Syntax Highlighter - HTML Escaping', () => {
    const highlighter = new JSONSyntaxHighlighter();
    const result = highlighter.highlightHtml('{"html":"<script>alert(1)</script>"}');
    
    if (result.includes('<script>') || !result.includes('&lt;')) {
        throw new Error('HTML escaping failed');
    }
});

/**
 * Advanced JSON Processor Tests
 */
runner.addTest('Advanced JSON Processor - Format Operation', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{"name":"John"}', 'format');
    
    if (!result.success || result.operation !== 'format') {
        throw new Error('Format operation failed');
    }
});

runner.addTest('Advanced JSON Processor - Minify Operation', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{\n  "name": "John"\n}', 'minify');
    
    if (!result.success || result.operation !== 'minify' || !result.metadata.compression_ratio) {
        throw new Error('Minify operation failed');
    }
});

runner.addTest('Advanced JSON Processor - Validate Operation', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{"valid": true}', 'validate');
    
    if (!result.success || result.operation !== 'validate' || !result.metadata.token_count) {
        throw new Error('Validate operation failed');
    }
});

runner.addTest('Advanced JSON Processor - Highlight Operation', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{"test": "value"}', 'highlight');
    
    if (!result.success || result.operation !== 'highlight' || !result.output.includes('<span')) {
        throw new Error('Highlight operation failed');
    }
});

runner.addTest('Advanced JSON Processor - Error Handling', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{"invalid": json}', 'format');
    
    if (result.success || result.errors.length === 0) {
        throw new Error('Error handling in processor failed');
    }
});

/**
 * JSON Utils Tests
 */
runner.addTest('JSON Utils - Validate JSON String', () => {
    const validResult = JSONUtils.validateJsonString('{"valid": true}');
    const invalidResult = JSONUtils.validateJsonString('{"invalid": json}');
    
    if (!validResult.success || invalidResult.success) {
        throw new Error('JSON validation utility failed');
    }
});

runner.addTest('JSON Utils - Get JSON Stats', () => {
    const stats = JSONUtils.getJsonStats('{"name":"John","age":30}');
    
    if (!stats.total_tokens || stats.string_tokens !== 3 || stats.number_tokens !== 1) {
        throw new Error('JSON stats calculation failed');
    }
});

runner.addTest('JSON Utils - Format with Options', () => {
    const result = JSONUtils.formatJsonWithOptions('{"name":"John","age":30}', { indent_size: 4, max_line_length: 20 });
    
    if (!result.success || !result.output.includes('    ')) {
        throw new Error('Format with options utility failed');
    }
});

runner.addTest('JSON Utils - Minify JSON', () => {
    const result = JSONUtils.minifyJson('{\n  "name": "John"\n}');
    
    if (!result.success || result.output.includes('\n')) {
        throw new Error('Minify JSON utility failed');
    }
});

runner.addTest('JSON Utils - Highlight JSON', () => {
    const result = JSONUtils.highlightJson('{"test": "value"}');
    
    if (!result.success || !result.output.includes('<span')) {
        throw new Error('Highlight JSON utility failed');
    }
});

/**
 * Edge Cases and Error Handling Tests
 */
runner.addTest('Edge Case - Empty JSON', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('', 'validate');
    
    if (result.success) {
        throw new Error('Empty JSON should be invalid');
    }
});

runner.addTest('Edge Case - Whitespace Only', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('   \n\t  ', 'validate');
    
    if (result.success) {
        throw new Error('Whitespace-only JSON should be invalid');
    }
});

runner.addTest('Edge Case - Large Numbers', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{"large": 1.7976931348623157e+308}', 'format');
    
    if (!result.success) {
        throw new Error('Large number handling failed');
    }
});

runner.addTest('Edge Case - Unicode Characters', () => {
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson('{"unicode": "🚀🌟💫"}', 'format');
    
    if (!result.success) {
        throw new Error('Unicode character handling failed');
    }
});

runner.addTest('Edge Case - Deep Nesting', () => {
    const deepJson = '{"level1":{"level2":{"level3":{"level4":{"level5":"deep"}}}}}';
    const processor = new AdvancedJSONProcessor();
    const result = processor.processJson(deepJson, 'format');
    
    if (!result.success) {
        throw new Error('Deep nesting handling failed');
    }
});

/**
 * Performance Tests
 */
runner.addTest('Performance - Large JSON Processing', () => {
    const largeJson = JSON.stringify({
        users: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            active: i % 2 === 0
        }))
    });
    
    const processor = new AdvancedJSONProcessor();
    const startTime = performance.now();
    const result = processor.processJson(largeJson, 'format');
    const endTime = performance.now();
    
    if (!result.success || (endTime - startTime) > 1000) { // Should complete within 1 second
        throw new Error('Large JSON processing performance test failed');
    }
});

/**
 * Integration Tests
 */
runner.addTest('Integration - Format then Minify', () => {
    const processor = new AdvancedJSONProcessor();
    const original = '{"name":"John","age":30}';
    
    const formatted = processor.processJson(original, 'format');
    const minified = processor.processJson(formatted.output, 'minify');
    
    if (!formatted.success || !minified.success) {
        throw new Error('Format then minify integration failed');
    }
});

runner.addTest('Integration - Validate then Format', () => {
    const processor = new AdvancedJSONProcessor();
    const validJson = '{"name":"John","age":30}';
    
    const validated = processor.processJson(validJson, 'validate');
    const formatted = processor.processJson(validated.success ? validJson : '', 'format');
    
    if (!validated.success || !formatted.success) {
        throw new Error('Validate then format integration failed');
    }
});

/**
 * Run all tests
 */
async function runAllTests() {
    try {
        const success = await runner.runTests();
        if (success) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log('\n❌ Some tests failed!');
        }
        return success;
    } catch (error) {
        console.error('Test runner error:', error);
        return false;
    }
}

// Export for use in other modules
export { runAllTests, TestRunner };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runAllTests();
}
