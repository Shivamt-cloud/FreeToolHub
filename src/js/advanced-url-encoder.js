/**
 * Advanced URL Encoder/Decoder
 * Comprehensive URL encoding with RFC 3986 compliance, form data processing, and Base64URL support
 */

/**
 * Character Classification and Unicode Handling
 */
export class CharacterClassifier {
    constructor() {
        // RFC 3986 character sets
        this.genDelims = new Set([':', '/', '?', '#', '[', ']', '@']);
        this.subDelims = new Set(['!', '$', '&', "'", '(', ')', '*', '+', ',', ';', '=']);
        this.unreserved = this.buildUnreservedSet();
        this.reserved = this.buildReservedSet();
        
        // Special handling for different encoding modes
        this.uriSafe = new Set([...this.unreserved, '-', '.', '_', '~']);
        this.componentSafe = this.unreserved;
        this.formSafe = new Set([...this.unreserved].filter(c => c !== ' ')); // Space handled specially
    }

    /**
     * RFC 3986 unreserved characters: ALPHA / DIGIT / "-" / "." / "_" / "~"
     */
    buildUnreservedSet() {
        const unreserved = new Set();
        
        // A-Z
        for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
            unreserved.add(String.fromCharCode(i));
        }
        
        // a-z
        for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
            unreserved.add(String.fromCharCode(i));
        }
        
        // 0-9
        for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); i++) {
            unreserved.add(String.fromCharCode(i));
        }
        
        // Special unreserved
        unreserved.add('-');
        unreserved.add('.');
        unreserved.add('_');
        unreserved.add('~');
        
        return unreserved;
    }

    /**
     * RFC 3986 reserved characters
     */
    buildReservedSet() {
        return new Set([...this.genDelims, ...this.subDelims]);
    }

    /**
     * Determine if character needs encoding based on mode
     */
    shouldEncode(char, encodingMode = 'uri_component') {
        switch (encodingMode) {
            case 'uri_component':
                // encodeURIComponent - encode everything except unreserved + some safe
                return !this.unreserved.has(char) && !['!', "'", '(', ')', '*'].includes(char);
            
            case 'uri_full':
                // encodeURI - preserve URI structure characters
                return !this.unreserved.has(char) && !this.reserved.has(char) && char !== '#';
            
            case 'form_urlencoded':
                // application/x-www-form-urlencoded rules
                if (char === ' ') {
                    return 'plus'; // Special case: space -> +
                }
                return !this.unreserved.has(char);
            
            case 'rfc3986_strict':
                // Strict RFC 3986 - only unreserved are safe
                return !this.unreserved.has(char);
            
            case 'path_segment':
                // For URL path components
                return !this.unreserved.has(char) && !['/', '?', '#', '@'].includes(char);
            
            case 'query_param':
                // For query parameter values
                return !this.unreserved.has(char) && !['&', '='].includes(char);
            
            default:
                return true; // Default: encode everything unsafe
        }
    }

    /**
     * Check if character is printable ASCII
     */
    isAsciiPrintable(char) {
        const code = char.charCodeAt(0);
        return code >= 32 && code <= 126;
    }

    /**
     * Convert Unicode character to UTF-8 bytes
     */
    getUtf8Bytes(char) {
        try {
            return new TextEncoder().encode(char);
        } catch (error) {
            // Handle surrogate pairs and invalid characters
            return new TextEncoder().encode('\uFFFD'); // Replacement character
        }
    }
}

/**
 * Core URL Encoder
 */
export class URLEncoder {
    constructor() {
        this.classifier = new CharacterClassifier();
        this.hexChars = '0123456789ABCDEF';
    }

    /**
     * Main encoding function supporting multiple modes
     */
    encode(text, mode = 'uri_component', options = {}) {
        if (!text) return text;
        
        // Handle different input types
        if (typeof text !== 'string') {
            text = String(text);
        }
        
        const result = [];
        let i = 0;
        
        while (i < text.length) {
            const char = text[i];
            
            // Check for surrogate pairs (JavaScript compatibility)
            if (this.isHighSurrogate(char) && i + 1 < text.length) {
                if (this.isLowSurrogate(text[i + 1])) {
                    // Valid surrogate pair
                    const surrogatePair = char + text[i + 1];
                    result.push(this.encodeCharacter(surrogatePair, mode));
                    i += 2;
                    continue;
                } else {
                    // Lone high surrogate - throw error or replace
                    if (options.strictSurrogates) {
                        throw new Error(`Lone high surrogate at position ${i}`);
                    }
                    result.push('%EF%BF%BD'); // Unicode replacement character
                    i += 1;
                    continue;
                }
            } else if (this.isLowSurrogate(char)) {
                // Lone low surrogate
                if (options.strictSurrogates) {
                    throw new Error(`Lone low surrogate at position ${i}`);
                }
                result.push('%EF%BF%BD');
                i += 1;
                continue;
            }
            
            // Regular character encoding
            result.push(this.encodeCharacter(char, mode));
            i += 1;
        }
        
        return result.join('');
    }

    /**
     * Encode a single character or surrogate pair
     */
    encodeCharacter(char, mode) {
        const encodingDecision = this.classifier.shouldEncode(char, mode);
        
        if (encodingDecision === 'plus') {
            return '+';
        } else if (!encodingDecision) {
            return char;
        } else {
            // Percent-encode the character
            return this.percentEncodeChar(char);
        }
    }

    /**
     * Convert character to percent-encoded form
     */
    percentEncodeChar(char) {
        const utf8Bytes = this.classifier.getUtf8Bytes(char);
        const encodedParts = [];
        
        for (const byte of utf8Bytes) {
            const hexHigh = this.hexChars[byte >> 4];
            const hexLow = this.hexChars[byte & 0x0F];
            encodedParts.push(`%${hexHigh}${hexLow}`);
        }
        
        return encodedParts.join('');
    }

    /**
     * Check if character is high surrogate (U+D800 to U+DBFF)
     */
    isHighSurrogate(char) {
        const code = char.charCodeAt(0);
        return code >= 0xD800 && code <= 0xDBFF;
    }

    /**
     * Check if character is low surrogate (U+DC00 to U+DFFF)
     */
    isLowSurrogate(char) {
        const code = char.charCodeAt(0);
        return code >= 0xDC00 && code <= 0xDFFF;
    }

    // Convenience methods for common encoding scenarios
    encodeUriComponent(text) {
        return this.encode(text, 'uri_component');
    }

    encodeUri(text) {
        return this.encode(text, 'uri_full');
    }

    encodeFormData(text) {
        return this.encode(text, 'form_urlencoded');
    }

    encodeQueryParam(key, value) {
        const encodedKey = this.encode(String(key), 'uri_component');
        const encodedValue = this.encode(String(value), 'uri_component');
        return `${encodedKey}=${encodedValue}`;
    }
}

/**
 * URL Decoder
 */
export class URLDecoder {
    constructor() {
        this.hexDigits = new Set('0123456789ABCDEFabcdef');
    }

    /**
     * Decode percent-encoded text
     */
    decode(encodedText, mode = 'standard', options = {}) {
        if (!encodedText) return encodedText;
        
        // Pre-process for form encoding (+ to space)
        if (mode === 'form_urlencoded') {
            encodedText = encodedText.replace(/\+/g, ' ');
        }
        
        const result = [];
        let i = 0;
        
        while (i < encodedText.length) {
            const char = encodedText[i];
            
            if (char === '%') {
                // Process percent-encoded sequence
                const { decodedBytes, consumed } = this.decodePercentSequence(
                    encodedText, i, options
                );
                
                if (decodedBytes) {
                    // Convert bytes back to Unicode string
                    try {
                        const decodedChar = new TextDecoder('utf-8', { fatal: true }).decode(decodedBytes);
                        result.push(decodedChar);
                    } catch (error) {
                        if (options.strictUnicode) {
                            throw new Error(`Invalid UTF-8 sequence at position ${i}`);
                        } else {
                            result.push('\uFFFD'); // Replacement character
                        }
                    }
                    
                    i += consumed;
                } else {
                    // Invalid percent sequence
                    if (options.strictPercent) {
                        throw new Error(`Invalid percent sequence at position ${i}`);
                    } else {
                        result.push(char); // Keep original character
                        i += 1;
                    }
                }
            } else {
                result.push(char);
                i += 1;
            }
        }
        
        return result.join('');
    }

    /**
     * Decode a sequence of percent-encoded bytes starting at position
     */
    decodePercentSequence(text, start, options) {
        if (start + 2 >= text.length) {
            return { decodedBytes: null, consumed: 0 };
        }
        
        const decodedBytes = [];
        let pos = start;
        
        // Decode consecutive percent-encoded bytes
        while (pos + 2 < text.length && text[pos] === '%') {
            const hex1 = text[pos + 1];
            const hex2 = text[pos + 2];
            
            if (!this.hexDigits.has(hex1) || !this.hexDigits.has(hex2)) {
                if (decodedBytes.length > 0) {
                    // We have some valid bytes, return them
                    break;
                } else {
                    // First sequence is invalid
                    return { decodedBytes: null, consumed: 0 };
                }
            }
            
            // Convert hex to byte
            const byteValue = parseInt(hex1 + hex2, 16);
            decodedBytes.push(byteValue);
            pos += 3;
        }
        
        if (decodedBytes.length > 0) {
            return { decodedBytes: new Uint8Array(decodedBytes), consumed: pos - start };
        } else {
            return { decodedBytes: null, consumed: 0 };
        }
    }

    decodeUriComponent(text) {
        return this.decode(text, 'standard', { strictUnicode: true });
    }

    decodeUri(text) {
        return this.decode(text, 'standard');
    }

    decodeFormData(text) {
        return this.decode(text, 'form_urlencoded');
    }
}

/**
 * Form Data Processor
 */
export class FormDataProcessor {
    constructor() {
        this.encoder = new URLEncoder();
        this.decoder = new URLDecoder();
    }

    /**
     * Encode data as application/x-www-form-urlencoded
     */
    encodeFormData(data) {
        let pairs;
        
        if (data instanceof Object && !Array.isArray(data)) {
            pairs = Object.entries(data);
        } else if (Array.isArray(data)) {
            pairs = data;
        } else {
            throw new Error('Data must be object or array of tuples');
        }
        
        const encodedPairs = [];
        
        for (const [key, value] of pairs) {
            // Handle multiple values for same key
            if (Array.isArray(value)) {
                for (const item of value) {
                    encodedPairs.push(this.encoder.encodeQueryParam(key, item));
                }
            } else {
                encodedPairs.push(this.encoder.encodeQueryParam(key, value));
            }
        }
        
        return encodedPairs.join('&');
    }

    /**
     * Decode application/x-www-form-urlencoded data to object
     */
    decodeFormData(encodedData) {
        if (!encodedData) return {};
        
        const result = {};
        const pairs = encodedData.split('&');
        
        for (const pair of pairs) {
            let key, value;
            
            if (pair.includes('=')) {
                [key, value] = pair.split('=', 2);
            } else {
                key = pair;
                value = '';
            }
            
            // Decode key and value
            const decodedKey = this.decoder.decodeFormData(key);
            const decodedValue = this.decoder.decodeFormData(value);
            
            // Handle multiple values for same key
            if (decodedKey in result) {
                // Convert to array if not already
                if (!Array.isArray(result[decodedKey])) {
                    result[decodedKey] = [result[decodedKey]];
                }
                result[decodedKey].push(decodedValue);
            } else {
                result[decodedKey] = decodedValue;
            }
        }
        
        return result;
    }
}

/**
 * Base64URL Support (for JWT and URL-safe encoding)
 */
export class Base64URLProcessor {
    constructor() {
        this.base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.base64Standard = this.base64Chars + '+/';
        this.base64urlSafe = this.base64Chars + '-_';
        this.paddingChar = '=';
    }

    /**
     * Encode data as Base64URL (RFC 4648 Section 5)
     */
    encodeBase64url(data) {
        if (typeof data === 'string') {
            data = new TextEncoder().encode(data);
        }
        
        // Convert to base64 string
        let binary = '';
        for (let i = 0; i < data.length; i++) {
            binary += String.fromCharCode(data[i]);
        }
        
        // Use browser's btoa if available, otherwise implement base64
        let b64Encoded;
        if (typeof btoa !== 'undefined') {
            b64Encoded = btoa(binary);
        } else {
            b64Encoded = this.base64Encode(binary);
        }
        
        // Convert to URL-safe version
        const b64url = b64Encoded.replace(/\+/g, '-').replace(/\//g, '_');
        
        // Remove padding
        return b64url.replace(/=+$/, '');
    }

    /**
     * Decode Base64URL encoded string
     */
    decodeBase64url(encoded) {
        // Convert back to standard base64
        let standardB64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        const paddingNeeded = (4 - standardB64.length % 4) % 4;
        standardB64 += '='.repeat(paddingNeeded);
        
        // Decode using standard base64
        if (typeof atob !== 'undefined') {
            const binary = atob(standardB64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        } else {
            return this.base64Decode(standardB64);
        }
    }

    /**
     * Simple base64 encode implementation
     */
    base64Encode(str) {
        let result = '';
        let i = 0;
        
        while (i < str.length) {
            const a = str.charCodeAt(i++);
            const b = i < str.length ? str.charCodeAt(i++) : 0;
            const c = i < str.length ? str.charCodeAt(i++) : 0;
            
            const bitmap = (a << 16) | (b << 8) | c;
            
            result += this.base64Standard.charAt((bitmap >> 18) & 63);
            result += this.base64Standard.charAt((bitmap >> 12) & 63);
            result += i - 2 < str.length ? this.base64Standard.charAt((bitmap >> 6) & 63) : '=';
            result += i - 1 < str.length ? this.base64Standard.charAt(bitmap & 63) : '=';
        }
        
        return result;
    }

    /**
     * Simple base64 decode implementation
     */
    base64Decode(str) {
        const bytes = [];
        let i = 0;
        
        while (i < str.length) {
            const encoded1 = this.base64Standard.indexOf(str.charAt(i++));
            const encoded2 = this.base64Standard.indexOf(str.charAt(i++));
            const encoded3 = this.base64Standard.indexOf(str.charAt(i++));
            const encoded4 = this.base64Standard.indexOf(str.charAt(i++));
            
            const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
            
            bytes.push((bitmap >> 16) & 255);
            if (encoded3 !== 64) bytes.push((bitmap >> 8) & 255);
            if (encoded4 !== 64) bytes.push(bitmap & 255);
        }
        
        return new Uint8Array(bytes);
    }
}

/**
 * Main URL Encoder/Decoder Interface
 */
export class AdvancedURLProcessor {
    constructor() {
        this.encoder = new URLEncoder();
        this.decoder = new URLDecoder();
        this.formProcessor = new FormDataProcessor();
        this.base64url = new Base64URLProcessor();
    }

    /**
     * Encode different parts of URL with appropriate rules
     */
    encodeUrl(urlParts, encodingType = 'uri_component') {
        if (typeof urlParts === 'string') {
            return this.encoder.encode(urlParts, encodingType);
        } else if (typeof urlParts === 'object' && urlParts !== null) {
            return this.encodeUrlComponents(urlParts);
        } else {
            throw new Error('urlParts must be string or object');
        }
    }

    /**
     * Encode URL components with specific rules for each part
     */
    encodeUrlComponents(parts) {
        const encodedParts = {};
        
        // Different encoding rules for different URL components
        const componentRules = {
            'scheme': 'no_encoding',      // Never encode scheme
            'host': 'no_encoding',        // Host has special rules
            'port': 'no_encoding',        // Port is numeric
            'path': 'path_segment',       // Path segments
            'query': 'query_param',       // Query parameters  
            'fragment': 'uri_component'   // Fragment identifier
        };
        
        for (const [component, value] of Object.entries(parts)) {
            if (component in componentRules) {
                const rule = componentRules[component];
                
                if (rule === 'no_encoding') {
                    encodedParts[component] = value;
                } else if (rule === 'path_segment') {
                    // Encode each path segment separately
                    if (value.startsWith('/')) {
                        const segments = value.substring(1).split('/');
                        const encodedSegments = segments.map(seg => 
                            this.encoder.encode(seg, 'uri_component')
                        );
                        encodedParts[component] = '/' + encodedSegments.join('/');
                    } else {
                        encodedParts[component] = this.encoder.encode(value, 'uri_component');
                    }
                } else if (rule === 'query_param') {
                    // Handle query string
                    encodedParts[component] = this.encodeQueryString(value);
                } else {
                    encodedParts[component] = this.encoder.encode(value, rule);
                }
            }
        }
        
        return encodedParts;
    }

    /**
     * Encode query string preserving structure
     */
    encodeQueryString(query) {
        if (typeof query === 'object' && query !== null) {
            return this.formProcessor.encodeFormData(query);
        } else if (typeof query === 'string' && query.includes('=')) {
            // Parse and re-encode existing query string
            const parsed = this.formProcessor.decodeFormData(query);
            return this.formProcessor.encodeFormData(parsed);
        } else {
            // Encode as single value
            return this.encoder.encode(String(query), 'uri_component');
        }
    }

    /**
     * Decode URL with appropriate rules
     */
    decodeUrl(encodedUrl, decodingType = 'standard') {
        return this.decoder.decode(encodedUrl, decodingType);
    }

    /**
     * Process complete URL string
     */
    processFullUrl(urlString, operation = 'encode') {
        // Parse URL into components
        const components = this.parseUrl(urlString);
        
        if (operation === 'encode') {
            return this.buildUrl(this.encodeUrlComponents(components));
        } else if (operation === 'decode') {
            const decodedComponents = {};
            for (const [key, value] of Object.entries(components)) {
                if (['path', 'query', 'fragment'].includes(key)) {
                    decodedComponents[key] = this.decoder.decode(value);
                } else {
                    decodedComponents[key] = value;
                }
            }
            return this.buildUrl(decodedComponents);
        }
    }

    /**
     * Basic URL parsing
     */
    parseUrl(urlString) {
        // Simplified URL regex
        const urlPattern = /^((?<scheme>[^:/?#]+):)?(\/\/(?<authority>[^/?#]*))?(?<path>[^?#]*)(\?(?<query>[^#]*))?(#(?<fragment>.*))?/;
        
        const match = urlString.match(urlPattern);
        if (!match) {
            return { path: urlString }; // Treat as path if no match
        }
        
        const result = {};
        for (const [key, value] of Object.entries(match.groups || {})) {
            if (value !== undefined) {
                result[key] = value;
            }
        }
        
        return result;
    }

    /**
     * Reconstruct URL from components
     */
    buildUrl(components) {
        let url = '';
        
        if (components.scheme) {
            url += components.scheme + ':';
        }
        
        if (components.authority) {
            url += '//' + components.authority;
        }
        
        if (components.path) {
            url += components.path;
        }
        
        if (components.query) {
            url += '?' + components.query;
        }
        
        if (components.fragment) {
            url += '#' + components.fragment;
        }
        
        return url;
    }

    /**
     * Get all supported encoding modes
     */
    getSupportedModes() {
        return {
            encoding: [
                'uri_component',
                'uri_full', 
                'form_urlencoded',
                'rfc3986_strict',
                'path_segment',
                'query_param'
            ],
            decoding: [
                'standard',
                'form_urlencoded'
            ]
        };
    }
}

/**
 * Utility functions for URL processing
 */
export class URLProcessorUtils {
    /**
     * Get mode description
     */
    static getModeDescription(mode) {
        const descriptions = {
            'uri_component': 'JavaScript encodeURIComponent equivalent',
            'uri_full': 'JavaScript encodeURI equivalent',
            'form_urlencoded': 'HTML form application/x-www-form-urlencoded',
            'rfc3986_strict': 'Strict RFC 3986 compliance',
            'path_segment': 'URL path segment encoding',
            'query_param': 'Query parameter value encoding',
            'standard': 'Standard percent-decoding',
            'form_urlencoded': 'Form data decoding (+ as space)'
        };
        
        return descriptions[mode] || mode;
    }

    /**
     * Get mode category
     */
    static getModeCategory(mode) {
        const encodingModes = ['uri_component', 'uri_full', 'form_urlencoded', 'rfc3986_strict', 'path_segment', 'query_param'];
        const decodingModes = ['standard', 'form_urlencoded'];
        
        if (encodingModes.includes(mode)) return 'encoding';
        if (decodingModes.includes(mode)) return 'decoding';
        
        return 'unknown';
    }

    /**
     * Format mode for display
     */
    static formatMode(mode) {
        return mode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Get mode icon
     */
    static getModeIcon(mode) {
        const icons = {
            'uri_component': '🔗',
            'uri_full': '🌐',
            'form_urlencoded': '📝',
            'rfc3986_strict': '📋',
            'path_segment': '📁',
            'query_param': '❓',
            'standard': '🔓',
            'form_urlencoded': '📝'
        };
        
        return icons[mode] || '🔗';
    }

    /**
     * Validate URL format
     */
    static isValidUrl(urlString) {
        try {
            new URL(urlString);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get URL components info
     */
    static getUrlInfo(urlString) {
        try {
            const url = new URL(urlString);
            return {
                scheme: url.protocol,
                host: url.hostname,
                port: url.port,
                path: url.pathname,
                query: url.search,
                fragment: url.hash,
                isValid: true
            };
        } catch {
            return { isValid: false };
        }
    }
}
