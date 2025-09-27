/**
 * Tokenizer.js - Converts input string into a stream of tokens
 * 
 * This module handles the lexical analysis of mathematical expressions,
 * converting strings into structured tokens for parsing.
 */

class Tokenizer {
    constructor(operatorTable) {
        this.operatorTable = operatorTable;
        this.input = '';
        this.position = 0;
        this.tokens = [];
    }

    /**
     * Token types enumeration
     */
    static get TOKEN_TYPES() {
        return {
            NUMBER: 'NUMBER',
            IDENTIFIER: 'IDENTIFIER',
            OPERATOR: 'OPERATOR',
            LEFT_PAREN: 'LEFT_PAREN',
            RIGHT_PAREN: 'RIGHT_PAREN',
            COMMA: 'COMMA',
            FUNCTION: 'FUNCTION',
            CONSTANT: 'CONSTANT',
            EOF: 'EOF'
        };
    }

    /**
     * Token class representing a single token
     */
    static Token(type, value, position = 0) {
        return {
            type: type,
            value: value,
            position: position,
            toString: function() {
                return `${this.type}(${this.value})`;
            }
        };
    }

    /**
     * Tokenize the input string
     * @param {string} input - Input expression string
     * @returns {Array} Array of tokens
     */
    tokenize(input) {
        this.input = input.trim();
        this.position = 0;
        this.tokens = [];

        while (this.position < this.input.length) {
            this.skipWhitespace();
            
            if (this.position >= this.input.length) break;

            const char = this.input[this.position];
            
            if (this.isDigit(char) || char === '.') {
                this.tokens.push(this.readNumber());
            } else if (this.isLetter(char) || char === '_') {
                this.tokens.push(this.readIdentifier());
            } else if (char === '(') {
                this.tokens.push(Tokenizer.Token(Tokenizer.TOKEN_TYPES.LEFT_PAREN, '(', this.position));
                this.position++;
            } else if (char === ')') {
                this.tokens.push(Tokenizer.Token(Tokenizer.TOKEN_TYPES.RIGHT_PAREN, ')', this.position));
                this.position++;
            } else if (char === ',') {
                this.tokens.push(Tokenizer.Token(Tokenizer.TOKEN_TYPES.COMMA, ',', this.position));
                this.position++;
            } else if (this.isOperator(char)) {
                this.tokens.push(this.readOperator());
            } else {
                throw new Error(`Unexpected character '${char}' at position ${this.position}`);
            }
        }

        this.tokens.push(Tokenizer.Token(Tokenizer.TOKEN_TYPES.EOF, '', this.position));
        return this.tokens;
    }

    /**
     * Skip whitespace characters
     */
    skipWhitespace() {
        while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
            this.position++;
        }
    }

    /**
     * Read a number token (integer or decimal)
     * @returns {Object} Number token
     */
    readNumber() {
        const start = this.position;
        let value = '';

        // Handle negative numbers at the start
        if (this.input[this.position] === '-' && this.isUnaryContext()) {
            value += this.input[this.position++];
        }

        // Read integer part
        while (this.position < this.input.length && this.isDigit(this.input[this.position])) {
            value += this.input[this.position++];
        }

        // Read decimal part
        if (this.position < this.input.length && this.input[this.position] === '.') {
            value += this.input[this.position++];
            while (this.position < this.input.length && this.isDigit(this.input[this.position])) {
                value += this.input[this.position++];
            }
        }

        // Handle scientific notation
        if (this.position < this.input.length && 
            (this.input[this.position] === 'e' || this.input[this.position] === 'E')) {
            value += this.input[this.position++];
            
            if (this.position < this.input.length && 
                (this.input[this.position] === '+' || this.input[this.position] === '-')) {
                value += this.input[this.position++];
            }
            
            while (this.position < this.input.length && this.isDigit(this.input[this.position])) {
                value += this.input[this.position++];
            }
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            throw new Error(`Invalid number '${value}' at position ${start}`);
        }

        return Tokenizer.Token(Tokenizer.TOKEN_TYPES.NUMBER, numValue, start);
    }

    /**
     * Read an identifier token (variable or function name)
     * @returns {Object} Identifier token
     */
    readIdentifier() {
        const start = this.position;
        let value = '';

        // First character must be letter or underscore
        if (this.isLetter(this.input[this.position]) || this.input[this.position] === '_') {
            value += this.input[this.position++];
        }

        // Subsequent characters can be letters, digits, or underscores
        while (this.position < this.input.length && 
               (this.isLetter(this.input[this.position]) || 
                this.isDigit(this.input[this.position]) || 
                this.input[this.position] === '_')) {
            value += this.input[this.position++];
        }

        // Determine if it's a function, constant, or variable
        let tokenType = Tokenizer.TOKEN_TYPES.IDENTIFIER;
        
        if (this.operatorTable.isFunction(value)) {
            tokenType = Tokenizer.TOKEN_TYPES.FUNCTION;
        } else if (this.operatorTable.isConstant(value)) {
            tokenType = Tokenizer.TOKEN_TYPES.CONSTANT;
        }

        return Tokenizer.Token(tokenType, value, start);
    }

    /**
     * Read an operator token
     * @returns {Object} Operator token
     */
    readOperator() {
        const start = this.position;
        let value = '';

        // Try to match multi-character operators first
        const remaining = this.input.substring(this.position);
        
        // Check for multi-character operators
        const multiCharOps = ['**', '<=', '>=', '==', '!=', '&&', '||'];
        for (const op of multiCharOps) {
            if (remaining.startsWith(op) && this.operatorTable.isOperator(op)) {
                value = op;
                this.position += op.length;
                return Tokenizer.Token(Tokenizer.TOKEN_TYPES.OPERATOR, value, start);
            }
        }

        // Single character operator
        const char = this.input[this.position];
        if (this.operatorTable.isOperator(char)) {
            value = char;
            this.position++;
        } else {
            throw new Error(`Unknown operator '${char}' at position ${start}`);
        }

        return Tokenizer.Token(Tokenizer.TOKEN_TYPES.OPERATOR, value, start);
    }

    /**
     * Check if character is a digit
     * @param {string} char - Character to check
     * @returns {boolean} True if digit
     */
    isDigit(char) {
        return /[0-9]/.test(char);
    }

    /**
     * Check if character is a letter
     * @param {string} char - Character to check
     * @returns {boolean} True if letter
     */
    isLetter(char) {
        return /[a-zA-Z]/.test(char);
    }

    /**
     * Check if character is an operator
     * @param {string} char - Character to check
     * @returns {boolean} True if operator
     */
    isOperator(char) {
        return this.operatorTable.isOperator(char);
    }

    /**
     * Check if we're in a unary operator context
     * @returns {boolean} True if unary context
     */
    isUnaryContext() {
        // Unary if at start of expression, after left paren, or after operator
        if (this.position === 0) return true;
        
        const prevChar = this.input[this.position - 1];
        return prevChar === '(' || prevChar === ',' || this.operatorTable.isOperator(prevChar);
    }

    /**
     * Get current character without advancing position
     * @returns {string} Current character
     */
    peek() {
        if (this.position >= this.input.length) return '';
        return this.input[this.position];
    }

    /**
     * Get next character and advance position
     * @returns {string} Next character
     */
    next() {
        if (this.position >= this.input.length) return '';
        return this.input[this.position++];
    }

    /**
     * Check if we've reached the end of input
     * @returns {boolean} True if at end
     */
    isEOF() {
        return this.position >= this.input.length;
    }

    /**
     * Get a string representation of all tokens
     * @returns {string} Token list as string
     */
    toString() {
        return this.tokens.map(token => token.toString()).join(' ');
    }

    /**
     * Validate token sequence for basic syntax errors
     * @returns {Array} Array of validation errors
     */
    validate() {
        const errors = [];
        const tokens = this.tokens.filter(token => token.type !== Tokenizer.TOKEN_TYPES.EOF);
        
        if (tokens.length === 0) {
            errors.push('Empty expression');
            return errors;
        }

        // Check for balanced parentheses
        let parenCount = 0;
        for (const token of tokens) {
            if (token.type === Tokenizer.TOKEN_TYPES.LEFT_PAREN) {
                parenCount++;
            } else if (token.type === Tokenizer.TOKEN_TYPES.RIGHT_PAREN) {
                parenCount--;
                if (parenCount < 0) {
                    errors.push(`Unmatched right parenthesis at position ${token.position}`);
                }
            }
        }
        
        if (parenCount > 0) {
            errors.push('Unmatched left parenthesis');
        }

        // Check for consecutive operators (except unary)
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            if (current.type === Tokenizer.TOKEN_TYPES.OPERATOR && 
                next.type === Tokenizer.TOKEN_TYPES.OPERATOR) {
                const opInfo = this.operatorTable.getOperator(current.value);
                if (opInfo && opInfo.arity === 'binary') {
                    errors.push(`Consecutive binary operators at position ${current.position}`);
                }
            }
        }

        return errors;
    }
}

// Make available globally
window.Tokenizer = Tokenizer;
