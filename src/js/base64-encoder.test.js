/**
 * Test Suite for Advanced Base64 Encoder
 * Tests RFC 4648 compliance, URL-safe variants, MIME wrapping, and edge cases
 */

// Test runner function
function runBase64Tests() {
    console.log('🧪 Running Advanced Base64 Encoder Tests...\n');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    // Test 1: Basic encoding/decoding
    test('Basic encoding/decoding', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'Hello World!';
        const encoded = encoder.encode(input);
        const decoded = encoder.decode(encoded);
        const decodedString = encoder.bytesToString(decoded);
        
        assert(encoded === 'SGVsbG8gV29ybGQh', `Expected 'SGVsbG8gV29ybGQh', got '${encoded}'`);
        assert(decodedString === input, `Expected '${input}', got '${decodedString}'`);
    }, results);

    // Test 2: Empty string
    test('Empty string handling', () => {
        const encoder = new AdvancedBase64Encoder();
        const encoded = encoder.encode('');
        const decoded = encoder.decode(encoded);
        
        assert(encoded === '', 'Empty string should encode to empty string');
        assert(decoded.length === 0, 'Empty string should decode to empty array');
    }, results);

    // Test 3: Single character
    test('Single character encoding', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'A';
        const encoded = encoder.encode(input);
        
        assert(encoded === 'QQ==', `Expected 'QQ==', got '${encoded}'`);
    }, results);

    // Test 4: Two characters
    test('Two character encoding', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'AB';
        const encoded = encoder.encode(input);
        
        assert(encoded === 'QUI=', `Expected 'QUI=', got '${encoded}'`);
    }, results);

    // Test 5: Three characters (clean block)
    test('Three character encoding (clean block)', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'Sun';
        const encoded = encoder.encode(input);
        
        assert(encoded === 'U3Vu', `Expected 'U3Vu', got '${encoded}'`);
    }, results);

    // Test 6: URL-safe encoding
    test('URL-safe encoding', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'Hello World!';
        const encoded = encoder.encode(input, { urlSafe: true });
        
        // Should not contain + or / characters
        assert(!encoded.includes('+'), 'URL-safe encoding should not contain +');
        assert(!encoded.includes('/'), 'URL-safe encoding should not contain /');
        assert(encoded.includes('-') || encoded.includes('_'), 'URL-safe encoding should contain - or _');
    }, results);

    // Test 7: MIME wrapping
    test('MIME line wrapping', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'A'.repeat(100); // Create long input
        const encoded = encoder.encode(input, { wrapMime: true });
        
        // Should contain line breaks
        assert(encoded.includes('\r\n'), 'MIME encoding should contain line breaks');
        
        // Check line lengths (should be <= 76 characters)
        const lines = encoded.split('\r\n');
        lines.forEach(line => {
            assert(line.length <= 76, `Line length should be <= 76, got ${line.length}`);
        });
    }, results);

    // Test 8: Padding omission
    test('Padding omission', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'A';
        const encoded = encoder.encode(input, { omitPadding: true });
        
        assert(!encoded.includes('='), 'Encoding with omitPadding should not contain =');
    }, results);

    // Test 9: Strict decoding mode
    test('Strict decoding mode', () => {
        const encoder = new AdvancedBase64Encoder();
        const invalidInput = 'SGVsbG8gV29ybGQh!'; // Invalid character at end
        
        try {
            encoder.decode(invalidInput, { strict: true });
            assert(false, 'Should throw error for invalid input in strict mode');
        } catch (error) {
            assert(error.message.includes('Invalid Base64 character'), 'Should throw appropriate error');
        }
    }, results);

    // Test 10: Non-strict decoding mode
    test('Non-strict decoding mode', () => {
        const encoder = new AdvancedBase64Encoder();
        const invalidInput = 'SGVsbG8gV29ybGQh!'; // Invalid character at end
        
        try {
            const decoded = encoder.decode(invalidInput, { strict: false });
            assert(decoded.length > 0, 'Non-strict mode should decode valid parts');
        } catch (error) {
            assert(false, 'Non-strict mode should not throw error');
        }
    }, results);

    // Test 11: Validation
    test('Input validation', () => {
        const encoder = new AdvancedBase64Encoder();
        
        // Valid input
        const validResult = encoder.validate('SGVsbG8gV29ybGQh');
        assert(validResult.isValid, 'Valid input should pass validation');
        
        // Invalid length
        const invalidLengthResult = encoder.validate('SGVsbG8gV29ybGQ');
        assert(!invalidLengthResult.isValid, 'Invalid length should fail validation');
        
        // Invalid characters
        const invalidCharResult = encoder.validate('SGVsbG8gV29ybGQh!');
        assert(!invalidCharResult.isValid, 'Invalid characters should fail validation');
    }, results);

    // Test 12: Statistics
    test('Encoding statistics', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'Hello World!';
        const stats = encoder.getStats(input);
        
        assert(stats.inputBytes === 13, `Expected 13 bytes, got ${stats.inputBytes}`);
        assert(stats.inputBits === 104, `Expected 104 bits, got ${stats.inputBits}`);
        assert(stats.expansionRatio > 1.3, `Expected expansion ratio > 1.3, got ${stats.expansionRatio}`);
        assert(stats.paddingCharacters >= 0, 'Padding characters should be >= 0');
    }, results);

    // Test 13: All variants
    test('All encoding variants', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'Hello World!';
        const variants = encoder.encodeAllVariants(input);
        
        assert(variants.standard, 'Standard variant should exist');
        assert(variants.urlSafe, 'URL-safe variant should exist');
        assert(variants.urlSafeNoPadding, 'URL-safe no-padding variant should exist');
        assert(variants.mime, 'MIME variant should exist');
        assert(variants.mimeUrlSafe, 'MIME URL-safe variant should exist');
    }, results);

    // Test 14: Hex input
    test('Hexadecimal input handling', () => {
        const encoder = new AdvancedBase64Encoder();
        const hexInput = '48656C6C6F'; // "Hello" in hex
        const bytes = new Uint8Array(hexInput.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const encoded = encoder.encode(bytes);
        
        assert(encoded === 'SGVsbG8=', `Expected 'SGVsbG8=', got '${encoded}'`);
    }, results);

    // Test 15: File input simulation
    test('File input simulation', () => {
        const encoder = new AdvancedBase64Encoder();
        const fileBytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
        const encoded = encoder.encode(fileBytes);
        
        assert(encoded === 'SGVsbG8=', `Expected 'SGVsbG8=', got '${encoded}'`);
    }, results);

    // Test 16: Edge case - single byte
    test('Single byte edge case', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = new Uint8Array([65]); // Single byte 'A'
        const encoded = encoder.encode(input);
        
        assert(encoded === 'QQ==', `Expected 'QQ==', got '${encoded}'`);
    }, results);

    // Test 17: Edge case - two bytes
    test('Two bytes edge case', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = new Uint8Array([65, 66]); // Two bytes 'AB'
        const encoded = encoder.encode(input);
        
        assert(encoded === 'QUI=', `Expected 'QUI=', got '${encoded}'`);
    }, results);

    // Test 18: Complex string with special characters
    test('Complex string with special characters', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'Hello, World! 🌍 123';
        const encoded = encoder.encode(input);
        const decoded = encoder.decode(encoded);
        const decodedString = encoder.bytesToString(decoded);
        
        assert(decodedString === input, `Expected '${input}', got '${decodedString}'`);
    }, results);

    // Test 19: Self-tests
    test('Self-test functionality', () => {
        const encoder = new AdvancedBase64Encoder();
        const testResults = encoder.runSelfTests();
        
        assert(testResults.passed > 0, 'Should have some passing tests');
        assert(testResults.tests.length > 0, 'Should have test cases');
    }, results);

    // Test 20: Performance test
    test('Performance test', () => {
        const encoder = new AdvancedBase64Encoder();
        const input = 'A'.repeat(1000); // 1KB input
        
        const startTime = performance.now();
        const encoded = encoder.encode(input);
        const decodeTime = performance.now();
        
        const decoded = encoder.decode(encoded);
        const endTime = performance.now();
        
        const encodeDuration = decodeTime - startTime;
        const decodeDuration = endTime - decodeTime;
        
        assert(encodeDuration < 100, `Encoding should be fast (< 100ms), took ${encodeDuration.toFixed(2)}ms`);
        assert(decodeDuration < 100, `Decoding should be fast (< 100ms), took ${decodeDuration.toFixed(2)}ms`);
        assert(decoded.length === 1000, 'Decoded length should match input length');
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
        console.log('\n🎉 All tests passed! Advanced Base64 Encoder is working correctly.');
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
window.runBase64Tests = runBase64Tests;

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && typeof AdvancedBase64Encoder !== 'undefined') {
    // Wait a bit for everything to load
    setTimeout(() => {
        runBase64Tests();
    }, 100);
}
