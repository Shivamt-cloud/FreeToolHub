/**
 * Modal Manager Class - Handles all modal operations
 */
class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGlobalFunctions());
        } else {
            this.setupGlobalFunctions();
        }
    }

    setupGlobalFunctions() {
        // Make modal functions globally available
        window.openModal = (modalId) => this.openModal(modalId);
        window.closeModal = (modalId) => this.closeModal(modalId);
        
        // Smart Calculator functions are handled by CalculatorManager (ES6 modules)
        // Smart BMI Calculator functions are handled by SmartBMICalculator
        // Smart Unit Converter functions are handled by SmartUnitConverter
        
        console.log('✅ Modal functions and tool functions initialized globally');
    }

    openModal(modalId) {
        console.log('Opening modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            console.log('Modal opened successfully');
            
            // Initialize tool-specific functionality when modal opens
            this.initializeTool(modalId);
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            console.log('Modal closed successfully');
        }
    }

    initializeTool(modalId) {
        // Initialize tool-specific functionality when modal opens
        switch (modalId) {
            case 'calculator-modal':
                if (!window.calculator) {
                    window.calculator = new Calculator();
                }
                break;
            case 'bmi-modal':
                if (!window.bmiCalculator) {
                    window.bmiCalculator = new BMICalculator();
                }
                break;
            case 'unit-converter-modal':
                if (!window.unitConverter) {
                    window.unitConverter = new UnitConverter();
                }
                break;
        }
    }
}

// Initialize modal manager when script loads
window.ModalManager = ModalManager;
