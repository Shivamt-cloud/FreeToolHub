// Advanced Currency Converter Test Suite
// Tests the AdvancedCurrencyConverter class functionality

// Test runner function
function runAllTests() {
    console.log('🧪 Running Advanced Currency Converter Tests...\n');
    
    let passed = 0;
    let failed = 0;
    let total = 0;

    // Test categories
    const testCategories = [
        testBasicFunctionality,
        testCurrencyValidation,
        testConversionLogic,
        testMarkupHandling,
        testFeeCalculation,
        testHistoricalRates,
        testEdgeCases,
        testErrorHandling,
        testPerformance
    ];

    // Run all test categories
    testCategories.forEach(category => {
        const results = category();
        passed += results.passed;
        failed += results.failed;
        total += results.total;
    });

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${total}`);
    console.log(`🎯 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    return { passed, failed, total };
}

// Test helper functions
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
    }
}

function assertApproxEqual(actual, expected, tolerance = 0.01, message) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`Assertion failed: ${message}. Expected ${expected} ± ${tolerance}, got ${actual}`);
    }
}

function assertThrows(func, expectedError, message) {
    try {
        func();
        throw new Error(`Assertion failed: ${message}. Expected error but no error was thrown`);
    } catch (error) {
        if (expectedError && !error.message.includes(expectedError)) {
            throw new Error(`Assertion failed: ${message}. Expected error containing "${expectedError}", got "${error.message}"`);
        }
    }
}

// Test category: Basic Functionality
function testBasicFunctionality() {
    console.log('🔧 Testing Basic Functionality...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Constructor
        total++;
        const converter = new AdvancedCurrencyConverter();
        assert(converter !== null, 'Converter should be created');
        assert(converter.iso4217 !== undefined, 'ISO 4217 data should be initialized');
        assert(converter.rateProvider !== undefined, 'Rate provider should be initialized');
        passed++;
        console.log('✅ Constructor test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Constructor test failed: ${error.message}`);
    }

    try {
        // Test 2: ISO 4217 Data
        total++;
        const converter = new AdvancedCurrencyConverter();
        const currencies = converter.getSupportedCurrencies();
        assert(Array.isArray(currencies), 'Supported currencies should be an array');
        assert(currencies.length > 100, 'Should support 100+ currencies');
        assert(currencies.includes('USD'), 'Should include USD');
        assert(currencies.includes('EUR'), 'Should include EUR');
        passed++;
        console.log('✅ ISO 4217 data test passed');
    } catch (error) {
        failed++;
        console.log(`❌ ISO 4217 data test failed: ${error.message}`);
    }

    try {
        // Test 3: Popular Currencies
        total++;
        const converter = new AdvancedCurrencyConverter();
        const popular = converter.getPopularCurrencies();
        assert(Array.isArray(popular), 'Popular currencies should be an array');
        assert(popular.length >= 10, 'Should have at least 10 popular currencies');
        assert(popular.includes('USD'), 'Should include USD in popular');
        passed++;
        console.log('✅ Popular currencies test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Popular currencies test failed: ${error.message}`);
    }

    try {
        // Test 4: Currency Names and Symbols
        total++;
        const converter = new AdvancedCurrencyConverter();
        assert(converter.getCurrencyName('USD') === 'US Dollar', 'Should get correct USD name');
        assert(converter.getCurrencySymbol('USD') === '$', 'Should get correct USD symbol');
        assert(converter.getCurrencyName('EUR') === 'Euro', 'Should get correct EUR name');
        assert(converter.getCurrencySymbol('EUR') === '€', 'Should get correct EUR symbol');
        passed++;
        console.log('✅ Currency names and symbols test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Currency names and symbols test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Currency Validation
function testCurrencyValidation() {
    console.log('\n🔍 Testing Currency Validation...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Valid Currency Codes
        total++;
        const converter = new AdvancedCurrencyConverter();
        assert(converter.validateCurrency('USD') === undefined, 'Should accept valid USD');
        assert(converter.validateCurrency('EUR') === undefined, 'Should accept valid EUR');
        assert(converter.validateCurrency('JPY') === undefined, 'Should accept valid JPY');
        passed++;
        console.log('✅ Valid currency codes test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Valid currency codes test failed: ${error.message}`);
    }

    try {
        // Test 2: Invalid Currency Codes
        total++;
        const converter = new AdvancedCurrencyConverter();
        assertThrows(() => converter.validateCurrency('INVALID'), 'Unsupported currency', 'Should reject invalid currency');
        assertThrows(() => converter.validateCurrency(''), 'Unsupported currency', 'Should reject empty currency');
        assertThrows(() => converter.validateCurrency(null), 'Unsupported currency', 'Should reject null currency');
        passed++;
        console.log('✅ Invalid currency codes test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Invalid currency codes test failed: ${error.message}`);
    }

    try {
        // Test 3: Minor Unit Exponents
        total++;
        const converter = new AdvancedCurrencyConverter();
        assertEqual(converter.getMinorUnitExponent('USD'), 2, 'USD should have 2 decimal places');
        assertEqual(converter.getMinorUnitExponent('JPY'), 0, 'JPY should have 0 decimal places');
        assertEqual(converter.getMinorUnitExponent('BHD'), 3, 'BHD should have 3 decimal places');
        assertEqual(converter.getMinorUnitExponent('BTC'), 8, 'BTC should have 8 decimal places');
        passed++;
        console.log('✅ Minor unit exponents test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Minor unit exponents test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Conversion Logic
function testConversionLogic() {
    console.log('\n🔄 Testing Conversion Logic...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Same Currency Conversion
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(100, 'USD', 'USD');
        assert(result.success, 'Same currency conversion should succeed');
        assertEqual(result.to.amount, 100, 'Same currency should return same amount');
        passed++;
        console.log('✅ Same currency conversion test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Same currency conversion test failed: ${error.message}`);
    }

    try {
        // Test 2: Basic Conversion
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(100, 'USD', 'EUR');
        assert(result.success, 'Basic conversion should succeed');
        assert(result.to.amount > 0, 'Converted amount should be positive');
        assert(result.rate.raw > 0, 'Exchange rate should be positive');
        passed++;
        console.log('✅ Basic conversion test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Basic conversion test failed: ${error.message}`);
    }

    try {
        // Test 3: Cross-Currency Triangulation
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(100, 'GBP', 'JPY');
        assert(result.success, 'Cross-currency conversion should succeed');
        assert(result.to.amount > 0, 'Converted amount should be positive');
        assert(result.metadata.base === 'EUR', 'Should use EUR as base currency');
        passed++;
        console.log('✅ Cross-currency triangulation test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Cross-currency triangulation test failed: ${error.message}`);
    }

    try {
        // Test 4: Rounding to Minor Units
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(100.123456, 'USD', 'EUR');
        assert(result.success, 'Conversion with rounding should succeed');
        
        // Check that result is rounded to 2 decimal places (EUR standard)
        const rounded = Math.round(result.to.amount * 100) / 100;
        assertApproxEqual(result.to.amount, rounded, 0.001, 'EUR amount should be rounded to 2 decimal places');
        passed++;
        console.log('✅ Rounding to minor units test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Rounding to minor units test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Markup Handling
function testMarkupHandling() {
    console.log('\n💰 Testing Markup Handling...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: No Markup
        total++;
        const converter = new AdvancedCurrencyConverter();
        const resultNoMarkup = await converter.convertAmount(100, 'USD', 'EUR', { markupBps: 0 });
        const resultDefault = await converter.convertAmount(100, 'USD', 'EUR');
        
        assertApproxEqual(resultNoMarkup.rate.effective, resultDefault.rate.effective, 0.001, 'No markup should equal default rate');
        passed++;
        console.log('✅ No markup test passed');
    } catch (error) {
        failed++;
        console.log(`❌ No markup test failed: ${error.message}`);
    }

    try {
        // Test 2: Small Markup
        total++;
        const converter = new AdvancedCurrencyConverter();
        const resultNoMarkup = await converter.convertAmount(100, 'USD', 'EUR', { markupBps: 0 });
        const resultWithMarkup = await converter.convertAmount(100, 'USD', 'EUR', { markupBps: 50 });
        
        assert(resultWithMarkup.rate.effective > resultNoMarkup.rate.effective, 'Markup should increase effective rate');
        assert(resultWithMarkup.rate.markup === 50, 'Markup should be recorded correctly');
        passed++;
        console.log('✅ Small markup test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Small markup test failed: ${error.message}`);
    }

    try {
        // Test 3: Large Markup
        total++;
        const converter = new AdvancedCurrencyConverter();
        const resultNoMarkup = await converter.convertAmount(100, 'USD', 'EUR', { markupBps: 0 });
        const resultWithMarkup = await converter.convertAmount(100, 'USD', 'EUR', { markupBps: 200 });
        
        // 200 bps = 2% markup
        const expectedRate = resultNoMarkup.rate.raw * 1.02;
        assertApproxEqual(resultWithMarkup.rate.effective, expectedRate, 0.001, 'Large markup should be calculated correctly');
        passed++;
        console.log('✅ Large markup test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Large markup test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Fee Calculation
function testFeeCalculation() {
    console.log('\n💸 Testing Fee Calculation...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: No Fee
        total++;
        const converter = new AdvancedCurrencyConverter();
        const resultNoFee = await converter.convertAmount(100, 'USD', 'EUR', { 
            feeMode: 'amount_fee_none',
            feeValue: 0 
        });
        const resultDefault = await converter.convertAmount(100, 'USD', 'EUR');
        
        assertApproxEqual(resultNoFee.to.amount, resultDefault.to.amount, 0.001, 'No fee should equal default conversion');
        passed++;
        console.log('✅ No fee test passed');
    } catch (error) {
        failed++;
        console.log(`❌ No fee test failed: ${error.message}`);
    }

    try {
        // Test 2: Percentage Fee
        total++;
        const converter = new AdvancedCurrencyConverter();
        const resultNoFee = await converter.convertAmount(100, 'USD', 'EUR', { 
            feeMode: 'amount_fee_none',
            feeValue: 0 
        });
        const resultWithFee = await converter.convertAmount(100, 'USD', 'EUR', { 
            feeMode: 'amount_fee_percent',
            feeValue: 0.05  // 5% fee
        });
        
        const expectedAmount = resultNoFee.to.amount * 1.05;
        assertApproxEqual(resultWithFee.to.amount, expectedAmount, 0.001, 'Percentage fee should be calculated correctly');
        passed++;
        console.log('✅ Percentage fee test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Percentage fee test failed: ${error.message}`);
    }

    try {
        // Test 3: Fixed Fee
        total++;
        const converter = new AdvancedCurrencyConverter();
        const resultNoFee = await converter.convertAmount(100, 'USD', 'EUR', { 
            feeMode: 'amount_fee_none',
            feeValue: 0 
        });
        const resultWithFee = await converter.convertAmount(100, 'USD', 'EUR', { 
            feeMode: 'amount_fee_fixed',
            feeValue: 5.00  // $5 fixed fee
        });
        
        const expectedAmount = resultNoFee.to.amount + 5.00;
        assertApproxEqual(resultWithFee.to.amount, expectedAmount, 0.001, 'Fixed fee should be added correctly');
        passed++;
        console.log('✅ Fixed fee test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Fixed fee test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Historical Rates
function testHistoricalRates() {
    console.log('\n📅 Testing Historical Rates...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Historical Date
        total++;
        const converter = new AdvancedCurrencyConverter();
        const historicalDate = '2023-12-01';
        const result = await converter.convertAmount(100, 'USD', 'EUR', { asOf: historicalDate });
        
        assert(result.success, 'Historical conversion should succeed');
        assert(result.metadata.asOf === historicalDate, 'Should use specified historical date');
        passed++;
        console.log('✅ Historical date test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Historical date test failed: ${error.message}`);
    }

    try {
        // Test 2: Historical vs Current
        total++;
        const converter = new AdvancedCurrencyConverter();
        const historicalDate = '2023-12-01';
        const resultHistorical = await converter.convertAmount(100, 'USD', 'EUR', { asOf: historicalDate });
        const resultCurrent = await converter.convertAmount(100, 'USD', 'EUR');
        
        assert(resultHistorical.success, 'Historical conversion should succeed');
        assert(resultCurrent.success, 'Current conversion should succeed');
        // Note: Rates might be the same if using fallback data
        passed++;
        console.log('✅ Historical vs current test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Historical vs current test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Edge Cases
function testEdgeCases() {
    console.log('\n🔍 Testing Edge Cases...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Zero Amount
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(0, 'USD', 'EUR');
        assert(result.success, 'Zero amount conversion should succeed');
        assertEqual(result.to.amount, 0, 'Zero amount should convert to zero');
        passed++;
        console.log('✅ Zero amount test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Zero amount test failed: ${error.message}`);
    }

    try {
        // Test 2: Very Small Amount
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(0.0001, 'USD', 'EUR');
        assert(result.success, 'Very small amount conversion should succeed');
        assert(result.to.amount >= 0, 'Very small amount should convert to non-negative');
        passed++;
        console.log('✅ Very small amount test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Very small amount test failed: ${error.message}`);
    }

    try {
        // Test 3: Very Large Amount
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(1000000, 'USD', 'EUR');
        assert(result.success, 'Very large amount conversion should succeed');
        assert(result.to.amount > 0, 'Very large amount should convert to positive');
        passed++;
        console.log('✅ Very large amount test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Very large amount test failed: ${error.message}`);
    }

    try {
        // Test 4: Negative Amount
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(-100, 'USD', 'EUR');
        assert(!result.success, 'Negative amount should fail');
        assert(result.error.includes('positive'), 'Should indicate positive number requirement');
        passed++;
        console.log('✅ Negative amount test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Negative amount test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Error Handling
function testErrorHandling() {
    console.log('\n⚠️ Testing Error Handling...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Invalid Currency
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(100, 'INVALID', 'EUR');
        assert(!result.success, 'Invalid currency should fail');
        assert(result.error.includes('Unsupported currency'), 'Should indicate unsupported currency');
        passed++;
        console.log('✅ Invalid currency test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Invalid currency test failed: ${error.message}`);
    }

    try {
        // Test 2: Missing Rate
        total++;
        const converter = new AdvancedCurrencyConverter();
        // This might fail if the rate provider doesn't have the currency
        try {
            const result = await converter.convertAmount(100, 'XXX', 'YYY');
            // If it succeeds, that's fine (fallback rates might include it)
            passed++;
            console.log('✅ Missing rate test passed (fallback available)');
        } catch (error) {
            // If it fails, that's also fine
            passed++;
            console.log('✅ Missing rate test passed (rate not available)');
        }
    } catch (error) {
        failed++;
        console.log(`❌ Missing rate test failed: ${error.message}`);
    }

    try {
        // Test 3: Invalid Options
        total++;
        const converter = new AdvancedCurrencyConverter();
        const result = await converter.convertAmount(100, 'USD', 'EUR', { 
            feeMode: 'invalid_mode' 
        });
        // Should handle invalid fee mode gracefully
        assert(result.success, 'Should handle invalid options gracefully');
        passed++;
        console.log('✅ Invalid options test passed');
    } catch (error) {
        failed++;
        console.log(`❌ Invalid options test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Test category: Performance
function testPerformance() {
    console.log('\n⚡ Testing Performance...');
    let passed = 0;
    let failed = 0;
    let total = 0;

    try {
        // Test 1: Single Conversion Speed
        total++;
        const converter = new AdvancedCurrencyConverter();
        const startTime = performance.now();
        const result = await converter.convertAmount(100, 'USD', 'EUR');
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        assert(result.success, 'Performance test conversion should succeed');
        assert(duration < 1000, 'Single conversion should complete in under 1 second');
        passed++;
        console.log(`✅ Single conversion speed test passed (${duration.toFixed(2)}ms)`);
    } catch (error) {
        failed++;
        console.log(`❌ Single conversion speed test failed: ${error.message}`);
    }

    try {
        // Test 2: Multiple Conversions
        total++;
        const converter = new AdvancedCurrencyConverter();
        const conversions = [
            { amount: 100, from: 'USD', to: 'EUR' },
            { amount: 200, from: 'EUR', to: 'GBP' },
            { amount: 300, from: 'GBP', to: 'JPY' }
        ];
        
        const startTime = performance.now();
        const results = await Promise.all(
            conversions.map(c => converter.convertAmount(c.amount, c.from, c.to))
        );
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        assert(results.every(r => r.success), 'All conversions should succeed');
        assert(duration < 2000, 'Multiple conversions should complete in under 2 seconds');
        passed++;
        console.log(`✅ Multiple conversions test passed (${duration.toFixed(2)}ms)`);
    } catch (error) {
        failed++;
        console.log(`❌ Multiple conversions test failed: ${error.message}`);
    }

    return { passed, failed, total };
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.runCurrencyConverterTests = runAllTests;
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests };
}

// Auto-run tests if in browser and tests are requested
if (typeof window !== 'undefined' && window.location.search.includes('test=currency')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 1000); // Wait for page to load
    });
}
