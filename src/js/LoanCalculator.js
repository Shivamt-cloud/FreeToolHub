/**
 * Professional Loan Calculator
 * Calculate loan payments, amortization schedules, and loan analysis
 */

class LoanCalculator {
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
    }

    /**
     * Calculate loan payment details
     */
    calculateLoan(principal, annualRate, years, paymentFrequency = 12) {
        try {
            const monthlyRate = annualRate / 100 / paymentFrequency;
            const totalPayments = years * paymentFrequency;
            
            if (monthlyRate === 0) {
                // No interest case
                const monthlyPayment = principal / totalPayments;
                return {
                    success: true,
                    monthlyPayment: monthlyPayment,
                    totalPayments: totalPayments,
                    totalInterest: 0,
                    totalAmount: principal,
                    amortizationSchedule: this.generateAmortizationSchedule(principal, 0, totalPayments, monthlyPayment)
                };
            }
            
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                                 (Math.pow(1 + monthlyRate, totalPayments) - 1);
            
            const totalAmount = monthlyPayment * totalPayments;
            const totalInterest = totalAmount - principal;
            
            return {
                success: true,
                monthlyPayment: monthlyPayment,
                totalPayments: totalPayments,
                totalInterest: totalInterest,
                totalAmount: totalAmount,
                amortizationSchedule: this.generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate detailed amortization schedule
     */
    generateAmortizationSchedule(principal, monthlyRate, totalPayments, monthlyPayment) {
        const schedule = [];
        let remainingBalance = principal;
        
        for (let i = 1; i <= totalPayments; i++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            remainingBalance -= principalPayment;
            
            schedule.push({
                payment: i,
                paymentAmount: monthlyPayment,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                remainingBalance: Math.max(0, remainingBalance)
            });
            
            if (remainingBalance <= 0.01) break; // Avoid floating point errors
        }
        
        return schedule;
    }

    /**
     * Calculate extra payment scenarios
     */
    calculateExtraPayment(principal, annualRate, years, extraPayment, paymentFrequency = 12) {
        try {
            const monthlyRate = annualRate / 100 / paymentFrequency;
            const totalPayments = years * paymentFrequency;
            
            if (monthlyRate === 0) {
                const regularPayment = principal / totalPayments;
                const newPayment = regularPayment + extraPayment;
                const newTotalPayments = Math.ceil(principal / newPayment);
                
                return {
                    success: true,
                    originalPayment: regularPayment,
                    newPayment: newPayment,
                    originalTotalPayments: totalPayments,
                    newTotalPayments: newTotalPayments,
                    timeSaved: totalPayments - newTotalPayments,
                    interestSaved: 0
                };
            }
            
            const regularPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                                 (Math.pow(1 + monthlyRate, totalPayments) - 1);
            
            const newPayment = regularPayment + extraPayment;
            
            // Calculate new payoff time with extra payments
            let balance = principal;
            let paymentCount = 0;
            let totalInterestPaid = 0;
            
            while (balance > 0.01 && paymentCount < totalPayments * 2) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = Math.min(newPayment - interestPayment, balance);
                
                totalInterestPaid += interestPayment;
                balance -= principalPayment;
                paymentCount++;
            }
            
            const originalTotalInterest = (regularPayment * totalPayments) - principal;
            const interestSaved = originalTotalInterest - totalInterestPaid;
            
            return {
                success: true,
                originalPayment: regularPayment,
                newPayment: newPayment,
                originalTotalPayments: totalPayments,
                newTotalPayments: paymentCount,
                timeSaved: totalPayments - paymentCount,
                interestSaved: interestSaved
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Compare loan scenarios
     */
    compareLoans(loans) {
        try {
            const comparisons = loans.map(loan => {
                const result = this.calculateLoan(loan.principal, loan.rate, loan.years, loan.frequency);
                if (result.success) {
                    return {
                        ...loan,
                        ...result,
                        monthlyPayment: result.monthlyPayment,
                        totalInterest: result.totalInterest,
                        totalAmount: result.totalAmount
                    };
                }
                return { ...loan, error: result.error };
            });
            
            return {
                success: true,
                comparisons: comparisons,
                bestOption: comparisons.reduce((best, current) => {
                    if (current.error) return best;
                    if (!best || current.totalAmount < best.totalAmount) return current;
                    return best;
                }, null)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate refinancing scenarios
     */
    calculateRefinancing(currentBalance, currentRate, currentYears, newRate, newYears, closingCosts = 0) {
        try {
            // Calculate remaining payments on current loan
            const currentResult = this.calculateLoan(currentBalance, currentRate, currentYears);
            if (!currentResult.success) return currentResult;
            
            // Calculate new loan
            const newResult = this.calculateLoan(currentBalance + closingCosts, newRate, newYears);
            if (!newResult.success) return newResult;
            
            const monthlySavings = currentResult.monthlyPayment - newResult.monthlyPayment;
            const totalSavings = (currentResult.totalAmount - newResult.totalAmount) - closingCosts;
            const breakEvenMonths = closingCosts / monthlySavings;
            
            return {
                success: true,
                currentLoan: currentResult,
                newLoan: newResult,
                monthlySavings: monthlySavings,
                totalSavings: totalSavings,
                breakEvenMonths: breakEvenMonths,
                isWorthIt: totalSavings > 0
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
     * Convert amount between currencies
     */
    convertCurrency(amount, fromCurrency, toCurrency) {
        if (!this.currencies[fromCurrency] || !this.currencies[toCurrency]) {
            return amount;
        }
        
        // Convert to USD first, then to target currency
        const usdAmount = amount / this.currencies[fromCurrency].rate;
        return usdAmount * this.currencies[toCurrency].rate;
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
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }

        // For currencies like JPY that don't use decimals
        const decimals = ['JPY', 'KRW'].includes(selectedCurrency) ? 0 : 2;
        
        return `${currencyInfo.symbol}${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount)}`;
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
    module.exports = LoanCalculator;
}
