// Advanced Percentage Calculator Module for FreeToolHub
// Implements comprehensive percentage calculations with validation and error handling

class PercentageCalculator {
    constructor() {
        this.operations = {
            PERCENT_OF: 'percent_of',
            WHAT_PERCENT: 'what_percent',
            APPLY_INCREASE: 'apply_increase',
            APPLY_DECREASE: 'apply_decrease',
            PERCENT_CHANGE: 'percent_change',
            REVERSE_PERCENT: 'reverse_percent',
            PERCENT_DIFFERENCE: 'percent_difference'
        };

        this.inputTypes = {
            PERCENT: 'percent',
            DECIMAL: 'decimal'
        };

        this.changeTypes = {
            INCREASE: 'increase',
            DECREASE: 'decrease'
        };

        this.roundingModes = {
            NONE: 'none',
            ROUND: 'round',
            FLOOR: 'floor',
            CEIL: 'ceil'
        };
    }

    // Normalize percentage input to decimal multiplier
    normalizePercent(p, inputType = 'percent') {
        if (typeof p !== 'number' || isNaN(p)) {
            throw new Error('Percentage must be a valid number');
        }

        if (inputType === 'percent') {
            return p / 100.0;
        } else if (inputType === 'decimal') {
            if (p < 0 || p > 1) {
                throw new Error('Decimal percentage must be between 0 and 1');
            }
            return p;
        } else {
            throw new Error('Invalid input type. Use "percent" or "decimal"');
        }
    }

    // Calculate what is p% of N
    percentOf(p, N, inputType = 'percent', decimals = null, roundingMode = 'round') {
        if (typeof N !== 'number' || isNaN(N)) {
            throw new Error('Number must be a valid number');
        }

        const multiplier = this.normalizePercent(p, inputType);
        let result = multiplier * N;

        return this.applyRounding(result, decimals, roundingMode);
    }

    // Calculate what percent A is of B
    whatPercent(A, B, decimals = null, roundingMode = 'round') {
        if (typeof A !== 'number' || isNaN(A)) {
            throw new Error('Value A must be a valid number');
        }
        if (typeof B !== 'number' || isNaN(B)) {
            throw new Error('Value B must be a valid number');
        }
        if (B === 0) {
            throw new Error('Value B cannot be zero (division by zero)');
        }

        let result = (A / B) * 100.0;
        return this.applyRounding(result, decimals, roundingMode);
    }

    // Apply p% increase to N
    applyIncrease(N, p, inputType = 'percent', decimals = null, roundingMode = 'round') {
        if (typeof N !== 'number' || isNaN(N)) {
            throw new Error('Number must be a valid number');
        }

        const multiplier = this.normalizePercent(p, inputType);
        let result = N * (1.0 + multiplier);

        return this.applyRounding(result, decimals, roundingMode);
    }

    // Apply p% decrease to N
    applyDecrease(N, p, inputType = 'percent', decimals = null, roundingMode = 'round') {
        if (typeof N !== 'number' || isNaN(N)) {
            throw new Error('Number must be a valid number');
        }

        const multiplier = this.normalizePercent(p, inputType);
        let result = N * (1.0 - multiplier);

        return this.applyRounding(result, decimals, roundingMode);
    }

    // Calculate percent change from old to new value
    percentChange(old, newVal, decimals = null, roundingMode = 'round') {
        if (typeof old !== 'number' || isNaN(old)) {
            throw new Error('Old value must be a valid number');
        }
        if (typeof newVal !== 'number' || isNaN(newVal)) {
            throw new Error('New value must be a valid number');
        }
        if (old === 0) {
            throw new Error('Old value cannot be zero (division by zero)');
        }

        let result = ((newVal - old) / Math.abs(old)) * 100.0;
        return this.applyRounding(result, decimals, roundingMode);
    }

    // Reverse percentage: find original value given new value and percent change
    reversePercent(newVal, p, changeType, inputType = 'percent', decimals = null, roundingMode = 'round') {
        if (typeof newVal !== 'number' || isNaN(newVal)) {
            throw new Error('New value must be a valid number');
        }
        if (typeof changeType !== 'string' || !Object.values(this.changeTypes).includes(changeType)) {
            throw new Error('Change type must be "increase" or "decrease"');
        }

        const multiplier = this.normalizePercent(p, inputType);
        let denominator;

        if (changeType === 'increase') {
            denominator = 1.0 + multiplier;
        } else if (changeType === 'decrease') {
            denominator = 1.0 - multiplier;
        }

        if (denominator === 0) {
            throw new Error('Invalid percentage leading to zero denominator');
        }

        let result = newVal / denominator;
        return this.applyRounding(result, decimals, roundingMode);
    }

    // Calculate percent difference between two values
    percentDifference(a, b, decimals = null, roundingMode = 'round') {
        if (typeof a !== 'number' || isNaN(a)) {
            throw new Error('Value A must be a valid number');
        }
        if (typeof b !== 'number' || isNaN(b)) {
            throw new Error('Value B must be a valid number');
        }

        const average = (a + b) / 2.0;
        if (average === 0) {
            throw new Error('Average of values cannot be zero');
        }

        let result = (Math.abs(a - b) / Math.abs(average)) * 100.0;
        return this.applyRounding(result, decimals, roundingMode);
    }

    // Apply rounding based on mode and decimal places
    applyRounding(value, decimals, roundingMode) {
        if (decimals === null || decimals === undefined) {
            return value;
        }

        if (typeof decimals !== 'number' || decimals < 0 || !Number.isInteger(decimals)) {
            throw new Error('Decimals must be a non-negative integer');
        }

        const multiplier = Math.pow(10, decimals);

        switch (roundingMode) {
            case 'round':
                return Math.round(value * multiplier) / multiplier;
            case 'floor':
                return Math.floor(value * multiplier) / multiplier;
            case 'ceil':
                return Math.ceil(value * multiplier) / multiplier;
            case 'none':
                return value;
            default:
                throw new Error('Invalid rounding mode');
        }
    }

    // Main calculator function that routes to appropriate operation
    calculate(operation, options = {}) {
        const {
            p, N, A, B, old, new: newVal, changeType, inputType = 'percent',
            decimals = null, roundingMode = 'round'
        } = options;

        try {
            let result;
            let metadata = {};

            switch (operation) {
                case this.operations.PERCENT_OF:
                    result = this.percentOf(p, N, inputType, decimals, roundingMode);
                    metadata = {
                        operation: 'Percent Of',
                        formula: `${p}% of ${N}`,
                        result: result,
                        type: 'value'
                    };
                    break;

                case this.operations.WHAT_PERCENT:
                    result = this.whatPercent(A, B, decimals, roundingMode);
                    metadata = {
                        operation: 'What Percent',
                        formula: `${A} is what percent of ${B}`,
                        result: result,
                        type: 'percentage'
                    };
                    break;

                case this.operations.APPLY_INCREASE:
                    result = this.applyIncrease(N, p, inputType, decimals, roundingMode);
                    metadata = {
                        operation: 'Apply Increase',
                        formula: `${N} increased by ${p}%`,
                        result: result,
                        type: 'value',
                        change: 'increase'
                    };
                    break;

                case this.operations.APPLY_DECREASE:
                    result = this.applyDecrease(N, p, inputType, decimals, roundingMode);
                    metadata = {
                        operation: 'Apply Decrease',
                        formula: `${N} decreased by ${p}%`,
                        result: result,
                        type: 'value',
                        change: 'decrease'
                    };
                    break;

                case this.operations.PERCENT_CHANGE:
                    result = this.percentChange(old, newVal, decimals, roundingMode);
                    metadata = {
                        operation: 'Percent Change',
                        formula: `Change from ${old} to ${newVal}`,
                        result: result,
                        type: 'percentage',
                        change: result >= 0 ? 'increase' : 'decrease'
                    };
                    break;

                case this.operations.REVERSE_PERCENT:
                    result = this.reversePercent(newVal, p, changeType, inputType, decimals, roundingMode);
                    metadata = {
                        operation: 'Reverse Percentage',
                        formula: `Original value before ${changeType} of ${p}%`,
                        result: result,
                        type: 'value',
                        change: changeType
                    };
                    break;

                case this.operations.PERCENT_DIFFERENCE:
                    result = this.percentDifference(A, B, decimals, roundingMode);
                    metadata = {
                        operation: 'Percent Difference',
                        formula: `Difference between ${A} and ${B}`,
                        result: result,
                        type: 'percentage'
                    };
                    break;

                default:
                    throw new Error(`Unsupported operation: ${operation}`);
            }

            return {
                success: true,
                result: result,
                metadata: metadata,
                input: options
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                operation: operation,
                input: options
            };
        }
    }

    // Utility function to format percentage for display
    formatPercentage(value, decimals = 2) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 'Invalid';
        }
        return `${value.toFixed(decimals)}%`;
    }

    // Utility function to format currency
    formatCurrency(value, decimals = 2) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 'Invalid';
        }
        return `$${value.toFixed(decimals)}`;
    }

    // Get available operations
    getAvailableOperations() {
        return Object.values(this.operations);
    }

    // Get available input types
    getAvailableInputTypes() {
        return Object.values(this.inputTypes);
    }

    // Get available change types
    getAvailableChangeTypes() {
        return Object.values(this.changeTypes);
    }

    // Get available rounding modes
    getAvailableRoundingModes() {
        return Object.values(this.roundingModes);
    }
}

// Export for use in the main application
window.PercentageCalculator = PercentageCalculator;
