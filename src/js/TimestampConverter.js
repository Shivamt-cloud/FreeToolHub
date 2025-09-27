/**
 * Timestamp Converter
 * Advanced timestamp conversion, timezone handling, and date manipulation for developers
 */
class TimestampConverter {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        
        // Supported formats
        this.formats = {
            'unix': { name: 'Unix Timestamp', description: 'Seconds since Jan 1, 1970 UTC' },
            'unix_ms': { name: 'Unix Timestamp (ms)', description: 'Milliseconds since Jan 1, 1970 UTC' },
            'iso8601': { name: 'ISO 8601', description: 'YYYY-MM-DDTHH:mm:ss.sssZ' },
            'rfc2822': { name: 'RFC 2822', description: 'Day, DD Mon YYYY HH:mm:ss GMT' },
            'rfc3339': { name: 'RFC 3339', description: 'YYYY-MM-DDTHH:mm:ssZ' },
            'mysql': { name: 'MySQL', description: 'YYYY-MM-DD HH:mm:ss' },
            'postgresql': { name: 'PostgreSQL', description: 'YYYY-MM-DD HH:mm:ss' },
            'javascript': { name: 'JavaScript Date', description: 'Date object string representation' },
            'human': { name: 'Human Readable', description: 'Natural language date format' }
        };
        
        // Timezone data
        this.timezones = {
            'UTC': { offset: 0, name: 'Coordinated Universal Time' },
            'GMT': { offset: 0, name: 'Greenwich Mean Time' },
            'EST': { offset: -5, name: 'Eastern Standard Time' },
            'EDT': { offset: -4, name: 'Eastern Daylight Time' },
            'CST': { offset: -6, name: 'Central Standard Time' },
            'CDT': { offset: -5, name: 'Central Daylight Time' },
            'MST': { offset: -7, name: 'Mountain Standard Time' },
            'MDT': { offset: -6, name: 'Mountain Daylight Time' },
            'PST': { offset: -8, name: 'Pacific Standard Time' },
            'PDT': { offset: -7, name: 'Pacific Daylight Time' },
            'CET': { offset: 1, name: 'Central European Time' },
            'CEST': { offset: 2, name: 'Central European Summer Time' },
            'EET': { offset: 2, name: 'Eastern European Time' },
            'EEST': { offset: 3, name: 'Eastern European Summer Time' },
            'JST': { offset: 9, name: 'Japan Standard Time' },
            'IST': { offset: 5.5, name: 'India Standard Time' },
            'AEST': { offset: 10, name: 'Australian Eastern Standard Time' },
            'AEDT': { offset: 11, name: 'Australian Eastern Daylight Time' }
        };
        
        // Common timestamp formats for parsing
        this.parsePatterns = [
            /^\d{10}$/, // Unix timestamp (seconds)
            /^\d{13}$/, // Unix timestamp (milliseconds)
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO 8601
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // MySQL/PostgreSQL
            /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/, // RFC 2822
            /^\d{4}-\d{2}-\d{2}$/, // Date only
            /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
            /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
            /^\d{4}\/\d{2}\/\d{2}$/ // YYYY/MM/DD
        ];
    }

    /**
     * Convert timestamp between different formats
     */
    convertTimestamp(input, fromFormat, toFormat, timezone = 'UTC') {
        try {
            const parsedDate = this.parseTimestamp(input, fromFormat, timezone);
            if (!parsedDate) {
                throw new Error('Invalid timestamp format');
            }

            const converted = this.formatTimestamp(parsedDate, toFormat, timezone);
            
            this.addToHistory('convert_timestamp', { input, fromFormat, toFormat, timezone }, converted);
            
            return {
                success: true,
                result: converted,
                input: input,
                fromFormat: fromFormat,
                toFormat: toFormat,
                timezone: timezone,
                parsedDate: parsedDate.toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Parse timestamp from various formats
     */
    parseTimestamp(input, format, timezone = 'UTC') {
        try {
            let date;
            
            switch (format) {
                case 'unix':
                    date = new Date(parseInt(input) * 1000);
                    break;
                case 'unix_ms':
                    date = new Date(parseInt(input));
                    break;
                case 'iso8601':
                case 'rfc3339':
                    date = new Date(input);
                    break;
                case 'rfc2822':
                    date = new Date(input);
                    break;
                case 'mysql':
                case 'postgresql':
                    date = new Date(input);
                    break;
                case 'javascript':
                    date = new Date(input);
                    break;
                case 'human':
                    date = this.parseHumanDate(input);
                    break;
                case 'auto':
                    date = this.autoParseTimestamp(input);
                    break;
                default:
                    date = new Date(input);
            }

            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            // Apply timezone offset if needed
            if (timezone !== 'UTC') {
                const offset = this.getTimezoneOffset(timezone);
                date = new Date(date.getTime() + (offset * 60 * 60 * 1000));
            }

            return date;
        } catch (error) {
            throw new Error(`Failed to parse timestamp: ${error.message}`);
        }
    }

    /**
     * Format timestamp to specified format
     */
    formatTimestamp(date, format, timezone = 'UTC') {
        try {
            // Apply timezone offset if needed
            if (timezone !== 'UTC') {
                const offset = this.getTimezoneOffset(timezone);
                date = new Date(date.getTime() - (offset * 60 * 60 * 1000));
            }

            switch (format) {
                case 'unix':
                    return Math.floor(date.getTime() / 1000).toString();
                case 'unix_ms':
                    return date.getTime().toString();
                case 'iso8601':
                    return date.toISOString();
                case 'rfc2822':
                    return date.toUTCString();
                case 'rfc3339':
                    return date.toISOString();
                case 'mysql':
                case 'postgresql':
                    return date.toISOString().slice(0, 19).replace('T', ' ');
                case 'javascript':
                    return date.toString();
                case 'human':
                    return this.formatHumanDate(date);
                default:
                    return date.toISOString();
            }
        } catch (error) {
            throw new Error(`Failed to format timestamp: ${error.message}`);
        }
    }

    /**
     * Auto-detect timestamp format
     */
    autoParseTimestamp(input) {
        const trimmed = input.trim();
        
        // Unix timestamp (seconds)
        if (/^\d{10}$/.test(trimmed)) {
            return new Date(parseInt(trimmed) * 1000);
        }
        
        // Unix timestamp (milliseconds)
        if (/^\d{13}$/.test(trimmed)) {
            return new Date(parseInt(trimmed));
        }
        
        // ISO 8601
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmed)) {
            return new Date(trimmed);
        }
        
        // MySQL/PostgreSQL format
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(trimmed)) {
            return new Date(trimmed);
        }
        
        // RFC 2822
        if (/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4}/.test(trimmed)) {
            return new Date(trimmed);
        }
        
        // Date only formats
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            return new Date(trimmed + 'T00:00:00Z');
        }
        
        // Try parsing as general date
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
            return date;
        }
        
        throw new Error('Unable to auto-detect timestamp format');
    }

    /**
     * Parse human-readable date
     */
    parseHumanDate(input) {
        const humanPatterns = [
            /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
            /(\d{4})\/(\d{1,2})\/(\d{1,2})/, // YYYY/MM/DD
            /(\d{1,2})-(\d{1,2})-(\d{4})/, // MM-DD-YYYY
            /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
            /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i, // DD Mon YYYY
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/i // Mon DD, YYYY
        ];
        
        for (const pattern of humanPatterns) {
            const match = input.match(pattern);
            if (match) {
                if (pattern === humanPatterns[0] || pattern === humanPatterns[2]) {
                    // MM/DD/YYYY or MM-DD-YYYY
                    const [, month, day, year] = match;
                    return new Date(year, month - 1, day);
                } else if (pattern === humanPatterns[1] || pattern === humanPatterns[3]) {
                    // YYYY/MM/DD or YYYY-MM-DD
                    const [, year, month, day] = match;
                    return new Date(year, month - 1, day);
                } else if (pattern === humanPatterns[4]) {
                    // DD Mon YYYY
                    const [, day, month, year] = match;
                    const monthIndex = this.getMonthIndex(month);
                    return new Date(year, monthIndex, day);
                } else if (pattern === humanPatterns[5]) {
                    // Mon DD, YYYY
                    const [, month, day, year] = match;
                    const monthIndex = this.getMonthIndex(month);
                    return new Date(year, monthIndex, day);
                }
            }
        }
        
        // Try parsing as general date
        const date = new Date(input);
        if (!isNaN(date.getTime())) {
            return date;
        }
        
        throw new Error('Unable to parse human-readable date');
    }

    /**
     * Format date to human-readable format
     */
    formatHumanDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Get month index from month name
     */
    getMonthIndex(monthName) {
        const months = {
            'jan': 0, 'january': 0,
            'feb': 1, 'february': 1,
            'mar': 2, 'march': 2,
            'apr': 3, 'april': 3,
            'may': 4,
            'jun': 5, 'june': 5,
            'jul': 6, 'july': 6,
            'aug': 7, 'august': 7,
            'sep': 8, 'september': 8,
            'oct': 9, 'october': 9,
            'nov': 10, 'november': 10,
            'dec': 11, 'december': 11
        };
        
        return months[monthName.toLowerCase()] || 0;
    }

    /**
     * Get timezone offset in hours
     */
    getTimezoneOffset(timezone) {
        if (this.timezones[timezone]) {
            return this.timezones[timezone].offset;
        }
        return 0;
    }

    /**
     * Get current timestamp in various formats
     */
    getCurrentTimestamp(format = 'unix', timezone = 'UTC') {
        try {
            const now = new Date();
            return this.formatTimestamp(now, format, timezone);
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate time difference between two timestamps
     */
    calculateTimeDifference(timestamp1, timestamp2, format1 = 'auto', format2 = 'auto') {
        try {
            const date1 = this.parseTimestamp(timestamp1, format1);
            const date2 = this.parseTimestamp(timestamp2, format2);
            
            const diffMs = Math.abs(date2.getTime() - date1.getTime());
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30.44);
            const diffYears = Math.floor(diffDays / 365.25);
            
            const isFuture = date2.getTime() > date1.getTime();
            
            return {
                success: true,
                difference: {
                    milliseconds: diffMs,
                    seconds: diffSeconds,
                    minutes: diffMinutes,
                    hours: diffHours,
                    days: diffDays,
                    weeks: diffWeeks,
                    months: diffMonths,
                    years: diffYears
                },
                isFuture: isFuture,
                humanReadable: this.formatTimeDifference(diffMs, isFuture)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Format time difference in human-readable format
     */
    formatTimeDifference(milliseconds, isFuture) {
        const diffSeconds = Math.floor(milliseconds / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30.44);
        const diffYears = Math.floor(diffDays / 365.25);
        
        const prefix = isFuture ? 'in ' : '';
        const suffix = isFuture ? '' : ' ago';
        
        if (diffYears > 0) {
            return `${prefix}${diffYears} year${diffYears > 1 ? 's' : ''}${suffix}`;
        } else if (diffMonths > 0) {
            return `${prefix}${diffMonths} month${diffMonths > 1 ? 's' : ''}${suffix}`;
        } else if (diffWeeks > 0) {
            return `${prefix}${diffWeeks} week${diffWeeks > 1 ? 's' : ''}${suffix}`;
        } else if (diffDays > 0) {
            return `${prefix}${diffDays} day${diffDays > 1 ? 's' : ''}${suffix}`;
        } else if (diffHours > 0) {
            return `${prefix}${diffHours} hour${diffHours > 1 ? 's' : ''}${suffix}`;
        } else if (diffMinutes > 0) {
            return `${prefix}${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}${suffix}`;
        } else {
            return `${prefix}${diffSeconds} second${diffSeconds > 1 ? 's' : ''}${suffix}`;
        }
    }

    /**
     * Add/subtract time from timestamp
     */
    addTime(timestamp, amount, unit, format = 'auto') {
        try {
            const date = this.parseTimestamp(timestamp, format);
            const newDate = new Date(date);
            
            switch (unit.toLowerCase()) {
                case 'milliseconds':
                case 'ms':
                    newDate.setTime(newDate.getTime() + amount);
                    break;
                case 'seconds':
                case 's':
                    newDate.setTime(newDate.getTime() + (amount * 1000));
                    break;
                case 'minutes':
                case 'm':
                    newDate.setTime(newDate.getTime() + (amount * 60 * 1000));
                    break;
                case 'hours':
                case 'h':
                    newDate.setTime(newDate.getTime() + (amount * 60 * 60 * 1000));
                    break;
                case 'days':
                case 'd':
                    newDate.setTime(newDate.getTime() + (amount * 24 * 60 * 60 * 1000));
                    break;
                case 'weeks':
                case 'w':
                    newDate.setTime(newDate.getTime() + (amount * 7 * 24 * 60 * 60 * 1000));
                    break;
                case 'months':
                    newDate.setMonth(newDate.getMonth() + amount);
                    break;
                case 'years':
                case 'y':
                    newDate.setFullYear(newDate.getFullYear() + amount);
                    break;
                default:
                    throw new Error('Invalid time unit');
            }
            
            return {
                success: true,
                original: date.toISOString(),
                result: newDate.toISOString(),
                difference: newDate.getTime() - date.getTime()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get timestamp information
     */
    getTimestampInfo(timestamp, format = 'auto', timezone = 'UTC') {
        try {
            const date = this.parseTimestamp(timestamp, format, timezone);
            
            return {
                success: true,
                timestamp: timestamp,
                format: format,
                timezone: timezone,
                unix: Math.floor(date.getTime() / 1000),
                unixMs: date.getTime(),
                iso8601: date.toISOString(),
                rfc2822: date.toUTCString(),
                human: this.formatHumanDate(date),
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                millisecond: date.getMilliseconds(),
                dayOfWeek: date.getDay(),
                dayOfYear: Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)),
                weekOfYear: this.getWeekOfYear(date),
                isLeapYear: this.isLeapYear(date.getFullYear()),
                timezoneOffset: date.getTimezoneOffset()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get week of year
     */
    getWeekOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + start.getDay() + 1) / 7);
    }

    /**
     * Check if year is leap year
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Get supported formats
     */
    getSupportedFormats() {
        return this.formats;
    }

    /**
     * Get supported timezones
     */
    getSupportedTimezones() {
        return this.timezones;
    }

    /**
     * Validate timestamp format
     */
    validateTimestamp(timestamp, format) {
        try {
            const date = this.parseTimestamp(timestamp, format);
            return {
                success: true,
                valid: !isNaN(date.getTime()),
                parsed: date.toISOString()
            };
        } catch (error) {
            return {
                success: false,
                valid: false,
                error: error.message
            };
        }
    }

    /**
     * Batch convert timestamps
     */
    batchConvert(timestamps, fromFormat, toFormat, timezone = 'UTC') {
        const results = [];
        
        for (const timestamp of timestamps) {
            const result = this.convertTimestamp(timestamp, fromFormat, toFormat, timezone);
            results.push({
                input: timestamp,
                result: result
            });
        }
        
        return {
            success: true,
            results: results,
            total: timestamps.length,
            successful: results.filter(r => r.result.success).length,
            failed: results.filter(r => !r.result.success).length
        };
    }

    /**
     * Add to history
     */
    addToHistory(operation, input, output) {
        this.history.push({
            timestamp: new Date().toISOString(),
            operation: operation,
            input: input,
            output: output
        });

        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
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
