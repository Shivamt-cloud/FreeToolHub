/**
 * Advanced Timestamp Converter Test Suite
 * Comprehensive tests for all timestamp conversion functionality
 */

import { 
    TimestampConverter, 
    TimestampParser, 
    TimestampFormatter, 
    TimezoneHandler, 
    TimestampUtils 
} from './advanced-timestamp-converter.js';

// Simple test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Advanced Timestamp Converter Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('❌ Some tests failed!');
        }
    }
}

const runner = new TestRunner();

/**
 * TimestampParser Tests
 */
runner.addTest('TimestampParser - Epoch Seconds', () => {
    const parser = new TimestampParser();
    const result = parser.parse(1693867800);
    
    if (result !== 1693867800000) {
        throw new Error('Epoch seconds parsing failed');
    }
});

runner.addTest('TimestampParser - Epoch Milliseconds', () => {
    const parser = new TimestampParser();
    const result = parser.parse(1693867800000);
    
    if (result !== 1693867800000) {
        throw new Error('Epoch milliseconds parsing failed');
    }
});

runner.addTest('TimestampParser - ISO 8601 UTC', () => {
    const parser = new TimestampParser();
    const result = parser.parse('2023-09-04T22:50:00Z');
    
    // Should be close to 1693867800000 (within 1 second tolerance)
    const expected = 1693867800000;
    if (Math.abs(result - expected) > 1000) {
        throw new Error('ISO 8601 UTC parsing failed');
    }
});

runner.addTest('TimestampParser - ISO 8601 with Timezone', () => {
    const parser = new TimestampParser();
    const result = parser.parse('2023-09-05T04:20:00+05:30');
    
    // Should be close to 1693887600000 (within 1 second tolerance)
    const expected = 1693887600000;
    if (Math.abs(result - expected) > 1000) {
        throw new Error('ISO 8601 with timezone parsing failed');
    }
});

runner.addTest('TimestampParser - Custom Pattern YYYY-MM-DD', () => {
    const parser = new TimestampParser();
    const result = parser.parse('2023-09-04', 'YYYY-MM-DD');
    
    // Should be start of day in UTC
    const expected = new Date('2023-09-04T00:00:00Z').getTime();
    if (Math.abs(result - expected) > 1000) {
        throw new Error('Custom pattern YYYY-MM-DD parsing failed');
    }
});

runner.addTest('TimestampParser - Custom Pattern with Time', () => {
    const parser = new TimestampParser();
    const result = parser.parse('2023-09-04 22:50:00', 'YYYY-MM-DD HH:mm:ss');
    
    const expected = new Date('2023-09-04T22:50:00Z').getTime();
    if (Math.abs(result - expected) > 1000) {
        throw new Error('Custom pattern with time parsing failed');
    }
});

runner.addTest('TimestampParser - 12 Hour Format', () => {
    const parser = new TimestampParser();
    const result = parser.parse('2023-09-04 10:50 PM', 'YYYY-MM-DD h:mm A');
    
    const expected = new Date('2023-09-04T22:50:00Z').getTime();
    if (Math.abs(result - expected) > 1000) {
        throw new Error('12 hour format parsing failed');
    }
});

runner.addTest('TimestampParser - Auto Detection', () => {
    const parser = new TimestampParser();
    
    // Test epoch auto-detection
    const epochResult = parser.parse('1693877400');
    if (epochResult !== 1693877400000) {
        throw new Error('Epoch auto-detection failed');
    }
    
    // Test ISO 8601 auto-detection
    const isoResult = parser.parse('2023-09-04T22:50:00Z');
    const expected = new Date('2023-09-04T22:50:00Z').getTime();
    if (Math.abs(isoResult - expected) > 1000) {
        throw new Error('ISO 8601 auto-detection failed');
    }
});

/**
 * TimestampFormatter Tests
 */
runner.addTest('TimestampFormatter - Epoch Seconds Output', () => {
    const formatter = new TimestampFormatter();
    const result = formatter.format(1693867800000, 'epoch_s');
    
    if (result !== '1693867800') {
        throw new Error('Epoch seconds formatting failed');
    }
});

runner.addTest('TimestampFormatter - Epoch Milliseconds Output', () => {
    const formatter = new TimestampFormatter();
    const result = formatter.format(1693867800000, 'epoch_ms');
    
    if (result !== '1693867800000') {
        throw new Error('Epoch milliseconds formatting failed');
    }
});

runner.addTest('TimestampFormatter - ISO 8601 Output', () => {
    const formatter = new TimestampFormatter();
    const result = formatter.format(1693867800000, 'ISO8601');
    
    if (!result.includes('2023-09-04T22:50:00')) {
        throw new Error('ISO 8601 formatting failed');
    }
});

runner.addTest('TimestampFormatter - Custom Pattern Output', () => {
    const formatter = new TimestampFormatter();
    const result = formatter.format(1693867800000, 'YYYY-MM-DD HH:mm:ss');
    
    if (result !== '2023-09-04 22:50:00') {
        throw new Error('Custom pattern formatting failed');
    }
});

runner.addTest('TimestampFormatter - 12 Hour Format Output', () => {
    const formatter = new TimestampFormatter();
    const result = formatter.format(1693867800000, 'YYYY-MM-DD h:mm A');
    
    if (result !== '2023-09-04 10:50 PM') {
        throw new Error('12 hour format output failed');
    }
});

runner.addTest('TimestampFormatter - Timezone Conversion', () => {
    const formatter = new TimestampFormatter();
    const result = formatter.format(1693867800000, 'ISO8601', 'Asia/Kolkata');
    
    if (!result.includes('+05:30') && !result.includes('2023-09-05T04:20:00')) {
        throw new Error('Timezone conversion failed');
    }
});

runner.addTest('TimestampFormatter - Relative Time', () => {
    const formatter = new TimestampFormatter();
    const now = Date.now();
    const past = now - (2 * 24 * 60 * 60 * 1000); // 2 days ago
    const future = now + (3 * 60 * 60 * 1000); // 3 hours from now
    
    const pastResult = formatter.format(past, 'relative');
    const futureResult = formatter.format(future, 'relative');
    
    if (!pastResult.includes('ago') || !futureResult.includes('in')) {
        throw new Error('Relative time formatting failed');
    }
});

/**
 * TimezoneHandler Tests
 */
runner.addTest('TimezoneHandler - Get Offset', () => {
    const handler = new TimezoneHandler();
    
    const utcOffset = handler.getOffsetForInstant(Date.now(), 'UTC');
    if (utcOffset !== 0) {
        throw new Error('UTC offset should be 0');
    }
    
    const istOffset = handler.getOffsetForInstant(Date.now(), 'Asia/Kolkata');
    if (istOffset !== 330) { // +5:30
        throw new Error('IST offset should be 330 minutes');
    }
});

runner.addTest('TimezoneHandler - Apply Offset', () => {
    const handler = new TimezoneHandler();
    const utcMs = 1693877400000;
    const offsetMinutes = 330; // +5:30
    
    const result = handler.applyOffset(utcMs, offsetMinutes);
    const expected = utcMs + (330 * 60 * 1000);
    
    if (result !== expected) {
        throw new Error('Offset application failed');
    }
});

runner.addTest('TimezoneHandler - Supported Timezones', () => {
    const handler = new TimezoneHandler();
    const timezones = handler.getSupportedTimezones();
    
    if (!timezones.includes('UTC') || !timezones.includes('Asia/Kolkata')) {
        throw new Error('Supported timezones list incomplete');
    }
});

/**
 * TimestampConverter Integration Tests
 */
runner.addTest('TimestampConverter - Epoch to ISO', () => {
    const converter = new TimestampConverter();
    const result = converter.convert(1693867800, null, 'ISO8601');
    
    if (!result.includes('2023-09-04T22:50:00')) {
        throw new Error('Epoch to ISO conversion failed');
    }
});

runner.addTest('TimestampConverter - ISO to Epoch', () => {
    const converter = new TimestampConverter();
    const result = converter.convert('2023-09-04T22:50:00Z', null, 'epoch_s');
    
    if (result !== '1693867800') {
        throw new Error('ISO to epoch conversion failed');
    }
});

runner.addTest('TimestampConverter - Custom Pattern to Custom Pattern', () => {
    const converter = new TimestampConverter();
    const result = converter.convert(
        '04/09/2023 10:50 PM', 
        'DD/MM/YYYY h:mm A', 
        'YYYY-MM-DD HH:mm:ss'
    );
    
    if (result !== '2023-09-04 22:50:00') {
        throw new Error('Custom pattern to custom pattern conversion failed');
    }
});

runner.addTest('TimestampConverter - Timezone Conversion', () => {
    const converter = new TimestampConverter();
    const result = converter.convert(
        '2023-09-04T22:50:00Z', 
        null, 
        'ISO8601', 
        'Asia/Kolkata'
    );
    
    if (!result.includes('+05:30') && !result.includes('2023-09-05T04:20:00')) {
        throw new Error('Timezone conversion failed');
    }
});

runner.addTest('TimestampConverter - Relative Time', () => {
    const converter = new TimestampConverter();
    const now = Date.now();
    const past = now - (2 * 24 * 60 * 60 * 1000); // 2 days ago
    
    const result = converter.convert(past, null, 'relative');
    
    if (!result.includes('ago')) {
        throw new Error('Relative time conversion failed');
    }
});

runner.addTest('TimestampConverter - Input Validation', () => {
    const converter = new TimestampConverter();
    
    // Valid input
    const validResult = converter.validateInput('2023-09-04T22:50:00Z');
    if (!validResult.valid) {
        throw new Error('Valid input should pass validation');
    }
    
    // Invalid input
    const invalidResult = converter.validateInput('invalid-timestamp');
    if (invalidResult.valid) {
        throw new Error('Invalid input should fail validation');
    }
});

runner.addTest('TimestampConverter - Supported Formats', () => {
    const converter = new TimestampConverter();
    const formats = converter.getSupportedFormats();
    
    if (!formats.includes('ISO8601') || !formats.includes('epoch_s')) {
        throw new Error('Supported formats list incomplete');
    }
});

runner.addTest('TimestampConverter - Supported Timezones', () => {
    const converter = new TimestampConverter();
    const timezones = converter.getSupportedTimezones();
    
    if (!timezones.includes('UTC') || !timezones.includes('Asia/Kolkata')) {
        throw new Error('Supported timezones list incomplete');
    }
});

/**
 * TimestampUtils Tests
 */
runner.addTest('TimestampUtils - Current Time', () => {
    const now = TimestampUtils.now();
    const expected = Date.now();
    
    if (Math.abs(now - expected) > 1000) {
        throw new Error('Current time should be close to Date.now()');
    }
});

runner.addTest('TimestampUtils - Current Time in Format', () => {
    const result = TimestampUtils.nowInFormat('epoch_s');
    
    if (typeof result !== 'string' || isNaN(parseInt(result))) {
        throw new Error('Current time in format should return valid epoch string');
    }
});

runner.addTest('TimestampUtils - Timezone Offset', () => {
    const utcOffset = TimestampUtils.getTimezoneOffset('UTC');
    if (utcOffset !== 0) {
        throw new Error('UTC offset should be 0');
    }
    
    const istOffset = TimestampUtils.getTimezoneOffset('Asia/Kolkata');
    if (istOffset !== 330) {
        throw new Error('IST offset should be 330 minutes');
    }
});

runner.addTest('TimestampUtils - Duration Formatting', () => {
    const result1 = TimestampUtils.formatDuration(3661000); // 1h 1m 1s
    if (!result1.includes('1h') || !result1.includes('1m') || !result1.includes('1s')) {
        throw new Error('Duration formatting failed for hours');
    }
    
    const result2 = TimestampUtils.formatDuration(61000); // 1m 1s
    if (!result2.includes('1m') || !result2.includes('1s')) {
        throw new Error('Duration formatting failed for minutes');
    }
    
    const result3 = TimestampUtils.formatDuration(5000); // 5s
    if (!result3.includes('5s')) {
        throw new Error('Duration formatting failed for seconds');
    }
});

/**
 * Edge Cases and Error Handling
 */
runner.addTest('Edge Case - Leap Year', () => {
    const converter = new TimestampConverter();
    const result = converter.convert('2024-02-29T12:00:00Z', null, 'YYYY-MM-DD');
    
    if (result !== '2024-02-29') {
        throw new Error('Leap year handling failed');
    }
});

runner.addTest('Edge Case - Year Boundary', () => {
    const converter = new TimestampConverter();
    const result = converter.convert('2023-12-31T23:59:59Z', null, 'YYYY-MM-DD HH:mm:ss');
    
    if (result !== '2023-12-31 23:59:59') {
        throw new Error('Year boundary handling failed');
    }
});

runner.addTest('Edge Case - Invalid Input', () => {
    const converter = new TimestampConverter();
    
    try {
        converter.convert('invalid-timestamp');
        throw new Error('Should have thrown error for invalid input');
    } catch (error) {
        if (!error.message.includes('Conversion failed')) {
            throw new Error('Error message should indicate conversion failure');
        }
    }
});

runner.addTest('Edge Case - Empty Input', () => {
    const converter = new TimestampConverter();
    
    try {
        converter.convert('');
        throw new Error('Should have thrown error for empty input');
    } catch (error) {
        if (!error.message.includes('Conversion failed')) {
            throw new Error('Error message should indicate conversion failure');
        }
    }
});

runner.addTest('Edge Case - Very Large Timestamp', () => {
    const converter = new TimestampConverter();
    const largeTimestamp = 9999999999999; // Very large epoch ms
    
    try {
        const result = converter.convert(largeTimestamp, null, 'ISO8601');
        if (!result.includes('T')) {
            throw new Error('Large timestamp should format correctly');
        }
    } catch (error) {
        // Large timestamps might be invalid, which is acceptable
        if (!error.message.includes('Conversion failed')) {
            throw new Error('Error message should indicate conversion failure');
        }
    }
});

/**
 * Performance Tests
 */
runner.addTest('Performance - Batch Conversion', () => {
    const converter = new TimestampConverter();
    const startTime = Date.now();
    
    // Convert 100 timestamps
    for (let i = 0; i < 100; i++) {
        converter.convert(1693877400 + i, null, 'ISO8601');
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (duration > 1000) { // Should complete in less than 1 second
        throw new Error('Batch conversion too slow');
    }
});

// Run all tests
runner.run().catch(console.error);
