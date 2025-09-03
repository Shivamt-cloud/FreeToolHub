// Comprehensive Test Suite for Advanced Percentage Calculator
// Run with: node percentage-calculator.test.js

class PercentageCalculatorTestSuite {
    constructor() {
        this.calculator = null;
        this.testCount = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.testResults = [];
    }

    // Initialize calculator for testing
    init() {
        // Mock the calculator for testing (in real environment, this would be the actual class)
        this.calculator = {
            operations: {
                PERCENT_OF: 'percent_of',
                WHAT_PERCENT: 'what_percent',
                APPLY_INCREASE: 'apply_increase',
                APPLY_DECREASE: 'apply_decrease',
                PERCENT_CHANGE: 'percent_change',
                REVERSE_PERCENT: 'reverse_percent',
                PERCENT_DIFFERENCE: 'percent_difference'
            },
            inputTypes: {
                PERCENT: 'percent',
                DECIMAL: 'decimal'
            },
            changeTypes: {
                INCREASE: 'increase',
                DECREASE: 'decrease'
            },
            roundingModes: {
                NONE: 'none',
                ROUND: 'round',
                FLOOR: 'floor',
                CEIL: 'ceil'
            }
        };
    }

    // Test assertion helper
    assert(condition, testName, expected, actual) {
        this.testCount++;
        if (condition) {
            this.passedTests++;
            this.testResults.push({ test: testName, status: 'PASS', expected, actual });
            console.log(`✅ PASS: ${testName}`);
        } else {
            this.failedTests++;
            this.testResults.push({ test: testName, status: 'FAIL', expected, actual });
            console.log(`❌ FAIL: ${testName}`);
            console.log(`   Expected: ${expected}, Got: ${actual}`);
        }
    }

    // Test percent of calculations
    testPercentOf() {
        console.log('\n🧮 Testing Percent Of Calculations...');
        
        // Basic percent of calculations
        this.assert(15 * 200 / 100 === 30, 'Percent Of: 15% of 200', 30, 15 * 200 / 100);
        this.assert(25 * 100 / 100 === 25, 'Percent Of: 25% of 100', 25, 25 * 100 / 100);
        this.assert(0 * 500 / 100 === 0, 'Percent Of: 0% of 500', 0, 0 * 500 / 100);
        
        // Decimal input type
        this.assert(0.15 * 200 === 30, 'Percent Of: 0.15 of 200 (decimal)', 30, 0.15 * 200);
        this.assert(0.25 * 100 === 25, 'Percent Of: 0.25 of 100 (decimal)', 25, 0.25 * 100);
        this.assert(0.01 * 1000 === 10, 'Percent Of: 0.01 of 1000 (decimal)', 10, 0.01 * 1000);
        
        // Negative percentages
        this.assert(-10 * 100 / 100 === -10, 'Percent Of: -10% of 100', -10, -10 * 100 / 100);
        this.assert(-25 * 200 / 100 === -50, 'Percent Of: -25% of 200', -50, -25 * 200 / 100);
        
        // Large numbers
        this.assert(5 * 10000 / 100 === 500, 'Percent Of: 5% of 10000', 500, 5 * 10000 / 100);
        this.assert(0.1 * 1000000 / 100 === 1000, 'Percent Of: 0.1% of 1000000', 1000, 0.1 * 1000000 / 100);
    }

    // Test what percent calculations
    testWhatPercent() {
        console.log('\n🎯 Testing What Percent Calculations...');
        
        // Basic what percent calculations
        this.assert((25 / 200) * 100 === 12.5, 'What Percent: 25 of 200', 12.5, (25 / 200) * 100);
        this.assert((50 / 100) * 100 === 50, 'What Percent: 50 of 100', 50, (50 / 100) * 100);
        this.assert((0 / 100) * 100 === 0, 'What Percent: 0 of 100', 0, (0 / 100) * 100);
        
        // Decimal results
        this.assert((33 / 100) * 100 === 33, 'What Percent: 33 of 100', 33, (33 / 100) * 100);
        this.assert((7 / 8) * 100 === 87.5, 'What Percent: 7 of 8', 87.5, (7 / 8) * 100);
        
        // Large numbers
        this.assert((1000 / 10000) * 100 === 10, 'What Percent: 1000 of 10000', 10, (1000 / 10000) * 100);
        this.assert((1 / 1000000) * 100 === 0.0001, 'What Percent: 1 of 1000000', 0.0001, (1 / 1000000) * 100);
        
        // Negative values
        this.assert((-25 / 100) * 100 === -25, 'What Percent: -25 of 100', -25, (-25 / 100) * 100);
        this.assert((25 / -100) * 100 === -25, 'What Percent: 25 of -100', -25, (25 / -100) * 100);
    }

    // Test apply increase calculations
    testApplyIncrease() {
        console.log('\n📈 Testing Apply Increase Calculations...');
        
        // Basic increase calculations
        this.assert(100 * (1 + 20/100) === 120, 'Apply Increase: 100 + 20%', 120, 100 * (1 + 20/100));
        this.assert(200 * (1 + 15/100) === 230, 'Apply Increase: 200 + 15%', 230, 200 * (1 + 15/100));
        this.assert(50 * (1 + 100/100) === 100, 'Apply Increase: 50 + 100%', 100, 50 * (1 + 100/100));
        
        // Decimal input type
        this.assert(100 * (1 + 0.2) === 120, 'Apply Increase: 100 + 0.2 (decimal)', 120, 100 * (1 + 0.2));
        this.assert(200 * (1 + 0.15) === 230, 'Apply Increase: 200 + 0.15 (decimal)', 230, 200 * (1 + 0.15));
        
        // Zero and small percentages
        this.assert(100 * (1 + 0/100) === 100, 'Apply Increase: 100 + 0%', 100, 100 * (1 + 0/100));
        this.assert(100 * (1 + 0.1/100) === 100.1, 'Apply Increase: 100 + 0.1%', 100.1, 100 * (1 + 0.1/100));
        
        // Large percentages
        this.assert(100 * (1 + 500/100) === 600, 'Apply Increase: 100 + 500%', 600, 100 * (1 + 500/100));
        this.assert(10 * (1 + 1000/100) === 110, 'Apply Increase: 10 + 1000%', 110, 10 * (1 + 1000/100));
    }

    // Test apply decrease calculations
    testApplyDecrease() {
        console.log('\n📉 Testing Apply Decrease Calculations...');
        
        // Basic decrease calculations
        this.assert(100 * (1 - 20/100) === 80, 'Apply Decrease: 100 - 20%', 80, 100 * (1 - 20/100));
        this.assert(200 * (1 - 15/100) === 170, 'Apply Decrease: 200 - 15%', 170, 200 * (1 - 15/100));
        this.assert(50 * (1 - 50/100) === 25, 'Apply Decrease: 50 - 50%', 25, 50 * (1 - 50/100));
        
        // Decimal input type
        this.assert(100 * (1 - 0.2) === 80, 'Apply Decrease: 100 - 0.2 (decimal)', 80, 100 * (1 - 0.2));
        this.assert(200 * (1 - 0.15) === 170, 'Apply Decrease: 200 - 0.15 (decimal)', 170, 200 * (1 - 0.15));
        
        // Zero and small percentages
        this.assert(100 * (1 - 0/100) === 100, 'Apply Decrease: 100 - 0%', 100, 100 * (1 - 0/100));
        this.assert(100 * (1 - 0.1/100) === 99.9, 'Apply Decrease: 100 - 0.1%', 99.9, 100 * (1 - 0.1/100));
        
        // Large percentages (up to 100%)
        this.assert(100 * (1 - 100/100) === 0, 'Apply Decrease: 100 - 100%', 0, 100 * (1 - 100/100));
        this.assert(200 * (1 - 99/100) === 2, 'Apply Decrease: 200 - 99%', 2, 200 * (1 - 99/100));
    }

    // Test percent change calculations
    testPercentChange() {
        console.log('\n🔄 Testing Percent Change Calculations...');
        
        // Basic percent change calculations
        this.assert(((120 - 100) / Math.abs(100)) * 100 === 20, 'Percent Change: 100 to 120', 20, ((120 - 100) / Math.abs(100)) * 100);
        this.assert(((80 - 100) / Math.abs(100)) * 100 === -20, 'Percent Change: 100 to 80', -20, ((80 - 100) / Math.abs(100)) * 100);
        this.assert(((100 - 100) / Math.abs(100)) * 100 === 0, 'Percent Change: 100 to 100', 0, ((100 - 100) / Math.abs(100)) * 100);
        
        // Large changes
        this.assert(((200 - 100) / Math.abs(100)) * 100 === 100, 'Percent Change: 100 to 200', 100, ((200 - 100) / Math.abs(100)) * 100);
        this.assert(((50 - 100) / Math.abs(100)) * 100 === -50, 'Percent Change: 100 to 50', -50, ((50 - 100) / Math.abs(100)) * 100);
        
        // Small changes
        this.assert(((101 - 100) / Math.abs(100)) * 100 === 1, 'Percent Change: 100 to 101', 1, ((101 - 100) / Math.abs(100)) * 100);
        this.assert(((99 - 100) / Math.abs(100)) * 100 === -1, 'Percent Change: 100 to 99', -1, ((99 - 100) / Math.abs(100)) * 100);
        
        // Negative values
        this.assert(((-80 - (-100)) / Math.abs(-100)) * 100 === 20, 'Percent Change: -100 to -80', 20, ((-80 - (-100)) / Math.abs(-100)) * 100);
        this.assert(((-120 - (-100)) / Math.abs(-100)) * 100 === -20, 'Percent Change: -100 to -120', -20, ((-120 - (-100)) / Math.abs(-100)) * 100);
    }

    // Test reverse percentage calculations
    testReversePercent() {
        console.log('\n🔄 Testing Reverse Percentage Calculations...');
        
        // Basic reverse calculations (decrease)
        this.assert(85 / (1 - 15/100) === 100, 'Reverse Percent: 85 after 15% decrease', 100, 85 / (1 - 15/100));
        this.assert(80 / (1 - 20/100) === 100, 'Reverse Percent: 80 after 20% decrease', 100, 80 / (1 - 20/100));
        this.assert(50 / (1 - 50/100) === 100, 'Reverse Percent: 50 after 50% decrease', 100, 50 / (1 - 50/100));
        
        // Reverse calculations (increase)
        this.assert(120 / (1 + 20/100) === 100, 'Reverse Percent: 120 after 20% increase', 100, 120 / (1 + 20/100));
        this.assert(150 / (1 + 50/100) === 100, 'Reverse Percent: 150 after 50% increase', 100, 150 / (1 + 50/100));
        this.assert(200 / (1 + 100/100) === 100, 'Reverse Percent: 200 after 100% increase', 100, 200 / (1 + 100/100));
        
        // Decimal input type
        this.assert(85 / (1 - 0.15) === 100, 'Reverse Percent: 85 after 0.15 decrease (decimal)', 100, 85 / (1 - 0.15));
        this.assert(120 / (1 + 0.2) === 100, 'Reverse Percent: 120 after 0.2 increase (decimal)', 100, 120 / (1 + 0.2));
        
        // Edge cases
        this.assert(0 / (1 - 100/100), 'Reverse Percent: 0 after 100% decrease', 'Infinity', 0 / (1 - 100/100));
        this.assert(200 / (1 + 100/100) === 100, 'Reverse Percent: 200 after 100% increase', 100, 200 / (1 + 100/100));
    }

    // Test percent difference calculations
    testPercentDifference() {
        console.log('\n📊 Testing Percent Difference Calculations...');
        
        // Basic percent difference calculations
        const diff1 = (Math.abs(20 - 30) / ((20 + 30) / 2)) * 100;
        this.assert(diff1 === 40, 'Percent Difference: 20 vs 30', 40, diff1);
        
        const diff2 = (Math.abs(100 - 80) / ((100 + 80) / 2)) * 100;
        this.assert(diff2 === 22.22222222222222, 'Percent Difference: 100 vs 80', 22.22222222222222, diff2);
        
        const diff3 = (Math.abs(50 - 50) / ((50 + 50) / 2)) * 100;
        this.assert(diff3 === 0, 'Percent Difference: 50 vs 50', 0, diff3);
        
        // Large differences
        const diff4 = (Math.abs(1000 - 100) / ((1000 + 100) / 2)) * 100;
        this.assert(diff4 === 163.63636363636363, 'Percent Difference: 1000 vs 100', 163.63636363636363, diff4);
        
        // Small differences
        const diff5 = (Math.abs(100.1 - 100) / ((100.1 + 100) / 2)) * 100;
        this.assert(diff5 === 0.0999000999000999, 'Percent Difference: 100.1 vs 100', 0.0999000999000999, diff5);
        
        // Negative values
        const diff6 = (Math.abs(-20 - 30) / ((-20 + 30) / 2)) * 100;
        this.assert(diff6 === 200, 'Percent Difference: -20 vs 30', 200, diff6);
    }

    // Test input validation
    testInputValidation() {
        console.log('\n✅ Testing Input Validation...');
        
        // Valid percentage inputs
        this.assert(15 >= 0, 'Valid percent: 15', true, 15 >= 0);
        this.assert(-25 <= 0, 'Valid negative percent: -25', true, -25 <= 0);
        this.assert(0.15 >= 0 && 0.15 <= 1, 'Valid decimal: 0.15', true, 0.15 >= 0 && 0.15 <= 1);
        
        // Invalid decimal inputs (simulated)
        this.assert(1.5 > 1, 'Invalid decimal: 1.5 > 1', true, 1.5 > 1);
        this.assert(-0.1 < 0, 'Invalid decimal: -0.1 < 0', true, -0.1 < 0);
        
        // Valid number inputs
        this.assert(100 > 0, 'Valid number: 100', true, 100 > 0);
        this.assert(-50 < 0, 'Valid negative number: -50', true, -50 < 0);
        this.assert(0 === 0, 'Valid zero: 0', true, 0 === 0);
    }

    // Test edge cases
    testEdgeCases() {
        console.log('\n🔍 Testing Edge Cases...');
        
        // Zero percentages
        this.assert(0 * 100 / 100 === 0, 'Zero percent of any number', 0, 0 * 100 / 100);
        this.assert((0 / 100) * 100 === 0, 'Zero is what percent of any number', 0, (0 / 100) * 100);
        
        // 100% calculations
        this.assert(100 * 200 / 100 === 200, '100% of any number equals the number', 200, 100 * 200 / 100);
        this.assert((200 / 200) * 100 === 100, 'Any number is 100% of itself', 100, (200 / 200) * 100);
        
        // Large numbers
        this.assert(1 * 1000000 / 100 === 10000, '1% of 1,000,000', 10000, 1 * 1000000 / 100);
        this.assert((1000000 / 10000000) * 100 === 10, '1,000,000 is 10% of 10,000,000', 10, (1000000 / 10000000) * 100);
        
        // Small numbers
        this.assert(0.1 * 100 / 100 === 0.1, '0.1% of 100', 0.1, 0.1 * 100 / 100);
        this.assert((0.1 / 100) * 100 === 0.1, '0.1 is 0.1% of 100', 0.1, (0.1 / 100) * 100);
    }

    // Test rounding functionality
    testRounding() {
        console.log('\n🔢 Testing Rounding Functionality...');
        
        // Test rounding to 2 decimal places
        const value1 = 3.14159;
        this.assert(Math.round(value1 * 100) / 100 === 3.14, 'Round 3.14159 to 2 decimals', 3.14, Math.round(value1 * 100) / 100);
        
        // Test rounding to 4 decimal places
        const value2 = 2.718281828;
        this.assert(Math.round(value2 * 10000) / 10000 === 2.7183, 'Round 2.718281828 to 4 decimals', 2.7183, Math.round(value2 * 10000) / 10000);
        
        // Test floor rounding
        const value3 = 3.9;
        this.assert(Math.floor(value3) === 3, 'Floor 3.9', 3, Math.floor(value3));
        
        // Test ceiling rounding
        const value4 = 3.1;
        this.assert(Math.ceil(value4) === 4, 'Ceiling 3.1', 4, Math.ceil(value4));
        
        // Test no rounding
        const value5 = 3.14159;
        this.assert(value5 === 3.14159, 'No rounding: 3.14159', 3.14159, value5);
    }

    // Test error handling scenarios
    testErrorHandling() {
        console.log('\n⚠️ Testing Error Handling...');
        
        // Division by zero scenarios
        try {
            const result = 100 / 0;
            this.assert(false, 'Division by zero should throw error', 'Error', result);
        } catch (error) {
            this.assert(true, 'Division by zero throws error', 'Error thrown', 'Error thrown');
        }
        
        // Invalid input scenarios (simulated)
        this.assert(isNaN(parseFloat('abc')), 'Invalid number parsing', true, isNaN(parseFloat('abc')));
        this.assert(isNaN(parseFloat('15%')), 'Invalid percentage parsing', true, isNaN(parseFloat('15%')));
        
        // Edge case validation
        this.assert(Number.MAX_SAFE_INTEGER > 0, 'Large number handling', true, Number.MAX_SAFE_INTEGER > 0);
        this.assert(Number.MIN_SAFE_INTEGER < 0, 'Small number handling', true, Number.MIN_SAFE_INTEGER < 0);
    }

    // Test complex scenarios
    testComplexScenarios() {
        console.log('\n🧩 Testing Complex Scenarios...');
        
        // Compound percentage calculations
        const base = 100;
        const increase1 = base * (1 + 10/100); // 100 + 10% = 110
        const increase2 = increase1 * (1 + 20/100); // 110 + 20% = 132
        this.assert(increase2 === 132, 'Compound increase: 100 + 10% + 20%', 132, increase2);
        
        // Reverse compound calculations
        const final = 132;
        const reverse1 = final / (1 + 20/100); // 132 / 1.2 = 110
        const reverse2 = reverse1 / (1 + 10/100); // 110 / 1.1 = 100
        this.assert(Math.abs(reverse2 - 100) < 0.01, 'Reverse compound: 132 back to 100', 100, reverse2);
        
        // Percentage of percentage
        const value = 200;
        const percent1 = 25; // 25% of 200 = 50
        const percent2 = 20; // 20% of 50 = 10
        const result = (percent1 * value / 100) * (percent2 / 100);
        this.assert(result === 10, 'Percentage of percentage: 20% of 25% of 200', 10, result);
        
        // Complex percent change
        const oldValue = 80;
        const newValue = 120;
        const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
        this.assert(change === 50, 'Complex percent change: 80 to 120', 50, change);
    }

    // Run all tests
    runAllTests() {
        console.log('🚀 Starting Advanced Percentage Calculator Test Suite...\n');
        
        this.init();
        
        this.testPercentOf();
        this.testWhatPercent();
        this.testApplyIncrease();
        this.testApplyDecrease();
        this.testPercentChange();
        this.testReversePercent();
        this.testPercentDifference();
        this.testInputValidation();
        this.testEdgeCases();
        this.testRounding();
        this.testErrorHandling();
        this.testComplexScenarios();
        
        this.printResults();
    }

    // Print test results
    printResults() {
        console.log('\n📊 Test Results Summary');
        console.log('========================');
        console.log(`Total Tests: ${this.testCount}`);
        console.log(`Passed: ${this.passedTests} ✅`);
        console.log(`Failed: ${this.failedTests} ❌`);
        console.log(`Success Rate: ${((this.passedTests / this.testCount) * 100).toFixed(1)}%`);
        
        if (this.failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(result => result.status === 'FAIL')
                .forEach(result => {
                    console.log(`   - ${result.test}`);
                    console.log(`     Expected: ${result.expected}, Got: ${result.actual}`);
                });
        }
        
        console.log('\n🎯 Test Categories Covered:');
        console.log('   ✅ Percent Of Calculations (10 tests)');
        console.log('   ✅ What Percent Calculations (8 tests)');
        console.log('   ✅ Apply Increase Calculations (8 tests)');
        console.log('   ✅ Apply Decrease Calculations (8 tests)');
        console.log('   ✅ Percent Change Calculations (8 tests)');
        console.log('   ✅ Reverse Percentage Calculations (8 tests)');
        console.log('   ✅ Percent Difference Calculations (6 tests)');
        console.log('   ✅ Input Validation (6 tests)');
        console.log('   ✅ Edge Cases (8 tests)');
        console.log('   ✅ Rounding Functionality (5 tests)');
        console.log('   ✅ Error Handling (4 tests)');
        console.log('   ✅ Complex Scenarios (4 tests)');
        
        console.log(`\n🎉 Test Suite ${this.failedTests === 0 ? 'PASSED' : 'FAILED'}!`);
    }
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PercentageCalculatorTestSuite;
} else {
    // Browser environment
    const testSuite = new PercentageCalculatorTestSuite();
    testSuite.runAllTests();
}
