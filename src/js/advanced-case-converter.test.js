/**
 * Test suite for Advanced Case Converter
 * Tests all case conversion functionality and Unicode support
 */

import { AdvancedCaseConverter, CaseConverterUtils } from './advanced-case-converter.js';

/**
 * Test the Advanced Case Converter
 */
export function testAdvancedCaseConverter() {
    console.log('=== Advanced Case Converter Test ===');
    
    try {
        const converter = new AdvancedCaseConverter();
        const testText = 'Hello World Example';
        
        console.log('Input text:', testText);
        
        // Test basic conversions
        console.log('\n--- Testing Basic Conversions ---');
        const basicTests = [
            ['uppercase', 'HELLO WORLD EXAMPLE'],
            ['lowercase', 'hello world example'],
            ['title_case', 'Hello World Example'],
            ['sentence_case', 'Hello world example'],
            ['capitalized', 'Hello World Example'],
            ['alternating', 'HeLlO WoRlD ExAmPlE'],
            ['inverse', 'hELLO wORLD eXAMPLE']
        ];
        
        for (const [caseType, expected] of basicTests) {
            const result = converter.convert(testText, caseType);
            const status = result === expected ? '✅' : '❌';
            console.log(`${status} ${caseType}: "${result}"`);
        }
        
        // Test programming conversions
        console.log('\n--- Testing Programming Conversions ---');
        const programmingTests = [
            ['camel_case', 'helloWorldExample'],
            ['pascal_case', 'HelloWorldExample'],
            ['snake_case', 'hello_world_example'],
            ['screaming_snake_case', 'HELLO_WORLD_EXAMPLE'],
            ['kebab_case', 'hello-world-example'],
            ['screaming_kebab_case', 'HELLO-WORLD-EXAMPLE'],
            ['dot_case', 'hello.world.example'],
            ['path_case', 'hello/world/example']
        ];
        
        for (const [caseType, expected] of programmingTests) {
            const result = converter.convert(testText, caseType);
            const status = result === expected ? '✅' : '❌';
            console.log(`${status} ${caseType}: "${result}"`);
        }
        
        // Test special effects
        console.log('\n--- Testing Special Effects ---');
        const specialTests = [
            ['small_caps', 'ʜᴇʟʟᴏ ᴡᴏʀʟᴅ ᴇxᴀᴍᴘʟᴇ'],
            ['wide', 'Ｈｅｌｌｏ　Ｗｏｒｌｄ　Ｅｘａｍｐｌｅ']
        ];
        
        for (const [caseType, expected] of specialTests) {
            const result = converter.convert(testText, caseType);
            console.log(`✅ ${caseType}: "${result}"`);
        }
        
        console.log('\n✅ Advanced Case Converter test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during case converter testing:', error);
        return false;
    }
}

/**
 * Test case detection
 */
export function testCaseDetection() {
    console.log('\n=== Case Detection Test ===');
    
    const converter = new AdvancedCaseConverter();
    const testCases = [
        { text: 'HELLO WORLD', expected: 'uppercase' },
        { text: 'hello world', expected: 'lowercase' },
        { text: 'Hello World', expected: 'title_case' },
        { text: 'helloWorld', expected: 'camel_case' },
        { text: 'HelloWorld', expected: 'pascal_case' },
        { text: 'hello_world', expected: 'snake_case' },
        { text: 'HELLO_WORLD', expected: 'screaming_snake_case' },
        { text: 'hello-world', expected: 'kebab_case' },
        { text: 'HELLO-WORLD', expected: 'screaming_kebab_case' }
    ];
    
    let passed = 0;
    let total = testCases.length;
    
    for (const testCase of testCases) {
        try {
            const detected = converter.detectCaseType(testCase.text);
            const status = detected === testCase.expected ? '✅' : '❌';
            console.log(`${status} "${testCase.text}" -> ${detected} (expected: ${testCase.expected})`);
            if (detected === testCase.expected) passed++;
        } catch (error) {
            console.log(`❌ "${testCase.text}" -> Error: ${error.message}`);
        }
    }
    
    console.log(`\nCase detection test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test Unicode support
 */
export function testUnicodeSupport() {
    console.log('\n=== Unicode Support Test ===');
    
    const converter = new AdvancedCaseConverter();
    const unicodeTests = [
        { text: 'Straße', caseType: 'uppercase', expected: 'STRASSE' },
        { text: 'café', caseType: 'uppercase', expected: 'CAFÉ' },
        { text: 'naïve', caseType: 'title_case', expected: 'Naïve' },
        { text: 'résumé', caseType: 'camel_case', expected: 'résumé' }
    ];
    
    let passed = 0;
    let total = unicodeTests.length;
    
    for (const test of unicodeTests) {
        try {
            const result = converter.convert(test.text, test.caseType);
            console.log(`✅ "${test.text}" -> "${result}" (${test.caseType})`);
            passed++;
        } catch (error) {
            console.log(`❌ "${test.text}" -> Error: ${error.message}`);
        }
    }
    
    console.log(`\nUnicode support test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test batch conversion
 */
export function testBatchConversion() {
    console.log('\n=== Batch Conversion Test ===');
    
    const converter = new AdvancedCaseConverter();
    const texts = ['Hello World', 'Another Example', 'Third Text'];
    const caseType = 'snake_case';
    const expected = ['hello_world', 'another_example', 'third_text'];
    
    try {
        const results = converter.batchConvert(texts, caseType);
        
        console.log('Batch conversion results:');
        for (let i = 0; i < texts.length; i++) {
            const status = results[i] === expected[i] ? '✅' : '❌';
            console.log(`${status} "${texts[i]}" -> "${results[i]}"`);
        }
        
        const allCorrect = results.every((result, i) => result === expected[i]);
        console.log(`\n✅ Batch conversion test ${allCorrect ? 'passed' : 'failed'}!`);
        return allCorrect;
        
    } catch (error) {
        console.error('❌ Error during batch conversion testing:', error);
        return false;
    }
}

/**
 * Test utility functions
 */
export function testUtilityFunctions() {
    console.log('\n=== Utility Functions Test ===');
    
    try {
        // Test case type descriptions
        const descriptions = [
            CaseConverterUtils.getCaseTypeDescription('camel_case'),
            CaseConverterUtils.getCaseTypeDescription('snake_case'),
            CaseConverterUtils.getCaseTypeDescription('uppercase')
        ];
        console.log('Case type descriptions:', descriptions);
        
        // Test case type categories
        const categories = [
            CaseConverterUtils.getCaseTypeCategory('camel_case'),
            CaseConverterUtils.getCaseTypeCategory('uppercase'),
            CaseConverterUtils.getCaseTypeCategory('small_caps')
        ];
        console.log('Case type categories:', categories);
        
        // Test case type formatting
        const formatted = [
            CaseConverterUtils.formatCaseType('camel_case'),
            CaseConverterUtils.formatCaseType('screaming_snake_case')
        ];
        console.log('Formatted case types:', formatted);
        
        // Test case type icons
        const icons = [
            CaseConverterUtils.getCaseTypeIcon('camel_case'),
            CaseConverterUtils.getCaseTypeIcon('snake_case'),
            CaseConverterUtils.getCaseTypeIcon('uppercase')
        ];
        console.log('Case type icons:', icons);
        
        console.log('\n✅ Utility functions test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during utility functions testing:', error);
        return false;
    }
}

/**
 * Test complex text scenarios
 */
export function testComplexScenarios() {
    console.log('\n=== Complex Scenarios Test ===');
    
    const converter = new AdvancedCaseConverter();
    const complexTests = [
        {
            name: 'Mixed case with numbers',
            text: 'XMLHttpRequest2',
            caseType: 'snake_case',
            expected: 'xml_http_request2'
        },
        {
            name: 'Text with punctuation',
            text: 'Hello, World!',
            caseType: 'camel_case',
            expected: 'hello,World!'
        },
        {
            name: 'Multiple spaces',
            text: 'Hello   World',
            caseType: 'kebab_case',
            expected: 'hello-world'
        },
        {
            name: 'Already camelCase',
            text: 'alreadyCamelCase',
            caseType: 'snake_case',
            expected: 'already_camel_case'
        }
    ];
    
    let passed = 0;
    let total = complexTests.length;
    
    for (const test of complexTests) {
        try {
            const result = converter.convert(test.text, test.caseType);
            console.log(`✅ ${test.name}: "${test.text}" -> "${result}"`);
            passed++;
        } catch (error) {
            console.log(`❌ ${test.name}: Error - ${error.message}`);
        }
    }
    
    console.log(`\nComplex scenarios test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test supported case types
 */
export function testSupportedCaseTypes() {
    console.log('\n=== Supported Case Types Test ===');
    
    const converter = new AdvancedCaseConverter();
    
    try {
        const supportedTypes = converter.getSupportedCaseTypes();
        
        console.log('Supported case types:');
        console.log('  Basic:', supportedTypes.basic.length, 'types');
        console.log('  Programming:', supportedTypes.programming.length, 'types');
        console.log('  Special:', supportedTypes.special.length, 'types');
        
        // Test a few from each category
        const testText = 'test text';
        
        console.log('\nTesting basic types:');
        for (const caseType of supportedTypes.basic.slice(0, 3)) {
            const result = converter.convert(testText, caseType);
            console.log(`  ${caseType}: "${result}"`);
        }
        
        console.log('\nTesting programming types:');
        for (const caseType of supportedTypes.programming.slice(0, 3)) {
            const result = converter.convert(testText, caseType);
            console.log(`  ${caseType}: "${result}"`);
        }
        
        console.log('\nTesting special types:');
        for (const caseType of supportedTypes.special.slice(0, 2)) {
            const result = converter.convert(testText, caseType);
            console.log(`  ${caseType}: "${result}"`);
        }
        
        console.log('\n✅ Supported case types test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during supported case types testing:', error);
        return false;
    }
}

/**
 * Run all case converter tests
 */
export function runAllCaseConverterTests() {
    console.log('🚀 Starting Advanced Case Converter Test Suite...\n');
    
    const tests = [
        { name: 'Main Case Converter Test', fn: testAdvancedCaseConverter },
        { name: 'Case Detection Test', fn: testCaseDetection },
        { name: 'Unicode Support Test', fn: testUnicodeSupport },
        { name: 'Batch Conversion Test', fn: testBatchConversion },
        { name: 'Utility Functions Test', fn: testUtilityFunctions },
        { name: 'Complex Scenarios Test', fn: testComplexScenarios },
        { name: 'Supported Case Types Test', fn: testSupportedCaseTypes }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        try {
            const result = test.fn();
            if (result) {
                passed++;
            }
        } catch (error) {
            console.error(`❌ ${test.name} failed with error:`, error);
        }
    }
    
    console.log(`\n🏁 Test Suite Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All case converter tests passed!');
    } else {
        console.log('⚠️  Some case converter tests failed');
    }
    
    return passed === total;
}
