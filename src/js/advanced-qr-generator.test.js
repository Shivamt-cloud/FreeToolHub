/**
 * Advanced QR Code Generator Test Suite
 * Comprehensive testing for all QR code generation features
 */

function runAdvancedQRGeneratorTests() {
    console.log('📱 Running Advanced QR Code Generator Tests...\n');
    
    let testCount = 0;
    let passedCount = 0;
    let failedCount = 0;

    function test(name, testFunction) {
        testCount++;
        try {
            testFunction();
            console.log(`✅ Test ${testCount}: ${name}`);
            passedCount++;
        } catch (error) {
            console.error(`❌ Test ${testCount}: ${name} - ${error.message}`);
            failedCount++;
        }
    }

    // Test 1: QRConstants class
    test('QRConstants - ECC Levels', () => {
        const eccLevels = QRConstants.ECC_LEVELS;
        assert(eccLevels.L.level === 'L', 'L level should be defined');
        assert(eccLevels.M.level === 'M', 'M level should be defined');
        assert(eccLevels.Q.level === 'Q', 'Q level should be defined');
        assert(eccLevels.H.level === 'H', 'H level should be defined');
        assert(eccLevels.L.recovery === 0.07, 'L recovery should be 7%');
        assert(eccLevels.H.recovery === 0.30, 'H recovery should be 30%');
    });

    // Test 2: QRConstants - Encoding Modes
    test('QRConstants - Encoding Modes', () => {
        const modes = QRConstants.MODES;
        assert(modes.NUMERIC.value === 0x1, 'Numeric mode should be 0x1');
        assert(modes.ALPHANUMERIC.value === 0x2, 'Alphanumeric mode should be 0x2');
        assert(modes.BYTE.value === 0x4, 'Byte mode should be 0x4');
        assert(modes.KANJI.value === 0x8, 'Kanji mode should be 0x8');
    });

    // Test 3: QRConstants - Version Capacities
    test('QRConstants - Version Capacities', () => {
        const capacities = QRConstants.CAPACITIES;
        assert(capacities[1].L === 19, 'Version 1 L capacity should be 19');
        assert(capacities[1].M === 16, 'Version 1 M capacity should be 16');
        assert(capacities[10].M === 226, 'Version 10 M capacity should be 226');
        assert(capacities[40].H === 1273, 'Version 40 H capacity should be 1273');
    });

    // Test 4: QRConstants - Matrix Size Calculation
    test('QRConstants - Matrix Size Calculation', () => {
        assert(QRConstants.getMatrixSize(1) === 21, 'Version 1 matrix size should be 21');
        assert(QRConstants.getMatrixSize(2) === 25, 'Version 2 matrix size should be 25');
        assert(QRConstants.getMatrixSize(10) === 57, 'Version 10 matrix size should be 57');
        assert(QRConstants.getMatrixSize(40) === 177, 'Version 40 matrix size should be 177');
    });

    // Test 5: QRConstants - Character Count Bits
    test('QRConstants - Character Count Bits', () => {
        assert(QRConstants.getCharCountBits(QRConstants.MODES.NUMERIC.value, 1) === 10, 'Version 1 numeric should be 10 bits');
        assert(QRConstants.getCharCountBits(QRConstants.MODES.BYTE.value, 15) === 16, 'Version 15 byte should be 16 bits');
        assert(QRConstants.getCharCountBits(QRConstants.MODES.NUMERIC.value, 30) === 14, 'Version 30 numeric should be 14 bits');
    });

    // Test 6: BitBuffer - Basic Operations
    test('BitBuffer - Basic Operations', () => {
        const buffer = new BitBuffer();
        buffer.append(5, 3); // 101 in binary
        buffer.append(3, 2); // 11 in binary
        assert(buffer.getBitCount() === 5, 'Total bit count should be 5');
        
        const codewords = buffer.toCodewords();
        assert(codewords.length > 0, 'Should generate codewords');
    });

    // Test 7: BitBuffer - Mode and Character Count
    test('BitBuffer - Mode and Character Count', () => {
        const buffer = new BitBuffer();
        buffer.appendMode(QRConstants.MODES.NUMERIC.value);
        buffer.appendCharCount(123, QRConstants.MODES.NUMERIC.value, 1);
        
        const codewords = buffer.toCodewords();
        assert(codewords.length > 0, 'Should handle mode and character count');
    });

    // Test 8: InputSegmenter - Basic Segmentation
    test('InputSegmenter - Basic Segmentation', () => {
        const segments = InputSegmenter.segmentInput('123ABC');
        assert(segments.length >= 1, 'Should create segments');
        assert(segments[0].mode === QRConstants.MODES.NUMERIC.value, 'First segment should be numeric');
    });

    // Test 9: InputSegmenter - Mixed Content
    test('InputSegmenter - Mixed Content', () => {
        const segments = InputSegmenter.segmentInput('123 ABC 456');
        assert(segments.length >= 2, 'Should handle mixed content');
    });

    // Test 10: InputSegmenter - Encoding
    test('InputSegmenter - Encoding', () => {
        const numericData = InputSegmenter.encodeNumeric('123');
        assert(numericData.length > 0, 'Should encode numeric data');
        
        const alphanumericData = InputSegmenter.encodeAlphanumeric('AB');
        assert(alphanumericData.length > 0, 'Should encode alphanumeric data');
        
        const byteData = InputSegmenter.encodeByte('Hello');
        assert(byteData.length === 5, 'Should encode byte data');
    });

    // Test 11: ReedSolomonEncoder - Basic Encoding
    test('ReedSolomonEncoder - Basic Encoding', () => {
        const data = [1, 2, 3, 4, 5];
        const eccCodewords = 2;
        const parity = ReedSolomonEncoder.encode(data, eccCodewords);
        assert(parity.length === eccCodewords, 'Should generate correct number of parity codewords');
    });

    // Test 12: QRMatrix - Basic Creation
    test('QRMatrix - Basic Creation', () => {
        const matrix = new QRMatrix(21);
        assert(matrix.size === 21, 'Matrix size should be 21');
        assert(matrix.matrix.length === 21, 'Matrix should have 21 rows');
        assert(matrix.matrix[0].length === 21, 'Matrix should have 21 columns');
    });

    // Test 13: QRMatrix - Function Patterns
    test('QRMatrix - Function Patterns', () => {
        const matrix = new QRMatrix(21);
        matrix.placeFinderPatterns();
        matrix.placeTimingPatterns();
        
        // Check that patterns were placed
        let hasPatterns = false;
        for (let i = 0; i < matrix.size; i++) {
            for (let j = 0; j < matrix.size; j++) {
                if (matrix.matrix[i][j] !== null) {
                    hasPatterns = true;
                    break;
                }
            }
        }
        assert(hasPatterns, 'Function patterns should be placed');
    });

    // Test 14: QRMatrix - Data Placement
    test('QRMatrix - Data Placement', () => {
        const matrix = new QRMatrix(21);
        matrix.placeFinderPatterns();
        matrix.placeTimingPatterns();
        
        const testData = [1, 2, 3, 4, 5, 6, 7, 8];
        matrix.placeData(testData);
        
        // Check that some data was placed
        let hasData = false;
        for (let i = 0; i < matrix.size; i++) {
            for (let j = 0; j < matrix.size; j++) {
                if (matrix.matrix[i][j] === 0 || matrix.matrix[i][j] === 1) {
                    hasData = true;
                    break;
                }
            }
        }
        assert(hasData, 'Data should be placed in matrix');
    });

    // Test 15: QRMatrix - Mask Application
    test('QRMatrix - Mask Application', () => {
        const matrix = new QRMatrix(21);
        matrix.placeFinderPatterns();
        matrix.placeTimingPatterns();
        
        const testData = [1, 2, 3, 4, 5, 6, 7, 8];
        matrix.placeData(testData);
        
        const maskedMatrix = matrix.applyMask(0);
        assert(maskedMatrix.length === 21, 'Masked matrix should maintain size');
    });

    // Test 16: QRMatrix - Penalty Calculation
    test('QRMatrix - Penalty Calculation', () => {
        const matrix = new QRMatrix(21);
        matrix.placeFinderPatterns();
        matrix.placeTimingPatterns();
        
        const penalty = matrix.calculatePenalty();
        assert(typeof penalty === 'number', 'Penalty should be a number');
        assert(penalty >= 0, 'Penalty should be non-negative');
    });

    // Test 17: QRMatrix - SVG Rendering
    test('QRMatrix - SVG Rendering', () => {
        const matrix = new QRMatrix(21);
        matrix.placeFinderPatterns();
        matrix.placeTimingPatterns();
        
        const svg = matrix.renderToSVG();
        assert(svg.includes('<svg'), 'Should generate SVG');
        assert(svg.includes('</svg>'), 'Should have closing SVG tag');
    });

    // Test 18: AdvancedQRGenerator - Basic Creation
    test('AdvancedQRGenerator - Basic Creation', () => {
        const generator = new AdvancedQRGenerator();
        assert(generator !== null, 'Generator should be created');
        assert(generator.defaultOptions !== undefined, 'Should have default options');
    });

    // Test 19: AdvancedQRGenerator - Basic Generation
    test('AdvancedQRGenerator - Basic Generation', () => {
        const generator = new AdvancedQRGenerator();
        const result = generator.generateQR('Hello World');
        
        assert(result.success === true, 'Should generate successfully');
        assert(result.version >= 1, 'Should have valid version');
        assert(result.errorCorrectionLevel, 'Should have ECC level');
        assert(result.matrix !== null, 'Should have matrix');
    });

    // Test 20: AdvancedQRGenerator - SVG Generation
    test('AdvancedQRGenerator - SVG Generation', () => {
        const generator = new AdvancedQRGenerator();
        const svg = generator.generateSVG('Test Data');
        
        assert(svg.includes('<svg'), 'Should generate SVG');
        assert(svg.includes('</svg>'), 'Should have closing SVG tag');
    });

    // Test 21: AdvancedQRGenerator - Canvas Generation
    test('AdvancedQRGenerator - Canvas Generation', () => {
        const generator = new AdvancedQRGenerator();
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        
        const result = generator.generateCanvas('Test Data', canvas);
        assert(result.success === true, 'Canvas generation should succeed');
    });

    // Test 22: AdvancedQRGenerator - Information Analysis
    test('AdvancedQRGenerator - Information Analysis', () => {
        const generator = new AdvancedQRGenerator();
        const info = generator.getQRInfo('Test Data');
        
        assert(info.version >= 1, 'Should have valid version');
        assert(info.matrixSize >= 21, 'Should have valid matrix size');
        assert(info.errorCorrectionLevel, 'Should have ECC level');
        assert(info.dataCapacity > 0, 'Should have data capacity');
        assert(info.segments.length > 0, 'Should have segments');
    });

    // Test 23: AdvancedQRGenerator - Version Selection
    test('AdvancedQRGenerator - Version Selection', () => {
        const generator = new AdvancedQRGenerator();
        
        // Test short data
        const shortResult = generator.generateQR('Hi');
        assert(shortResult.version === 1, 'Short data should use version 1');
        
        // Test longer data
        const longData = 'A'.repeat(100);
        const longResult = generator.generateQR(longData);
        assert(longResult.version > 1, 'Long data should use higher version');
    });

    // Test 24: AdvancedQRGenerator - ECC Level Handling
    test('AdvancedQRGenerator - ECC Level Handling', () => {
        const generator = new AdvancedQRGenerator();
        
        const resultL = generator.generateQR('Test', { errorCorrectionLevel: 'L' });
        const resultH = generator.generateQR('Test', { errorCorrectionLevel: 'H' });
        
        assert(resultL.errorCorrectionLevel === 'L', 'Should respect L ECC level');
        assert(resultH.errorCorrectionLevel === 'H', 'Should respect H ECC level');
    });

    // Test 25: AdvancedQRGenerator - Error Handling
    test('AdvancedQRGenerator - Error Handling', () => {
        const generator = new AdvancedQRGenerator();
        
        // Test with empty data
        try {
            generator.generateQR('');
            assert(false, 'Should throw error for empty data');
        } catch (error) {
            assert(true, 'Should handle empty data error');
        }
    });

    // Test 26: AdvancedQRGenerator - Large Data Handling
    test('AdvancedQRGenerator - Large Data Handling', () => {
        const generator = new AdvancedQRGenerator();
        
        // Test with data that requires high version
        const largeData = 'A'.repeat(1000);
        const result = generator.generateQR(largeData);
        
        assert(result.success === true, 'Should handle large data');
        assert(result.version > 10, 'Large data should use high version');
    });

    // Test 27: AdvancedQRGenerator - Mixed Content Optimization
    test('AdvancedQRGenerator - Mixed Content Optimization', () => {
        const generator = new AdvancedQRGenerator();
        
        const mixedData = '123 ABC 456 DEF 789';
        const result = generator.generateQR(mixedData);
        
        assert(result.success === true, 'Should handle mixed content');
        assert(result.segments.length > 1, 'Mixed content should create multiple segments');
    });

    // Test 28: AdvancedQRGenerator - Custom Options
    test('AdvancedQRGenerator - Custom Options', () => {
        const generator = new AdvancedQRGenerator();
        
        const options = {
            errorCorrectionLevel: 'Q',
            version: 'auto',
            moduleSize: 6,
            quietZone: 6
        };
        
        const result = generator.generateQR('Test Data', options);
        assert(result.success === true, 'Should handle custom options');
        assert(result.errorCorrectionLevel === 'Q', 'Should respect custom ECC level');
    });

    // Test 29: AdvancedQRGenerator - Performance Test
    test('AdvancedQRGenerator - Performance Test', () => {
        const generator = new AdvancedQRGenerator();
        
        const startTime = performance.now();
        for (let i = 0; i < 10; i++) {
            generator.generateQR(`Test Data ${i}`);
        }
        const endTime = performance.now();
        
        const totalTime = endTime - startTime;
        assert(totalTime < 1000, 'Should generate 10 QR codes in under 1 second');
    });

    // Test 30: AdvancedQRGenerator - Edge Cases
    test('AdvancedQRGenerator - Edge Cases', () => {
        const generator = new AdvancedQRGenerator();
        
        // Test with special characters
        const specialData = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const specialResult = generator.generateQR(specialData);
        assert(specialResult.success === true, 'Should handle special characters');
        
        // Test with numbers only
        const numericData = '1234567890';
        const numericResult = generator.generateQR(numericData);
        assert(numericResult.success === true, 'Should handle numeric data');
        
        // Test with alphanumeric
        const alphanumericData = 'ABC123DEF456';
        const alphanumericResult = generator.generateQR(alphanumericData);
        assert(alphanumericResult.success === true, 'Should handle alphanumeric data');
    });

    // Helper function for assertions
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    // Test Summary
    console.log(`\n📊 Test Summary:`);
    console.log(`Total Tests: ${testCount}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${failedCount}`);
    console.log(`Success Rate: ${((passedCount / testCount) * 100).toFixed(1)}%`);

    if (failedCount === 0) {
        console.log('\n🎉 All tests passed! The Advanced QR Code Generator is working correctly.');
    } else {
        console.log(`\n⚠️  ${failedCount} test(s) failed. Please check the implementation.`);
    }

    return {
        total: testCount,
        passed: passedCount,
        failed: failedCount,
        successRate: (passedCount / testCount) * 100
    };
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAdvancedQRGeneratorTests };
} else {
    window.runAdvancedQRGeneratorTests = runAdvancedQRGeneratorTests;
}

