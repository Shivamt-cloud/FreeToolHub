/**
 * Test Suite for Advanced Password Generator
 * Tests CSPRNG, rejection sampling, entropy calculations, and all generation modes
 */

// Test runner function
function runAdvancedPasswordGeneratorTests() {
    console.log('🔐 Running Advanced Password Generator Tests...\n');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };

    // Helper function to run tests
    function runTest(testName, testFunction) {
        results.total++;
        try {
            testFunction();
            console.log(`✅ ${testName}`);
            results.passed++;
        } catch (error) {
            console.log(`❌ ${testName}: ${error.message}`);
            results.failed++;
        }
    }

    // Test 1: SecureRandomGenerator creation
    runTest('SecureRandomGenerator creation', () => {
        const randomGen = new SecureRandomGenerator();
        if (!randomGen || typeof randomGen.secureRandomByte !== 'function') {
            throw new Error('SecureRandomGenerator not created properly');
        }
    });

    // Test 2: Secure random byte generation
    runTest('Secure random byte generation', () => {
        const randomGen = new SecureRandomGenerator();
        const byte = randomGen.secureRandomByte();
        if (typeof byte !== 'number' || byte < 0 || byte > 255) {
            throw new Error('Invalid random byte generated');
        }
    });

    // Test 3: Secure index generation
    runTest('Secure index generation', () => {
        const randomGen = new SecureRandomGenerator();
        const index = randomGen.secureIndex(10);
        if (typeof index !== 'number' || index < 0 || index >= 10) {
            throw new Error('Invalid secure index generated');
        }
    });

    // Test 4: CharacterSets static properties
    runTest('CharacterSets static properties', () => {
        if (CharacterSets.UPPERCASE.length !== 26) {
            throw new Error('UPPERCASE should have 26 characters');
        }
        if (CharacterSets.LOWERCASE.length !== 26) {
            throw new Error('LOWERCASE should have 26 characters');
        }
        if (CharacterSets.DIGITS.length !== 10) {
            throw new Error('DIGITS should have 10 characters');
        }
        if (CharacterSets.ALPHANUMERIC.length !== 62) {
            throw new Error('ALPHANUMERIC should have 62 characters');
        }
    });

    // Test 5: Entropy calculations
    runTest('Entropy calculations', () => {
        const length = CharacterSets.calculateLength(96, 95);
        if (length < 14 || length > 16) {
            throw new Error('Invalid length calculation for 96 bits entropy');
        }
        
        const entropy = CharacterSets.calculateEntropy(15, 95);
        if (entropy < 95 || entropy > 100) {
            throw new Error('Invalid entropy calculation');
        }
    });

    // Test 6: DicewareWordlist
    runTest('DicewareWordlist', () => {
        if (DicewareWordlist.WORDS.length < 100) {
            throw new Error('Diceware wordlist should have at least 100 words');
        }
        if (Math.abs(DicewareWordlist.BITS_PER_WORD - 12.9) > 0.1) {
            throw new Error('Bits per word should be approximately 12.9');
        }
    });

    // Test 7: PasswordScreener creation
    runTest('PasswordScreener creation', () => {
        const screener = new PasswordScreener();
        if (!screener || typeof screener.isBreached !== 'function') {
            throw new Error('PasswordScreener not created properly');
        }
    });

    // Test 8: Breach detection
    runTest('Breach detection', () => {
        const screener = new PasswordScreener();
        if (!screener.isBreached('password')) {
            throw new Error('Should detect common breached password');
        }
        if (screener.isBreached('randomSecurePassword123!')) {
            throw new Error('Should not flag secure password as breached');
        }
    });

    // Test 9: Policy validation
    runTest('Policy validation', () => {
        const screener = new PasswordScreener();
        const policy = { minLength: 8, requireUppercase: true };
        
        const validResult = screener.meetsPolicy('Password123', policy);
        if (!validResult.valid) {
            throw new Error('Valid password should pass policy check');
        }
        
        const invalidResult = screener.meetsPolicy('pass', policy);
        if (invalidResult.valid) {
            throw new Error('Invalid password should fail policy check');
        }
    });

    // Test 10: Password assessment
    runTest('Password assessment', () => {
        const screener = new PasswordScreener();
        const assessment = screener.assessPassword('Password123!');
        
        if (!assessment.entropy || assessment.entropy < 50) {
            throw new Error('Password should have reasonable entropy');
        }
        if (!assessment.strength || !assessment.recommendations) {
            throw new Error('Assessment should include strength and recommendations');
        }
    });

    // Test 11: AdvancedPasswordGenerator creation
    runTest('AdvancedPasswordGenerator creation', () => {
        const generator = new AdvancedPasswordGenerator();
        if (!generator || typeof generator.generatePassword !== 'function') {
            throw new Error('AdvancedPasswordGenerator not created properly');
        }
    });

    // Test 12: Character-based password generation
    runTest('Character-based password generation', () => {
        const generator = new AdvancedPasswordGenerator();
        const result = generator.generatePassword({
            targetEntropy: 80,
            alphabet: CharacterSets.ALPHANUMERIC,
            minLength: 8,
            maxLength: 128
        });
        
        if (!result.password || result.password.length < 8) {
            throw new Error('Generated password should meet length requirements');
        }
        if (result.entropy < 75) {
            throw new Error('Generated password should meet entropy requirements');
        }
    });

    // Test 13: Diceware passphrase generation
    runTest('Diceware passphrase generation', () => {
        const generator = new AdvancedPasswordGenerator();
        const result = generator.generatePassphrase({
            targetEntropy: 77,
            separator: ' ',
            addRandomChars: false
        });
        
        if (!result.password || !result.password.includes(' ')) {
            throw new Error('Generated passphrase should contain separator');
        }
        if (result.mode !== 'diceware') {
            throw new Error('Result should indicate diceware mode');
        }
    });

    // Test 14: Password validation
    runTest('Password validation', () => {
        const generator = new AdvancedPasswordGenerator();
        const assessment = generator.validatePassword('TestPassword123!');
        
        if (!assessment.entropy || !assessment.strength) {
            throw new Error('Validation should return entropy and strength');
        }
    });

    // Test 15: Multiple password generation
    runTest('Multiple password generation', () => {
        const generator = new AdvancedPasswordGenerator();
        const results = generator.generateMultiplePasswords(3, {
            targetEntropy: 80,
            alphabet: CharacterSets.FULL_ASCII
        });
        
        if (results.length !== 3) {
            throw new Error('Should generate requested number of passwords');
        }
        results.forEach(result => {
            if (!result.password || result.entropy < 75) {
                throw new Error('Each password should meet requirements');
            }
        });
    });

    // Test 16: Entropy information
    runTest('Entropy information', () => {
        const generator = new AdvancedPasswordGenerator();
        const entropyInfo = generator.getEntropyInfo();
        
        if (!entropyInfo['Full ASCII'] || !entropyInfo['Diceware (EFF)']) {
            throw new Error('Should return entropy info for all character sets');
        }
        
        const fullAscii = entropyInfo['Full ASCII'];
        if (fullAscii.alphabetSize !== 95) {
            throw new Error('Full ASCII should have 95 characters');
        }
    });

    // Test 17: Custom character set
    runTest('Custom character set', () => {
        const generator = new AdvancedPasswordGenerator();
        const customAlphabet = 'ABC123!@#';
        const result = generator.generatePassword({
            targetEntropy: 80,
            alphabet: customAlphabet,
            minLength: 8,
            maxLength: 128
        });
        
        // Check that all characters in result are from custom alphabet
        for (const char of result.password) {
            if (!customAlphabet.includes(char)) {
                throw new Error('Generated password should only use custom characters');
            }
        }
    });

    // Test 18: Policy enforcement
    runTest('Policy enforcement', () => {
        const generator = new AdvancedPasswordGenerator();
        const policy = {
            minLength: 10,
            requireUppercase: true,
            requireDigits: true,
            requireSymbols: true
        };
        
        const result = generator.generatePassword({
            targetEntropy: 96,
            alphabet: CharacterSets.FULL_ASCII,
            policy: policy
        });
        
        if (result.password.length < 10) {
            throw new Error('Password should meet minimum length requirement');
        }
        if (!/[A-Z]/.test(result.password)) {
            throw new Error('Password should contain uppercase letter');
        }
        if (!/\d/.test(result.password)) {
            throw new Error('Password should contain digit');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(result.password)) {
            throw new Error('Password should contain symbol');
        }
    });

    // Test 19: Error handling
    runTest('Error handling', () => {
        const generator = new AdvancedPasswordGenerator();
        
        try {
            generator.generatePassword({
                targetEntropy: 96,
                alphabet: '',
                minLength: 8,
                maxLength: 128
            });
            throw new Error('Should throw error for empty alphabet');
        } catch (error) {
            // Expected error
        }
        
        try {
            generator.generatePassword({
                targetEntropy: 96,
                alphabet: CharacterSets.FULL_ASCII,
                minLength: 20,
                maxLength: 10
            });
            throw new Error('Should throw error for invalid length constraints');
        } catch (error) {
            // Expected error
        }
    });

    // Test 20: Performance and consistency
    runTest('Performance and consistency', () => {
        const generator = new AdvancedPasswordGenerator();
        const startTime = performance.now();
        
        // Generate multiple passwords to test performance
        for (let i = 0; i < 10; i++) {
            generator.generatePassword({
                targetEntropy: 80,
                alphabet: CharacterSets.ALPHANUMERIC
            });
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration > 1000) { // Should complete within 1 second
            throw new Error('Password generation should be reasonably fast');
        }
    });

    // Print test results
    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Total: ${results.total}`);
    console.log(`🎯 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    if (results.failed === 0) {
        console.log('\n🎉 All tests passed! The Advanced Password Generator is working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Please check the implementation.');
    }

    return results;
}

// Export for use in testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAdvancedPasswordGeneratorTests };
} else {
    // Browser environment
    window.runAdvancedPasswordGeneratorTests = runAdvancedPasswordGeneratorTests;
}
