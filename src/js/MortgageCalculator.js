/**
 * Professional Mortgage Calculator
 * Calculate mortgage payments, amortization, and refinancing scenarios
 */

class MortgageCalculator {
    constructor() {
        this.history = [];
        this.currencies = {
            'USD': { symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.0 },
            'EUR': { symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
            'GBP': { symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
            'JPY': { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 150.0 },
            'CAD': { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.36 },
            'AUD': { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52 },
            'CHF': { symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: 0.88 },
            'CNY': { symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 7.25 },
            'INR': { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 88.67 },
            'BRL': { symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', rate: 5.45 },
            'SGD': { symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.35 },
            'AED': { symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67 },
            'SAR': { symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦', rate: 3.75 },
            'ZAR': { symbol: 'R', name: 'South African Rand', flag: '🇿🇦', rate: 18.5 },
            'MXN': { symbol: '$', name: 'Mexican Peso', flag: '🇲🇽', rate: 17.2 },
            'KRW': { symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', rate: 1350.0 },
            'THB': { symbol: '฿', name: 'Thai Baht', flag: '🇹🇭', rate: 36.5 },
            'NZD': { symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', rate: 1.62 },
            'NOK': { symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴', rate: 10.8 },
            'SEK': { symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪', rate: 10.9 }
        };
        this.selectedCurrency = 'USD';
    }

    /**
     * Calculate mortgage payment
     */
    calculateMortgagePayment(loanAmount, interestRate, loanTerm, downPayment = 0, propertyTax = 0, insurance = 0, pmi = 0) {
        try {
            const principal = loanAmount - downPayment;
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;
            
            if (monthlyRate === 0) {
                // Handle zero interest rate
                const monthlyPayment = principal / numberOfPayments;
                const totalPayment = monthlyPayment * numberOfPayments;
                const totalInterest = 0;
                
                return {
                    success: true,
                    loanAmount: loanAmount,
                    downPayment: downPayment,
                    principal: principal,
                    interestRate: interestRate,
                    loanTerm: loanTerm,
                    monthlyPayment: monthlyPayment,
                    totalPayment: totalPayment,
                    totalInterest: totalInterest,
                    propertyTax: propertyTax,
                    insurance: insurance,
                    pmi: pmi,
                    totalMonthlyPayment: monthlyPayment + (propertyTax / 12) + (insurance / 12) + (pmi / 12)
                };
            }
            
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                                  (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            const totalPayment = monthlyPayment * numberOfPayments;
            const totalInterest = totalPayment - principal;
            
            return {
                success: true,
                loanAmount: loanAmount,
                downPayment: downPayment,
                principal: principal,
                interestRate: interestRate,
                loanTerm: loanTerm,
                monthlyPayment: monthlyPayment,
                totalPayment: totalPayment,
                totalInterest: totalInterest,
                propertyTax: propertyTax,
                insurance: insurance,
                pmi: pmi,
                totalMonthlyPayment: monthlyPayment + (propertyTax / 12) + (insurance / 12) + (pmi / 12)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate amortization schedule
     */
    calculateAmortizationSchedule(loanAmount, interestRate, loanTerm, downPayment = 0, extraPayment = 0) {
        try {
            const principal = loanAmount - downPayment;
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;
            
            let remainingBalance = principal;
            const schedule = [];
            let totalInterest = 0;
            
            for (let month = 1; month <= numberOfPayments; month++) {
                if (remainingBalance <= 0) break;
                
                const interestPayment = remainingBalance * monthlyRate;
                let principalPayment;
                
                if (monthlyRate === 0) {
                    principalPayment = principal / numberOfPayments;
                } else {
                    principalPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1) - interestPayment;
                }
                
                // Add extra payment
                const totalPayment = principalPayment + interestPayment + extraPayment;
                const actualPrincipalPayment = Math.min(principalPayment + extraPayment, remainingBalance);
                
                remainingBalance -= actualPrincipalPayment;
                totalInterest += interestPayment;
                
                schedule.push({
                    month: month,
                    payment: totalPayment,
                    principal: actualPrincipalPayment,
                    interest: interestPayment,
                    balance: Math.max(0, remainingBalance)
                });
                
                if (remainingBalance <= 0) break;
            }
            
            return {
                success: true,
                loanAmount: loanAmount,
                downPayment: downPayment,
                principal: principal,
                interestRate: interestRate,
                loanTerm: loanTerm,
                extraPayment: extraPayment,
                totalInterest: totalInterest,
                schedule: schedule,
                totalPayments: schedule.length
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate refinancing analysis
     */
    calculateRefinancing(currentLoan, newRate, newTerm, closingCosts) {
        try {
            const currentPayment = this.calculateMortgagePayment(
                currentLoan.loanAmount, 
                currentLoan.interestRate, 
                currentLoan.loanTerm, 
                currentLoan.downPayment
            );
            
            const newPayment = this.calculateMortgagePayment(
                currentLoan.loanAmount, 
                newRate, 
                newTerm, 
                currentLoan.downPayment
            );
            
            const monthlySavings = currentPayment.monthlyPayment - newPayment.monthlyPayment;
            const breakEvenMonths = closingCosts / monthlySavings;
            const totalSavings = monthlySavings * (newTerm * 12) - closingCosts;
            
            return {
                success: true,
                currentPayment: currentPayment.monthlyPayment,
                newPayment: newPayment.monthlyPayment,
                monthlySavings: monthlySavings,
                breakEvenMonths: breakEvenMonths,
                totalSavings: totalSavings,
                closingCosts: closingCosts,
                refinancingWorthIt: totalSavings > 0
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate affordability
     */
    calculateAffordability(income, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate = 1.2, insuranceRate = 0.5) {
        try {
            const monthlyIncome = income / 12;
            const maxPayment = (monthlyIncome * 0.28) - monthlyDebts; // 28% rule
            const maxPaymentWithDebt = (monthlyIncome * 0.36) - monthlyDebts; // 36% rule
            
            // Calculate maximum loan amount
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;
            
            let maxLoanAmount;
            if (monthlyRate === 0) {
                maxLoanAmount = maxPayment * numberOfPayments;
            } else {
                maxLoanAmount = maxPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
                              (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
            }
            
            const maxHomePrice = maxLoanAmount + downPayment;
            const maxHomePriceWithDebt = (maxPaymentWithDebt * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
                                        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) + downPayment;
            
            return {
                success: true,
                income: income,
                monthlyIncome: monthlyIncome,
                monthlyDebts: monthlyDebts,
                downPayment: downPayment,
                maxPayment: maxPayment,
                maxPaymentWithDebt: maxPaymentWithDebt,
                maxLoanAmount: maxLoanAmount,
                maxHomePrice: maxHomePrice,
                maxHomePriceWithDebt: maxHomePriceWithDebt,
                debtToIncomeRatio: (monthlyDebts / monthlyIncome) * 100,
                recommendedMaxPayment: maxPayment
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate bi-weekly payments
     */
    calculateBiWeeklyPayment(loanAmount, interestRate, loanTerm, downPayment = 0) {
        try {
            const principal = loanAmount - downPayment;
            const biWeeklyRate = interestRate / 100 / 26; // 26 bi-weekly periods per year
            const numberOfPayments = loanTerm * 26;
            
            let biWeeklyPayment;
            if (biWeeklyRate === 0) {
                biWeeklyPayment = principal / numberOfPayments;
            } else {
                biWeeklyPayment = principal * (biWeeklyRate * Math.pow(1 + biWeeklyRate, numberOfPayments)) / 
                                (Math.pow(1 + biWeeklyRate, numberOfPayments) - 1);
            }
            
            const totalPayment = biWeeklyPayment * numberOfPayments;
            const totalInterest = totalPayment - principal;
            const savings = this.calculateMortgagePayment(loanAmount, interestRate, loanTerm, downPayment).totalPayment - totalPayment;
            
            return {
                success: true,
                loanAmount: loanAmount,
                downPayment: downPayment,
                principal: principal,
                interestRate: interestRate,
                loanTerm: loanTerm,
                biWeeklyPayment: biWeeklyPayment,
                totalPayment: totalPayment,
                totalInterest: totalInterest,
                savings: savings,
                timeSaved: (loanTerm * 12) - (numberOfPayments / 2) // months saved
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate ARM (Adjustable Rate Mortgage) payments
     */
    calculateARMPayments(loanAmount, initialRate, adjustmentPeriod, rateCap, loanTerm, downPayment = 0) {
        try {
            const principal = loanAmount - downPayment;
            const numberOfPayments = loanTerm * 12;
            const schedule = [];
            
            let currentRate = initialRate;
            let remainingBalance = principal;
            
            for (let month = 1; month <= numberOfPayments; month++) {
                if (remainingBalance <= 0) break;
                
                // Adjust rate every adjustmentPeriod months
                if (month % adjustmentPeriod === 0 && month > adjustmentPeriod) {
                    // Simulate rate adjustment (in real scenario, this would be based on index + margin)
                    const rateChange = (Math.random() - 0.5) * 2; // ±1% change
                    currentRate = Math.max(0, Math.min(rateCap, currentRate + rateChange));
                }
                
                const monthlyRate = currentRate / 100 / 12;
                let monthlyPayment;
                
                if (monthlyRate === 0) {
                    monthlyPayment = principal / numberOfPayments;
                } else {
                    const remainingPayments = numberOfPayments - month + 1;
                    monthlyPayment = remainingBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments)) / 
                                   (Math.pow(1 + monthlyRate, remainingPayments) - 1);
                }
                
                const interestPayment = remainingBalance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                
                remainingBalance -= principalPayment;
                
                schedule.push({
                    month: month,
                    rate: currentRate,
                    payment: monthlyPayment,
                    principal: principalPayment,
                    interest: interestPayment,
                    balance: Math.max(0, remainingBalance)
                });
            }
            
            return {
                success: true,
                loanAmount: loanAmount,
                downPayment: downPayment,
                principal: principal,
                initialRate: initialRate,
                adjustmentPeriod: adjustmentPeriod,
                rateCap: rateCap,
                loanTerm: loanTerm,
                schedule: schedule,
                totalPayments: schedule.length
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
    module.exports = MortgageCalculator;
}
