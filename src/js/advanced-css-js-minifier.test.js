/**
 * Test file for Advanced CSS/JS Minifier
 */

// Test CSS minification
function testCSSMinifier() {
    console.log('=== Testing CSS Minifier ===');
    
    const cssCode = `/* Main styles */
.container {
    background-color: #ffffff;
    margin: 10px 0px 10px 0px;
    padding: 0.0em;
    border: 1px solid #cccccc;
}

.button {
    color: red;
    font-size: 16px;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
    padding: 8px 16px;
}

/* Unused rule */
.unused-class {
    display: none;
}`;

    const minifier = new UnifiedMinifier();
    const result = minifier.minify(cssCode, 'css', {
        removeComments: true,
        removeWhitespace: true,
        optimizeColors: true,
        optimizeValues: true,
        removeEmptyRules: true
    });

    console.log('Original CSS:', cssCode);
    console.log('Minified CSS:', result.minifiedCode);
    console.log('Compression Ratio:', result.compressionRatio + '%');
    console.log('Success:', result.success);
    
    return result;
}

// Test JavaScript minification
function testJSMinifier() {
    console.log('=== Testing JavaScript Minifier ===');
    
    const jsCode = `function calculateTotal(price, tax) {
    var total = 0;
    
    // Add price
    total = total + price;
    
    // Add tax
    if (tax > 0) {
        total = total + (price * tax);
    }
    
    // Unused variable
    var unused = 42;
    
    console.log("Calculating total:", total);
    
    return total;
}

// Unused function
function unusedFunction() {
    return false;
}`;

    const minifier = new UnifiedMinifier();
    const result = minifier.minify(jsCode, 'javascript', {
        mangleNames: true,
        removeDeadCode: true,
        removeConsole: true,
        removeComments: true
    });

    console.log('Original JS:', jsCode);
    console.log('Minified JS:', result.minifiedCode);
    console.log('Compression Ratio:', result.compressionRatio + '%');
    console.log('Success:', result.success);
    
    return result;
}

// Test tokenizer
function testTokenizer() {
    console.log('=== Testing Tokenizer ===');
    
    const cssCode = '.container { color: red; }';
    const tokenizer = new Tokenizer('css');
    const tokens = tokenizer.tokenize(cssCode);
    
    console.log('CSS Tokens:', tokens);
    
    const jsCode = 'function test() { return "hello"; }';
    const jsTokenizer = new Tokenizer('javascript');
    const jsTokens = jsTokenizer.tokenize(jsCode);
    
    console.log('JS Tokens:', jsTokens);
}

// Run all tests
function runAllTests() {
    console.log('Starting Advanced CSS/JS Minifier Tests...');
    
    try {
        testTokenizer();
        testCSSMinifier();
        testJSMinifier();
        console.log('All tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.testCSSMinifier = testCSSMinifier;
    window.testJSMinifier = testJSMinifier;
    window.testTokenizer = testTokenizer;
    window.runAllTests = runAllTests;
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}
