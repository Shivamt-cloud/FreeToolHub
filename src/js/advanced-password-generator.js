/**
 * Advanced Password Generator
 * Implements CSPRNG-based generation with entropy-driven sizing and Diceware support
 * Following modern NIST/OWASP guidance for password security
 */

class SecureRandomGenerator {
    constructor() {
        this.crypto = window.crypto || window.msCrypto;
        if (!this.crypto || !this.crypto.getRandomValues) {
            throw new Error('Cryptographically secure random number generator not available');
        }
    }

    /**
     * Generate cryptographically secure random bytes
     * @param {number} n - Number of bytes to generate
     * @returns {Uint8Array} Random bytes
     */
    secureRandomBytes(n) {
        const bytes = new Uint8Array(n);
        this.crypto.getRandomValues(bytes);
        return bytes;
    }

    /**
     * Generate unbiased index from 0 to (n-1) using rejection sampling
     * @param {number} n - Upper bound (exclusive)
     * @returns {number} Unbiased index
     */
    secureIndex(n) {
        if (n <= 0) throw new Error('Invalid n: must be positive');
        if (n === 1) return 0;

        // Compute limit = largest multiple of n below 256
        const limit = Math.floor(256 / n) * n;
        
        while (true) {
            const bytes = this.secureRandomBytes(1);
            const b = bytes[0];
            if (b < limit) {
                return b % n; // Unbiased selection
            }
            // Retry if value is rejected
        }
    }
}

class CharacterSets {
    static get UPPERCASE() { return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    static get LOWERCASE() { return 'abcdefghijklmnopqrstuvwxyz'; }
    static get DIGITS() { return '0123456789'; }
    static get SYMBOLS() { return '!@#$%^&*()_+-=[]{}|;:,.<>?'; }
    static get FULL_ASCII() { return this.UPPERCASE + this.LOWERCASE + this.DIGITS + this.SYMBOLS; }
    static get ALPHANUMERIC() { return this.UPPERCASE + this.LOWERCASE + this.DIGITS; }
    static get LETTERS_ONLY() { return this.UPPERCASE + this.LOWERCASE; }
}

class DicewareWordlist {
    constructor() {
        // EFF Diceware wordlist (first 100 words for demo - full list would be 7776 words)
        this.words = [
            'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
            'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
            'action', 'actor', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult',
            'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree',
            'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien',
            'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always',
            'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle',
            'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety',
            'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area'
        ];
        
        // Full EFF list would have 7776 words (6^5), giving ~12.9 bits per word
        this.bitsPerWord = Math.log2(this.words.length);
    }

    getRandomWord() {
        const index = this.secureRandomGenerator.secureIndex(this.words.length);
        return this.words[index];
    }

    setSecureRandomGenerator(generator) {
        this.secureRandomGenerator = generator;
    }
}

class PasswordScreener {
    constructor() {
        // Common breached passwords (in real implementation, this would be a larger database)
        this.breachedPasswords = new Set([
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master'
        ]);
    }

    /**
     * Check if password is in breached list
     * @param {string} password - Password to check
     * @returns {boolean} True if password is breached
     */
    isBreached(password) {
        return this.breachedPasswords.has(password.toLowerCase());
    }

    /**
     * Check password against common patterns
     * @param {string} password - Password to check
     * @returns {object} Assessment result
     */
    assessPassword(password) {
        const result = {
            isBreached: this.isBreached(password),
            isCommon: this.isBreached(password),
            strength: 'weak',
            entropy: 0,
            recommendations: []
        };

        // Calculate entropy
        const charset = this.getCharacterSet(password);
        result.entropy = password.length * Math.log2(charset.length);

        // Assess strength based on entropy
        if (result.entropy >= 128) result.strength = 'very strong';
        else if (result.entropy >= 96) result.strength = 'strong';
        else if (result.entropy >= 64) result.strength = 'moderate';
        else if (result.entropy >= 32) result.strength = 'weak';
        else result.strength = 'very weak';

        // Generate recommendations
        if (result.isBreached) {
            result.recommendations.push('This password appears in breached password databases');
        }
        if (result.entropy < 80) {
            result.recommendations.push('Consider increasing password length for better security');
        }
        if (charset.length < 62) {
            result.recommendations.push('Consider using a wider character set');
        }

        return result;
    }

    /**
     * Determine character set used in password
     * @param {string} password - Password to analyze
     * @returns {number} Size of character set
     */
    getCharacterSet(password) {
        let charset = new Set();
        for (const char of password) {
            if (/[A-Z]/.test(char)) charset.add('upper');
            else if (/[a-z]/.test(char)) charset.add('lower');
            else if (/[0-9]/.test(char)) charset.add('digit');
            else charset.add('symbol');
        }
        
        let size = 0;
        if (charset.has('upper')) size += 26;
        if (charset.has('lower')) size += 26;
        if (charset.has('digit')) size += 10;
        if (charset.has('symbol')) size += 32;
        
        return size;
    }
}

class AdvancedPasswordGenerator {
    constructor() {
        this.randomGenerator = new SecureRandomGenerator();
        this.wordlist = new DicewareWordlist();
        this.wordlist.setSecureRandomGenerator(this.randomGenerator);
        this.screener = new PasswordScreener();
    }

    /**
     * Calculate required length for target entropy
     * @param {number} targetBits - Target entropy in bits
     * @param {number} alphabetSize - Size of character alphabet
     * @returns {number} Required length
     */
    lengthForEntropy(targetBits, alphabetSize) {
        if (targetBits <= 0 || alphabetSize <= 1) {
            throw new Error('Invalid parameters: targetBits and alphabetSize must be positive');
        }
        return Math.ceil(targetBits / Math.log2(alphabetSize));
    }

    /**
     * Generate password in character mode
     * @param {object} options - Generation options
     * @returns {object} Generated password result
     */
    generatePassword(options) {
        const {
            targetEntropy = 96,
            alphabet = CharacterSets.FULL_ASCII,
            minLength = 8,
            maxLength = 128,
            screenBreached = true
        } = options;

        // Calculate required length from entropy target
        let length = this.lengthForEntropy(targetEntropy, alphabet.length);
        length = Math.max(length, minLength);
        length = Math.min(length, maxLength);

        if (length < 1) {
            throw new Error('Length constraints too strict');
        }

        // Generate password using rejection sampling
        let password = '';
        for (let i = 0; i < length; i++) {
            const index = this.randomGenerator.secureIndex(alphabet.length);
            password += alphabet[index];
        }

        // Screen against breached passwords if requested
        let isBreached = false;
        if (screenBreached) {
            isBreached = this.screener.isBreached(password);
            // Regenerate once if breached
            if (isBreached) {
                return this.generatePassword(options);
            }
        }

        // Calculate actual entropy
        const actualEntropy = length * Math.log2(alphabet.length);

        return {
            password,
            length,
            entropy: actualEntropy,
            strength: this.getStrengthLevel(actualEntropy),
            mode: 'characters',
            alphabet: alphabet,
            isBreached,
            generationMethod: 'CSPRNG with rejection sampling',
            timestamp: new Date().toISOString(),
            policyCheck: { valid: true, reason: null },
            recommendations: []
        };
    }

    /**
     * Generate passphrase in Diceware mode
     * @param {object} options - Generation options
     * @returns {object} Generated passphrase result
     */
    generatePassphrase(options) {
        const {
            targetEntropy = 90,
            separator = ' ',
            addRandomChars = false,
            screenBreached = true
        } = options;

        // Calculate required word count
        const wordCount = Math.ceil(targetEntropy / this.wordlist.bitsPerWord);
        const words = [];

        // Generate random words
        for (let i = 0; i < wordCount; i++) {
            words.push(this.wordlist.getRandomWord());
        }

        let passphrase = words.join(separator);

        // Add random characters if requested (for legacy compliance)
        if (addRandomChars) {
            const randomChar = CharacterSets.SYMBOLS[this.randomGenerator.secureIndex(CharacterSets.SYMBOLS.length)];
            const randomDigit = CharacterSets.DIGITS[this.randomGenerator.secureIndex(CharacterSets.DIGITS.length)];
            passphrase += randomChar + randomDigit;
        }

        // Screen against breached passwords if requested
        let isBreached = false;
        if (screenBreached) {
            isBreached = this.screener.isBreached(passphrase);
            if (isBreached) {
                return this.generatePassphrase(options);
            }
        }

        // Calculate actual entropy
        const actualEntropy = wordCount * this.wordlist.bitsPerWord;

        return {
            password: passphrase,
            length: passphrase.length,
            entropy: actualEntropy,
            strength: this.getStrengthLevel(actualEntropy),
            mode: 'diceware',
            wordCount,
            words,
            separator,
            isBreached,
            generationMethod: 'CSPRNG Diceware with rejection sampling',
            timestamp: new Date().toISOString(),
            policyCheck: { valid: true, reason: null },
            recommendations: []
        };
    }

    /**
     * Generate multiple passwords
     * @param {number} count - Number of passwords to generate
     * @param {object} options - Generation options
     * @returns {Array} Array of generated passwords
     */
    generateMultiplePasswords(count, options) {
        const results = [];
        for (let i = 0; i < count; i++) {
            try {
                const result = this.generatePassword(options);
                results.push(result);
            } catch (error) {
                console.error(`Error generating password ${i + 1}:`, error);
            }
        }
        return results;
    }

    /**
     * Generate multiple passphrases
     * @param {number} count - Number of passphrases to generate
     * @param {object} options - Generation options
     * @returns {Array} Array of generated passphrases
     */
    generateMultiplePassphrases(count, options) {
        const results = [];
        for (let i = 0; i < count; i++) {
            try {
                const result = this.generatePassphrase(options);
                results.push(result);
            } catch (error) {
                console.error(`Error generating passphrase ${i + 1}:`, error);
            }
        }
        return results;
    }

    /**
     * Validate existing password
     * @param {string} password - Password to validate
     * @returns {object} Validation result
     */
    validatePassword(password) {
        if (!password || password.length === 0) {
            throw new Error('Password cannot be empty');
        }

        const assessment = this.screener.assessPassword(password);
        
        return {
            password,
            ...assessment,
            mode: 'validation',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get entropy information for different character sets
     * @returns {object} Entropy information
     */
    getEntropyInfo() {
        return {
            'Full ASCII (A-Z, a-z, 0-9, symbols)': {
                alphabetSize: 94,
                bitsPerChar: Math.log2(94),
                lengthFor80Bits: this.lengthForEntropy(80, 94),
                lengthFor96Bits: this.lengthForEntropy(96, 94),
                lengthFor128Bits: this.lengthForEntropy(128, 94)
            },
            'Alphanumeric (A-Z, a-z, 0-9)': {
                alphabetSize: 62,
                bitsPerChar: Math.log2(62),
                lengthFor80Bits: this.lengthForEntropy(80, 62),
                lengthFor96Bits: this.lengthForEntropy(96, 62),
                lengthFor128Bits: this.lengthForEntropy(128, 62)
            },
            'Letters Only (A-Z, a-z)': {
                alphabetSize: 52,
                bitsPerChar: Math.log2(52),
                lengthFor80Bits: this.lengthForEntropy(80, 52),
                lengthFor96Bits: this.lengthForEntropy(96, 52),
                lengthFor128Bits: this.lengthForEntropy(128, 52)
            },
            'Diceware (EFF)': {
                alphabetSize: this.wordlist.words.length,
                bitsPerWord: this.wordlist.bitsPerWord,
                wordsFor80Bits: Math.ceil(80 / this.wordlist.bitsPerWord),
                wordsFor96Bits: Math.ceil(96 / this.wordlist.bitsPerWord),
                wordsFor128Bits: Math.ceil(128 / this.wordlist.bitsPerWord)
            }
        };
    }

    /**
     * Get strength level based on entropy
     * @param {number} entropy - Entropy in bits
     * @returns {string} Strength level
     */
    getStrengthLevel(entropy) {
        if (entropy >= 128) return 'very strong';
        if (entropy >= 96) return 'strong';
        if (entropy >= 64) return 'moderate';
        if (entropy >= 32) return 'weak';
        return 'very weak';
    }
}

// Export classes to global scope
window.SecureRandomGenerator = SecureRandomGenerator;
window.CharacterSets = CharacterSets;
window.DicewareWordlist = DicewareWordlist;
window.PasswordScreener = PasswordScreener;
window.AdvancedPasswordGenerator = AdvancedPasswordGenerator;
