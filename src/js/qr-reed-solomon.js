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
        // Ensure coefficients is an array
        if (!Array.isArray(coefficients)) {
            if (coefficients === undefined || coefficients === null) {
                this.coefficients = [0];
            } else {
                this.coefficients = [coefficients];
            }
        } else {
            this.coefficients = coefficients.filter(c => c !== 0);
            if (this.coefficients.length === 0) {
                this.coefficients = [0];
            }
        }
    }

    /**
     * Get the degree of the polynomial
     */
    get degree() {
        if (!this.coefficients || this.coefficients.length === 0) {
            return -1;
        }
        return this.coefficients.length - 1;
    }

    /**
     * Get coefficient at given power
     */
    getCoefficient(power) {
        if (!this.coefficients || this.coefficients.length === 0) {
            return 0;
        }
        
        const index = this.degree - power;
        return index >= 0 && index < this.coefficients.length ? this.coefficients[index] : 0;
    }

    /**
     * Add another polynomial
     */
    add(other) {
        if (!other || !other.coefficients) {
            return new Polynomial(this.coefficients);
        }
        
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
        if (!other || !other.coefficients) {
            return new Polynomial([0]);
        }
        
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
        if (scalar === undefined || scalar === null) {
            return new Polynomial([0]);
        }
        
        const result = this.coefficients.map(coeff => 
            GaloisField.multiply(coeff, scalar)
        );
        return new Polynomial(result);
    }

    /**
     * Evaluate polynomial at given point
     */
    evaluate(x) {
        if (!this.coefficients || this.coefficients.length === 0) {
            return 0;
        }
        
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
                const slicedCoeffs = remainder.coefficients.slice(1);
                remainder = new Polynomial(slicedCoeffs.length > 0 ? slicedCoeffs : [0]);
                continue;
            }
            
            const factor = GaloisField.divide(remainder.coefficients[0], this.generatorPolynomial.coefficients[0]);
            quotient[i] = factor;
            
            const term = this.generatorPolynomial.multiplyScalar(factor);
            const shifted = new Polynomial([...new Array(i).fill(0), ...term.coefficients]);
            
            remainder = remainder.add(shifted);
            const slicedCoeffs = remainder.coefficients.slice(1);
            remainder = new Polynomial(slicedCoeffs.length > 0 ? slicedCoeffs : [0]);
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
    static getECCCodewords(version, eccLevel, qrVersions) {
        const versionInfo = qrVersions[version];
        if (!versionInfo) {
            throw new Error(`Invalid QR version: ${version}`);
        }
        
        const dataCapacity = versionInfo.dataCapacity[eccLevel];
        if (dataCapacity === undefined) {
            throw new Error(`Invalid ECC level: ${eccLevel}`);
        }
        
        const totalCodewords = Math.floor((version * 4 + 17) * (version * 4 + 17) / 8);
        return totalCodewords - dataCapacity;
    }

    /**
     * Get the number of data codewords for given version and ECC level
     */
    static getDataCodewords(version, eccLevel, qrVersions) {
        const versionInfo = qrVersions[version];
        if (!versionInfo) {
            throw new Error(`Invalid QR version: ${version}`);
        }
        
        const dataCapacity = versionInfo.dataCapacity[eccLevel];
        if (dataCapacity === undefined) {
            throw new Error(`Invalid ECC level: ${eccLevel}`);
        }
        
        return dataCapacity;
    }

    /**
     * Split data into blocks for interleaving according to ISO/IEC 18004
     */
    static splitIntoBlocks(data, version, eccLevel, qrVersions) {
        // Get block structure from QR specification
        const blockInfo = this.getBlockStructure(version, eccLevel, qrVersions);
        const blocks = [];
        
        let dataIndex = 0;
        for (const block of blockInfo) {
            const blockData = data.slice(dataIndex, dataIndex + block.dataCodewords);
            dataIndex += block.dataCodewords;
            
            // Pad block if necessary
            while (blockData.length < block.dataCodewords) {
                blockData.push(0);
            }
            
            blocks.push({
                data: blockData,
                dataCodewords: block.dataCodewords,
                eccCodewords: block.eccCodewords
            });
        }
        
        return blocks;
    }

    /**
     * Get block structure for given version and ECC level
     */
    static getBlockStructure(version, eccLevel, qrVersions) {
        // This is a simplified version - full implementation would use complete block tables
        const totalCodewords = Math.floor((version * 4 + 17) * (version * 4 + 17) / 8);
        const dataCapacity = qrVersions[version].dataCapacity[eccLevel];
        const eccCodewords = totalCodewords - dataCapacity;
        
        // For most versions, use single block
        return [{
            dataCodewords: dataCapacity,
            eccCodewords: eccCodewords
        }];
    }

    /**
     * Interleave blocks for final codeword sequence according to ISO/IEC 18004
     */
    static interleaveBlocks(blocks) {
        const result = [];
        
        // Interleave data codewords
        const maxDataLength = Math.max(...blocks.map(b => b.data.length));
        for (let i = 0; i < maxDataLength; i++) {
            for (const block of blocks) {
                if (i < block.data.length) {
                    result.push(block.data[i]);
                }
            }
        }
        
        // Interleave ECC codewords
        const maxEccLength = Math.max(...blocks.map(b => b.parity ? b.parity.length : 0));
        for (let i = 0; i < maxEccLength; i++) {
            for (const block of blocks) {
                if (block.parity && i < block.parity.length) {
                    result.push(block.parity[i]);
                }
            }
        }
        
        return result;
    }
}
