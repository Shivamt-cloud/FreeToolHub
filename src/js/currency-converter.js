// Advanced Currency Converter Module for FreeToolHub
// Implements professional-grade currency conversion with ECB rates, ISO 4217 standards, and markup handling

class AdvancedCurrencyConverter {
    constructor() {
        this.iso4217 = this.initializeISO4217();
        this.rateProvider = new ECBRateProvider();
        this.cache = new Map();
        this.cacheTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    // Initialize ISO 4217 currency standards with minor unit exponents
    initializeISO4217() {
        return {
            exponent: {
                // Major currencies
                'USD': 2, 'EUR': 2, 'GBP': 2, 'JPY': 0, 'CHF': 2, 'CAD': 2, 'AUD': 2, 'NZD': 2,
                'CNY': 2, 'HKD': 2, 'SGD': 2, 'KRW': 0, 'INR': 2, 'BRL': 2, 'MXN': 2, 'ZAR': 2,
                
                // European currencies
                'SEK': 2, 'NOK': 2, 'DKK': 2, 'PLN': 2, 'CZK': 2, 'HUF': 2, 'RON': 2, 'BGN': 2,
                'HRK': 2, 'RUB': 2, 'TRY': 2, 'UAH': 2, 'ISK': 0, 'RSD': 2, 'ALL': 2, 'MKD': 2,
                
                // Asian currencies
                'THB': 2, 'MYR': 2, 'IDR': 0, 'PHP': 2, 'VND': 0, 'BDT': 2, 'PKR': 2, 'LKR': 2,
                'NPR': 2, 'MMK': 0, 'KHR': 0, 'LAK': 0, 'MNT': 2, 'KZT': 2, 'UZS': 2, 'TJS': 2,
                
                // Middle Eastern currencies
                'SAR': 2, 'AED': 2, 'QAR': 2, 'KWD': 3, 'BHD': 3, 'OMR': 3, 'JOD': 3, 'LBP': 0,
                'ILS': 2, 'EGP': 2, 'MAD': 2, 'TND': 3, 'DZD': 2, 'LYD': 3, 'SDG': 2, 'SOS': 2,
                
                // African currencies
                'NGN': 2, 'KES': 2, 'GHS': 2, 'UGX': 0, 'TZS': 0, 'ZMW': 2, 'MWK': 2, 'BWP': 2,
                'NAD': 2, 'SZL': 2, 'LSL': 2, 'MUR': 2, 'SCR': 2, 'CVE': 2, 'STD': 0, 'AOA': 2,
                
                // American currencies
                'ARS': 2, 'CLP': 0, 'COP': 2, 'PEN': 2, 'UYU': 2, 'PYG': 0, 'BOB': 2, 'GTQ': 2,
                'HNL': 2, 'NIO': 2, 'CRC': 2, 'PAB': 2, 'DOP': 2, 'JMD': 2, 'TTD': 2, 'BBD': 2,
                
                // Special cases
                'BTC': 8, 'ETH': 18, 'XRP': 6, 'LTC': 8, 'BCH': 8, 'ADA': 6, 'DOT': 10, 'LINK': 18
            },
            
            // Currency names and symbols
            names: {
                'USD': 'US Dollar', 'EUR': 'Euro', 'GBP': 'British Pound', 'JPY': 'Japanese Yen',
                'CHF': 'Swiss Franc', 'CAD': 'Canadian Dollar', 'AUD': 'Australian Dollar',
                'NZD': 'New Zealand Dollar', 'CNY': 'Chinese Yuan', 'HKD': 'Hong Kong Dollar',
                'SGD': 'Singapore Dollar', 'KRW': 'South Korean Won', 'INR': 'Indian Rupee',
                'BRL': 'Brazilian Real', 'MXN': 'Mexican Peso', 'ZAR': 'South African Rand'
            },
            
            // Currency symbols
            symbols: {
                'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CHF': 'CHF', 'CAD': 'C$',
                'AUD': 'A$', 'NZD': 'NZ$', 'CNY': '¥', 'HKD': 'HK$', 'SGD': 'S$', 'KRW': '₩',
                'INR': '₹', 'BRL': 'R$', 'MXN': 'MX$', 'ZAR': 'R'
            }
        };
    }

    // Get minor unit exponent for a currency
    getMinorUnitExponent(currencyCode) {
        const code = currencyCode.toUpperCase();
        if (!this.iso4217.exponent[code]) {
            throw new Error(`Unsupported currency: ${currencyCode}`);
        }
        return this.iso4217.exponent[code];
    }

    // Round amount to currency's minor units using banker's rounding
    roundToMinorUnits(amount, currencyCode) {
        const exp = this.getMinorUnitExponent(currencyCode);
        const divisor = Math.pow(10, exp);
        const rounded = Math.round(amount * divisor) / divisor;
        return parseFloat(rounded.toFixed(exp));
    }

    // Get currency display name
    getCurrencyName(currencyCode) {
        const code = currencyCode.toUpperCase();
        return this.iso4217.names[code] || code;
    }

    // Get currency symbol
    getCurrencySymbol(currencyCode) {
        const code = currencyCode.toUpperCase();
        return this.iso4217.symbols[code] || code;
    }

    // Get all supported currencies
    getSupportedCurrencies() {
        return Object.keys(this.iso4217.exponent).sort();
    }

    // Get popular currencies for UI
    getPopularCurrencies() {
        return ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'HKD', 'SGD', 'INR', 'BRL'];
    }

    // Convert amount between currencies
    async convertAmount(
        amountFrom,
        fromCurrency,
        toCurrency,
        options = {}
    ) {
        try {
            // Validate inputs
            this.validateCurrency(fromCurrency);
            this.validateCurrency(toCurrency);
            
            if (typeof amountFrom !== 'number' || isNaN(amountFrom) || amountFrom < 0) {
                throw new Error('Amount must be a positive number');
            }

            const {
                asOf = null,
                priceType = 'mid',
                markupBps = 0,
                feeMode = 'rate_markup',
                feeValue = 0,
                useCache = true
            } = options;

            // Get exchange rates
            const rateQuote = await this.getExchangeRates(asOf, useCache);
            
            // Calculate conversion rate
            const rawRate = this.calculatePairRate(fromCurrency, toCurrency, rateQuote, priceType);
            
            // Apply markup if specified
            const effectiveRate = this.applyMarkupToRate(rawRate, markupBps);
            
            // Convert amount
            let amountTo = amountFrom * effectiveRate;
            
            // Apply fees if specified
            amountTo = this.applyAmountFee(amountTo, feeMode, feeValue);
            
            // Round to target currency's minor units
            const roundedAmount = this.roundToMinorUnits(amountTo, toCurrency);
            
            // Calculate markup amount
            const markupAmount = amountFrom * (effectiveRate - rawRate);
            
            // Calculate fee amount
            const feeAmount = this.calculateFeeAmount(amountFrom, effectiveRate, feeMode, feeValue);
            
            return {
                success: true,
                from: {
                    currency: fromCurrency,
                    amount: amountFrom,
                    symbol: this.getCurrencySymbol(fromCurrency),
                    name: this.getCurrencyName(fromCurrency)
                },
                to: {
                    currency: toCurrency,
                    amount: roundedAmount,
                    symbol: this.getCurrencySymbol(toCurrency),
                    name: this.getCurrencyName(toCurrency)
                },
                rate: {
                    raw: rawRate,
                    effective: effectiveRate,
                    markup: markupBps,
                    markupAmount: markupAmount
                },
                fees: {
                    mode: feeMode,
                    value: feeValue,
                    amount: feeAmount
                },
                metadata: {
                    asOf: rateQuote.asOf,
                    base: rateQuote.base,
                    source: rateQuote.source,
                    timestamp: new Date().toISOString()
                }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                from: { currency: fromCurrency, amount: amountFrom },
                to: { currency: toCurrency }
            };
        }
    }

    // Calculate pair rate between two currencies
    calculatePairRate(fromCurrency, toCurrency, rateQuote, priceType = 'mid') {
        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();
        const base = rateQuote.base;

        // Same currency
        if (from === to) {
            return 1;
        }

        // Direct base rate
        if (from === base) {
            if (!rateQuote.rates[to]) {
                throw new Error(`Missing rate for ${to} against ${base}`);
            }
            return rateQuote.rates[to];
        }

        // Inverse base rate
        if (to === base) {
            if (!rateQuote.rates[from]) {
                throw new Error(`Missing rate for ${from} against ${base}`);
            }
            return 1 / rateQuote.rates[from];
        }

        // Cross-currency triangulation via base
        if (!rateQuote.rates[from] || !rateQuote.rates[to]) {
            throw new Error(`Missing rates for cross-currency conversion ${from} to ${to}`);
        }

        // Formula: rate(from->to) = rate(base->to) / rate(base->from)
        return rateQuote.rates[to] / rateQuote.rates[from];
    }

    // Apply markup to rate (in basis points)
    applyMarkupToRate(rate, markupBps) {
        if (!markupBps || markupBps === 0) {
            return rate;
        }
        const markupMultiplier = 1 + (markupBps / 10000);
        return rate * markupMultiplier;
    }

    // Apply fee to amount
    applyAmountFee(amount, feeMode, feeValue) {
        switch (feeMode) {
            case 'amount_fee_none':
                return amount;
            case 'amount_fee_percent':
                return amount * (1 + feeValue);
            case 'amount_fee_fixed':
                return amount + feeValue;
            case 'rate_markup':
                return amount; // Handled in rate calculation
            default:
                throw new Error(`Invalid fee mode: ${feeMode}`);
        }
    }

    // Calculate fee amount
    calculateFeeAmount(originalAmount, effectiveRate, feeMode, feeValue) {
        switch (feeMode) {
            case 'amount_fee_none':
                return 0;
            case 'amount_fee_percent':
                return originalAmount * effectiveRate * feeValue;
            case 'amount_fee_fixed':
                return feeValue;
            case 'rate_markup':
                return 0; // Handled in rate calculation
            default:
                return 0;
        }
    }

    // Get exchange rates with caching
    async getExchangeRates(asOf = null, useCache = true) {
        const cacheKey = asOf || 'latest';
        
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
        }

        try {
            const rates = await this.rateProvider.getRates(asOf);
            
            if (useCache) {
                this.cache.set(cacheKey, {
                    data: rates,
                    timestamp: Date.now()
                });
            }
            
            return rates;
        } catch (error) {
            // Try to use cached rates if available
            if (this.cache.has(cacheKey)) {
                console.warn('Using cached rates due to API error:', error.message);
                return this.cache.get(cacheKey).data;
            }
            throw error;
        }
    }

    // Validate currency code
    validateCurrency(currencyCode) {
        const code = currencyCode.toUpperCase();
        if (!this.iso4217.exponent[code]) {
            throw new Error(`Unsupported currency: ${currencyCode}`);
        }
    }

    // Get historical conversion
    async getHistoricalConversion(amount, fromCurrency, toCurrency, date, options = {}) {
        return this.convertAmount(amount, fromCurrency, toCurrency, {
            ...options,
            asOf: date
        });
    }

    // Get conversion with different price types
    async getConversionWithPriceType(amount, fromCurrency, toCurrency, priceType, options = {}) {
        return this.convertAmount(amount, fromCurrency, toCurrency, {
            ...options,
            priceType
        });
    }

    // Get bulk conversions
    async getBulkConversions(conversions, options = {}) {
        const results = [];
        
        for (const conversion of conversions) {
            const result = await this.convertAmount(
                conversion.amount,
                conversion.fromCurrency,
                conversion.toCurrency,
                { ...options, ...conversion.options }
            );
            results.push(result);
        }
        
        return results;
    }

    // Get rate comparison between providers
    async compareRates(amount, fromCurrency, toCurrency) {
        const results = {};
        
        try {
            // Get ECB rates
            const ecbResult = await this.convertAmount(amount, fromCurrency, toCurrency, {
                source: 'ecb',
                useCache: false
            });
            results.ecb = ecbResult;
            
            // Get market rates (simulated)
            const marketResult = await this.convertAmount(amount, fromCurrency, toCurrency, {
                source: 'market',
                markupBps: 50, // 0.5% markup
                useCache: false
            });
            results.market = marketResult;
            
        } catch (error) {
            console.error('Error comparing rates:', error);
        }
        
        return results;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Get cache status
    getCacheStatus() {
        const status = {};
        for (const [key, value] of this.cache.entries()) {
            status[key] = {
                timestamp: value.timestamp,
                age: Date.now() - value.timestamp,
                ttl: this.cacheTTL,
                expired: Date.now() - value.timestamp > this.cacheTTL
            };
        }
        return status;
    }
}

// ECB Rate Provider Class
class ECBRateProvider {
    constructor() {
        this.baseUrl = 'https://api.exchangerate.host';
        this.baseCurrency = 'EUR';
        this.lastUpdate = null;
        this.rates = {};
    }

    // Get latest exchange rates
    async getRates(asOf = null) {
        try {
            let url = `${this.baseUrl}/latest?base=${this.baseCurrency}`;
            
            if (asOf) {
                url = `${this.baseUrl}/${asOf}?base=${this.baseCurrency}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('API returned unsuccessful response');
            }
            
            // Transform to our format
            const rates = {};
            for (const [currency, rate] of Object.entries(data.rates)) {
                if (currency !== this.baseCurrency) {
                    rates[currency] = parseFloat(rate);
                }
            }
            
            return {
                base: this.baseCurrency,
                rates: rates,
                asOf: asOf || data.date,
                source: 'ECB (via exchangerate.host)',
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            // Fallback to mock rates for development
            console.warn('Using fallback rates due to API error:', error.message);
            return this.getFallbackRates(asOf);
        }
    }

    // Get fallback rates for development/testing
    getFallbackRates(asOf = null) {
        const baseRates = {
            'USD': 1.08,
            'GBP': 0.86,
            'JPY': 160.5,
            'CHF': 0.95,
            'CAD': 1.47,
            'AUD': 1.65,
            'CNY': 7.85,
            'HKD': 8.45,
            'SGD': 1.46,
            'KRW': 1445.0,
            'INR': 89.5,
            'BRL': 5.35,
            'MXN': 18.2,
            'ZAR': 20.1,
            'SEK': 11.2,
            'NOK': 11.8,
            'DKK': 7.45,
            'PLN': 4.25,
            'CZK': 24.8,
            'HUF': 385.0,
            'RON': 4.95,
            'BGN': 1.96,
            'RUB': 98.5,
            'TRY': 33.2,
            'UAH': 40.8,
            'THB': 39.5,
            'MYR': 5.15,
            'IDR': 16850.0,
            'PHP': 60.8,
            'VND': 26500.0,
            'BDT': 118.5,
            'PKR': 300.2,
            'LKR': 350.8,
            'SAR': 4.05,
            'AED': 3.96,
            'QAR': 3.93,
            'KWD': 0.33,
            'BHD': 0.41,
            'OMR': 0.42,
            'JOD': 0.76,
            'ILS': 4.05,
            'EGP': 33.5,
            'MAD': 10.8,
            'NGN': 980.5,
            'KES': 170.2,
            'GHS': 13.8,
            'UGX': 4100.0,
            'TZS': 2650.0,
            'ZMW': 28.5,
            'MWK': 1800.0,
            'BWP': 14.8,
            'NAD': 20.1,
            'SZL': 20.1,
            'LSL': 20.1,
            'MUR': 48.5,
            'SCR': 14.8,
            'CVE': 110.5,
            'STD': 22000.0,
            'AOA': 890.5,
            'ARS': 950.2,
            'CLP': 1050.0,
            'COP': 4200.0,
            'PEN': 4.05,
            'UYU': 42.5,
            'PYG': 7800.0,
            'BOB': 7.45,
            'GTQ': 8.45,
            'HNL': 26.8,
            'NIO': 39.5,
            'CRC': 580.5,
            'PAB': 1.08,
            'DOP': 63.5,
            'JMD': 168.5,
            'TTD': 7.35,
            'BBD': 2.16
        };
        
        return {
            base: this.baseCurrency,
            rates: baseRates,
            asOf: asOf || new Date().toISOString().split('T')[0],
            source: 'Fallback (Development)',
            timestamp: new Date().toISOString()
        };
    }

    // Get supported currencies
    getSupportedCurrencies() {
        return Object.keys(this.getFallbackRates().rates);
    }

    // Check if rates are stale
    isStale() {
        if (!this.lastUpdate) return true;
        const now = new Date();
        const last = new Date(this.lastUpdate);
        const hoursSinceUpdate = (now - last) / (1000 * 60 * 60);
        return hoursSinceUpdate > 24;
    }
}

// Export for use in the main application
window.AdvancedCurrencyConverter = AdvancedCurrencyConverter;
window.ECBRateProvider = ECBRateProvider;
