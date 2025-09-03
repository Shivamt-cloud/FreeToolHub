// Unit Converter Test Suite
// Tests the advanced unit converter functionality

// Test runner for both Node.js and browser environments
class UnitConverterTestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.errors = [];
    }

    // Add a test to the suite
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    // Assertion helper functions
    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} Expected ${expected}, but got ${actual}`);
        }
    }

    assertApproxEqual(actual, expected, tolerance = 0.0001, message = '') {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(`${message} Expected ${expected} ± ${tolerance}, but got ${actual}`);
        }
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`${message} Expected true, but got ${condition}`);
        }
    }

    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(`${message} Expected false, but got ${condition}`);
        }
    }

    // Run all tests
    runAllTests() {
        console.log('🧪 Running Unit Converter Tests...\n');
        
        this.tests.forEach((test, index) => {
            try {
                test.testFunction();
                this.passed++;
                console.log(`✅ ${index + 1}. ${test.name}`);
            } catch (error) {
                this.failed++;
                this.errors.push({ test: test.name, error: error.message });
                console.log(`❌ ${index + 1}. ${test.name}`);
                console.log(`   Error: ${error.message}`);
            }
        });

        this.printSummary();
    }

    // Print test summary
    printSummary() {
        console.log('\n📊 Test Summary');
        console.log('================');
        console.log(`Total Tests: ${this.tests.length}`);
        console.log(`Passed: ${this.passed} ✅`);
        console.log(`Failed: ${this.failed} ❌`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ Failed Tests:');
            this.errors.forEach(({ test, error }) => {
                console.log(`   ${test}: ${error}`);
            });
        }
        
        const successRate = ((this.passed / this.tests.length) * 100).toFixed(1);
        console.log(`\nSuccess Rate: ${successRate}%`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed! The Unit Converter is working perfectly.');
        } else {
            console.log('\n⚠️  Some tests failed. Please check the implementation.');
        }
    }
}

// Create test suite
const testSuite = new UnitConverterTestSuite();

// Test 1: Basic Unit Converter Creation
testSuite.test('Unit Converter Creation', () => {
    const converter = new UnitConverter();
    testSuite.assertTrue(converter instanceof UnitConverter);
    testSuite.assertTrue(converter.registry instanceof UnitRegistry);
});

// Test 2: Length Conversions (Exact Constants)
testSuite.test('Length Conversions - Exact Constants', () => {
    const converter = new UnitConverter();
    
    // Test inch to meter (exact: 1 in = 0.0254 m)
    const result1 = converter.convert(1, 'inch', 'm');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 0.0254);
    
    // Test mile to meter (exact: 1 mi = 1609.344 m)
    const result2 = converter.convert(1, 'mi', 'm');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 1609.344);
    
    // Test 5 miles to kilometers
    const result3 = converter.convert(5, 'mi', 'km');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 8.047);
});

// Test 3: Mass Conversions (Exact Constants)
testSuite.test('Mass Conversions - Exact Constants', () => {
    const converter = new UnitConverter();
    
    // Test pound to kilogram (exact: 1 lb = 0.45359237 kg)
    const result1 = converter.convert(1, 'lb', 'kg');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 0.45359237);
    
    // Test 150 pounds to kilograms
    const result2 = converter.convert(150, 'lb', 'kg');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 68.039);
    
    // Test ounce to gram
    const result3 = converter.convert(1, 'oz', 'g');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 28.35);
});

// Test 4: Volume Conversions (Exact Constants)
testSuite.test('Volume Conversions - Exact Constants', () => {
    const converter = new UnitConverter();
    
    // Test US gallon to liter (exact: 1 US gal = 231 in³)
    const result1 = converter.convert(1, 'galUS', 'L');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 3.785);
    
    // Test 2 US gallons to liters
    const result2 = converter.convert(2, 'galUS', 'L');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 7.571);
    
    // Test Imperial gallon to liter (exact: 1 imp gal = 4.54609 L)
    const result3 = converter.convert(1, 'galImp', 'L');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 4.546);
});

// Test 5: Temperature Conversions (Affine Transformations)
testSuite.test('Temperature Conversions - Affine Transformations', () => {
    const converter = new UnitConverter();
    
    // Test Fahrenheit to Celsius: °C = (°F - 32) × 5/9
    const result1 = converter.convert(32, 'F', 'C');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 0);
    
    const result2 = converter.convert(212, 'F', 'C');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 100);
    
    const result3 = converter.convert(72, 'F', 'C');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 22.22);
    
    // Test Celsius to Kelvin: K = °C + 273.15
    const result4 = converter.convert(0, 'C', 'K');
    testSuite.assertTrue(result4.success);
    testSuite.assertApproxEqual(result4.value, 273.15);
    
    const result5 = converter.convert(100, 'C', 'K');
    testSuite.assertTrue(result5.success);
    testSuite.assertApproxEqual(result5.value, 373.15);
});

// Test 6: Pressure Conversions (Exact Constants)
testSuite.test('Pressure Conversions - Exact Constants', () => {
    const converter = new UnitConverter();
    
    // Test atmosphere to Pascal (exact: 1 atm = 101,325 Pa)
    const result1 = converter.convert(1, 'atm', 'Pa');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 101325);
    
    // Test 2 atmospheres to Pascals
    const result2 = converter.convert(2, 'atm', 'Pa');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 202650);
    
    // Test bar to Pascal (exact: 1 bar = 100,000 Pa)
    const result3 = converter.convert(1, 'bar', 'Pa');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 100000);
});

// Test 7: Data Storage Conversions (SI vs IEC)
testSuite.test('Data Storage Conversions - SI vs IEC', () => {
    const converter = new UnitConverter();
    
    // Test SI decimal: 1 MB = 1,000,000 B
    const result1 = converter.convert(1, 'MB', 'B');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 1000000);
    
    // Test IEC binary: 1 MiB = 1,048,576 B
    const result2 = converter.convert(1, 'MiB', 'B');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 1048576);
    
    // Test 5000 MB (decimal) to GiB (binary)
    const result3 = converter.convert(5000, 'MB', 'GiB');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 4.657);
});

// Test 8: Area Conversions
testSuite.test('Area Conversions', () => {
    const converter = new UnitConverter();
    
    // Test square meter to square foot
    const result1 = converter.convert(1, 'm2', 'ft2');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 10.76);
    
    // Test acre to square meters
    const result2 = converter.convert(1, 'ac', 'm2');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 4046.86);
    
    // Test hectare to square meters
    const result3 = converter.convert(1, 'ha', 'm2');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 10000);
});

// Test 9: Speed Conversions
testSuite.test('Speed Conversions', () => {
    const converter = new UnitConverter();
    
    // Test meters per second to kilometers per hour
    const result1 = converter.convert(1, 'm/s', 'km/h');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 3.6);
    
    // Test miles per hour to meters per second
    const result2 = converter.convert(60, 'mph', 'm/s');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 26.82);
    
    // Test knot to meters per second
    const result3 = converter.convert(1, 'knot', 'm/s');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 0.514);
});

// Test 10: Time Conversions
testSuite.test('Time Conversions', () => {
    const converter = new UnitConverter();
    
    // Test minute to seconds
    const result1 = converter.convert(1, 'min', 's');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 60);
    
    // Test hour to seconds
    const result2 = converter.convert(1, 'h', 's');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 3600);
    
    // Test day to hours
    const result3 = converter.convert(1, 'd', 'h');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 24);
});

// Test 11: Dimensional Validation
testSuite.test('Dimensional Validation', () => {
    const converter = new UnitConverter();
    
    // Test valid conversion (same dimension)
    const result1 = converter.validateConversion('m', 'km');
    testSuite.assertTrue(result1.valid);
    testSuite.assertEqual(result1.dimension, 'length');
    
    // Test invalid conversion (different dimensions)
    const result2 = converter.validateConversion('m', 'kg');
    testSuite.assertFalse(result2.valid);
    testSuite.assertTrue(result2.error.includes('Cannot convert between'));
    
    // Test invalid conversion (temperature to volume)
    const result3 = converter.validateConversion('C', 'L');
    testSuite.assertFalse(result3.valid);
});

// Test 12: Unit System Information
testSuite.test('Unit System Information', () => {
    const converter = new UnitConverter();
    
    // Test SI units
    testSuite.assertEqual(converter.getUnitSystem('m'), 'SI');
    testSuite.assertEqual(converter.getUnitSystem('kg'), 'SI');
    testSuite.assertEqual(converter.getUnitSystem('L'), 'SI');
    
    // Test US units
    testSuite.assertEqual(converter.getUnitSystem('inch'), 'US');
    testSuite.assertEqual(converter.getUnitSystem('lb'), 'US');
    testSuite.assertEqual(converter.getUnitSystem('galUS'), 'US');
    
    // Test Imperial units
    testSuite.assertEqual(converter.getUnitSystem('st'), 'Imperial');
    testSuite.assertEqual(converter.getUnitSystem('galImp'), 'Imperial');
    
    // Test IEC units
    testSuite.assertEqual(converter.getUnitSystem('KiB'), 'IEC');
    testSuite.assertEqual(converter.getUnitSystem('MiB'), 'IEC');
});

// Test 13: Conversion Information
testSuite.test('Conversion Information', () => {
    const converter = new UnitConverter();
    
    // Test linear conversion info
    const info1 = converter.getConversionInfo('m', 'km');
    testSuite.assertEqual(info1.type, 'linear');
    testSuite.assertEqual(info1.factor, 1000);
    testSuite.assertTrue(info1.formula.includes('km = 1000 × m'));
    
    // Test temperature conversion info
    const info2 = converter.getConversionInfo('F', 'C');
    testSuite.assertEqual(info2.type, 'affine');
    testSuite.assertTrue(info2.formula.includes('°C = (°F - 32) × 5/9'));
    
    // Test invalid conversion info
    const info3 = converter.getConversionInfo('m', 'kg');
    testSuite.assertEqual(info3.type, 'error');
});

// Test 14: Common Conversions
testSuite.test('Common Conversions', () => {
    const converter = new UnitConverter();
    
    // Test common conversions for meter
    const commonConversions = converter.getCommonConversions('m');
    testSuite.assertTrue(commonConversions.length > 0);
    
    // Verify some common conversions exist
    const hasCm = commonConversions.some(c => c.targetUnit === 'cm');
    const hasKm = commonConversions.some(c => c.targetUnit === 'km');
    testSuite.assertTrue(hasCm);
    testSuite.assertTrue(hasKm);
});

// Test 15: Unit Categories
testSuite.test('Unit Categories', () => {
    const converter = new UnitConverter();
    
    const categories = converter.getUnitCategories();
    testSuite.assertTrue(categories.hasOwnProperty('Length & Distance'));
    testSuite.assertTrue(categories.hasOwnProperty('Mass & Weight'));
    testSuite.assertTrue(categories.hasOwnProperty('Volume & Capacity'));
    testSuite.assertTrue(categories.hasOwnProperty('Temperature'));
    testSuite.assertTrue(categories.hasOwnProperty('Data Storage'));
    
    // Test that length category has expected units
    const lengthUnits = categories['Length & Distance'];
    testSuite.assertTrue(lengthUnits.includes('m'));
    testSuite.assertTrue(lengthUnits.includes('inch'));
    testSuite.assertTrue(lengthUnits.includes('mi'));
});

// Test 16: Available Dimensions
testSuite.test('Available Dimensions', () => {
    const converter = new UnitConverter();
    
    const dimensions = converter.getAvailableDimensions();
    testSuite.assertTrue(dimensions.includes('length'));
    testSuite.assertTrue(dimensions.includes('mass'));
    testSuite.assertTrue(dimensions.includes('volume'));
    testSuite.assertTrue(dimensions.includes('temperature'));
    testSuite.assertTrue(dimensions.includes('data'));
});

// Test 17: Units for Dimension
testSuite.test('Units for Dimension', () => {
    const converter = new UnitConverter();
    
    const lengthUnits = converter.getUnitsForDimension('length');
    testSuite.assertTrue(lengthUnits.length > 0);
    
    // Check that units have required properties
    const firstUnit = lengthUnits[0];
    testSuite.assertTrue(firstUnit.hasOwnProperty('name'));
    testSuite.assertTrue(firstUnit.hasOwnProperty('displayName'));
    testSuite.assertTrue(firstUnit.hasOwnProperty('system'));
    testSuite.assertTrue(firstUnit.hasOwnProperty('dimension'));
    
    // Check that all units are for the correct dimension
    lengthUnits.forEach(unit => {
        testSuite.assertEqual(unit.dimension, 'length');
    });
});

// Test 18: Display Names
testSuite.test('Display Names', () => {
    const converter = new UnitConverter();
    
    // Test some display names
    testSuite.assertEqual(converter.getDisplayName('m'), 'Meter (m)');
    testSuite.assertEqual(converter.getDisplayName('kg'), 'Kilogram (kg)');
    testSuite.assertEqual(converter.getDisplayName('lb'), 'Pound (lb)');
    testSuite.assertEqual(converter.getDisplayName('galUS'), 'US Gallon (gal)');
    testSuite.assertEqual(converter.getDisplayName('KiB'), 'Kibibyte (KiB)');
});

// Test 19: System Information
testSuite.test('System Information', () => {
    const converter = new UnitConverter();
    
    const systemInfo = converter.getSystemInfo();
    testSuite.assertTrue(systemInfo.hasOwnProperty('SI'));
    testSuite.assertTrue(systemInfo.hasOwnProperty('US'));
    testSuite.assertTrue(systemInfo.hasOwnProperty('Imperial'));
    testSuite.assertTrue(systemInfo.hasOwnProperty('IEC'));
    
    // Test some descriptions
    testSuite.assertTrue(systemInfo.SI.includes('International System'));
    testSuite.assertTrue(systemInfo.US.includes('United States'));
    testSuite.assertTrue(systemInfo.IEC.includes('International Electrotechnical'));
});

// Test 20: Error Handling
testSuite.test('Error Handling', () => {
    const converter = new UnitConverter();
    
    // Test invalid value
    const result1 = converter.convert('invalid', 'm', 'km');
    testSuite.assertFalse(result1.success);
    testSuite.assertTrue(result1.error.includes('Value must be a valid number'));
    
    // Test unknown unit
    const result2 = converter.convert(1, 'unknown', 'm');
    testSuite.assertFalse(result2.success);
    testSuite.assertTrue(result2.error.includes('Unknown unit'));
    
    // Test NaN value
    const result3 = converter.convert(NaN, 'm', 'km');
    testSuite.assertFalse(result3.success);
    testSuite.assertTrue(result3.error.includes('Value must be a valid number'));
});

// Test 21: Precision Handling
testSuite.test('Precision Handling', () => {
    const converter = new UnitConverter();
    
    // Test default precision (6 decimal places)
    const result1 = converter.convert(1, 'inch', 'm');
    testSuite.assertTrue(result1.success);
    testSuite.assertEqual(result1.precision, 6);
    
    // Test custom precision
    const result2 = converter.convert(1, 'inch', 'm', 3);
    testSuite.assertTrue(result2.success);
    testSuite.assertEqual(result2.precision, 3);
    
    // Test that result respects precision
    const valueStr = result2.value.toString();
    const decimalPlaces = valueStr.includes('.') ? valueStr.split('.')[1].length : 0;
    testSuite.assertTrue(decimalPlaces <= 3);
});

// Test 22: Registry Functionality
testSuite.test('Registry Functionality', () => {
    const registry = new UnitRegistry();
    
    // Test setting base units
    registry.setBase('test', 'baseUnit');
    testSuite.assertEqual(registry.dimBase['test'], 'baseUnit');
    
    // Test adding linear unit
    registry.addLinearUnit('testUnit', 'test', 2.0, 'testSystem');
    testSuite.assertTrue(registry.units.hasOwnProperty('testUnit'));
    testSuite.assertEqual(registry.units['testUnit'].factor, 2.0);
    testSuite.assertTrue(registry.units['testUnit'].linear);
    
    // Test adding affine unit
    registry.addAffineUnit('affineUnit', 'test', 3.0, 1.0, 'testSystem');
    testSuite.assertTrue(registry.units.hasOwnProperty('affineUnit'));
    testSuite.assertEqual(registry.units['affineUnit'].factor, 3.0);
    testSuite.assertEqual(registry.units['affineUnit'].offset, 1.0);
    testSuite.assertFalse(registry.units['affineUnit'].linear);
});

// Test 23: Complex Conversions
testSuite.test('Complex Conversions', () => {
    const converter = new UnitConverter();
    
    // Test multi-step conversion: miles to centimeters
    const result1 = converter.convert(1, 'mi', 'cm');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, 160934.4);
    
    // Test pounds to milligrams
    const result2 = converter.convert(1, 'lb', 'mg');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 453592.37);
    
    // Test US gallons to cubic centimeters
    const result3 = converter.convert(1, 'galUS', 'cm3');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 3785.41);
});

// Test 24: Edge Cases
testSuite.test('Edge Cases', () => {
    const converter = new UnitConverter();
    
    // Test zero values
    const result1 = converter.convert(0, 'm', 'km');
    testSuite.assertTrue(result1.success);
    testSuite.assertEqual(result1.value, 0);
    
    // Test negative values
    const result2 = converter.convert(-5, 'C', 'F');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 23);
    
    // Test very large values
    const result3 = converter.convert(1000000, 'm', 'km');
    testSuite.assertTrue(result3.success);
    testSuite.assertEqual(result3.value, 1000);
    
    // Test very small values
    const result4 = converter.convert(0.000001, 'km', 'm');
    testSuite.assertTrue(result4.success);
    testSuite.assertEqual(result4.value, 0.001);
});

// Test 25: Temperature Edge Cases
testSuite.test('Temperature Edge Cases', () => {
    const converter = new UnitConverter();
    
    // Test absolute zero
    const result1 = converter.convert(0, 'K', 'C');
    testSuite.assertTrue(result1.success);
    testSuite.assertApproxEqual(result1.value, -273.15);
    
    // Test freezing point of water
    const result2 = converter.convert(32, 'F', 'C');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 0);
    
    // Test boiling point of water
    const result3 = converter.convert(212, 'F', 'C');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 100);
    
    // Test negative temperatures
    const result4 = converter.convert(-40, 'F', 'C');
    testSuite.assertTrue(result4.success);
    testSuite.assertApproxEqual(result4.value, -40);
});

// Test 26: Data Storage Edge Cases
testSuite.test('Data Storage Edge Cases', () => {
    const converter = new UnitConverter();
    
    // Test byte to byte (identity)
    const result1 = converter.convert(1, 'B', 'B');
    testSuite.assertTrue(result1.success);
    testSuite.assertEqual(result1.value, 1);
    
    // Test large data conversions
    const result2 = converter.convert(1, 'TB', 'GB');
    testSuite.assertTrue(result2.success);
    testSuite.assertEqual(result2.value, 1000);
    
    // Test binary to decimal confusion
    const result3 = converter.convert(1, 'MiB', 'MB');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 1.049);
    
    // Test decimal to binary
    const result4 = converter.convert(1, 'MB', 'MiB');
    testSuite.assertTrue(result4.success);
    testSuite.assertApproxEqual(result4.value, 0.954);
});

// Test 27: Pressure Edge Cases
testSuite.test('Pressure Edge Cases', () => {
    const converter = new UnitConverter();
    
    // Test standard atmospheric pressure
    const result1 = converter.convert(1, 'atm', 'Pa');
    testSuite.assertTrue(result1.success);
    testSuite.assertEqual(result1.value, 101325);
    
    // Test bar to atmosphere
    const result2 = converter.convert(1, 'bar', 'atm');
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, 0.987);
    
    // Test PSI to Pascal
    const result3 = converter.convert(1, 'psi', 'Pa');
    testSuite.assertTrue(result3.success);
    testSuite.assertApproxEqual(result3.value, 6894.76);
    
    // Test very high pressure
    const result4 = converter.convert(1000, 'MPa', 'Pa');
    testSuite.assertTrue(result4.success);
    testSuite.assertEqual(result4.value, 1000000000);
});

// Test 28: Volume Edge Cases
testSuite.test('Volume Edge Cases', () => {
    const converter = new UnitConverter();
    
    // Test cubic meter to liter
    const result1 = converter.convert(1, 'm3', 'L');
    testSuite.assertTrue(result1.success);
    testSuite.assertEqual(result1.value, 1000);
    
    // Test US vs Imperial gallon difference
    const result2 = converter.convert(1, 'galUS', 'L');
    const result3 = converter.convert(1, 'galImp', 'L');
    testSuite.assertTrue(result2.success);
    testSuite.assertTrue(result3.success);
    testSuite.assertTrue(result2.value < result3.value); // US gal < Imperial gal
    
    // Test small volumes
    const result4 = converter.convert(1, 'mL', 'cm3');
    testSuite.assertTrue(result4.success);
    testSuite.assertEqual(result4.value, 1);
    
    // Test large volumes
    const result5 = converter.convert(1, 'km3', 'm3');
    testSuite.assertTrue(result5.success);
    testSuite.assertEqual(result5.value, 1000000000);
});

// Test 29: Mass Edge Cases
testSuite.test('Mass Edge Cases', () => {
    const converter = new UnitConverter();
    
    // Test metric ton to kilogram
    const result1 = converter.convert(1, 't', 'kg');
    testSuite.assertTrue(result1.success);
    testSuite.assertEqual(result1.value, 1000);
    
    // Test US ton vs metric tonne
    const result2 = converter.convert(1, 'ton', 'kg');
    const result3 = converter.convert(1, 'tonne', 'kg');
    testSuite.assertTrue(result2.success);
    testSuite.assertTrue(result3.success);
    testSuite.assertTrue(result2.value < result3.value); // US ton < metric tonne
    
    // Test stone to kilogram
    const result4 = converter.convert(1, 'st', 'kg');
    testSuite.assertTrue(result4.success);
    testSuite.assertApproxEqual(result4.value, 6.35);
    
    // Test very small masses
    const result5 = converter.convert(1, 'mg', 'g');
    testSuite.assertTrue(result5.success);
    testSuite.assertEqual(result5.value, 0.001);
});

// Test 30: Comprehensive Round-trip Conversions
testSuite.test('Comprehensive Round-trip Conversions', () => {
    const converter = new UnitConverter();
    
    // Test length round-trip
    const originalLength = 42.5;
    const result1 = converter.convert(originalLength, 'm', 'ft');
    const result2 = converter.convert(result1.value, 'ft', 'm');
    testSuite.assertTrue(result1.success);
    testSuite.assertTrue(result2.success);
    testSuite.assertApproxEqual(result2.value, originalLength, 0.001);
    
    // Test mass round-trip
    const originalMass = 75.3;
    const result3 = converter.convert(originalMass, 'kg', 'lb');
    const result4 = converter.convert(result3.value, 'lb', 'kg');
    testSuite.assertTrue(result3.success);
    testSuite.assertTrue(result4.success);
    testSuite.assertApproxEqual(result4.value, originalMass, 0.001);
    
    // Test temperature round-trip
    const originalTemp = 25.0;
    const result5 = converter.convert(originalTemp, 'C', 'F');
    const result6 = converter.convert(result5.value, 'F', 'C');
    testSuite.assertTrue(result5.success);
    testSuite.assertTrue(result6.success);
    testSuite.assertApproxEqual(result6.value, originalTemp, 0.01);
});

// Run tests if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { UnitConverterTestSuite, testSuite };
} else {
    // Browser environment
    window.UnitConverterTestSuite = UnitConverterTestSuite;
    window.testSuite = testSuite;
    
    // Auto-run tests when page loads
    if (typeof UnitConverter !== 'undefined') {
        // Wait a bit for everything to load
        setTimeout(() => {
            testSuite.runAllTests();
        }, 100);
    }
}
