/**
 * Advanced Case Converter
 * Comprehensive text case conversion with Unicode support, programming naming conventions, and special effects
 */

/**
 * Unicode-Aware Text Processor
 */
export class UnicodeProcessor {
    constructor() {
        this.caseFoldingMap = this.loadUnicodeCaseFoldingData();
        this.specialCaseMappings = this.loadSpecialCaseMappings();
        this.localeRules = this.loadLocaleSpecificRules();
    }

    /**
     * Normalize Unicode text before case conversion
     */
    normalizeText(text, normalizationForm = 'NFC') {
        if (typeof text.normalize === 'function') {
            return text.normalize(normalizationForm);
        }
        return text; // Fallback for older browsers
    }

    /**
     * Apply Unicode case folding for case-insensitive comparisons
     */
    caseFold(text, locale = null) {
        const result = [];
        
        for (const char of text) {
            const codePoint = char.charCodeAt(0);
            
            // Check for locale-specific rules (e.g., Turkish ı/I)
            if (locale && ['tr', 'az'].includes(locale.toLowerCase())) {
                if (char === 'I') {
                    result.push('ı'); // Dotless i
                    continue;
                } else if (char === 'İ') {
                    result.push('i'); // Dotted i
                    continue;
                }
            }
            
            // Apply standard case folding
            if (this.caseFoldingMap[codePoint]) {
                const foldedChars = this.caseFoldingMap[codePoint];
                result.push(...foldedChars);
            } else {
                result.push(char.toLowerCase());
            }
        }
        
        return result.join('');
    }

    /**
     * Get Unicode general category for character
     */
    getUnicodeCategory(char) {
        // Simplified Unicode category detection
        const code = char.charCodeAt(0);
        
        if (code >= 0x0041 && code <= 0x005A) return 'Lu'; // Uppercase Letter
        if (code >= 0x0061 && code <= 0x007A) return 'Ll'; // Lowercase Letter
        if (code >= 0x0030 && code <= 0x0039) return 'Nd'; // Decimal Number
        if (code >= 0x0020 && code <= 0x007F) return 'Pc'; // Connector Punctuation
        
        return 'Other';
    }

    /**
     * Load Unicode case folding data (simplified)
     */
    loadUnicodeCaseFoldingData() {
        return {
            // German ß -> ss
            0x00DF: ['s', 's'],
            // Add more mappings as needed
        };
    }

    /**
     * Load special case mappings
     */
    loadSpecialCaseMappings() {
        return {
            'ß': 'SS', // German eszett
            'ı': 'I',  // Turkish dotless i
            'İ': 'i'   // Turkish dotted i
        };
    }

    /**
     * Load locale-specific rules
     */
    loadLocaleSpecificRules() {
        return {
            'tr': { // Turkish
                'I': 'ı',
                'İ': 'i'
            },
            'az': { // Azerbaijani
                'I': 'ı',
                'İ': 'i'
            }
        };
    }
}

/**
 * Basic Case Converter
 */
export class BasicCaseConverter {
    constructor(unicodeProcessor) {
        this.unicodeProcessor = unicodeProcessor;
        this.titleWordsExceptions = new Set([
            'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 
            'if', 'in', 'of', 'on', 'or', 'the', 'to', 'via'
        ]);
    }

    /**
     * Convert to UPPERCASE with Unicode support
     */
    toUppercase(text) {
        const result = [];
        for (const char of text) {
            // Handle special cases like German ß -> SS
            if (char === 'ß') {
                result.push('SS');
            } else {
                result.push(char.toUpperCase());
            }
        }
        return result.join('');
    }

    /**
     * Convert to lowercase with Unicode support
     */
    toLowercase(text) {
        return text.toLowerCase();
    }

    /**
     * Convert to Sentence case - capitalize first letter of sentences
     */
    toSentenceCase(text) {
        if (!text) return text;
        
        const result = [];
        let capitalizeNext = true;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (capitalizeNext && char.match(/[a-zA-Z]/)) {
                result.push(char.toUpperCase());
                capitalizeNext = false;
            } else {
                result.push(char.toLowerCase());
            }
            
            // Check for sentence endings
            if (['.', '!', '?'].includes(char) && i < text.length - 1) {
                // Look ahead to see if next non-space char should be capitalized
                const nextAlphaPos = this.findNextAlpha(text, i + 1);
                if (nextAlphaPos !== -1) {
                    capitalizeNext = true;
                }
            }
        }
        
        return result.join('');
    }

    /**
     * Convert to Title Case with proper word handling
     */
    toTitleCase(text) {
        const words = text.split(/\s+/);
        const titleWords = [];
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const cleanedWord = this.stripPunctuation(word.toLowerCase());
            
            // Always capitalize first and last words
            if (i === 0 || i === words.length - 1) {
                titleWords.push(this.capitalizeWord(word));
            }
            // Skip articles, prepositions, conjunctions (unless they're long)
            else if (this.titleWordsExceptions.has(cleanedWord) && cleanedWord.length < 4) {
                titleWords.push(word.toLowerCase());
            } else {
                titleWords.push(this.capitalizeWord(word));
            }
        }
        
        return titleWords.join(' ');
    }

    /**
     * Capitalize Each Word (All Words Title Case)
     */
    toCapitalizedCase(text) {
        return text.split(/\s+/).map(word => this.capitalizeWord(word)).join(' ');
    }

    /**
     * Create aLtErNaTiNg CaSe
     */
    toAlternatingCase(text) {
        const result = [];
        let shouldUpper = true;
        
        for (const char of text) {
            if (char.match(/[a-zA-Z]/)) {
                result.push(shouldUpper ? char.toUpperCase() : char.toLowerCase());
                shouldUpper = !shouldUpper;
            } else {
                result.push(char);
            }
        }
        
        return result.join('');
    }

    /**
     * Swap case of each character
     */
    toInverseCase(text) {
        const result = [];
        for (const char of text) {
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                result.push(char.toLowerCase());
            } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
                result.push(char.toUpperCase());
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }

    /**
     * Capitalize first letter while preserving punctuation
     */
    capitalizeWord(word) {
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (char.match(/[a-zA-Z]/)) {
                return word.substring(0, i) + char.toUpperCase() + word.substring(i + 1).toLowerCase();
            }
        }
        return word;
    }

    /**
     * Find position of next alphabetic character
     */
    findNextAlpha(text, startPos) {
        for (let i = startPos; i < text.length; i++) {
            if (text[i].match(/[a-zA-Z]/)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Remove punctuation from word boundaries
     */
    stripPunctuation(word) {
        let start = 0;
        let end = word.length;
        
        while (start < end && !word[start].match(/[a-zA-Z0-9]/)) {
            start++;
        }
        while (end > start && !word[end - 1].match(/[a-zA-Z0-9]/)) {
            end--;
        }
        
        return word.substring(start, end);
    }
}

/**
 * Programming Naming Convention Converter
 */
export class ProgrammingCaseConverter {
    constructor() {
        this.wordBoundaries = /[-_\s]+/; // Regex for word separators
    }

    /**
     * Split text into words for case conversion
     */
    tokenizeWords(text) {
        // Handle camelCase/PascalCase by inserting spaces before capitals
        // But preserve consecutive capitals (like "XMLHttpRequest")
        let spacedText = text.replace(/([a-z])([A-Z])/g, '$1 $2');
        spacedText = spacedText.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
        
        // Split on various separators
        const words = spacedText.split(this.wordBoundaries);
        
        // Filter empty strings and clean words
        return words
            .map(word => word.trim())
            .filter(word => word.length > 0)
            .map(word => word.toLowerCase());
    }

    /**
     * Convert to camelCase (lowerCamelCase)
     */
    toCamelCase(text) {
        const words = this.tokenizeWords(text);
        if (words.length === 0) return text;
        
        const result = [words[0]]; // First word is lowercase
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            if (word) {
                result.push(word.charAt(0).toUpperCase() + word.substring(1));
            }
        }
        
        return result.join('');
    }

    /**
     * Convert to PascalCase (UpperCamelCase)
     */
    toPascalCase(text) {
        const words = this.tokenizeWords(text);
        
        const result = [];
        for (const word of words) {
            if (word) {
                result.push(word.charAt(0).toUpperCase() + word.substring(1));
            }
        }
        
        return result.join('');
    }

    /**
     * Convert to snake_case
     */
    toSnakeCase(text) {
        const words = this.tokenizeWords(text);
        return words.filter(word => word).join('_');
    }

    /**
     * Convert to SCREAMING_SNAKE_CASE
     */
    toScreamingSnakeCase(text) {
        const words = this.tokenizeWords(text);
        return words.filter(word => word).join('_').toUpperCase();
    }

    /**
     * Convert to kebab-case (dash-case)
     */
    toKebabCase(text) {
        const words = this.tokenizeWords(text);
        return words.filter(word => word).join('-');
    }

    /**
     * Convert to SCREAMING-KEBAB-CASE
     */
    toScreamingKebabCase(text) {
        const words = this.tokenizeWords(text);
        return words.filter(word => word).join('-').toUpperCase();
    }

    /**
     * Convert to dot.case
     */
    toDotCase(text) {
        const words = this.tokenizeWords(text);
        return words.filter(word => word).join('.');
    }

    /**
     * Convert to path/case
     */
    toPathCase(text) {
        const words = this.tokenizeWords(text);
        return words.filter(word => word).join('/');
    }
}

/**
 * Special Text Effects Converter
 */
export class SpecialTextConverter {
    constructor() {
        // Unicode mappings for special text effects
        this.smallCapsMap = {
            'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 
            'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 
            'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'Q', 'r': 'ʀ', 
            's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 
            'y': 'ʏ', 'z': 'ᴢ'
        };
        
        this.superscriptMap = {
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵',
            '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻',
            '=': '⁼', '(': '⁽', ')': '⁾', 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ',
            'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ',
            'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
            'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ',
            'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
        };
        
        this.subscriptMap = {
            '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅',
            '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋',
            '=': '₌', '(': '₍', ')': '₎', 'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ',
            'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ',
            'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
            'v': 'ᵥ', 'x': 'ₓ'
        };
    }

    /**
     * Convert to ꜱᴍᴀʟʟ ᴄᴀᴘꜱ using Unicode characters
     */
    toSmallCaps(text) {
        const result = [];
        for (const char of text.toLowerCase()) {
            if (this.smallCapsMap[char]) {
                result.push(this.smallCapsMap[char]);
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }

    /**
     * Convert to ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ
     */
    toSuperscript(text) {
        const result = [];
        for (const char of text.toLowerCase()) {
            if (this.superscriptMap[char]) {
                result.push(this.superscriptMap[char]);
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }

    /**
     * Convert to ｗｉｄｅ　ｔｅｘｔ (fullwidth)
     */
    toWideText(text) {
        const result = [];
        for (const char of text) {
            const code = char.charCodeAt(0);
            if (code >= 33 && code <= 126) { // ASCII printable range
                // Convert to fullwidth equivalent
                const wideChar = String.fromCharCode(code - 33 + 0xFF01);
                result.push(wideChar);
            } else if (char === ' ') {
                result.push('　'); // Fullwidth space
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }

    /**
     * Convert to ₛᵤᵦₛcᵣᵢₚₜ where possible
     */
    toSubscript(text) {
        const result = [];
        for (const char of text.toLowerCase()) {
            if (this.subscriptMap[char]) {
                result.push(this.subscriptMap[char]);
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }
}

/**
 * Main Case Converter Interface
 */
export class AdvancedCaseConverter {
    constructor() {
        this.unicodeProcessor = new UnicodeProcessor();
        this.basicConverter = new BasicCaseConverter(this.unicodeProcessor);
        this.programmingConverter = new ProgrammingCaseConverter();
        this.specialConverter = new SpecialTextConverter();
    }

    /**
     * Main conversion function supporting all case types
     */
    convert(text, caseType, options = {}) {
        if (!text) return text;
        
        // Normalize input if requested
        if (options.normalizeUnicode !== false) {
            text = this.unicodeProcessor.normalizeText(text);
        }
        
        // Apply case conversion based on type
        const normalizedCaseType = caseType.toLowerCase().replace(/[- ]/g, '_');
        
        const conversions = {
            // Basic cases
            'uppercase': this.basicConverter.toUppercase.bind(this.basicConverter),
            'upper': this.basicConverter.toUppercase.bind(this.basicConverter),
            'lowercase': this.basicConverter.toLowercase.bind(this.basicConverter),
            'lower': this.basicConverter.toLowercase.bind(this.basicConverter),
            'sentence_case': this.basicConverter.toSentenceCase.bind(this.basicConverter),
            'sentence': this.basicConverter.toSentenceCase.bind(this.basicConverter),
            'title_case': this.basicConverter.toTitleCase.bind(this.basicConverter),
            'title': this.basicConverter.toTitleCase.bind(this.basicConverter),
            'capitalized': this.basicConverter.toCapitalizedCase.bind(this.basicConverter),
            'alternating': this.basicConverter.toAlternatingCase.bind(this.basicConverter),
            'inverse': this.basicConverter.toInverseCase.bind(this.basicConverter),
            
            // Programming cases
            'camel_case': this.programmingConverter.toCamelCase.bind(this.programmingConverter),
            'camelcase': this.programmingConverter.toCamelCase.bind(this.programmingConverter),
            'pascal_case': this.programmingConverter.toPascalCase.bind(this.programmingConverter),
            'pascalcase': this.programmingConverter.toPascalCase.bind(this.programmingConverter),
            'snake_case': this.programmingConverter.toSnakeCase.bind(this.programmingConverter),
            'snakecase': this.programmingConverter.toSnakeCase.bind(this.programmingConverter),
            'screaming_snake_case': this.programmingConverter.toScreamingSnakeCase.bind(this.programmingConverter),
            'kebab_case': this.programmingConverter.toKebabCase.bind(this.programmingConverter),
            'kebabcase': this.programmingConverter.toKebabCase.bind(this.programmingConverter),
            'screaming_kebab_case': this.programmingConverter.toScreamingKebabCase.bind(this.programmingConverter),
            'dot_case': this.programmingConverter.toDotCase.bind(this.programmingConverter),
            'path_case': this.programmingConverter.toPathCase.bind(this.programmingConverter),
            
            // Special effects
            'small_caps': this.specialConverter.toSmallCaps.bind(this.specialConverter),
            'superscript': this.specialConverter.toSuperscript.bind(this.specialConverter),
            'subscript': this.specialConverter.toSubscript.bind(this.specialConverter),
            'wide': this.specialConverter.toWideText.bind(this.specialConverter),
            
            // Unicode case folding
            'case_fold': (text) => this.unicodeProcessor.caseFold(text, options.locale)
        };
        
        if (conversions[normalizedCaseType]) {
            let result = conversions[normalizedCaseType](text);
            
            // Apply post-processing if needed
            if (options.preserveLeadingTrailingSpace !== false) {
                // Preserve original leading/trailing whitespace
                const leadingSpace = text.length - text.trimStart().length;
                const trailingSpace = text.length - text.trimEnd().length;
                
                if (leadingSpace > 0) {
                    result = text.substring(0, leadingSpace) + result.trimStart();
                }
                if (trailingSpace > 0) {
                    result = result.trimEnd() + text.substring(text.length - trailingSpace);
                }
            }
            
            return result;
        } else {
            throw new Error(`Unsupported case type: ${caseType}`);
        }
    }

    /**
     * Convert multiple texts to the same case type
     */
    batchConvert(texts, caseType, options = {}) {
        return texts.map(text => this.convert(text, caseType, options));
    }

    /**
     * Attempt to detect the current case type of text
     */
    detectCaseType(text) {
        if (!text || !text.trim()) return 'unknown';
        
        const trimmedText = text.trim();
        
        // Check for programming cases first
        if (trimmedText.includes('_') && trimmedText === trimmedText.toLowerCase()) {
            return 'snake_case';
        } else if (trimmedText.includes('_') && trimmedText === trimmedText.toUpperCase()) {
            return 'screaming_snake_case';
        } else if (trimmedText.includes('-') && trimmedText === trimmedText.toLowerCase()) {
            return 'kebab_case';
        } else if (trimmedText.includes('-') && trimmedText === trimmedText.toUpperCase()) {
            return 'screaming_kebab_case';
        } else if (this.isCamelCase(trimmedText)) {
            return trimmedText.charAt(0) === trimmedText.charAt(0).toLowerCase() ? 'camel_case' : 'pascal_case';
        } else if (trimmedText === trimmedText.toUpperCase()) {
            return 'uppercase';
        } else if (trimmedText === trimmedText.toLowerCase()) {
            return 'lowercase';
        } else if (this.isTitleCase(trimmedText)) {
            return 'title_case';
        } else if (this.isSentenceCase(trimmedText)) {
            return 'sentence_case';
        } else {
            return 'mixed';
        }
    }

    /**
     * Check if text follows camelCase or PascalCase pattern
     */
    isCamelCase(text) {
        return /^[a-zA-Z][a-zA-Z0-9]*([A-Z][a-z0-9]*)*$/.test(text);
    }

    /**
     * Check if text follows Title Case pattern
     */
    isTitleCase(text) {
        const words = text.split(/\s+/);
        return words.every(word => {
            if (!word) return true;
            const firstChar = word.charAt(0);
            const rest = word.substring(1);
            return firstChar === firstChar.toUpperCase() && rest === rest.toLowerCase();
        });
    }

    /**
     * Check if text follows Sentence case pattern
     */
    isSentenceCase(text) {
        const sentences = text.split(/[.!?]+/);
        return sentences.every(sentence => {
            const trimmed = sentence.trim();
            if (!trimmed) return true;
            const firstChar = trimmed.charAt(0);
            const rest = trimmed.substring(1);
            return firstChar === firstChar.toUpperCase() && rest === rest.toLowerCase();
        });
    }

    /**
     * Get all supported case types
     */
    getSupportedCaseTypes() {
        return {
            basic: [
                'uppercase', 'lowercase', 'sentence_case', 'title_case', 
                'capitalized', 'alternating', 'inverse'
            ],
            programming: [
                'camel_case', 'pascal_case', 'snake_case', 'screaming_snake_case',
                'kebab_case', 'screaming_kebab_case', 'dot_case', 'path_case'
            ],
            special: [
                'small_caps', 'superscript', 'subscript', 'wide', 'case_fold'
            ]
        };
    }
}

/**
 * Utility functions for case conversion
 */
export class CaseConverterUtils {
    /**
     * Get case type description
     */
    static getCaseTypeDescription(caseType) {
        const descriptions = {
            'uppercase': 'ALL UPPERCASE LETTERS',
            'lowercase': 'all lowercase letters',
            'sentence_case': 'Sentence case with proper capitalization',
            'title_case': 'Title Case With Proper Capitalization',
            'capitalized': 'Capitalized Each Word',
            'alternating': 'aLtErNaTiNg CaSe',
            'inverse': 'iNVERSE cASE',
            'camel_case': 'camelCase',
            'pascal_case': 'PascalCase',
            'snake_case': 'snake_case',
            'screaming_snake_case': 'SCREAMING_SNAKE_CASE',
            'kebab_case': 'kebab-case',
            'screaming_kebab_case': 'SCREAMING-KEBAB-CASE',
            'dot_case': 'dot.case',
            'path_case': 'path/case',
            'small_caps': 'ꜱᴍᴀʟʟ ᴄᴀᴘꜱ',
            'superscript': 'ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ',
            'subscript': 'ₛᵤᵦₛcᵣᵢₚₜ',
            'wide': 'ｗｉｄｅ　ｔｅｘｔ',
            'case_fold': 'case folded text'
        };
        
        return descriptions[caseType] || caseType;
    }

    /**
     * Get case type category
     */
    static getCaseTypeCategory(caseType) {
        const basicCases = ['uppercase', 'lowercase', 'sentence_case', 'title_case', 'capitalized', 'alternating', 'inverse'];
        const programmingCases = ['camel_case', 'pascal_case', 'snake_case', 'screaming_snake_case', 'kebab_case', 'screaming_kebab_case', 'dot_case', 'path_case'];
        const specialCases = ['small_caps', 'superscript', 'subscript', 'wide', 'case_fold'];
        
        if (basicCases.includes(caseType)) return 'basic';
        if (programmingCases.includes(caseType)) return 'programming';
        if (specialCases.includes(caseType)) return 'special';
        
        return 'unknown';
    }

    /**
     * Format case type for display
     */
    static formatCaseType(caseType) {
        return caseType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Get case type icon
     */
    static getCaseTypeIcon(caseType) {
        const icons = {
            'uppercase': '🔤',
            'lowercase': '🔡',
            'sentence_case': '📝',
            'title_case': '📋',
            'capitalized': '📄',
            'alternating': '🔄',
            'inverse': '🔄',
            'camel_case': '🐪',
            'pascal_case': '🐫',
            'snake_case': '🐍',
            'screaming_snake_case': '🐍',
            'kebab_case': '🍖',
            'screaming_kebab_case': '🍖',
            'dot_case': '⚫',
            'path_case': '📁',
            'small_caps': '🔤',
            'superscript': '⬆️',
            'subscript': '⬇️',
            'wide': '📏',
            'case_fold': '🔄'
        };
        
        return icons[caseType] || '🔤';
    }
}
