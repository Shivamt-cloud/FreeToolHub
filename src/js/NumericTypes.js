/**
 * NumericTypes.js - Numeric type system for scientific calculator
 * 
 * Implements IEEE-754 floating point, arbitrary precision, and complex numbers
 * with proper type promotion and error handling.
 */

// IEEE-754 Double precision constants
const IEEE754 = {
    EPSILON: Number.EPSILON,
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    MAX_VALUE: Number.MAX_VALUE,
    MIN_VALUE: Number.MIN_VALUE,
    POSITIVE_INFINITY: Number.POSITIVE_INFINITY,
    NEGATIVE_INFINITY: Number.NEGATIVE_INFINITY,
    NaN: Number.NaN
};

// Complex number class
class Complex {
    constructor(real = 0, imaginary = 0) {
        this.real = real;
        this.imaginary = imaginary;
    }

    // Basic operations
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
        const real = this.real * other.real - this.imaginary * other.imaginary;
        const imaginary = this.real * other.imaginary + this.imaginary * other.real;
        return new Complex(real, imaginary);
    }

    divide(other) {
        if (typeof other === 'number') {
            return new Complex(this.real / other, this.imaginary / other);
        }
        const denominator = other.real * other.real + other.imaginary * other.imaginary;
        if (denominator === 0) {
            throw new Error('Division by zero in complex numbers');
        }
        const real = (this.real * other.real + this.imaginary * other.imaginary) / denominator;
        const imaginary = (this.imaginary * other.real - this.real * other.imaginary) / denominator;
        return new Complex(real, imaginary);
    }

    power(exponent) {
        if (typeof exponent === 'number' && Number.isInteger(exponent)) {
            return this.integerPower(exponent);
        }
        // For non-integer powers, use exponential form: z^w = e^(w * ln(z))
        const ln = this.ln();
        const w_ln_z = exponent instanceof Complex ? exponent.multiply(ln) : new Complex(exponent, 0).multiply(ln);
        return w_ln_z.exp();
    }

    integerPower(n) {
        if (n === 0) return new Complex(1, 0);
        if (n === 1) return new Complex(this.real, this.imaginary);
        if (n < 0) return this.integerPower(-n).reciprocal();
        
        let result = new Complex(1, 0);
        let base = new Complex(this.real, this.imaginary);
        
        while (n > 0) {
            if (n % 2 === 1) {
                result = result.multiply(base);
            }
            base = base.multiply(base);
            n = Math.floor(n / 2);
        }
        return result;
    }

    // Complex functions
    magnitude() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    argument() {
        return Math.atan2(this.imaginary, this.real);
    }

    conjugate() {
        return new Complex(this.real, -this.imaginary);
    }

    reciprocal() {
        const mag_sq = this.real * this.real + this.imaginary * this.imaginary;
        if (mag_sq === 0) {
            throw new Error('Division by zero in complex reciprocal');
        }
        return new Complex(this.real / mag_sq, -this.imaginary / mag_sq);
    }

    // Exponential and logarithmic functions
    exp() {
        const e_real = Math.exp(this.real);
        return new Complex(e_real * Math.cos(this.imaginary), e_real * Math.sin(this.imaginary));
    }

    ln() {
        const magnitude = this.magnitude();
        if (magnitude === 0) {
            throw new Error('Logarithm of zero');
        }
        return new Complex(Math.log(magnitude), this.argument());
    }

    // Trigonometric functions
    sin() {
        const e_iz = new Complex(-this.imaginary, this.real).exp();
        const e_neg_iz = new Complex(this.imaginary, -this.real).exp();
        return e_iz.subtract(e_neg_iz).divide(new Complex(0, 2));
    }

    cos() {
        const e_iz = new Complex(-this.imaginary, this.real).exp();
        const e_neg_iz = new Complex(this.imaginary, -this.real).exp();
        return e_iz.add(e_neg_iz).divide(new Complex(2, 0));
    }

    tan() {
        const sin_z = this.sin();
        const cos_z = this.cos();
        return sin_z.divide(cos_z);
    }

    // String representation
    toString() {
        if (this.imaginary === 0) {
            return this.real.toString();
        }
        if (this.real === 0) {
            return this.imaginary === 1 ? 'i' : this.imaginary === -1 ? '-i' : `${this.imaginary}i`;
        }
        const imag_part = this.imaginary === 1 ? 'i' : this.imaginary === -1 ? '-i' : `${this.imaginary}i`;
        return `${this.real}${this.imaginary > 0 ? '+' : ''}${imag_part}`;
    }

    // Check if it's a real number
    isReal() {
        return Math.abs(this.imaginary) < IEEE754.EPSILON;
    }

    // Get real part if it's a real number
    toReal() {
        if (!this.isReal()) {
            throw new Error('Cannot convert complex number to real');
        }
        return this.real;
    }
}

// Arbitrary precision decimal class (simplified)
class Decimal {
    constructor(value, precision = 50) {
        this.precision = precision;
        if (typeof value === 'string') {
            this.value = this.parseDecimal(value);
        } else if (typeof value === 'number') {
            this.value = this.parseDecimal(value.toString());
        } else {
            this.value = { integer: '0', fractional: '0', negative: false };
        }
    }

    parseDecimal(str) {
        const trimmed = str.trim();
        const negative = trimmed.startsWith('-');
        const clean = negative ? trimmed.slice(1) : trimmed;
        
        if (clean.includes('.')) {
            const [integer, fractional] = clean.split('.');
            return {
                integer: integer || '0',
                fractional: fractional || '0',
                negative
            };
        } else {
            return {
                integer: clean || '0',
                fractional: '0',
                negative
            };
        }
    }

    add(other) {
        // Simplified addition - in real implementation would handle carry properly
        const a = parseFloat(this.toString());
        const b = parseFloat(other.toString());
        return new Decimal((a + b).toString(), Math.max(this.precision, other.precision));
    }

    subtract(other) {
        const a = parseFloat(this.toString());
        const b = parseFloat(other.toString());
        return new Decimal((a - b).toString(), Math.max(this.precision, other.precision));
    }

    multiply(other) {
        const a = parseFloat(this.toString());
        const b = parseFloat(other.toString());
        return new Decimal((a * b).toString(), Math.max(this.precision, other.precision));
    }

    divide(other) {
        const a = parseFloat(this.toString());
        const b = parseFloat(other.toString());
        if (b === 0) throw new Error('Division by zero');
        return new Decimal((a / b).toString(), Math.max(this.precision, other.precision));
    }

    toString() {
        const sign = this.value.negative ? '-' : '';
        if (this.value.fractional === '0') {
            return sign + this.value.integer;
        }
        return sign + this.value.integer + '.' + this.value.fractional;
    }

    toNumber() {
        return parseFloat(this.toString());
    }
}

// Type promotion system
class TypePromoter {
    static promote(a, b) {
        // If both are numbers, return numbers
        if (typeof a === 'number' && typeof b === 'number') {
            return { a, b, resultType: 'number' };
        }

        // If one is complex, promote both to complex
        if (a instanceof Complex || b instanceof Complex) {
            const complexA = a instanceof Complex ? a : new Complex(a, 0);
            const complexB = b instanceof Complex ? b : new Complex(b, 0);
            return { a: complexA, b: complexB, resultType: 'complex' };
        }

        // If one is decimal, promote both to decimal
        if (a instanceof Decimal || b instanceof Decimal) {
            const decimalA = a instanceof Decimal ? a : new Decimal(a.toString());
            const decimalB = b instanceof Decimal ? b : new Decimal(b.toString());
            return { a: decimalA, b: decimalB, resultType: 'decimal' };
        }

        // Default to numbers
        return { a, b, resultType: 'number' };
    }

    static toComplex(value) {
        if (value instanceof Complex) return value;
        if (typeof value === 'number') return new Complex(value, 0);
        if (value instanceof Decimal) return new Complex(value.toNumber(), 0);
        throw new Error(`Cannot convert ${typeof value} to Complex`);
    }

    static toDecimal(value, precision = 50) {
        if (value instanceof Decimal) return value;
        if (typeof value === 'number') return new Decimal(value.toString(), precision);
        if (value instanceof Complex) {
            if (!value.isReal()) {
                throw new Error('Cannot convert complex number to decimal');
            }
            return new Decimal(value.real.toString(), precision);
        }
        throw new Error(`Cannot convert ${typeof value} to Decimal`);
    }
}

// Error handling for numeric operations
class NumericError extends Error {
    constructor(message, type = 'NUMERIC_ERROR') {
        super(message);
        this.name = 'NumericError';
        this.type = type;
    }
}

// IEEE-754 exception handling
class IEEE754Handler {
    static checkOverflow(value) {
        if (Math.abs(value) > IEEE754.MAX_VALUE) {
            throw new NumericError('Overflow', 'OVERFLOW');
        }
        return value;
    }

    static checkUnderflow(value) {
        if (value !== 0 && Math.abs(value) < IEEE754.MIN_VALUE) {
            throw new NumericError('Underflow', 'UNDERFLOW');
        }
        return value;
    }

    static checkDivisionByZero(value) {
        if (!isFinite(value)) {
            throw new NumericError('Division by zero', 'DIVISION_BY_ZERO');
        }
        return value;
    }

    static checkInvalidOperation(value) {
        if (isNaN(value)) {
            throw new NumericError('Invalid operation', 'INVALID_OPERATION');
        }
        return value;
    }
}

// Make available globally for compatibility
window.Complex = Complex;
window.Decimal = Decimal;
window.TypePromoter = TypePromoter;
window.NumericError = NumericError;
window.IEEE754Handler = IEEE754Handler;
window.IEEE754 = IEEE754;

// Also make the main classes available under a NumericTypes namespace
window.NumericTypes = {
    Complex,
    Decimal,
    TypePromoter,
    NumericError,
    IEEE754Handler,
    IEEE754
};
