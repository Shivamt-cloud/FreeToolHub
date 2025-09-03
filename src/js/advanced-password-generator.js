/**
 * Advanced Password Generator Module for FreeToolHub
 * Implements CSPRNG, rejection sampling, entropy-driven sizing, and policy-aware generation
 * Following NIST/OWASP modern security guidelines
 */

// Secure random number generator using crypto.getRandomValues
class SecureRandomGenerator {
    constructor() {
        this.crypto = window.crypto || window.msCrypto;
        if (!this.crypto || !this.crypto.getRandomValues) {
            throw new Error('Cryptographically secure random number generator not available');
        }
    }

    // Generate n cryptographically secure random bytes
    secureRandomBytes(n) {
        const array = new Uint8Array(n);
        this.crypto.getRandomValues(array);
        return array;
    }

    // Generate a single random byte (0-255)
    secureRandomByte() {
        return this.secureRandomBytes(1)[0];
    }

    // Generate unbiased index from 0 to (n-1) using rejection sampling
    secureIndex(n) {
        if (n <= 0) throw new Error('Invalid n for secure index');
        if (n === 1) return 0;

        // Compute limit = largest multiple of n below 256
        const limit = Math.floor(256 / n) * n;

        while (true) {
            const b = this.secureRandomByte();
            if (b < limit) {
                return b % n; // Unbiased selection
            }
            // Retry if value is in the biased range
        }
    }

    // Generate random integer in range [min, max] using rejection sampling
    secureRandomInt(min, max) {
        const range = max - min + 1;
        return min + this.secureIndex(range);
    }
}

// Character set definitions
class CharacterSets {
    static get UPPERCASE() { return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    static get LOWERCASE() { return 'abcdefghijklmnopqrstuvwxyz'; }
    static get DIGITS() { return '0123456789'; }
    static get SYMBOLS() { return '!@#$%^&*()_+-=[]{}|;:,.<>?'; }
    static get ALPHANUMERIC() { return this.UPPERCASE + this.LOWERCASE + this.DIGITS; }
    static get FULL_ASCII() { return this.UPPERCASE + this.LOWERCASE + this.DIGITS + this.SYMBOLS; }
    static get UNICODE_SAFE() { return this.UPPERCASE + this.LOWERCASE + this.DIGITS + '!@#$%^&*()_+-=[]{}|;:,.<>?~`'; }

    // Get alphabet size for entropy calculation
    static getAlphabetSize(characterSet) {
        return characterSet.length;
    }

    // Calculate entropy for given length and alphabet size
    static calculateEntropy(length, alphabetSize) {
        return length * Math.log2(alphabetSize);
    }

    // Calculate required length for target entropy
    static calculateLength(targetEntropy, alphabetSize) {
        return Math.ceil(targetEntropy / Math.log2(alphabetSize));
    }
}

// Diceware wordlist (EFF Long Wordlist - first 100 words for demo)
class DicewareWordlist {
    static get WORDS() {
        return [
            'aardvark', 'abandon', 'ability', 'abroad', 'absolute', 'absorb', 'abstract', 'absurd', 'abuse', 'access',
            'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action',
            'actor', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
            'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead',
            'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien', 'all',
            'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur',
            'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
            'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any',
            'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena',
            'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow',
            'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
            'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august',
            'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away',
            'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance'
        ];
    }

    static get BITS_PER_WORD() {
        return Math.log2(this.WORDS.length);
    }

    static getWord(index) {
        return this.WORDS[index];
    }

    static getRandomWord(randomGenerator) {
        const index = randomGenerator.secureIndex(this.WORDS.length);
        return this.WORDS[index];
    }
}

// Password screening and validation
class PasswordScreener {
    constructor() {
        this.commonPasswords = new Set([
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
            'princess', 'qwertyuiop', 'solo', 'passw0rd', 'starwars', 'freedom'
        ]);
    }

    // Check if password is in common breached list
    isBreached(password) {
        return this.commonPasswords.has(password.toLowerCase());
    }

    // Check if password meets basic policy requirements
    meetsPolicy(password, policy = {}) {
        const {
            minLength = 8,
            maxLength = 128,
            requireUppercase = false,
            requireLowercase = false,
            requireDigits = false,
            requireSymbols = false
        } = policy;

        if (password.length < minLength || password.length > maxLength) {
            return { valid: false, reason: 'Length requirements not met' };
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            return { valid: false, reason: 'Uppercase letter required' };
        }

        if (requireLowercase && !/[a-z]/.test(password)) {
            return { valid: false, reason: 'Lowercase letter required' };
        }

        if (requireDigits && !/\d/.test(password)) {
            return { valid: false, reason: 'Digit required' };
        }

        if (requireSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            return { valid: false, reason: 'Symbol required' };
        }

        return { valid: true };
    }

    // Comprehensive password assessment
    assessPassword(password) {
        const entropy = this.calculateEntropy(password);
        const isBreached = this.isBreached(password);
        const policyCheck = this.meetsPolicy(password);

        let strength = 'weak';
        if (entropy >= 128) strength = 'very strong';
        else if (entropy >= 96) strength = 'strong';
        else if (entropy >= 64) strength = 'moderate';
        else if (entropy >= 48) strength = 'weak';

        return {
            password,
            entropy,
            strength,
            isBreached,
            policyCheck,
            recommendations: this.getRecommendations(entropy, isBreached, policyCheck)
        };
    }

    // Calculate entropy for a given password
    calculateEntropy(password) {
        const charSet = new Set(password.split(''));
        const alphabetSize = charSet.size;
        return password.length * Math.log2(Math.max(alphabetSize, 1));
    }

    // Get security recommendations
    getRecommendations(entropy, isBreached, policyCheck) {
        const recommendations = [];

        if (entropy < 80) {
            recommendations.push('Increase password length or use more diverse characters');
        }

        if (isBreached) {
            recommendations.push('This password has been compromised - choose a different one');
        }

        if (!policyCheck.valid) {
            recommendations.push(`Policy violation: ${policyCheck.reason}`);
        }

        if (entropy >= 128) {
            recommendations.push('Excellent entropy - this password is very secure');
        }

        return recommendations;
    }
}

// Main Advanced Password Generator class
class AdvancedPasswordGenerator {
    constructor() {
        this.randomGenerator = new SecureRandomGenerator();
        this.screener = new PasswordScreener();
        this.maxRetries = 3;
    }

    // Generate character-based password with entropy-driven sizing
    generatePassword(options = {}) {
        const {
            targetEntropy = 96,
            alphabet = CharacterSets.FULL_ASCII,
            minLength = 8,
            maxLength = 128,
            screenBreached = true,
            policy = {}
        } = options;

        // Calculate required length from entropy target
        const requiredLength = CharacterSets.calculateLength(targetEntropy, alphabet.length);
        const actualLength = Math.max(requiredLength, minLength);
        const finalLength = Math.min(actualLength, maxLength);

        if (finalLength < 1) {
            throw new Error('Length constraints too strict for entropy target');
        }

        let attempts = 0;
        while (attempts < this.maxRetries) {
            try {
                const password = this.generateRandomPassword(finalLength, alphabet);
                
                // Check policy requirements
                const policyCheck = this.screener.meetsPolicy(password, policy);
                if (!policyCheck.valid) {
                    attempts++;
                    continue;
                }

                // Optional breached password screening
                if (screenBreached && this.screener.isBreached(password)) {
                    attempts++;
                    continue;
                }

                return this.createPasswordResult(password, 'characters');
            } catch (error) {
                attempts++;
                if (attempts >= this.maxRetries) {
                    throw new Error(`Failed to generate password after ${this.maxRetries} attempts: ${error.message}`);
                }
            }
        }

        throw new Error('Failed to generate password meeting all requirements');
    }

    // Generate Diceware-style passphrase
    generatePassphrase(options = {}) {
        const {
            targetEntropy = 96,
            wordlist = DicewareWordlist.WORDS,
            separator = ' ',
            addRandomChars = false,
            screenBreached = true
        } = options;

        // Calculate required word count
        const bitsPerWord = Math.log2(wordlist.length);
        const wordCount = Math.ceil(targetEntropy / bitsPerWord);

        let attempts = 0;
        while (attempts < this.maxRetries) {
            try {
                const words = [];
                for (let i = 0; i < wordCount; i++) {
                    const index = this.randomGenerator.secureIndex(wordlist.length);
                    words.push(wordlist[index]);
                }

                let passphrase = words.join(separator);

                // Optionally add random characters for legacy policy compliance
                if (addRandomChars) {
                    passphrase = this.addRandomCharacters(passphrase);
                }

                // Optional breached password screening
                if (screenBreached && this.screener.isBreached(passphrase)) {
                    attempts++;
                    continue;
                }

                return this.createPasswordResult(passphrase, 'diceware', { wordCount, bitsPerWord });
            } catch (error) {
                attempts++;
                if (attempts >= this.maxRetries) {
                    throw new Error(`Failed to generate passphrase after ${this.maxRetries} attempts: ${error.message}`);
                }
            }
        }

        throw new Error('Failed to generate passphrase meeting all requirements');
    }

    // Generate random password of specified length
    generateRandomPassword(length, alphabet) {
        let password = '';
        for (let i = 0; i < length; i++) {
            const index = this.randomGenerator.secureIndex(alphabet.length);
            password += alphabet[index];
        }
        return password;
    }

    // Add random characters to passphrase for legacy policy compliance
    addRandomCharacters(passphrase) {
        const symbols = '!@#$%^&*';
        const digits = '0123456789';
        
        // Add 1-2 random symbols and digits
        const symbolCount = this.randomGenerator.secureRandomInt(1, 2);
        const digitCount = this.randomGenerator.secureRandomInt(1, 2);
        
        for (let i = 0; i < symbolCount; i++) {
            const symbol = symbols[this.randomGenerator.secureIndex(symbols.length)];
            const position = this.randomGenerator.secureRandomInt(0, passphrase.length);
            passphrase = passphrase.slice(0, position) + symbol + passphrase.slice(position);
        }
        
        for (let i = 0; i < digitCount; i++) {
            const digit = digits[this.randomGenerator.secureRandomInt(0, digits.length)];
            const position = this.randomGenerator.secureRandomInt(0, passphrase.length);
            passphrase = passphrase.slice(0, position) + digit + passphrase.slice(position);
        }
        
        return passphrase;
    }

    // Create comprehensive password result
    createPasswordResult(password, mode, metadata = {}) {
        const assessment = this.screener.assessPassword(password);
        
        return {
            password,
            mode,
            entropy: assessment.entropy,
            strength: assessment.strength,
            length: password.length,
            isBreached: assessment.isBreached,
            policyCheck: assessment.policyCheck,
            recommendations: assessment.recommendations,
            metadata,
            timestamp: new Date().toISOString(),
            generationMethod: 'CSPRNG with rejection sampling'
        };
    }

    // Generate multiple passwords
    generateMultiplePasswords(count, options = {}) {
        const passwords = [];
        for (let i = 0; i < count; i++) {
            try {
                const password = this.generatePassword(options);
                passwords.push(password);
            } catch (error) {
                console.warn(`Failed to generate password ${i + 1}:`, error.message);
            }
        }
        return passwords;
    }

    // Generate multiple passphrases
    generateMultiplePassphrases(count, options = {}) {
        const passphrases = [];
        for (let i = 0; i < count; i++) {
            try {
                const passphrase = this.generatePassphrase(options);
                passphrases.push(passphrase);
            } catch (error) {
                console.warn(`Failed to generate passphrase ${i + 1}:`, error.message);
            }
        }
        return passphrases;
    }

    // Validate existing password
    validatePassword(password, policy = {}) {
        return this.screener.assessPassword(password);
    }

    // Get entropy information for different configurations
    getEntropyInfo() {
        const alphabets = {
            'Uppercase + Lowercase': CharacterSets.UPPERCASE + CharacterSets.LOWERCASE,
            'Uppercase + Lowercase + Digits': CharacterSets.ALPHANUMERIC,
            'Full ASCII': CharacterSets.FULL_ASCII,
            'Unicode Safe': CharacterSets.UNICODE_SAFE
        };

        const entropyInfo = {};
        for (const [name, alphabet] of Object.entries(alphabets)) {
            const size = alphabet.length;
            entropyInfo[name] = {
                alphabetSize: size,
                bitsPerChar: Math.log2(size),
                lengthFor80Bits: CharacterSets.calculateLength(80, size),
                lengthFor96Bits: CharacterSets.calculateLength(96, size),
                lengthFor128Bits: CharacterSets.calculateLength(128, size)
            };
        }

        // Diceware information
        entropyInfo['Diceware (EFF)'] = {
            words: DicewareWordlist.WORDS.length,
            bitsPerWord: DicewareWordlist.BITS_PER_WORD,
            wordsFor80Bits: Math.ceil(80 / DicewareWordlist.BITS_PER_WORD),
            wordsFor96Bits: Math.ceil(96 / DicewareWordlist.BITS_PER_WORD),
            wordsFor128Bits: Math.ceil(128 / DicewareWordlist.BITS_PER_WORD)
        };

        return entropyInfo;
    }
}

// Export for use in the main application
window.AdvancedPasswordGenerator = AdvancedPasswordGenerator;
window.CharacterSets = CharacterSets;
window.DicewareWordlist = DicewareWordlist;
window.PasswordScreener = PasswordScreener;
