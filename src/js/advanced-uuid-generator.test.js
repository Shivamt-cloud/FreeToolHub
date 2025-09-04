/**
 * Test suite for Advanced UUID Generator
 * Tests all UUID versions and validation functionality
 */

import { AdvancedUUIDGenerator, UUIDUtils } from './advanced-uuid-generator.js';

/**
 * Test the Advanced UUID Generator
 */
export function testAdvancedUUIDGenerator() {
    console.log('=== Advanced UUID Generator Test ===');
    
    try {
        const generator = new AdvancedUUIDGenerator();
        
        // Test UUID v4 generation
        console.log('\n--- Testing UUID v4 (Random) ---');
        const v4UUID = generator.generateV4();
        console.log(`Generated v4 UUID: ${v4UUID}`);
        
        const v4Validation = generator.validateUUID(v4UUID);
        console.log(`v4 Validation: ${v4Validation.valid ? '✅ Valid' : '❌ Invalid'}`);
        if (v4Validation.valid) {
            console.log(`Version: ${v4Validation.version}, Variant: ${v4Validation.variant}`);
        }
        
        // Test UUID v7 generation
        console.log('\n--- Testing UUID v7 (Time-ordered) ---');
        const v7UUID = generator.generateV7();
        console.log(`Generated v7 UUID: ${v7UUID}`);
        
        const v7Validation = generator.validateUUID(v7UUID);
        console.log(`v7 Validation: ${v7Validation.valid ? '✅ Valid' : '❌ Invalid'}`);
        if (v7Validation.valid) {
            console.log(`Version: ${v7Validation.version}, Variant: ${v7Validation.variant}`);
        }
        
        // Test UUID v1 generation
        console.log('\n--- Testing UUID v1 (Time-based) ---');
        const v1UUID = generator.generateV1();
        console.log(`Generated v1 UUID: ${v1UUID}`);
        
        const v1Validation = generator.validateUUID(v1UUID);
        console.log(`v1 Validation: ${v1Validation.valid ? '✅ Valid' : '❌ Invalid'}`);
        if (v1Validation.valid) {
            console.log(`Version: ${v1Validation.version}, Variant: ${v1Validation.variant}`);
        }
        
        // Test multiple UUID generation
        console.log('\n--- Testing Multiple UUID Generation ---');
        const multipleV4 = generator.generateMultiple(4, 3);
        console.log(`Generated 3 v4 UUIDs:`);
        multipleV4.forEach((uuid, index) => {
            console.log(`  ${index + 1}: ${uuid}`);
        });
        
        const multipleV7 = generator.generateMultiple(7, 3);
        console.log(`Generated 3 v7 UUIDs:`);
        multipleV7.forEach((uuid, index) => {
            console.log(`  ${index + 1}: ${uuid}`);
        });
        
        // Test UUID information extraction
        console.log('\n--- Testing UUID Information Extraction ---');
        const v1Info = generator.getUUIDInfo(v1UUID);
        console.log(`v1 UUID Info:`, v1Info);
        
        const v7Info = generator.getUUIDInfo(v7UUID);
        console.log(`v7 UUID Info:`, v7Info);
        
        // Test utility functions
        console.log('\n--- Testing Utility Functions ---');
        const utilV4 = UUIDUtils.generateV4();
        console.log(`Utility v4 UUID: ${utilV4}`);
        
        const utilV7 = UUIDUtils.generateV7();
        console.log(`Utility v7 UUID: ${utilV7}`);
        
        const isValid = UUIDUtils.isValid(utilV4);
        console.log(`Is valid UUID: ${isValid ? '✅ Yes' : '❌ No'}`);
        
        const version = UUIDUtils.getVersion(utilV4);
        console.log(`UUID version: ${version}`);
        
        // Test sorting (useful for v7 UUIDs)
        const v7UUIDs = [utilV7, v7UUID, ...multipleV7];
        const sorted = UUIDUtils.sort(v7UUIDs);
        console.log(`Sorted v7 UUIDs:`, sorted);
        
        console.log('\n✅ Advanced UUID Generator test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during UUID generator testing:', error);
        return false;
    }
}

/**
 * Test UUID validation with various inputs
 */
export function testUUIDValidation() {
    console.log('\n=== UUID Validation Test ===');
    
    const testCases = [
        { uuid: '550e8400-e29b-41d4-a716-446655440000', expected: true, version: 4 },
        { uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', expected: true, version: 1 },
        { uuid: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', expected: true, version: 3 },
        { uuid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', expected: true, version: 4 },
        { uuid: '6ba7b813-9dad-11d1-80b4-00c04fd430c8', expected: true, version: 5 },
        { uuid: '01890a5d-ac96-774b-bcce-b302100a00cf', expected: true, version: 7 },
        { uuid: 'invalid-uuid', expected: false },
        { uuid: '550e8400-e29b-41d4-a716-44665544000', expected: false }, // too short
        { uuid: '550e8400-e29b-41d4-a716-4466554400000', expected: false }, // too long
        { uuid: '550e8400-e29b-41d4-a716-44665544000g', expected: false }, // invalid char
    ];
    
    let passed = 0;
    let total = testCases.length;
    
    for (const testCase of testCases) {
        const validation = UUIDUtils.validate(testCase.uuid);
        const isValid = validation.valid;
        const correct = isValid === testCase.expected;
        
        if (testCase.expected && correct) {
            const versionMatch = testCase.version ? validation.version === testCase.version : true;
            if (versionMatch) {
                console.log(`✅ ${testCase.uuid} - Valid (v${validation.version})`);
                passed++;
            } else {
                console.log(`❌ ${testCase.uuid} - Version mismatch (expected v${testCase.version}, got v${validation.version})`);
            }
        } else if (!testCase.expected && !isValid) {
            console.log(`✅ ${testCase.uuid} - Correctly rejected`);
            passed++;
        } else {
            console.log(`❌ ${testCase.uuid} - Expected ${testCase.expected ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'}`);
        }
    }
    
    console.log(`\nValidation test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test UUID uniqueness and distribution
 */
export function testUUIDUniqueness() {
    console.log('\n=== UUID Uniqueness Test ===');
    
    const generator = new AdvancedUUIDGenerator();
    const count = 1000;
    const uuids = new Set();
    
    // Generate v4 UUIDs
    console.log(`Generating ${count} v4 UUIDs...`);
    for (let i = 0; i < count; i++) {
        const uuid = generator.generateV4();
        uuids.add(uuid);
    }
    
    const uniqueCount = uuids.size;
    const collisionRate = ((count - uniqueCount) / count) * 100;
    
    console.log(`Generated: ${count} UUIDs`);
    console.log(`Unique: ${uniqueCount} UUIDs`);
    console.log(`Collision rate: ${collisionRate.toFixed(6)}%`);
    
    if (collisionRate < 0.001) {
        console.log('✅ Uniqueness test passed - very low collision rate');
        return true;
    } else {
        console.log('❌ Uniqueness test failed - high collision rate');
        return false;
    }
}

/**
 * Test UUID v7 time ordering
 */
export function testV7TimeOrdering() {
    console.log('\n=== UUID v7 Time Ordering Test ===');
    
    const generator = new AdvancedUUIDGenerator();
    const uuids = [];
    
    // Generate multiple v7 UUIDs
    for (let i = 0; i < 10; i++) {
        uuids.push(generator.generateV7());
        // Small delay to ensure different timestamps
        if (i < 9) {
            const start = Date.now();
            while (Date.now() - start < 1) { /* wait 1ms */ }
        }
    }
    
    console.log('Generated v7 UUIDs:');
    uuids.forEach((uuid, index) => {
        console.log(`  ${index + 1}: ${uuid}`);
    });
    
    // Check if they are in chronological order
    const sorted = [...uuids].sort();
    const isOrdered = JSON.stringify(uuids) === JSON.stringify(sorted);
    
    console.log(`\nTime ordering: ${isOrdered ? '✅ Correct' : '❌ Incorrect'}`);
    
    if (isOrdered) {
        console.log('✅ v7 UUIDs are properly time-ordered');
        return true;
    } else {
        console.log('❌ v7 UUIDs are not properly time-ordered');
        return false;
    }
}

/**
 * Run all UUID tests
 */
export function runAllUUIDTests() {
    console.log('🚀 Starting Advanced UUID Generator Test Suite...\n');
    
    const tests = [
        { name: 'Main Generator Test', fn: testAdvancedUUIDGenerator },
        { name: 'Validation Test', fn: testUUIDValidation },
        { name: 'Uniqueness Test', fn: testUUIDUniqueness },
        { name: 'v7 Time Ordering Test', fn: testV7TimeOrdering }
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
        console.log('🎉 All UUID generator tests passed!');
    } else {
        console.log('⚠️  Some UUID generator tests failed');
    }
    
    return passed === total;
}
