/**
 * Test Suite for Advanced Timezone Converter
 * Comprehensive tests for timezone conversion functionality
 */

import { TimezoneConverter, TimezoneDB, TimezoneFormatter, TimezoneUtils } from './advanced-timezone-converter.js';

// Test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Advanced Timezone Converter Tests...\n');

        for (const test of this.tests) {
            try {
                await test.testFn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const runner = new TestRunner();

// Test TimezoneDB
runner.test('TimezoneDB - Get Offset for UTC', () => {
    const tzdb = new TimezoneDB();
    const offset = tzdb.getOffsetMsForInstant(Date.now(), 'UTC');
    if (offset !== 0) throw new Error(`Expected 0, got ${offset}`);
});

runner.test('TimezoneDB - Get Offset for Fixed Offset', () => {
    const tzdb = new TimezoneDB();
    const offset = tzdb.getOffsetMsForInstant(Date.now(), '+05:30');
    const expected = 5.5 * 60 * 60 * 1000; // 5.5 hours in ms
    if (Math.abs(offset - expected) > 1000) throw new Error(`Expected ~${expected}, got ${offset}`);
});

runner.test('TimezoneDB - Get Offset for New York (EST)', () => {
    const tzdb = new TimezoneDB();
    // Test during EST (winter time)
    const winterTime = new Date('2024-12-15T12:00:00Z').getTime();
    const offset = tzdb.getOffsetMsForInstant(winterTime, 'America/New_York');
    const expected = -5 * 60 * 60 * 1000; // -5 hours in ms
    if (Math.abs(offset - expected) > 1000) throw new Error(`Expected ~${expected}, got ${offset}`);
});

runner.test('TimezoneDB - Get Offset for New York (EDT)', () => {
    const tzdb = new TimezoneDB();
    // Test during EDT (summer time)
    const summerTime = new Date('2024-07-15T12:00:00Z').getTime();
    const offset = tzdb.getOffsetMsForInstant(summerTime, 'America/New_York');
    const expected = -4 * 60 * 60 * 1000; // -4 hours in ms
    if (Math.abs(offset - expected) > 1000) throw new Error(`Expected ~${expected}, got ${offset}`);
});

runner.test('TimezoneDB - Get Timezone Abbreviation', () => {
    const tzdb = new TimezoneDB();
    const winterTime = new Date('2024-12-15T12:00:00Z').getTime();
    const abbreviation = tzdb.getTimezoneAbbreviation(winterTime, 'America/New_York');
    if (abbreviation !== 'EST') throw new Error(`Expected EST, got ${abbreviation}`);
});

runner.test('TimezoneDB - Parse Fixed Offset', () => {
    const tzdb = new TimezoneDB();
    const offset = tzdb.parseFixedOffsetToMs('+05:30');
    const expected = 5.5 * 60 * 60 * 1000;
    if (Math.abs(offset - expected) > 1000) throw new Error(`Expected ~${expected}, got ${offset}`);
});

runner.test('TimezoneDB - Parse Negative Fixed Offset', () => {
    const tzdb = new TimezoneDB();
    const offset = tzdb.parseFixedOffsetToMs('-07:00');
    const expected = -7 * 60 * 60 * 1000;
    if (Math.abs(offset - expected) > 1000) throw new Error(`Expected ~${expected}, got ${offset}`);
});

runner.test('TimezoneDB - Get Supported Timezones', () => {
    const tzdb = new TimezoneDB();
    const timezones = tzdb.getSupportedTimezones();
    if (!timezones.includes('UTC')) throw new Error('UTC not in supported timezones');
    if (!timezones.includes('America/New_York')) throw new Error('America/New_York not in supported timezones');
    if (timezones.length < 10) throw new Error(`Expected at least 10 timezones, got ${timezones.length}`);
});

// Test TimezoneFormatter
runner.test('TimezoneFormatter - Format with Timezone Tokens', () => {
    const formatter = new TimezoneFormatter();
    const utcMs = new Date('2024-09-04T12:00:00Z').getTime();
    const result = formatter.formatWithTimezone(utcMs, 'YYYY-MM-DD HH:mm:ss Z', 'Asia/Kolkata');
    if (!result.includes('+05:30')) throw new Error(`Expected +05:30 in result, got ${result}`);
});

runner.test('TimezoneFormatter - Format with Abbreviation Token', () => {
    const formatter = new TimezoneFormatter();
    const utcMs = new Date('2024-09-04T12:00:00Z').getTime();
    const result = formatter.formatWithTimezone(utcMs, 'YYYY-MM-DD HH:mm:ss z', 'Asia/Kolkata');
    if (!result.includes('IST')) throw new Error(`Expected IST in result, got ${result}`);
});

runner.test('TimezoneFormatter - Format 12-Hour with AM/PM', () => {
    const formatter = new TimezoneFormatter();
    const utcMs = new Date('2024-09-04T12:00:00Z').getTime();
    const result = formatter.formatWithTimezone(utcMs, 'YYYY-MM-DD h:mm A z', 'America/New_York');
    if (!result.includes('AM') && !result.includes('PM')) throw new Error(`Expected AM/PM in result, got ${result}`);
});

runner.test('TimezoneFormatter - Format ISO 8601 with Timezone', () => {
    const formatter = new TimezoneFormatter();
    const utcMs = new Date('2024-09-04T12:00:00Z').getTime();
    const result = formatter.formatISO8601WithTimezone(utcMs, 'Asia/Kolkata');
    if (!result.includes('+05:30')) throw new Error(`Expected +05:30 in result, got ${result}`);
    if (!result.includes('T')) throw new Error(`Expected T in ISO format, got ${result}`);
});

// Test TimezoneConverter
runner.test('TimezoneConverter - Convert UTC to IST', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-09-04T12:00:00Z', null, 'UTC', 'Asia/Kolkata', 'ISO8601');
    if (!result.includes('+05:30')) throw new Error(`Expected +05:30 in result, got ${result}`);
    if (!result.includes('17:30')) throw new Error(`Expected 17:30 (12:00 + 5:30) in result, got ${result}`);
});

runner.test('TimezoneConverter - Convert New York to Tokyo', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-09-04T08:00:00', 'YYYY-MM-DDTHH:mm:ss', 'America/New_York', 'Asia/Tokyo', 'ISO8601');
    if (!result.includes('+09:00')) throw new Error(`Expected +09:00 in result, got ${result}`);
    if (!result.includes('21:00')) throw new Error(`Expected 21:00 (8:00 + 13 hours) in result, got ${result}`);
});

runner.test('TimezoneConverter - Convert with Custom Format', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-09-04 22:50:00', 'YYYY-MM-DD HH:mm:ss', '+00:00', '-07:00', 'DD-MM-YYYY h:mm A Z');
    if (!result.includes('-07:00')) throw new Error(`Expected -07:00 in result, got ${result}`);
    if (!result.includes('03:50 PM')) throw new Error(`Expected 03:50 PM (22:50 - 7 hours = 15:50 in 12-hour format) in result, got ${result}`);
});

runner.test('TimezoneConverter - Convert Epoch to Timezone', () => {
    const converter = new TimezoneConverter();
    const epochMs = new Date('2024-09-04T12:00:00Z').getTime();
    const result = converter.convert(epochMs, null, 'UTC', 'Europe/Berlin', 'YYYY/MM/DD HH:mm z');
    if (!result.includes('CEST') && !result.includes('CET')) throw new Error(`Expected CEST or CET in result, got ${result}`);
});

runner.test('TimezoneConverter - Convert with DST Transition', () => {
    const converter = new TimezoneConverter();
    // Test during DST (summer)
    const summerResult = converter.convert('2024-07-15T12:00:00Z', null, 'UTC', 'America/New_York', 'HH:mm z');
    if (!summerResult.includes('EDT')) throw new Error(`Expected EDT in summer result, got ${summerResult}`);
    
    // Test during standard time (winter)
    const winterResult = converter.convert('2024-12-15T12:00:00Z', null, 'UTC', 'America/New_York', 'HH:mm z');
    if (!winterResult.includes('EST')) throw new Error(`Expected EST in winter result, got ${winterResult}`);
});

runner.test('TimezoneConverter - Parse ISO 8601 with Timezone', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-09-04T12:00:00+05:30', null, 'Asia/Kolkata', 'UTC', 'ISO8601');
    if (!result.includes('06:30')) throw new Error(`Expected 06:30 (12:00 - 5:30) in result, got ${result}`);
});

runner.test('TimezoneConverter - Parse Custom Pattern', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('04/09/2024 10:50 PM', 'DD/MM/YYYY h:mm A', 'America/New_York', 'UTC', 'ISO8601');
    if (!result.includes('02:50')) throw new Error(`Expected 02:50 (10:50 PM EDT + 4 hours = 02:50 AM next day) in result, got ${result}`);
});

runner.test('TimezoneConverter - Auto Parse Common Formats', () => {
    const converter = new TimezoneConverter();
    
    // Test YYYY-MM-DD HH:mm:ss
    const result1 = converter.convert('2024-09-04 12:00:00', null, 'UTC', 'UTC', 'ISO8601');
    if (!result1.includes('12:00')) throw new Error(`Expected 12:00 in result1, got ${result1}`);
    
    // Test YYYY/MM/DD HH:mm:ss
    const result2 = converter.convert('2024/09/04 12:00:00', null, 'UTC', 'UTC', 'ISO8601');
    if (!result2.includes('12:00')) throw new Error(`Expected 12:00 in result2, got ${result2}`);
});

runner.test('TimezoneConverter - Validate Input', () => {
    const converter = new TimezoneConverter();
    
    // Valid inputs
    if (!converter.validateInput('2024-09-04T12:00:00Z')) throw new Error('Valid ISO 8601 should pass validation');
    if (!converter.validateInput(1693843200000)) throw new Error('Valid epoch should pass validation');
    if (!converter.validateInput('2024-09-04 12:00:00', 'YYYY-MM-DD HH:mm:ss')) throw new Error('Valid custom format should pass validation');
    
    // Invalid inputs
    if (converter.validateInput('invalid-date')) throw new Error('Invalid date should fail validation');
    if (converter.validateInput('2024-13-45T25:70:80Z')) throw new Error('Invalid date values should fail validation');
});

runner.test('TimezoneConverter - Get Supported Timezones', () => {
    const converter = new TimezoneConverter();
    const timezones = converter.getSupportedTimezones();
    if (!timezones.includes('UTC')) throw new Error('UTC not in supported timezones');
    if (!timezones.includes('America/New_York')) throw new Error('America/New_York not in supported timezones');
    if (timezones.length < 10) throw new Error(`Expected at least 10 timezones, got ${timezones.length}`);
});

runner.test('TimezoneConverter - Get Timezone Info', () => {
    const converter = new TimezoneConverter();
    const info = converter.getTimezoneInfo('Asia/Kolkata');
    if (!info) throw new Error('Timezone info should not be null');
    if (info.name !== 'Asia/Kolkata') throw new Error(`Expected Asia/Kolkata, got ${info.name}`);
    if (info.abbreviation !== 'IST') throw new Error(`Expected IST, got ${info.abbreviation}`);
});

// Test TimezoneUtils
runner.test('TimezoneUtils - Get Current Time in Timezone', () => {
    const result = TimezoneUtils.getCurrentTimeInTimezone('Asia/Kolkata');
    if (!result.includes('+05:30')) throw new Error(`Expected +05:30 in current time, got ${result}`);
});

runner.test('TimezoneUtils - Get Current Timezone Offset', () => {
    const offset = TimezoneUtils.getCurrentTimezoneOffset('Asia/Kolkata');
    if (Math.abs(offset - 330) > 1) throw new Error(`Expected ~330 minutes, got ${offset}`);
});

runner.test('TimezoneUtils - Check DST Observation', () => {
    if (!TimezoneUtils.observesDST('America/New_York')) throw new Error('America/New_York should observe DST');
    if (TimezoneUtils.observesDST('Asia/Kolkata')) throw new Error('Asia/Kolkata should not observe DST');
    if (!TimezoneUtils.observesDST('Europe/London')) throw new Error('Europe/London should observe DST');
});

runner.test('TimezoneUtils - Get Current Timezone Abbreviation', () => {
    const abbreviation = TimezoneUtils.getCurrentTimezoneAbbreviation('Asia/Kolkata');
    if (abbreviation !== 'IST') throw new Error(`Expected IST, got ${abbreviation}`);
});

// Test Error Handling
runner.test('TimezoneConverter - Handle Unknown Timezone', () => {
    const converter = new TimezoneConverter();
    try {
        converter.convert('2024-09-04T12:00:00Z', null, 'UTC', 'Unknown/Timezone', 'ISO8601');
        throw new Error('Should have thrown error for unknown timezone');
    } catch (error) {
        if (!error.message.includes('Unknown timezone')) throw new Error(`Expected unknown timezone error, got ${error.message}`);
    }
});

runner.test('TimezoneConverter - Handle Invalid Input Format', () => {
    const converter = new TimezoneConverter();
    try {
        converter.convert('invalid-date', 'YYYY-MM-DD', 'UTC', 'UTC', 'ISO8601');
        throw new Error('Should have thrown error for invalid input');
    } catch (error) {
        if (!error.message.includes('conversion failed')) throw new Error(`Expected conversion failed error, got ${error.message}`);
    }
});

runner.test('TimezoneConverter - Handle Invalid Fixed Offset', () => {
    const converter = new TimezoneConverter();
    try {
        converter.convert('2024-09-04T12:00:00Z', null, 'UTC', 'invalid-offset', 'ISO8601');
        throw new Error('Should have thrown error for invalid offset');
    } catch (error) {
        if (!error.message.includes('Unknown timezone')) throw new Error(`Expected unknown timezone error, got ${error.message}`);
    }
});

// Test Edge Cases
runner.test('TimezoneConverter - Handle Leap Year', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-02-29T12:00:00Z', null, 'UTC', 'UTC', 'YYYY-MM-DD');
    if (!result.includes('2024-02-29')) throw new Error(`Expected 2024-02-29 in result, got ${result}`);
});

runner.test('TimezoneConverter - Handle Year Boundary', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2023-12-31T23:59:59Z', null, 'UTC', 'Asia/Tokyo', 'YYYY-MM-DD HH:mm:ss');
    if (!result.includes('2024-01-01')) throw new Error(`Expected 2024-01-01 in result, got ${result}`);
});

runner.test('TimezoneConverter - Handle Month Boundary', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-01-31T23:59:59Z', null, 'UTC', 'Asia/Tokyo', 'YYYY-MM-DD HH:mm:ss');
    if (!result.includes('2024-02-01')) throw new Error(`Expected 2024-02-01 in result, got ${result}`);
});

runner.test('TimezoneConverter - Handle Day Boundary', () => {
    const converter = new TimezoneConverter();
    const result = converter.convert('2024-09-04T23:59:59Z', null, 'UTC', 'Asia/Tokyo', 'YYYY-MM-DD HH:mm:ss');
    if (!result.includes('2024-09-05')) throw new Error(`Expected 2024-09-05 in result, got ${result}`);
});

// Test Performance
runner.test('TimezoneConverter - Performance Test', () => {
    const converter = new TimezoneConverter();
    const start = Date.now();
    
    // Perform 100 conversions
    for (let i = 0; i < 100; i++) {
        converter.convert('2024-09-04T12:00:00Z', null, 'UTC', 'Asia/Kolkata', 'ISO8601');
    }
    
    const end = Date.now();
    const duration = end - start;
    
    if (duration > 1000) throw new Error(`Performance test took too long: ${duration}ms`);
});

// Run all tests
runner.run().then(success => {
    if (success) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.log('\n💥 Some tests failed!');
    }
});
