/**
 * Simplified Advanced Calculator Module for FreeToolHub
 * Core functionality with basic expression evaluation
 */

// Complex number class
class Complex {
    constructor(real, imaginary = 0) {
        this.real = real;
        this.imaginary = imaginary;
    }

    add(other) {
        if (typeof other === 'number') {
            return new Complex(this.real + other, this.imaginary);
        }
        return new Complex(this.real + other.real, this.imaginary + other.imaginary);
    }

    subtract(other) {
        if (typeof other === 'number') {
            return new Complex(this.real - other, this.imaginary);
        }
        return new Complex(this.real - other.real, this.imaginary - other.imaginary);
    }

    multiply(other) {
        if (typeof other === 'number') {
            return new Complex(this.real * other, this.imaginary * other);
        }
        return new Complex(
            this.real * other.real - this.imaginary * other.imaginary,
            this.real * other.imaginary + this.imaginary * other.real
        );
    }

    divide(other) {
        if (typeof other === 'number') {
            return new Complex(this.real / other, this.imaginary / other);
        }
        const denominator = other.real * other.real + other.imaginary * other.imaginary;
        return new Complex(
            (this.real * other.real + this.imaginary * other.imaginary) / denominator,
            (this.imaginary * other.real - this.real * other.imaginary) / denominator
        );
    }

    power(n) {
        if (typeof n === 'number' && Number.isInteger(n)) {
            if (n === 0) return new Complex(1);
            if (n < 0) return new Complex(1).divide(this.power(-n));
            
            let result = new Complex(1);
            let base = this;
            while (n > 0) {
                if (n % 2 === 1) result = result.multiply(base);
                base = base.multiply(base);
                n = Math.floor(n / 2);
            }
            return result;
        }
        return this.exp().multiply(new Complex(n)).log();
    }

    exp() {
        const expReal = Math.exp(this.real);
        return new Complex(
            expReal * Math.cos(this.imaginary),
            expReal * Math.sin(this.imaginary)
        );
    }

    log() {
        const magnitude = this.magnitude();
        const angle = this.angle();
        return new Complex(Math.log(magnitude), angle);
    }

    sqrt() {
        const magnitude = this.magnitude();
        const angle = this.angle() / 2;
        const sqrtMagnitude = Math.sqrt(magnitude);
        return new Complex(
            sqrtMagnitude * Math.cos(angle),
            sqrtMagnitude * Math.sin(angle)
        );
    }

    sin() {
        return new Complex(
            Math.sin(this.real) * Math.cosh(this.imaginary),
            Math.cos(this.real) * Math.sinh(this.imaginary)
        );
    }

    cos() {
        return new Complex(
            Math.cos(this.real) * Math.cosh(this.imaginary),
            -Math.sin(this.real) * Math.sinh(this.imaginary)
        );
    }

    tan() {
        return this.sin().divide(this.cos());
    }

    magnitude() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    angle() {
        return Math.atan2(this.imaginary, this.real);
    }

    conjugate() {
        return new Complex(this.real, -this.imaginary);
    }

    isReal() {
        return this.imaginary === 0;
    }

    isComplex() {
        return this.imaginary !== 0;
    }

    toString() {
        if (this.imaginary === 0) return this.real.toString();
        if (this.real === 0) return `${this.imaginary}i`;
        return `${this.real}${this.imaginary >= 0 ? '+' : ''}${this.imaginary}i`;
    }

    toNumber() {
        if (this.imaginary === 0) return this.real;
        throw new Error('Cannot convert complex number to real number');
    }
}

// Main Advanced Calculator class
class AdvancedCalculator {
    constructor() {
        this.mode = 'radians';
        this.complexMode = false;
        this.precision = 64;
        this.memory = new Map();
        this.lastResult = 0;
        this.history = [];
        this.variables = new Map();
    }

    // Basic two-operand calculator
    computeTwoOperand(a, b, op) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        if (isNaN(numA) || isNaN(numB)) {
            throw new Error('Invalid numbers provided');
        }

        switch (op) {
            case '+':
                return numA + numB;
            case '-':
                return numA - numB;
            case '*':
            case '×':
                return numA * numB;
            case '/':
            case '÷':
                if (numB === 0) {
                    throw new Error('Division by zero');
                }
                return numA / numB;
            case '%':
                if (numB === 0) {
                    throw new Error('Modulo by zero');
                }
                return numA % numB;
            case '^':
                if (numB > 1000) {
                    throw new Error('Exponent too large');
                }
                return Math.pow(numA, numB);
            default:
                throw new Error(`Unknown operator: ${op}`);
        }
    }

    // Simple expression evaluation (basic arithmetic)
    evalExpr(expr) {
        try {
            // Remove spaces and convert to lowercase
            expr = expr.replace(/\s/g, '').toLowerCase();
            
            // Handle basic arithmetic
            if (expr.includes('+')) {
                const parts = expr.split('+');
                return parseFloat(parts[0]) + parseFloat(parts[1]);
            }
            if (expr.includes('-')) {
                const parts = expr.split('-');
                return parseFloat(parts[0]) - parseFloat(parts[1]);
            }
            if (expr.includes('*')) {
                const parts = expr.split('*');
                return parseFloat(parts[0]) * parseFloat(parts[1]);
            }
            if (expr.includes('/')) {
                const parts = expr.split('/');
                const divisor = parseFloat(parts[1]);
                if (divisor === 0) throw new Error('Division by zero');
                return parseFloat(parts[0]) / divisor;
            }
            if (expr.includes('^')) {
                const parts = expr.split('^');
                return Math.pow(parseFloat(parts[0]), parseFloat(parts[1]));
            }
            
            // Single number
            return parseFloat(expr);
        } catch (error) {
            throw new Error(`Expression error: ${error.message}`);
        }
    }

    // Memory operations
    storeMemory(key, value) {
        this.memory.set(key, value);
    }

    recallMemory(key) {
        return this.memory.get(key) || 0;
    }

    clearMemory(key) {
        if (key) {
            this.memory.delete(key);
        } else {
            this.memory.clear();
        }
    }

    // Settings
    setMode(mode) {
        this.mode = mode;
    }

    getMode() {
        return this.mode;
    }

    setComplexMode(enabled) {
        this.complexMode = enabled;
    }

    getComplexMode() {
        return this.complexMode;
    }

    setPrecision(precision) {
        this.precision = precision;
    }

    getPrecision() {
        return this.precision;
    }

    // Utility methods
    getLastResult() {
        return this.lastResult;
    }

    getHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
    }

    // Variable management
    setVariable(name, value) {
        this.variables.set(name, value);
    }

    getVariable(name) {
        return this.variables.get(name);
    }

    clearVariables() {
        this.variables.clear();
    }

    // Validation
    validateExpression(expr) {
        try {
            this.evalExpr(expr);
            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: error.message };
        }
    }

    // Get available functions (simplified)
    getAvailableFunctions() {
        return ['sin', 'cos', 'tan', 'sqrt', 'abs', 'log', 'ln', 'exp'];
    }

    // Get available operators
    getAvailableOperators() {
        return ['+', '-', '*', '/', '%', '^'];
    }
}

// Export for use in the main application
if (typeof window !== 'undefined') {
    window.AdvancedCalculator = AdvancedCalculator;
    window.Complex = Complex;
} else {
    module.exports = { AdvancedCalculator, Complex };
}
