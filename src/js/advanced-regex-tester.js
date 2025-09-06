/**
 * Advanced Regex Tester
 * Multi-engine regex testing with live highlighting, capture groups, and safety features
 */

// Engine Adapter Interface
class EngineAdapter {
    constructor(flavor) {
        this.flavor = flavor;
        this.supportedFlags = this.getSupportedFlags();
    }

    getSupportedFlags() {
        return {
            'i': 'Case insensitive',
            'g': 'Global match',
            'm': 'Multiline',
            's': 'Dot all',
            'u': 'Unicode',
            'y': 'Sticky'
        };
    }

    compile(pattern, flags) {
        throw new Error('compile method must be implemented by subclass');
    }

    matchAll(compiled, input, timeout) {
        throw new Error('matchAll method must be implemented by subclass');
    }

    replace(compiled, input, replacement, flags) {
        throw new Error('replace method must be implemented by subclass');
    }
}

// ECMAScript/JavaScript Engine Adapter
class ECMAScriptAdapter extends EngineAdapter {
    constructor() {
        super('ECMAScript');
        this.supportedFlags = {
            'i': 'Case insensitive',
            'g': 'Global match',
            'm': 'Multiline',
            's': 'Dot all',
            'u': 'Unicode',
            'y': 'Sticky'
        };
    }

    compile(pattern, flags) {
        try {
            const flagString = this.flagsToString(flags);
            const regex = new RegExp(pattern, flagString);
            return {
                success: true,
                compiled: regex,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                compiled: null,
                error: error.message
            };
        }
    }

    matchAll(compiled, input, timeout) {
        const startTime = performance.now();
        const matches = [];
        
        try {
            if (compiled.global) {
                let match;
                while ((match = compiled.exec(input)) !== null) {
                    if (performance.now() - startTime > timeout) {
                        throw new Error('Timeout: Pattern took too long to execute');
                    }
                    
                    matches.push(this.createMatchObject(match, input));
                    
                    // Prevent infinite loop on zero-length matches
                    if (match.index === compiled.lastIndex) {
                        compiled.lastIndex++;
                    }
                }
            } else {
                const match = compiled.exec(input);
                if (match) {
                    matches.push(this.createMatchObject(match, input));
                }
            }
            
            return {
                success: true,
                matches: matches,
                elapsed: performance.now() - startTime,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                matches: [],
                elapsed: performance.now() - startTime,
                error: error.message
            };
        }
    }

    replace(compiled, input, replacement, flags) {
        try {
            const result = input.replace(compiled, replacement);
            return {
                success: true,
                result: result,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                result: input,
                error: error.message
            };
        }
    }

    createMatchObject(match, input) {
        const groups = [];
        
        // Add full match as group 0
        groups.push({
            index: 0,
            name: null,
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
        });
        
        // Add capture groups
        for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
                const groupStart = match.index + match[0].indexOf(match[i]);
                groups.push({
                    index: i,
                    name: null,
                    start: groupStart,
                    end: groupStart + match[i].length,
                    text: match[i]
                });
            }
        }
        
        return {
            index: match.index,
            length: match[0].length,
            text: match[0],
            groups: groups
        };
    }

    flagsToString(flags) {
        return Object.keys(flags).filter(flag => flags[flag]).join('');
    }
}

// PCRE2 Engine Adapter (simplified for browser)
class PCRE2Adapter extends EngineAdapter {
    constructor() {
        super('PCRE2');
        this.supportedFlags = {
            'i': 'Case insensitive',
            'm': 'Multiline',
            's': 'Dot all',
            'u': 'Unicode',
            'x': 'Extended',
            'A': 'Anchored',
            'D': 'Dollar end only',
            'S': 'Study pattern',
            'U': 'Ungreedy',
            'X': 'Extra'
        };
    }

    compile(pattern, flags) {
        // For browser implementation, we'll use JavaScript regex with PCRE-like behavior
        try {
            let jsPattern = this.convertPCREToJS(pattern);
            const flagString = this.flagsToString(flags);
            const regex = new RegExp(jsPattern, flagString);
            
            return {
                success: true,
                compiled: regex,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                compiled: null,
                error: error.message
            };
        }
    }

    matchAll(compiled, input, timeout) {
        // Use ECMAScript adapter for actual matching
        const ecmaAdapter = new ECMAScriptAdapter();
        return ecmaAdapter.matchAll(compiled, input, timeout);
    }

    replace(compiled, input, replacement, flags) {
        const ecmaAdapter = new ECMAScriptAdapter();
        return ecmaAdapter.replace(compiled, input, replacement, flags);
    }

    convertPCREToJS(pattern) {
        // Basic PCRE to JavaScript conversion
        // This is a simplified implementation
        return pattern
            .replace(/\(\?\#.*?\)/g, '') // Remove comments
            .replace(/\(\?\=/, '(?=') // Positive lookahead
            .replace(/\(\?\!/, '(?!') // Negative lookahead
            .replace(/\(\?\<\=/, '(?<=') // Positive lookbehind
            .replace(/\(\?\<\!/, '(?<!'); // Negative lookbehind
    }

    flagsToString(flags) {
        return Object.keys(flags).filter(flag => flags[flag]).join('');
    }
}

// .NET Engine Adapter (simplified for browser)
class DotNetAdapter extends EngineAdapter {
    constructor() {
        super('.NET');
        this.supportedFlags = {
            'i': 'Case insensitive',
            'm': 'Multiline',
            's': 'Single line',
            'x': 'Ignore whitespace',
            'n': 'Explicit capture',
            'c': 'Compiled',
            'r': 'Right to left',
            'e': 'ECMAScript'
        };
    }

    compile(pattern, flags) {
        try {
            let jsPattern = this.convertDotNetToJS(pattern);
            const flagString = this.flagsToString(flags);
            const regex = new RegExp(jsPattern, flagString);
            
            return {
                success: true,
                compiled: regex,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                compiled: null,
                error: error.message
            };
        }
    }

    matchAll(compiled, input, timeout) {
        const ecmaAdapter = new ECMAScriptAdapter();
        return ecmaAdapter.matchAll(compiled, input, timeout);
    }

    replace(compiled, input, replacement, flags) {
        const ecmaAdapter = new ECMAScriptAdapter();
        return ecmaAdapter.replace(compiled, input, replacement, flags);
    }

    convertDotNetToJS(pattern) {
        // Basic .NET to JavaScript conversion
        return pattern
            .replace(/\$\{(\w+)\}/g, '$$$1') // Named groups
            .replace(/\(\?\<(\w+)\>/, '(?<$1>'); // Named capture groups
    }

    flagsToString(flags) {
        return Object.keys(flags).filter(flag => flags[flag]).join('');
    }
}

// Match Highlighter
class MatchHighlighter {
    constructor() {
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ];
    }

    buildSpans(input, matches) {
        if (!matches || matches.length === 0) {
            return [{ text: input, type: 'normal' }];
        }

        const spans = [];
        let lastIndex = 0;

        matches.forEach((match, matchIndex) => {
            // Add text before match
            if (match.index > lastIndex) {
                spans.push({
                    text: input.substring(lastIndex, match.index),
                    type: 'normal'
                });
            }

            // Add match text
            spans.push({
                text: match.text,
                type: 'match',
                matchIndex: matchIndex,
                color: this.colors[matchIndex % this.colors.length]
            });

            lastIndex = match.index + match.length;
        });

        // Add remaining text
        if (lastIndex < input.length) {
            spans.push({
                text: input.substring(lastIndex),
                type: 'normal'
            });
        }

        return spans;
    }

    buildGroupSpans(input, matches) {
        const spans = [];
        let lastIndex = 0;

        matches.forEach((match, matchIndex) => {
            match.groups.forEach((group, groupIndex) => {
                // Add text before group
                if (group.start > lastIndex) {
                    spans.push({
                        text: input.substring(lastIndex, group.start),
                        type: 'normal'
                    });
                }

                // Add group text
                spans.push({
                    text: group.text,
                    type: 'group',
                    matchIndex: matchIndex,
                    groupIndex: groupIndex,
                    color: this.colors[groupIndex % this.colors.length]
                });

                lastIndex = group.end;
            });
        });

        // Add remaining text
        if (lastIndex < input.length) {
            spans.push({
                text: input.substring(lastIndex),
                type: 'normal'
            });
        }

        return spans;
    }
}

// Pattern Explainer
class PatternExplainer {
    constructor() {
        this.tokenTypes = {
            LITERAL: 'Literal character',
            CHARACTER_CLASS: 'Character class',
            QUANTIFIER: 'Quantifier',
            GROUP: 'Group',
            ANCHOR: 'Anchor',
            ESCAPE: 'Escape sequence',
            ALTERNATION: 'Alternation',
            LOOKAHEAD: 'Lookahead assertion',
            LOOKBEHIND: 'Lookbehind assertion'
        };
    }

    explain(pattern, flags, flavor) {
        try {
            const tokens = this.tokenize(pattern);
            const ast = this.parseTokens(tokens);
            const explanation = this.generateExplanation(ast, flags, flavor);
            
            return {
                success: true,
                tokens: tokens,
                ast: ast,
                explanation: explanation,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                tokens: [],
                ast: null,
                explanation: '',
                error: error.message
            };
        }
    }

    tokenize(pattern) {
        const tokens = [];
        let i = 0;

        while (i < pattern.length) {
            const char = pattern[i];
            
            if (char === '\\') {
                // Escape sequence
                if (i + 1 < pattern.length) {
                    tokens.push({
                        type: 'ESCAPE',
                        value: pattern.substring(i, i + 2),
                        position: i
                    });
                    i += 2;
                } else {
                    tokens.push({
                        type: 'LITERAL',
                        value: char,
                        position: i
                    });
                    i++;
                }
            } else if (char === '[') {
                // Character class
                let j = i + 1;
                while (j < pattern.length && pattern[j] !== ']') {
                    j++;
                }
                if (j < pattern.length) {
                    tokens.push({
                        type: 'CHARACTER_CLASS',
                        value: pattern.substring(i, j + 1),
                        position: i
                    });
                    i = j + 1;
                } else {
                    tokens.push({
                        type: 'LITERAL',
                        value: char,
                        position: i
                    });
                    i++;
                }
            } else if (char === '(') {
                // Group
                let j = i + 1;
                let depth = 1;
                while (j < pattern.length && depth > 0) {
                    if (pattern[j] === '(') depth++;
                    else if (pattern[j] === ')') depth--;
                    j++;
                }
                tokens.push({
                    type: 'GROUP',
                    value: pattern.substring(i, j),
                    position: i
                });
                i = j;
            } else if (char === '|') {
                tokens.push({
                    type: 'ALTERNATION',
                    value: char,
                    position: i
                });
                i++;
            } else if (char === '^' || char === '$') {
                tokens.push({
                    type: 'ANCHOR',
                    value: char,
                    position: i
                });
                i++;
            } else if (char === '*' || char === '+' || char === '?' || char === '{') {
                // Quantifier
                let j = i;
                if (char === '{') {
                    while (j < pattern.length && pattern[j] !== '}') {
                        j++;
                    }
                    j++;
                } else {
                    j++;
                }
                tokens.push({
                    type: 'QUANTIFIER',
                    value: pattern.substring(i, j),
                    position: i
                });
                i = j;
            } else {
                tokens.push({
                    type: 'LITERAL',
                    value: char,
                    position: i
                });
                i++;
            }
        }

        return tokens;
    }

    parseTokens(tokens) {
        // Simplified AST parsing
        return {
            type: 'PATTERN',
            children: tokens.map(token => ({
                type: token.type,
                value: token.value,
                position: token.position,
                description: this.getTokenDescription(token)
            }))
        };
    }

    getTokenDescription(token) {
        switch (token.type) {
            case 'LITERAL':
                return `Matches the literal character "${token.value}"`;
            case 'CHARACTER_CLASS':
                return `Matches any character in the class "${token.value}"`;
            case 'QUANTIFIER':
                return `Quantifier: "${token.value}"`;
            case 'GROUP':
                return `Group: "${token.value}"`;
            case 'ANCHOR':
                return `Anchor: "${token.value}"`;
            case 'ESCAPE':
                return `Escape sequence: "${token.value}"`;
            case 'ALTERNATION':
                return `Alternation (OR)`;
            default:
                return `Unknown token: "${token.value}"`;
        }
    }

    generateExplanation(ast, flags, flavor) {
        let explanation = `Pattern explanation for ${flavor} engine:\n\n`;
        
        if (Object.keys(flags).length > 0) {
            explanation += `Flags: ${Object.keys(flags).filter(f => flags[f]).join(', ')}\n\n`;
        }
        
        explanation += `Pattern breakdown:\n`;
        ast.children.forEach((child, index) => {
            explanation += `${index + 1}. ${child.description}\n`;
        });
        
        return explanation;
    }
}

// Safety Guard
class SafetyGuard {
    constructor() {
        this.defaultTimeout = 100; // 100ms default timeout
        this.maxTimeout = 1000; // 1 second max timeout
    }

    createWatchdog(timeout = this.defaultTimeout) {
        const startTime = performance.now();
        
        return {
            elapsed: () => performance.now() - startTime,
            isExpired: () => (performance.now() - startTime) > timeout,
            timeout: timeout
        };
    }

    validatePattern(pattern, flavor) {
        const warnings = [];
        
        // Check for potentially dangerous patterns
        if (pattern.includes('(.*)*') || pattern.includes('(.+)+')) {
            warnings.push('Warning: Nested quantifiers may cause catastrophic backtracking');
        }
        
        if (pattern.includes('(a+)+') || pattern.includes('(a*)*')) {
            warnings.push('Warning: Nested quantifiers on the same character may cause exponential backtracking');
        }
        
        if (flavor === 'ECMAScript' && pattern.includes('(?<=')) {
            warnings.push('Warning: Lookbehind assertions may not be supported in all JavaScript environments');
        }
        
        return {
            isValid: true,
            warnings: warnings
        };
    }
}

// Main Regex Tester
class AdvancedRegexTester {
    constructor() {
        this.engines = {
            'ECMAScript': new ECMAScriptAdapter(),
            'PCRE2': new PCRE2Adapter(),
            '.NET': new DotNetAdapter()
        };
        
        this.highlighter = new MatchHighlighter();
        this.explainer = new PatternExplainer();
        this.safetyGuard = new SafetyGuard();
        this.templates = this.createTemplates();
    }

    createTemplates() {
        return {
            'Email': {
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                flags: { 'i': true },
                description: 'Matches email addresses'
            },
            'URL': {
                pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
                flags: {},
                description: 'Matches HTTP/HTTPS URLs'
            },
            'IPv4': {
                pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
                flags: {},
                description: 'Matches IPv4 addresses'
            },
            'UUID': {
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
                flags: { 'i': true },
                description: 'Matches UUID v4 format'
            },
            'HEX Color': {
                pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
                flags: {},
                description: 'Matches hex color codes'
            },
            'Date (YYYY-MM-DD)': {
                pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
                flags: {},
                description: 'Matches dates in YYYY-MM-DD format'
            }
        };
    }

    test(pattern, flags, input, replacement = null, flavor = 'ECMAScript', timeout = 100) {
        const engine = this.engines[flavor];
        if (!engine) {
            return {
                success: false,
                error: `Unsupported engine: ${flavor}`
            };
        }

        // Safety validation
        const validation = this.safetyGuard.validatePattern(pattern, flavor);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.warnings.join('; ')
            };
        }

        // Compile pattern
        const compileResult = engine.compile(pattern, flags);
        if (!compileResult.success) {
            return {
                success: false,
                error: `Compilation error: ${compileResult.error}`
            };
        }

        // Create watchdog
        const watchdog = this.safetyGuard.createWatchdog(timeout);

        // Execute matches
        const matchResult = engine.matchAll(compileResult.compiled, input, timeout);
        if (!matchResult.success) {
            return {
                success: false,
                error: `Match error: ${matchResult.error}`,
                elapsed: matchResult.elapsed
            };
        }

        // Check for timeout
        if (watchdog.isExpired()) {
            return {
                success: false,
                error: 'Timeout: Pattern took too long to execute. Consider simplifying the pattern or using a different engine.',
                elapsed: watchdog.elapsed()
            };
        }

        // Generate highlights
        const highlights = this.highlighter.buildSpans(input, matchResult.matches);
        const groupHighlights = this.highlighter.buildGroupSpans(input, matchResult.matches);

        // Generate explanation
        const explanation = this.explainer.explain(pattern, flags, flavor);

        // Handle replacement
        let replacementResult = null;
        if (replacement !== null) {
            const replaceResult = engine.replace(compileResult.compiled, input, replacement, flags);
            replacementResult = replaceResult;
        }

        return {
            success: true,
            matches: matchResult.matches,
            highlights: highlights,
            groupHighlights: groupHighlights,
            replacement: replacementResult,
            explanation: explanation,
            elapsed: matchResult.elapsed,
            warnings: validation.warnings
        };
    }

    getSupportedEngines() {
        return Object.keys(this.engines);
    }

    getEngineFlags(flavor) {
        const engine = this.engines[flavor];
        return engine ? engine.supportedFlags : {};
    }

    getTemplates() {
        return this.templates;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.AdvancedRegexTester = AdvancedRegexTester;
    window.ECMAScriptAdapter = ECMAScriptAdapter;
    window.PCRE2Adapter = PCRE2Adapter;
    window.DotNetAdapter = DotNetAdapter;
    window.MatchHighlighter = MatchHighlighter;
    window.PatternExplainer = PatternExplainer;
    window.SafetyGuard = SafetyGuard;
}
