/**
 * Advanced Base64 Encoder/Decoder Module for FreeToolHub
 * Implements RFC 4648 standards with URL-safe variants and MIME wrapping
 */

class AdvancedBase64Encoder {
    constructor() {
        // Standard Base64 alphabet (RFC 4648 Table 1)
        this.standardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        // URL-safe alphabet (RFC 4648 Section 5)
        this.urlSafeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        
        // Reverse lookup maps for decoding
        this.standardReverseMap = this.buildReverseMap(this.standardAlphabet);
        this.urlSafeReverseMap = this.buildReverseMap(this.urlSafeAlphabet);
        
        // MIME line wrapping constant
        this.MIME_LINE_LENGTH = 76;
        this.MIME_LINE_SEPARATOR = "\r\n";
    }

    /**
     * Build reverse lookup map for alphabet
     * @param {string} alphabet - The alphabet string
     * @returns {Object} - Map of character to index
     */
    buildReverseMap(alphabet) {
        const map = {};
        for (let i = 0; i < alphabet.length; i++) {
            map[alphabet[i]] = i;
        }
        return map;
    }

    /**
     * Encode bytes to Base64 string
     * @param {Uint8Array|Array|string} input - Input data
     * @param {Object} options - Encoding options
     * @param {boolean} options.urlSafe - Use URL-safe alphabet
     * @param {boolean} options.wrapMime - Enable MIME line wrapping
     * @param {boolean} options.omitPadding - Omit padding characters
     * @returns {string} - Base64 encoded string
     */
    encode(input, options = {}) {
        const {
            urlSafe = false,
            wrapMime = false,
            omitPadding = false
        } = options;

        // Convert input to Uint8Array
        const bytes = this.inputToBytes(input);
        const alphabet = urlSafe ? this.urlSafeAlphabet : this.standardAlphabet;
        
        let output = '';
        let lineLength = 0;
        let i = 0;

        // Process complete 3-byte blocks
        while (i + 3 <= bytes.length) {
            const b0 = bytes[i];
            const b1 = bytes[i + 1];
            const b2 = bytes[i + 2];

            // Create 24-bit group
            const v = (b0 << 16) | (b1 << 8) | b2;

            // Extract 4 sextets (6-bit values)
            output += alphabet[(v >> 18) & 0x3F];
            output += alphabet[(v >> 12) & 0x3F];
            output += alphabet[(v >> 6) & 0x3F];
            output += alphabet[v & 0x3F];

            i += 3;
            lineLength += 4;

            // MIME line wrapping
            if (wrapMime && lineLength >= this.MIME_LINE_LENGTH) {
                output += this.MIME_LINE_SEPARATOR;
                lineLength = 0;
            }
        }

        // Handle remainder bytes
        const remainder = bytes.length - i;
        if (remainder === 1) {
            const b0 = bytes[i];
            const v = b0 << 16; // Pad with zeros in low bits

            output += alphabet[(v >> 18) & 0x3F];
            output += alphabet[(v >> 12) & 0x3F];
            
            if (!omitPadding) {
                output += "==";
            }

            if (wrapMime && (lineLength + 4 >= this.MIME_LINE_LENGTH)) {
                output += this.MIME_LINE_SEPARATOR;
            }
        } else if (remainder === 2) {
            const b0 = bytes[i];
            const b1 = bytes[i + 1];
            const v = (b0 << 16) | (b1 << 8); // Pad with zeros in low bits

            output += alphabet[(v >> 18) & 0x3F];
            output += alphabet[(v >> 12) & 0x3F];
            output += alphabet[(v >> 6) & 0x3F];
            
            if (!omitPadding) {
                output += "=";
            }

            if (wrapMime && (lineLength + 4 >= this.MIME_LINE_LENGTH)) {
                output += this.MIME_LINE_SEPARATOR;
            }
        }

        return output;
    }

    /**
     * Decode Base64 string to bytes
     * @param {string} input - Base64 encoded string
     * @param {Object} options - Decoding options
     * @param {boolean} options.urlSafe - Expect URL-safe alphabet
     * @param {boolean} options.strict - Strict mode (reject invalid characters)
     * @returns {Uint8Array} - Decoded bytes
     */
    decode(input, options = {}) {
        const {
            urlSafe = false,
            strict = true
        } = options;

        if (typeof input !== 'string') {
            throw new Error('Input must be a string');
        }

        // Remove whitespace and line separators
        const cleanInput = input.replace(/[\r\n\s]/g, '');
        
        // Determine alphabet and reverse map
        const alphabet = urlSafe ? this.urlSafeAlphabet : this.standardAlphabet;
        const reverseMap = urlSafe ? this.urlSafeReverseMap : this.standardReverseMap;

        // Validate input length
        if (cleanInput.length === 0) {
            return new Uint8Array(0);
        }

        if (cleanInput.length % 4 !== 0) {
            throw new Error('Invalid Base64 string length');
        }

        // Calculate output length
        let outputLength = Math.floor(cleanInput.length / 4) * 3;
        if (cleanInput.endsWith('==')) {
            outputLength -= 2;
        } else if (cleanInput.endsWith('=')) {
            outputLength -= 1;
        }

        const output = new Uint8Array(outputLength);
        let outputIndex = 0;

        // Process complete 4-character blocks
        for (let i = 0; i < cleanInput.length - 4; i += 4) {
            const sextets = this.extractSextets(cleanInput, i, reverseMap, strict);
            const bytes = this.sextetsToBytes(sextets);
            
            output[outputIndex++] = bytes[0];
            output[outputIndex++] = bytes[1];
            output[outputIndex++] = bytes[2];
        }

        // Handle last block (may have padding)
        const lastBlockStart = cleanInput.length - 4;
        const sextets = this.extractSextets(cleanInput, lastBlockStart, reverseMap, strict);
        const bytes = this.sextetsToBytes(sextets);

        if (cleanInput.endsWith('==')) {
            // One byte
            output[outputIndex++] = bytes[0];
        } else if (cleanInput.endsWith('=')) {
            // Two bytes
            output[outputIndex++] = bytes[0];
            output[outputIndex++] = bytes[1];
        } else {
            // Three bytes
            output[outputIndex++] = bytes[0];
            output[outputIndex++] = bytes[1];
            output[outputIndex++] = bytes[2];
        }

        return output;
    }

    /**
     * Extract sextets from 4-character block
     * @param {string} input - Input string
     * @param {number} start - Start index
     * @param {Object} reverseMap - Reverse lookup map
     * @param {boolean} strict - Strict mode
     * @returns {Array} - Array of 4 sextets
     */
    extractSextets(input, start, reverseMap, strict) {
        const sextets = [];
        
        for (let i = 0; i < 4; i++) {
            const char = input[start + i];
            
            if (char === '=') {
                // Padding character
                sextets.push(0);
            } else if (reverseMap[char] !== undefined) {
                // Valid character
                sextets.push(reverseMap[char]);
            } else if (strict) {
                throw new Error(`Invalid Base64 character: ${char}`);
            } else {
                // Non-strict mode: treat as padding
                sextets.push(0);
            }
        }
        
        return sextets;
    }

    /**
     * Convert sextets to bytes
     * @param {Array} sextets - Array of 4 sextets
     * @returns {Array} - Array of 3 bytes
     */
    sextetsToBytes(sextets) {
        const value = (sextets[0] << 18) | (sextets[1] << 12) | (sextets[2] << 6) | sextets[3];
        
        return [
            (value >> 16) & 0xFF,
            (value >> 8) & 0xFF,
            value & 0xFF
        ];
    }

    /**
     * Convert input to Uint8Array
     * @param {any} input - Input data
     * @returns {Uint8Array} - Byte array
     */
    inputToBytes(input) {
        if (input instanceof Uint8Array) {
            return input;
        }
        
        if (Array.isArray(input)) {
            return new Uint8Array(input);
        }
        
        if (typeof input === 'string') {
            // Convert string to UTF-8 bytes
            const encoder = new TextEncoder();
            return encoder.encode(input);
        }
        
        if (input instanceof ArrayBuffer) {
            return new Uint8Array(input);
        }
        
        throw new Error('Unsupported input type');
    }

    /**
     * Convert bytes to string
     * @param {Uint8Array} bytes - Byte array
     * @param {string} encoding - Text encoding (default: UTF-8)
     * @returns {string} - Decoded string
     */
    bytesToString(bytes, encoding = 'utf-8') {
        if (encoding.toLowerCase() === 'utf-8') {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(bytes);
        }
        
        // For other encodings, return hex representation
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Validate Base64 string
     * @param {string} input - Input string
     * @param {Object} options - Validation options
     * @returns {Object} - Validation result
     */
    validate(input, options = {}) {
        const {
            urlSafe = false,
            allowPadding = true,
            allowWhitespace = true
        } = options;

        try {
            if (typeof input !== 'string') {
                return { isValid: false, error: 'Input must be a string' };
            }

            // Remove whitespace if allowed
            const cleanInput = allowWhitespace ? input.replace(/[\r\n\s]/g, '') : input;

            if (cleanInput.length === 0) {
                return { isValid: true, length: 0, padding: 0 };
            }

            // Check length
            if (cleanInput.length % 4 !== 0) {
                return { isValid: false, error: 'Length must be multiple of 4' };
            }

            // Determine alphabet
            const alphabet = urlSafe ? this.urlSafeAlphabet : this.standardAlphabet;
            const reverseMap = urlSafe ? this.urlSafeReverseMap : this.standardReverseMap;

            let paddingCount = 0;
            let hasPadding = false;

            // Validate characters
            for (let i = 0; i < cleanInput.length; i++) {
                const char = cleanInput[i];
                
                if (char === '=') {
                    if (!allowPadding) {
                        return { isValid: false, error: 'Padding not allowed' };
                    }
                    
                    hasPadding = true;
                    paddingCount++;
                    
                    // Padding can only appear at the end
                    if (i < cleanInput.length - paddingCount) {
                        return { isValid: false, error: 'Padding must be at the end' };
                    }
                } else if (reverseMap[char] === undefined) {
                    return { isValid: false, error: `Invalid character: ${char}` };
                }
            }

            // Validate padding
            if (hasPadding) {
                const dataLength = cleanInput.length - paddingCount;
                const expectedPadding = (4 - (dataLength % 4)) % 4;
                
                if (paddingCount !== expectedPadding) {
                    return { isValid: false, error: 'Invalid padding' };
                }
            }

            return {
                isValid: true,
                length: cleanInput.length,
                padding: paddingCount,
                dataLength: cleanInput.length - paddingCount
            };

        } catch (error) {
            return { isValid: false, error: error.message };
        }
    }

    /**
     * Get encoding statistics
     * @param {Uint8Array|Array|string} input - Input data
     * @returns {Object} - Statistics object
     */
    getStats(input) {
        const bytes = this.inputToBytes(input);
        const standardEncoded = this.encode(bytes, { urlSafe: false, wrapMime: false });
        const urlSafeEncoded = this.encode(bytes, { urlSafe: true, wrapMime: false });
        const mimeEncoded = this.encode(bytes, { urlSafe: false, wrapMime: true });

        return {
            inputBytes: bytes.length,
            inputBits: bytes.length * 8,
            standardEncodedLength: standardEncoded.length,
            urlSafeEncodedLength: urlSafeEncoded.length,
            mimeEncodedLength: mimeEncoded.length,
            expansionRatio: standardEncoded.length / bytes.length,
            paddingCharacters: (standardEncoded.match(/=/g) || []).length,
            lineBreaks: (mimeEncoded.match(/\r\n/g) || []).length
        };
    }

    /**
     * Encode with multiple variants
     * @param {Uint8Array|Array|string} input - Input data
     * @returns {Object} - All encoding variants
     */
    encodeAllVariants(input) {
        const bytes = this.inputToBytes(input);
        
        return {
            standard: this.encode(bytes, { urlSafe: false, wrapMime: false }),
            urlSafe: this.encode(bytes, { urlSafe: true, wrapMime: false }),
            urlSafeNoPadding: this.encode(bytes, { urlSafe: true, wrapMime: false, omitPadding: true }),
            mime: this.encode(bytes, { urlSafe: false, wrapMime: true }),
            mimeUrlSafe: this.encode(bytes, { urlSafe: true, wrapMime: true })
        };
    }

    /**
     * Test vectors for validation
     * @returns {Array} - Array of test cases
     */
    getTestVectors() {
        return [
            {
                name: "Empty string",
                input: "",
                expected: ""
            },
            {
                name: "Single character",
                input: "A",
                expected: "QQ=="
            },
            {
                name: "Two characters",
                input: "AB",
                expected: "QUI="
            },
            {
                name: "Three characters (clean block)",
                input: "Sun",
                expected: "U3Vu"
            },
            {
                name: "Four characters",
                input: "Test",
                expected: "VGVzdA=="
            },
            {
                name: "Five characters",
                input: "Hello",
                expected: "SGVsbG8="
            },
            {
                name: "Six characters (clean block)",
                input: "Hello!",
                expected: "SGVsbG8h"
            },
            {
                name: "URL-safe variant",
                input: "Hello World!",
                expected: "SGVsbG8gV29ybGQh",
                urlSafe: "SGVsbG8gV29ybGQh"
            }
        ];
    }

    /**
     * Run self-tests
     * @returns {Object} - Test results
     */
    runSelfTests() {
        const results = {
            passed: 0,
            failed: 0,
            tests: []
        };

        const testVectors = this.getTestVectors();

        for (const testCase of testVectors) {
            try {
                const encoded = this.encode(testCase.input);
                const decoded = this.decode(encoded);
                const decodedString = this.bytesToString(decoded);
                
                const passed = encoded === testCase.expected && decodedString === testCase.input;
                
                results.tests.push({
                    name: testCase.name,
                    passed,
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: encoded,
                    decoded: decodedString
                });

                if (passed) {
                    results.passed++;
                } else {
                    results.failed++;
                }

            } catch (error) {
                results.tests.push({
                    name: testCase.name,
                    passed: false,
                    error: error.message
                });
                results.failed++;
            }
        }

        // Test URL-safe variant
        try {
            const testInput = "Hello World!";
            const urlSafeEncoded = this.encode(testInput, { urlSafe: true });
            const urlSafeDecoded = this.decode(urlSafeEncoded, { urlSafe: true });
            const urlSafeDecodedString = this.bytesToString(urlSafeDecoded);
            
            const urlSafePassed = urlSafeDecodedString === testInput;
            
            results.tests.push({
                name: "URL-safe encoding/decoding",
                passed: urlSafePassed,
                input: testInput,
                urlSafeEncoded,
                urlSafeDecoded: urlSafeDecodedString
            });

            if (urlSafePassed) {
                results.passed++;
            } else {
                results.failed++;
            }

        } catch (error) {
            results.tests.push({
                name: "URL-safe encoding/decoding",
                passed: false,
                error: error.message
            });
            results.failed++;
        }

        return results;
    }
}

// Export for use in the main application
window.AdvancedBase64Encoder = AdvancedBase64Encoder;
