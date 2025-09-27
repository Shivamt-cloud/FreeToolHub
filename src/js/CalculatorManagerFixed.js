/**
 * CalculatorManagerFixed.js - Fixed version of CalculatorManager
 * 
 * This module provides a unified interface for both basic and advanced calculators,
 * with the default mode set to 'advanced' for proper expression evaluation.
 */

class CalculatorManagerFixed {
    constructor() {
        this.currentMode = 'advanced'; // 'basic', 'advanced', or 'scientific'
        this.basicCalculator = null;
        this.advancedCalculator = null;
        this.scientificCalculator = null;
        this.isInitialized = false;
        
        console.log('🔧 CalculatorManagerFixed created with mode:', this.currentMode);
        this.initializeCalculators();
    }

    /**
     * Initialize all calculator instances
     */
    initializeCalculators() {
        try {
            // Initialize calculators with error handling
            this.basicCalculator = new BasicCalculator();
            console.log('✅ Basic Calculator initialized');
            
            this.advancedCalculator = new AdvancedCalculator();
            console.log('✅ Advanced Calculator initialized');
            
            // Only initialize scientific calculator if all dependencies are available
            console.log('Checking scientific calculator dependencies:');
            console.log('  ScientificCalculator:', typeof window.ScientificCalculator);
            console.log('  ScientificModes:', typeof window.ScientificModes);
            console.log('  ScientificFunctions:', typeof window.ScientificFunctions);
            
            if (typeof window.ScientificCalculator !== 'undefined' && 
                typeof window.ScientificModes !== 'undefined' && 
                typeof window.ScientificFunctions !== 'undefined') {
                try {
                    this.scientificCalculator = new window.ScientificCalculator();
                    if (this.scientificCalculator.isReady()) {
                        console.log('✅ Scientific Calculator initialized successfully');
                    } else {
                        console.warn('⚠️ Scientific Calculator created but not ready');
                        this.scientificCalculator = null;
                    }
                } catch (error) {
                    console.warn('⚠️ Scientific Calculator initialization failed:', error.message);
                    console.error('Full error:', error);
                    this.scientificCalculator = null;
                }
            } else {
                console.warn('⚠️ Scientific Calculator dependencies not available, skipping initialization');
                this.scientificCalculator = null;
            }
            
            this.isInitialized = true;
            console.log('✅ Calculator Manager initialized with all available modes');
        } catch (error) {
            console.error('❌ Failed to initialize calculators:', error);
            this.isInitialized = false;
            throw error;
        }
    }

    /**
     * Switch calculator mode
     * @param {string} mode - 'basic', 'advanced', or 'scientific'
     */
    switchMode(mode) {
        if (!['basic', 'advanced', 'scientific'].includes(mode)) {
            throw new Error('Invalid mode. Must be "basic", "advanced", or "scientific"');
        }

        if (!this.isInitialized) {
            throw new Error('Calculator Manager not initialized');
        }

        // Check if scientific mode is requested but not available
        if (mode === 'scientific' && !this.scientificCalculator) {
            console.warn('Scientific calculator not available, switching to advanced mode');
            mode = 'advanced';
        }

        this.currentMode = mode;
        console.log(`✅ Switched to ${mode} calculator mode`);
        
        // Trigger UI update
        this.updateUI();
        
        return this.currentMode;
    }

    /**
     * Get current mode
     * @returns {string} Current mode
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * Get current calculator instance
     * @returns {Object} Current calculator
     */
    getCurrentCalculator() {
        switch (this.currentMode) {
            case 'basic':
                return this.basicCalculator;
            case 'advanced':
                return this.advancedCalculator;
            case 'scientific':
                if (this.scientificCalculator) {
                    return this.scientificCalculator;
                } else {
                    console.warn('Scientific calculator not available, falling back to advanced');
                    return this.advancedCalculator;
                }
            default:
                return this.advancedCalculator; // Default to advanced instead of basic
        }
    }

    /**
     * Calculate using current mode
     * @param {string} input - Input expression or operation
     * @returns {Object} Calculation result
     */
    calculate(input) {
        if (!this.isInitialized) {
            throw new Error('Calculator Manager not initialized');
        }

        console.log('🧮 CalculatorManagerFixed.calculate called with:', input, 'mode:', this.currentMode);
        const calculator = this.getCurrentCalculator();
        console.log('🧮 Using calculator:', calculator.constructor.name);
        
        if (this.currentMode === 'basic') {
            console.log('🧮 Using basic calculation handler');
            return this.handleBasicCalculation(input, calculator);
        } else if (this.currentMode === 'advanced') {
            console.log('🧮 Using advanced calculation');
            try {
                const result = calculator.calculate(input);
                console.log('🧮 Advanced calculation result:', result);
                
                // Return simplified result for UI compatibility
                if (result.success) {
                    return {
                        success: true,
                        result: result.result,
                        display: result.formattedResult || result.result.toString(),
                        mode: this.currentMode
                    };
                } else {
                    return {
                        success: false,
                        error: result.error,
                        mode: this.currentMode
                    };
                }
            } catch (error) {
                console.error('🧮 Advanced calculation error:', error);
                return {
                    success: false,
                    error: error.message,
                    mode: this.currentMode
                };
            }
        } else if (this.currentMode === 'scientific') {
            console.log('🧮 Using scientific calculation');
            try {
                const result = calculator.calculate(input);
                console.log('🧮 Scientific calculation result:', result);
                
                // Return simplified result for UI compatibility
                if (result.success) {
                    return {
                        success: true,
                        result: result.result,
                        display: result.formattedResult || result.result.toString(),
                        mode: this.currentMode
                    };
                } else {
                    return {
                        success: false,
                        error: result.error,
                        mode: this.currentMode
                    };
                }
            } catch (error) {
                console.error('🧮 Scientific calculation error:', error);
                return {
                    success: false,
                    error: error.message,
                    mode: this.currentMode
                };
            }
        }
    }

    /**
     * Handle basic calculator operations
     * @param {string} input - Input operation
     * @param {Object} calculator - Basic calculator instance
     * @returns {Object} Result
     */
    handleBasicCalculation(input, calculator) {
        try {
            // Handle different types of basic calculator inputs
            if (this.isNumber(input)) {
                calculator.inputNumber(input);
            } else if (input === '.') {
                calculator.inputDecimal();
            } else if (this.isOperator(input)) {
                calculator.setOperator(input);
            } else if (input === '=') {
                calculator.calculate();
            } else if (input === 'C' || input === 'Clear') {
                calculator.clear();
            } else if (input === 'CE') {
                calculator.clearEntry();
            } else if (input === '⌫' || input === 'Backspace') {
                calculator.backspace();
            } else if (input === '√') {
                calculator.squareRoot();
            } else if (input === 'x²') {
                calculator.square();
            } else if (input === '1/x') {
                calculator.reciprocal();
            } else if (input === '+/-') {
                calculator.changeSign();
            } else if (input === '%') {
                calculator.percentage();
            } else if (input === 'MC') {
                calculator.memoryClear();
            } else if (input === 'MR') {
                calculator.memoryRecall();
            } else if (input === 'M+') {
                calculator.memoryAdd();
            } else if (input === 'M-') {
                calculator.memorySubtract();
            } else if (input === 'MS') {
                calculator.memoryStore();
            }

            return {
                success: true,
                result: calculator.getFormattedDisplay(),
                display: calculator.getDisplay(),
                mode: this.currentMode,
                state: calculator.getState()
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                mode: this.currentMode
            };
        }
    }

    /**
     * Check if input is a number
     * @param {string} input - Input to check
     * @returns {boolean} True if number
     */
    isNumber(input) {
        return /^[0-9]$/.test(input);
    }

    /**
     * Check if input is an operator
     * @param {string} input - Input to check
     * @returns {boolean} True if operator
     */
    isOperator(input) {
        return ['+', '-', '×', '*', '÷', '/', '%'].includes(input);
    }

    /**
     * Get display value from current calculator
     * @returns {string} Display value
     */
    getDisplay() {
        const calculator = this.getCurrentCalculator();
        return calculator.getFormattedDisplay();
    }

    /**
     * Get history from current calculator
     * @returns {Array} History array
     */
    getHistory() {
        const calculator = this.getCurrentCalculator();
        return calculator.getHistory();
    }

    /**
     * Clear history of current calculator
     */
    clearHistory() {
        const calculator = this.getCurrentCalculator();
        calculator.clearHistory();
    }

    /**
     * Reset current calculator
     */
    reset() {
        const calculator = this.getCurrentCalculator();
        calculator.reset();
    }

    /**
     * Get help for current mode
     * @returns {Object} Help information
     */
    getHelp() {
        const calculator = this.getCurrentCalculator();
        return {
            mode: this.currentMode,
            help: calculator.getHelp()
        };
    }

    /**
     * Get statistics for current calculator
     * @returns {Object} Statistics
     */
    getStatistics() {
        const calculator = this.getCurrentCalculator();
        
        if (this.currentMode === 'basic') {
            return {
                mode: 'basic',
                historyCount: calculator.getHistory().length,
                memory: calculator.memory,
                state: calculator.getState()
            };
        } else {
            return {
                mode: 'advanced',
                ...calculator.getStatistics()
            };
        }
    }

    /**
     * Update UI based on current mode
     */
    updateUI() {
        // This will be called by the UI to update the interface
        const event = new CustomEvent('calculatorModeChanged', {
            detail: {
                mode: this.currentMode,
                calculator: this.getCurrentCalculator()
            }
        });
        document.dispatchEvent(event);
    }
}

// Make available globally
window.CalculatorManagerFixed = CalculatorManagerFixed;
