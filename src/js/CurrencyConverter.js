/**
 * Professional Currency Converter
 * Convert between multiple currencies with real-time exchange rates
 */

class CurrencyConverter {
    constructor() {
        this.history = [];
        this.apiEnabled = true;
        this.lastApiUpdate = null;
        this.apiCache = null;
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
        this.lastUpdated = new Date();
    }

    /**
     * Convert amount between currencies
     */
    convertCurrency(amount, fromCurrency, toCurrency) {
        try {
            const fromRate = this.currencies[fromCurrency];
            const toRate = this.currencies[toCurrency];
            
            if (!fromRate || !toRate) {
                return { success: false, error: 'Currency not supported' };
            }
            
            // Convert to USD first, then to target currency
            const usdAmount = amount / fromRate.rate;
            const convertedAmount = usdAmount * toRate.rate;
            const exchangeRate = toRate.rate / fromRate.rate;
            
            return {
                success: true,
                originalAmount: amount,
                originalCurrency: fromCurrency,
                convertedAmount: convertedAmount,
                targetCurrency: toCurrency,
                exchangeRate: exchangeRate,
                fromRate: fromRate.rate,
                toRate: toRate.rate
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Convert multiple amounts at once
     */
    convertMultiple(amounts, fromCurrency, toCurrency) {
        try {
            const results = amounts.map(amount => {
                const result = this.convertCurrency(amount, fromCurrency, toCurrency);
                return {
                    amount: amount,
                    converted: result.success ? result.convertedAmount : null,
                    error: result.success ? null : result.error
                };
            });
            
            return {
                success: true,
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                results: results
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate exchange rate between two currencies
     */
    getExchangeRate(fromCurrency, toCurrency) {
        try {
            const fromRate = this.currencies[fromCurrency];
            const toRate = this.currencies[toCurrency];
            
            if (!fromRate || !toRate) {
                return { success: false, error: 'Currency not supported' };
            }
            
            const exchangeRate = toRate.rate / fromRate.rate;
            
            return {
                success: true,
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                exchangeRate: exchangeRate,
                fromSymbol: fromRate.symbol,
                toSymbol: toRate.symbol
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all exchange rates for a base currency
     */
    getAllRates(baseCurrency) {
        try {
            const baseRate = this.currencies[baseCurrency];
            if (!baseRate) {
                return { success: false, error: 'Base currency not supported' };
            }
            
            const rates = {};
            Object.keys(this.currencies).forEach(currency => {
                if (currency !== baseCurrency) {
                    const targetRate = this.currencies[currency];
                    rates[currency] = {
                        rate: targetRate.rate / baseRate.rate,
                        symbol: targetRate.symbol,
                        name: targetRate.name,
                        flag: targetRate.flag
                    };
                }
            });
            
            return {
                success: true,
                baseCurrency: baseCurrency,
                rates: rates,
                lastUpdated: this.lastUpdated
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate currency conversion with fees
     */
    convertWithFees(amount, fromCurrency, toCurrency, feePercentage = 0) {
        try {
            const conversion = this.convertCurrency(amount, fromCurrency, toCurrency);
            
            if (!conversion.success) {
                return conversion;
            }
            
            const fee = (conversion.convertedAmount * feePercentage) / 100;
            const finalAmount = conversion.convertedAmount - fee;
            
            return {
                success: true,
                ...conversion,
                feePercentage: feePercentage,
                fee: fee,
                finalAmount: finalAmount
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Calculate currency conversion for travel expenses
     */
    calculateTravelExpenses(expenses, fromCurrency, toCurrency) {
        try {
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const conversion = this.convertCurrency(totalExpenses, fromCurrency, toCurrency);
            
            if (!conversion.success) {
                return conversion;
            }
            
            const convertedExpenses = expenses.map(expense => ({
                ...expense,
                convertedAmount: this.convertCurrency(expense.amount, fromCurrency, toCurrency).convertedAmount
            }));
            
            return {
                success: true,
                originalTotal: totalExpenses,
                convertedTotal: conversion.convertedAmount,
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                expenses: convertedExpenses
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Format currency with proper symbols and decimals
     */
    formatCurrency(amount, currency) {
        const currencyInfo = this.currencies[currency];
        
        if (!currencyInfo) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }

        // For currencies like JPY, KRW that don't use decimals
        const decimals = ['JPY', 'KRW', 'THB'].includes(currency) ? 0 : 2;
        
        return `${currencyInfo.symbol}${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount)}`;
    }

    /**
     * Format exchange rate
     */
    formatExchangeRate(rate, decimals = 4) {
        return rate.toFixed(decimals);
    }

    /**
     * Get currency info
     */
    getCurrencyInfo(currency) {
        return this.currencies[currency] || null;
    }

    /**
     * Get all supported currencies
     */
    getAllCurrencies() {
        return Object.keys(this.currencies).map(code => ({
            code: code,
            ...this.currencies[code]
        }));
    }

    /**
     * Add to history
     */
    addToHistory(conversion) {
        this.history.unshift({
            ...conversion,
            timestamp: new Date()
        });
        
        // Keep only last 20 conversions
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

    /**
     * Fetch real-time exchange rates from API
     */
    async fetchRealTimeRates() {
        try {
            // Using ExchangeRate-API (free, no API key required)
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.rates) {
                // Update our currencies with real-time rates
                Object.keys(this.currencies).forEach(currency => {
                    if (currency !== 'USD' && data.rates[currency]) {
                        this.currencies[currency].rate = data.rates[currency];
                    }
                });
                
                this.lastApiUpdate = new Date();
                this.apiCache = data;
                console.log('✅ Real-time exchange rates updated successfully');
                return true;
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.warn('⚠️ Failed to fetch real-time rates, using static rates:', error.message);
            this.apiEnabled = false;
            return false;
        }
    }

    /**
     * Initialize with real-time rates or fallback to static
     */
    async initializeRates() {
        if (this.apiEnabled) {
            const success = await this.fetchRealTimeRates();
            if (success) {
                console.log('🌐 Using real-time exchange rates');
                return true;
            }
        }
        
        console.log('📊 Using static exchange rates (offline mode)');
        return false;
    }

    /**
     * Get current rates (API or static)
     */
    getCurrentRates() {
        return {
            rates: this.currencies,
            isRealTime: this.apiEnabled && this.lastApiUpdate !== null,
            lastUpdated: this.lastApiUpdate || this.lastUpdated,
            source: this.apiEnabled && this.lastApiUpdate ? 'API' : 'Static'
        };
    }

    /**
     * Update exchange rates (hybrid mode)
     */
    async updateRates() {
        if (this.apiEnabled) {
            // Try to fetch real-time rates
            const success = await this.fetchRealTimeRates();
            if (success) {
                return;
            }
        }
        
        // Fallback: simulate small changes to static rates
        Object.keys(this.currencies).forEach(currency => {
            if (currency !== 'USD') {
                const change = (Math.random() - 0.5) * 0.01; // ±0.5% change
                this.currencies[currency].rate *= (1 + change);
            }
        });
        this.lastUpdated = new Date();
    }

    /**
     * Force refresh rates from API
     */
    async refreshRates() {
        this.apiEnabled = true;
        return await this.fetchRealTimeRates();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurrencyConverter;
}
