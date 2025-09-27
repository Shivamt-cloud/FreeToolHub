/**
 * OperatorTable.js - Defines operator precedence, associativity, and evaluation logic
 * 
 * This module maintains a comprehensive table of mathematical operators with their
 * precedence levels, associativity rules, and evaluation functions.
 */

class OperatorTable {
    constructor() {
        this.operators = new Map();
        this.functions = new Map();
        this.constants = new Map();
        
        this.initializeOperators();
        this.initializeFunctions();
        this.initializeConstants();
    }

    /**
     * Initialize mathematical operators with precedence and associativity
     * Higher precedence values bind tighter (evaluated first)
     */
    initializeOperators() {
        // Unary operators (precedence 8)
        this.operators.set('unary+', {
            arity: 'unary',
            precedence: 8,
            associativity: 'right',
            evaluate: (a) => +a,
            symbol: '+'
        });

        this.operators.set('unary-', {
            arity: 'unary',
            precedence: 8,
            associativity: 'right',
            evaluate: (a) => -a,
            symbol: '-'
        });

        // Binary operators
        // Exponentiation (precedence 7, right-associative)
        this.operators.set('^', {
            arity: 'binary',
            precedence: 7,
            associativity: 'right',
            evaluate: (a, b) => Math.pow(a, b),
            symbol: '^'
        });

        this.operators.set('**', {
            arity: 'binary',
            precedence: 7,
            associativity: 'right',
            evaluate: (a, b) => Math.pow(a, b),
            symbol: '**'
        });

        // Multiplication, Division, Modulo (precedence 6, left-associative)
        this.operators.set('*', {
            arity: 'binary',
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => a * b,
            symbol: '*'
        });

        this.operators.set('×', {
            arity: 'binary',
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => a * b,
            symbol: '×'
        });

        this.operators.set('/', {
            arity: 'binary',
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => {
                if (b === 0) throw new Error('Division by zero');
                return a / b;
            },
            symbol: '/'
        });

        this.operators.set('÷', {
            arity: 'binary',
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => {
                if (b === 0) throw new Error('Division by zero');
                return a / b;
            },
            symbol: '÷'
        });

        this.operators.set('%', {
            arity: 'binary',
            precedence: 6,
            associativity: 'left',
            evaluate: (a, b) => {
                if (b === 0) throw new Error('Modulo by zero');
                return a % b;
            },
            symbol: '%'
        });

        // Addition, Subtraction (precedence 5, left-associative)
        this.operators.set('+', {
            arity: 'binary',
            precedence: 5,
            associativity: 'left',
            evaluate: (a, b) => a + b,
            symbol: '+'
        });

        this.operators.set('-', {
            arity: 'binary',
            precedence: 5,
            associativity: 'left',
            evaluate: (a, b) => a - b,
            symbol: '-'
        });
    }

    /**
     * Initialize mathematical functions
     */
    initializeFunctions() {
        // Trigonometric functions
        this.functions.set('sin', {
            arity: 1,
            evaluate: (x) => Math.sin(x),
            description: 'Sine function'
        });

        this.functions.set('cos', {
            arity: 1,
            evaluate: (x) => Math.cos(x),
            description: 'Cosine function'
        });

        this.functions.set('tan', {
            arity: 1,
            evaluate: (x) => Math.tan(x),
            description: 'Tangent function'
        });

        this.functions.set('asin', {
            arity: 1,
            evaluate: (x) => {
                if (x < -1 || x > 1) throw new Error('Domain error: asin input must be between -1 and 1');
                return Math.asin(x);
            },
            description: 'Arcsine function'
        });

        this.functions.set('acos', {
            arity: 1,
            evaluate: (x) => {
                if (x < -1 || x > 1) throw new Error('Domain error: acos input must be between -1 and 1');
                return Math.acos(x);
            },
            description: 'Arccosine function'
        });

        this.functions.set('atan', {
            arity: 1,
            evaluate: (x) => Math.atan(x),
            description: 'Arctangent function'
        });

        // Logarithmic and exponential functions
        this.functions.set('log', {
            arity: 1,
            evaluate: (x) => {
                if (x <= 0) throw new Error('Domain error: log input must be positive');
                return Math.log10(x);
            },
            description: 'Base-10 logarithm'
        });

        this.functions.set('ln', {
            arity: 1,
            evaluate: (x) => {
                if (x <= 0) throw new Error('Domain error: ln input must be positive');
                return Math.log(x);
            },
            description: 'Natural logarithm'
        });

        this.functions.set('exp', {
            arity: 1,
            evaluate: (x) => Math.exp(x),
            description: 'Exponential function (e^x)'
        });

        // Power and root functions
        this.functions.set('sqrt', {
            arity: 1,
            evaluate: (x) => {
                if (x < 0) throw new Error('Domain error: sqrt input must be non-negative');
                return Math.sqrt(x);
            },
            description: 'Square root'
        });

        this.functions.set('cbrt', {
            arity: 1,
            evaluate: (x) => Math.cbrt(x),
            description: 'Cube root'
        });

        this.functions.set('pow', {
            arity: 2,
            evaluate: (x, y) => Math.pow(x, y),
            description: 'Power function (x^y)'
        });

        // Statistical functions
        this.functions.set('min', {
            arity: 'variadic',
            evaluate: (...args) => Math.min(...args),
            description: 'Minimum value'
        });

        this.functions.set('max', {
            arity: 'variadic',
            evaluate: (...args) => Math.max(...args),
            description: 'Maximum value'
        });

        this.functions.set('abs', {
            arity: 1,
            evaluate: (x) => Math.abs(x),
            description: 'Absolute value'
        });

        this.functions.set('ceil', {
            arity: 1,
            evaluate: (x) => Math.ceil(x),
            description: 'Ceiling function'
        });

        this.functions.set('floor', {
            arity: 1,
            evaluate: (x) => Math.floor(x),
            description: 'Floor function'
        });

        this.functions.set('round', {
            arity: 1,
            evaluate: (x) => Math.round(x),
            description: 'Round to nearest integer'
        });

        // Random functions
        this.functions.set('random', {
            arity: 0,
            evaluate: () => Math.random(),
            description: 'Random number between 0 and 1'
        });

        this.functions.set('randint', {
            arity: 2,
            evaluate: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
            description: 'Random integer between min and max (inclusive)'
        });
    }

    /**
     * Initialize mathematical constants
     */
    initializeConstants() {
        this.constants.set('pi', Math.PI);
        this.constants.set('π', Math.PI);
        this.constants.set('e', Math.E);
        this.constants.set('phi', (1 + Math.sqrt(5)) / 2); // Golden ratio
        this.constants.set('φ', (1 + Math.sqrt(5)) / 2);
        this.constants.set('tau', 2 * Math.PI);
        this.constants.set('τ', 2 * Math.PI);
    }

    /**
     * Get operator information
     * @param {string} symbol - Operator symbol
     * @returns {Object|null} Operator info or null if not found
     */
    getOperator(symbol) {
        return this.operators.get(symbol) || null;
    }

    /**
     * Get function information
     * @param {string} name - Function name
     * @returns {Object|null} Function info or null if not found
     */
    getFunction(name) {
        return this.functions.get(name.toLowerCase()) || null;
    }

    /**
     * Get constant value
     * @param {string} name - Constant name
     * @returns {number|null} Constant value or null if not found
     */
    getConstant(name) {
        return this.constants.get(name.toLowerCase()) || null;
    }

    /**
     * Check if a symbol is an operator
     * @param {string} symbol - Symbol to check
     * @returns {boolean} True if it's an operator
     */
    isOperator(symbol) {
        return this.operators.has(symbol);
    }

    /**
     * Check if a name is a function
     * @param {string} name - Name to check
     * @returns {boolean} True if it's a function
     */
    isFunction(name) {
        return this.functions.has(name.toLowerCase());
    }

    /**
     * Check if a name is a constant
     * @param {string} name - Name to check
     * @returns {boolean} True if it's a constant
     */
    isConstant(name) {
        return this.constants.has(name.toLowerCase());
    }

    /**
     * Get all available operators
     * @returns {Array} Array of operator symbols
     */
    getAllOperators() {
        return Array.from(this.operators.keys());
    }

    /**
     * Get all available functions
     * @returns {Array} Array of function names
     */
    getAllFunctions() {
        return Array.from(this.functions.keys());
    }

    /**
     * Get all available constants
     * @returns {Array} Array of constant names
     */
    getAllConstants() {
        return Array.from(this.constants.keys());
    }
}

// Make available globally
window.OperatorTable = OperatorTable;
