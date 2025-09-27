/**
 * Age Calculator
 * Advanced age calculation, date analysis, and time-related calculations for students
 */
class AgeCalculator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        
        // Age calculation methods
        this.calculationMethods = {
            'precise': { name: 'Precise Age', description: 'Exact age including leap years' },
            'simple': { name: 'Simple Age', description: 'Basic year difference calculation' },
            'academic': { name: 'Academic Age', description: 'Age based on academic year' }
        };
        
        // Date formats supported
        this.dateFormats = {
            'yyyy-mm-dd': { name: 'YYYY-MM-DD', pattern: /^\d{4}-\d{2}-\d{2}$/ },
            'mm/dd/yyyy': { name: 'MM/DD/YYYY', pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
            'dd/mm/yyyy': { name: 'DD/MM/YYYY', pattern: /^\d{2}\/\d{2}\/\d{4}$/ },
            'dd-mm-yyyy': { name: 'DD-MM-YYYY', pattern: /^\d{2}-\d{2}-\d{4}$/ },
            'mm-dd-yyyy': { name: 'MM-DD-YYYY', pattern: /^\d{2}-\d{2}-\d{4}$/ },
            'month-day-year': { name: 'Month Day, Year', pattern: /^[A-Za-z]+ \d{1,2}, \d{4}$/ },
            'day-month-year': { name: 'Day Month Year', pattern: /^\d{1,2} [A-Za-z]+ \d{4}$/ }
        };
        
        // Life stages
        this.lifeStages = {
            'infant': { min: 0, max: 1, name: 'Infant' },
            'toddler': { min: 1, max: 3, name: 'Toddler' },
            'preschooler': { min: 3, max: 5, name: 'Preschooler' },
            'child': { min: 5, max: 12, name: 'Child' },
            'teenager': { min: 13, max: 19, name: 'Teenager' },
            'young_adult': { min: 20, max: 39, name: 'Young Adult' },
            'middle_aged': { min: 40, max: 59, name: 'Middle Aged' },
            'senior': { min: 60, max: 79, name: 'Senior' },
            'elderly': { min: 80, max: 999, name: 'Elderly' }
        };
        
        // Zodiac signs
        this.zodiacSigns = [
            { name: 'Capricorn', start: [12, 22], end: [1, 19] },
            { name: 'Aquarius', start: [1, 20], end: [2, 18] },
            { name: 'Pisces', start: [2, 19], end: [3, 20] },
            { name: 'Aries', start: [3, 21], end: [4, 19] },
            { name: 'Taurus', start: [4, 20], end: [5, 20] },
            { name: 'Gemini', start: [5, 21], end: [6, 20] },
            { name: 'Cancer', start: [6, 21], end: [7, 22] },
            { name: 'Leo', start: [7, 23], end: [8, 22] },
            { name: 'Virgo', start: [8, 23], end: [9, 22] },
            { name: 'Libra', start: [9, 23], end: [10, 22] },
            { name: 'Scorpio', start: [10, 23], end: [11, 21] },
            { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
        ];
        
        // Chinese zodiac
        this.chineseZodiac = [
            'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
            'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
        ];
    }

    /**
     * Calculate age from birth date
     */
    calculateAge(birthDate, currentDate = null, method = 'precise') {
        try {
            const birth = this.parseDate(birthDate);
            const current = currentDate ? this.parseDate(currentDate) : new Date();
            
            if (isNaN(birth.getTime()) || isNaN(current.getTime())) {
                throw new Error('Invalid date format');
            }
            
            if (birth > current) {
                throw new Error('Birth date cannot be in the future');
            }
            
            let age;
            switch (method) {
                case 'precise':
                    age = this.calculatePreciseAge(birth, current);
                    break;
                case 'simple':
                    age = this.calculateSimpleAge(birth, current);
                    break;
                case 'academic':
                    age = this.calculateAcademicAge(birth, current);
                    break;
                default:
                    age = this.calculatePreciseAge(birth, current);
            }
            
            const result = {
                success: true,
                age: age,
                birthDate: birth.toISOString().split('T')[0],
                currentDate: current.toISOString().split('T')[0],
                method: method,
                details: this.getAgeDetails(age, birth, current),
                lifeStage: this.getLifeStage(age.years),
                zodiacSign: this.getZodiacSign(birth),
                chineseZodiac: this.getChineseZodiac(birth.getFullYear()),
                milestones: this.getAgeMilestones(age.years),
                nextBirthday: this.getNextBirthday(birth, current)
            };
            
            this.addToHistory('calculate_age', { birthDate, currentDate, method }, result);
            return result;
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate precise age including leap years
     */
    calculatePreciseAge(birth, current) {
        let years = current.getFullYear() - birth.getFullYear();
        let months = current.getMonth() - birth.getMonth();
        let days = current.getDate() - birth.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        const totalDays = Math.floor((current - birth) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;
        
        return {
            years: years,
            months: months,
            days: days,
            totalDays: totalDays,
            totalWeeks: totalWeeks,
            totalMonths: totalMonths,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            totalSeconds: totalSeconds
        };
    }

    /**
     * Calculate simple age (year difference only)
     */
    calculateSimpleAge(birth, current) {
        const years = current.getFullYear() - birth.getFullYear();
        const totalDays = Math.floor((current - birth) / (1000 * 60 * 60 * 24));
        
        return {
            years: years,
            months: 0,
            days: 0,
            totalDays: totalDays,
            totalWeeks: Math.floor(totalDays / 7),
            totalMonths: years * 12,
            totalHours: totalDays * 24,
            totalMinutes: totalDays * 24 * 60,
            totalSeconds: totalDays * 24 * 60 * 60
        };
    }

    /**
     * Calculate academic age
     */
    calculateAcademicAge(birth, current) {
        const academicYear = this.getAcademicYear(current);
        const birthAcademicYear = this.getAcademicYear(birth);
        const academicAge = academicYear - birthAcademicYear;
        
        const totalDays = Math.floor((current - birth) / (1000 * 60 * 60 * 24));
        
        return {
            years: academicAge,
            months: 0,
            days: 0,
            totalDays: totalDays,
            totalWeeks: Math.floor(totalDays / 7),
            totalMonths: academicAge * 12,
            totalHours: totalDays * 24,
            totalMinutes: totalDays * 24 * 60,
            totalSeconds: totalDays * 24 * 60 * 60
        };
    }

    /**
     * Get academic year
     */
    getAcademicYear(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return month >= 9 ? year : year - 1;
    }

    /**
     * Parse date from various formats
     */
    parseDate(dateString) {
        if (!dateString) {
            throw new Error('Date string is required');
        }
        
        const trimmed = dateString.trim();
        
        // Try different date formats
        for (const [format, config] of Object.entries(this.dateFormats)) {
            if (config.pattern.test(trimmed)) {
                return this.parseDateByFormat(trimmed, format);
            }
        }
        
        // Try parsing as general date
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
            return date;
        }
        
        throw new Error('Unable to parse date format');
    }

    /**
     * Parse date by specific format
     */
    parseDateByFormat(dateString, format) {
        switch (format) {
            case 'yyyy-mm-dd':
                return new Date(dateString);
            case 'mm/dd/yyyy':
            case 'dd/mm/yyyy':
                const parts = dateString.split('/');
                if (format === 'mm/dd/yyyy') {
                    return new Date(parts[2], parts[0] - 1, parts[1]);
                } else {
                    return new Date(parts[2], parts[1] - 1, parts[0]);
                }
            case 'dd-mm-yyyy':
            case 'mm-dd-yyyy':
                const parts2 = dateString.split('-');
                if (format === 'mm-dd-yyyy') {
                    return new Date(parts2[2], parts2[0] - 1, parts2[1]);
                } else {
                    return new Date(parts2[2], parts2[1] - 1, parts2[0]);
                }
            case 'month-day-year':
                return new Date(dateString);
            case 'day-month-year':
                const parts3 = dateString.split(' ');
                const monthIndex = this.getMonthIndex(parts3[1]);
                return new Date(parts3[2], monthIndex, parts3[0]);
            default:
                return new Date(dateString);
        }
    }

    /**
     * Get month index from month name
     */
    getMonthIndex(monthName) {
        const months = {
            'january': 0, 'jan': 0,
            'february': 1, 'feb': 1,
            'march': 2, 'mar': 2,
            'april': 3, 'apr': 3,
            'may': 4,
            'june': 5, 'jun': 5,
            'july': 6, 'jul': 6,
            'august': 7, 'aug': 7,
            'september': 8, 'sep': 8, 'sept': 8,
            'october': 9, 'oct': 9,
            'november': 10, 'nov': 10,
            'december': 11, 'dec': 11
        };
        
        return months[monthName.toLowerCase()] || 0;
    }

    /**
     * Get age details
     */
    getAgeDetails(age, birth, current) {
        const isLeapYear = this.isLeapYear(birth.getFullYear());
        const daysInYear = isLeapYear ? 366 : 365;
        const ageInDays = age.totalDays;
        const ageInYears = ageInDays / daysInYear;
        
        return {
            isLeapYear: isLeapYear,
            daysInBirthYear: daysInYear,
            ageInYears: Math.round(ageInYears * 100) / 100,
            percentageOfYear: Math.round((ageInDays % daysInYear) / daysInYear * 100),
            dayOfWeek: this.getDayOfWeek(birth),
            dayOfYear: this.getDayOfYear(birth),
            weekOfYear: this.getWeekOfYear(birth),
            season: this.getSeason(birth)
        };
    }

    /**
     * Check if year is leap year
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Get day of week
     */
    getDayOfWeek(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    /**
     * Get day of year
     */
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Get week of year
     */
    getWeekOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - start) / (1000 * 60 * 60 * 24));
        return Math.ceil((days + start.getDay() + 1) / 7);
    }

    /**
     * Get season
     */
    getSeason(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) {
            return 'Spring';
        } else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
            return 'Summer';
        } else if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) {
            return 'Autumn';
        } else {
            return 'Winter';
        }
    }

    /**
     * Get life stage
     */
    getLifeStage(age) {
        for (const [key, stage] of Object.entries(this.lifeStages)) {
            if (age >= stage.min && age <= stage.max) {
                return {
                    stage: key,
                    name: stage.name,
                    age: age
                };
            }
        }
        return { stage: 'unknown', name: 'Unknown', age: age };
    }

    /**
     * Get zodiac sign
     */
    getZodiacSign(birthDate) {
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        
        for (const sign of this.zodiacSigns) {
            const [startMonth, startDay] = sign.start;
            const [endMonth, endDay] = sign.end;
            
            if (startMonth === endMonth) {
                // Same month
                if (month === startMonth && day >= startDay && day <= endDay) {
                    return sign.name;
                }
            } else {
                // Different months
                if ((month === startMonth && day >= startDay) || 
                    (month === endMonth && day <= endDay)) {
                    return sign.name;
                }
            }
        }
        
        return 'Unknown';
    }

    /**
     * Get Chinese zodiac
     */
    getChineseZodiac(year) {
        const index = (year - 4) % 12;
        return this.chineseZodiac[index >= 0 ? index : index + 12];
    }

    /**
     * Get age milestones
     */
    getAgeMilestones(age) {
        const milestones = [];
        
        if (age >= 0) milestones.push({ age: 0, milestone: 'Birth' });
        if (age >= 1) milestones.push({ age: 1, milestone: 'First Birthday' });
        if (age >= 5) milestones.push({ age: 5, milestone: 'Start School' });
        if (age >= 10) milestones.push({ age: 10, milestone: 'Double Digits' });
        if (age >= 13) milestones.push({ age: 13, milestone: 'Teenager' });
        if (age >= 16) milestones.push({ age: 16, milestone: 'Sweet Sixteen' });
        if (age >= 18) milestones.push({ age: 18, milestone: 'Legal Adult' });
        if (age >= 21) milestones.push({ age: 21, milestone: 'Legal Drinking Age' });
        if (age >= 25) milestones.push({ age: 25, milestone: 'Quarter Century' });
        if (age >= 30) milestones.push({ age: 30, milestone: 'Thirty' });
        if (age >= 40) milestones.push({ age: 40, milestone: 'Forty' });
        if (age >= 50) milestones.push({ age: 50, milestone: 'Half Century' });
        if (age >= 60) milestones.push({ age: 60, milestone: 'Senior Citizen' });
        if (age >= 70) milestones.push({ age: 70, milestone: 'Seventy' });
        if (age >= 80) milestones.push({ age: 80, milestone: 'Eighty' });
        if (age >= 90) milestones.push({ age: 90, milestone: 'Ninety' });
        if (age >= 100) milestones.push({ age: 100, milestone: 'Centenarian' });
        
        return milestones;
    }

    /**
     * Get next birthday
     */
    getNextBirthday(birthDate, currentDate) {
        const currentYear = currentDate.getFullYear();
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();
        
        let nextBirthday = new Date(currentYear, birthMonth, birthDay);
        
        if (nextBirthday <= currentDate) {
            nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
        }
        
        const daysUntil = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));
        const ageAtNextBirthday = currentYear - birthDate.getFullYear() + (nextBirthday.getFullYear() - currentYear);
        
        return {
            date: nextBirthday.toISOString().split('T')[0],
            daysUntil: daysUntil,
            ageAtBirthday: ageAtNextBirthday,
            dayOfWeek: this.getDayOfWeek(nextBirthday)
        };
    }

    /**
     * Calculate age difference between two people
     */
    calculateAgeDifference(birthDate1, birthDate2, currentDate = null) {
        try {
            const current = currentDate ? this.parseDate(currentDate) : new Date();
            const age1 = this.calculateAge(birthDate1, current);
            const age2 = this.calculateAge(birthDate2, current);
            
            if (!age1.success || !age2.success) {
                throw new Error('Invalid birth dates');
            }
            
            const difference = {
                years: Math.abs(age1.age.years - age2.age.years),
                months: Math.abs(age1.age.months - age2.age.months),
                days: Math.abs(age1.age.days - age2.age.days),
                totalDays: Math.abs(age1.age.totalDays - age2.age.totalDays)
            };
            
            const older = age1.age.totalDays > age2.age.totalDays ? 1 : 2;
            
            return {
                success: true,
                person1: { age: age1.age, details: age1.details },
                person2: { age: age2.age, details: age2.details },
                difference: difference,
                older: older,
                olderBy: older === 1 ? 
                    this.formatAgeDifference(age1.age.totalDays - age2.age.totalDays) :
                    this.formatAgeDifference(age2.age.totalDays - age1.age.totalDays)
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Format age difference
     */
    formatAgeDifference(days) {
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;
        
        let result = '';
        if (years > 0) result += `${years} year${years > 1 ? 's' : ''} `;
        if (months > 0) result += `${months} month${months > 1 ? 's' : ''} `;
        if (remainingDays > 0) result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
        
        return result.trim();
    }

    /**
     * Get age statistics
     */
    getAgeStatistics(ages) {
        if (!ages || ages.length === 0) {
            return { success: false, error: 'No ages provided' };
        }
        
        const sortedAges = ages.sort((a, b) => a - b);
        const sum = ages.reduce((a, b) => a + b, 0);
        const mean = sum / ages.length;
        const median = sortedAges.length % 2 === 0 ? 
            (sortedAges[sortedAges.length / 2 - 1] + sortedAges[sortedAges.length / 2]) / 2 :
            sortedAges[Math.floor(sortedAges.length / 2)];
        
        const variance = ages.reduce((acc, age) => acc + Math.pow(age - mean, 2), 0) / ages.length;
        const standardDeviation = Math.sqrt(variance);
        
        return {
            success: true,
            count: ages.length,
            min: Math.min(...ages),
            max: Math.max(...ages),
            mean: Math.round(mean * 100) / 100,
            median: Math.round(median * 100) / 100,
            standardDeviation: Math.round(standardDeviation * 100) / 100,
            variance: Math.round(variance * 100) / 100
        };
    }

    /**
     * Get supported date formats
     */
    getSupportedDateFormats() {
        return this.dateFormats;
    }

    /**
     * Get supported calculation methods
     */
    getSupportedCalculationMethods() {
        return this.calculationMethods;
    }

    /**
     * Get life stages
     */
    getLifeStages() {
        return this.lifeStages;
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
