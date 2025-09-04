/**
 * Advanced JSON Formatter
 * Comprehensive JSON processing with validation, formatting, minification, and syntax highlighting
 * Implements RFC 7159 JSON specification with robust error reporting
 */

// Custom error class for JSON syntax errors
export class JSONSyntaxError extends Error {
    constructor(message, line = null, column = null) {
        super(message);
        this.name = 'JSONSyntaxError';
        this.line = line;
        this.column = column;
    }
}

/**
 * JSON Tokenizer - Converts JSON string into tokens with position information
 */
export class JSONTokenizer {
    constructor() {
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
        
        // Token types
        this.TOKEN_TYPES = {
            'LEFT_BRACE': '{',
            'RIGHT_BRACE': '}',
            'LEFT_BRACKET': '[',
            'RIGHT_BRACKET': ']',
            'COMMA': ',',
            'COLON': ':',
            'STRING': 'string',
            'NUMBER': 'number',
            'BOOLEAN': 'boolean',
            'NULL': 'null',
            'WHITESPACE': 'whitespace',
            'EOF': 'eof',
            'INVALID': 'invalid'
        };
    }
    
    resetState() {
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }
    
    tokenize(jsonString) {
        this.resetState();
        let i = 0;
        
        while (i < jsonString.length) {
            const char = jsonString[i];
            
            // Skip whitespace but track position
            if (this.isWhitespace(char)) {
                const startPos = [this.line, this.column];
                const { whitespace, consumed } = this.consumeWhitespace(jsonString, i);
                this.addToken('WHITESPACE', whitespace, startPos);
                i += consumed;
                continue;
            }
            
            const startPos = [this.line, this.column];
            
            // Structural characters
            if ('{}[],:'.includes(char)) {
                const tokenType = this.getStructuralTokenType(char);
                this.addToken(tokenType, char, startPos);
                this.advancePosition(char);
                i++;
            }
            // String literals
            else if (char === '"') {
                try {
                    const { stringValue, consumed } = this.consumeString(jsonString, i);
                    this.addToken('STRING', stringValue, startPos);
                    i += consumed;
                } catch (e) {
                    this.addToken('INVALID', char, startPos, e.message);
                    i++;
                }
            }
            // Numbers
            else if (char.match(/[\d-]/)) {
                try {
                    const { numberValue, consumed } = this.consumeNumber(jsonString, i);
                    this.addToken('NUMBER', numberValue, startPos);
                    i += consumed;
                } catch (e) {
                    this.addToken('INVALID', char, startPos, e.message);
                    i++;
                }
            }
            // Keywords (true, false, null)
            else if (char.match(/[a-zA-Z]/)) {
                const { keyword, consumed } = this.consumeKeyword(jsonString, i);
                if (['true', 'false'].includes(keyword)) {
                    this.addToken('BOOLEAN', keyword, startPos);
                } else if (keyword === 'null') {
                    this.addToken('NULL', keyword, startPos);
                } else {
                    this.addToken('INVALID', keyword, startPos, `Invalid keyword: ${keyword}`);
                }
                i += consumed;
            } else {
                this.addToken('INVALID', char, startPos, `Unexpected character: ${char}`);
                this.advancePosition(char);
                i++;
            }
        }
        
        this.addToken('EOF', '', [this.line, this.column]);
        return this.tokens;
    }
    
    isWhitespace(char) {
        return /\s/.test(char);
    }
    
    consumeWhitespace(text, startIndex) {
        let i = startIndex;
        let whitespace = '';
        
        while (i < text.length && this.isWhitespace(text[i])) {
            whitespace += text[i];
            this.advancePosition(text[i]);
            i++;
        }
        
        return { whitespace, consumed: i - startIndex };
    }
    
    getStructuralTokenType(char) {
        const mapping = {
            '{': 'LEFT_BRACE',
            '}': 'RIGHT_BRACE',
            '[': 'LEFT_BRACKET',
            ']': 'RIGHT_BRACKET',
            ',': 'COMMA',
            ':': 'COLON'
        };
        return mapping[char];
    }
    
    consumeString(text, startIndex) {
        let i = startIndex + 1; // Skip opening quote
        let result = '"';
        
        while (i < text.length) {
            const char = text[i];
            
            if (char === '"') {
                result += char;
                this.advancePosition(char);
                return { stringValue: result, consumed: i - startIndex + 1 };
            } else if (char === '\\') {
                if (i + 1 >= text.length) {
                    throw new JSONSyntaxError("Unterminated string escape");
                }
                
                const escapeChar = text[i + 1];
                if ('"\\/bfnrt'.includes(escapeChar)) {
                    result += char + escapeChar;
                    this.advancePosition(char);
                    this.advancePosition(escapeChar);
                    i += 2;
                } else if (escapeChar === 'u') {
                    // Unicode escape \uXXXX
                    if (i + 5 >= text.length) {
                        throw new JSONSyntaxError("Incomplete unicode escape");
                    }
                    
                    const unicodeSeq = text.slice(i, i + 6); // \uXXXX
                    if (!/^\\u[0-9a-fA-F]{4}$/.test(unicodeSeq)) {
                        throw new JSONSyntaxError("Invalid unicode escape");
                    }
                    
                    result += unicodeSeq;
                    for (let j = 0; j < 6; j++) {
                        this.advancePosition(text[i + j]);
                    }
                    i += 6;
                } else {
                    throw new JSONSyntaxError(`Invalid escape sequence: \\${escapeChar}`);
                }
            } else if (char.charCodeAt(0) < 32) { // Control characters
                throw new JSONSyntaxError(`Unescaped control character in string: ${JSON.stringify(char)}`);
            } else {
                result += char;
                this.advancePosition(char);
                i++;
            }
        }
        
        throw new JSONSyntaxError("Unterminated string");
    }
    
    consumeNumber(text, startIndex) {
        let i = startIndex;
        let numberStr = '';
        
        // Optional negative sign
        if (i < text.length && text[i] === '-') {
            numberStr += text[i];
            i++;
        }
        
        // Integer part
        if (i >= text.length) {
            throw new JSONSyntaxError("Invalid number: missing digits");
        }
        
        if (text[i] === '0') {
            numberStr += text[i];
            i++;
        } else if (text[i].match(/\d/)) {
            while (i < text.length && text[i].match(/\d/)) {
                numberStr += text[i];
                i++;
            }
        } else {
            throw new JSONSyntaxError("Invalid number: expected digit");
        }
        
        // Decimal part
        if (i < text.length && text[i] === '.') {
            numberStr += text[i];
            i++;
            
            if (i >= text.length || !text[i].match(/\d/)) {
                throw new JSONSyntaxError("Invalid number: missing decimal digits");
            }
            
            while (i < text.length && text[i].match(/\d/)) {
                numberStr += text[i];
                i++;
            }
        }
        
        // Exponent part
        if (i < text.length && text[i].toLowerCase() === 'e') {
            numberStr += text[i];
            i++;
            
            if (i < text.length && '+-'.includes(text[i])) {
                numberStr += text[i];
                i++;
            }
            
            if (i >= text.length || !text[i].match(/\d/)) {
                throw new JSONSyntaxError("Invalid number: missing exponent digits");
            }
            
            while (i < text.length && text[i].match(/\d/)) {
                numberStr += text[i];
                i++;
            }
        }
        
        // Update position tracking
        for (const char of numberStr) {
            this.advancePosition(char);
        }
        
        return { numberValue: numberStr, consumed: i - startIndex };
    }
    
    consumeKeyword(text, startIndex) {
        let i = startIndex;
        let keyword = '';
        
        while (i < text.length && text[i].match(/[a-zA-Z]/)) {
            keyword += text[i];
            this.advancePosition(text[i]);
            i++;
        }
        
        return { keyword, consumed: i - startIndex };
    }
    
    addToken(tokenType, value, position, error = null) {
        const token = {
            type: tokenType,
            value: value,
            line: position[0],
            column: position[1],
            error: error
        };
        this.tokens.push(token);
    }
    
    advancePosition(char) {
        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
    }
}

/**
 * JSON Parser - Parses tokens into JSON structure and validates syntax
 */
export class JSONParser {
    constructor() {
        this.tokens = [];
        this.current = 0;
        this.errors = [];
    }
    
    parse(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.errors = [];
        
        try {
            // Skip leading whitespace
            this.skipWhitespace();
            
            if (this.isAtEnd()) {
                throw new JSONSyntaxError("Empty JSON document");
            }
            
            const value = this.parseValue();
            
            // Skip trailing whitespace
            this.skipWhitespace();
            
            // Ensure we've consumed all tokens
            if (!this.isAtEnd() && this.peek().type !== 'EOF') {
                throw new JSONSyntaxError(`Unexpected token after JSON value: ${this.peek().value}`);
            }
            
            return {
                success: true,
                value: value,
                errors: this.errors
            };
        } catch (e) {
            const currentToken = this.isAtEnd() ? this.previous() : this.peek();
            this.errors.push({
                message: e.message,
                line: currentToken.line,
                column: currentToken.column,
                token: currentToken.value
            });
            
            return {
                success: false,
                value: null,
                errors: this.errors
            };
        }
    }
    
    parseValue() {
        this.skipWhitespace();
        
        if (this.isAtEnd()) {
            throw new JSONSyntaxError("Unexpected end of input");
        }
        
        const token = this.peek();
        
        switch (token.type) {
            case 'STRING':
                return this.parseString();
            case 'NUMBER':
                return this.parseNumber();
            case 'BOOLEAN':
                return this.parseBoolean();
            case 'NULL':
                return this.parseNull();
            case 'LEFT_BRACE':
                return this.parseObject();
            case 'LEFT_BRACKET':
                return this.parseArray();
            default:
                throw new JSONSyntaxError(`Unexpected token: ${token.value}`);
        }
    }
    
    parseObject() {
        this.advance(); // consume '{'
        const obj = {};
        
        this.skipWhitespace();
        
        // Empty object
        if (this.check('RIGHT_BRACE')) {
            this.advance();
            return obj;
        }
        
        // Parse key-value pairs
        while (true) {
            this.skipWhitespace();
            
            // Parse key
            if (!this.check('STRING')) {
                throw new JSONSyntaxError("Expected string key in object");
            }
            
            const keyToken = this.advance();
            const key = this.parseStringValue(keyToken.value);
            
            this.skipWhitespace();
            
            // Expect colon
            if (!this.check('COLON')) {
                throw new JSONSyntaxError("Expected ':' after object key");
            }
            
            this.advance(); // consume ':'
            
            // Parse value
            const value = this.parseValue();
            obj[key] = value;
            
            this.skipWhitespace();
            
            // Check for comma or end
            if (this.check('RIGHT_BRACE')) {
                break;
            } else if (this.check('COMMA')) {
                this.advance(); // consume ','
                this.skipWhitespace();
                
                // Check for trailing comma
                if (this.check('RIGHT_BRACE')) {
                    throw new JSONSyntaxError("Trailing comma in object");
                }
            } else {
                throw new JSONSyntaxError("Expected ',' or '}' in object");
            }
        }
        
        if (!this.check('RIGHT_BRACE')) {
            throw new JSONSyntaxError("Expected '}' to close object");
        }
        
        this.advance(); // consume '}'
        return obj;
    }
    
    parseArray() {
        this.advance(); // consume '['
        const arr = [];
        
        this.skipWhitespace();
        
        // Empty array
        if (this.check('RIGHT_BRACKET')) {
            this.advance();
            return arr;
        }
        
        // Parse array elements
        while (true) {
            const value = this.parseValue();
            arr.push(value);
            
            this.skipWhitespace();
            
            // Check for comma or end
            if (this.check('RIGHT_BRACKET')) {
                break;
            } else if (this.check('COMMA')) {
                this.advance(); // consume ','
                this.skipWhitespace();
                
                // Check for trailing comma
                if (this.check('RIGHT_BRACKET')) {
                    throw new JSONSyntaxError("Trailing comma in array");
                }
            } else {
                throw new JSONSyntaxError("Expected ',' or ']' in array");
            }
        }
        
        if (!this.check('RIGHT_BRACKET')) {
            throw new JSONSyntaxError("Expected ']' to close array");
        }
        
        this.advance(); // consume ']'
        return arr;
    }
    
    parseString() {
        const token = this.advance();
        return this.parseStringValue(token.value);
    }
    
    parseStringValue(stringToken) {
        // Remove quotes and unescape
        const content = stringToken.slice(1, -1);
        return this.unescapeString(content);
    }
    
    unescapeString(s) {
        return s.replace(/\\(.)/g, (match, char) => {
            switch (char) {
                case '"': return '"';
                case '\\': return '\\';
                case '/': return '/';
                case 'b': return '\b';
                case 'f': return '\f';
                case 'n': return '\n';
                case 'r': return '\r';
                case 't': return '\t';
                default: return match;
            }
        });
    }
    
    parseNumber() {
        const token = this.advance();
        const num = parseFloat(token.value);
        if (isNaN(num)) {
            throw new JSONSyntaxError(`Invalid number: ${token.value}`);
        }
        return num;
    }
    
    parseBoolean() {
        const token = this.advance();
        return token.value === 'true';
    }
    
    parseNull() {
        this.advance();
        return null;
    }
    
    skipWhitespace() {
        while (!this.isAtEnd() && this.peek().type === 'WHITESPACE') {
            this.advance();
        }
    }
    
    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }
    
    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }
    
    isAtEnd() {
        return this.peek().type === 'EOF';
    }
    
    peek() {
        return this.tokens[this.current];
    }
    
    previous() {
        return this.tokens[this.current - 1];
    }
}

/**
 * JSON Formatter - Formats JSON with proper indentation and spacing
 */
export class JSONFormatter {
    constructor() {
        this.indentSize = 2;
        this.useTabs = false;
        this.maxLineLength = 80;
        this.sortKeys = false;
        this.ensureAscii = false;
    }
    
    applyOptions(options) {
        this.indentSize = options.indent_size || this.indentSize;
        this.useTabs = options.use_tabs || this.useTabs;
        this.maxLineLength = options.max_line_length || this.maxLineLength;
        this.sortKeys = options.sort_keys || this.sortKeys;
        this.ensureAscii = options.ensure_ascii || this.ensureAscii;
    }
    
    format(jsonData, options = {}) {
        this.applyOptions(options);
        
        if (typeof jsonData === 'string') {
            // Parse string to ensure valid JSON
            const tokenizer = new JSONTokenizer();
            const parser = new JSONParser();
            
            const tokens = tokenizer.tokenize(jsonData);
            const parseResult = parser.parse(tokens);
            
            if (!parseResult.success) {
                return {
                    success: false,
                    formatted: null,
                    errors: parseResult.errors
                };
            }
            
            jsonData = parseResult.value;
        }
        
        try {
            const formattedJson = this.formatValue(jsonData, 0);
            return {
                success: true,
                formatted: formattedJson.trim(),
                errors: []
            };
        } catch (e) {
            return {
                success: false,
                formatted: null,
                errors: [{ message: e.message }]
            };
        }
    }
    
    formatValue(value, indentLevel) {
        if (value === null) {
            return "null";
        } else if (typeof value === 'boolean') {
            return value ? "true" : "false";
        } else if (typeof value === 'number') {
            return String(value);
        } else if (typeof value === 'string') {
            return this.formatString(value);
        } else if (Array.isArray(value)) {
            return this.formatArray(value, indentLevel);
        } else if (typeof value === 'object') {
            return this.formatObject(value, indentLevel);
        } else {
            throw new Error(`Unsupported JSON type: ${typeof value}`);
        }
    }
    
    formatObject(obj, indentLevel) {
        if (Object.keys(obj).length === 0) {
            return "{}";
        }
        
        const indent = this.getIndent(indentLevel);
        const innerIndent = this.getIndent(indentLevel + 1);
        
        // Sort keys if requested
        const keys = this.sortKeys ? Object.keys(obj).sort() : Object.keys(obj);
        
        // Check if object should be on one line (for small objects)
        if (this.shouldInlineObject(obj)) {
            const items = keys.map(key => {
                const keyStr = this.formatString(key);
                const valueStr = this.formatValue(obj[key], indentLevel + 1);
                return `${keyStr}: ${valueStr}`;
            });
            return `{ ${items.join(', ')} }`;
        }
        
        // Multi-line format
        const lines = ["{"];
        
        keys.forEach((key, i) => {
            const keyStr = this.formatString(key);
            const valueStr = this.formatValue(obj[key], indentLevel + 1);
            const comma = i < keys.length - 1 ? "," : "";
            lines.push(`${innerIndent}${keyStr}: ${valueStr}${comma}`);
        });
        
        lines.push(`${indent}}`);
        return lines.join('\n');
    }
    
    formatArray(arr, indentLevel) {
        if (arr.length === 0) {
            return "[]";
        }
        
        const indent = this.getIndent(indentLevel);
        const innerIndent = this.getIndent(indentLevel + 1);
        
        // Check if array should be on one line (for small arrays)
        if (this.shouldInlineArray(arr)) {
            const items = arr.map(item => this.formatValue(item, indentLevel + 1));
            return `[ ${items.join(', ')} ]`;
        }
        
        // Multi-line format
        const lines = ["["];
        
        arr.forEach((item, i) => {
            const valueStr = this.formatValue(item, indentLevel + 1);
            const comma = i < arr.length - 1 ? "," : "";
            lines.push(`${innerIndent}${valueStr}${comma}`);
        });
        
        lines.push(`${indent}]`);
        return lines.join('\n');
    }
    
    formatString(s) {
        // Escape special characters
        let escaped = s.replace(/\\/g, '\\\\')
                      .replace(/"/g, '\\"')
                      .replace(/\u0008/g, '\\b')  // Backspace character
                      .replace(/\f/g, '\\f')
                      .replace(/\n/g, '\\n')
                      .replace(/\r/g, '\\r')
                      .replace(/\t/g, '\\t');
        
        // Handle Unicode characters if ensure_ascii is True
        if (this.ensureAscii) {
            let result = "";
            for (const char of escaped) {
                if (char.charCodeAt(0) > 127) {
                    result += `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
                } else {
                    result += char;
                }
            }
            escaped = result;
        }
        
        return `"${escaped}"`;
    }
    
    shouldInlineObject(obj) {
        if (Object.keys(obj).length > 3) {
            return false;
        }
        
        // Calculate approximate line length
        let estimatedLength = 4; // "{ }"
        for (const [key, value] of Object.entries(obj)) {
            estimatedLength += String(key).length + 2 + String(value).length + 4; // quotes around key, colon with spaces, comma with space
        }
        
        return estimatedLength <= this.maxLineLength;
    }
    
    shouldInlineArray(arr) {
        if (arr.length > 5) {
            return false;
        }
        
        // Only inline arrays of primitives
        if (arr.some(item => typeof item === 'object' && item !== null)) {
            return false;
        }
        
        // Calculate approximate line length
        let estimatedLength = 4; // "[ ]"
        for (const item of arr) {
            estimatedLength += String(item).length + 2; // item + comma
        }
        
        return estimatedLength <= this.maxLineLength;
    }
    
    getIndent(level) {
        if (this.useTabs) {
            return '\t'.repeat(level);
        } else {
            return ' '.repeat(this.indentSize * level);
        }
    }
}

/**
 * JSON Minifier - Removes unnecessary whitespace from JSON
 */
export class JSONMinifier {
    minify(jsonData) {
        let originalString = null;
        
        if (typeof jsonData === 'string') {
            originalString = jsonData;
            // Parse to validate, then re-serialize compactly
            const tokenizer = new JSONTokenizer();
            const parser = new JSONParser();
            
            const tokens = tokenizer.tokenize(jsonData);
            const parseResult = parser.parse(tokens);
            
            if (!parseResult.success) {
                return {
                    success: false,
                    minified: null,
                    errors: parseResult.errors
                };
            }
            
            jsonData = parseResult.value;
        } else {
            originalString = JSON.stringify(jsonData);
        }
        
        try {
            const minified = this.minifyValue(jsonData);
            return {
                success: true,
                minified: minified,
                errors: [],
                compression_ratio: this.calculateCompressionRatio(originalString, minified)
            };
        } catch (e) {
            return {
                success: false,
                minified: null,
                errors: [{ message: e.message }]
            };
        }
    }
    
    minifyValue(value) {
        if (value === null) {
            return "null";
        } else if (typeof value === 'boolean') {
            return value ? "true" : "false";
        } else if (typeof value === 'number') {
            return String(value);
        } else if (typeof value === 'string') {
            return this.escapeString(value);
        } else if (Array.isArray(value)) {
            const items = value.map(item => this.minifyValue(item));
            return "[" + items.join(",") + "]";
        } else if (typeof value === 'object') {
            const items = [];
            for (const [key, val] of Object.entries(value)) {
                const keyStr = this.escapeString(key);
                const valStr = this.minifyValue(val);
                items.push(`${keyStr}:${valStr}`);
            }
            return "{" + items.join(",") + "}";
        }
    }
    
    escapeString(s) {
        const escaped = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        // Only escape control characters that are required
        return `"${escaped.replace(/\u0008/g, '\\b').replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`;
    }
    
    calculateCompressionRatio(original, minified) {
        if (!original) return 0;
        return Math.round((1 - minified.length / original.length) * 100 * 100) / 100;
    }
}

/**
 * JSON Syntax Highlighter - Generates HTML with syntax highlighting
 */
export class JSONSyntaxHighlighter {
    constructor() {
        this.colors = {
            'key': '#dc143c',           // Red for object keys
            'string': '#008000',        // Green for string values  
            'number': '#ff8c00',        // Orange for numbers
            'boolean': '#0000ff',       // Blue for true/false
            'null': '#800080',          // Purple for null
            'brace': '#000000',         // Black for {}
            'bracket': '#000000',       // Black for []
            'comma': '#000000',         // Black for commas
            'colon': '#000000'          // Black for colons
        };
    }
    
    highlightHtml(jsonString) {
        const tokenizer = new JSONTokenizer();
        const tokens = tokenizer.tokenize(jsonString);
        
        const htmlParts = [];
        
        for (const token of tokens) {
            if (token.type === 'WHITESPACE') {
                htmlParts.push(token.value);
            } else if (token.type === 'EOF') {
                break;
            } else {
                const cssClass = this.getCssClass(token);
                const color = this.colors[cssClass] || '#000000';
                const escapedValue = this.htmlEscape(token.value);
                htmlParts.push(`<span class="${cssClass}" style="color: ${color};">${escapedValue}</span>`);
            }
        }
        
        return htmlParts.join('');
    }
    
    getCssClass(token) {
        const typeMapping = {
            'STRING': 'string',
            'NUMBER': 'number',
            'BOOLEAN': 'boolean',
            'NULL': 'null',
            'LEFT_BRACE': 'brace',
            'RIGHT_BRACE': 'brace',
            'LEFT_BRACKET': 'bracket',
            'RIGHT_BRACKET': 'bracket',
            'COMMA': 'comma',
            'COLON': 'colon'
        };
        return typeMapping[token.type] || 'default';
    }
    
    htmlEscape(text) {
        return text.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');
    }
}

/**
 * Main JSON Processor Interface
 */
export class AdvancedJSONProcessor {
    constructor() {
        this.formatter = new JSONFormatter();
        this.minifier = new JSONMinifier();
        this.highlighter = new JSONSyntaxHighlighter();
        this.tokenizer = new JSONTokenizer();
        this.parser = new JSONParser();
    }
    
    processJson(inputData, operation = "format", options = {}) {
        const result = {
            operation: operation,
            success: false,
            output: null,
            errors: [],
            metadata: {}
        };
        
        try {
            switch (operation) {
                case "format":
                case "beautify":
                    const formatResult = this.formatter.format(inputData, options);
                    result.success = formatResult.success;
                    result.output = formatResult.formatted;
                    result.errors = formatResult.errors;
                    break;
                    
                case "minify":
                case "compress":
                    const minifyResult = this.minifier.minify(inputData);
                    result.success = minifyResult.success;
                    result.output = minifyResult.minified;
                    result.errors = minifyResult.errors;
                    result.metadata.compression_ratio = minifyResult.compression_ratio;
                    break;
                    
                case "validate":
                    const tokens = this.tokenizer.tokenize(inputData);
                    const parseResult = this.parser.parse(tokens);
                    result.success = parseResult.success;
                    result.errors = parseResult.errors;
                    result.metadata.token_count = tokens.filter(t => t.type !== 'WHITESPACE').length;
                    break;
                    
                case "highlight":
                    const highlightedHtml = this.highlighter.highlightHtml(inputData);
                    result.success = true;
                    result.output = highlightedHtml;
                    break;
                    
                default:
                    result.errors = [{ message: `Unknown operation: ${operation}` }];
            }
        } catch (e) {
            result.errors = [{ message: `Processing error: ${e.message}` }];
        }
        
        return result;
    }
    
    batchProcess(files, operation = "format", options = {}) {
        const results = {};
        
        for (const [filename, content] of Object.entries(files)) {
            try {
                results[filename] = this.processJson(content, operation, options);
            } catch (e) {
                results[filename] = {
                    success: false,
                    errors: [{ message: e.message }]
                };
            }
        }
        
        return results;
    }
}

/**
 * Utility functions for JSON processing
 */
export class JSONUtils {
    static validateJsonString(jsonString) {
        const tokenizer = new JSONTokenizer();
        const parser = new JSONParser();
        
        try {
            const tokens = tokenizer.tokenize(jsonString);
            const result = parser.parse(tokens);
            return result;
        } catch (e) {
            return {
                success: false,
                errors: [{ message: e.message }]
            };
        }
    }
    
    static getJsonStats(jsonString) {
        const tokenizer = new JSONTokenizer();
        const tokens = tokenizer.tokenize(jsonString);
        
        const stats = {
            total_tokens: tokens.length,
            structural_tokens: tokens.filter(t => t.value && '{}[],:'.includes(t.value)).length,
            string_tokens: tokens.filter(t => t.type === 'STRING').length,
            number_tokens: tokens.filter(t => t.type === 'NUMBER').length,
            boolean_tokens: tokens.filter(t => t.type === 'BOOLEAN').length,
            null_tokens: tokens.filter(t => t.type === 'NULL').length,
            whitespace_tokens: tokens.filter(t => t.type === 'WHITESPACE').length,
            invalid_tokens: tokens.filter(t => t.type === 'INVALID').length
        };
        
        return stats;
    }
    
    static formatJsonWithOptions(jsonString, options = {}) {
        const processor = new AdvancedJSONProcessor();
        return processor.processJson(jsonString, "format", options);
    }
    
    static minifyJson(jsonString) {
        const processor = new AdvancedJSONProcessor();
        return processor.processJson(jsonString, "minify");
    }
    
    static highlightJson(jsonString) {
        const processor = new AdvancedJSONProcessor();
        return processor.processJson(jsonString, "highlight");
    }
}
