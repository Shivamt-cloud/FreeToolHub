/**
 * Professional Business Metrics Calculator
 * Calculate business performance metrics, profitability, and financial ratios
 */

class BusinessMetricsCalculator {
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
     * Calculate comprehensive business metrics
     */
    calculateBusinessMetrics(revenue, costs, expenses, assets, liabilities, equity) {
        try {
            const grossProfit = revenue - costs;
            const netProfit = grossProfit - expenses;
            const grossMargin = (grossProfit / revenue) * 100;
            const netMargin = (netProfit / revenue) * 100;
            const roe = (netProfit / equity) * 100;
            const roa = (netProfit / assets) * 100;
            const currentRatio = assets / liabilities;
            const debtToEquity = (liabilities / equity) * 100;
            const operatingMargin = (grossProfit / revenue) * 100;
            
            return {
                success: true,
                revenue: revenue,
                costs: costs,
                expenses: expenses,
                assets: assets,
                liabilities: liabilities,
                equity: equity,
                grossProfit: grossProfit,
                netProfit: netProfit,
                grossMargin: grossMargin,
                netMargin: netMargin,
                operatingMargin: operatingMargin,
                roe: roe,
                roa: roa,
                currentRatio: currentRatio,
                debtToEquity: debtToEquity
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate break-even analysis
     */
    calculateBreakEven(fixedCosts, variableCostPerUnit, sellingPricePerUnit) {
        try {
            const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
            
            if (contributionMargin <= 0) {
                return { success: false, error: 'Cannot break even: variable costs exceed selling price' };
            }
            
            const breakEvenUnits = fixedCosts / contributionMargin;
            const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;
            const contributionMarginRatio = (contributionMargin / sellingPricePerUnit) * 100;
            
            return {
                success: true,
                fixedCosts: fixedCosts,
                variableCostPerUnit: variableCostPerUnit,
                sellingPricePerUnit: sellingPricePerUnit,
                contributionMargin: contributionMargin,
                contributionMarginRatio: contributionMarginRatio,
                breakEvenUnits: breakEvenUnits,
                breakEvenRevenue: breakEvenRevenue
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate profit margin analysis
     */
    calculateProfitMargins(revenue, costs, expenses, otherIncome = 0) {
        try {
            const grossProfit = revenue - costs;
            const operatingProfit = grossProfit - expenses;
            const netProfit = operatingProfit + otherIncome;
            
            const grossMargin = (grossProfit / revenue) * 100;
            const operatingMargin = (operatingProfit / revenue) * 100;
            const netMargin = (netProfit / revenue) * 100;
            
            return {
                success: true,
                revenue: revenue,
                costs: costs,
                expenses: expenses,
                otherIncome: otherIncome,
                grossProfit: grossProfit,
                operatingProfit: operatingProfit,
                netProfit: netProfit,
                grossMargin: grossMargin,
                operatingMargin: operatingMargin,
                netMargin: netMargin
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate return on investment (ROI)
     */
    calculateROI(initialInvestment, finalValue, timePeriod = 1) {
        try {
            const totalReturn = finalValue - initialInvestment;
            const roi = (totalReturn / initialInvestment) * 100;
            const annualizedROI = (Math.pow(finalValue / initialInvestment, 1 / timePeriod) - 1) * 100;
            
            return {
                success: true,
                initialInvestment: initialInvestment,
                finalValue: finalValue,
                totalReturn: totalReturn,
                roi: roi,
                annualizedROI: annualizedROI,
                timePeriod: timePeriod
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate customer lifetime value (CLV)
     */
    calculateCLV(averageOrderValue, purchaseFrequency, customerLifespan, profitMargin) {
        try {
            const customerValue = averageOrderValue * purchaseFrequency * customerLifespan;
            const clv = customerValue * (profitMargin / 100);
            
            return {
                success: true,
                averageOrderValue: averageOrderValue,
                purchaseFrequency: purchaseFrequency,
                customerLifespan: customerLifespan,
                profitMargin: profitMargin,
                customerValue: customerValue,
                clv: clv
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate customer acquisition cost (CAC)
     */
    calculateCAC(marketingSpend, salesSpend, newCustomers) {
        try {
            const totalAcquisitionCost = marketingSpend + salesSpend;
            const cac = totalAcquisitionCost / newCustomers;
            
            return {
                success: true,
                marketingSpend: marketingSpend,
                salesSpend: salesSpend,
                newCustomers: newCustomers,
                totalAcquisitionCost: totalAcquisitionCost,
                cac: cac
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate inventory turnover
     */
    calculateInventoryTurnover(costOfGoodsSold, averageInventory) {
        try {
            const inventoryTurnover = costOfGoodsSold / averageInventory;
            const daysInInventory = 365 / inventoryTurnover;
            
            return {
                success: true,
                costOfGoodsSold: costOfGoodsSold,
                averageInventory: averageInventory,
                inventoryTurnover: inventoryTurnover,
                daysInInventory: daysInInventory
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate cash flow analysis
     */
    calculateCashFlow(operatingCashFlow, investingCashFlow, financingCashFlow, beginningCash) {
        try {
            const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
            const endingCash = beginningCash + netCashFlow;
            
            return {
                success: true,
                operatingCashFlow: operatingCashFlow,
                investingCashFlow: investingCashFlow,
                financingCashFlow: financingCashFlow,
                beginningCash: beginningCash,
                netCashFlow: netCashFlow,
                endingCash: endingCash
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate financial ratios
     */
    calculateFinancialRatios(assets, liabilities, equity, revenue, netIncome, currentAssets, currentLiabilities) {
        try {
            const debtToEquity = (liabilities / equity) * 100;
            const debtToAssets = (liabilities / assets) * 100;
            const currentRatio = currentAssets / currentLiabilities;
            const quickRatio = (currentAssets - 0) / currentLiabilities; // Assuming no inventory for quick ratio
            const returnOnAssets = (netIncome / assets) * 100;
            const returnOnEquity = (netIncome / equity) * 100;
            const assetTurnover = revenue / assets;
            
            return {
                success: true,
                debtToEquity: debtToEquity,
                debtToAssets: debtToAssets,
                currentRatio: currentRatio,
                quickRatio: quickRatio,
                returnOnAssets: returnOnAssets,
                returnOnEquity: returnOnEquity,
                assetTurnover: assetTurnover
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
     * Format ratio
     */
    formatRatio(value, decimals = 2) {
        return value.toFixed(decimals);
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
    module.exports = BusinessMetricsCalculator;
}
