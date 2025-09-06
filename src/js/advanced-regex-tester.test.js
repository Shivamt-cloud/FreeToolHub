/**
 * Test file for Advanced Regex Tester
 */

// Test ECMAScript Engine
function testECMAScriptEngine() {
    console.log('=== Testing ECMAScript Engine ===');
    
    const tester = new AdvancedRegexTester();
    
    // Test basic pattern
    const result1 = tester.test('\\d+', { g: true }, 'abc123def456', null, 'ECMAScript');
    console.log('Basic pattern test:', result1.success ? 'PASS' : 'FAIL');
    console.log('Matches found:', result1.matches.length);
    
    // Test with groups
    const result2 = tester.test('(\\d+)-(\\d+)', { g: true }, '123-456 789-012', null, 'ECMAScript');
    console.log('Group pattern test:', result2.success ? 'PASS' : 'FAIL');
    console.log('Matches with groups:', result2.matches.length);
    
    // Test replacement
    const result3 = tester.test('(\\d+)-(\\d+)', { g: true }, '123-456', '$2-$1', 'ECMAScript');
    console.log('Replacement test:', result3.success ? 'PASS' : 'FAIL');
    console.log('Replacement result:', result3.replacement.result);
    
    return result1.success && result2.success && result3.success;
}

// Test PCRE2 Engine
function testPCRE2Engine() {
    console.log('=== Testing PCRE2 Engine ===');
    
    const tester = new AdvancedRegexTester();
    
    // Test basic pattern
    const result1 = tester.test('\\d+', { g: true }, 'abc123def456', null, 'PCRE2');
    console.log('Basic pattern test:', result1.success ? 'PASS' : 'FAIL');
    console.log('Matches found:', result1.matches.length);
    
    return result1.success;
}

// Test .NET Engine
function testDotNetEngine() {
    console.log('=== Testing .NET Engine ===');
    
    const tester = new AdvancedRegexTester();
    
    // Test basic pattern
    const result1 = tester.test('\\d+', { g: true }, 'abc123def456', null, '.NET');
    console.log('Basic pattern test:', result1.success ? 'PASS' : 'FAIL');
    console.log('Matches found:', result1.matches.length);
    
    return result1.success;
}

// Test Pattern Explainer
function testPatternExplainer() {
    console.log('=== Testing Pattern Explainer ===');
    
    const explainer = new PatternExplainer();
    const result = explainer.explain('\\d+', { g: true }, 'ECMAScript');
    
    console.log('Pattern explanation test:', result.success ? 'PASS' : 'FAIL');
    console.log('Explanation:', result.explanation);
    
    return result.success;
}

// Test Match Highlighter
function testMatchHighlighter() {
    console.log('=== Testing Match Highlighter ===');
    
    const highlighter = new MatchHighlighter();
    const matches = [
        { index: 3, length: 3, text: '123' },
        { index: 9, length: 3, text: '456' }
    ];
    
    const spans = highlighter.buildSpans('abc123def456', matches);
    console.log('Highlighting test:', spans.length > 0 ? 'PASS' : 'FAIL');
    console.log('Spans created:', spans.length);
    
    return spans.length > 0;
}

// Test Safety Guard
function testSafetyGuard() {
    console.log('=== Testing Safety Guard ===');
    
    const guard = new SafetyGuard();
    const validation = guard.validatePattern('(.*)*', 'ECMAScript');
    
    console.log('Safety validation test:', validation.warnings.length > 0 ? 'PASS' : 'FAIL');
    console.log('Warnings:', validation.warnings);
    
    return validation.warnings.length > 0;
}

// Test Templates
function testTemplates() {
    console.log('=== Testing Templates ===');
    
    const tester = new AdvancedRegexTester();
    const templates = tester.getTemplates();
    
    console.log('Templates test:', Object.keys(templates).length > 0 ? 'PASS' : 'FAIL');
    console.log('Available templates:', Object.keys(templates));
    
    // Test email template
    const emailTemplate = templates['Email'];
    if (emailTemplate) {
        const result = tester.test(emailTemplate.pattern, emailTemplate.flags, 'test@example.com', null, 'ECMAScript');
        console.log('Email template test:', result.success ? 'PASS' : 'FAIL');
    }
    
    return Object.keys(templates).length > 0;
}

// Test timeout functionality
function testTimeout() {
    console.log('=== Testing Timeout Functionality ===');
    
    const tester = new AdvancedRegexTester();
    
    // Test with a potentially slow pattern
    const result = tester.test('(a+)+', { g: true }, 'aaaaaaaaaaaaaaaaaaaa', null, 'ECMAScript', 50);
    
    console.log('Timeout test:', result.success === false && result.error.includes('Timeout') ? 'PASS' : 'FAIL');
    console.log('Error message:', result.error);
    
    return result.success === false && result.error.includes('Timeout');
}

// Run all tests
function runAllRegexTests() {
    console.log('Starting Advanced Regex Tester Tests...');
    
    const tests = [
        testECMAScriptEngine,
        testPCRE2Engine,
        testDotNetEngine,
        testPatternExplainer,
        testMatchHighlighter,
        testSafetyGuard,
        testTemplates,
        testTimeout
    ];
    
    let passed = 0;
    let total = tests.length;
    
    tests.forEach(test => {
        try {
            if (test()) {
                passed++;
            }
        } catch (error) {
            console.error('Test failed with error:', error);
        }
    });
    
    console.log(`\n=== Test Results ===`);
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);
    
    return passed === total;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.testECMAScriptEngine = testECMAScriptEngine;
    window.testPCRE2Engine = testPCRE2Engine;
    window.testDotNetEngine = testDotNetEngine;
    window.testPatternExplainer = testPatternExplainer;
    window.testMatchHighlighter = testMatchHighlighter;
    window.testSafetyGuard = testSafetyGuard;
    window.testTemplates = testTemplates;
    window.testTimeout = testTimeout;
    window.runAllRegexTests = runAllRegexTests;
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runAllRegexTests();
}
