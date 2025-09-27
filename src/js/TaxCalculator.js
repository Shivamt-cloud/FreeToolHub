/**
 * Professional Tax Calculator
 * Calculate income tax for different countries with progressive tax brackets
 */

class TaxCalculator {
    constructor() {
        this.history = [];
        this.currencies = {
            'USD': { symbol: '$', name: 'US Dollar', rate: 1.0 },
            'EUR': { symbol: '€', name: 'Euro', rate: 0.85 },
            'GBP': { symbol: '£', name: 'British Pound', rate: 0.73 },
            'JPY': { symbol: '¥', name: 'Japanese Yen', rate: 110.0 },
            'CAD': { symbol: 'C$', name: 'Canadian Dollar', rate: 1.25 },
            'AUD': { symbol: 'A$', name: 'Australian Dollar', rate: 1.35 },
            'CHF': { symbol: 'CHF', name: 'Swiss Franc', rate: 0.92 },
            'CNY': { symbol: '¥', name: 'Chinese Yuan', rate: 6.45 },
            'INR': { symbol: '₹', name: 'Indian Rupee', rate: 74.0 },
            'BRL': { symbol: 'R$', name: 'Brazilian Real', rate: 5.2 },
            'SGD': { symbol: 'S$', name: 'Singapore Dollar', rate: 1.35 },
            'AED': { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
            'SAR': { symbol: '﷼', name: 'Saudi Riyal', rate: 3.75 },
            'ZAR': { symbol: 'R', name: 'South African Rand', rate: 15.0 },
            'MXN': { symbol: '$', name: 'Mexican Peso', rate: 20.0 }
        };
        this.selectedCurrency = 'USD';
        
        // Tax brackets for different countries (2024 rates)
        this.taxBrackets = {
            'US': {
                'single': [
                    { min: 0, max: 11000, rate: 0.10 },
                    { min: 11000, max: 44725, rate: 0.12 },
                    { min: 44725, max: 95375, rate: 0.22 },
                    { min: 95375, max: 182050, rate: 0.24 },
                    { min: 182050, max: 231250, rate: 0.32 },
                    { min: 231250, max: 578125, rate: 0.35 },
                    { min: 578125, max: Infinity, rate: 0.37 }
                ],
                'married': [
                    { min: 0, max: 22000, rate: 0.10 },
                    { min: 22000, max: 89450, rate: 0.12 },
                    { min: 89450, max: 190750, rate: 0.22 },
                    { min: 190750, max: 364200, rate: 0.24 },
                    { min: 364200, max: 462500, rate: 0.32 },
                    { min: 462500, max: 693750, rate: 0.35 },
                    { min: 693750, max: Infinity, rate: 0.37 }
                ]
            },
            'UK': {
                'single': [
                    { min: 0, max: 12570, rate: 0.0 },
                    { min: 12570, max: 50270, rate: 0.20 },
                    { min: 50270, max: 125140, rate: 0.40 },
                    { min: 125140, max: Infinity, rate: 0.45 }
                ],
                'married': [
                    { min: 0, max: 12570, rate: 0.0 },
                    { min: 12570, max: 50270, rate: 0.20 },
                    { min: 50270, max: 125140, rate: 0.40 },
                    { min: 125140, max: Infinity, rate: 0.45 }
                ]
            },
            'CA': {
                'single': [
                    { min: 0, max: 53359, rate: 0.15 },
                    { min: 53359, max: 106717, rate: 0.205 },
                    { min: 106717, max: 165430, rate: 0.26 },
                    { min: 165430, max: 235675, rate: 0.29 },
                    { min: 235675, max: Infinity, rate: 0.33 }
                ],
                'married': [
                    { min: 0, max: 53359, rate: 0.15 },
                    { min: 53359, max: 106717, rate: 0.205 },
                    { min: 106717, max: 165430, rate: 0.26 },
                    { min: 165430, max: 235675, rate: 0.29 },
                    { min: 235675, max: Infinity, rate: 0.33 }
                ]
            },
            'AU': {
                'single': [
                    { min: 0, max: 18200, rate: 0.0 },
                    { min: 18200, max: 45000, rate: 0.19 },
                    { min: 45000, max: 120000, rate: 0.325 },
                    { min: 120000, max: 180000, rate: 0.37 },
                    { min: 180000, max: Infinity, rate: 0.45 }
                ],
                'married': [
                    { min: 0, max: 18200, rate: 0.0 },
                    { min: 18200, max: 45000, rate: 0.19 },
                    { min: 45000, max: 120000, rate: 0.325 },
                    { min: 120000, max: 180000, rate: 0.37 },
                    { min: 180000, max: Infinity, rate: 0.45 }
                ]
            },
            'IN': {
                'single': [
                    { min: 0, max: 300000, rate: 0.0 },
                    { min: 300000, max: 600000, rate: 0.05 },
                    { min: 600000, max: 900000, rate: 0.10 },
                    { min: 900000, max: 1200000, rate: 0.15 },
                    { min: 1200000, max: 1500000, rate: 0.20 },
                    { min: 1500000, max: Infinity, rate: 0.30 }
                ],
                'married': [
                    { min: 0, max: 300000, rate: 0.0 },
                    { min: 300000, max: 600000, rate: 0.05 },
                    { min: 600000, max: 900000, rate: 0.10 },
                    { min: 900000, max: 1200000, rate: 0.15 },
                    { min: 1200000, max: 1500000, rate: 0.20 },
                    { min: 1500000, max: Infinity, rate: 0.30 }
                ]
            }
        };
    }

    /**
     * Calculate income tax
     */
    calculateTax(income, country = 'US', filingStatus = 'single', deductions = 0) {
        try {
            const brackets = this.taxBrackets[country];
            if (!brackets) {
                return { success: false, error: 'Tax brackets not available for this country' };
            }

            const filingBrackets = brackets[filingStatus];
            if (!filingBrackets) {
                return { success: false, error: 'Filing status not supported for this country' };
            }

            const taxableIncome = Math.max(0, income - deductions);
            let totalTax = 0;
            let remainingIncome = taxableIncome;
            const bracketBreakdown = [];
            
            for (const bracket of filingBrackets) {
                if (remainingIncome <= 0) break;
                
                const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
                const taxInThisBracket = taxableInThisBracket * bracket.rate;
                
                totalTax += taxInThisBracket;
                remainingIncome -= taxableInThisBracket;
                
                bracketBreakdown.push({
                    bracket: `${this.formatCurrency(bracket.min)} - ${bracket.max === Infinity ? '∞' : this.formatCurrency(bracket.max)}`,
                    rate: bracket.rate * 100,
                    taxableAmount: taxableInThisBracket,
                    taxAmount: taxInThisBracket
                });
            }
            
            const effectiveRate = (totalTax / income) * 100;
            const marginalRate = this.getMarginalRate(taxableIncome, filingBrackets);
            const afterTaxIncome = income - totalTax;
            
            return {
                success: true,
                grossIncome: income,
                deductions: deductions,
                taxableIncome: taxableIncome,
                totalTax: totalTax,
                afterTaxIncome: afterTaxIncome,
                effectiveRate: effectiveRate,
                marginalRate: marginalRate,
                bracketBreakdown: bracketBreakdown
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get marginal tax rate
     */
    getMarginalRate(taxableIncome, brackets) {
        for (const bracket of brackets) {
            if (taxableIncome >= bracket.min && taxableIncome < bracket.max) {
                return bracket.rate * 100;
            }
        }
        return brackets[brackets.length - 1].rate * 100;
    }

    /**
     * Compare tax scenarios
     */
    compareTaxScenarios(scenarios) {
        try {
            const results = scenarios.map(scenario => {
                const result = this.calculateTax(
                    scenario.income, 
                    scenario.country, 
                    scenario.filingStatus, 
                    scenario.deductions || 0
                );
                
                if (result.success) {
                    return {
                        ...scenario,
                        ...result,
                        name: scenario.name || `${scenario.country} - ${scenario.filingStatus}`
                    };
                }
                return { ...scenario, error: result.error };
            });
            
            return {
                success: true,
                scenarios: results,
                bestScenario: results.reduce((best, current) => {
                    if (current.error) return best;
                    if (!best || current.totalTax < best.totalTax) return current;
                    return best;
                }, null)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate tax savings from deductions
     */
    calculateTaxSavings(income, country, filingStatus, additionalDeductions) {
        try {
            const withoutDeductions = this.calculateTax(income, country, filingStatus, 0);
            const withDeductions = this.calculateTax(income, country, filingStatus, additionalDeductions);
            
            if (!withoutDeductions.success || !withDeductions.success) {
                return { success: false, error: 'Tax calculation failed' };
            }
            
            const taxSavings = withoutDeductions.totalTax - withDeductions.totalTax;
            const effectiveDeductionRate = (taxSavings / additionalDeductions) * 100;
            
            return {
                success: true,
                taxSavings: taxSavings,
                effectiveDeductionRate: effectiveDeductionRate,
                withoutDeductions: withoutDeductions,
                withDeductions: withDeductions
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate take-home pay
     */
    calculateTakeHomePay(grossSalary, country, filingStatus, deductions = 0, otherDeductions = 0) {
        try {
            const taxResult = this.calculateTax(grossSalary, country, filingStatus, deductions);
            
            if (!taxResult.success) {
                return taxResult;
            }
            
            const takeHomePay = grossSalary - taxResult.totalTax - otherDeductions;
            const takeHomePercentage = (takeHomePay / grossSalary) * 100;
            
            return {
                success: true,
                grossSalary: grossSalary,
                incomeTax: taxResult.totalTax,
                otherDeductions: otherDeductions,
                takeHomePay: takeHomePay,
                takeHomePercentage: takeHomePercentage,
                taxResult: taxResult
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Set selected currency
     */
    setCurrency(currencyCode) {
        if (this.currencies[currencyCode]) {
            this.selectedCurrency = currencyCode;
            return true;
        }
        return false;
    }

    /**
     * Get selected currency info
     */
    getSelectedCurrency() {
        return this.currencies[this.selectedCurrency];
    }

    /**
     * Format currency with selected currency
     */
    formatCurrency(amount, currency = null) {
        const selectedCurrency = currency || this.selectedCurrency;
        const currencyInfo = this.currencies[selectedCurrency];
        
        if (!currencyInfo) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }

        // For currencies like JPY that don't use decimals
        const decimals = ['JPY', 'KRW'].includes(selectedCurrency) ? 0 : 0;
        
        return `${currencyInfo.symbol}${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount)}`;
    }

    /**
     * Format percentage
     */
    formatPercentage(value, decimals = 2) {
        return `${value.toFixed(decimals)}%`;
    }

    /**
     * Add to history
     */
    addToHistory(calculation) {
        this.history.unshift({
            ...calculation,
            timestamp: new Date()
        });
        
        // Keep only last 20 calculations
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }
    }

    /**
     * Get history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaxCalculator;
}
