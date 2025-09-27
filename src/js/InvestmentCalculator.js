/**
 * Professional Investment Calculator
 * Calculate investment returns, compound interest, and retirement planning
 */

class InvestmentCalculator {
    constructor() {
        this.history = [];
        this.inflationRate = 2.5; // Default inflation rate
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
     * Calculate compound interest investment
     */
    calculateInvestment(principal, monthlyContribution, annualRate, years, contributionFrequency = 12) {
        try {
            const monthlyRate = annualRate / 100 / contributionFrequency;
            const totalPeriods = years * contributionFrequency;
            
            // Future value of principal
            const principalFV = principal * Math.pow(1 + monthlyRate, totalPeriods);
            
            // Future value of monthly contributions (annuity)
            let contributionsFV = 0;
            if (monthlyContribution > 0) {
                contributionsFV = monthlyContribution * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);
            }
            
            const totalValue = principalFV + contributionsFV;
            const totalContributions = principal + (monthlyContribution * totalPeriods);
            const totalInterest = totalValue - totalContributions;
            
            return {
                success: true,
                totalValue: totalValue,
                totalContributions: totalContributions,
                totalInterest: totalInterest,
                principalFV: principalFV,
                contributionsFV: contributionsFV,
                roi: ((totalValue / totalContributions) - 1) * 100,
                annualizedReturn: (Math.pow(totalValue / totalContributions, 1/years) - 1) * 100
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate retirement planning
     */
    calculateRetirement(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, desiredIncome) {
        try {
            const yearsToRetirement = retirementAge - currentAge;
            const monthsToRetirement = yearsToRetirement * 12;
            const monthlyReturn = expectedReturn / 100 / 12;
            
            // Calculate future value of current savings
            const currentSavingsFV = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
            
            // Calculate future value of monthly contributions
            const contributionsFV = monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
            
            const totalRetirementFund = currentSavingsFV + contributionsFV;
            
            // Calculate if this is sufficient for desired income
            const monthlyWithdrawal = desiredIncome / 12;
            const requiredFund = monthlyWithdrawal * 300; // 25 years of retirement (300 months)
            
            const isSufficient = totalRetirementFund >= requiredFund;
            const shortfall = Math.max(0, requiredFund - totalRetirementFund);
            
            return {
                success: true,
                totalRetirementFund: totalRetirementFund,
                currentSavingsFV: currentSavingsFV,
                contributionsFV: contributionsFV,
                requiredFund: requiredFund,
                isSufficient: isSufficient,
                shortfall: shortfall,
                monthlyWithdrawal: monthlyWithdrawal,
                yearsToRetirement: yearsToRetirement
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate investment scenarios comparison
     */
    compareInvestmentScenarios(scenarios) {
        try {
            const results = scenarios.map(scenario => {
                const result = this.calculateInvestment(
                    scenario.principal, 
                    scenario.monthlyContribution, 
                    scenario.annualRate, 
                    scenario.years
                );
                
                if (result.success) {
                    return {
                        ...scenario,
                        ...result,
                        name: scenario.name || `Scenario ${scenarios.indexOf(scenario) + 1}`
                    };
                }
                return { ...scenario, error: result.error };
            });
            
            return {
                success: true,
                scenarios: results,
                bestScenario: results.reduce((best, current) => {
                    if (current.error) return best;
                    if (!best || current.totalValue > best.totalValue) return current;
                    return best;
                }, null)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate dollar-cost averaging
     */
    calculateDollarCostAveraging(monthlyInvestment, years, expectedReturn, volatility = 0.15) {
        try {
            const totalMonths = years * 12;
            const monthlyReturn = expectedReturn / 100 / 12;
            let totalShares = 0;
            let totalInvested = 0;
            
            // Simulate monthly investments with some volatility
            for (let month = 0; month < totalMonths; month++) {
                // Simulate price with some randomness (simplified)
                const priceVariation = 1 + (Math.random() - 0.5) * volatility;
                const currentPrice = 100 * priceVariation; // Base price of $100
                
                const sharesThisMonth = monthlyInvestment / currentPrice;
                totalShares += sharesThisMonth;
                totalInvested += monthlyInvestment;
            }
            
            const finalValue = totalShares * 100; // Final price back to $100
            const totalReturn = finalValue - totalInvested;
            const roi = (totalReturn / totalInvested) * 100;
            
            return {
                success: true,
                totalInvested: totalInvested,
                totalShares: totalShares,
                finalValue: finalValue,
                totalReturn: totalReturn,
                roi: roi,
                averagePrice: totalInvested / totalShares
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate inflation-adjusted returns
     */
    calculateInflationAdjustedReturn(nominalReturn, inflationRate, years) {
        try {
            const realReturn = ((1 + nominalReturn/100) / (1 + inflationRate/100) - 1) * 100;
            const realValue = 1000 * Math.pow(1 + realReturn/100, years);
            const nominalValue = 1000 * Math.pow(1 + nominalReturn/100, years);
            
            return {
                success: true,
                realReturn: realReturn,
                realValue: realValue,
                nominalValue: nominalValue,
                inflationImpact: nominalValue - realValue
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate required monthly contribution for target amount
     */
    calculateRequiredContribution(targetAmount, currentAge, retirementAge, currentSavings, expectedReturn) {
        try {
            const yearsToRetirement = retirementAge - currentAge;
            const monthsToRetirement = yearsToRetirement * 12;
            const monthlyReturn = expectedReturn / 100 / 12;
            
            // Future value of current savings
            const currentSavingsFV = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
            
            // Required future value from contributions
            const requiredFromContributions = targetAmount - currentSavingsFV;
            
            if (requiredFromContributions <= 0) {
                return {
                    success: true,
                    requiredMonthlyContribution: 0,
                    currentSavingsSufficient: true,
                    excessAmount: Math.abs(requiredFromContributions)
                };
            }
            
            // Calculate required monthly contribution
            const requiredMonthlyContribution = requiredFromContributions / 
                ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
            
            return {
                success: true,
                requiredMonthlyContribution: requiredMonthlyContribution,
                currentSavingsFV: currentSavingsFV,
                requiredFromContributions: requiredFromContributions,
                currentSavingsSufficient: false
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate investment growth projection
     */
    calculateGrowthProjection(principal, monthlyContribution, annualRate, years) {
        try {
            const monthlyRate = annualRate / 100 / 12;
            const totalMonths = years * 12;
            const projection = [];
            
            let currentValue = principal;
            
            for (let month = 0; month <= totalMonths; month += 12) { // Yearly projections
                if (month > 0) {
                    // Add monthly contributions and apply growth
                    for (let m = 0; m < 12; m++) {
                        currentValue += monthlyContribution;
                        currentValue *= (1 + monthlyRate);
                    }
                }
                
                projection.push({
                    year: month / 12,
                    value: currentValue,
                    contributions: principal + (month * monthlyContribution)
                });
            }
            
            return {
                success: true,
                projection: projection,
                finalValue: currentValue,
                totalContributions: principal + (totalMonths * monthlyContribution),
                totalGrowth: currentValue - (principal + (totalMonths * monthlyContribution))
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
    module.exports = InvestmentCalculator;
}
