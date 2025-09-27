/**
 * Evaluator.js - RPN (Reverse Polish Notation) evaluator
 * 
 * This module evaluates mathematical expressions in RPN format using a stack-based approach.
 * It handles operators, functions, constants, and provides comprehensive error handling.
 */

class Evaluator {
    constructor(operatorTable) {
        this.operatorTable = operatorTable;
        this.stack = [];
        this.variables = new Map();
        this.history = [];
    }

    /**
     * Evaluate RPN tokens and return the result
     * @param {Array} rpnTokens - Array of tokens in RPN format
     * @returns {number} Evaluation result
     */
    evaluate(rpnTokens) {
        this.stack = [];
        const startTime = performance.now();

        try {
            for (const token of rpnTokens) {
                this.processToken(token);
            }

            if (this.stack.length === 0) {
                throw new Error('Empty expression');
            }

            if (this.stack.length > 1) {
                throw new Error('Too many operands - incomplete expression');
            }

            const result = this.stack[0];
            const endTime = performance.now();
            
            // Add to history
            this.history.push({
                expression: this.tokensToString(rpnTokens),
                result: result,
                timestamp: new Date(),
                executionTime: endTime - startTime
            });

            // Keep only last 100 calculations
            if (this.history.length > 100) {
                this.history.shift();
            }

            return result;

        } catch (error) {
            throw new Error(`Evaluation error: ${error.message}`);
        }
    }

    /**
     * Process a single token
     * @param {Object} token - Token to process
     */
    processToken(token) {
        switch (token.type) {
            case 'NUMBER':
                this.stack.push(token.value);
                break;

            case 'CONSTANT':
                const constantValue = this.operatorTable.getConstant(token.value);
                if (constantValue === null) {
                    throw new Error(`Unknown constant: ${token.value}`);
                }
                this.stack.push(constantValue);
                break;

            case 'OPERATOR':
                this.processOperator(token);
                break;

            case 'UNARY_OPERATOR':
                this.processUnaryOperator(token);
                break;

            case 'FUNCTION':
                this.processFunction(token);
                break;

            default:
                throw new Error(`Unknown token type: ${token.type}`);
        }
    }

    /**
     * Process binary operator
     * @param {Object} token - Operator token
     */
    processOperator(token) {
        const opInfo = this.operatorTable.getOperator(token.value);
        if (!opInfo || opInfo.arity !== 'binary') {
            throw new Error(`Invalid binary operator: ${token.value}`);
        }

        if (this.stack.length < 2) {
            throw new Error(`Insufficient operands for operator ${token.value}`);
        }

        const b = this.stack.pop();
        const a = this.stack.pop();

        try {
            const result = opInfo.evaluate(a, b);
            this.stack.push(result);
        } catch (error) {
            throw new Error(`Error evaluating ${a} ${token.value} ${b}: ${error.message}`);
        }
    }

    /**
     * Process unary operator
     * @param {Object} token - Unary operator token
     */
    processUnaryOperator(token) {
        const opInfo = token.operatorInfo;
        if (!opInfo || opInfo.arity !== 'unary') {
            throw new Error(`Invalid unary operator: ${token.value}`);
        }

        if (this.stack.length < 1) {
            throw new Error(`Insufficient operands for unary operator ${token.value}`);
        }

        const a = this.stack.pop();

        try {
            const result = opInfo.evaluate(a);
            this.stack.push(result);
        } catch (error) {
            throw new Error(`Error evaluating ${token.value}${a}: ${error.message}`);
        }
    }

    /**
     * Process function call
     * @param {Object} token - Function token
     */
    processFunction(token) {
        const funcInfo = this.operatorTable.getFunction(token.value);
        if (!funcInfo) {
            throw new Error(`Unknown function: ${token.value}`);
        }

        let argCount = 0;
        const args = [];

        // For variadic functions, we need to determine how many arguments to pop
        if (funcInfo.arity === 'variadic') {
            // For variadic functions like min/max, we need at least one argument
            // In a real implementation, you might need to track function call boundaries
            // For now, we'll assume the function takes all available operands
            argCount = this.stack.length;
        } else {
            argCount = funcInfo.arity;
        }

        if (this.stack.length < argCount) {
            throw new Error(`Function ${token.value} requires ${argCount} arguments, got ${this.stack.length}`);
        }

        // Pop arguments in reverse order
        for (let i = 0; i < argCount; i++) {
            args.unshift(this.stack.pop());
        }

        try {
            const result = funcInfo.evaluate(...args);
            this.stack.push(result);
        } catch (error) {
            throw new Error(`Error evaluating function ${token.value}(${args.join(', ')}): ${error.message}`);
        }
    }

    /**
     * Set a variable value
     * @param {string} name - Variable name
     * @param {number} value - Variable value
     */
    setVariable(name, value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`Invalid variable value: ${value}`);
        }
        this.variables.set(name, value);
    }

    /**
     * Get a variable value
     * @param {string} name - Variable name
     * @returns {number} Variable value
     */
    getVariable(name) {
        return this.variables.get(name);
    }

    /**
     * Check if a variable exists
     * @param {string} name - Variable name
     * @returns {boolean} True if variable exists
     */
    hasVariable(name) {
        return this.variables.has(name);
    }

    /**
     * Get all variable names
     * @returns {Array} Array of variable names
     */
    getVariableNames() {
        return Array.from(this.variables.keys());
    }

    /**
     * Clear all variables
     */
    clearVariables() {
        this.variables.clear();
    }

    /**
     * Get calculation history
     * @returns {Array} Array of calculation history
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Clear calculation history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Get the last calculation result
     * @returns {Object|null} Last calculation or null
     */
    getLastResult() {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }

    /**
     * Convert tokens to string representation
     * @param {Array} tokens - Array of tokens
     * @returns {string} String representation
     */
    tokensToString(tokens) {
        return tokens.map(token => {
            switch (token.type) {
                case 'NUMBER':
                    return token.value.toString();
                case 'CONSTANT':
                    return token.value;
                case 'OPERATOR':
                case 'UNARY_OPERATOR':
                    return token.value;
                case 'FUNCTION':
                    return token.value + '()';
                default:
                    return token.value;
            }
        }).join(' ');
    }

    /**
     * Validate that the stack is in a valid state
     * @returns {boolean} True if valid
     */
    validateStack() {
        return this.stack.length >= 0;
    }

    /**
     * Get current stack state (for debugging)
     * @returns {Array} Current stack
     */
    getStack() {
        return [...this.stack];
    }

    /**
     * Get detailed evaluation information
     * @returns {Object} Evaluation info
     */
    getEvaluationInfo() {
        return {
            stackSize: this.stack.length,
            variableCount: this.variables.size,
            historySize: this.history.length,
            lastResult: this.getLastResult(),
            variables: Object.fromEntries(this.variables)
        };
    }

    /**
     * Evaluate a simple expression string (convenience method)
     * @param {string} expression - Expression string
     * @returns {number} Result
     */
    evaluateString(expression) {
        // This is a convenience method that would require tokenizer and parser
        // For now, it's a placeholder that shows the intended interface
        throw new Error('evaluateString requires tokenizer and parser - use evaluate() with RPN tokens');
    }

    /**
     * Format result with appropriate precision
     * @param {number} result - Result to format
     * @param {number} precision - Decimal places (default: 10)
     * @returns {string} Formatted result
     */
    formatResult(result, precision = 10) {
        if (typeof result !== 'number' || isNaN(result)) {
            return 'Error';
        }

        if (!isFinite(result)) {
            return result > 0 ? '∞' : '-∞';
        }

        // Use toFixed for consistent decimal places, then remove trailing zeros
        const formatted = result.toFixed(precision);
        return parseFloat(formatted).toString();
    }

    /**
     * Check if result is an integer
     * @param {number} result - Result to check
     * @returns {boolean} True if integer
     */
    isInteger(result) {
        return Number.isInteger(result);
    }

    /**
     * Get result in scientific notation if appropriate
     * @param {number} result - Result to format
     * @param {number} threshold - Threshold for scientific notation (default: 1e6)
     * @returns {string} Formatted result
     */
    toScientificNotation(result, threshold = 1e6) {
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            return result.toString();
        }

        const absResult = Math.abs(result);
        if (absResult >= threshold || (absResult < 1e-6 && absResult > 0)) {
            return result.toExponential(6);
        }

        return result.toString();
    }
}

// Make available globally
window.Evaluator = Evaluator;
