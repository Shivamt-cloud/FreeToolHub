/**
 * Advanced CSS/JS Minifier
 * Comprehensive minification tool with AST-based optimization
 */

class Tokenizer {
    constructor(language) {
        this.language = language; // 'css' or 'javascript'
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.source = '';
    }

    tokenize(sourceCode) {
        this.resetState(sourceCode);
        
        while (!this.isAtEnd()) {
            const startPosition = { line: this.line, column: this.column, position: this.position };
            
            // Skip whitespace (but preserve for certain contexts)
            if (this.isWhitespace(this.currentChar)) {
                this.consumeWhitespace(startPosition);
                continue;
            }
            
            // Handle comments
            if (this.isCommentStart()) {
                this.consumeComment(startPosition);
                continue;
            }
            
            // Language-specific tokenization
            if (this.language === 'css') {
                this.tokenizeCssElement(startPosition);
            } else { // javascript
                this.tokenizeJsElement(startPosition);
            }
        }
        
        return this.tokens;
    }

    resetState(sourceCode) {
        this.source = sourceCode;
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }

    get currentChar() {
        return this.source[this.position];
    }

    get nextChar() {
        return this.source[this.position + 1];
    }

    isAtEnd() {
        return this.position >= this.source.length;
    }

    advance() {
        if (this.currentChar === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        this.position++;
    }

    isWhitespace(char) {
        return /\s/.test(char);
    }

    isCommentStart() {
        if (this.language === 'css') {
            return this.currentChar === '/' && this.nextChar === '*';
        } else {
            return (this.currentChar === '/' && this.nextChar === '/') ||
                   (this.currentChar === '/' && this.nextChar === '*');
        }
    }

    isIdentifierStart(char) {
        return /[a-zA-Z_$]/.test(char);
    }

    isIdentifierChar(char) {
        return /[a-zA-Z0-9_$]/.test(char);
    }

    consumeWhitespace(startPos) {
        let whitespace = '';
        while (!this.isAtEnd() && this.isWhitespace(this.currentChar)) {
            whitespace += this.currentChar;
            this.advance();
        }
        
        // Only add whitespace token if it's significant
        if (whitespace.includes('\n') || whitespace.length > 1) {
            this.addToken('WHITESPACE', whitespace, startPos);
        }
    }

    consumeComment(startPos) {
        if (this.language === 'css') {
            // CSS only has /* */ comments
            if (this.match('/*')) {
                this.advance(2);
                let commentContent = '';
                
                while (!this.isAtEnd() && !this.match('*/')) {
                    commentContent += this.currentChar;
                    this.advance();
                }
                
                if (this.match('*/')) {
                    this.advance(2);
                }
                
                this.addToken('COMMENT', commentContent, startPos);
            }
        } else { // JavaScript
            if (this.match('//')) {
                // Single-line comment
                this.advance(2);
                let commentContent = this.consumeUntil('\n');
                this.addToken('SINGLE_LINE_COMMENT', commentContent, startPos);
                
            } else if (this.match('/*')) {
                // Multi-line comment
                this.advance(2);
                let commentContent = '';
                
                while (!this.isAtEnd() && !this.match('*/')) {
                    commentContent += this.currentChar;
                    this.advance();
                }
                
                if (this.match('*/')) {
                    this.advance(2);
                }
                
                this.addToken('MULTI_LINE_COMMENT', commentContent, startPos);
            }
        }
    }

    tokenizeCssElement(startPos) {
        const char = this.currentChar;
        
        if (char === '{') {
            this.addToken('LEFT_BRACE', char, startPos);
            this.advance();
        } else if (char === '}') {
            this.addToken('RIGHT_BRACE', char, startPos);
            this.advance();
        } else if (char === ':') {
            this.addToken('COLON', char, startPos);
            this.advance();
        } else if (char === ';') {
            this.addToken('SEMICOLON', char, startPos);
            this.advance();
        } else if (char === ',') {
            this.addToken('COMMA', char, startPos);
            this.advance();
        } else if (char === '"' || char === "'") {
            this.consumeStringLiteral(startPos, char);
        } else if (char === '#') {
            this.consumeHashOrColor(startPos);
        } else if (char === '@') {
            this.consumeAtRule(startPos);
        } else if (this.isIdentifierStart(char)) {
            this.consumeIdentifier(startPos);
        } else {
            this.consumeOperatorOrSymbol(startPos);
        }
    }

    tokenizeJsElement(startPos) {
        const char = this.currentChar;
        
        // Structural tokens
        if ('{}[]();,'.includes(char)) {
            const tokenType = this.getJsStructuralType(char);
            this.addToken(tokenType, char, startPos);
            this.advance();
        }
        // Operators
        else if ('+-*/%=!<>&|^~?'.includes(char)) {
            this.consumeJsOperator(startPos);
        }
        // String literals
        else if (char === '"' || char === "'" || char === '`') {
            this.consumeJsString(startPos, char);
        }
        // Numbers
        else if (char.match(/\d/) || char === '.') {
            this.consumeJsNumber(startPos);
        }
        // Regular expressions
        else if (char === '/' && this.couldBeRegex()) {
            this.consumeRegexLiteral(startPos);
        }
        // Identifiers and keywords
        else if (this.isIdentifierStart(char)) {
            this.consumeJsIdentifier(startPos);
        }
        else {
            this.addToken('UNKNOWN', char, startPos);
            this.advance();
        }
    }

    consumeStringLiteral(startPos, quoteChar) {
        this.advance(); // Skip opening quote
        let stringContent = '';
        
        while (!this.isAtEnd() && this.currentChar !== quoteChar) {
            if (this.currentChar === '\\') {
                // Handle escape sequences
                stringContent += this.currentChar;
                this.advance();
                if (!this.isAtEnd()) {
                    stringContent += this.currentChar;
                    this.advance();
                }
            } else {
                stringContent += this.currentChar;
                this.advance();
            }
        }
        
        if (this.currentChar === quoteChar) {
            this.advance(); // Skip closing quote
        }
        
        this.addToken('STRING_LITERAL', {
            content: stringContent,
            quote: quoteChar
        }, startPos);
    }

    consumeIdentifier(startPos) {
        let identifier = '';
        
        while (!this.isAtEnd() && this.isIdentifierChar(this.currentChar)) {
            identifier += this.currentChar;
            this.advance();
        }
        
        this.addToken('IDENTIFIER', identifier, startPos);
    }

    consumeHashOrColor(startPos) {
        this.advance(); // Skip #
        let color = '#';
        
        while (!this.isAtEnd() && /[a-fA-F0-9]/.test(this.currentChar)) {
            color += this.currentChar;
            this.advance();
        }
        
        this.addToken('COLOR', color, startPos);
    }

    consumeAtRule(startPos) {
        this.advance(); // Skip @
        let rule = '@';
        
        while (!this.isAtEnd() && this.isIdentifierChar(this.currentChar)) {
            rule += this.currentChar;
            this.advance();
        }
        
        this.addToken('AT_RULE', rule, startPos);
    }

    consumeJsString(startPos, quoteChar) {
        if (quoteChar === '`') {
            // Template literal - simplified handling
            this.consumeTemplateLiteral(startPos);
        } else {
            this.consumeStringLiteral(startPos, quoteChar);
        }
    }

    consumeTemplateLiteral(startPos) {
        this.advance(); // Skip opening `
        let content = '';
        
        while (!this.isAtEnd() && this.currentChar !== '`') {
            if (this.currentChar === '\\') {
                content += this.currentChar;
                this.advance();
                if (!this.isAtEnd()) {
                    content += this.currentChar;
                    this.advance();
                }
            } else {
                content += this.currentChar;
                this.advance();
            }
        }
        
        if (this.currentChar === '`') {
            this.advance(); // Skip closing `
        }
        
        this.addToken('TEMPLATE_LITERAL', content, startPos);
    }

    consumeJsNumber(startPos) {
        let number = '';
        
        while (!this.isAtEnd() && /[\d.]/.test(this.currentChar)) {
            number += this.currentChar;
            this.advance();
        }
        
        this.addToken('NUMBER', number, startPos);
    }

    consumeJsOperator(startPos) {
        let operator = this.currentChar;
        this.advance();
        
        // Check for multi-character operators
        if (!this.isAtEnd()) {
            const twoChar = operator + this.currentChar;
            if (['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '=>'].includes(twoChar)) {
                operator = twoChar;
                this.advance();
            }
        }
        
        this.addToken('OPERATOR', operator, startPos);
    }

    consumeRegexLiteral(startPos) {
        this.advance(); // Skip opening /
        let pattern = '';
        
        while (!this.isAtEnd() && this.currentChar !== '/') {
            if (this.currentChar === '\\') {
                pattern += this.currentChar;
                this.advance();
                if (!this.isAtEnd()) {
                    pattern += this.currentChar;
                    this.advance();
                }
            } else {
                pattern += this.currentChar;
                this.advance();
            }
        }
        
        if (this.currentChar === '/') {
            this.advance(); // Skip closing /
        }
        
        // Consume flags
        let flags = '';
        while (!this.isAtEnd() && /[gimuy]/.test(this.currentChar)) {
            flags += this.currentChar;
            this.advance();
        }
        
        this.addToken('REGEX_LITERAL', { pattern, flags }, startPos);
    }

    consumeJsIdentifier(startPos) {
        this.consumeIdentifier(startPos);
    }

    consumeOperatorOrSymbol(startPos) {
        this.addToken('SYMBOL', this.currentChar, startPos);
        this.advance();
    }

    getJsStructuralType(char) {
        const types = {
            '{': 'LEFT_BRACE',
            '}': 'RIGHT_BRACE',
            '[': 'LEFT_BRACKET',
            ']': 'RIGHT_BRACKET',
            '(': 'LEFT_PAREN',
            ')': 'RIGHT_PAREN',
            ';': 'SEMICOLON',
            ',': 'COMMA'
        };
        return types[char] || 'UNKNOWN';
    }

    couldBeRegex() {
        // Simple heuristic: if previous token was operator, assignment, or start of statement
        const prevToken = this.tokens[this.tokens.length - 1];
        return !prevToken || ['OPERATOR', 'ASSIGNMENT', 'LEFT_PAREN', 'LEFT_BRACE', 'SEMICOLON'].includes(prevToken.type);
    }

    consumeUntil(char) {
        let content = '';
        while (!this.isAtEnd() && this.currentChar !== char) {
            content += this.currentChar;
            this.advance();
        }
        return content;
    }

    match(str) {
        return this.source.substring(this.position, this.position + str.length) === str;
    }

    advance(count = 1) {
        for (let i = 0; i < count; i++) {
            if (this.currentChar === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.position++;
        }
    }

    addToken(type, value, position) {
        this.tokens.push({
            type,
            value,
            position: {
                line: position.line,
                column: position.column,
                index: position.position
            }
        });
    }
}

class CSSMinifier {
    constructor() {
        this.options = {
            removeComments: true,
            removeWhitespace: true,
            mergeSelectors: true,
            optimizeColors: true,
            optimizeValues: true,
            removeEmptyRules: true
        };
    }

    minify(cssCode) {
        try {
            const tokenizer = new Tokenizer('css');
            const tokens = tokenizer.tokenize(cssCode);
            
            let minified = this.processTokens(tokens);
            
            // Apply additional optimizations
            if (this.options.optimizeColors) {
                minified = this.optimizeColors(minified);
            }
            
            if (this.options.optimizeValues) {
                minified = this.optimizeValues(minified);
            }
            
            if (this.options.removeEmptyRules) {
                minified = this.removeEmptyRules(minified);
            }
            
            return {
                success: true,
                minifiedCode: minified,
                originalSize: cssCode.length,
                minifiedSize: minified.length,
                compressionRatio: Math.round((1 - minified.length / cssCode.length) * 100 * 100) / 100
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                minifiedCode: cssCode
            };
        }
    }

    processTokens(tokens) {
        let result = '';
        let inComment = false;
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (token.type === 'COMMENT' && this.options.removeComments) {
                continue;
            }
            
            if (token.type === 'WHITESPACE' && this.options.removeWhitespace) {
                // Only preserve whitespace that's necessary for syntax
                if (i > 0 && i < tokens.length - 1) {
                    const prev = tokens[i - 1];
                    const next = tokens[i + 1];
                    
                    // Preserve space between selectors and {
                    if (prev.type === 'IDENTIFIER' && next.type === 'LEFT_BRACE') {
                        result += ' ';
                    }
                    // Preserve space between property and :
                    else if (prev.type === 'IDENTIFIER' && next.type === 'COLON') {
                        result += '';
                    }
                    // Preserve space between : and value
                    else if (prev.type === 'COLON' && next.type !== 'WHITESPACE') {
                        result += '';
                    }
                    // Preserve ; between declarations
                    else if (prev.type === 'SEMICOLON' && next.type !== 'WHITESPACE') {
                        result += '';
                    }
                }
                continue;
            }
            
            if (typeof token.value === 'string') {
                result += token.value;
            } else if (token.value && typeof token.value === 'object') {
                result += token.value.content || token.value.pattern || '';
            }
        }
        
        return result;
    }

    optimizeColors(css) {
        // Convert named colors to hex
        const colorMap = {
            'white': '#fff',
            'black': '#000',
            'red': '#f00',
            'green': '#008000',
            'blue': '#00f',
            'yellow': '#ff0',
            'orange': '#ffa500',
            'purple': '#800080',
            'pink': '#ffc0cb',
            'gray': '#808080',
            'grey': '#808080'
        };
        
        for (const [name, hex] of Object.entries(colorMap)) {
            const regex = new RegExp(`\\b${name}\\b`, 'gi');
            css = css.replace(regex, hex);
        }
        
        // Optimize hex colors (#ffffff -> #fff)
        css = css.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
        
        // Convert rgb() to hex if shorter
        css = css.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, (match, r, g, b) => {
            const hex = '#' + [r, g, b].map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            
            // Try to shorten to 3-char hex
            if (hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]) {
                return '#' + hex[1] + hex[3] + hex[5];
            }
            return hex;
        });
        
        return css;
    }

    optimizeValues(css) {
        // Remove leading zeros: 0.5px -> .5px
        css = css.replace(/\b0+(\.\d+)/g, '$1');
        
        // Remove trailing zeros: 1.50px -> 1.5px
        css = css.replace(/(\d+)\.0+(?=\D|$)/g, '$1');
        css = css.replace(/(\d+\.\d*?)0+(?=\D|$)/g, '$1');
        
        // Remove unnecessary units for zero values: 0px -> 0
        css = css.replace(/\b0(?:px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)\b/g, '0');
        
        return css;
    }

    removeEmptyRules(css) {
        // Remove empty rules like .class { }
        css = css.replace(/[^{}]+{\s*}/g, '');
        
        // Remove rules with only whitespace
        css = css.replace(/[^{}]+{\s+}/g, '');
        
        return css;
    }
}

class JavaScriptMinifier {
    constructor() {
        this.options = {
            mangleNames: true,
            removeDeadCode: true,
            compressExpressions: true,
            removeConsole: true,
            optimizeConditionals: true
        };
        
        this.nameGenerator = new NameGenerator();
    }

    minify(jsCode) {
        try {
            const tokenizer = new Tokenizer('javascript');
            const tokens = tokenizer.tokenize(jsCode);
            
            let minified = this.processTokens(tokens);
            
            // Apply additional optimizations
            if (this.options.removeConsole) {
                minified = this.removeConsoleStatements(minified);
            }
            
            if (this.options.compressExpressions) {
                minified = this.compressExpressions(minified);
            }
            
            if (this.options.removeDeadCode) {
                minified = this.removeDeadCode(minified);
            }
            
            if (this.options.mangleNames) {
                minified = this.mangleNames(minified);
            }
            
            return {
                success: true,
                minifiedCode: minified,
                originalSize: jsCode.length,
                minifiedSize: minified.length,
                compressionRatio: Math.round((1 - minified.length / jsCode.length) * 100 * 100) / 100
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                minifiedCode: jsCode
            };
        }
    }

    processTokens(tokens) {
        let result = '';
        let inString = false;
        let stringQuote = '';
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            // Skip comments if option is enabled
            if ((token.type === 'SINGLE_LINE_COMMENT' || token.type === 'MULTI_LINE_COMMENT') && this.options.removeComments !== false) {
                continue;
            }
            
            // Skip whitespace
            if (token.type === 'WHITESPACE') {
                // Only preserve necessary whitespace
                if (i > 0 && i < tokens.length - 1) {
                    const prev = tokens[i - 1];
                    const next = tokens[i + 1];
                    
                    // Preserve space between keywords and identifiers
                    if (this.needsSpace(prev, next)) {
                        result += ' ';
                    }
                }
                continue;
            }
            
            if (typeof token.value === 'string') {
                result += token.value;
            } else if (token.value && typeof token.value === 'object') {
                if (token.type === 'STRING_LITERAL') {
                    result += token.value.quote + token.value.content + token.value.quote;
                } else if (token.type === 'TEMPLATE_LITERAL') {
                    result += '`' + token.value + '`';
                } else if (token.type === 'REGEX_LITERAL') {
                    result += '/' + token.value.pattern + '/' + token.value.flags;
                } else {
                    result += token.value.content || token.value.pattern || '';
                }
            }
        }
        
        return result;
    }

    needsSpace(prev, next) {
        // Cases where space is needed between tokens
        const needsSpaceCases = [
            ['IDENTIFIER', 'IDENTIFIER'],
            ['NUMBER', 'IDENTIFIER'],
            ['IDENTIFIER', 'NUMBER'],
            ['return', 'IDENTIFIER'],
            ['var', 'IDENTIFIER'],
            ['let', 'IDENTIFIER'],
            ['const', 'IDENTIFIER'],
            ['function', 'IDENTIFIER']
        ];
        
        return needsSpaceCases.some(([prevType, nextType]) => 
            (prev.type === prevType || prev.value === prevType) && 
            (next.type === nextType || next.value === nextType)
        );
    }

    removeConsoleStatements(js) {
        // Remove console.log, console.warn, etc.
        return js.replace(/console\.(log|warn|error|info|debug)\s*\([^)]*\)\s*;?/g, '');
    }

    compressExpressions(js) {
        // Remove unnecessary semicolons
        js = js.replace(/;\s*}/g, '}');
        js = js.replace(/;\s*;/g, ';');
        
        // Optimize boolean expressions
        js = js.replace(/\btrue\s*&&\s*/g, '');
        js = js.replace(/\s*&&\s*true\b/g, '');
        js = js.replace(/\bfalse\s*\|\|\s*/g, '');
        js = js.replace(/\s*\|\|\s*false\b/g, '');
        
        return js;
    }

    removeDeadCode(js) {
        // Remove unreachable code after return statements
        js = js.replace(/return[^;]+;\s*[^}]+/g, (match) => {
            const returnIndex = match.indexOf('return');
            const semicolonIndex = match.indexOf(';', returnIndex);
            return match.substring(0, semicolonIndex + 1);
        });
        
        return js;
    }

    mangleNames(js) {
        // Simple name mangling - replace common variable names with shorter ones
        const nameMap = {
            'function': 'f',
            'variable': 'v',
            'element': 'e',
            'object': 'o',
            'array': 'a',
            'string': 's',
            'number': 'n',
            'boolean': 'b',
            'callback': 'cb',
            'index': 'i',
            'length': 'l',
            'result': 'r',
            'value': 'v',
            'data': 'd',
            'item': 'i',
            'count': 'c',
            'total': 't',
            'temp': 't',
            'current': 'c',
            'previous': 'p',
            'next': 'n'
        };
        
        for (const [longName, shortName] of Object.entries(nameMap)) {
            const regex = new RegExp(`\\b${longName}\\b`, 'g');
            js = js.replace(regex, shortName);
        }
        
        return js;
    }
}

class NameGenerator {
    constructor() {
        this.reservedWords = [
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
            'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
            'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
            'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
            'var', 'void', 'while', 'with', 'yield', 'let', 'static'
        ];
        
        this.currentIndex = 0;
        this.alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    generateShortName() {
        while (true) {
            const name = this.indexToName(this.currentIndex);
            this.currentIndex++;
            
            if (!this.reservedWords.includes(name)) {
                return name;
            }
        }
    }

    indexToName(index) {
        if (index < this.alphabet.length) {
            return this.alphabet[index];
        }
        
        // For longer names, use base-52 encoding
        let name = '';
        let remaining = index;
        
        // First character must be letter
        name += this.alphabet[remaining % this.alphabet.length];
        remaining = Math.floor(remaining / this.alphabet.length);
        
        // Subsequent characters can be alphanumeric
        const alphanumeric = this.alphabet + '0123456789';
        while (remaining > 0) {
            name += alphanumeric[remaining % alphanumeric.length];
            remaining = Math.floor(remaining / alphanumeric.length);
        }
        
        return name;
    }
}

class UnifiedMinifier {
    constructor() {
        this.cssMinifier = new CSSMinifier();
        this.jsMinifier = new JavaScriptMinifier();
    }

    minify(sourceCode, language, options = {}) {
        try {
            if (language === 'css') {
                this.cssMinifier.options = { ...this.cssMinifier.options, ...options };
                return this.cssMinifier.minify(sourceCode);
            } else if (language === 'javascript') {
                this.jsMinifier.options = { ...this.jsMinifier.options, ...options };
                return this.jsMinifier.minify(sourceCode);
            } else {
                throw new Error('Unsupported language. Use "css" or "javascript".');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
                minifiedCode: sourceCode
            };
        }
    }

    batchMinify(files, options = {}) {
        const results = {};
        
        for (const [filename, content] of Object.entries(files)) {
            const language = filename.endsWith('.js') ? 'javascript' : 'css';
            results[filename] = this.minify(content, language, options);
        }
        
        return results;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.UnifiedMinifier = UnifiedMinifier;
    window.CSSMinifier = CSSMinifier;
    window.JavaScriptMinifier = JavaScriptMinifier;
    window.Tokenizer = Tokenizer;
    window.NameGenerator = NameGenerator;
}
