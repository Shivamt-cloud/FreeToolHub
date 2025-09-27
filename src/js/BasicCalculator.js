/**
 * BasicCalculator.js - Simple calculator for basic arithmetic operations
 * 
 * This module provides a straightforward calculator interface for basic math operations
 * like addition, subtraction, multiplication, division, and simple functions.
 * Perfect for students and users who need simple calculations.
 */

class BasicCalculator {
    constructor() {
        this.display = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.history = [];
        this.memory = 0;
        this.isInitialized = true;
        
        console.log('✅ Basic Calculator initialized successfully');
    }

    /**
     * Input a number
     * @param {string} num - Number to input
     */
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.display = num;
            this.waitingForOperand = false;
        } else {
            this.display = this.display === '0' ? num : this.display + num;
        }
    }

    /**
     * Input a decimal point
     */
    inputDecimal() {
        if (this.waitingForOperand) {
            this.display = '0.';
            this.waitingForOperand = false;
        } else if (this.display.indexOf('.') === -1) {
            this.display += '.';
        }
    }

    /**
     * Clear the display
     */
    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
    }

    /**
     * Clear entry (CE)
     */
    clearEntry() {
        this.display = '0';
    }

    /**
     * Delete last character
     */
    backspace() {
        if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
        } else {
            this.display = '0';
        }
    }

    /**
     * Set operator
     * @param {string} nextOperator - Operator to set
     */
    setOperator(nextOperator) {
        const inputValue = parseFloat(this.display);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);

            this.display = String(newValue);
            this.previousValue = newValue;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    }

    /**
     * Perform calculation
     * @param {number} firstValue - First operand
     * @param {number} secondValue - Second operand
     * @param {string} operator - Operator
     * @returns {number} Result
     */
    performCalculation(firstValue, secondValue, operator) {
        switch (operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
            case '*':
                return firstValue * secondValue;
            case '÷':
            case '/':
                if (secondValue === 0) {
                    throw new Error('Division by zero');
                }
                return firstValue / secondValue;
            case '%':
                if (secondValue === 0) {
                    throw new Error('Modulo by zero');
                }
                return firstValue % secondValue;
            default:
                return secondValue;
        }
    }

    /**
     * Calculate result
     */
    calculate() {
        const inputValue = parseFloat(this.display);

        if (this.previousValue !== null && this.operator) {
            const newValue = this.performCalculation(this.previousValue, inputValue, this.operator);
            
            // Add to history
            this.addToHistory(`${this.previousValue} ${this.operator} ${inputValue} = ${newValue}`);
            
            this.display = String(newValue);
            this.previousValue = null;
            this.operator = null;
            this.waitingForOperand = true;
        }
    }

    /**
     * Add calculation to history
     * @param {string} calculation - Calculation string
     */
    addToHistory(calculation) {
        this.history.push({
            calculation: calculation,
            timestamp: new Date(),
            result: this.display
        });
        
        // Keep only last 50 calculations
        if (this.history.length > 50) {
            this.history.shift();
        }
    }

    /**
     * Get calculation history
     * @returns {Array} History array
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Memory functions
     */
    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.display = String(this.memory);
        this.waitingForOperand = true;
    }

    memoryAdd() {
        this.memory += parseFloat(this.display);
    }

    memorySubtract() {
        this.memory -= parseFloat(this.display);
    }

    memoryStore() {
        this.memory = parseFloat(this.display);
    }

    /**
     * Percentage calculation
     */
    percentage() {
        const value = parseFloat(this.display);
        this.display = String(value / 100);
        this.waitingForOperand = true;
    }

    /**
     * Square root
     */
    squareRoot() {
        const value = parseFloat(this.display);
        if (value < 0) {
            throw new Error('Square root of negative number');
        }
        this.display = String(Math.sqrt(value));
        this.addToHistory(`√${value} = ${this.display}`);
        this.waitingForOperand = true;
    }

    /**
     * Square
     */
    square() {
        const value = parseFloat(this.display);
        this.display = String(value * value);
        this.addToHistory(`${value}² = ${this.display}`);
        this.waitingForOperand = true;
    }

    /**
     * Reciprocal (1/x)
     */
    reciprocal() {
        const value = parseFloat(this.display);
        if (value === 0) {
            throw new Error('Division by zero');
        }
        this.display = String(1 / value);
        this.addToHistory(`1/${value} = ${this.display}`);
        this.waitingForOperand = true;
    }

    /**
     * Change sign (+/-)
     */
    changeSign() {
        const value = parseFloat(this.display);
        this.display = String(-value);
    }

    /**
     * Get current display value
     * @returns {string} Display value
     */
    getDisplay() {
        return this.display;
    }

    /**
     * Set display value
     * @param {string} value - Value to set
     */
    setDisplay(value) {
        this.display = String(value);
    }

    /**
     * Format display value
     * @returns {string} Formatted display value
     */
    getFormattedDisplay() {
        const value = parseFloat(this.display);
        
        if (isNaN(value)) {
            return 'Error';
        }
        
        if (!isFinite(value)) {
            return value > 0 ? '∞' : '-∞';
        }
        
        // Format large numbers with commas
        if (Math.abs(value) >= 1000) {
            return value.toLocaleString();
        }
        
        // Remove trailing zeros for decimals
        return parseFloat(this.display).toString();
    }

    /**
     * Get calculator state
     * @returns {Object} Current state
     */
    getState() {
        return {
            display: this.display,
            previousValue: this.previousValue,
            operator: this.operator,
            waitingForOperand: this.waitingForOperand,
            memory: this.memory,
            historyCount: this.history.length
        };
    }

    /**
     * Reset calculator to initial state
     */
    reset() {
        this.clear();
        this.clearHistory();
        this.memoryClear();
        console.log('✅ Basic Calculator reset to initial state');
    }

    /**
     * Get help information
     * @returns {Object} Help information
     */
    getHelp() {
        return {
            operations: ['+', '-', '×', '÷', '%'],
            functions: ['√', 'x²', '1/x', '+/-', '%'],
            memory: ['MC', 'MR', 'M+', 'M-', 'MS'],
            shortcuts: {
                'Enter': 'Calculate',
                'Escape': 'Clear',
                'Delete': 'Backspace'
            }
        };
    }
}

// Make available globally
window.BasicCalculator = BasicCalculator;
