/**
 * ScientificFunctions.js - Scientific function implementations
 * 
 * Implements trigonometric, hyperbolic, exponential, logarithmic,
 * special functions, and numerical solvers
 */

// Use global variables instead of imports for compatibility
class ScientificFunctions {
    constructor(modes) {
        this.modes = modes;
        this.constants = {
            PI: Math.PI,
            E: Math.E,
            TAU: 2 * Math.PI,
            PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
            EULER: 0.5772156649015329, // Euler-Mascheroni constant
            LN2: Math.LN2,
            LN10: Math.LN10,
            SQRT2: Math.SQRT2,
            SQRT1_2: Math.SQRT1_2
        };
        
        console.log('✅ Scientific Functions initialized');
    }

    // Trigonometric functions
    sin(x) {
        const radians = this.modes.toRadians(x);
        if (x instanceof window.Complex) {
            return x.sin();
        }
        return Math.sin(radians);
    }

    cos(x) {
        const radians = this.modes.toRadians(x);
        if (x instanceof window.Complex) {
            return x.cos();
        }
        return Math.cos(radians);
    }

    tan(x) {
        const radians = this.modes.toRadians(x);
        if (x instanceof window.Complex) {
            return x.tan();
        }
        return Math.tan(radians);
    }

    csc(x) {
        const sin_x = this.sin(x);
        if (sin_x === 0) {
            throw new Error('Cosecant of zero');
        }
        return 1 / sin_x;
    }

    sec(x) {
        const cos_x = this.cos(x);
        if (cos_x === 0) {
            throw new Error('Secant of zero');
        }
        return 1 / cos_x;
    }

    cot(x) {
        const tan_x = this.tan(x);
        if (tan_x === 0) {
            throw new Error('Cotangent of zero');
        }
        return 1 / tan_x;
    }

    // Inverse trigonometric functions
    asin(x) {
        if (x instanceof window.Complex) {
            // asin(z) = -i * ln(i*z + sqrt(1 - z^2))
            const i = new window.Complex(0, 1);
            const sqrt_term = this.sqrt(new window.Complex(1, 0).subtract(x.multiply(x)));
            const ln_term = i.multiply(x).add(sqrt_term).ln();
            return i.multiply(ln_term).multiply(new window.Complex(-1, 0));
        }
        
        if (Math.abs(x) > 1 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: asin(x) for |x| > 1');
        }
        
        const result = Math.asin(x);
        return this.modes.fromRadians(result);
    }

    acos(x) {
        if (x instanceof window.Complex) {
            // acos(z) = π/2 - asin(z)
            const pi_half = new window.Complex(Math.PI / 2, 0);
            return pi_half.subtract(this.asin(x));
        }
        
        if (Math.abs(x) > 1 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: acos(x) for |x| > 1');
        }
        
        const result = Math.acos(x);
        return this.modes.fromRadians(result);
    }

    atan(x) {
        if (x instanceof window.Complex) {
            // atan(z) = (i/2) * ln((1 - i*z)/(1 + i*z))
            const i = new window.Complex(0, 1);
            const numerator = new window.Complex(1, 0).subtract(i.multiply(x));
            const denominator = new window.Complex(1, 0).add(i.multiply(x));
            const ln_term = numerator.divide(denominator).ln();
            return i.multiply(ln_term).divide(new window.Complex(2, 0));
        }
        
        const result = Math.atan(x);
        return this.modes.fromRadians(result);
    }

    // Hyperbolic functions
    sinh(x) {
        if (x instanceof window.Complex) {
            return x.sin();
        }
        return (Math.exp(x) - Math.exp(-x)) / 2;
    }

    cosh(x) {
        if (x instanceof window.Complex) {
            return x.cos();
        }
        return (Math.exp(x) + Math.exp(-x)) / 2;
    }

    tanh(x) {
        if (x instanceof window.Complex) {
            return x.tan();
        }
        const exp_2x = Math.exp(2 * x);
        return (exp_2x - 1) / (exp_2x + 1);
    }

    csch(x) {
        const sinh_x = this.sinh(x);
        if (sinh_x === 0) {
            throw new Error('Hyperbolic cosecant of zero');
        }
        return 1 / sinh_x;
    }

    sech(x) {
        const cosh_x = this.cosh(x);
        if (cosh_x === 0) {
            throw new Error('Hyperbolic secant of zero');
        }
        return 1 / cosh_x;
    }

    coth(x) {
        const tanh_x = this.tanh(x);
        if (tanh_x === 0) {
            throw new Error('Hyperbolic cotangent of zero');
        }
        return 1 / tanh_x;
    }

    // Inverse hyperbolic functions
    asinh(x) {
        if (x instanceof window.Complex) {
            // asinh(z) = ln(z + sqrt(z^2 + 1))
            const sqrt_term = this.sqrt(x.multiply(x).add(new window.Complex(1, 0)));
            return x.add(sqrt_term).ln();
        }
        return Math.log(x + Math.sqrt(x * x + 1));
    }

    acosh(x) {
        if (x instanceof window.Complex) {
            // acosh(z) = ln(z + sqrt(z^2 - 1))
            const sqrt_term = this.sqrt(x.multiply(x).subtract(new window.Complex(1, 0)));
            return x.add(sqrt_term).ln();
        }
        
        if (x < 1 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: acosh(x) for x < 1');
        }
        
        return Math.log(x + Math.sqrt(x * x - 1));
    }

    atanh(x) {
        if (x instanceof window.Complex) {
            // atanh(z) = (1/2) * ln((1 + z)/(1 - z))
            const numerator = new window.Complex(1, 0).add(x);
            const denominator = new window.Complex(1, 0).subtract(x);
            const ln_term = numerator.divide(denominator).ln();
            return ln_term.divide(new window.Complex(2, 0));
        }
        
        if (Math.abs(x) >= 1 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: atanh(x) for |x| >= 1');
        }
        
        return 0.5 * Math.log((1 + x) / (1 - x));
    }

    // Exponential and logarithmic functions
    exp(x) {
        if (x instanceof window.Complex) {
            return x.exp();
        }
        return Math.exp(x);
    }

    ln(x) {
        if (x instanceof window.Complex) {
            return x.ln();
        }
        
        if (x <= 0 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: ln(x) for x <= 0');
        }
        
        return Math.log(x);
    }

    log10(x) {
        if (x instanceof window.Complex) {
            return x.ln().divide(new window.Complex(Math.LN10, 0));
        }
        
        if (x <= 0 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: log10(x) for x <= 0');
        }
        
        return Math.log10(x);
    }

    log2(x) {
        if (x instanceof window.Complex) {
            return x.ln().divide(new window.Complex(Math.LN2, 0));
        }
        
        if (x <= 0 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: log2(x) for x <= 0');
        }
        
        return Math.log2(x);
    }

    logb(x, base) {
        if (x instanceof window.Complex || base instanceof window.Complex) {
            const ln_x = x instanceof window.Complex ? x.ln() : new window.Complex(Math.log(x), 0);
            const ln_base = base instanceof window.Complex ? base.ln() : new window.Complex(Math.log(base), 0);
            return ln_x.divide(ln_base);
        }
        
        if (x <= 0 || base <= 0 || base === 1) {
            throw new Error('Domain error: logb(x, base) for invalid arguments');
        }
        
        return Math.log(x) / Math.log(base);
    }

    // Power and root functions
    pow(x, y) {
        if (x instanceof window.Complex || y instanceof window.Complex) {
            const complex_x = x instanceof window.Complex ? x : new window.Complex(x, 0);
            const complex_y = y instanceof window.Complex ? y : new window.Complex(y, 0);
            return complex_x.power(complex_y);
        }
        
        if (x < 0 && !Number.isInteger(y) && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: pow(x, y) for x < 0 and non-integer y');
        }
        
        return Math.pow(x, y);
    }

    sqrt(x) {
        if (x instanceof window.Complex) {
            // sqrt(z) = z^(1/2)
            return x.power(new window.Complex(0.5, 0));
        }
        
        if (x < 0 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: sqrt(x) for x < 0');
        }
        
        return Math.sqrt(x);
    }

    cbrt(x) {
        if (x instanceof window.Complex) {
            return x.power(new window.Complex(1/3, 0));
        }
        return Math.cbrt(x);
    }

    nthRoot(x, n) {
        if (x instanceof window.Complex) {
            return x.power(new window.Complex(1/n, 0));
        }
        
        if (x < 0 && n % 2 === 0 && this.modes.getComplexMode() === 'off') {
            throw new Error('Domain error: nthRoot(x, n) for x < 0 and even n');
        }
        
        return Math.pow(x, 1/n);
    }

    // Special functions
    factorial(n) {
        if (n instanceof window.Complex) {
            if (!n.isReal()) {
                throw new Error('Factorial only defined for real numbers');
            }
            n = n.real;
        }
        
        if (!Number.isInteger(n) || n < 0) {
            // Use Gamma function for non-integer or negative values
            return this.gamma(n + 1);
        }
        
        if (n > 170) { // Prevent overflow
            throw new Error('Factorial too large');
        }
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    gamma(z) {
        // Lanczos approximation for Gamma function
        if (z instanceof window.Complex) {
            if (!z.isReal()) {
                throw new Error('Gamma function not implemented for complex numbers');
            }
            z = z.real;
        }
        
        if (z <= 0 && Number.isInteger(z)) {
            throw new Error('Gamma function undefined for non-positive integers');
        }
        
        // Lanczos coefficients
        const g = 7;
        const p = [
            0.99999999999980993, 676.5203681218851, -1259.1392167224028,
            771.32342877765313, -176.61502916214059, 12.507343278686905,
            -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
        ];
        
        if (z < 0.5) {
            return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
        }
        
        z -= 1;
        let x = p[0];
        for (let i = 1; i < p.length; i++) {
            x += p[i] / (z + i);
        }
        
        const t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    // Combinatorics
    combination(n, k) {
        if (n instanceof window.Complex || k instanceof window.Complex) {
            // Use Gamma function for real/complex parameters
            const gamma_n_plus_1 = this.gamma(n + 1);
            const gamma_k_plus_1 = this.gamma(k + 1);
            const gamma_n_minus_k_plus_1 = this.gamma(n - k + 1);
            return gamma_n_plus_1 / (gamma_k_plus_1 * gamma_n_minus_k_plus_1);
        }
        
        if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) {
            throw new Error('Combination requires non-negative integers with k <= n');
        }
        
        if (k > n - k) k = n - k; // Take advantage of symmetry
        
        let result = 1;
        for (let i = 0; i < k; i++) {
            result = result * (n - i) / (i + 1);
        }
        return result;
    }

    permutation(n, k) {
        if (n instanceof window.Complex || k instanceof window.Complex) {
            // Use Gamma function for real/complex parameters
            const gamma_n_plus_1 = this.gamma(n + 1);
            const gamma_n_minus_k_plus_1 = this.gamma(n - k + 1);
            return gamma_n_plus_1 / gamma_n_minus_k_plus_1;
        }
        
        if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) {
            throw new Error('Permutation requires non-negative integers with k <= n');
        }
        
        let result = 1;
        for (let i = 0; i < k; i++) {
            result *= (n - i);
        }
        return result;
    }

    // Numerical solvers
    newtonMethod(f, fPrime, initialGuess, tolerance = 1e-10, maxIterations = 100) {
        let x = initialGuess;
        
        for (let i = 0; i < maxIterations; i++) {
            const fx = f(x);
            const fpx = fPrime(x);
            
            if (Math.abs(fpx) < tolerance) {
                throw new Error('Derivative too small, Newton method failed');
            }
            
            const newX = x - fx / fpx;
            
            if (Math.abs(newX - x) < tolerance) {
                return newX;
            }
            
            x = newX;
        }
        
        throw new Error('Newton method did not converge');
    }

    simpsonRule(f, a, b, n = 100) {
        if (n % 2 !== 0) n++; // Ensure n is even
        
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            const coefficient = (i % 2 === 0) ? 2 : 4;
            sum += coefficient * f(x);
        }
        
        return (h / 3) * sum;
    }

    // Get constants
    getConstant(name) {
        const upperName = name.toUpperCase();
        if (this.constants.hasOwnProperty(upperName)) {
            return this.constants[upperName];
        }
        throw new Error(`Unknown constant: ${name}`);
    }

    // Get all available constants
    getConstants() {
        return { ...this.constants };
    }
}

// Make available globally for compatibility
window.ScientificFunctions = ScientificFunctions;
