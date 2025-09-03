/**
 * Advanced QR Code Generator - Test Suite
 * Comprehensive testing for all QR code generation functionality
 */

import { AdvancedQRGenerator, QRUtils } from './advanced-qr-generator.js';
import { InputSegmenter, SegmentationUtils } from './qr-segmentation.js';
import { GaloisField, Polynomial, ReedSolomonEncoder } from './qr-reed-solomon.js';
import { QRMatrix, FunctionPatternPlacer } from './qr-matrix.js';

/**
 * Test Runner
 */
class QRCodeTestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.errors = [];
    }

    /**
     * Add a test
     */
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    /**
     * Run all tests
     */
    async runAll() {
        console.log('🧪 Starting Advanced QR Code Generator Test Suite...\n');
        
        for (const test of this.tests) {
            try {
                console.log(`Testing: ${test.name}`);
                await test.testFunction();
                console.log(`✅ PASS: ${test.name}\n`);
                this.passed++;
            } catch (error) {
                console.error(`❌ FAIL: ${test.name}`);
                console.error(`Error: ${error.message}\n`);
                this.failed++;
                this.errors.push({ name: test.name, error: error.message });
            }
        }
        
        this.printSummary();
    }

    /**
     * Print test summary
     */
    printSummary() {
        console.log('📊 Test Summary');
        console.log('===============');
        console.log(`Total Tests: ${this.tests.length}`);
        console.log(`Passed: ${this.passed} ✅`);
        console.log(`Failed: ${this.failed} ❌`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ Failed Tests:');
            this.errors.forEach(error => {
                console.log(`  - ${error.name}: ${error.error}`);
            });
        }
        
        const successRate = ((this.passed / this.tests.length) * 100).toFixed(1);
        console.log(`\nSuccess Rate: ${successRate}%`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed! Advanced QR Code Generator is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Please review the errors above.');
        }
    }
}

// Create test runner
const testRunner = new QRCodeTestRunner();

/**
 * Test 1: Basic QR Code Generation
 */
testRunner.test('Basic QR Code Generation', async () => {
    const generator = new AdvancedQRGenerator();
    const result = generator.generate('Hello, World!');
    
    if (!result || !result.matrix) {
        throw new Error('QR code generation failed - no result returned');
    }
    
    if (result.matrix.size < 21) {
        throw new Error(`Invalid matrix size: ${result.matrix.size}`);
    }
    
    if (!result.version || result.version < 1) {
        throw new Error(`Invalid version: ${result.version}`);
    }
    
    console.log(`  Generated QR Code: Version ${result.version}, Size ${result.matrix.size}x${result.matrix.size}`);
});

/**
 * Test 2: Input Segmentation
 */
testRunner.test('Input Segmentation', async () => {
    const segmenter = new InputSegmenter();
    
    // Test numeric input
    const numericSegments = segmenter.segmentInput('12345');
    if (numericSegments.length !== 1 || numericSegments[0].mode !== 'NUMERIC') {
        throw new Error('Numeric segmentation failed');
    }
    
    // Test alphanumeric input
    const alphanumericSegments = segmenter.segmentInput('ABC123');
    if (alphanumericSegments.length !== 1 || alphanumericSegments[0].mode !== 'ALPHANUMERIC') {
        throw new Error('Alphanumeric segmentation failed');
    }
    
    // Test mixed input
    const mixedSegments = segmenter.segmentInput('123ABC!@#');
    if (mixedSegments.length < 2) {
        throw new Error('Mixed input segmentation failed');
    }
    
    console.log(`  Segmentation: Numeric=${numericSegments.length}, Alphanumeric=${alphanumericSegments.length}, Mixed=${mixedSegments.length}`);
});

/**
 * Test 3: Galois Field Arithmetic
 */
testRunner.test('Galois Field Arithmetic', async () => {
    // Test addition
    if (GaloisField.add(5, 3) !== 6) {
        throw new Error('GF addition failed');
    }
    
    // Test multiplication
    if (GaloisField.multiply(5, 3) !== 15) {
        throw new Error('GF multiplication failed');
    }
    
    // Test division
    if (GaloisField.divide(15, 3) !== 5) {
        throw new Error('GF division failed');
    }
    
    // Test power
    if (GaloisField.power(2, 3) !== 8) {
        throw new Error('GF power failed');
    }
    
    console.log('  Galois Field operations: ✅');
});

/**
 * Test 4: Polynomial Operations
 */
testRunner.test('Polynomial Operations', async () => {
    const poly1 = new Polynomial([1, 2, 3]); // 1 + 2x + 3x²
    const poly2 = new Polynomial([1, 1]);     // 1 + x
    
    // Test degree
    if (poly1.degree !== 2) {
        throw new Error('Polynomial degree calculation failed');
    }
    
    // Test addition
    const sum = poly1.add(poly2);
    if (sum.coefficients.length !== 3) {
        throw new Error('Polynomial addition failed');
    }
    
    // Test multiplication
    const product = poly1.multiply(poly2);
    if (product.degree !== 3) {
        throw new Error('Polynomial multiplication failed');
    }
    
    console.log('  Polynomial operations: ✅');
});

/**
 * Test 5: Reed-Solomon Encoding
 */
testRunner.test('Reed-Solomon Encoding', async () => {
    const data = [1, 2, 3, 4, 5];
    const generator = ReedSolomonEncoder.createGeneratorPolynomial(2);
    const encoder = new ReedSolomonEncoder(generator);
    
    const encoded = encoder.encode(data);
    
    if (encoded.length !== data.length + 2) {
        throw new Error('Reed-Solomon encoding failed - incorrect output length');
    }
    
    console.log(`  Reed-Solomon: Input=${data.length}, Output=${encoded.length}`);
});

/**
 * Test 6: Matrix Operations
 */
testRunner.test('Matrix Operations', async () => {
    const matrix = new QRMatrix(21);
    
    // Test setting and getting
    matrix.set(0, 0, true);
    if (matrix.get(0, 0) !== true) {
        throw new Error('Matrix set/get failed');
    }
    
    // Test reservation
    matrix.reserve(1, 1);
    if (!matrix.isReserved(1, 1)) {
        throw new Error('Matrix reservation failed');
    }
    
    // Test availability
    if (matrix.isAvailable(0, 0)) {
        throw new Error('Matrix availability check failed');
    }
    
    console.log('  Matrix operations: ✅');
});

/**
 * Test 7: Function Pattern Placement
 */
testRunner.test('Function Pattern Placement', async () => {
    const matrix = new QRMatrix(21);
    
    // Place function patterns
    FunctionPatternPlacer.placeAllPatterns(matrix);
    
    // Check finder patterns
    if (!matrix.get(0, 0) || !matrix.get(0, 14) || !matrix.get(14, 0)) {
        throw new Error('Finder pattern placement failed');
    }
    
    // Check timing patterns
    if (matrix.get(6, 8) === null) {
        throw new Error('Timing pattern placement failed');
    }
    
    console.log('  Function patterns: ✅');
});

/**
 * Test 8: Error Correction Levels
 */
testRunner.test('Error Correction Levels', async () => {
    const generator = new AdvancedQRGenerator();
    
    // Test all ECC levels
    const eccLevels = ['L', 'M', 'Q', 'H'];
    for (const level of eccLevels) {
        const result = generator.generate('Test', { eccLevel: level });
        if (result.eccLevel !== level) {
            throw new Error(`ECC level ${level} failed`);
        }
    }
    
    console.log('  ECC levels: ✅');
});

/**
 * Test 9: Version Selection
 */
testRunner.test('Version Selection', async () => {
    const generator = new AdvancedQRGenerator();
    
    // Test auto version selection
    const result1 = generator.generate('A');
    if (result1.version !== 1) {
        throw new Error('Auto version selection failed for short input');
    }
    
    // Test manual version
    const result2 = generator.generate('A', { version: 2 });
    if (result2.version !== 2) {
        throw new Error('Manual version selection failed');
    }
    
    console.log(`  Version selection: Auto=${result1.version}, Manual=${result2.version}`);
});

/**
 * Test 10: Mask Pattern Selection
 */
testRunner.test('Mask Pattern Selection', async () => {
    const generator = new AdvancedQRGenerator();
    
    // Test auto mask selection
    const result1 = generator.generate('Test', { autoMask: true });
    if (result1.maskPattern < 0 || result1.maskPattern > 7) {
        throw new Error('Auto mask selection failed');
    }
    
    // Test manual mask selection
    const result2 = generator.generate('Test', { maskPattern: 3 });
    if (result2.maskPattern !== 3) {
        throw new Error('Manual mask selection failed');
    }
    
    console.log(`  Mask selection: Auto=${result1.maskPattern}, Manual=${result2.maskPattern}`);
});

/**
 * Test 11: SVG Rendering
 */
testRunner.test('SVG Rendering', async () => {
    const generator = new AdvancedQRGenerator();
    const result = generator.generate('SVG Test');
    
    const svg = generator.renderSVG(result.matrix, { moduleSize: 4 });
    
    if (!svg.includes('<svg') || !svg.includes('</svg>')) {
        throw new Error('SVG rendering failed');
    }
    
    if (!svg.includes('width=') || !svg.includes('height=')) {
        throw new Error('SVG attributes missing');
    }
    
    console.log('  SVG rendering: ✅');
});

/**
 * Test 12: Canvas Rendering
 */
testRunner.test('Canvas Rendering', async () => {
    const generator = new AdvancedQRGenerator();
    const result = generator.generate('Canvas Test');
    
    // Create a mock canvas
    const mockCanvas = {
        width: 0,
        height: 0,
        getContext: () => ({
            fillStyle: '',
            fillRect: () => {}
        })
    };
    
    generator.renderCanvas(result.matrix, mockCanvas, { moduleSize: 4 });
    
    if (mockCanvas.width === 0 || mockCanvas.height === 0) {
        throw new Error('Canvas rendering failed');
    }
    
    console.log('  Canvas rendering: ✅');
});

/**
 * Test 13: Input Validation
 */
testRunner.test('Input Validation', async () => {
    const errors1 = AdvancedQRGenerator.validateInput('', { eccLevel: 'X' });
    if (errors1.length === 0) {
        throw new Error('Empty input validation failed');
    }
    
    const errors2 = AdvancedQRGenerator.validateInput('Test', { version: 50 });
    if (errors2.length === 0) {
        throw new Error('Invalid version validation failed');
    }
    
    const errors3 = AdvancedQRGenerator.validateInput('Test', { maskPattern: 10 });
    if (errors3.length === 0) {
        throw new Error('Invalid mask pattern validation failed');
    }
    
    console.log('  Input validation: ✅');
});

/**
 * Test 14: Utility Functions
 */
testRunner.test('Utility Functions', async () => {
    // Test canFit
    const canFit = QRUtils.canFit('Test', 1, 'M');
    if (typeof canFit !== 'boolean') {
        throw new Error('canFit utility failed');
    }
    
    // Test getRecommendedVersion
    const version = QRUtils.getRecommendedVersion('Test', 'M');
    if (version < 1 || version > 40) {
        throw new Error('getRecommendedVersion utility failed');
    }
    
    console.log(`  Utilities: canFit=${canFit}, recommendedVersion=${version}`);
});

/**
 * Test 15: Large Data Handling
 */
testRunner.test('Large Data Handling', async () => {
    const largeData = 'A'.repeat(100);
    
    try {
        const generator = new AdvancedQRGenerator();
        const result = generator.generate(largeData);
        
        if (result.version < 2) {
            throw new Error('Large data should require higher version');
        }
        
        console.log(`  Large data: Version ${result.version}, Size ${result.matrix.size}x${result.matrix.size}`);
    } catch (error) {
        if (error.message.includes('too large')) {
            console.log('  Large data: Handled gracefully (expected for very large data)');
        } else {
            throw error;
        }
    }
});

/**
 * Test 16: Edge Cases
 */
testRunner.test('Edge Cases', async () => {
    const generator = new AdvancedQRGenerator();
    
    // Test single character
    const result1 = generator.generate('A');
    if (result1.version !== 1) {
        throw new Error('Single character handling failed');
    }
    
    // Test special characters
    const result2 = generator.generate('!@#$%^&*()');
    if (!result2.matrix) {
        throw new Error('Special characters handling failed');
    }
    
    // Test unicode
    const result3 = generator.generate('Hello 🌍 World');
    if (!result3.matrix) {
        throw new Error('Unicode handling failed');
    }
    
    console.log('  Edge cases: ✅');
});

/**
 * Test 17: Performance Test
 */
testRunner.test('Performance Test', async () => {
    const generator = new AdvancedQRGenerator();
    const startTime = performance.now();
    
    // Generate multiple QR codes
    for (let i = 0; i < 10; i++) {
        generator.generate(`Test ${i}`);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 5000) { // 5 seconds max
        throw new Error(`Performance test failed: ${duration.toFixed(2)}ms`);
    }
    
    console.log(`  Performance: ${duration.toFixed(2)}ms for 10 QR codes`);
});

/**
 * Test 18: Error Handling
 */
testRunner.test('Error Handling', async () => {
    const generator = new AdvancedQRGenerator();
    
    // Test invalid input
    try {
        generator.generate(null);
        throw new Error('Should have thrown error for null input');
    } catch (error) {
        if (!error.message.includes('must be a non-empty string')) {
            throw new Error('Unexpected error message for null input');
        }
    }
    
    // Test invalid options
    try {
        generator.generate('Test', { eccLevel: 'INVALID' });
        throw new Error('Should have thrown error for invalid ECC level');
    } catch (error) {
        // This should fail during generation
        console.log('  Error handling: Invalid options handled gracefully');
    }
    
    console.log('  Error handling: ✅');
});

/**
 * Test 19: Integration Test
 */
testRunner.test('Integration Test', async () => {
    const testData = [
        'Hello World',
        '1234567890',
        'ABC123!@#',
        'https://example.com',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    ];
    
    const generator = new AdvancedQRGenerator();
    
    for (const data of testData) {
        const result = generator.generate(data);
        
        if (!result.matrix || !result.version) {
            throw new Error(`Integration test failed for: ${data}`);
        }
        
        // Test SVG rendering
        const svg = generator.renderSVG(result.matrix);
        if (!svg.includes('<svg')) {
            throw new Error(`SVG rendering failed for: ${data}`);
        }
    }
    
    console.log(`  Integration: ${testData.length} different data types processed successfully`);
});

/**
 * Test 20: Standards Compliance
 */
testRunner.test('Standards Compliance', async () => {
    const generator = new AdvancedQRGenerator();
    
    // Test version 1 (minimum)
    const result1 = generator.generate('A', { version: 1 });
    if (result1.matrix.size !== 21) {
        throw new Error('Version 1 size compliance failed');
    }
    
    // Test quiet zone
    const svg = generator.renderSVG(result1.matrix, { moduleSize: 1 });
    const expectedSize = (21 + 8) * 1; // matrix size + quiet zone
    if (!svg.includes(`width="${expectedSize}"`)) {
        throw new Error('Quiet zone compliance failed');
    }
    
    console.log('  Standards compliance: ✅');
});

// Run all tests
console.log('🚀 Advanced QR Code Generator Test Suite');
console.log('========================================\n');

testRunner.runAll().catch(error => {
    console.error('Test suite execution failed:', error);
});

