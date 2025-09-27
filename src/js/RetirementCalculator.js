/**
 * Professional Retirement Planning Calculator
 * Calculate retirement savings, income, and planning scenarios
 */

class RetirementCalculator {
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
     * Calculate retirement savings goal
     */
    calculateRetirementGoal(currentAge, retirementAge, currentSalary, replacementRatio, inflationRate, investmentReturn) {
        try {
            const yearsToRetirement = retirementAge - currentAge;
            const finalSalary = currentSalary * Math.pow(1 + inflationRate / 100, yearsToRetirement);
            const annualRetirementIncome = finalSalary * (replacementRatio / 100);
            const retirementDuration = 25; // Assume 25 years in retirement
            const totalNeeded = annualRetirementIncome * retirementDuration;
            
            // Present value calculation
            const presentValue = totalNeeded / Math.pow(1 + investmentReturn / 100, yearsToRetirement);
            
            return {
                success: true,
                currentAge: currentAge,
                retirementAge: retirementAge,
                yearsToRetirement: yearsToRetirement,
                currentSalary: currentSalary,
                finalSalary: finalSalary,
                annualRetirementIncome: annualRetirementIncome,
                totalRetirementGoal: totalNeeded,
                presentValueGoal: presentValue,
                monthlyContribution: presentValue / (yearsToRetirement * 12)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate retirement savings projection
     */
    calculateRetirementProjection(currentSavings, monthlyContribution, yearsToRetirement, annualReturn, inflationRate) {
        try {
            const monthlyReturn = annualReturn / 12 / 100;
            const monthlyInflation = inflationRate / 12 / 100;
            const totalMonths = yearsToRetirement * 12;
            
            let projectedSavings = currentSavings;
            const monthlyProjections = [];
            
            for (let month = 0; month <= totalMonths; month += 12) {
                const year = month / 12;
                const futureValue = projectedSavings * Math.pow(1 + monthlyReturn, 12);
                const realValue = futureValue / Math.pow(1 + monthlyInflation, 12);
                
                monthlyProjections.push({
                    year: year,
                    nominalValue: futureValue,
                    realValue: realValue,
                    contributions: month * monthlyContribution
                });
                
                projectedSavings = futureValue + (monthlyContribution * 12);
            }
            
            return {
                success: true,
                currentSavings: currentSavings,
                monthlyContribution: monthlyContribution,
                yearsToRetirement: yearsToRetirement,
                finalProjectedSavings: projectedSavings,
                totalContributions: monthlyContribution * totalMonths,
                totalGrowth: projectedSavings - currentSavings - (monthlyContribution * totalMonths),
                projections: monthlyProjections
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate retirement income scenarios
     */
    calculateRetirementIncome(retirementSavings, retirementAge, lifeExpectancy, inflationRate, withdrawalRate) {
        try {
            const retirementDuration = lifeExpectancy - retirementAge;
            const annualWithdrawal = retirementSavings * (withdrawalRate / 100);
            const monthlyWithdrawal = annualWithdrawal / 12;
            
            const incomeScenarios = [];
            for (let year = 0; year <= retirementDuration; year++) {
                const adjustedWithdrawal = annualWithdrawal * Math.pow(1 + inflationRate / 100, year);
                incomeScenarios.push({
                    year: year,
                    age: retirementAge + year,
                    annualIncome: adjustedWithdrawal,
                    monthlyIncome: adjustedWithdrawal / 12,
                    remainingSavings: Math.max(0, retirementSavings - (annualWithdrawal * year))
                });
            }
            
            return {
                success: true,
                retirementSavings: retirementSavings,
                retirementAge: retirementAge,
                lifeExpectancy: lifeExpectancy,
                retirementDuration: retirementDuration,
                annualWithdrawal: annualWithdrawal,
                monthlyWithdrawal: monthlyWithdrawal,
                withdrawalRate: withdrawalRate,
                incomeScenarios: incomeScenarios
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate 401k/IRA contribution limits
     */
    calculateContributionLimits(age, income, contributionType = '401k') {
        try {
            let annualLimit, catchUpLimit;
            
            if (contributionType === '401k') {
                annualLimit = 23000; // 2024 limit
                catchUpLimit = 7500; // 2024 catch-up for 50+
            } else if (contributionType === 'IRA') {
                annualLimit = 7000; // 2024 limit
                catchUpLimit = 1000; // 2024 catch-up for 50+
            } else {
                return { success: false, error: 'Invalid contribution type' };
            }
            
            const isEligibleForCatchUp = age >= 50;
            const maxContribution = isEligibleForCatchUp ? annualLimit + catchUpLimit : annualLimit;
            const monthlyMax = maxContribution / 12;
            
            return {
                success: true,
                contributionType: contributionType,
                age: age,
                annualLimit: annualLimit,
                catchUpLimit: catchUpLimit,
                isEligibleForCatchUp: isEligibleForCatchUp,
                maxAnnualContribution: maxContribution,
                maxMonthlyContribution: monthlyMax,
                recommendedContribution: Math.min(income * 0.15, maxContribution)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate Social Security benefits
     */
    calculateSocialSecurity(age, currentSalary, expectedRetirementAge, benefitReduction = 0) {
        try {
            // Simplified Social Security calculation
            const yearsOfWork = expectedRetirementAge - 22; // Assume start working at 22
            const averageSalary = currentSalary * 0.9; // Assume 90% of current salary as average
            const primaryInsuranceAmount = Math.min(averageSalary * 0.9, 118500) * 0.9; // Simplified PIA calculation
            
            let monthlyBenefit = primaryInsuranceAmount / 12;
            
            // Apply early/late retirement adjustments
            if (expectedRetirementAge < 67) {
                const reductionMonths = (67 - expectedRetirementAge) * 12;
                monthlyBenefit *= (1 - (reductionMonths * 0.005)); // 0.5% reduction per month
            } else if (expectedRetirementAge > 67) {
                const increaseMonths = (expectedRetirementAge - 67) * 12;
                monthlyBenefit *= (1 + (increaseMonths * 0.008)); // 0.8% increase per month
            }
            
            return {
                success: true,
                age: age,
                currentSalary: currentSalary,
                expectedRetirementAge: expectedRetirementAge,
                yearsOfWork: yearsOfWork,
                averageSalary: averageSalary,
                primaryInsuranceAmount: primaryInsuranceAmount,
                monthlyBenefit: monthlyBenefit,
                annualBenefit: monthlyBenefit * 12
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate retirement readiness score
     */
    calculateReadinessScore(currentSavings, monthlyContribution, age, targetRetirementAge, currentSalary) {
        try {
            const yearsToRetirement = targetRetirementAge - age;
            const targetSavings = currentSalary * 10; // 10x salary rule
            const currentRatio = currentSavings / targetSavings;
            
            // Calculate savings rate
            const annualContribution = monthlyContribution * 12;
            const savingsRate = (annualContribution / currentSalary) * 100;
            
            // Calculate time factor
            const timeFactor = yearsToRetirement >= 20 ? 1.0 : yearsToRetirement / 20;
            
            // Calculate readiness score (0-100)
            let score = (currentRatio * 50) + (Math.min(savingsRate, 20) / 20 * 30) + (timeFactor * 20);
            score = Math.min(100, Math.max(0, score));
            
            let readinessLevel;
            if (score >= 80) readinessLevel = 'Excellent';
            else if (score >= 60) readinessLevel = 'Good';
            else if (score >= 40) readinessLevel = 'Fair';
            else if (score >= 20) readinessLevel = 'Poor';
            else readinessLevel = 'Critical';
            
            return {
                success: true,
                score: score,
                readinessLevel: readinessLevel,
                currentRatio: currentRatio,
                savingsRate: savingsRate,
                timeFactor: timeFactor,
                targetSavings: targetSavings,
                yearsToRetirement: yearsToRetirement
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
    module.exports = RetirementCalculator;
}
