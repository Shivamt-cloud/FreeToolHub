/**
 * Advanced QR Code Generator - Reed-Solomon Error Correction
 * Implements GF(256) arithmetic and Reed-Solomon encoding
 */

// Galois Field GF(256) arithmetic tables
const GF_EXP = new Array(256);
const GF_LOG = new Array(256);

// Initialize GF(256) tables
(function() {
    let x = 1;
    for (let i = 0; i < 256; i++) {
        GF_EXP[i] = x;
        GF_LOG[x] = i;
        x <<= 1;
        if (x >= 256) {
            x ^= 0x11D; // Primitive polynomial x^8 + x^4 + x^3 + x^2 + 1
        }
    }
    GF_LOG[0] = -1; // Undefined
})();

/**
 * Galois Field arithmetic operations
 */
export class GaloisField {
    /**
     * Add two elements in GF(256)
     */
    static add(a, b) {
        return a ^ b;
    }

    /**
     * Multiply two elements in GF(256)
     */
    static multiply(a, b) {
        if (a === 0 || b === 0) return 0;
        return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
    }

    /**
     * Divide two elements in GF(256)
     */
    static divide(a, b) {
        if (b === 0) throw new Error('Division by zero in GF(256)');
        if (a === 0) return 0;
        return GF_EXP[(GF_LOG[a] - GF_LOG[b] + 255) % 255];
    }

    /**
     * Power operation in GF(256)
     */
    static power(a, n) {
        if (n === 0) return 1;
        if (a === 0) return 0;
        return GF_EXP[(GF_LOG[a] * n) % 255];
    }
}

/**
 * Polynomial operations in GF(256)
 */
export class Polynomial {
    constructor(coefficients = []) {
        this.coefficients = coefficients.filter(c => c !== 0);
        if (this.coefficients.length === 0) {
            this.coefficients = [0];
        }
    }

    /**
     * Get the degree of the polynomial
     */
    get degree() {
        return this.coefficients.length - 1;
    }

    /**
     * Get coefficient at given power
     */
    getCoefficient(power) {
        const index = this.degree - power;
        return index >= 0 && index < this.coefficients.length ? this.coefficients[index] : 0;
    }

    /**
     * Add another polynomial
     */
    add(other) {
        const maxDegree = Math.max(this.degree, other.degree);
        const result = new Array(maxDegree + 1).fill(0);
        
        for (let i = 0; i <= maxDegree; i++) {
            const power = maxDegree - i;
            result[i] = GaloisField.add(
                this.getCoefficient(power),
                other.getCoefficient(power)
            );
        }
        
        return new Polynomial(result);
    }

    /**
     * Multiply by another polynomial
     */
    multiply(other) {
        const result = new Array(this.degree + other.degree + 1).fill(0);
        
        for (let i = 0; i <= this.degree; i++) {
            for (let j = 0; j <= other.degree; j++) {
                const power = (this.degree - i) + (other.degree - j);
                const index = result.length - 1 - power;
                result[index] = GaloisField.add(
                    result[index],
                    GaloisField.multiply(this.coefficients[i], other.coefficients[j])
                );
            }
        }
        
        return new Polynomial(result);
    }

    /**
     * Multiply by a scalar
     */
    multiplyScalar(scalar) {
        const result = this.coefficients.map(coeff => 
            GaloisField.multiply(coeff, scalar)
        );
        return new Polynomial(result);
    }

    /**
     * Evaluate polynomial at given point
     */
    evaluate(x) {
        let result = 0;
        for (let i = 0; i < this.coefficients.length; i++) {
            const power = this.degree - i;
            result = GaloisField.add(
                result,
                GaloisField.multiply(
                    this.coefficients[i],
                    GaloisField.power(x, power)
                )
            );
        }
        return result;
    }
}

/**
 * Reed-Solomon encoder for QR Code error correction
 */
export class ReedSolomonEncoder {
    constructor(generatorPolynomial) {
        this.generatorPolynomial = new Polynomial(generatorPolynomial);
    }

    /**
     * Encode data with Reed-Solomon error correction
     */
    encode(data) {
        const dataPolynomial = new Polynomial(data);
        const parityPolynomial = this.computeParity(dataPolynomial);
        
        // Combine data and parity
        const result = [...data];
        for (let i = 0; i < parityPolynomial.coefficients.length; i++) {
            result.push(parityPolynomial.coefficients[i]);
        }
        
        return result;
    }

    /**
     * Compute parity polynomial using polynomial division
     */
    computeParity(dataPolynomial) {
        const degree = this.generatorPolynomial.degree;
        const dividend = new Polynomial([...dataPolynomial.coefficients, ...new Array(degree).fill(0)]);
        
        // Polynomial long division
        let quotient = new Array(degree + 1).fill(0);
        let remainder = dividend;
        
        for (let i = 0; i <= dataPolynomial.degree; i++) {
            if (remainder.coefficients[0] === 0) {
                remainder = new Polynomial(remainder.coefficients.slice(1));
                continue;
            }
            
            const factor = GaloisField.divide(remainder.coefficients[0], this.generatorPolynomial.coefficients[0]);
            quotient[i] = factor;
            
            const term = this.generatorPolynomial.multiplyScalar(factor);
            const shifted = new Polynomial([...new Array(i).fill(0), ...term.coefficients]);
            
            remainder = remainder.add(shifted);
            remainder = new Polynomial(remainder.coefficients.slice(1));
        }
        
        return remainder;
    }

    /**
     * Create generator polynomial for given degree
     */
    static createGeneratorPolynomial(degree) {
        let polynomial = new Polynomial([1]);
        
        for (let i = 0; i < degree; i++) {
            const factor = new Polynomial([1, GaloisField.power(2, i)]);
            polynomial = polynomial.multiply(factor);
        }
        
        return polynomial;
    }
}

/**
 * Utility functions for Reed-Solomon operations
 */
export class RSUtils {
    /**
     * Get the number of ECC codewords for given version and ECC level
     */
    static getECCCodewords(version, eccLevel) {
        const totalCodewords = Math.floor((version * 4 + 17) * (version * 4 + 17) / 8);
        const dataCodewords = this.getDataCodewords(version, eccLevel);
        return totalCodewords - dataCodewords;
    }

    /**
     * Get the number of data codewords for given version and ECC level
     */
    static getDataCodewords(version, eccLevel) {
        // This is a simplified calculation - in practice, use the capacity tables
        const baseCapacity = {
            'L': 0.93, 'M': 0.85, 'Q': 0.75, 'H': 0.70
        };
        const totalCodewords = Math.floor((version * 4 + 17) * (version * 4 + 17) / 8);
        return Math.floor(totalCodewords * baseCapacity[eccLevel]);
    }

    /**
     * Split data into blocks for interleaving
     */
    static splitIntoBlocks(data, version, eccLevel) {
        const eccCodewords = this.getECCCodewords(version, eccLevel);
        const dataCodewords = data.length;
        
        // For now, return a single block
        // In full implementation, this would handle multiple blocks
        return [{
            data: data,
            parity: new Array(eccCodewords).fill(0)
        }];
    }

    /**
     * Interleave blocks for final codeword sequence
     */
    static interleaveBlocks(blocks) {
        const result = [];
        const maxLength = Math.max(...blocks.map(b => b.data.length + b.parity.length));
        
        for (let i = 0; i < maxLength; i++) {
            for (const block of blocks) {
                if (i < block.data.length) {
                    result.push(block.data[i]);
                }
            }
        }
        
        for (let i = 0; i < maxLength; i++) {
            for (const block of blocks) {
                if (i < block.parity.length) {
                    result.push(block.parity[i]);
                }
            }
        }
        
        return result;
    }
}
