/**
 * Advanced Timestamp Converter
 * Comprehensive timestamp conversion with timezone support, pattern parsing, and relative time
 * Supports epoch seconds/milliseconds, ISO 8601, custom patterns, and IANA timezones
 */

// Common regex patterns for timestamp detection
const ISO8601_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(?:Z|([+-]\d{2}):(\d{2}))?$/;
const EPOCH_REGEX = /^\d+$/;
const COMMON_PATTERNS = [
    'YYYY-MM-DD HH:mm:ss',
    'MM/DD/YYYY HH:mm:ss',
    'DD/MM/YYYY HH:mm:ss',
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD/MM/YYYY'
];

// IANA timezone database (simplified for common timezones)
const TIMEZONE_DB = {
    'UTC': { offset: 0, dst: false },
    'GMT': { offset: 0, dst: false },
    'EST': { offset: -300, dst: false }, // -5 hours
    'EDT': { offset: -240, dst: true },  // -4 hours
    'CST': { offset: -360, dst: false }, // -6 hours
    'CDT': { offset: -300, dst: true },  // -5 hours
    'MST': { offset: -420, dst: false }, // -7 hours
    'MDT': { offset: -360, dst: true },  // -6 hours
    'PST': { offset: -480, dst: false }, // -8 hours
    'PDT': { offset: -420, dst: true },  // -7 hours
    'IST': { offset: 330, dst: false },  // +5:30 hours
    'JST': { offset: 540, dst: false },  // +9 hours
    'CET': { offset: 60, dst: false },   // +1 hour
    'CEST': { offset: 120, dst: true },  // +2 hours
    'AEST': { offset: 600, dst: false }, // +10 hours
    'AEDT': { offset: 660, dst: true },  // +11 hours
    // IANA timezone names (simplified)
    'America/New_York': { offset: -300, dst: true },
    'America/Chicago': { offset: -360, dst: true },
    'America/Denver': { offset: -420, dst: true },
    'America/Los_Angeles': { offset: -480, dst: true },
    'Europe/London': { offset: 0, dst: true },
    'Europe/Paris': { offset: 60, dst: true },
    'Asia/Tokyo': { offset: 540, dst: false },
    'Asia/Kolkata': { offset: 330, dst: false },
    'Asia/Shanghai': { offset: 480, dst: false },
    'Australia/Sydney': { offset: 600, dst: true }
};

/**
 * Phase 1: Input Parsing
 */
export class TimestampParser {
    constructor() {
        this.commonPatterns = COMMON_PATTERNS;
    }

    parse(inputValue, inputFormat = null) {
        /**
         * Parse input timestamp into internal UTC milliseconds since epoch.
         * @param {string|number} inputValue - The timestamp to parse
         * @param {string|null} inputFormat - Format pattern or null for auto-detect
         * @returns {number} UTC milliseconds since epoch
         */
        try {
            if (typeof inputValue === 'number') {
                return this.parseNumber(inputValue);
            }

            if (typeof inputValue === 'string') {
                if (inputFormat) {
                    return this.parseWithPattern(inputValue, inputFormat);
                } else {
                    return this.autoParse(inputValue);
                }
            }

            throw new Error('Invalid input type. Expected string or number.');
        } catch (error) {
            throw new Error(`Failed to parse timestamp: ${error.message}`);
        }
    }

    parseNumber(value) {
        const strVal = String(value);
        // Epoch milliseconds if length >= 13, else seconds
        if (strVal.length >= 13) {
            return parseInt(value); // ms since epoch
        } else {
            return parseInt(value) * 1000; // convert s → ms
        }
    }

    autoParse(s) {
        /**
         * Auto-detect ISO 8601 or epoch in string form.
         */
        if (EPOCH_REGEX.test(s)) {
            return this.parseNumber(parseInt(s));
        }

        // ISO 8601 detection
        const isoMatch = s.match(ISO8601_REGEX);
        if (isoMatch) {
            return this.parseISO8601(s);
        }

        // Fallback: try common patterns
        for (const pattern of this.commonPatterns) {
            try {
                const result = this.parseWithPattern(s, pattern);
                if (!isNaN(result)) {
                    return result;
                }
            } catch (e) {
                continue;
            }
        }

        throw new Error(`Unrecognized timestamp format: ${s}`);
    }

    parseISO8601(s) {
        /**
         * Parse ISO 8601 string to UTC milliseconds
         */
        const match = s.match(ISO8601_REGEX);
        if (!match) {
            throw new Error('Invalid ISO 8601 format');
        }

        const [, year, month, day, hour, minute, second, fractional, tzSign, tzHour, tzMinute] = match;
        
        // Parse fractional seconds
        const ms = fractional ? parseInt(fractional.padEnd(3, '0')) : 0;
        
        // Parse timezone offset
        let tzOffsetMs = 0;
        if (tzSign && tzHour && tzMinute) {
            const tzOffsetMinutes = parseInt(tzHour) * 60 + parseInt(tzMinute);
            tzOffsetMs = (tzSign === '+' ? 1 : -1) * tzOffsetMinutes * 60 * 1000;
        }

        // Create date in UTC
        const utcMs = Date.UTC(
            parseInt(year),
            parseInt(month) - 1, // months are 0-indexed
            parseInt(day),
            parseInt(hour),
            parseInt(minute),
            parseInt(second),
            ms
        );

        // Adjust for timezone offset
        return utcMs - tzOffsetMs;
    }

    parseWithPattern(s, pattern) {
        /**
         * Parse string using a custom pattern
         * Tokens: YYYY, MM, DD, HH, mm, ss, SSS, A (AM/PM), Z (timezone offset)
         */
        const fields = this.extractFields(s, pattern);
        
        // Convert 12h → 24h if A present
        let hour = fields.hour;
        if (fields.ampm) {
            if (fields.ampm === 'PM' && hour < 12) hour += 12;
            if (fields.ampm === 'AM' && hour === 12) hour = 0;
        }

        // Build UTC milliseconds
        const tzOffsetMs = fields.tzOffsetMs || 0;
        const utcMs = Date.UTC(
            fields.year,
            (fields.month || 1) - 1, // months are 0-indexed, default to January
            fields.day || 1, // default to 1st day
            hour || 0, // default to midnight
            fields.minute || 0,
            fields.second || 0,
            fields.millisecond || 0
        );

        const result = utcMs - tzOffsetMs;
        if (isNaN(result)) {
            throw new Error(`Invalid date/time values in pattern: ${s}`);
        }
        return result;
    }

    extractFields(s, pattern) {
        /**
         * Extract date-time fields from string using pattern
         */
        const fields = {};
        let patternIndex = 0;
        let stringIndex = 0;

        while (patternIndex < pattern.length && stringIndex < s.length) {
            // Check for 4-character tokens first
            if (patternIndex + 4 <= pattern.length) {
                const token4 = pattern.substring(patternIndex, patternIndex + 4);
                if (token4 === 'YYYY') {
                    fields.year = parseInt(s.substring(stringIndex, stringIndex + 4));
                    stringIndex += 4;
                    patternIndex += 4;
                    continue;
                } else if (token4 === 'SSS') {
                    fields.millisecond = parseInt(s.substring(stringIndex, stringIndex + 3));
                    stringIndex += 3;
                    patternIndex += 3;
                    continue;
                }
            }
            
            // Check for 2-character tokens
            if (patternIndex + 2 <= pattern.length) {
                const token2 = pattern.substring(patternIndex, patternIndex + 2);
                if (token2 === 'MM') {
                    fields.month = parseInt(s.substring(stringIndex, stringIndex + 2));
                    stringIndex += 2;
                    patternIndex += 2;
                    continue;
                } else if (token2 === 'DD') {
                    fields.day = parseInt(s.substring(stringIndex, stringIndex + 2));
                    stringIndex += 2;
                    patternIndex += 2;
                    continue;
                } else if (token2 === 'HH') {
                    fields.hour = parseInt(s.substring(stringIndex, stringIndex + 2));
                    stringIndex += 2;
                    patternIndex += 2;
                    continue;
                } else if (token2 === 'mm') {
                    fields.minute = parseInt(s.substring(stringIndex, stringIndex + 2));
                    stringIndex += 2;
                    patternIndex += 2;
                    continue;
                } else if (token2 === 'ss') {
                    fields.second = parseInt(s.substring(stringIndex, stringIndex + 2));
                    stringIndex += 2;
                    patternIndex += 2;
                    continue;
                }
            }
            
            // Check for single character tokens
            if (pattern[patternIndex] === 'h') {
                // Handle hour (1 or 2 digits)
                let hourStr = '';
                if (stringIndex + 1 < s.length && s[stringIndex + 1] !== ':') {
                    // Two digit hour
                    hourStr = s.substring(stringIndex, stringIndex + 2);
                    stringIndex += 2;
                } else {
                    // Single digit hour
                    hourStr = s.substring(stringIndex, stringIndex + 1);
                    stringIndex += 1;
                }
                fields.hour = parseInt(hourStr);
                patternIndex += 1;
                continue;
            } else if (pattern[patternIndex] === 'A') {
                // Look for AM/PM
                const ampm = s.substring(stringIndex, stringIndex + 2).toUpperCase();
                if (ampm === 'AM' || ampm === 'PM') {
                    fields.ampm = ampm;
                    stringIndex += 2;
                    patternIndex += 1;
                } else {
                    patternIndex++;
                }
            } else if (pattern[patternIndex] === 'Z') {
                // Parse timezone offset
                const tzMatch = s.substring(stringIndex).match(/^([+-]\d{2}):(\d{2})/);
                if (tzMatch) {
                    const [, sign, hours, minutes] = tzMatch;
                    const offsetMinutes = parseInt(hours) * 60 + parseInt(minutes);
                    fields.tzOffsetMs = (sign === '+' ? 1 : -1) * offsetMinutes * 60 * 1000;
                    stringIndex += 6; // +HH:MM
                }
                patternIndex++;
            } else {
                // Skip non-token characters
                if (pattern[patternIndex] === s[stringIndex]) {
                    stringIndex++;
                } else if (pattern[patternIndex] === ' ' && s[stringIndex] === ' ') {
                    // Handle spaces
                    stringIndex++;
                }
                patternIndex++;
            }
        }

        return fields;
    }
}

/**
 * Phase 2: Internal Representation
 * Represent timestamps as 64-bit integer of milliseconds since Unix epoch
 */

/**
 * Phase 3: Formatting & Conversion
 */
export class TimestampFormatter {
    constructor() {
        this.timezoneDb = TIMEZONE_DB;
    }

    format(utcMs, outputFormat = "ISO8601", targetTz = "UTC") {
        /**
         * Format internal UTC ms into desired string
         * @param {number} utcMs - UTC milliseconds since epoch
         * @param {string} outputFormat - Output format type
         * @param {string} targetTz - Target timezone
         * @returns {string} Formatted timestamp
         */
        try {
            if (outputFormat === "epoch_ms") {
                return String(utcMs);
            }
            
            if (outputFormat === "epoch_s") {
                return String(Math.floor(utcMs / 1000));
            }
            
            if (outputFormat === "ISO8601") {
                return this.formatISO8601(utcMs, targetTz);
            }
            
            if (outputFormat === "relative") {
                return this.humanReadableRelative(utcMs);
            }
            
            // Custom pattern
            return this.formatWithPattern(utcMs, outputFormat, targetTz);
        } catch (error) {
            throw new Error(`Failed to format timestamp: ${error.message}`);
        }
    }

    formatISO8601(utcMs, targetTz = "UTC") {
        /**
         * Format as ISO 8601 string
         */
        const localDt = this.utcMsToLocal(utcMs, targetTz);
        const { year, month, day, hour, minute, second, millisecond, offset } = localDt;
        
        const dateStr = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        const msStr = millisecond > 0 ? `.${millisecond.toString().padStart(3, '0')}` : '';
        
        let tzStr = '';
        if (offset === 0) {
            tzStr = 'Z';
        } else {
            const offsetHours = Math.floor(Math.abs(offset) / 60);
            const offsetMinutes = Math.abs(offset) % 60;
            const sign = offset >= 0 ? '+' : '-';
            tzStr = `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
        }
        
        return `${dateStr}T${timeStr}${msStr}${tzStr}`;
    }

    formatWithPattern(utcMs, pattern, targetTz = "UTC") {
        /**
         * Format using custom pattern
         */
        const localDt = this.utcMsToLocal(utcMs, targetTz);
        let result = pattern;
        
        // Handle 12-hour format first
        let hourValue = localDt.hour;
        if (pattern.includes('A')) {
            const ampm = hourValue >= 12 ? 'PM' : 'AM';
            if (hourValue === 0) hourValue = 12;
            if (hourValue > 12) hourValue -= 12;
            result = result.replace(/A/g, ampm);
        }
        
        // Replace tokens with values
        result = result.replace(/YYYY/g, localDt.year.toString().padStart(4, '0'));
        result = result.replace(/MM/g, localDt.month.toString().padStart(2, '0'));
        result = result.replace(/DD/g, localDt.day.toString().padStart(2, '0'));
        result = result.replace(/HH/g, hourValue.toString().padStart(2, '0'));
        result = result.replace(/h/g, hourValue.toString().padStart(2, '0'));
        result = result.replace(/mm/g, localDt.minute.toString().padStart(2, '0'));
        result = result.replace(/ss/g, localDt.second.toString().padStart(2, '0'));
        result = result.replace(/SSS/g, localDt.millisecond.toString().padStart(3, '0'));
        
        // Handle timezone
        if (pattern.includes('Z')) {
            let tzStr = '';
            if (localDt.offset === 0) {
                tzStr = 'Z';
            } else {
                const offsetHours = Math.floor(Math.abs(localDt.offset) / 60);
                const offsetMinutes = Math.abs(localDt.offset) % 60;
                const sign = localDt.offset >= 0 ? '+' : '-';
                tzStr = `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
            }
            result = result.replace(/Z/g, tzStr);
        }
        
        return result;
    }

    humanReadableRelative(utcMs) {
        /**
         * Generate human-readable relative time
         */
        const nowMs = Date.now();
        const diffMs = utcMs - nowMs;
        const absDiffMs = Math.abs(diffMs);
        
        const seconds = Math.floor(absDiffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        const isPast = diffMs < 0;
        const suffix = isPast ? 'ago' : 'in';
        
        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''} ${suffix}`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''} ${suffix}`;
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${suffix}`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${suffix}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ${suffix}`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ${suffix}`;
        }
    }

    utcMsToLocal(utcMs, targetTz = "UTC") {
        /**
         * Convert UTC milliseconds to local timezone
         */
        const date = new Date(utcMs);
        
        // Get timezone offset
        let offset = 0;
        if (targetTz !== "UTC") {
            const tzInfo = this.timezoneDb[targetTz];
            if (tzInfo) {
                offset = tzInfo.offset;
            } else {
                // Try to parse as offset string like "+05:30"
                const offsetMatch = targetTz.match(/^([+-])(\d{2}):(\d{2})$/);
                if (offsetMatch) {
                    const [, sign, hours, minutes] = offsetMatch;
                    offset = (sign === '+' ? 1 : -1) * (parseInt(hours) * 60 + parseInt(minutes));
                }
            }
        }
        
        // Apply offset
        const localMs = utcMs + (offset * 60 * 1000);
        const localDate = new Date(localMs);
        
        return {
            year: localDate.getUTCFullYear(),
            month: localDate.getUTCMonth() + 1,
            day: localDate.getUTCDate(),
            hour: localDate.getUTCHours(),
            minute: localDate.getUTCMinutes(),
            second: localDate.getUTCSeconds(),
            millisecond: localDate.getUTCMilliseconds(),
            offset: offset
        };
    }
}

/**
 * Phase 4: Time Zone Handling
 */
export class TimezoneHandler {
    constructor() {
        this.timezoneDb = TIMEZONE_DB;
    }

    getOffsetForInstant(utcMs, tzName) {
        /**
         * Get timezone offset for a specific instant
         */
        const tzInfo = this.timezoneDb[tzName];
        if (tzInfo) {
            return tzInfo.offset; // in minutes
        }
        
        // Try to parse as offset string
        const offsetMatch = tzName.match(/^([+-])(\d{2}):(\d{2})$/);
        if (offsetMatch) {
            const [, sign, hours, minutes] = offsetMatch;
            return (sign === '+' ? 1 : -1) * (parseInt(hours) * 60 + parseInt(minutes));
        }
        
        return 0; // Default to UTC
    }

    applyOffset(utcMs, offsetMinutes) {
        /**
         * Apply timezone offset to UTC milliseconds
         */
        return utcMs + (offsetMinutes * 60 * 1000);
    }

    getSupportedTimezones() {
        /**
         * Get list of supported timezones
         */
        return Object.keys(this.timezoneDb);
    }
}

/**
 * Phase 5: Main API
 */
export class TimestampConverter {
    constructor() {
        this.parser = new TimestampParser();
        this.formatter = new TimestampFormatter();
        this.timezoneHandler = new TimezoneHandler();
    }

    convert(inputValue, inputFormat = null, outputFormat = "ISO8601", targetTz = "UTC") {
        /**
         * Full conversion pipeline
         * @param {string|number} inputValue - Input timestamp
         * @param {string|null} inputFormat - Input format pattern
         * @param {string} outputFormat - Output format
         * @param {string} targetTz - Target timezone
         * @returns {string} Converted timestamp
         */
        try {
            // Parse input to UTC milliseconds
            const utcMs = this.parser.parse(inputValue, inputFormat);
            
            // Format to desired output
            return this.formatter.format(utcMs, outputFormat, targetTz);
        } catch (error) {
            throw new Error(`Conversion failed: ${error.message}`);
        }
    }

    getSupportedFormats() {
        /**
         * Get list of supported output formats
         */
        return [
            'ISO8601',
            'epoch_s',
            'epoch_ms',
            'relative',
            'YYYY-MM-DD HH:mm:ss',
            'MM/DD/YYYY HH:mm:ss',
            'DD/MM/YYYY HH:mm:ss',
            'YYYY-MM-DD HH:mm:ss Z',
            'MM/DD/YYYY h:mm A',
            'DD/MM/YYYY h:mm A'
        ];
    }

    getSupportedTimezones() {
        /**
         * Get list of supported timezones
         */
        return this.timezoneHandler.getSupportedTimezones();
    }

    validateInput(inputValue, inputFormat = null) {
        /**
         * Validate if input can be parsed
         */
        try {
            this.parser.parse(inputValue, inputFormat);
            return { valid: true, error: null };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

/**
 * Utility Functions
 */
export class TimestampUtils {
    static now() {
        /**
         * Get current timestamp in UTC milliseconds
         */
        return Date.now();
    }

    static nowInFormat(format = "ISO8601", timezone = "UTC") {
        /**
         * Get current timestamp in specified format
         */
        const converter = new TimestampConverter();
        return converter.convert(Date.now(), null, format, timezone);
    }

    static getTimezoneOffset(timezone) {
        /**
         * Get timezone offset in minutes
         */
        const handler = new TimezoneHandler();
        return handler.getOffsetForInstant(Date.now(), timezone);
    }

    static formatDuration(milliseconds) {
        /**
         * Format duration in human-readable format
         */
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}
