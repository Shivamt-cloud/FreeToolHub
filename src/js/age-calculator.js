// Advanced Age Calculator Module for FreeToolHub
// Implements sophisticated age calculations with leap year logic and ISO 8601 parsing

class AgeCalculator {
    constructor() {
        this.feb29Modes = {
            FEB28: 'feb28',
            MARCH1: 'march1'
        };

        this.outputUnits = {
            CALENDAR: 'calendar',
            DURATION: 'duration'
        };

        this.timeZones = {
            UTC: 'UTC',
            LOCAL: 'local',
            ASIA_KOLKATA: 'Asia/Kolkata',
            AMERICA_NEW_YORK: 'America/New_York',
            EUROPE_LONDON: 'Europe/London'
        };

        // Month lengths (non-leap year)
        this.monthLengths = {
            1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
            7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
        };

        // Month names for display
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Default settings
        this.defaultFeb29Mode = this.feb29Modes.MARCH1;
        this.defaultTimezone = this.timeZones.LOCAL;
        this.defaultOutputUnits = this.outputUnits.CALENDAR;
    }

    // Check if a year is a leap year (Gregorian calendar rules)
    isLeapYear(year) {
        if (typeof year !== 'number' || isNaN(year)) {
            throw new Error('Year must be a valid number');
        }
        
        // Gregorian leap year rule:
        // A year is a leap year if year % 4 == 0 and year % 100 != 0, or if year % 400 == 0
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Get the number of days in a specific month of a specific year
    getDaysInMonth(year, month) {
        if (typeof year !== 'number' || typeof month !== 'number' || isNaN(year) || isNaN(month)) {
            throw new Error('Year and month must be valid numbers');
        }

        if (month < 1 || month > 12) {
            throw new Error('Month must be between 1 and 12');
        }

        // February has special handling for leap years
        if (month === 2) {
            return this.isLeapYear(year) ? 29 : 28;
        }

        return this.monthLengths[month];
    }

    // Parse ISO 8601 date string
    parseISODate(dateString) {
        if (typeof dateString !== 'string') {
            throw new Error('Date must be a string');
        }

        // Handle various ISO 8601 formats
        let date;
        
        try {
            // Try parsing as full ISO string first
            date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date format');
            }
        } catch (error) {
            throw new Error(`Failed to parse date: ${dateString}`);
        }

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // JavaScript months are 0-indexed
            day: date.getDate(),
            original: dateString
        };
    }

    // Convert date to ordinal day count (days since year 1)
    dateToOrdinal(year, month, day) {
        if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
            throw new Error('Year, month, and day must be valid numbers');
        }

        let days = 0;

        // Add days from all previous years
        for (let y = 1; y < year; y++) {
            days += this.isLeapYear(y) ? 366 : 365;
        }

        // Add days from all previous months in current year
        for (let m = 1; m < month; m++) {
            days += this.getDaysInMonth(year, m);
        }

        // Add days in current month
        days += day;

        return days;
    }

    // Add months to a date, handling month length changes
    addMonths(year, month, day, monthsToAdd) {
        if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number' || typeof monthsToAdd !== 'number') {
            throw new Error('All parameters must be valid numbers');
        }

        // Calculate new year and month
        let totalMonths = (year * 12 + (month - 1)) + monthsToAdd;
        let newYear = Math.floor(totalMonths / 12);
        let newMonth = (totalMonths % 12) + 1;

        // Adjust day if it exceeds the new month's length
        let maxDays = this.getDaysInMonth(newYear, newMonth);
        let newDay = Math.min(day, maxDays);

        return { year: newYear, month: newMonth, day: newDay };
    }

    // Calculate next birthday date
    calculateNextBirthday(birthYear, birthMonth, birthDay, referenceYear, referenceMonth, referenceDay, feb29Mode = this.defaultFeb29Mode) {
        if (typeof birthYear !== 'number' || typeof birthMonth !== 'number' || typeof birthDay !== 'number') {
            throw new Error('Birth date parameters must be valid numbers');
        }

        if (typeof referenceYear !== 'number' || typeof referenceMonth !== 'number' || typeof referenceDay !== 'number') {
            throw new Error('Reference date parameters must be valid numbers');
        }

        let candidateYear = referenceYear;
        let birthdayMonth = birthMonth;
        let birthdayDay = birthDay;

        // Handle February 29 in non-leap years
        if (birthMonth === 2 && birthDay === 29 && !this.isLeapYear(candidateYear)) {
            if (feb29Mode === this.feb29Modes.FEB28) {
                birthdayDay = 28;
            } else {
                birthdayMonth = 3;
                birthdayDay = 1;
            }
        }

        // Check if birthday this year has already passed
        if (this.compareDates(candidateYear, birthdayMonth, birthdayDay, referenceYear, referenceMonth, referenceDay) < 0) {
            // Birthday has passed, move to next year
            candidateYear++;
            birthdayMonth = birthMonth;
            birthdayDay = birthDay;

            // Handle February 29 in non-leap years for next year
            if (birthMonth === 2 && birthDay === 29 && !this.isLeapYear(candidateYear)) {
                if (feb29Mode === this.feb29Modes.FEB28) {
                    birthdayDay = 28;
                } else {
                    birthdayMonth = 3;
                    birthdayDay = 1;
                }
            }
        }

        return {
            year: candidateYear,
            month: birthdayMonth,
            day: birthdayDay
        };
    }

    // Compare two dates (returns -1 if first < second, 0 if equal, 1 if first > second)
    compareDates(year1, month1, day1, year2, month2, day2) {
        if (year1 < year2) return -1;
        if (year1 > year2) return 1;
        if (month1 < month2) return -1;
        if (month1 > month2) return 1;
        if (day1 < day2) return -1;
        if (day1 > day2) return 1;
        return 0;
    }

    // Calculate age between two dates using borrowing algorithm
    calculateAge(birthDate, referenceDate = null, timezone = this.defaultTimezone, feb29Mode = this.defaultFeb29Mode, outputUnits = this.defaultOutputUnits) {
        try {
            // Parse dates
            const birth = this.parseISODate(birthDate);
            const reference = referenceDate ? this.parseISODate(referenceDate) : this.getCurrentDate();

            // Validate that reference date is not before birth date
            if (this.compareDates(reference.year, reference.month, reference.day, birth.year, birth.month, birth.day) < 0) {
                throw new Error('Reference date cannot be before birth date');
            }

            // Calculate age using borrowing algorithm
            let years = reference.year - birth.year;
            let months = reference.month - birth.month;
            let days = reference.day - birth.day;

            // Borrow days if needed
            if (days < 0) {
                months--;
                if (months < 0) {
                    years--;
                    months += 12;
                }
                // Add days from the previous month
                const prevMonth = months === 0 ? 12 : months;
                const prevYear = months === 0 ? reference.year - 1 : reference.year;
                days += this.getDaysInMonth(prevYear, prevMonth);
            }

            // Borrow months if needed
            if (months < 0) {
                years--;
                months += 12;
            }

            // Calculate totals
            const birthOrdinal = this.dateToOrdinal(birth.year, birth.month, birth.day);
            const referenceOrdinal = this.dateToOrdinal(reference.year, reference.month, reference.day);
            const totalDays = referenceOrdinal - birthOrdinal;
            const totalWeeks = totalDays / 7.0;
            const totalMonths = (reference.year - birth.year) * 12 + (reference.month - birth.month) + (reference.day - birth.day) / Math.max(1, this.getDaysInMonth(reference.year, reference.month));

            // Calculate next birthday
            const nextBirthday = this.calculateNextBirthday(
                birth.year, birth.month, birth.day,
                reference.year, reference.month, reference.day,
                feb29Mode
            );

            const daysUntilNextBirthday = this.dateToOrdinal(nextBirthday.year, nextBirthday.month, nextBirthday.day) - referenceOrdinal;

            // Format results
            const result = {
                success: true,
                age: {
                    years: years,
                    months: months,
                    days: days
                },
                totals: {
                    days: totalDays,
                    weeks: Math.round(totalWeeks * 100) / 100,
                    months: Math.round(totalMonths * 100) / 100
                },
                nextBirthday: {
                    date: nextBirthday,
                    daysUntil: daysUntilNextBirthday,
                    formatted: this.formatDate(nextBirthday.year, nextBirthday.month, nextBirthday.day)
                },
                metadata: {
                    birthDate: this.formatDate(birth.year, birth.month, birth.day),
                    referenceDate: this.formatDate(reference.year, reference.month, reference.day),
                    timezone: timezone,
                    feb29Mode: feb29Mode,
                    calendarSystem: 'Gregorian (proleptic)',
                    leapYear: this.isLeapYear(birth.year),
                    referenceLeapYear: this.isLeapYear(reference.year)
                }
            };

            return result;

        } catch (error) {
            return {
                success: false,
                error: error.message,
                input: { birthDate, referenceDate, timezone, feb29Mode, outputUnits }
            };
        }
    }

    // Get current date
    getCurrentDate() {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            original: 'current'
        };
    }

    // Format date for display
    formatDate(year, month, day) {
        if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
            throw new Error('Year, month, and day must be valid numbers');
        }

        const monthName = this.monthNames[month - 1];
        const suffix = this.getDaySuffix(day);

        return `${monthName} ${day}${suffix}, ${year}`;
    }

    // Get day suffix (1st, 2nd, 3rd, 4th, etc.)
    getDaySuffix(day) {
        if (day >= 11 && day <= 13) return 'th';
        
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    // Calculate age in different units
    calculateAgeInUnits(birthDate, referenceDate = null, units = 'years') {
        try {
            const result = this.calculateAge(birthDate, referenceDate);
            
            if (!result.success) {
                return result;
            }

            const ageInUnits = {
                years: result.age.years,
                months: result.age.years * 12 + result.age.months,
                weeks: result.totals.weeks,
                days: result.totals.days,
                hours: result.totals.days * 24,
                minutes: result.totals.days * 24 * 60,
                seconds: result.totals.days * 24 * 60 * 60
            };

            return {
                success: true,
                value: ageInUnits[units] || ageInUnits.years,
                unit: units,
                allUnits: ageInUnits
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Calculate age milestones
    calculateAgeMilestones(birthDate, milestones = [18, 21, 25, 30, 40, 50, 65, 100]) {
        try {
            const birth = this.parseISODate(birthDate);
            const milestonesData = [];

            for (const targetAge of milestones) {
                const targetYear = birth.year + targetAge;
                const targetDate = {
                    year: targetYear,
                    month: birth.month,
                    day: birth.day
                };

                // Handle February 29 in non-leap years
                if (birth.month === 2 && birth.day === 29 && !this.isLeapYear(targetYear)) {
                    targetDate.day = 28;
                }

                const targetOrdinal = this.dateToOrdinal(targetDate.year, targetDate.month, targetDate.day);
                const birthOrdinal = this.dateToOrdinal(birth.year, birth.month, birth.day);
                const daysUntil = targetOrdinal - birthOrdinal;

                milestonesData.push({
                    age: targetAge,
                    date: this.formatDate(targetDate.year, targetDate.month, targetDate.day),
                    daysUntil: daysUntil,
                    year: targetYear,
                    leapYear: this.isLeapYear(targetYear)
                });
            }

            return {
                success: true,
                milestones: milestonesData
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validate date input
    validateDateInput(dateString) {
        try {
            const date = this.parseISODate(dateString);
            const currentDate = this.getCurrentDate();
            
            // Check if date is in the future
            if (this.compareDates(date.year, date.month, date.day, currentDate.year, currentDate.month, currentDate.day) > 0) {
                return {
                    valid: false,
                    error: 'Birth date cannot be in the future'
                };
            }

            // Check reasonable range (e.g., not more than 150 years ago)
            if (currentDate.year - date.year > 150) {
                return {
                    valid: false,
                    error: 'Birth date is too far in the past (more than 150 years)'
                };
            }

            return {
                valid: true,
                date: date
            };

        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    // Get available timezones
    getAvailableTimezones() {
        return Object.values(this.timeZones);
    }

    // Get available February 29 modes
    getAvailableFeb29Modes() {
        return Object.values(this.feb29Modes);
    }

    // Get available output units
    getAvailableOutputUnits() {
        return Object.values(this.outputUnits);
    }

    // Get month names
    getMonthNames() {
        return this.monthNames;
    }

    // Check if a specific date is a leap year
    checkLeapYear(dateString) {
        try {
            const date = this.parseISODate(dateString);
            return {
                success: true,
                year: date.year,
                isLeapYear: this.isLeapYear(date.year),
                daysInFebruary: this.getDaysInMonth(date.year, 2)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Calculate days between two dates
    calculateDaysBetween(date1, date2) {
        try {
            const parsed1 = this.parseISODate(date1);
            const parsed2 = this.parseISODate(date2);

            const ordinal1 = this.dateToOrdinal(parsed1.year, parsed1.month, parsed1.day);
            const ordinal2 = this.dateToOrdinal(parsed2.year, parsed2.month, parsed2.day);

            const daysDiff = Math.abs(ordinal2 - ordinal1);

            return {
                success: true,
                days: daysDiff,
                weeks: Math.round((daysDiff / 7) * 100) / 100,
                months: Math.round((daysDiff / 30.44) * 100) / 100,
                years: Math.round((daysDiff / 365.25) * 100) / 100
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in the main application
window.AgeCalculator = AgeCalculator;
