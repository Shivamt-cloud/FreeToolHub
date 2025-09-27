/**
 * Regular Expression Tester
 * Professional regex testing tool with pattern library and highlighting
 */

class RegexTester {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
        this.patternLibrary = {
            'Email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Phone (US)': /^\(\d{3}\)\s\d{3}-\d{4}$/,
            'URL': /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
            'IPv4': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            'IPv6': /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
            'Credit Card': /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
            'Date (YYYY-MM-DD)': /^\d{4}-\d{2}-\d{2}$/,
            'Time (HH:MM)': /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            'Postal Code (US)': /^\d{5}(-\d{4})?$/,
            'Username': /^[a-zA-Z0-9_]{3,20}$/,
            'Password': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Hex Color': /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            'HTML Tag': /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/,
            'JSON Number': /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/,
            'UUID': /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        };
        this.flags = ['g', 'i', 'm', 's', 'u', 'y'];
    }

    /**
     * Test regex pattern against text
     */
    testRegex(pattern, text, flags = []) {
        try {
            if (!pattern) {
                throw new Error('Pattern is required');
            }

            if (!text) {
                throw new Error('Text is required');
            }

            // Create regex with flags
            const flagString = flags.join('');
            const regex = new RegExp(pattern, flagString);

            // Test the regex
            const matches = [];
            const allMatches = text.matchAll(regex);
            
            for (const match of allMatches) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1),
                    input: match.input
                });
            }

            // Get first match for simple testing
            const firstMatch = text.match(regex);
            const isMatch = firstMatch !== null;

            // Get replace result
            const replaced = text.replace(regex, 'REPLACED');

            this.addToHistory('test', pattern, text, 'regex');
            return {
                success: true,
                isMatch: isMatch,
                matches: matches,
                matchCount: matches.length,
                firstMatch: firstMatch,
                replaced: replaced,
                pattern: pattern,
                flags: flags,
                flagString: flagString,
                type: 'test'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                pattern: pattern,
                type: 'test'
            };
        }
    }

    /**
     * Validate regex pattern
     */
    validateRegex(pattern, flags = []) {
        try {
            if (!pattern) {
                throw new Error('Pattern is required');
            }

            const flagString = flags.join('');
            const regex = new RegExp(pattern, flagString);

            return {
                success: true,
                isValid: true,
                pattern: pattern,
                flags: flags,
                flagString: flagString,
                source: regex.source,
                type: 'validation'
            };
        } catch (error) {
            return {
                success: false,
                isValid: false,
                error: error.message,
                pattern: pattern,
                type: 'validation'
            };
        }
    }

    /**
     * Get regex explanation
     */
    explainRegex(pattern) {
        try {
            if (!pattern) {
                throw new Error('Pattern is required');
            }

            const explanation = this.parseRegexPattern(pattern);
            
            return {
                success: true,
                explanation: explanation,
                pattern: pattern,
                type: 'explanation'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                pattern: pattern,
                type: 'explanation'
            };
        }
    }

    /**
     * Parse regex pattern for explanation
     */
    parseRegexPattern(pattern) {
        const explanation = [];
        let i = 0;
        
        while (i < pattern.length) {
            const char = pattern[i];
            const nextChar = pattern[i + 1];
            
            switch (char) {
                case '^':
                    explanation.push({
                        symbol: '^',
                        meaning: 'Start of string anchor',
                        description: 'Matches the beginning of the string'
                    });
                    break;
                    
                case '$':
                    explanation.push({
                        symbol: '$',
                        meaning: 'End of string anchor',
                        description: 'Matches the end of the string'
                    });
                    break;
                    
                case '.':
                    explanation.push({
                        symbol: '.',
                        meaning: 'Any character',
                        description: 'Matches any single character (except newline)'
                    });
                    break;
                    
                case '*':
                    explanation.push({
                        symbol: '*',
                        meaning: 'Zero or more',
                        description: 'Matches zero or more of the preceding character'
                    });
                    break;
                    
                case '+':
                    explanation.push({
                        symbol: '+',
                        meaning: 'One or more',
                        description: 'Matches one or more of the preceding character'
                    });
                    break;
                    
                case '?':
                    explanation.push({
                        symbol: '?',
                        meaning: 'Zero or one',
                        description: 'Matches zero or one of the preceding character'
                    });
                    break;
                    
                case '|':
                    explanation.push({
                        symbol: '|',
                        meaning: 'OR operator',
                        description: 'Matches either the expression before or after'
                    });
                    break;
                    
                case '\\':
                    if (nextChar) {
                        const escaped = pattern[i + 1];
                        explanation.push({
                            symbol: `\\${escaped}`,
                            meaning: `Escaped ${escaped}`,
                            description: `Matches the literal character '${escaped}'`
                        });
                        i++; // Skip next character
                    }
                    break;
                    
                case '[':
                    const bracketEnd = pattern.indexOf(']', i);
                    if (bracketEnd !== -1) {
                        const bracketContent = pattern.substring(i + 1, bracketEnd);
                        explanation.push({
                            symbol: `[${bracketContent}]`,
                            meaning: 'Character class',
                            description: `Matches any character in the set: ${bracketContent}`
                        });
                        i = bracketEnd;
                    }
                    break;
                    
                case '(':
                    explanation.push({
                        symbol: '(',
                        meaning: 'Group start',
                        description: 'Start of a capturing group'
                    });
                    break;
                    
                case ')':
                    explanation.push({
                        symbol: ')',
                        meaning: 'Group end',
                        description: 'End of a capturing group'
                    });
                    break;
                    
                case '{':
                    const braceEnd = pattern.indexOf('}', i);
                    if (braceEnd !== -1) {
                        const braceContent = pattern.substring(i + 1, braceEnd);
                        explanation.push({
                            symbol: `{${braceContent}}`,
                            meaning: 'Quantifier',
                            description: `Matches the preceding element ${braceContent} times`
                        });
                        i = braceEnd;
                    }
                    break;
                    
                default:
                    explanation.push({
                        symbol: char,
                        meaning: 'Literal character',
                        description: `Matches the literal character '${char}'`
                    });
                    break;
            }
            
            i++;
        }
        
        return explanation;
    }

    /**
     * Get pattern library
     */
    getPatternLibrary() {
        return this.patternLibrary;
    }

    /**
     * Add custom pattern to library
     */
    addCustomPattern(name, pattern, description = '') {
        try {
            // Validate the pattern
            new RegExp(pattern);
            
            this.patternLibrary[name] = {
                pattern: pattern,
                description: description,
                custom: true
            };
            
            return {
                success: true,
                message: `Pattern '${name}' added successfully`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remove custom pattern from library
     */
    removeCustomPattern(name) {
        if (this.patternLibrary[name] && this.patternLibrary[name].custom) {
            delete this.patternLibrary[name];
            return {
                success: true,
                message: `Pattern '${name}' removed successfully`
            };
        } else {
            return {
                success: false,
                error: 'Pattern not found or not custom'
            };
        }
    }

    /**
     * Get regex flags explanation
     */
    getFlagsExplanation() {
        return {
            'g': {
                name: 'Global',
                description: 'Find all matches rather than stopping after the first match'
            },
            'i': {
                name: 'Case Insensitive',
                description: 'Case-insensitive matching'
            },
            'm': {
                name: 'Multiline',
                description: '^ and $ match line breaks within the string'
            },
            's': {
                name: 'Dot All',
                description: '. matches newline characters'
            },
            'u': {
                name: 'Unicode',
                description: 'Treat pattern as a sequence of Unicode code points'
            },
            'y': {
                name: 'Sticky',
                description: 'Matches only from the index indicated by the lastIndex property'
            }
        };
    }

    /**
     * Generate regex from description
     */
    generateRegex(description) {
        try {
            const commonPatterns = {
                'email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'phone': /^\(\d{3}\)\s\d{3}-\d{4}$/,
                'url': /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
                'ip': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                'credit card': /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
                'date': /^\d{4}-\d{2}-\d{2}$/,
                'time': /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                'postal code': /^\d{5}(-\d{4})?$/,
                'username': /^[a-zA-Z0-9_]{3,20}$/,
                'password': /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'hex color': /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                'html tag': /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/,
                'json number': /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/,
                'uuid': /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            };

            const lowerDesc = description.toLowerCase();
            for (const [key, pattern] of Object.entries(commonPatterns)) {
                if (lowerDesc.includes(key)) {
                    return {
                        success: true,
                        pattern: pattern.source,
                        description: `Generated pattern for: ${key}`,
                        type: 'generation'
                    };
                }
            }

            return {
                success: false,
                error: 'No matching pattern found for description',
                type: 'generation'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                type: 'generation'
            };
        }
    }

    /**
     * Get regex statistics
     */
    getRegexStats(pattern, text) {
        try {
            if (!pattern || !text) {
                throw new Error('Pattern and text are required');
            }

            const regex = new RegExp(pattern, 'g');
            const matches = text.match(regex) || [];
            const matchCount = matches.length;
            
            // Calculate coverage
            const totalChars = text.length;
            const matchedChars = matches.join('').length;
            const coverage = totalChars > 0 ? (matchedChars / totalChars * 100).toFixed(2) : 0;

            // Get unique matches
            const uniqueMatches = [...new Set(matches)];
            
            // Calculate average match length
            const avgMatchLength = matchCount > 0 ? (matchedChars / matchCount).toFixed(2) : 0;

            return {
                success: true,
                stats: {
                    totalMatches: matchCount,
                    uniqueMatches: uniqueMatches.length,
                    totalCharacters: totalChars,
                    matchedCharacters: matchedChars,
                    coverage: parseFloat(coverage),
                    averageMatchLength: parseFloat(avgMatchLength),
                    matches: matches,
                    uniqueMatches: uniqueMatches
                },
                type: 'stats'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                type: 'stats'
            };
        }
    }

    /**
     * Highlight matches in text
     */
    highlightMatches(pattern, text, flags = []) {
        try {
            if (!pattern || !text) {
                throw new Error('Pattern and text are required');
            }

            const flagString = flags.join('');
            const regex = new RegExp(pattern, flagString);
            
            // Split text by matches and create highlighted version
            const parts = text.split(regex);
            const matches = text.match(regex) || [];
            
            let highlighted = '';
            let matchIndex = 0;
            
            for (let i = 0; i < parts.length; i++) {
                highlighted += parts[i];
                if (i < parts.length - 1 && matchIndex < matches.length) {
                    highlighted += `<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">${matches[matchIndex]}</mark>`;
                    matchIndex++;
                }
            }

            return {
                success: true,
                highlighted: highlighted,
                matches: matches,
                matchCount: matches.length,
                type: 'highlight'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                type: 'highlight'
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
