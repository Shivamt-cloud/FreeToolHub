/**
 * Advanced Color Converter Test Suite
 * Comprehensive testing for all color space conversions and features
 */

// Test runner function
function runColorConverterTests() {
    console.log('🧪 Running Advanced Color Converter Tests...\n');
    
    let passed = 0;
    let failed = 0;
    let total = 0;
    
    // Test helper function
    function test(name, testFn) {
        total++;
        try {
            testFn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.error(`❌ ${name}: ${error.message}`);
            failed++;
        }
    }
    
    // Assertion helper functions
    function assertEqual(actual, expected, message = '') {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    }
    
    function assertApproxEqual(actual, expected, tolerance = 0.001, message = '') {
        if (Array.isArray(actual) && Array.isArray(expected)) {
            if (actual.length !== expected.length) {
                throw new Error(`${message} Array length mismatch: expected ${expected.length}, got ${actual.length}`);
            }
            for (let i = 0; i < actual.length; i++) {
                if (Math.abs(actual[i] - expected[i]) > tolerance) {
                    throw new Error(`${message} Index ${i}: expected ${expected[i]}, got ${actual[i]} (tolerance: ${tolerance})`);
                }
            }
        } else {
            if (Math.abs(actual - expected) > tolerance) {
                throw new Error(`${message} Expected ${expected}, got ${actual} (tolerance: ${tolerance})`);
            }
        }
    }
    
    function assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(message || 'Expected true, got false');
        }
    }
    
    function assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(message || 'Expected false, got true');
        }
    }
    
    // Check if AdvancedColorConverter is available
    if (typeof AdvancedColorConverter === 'undefined') {
        console.error('❌ AdvancedColorConverter class not available');
        return;
    }
    
    const converter = new AdvancedColorConverter();
    
    // Test 1: Basic HEX conversions
    test('HEX to sRGB conversion', () => {
        const result = converter.convertColor('#FF0000', 'hex', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor('#00FF00', 'hex', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1]);
        
        const result3 = converter.convertColor('#0000FF', 'hex', 'srgb');
        assertApproxEqual(result3, [0, 0, 1, 1]);
    });
    
    test('HEX with alpha conversion', () => {
        const result = converter.convertColor('#FF000080', 'hex', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 0.5]);
        
        const result2 = converter.convertColor('#00FF00FF', 'hex', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1]);
    });
    
    test('Short HEX expansion', () => {
        const result = converter.convertColor('#F00', 'hex', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor('#0F0', 'hex', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1]);
    });
    
    // Test 2: sRGB conversions
    test('sRGB to HEX conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'hex');
        assertEqual(result, '#FF0000');
        
        const result2 = converter.convertColor([0, 1, 0, 1], 'srgb', 'hex');
        assertEqual(result2, '#00FF00');
        
        const result3 = converter.convertColor([0, 0, 1, 0.5], 'srgb', 'hex');
        assertEqual(result3, '#0000FF80');
    });
    
    test('sRGB to sRGB 8-bit conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'srgb8');
        assertEqual(result, [255, 0, 0, 1]);
        
        const result2 = converter.convertColor([0.5, 0.25, 0.75, 1], 'srgb', 'srgb8');
        assertEqual(result2, [128, 64, 191, 1]);
    });
    
    test('sRGB 8-bit to sRGB conversion', () => {
        const result = converter.convertColor([255, 0, 0, 1], 'srgb8', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor([128, 64, 191, 1], 'srgb8', 'srgb');
        assertApproxEqual(result2, [0.502, 0.251, 0.749, 1]);
    });
    
    // Test 3: HSL conversions
    test('sRGB to HSL conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'hsl');
        assertApproxEqual(result, [0, 1, 0.5, 1]);
        
        const result2 = converter.convertColor([0, 1, 0, 1], 'srgb', 'hsl');
        assertApproxEqual(result2, [120, 1, 0.5, 1]);
        
        const result3 = converter.convertColor([0, 0, 1, 1], 'srgb', 'hsl');
        assertApproxEqual(result3, [240, 1, 0.5, 1]);
    });
    
    test('HSL to sRGB conversion', () => {
        const result = converter.convertColor([0, 1, 0.5, 1], 'hsl', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor([120, 1, 0.5, 1], 'hsl', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1]);
        
        const result3 = converter.convertColor([240, 1, 0.5, 1], 'hsl', 'srgb');
        assertApproxEqual(result3, [0, 0, 1, 1]);
    });
    
    // Test 4: HSV conversions
    test('sRGB to HSV conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'hsv');
        assertApproxEqual(result, [0, 1, 1, 1]);
        
        const result2 = converter.convertColor([0, 1, 0, 1], 'srgb', 'hsv');
        assertApproxEqual(result2, [120, 1, 1, 1]);
        
        const result3 = converter.convertColor([0, 0, 1, 1], 'srgb', 'hsv');
        assertApproxEqual(result3, [240, 1, 1, 1]);
    });
    
    test('HSV to sRGB conversion', () => {
        const result = converter.convertColor([0, 1, 1, 1], 'hsv', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor([120, 1, 1, 1], 'hsv', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1]);
        
        const result3 = converter.convertColor([240, 1, 1, 1], 'hsv', 'srgb');
        assertApproxEqual(result3, [0, 0, 1, 1]);
    });
    
    // Test 5: XYZ conversions
    test('sRGB to XYZ conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'xyz');
        assertApproxEqual(result, [41.2456, 21.2673, 1.9334, 1], 0.1);
        
        const result2 = converter.convertColor([0, 1, 0, 1], 'srgb', 'xyz');
        assertApproxEqual(result2, [35.7576, 71.5152, 11.9192, 1], 0.1);
        
        const result3 = converter.convertColor([0, 0, 1, 1], 'srgb', 'xyz');
        assertApproxEqual(result3, [18.0437, 7.2175, 95.0304, 1], 0.1);
    });
    
    test('XYZ to sRGB conversion', () => {
        const result = converter.convertColor([41.2456, 21.2673, 1.9334, 1], 'xyz', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1], 0.01);
        
        const result2 = converter.convertColor([35.7576, 71.5152, 11.9192, 1], 'xyz', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1], 0.01);
        
        const result3 = converter.convertColor([18.0437, 7.2175, 95.0304, 1], 'xyz', 'srgb');
        assertApproxEqual(result3, [0, 0, 1, 1], 0.01);
    });
    
    // Test 6: CIELAB conversions
    test('sRGB to CIELAB conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'lab');
        assertApproxEqual(result, [53.2408, 80.0925, 67.2032, 1], 0.1);
        
        const result2 = converter.convertColor([0, 1, 0, 1], 'srgb', 'lab');
        assertApproxEqual(result2, [87.7347, -86.1827, 83.1793, 1], 0.1);
        
        const result3 = converter.convertColor([0, 0, 1, 1], 'srgb', 'lab');
        assertApproxEqual(result3, [32.2970, 79.1875, -107.8602, 1], 0.1);
    });
    
    test('CIELAB to sRGB conversion', () => {
        const result = converter.convertColor([53.2408, 80.0925, 67.2032, 1], 'lab', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1], 0.01);
        
        const result2 = converter.convertColor([87.7347, -86.1827, 83.1793, 1], 'lab', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1], 0.01);
        
        const result3 = converter.convertColor([32.2970, 79.1875, -107.8602, 1], 'lab', 'srgb');
        assertApproxEqual(result3, [0, 0, 1, 1], 0.01);
    });
    
    // Test 7: CMYK conversions
    test('sRGB to CMYK conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'cmyk');
        assertApproxEqual(result, [0, 1, 1, 0, 1]);
        
        const result2 = converter.convertColor([0, 1, 0, 1], 'srgb', 'cmyk');
        assertApproxEqual(result2, [1, 0, 1, 0, 1]);
        
        const result3 = converter.convertColor([0, 0, 1, 1], 'srgb', 'cmyk');
        assertApproxEqual(result3, [1, 1, 0, 0, 1]);
    });
    
    test('CMYK to sRGB conversion', () => {
        const result = converter.convertColor([0, 1, 1, 0, 1], 'cmyk', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1], 0.01);
        
        const result2 = converter.convertColor([1, 0, 1, 0, 1], 'cmyk', 'srgb');
        assertApproxEqual(result2, [0, 1, 0, 1], 0.01);
        
        const result3 = converter.convertColor([1, 1, 0, 0, 1], 'cmyk', 'srgb');
        assertApproxEqual(result3, [0, 0, 1, 1], 0.01);
    });
    
    // Test 8: Linear sRGB conversions
    test('sRGB to Linear sRGB conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb', 'srgb-linear');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor([0.5, 0.5, 0.5, 1], 'srgb', 'srgb-linear');
        assertApproxEqual(result2, [0.214, 0.214, 0.214, 1], 0.01);
    });
    
    test('Linear sRGB to sRGB conversion', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'srgb-linear', 'srgb');
        assertApproxEqual(result, [1, 0, 0, 1]);
        
        const result2 = converter.convertColor([0.214, 0.214, 0.214, 1], 'srgb-linear', 'srgb');
        assertApproxEqual(result2, [0.5, 0.5, 0.5, 1], 0.01);
    });
    
    // Test 9: Color harmony functions
    test('Complementary color generation', () => {
        const result = converter.generateComplementary([1, 0, 0, 1], 'srgb');
        assertTrue(result.hasOwnProperty('original'));
        assertTrue(result.hasOwnProperty('complementary'));
        assertApproxEqual(result.original, [1, 0, 0, 1]);
        assertApproxEqual(result.complementary, [0, 1, 1, 1]);
    });
    
    test('Analogous color generation', () => {
        const result = converter.generateAnalogous([1, 0, 0, 1], 'srgb', 3);
        assertTrue(result.hasOwnProperty('original'));
        assertTrue(result.hasOwnProperty('analogous'));
        assertEqual(result.analogous.length, 3);
        assertApproxEqual(result.original, [1, 0, 0, 1]);
    });
    
    test('Triadic color generation', () => {
        const result = converter.generateTriadic([1, 0, 0, 1], 'srgb');
        assertTrue(result.hasOwnProperty('original'));
        assertTrue(result.hasOwnProperty('triadic1'));
        assertTrue(result.hasOwnProperty('triadic2'));
        assertApproxEqual(result.original, [1, 0, 0, 1]);
    });
    
    // Test 10: Edge cases and error handling
    test('Invalid color space handling', () => {
        const result = converter.convertColor([1, 0, 0, 1], 'invalid', 'srgb');
        assertTrue(result.hasOwnProperty('error'));
        assertTrue(result.error.includes('Unsupported color space'));
    });
    
    test('Invalid input format handling', () => {
        const result = converter.convertColor('invalid', 'hex', 'srgb');
        assertTrue(result.hasOwnProperty('error'));
        assertTrue(result.error.includes('Invalid HEX format'));
    });
    
    test('Out of range values clamping', () => {
        const result = converter.convertColor([2, -1, 0.5, 1], 'srgb', 'hex');
        // Should clamp to valid range and not error
        assertFalse(result.hasOwnProperty('error'));
    });
    
    test('Alpha channel preservation', () => {
        const result = converter.convertColor([1, 0, 0, 0.5], 'srgb', 'hex');
        assertEqual(result, '#FF000080');
        
        const result2 = converter.convertColor([1, 0, 0, 0.5], 'srgb', 'hsl');
        assertApproxEqual(result2[3], 0.5);
    });
    
    // Test 11: Utility functions
    test('Supported color spaces list', () => {
        const spaces = converter.getSupportedColorSpaces();
        assertTrue(Array.isArray(spaces));
        assertTrue(spaces.includes('hex'));
        assertTrue(spaces.includes('srgb'));
        assertTrue(spaces.includes('hsl'));
        assertTrue(spaces.includes('hsv'));
        assertTrue(spaces.includes('cmyk'));
        assertTrue(spaces.includes('xyz'));
        assertTrue(spaces.includes('lab'));
    });
    
    test('Color space info retrieval', () => {
        const info = converter.getColorSpaceInfo('hex');
        assertTrue(info.hasOwnProperty('name'));
        assertTrue(info.hasOwnProperty('description'));
        assertTrue(info.hasOwnProperty('channels'));
    });
    
    test('Color validation', () => {
        const valid = converter.validateColor('#FF0000', 'hex');
        assertTrue(valid.isValid);
        
        const invalid = converter.validateColor('invalid', 'hex');
        assertFalse(invalid.isValid);
    });
    
    // Test 12: Complex color scenarios
    test('White color conversions', () => {
        const white = [1, 1, 1, 1];
        
        const hex = converter.convertColor(white, 'srgb', 'hex');
        assertEqual(hex, '#FFFFFF');
        
        const hsl = converter.convertColor(white, 'srgb', 'hsl');
        assertApproxEqual(hsl, [0, 0, 1, 1]);
        
        const xyz = converter.convertColor(white, 'srgb', 'xyz');
        assertApproxEqual(xyz, [95.0489, 100, 108.8840, 1], 0.1);
        
        const lab = converter.convertColor(white, 'srgb', 'lab');
        assertApproxEqual(lab, [100, 0, 0, 1], 0.1);
    });
    
    test('Black color conversions', () => {
        const black = [0, 0, 0, 1];
        
        const hex = converter.convertColor(black, 'srgb', 'hex');
        assertEqual(hex, '#000000');
        
        const hsl = converter.convertColor(black, 'srgb', 'hsl');
        assertApproxEqual(hsl, [0, 0, 0, 1]);
        
        const xyz = converter.convertColor(black, 'srgb', 'xyz');
        assertApproxEqual(xyz, [0, 0, 0, 1]);
        
        const lab = converter.convertColor(black, 'srgb', 'lab');
        assertApproxEqual(lab, [0, 0, 0, 1]);
    });
    
    test('Gray color conversions', () => {
        const gray = [0.5, 0.5, 0.5, 1];
        
        const hex = converter.convertColor(gray, 'srgb', 'hex');
        assertEqual(hex, '#808080');
        
        const hsl = converter.convertColor(gray, 'srgb', 'hsl');
        assertApproxEqual(hsl, [0, 0, 0.5, 1]);
        
        const xyz = converter.convertColor(gray, 'srgb', 'xyz');
        assertApproxEqual(xyz, [20.5178, 21.5851, 23.5072, 1], 0.1);
    });
    
    // Test 13: Round-trip conversions
    test('Round-trip HEX ↔ sRGB', () => {
        const original = '#FF6B35';
        const srgb = converter.convertColor(original, 'hex', 'srgb');
        const back = converter.convertColor(srgb, 'srgb', 'hex');
        assertEqual(back, original);
    });
    
    test('Round-trip sRGB ↔ HSL', () => {
        const original = [0.8, 0.3, 0.9, 0.7];
        const hsl = converter.convertColor(original, 'srgb', 'hsl');
        const back = converter.convertColor(hsl, 'hsl', 'srgb');
        assertApproxEqual(back, original, 0.01);
    });
    
    test('Round-trip sRGB ↔ XYZ', () => {
        const original = [0.6, 0.4, 0.8, 1];
        const xyz = converter.convertColor(original, 'srgb', 'xyz');
        const back = converter.convertColor(xyz, 'xyz', 'srgb');
        assertApproxEqual(back, original, 0.01);
    });
    
    test('Round-trip sRGB ↔ CIELAB', () => {
        const original = [0.7, 0.2, 0.5, 1];
        const lab = converter.convertColor(original, 'srgb', 'lab');
        const back = converter.convertColor(lab, 'lab', 'srgb');
        assertApproxEqual(back, original, 0.01);
    });
    
    // Test 14: Performance and memory
    test('Multiple conversions performance', () => {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            converter.convertColor([Math.random(), Math.random(), Math.random(), 1], 'srgb', 'hex');
        }
        const end = performance.now();
        const duration = end - start;
        
        // Should complete 1000 conversions in reasonable time
        assertTrue(duration < 1000, `1000 conversions took ${duration}ms, expected < 1000ms`);
    });
    
    // Test 15: Matrix operations
    test('Matrix multiplication accuracy', () => {
        const matrix = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        const vector = [1, 2, 3];
        
        const result = converter.matrixMultiply(matrix, vector);
        const expected = [14, 32, 50];
        
        assertApproxEqual(result, expected);
    });
    
    // Test 16: Transfer functions
    test('sRGB transfer functions', () => {
        // Test linear segment
        const linear1 = converter.srgbToLinear(0.04);
        assertApproxEqual(linear1, 0.04 / 12.92);
        
        // Test power law segment
        const linear2 = converter.srgbToLinear(0.5);
        const expected = Math.pow((0.5 + 0.055) / 1.055, 2.4);
        assertApproxEqual(linear2, expected);
        
        // Test reverse conversion
        const srgb = converter.linearToSrgb(linear2);
        assertApproxEqual(srgb, 0.5);
    });
    
    // Test 17: Color information display
    test('Color information retrieval', () => {
        const info = converter.getColorInfo([1, 0, 0, 1], 'srgb');
        assertTrue(info.hasOwnProperty('hex'));
        assertTrue(info.hasOwnProperty('rgb'));
        assertTrue(info.hasOwnProperty('hsl'));
        assertTrue(info.hasOwnProperty('hsv'));
        assertTrue(info.hasOwnProperty('xyz'));
        assertTrue(info.hasOwnProperty('lab'));
        assertTrue(info.hasOwnProperty('cmyk'));
    });
    
    // Test 18: Error recovery
    test('Error recovery and fallback', () => {
        // Test with partially invalid input
        const result = converter.convertColor([1, 'invalid', 0, 1], 'srgb', 'hex');
        assertTrue(result.hasOwnProperty('error'));
        
        // Test with missing alpha
        const result2 = converter.convertColor([1, 0, 0], 'srgb', 'hex');
        // Should default alpha to 1.0
        assertEqual(result2, '#FF0000');
    });
    
    // Test 19: Color space compatibility
    test('Color space compatibility matrix', () => {
        const spaces = converter.getSupportedColorSpaces();
        
        // Test that all spaces can convert to sRGB
        for (const space of spaces) {
            if (space === 'srgb') continue;
            
            const testColor = space === 'hex' ? '#FF0000' : 
                             space === 'srgb8' ? [255, 0, 0, 1] :
                             [1, 0, 0, 1];
            
            const result = converter.convertColor(testColor, space, 'srgb');
            assertFalse(result.hasOwnProperty('error'), 
                `Failed to convert from ${space} to sRGB: ${result.error}`);
        }
    });
    
    // Test 20: Final comprehensive test
    test('Comprehensive color workflow', () => {
        // Start with a complex color
        const startColor = '#8B4513'; // Saddle Brown
        
        // Convert through multiple spaces
        const srgb = converter.convertColor(startColor, 'hex', 'srgb');
        const hsl = converter.convertColor(srgb, 'srgb', 'hsl');
        const hsv = converter.convertColor(srgb, 'srgb', 'hsv');
        const xyz = converter.convertColor(srgb, 'srgb', 'xyz');
        const lab = converter.convertColor(srgb, 'srgb', 'lab');
        const cmyk = converter.convertColor(srgb, 'srgb', 'cmyk');
        
        // Verify all conversions succeeded
        assertFalse(srgb.hasOwnProperty('error'));
        assertFalse(hsl.hasOwnProperty('error'));
        assertFalse(hsv.hasOwnProperty('error'));
        assertFalse(xyz.hasOwnProperty('error'));
        assertFalse(lab.hasOwnProperty('error'));
        assertFalse(cmyk.hasOwnProperty('error'));
        
        // Convert back to HEX and verify consistency
        const backToHex = converter.convertColor(srgb, 'srgb', 'hex');
        assertEqual(backToHex, startColor);
        
        // Generate color harmonies
        const complementary = converter.generateComplementary(srgb, 'srgb');
        const analogous = converter.generateAnalogous(srgb, 'srgb', 3);
        const triadic = converter.generateTriadic(srgb, 'srgb');
        
        // Verify harmony generation succeeded
        assertTrue(complementary.hasOwnProperty('complementary'));
        assertTrue(analogous.hasOwnProperty('analogous'));
        assertTrue(triadic.hasOwnProperty('triadic1'));
    });
    
    // Print test results
    console.log(`\n📊 Test Results: ${passed}/${total} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('🎉 All tests passed! Advanced Color Converter is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the implementation.');
    }
    
    return { passed, failed, total };
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runColorConverterTests };
} else {
    // Make available globally for browser testing
    window.runColorConverterTests = runColorConverterTests;
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && window.location && window.location.href.includes('color-converter.test.js')) {
    // Wait for DOM and AdvancedColorConverter to be available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runColorConverterTests, 100);
        });
    } else {
        setTimeout(runColorConverterTests, 100);
    }
}
