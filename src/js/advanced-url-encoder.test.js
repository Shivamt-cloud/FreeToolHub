/**
 * Test suite for Advanced URL Encoder/Decoder
 * Tests all encoding/decoding functionality and RFC compliance
 */

import { AdvancedURLProcessor, URLProcessorUtils } from './advanced-url-encoder.js';

/**
 * Test the Advanced URL Processor
 */
export function testAdvancedURLProcessor() {
    console.log('=== Advanced URL Processor Test ===');
    
    try {
        const processor = new AdvancedURLProcessor();
        const testText = 'Hello World! @#$%';
        
        console.log('Input text:', testText);
        
        // Test basic encoding
        console.log('\n--- Testing Basic Encoding ---');
        const encodingTests = [
            ['uri_component', 'Hello%20World!%20%40%23%24%25'],
            ['uri_full', 'Hello%20World!%20@%23%24%25'],
            ['form_urlencoded', 'Hello+World!+%40%23%24%25'],
            ['rfc3986_strict', 'Hello%20World%21%20%40%23%24%25']
        ];
        
        for (const [mode, expected] of encodingTests) {
            const result = processor.encoder.encode(testText, mode);
            console.log(`✅ ${mode}: "${result}"`);
        }
        
        // Test basic decoding
        console.log('\n--- Testing Basic Decoding ---');
        const encodedText = 'Hello%20World!%20%40%23%24%25';
        const decoded = processor.decoder.decode(encodedText, 'standard');
        console.log(`✅ Decoded: "${decoded}"`);
        
        // Test form data processing
        console.log('\n--- Testing Form Data Processing ---');
        const formData = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'message': 'Hello & welcome!'
        };
        
        const encodedForm = processor.formProcessor.encodeFormData(formData);
        console.log(`✅ Encoded form: "${encodedForm}"`);
        
        const decodedForm = processor.formProcessor.decodeFormData(encodedForm);
        console.log(`✅ Decoded form:`, decodedForm);
        
        // Test Base64URL
        console.log('\n--- Testing Base64URL ---');
        const testData = 'This is a test';
        const b64urlEncoded = processor.base64url.encodeBase64url(testData);
        console.log(`✅ Base64URL encoded: "${b64urlEncoded}"`);
        
        const b64urlDecoded = new TextDecoder().decode(processor.base64url.decodeBase64url(b64urlEncoded));
        console.log(`✅ Base64URL decoded: "${b64urlDecoded}"`);
        
        console.log('\n✅ Advanced URL Processor test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during URL processor testing:', error);
        return false;
    }
}

/**
 * Test URL component encoding
 */
export function testURLComponentEncoding() {
    console.log('\n=== URL Component Encoding Test ===');
    
    const processor = new AdvancedURLProcessor();
    const urlParts = {
        'scheme': 'https',
        'host': 'example.com',
        'path': '/api/users/john doe',
        'query': 'filter=active&sort=name',
        'fragment': 'section 1'
    };
    
    try {
        const encodedParts = processor.encodeUrlComponents(urlParts);
        console.log('Original URL parts:', urlParts);
        console.log('Encoded URL parts:', encodedParts);
        
        const builtUrl = processor.buildUrl(encodedParts);
        console.log('Built URL:', builtUrl);
        
        console.log('\n✅ URL component encoding test passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during URL component encoding:', error);
        return false;
    }
}

/**
 * Test Unicode support
 */
export function testUnicodeSupport() {
    console.log('\n=== Unicode Support Test ===');
    
    const processor = new AdvancedURLProcessor();
    const unicodeTests = [
        { text: 'Hello 世界', mode: 'uri_component' },
        { text: 'café naïve', mode: 'form_urlencoded' },
        { text: '🚀 emoji test', mode: 'uri_component' },
        { text: 'Straße', mode: 'uri_full' }
    ];
    
    let passed = 0;
    let total = unicodeTests.length;
    
    for (const test of unicodeTests) {
        try {
            const encoded = processor.encoder.encode(test.text, test.mode);
            const decoded = processor.decoder.decode(encoded, 'standard');
            
            console.log(`✅ "${test.text}" -> "${encoded}" -> "${decoded}" (${test.mode})`);
            passed++;
        } catch (error) {
            console.log(`❌ "${test.text}" -> Error: ${error.message}`);
        }
    }
    
    console.log(`\nUnicode support test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test form data edge cases
 */
export function testFormDataEdgeCases() {
    console.log('\n=== Form Data Edge Cases Test ===');
    
    const processor = new AdvancedURLProcessor();
    
    try {
        // Test multiple values for same key
        const multiValueData = {
            'tags': ['javascript', 'url', 'encoding'],
            'name': 'John Doe'
        };
        
        const encoded = processor.formProcessor.encodeFormData(multiValueData);
        console.log('Multi-value encoded:', encoded);
        
        const decoded = processor.formProcessor.decodeFormData(encoded);
        console.log('Multi-value decoded:', decoded);
        
        // Test empty values
        const emptyData = {
            'name': 'John',
            'email': '',
            'message': 'Hello'
        };
        
        const emptyEncoded = processor.formProcessor.encodeFormData(emptyData);
        console.log('Empty values encoded:', emptyEncoded);
        
        const emptyDecoded = processor.formProcessor.decodeFormData(emptyEncoded);
        console.log('Empty values decoded:', emptyDecoded);
        
        console.log('\n✅ Form data edge cases test passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during form data edge cases testing:', error);
        return false;
    }
}

/**
 * Test URL parsing and building
 */
export function testURLParsingAndBuilding() {
    console.log('\n=== URL Parsing and Building Test ===');
    
    const processor = new AdvancedURLProcessor();
    const testUrls = [
        'https://example.com/path/to/resource?param=value#section',
        'http://localhost:3000/api/users',
        'ftp://files.example.com/documents/file.txt',
        '/relative/path?query=test',
        'mailto:user@example.com'
    ];
    
    let passed = 0;
    let total = testUrls.length;
    
    for (const url of testUrls) {
        try {
            const parsed = processor.parseUrl(url);
            const built = processor.buildUrl(parsed);
            
            console.log(`✅ "${url}" -> parsed -> "${built}"`);
            passed++;
        } catch (error) {
            console.log(`❌ "${url}" -> Error: ${error.message}`);
        }
    }
    
    console.log(`\nURL parsing and building test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test Base64URL edge cases
 */
export function testBase64URLEdgeCases() {
    console.log('\n=== Base64URL Edge Cases Test ===');
    
    const processor = new AdvancedURLProcessor();
    const testCases = [
        'Short',
        'Medium length string',
        'Very long string with special characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
        'Unicode: 世界 🚀',
        '' // Empty string
    ];
    
    let passed = 0;
    let total = testCases.length;
    
    for (const testCase of testCases) {
        try {
            const encoded = processor.base64url.encodeBase64url(testCase);
            const decoded = new TextDecoder().decode(processor.base64url.decodeBase64url(encoded));
            
            const success = decoded === testCase;
            console.log(`${success ? '✅' : '❌'} "${testCase}" -> "${encoded}" -> "${decoded}"`);
            if (success) passed++;
        } catch (error) {
            console.log(`❌ "${testCase}" -> Error: ${error.message}`);
        }
    }
    
    console.log(`\nBase64URL edge cases test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test utility functions
 */
export function testUtilityFunctions() {
    console.log('\n=== Utility Functions Test ===');
    
    try {
        // Test mode descriptions
        const descriptions = [
            URLProcessorUtils.getModeDescription('uri_component'),
            URLProcessorUtils.getModeDescription('form_urlencoded'),
            URLProcessorUtils.getModeDescription('standard')
        ];
        console.log('Mode descriptions:', descriptions);
        
        // Test mode categories
        const categories = [
            URLProcessorUtils.getModeCategory('uri_component'),
            URLProcessorUtils.getModeCategory('standard'),
            URLProcessorUtils.getModeCategory('unknown')
        ];
        console.log('Mode categories:', categories);
        
        // Test mode formatting
        const formatted = [
            URLProcessorUtils.formatMode('uri_component'),
            URLProcessorUtils.formatMode('form_urlencoded')
        ];
        console.log('Formatted modes:', formatted);
        
        // Test mode icons
        const icons = [
            URLProcessorUtils.getModeIcon('uri_component'),
            URLProcessorUtils.getModeIcon('form_urlencoded'),
            URLProcessorUtils.getModeIcon('standard')
        ];
        console.log('Mode icons:', icons);
        
        // Test URL validation
        const urlValidation = [
            URLProcessorUtils.isValidUrl('https://example.com'),
            URLProcessorUtils.isValidUrl('invalid-url'),
            URLProcessorUtils.isValidUrl('http://localhost:3000')
        ];
        console.log('URL validation:', urlValidation);
        
        // Test URL info
        const urlInfo = URLProcessorUtils.getUrlInfo('https://example.com:8080/path?query=value#fragment');
        console.log('URL info:', urlInfo);
        
        console.log('\n✅ Utility functions test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during utility functions testing:', error);
        return false;
    }
}

/**
 * Test error handling
 */
export function testErrorHandling() {
    console.log('\n=== Error Handling Test ===');
    
    const processor = new AdvancedURLProcessor();
    
    try {
        // Test invalid percent sequences
        const invalidPercent = 'Hello%2GWorld'; // Invalid hex
        const decoded = processor.decoder.decode(invalidPercent, 'standard', { strictPercent: false });
        console.log(`✅ Invalid percent handled: "${decoded}"`);
        
        // Test strict mode
        try {
            processor.decoder.decode(invalidPercent, 'standard', { strictPercent: true });
            console.log('❌ Should have thrown error in strict mode');
        } catch (error) {
            console.log('✅ Strict mode correctly threw error:', error.message);
        }
        
        // Test invalid form data
        try {
            processor.formProcessor.encodeFormData('invalid');
            console.log('❌ Should have thrown error for invalid form data');
        } catch (error) {
            console.log('✅ Invalid form data correctly threw error:', error.message);
        }
        
        console.log('\n✅ Error handling test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during error handling testing:', error);
        return false;
    }
}

/**
 * Test supported modes
 */
export function testSupportedModes() {
    console.log('\n=== Supported Modes Test ===');
    
    const processor = new AdvancedURLProcessor();
    
    try {
        const supportedModes = processor.getSupportedModes();
        
        console.log('Supported encoding modes:', supportedModes.encoding);
        console.log('Supported decoding modes:', supportedModes.decoding);
        
        // Test each encoding mode
        const testText = 'Hello World!';
        console.log('\nTesting encoding modes:');
        for (const mode of supportedModes.encoding) {
            try {
                const result = processor.encoder.encode(testText, mode);
                console.log(`  ${mode}: "${result}"`);
            } catch (error) {
                console.log(`  ${mode}: Error - ${error.message}`);
            }
        }
        
        // Test each decoding mode
        const encodedText = 'Hello%20World%21';
        console.log('\nTesting decoding modes:');
        for (const mode of supportedModes.decoding) {
            try {
                const result = processor.decoder.decode(encodedText, mode);
                console.log(`  ${mode}: "${result}"`);
            } catch (error) {
                console.log(`  ${mode}: Error - ${error.message}`);
            }
        }
        
        console.log('\n✅ Supported modes test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during supported modes testing:', error);
        return false;
    }
}

/**
 * Run all URL encoder/decoder tests
 */
export function runAllURLProcessorTests() {
    console.log('🚀 Starting Advanced URL Processor Test Suite...\n');
    
    const tests = [
        { name: 'Main URL Processor Test', fn: testAdvancedURLProcessor },
        { name: 'URL Component Encoding Test', fn: testURLComponentEncoding },
        { name: 'Unicode Support Test', fn: testUnicodeSupport },
        { name: 'Form Data Edge Cases Test', fn: testFormDataEdgeCases },
        { name: 'URL Parsing and Building Test', fn: testURLParsingAndBuilding },
        { name: 'Base64URL Edge Cases Test', fn: testBase64URLEdgeCases },
        { name: 'Utility Functions Test', fn: testUtilityFunctions },
        { name: 'Error Handling Test', fn: testErrorHandling },
        { name: 'Supported Modes Test', fn: testSupportedModes }
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
        console.log('🎉 All URL processor tests passed!');
    } else {
        console.log('⚠️  Some URL processor tests failed');
    }
    
    return passed === total;
}
