/**
 * Professional Budget Planner
 * Create and manage personal and business budgets with detailed analysis
 */

class BudgetPlanner {
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
     * Create personal budget
     */
    createPersonalBudget(income, expenses, savings, debt) {
        try {
            const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
            const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
            const totalSavings = savings.reduce((sum, item) => sum + item.amount, 0);
            const totalDebt = debt.reduce((sum, item) => sum + item.amount, 0);
            
            const netIncome = totalIncome - totalExpenses;
            const savingsRate = (totalSavings / totalIncome) * 100;
            const debtToIncomeRatio = (totalDebt / totalIncome) * 100;
            
            // Budget categories analysis
            const categories = this.analyzeBudgetCategories(expenses);
            
            return {
                success: true,
                totalIncome: totalIncome,
                totalExpenses: totalExpenses,
                totalSavings: totalSavings,
                totalDebt: totalDebt,
                netIncome: netIncome,
                savingsRate: savingsRate,
                debtToIncomeRatio: debtToIncomeRatio,
                categories: categories,
                budgetHealth: this.calculateBudgetHealth(savingsRate, debtToIncomeRatio, netIncome)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Create business budget
     */
    createBusinessBudget(revenue, costs, expenses, investments) {
        try {
            const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
            const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
            const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
            const totalInvestments = investments.reduce((sum, item) => sum + item.amount, 0);
            
            const grossProfit = totalRevenue - totalCosts;
            const netProfit = grossProfit - totalExpenses;
            const profitMargin = (netProfit / totalRevenue) * 100;
            const operatingMargin = (grossProfit / totalRevenue) * 100;
            
            return {
                success: true,
                totalRevenue: totalRevenue,
                totalCosts: totalCosts,
                totalExpenses: totalExpenses,
                totalInvestments: totalInvestments,
                grossProfit: grossProfit,
                netProfit: netProfit,
                profitMargin: profitMargin,
                operatingMargin: operatingMargin,
                budgetAnalysis: this.analyzeBusinessBudget(totalRevenue, totalCosts, totalExpenses)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate 50/30/20 budget rule
     */
    calculate502030Budget(income) {
        try {
            const needs = income * 0.5;
            const wants = income * 0.3;
            const savings = income * 0.2;
            
            return {
                success: true,
                totalIncome: income,
                needs: needs,
                wants: wants,
                savings: savings,
                needsPercentage: 50,
                wantsPercentage: 30,
                savingsPercentage: 20
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate emergency fund
     */
    calculateEmergencyFund(monthlyExpenses, months = 6) {
        try {
            const emergencyFund = monthlyExpenses * months;
            const monthlySavings = emergencyFund / 12; // Assuming 1 year to build
            const weeklySavings = monthlySavings / 4;
            
            return {
                success: true,
                monthlyExpenses: monthlyExpenses,
                months: months,
                emergencyFund: emergencyFund,
                monthlySavings: monthlySavings,
                weeklySavings: weeklySavings,
                dailySavings: weeklySavings / 7
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate debt payoff plan
     */
    calculateDebtPayoff(debts, extraPayment = 0, strategy = 'snowball') {
        try {
            const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
            const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
            const totalPayment = totalMinimumPayment + extraPayment;
            
            let payoffPlan = [];
            let remainingDebts = [...debts];
            let month = 0;
            let totalInterest = 0;
            
            while (remainingDebts.length > 0 && month < 360) { // Max 30 years
                month++;
                let availablePayment = totalPayment;
                let monthInterest = 0;
                
                // Sort debts based on strategy
                if (strategy === 'snowball') {
                    remainingDebts.sort((a, b) => a.balance - b.balance);
                } else if (strategy === 'avalanche') {
                    remainingDebts.sort((a, b) => b.interestRate - a.interestRate);
                }
                
                // Pay minimums first
                for (let debt of remainingDebts) {
                    const interest = debt.balance * (debt.interestRate / 100 / 12);
                    const principal = Math.min(debt.minimumPayment, debt.balance + interest);
                    
                    debt.balance = Math.max(0, debt.balance + interest - principal);
                    availablePayment -= principal;
                    monthInterest += interest;
                }
                
                // Apply extra payment to first debt
                if (availablePayment > 0 && remainingDebts.length > 0) {
                    const firstDebt = remainingDebts[0];
                    const extraPrincipal = Math.min(availablePayment, firstDebt.balance);
                    firstDebt.balance -= extraPrincipal;
                    availablePayment -= extraPrincipal;
                }
                
                totalInterest += monthInterest;
                
                // Remove paid off debts
                remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
                
                payoffPlan.push({
                    month: month,
                    totalBalance: remainingDebts.reduce((sum, debt) => sum + debt.balance, 0),
                    totalInterest: totalInterest,
                    debtsRemaining: remainingDebts.length
                });
            }
            
            return {
                success: true,
                totalDebt: totalDebt,
                totalPayment: totalPayment,
                extraPayment: extraPayment,
                strategy: strategy,
                payoffMonths: month,
                totalInterest: totalInterest,
                payoffPlan: payoffPlan
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate savings goals
     */
    calculateSavingsGoals(goals, currentSavings, monthlyContribution) {
        try {
            const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.amount, 0);
            const totalCurrentSavings = currentSavings.reduce((sum, savings) => sum + savings.amount, 0);
            
            const goalsAnalysis = goals.map(goal => {
                const monthsToGoal = Math.ceil(goal.amount / monthlyContribution);
                const yearsToGoal = monthsToGoal / 12;
                const monthlyNeeded = goal.amount / (goal.timeframe * 12);
                
                return {
                    name: goal.name,
                    amount: goal.amount,
                    timeframe: goal.timeframe,
                    monthlyNeeded: monthlyNeeded,
                    monthsToGoal: monthsToGoal,
                    yearsToGoal: yearsToGoal,
                    achievable: monthlyNeeded <= monthlyContribution
                };
            });
            
            return {
                success: true,
                totalGoalAmount: totalGoalAmount,
                totalCurrentSavings: totalCurrentSavings,
                monthlyContribution: monthlyContribution,
                goalsAnalysis: goalsAnalysis
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Analyze budget categories
     */
    analyzeBudgetCategories(expenses) {
        const categories = {};
        
        expenses.forEach(expense => {
            const category = expense.category || 'Other';
            if (!categories[category]) {
                categories[category] = 0;
            }
            categories[category] += expense.amount;
        });
        
        const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
        
        return Object.entries(categories).map(([category, amount]) => ({
            category: category,
            amount: amount,
            percentage: (amount / total) * 100
        })).sort((a, b) => b.amount - a.amount);
    }

    /**
     * Calculate budget health score
     */
    calculateBudgetHealth(savingsRate, debtToIncomeRatio, netIncome) {
        let score = 100;
        
        // Deduct points for low savings rate
        if (savingsRate < 10) score -= 30;
        else if (savingsRate < 20) score -= 15;
        
        // Deduct points for high debt ratio
        if (debtToIncomeRatio > 40) score -= 40;
        else if (debtToIncomeRatio > 30) score -= 20;
        else if (debtToIncomeRatio > 20) score -= 10;
        
        // Deduct points for negative net income
        if (netIncome < 0) score -= 50;
        
        score = Math.max(0, Math.min(100, score));
        
        let healthLevel;
        if (score >= 80) healthLevel = 'Excellent';
        else if (score >= 60) healthLevel = 'Good';
        else if (score >= 40) healthLevel = 'Fair';
        else if (score >= 20) healthLevel = 'Poor';
        else healthLevel = 'Critical';
        
        return {
            score: score,
            healthLevel: healthLevel,
            recommendations: this.getBudgetRecommendations(savingsRate, debtToIncomeRatio, netIncome)
        };
    }

    /**
     * Get budget recommendations
     */
    getBudgetRecommendations(savingsRate, debtToIncomeRatio, netIncome) {
        const recommendations = [];
        
        if (savingsRate < 20) {
            recommendations.push('Increase your savings rate to at least 20%');
        }
        
        if (debtToIncomeRatio > 30) {
            recommendations.push('Focus on paying down debt to reduce debt-to-income ratio');
        }
        
        if (netIncome < 0) {
            recommendations.push('Reduce expenses or increase income to achieve positive cash flow');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Great job! Your budget is well-balanced');
        }
        
        return recommendations;
    }

    /**
     * Analyze business budget
     */
    analyzeBusinessBudget(revenue, costs, expenses) {
        const grossMargin = ((revenue - costs) / revenue) * 100;
        const netMargin = ((revenue - costs - expenses) / revenue) * 100;
        
        return {
            grossMargin: grossMargin,
            netMargin: netMargin,
            costRatio: (costs / revenue) * 100,
            expenseRatio: (expenses / revenue) * 100
        };
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
    module.exports = BudgetPlanner;
}
