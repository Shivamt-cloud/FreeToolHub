/**
 * Professional Salary Calculator
 * Calculate take-home pay, benefits, and salary comparisons
 */

class SalaryCalculator {
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
     * Calculate take-home pay (US)
     */
    calculateTakeHomePayUS(grossSalary, filingStatus = 'single', state = 'CA', allowances = 0, preTaxDeductions = 0, postTaxDeductions = 0) {
        try {
            // Federal tax brackets 2024
            const federalBrackets = {
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
            };

            const taxableIncome = grossSalary - preTaxDeductions;
            const federalTax = this.calculateProgressiveTax(taxableIncome, federalBrackets[filingStatus]);
            
            // FICA taxes (Social Security + Medicare)
            const socialSecurityTax = Math.min(taxableIncome * 0.062, 160200 * 0.062); // 6.2% up to wage base
            const medicareTax = taxableIncome * 0.0145; // 1.45%
            const additionalMedicareTax = taxableIncome > 200000 ? (taxableIncome - 200000) * 0.009 : 0; // 0.9% for high earners
            
            const ficaTax = socialSecurityTax + medicareTax + additionalMedicareTax;
            
            // State tax (simplified - using CA as example)
            const stateTax = this.calculateStateTax(taxableIncome, state);
            
            const totalTaxes = federalTax + ficaTax + stateTax;
            const netPay = grossSalary - totalTaxes - postTaxDeductions;
            
            return {
                success: true,
                grossSalary: grossSalary,
                preTaxDeductions: preTaxDeductions,
                postTaxDeductions: postTaxDeductions,
                taxableIncome: taxableIncome,
                federalTax: federalTax,
                stateTax: stateTax,
                ficaTax: ficaTax,
                socialSecurityTax: socialSecurityTax,
                medicareTax: medicareTax,
                additionalMedicareTax: additionalMedicareTax,
                totalTaxes: totalTaxes,
                netPay: netPay,
                effectiveTaxRate: (totalTaxes / grossSalary) * 100,
                marginalTaxRate: this.getMarginalTaxRate(taxableIncome, federalBrackets[filingStatus])
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate salary comparison
     */
    calculateSalaryComparison(salary1, salary2, benefits1 = 0, benefits2 = 0, currency = 'USD') {
        try {
            const totalCompensation1 = salary1 + benefits1;
            const totalCompensation2 = salary2 + benefits2;
            const difference = totalCompensation2 - totalCompensation1;
            const percentageDifference = (difference / totalCompensation1) * 100;
            
            return {
                success: true,
                salary1: salary1,
                salary2: salary2,
                benefits1: benefits1,
                benefits2: benefits2,
                totalCompensation1: totalCompensation1,
                totalCompensation2: totalCompensation2,
                difference: difference,
                percentageDifference: percentageDifference,
                betterOffer: totalCompensation2 > totalCompensation1 ? 'Offer 2' : 'Offer 1'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate hourly to salary conversion
     */
    calculateHourlyToSalary(hourlyRate, hoursPerWeek = 40, weeksPerYear = 52) {
        try {
            const annualSalary = hourlyRate * hoursPerWeek * weeksPerYear;
            const monthlySalary = annualSalary / 12;
            const weeklySalary = annualSalary / 52;
            const dailySalary = annualSalary / 365;
            
            return {
                success: true,
                hourlyRate: hourlyRate,
                hoursPerWeek: hoursPerWeek,
                weeksPerYear: weeksPerYear,
                annualSalary: annualSalary,
                monthlySalary: monthlySalary,
                weeklySalary: weeklySalary,
                dailySalary: dailySalary
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate salary to hourly conversion
     */
    calculateSalaryToHourly(annualSalary, hoursPerWeek = 40, weeksPerYear = 52) {
        try {
            const hourlyRate = annualSalary / (hoursPerWeek * weeksPerYear);
            const monthlySalary = annualSalary / 12;
            const weeklySalary = annualSalary / 52;
            const dailySalary = annualSalary / 365;
            
            return {
                success: true,
                annualSalary: annualSalary,
                hoursPerWeek: hoursPerWeek,
                weeksPerYear: weeksPerYear,
                hourlyRate: hourlyRate,
                monthlySalary: monthlySalary,
                weeklySalary: weeklySalary,
                dailySalary: dailySalary
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate salary increase
     */
    calculateSalaryIncrease(currentSalary, newSalary, timePeriod = 1) {
        try {
            const increase = newSalary - currentSalary;
            const percentageIncrease = (increase / currentSalary) * 100;
            const annualizedIncrease = percentageIncrease / timePeriod;
            const monthlyIncrease = increase / (timePeriod * 12);
            
            return {
                success: true,
                currentSalary: currentSalary,
                newSalary: newSalary,
                increase: increase,
                percentageIncrease: percentageIncrease,
                annualizedIncrease: annualizedIncrease,
                monthlyIncrease: monthlyIncrease,
                timePeriod: timePeriod
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate benefits value
     */
    calculateBenefitsValue(baseSalary, benefits) {
        try {
            const totalBenefits = benefits.reduce((sum, benefit) => sum + benefit.value, 0);
            const totalCompensation = baseSalary + totalBenefits;
            const benefitsPercentage = (totalBenefits / totalCompensation) * 100;
            
            const benefitsBreakdown = benefits.map(benefit => ({
                name: benefit.name,
                value: benefit.value,
                percentage: (benefit.value / totalCompensation) * 100
            }));
            
            return {
                success: true,
                baseSalary: baseSalary,
                totalBenefits: totalBenefits,
                totalCompensation: totalCompensation,
                benefitsPercentage: benefitsPercentage,
                benefitsBreakdown: benefitsBreakdown
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate salary negotiation
     */
    calculateSalaryNegotiation(currentSalary, targetSalary, negotiationPoints = []) {
        try {
            const difference = targetSalary - currentSalary;
            const percentageIncrease = (difference / currentSalary) * 100;
            
            const negotiationStrategy = this.getNegotiationStrategy(percentageIncrease);
            const talkingPoints = this.getTalkingPoints(negotiationPoints);
            
            return {
                success: true,
                currentSalary: currentSalary,
                targetSalary: targetSalary,
                difference: difference,
                percentageIncrease: percentageIncrease,
                negotiationStrategy: negotiationStrategy,
                talkingPoints: talkingPoints
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate progressive tax
     */
    calculateProgressiveTax(income, brackets) {
        let tax = 0;
        let remainingIncome = income;
        
        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            tax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }
        
        return tax;
    }

    /**
     * Calculate state tax (simplified)
     */
    calculateStateTax(income, state) {
        // Simplified state tax calculation
        const stateRates = {
            'CA': 0.093, // California
            'NY': 0.088, // New York
            'TX': 0.0,   // Texas (no state income tax)
            'FL': 0.0,   // Florida (no state income tax)
            'WA': 0.0,   // Washington (no state income tax)
            'NV': 0.0,   // Nevada (no state income tax)
            'SD': 0.0,   // South Dakota (no state income tax)
            'TN': 0.0,   // Tennessee (no state income tax)
            'WY': 0.0    // Wyoming (no state income tax)
        };
        
        const rate = stateRates[state] || 0.05; // Default 5% if state not found
        return income * rate;
    }

    /**
     * Get marginal tax rate
     */
    getMarginalTaxRate(income, brackets) {
        for (const bracket of brackets) {
            if (income >= bracket.min && income < bracket.max) {
                return bracket.rate * 100;
            }
        }
        return brackets[brackets.length - 1].rate * 100;
    }

    /**
     * Get negotiation strategy
     */
    getNegotiationStrategy(percentageIncrease) {
        if (percentageIncrease <= 5) {
            return 'Conservative approach - focus on performance and market data';
        } else if (percentageIncrease <= 15) {
            return 'Moderate approach - highlight achievements and market research';
        } else if (percentageIncrease <= 25) {
            return 'Aggressive approach - emphasize unique value and market demand';
        } else {
            return 'Very aggressive approach - consider multiple offers and leverage';
        }
    }

    /**
     * Get talking points
     */
    getTalkingPoints(negotiationPoints) {
        const points = [
            'Market research showing salary ranges for your role',
            'Specific achievements and contributions to the company',
            'Additional responsibilities you\'ve taken on',
            'Industry certifications or skills you\'ve gained',
            'Cost of living increases in your area',
            'Performance metrics and results you\'ve delivered'
        ];
        
        return points.filter((_, index) => negotiationPoints.includes(index));
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
    module.exports = SalaryCalculator;
}
