/**
 * Advanced Timezone Converter
 * Comprehensive timezone conversion with IANA database support, DST handling, and custom formatting
 */

// IANA Timezone Database - Major timezones with transitions
const IANA_TIMEZONE_DB = {
    'UTC': {
        name: 'UTC',
        abbreviation: 'UTC',
        offset_minutes: 0,
        is_dst: false,
        transitions: []
    },
    'America/New_York': {
        name: 'America/New_York',
        abbreviation: 'EST',
        offset_minutes: -300, // -5 hours
        is_dst: false,
        transitions: [
            // DST transitions (simplified - in real implementation, would have more historical data)
            { at_utc_ms: new Date('2024-03-10T07:00:00Z').getTime(), offset_minutes: -240, is_dst: true, abbreviation: 'EDT' },
            { at_utc_ms: new Date('2024-11-03T06:00:00Z').getTime(), offset_minutes: -300, is_dst: false, abbreviation: 'EST' },
            { at_utc_ms: new Date('2025-03-09T07:00:00Z').getTime(), offset_minutes: -240, is_dst: true, abbreviation: 'EDT' },
            { at_utc_ms: new Date('2025-11-02T06:00:00Z').getTime(), offset_minutes: -300, is_dst: false, abbreviation: 'EST' }
        ]
    },
    'America/Los_Angeles': {
        name: 'America/Los_Angeles',
        abbreviation: 'PST',
        offset_minutes: -480, // -8 hours
        is_dst: false,
        transitions: [
            { at_utc_ms: new Date('2024-03-10T10:00:00Z').getTime(), offset_minutes: -420, is_dst: true, abbreviation: 'PDT' },
            { at_utc_ms: new Date('2024-11-03T09:00:00Z').getTime(), offset_minutes: -480, is_dst: false, abbreviation: 'PST' },
            { at_utc_ms: new Date('2025-03-09T10:00:00Z').getTime(), offset_minutes: -420, is_dst: true, abbreviation: 'PDT' },
            { at_utc_ms: new Date('2025-11-02T09:00:00Z').getTime(), offset_minutes: -480, is_dst: false, abbreviation: 'PST' }
        ]
    },
    'Europe/London': {
        name: 'Europe/London',
        abbreviation: 'GMT',
        offset_minutes: 0,
        is_dst: false,
        transitions: [
            { at_utc_ms: new Date('2024-03-31T01:00:00Z').getTime(), offset_minutes: 60, is_dst: true, abbreviation: 'BST' },
            { at_utc_ms: new Date('2024-10-27T01:00:00Z').getTime(), offset_minutes: 0, is_dst: false, abbreviation: 'GMT' },
            { at_utc_ms: new Date('2025-03-30T01:00:00Z').getTime(), offset_minutes: 60, is_dst: true, abbreviation: 'BST' },
            { at_utc_ms: new Date('2025-10-26T01:00:00Z').getTime(), offset_minutes: 0, is_dst: false, abbreviation: 'GMT' }
        ]
    },
    'Europe/Berlin': {
        name: 'Europe/Berlin',
        abbreviation: 'CET',
        offset_minutes: 60,
        is_dst: false,
        transitions: [
            { at_utc_ms: new Date('2024-03-31T01:00:00Z').getTime(), offset_minutes: 120, is_dst: true, abbreviation: 'CEST' },
            { at_utc_ms: new Date('2024-10-27T01:00:00Z').getTime(), offset_minutes: 60, is_dst: false, abbreviation: 'CET' },
            { at_utc_ms: new Date('2025-03-30T01:00:00Z').getTime(), offset_minutes: 120, is_dst: true, abbreviation: 'CEST' },
            { at_utc_ms: new Date('2025-10-26T01:00:00Z').getTime(), offset_minutes: 60, is_dst: false, abbreviation: 'CET' }
        ]
    },
    'Asia/Tokyo': {
        name: 'Asia/Tokyo',
        abbreviation: 'JST',
        offset_minutes: 540, // +9 hours
        is_dst: false,
        transitions: [] // Japan doesn't observe DST
    },
    'Asia/Kolkata': {
        name: 'Asia/Kolkata',
        abbreviation: 'IST',
        offset_minutes: 330, // +5:30 hours
        is_dst: false,
        transitions: [] // India doesn't observe DST
    },
    'Asia/Shanghai': {
        name: 'Asia/Shanghai',
        abbreviation: 'CST',
        offset_minutes: 480, // +8 hours
        is_dst: false,
        transitions: [] // China doesn't observe DST
    },
    'Australia/Sydney': {
        name: 'Australia/Sydney',
        abbreviation: 'AEST',
        offset_minutes: 600, // +10 hours
        is_dst: false,
        transitions: [
            { at_utc_ms: new Date('2024-10-06T16:00:00Z').getTime(), offset_minutes: 660, is_dst: true, abbreviation: 'AEDT' },
            { at_utc_ms: new Date('2025-04-06T16:00:00Z').getTime(), offset_minutes: 600, is_dst: false, abbreviation: 'AEST' },
            { at_utc_ms: new Date('2025-10-05T16:00:00Z').getTime(), offset_minutes: 660, is_dst: true, abbreviation: 'AEDT' }
        ]
    },
    'Pacific/Auckland': {
        name: 'Pacific/Auckland',
        abbreviation: 'NZST',
        offset_minutes: 720, // +12 hours
        is_dst: false,
        transitions: [
            { at_utc_ms: new Date('2024-09-29T14:00:00Z').getTime(), offset_minutes: 780, is_dst: true, abbreviation: 'NZDT' },
            { at_utc_ms: new Date('2025-04-06T14:00:00Z').getTime(), offset_minutes: 720, is_dst: false, abbreviation: 'NZST' },
            { at_utc_ms: new Date('2025-09-28T14:00:00Z').getTime(), offset_minutes: 780, is_dst: true, abbreviation: 'NZDT' }
        ]
    }
};

/**
 * Timezone Database Manager
 * Handles IANA timezone data, transitions, and offset calculations
 */
export class TimezoneDB {
    constructor() {
        this.zones = IANA_TIMEZONE_DB;
    }

    /**
     * Get offset in milliseconds for a given UTC timestamp and timezone
     * @param {number} utcMs - UTC timestamp in milliseconds
     * @param {string} tzName - Timezone name or fixed offset
     * @returns {number} Offset in milliseconds
     */
    getOffsetMsForInstant(utcMs, tzName) {
        // Handle fixed offsets like +05:30, -07:00
        if (this.isFixedOffset(tzName)) {
            return this.parseFixedOffsetToMs(tzName);
        }

        // Handle IANA timezone
        const zone = this.zones[tzName];
        if (!zone) {
            throw new Error(`Unknown timezone: ${tzName}`);
        }

        // Find the applicable transition
        const transition = this.findTransition(zone, utcMs);
        return transition.offset_minutes * 60 * 1000;
    }

    /**
     * Get timezone abbreviation for a given UTC timestamp and timezone
     * @param {number} utcMs - UTC timestamp in milliseconds
     * @param {string} tzName - Timezone name
     * @returns {string} Timezone abbreviation
     */
    getTimezoneAbbreviation(utcMs, tzName) {
        if (this.isFixedOffset(tzName)) {
            return tzName;
        }

        const zone = this.zones[tzName];
        if (!zone) {
            return tzName;
        }

        const transition = this.findTransition(zone, utcMs);
        return transition.abbreviation || zone.abbreviation;
    }

    /**
     * Check if a timezone string is a fixed offset
     * @param {string} tzName - Timezone string
     * @returns {boolean} True if fixed offset
     */
    isFixedOffset(tzName) {
        return /^[+-]\d{2}:\d{2}$/.test(tzName);
    }

    /**
     * Parse fixed offset string to milliseconds
     * @param {string} offsetStr - Offset string like +05:30 or -07:00
     * @returns {number} Offset in milliseconds
     */
    parseFixedOffsetToMs(offsetStr) {
        const match = offsetStr.match(/^([+-])(\d{2}):(\d{2})$/);
        if (!match) {
            throw new Error(`Invalid offset format: ${offsetStr}`);
        }

        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);

        return sign * (hours * 60 + minutes) * 60 * 1000;
    }

    /**
     * Find the applicable timezone transition for a given UTC timestamp
     * @param {Object} zone - Timezone object
     * @param {number} utcMs - UTC timestamp in milliseconds
     * @returns {Object} Transition object with offset and DST info
     */
    findTransition(zone, utcMs) {
        if (!zone.transitions || zone.transitions.length === 0) {
            return {
                offset_minutes: zone.offset_minutes,
                is_dst: zone.is_dst,
                abbreviation: zone.abbreviation
            };
        }

        // Binary search for the applicable transition
        let left = 0;
        let right = zone.transitions.length - 1;
        let result = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (zone.transitions[mid].at_utc_ms <= utcMs) {
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return zone.transitions[result];
    }

    /**
     * Get all supported timezones
     * @returns {Array} Array of timezone names
     */
    getSupportedTimezones() {
        return Object.keys(this.zones);
    }

    /**
     * Get timezone info for a specific timezone
     * @param {string} tzName - Timezone name
     * @returns {Object} Timezone information
     */
    getTimezoneInfo(tzName) {
        if (this.isFixedOffset(tzName)) {
            return {
                name: tzName,
                abbreviation: tzName,
                offset_minutes: this.parseFixedOffsetToMs(tzName) / (60 * 1000),
                is_dst: false,
                transitions: []
            };
        }

        return this.zones[tzName] || null;
    }
}

/**
 * Timezone Formatter
 * Extends timestamp formatting with timezone-specific tokens
 */
export class TimezoneFormatter {
    constructor() {
        this.tzdb = new TimezoneDB();
    }

    /**
     * Format timestamp with timezone-specific tokens
     * @param {number} utcMs - UTC timestamp in milliseconds
     * @param {string} pattern - Format pattern
     * @param {string} tzName - Target timezone
     * @returns {string} Formatted string
     */
    formatWithTimezone(utcMs, pattern, tzName) {
        // Get timezone offset and abbreviation
        const offsetMs = this.tzdb.getOffsetMsForInstant(utcMs, tzName);
        const abbreviation = this.tzdb.getTimezoneAbbreviation(utcMs, tzName);
        
        // Convert to local time in target timezone
        const localMs = utcMs + offsetMs;
        const date = new Date(localMs);

        // Extract date/time components
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour24 = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const second = date.getUTCSeconds();
        const millisecond = date.getUTCMilliseconds();

        // Format offset string
        const offsetMinutes = Math.round(offsetMs / (60 * 1000));
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes >= 0 ? '+' : '-';
        const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;

        // Replace timezone tokens
        let result = pattern
            .replace(/YYYY/g, year.toString())
            .replace(/MM/g, month.toString().padStart(2, '0'))
            .replace(/DD/g, day.toString().padStart(2, '0'))
            .replace(/HH/g, hour24.toString().padStart(2, '0'))
            .replace(/mm/g, minute.toString().padStart(2, '0'))
            .replace(/ss/g, second.toString().padStart(2, '0'))
            .replace(/SSS/g, millisecond.toString().padStart(3, '0'))
            .replace(/Z/g, offsetString)
            .replace(/z/g, abbreviation);

        // Handle 12-hour format
        if (pattern.includes('A')) {
            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
            const ampm = hour24 < 12 ? 'AM' : 'PM';
            result = result.replace(/h/g, hour12.toString().padStart(2, '0'));
            result = result.replace(/A/g, ampm);
        } else {
            result = result.replace(/h/g, hour24.toString().padStart(2, '0'));
        }

        return result;
    }

    /**
     * Format as ISO 8601 with timezone
     * @param {number} utcMs - UTC timestamp in milliseconds
     * @param {string} tzName - Target timezone
     * @returns {string} ISO 8601 formatted string
     */
    formatISO8601WithTimezone(utcMs, tzName) {
        const offsetMs = this.tzdb.getOffsetMsForInstant(utcMs, tzName);
        const localMs = utcMs + offsetMs;
        const date = new Date(localMs);

        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hour = date.getUTCHours().toString().padStart(2, '0');
        const minute = date.getUTCMinutes().toString().padStart(2, '0');
        const second = date.getUTCSeconds().toString().padStart(2, '0');
        const millisecond = date.getUTCMilliseconds().toString().padStart(3, '0');

        const offsetMinutes = Math.round(offsetMs / (60 * 1000));
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes >= 0 ? '+' : '-';
        const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;

        return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}${offsetString}`;
    }
}

/**
 * Timezone Converter
 * Main class for timezone conversion operations
 */
export class TimezoneConverter {
    constructor() {
        this.tzdb = new TimezoneDB();
        this.formatter = new TimezoneFormatter();
    }

    /**
     * Convert timestamp between timezones
     * @param {string|number} inputValue - Input timestamp
     * @param {string|null} inputFormat - Input format pattern
     * @param {string} sourceTz - Source timezone
     * @param {string} targetTz - Target timezone
     * @param {string} outputFormat - Output format pattern
     * @returns {string} Converted timestamp string
     */
    convert(inputValue, inputFormat = null, sourceTz = 'UTC', targetTz = 'UTC', outputFormat = 'ISO8601') {
        try {
            // Validate input first
            if (!this.validateInput(inputValue, inputFormat)) {
                throw new Error('Invalid input format or value');
            }

            // Parse input to UTC milliseconds
            let utcMs = this.parseInput(inputValue, inputFormat, sourceTz);

            // If input format doesn't include timezone info, adjust for source timezone
            if (inputFormat && !this.includesOffset(inputFormat)) {
                const sourceOffsetMs = this.tzdb.getOffsetMsForInstant(utcMs, sourceTz);
                utcMs = utcMs - sourceOffsetMs;
            }

            // Format output in target timezone
            if (outputFormat === 'ISO8601') {
                return this.formatter.formatISO8601WithTimezone(utcMs, targetTz);
            } else {
                return this.formatter.formatWithTimezone(utcMs, outputFormat, targetTz);
            }
        } catch (error) {
            throw new Error(`Timezone conversion failed: ${error.message}`);
        }
    }

    /**
     * Parse input value to UTC milliseconds
     * @param {string|number} inputValue - Input value
     * @param {string|null} inputFormat - Input format
     * @param {string} sourceTz - Source timezone
     * @returns {number} UTC milliseconds
     */
    parseInput(inputValue, inputFormat, sourceTz) {
        // Handle numeric input (epoch)
        if (typeof inputValue === 'number' || /^\d+$/.test(inputValue)) {
            const num = parseInt(inputValue, 10);
            return num.toString().length >= 13 ? num : num * 1000;
        }

        // Handle ISO 8601
        if (this.isISO8601(inputValue)) {
            return this.parseISO8601(inputValue);
        }

        // Handle custom format
        if (inputFormat) {
            return this.parseWithPattern(inputValue, inputFormat);
        }

        // Auto-detect format
        return this.autoParse(inputValue);
    }

    /**
     * Check if input format includes timezone offset
     * @param {string} format - Format pattern
     * @returns {boolean} True if includes offset
     */
    includesOffset(format) {
        return format.includes('Z') || format.includes('z');
    }

    /**
     * Check if string is ISO 8601 format
     * @param {string} str - Input string
     * @returns {boolean} True if ISO 8601
     */
    isISO8601(str) {
        return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|([+-]\d{2}:\d{2}))?$/.test(str);
    }

    /**
     * Parse ISO 8601 string
     * @param {string} str - ISO 8601 string
     * @returns {number} UTC milliseconds
     */
    parseISO8601(str) {
        const match = str.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|([+-])(\d{2}):(\d{2}))?$/);
        if (!match) {
            throw new Error('Invalid ISO 8601 format');
        }

        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = parseInt(match[3], 10);
        const hour = parseInt(match[4], 10);
        const minute = parseInt(match[5], 10);
        const second = parseInt(match[6], 10);
        const millisecond = parseInt(match[7] || '0', 10);

        // Validate date/time values
        if (month < 0 || month > 11) throw new Error('Invalid month');
        if (day < 1 || day > 31) throw new Error('Invalid day');
        if (hour < 0 || hour > 23) throw new Error('Invalid hour');
        if (minute < 0 || minute > 59) throw new Error('Invalid minute');
        if (second < 0 || second > 59) throw new Error('Invalid second');
        if (millisecond < 0 || millisecond > 999) throw new Error('Invalid millisecond');

        let utcMs = Date.UTC(year, month, day, hour, minute, second, millisecond);

        // Validate the resulting date
        if (isNaN(utcMs)) {
            throw new Error('Invalid date/time values');
        }

        // Handle timezone offset
        if (match[8] && match[8] !== 'Z') {
            const offsetSign = match[9] === '+' ? 1 : -1;
            const offsetHours = parseInt(match[10], 10);
            const offsetMinutes = parseInt(match[11], 10);
            const offsetMs = offsetSign * (offsetHours * 60 + offsetMinutes) * 60 * 1000;
            utcMs = utcMs - offsetMs;
        }

        return utcMs;
    }

    /**
     * Parse with custom pattern
     * @param {string} str - Input string
     * @param {string} pattern - Pattern
     * @returns {number} UTC milliseconds
     */
    parseWithPattern(str, pattern) {
        const fields = this.extractFields(str, pattern);
        
        // Check if we extracted any meaningful values
        const hasYear = fields.YYYY !== undefined;
        const hasMonth = fields.MM !== undefined;
        const hasDay = fields.DD !== undefined;
        
        if (!hasYear && !hasMonth && !hasDay) {
            throw new Error('No valid date fields extracted');
        }
        
        const year = fields.YYYY || new Date().getFullYear();
        const month = (fields.MM || 1) - 1;
        const day = fields.DD || 1;
        const hour = fields.HH || fields.h || 0;
        const minute = fields.mm || 0;
        const second = fields.ss || 0;
        const millisecond = fields.SSS || 0;

        // Handle 12-hour format
        let hour24 = hour;
        if (fields.A) {
            if (fields.A === 'PM' && hour < 12) {
                hour24 = hour + 12;
            } else if (fields.A === 'AM' && hour === 12) {
                hour24 = 0;
            }
        }

        const result = Date.UTC(year, month, day, hour24, minute, second, millisecond);
        if (isNaN(result)) {
            throw new Error('Invalid date/time values');
        }

        return result;
    }

    /**
     * Extract fields from string using pattern
     * @param {string} str - Input string
     * @param {string} pattern - Pattern
     * @returns {Object} Extracted fields
     */
    extractFields(str, pattern) {
        const fields = {};
        let strIndex = 0;
        let patternIndex = 0;

        while (patternIndex < pattern.length && strIndex < str.length) {
            const patternChar = pattern[patternIndex];
            
            // Check for 4-character tokens first
            if (patternIndex + 3 < pattern.length) {
                const token4 = pattern.substring(patternIndex, patternIndex + 4);
                if (token4 === 'YYYY' || token4 === 'SSS') {
                    const value = this.extractNumericValue(str, strIndex, 4);
                    if (value !== null) {
                        fields[token4] = value;
                        strIndex += 4;
                        patternIndex += 4;
                        continue;
                    }
                }
            }

            // Check for 2-character tokens
            if (patternIndex + 1 < pattern.length) {
                const token2 = pattern.substring(patternIndex, patternIndex + 2);
                if (['MM', 'DD', 'HH', 'mm', 'ss'].includes(token2)) {
                    const value = this.extractNumericValue(str, strIndex, 2);
                    if (value !== null) {
                        fields[token2] = value;
                        strIndex += 2;
                        patternIndex += 2;
                        continue;
                    }
                }
            }

            // Check for single character tokens
            if (patternChar === 'h') {
                // Try to extract 2 digits first, then 1 digit
                let value = this.extractNumericValue(str, strIndex, 2);
                if (value !== null && value <= 12) {
                    fields.h = value;
                    strIndex += 2;
                    patternIndex += 1;
                    continue;
                } else {
                    value = this.extractNumericValue(str, strIndex, 1);
                    if (value !== null) {
                        fields.h = value;
                        strIndex += 1;
                        patternIndex += 1;
                        continue;
                    }
                }
            }

            if (patternChar === 'A') {
                if (strIndex + 1 < str.length) {
                    const ampm = str.substring(strIndex, strIndex + 2);
                    if (ampm === 'AM' || ampm === 'PM') {
                        fields.A = ampm;
                        strIndex += 2;
                        patternIndex += 1;
                        continue;
                    }
                }
            }

            // Skip non-token characters (including separators like /, -, :, space)
            if (patternChar === str[strIndex]) {
                strIndex++;
                patternIndex++;
            } else if (this.isSeparator(patternChar) && this.isSeparator(str[strIndex])) {
                // Both are separators, advance both
                strIndex++;
                patternIndex++;
            } else if (this.isSeparator(patternChar)) {
                // Pattern has separator but string doesn't, just advance pattern
                patternIndex++;
            } else if (this.isSeparator(str[strIndex])) {
                // String has separator but pattern doesn't, just advance string
                strIndex++;
            } else {
                // No match, advance pattern
                patternIndex++;
            }
        }

        return fields;
    }

    /**
     * Check if character is a separator
     * @param {string} char - Character to check
     * @returns {boolean} True if separator
     */
    isSeparator(char) {
        return ['/', '-', ':', ' ', 'T'].includes(char);
    }

    /**
     * Extract numeric value from string
     * @param {string} str - Input string
     * @param {number} start - Start index
     * @param {number} length - Expected length
     * @returns {number|null} Extracted value or null
     */
    extractNumericValue(str, start, length) {
        if (start + length > str.length) return null;
        
        const substr = str.substring(start, start + length);
        const num = parseInt(substr, 10);
        
        return isNaN(num) ? null : num;
    }

    /**
     * Auto-parse common formats
     * @param {string} str - Input string
     * @returns {number} UTC milliseconds
     */
    autoParse(str) {
        // Try common patterns
        const patterns = [
            'YYYY-MM-DD HH:mm:ss',
            'YYYY/MM/DD HH:mm:ss',
            'MM/DD/YYYY HH:mm:ss',
            'DD/MM/YYYY HH:mm:ss',
            'YYYY-MM-DD',
            'MM/DD/YYYY',
            'DD/MM/YYYY'
        ];

        for (const pattern of patterns) {
            try {
                const result = this.parseWithPattern(str, pattern);
                if (!isNaN(result)) {
                    return result;
                }
            } catch (e) {
                continue;
            }
        }

        throw new Error('Unable to auto-parse timestamp format');
    }

    /**
     * Get supported timezones
     * @returns {Array} Array of timezone names
     */
    getSupportedTimezones() {
        return this.tzdb.getSupportedTimezones();
    }

    /**
     * Get timezone info
     * @param {string} tzName - Timezone name
     * @returns {Object} Timezone information
     */
    getTimezoneInfo(tzName) {
        return this.tzdb.getTimezoneInfo(tzName);
    }

    /**
     * Validate input
     * @param {string|number} inputValue - Input value
     * @param {string|null} inputFormat - Input format
     * @returns {boolean} True if valid
     */
    validateInput(inputValue, inputFormat = null) {
        try {
            const result = this.parseInput(inputValue, inputFormat, 'UTC');
            return !isNaN(result) && result > 0 && result < Number.MAX_SAFE_INTEGER;
        } catch (error) {
            return false;
        }
    }
}

/**
 * Utility functions for timezone operations
 */
export const TimezoneUtils = {
    /**
     * Get current time in a specific timezone
     * @param {string} tzName - Timezone name
     * @param {string} format - Output format
     * @returns {string} Current time string
     */
    getCurrentTimeInTimezone(tzName, format = 'ISO8601') {
        const converter = new TimezoneConverter();
        const now = Date.now();
        return converter.convert(now, null, 'UTC', tzName, format);
    },

    /**
     * Get timezone offset for current time
     * @param {string} tzName - Timezone name
     * @returns {number} Offset in minutes
     */
    getCurrentTimezoneOffset(tzName) {
        const tzdb = new TimezoneDB();
        const now = Date.now();
        return tzdb.getOffsetMsForInstant(now, tzName) / (60 * 1000);
    },

    /**
     * Check if timezone observes DST
     * @param {string} tzName - Timezone name
     * @returns {boolean} True if observes DST
     */
    observesDST(tzName) {
        const tzdb = new TimezoneDB();
        const info = tzdb.getTimezoneInfo(tzName);
        return info && info.transitions && info.transitions.length > 0;
    },

    /**
     * Get timezone abbreviation for current time
     * @param {string} tzName - Timezone name
     * @returns {string} Timezone abbreviation
     */
    getCurrentTimezoneAbbreviation(tzName) {
        const tzdb = new TimezoneDB();
        const now = Date.now();
        return tzdb.getTimezoneAbbreviation(now, tzName);
    }
};
