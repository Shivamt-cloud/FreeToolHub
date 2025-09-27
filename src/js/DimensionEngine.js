/**
 * DimensionEngine.js - Dimensional analysis and consistency checking
 */

class DimensionEngine {
    constructor() {
        this.baseDimensions = ['s', 'm', 'kg', 'A', 'K', 'mol', 'cd', 'count'];
    }

    /**
     * Check if two dimension vectors are equal
     */
    equalDimensions(dim1, dim2) {
        const allKeys = new Set([...Object.keys(dim1), ...Object.keys(dim2)]);
        
        for (const key of allKeys) {
            const exp1 = dim1[key] || 0;
            const exp2 = dim2[key] || 0;
            if (Math.abs(exp1 - exp2) > 1e-10) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Convert dimension vector to string
     */
    dimensionToString(dimension) {
        const parts = [];
        
        for (const [base, exp] of Object.entries(dimension)) {
            if (Math.abs(exp) > 1e-10) {
                if (exp === 1) {
                    parts.push(base);
                } else {
                    parts.push(`${base}^${exp}`);
                }
            }
        }
        
        if (parts.length === 0) {
            return 'dimensionless';
        }
        
        return parts.join('·');
    }

    /**
     * Add two dimension vectors
     */
    addDimensions(dim1, dim2) {
        const result = { ...dim1 };
        
        for (const [base, exp] of Object.entries(dim2)) {
            result[base] = (result[base] || 0) + exp;
        }
        
        return result;
    }

    /**
     * Subtract two dimension vectors
     */
    subtractDimensions(dim1, dim2) {
        const result = { ...dim1 };
        
        for (const [base, exp] of Object.entries(dim2)) {
            result[base] = (result[base] || 0) - exp;
        }
        
        return result;
    }

    /**
     * Multiply dimension vector by scalar
     */
    multiplyDimension(dimension, scalar) {
        const result = {};
        
        for (const [base, exp] of Object.entries(dimension)) {
            result[base] = exp * scalar;
        }
        
        return result;
    }

    /**
     * Check if dimension is dimensionless
     */
    isDimensionless(dimension) {
        for (const exp of Object.values(dimension)) {
            if (Math.abs(exp) > 1e-10) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get dimension category
     */
    getDimensionCategory(dimension) {
        const categories = {
            'length': { m: 1 },
            'area': { m: 2 },
            'volume': { m: 3 },
            'time': { s: 1 },
            'mass': { kg: 1 },
            'electric_current': { A: 1 },
            'temperature': { K: 1 },
            'amount_of_substance': { mol: 1 },
            'luminous_intensity': { cd: 1 },
            'speed': { m: 1, s: -1 },
            'acceleration': { m: 1, s: -2 },
            'force': { kg: 1, m: 1, s: -2 },
            'pressure': { kg: 1, m: -1, s: -2 },
            'energy': { kg: 1, m: 2, s: -2 },
            'power': { kg: 1, m: 2, s: -3 },
            'frequency': { s: -1 },
            'data_size': { count: 1 }
        };

        for (const [category, catDim] of Object.entries(categories)) {
            if (this.equalDimensions(dimension, catDim)) {
                return category;
            }
        }

        return 'unknown';
    }
}

// Make available globally
window.DimensionEngine = DimensionEngine;

export { DimensionEngine };


