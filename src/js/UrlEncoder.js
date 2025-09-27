/**
 * URL Encoder/Decoder
 * Professional URL encoding and decoding tool with query parameter support
 */

class UrlEncoder {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
        this.reservedCharacters = {
            '!': '%21',
            '#': '%23',
            '$': '%24',
            '&': '%26',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '*': '%2A',
            '+': '%2B',
            ',': '%2C',
            '/': '%2F',
            ':': '%3A',
            ';': '%3B',
            '=': '%3D',
            '?': '%3F',
            '@': '%40',
            '[': '%5B',
            ']': '%5D'
        };
    }

    /**
     * Encode URL
     */
    encodeUrl(url, options = {}) {
        try {
            const {
                encodeReserved = false,
                encodeUnreserved = false,
                encodeSpaces = true,
                encodeSpecialChars = true,
                preserveProtocol = true
            } = options;

            if (!url) {
                throw new Error('URL is required');
            }

            let encodedUrl = url;

            // Parse URL components
            const urlParts = this.parseUrl(url);
            
            if (urlParts.isValid) {
                // Encode different parts of the URL
                if (urlParts.protocol && preserveProtocol) {
                    // Keep protocol as is
                    encodedUrl = urlParts.protocol + '//';
                } else if (urlParts.protocol && !preserveProtocol) {
                    encodedUrl = this.encodeComponent(urlParts.protocol, options) + '//';
                } else {
                    encodedUrl = '';
                }

                // Encode hostname
                if (urlParts.hostname) {
                    encodedUrl += this.encodeHostname(urlParts.hostname, options);
                }

                // Encode port
                if (urlParts.port) {
                    encodedUrl += ':' + urlParts.port;
                }

                // Encode pathname
                if (urlParts.pathname) {
                    encodedUrl += this.encodePathname(urlParts.pathname, options);
                }

                // Encode search parameters
                if (urlParts.search) {
                    encodedUrl += this.encodeSearchParams(urlParts.search, options);
                }

                // Encode hash
                if (urlParts.hash) {
                    encodedUrl += '#' + this.encodeComponent(urlParts.hash.substring(1), options);
                }
            } else {
                // If URL is not valid, encode the entire string
                encodedUrl = this.encodeComponent(url, options);
            }

            this.addToHistory('encode', url, encodedUrl, 'url');
            return {
                success: true,
                encoded: encodedUrl,
                originalLength: url.length,
                encodedLength: encodedUrl.length,
                compressionRatio: ((encodedUrl.length - url.length) / url.length * 100).toFixed(1),
                type: 'url'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalLength: url.length
            };
        }
    }

    /**
     * Decode URL
     */
    decodeUrl(encodedUrl, options = {}) {
        try {
            const {
                strict = false,
                preservePlus = false
            } = options;

            if (!encodedUrl) {
                throw new Error('Encoded URL is required');
            }

            let decodedUrl = encodedUrl;

            if (strict) {
                // Strict decoding - only decode valid percent-encoded sequences
                decodedUrl = this.strictDecode(encodedUrl);
            } else {
                // Standard decoding
                if (preservePlus) {
                    decodedUrl = decodeURIComponent(encodedUrl);
                } else {
                    decodedUrl = decodeURIComponent(encodedUrl.replace(/\+/g, ' '));
                }
            }

            this.addToHistory('decode', encodedUrl, decodedUrl, 'url');
            return {
                success: true,
                decoded: decodedUrl,
                originalLength: encodedUrl.length,
                decodedLength: decodedUrl.length,
                type: 'url'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalLength: encodedUrl.length
            };
        }
    }

    /**
     * Encode query parameters
     */
    encodeQueryParams(params, options = {}) {
        try {
            const {
                sortParams = false,
                encodeKeys = true,
                encodeValues = true
            } = options;

            if (!params || typeof params !== 'object') {
                throw new Error('Parameters object is required');
            }

            let queryString = '';
            const paramPairs = [];

            for (const [key, value] of Object.entries(params)) {
                const encodedKey = encodeKeys ? this.encodeComponent(key, options) : key;
                const encodedValue = encodeValues ? this.encodeComponent(String(value), options) : String(value);
                paramPairs.push(`${encodedKey}=${encodedValue}`);
            }

            if (sortParams) {
                paramPairs.sort();
            }

            queryString = paramPairs.join('&');

            this.addToHistory('encode', JSON.stringify(params), queryString, 'query');
            return {
                success: true,
                encoded: queryString,
                paramCount: Object.keys(params).length,
                type: 'query'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Decode query parameters
     */
    decodeQueryParams(queryString, options = {}) {
        try {
            const {
                parseNumbers = false,
                parseBooleans = false,
                arrayNotation = 'bracket'
            } = options;

            if (!queryString) {
                throw new Error('Query string is required');
            }

            const params = {};
            const pairs = queryString.split('&');

            for (const pair of pairs) {
                if (!pair) continue;

                const [key, value] = pair.split('=');
                if (!key) continue;

                const decodedKey = decodeURIComponent(key);
                let decodedValue = value ? decodeURIComponent(value) : '';

                // Parse numbers
                if (parseNumbers && !isNaN(decodedValue)) {
                    decodedValue = Number(decodedValue);
                }

                // Parse booleans
                if (parseBooleans && (decodedValue === 'true' || decodedValue === 'false')) {
                    decodedValue = decodedValue === 'true';
                }

                // Handle array notation
                if (decodedKey.endsWith('[]')) {
                    const arrayKey = decodedKey.slice(0, -2);
                    if (!params[arrayKey]) {
                        params[arrayKey] = [];
                    }
                    params[arrayKey].push(decodedValue);
                } else if (arrayNotation === 'bracket' && decodedKey.includes('[') && decodedKey.includes(']')) {
                    const [baseKey, index] = decodedKey.split('[');
                    const arrayIndex = index.slice(0, -1);
                    if (!params[baseKey]) {
                        params[baseKey] = {};
                    }
                    params[baseKey][arrayIndex] = decodedValue;
                } else {
                    params[decodedKey] = decodedValue;
                }
            }

            this.addToHistory('decode', queryString, JSON.stringify(params), 'query');
            return {
                success: true,
                decoded: params,
                paramCount: Object.keys(params).length,
                type: 'query'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validate URL
     */
    validateUrl(url, options = {}) {
        try {
            const {
                requireProtocol = false,
                allowedProtocols = ['http', 'https', 'ftp', 'ftps'],
                requireHost = true
            } = options;

            if (!url) {
                return {
                    success: false,
                    isValid: false,
                    error: 'URL is required'
                };
            }

            const urlParts = this.parseUrl(url);
            
            if (!urlParts.isValid) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Invalid URL format'
                };
            }

            // Check protocol requirements
            if (requireProtocol && !urlParts.protocol) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Protocol is required'
                };
            }

            if (urlParts.protocol && !allowedProtocols.includes(urlParts.protocol.replace(':', ''))) {
                return {
                    success: false,
                    isValid: false,
                    error: `Protocol not allowed. Allowed: ${allowedProtocols.join(', ')}`
                };
            }

            // Check host requirements
            if (requireHost && !urlParts.hostname) {
                return {
                    success: false,
                    isValid: false,
                    error: 'Hostname is required'
                };
            }

            return {
                success: true,
                isValid: true,
                urlParts: urlParts,
                type: 'validation'
            };
        } catch (error) {
            return {
                success: false,
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Parse URL into components
     */
    parseUrl(url) {
        try {
            const urlObj = new URL(url);
            return {
                isValid: true,
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
                port: urlObj.port,
                pathname: urlObj.pathname,
                search: urlObj.search,
                hash: urlObj.hash,
                origin: urlObj.origin,
                href: urlObj.href
            };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }

    /**
     * Encode component
     */
    encodeComponent(component, options = {}) {
        const {
            encodeReserved = false,
            encodeUnreserved = false,
            encodeSpaces = true,
            encodeSpecialChars = true
        } = options;

        let encoded = component;

        if (encodeSpaces) {
            encoded = encoded.replace(/ /g, '%20');
        }

        if (encodeSpecialChars) {
            // Encode special characters
            for (const [char, encodedChar] of Object.entries(this.reservedCharacters)) {
                if (encodeReserved || !this.isReservedCharacter(char)) {
                    encoded = encoded.replace(new RegExp('\\' + char, 'g'), encodedChar);
                }
            }
        }

        if (encodeUnreserved) {
            // Encode unreserved characters (more aggressive encoding)
            encoded = encodeURIComponent(encoded);
        }

        return encoded;
    }

    /**
     * Encode hostname
     */
    encodeHostname(hostname, options = {}) {
        // Hostnames should generally not be encoded
        // Only encode if specifically requested
        if (options.encodeHostname) {
            return this.encodeComponent(hostname, options);
        }
        return hostname;
    }

    /**
     * Encode pathname
     */
    encodePathname(pathname, options = {}) {
        const segments = pathname.split('/');
        const encodedSegments = segments.map(segment => {
            if (segment === '') return segment;
            return this.encodeComponent(segment, options);
        });
        return encodedSegments.join('/');
    }

    /**
     * Encode search parameters
     */
    encodeSearchParams(search, options = {}) {
        if (!search || search === '?') return '';
        
        const queryString = search.substring(1);
        const pairs = queryString.split('&');
        const encodedPairs = pairs.map(pair => {
            const [key, value] = pair.split('=');
            const encodedKey = this.encodeComponent(key || '', options);
            const encodedValue = this.encodeComponent(value || '', options);
            return `${encodedKey}=${encodedValue}`;
        });
        
        return '?' + encodedPairs.join('&');
    }

    /**
     * Strict decode
     */
    strictDecode(encoded) {
        return encoded.replace(/%[0-9A-Fa-f]{2}/g, (match) => {
            try {
                return decodeURIComponent(match);
            } catch (error) {
                return match; // Return original if decoding fails
            }
        });
    }

    /**
     * Check if character is reserved
     */
    isReservedCharacter(char) {
        return char in this.reservedCharacters;
    }

    /**
     * Get URL information
     */
    getUrlInfo(url) {
        try {
            const urlParts = this.parseUrl(url);
            
            if (!urlParts.isValid) {
                return {
                    success: false,
                    error: 'Invalid URL'
                };
            }

            return {
                success: true,
                url: url,
                length: url.length,
                protocol: urlParts.protocol,
                hostname: urlParts.hostname,
                port: urlParts.port,
                pathname: urlParts.pathname,
                search: urlParts.search,
                hash: urlParts.hash,
                origin: urlParts.origin,
                hasQuery: !!urlParts.search,
                hasHash: !!urlParts.hash,
                isSecure: urlParts.protocol === 'https:',
                queryParams: urlParts.search ? this.getQueryParamCount(urlParts.search) : 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get query parameter count
     */
    getQueryParamCount(search) {
        if (!search || search === '?') return 0;
        const queryString = search.substring(1);
        return queryString.split('&').filter(param => param).length;
    }

    /**
     * Beautify URL
     */
    beautifyUrl(url, options = {}) {
        try {
            const {
                sortParams = true,
                removeEmptyParams = true,
                decodeParams = true
            } = options;

            const urlParts = this.parseUrl(url);
            
            if (!urlParts.isValid) {
                throw new Error('Invalid URL');
            }

            let beautifiedUrl = urlParts.origin + urlParts.pathname;

            if (urlParts.search) {
                const queryString = urlParts.search.substring(1);
                const params = this.decodeQueryParams(queryString);
                
                if (params.success) {
                    let queryParams = params.decoded;
                    
                    if (removeEmptyParams) {
                        queryParams = Object.fromEntries(
                            Object.entries(queryParams).filter(([key, value]) => 
                                value !== '' && value !== null && value !== undefined
                            )
                        );
                    }
                    
                    if (sortParams) {
                        const sortedParams = {};
                        Object.keys(queryParams).sort().forEach(key => {
                            sortedParams[key] = queryParams[key];
                        });
                        queryParams = sortedParams;
                    }
                    
                    const encodedParams = this.encodeQueryParams(queryParams);
                    if (encodedParams.success && encodedParams.encoded) {
                        beautifiedUrl += '?' + encodedParams.encoded;
                    }
                }
            }

            if (urlParts.hash) {
                beautifiedUrl += urlParts.hash;
            }

            return {
                success: true,
                beautified: beautifiedUrl,
                originalLength: url.length,
                beautifiedLength: beautifiedUrl.length,
                type: 'beautify'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add to history
     */
    addToHistory(action, input, output, type) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            input: typeof input === 'string' ? input.substring(0, 100) + (input.length > 100 ? '...' : '') : input,
            output: typeof output === 'string' ? output.substring(0, 100) + (output.length > 100 ? '...' : '') : output,
            type
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
