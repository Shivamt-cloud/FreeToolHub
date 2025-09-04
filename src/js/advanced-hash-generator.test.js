/**
 * Test suite for Advanced Hash Generator
 * Tests all hash algorithms and validation functionality
 */

import { AdvancedHashGenerator, HashUtils } from './advanced-hash-generator.js';

/**
 * Test the Advanced Hash Generator
 */
export function testAdvancedHashGenerator() {
    console.log('=== Advanced Hash Generator Test ===');
    
    try {
        const generator = new AdvancedHashGenerator();
        const testData = 'Hello, World!';
        
        // Test SHA-256
        console.log('\n--- Testing SHA-256 ---');
        const sha256Hash = generator.generateHash(testData, 'sha256');
        console.log(`SHA-256: ${sha256Hash}`);
        console.log(`Length: ${sha256Hash.length} characters`);
        
        // Test BLAKE2b
        console.log('\n--- Testing BLAKE2b ---');
        const blake2bHash = generator.generateHash(testData, 'blake2b', { size: 64 });
        console.log(`BLAKE2b: ${blake2bHash}`);
        console.log(`Length: ${blake2bHash.length} characters`);
        
        // Test xxHash64
        console.log('\n--- Testing xxHash64 ---');
        const xxhashHash = generator.generateHash(testData, 'xxhash64');
        console.log(`xxHash64: ${xxhashHash}`);
        console.log(`Length: ${xxhashHash.length} characters`);
        
        // Test CRC32
        console.log('\n--- Testing CRC32 ---');
        const crc32Hash = generator.generateHash(testData, 'crc32');
        console.log(`CRC32: ${crc32Hash}`);
        console.log(`Length: ${crc32Hash.length} characters`);
        
        // Test password hashing algorithms
        console.log('\n--- Testing Password Hashing ---');
        const password = 'mySecurePassword123';
        const salt = generator.generateSalt(32);
        
        // Test Argon2id
        const argon2Result = generator.generateHash(password, 'argon2id', { 
            salt: salt,
            memory_kb: 65536,
            iterations: 3
        });
        console.log(`Argon2id: ${argon2Result.hash}`);
        console.log(`Salt: ${argon2Result.salt}`);
        
        // Test bcrypt
        const bcryptSalt = generator.generateBcryptSalt();
        const bcryptResult = generator.generateHash(password, 'bcrypt', { 
            salt: bcryptSalt,
            rounds: 12
        });
        console.log(`bcrypt: ${bcryptResult.hash}`);
        console.log(`Rounds: ${bcryptResult.rounds}`);
        
        // Test PBKDF2
        const pbkdf2Result = generator.generateHash(password, 'pbkdf2', { 
            salt: salt,
            iterations: 600000,
            key_length: 32
        });
        console.log(`PBKDF2: ${pbkdf2Result.hash}`);
        console.log(`Iterations: ${pbkdf2Result.iterations}`);
        
        // Test algorithm information
        console.log('\n--- Testing Algorithm Information ---');
        const sha256Info = generator.getAlgorithmInfo('sha256');
        console.log('SHA-256 Info:', sha256Info);
        
        const argon2Info = generator.getAlgorithmInfo('argon2id');
        console.log('Argon2id Info:', argon2Info);
        
        console.log('\n✅ Advanced Hash Generator test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during hash generator testing:', error);
        return false;
    }
}

/**
 * Test hash consistency
 */
export function testHashConsistency() {
    console.log('\n=== Hash Consistency Test ===');
    
    const generator = new AdvancedHashGenerator();
    const testData = 'Consistency Test Data';
    const algorithms = ['sha256', 'xxhash64', 'crc32'];
    
    let passed = 0;
    let total = algorithms.length;
    
    for (const algorithm of algorithms) {
        try {
            // Generate hash multiple times
            const hash1 = generator.generateHash(testData, algorithm);
            const hash2 = generator.generateHash(testData, algorithm);
            
            if (hash1 === hash2) {
                console.log(`✅ ${algorithm}: Consistent (${hash1})`);
                passed++;
            } else {
                console.log(`❌ ${algorithm}: Inconsistent (${hash1} vs ${hash2})`);
            }
        } catch (error) {
            console.log(`❌ ${algorithm}: Error - ${error.message}`);
        }
    }
    
    console.log(`\nConsistency test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test hash uniqueness
 */
export function testHashUniqueness() {
    console.log('\n=== Hash Uniqueness Test ===');
    
    const generator = new AdvancedHashGenerator();
    const testData = ['Hello', 'World', 'Test', 'Data', 'Unique'];
    const algorithm = 'sha256';
    
    const hashes = new Set();
    let passed = 0;
    let total = testData.length;
    
    for (const data of testData) {
        try {
            const hash = generator.generateHash(data, algorithm);
            if (!hashes.has(hash)) {
                hashes.add(hash);
                console.log(`✅ "${data}": ${hash}`);
                passed++;
            } else {
                console.log(`❌ "${data}": Collision detected`);
            }
        } catch (error) {
            console.log(`❌ "${data}": Error - ${error.message}`);
        }
    }
    
    console.log(`\nUniqueness test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test HashUtils
 */
export function testHashUtils() {
    console.log('\n=== HashUtils Test ===');
    
    try {
        const testData = 'HashUtils Test Data';
        
        // Test single hash generation
        const sha256Hash = HashUtils.generate(testData, 'sha256');
        console.log(`Single hash: ${sha256Hash}`);
        
        // Test multiple hash generation
        const algorithms = ['sha256', 'xxhash64', 'crc32'];
        const multipleHashes = HashUtils.generateMultiple(testData, algorithms);
        console.log('Multiple hashes:', multipleHashes);
        
        // Test hash comparison
        const hash1 = HashUtils.generate(testData, 'sha256');
        const hash2 = HashUtils.generate(testData, 'sha256');
        const isEqual = HashUtils.compare(hash1, hash2);
        console.log(`Hash comparison: ${isEqual ? 'Equal' : 'Different'}`);
        
        // Test algorithm recommendations
        const dataIntegrityAlg = HashUtils.getRecommendedAlgorithm('data-integrity');
        const passwordAlg = HashUtils.getRecommendedAlgorithm('password-storage');
        console.log(`Data integrity recommendation: ${dataIntegrityAlg}`);
        console.log(`Password storage recommendation: ${passwordAlg}`);
        
        // Test hash validation
        const isValidSHA256 = HashUtils.validateHash(sha256Hash, 'sha256');
        const isValidMD5 = HashUtils.validateHash('invalid', 'md5');
        console.log(`SHA-256 validation: ${isValidSHA256 ? 'Valid' : 'Invalid'}`);
        console.log(`Invalid MD5 validation: ${isValidMD5 ? 'Valid' : 'Invalid'}`);
        
        console.log('\n✅ HashUtils test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during HashUtils testing:', error);
        return false;
    }
}

/**
 * Test password hashing security
 */
export function testPasswordHashingSecurity() {
    console.log('\n=== Password Hashing Security Test ===');
    
    const generator = new AdvancedHashGenerator();
    const password = 'testPassword123';
    const salt = generator.generateSalt(32);
    
    try {
        // Test Argon2id with different parameters
        const argon2id1 = generator.generateHash(password, 'argon2id', { 
            salt: salt,
            memory_kb: 65536,
            iterations: 3
        });
        
        const argon2id2 = generator.generateHash(password, 'argon2id', { 
            salt: salt,
            memory_kb: 131072, // Different memory
            iterations: 3
        });
        
        console.log(`Argon2id (64MB): ${argon2id1.hash}`);
        console.log(`Argon2id (128MB): ${argon2id2.hash}`);
        console.log(`Different parameters produce different hashes: ${argon2id1.hash !== argon2id2.hash ? 'Yes' : 'No'}`);
        
        // Test bcrypt with different rounds
        const bcryptSalt = generator.generateBcryptSalt();
        const bcrypt1 = generator.generateHash(password, 'bcrypt', { 
            salt: bcryptSalt,
            rounds: 10
        });
        
        const bcrypt2 = generator.generateHash(password, 'bcrypt', { 
            salt: bcryptSalt,
            rounds: 12
        });
        
        console.log(`bcrypt (10 rounds): ${bcrypt1.hash}`);
        console.log(`bcrypt (12 rounds): ${bcrypt2.hash}`);
        console.log(`Different rounds produce different hashes: ${bcrypt1.hash !== bcrypt2.hash ? 'Yes' : 'No'}`);
        
        // Test PBKDF2 with different iterations
        const pbkdf2_1 = generator.generateHash(password, 'pbkdf2', { 
            salt: salt,
            iterations: 100000,
            key_length: 32
        });
        
        const pbkdf2_2 = generator.generateHash(password, 'pbkdf2', { 
            salt: salt,
            iterations: 600000,
            key_length: 32
        });
        
        console.log(`PBKDF2 (100K iterations): ${pbkdf2_1.hash}`);
        console.log(`PBKDF2 (600K iterations): ${pbkdf2_2.hash}`);
        console.log(`Different iterations produce different hashes: ${pbkdf2_1.hash !== pbkdf2_2.hash ? 'Yes' : 'No'}`);
        
        console.log('\n✅ Password hashing security test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during password hashing security testing:', error);
        return false;
    }
}

/**
 * Run all hash generator tests
 */
export function runAllHashGeneratorTests() {
    console.log('🚀 Starting Advanced Hash Generator Test Suite...\n');
    
    const tests = [
        { name: 'Main Generator Test', fn: testAdvancedHashGenerator },
        { name: 'Hash Consistency Test', fn: testHashConsistency },
        { name: 'Hash Uniqueness Test', fn: testHashUniqueness },
        { name: 'HashUtils Test', fn: testHashUtils },
        { name: 'Password Hashing Security Test', fn: testPasswordHashingSecurity }
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
        console.log('🎉 All hash generator tests passed!');
    } else {
        console.log('⚠️  Some hash generator tests failed');
    }
    
    return passed === total;
}
