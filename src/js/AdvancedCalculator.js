/**
 * AdvancedCalculator.js - Main calculator class with advanced mathematical capabilities
 * 
 * This is the main class that orchestrates the tokenization, parsing, and evaluation
 * of mathematical expressions. It provides a clean, simple interface while handling
 * complex mathematical operations behind the scenes.
 */

class AdvancedCalculator {
    constructor() {
        try {
            // Initialize core components
            this.operatorTable = new OperatorTable();
            this.tokenizer = new Tokenizer(this.operatorTable);
            this.parser = new Parser(this.operatorTable);
            this.evaluator = new Evaluator(this.operatorTable);
            this.functionRegistry = new FunctionRegistry(this.operatorTable);
            
            // Calculator state
            this.lastResult = null;
            this.lastExpression = '';
            this.isInitialized = true;
            
            // Error handling
            this.errorHandler = null;
            
            console.log('✅ AdvancedCalculator initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize AdvancedCalculator:', error);
            this.isInitialized = false;
            throw error;
        }
    }

    /**
     * Calculate the result of a mathematical expression
     * @param {string} expression - Mathematical expression string
     * @returns {Object} Calculation result with metadata
     */
    calculate(expression) {
        if (!expression || typeof expression !== 'string') {
            throw new Error('Expression must be a non-empty string');
        }

        const startTime = performance.now();
        
        try {
            // Step 1: Tokenize the expression
            const tokens = this.tokenizer.tokenize(expression);
            
            // Step 2: Validate tokens
            const tokenErrors = this.tokenizer.validate();
            if (tokenErrors.length > 0) {
                throw new Error(`Tokenization errors: ${tokenErrors.join(', ')}`);
            }
            
            // Step 3: Parse tokens to RPN
            const rpnTokens = this.parser.parse(tokens);
            
            // Step 4: Validate RPN
            const parseErrors = this.parser.validate();
            if (parseErrors.length > 0) {
                throw new Error(`Parse errors: ${parseErrors.join(', ')}`);
            }
            
            // Step 5: Evaluate RPN
            const result = this.evaluator.evaluate(rpnTokens);
            
            const endTime = performance.now();
            
            // Update state
            this.lastResult = result;
            this.lastExpression = expression;
            
            // Return comprehensive result
            return {
                success: true,
                result: result,
                expression: expression,
                formattedResult: this.formatResult(result),
                scientificNotation: this.evaluator.toScientificNotation(result),
                isInteger: this.evaluator.isInteger(result),
                executionTime: endTime - startTime,
                tokenCount: tokens.length,
                rpnLength: rpnTokens.length,
                parseInfo: this.parser.getParseInfo(),
                evaluationInfo: this.evaluator.getEvaluationInfo()
            };
            
        } catch (error) {
            const endTime = performance.now();
            
            // Handle error
            if (this.errorHandler) {
                this.errorHandler(error, expression);
            }
            
            return {
                success: false,
                error: error.message,
                expression: expression,
                executionTime: endTime - startTime,
                result: null
            };
        }
    }

    /**
     * Format result with appropriate precision
     * @param {number} result - Result to format
     * @param {number} precision - Decimal places
     * @returns {string} Formatted result
     */
    formatResult(result, precision = 10) {
        return this.evaluator.formatResult(result, precision);
    }

    /**
     * Set a variable value
     * @param {string} name - Variable name
     * @param {number} value - Variable value
     */
    setVariable(name, value) {
        this.evaluator.setVariable(name, value);
    }

    /**
     * Get a variable value
     * @param {string} name - Variable name
     * @returns {number} Variable value
     */
    getVariable(name) {
        return this.evaluator.getVariable(name);
    }

    /**
     * Get all variables
     * @returns {Object} All variables
     */
    getVariables() {
        return this.evaluator.getEvaluationInfo().variables;
    }

    /**
     * Clear all variables
     */
    clearVariables() {
        this.evaluator.clearVariables();
    }

    /**
     * Get calculation history
     * @returns {Array} Calculation history
     */
    getHistory() {
        return this.evaluator.getHistory();
    }

    /**
     * Clear calculation history
     */
    clearHistory() {
        this.evaluator.clearHistory();
    }

    /**
     * Get the last calculation result
     * @returns {Object|null} Last result
     */
    getLastResult() {
        return this.evaluator.getLastResult();
    }

    /**
     * Register a user-defined function
     * @param {string} name - Function name
     * @param {number} arity - Number of parameters
     * @param {Function} implementation - Function implementation
     * @param {string} description - Function description
     */
    registerFunction(name, arity, implementation, description = '') {
        this.functionRegistry.registerUserFunction(name, arity, implementation, description);
    }

    /**
     * Get all available functions
     * @returns {Array} All function names
     */
    getFunctions() {
        return this.functionRegistry.getAllFunctions();
    }

    /**
     * Get functions by category
     * @param {string} category - Category name
     * @returns {Array} Functions in category
     */
    getFunctionsByCategory(category) {
        return this.functionRegistry.getFunctionsByCategory(category);
    }

    /**
     * Get function documentation
     * @param {string} name - Function name
     * @returns {Object} Function documentation
     */
    getFunctionDocumentation(name) {
        return this.functionRegistry.getFunctionDocumentation(name);
    }

    /**
     * Search functions
     * @param {string} query - Search query
     * @returns {Array} Matching functions
     */
    searchFunctions(query) {
        return this.functionRegistry.searchFunctions(query);
    }

    /**
     * Get all available operators
     * @returns {Array} All operator symbols
     */
    getOperators() {
        return this.operatorTable.getAllOperators();
    }

    /**
     * Get all available constants
     * @returns {Array} All constant names
     */
    getConstants() {
        return this.operatorTable.getAllConstants();
    }

    /**
     * Set error handler
     * @param {Function} handler - Error handler function
     */
    setErrorHandler(handler) {
        this.errorHandler = handler;
    }

    /**
     * Validate an expression without evaluating it
     * @param {string} expression - Expression to validate
     * @returns {Object} Validation result
     */
    validateExpression(expression) {
        try {
            const tokens = this.tokenizer.tokenize(expression);
            const tokenErrors = this.tokenizer.validate();
            
            if (tokenErrors.length > 0) {
                return {
                    valid: false,
                    errors: tokenErrors,
                    stage: 'tokenization'
                };
            }
            
            const rpnTokens = this.parser.parse(tokens);
            const parseErrors = this.parser.validate();
            
            if (parseErrors.length > 0) {
                return {
                    valid: false,
                    errors: parseErrors,
                    stage: 'parsing'
                };
            }
            
            return {
                valid: true,
                errors: [],
                stage: 'complete',
                tokenCount: tokens.length,
                rpnLength: rpnTokens.length
            };
            
        } catch (error) {
            return {
                valid: false,
                errors: [error.message],
                stage: 'error'
            };
        }
    }

    /**
     * Get calculator statistics
     * @returns {Object} Calculator statistics
     */
    getStatistics() {
        const history = this.getHistory();
        const functions = this.functionRegistry.getStatistics();
        
        return {
            totalCalculations: history.length,
            lastExpression: this.lastExpression,
            lastResult: this.lastResult,
            variablesCount: Object.keys(this.getVariables()).length,
            functions: functions,
            operatorsCount: this.getOperators().length,
            constantsCount: this.getConstants().length,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Reset calculator to initial state
     */
    reset() {
        this.clearVariables();
        this.clearHistory();
        this.lastResult = null;
        this.lastExpression = '';
        console.log('✅ Calculator reset to initial state');
    }

    /**
     * Get help information
     * @returns {Object} Help information
     */
    getHelp() {
        return {
            operators: this.getOperators(),
            functions: this.getFunctions(),
            constants: this.getConstants(),
            examples: [
                '2 + 3 * 4',
                'sin(pi/2)',
                'sqrt(16) + 2^3',
                'max(1, 2, 3, 4)',
                'log(100)',
                'abs(-5)'
            ],
            categories: this.functionRegistry.getCategories()
        };
    }

    /**
     * Export calculator state
     * @returns {Object} Exportable state
     */
    export() {
        return {
            variables: this.getVariables(),
            history: this.getHistory(),
            functions: this.functionRegistry.export(),
            lastResult: this.lastResult,
            lastExpression: this.lastExpression
        };
    }

    /**
     * Import calculator state
     * @param {Object} state - State to import
     */
    import(state) {
        if (state.variables) {
            for (const [name, value] of Object.entries(state.variables)) {
                this.setVariable(name, value);
            }
        }
        
        if (state.functions) {
            this.functionRegistry.import(state.functions);
        }
        
        if (state.lastResult !== undefined) {
            this.lastResult = state.lastResult;
        }
        
        if (state.lastExpression) {
            this.lastExpression = state.lastExpression;
        }
        
        console.log('✅ Calculator state imported successfully');
    }

    /**
     * Get detailed information about the calculator
     * @returns {Object} Detailed information
     */
    getInfo() {
        return {
            name: 'AdvancedCalculator',
            version: '1.0.0',
            description: 'Advanced mathematical calculator with support for complex expressions',
            features: [
                'Infix expression parsing',
                'RPN evaluation',
                'Mathematical functions',
                'Variables support',
                'History tracking',
                'Error handling',
                'User-defined functions'
            ],
            statistics: this.getStatistics(),
            help: this.getHelp()
        };
    }
}

// Make available globally
window.AdvancedCalculator = AdvancedCalculator;
