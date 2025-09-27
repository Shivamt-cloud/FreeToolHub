/**
 * ScientificModes.js - Mode management for scientific calculator
 * 
 * Handles angle modes, precision modes, and complex number modes
 */

class ScientificModes {
    constructor() {
        this.angleMode = 'rad'; // 'rad', 'deg', 'grad'
        this.precisionMode = 'ieee754'; // 'ieee754', 'bigint', 'decimal'
        this.complexMode = 'off'; // 'off', 'on', 'auto'
        this.precision = 50; // For decimal mode
        this.roundingMode = 'nearest'; // 'nearest', 'up', 'down', 'toward_zero'
        
        console.log('✅ Scientific Modes initialized');
    }

    // Angle mode management
    setAngleMode(mode) {
        if (!['rad', 'deg', 'grad'].includes(mode)) {
            throw new Error(`Invalid angle mode: ${mode}`);
        }
        this.angleMode = mode;
        console.log(`Angle mode set to: ${mode}`);
    }

    getAngleMode() {
        return this.angleMode;
    }

    // Convert angle to radians based on current mode
    toRadians(angle) {
        switch (this.angleMode) {
            case 'rad':
                return angle;
            case 'deg':
                return angle * Math.PI / 180;
            case 'grad':
                return angle * Math.PI / 200;
            default:
                return angle;
        }
    }

    // Convert radians to current angle mode
    fromRadians(radians) {
        switch (this.angleMode) {
            case 'rad':
                return radians;
            case 'deg':
                return radians * 180 / Math.PI;
            case 'grad':
                return radians * 200 / Math.PI;
            default:
                return radians;
        }
    }

    // Precision mode management
    setPrecisionMode(mode) {
        if (!['ieee754', 'bigint', 'decimal'].includes(mode)) {
            throw new Error(`Invalid precision mode: ${mode}`);
        }
        this.precisionMode = mode;
        console.log(`Precision mode set to: ${mode}`);
    }

    getPrecisionMode() {
        return this.precisionMode;
    }

    // Set precision for decimal mode
    setPrecision(precision) {
        if (precision < 1 || precision > 1000) {
            throw new Error('Precision must be between 1 and 1000');
        }
        this.precision = precision;
        console.log(`Precision set to: ${precision}`);
    }

    getPrecision() {
        return this.precision;
    }

    // Complex mode management
    setComplexMode(mode) {
        if (!['off', 'on', 'auto'].includes(mode)) {
            throw new Error(`Invalid complex mode: ${mode}`);
        }
        this.complexMode = mode;
        console.log(`Complex mode set to: ${mode}`);
    }

    getComplexMode() {
        return this.complexMode;
    }

    // Rounding mode management
    setRoundingMode(mode) {
        if (!['nearest', 'up', 'down', 'toward_zero'].includes(mode)) {
            throw new Error(`Invalid rounding mode: ${mode}`);
        }
        this.roundingMode = mode;
        console.log(`Rounding mode set to: ${mode}`);
    }

    getRoundingMode() {
        return this.roundingMode;
    }

    // Apply rounding based on current mode
    round(value) {
        switch (this.roundingMode) {
            case 'nearest':
                return Math.round(value);
            case 'up':
                return Math.ceil(value);
            case 'down':
                return Math.floor(value);
            case 'toward_zero':
                return value >= 0 ? Math.floor(value) : Math.ceil(value);
            default:
                return Math.round(value);
        }
    }

    // Get mode summary
    getModeSummary() {
        return {
            angle: this.angleMode,
            precision: this.precisionMode,
            complex: this.complexMode,
            precisionValue: this.precision,
            rounding: this.roundingMode
        };
    }

    // Reset to defaults
    reset() {
        this.angleMode = 'rad';
        this.precisionMode = 'ieee754';
        this.complexMode = 'off';
        this.precision = 50;
        this.roundingMode = 'nearest';
        console.log('Scientific modes reset to defaults');
    }
}

// Make available globally for compatibility
window.ScientificModes = ScientificModes;
