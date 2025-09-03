/**
 * Test Suite for Advanced Calculator
 * Tests the comprehensive calculator with Pratt parsing, AST evaluation, complex numbers, and numerical methods
 */

// Test runner function
function runCalculatorTests() {
    console.log('🧮 Running Advanced Calculator Tests...\n');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    // Test 1: Basic calculator creation
    test('Basic calculator creation', () => {
        const calc = new AdvancedCalculator();
        assert(calc !== null, 'Calculator should be created');
        assert(calc.mode === 'radians', 'Default mode should be radians');
        assert(calc.complexMode === false, 'Complex mode should be disabled by default');
    }, results);

    // Test 2: Complex number creation
    test('Complex number creation', () => {
        const z = new Complex(3, 4);
        assert(z.real === 3, 'Real part should be 3');
        assert(z.imaginary === 4, 'Imaginary part should be 4');
        assert(z.magnitude() === 5, 'Magnitude should be 5');
    }, results);

    // Test 3: Complex arithmetic
    test('Complex arithmetic operations', () => {
        const a = new Complex(1, 2);
        const b = new Complex(3, 4);
        
        const sum = a.add(b);
        assert(sum.real === 4, 'Real part of sum should be 4');
        assert(sum.imaginary === 6, 'Imaginary part of sum should be 6');
        
        const product = a.multiply(b);
        assert(product.real === -5, 'Real part of product should be -5');
        assert(product.imaginary === 10, 'Imaginary part of product should be 10');
    }, results);

    // Test 4: Basic expression evaluation
    test('Basic expression evaluation', () => {
        const calc = new AdvancedCalculator();
        const result = calc.evalExpr('2 + 3 * 4');
        assert(result === 14, '2 + 3 * 4 should equal 14 (precedence)');
    }, results);

    // Test 5: Function evaluation
    test('Function evaluation', () => {
        const calc = new AdvancedCalculator();
        const result = calc.evalExpr('sin(pi/2)');
        assert(Math.abs(result - 1) < 1e-10, 'sin(pi/2) should equal 1');
    }, results);

    // Test 6: Complex expression evaluation
    test('Complex expression evaluation', () => {
        const calc = new AdvancedCalculator();
        calc.setComplexMode(true);
        const result = calc.evalExpr('sqrt(-4)');
        assert(result instanceof Complex, 'Result should be complex');
        assert(result.real === 0, 'Real part should be 0');
        assert(result.imaginary === 2, 'Imaginary part should be 2');
    }, results);

    // Test 7: Angle mode switching
    test('Angle mode switching', () => {
        const calc = new AdvancedCalculator();
        
        calc.setMode('degrees');
        const degreesResult = calc.evalExpr('sin(90)');
        assert(Math.abs(degreesResult - 1) < 1e-10, 'sin(90°) should equal 1');
        
        calc.setMode('radians');
        const radiansResult = calc.evalExpr('sin(pi/2)');
        assert(Math.abs(radiansResult - 1) < 1e-10, 'sin(π/2) should equal 1');
    }, results);

    // Test 8: Memory operations
    test('Memory operations', () => {
        const calc = new AdvancedCalculator();
        
        calc.storeMemory('test', 42);
        const recalled = calc.recallMemory('test');
        assert(recalled === 42, 'Stored value should be recalled correctly');
        
        calc.clearMemory('test');
        const cleared = calc.recallMemory('test');
        assert(cleared === 0, 'Cleared memory should return 0');
    }, results);

    // Test 9: Variable management
    test('Variable management', () => {
        const calc = new AdvancedCalculator();
        
        calc.setVariable('x', 5);
        const result = calc.evalExpr('x * 2');
        assert(result === 10, 'Variable x should be evaluated correctly');
        
        calc.clearVariables();
        try {
            calc.evalExpr('x * 2');
            assert(false, 'Should throw error for undefined variable');
        } catch (error) {
            assert(error.message.includes('Undefined variable'), 'Should throw appropriate error');
        }
    }, results);

    // Test 10: Advanced functions
    test('Advanced mathematical functions', () => {
        const calc = new AdvancedCalculator();
        
        // Test factorial
        const factorial = calc.evalExpr('factorial(5)');
        assert(factorial === 120, '5! should equal 120');
        
        // Test power
        const power = calc.evalExpr('2^8');
        assert(power === 256, '2^8 should equal 256');
        
        // Test absolute value
        const abs = calc.evalExpr('abs(-42)');
        assert(abs === 42, 'abs(-42) should equal 42');
    }, results);

    // Test 11: Expression validation
    test('Expression validation', () => {
        const calc = new AdvancedCalculator();
        
        const valid = calc.validateExpression('2 + 3 * 4');
        assert(valid.isValid, 'Valid expression should pass validation');
        
        const invalid = calc.validateExpression('2 + * 4');
        assert(!invalid.isValid, 'Invalid expression should fail validation');
    }, results);

    // Test 12: Error handling
    test('Error handling', () => {
        const calc = new AdvancedCalculator();
        
        try {
            calc.evalExpr('1 / 0');
            assert(false, 'Division by zero should throw error');
        } catch (error) {
            assert(error.message.includes('Division by zero'), 'Should throw appropriate error');
        }
        
        try {
            calc.evalExpr('sqrt(-1)');
            assert(false, 'sqrt(-1) should throw error in real mode');
        } catch (error) {
            assert(error.message.includes('Square root of negative number'), 'Should throw appropriate error');
        }
    }, results);

    // Test 13: Complex mode error handling
    test('Complex mode error handling', () => {
        const calc = new AdvancedCalculator();
        calc.setComplexMode(true);
        
        const result = calc.evalExpr('sqrt(-1)');
        assert(result instanceof Complex, 'sqrt(-1) should return complex number in complex mode');
        assert(result.real === 0, 'Real part should be 0');
        assert(result.imaginary === 1, 'Imaginary part should be 1');
    }, results);

    // Test 14: History functionality
    test('History functionality', () => {
        const calc = new AdvancedCalculator();
        
        calc.evalExpr('2 + 2');
        calc.evalExpr('3 * 4');
        
        const history = calc.getHistory();
        assert(history.length === 2, 'Should have 2 history entries');
        assert(history[0].expression === '2 + 2', 'First expression should be recorded');
        assert(history[1].expression === '3 * 4', 'Second expression should be recorded');
        
        calc.clearHistory();
        assert(calc.getHistory().length === 0, 'History should be cleared');
    }, results);

    // Test 15: Precision settings
    test('Precision settings', () => {
        const calc = new AdvancedCalculator();
        
        calc.setPrecision(32);
        assert(calc.getPrecision() === 32, 'Precision should be set to 32');
        
        calc.setPrecision(64);
        assert(calc.getPrecision() === 64, 'Precision should be set to 64');
    }, results);

    // Test 16: Available functions
    test('Available functions', () => {
        const calc = new AdvancedCalculator();
        
        const functions = calc.getAvailableFunctions();
        assert(functions.includes('sin'), 'sin should be available');
        assert(functions.includes('cos'), 'cos should be available');
        assert(functions.includes('sqrt'), 'sqrt should be available');
        assert(functions.includes('factorial'), 'factorial should be available');
    }, results);

    // Test 17: Available operators
    test('Available operators', () => {
        const calc = new AdvancedCalculator();
        
        const operators = calc.getAvailableOperators();
        assert(operators.includes('+'), 'Addition operator should be available');
        assert(operators.includes('*'), 'Multiplication operator should be available');
        assert(operators.includes('^'), 'Power operator should be available');
    }, results);

    // Test 18: Complex trigonometric functions
    test('Complex trigonometric functions', () => {
        const z = new Complex(1, 1);
        
        const sinZ = z.sin();
        assert(sinZ instanceof Complex, 'sin(z) should return complex number');
        
        const cosZ = z.cos();
        assert(cosZ instanceof Complex, 'cos(z) should return complex number');
        
        const tanZ = z.tan();
        assert(tanZ instanceof Complex, 'tan(z) should return complex number');
    }, results);

    // Test 19: Complex exponential and logarithmic functions
    test('Complex exponential and logarithmic functions', () => {
        const z = new Complex(1, 1);
        
        const expZ = z.exp();
        assert(expZ instanceof Complex, 'exp(z) should return complex number');
        
        const logZ = z.log();
        assert(logZ instanceof Complex, 'log(z) should return complex number');
        
        const sqrtZ = z.sqrt();
        assert(sqrtZ instanceof Complex, 'sqrt(z) should return complex number');
    }, results);

    // Test 20: Performance test
    test('Performance test', () => {
        const calc = new AdvancedCalculator();
        const startTime = performance.now();
        
        // Evaluate a complex expression multiple times
        for (let i = 0; i < 100; i++) {
            calc.evalExpr('sin(pi/4) * cos(pi/4) + sqrt(2)');
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        assert(duration < 1000, `100 evaluations should complete in < 1 second, took ${duration.toFixed(2)}ms`);
    }, results);

    // Print results
    console.log(`\n📊 Test Results: ${results.passed} passed, ${results.failed} failed`);
    
    if (results.failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.tests.filter(t => !t.passed).forEach(test => {
            console.log(`  - ${test.name}: ${test.error || 'Unknown error'}`);
        });
    }
    
    if (results.passed === results.tests.length) {
        console.log('\n🎉 All tests passed! Advanced Calculator is working correctly.');
    }
    
    return results;
}

// Helper function to run a test
function test(name, testFunction, results) {
    try {
        testFunction();
        results.passed++;
        results.tests.push({ name, passed: true });
        console.log(`✅ ${name}`);
    } catch (error) {
        results.failed++;
        results.tests.push({ name, passed: false, error: error.message });
        console.log(`❌ ${name}: ${error.message}`);
    }
}

// Helper function for assertions
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

// Export for use in browser console
window.runCalculatorTests = runCalculatorTests;

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && typeof AdvancedCalculator !== 'undefined') {
    // Wait a bit for everything to load
    setTimeout(() => {
        runCalculatorTests();
    }, 100);
}
