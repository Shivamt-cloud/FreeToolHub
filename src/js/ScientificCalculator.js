/**
 * ScientificCalculator.js - Main scientific calculator class
 * 
 * Integrates all scientific components with the existing parsing pipeline
 */

// Use global variables instead of imports for compatibility
class ScientificCalculator {
    constructor() {
        try {
            console.log('🔬 Initializing ScientificCalculator...');
            
            // Initialize the base AdvancedCalculator functionality
            this.operatorTable = new window.OperatorTable();
            this.tokenizer = new window.Tokenizer(this.operatorTable);
            this.parser = new window.Parser(this.operatorTable);
            this.evaluator = new window.Evaluator(this.operatorTable);
            this.functionRegistry = new window.FunctionRegistry(this.operatorTable);
            
            // Calculator state
            this.lastResult = null;
            this.lastExpression = '';
            this.isInitialized = true;
            this.history = [];
            
            // Initialize scientific components using global variables
            console.log('Creating ScientificModes...');
            this.modes = new window.ScientificModes();
            console.log('Creating ScientificFunctions...');
            this.scientificFunctions = new window.ScientificFunctions(this.modes);
            
            // Extend function registry with scientific functions
            this.extendFunctionRegistry();
            
            // Extend operator table with scientific operators
            this.extendOperatorTable();
            
            console.log('✅ Scientific Calculator initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize ScientificCalculator:', error);
            throw error;
        }
    }

    // Basic calculator methods (inherited from AdvancedCalculator)
    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
    }

    getStatistics() {
        return {
            totalCalculations: this.history.length,
            lastExpression: this.lastExpression,
            lastResult: this.lastResult,
            isInitialized: this.isInitialized
        };
    }

    getHelp() {
        return this.getScientificHelp();
    }

    // Check if calculator is ready
    isReady() {
        return this.isInitialized && this.operatorTable && this.tokenizer && this.parser && this.evaluator && this.functionRegistry;
    }

    // Extend the function registry with scientific functions
    extendFunctionRegistry() {
        // Helper function to register only if not already exists
        const registerIfNotExists = (name, arity, implementation, description) => {
            if (!this.functionRegistry.hasFunction(name)) {
                this.functionRegistry.registerUserFunction(name, arity, implementation, description);
            } else {
                console.log(`Function ${name} already exists, skipping registration`);
            }
        };

        // Trigonometric functions (only register if not already exists)
        registerIfNotExists('sin', 1, (x) => this.scientificFunctions.sin(x), 'Sine function');
        registerIfNotExists('cos', 1, (x) => this.scientificFunctions.cos(x), 'Cosine function');
        registerIfNotExists('tan', 1, (x) => this.scientificFunctions.tan(x), 'Tangent function');
        registerIfNotExists('csc', 1, (x) => this.scientificFunctions.csc(x), 'Cosecant function');
        registerIfNotExists('sec', 1, (x) => this.scientificFunctions.sec(x), 'Secant function');
        registerIfNotExists('cot', 1, (x) => this.scientificFunctions.cot(x), 'Cotangent function');
        registerIfNotExists('asin', 1, (x) => this.scientificFunctions.asin(x), 'Arcsine function');
        registerIfNotExists('acos', 1, (x) => this.scientificFunctions.acos(x), 'Arccosine function');
        registerIfNotExists('atan', 1, (x) => this.scientificFunctions.atan(x), 'Arctangent function');

        // Hyperbolic functions
        registerIfNotExists('sinh', 1, (x) => this.scientificFunctions.sinh(x), 'Hyperbolic sine function');
        registerIfNotExists('cosh', 1, (x) => this.scientificFunctions.cosh(x), 'Hyperbolic cosine function');
        registerIfNotExists('tanh', 1, (x) => this.scientificFunctions.tanh(x), 'Hyperbolic tangent function');
        registerIfNotExists('csch', 1, (x) => this.scientificFunctions.csch(x), 'Hyperbolic cosecant function');
        registerIfNotExists('sech', 1, (x) => this.scientificFunctions.sech(x), 'Hyperbolic secant function');
        registerIfNotExists('coth', 1, (x) => this.scientificFunctions.coth(x), 'Hyperbolic cotangent function');
        registerIfNotExists('asinh', 1, (x) => this.scientificFunctions.asinh(x), 'Inverse hyperbolic sine function');
        registerIfNotExists('acosh', 1, (x) => this.scientificFunctions.acosh(x), 'Inverse hyperbolic cosine function');
        registerIfNotExists('atanh', 1, (x) => this.scientificFunctions.atanh(x), 'Inverse hyperbolic tangent function');

        // Exponential and logarithmic functions
        registerIfNotExists('exp', 1, (x) => this.scientificFunctions.exp(x), 'Exponential function');
        registerIfNotExists('ln', 1, (x) => this.scientificFunctions.ln(x), 'Natural logarithm function');
        registerIfNotExists('log10', 1, (x) => this.scientificFunctions.log10(x), 'Base-10 logarithm function');
        registerIfNotExists('log2', 1, (x) => this.scientificFunctions.log2(x), 'Base-2 logarithm function');
        registerIfNotExists('logb', 2, (x, base) => this.scientificFunctions.logb(x, base), 'Base-b logarithm function');
        registerIfNotExists('pow', 2, (x, y) => this.scientificFunctions.pow(x, y), 'Power function');
        registerIfNotExists('sqrt', 1, (x) => this.scientificFunctions.sqrt(x), 'Square root function');
        registerIfNotExists('cbrt', 1, (x) => this.scientificFunctions.cbrt(x), 'Cube root function');
        registerIfNotExists('nthroot', 2, (x, n) => this.scientificFunctions.nthRoot(x, n), 'Nth root function');

        // Special functions
        registerIfNotExists('factorial', 1, (x) => this.scientificFunctions.factorial(x), 'Factorial function');
        registerIfNotExists('gamma', 1, (x) => this.scientificFunctions.gamma(x), 'Gamma function');
        registerIfNotExists('comb', 2, (n, k) => this.scientificFunctions.combination(n, k), 'Combination function');
        registerIfNotExists('perm', 2, (n, k) => this.scientificFunctions.permutation(n, k), 'Permutation function');

        // Statistical functions
        registerIfNotExists('abs', 1, (x) => Math.abs(x), 'Absolute value function');
        registerIfNotExists('ceil', 1, (x) => Math.ceil(x), 'Ceiling function');
        registerIfNotExists('floor', 1, (x) => Math.floor(x), 'Floor function');
        registerIfNotExists('round', 1, (x) => Math.round(x), 'Round function');
        registerIfNotExists('min', -1, (...args) => Math.min(...args), 'Minimum function');
        registerIfNotExists('max', -1, (...args) => Math.max(...args), 'Maximum function');

        // Constants are already available in OperatorTable
        // No need to register them again
    }

    // Extend operator table with scientific operators
    extendOperatorTable() {
        // Add power operator with higher precedence
        this.operatorTable['^'] = {
            arity: 2,
            precedence: 9,
            associativity: 'right',
            evaluate: (a, b) => this.scientificFunctions.pow(a, b)
        };

        // Add modulo operator
        this.operatorTable['%'] = {
            arity: 2,
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => {
                if (b === 0) {
                    throw new Error('Modulo by zero');
                }
                return a % b;
            }
        };

        // Add integer division operator
        this.operatorTable['//'] = {
            arity: 2,
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => {
                if (b === 0) {
                    throw new Error('Division by zero');
                }
                return Math.floor(a / b);
            }
        };
    }

    // Override calculate method to handle scientific modes
    calculate(expression) {
        try {
            // Parse the expression
            const tokens = Array.from(this.tokenizer.tokenize(expression));
            const rpnTokens = this.parser.parse(tokens);
            
            // Use the standard evaluator (it already handles functions and operators correctly)
            const result = this.evaluator.evaluate(rpnTokens);
            
            // Add to history
            this.history.push({
                expression: expression,
                result: result,
                timestamp: new Date(),
                mode: this.modes.getModeSummary()
            });
            
            return {
                success: true,
                result: result,
                display: this.formatResult(result),
                mode: this.modes.getModeSummary()
            };
            
        } catch (error) {
            console.error('Scientific calculation error:', error);
            return {
                success: false,
                error: error.message,
                mode: this.modes.getModeSummary()
            };
        }
    }

    // Evaluate RPN tokens with scientific modes
    evaluateWithModes(rpnTokens) {
        const stack = [];
        
        for (const token of rpnTokens) {
            if (token.type === 'Number') {
                stack.push(this.parseNumber(token.value));
            } else if (token.type === 'Identifier') {
                // Handle constants and functions
                if (this.operatorTable.isConstant(token.value)) {
                    stack.push(this.operatorTable.getConstant(token.value));
                } else if (this.functionRegistry.hasFunction(token.value)) {
                    const func = this.functionRegistry.getFunction(token.value);
                    const arity = func.arity;
                    
                    if (arity === -1) { // Variable arity
                        const args = [];
                        while (stack.length > 0) {
                            args.unshift(stack.pop());
                        }
                        stack.push(func.evaluate(...args));
                    } else {
                        const args = [];
                        for (let i = 0; i < arity; i++) {
                            if (stack.length === 0) {
                                throw new Error(`Not enough arguments for function ${token.value}`);
                            }
                            args.unshift(stack.pop());
                        }
                        stack.push(func.evaluate(...args));
                    }
                } else {
                    throw new Error(`Unknown identifier: ${token.value}`);
                }
            } else if (token.type === 'Operator') {
                const operator = this.operatorTable.getOperator(token.value);
                if (!operator) {
                    throw new Error(`Unknown operator: ${token.value}`);
                }
                
                if (operator.arity === 1) {
                    if (stack.length === 0) {
                        throw new Error(`Not enough operands for operator ${token.value}`);
                    }
                    const operand = stack.pop();
                    const result = operator.evaluate(operand);
                    stack.push(this.applyPrecisionMode(result));
                } else if (operator.arity === 2) {
                    if (stack.length < 2) {
                        throw new Error(`Not enough operands for operator ${token.value}`);
                    }
                    const b = stack.pop();
                    const a = stack.pop();
                    const result = operator.evaluate(a, b);
                    stack.push(this.applyPrecisionMode(result));
                }
            }
        }
        
        if (stack.length !== 1) {
            throw new Error('Invalid expression: too many operands');
        }
        
        return stack[0];
    }

    // Parse number based on precision mode
    parseNumber(value) {
        switch (this.modes.getPrecisionMode()) {
            case 'decimal':
                return new Decimal(value.toString(), this.modes.getPrecision());
            case 'bigint':
                if (Number.isInteger(parseFloat(value))) {
                    return BigInt(Math.floor(parseFloat(value)));
                }
                return parseFloat(value);
            case 'ieee754':
            default:
                return parseFloat(value);
        }
    }

    // Apply precision mode to result
    applyPrecisionMode(result) {
        switch (this.modes.getPrecisionMode()) {
            case 'decimal':
                if (result instanceof Decimal) {
                    return result;
                }
                return new Decimal(result.toString(), this.modes.getPrecision());
            case 'bigint':
                if (Number.isInteger(result)) {
                    return BigInt(Math.floor(result));
                }
                return result;
            case 'ieee754':
            default:
                return IEEE754Handler.checkOverflow(
                    IEEE754Handler.checkUnderflow(
                        IEEE754Handler.checkInvalidOperation(result)
                    )
                );
        }
    }

    // Format result for display
    formatResult(result) {
        if (result instanceof Complex) {
            if (result.isReal()) {
                return this.formatNumber(result.real);
            }
            return result.toString();
        }
        
        if (result instanceof Decimal) {
            return result.toString();
        }
        
        if (typeof result === 'bigint') {
            return result.toString();
        }
        
        return this.formatNumber(result);
    }

    // Format number with appropriate precision
    formatNumber(num) {
        if (!isFinite(num)) {
            return num.toString();
        }
        
        // Use appropriate precision based on mode
        const precision = this.modes.getPrecisionMode() === 'decimal' ? 
            this.modes.getPrecision() : 15;
        
        // Format with appropriate decimal places
        if (Math.abs(num) < 1e-10 && num !== 0) {
            return num.toExponential(precision - 1);
        }
        
        if (Math.abs(num) > 1e15) {
            return num.toExponential(precision - 1);
        }
        
        return parseFloat(num.toPrecision(precision)).toString();
    }

    // Mode management methods
    setAngleMode(mode) {
        this.modes.setAngleMode(mode);
    }

    setPrecisionMode(mode) {
        this.modes.setPrecisionMode(mode);
    }

    setComplexMode(mode) {
        this.modes.setComplexMode(mode);
    }

    setPrecision(precision) {
        this.modes.setPrecision(precision);
    }

    getModeSummary() {
        return this.modes.getModeSummary();
    }

    // Numerical solving methods
    solve(f, initialGuess, tolerance = 1e-10) {
        // Create a function that can be used with Newton's method
        const fPrime = (x) => {
            const h = 1e-8;
            return (f(x + h) - f(x - h)) / (2 * h);
        };
        
        return this.scientificFunctions.newtonMethod(f, fPrime, initialGuess, tolerance);
    }

    integrate(f, a, b, n = 100) {
        return this.scientificFunctions.simpsonRule(f, a, b, n);
    }

    // Get available functions and constants
    getAvailableFunctions() {
        return this.functionRegistry.getAvailableFunctions();
    }

    getAvailableConstants() {
        return this.functionRegistry.getAvailableConstants();
    }

    // Get help text for scientific mode
    getScientificHelp() {
        return `
Scientific Calculator Help:

Modes:
• Angle: Radians, Degrees, Grads
• Precision: IEEE-754, BigInt, Decimal
• Complex: Off, On, Auto

Functions:
• Trig: sin, cos, tan, csc, sec, cot, asin, acos, atan
• Hyperbolic: sinh, cosh, tanh, csch, sech, coth, asinh, acosh, atanh
• Exponential: exp, ln, log10, log2, logb(x,base)
• Power: pow(x,y), sqrt, cbrt, nthroot(x,n)
• Special: factorial, gamma, comb(n,k), perm(n,k)
• Statistical: abs, ceil, floor, round, min, max

Constants: pi, e, tau, phi, euler, ln2, ln10, sqrt2, sqrt1_2

Examples:
• sin(30) - in degree mode
• ln(e) = 1
• factorial(5) = 120
• comb(10,3) = 120
• pow(2,3) = 8
• sqrt(-1) - in complex mode
        `.trim();
    }
}

// Make available globally
window.ScientificCalculator = ScientificCalculator;
