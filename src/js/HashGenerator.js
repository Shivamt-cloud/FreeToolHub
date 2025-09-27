/**
 * Hash Generator
 * Professional hash generation tool with MD5, SHA-1, SHA-256, SHA-512 support
 */

class HashGenerator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
        this.supportedAlgorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-384', 'SHA-224'];
    }

    /**
     * Generate hash from text input
     */
    async generateHash(text, algorithm = 'SHA-256', options = {}) {
        try {
            const {
                encoding = 'hex',
                iterations = 1,
                salt = '',
                uppercase = false
            } = options;

            if (!text) {
                throw new Error('Input text is required');
            }

            if (!this.supportedAlgorithms.includes(algorithm)) {
                throw new Error(`Unsupported algorithm: ${algorithm}`);
            }

            let hash = '';
            let input = text;

            // Add salt if provided
            if (salt) {
                input = salt + text;
            }

            // Generate hash based on algorithm
            switch (algorithm) {
                case 'MD5':
                    hash = await this.generateMD5(input);
                    break;
                case 'SHA-1':
                    hash = await this.generateSHA1(input);
                    break;
                case 'SHA-224':
                    hash = await this.generateSHA224(input);
                    break;
                case 'SHA-256':
                    hash = await this.generateSHA256(input);
                    break;
                case 'SHA-384':
                    hash = await this.generateSHA384(input);
                    break;
                case 'SHA-512':
                    hash = await this.generateSHA512(input);
                    break;
                default:
                    throw new Error(`Unsupported algorithm: ${algorithm}`);
            }

            // Apply iterations if specified
            for (let i = 1; i < iterations; i++) {
                switch (algorithm) {
                    case 'MD5':
                        hash = await this.generateMD5(hash);
                        break;
                    case 'SHA-1':
                        hash = await this.generateSHA1(hash);
                        break;
                    case 'SHA-224':
                        hash = await this.generateSHA224(hash);
                        break;
                    case 'SHA-256':
                        hash = await this.generateSHA256(hash);
                        break;
                    case 'SHA-384':
                        hash = await this.generateSHA384(hash);
                        break;
                    case 'SHA-512':
                        hash = await this.generateSHA512(hash);
                        break;
                }
            }

            // Apply encoding
            if (encoding === 'base64') {
                hash = this.hexToBase64(hash);
            } else if (encoding === 'binary') {
                hash = this.hexToBinary(hash);
            }

            // Apply case transformation
            if (uppercase) {
                hash = hash.toUpperCase();
            }

            this.addToHistory('generate', text, hash, algorithm);
            return {
                success: true,
                hash: hash,
                algorithm: algorithm,
                encoding: encoding,
                iterations: iterations,
                salt: salt,
                inputLength: text.length,
                hashLength: hash.length,
                type: 'text'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                algorithm: algorithm,
                inputLength: text.length
            };
        }
    }

    /**
     * Generate hash from file
     */
    async generateFileHash(file, algorithm = 'SHA-256', options = {}) {
        try {
            const {
                encoding = 'hex',
                iterations = 1,
                uppercase = false
            } = options;

            if (!file) {
                throw new Error('File is required');
            }

            const arrayBuffer = await this.fileToArrayBuffer(file);
            let hash = '';

            // Generate hash based on algorithm
            switch (algorithm) {
                case 'MD5':
                    hash = await this.generateMD5FromArrayBuffer(arrayBuffer);
                    break;
                case 'SHA-1':
                    hash = await this.generateSHA1FromArrayBuffer(arrayBuffer);
                    break;
                case 'SHA-224':
                    hash = await this.generateSHA224FromArrayBuffer(arrayBuffer);
                    break;
                case 'SHA-256':
                    hash = await this.generateSHA256FromArrayBuffer(arrayBuffer);
                    break;
                case 'SHA-384':
                    hash = await this.generateSHA384FromArrayBuffer(arrayBuffer);
                    break;
                case 'SHA-512':
                    hash = await this.generateSHA512FromArrayBuffer(arrayBuffer);
                    break;
                default:
                    throw new Error(`Unsupported algorithm: ${algorithm}`);
            }

            // Apply iterations if specified
            for (let i = 1; i < iterations; i++) {
                const tempBuffer = this.hexToArrayBuffer(hash);
                switch (algorithm) {
                    case 'MD5':
                        hash = await this.generateMD5FromArrayBuffer(tempBuffer);
                        break;
                    case 'SHA-1':
                        hash = await this.generateSHA1FromArrayBuffer(tempBuffer);
                        break;
                    case 'SHA-224':
                        hash = await this.generateSHA224FromArrayBuffer(tempBuffer);
                        break;
                    case 'SHA-256':
                        hash = await this.generateSHA256FromArrayBuffer(tempBuffer);
                        break;
                    case 'SHA-384':
                        hash = await this.generateSHA384FromArrayBuffer(tempBuffer);
                        break;
                    case 'SHA-512':
                        hash = await this.generateSHA512FromArrayBuffer(tempBuffer);
                        break;
                }
            }

            // Apply encoding
            if (encoding === 'base64') {
                hash = this.hexToBase64(hash);
            } else if (encoding === 'binary') {
                hash = this.hexToBinary(hash);
            }

            // Apply case transformation
            if (uppercase) {
                hash = hash.toUpperCase();
            }

            this.addToHistory('generate', file.name, hash, algorithm);
            return {
                success: true,
                hash: hash,
                algorithm: algorithm,
                encoding: encoding,
                iterations: iterations,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                hashLength: hash.length,
                type: 'file'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                algorithm: algorithm,
                fileSize: file.size || 0
            };
        }
    }

    /**
     * Generate multiple hashes at once
     */
    async generateMultipleHashes(text, algorithms = ['MD5', 'SHA-1', 'SHA-256'], options = {}) {
        try {
            const results = {};
            const errors = {};

            for (const algorithm of algorithms) {
                try {
                    const result = await this.generateHash(text, algorithm, options);
                    if (result.success) {
                        results[algorithm] = result;
                    } else {
                        errors[algorithm] = result.error;
                    }
                } catch (error) {
                    errors[algorithm] = error.message;
                }
            }

            return {
                success: true,
                results: results,
                errors: errors,
                totalAlgorithms: algorithms.length,
                successfulAlgorithms: Object.keys(results).length,
                failedAlgorithms: Object.keys(errors).length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verify hash against input
     */
    async verifyHash(input, hash, algorithm = 'SHA-256', options = {}) {
        try {
            const result = await this.generateHash(input, algorithm, options);
            if (!result.success) {
                return {
                    success: false,
                    error: result.error
                };
            }

            const isMatch = result.hash.toLowerCase() === hash.toLowerCase();
            return {
                success: true,
                isMatch: isMatch,
                providedHash: hash,
                generatedHash: result.hash,
                algorithm: algorithm,
                match: isMatch ? '✅ Hash matches' : '❌ Hash does not match'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate MD5 hash
     */
    async generateMD5(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('MD5', data);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-1 hash
     */
    async generateSHA1(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-224 hash
     */
    async generateSHA224(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-224', data);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-256 hash
     */
    async generateSHA256(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-384 hash
     */
    async generateSHA384(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-384', data);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-512 hash
     */
    async generateSHA512(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate MD5 from ArrayBuffer
     */
    async generateMD5FromArrayBuffer(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-1 from ArrayBuffer
     */
    async generateSHA1FromArrayBuffer(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-224 from ArrayBuffer
     */
    async generateSHA224FromArrayBuffer(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-224', arrayBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-256 from ArrayBuffer
     */
    async generateSHA256FromArrayBuffer(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-384 from ArrayBuffer
     */
    async generateSHA384FromArrayBuffer(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-384', arrayBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Generate SHA-512 from ArrayBuffer
     */
    async generateSHA512FromArrayBuffer(arrayBuffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-512', arrayBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    /**
     * Convert file to ArrayBuffer
     */
    fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Convert ArrayBuffer to hex string
     */
    arrayBufferToHex(buffer) {
        const byteArray = new Uint8Array(buffer);
        const hexCodes = [...byteArray].map(value => {
            const hexCode = value.toString(16);
            const paddedHexCode = hexCode.padStart(2, '0');
            return paddedHexCode;
        });
        return hexCodes.join('');
    }

    /**
     * Convert hex string to ArrayBuffer
     */
    hexToArrayBuffer(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    /**
     * Convert hex to base64
     */
    hexToBase64(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return btoa(String.fromCharCode(...bytes));
    }

    /**
     * Convert hex to binary
     */
    hexToBinary(hex) {
        return hex.split('').map(char => {
            return parseInt(char, 16).toString(2).padStart(4, '0');
        }).join('');
    }

    /**
     * Get hash information
     */
    getHashInfo(hash, algorithm) {
        try {
            const expectedLength = this.getExpectedHashLength(algorithm);
            const actualLength = hash.length;
            const isValidLength = actualLength === expectedLength;
            
            return {
                success: true,
                hash: hash,
                algorithm: algorithm,
                expectedLength: expectedLength,
                actualLength: actualLength,
                isValidLength: isValidLength,
                format: this.detectHashFormat(hash),
                strength: this.getHashStrength(algorithm)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get expected hash length for algorithm
     */
    getExpectedHashLength(algorithm) {
        const lengths = {
            'MD5': 32,
            'SHA-1': 40,
            'SHA-224': 56,
            'SHA-256': 64,
            'SHA-384': 96,
            'SHA-512': 128
        };
        return lengths[algorithm] || 0;
    }

    /**
     * Detect hash format
     */
    detectHashFormat(hash) {
        if (/^[0-9a-f]+$/i.test(hash)) return 'hex';
        if (/^[A-Za-z0-9+/]+=*$/.test(hash)) return 'base64';
        if (/^[01]+$/.test(hash)) return 'binary';
        return 'unknown';
    }

    /**
     * Get hash strength
     */
    getHashStrength(algorithm) {
        const strengths = {
            'MD5': 'Weak (deprecated)',
            'SHA-1': 'Weak (deprecated)',
            'SHA-224': 'Medium',
            'SHA-256': 'Strong',
            'SHA-384': 'Strong',
            'SHA-512': 'Very Strong'
        };
        return strengths[algorithm] || 'Unknown';
    }

    /**
     * Add to history
     */
    addToHistory(action, input, output, algorithm) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            input: typeof input === 'string' ? input.substring(0, 100) + (input.length > 100 ? '...' : '') : input,
            output: typeof output === 'string' ? output.substring(0, 100) + (output.length > 100 ? '...' : '') : output,
            algorithm
        };
        
        this.history.unshift(entry);
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
    }

    /**
     * Get history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }
}
