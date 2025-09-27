/**
 * Parser.js - Shunting Yard algorithm for converting infix to RPN
 * 
 * This module implements the Shunting Yard algorithm to convert infix mathematical
 * expressions into Reverse Polish Notation (RPN) for evaluation.
 */

class Parser {
    constructor(operatorTable) {
        this.operatorTable = operatorTable;
        this.tokens = [];
        this.position = 0;
        this.outputQueue = [];
        this.operatorStack = [];
    }

    /**
     * Parse tokens into RPN using Shunting Yard algorithm
     * @param {Array} tokens - Array of tokens from tokenizer
     * @returns {Array} RPN token array
     */
    parse(tokens) {
        this.tokens = tokens.filter(token => token.type !== 'EOF');
        this.position = 0;
        this.outputQueue = [];
        this.operatorStack = [];

        while (this.position < this.tokens.length) {
            const token = this.tokens[this.position];
            
            switch (token.type) {
                case 'NUMBER':
                case 'CONSTANT':
                    this.outputQueue.push(token);
                    break;
                    
                case 'FUNCTION':
                    this.operatorStack.push(token);
                    break;
                    
                case 'COMMA':
                    this.handleComma();
                    break;
                    
                case 'OPERATOR':
                    this.handleOperator(token);
                    break;
                    
                case 'LEFT_PAREN':
                    this.operatorStack.push(token);
                    break;
                    
                case 'RIGHT_PAREN':
                    this.handleRightParen();
                    break;
                    
                default:
                    throw new Error(`Unexpected token type: ${token.type}`);
            }
            
            this.position++;
        }

        // Pop remaining operators
        while (this.operatorStack.length > 0) {
            const op = this.operatorStack.pop();
            if (op.type === 'LEFT_PAREN') {
                throw new Error('Mismatched parentheses');
            }
            this.outputQueue.push(op);
        }

        return this.outputQueue;
    }

    /**
     * Handle operator tokens
     * @param {Object} token - Operator token
     */
    handleOperator(token) {
        // Check context first to determine if this should be unary or binary
        if (this.isUnaryContext(token)) {
            // This is a unary operator
            const unaryKey = `unary${token.value}`;
            const unaryOpInfo = this.operatorTable.getOperator(unaryKey);
            if (unaryOpInfo) {
                this.handleUnaryOperator(token, unaryOpInfo);
            } else {
                throw new Error(`Unknown unary operator: ${token.value}`);
            }
        } else {
            // This is a binary operator
            const opInfo = this.operatorTable.getOperator(token.value);
            if (!opInfo) {
                throw new Error(`Unknown operator: ${token.value}`);
            }
            this.handleBinaryOperator(token, opInfo);
        }
    }

    /**
     * Handle unary operators
     * @param {Object} token - Operator token
     * @param {Object} opInfo - Operator information
     */
    handleUnaryOperator(token, opInfo) {
        // Create a special unary operator token with the correct key
        const unaryKey = `unary${token.value}`;
        const unaryOpInfo = this.operatorTable.getOperator(unaryKey);
        
        const unaryToken = {
            type: 'UNARY_OPERATOR',
            value: unaryKey,
            position: token.position,
            operatorInfo: unaryOpInfo || opInfo
        };
        
        this.operatorStack.push(unaryToken);
    }

    /**
     * Handle binary operators
     * @param {Object} token - Operator token
     * @param {Object} opInfo - Operator information
     */
    handleBinaryOperator(token, opInfo) {
        while (this.operatorStack.length > 0) {
            const top = this.operatorStack[this.operatorStack.length - 1];
            
            // Stop if top is not an operator
            if (top.type !== 'OPERATOR' && top.type !== 'UNARY_OPERATOR') {
                break;
            }
            
            const topOpInfo = top.operatorInfo || this.operatorTable.getOperator(top.value);
            if (!topOpInfo) break;
            
            // Check precedence and associativity
            if ((opInfo.associativity === 'left' && opInfo.precedence <= topOpInfo.precedence) ||
                (opInfo.associativity === 'right' && opInfo.precedence < topOpInfo.precedence)) {
                this.outputQueue.push(this.operatorStack.pop());
            } else {
                break;
            }
        }
        
        this.operatorStack.push(token);
    }

    /**
     * Handle comma tokens (function argument separators)
     */
    handleComma() {
        // Pop operators until we find a left parenthesis
        while (this.operatorStack.length > 0) {
            const top = this.operatorStack[this.operatorStack.length - 1];
            if (top.type === 'LEFT_PAREN') {
                break;
            }
            this.outputQueue.push(this.operatorStack.pop());
        }
        
        if (this.operatorStack.length === 0) {
            throw new Error('Comma outside function call');
        }
    }

    /**
     * Handle right parenthesis tokens
     */
    handleRightParen() {
        // Pop operators until we find a left parenthesis
        while (this.operatorStack.length > 0) {
            const top = this.operatorStack.pop();
            if (top.type === 'LEFT_PAREN') {
                // Check if there's a function on the stack
                if (this.operatorStack.length > 0 && 
                    this.operatorStack[this.operatorStack.length - 1].type === 'FUNCTION') {
                    this.outputQueue.push(this.operatorStack.pop());
                }
                return;
            }
            this.outputQueue.push(top);
        }
        
        throw new Error('Mismatched parentheses');
    }

    /**
     * Check if operator is in unary context
     * @param {Object} token - Operator token
     * @returns {boolean} True if unary context
     */
    isUnaryContext(token) {
        // Unary if at start of expression
        if (this.position === 0) return true;
        
        // Unary if previous token is operator, left paren, or comma
        const prevToken = this.tokens[this.position - 1];
        return prevToken.type === 'OPERATOR' || 
               prevToken.type === 'LEFT_PAREN' || 
               prevToken.type === 'COMMA';
    }

    /**
     * Get current token without advancing position
     * @returns {Object} Current token
     */
    peek() {
        if (this.position >= this.tokens.length) return null;
        return this.tokens[this.position];
    }

    /**
     * Get next token and advance position
     * @returns {Object} Next token
     */
    next() {
        if (this.position >= this.tokens.length) return null;
        return this.tokens[this.position++];
    }

    /**
     * Check if we've reached the end of tokens
     * @returns {boolean} True if at end
     */
    isEOF() {
        return this.position >= this.tokens.length;
    }

    /**
     * Get a string representation of the RPN
     * @returns {string} RPN as string
     */
    toString() {
        return this.outputQueue.map(token => {
            if (token.type === 'UNARY_OPERATOR') {
                return `UNARY_${token.value}`;
            }
            return token.toString();
        }).join(' ');
    }

    /**
     * Validate the parsed expression
     * @returns {Array} Array of validation errors
     */
    validate() {
        const errors = [];
        
        if (this.outputQueue.length === 0) {
            errors.push('Empty expression');
            return errors;
        }

        // Count operands and operators
        let operandCount = 0;
        let operatorCount = 0;
        let unaryOperatorCount = 0;

        for (const token of this.outputQueue) {
            switch (token.type) {
                case 'NUMBER':
                case 'CONSTANT':
                    operandCount++;
                    break;
                case 'OPERATOR':
                    operatorCount++;
                    break;
                case 'UNARY_OPERATOR':
                    unaryOperatorCount++;
                    break;
                case 'FUNCTION':
                    const funcInfo = this.operatorTable.getFunction(token.value);
                    if (funcInfo) {
                        if (funcInfo.arity === 'variadic') {
                            // For variadic functions, we need at least one argument
                            if (operandCount < 1) {
                                errors.push(`Function ${token.value} requires at least one argument`);
                            }
                        } else {
                            // For fixed arity functions, check exact count
                            if (operandCount < funcInfo.arity) {
                                errors.push(`Function ${token.value} requires ${funcInfo.arity} arguments, got ${operandCount}`);
                            }
                        }
                    }
                    break;
            }
        }

        // For RPN, we just need to ensure we have at least one operand
        // The exact validation will happen during evaluation
        if (operandCount === 0) {
            errors.push('Expression must contain at least one operand');
        }

        return errors;
    }

    /**
     * Get detailed information about the parsed expression
     * @returns {Object} Parse information
     */
    getParseInfo() {
        return {
            tokenCount: this.tokens.length,
            rpnLength: this.outputQueue.length,
            operatorCount: this.outputQueue.filter(t => t.type === 'OPERATOR').length,
            unaryOperatorCount: this.outputQueue.filter(t => t.type === 'UNARY_OPERATOR').length,
            functionCount: this.outputQueue.filter(t => t.type === 'FUNCTION').length,
            operandCount: this.outputQueue.filter(t => t.type === 'NUMBER' || t.type === 'CONSTANT').length,
            rpn: this.toString()
        };
    }
}

// Make available globally
window.Parser = Parser;
