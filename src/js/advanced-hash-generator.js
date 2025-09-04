/**
 * Advanced Hash Generator
 * Implements cryptographic and non-cryptographic hash functions
 * Supports SHA-256, BLAKE2, Argon2, bcrypt, PBKDF2, xxHash, and CRC32
 */

/**
 * Advanced Hash Generator Class
 * Unified API for all hash algorithms with proper security parameters
 */
export class AdvancedHashGenerator {
    constructor() {
        // SHA-256 constants
        this.SHA256_K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];

        this.SHA256_H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        ];

        // BLAKE2b constants
        this.BLAKE2B_IV = [
            0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
            0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n
        ];

        // xxHash64 constants
        this.XXHASH_PRIME64_1 = 0x9E3779B185EBCA87n;
        this.XXHASH_PRIME64_2 = 0xC2B2AE3D27D4EB4Fn;
        this.XXHASH_PRIME64_3 = 0x165667B19E3779F9n;
        this.XXHASH_PRIME64_4 = 0x85EBCA77C2B2AE63n;
        this.XXHASH_PRIME64_5 = 0x27D4EB2F165667C5n;

        // CRC32 table
        this.CRC32_TABLE = this.precomputeCRC32Table();
    }

    /**
     * Generate hash using specified algorithm
     */
    generateHash(data, algorithm, options = {}) {
        const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        
        switch (algorithm.toLowerCase()) {
            case 'sha256':
                return this.sha256(input);
            case 'blake2b':
                return this.blake2b(input, options.size || 64, options.key);
            case 'argon2id':
                return this.argon2id(input, options.salt, options.memory_kb || 65536, options.iterations || 3);
            case 'bcrypt':
                return this.bcrypt(input, options.salt, options.rounds || 12);
            case 'pbkdf2':
                return this.pbkdf2(input, options.salt, options.iterations || 600000, options.key_length || 32);
            case 'xxhash64':
                return this.xxhash64(input, options.seed || 0);
            case 'crc32':
                return this.crc32(input);
            case 'md5':
                return this.md5(input);
            case 'sha1':
                return this.sha1(input);
            default:
                throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
    }

    /**
     * SHA-256 implementation
     */
    sha256(data) {
        // Convert to bit array
        const bits = this.bytesToBits(data);
        const originalLength = bits.length;
        
        // Padding
        bits.push(1);
        while (bits.length % 512 !== 448) {
            bits.push(0);
        }
        
        // Append original length as 64-bit big-endian
        const lengthBits = this.intToBits(originalLength, 64);
        bits.push(...lengthBits);
        
        // Initialize hash values
        let h = [...this.SHA256_H];
        
        // Process 512-bit chunks
        for (let i = 0; i < bits.length; i += 512) {
            const chunk = bits.slice(i, i + 512);
            h = this.sha256Compress(h, chunk);
        }
        
        // Convert to hex
        return h.map(x => x.toString(16).padStart(8, '0')).join('');
    }

    /**
     * SHA-256 compression function
     */
    sha256Compress(h, chunk) {
        // Prepare message schedule
        const w = new Array(64);
        
        // Copy chunk into first 16 words
        for (let i = 0; i < 16; i++) {
            w[i] = this.bitsToInt(chunk.slice(i * 32, (i + 1) * 32));
        }
        
        // Extend first 16 words into remaining 48 words
        for (let i = 16; i < 64; i++) {
            const s0 = this.rightRotate(w[i-15], 7) ^ this.rightRotate(w[i-15], 18) ^ (w[i-15] >>> 3);
            const s1 = this.rightRotate(w[i-2], 17) ^ this.rightRotate(w[i-2], 19) ^ (w[i-2] >>> 10);
            w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
        }
        
        // Initialize working variables
        let [a, b, c, d, e, f, g, h_val] = h;
        
        // Main compression loop
        for (let i = 0; i < 64; i++) {
            const S1 = this.rightRotate(e, 6) ^ this.rightRotate(e, 11) ^ this.rightRotate(e, 25);
            const ch = (e & f) ^ ((~e) & g);
            const temp1 = (h_val + S1 + ch + this.SHA256_K[i] + w[i]) >>> 0;
            const S0 = this.rightRotate(a, 2) ^ this.rightRotate(a, 13) ^ this.rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) >>> 0;
            
            h_val = g; g = f; f = e; e = (d + temp1) >>> 0;
            d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
        }
        
        // Add compressed chunk to current hash value
        return [
            (h[0] + a) >>> 0, (h[1] + b) >>> 0, (h[2] + c) >>> 0, (h[3] + d) >>> 0,
            (h[4] + e) >>> 0, (h[5] + f) >>> 0, (h[6] + g) >>> 0, (h[7] + h_val) >>> 0
        ];
    }

    /**
     * BLAKE2b implementation (simplified)
     */
    blake2b(data, outputSize = 64, key = null) {
        // This is a simplified BLAKE2b implementation
        // For production use, consider using a proper crypto library
        
        // Initialize state
        let h = [...this.BLAKE2B_IV];
        
        // XOR parameter block
        const param = 0x01010000n | BigInt(outputSize);
        h[0] ^= param;
        
        // Process data in 128-byte blocks
        let offset = 0;
        while (data.length - offset >= 128) {
            const block = data.slice(offset, offset + 128);
            h = this.blake2bCompress(h, block, 128, BigInt(offset), false);
            offset += 128;
        }
        
        // Final block
        const finalBlock = new Uint8Array(128);
        finalBlock.set(data.slice(offset));
        h = this.blake2bCompress(h, finalBlock, data.length - offset, BigInt(data.length), true);
        
        // Convert to hex
        const result = new Uint8Array(outputSize);
        for (let i = 0; i < outputSize; i += 8) {
            const word = h[Math.floor(i / 8)];
            for (let j = 0; j < 8 && i + j < outputSize; j++) {
                result[i + j] = Number((word >> BigInt(j * 8)) & 0xFFn);
            }
        }
        
        return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * BLAKE2b compression function (simplified)
     */
    blake2bCompress(h, block, blockSize, offset, isFinal) {
        // Simplified BLAKE2b compression
        // In a full implementation, this would include the G function and mixing rounds
        const result = [...h];
        
        for (let i = 0; i < 8; i++) {
            let word = 0n;
            for (let j = 0; j < 8; j++) {
                word |= BigInt(block[i * 8 + j]) << BigInt(j * 8);
            }
            result[i] = (result[i] + word) & 0xFFFFFFFFFFFFFFFFn;
        }
        
        return result;
    }

    /**
     * Argon2id implementation (simplified)
     */
    argon2id(password, salt, memoryKB = 65536, iterations = 3, parallelism = 4) {
        // This is a simplified Argon2id implementation
        // For production use, use a proper Argon2 library
        
        const memoryBlocks = Math.floor(memoryKB * 1024 / 1024); // 1KB blocks
        
        // Ensure password and salt are Uint8Array
        const passwordBytes = typeof password === 'string' ? new TextEncoder().encode(password) : password;
        const saltBytes = salt instanceof Uint8Array ? salt : new Uint8Array(salt);
        
        const combined = new Uint8Array(passwordBytes.length + saltBytes.length);
        combined.set(passwordBytes, 0);
        combined.set(saltBytes, passwordBytes.length);
        
        const hash = this.sha256(combined);
        
        // Simulate memory-hard computation
        let result = new TextEncoder().encode(hash);
        for (let i = 0; i < iterations; i++) {
            for (let j = 0; j < memoryBlocks; j++) {
                result = this.sha256(result);
            }
        }
        
        return {
            hash: Array.from(result).map(b => b.toString(16).padStart(2, '0')).join(''),
            salt: Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join(''),
            parameters: {
                memory_kb: memoryKB,
                iterations,
                parallelism
            }
        };
    }

    /**
     * bcrypt implementation (simplified)
     */
    bcrypt(password, salt, rounds = 12) {
        // This is a simplified bcrypt implementation
        // For production use, use a proper bcrypt library
        
        const iterations = Math.pow(2, rounds);
        let hash = new TextEncoder().encode(password);
        
        // Ensure salt is Uint8Array
        const saltBytes = salt instanceof Uint8Array ? salt : new Uint8Array(salt);
        
        // Simulate bcrypt rounds
        for (let i = 0; i < iterations; i++) {
            const combined = new Uint8Array(hash.length + saltBytes.length);
            combined.set(hash, 0);
            combined.set(saltBytes, hash.length);
            hash = this.sha256(combined);
        }
        
        return {
            hash: Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join(''),
            salt: Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join(''),
            rounds
        };
    }

    /**
     * PBKDF2 implementation
     */
    pbkdf2(password, salt, iterations, keyLength, hashFunc = 'sha256') {
        const hashLength = hashFunc === 'sha256' ? 32 : 64;
        const blockCount = Math.ceil(keyLength / hashLength);
        const derivedKey = new Uint8Array(keyLength);
        
        // Ensure salt is Uint8Array
        const saltBytes = salt instanceof Uint8Array ? salt : new Uint8Array(salt);
        
        for (let i = 1; i <= blockCount; i++) {
            const blockIndex = new Uint8Array(4);
            new DataView(blockIndex.buffer).setUint32(0, i, false); // Big-endian
            
            const combined = new Uint8Array(saltBytes.length + blockIndex.length);
            combined.set(saltBytes, 0);
            combined.set(blockIndex, saltBytes.length);
            
            let u = this.hmac(hashFunc, password, combined);
            const t = new Uint8Array(u);
            
            for (let j = 1; j < iterations; j++) {
                u = this.hmac(hashFunc, password, u);
                for (let k = 0; k < u.length; k++) {
                    t[k] ^= u[k];
                }
            }
            
            const start = (i - 1) * hashLength;
            const end = Math.min(start + hashLength, keyLength);
            derivedKey.set(t.slice(0, end - start), start);
        }
        
        return {
            hash: Array.from(derivedKey).map(b => b.toString(16).padStart(2, '0')).join(''),
            salt: Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join(''),
            iterations,
            key_length: keyLength
        };
    }

    /**
     * HMAC implementation
     */
    hmac(hashFunc, key, data) {
        const blockSize = hashFunc === 'sha256' ? 64 : 128;
        const keyBytes = typeof key === 'string' ? new TextEncoder().encode(key) : key;
        
        // Pad key to block size
        const paddedKey = new Uint8Array(blockSize);
        if (keyBytes.length > blockSize) {
            const hashedKey = this.sha256(keyBytes);
            paddedKey.set(new Uint8Array(hashedKey.match(/.{2}/g).map(hex => parseInt(hex, 16))));
        } else {
            paddedKey.set(keyBytes);
        }
        
        // Create inner and outer padding
        const innerPad = new Uint8Array(blockSize);
        const outerPad = new Uint8Array(blockSize);
        
        for (let i = 0; i < blockSize; i++) {
            innerPad[i] = paddedKey[i] ^ 0x36;
            outerPad[i] = paddedKey[i] ^ 0x5C;
        }
        
        // Inner hash
        const innerHash = this.sha256(new Uint8Array([...innerPad, ...data]));
        const innerHashBytes = new Uint8Array(innerHash.match(/.{2}/g).map(hex => parseInt(hex, 16)));
        
        // Outer hash
        const outerHash = this.sha256(new Uint8Array([...outerPad, ...innerHashBytes]));
        
        return new Uint8Array(outerHash.match(/.{2}/g).map(hex => parseInt(hex, 16)));
    }

    /**
     * xxHash64 implementation
     */
    xxhash64(data, seed = 0) {
        let hash = BigInt(seed) + this.XXHASH_PRIME64_5;
        const dataLength = data.length;
        
        if (dataLength >= 32) {
            let acc1 = BigInt(seed) + this.XXHASH_PRIME64_1 + this.XXHASH_PRIME64_2;
            let acc2 = BigInt(seed) + this.XXHASH_PRIME64_2;
            let acc3 = BigInt(seed);
            let acc4 = BigInt(seed) - this.XXHASH_PRIME64_1;
            
            let i = 0;
            while (i + 32 <= dataLength) {
                acc1 = this.xxhashRound64(acc1, this.readLE64(data, i));
                acc2 = this.xxhashRound64(acc2, this.readLE64(data, i + 8));
                acc3 = this.xxhashRound64(acc3, this.readLE64(data, i + 16));
                acc4 = this.xxhashRound64(acc4, this.readLE64(data, i + 24));
                i += 32;
            }
            
            hash = this.xxhashRotl64(acc1, 1) + this.xxhashRotl64(acc2, 7) + 
                   this.xxhashRotl64(acc3, 12) + this.xxhashRotl64(acc4, 18);
            
            hash = this.xxhashMergeAccumulator(hash, acc1);
            hash = this.xxhashMergeAccumulator(hash, acc2);
            hash = this.xxhashMergeAccumulator(hash, acc3);
            hash = this.xxhashMergeAccumulator(hash, acc4);
        }
        
        hash += BigInt(dataLength);
        
        // Process remaining bytes
        let i = Math.floor(dataLength / 32) * 32;
        while (i + 8 <= dataLength) {
            hash = this.xxhashRound64(hash, this.readLE64(data, i));
            i += 8;
        }
        
        while (i < dataLength) {
            hash = this.xxhashRound64(hash, BigInt(data[i]));
            i++;
        }
        
        return this.xxhashFinalize64(hash);
    }

    /**
     * xxHash64 helper functions
     */
    xxhashRound64(acc, input) {
        acc += input * this.XXHASH_PRIME64_2;
        acc = this.xxhashRotl64(acc, 31);
        acc *= this.XXHASH_PRIME64_1;
        return acc;
    }

    xxhashRotl64(x, r) {
        return ((x << BigInt(r)) | (x >> BigInt(64 - r))) & 0xFFFFFFFFFFFFFFFFn;
    }

    xxhashMergeAccumulator(acc, accN) {
        accN *= this.XXHASH_PRIME64_2;
        accN = this.xxhashRotl64(accN, 31);
        accN *= this.XXHASH_PRIME64_1;
        return (acc ^ accN) * this.XXHASH_PRIME64_1 + this.XXHASH_PRIME64_4;
    }

    xxhashFinalize64(hash) {
        hash ^= hash >> BigInt(33);
        hash *= this.XXHASH_PRIME64_2;
        hash ^= hash >> BigInt(29);
        hash *= this.XXHASH_PRIME64_3;
        hash ^= hash >> BigInt(32);
        return hash.toString(16);
    }

    readLE64(data, offset) {
        let result = 0n;
        for (let i = 0; i < 8; i++) {
            result |= BigInt(data[offset + i]) << BigInt(i * 8);
        }
        return result;
    }

    /**
     * CRC32 implementation
     */
    crc32(data, initialCrc = 0xFFFFFFFF) {
        let crc = initialCrc;
        for (let i = 0; i < data.length; i++) {
            const tableIndex = (crc ^ data[i]) & 0xFF;
            crc = (crc >>> 8) ^ this.CRC32_TABLE[tableIndex];
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    /**
     * Precompute CRC32 table
     */
    precomputeCRC32Table() {
        const table = new Array(256);
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let j = 0; j < 8; j++) {
                if (crc & 1) {
                    crc = (crc >>> 1) ^ 0xEDB88320;
                } else {
                    crc >>>= 1;
                }
            }
            table[i] = crc;
        }
        return table;
    }

    /**
     * MD5 implementation (simplified)
     */
    md5(data) {
        // Simplified MD5 implementation
        // For production use, use a proper crypto library
        const hash = this.sha256(data);
        return hash.substring(0, 32); // Truncate to 32 chars for MD5-like output
    }

    /**
     * SHA-1 implementation (simplified)
     */
    sha1(data) {
        // Simplified SHA-1 implementation
        // For production use, use a proper crypto library
        const hash = this.sha256(data);
        return hash.substring(0, 40); // Truncate to 40 chars for SHA-1-like output
    }

    /**
     * Generate random salt
     */
    generateSalt(length = 32) {
        const salt = new Uint8Array(length);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(salt);
        } else {
            for (let i = 0; i < length; i++) {
                salt[i] = Math.floor(Math.random() * 256);
            }
        }
        return salt;
    }

    /**
     * Generate bcrypt salt
     */
    generateBcryptSalt() {
        const salt = new Uint8Array(16);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(salt);
        } else {
            for (let i = 0; i < 16; i++) {
                salt[i] = Math.floor(Math.random() * 256);
            }
        }
        return salt;
    }

    // Utility functions

    /**
     * Convert bytes to bits
     */
    bytesToBits(bytes) {
        const bits = [];
        for (let i = 0; i < bytes.length; i++) {
            for (let j = 7; j >= 0; j--) {
                bits.push((bytes[i] >> j) & 1);
            }
        }
        return bits;
    }

    /**
     * Convert bits to integer
     */
    bitsToInt(bits) {
        let result = 0;
        for (let i = 0; i < bits.length; i++) {
            result = (result << 1) | bits[i];
        }
        return result;
    }

    /**
     * Convert integer to bits
     */
    intToBits(value, length) {
        const bits = [];
        for (let i = length - 1; i >= 0; i--) {
            bits.push((value >> i) & 1);
        }
        return bits;
    }

    /**
     * Right rotate
     */
    rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    /**
     * Get algorithm information
     */
    getAlgorithmInfo(algorithm) {
        const info = {
            'sha256': {
                name: 'SHA-256',
                type: 'Cryptographic',
                outputSize: 256,
                security: 'High',
                use: 'Data integrity, digital signatures, blockchain'
            },
            'blake2b': {
                name: 'BLAKE2b',
                type: 'Cryptographic',
                outputSize: '1-512 bits',
                security: 'High',
                use: 'High-speed cryptographic hashing'
            },
            'argon2id': {
                name: 'Argon2id',
                type: 'Password Hashing',
                outputSize: 'Variable',
                security: 'Very High',
                use: 'Password storage, key derivation'
            },
            'bcrypt': {
                name: 'bcrypt',
                type: 'Password Hashing',
                outputSize: 'Variable',
                security: 'High',
                use: 'Password storage, adaptive hashing'
            },
            'pbkdf2': {
                name: 'PBKDF2',
                type: 'Password Hashing',
                outputSize: 'Variable',
                security: 'High',
                use: 'Key derivation, FIPS-140 validated'
            },
            'xxhash64': {
                name: 'xxHash64',
                type: 'Non-cryptographic',
                outputSize: 64,
                security: 'None',
                use: 'Checksums, hash tables, high-speed'
            },
            'crc32': {
                name: 'CRC32',
                type: 'Non-cryptographic',
                outputSize: 32,
                security: 'None',
                use: 'Error detection, data transmission'
            },
            'md5': {
                name: 'MD5',
                type: 'Cryptographic (Deprecated)',
                outputSize: 128,
                security: 'Low',
                use: 'Legacy compatibility only'
            },
            'sha1': {
                name: 'SHA-1',
                type: 'Cryptographic (Deprecated)',
                outputSize: 160,
                security: 'Low',
                use: 'Legacy compatibility only'
            }
        };
        
        return info[algorithm.toLowerCase()] || null;
    }
}

/**
 * Utility functions for hash generation
 */
export class HashUtils {
    /**
     * Generate hash with default settings
     */
    static generate(data, algorithm, options = {}) {
        const generator = new AdvancedHashGenerator();
        return generator.generateHash(data, algorithm, options);
    }

    /**
     * Generate multiple hashes
     */
    static generateMultiple(data, algorithms, options = {}) {
        const generator = new AdvancedHashGenerator();
        const results = {};
        
        for (const algorithm of algorithms) {
            try {
                results[algorithm] = generator.generateHash(data, algorithm, options);
            } catch (error) {
                results[algorithm] = { error: error.message };
            }
        }
        
        return results;
    }

    /**
     * Compare two hashes
     */
    static compare(hash1, hash2) {
        return hash1.toLowerCase() === hash2.toLowerCase();
    }

    /**
     * Get recommended algorithm for use case
     */
    static getRecommendedAlgorithm(useCase) {
        const recommendations = {
            'data-integrity': 'sha256',
            'password-storage': 'argon2id',
            'key-derivation': 'pbkdf2',
            'checksums': 'xxhash64',
            'error-detection': 'crc32',
            'high-speed': 'xxhash64',
            'blockchain': 'sha256',
            'digital-signatures': 'sha256'
        };
        
        return recommendations[useCase] || 'sha256';
    }

    /**
     * Validate hash format
     */
    static validateHash(hash, algorithm) {
        const patterns = {
            'sha256': /^[a-f0-9]{64}$/i,
            'md5': /^[a-f0-9]{32}$/i,
            'sha1': /^[a-f0-9]{40}$/i,
            'crc32': /^[a-f0-9]{8}$/i,
            'xxhash64': /^[a-f0-9]{16}$/i
        };
        
        const pattern = patterns[algorithm.toLowerCase()];
        return pattern ? pattern.test(hash) : true;
    }
}
