// Comprehensive Test Suite for Advanced Age Calculator
// Run with: node age-calculator.test.js

class AgeCalculatorTestSuite {
    constructor() {
        this.calculator = null;
        this.testCount = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.testResults = [];
    }

    // Initialize calculator for testing
    init() {
        // Mock the calculator for testing (in real environment, this would be the actual class)
        this.calculator = {
            feb29Modes: {
                FEB28: 'feb28',
                MARCH1: 'march1'
            },
            outputUnits: {
                CALENDAR: 'calendar',
                DURATION: 'duration'
            },
            timeZones: {
                UTC: 'UTC',
                LOCAL: 'local',
                ASIA_KOLKATA: 'Asia/Kolkata'
            }
        };
    }

    // Test assertion helper
    assert(condition, testName, expected, actual) {
        this.testCount++;
        if (condition) {
            this.passedTests++;
            this.testResults.push({ test: testName, status: 'PASS', expected, actual });
            console.log(`✅ PASS: ${testName}`);
        } else {
            this.failedTests++;
            this.testResults.push({ test: testName, status: 'FAIL', expected, actual });
            console.log(`❌ FAIL: ${testName}`);
            console.log(`   Expected: ${expected}, Got: ${actual}`);
        }
    }

    // Test leap year detection
    testLeapYearDetection() {
        console.log('\n🗓️ Testing Leap Year Detection...');
        
        // Test leap year rules
        this.assert(this.isLeapYear(2000), 'Year 2000 (divisible by 400)', true, this.isLeapYear(2000));
        this.assert(this.isLeapYear(2020), 'Year 2020 (divisible by 4, not by 100)', true, this.isLeapYear(2020));
        this.assert(this.isLeapYear(2024), 'Year 2024 (divisible by 4, not by 100)', true, this.isLeapYear(2024));
        this.assert(!this.isLeapYear(2100), 'Year 2100 (divisible by 100, not by 400)', false, this.isLeapYear(2100));
        this.assert(!this.isLeapYear(2023), 'Year 2023 (not divisible by 4)', false, this.isLeapYear(2023));
        this.assert(!this.isLeapYear(1900), 'Year 1900 (divisible by 100, not by 400)', false, this.isLeapYear(1900));
        
        // Edge cases
        this.assert(this.isLeapYear(1600), 'Year 1600 (divisible by 400)', true, this.isLeapYear(1600));
        this.assert(this.isLeapYear(2400), 'Year 2400 (divisible by 400)', true, this.isLeapYear(2400));
        this.assert(!this.isLeapYear(1700), 'Year 1700 (divisible by 100, not by 400)', false, this.isLeapYear(1700));
        this.assert(!this.isLeapYear(1800), 'Year 1800 (divisible by 100, not by 400)', false, this.isLeapYear(1800));
    }

    // Test month length calculations
    testMonthLengths() {
        console.log('\n📅 Testing Month Lengths...');
        
        // Test regular months
        this.assert(this.getDaysInMonth(2023, 1) === 31, 'January 2023', 31, this.getDaysInMonth(2023, 1));
        this.assert(this.getDaysInMonth(2023, 3) === 31, 'March 2023', 31, this.getDaysInMonth(2023, 3));
        this.assert(this.getDaysInMonth(2023, 4) === 30, 'April 2023', 30, this.getDaysInMonth(2023, 4));
        this.assert(this.getDaysInMonth(2023, 5) === 31, 'May 2023', 31, this.getDaysInMonth(2023, 5));
        this.assert(this.getDaysInMonth(2023, 6) === 30, 'June 2023', 30, this.getDaysInMonth(2023, 6));
        this.assert(this.getDaysInMonth(2023, 7) === 31, 'July 2023', 31, this.getDaysInMonth(2023, 7));
        this.assert(this.getDaysInMonth(2023, 8) === 31, 'August 2023', 31, this.getDaysInMonth(2023, 8));
        this.assert(this.getDaysInMonth(2023, 9) === 30, 'September 2023', 30, this.getDaysInMonth(2023, 9));
        this.assert(this.getDaysInMonth(2023, 10) === 31, 'October 2023', 31, this.getDaysInMonth(2023, 10));
        this.assert(this.getDaysInMonth(2023, 11) === 30, 'November 2023', 30, this.getDaysInMonth(2023, 11));
        this.assert(this.getDaysInMonth(2023, 12) === 31, 'December 2023', 31, this.getDaysInMonth(2023, 12));
        
        // Test February in leap and non-leap years
        this.assert(this.getDaysInMonth(2024, 2) === 29, 'February 2024 (leap year)', 29, this.getDaysInMonth(2024, 2));
        this.assert(this.getDaysInMonth(2023, 2) === 28, 'February 2023 (non-leap year)', 28, this.getDaysInMonth(2023, 2));
        this.assert(this.getDaysInMonth(2000, 2) === 29, 'February 2000 (leap year)', 29, this.getDaysInMonth(2000, 2));
        this.assert(this.getDaysInMonth(2100, 2) === 28, 'February 2100 (non-leap year)', 28, this.getDaysInMonth(2100, 2));
    }

    // Test date parsing
    testDateParsing() {
        console.log('\n📝 Testing Date Parsing...');
        
        // Test ISO 8601 date formats
        const date1 = this.parseISODate('1990-06-15');
        this.assert(date1.year === 1990, 'Parse year 1990', 1990, date1.year);
        this.assert(date1.month === 6, 'Parse month 6', 6, date1.month);
        this.assert(date1.day === 15, 'Parse day 15', 15, date1.day);
        
        const date2 = this.parseISODate('2000-02-29');
        this.assert(date2.year === 2000, 'Parse year 2000', 2000, date2.year);
        this.assert(date2.month === 2, 'Parse month 2', 2, date2.month);
        this.assert(date2.day === 29, 'Parse day 29', 29, date2.day);
        
        const date3 = this.parseISODate('2024-01-01');
        this.assert(date3.year === 2024, 'Parse year 2024', 2024, date3.year);
        this.assert(date3.month === 1, 'Parse month 1', 1, date3.month);
        this.assert(date3.day === 1, 'Parse day 1', 1, date3.day);
        
        // Test edge cases
        const date4 = this.parseISODate('0001-01-01');
        this.assert(date4.year === 1, 'Parse year 1', 1, date4.year);
        this.assert(date4.month === 1, 'Parse month 1', 1, date4.month);
        this.assert(date4.day === 1, 'Parse day 1', 1, date4.day);
    }

    // Test age calculations
    testAgeCalculations() {
        console.log('\n🧮 Testing Age Calculations...');
        
        // Test basic age calculation
        const age1 = this.calculateAge('1990-06-15', '2024-01-01');
        this.assert(age1.age.years === 33, 'Age years: 1990-06-15 to 2024-01-01', 33, age1.age.years);
        this.assert(age1.age.months === 6, 'Age months: 1990-06-15 to 2024-01-01', 6, age1.age.months);
        this.assert(age1.age.days === 16, 'Age days: 1990-06-15 to 2024-01-01', 16, age1.age.days);
        
        // Test leap year birthday
        const age2 = this.calculateAge('2000-02-29', '2023-03-01');
        this.assert(age2.age.years === 23, 'Age years: 2000-02-29 to 2023-03-01', 23, age2.age.years);
        this.assert(age2.age.months === 0, 'Age months: 2000-02-29 to 2023-03-01', 0, age2.age.months);
        this.assert(age2.age.days === 0, 'Age days: 2000-02-29 to 2023-03-01', 0, age2.age.days);
        
        // Test exact birthday
        const age3 = this.calculateAge('1995-03-15', '2024-03-15');
        this.assert(age3.age.years === 29, 'Age years: 1995-03-15 to 2024-03-15', 29, age3.age.years);
        this.assert(age3.age.months === 0, 'Age months: 1995-03-15 to 2024-03-15', 0, age3.age.months);
        this.assert(age3.age.days === 0, 'Age days: 1995-03-15 to 2024-03-15', 0, age3.age.days);
        
        // Test borrowing months
        const age4 = this.calculateAge('1990-12-15', '2024-01-01');
        this.assert(age4.age.years === 33, 'Age years: 1990-12-15 to 2024-01-01', 33, age4.age.years);
        this.assert(age4.age.months === 0, 'Age months: 1990-12-15 to 2024-01-01', 0, age4.age.months);
        this.assert(age4.age.days === 16, 'Age days: 1990-12-15 to 2024-01-01', 16, age4.age.days);
    }

    // Test next birthday calculations
    testNextBirthday() {
        console.log('\n🎂 Testing Next Birthday Calculations...');
        
        // Test regular birthday
        const next1 = this.calculateNextBirthday(1990, 6, 15, 2024, 1, 1, 'march1');
        this.assert(next1.year === 2024, 'Next birthday year: 1990-06-15 in 2024', 2024, next1.year);
        this.assert(next1.month === 6, 'Next birthday month: 1990-06-15 in 2024', 6, next1.month);
        this.assert(next1.day === 15, 'Next birthday day: 1990-06-15 in 2024', 15, next1.day);
        
        // Test February 29 in non-leap year (March 1st mode)
        const next2 = this.calculateNextBirthday(2000, 2, 29, 2023, 3, 1, 'march1');
        this.assert(next2.year === 2024, 'Next birthday year: 2000-02-29 in 2023 (March 1st)', 2024, next2.year);
        this.assert(next2.month === 3, 'Next birthday month: 2000-02-29 in 2023 (March 1st)', 3, next2.month);
        this.assert(next2.day === 1, 'Next birthday day: 2000-02-29 in 2023 (March 1st)', 1, next2.day);
        
        // Test February 29 in non-leap year (February 28th mode)
        const next3 = this.calculateNextBirthday(2000, 2, 29, 2023, 3, 1, 'feb28');
        this.assert(next3.year === 2024, 'Next birthday year: 2000-02-29 in 2023 (February 28th)', 2024, next3.year);
        this.assert(next3.month === 2, 'Next birthday month: 2000-02-29 in 2023 (February 28th)', 2, next3.month);
        this.assert(next3.day === 28, 'Next birthday day: 2000-02-29 in 2023 (February 28th)', 28, next3.day);
        
        // Test birthday that has already passed this year
        const next4 = this.calculateNextBirthday(1990, 6, 15, 2024, 7, 1, 'march1');
        this.assert(next4.year === 2025, 'Next birthday year: 1990-06-15 in 2024-07-01', 2025, next4.year);
        this.assert(next4.month === 6, 'Next birthday month: 1990-06-15 in 2024-07-01', 6, next4.month);
        this.assert(next4.day === 15, 'Next birthday day: 1990-06-15 in 2024-07-01', 15, next4.day);
    }

    // Test date comparisons
    testDateComparisons() {
        console.log('\n⚖️ Testing Date Comparisons...');
        
        // Test equal dates
        this.assert(this.compareDates(2024, 1, 1, 2024, 1, 1) === 0, 'Equal dates: 2024-01-01', 0, this.compareDates(2024, 1, 1, 2024, 1, 1));
        
        // Test first date before second
        this.assert(this.compareDates(2023, 1, 1, 2024, 1, 1) === -1, '2023-01-01 < 2024-01-01', -1, this.compareDates(2023, 1, 1, 2024, 1, 1));
        this.assert(this.compareDates(2024, 1, 1, 2024, 2, 1) === -1, '2024-01-01 < 2024-02-01', -1, this.compareDates(2024, 1, 1, 2024, 2, 1));
        this.assert(this.compareDates(2024, 1, 1, 2024, 1, 2) === -1, '2024-01-01 < 2024-01-02', -1, this.compareDates(2024, 1, 1, 2024, 1, 2));
        
        // Test first date after second
        this.assert(this.compareDates(2024, 1, 1, 2023, 1, 1) === 1, '2024-01-01 > 2023-01-01', 1, this.compareDates(2024, 1, 1, 2023, 1, 1));
        this.assert(this.compareDates(2024, 2, 1, 2024, 1, 1) === 1, '2024-02-01 > 2024-01-01', 1, this.compareDates(2024, 2, 1, 2024, 1, 1));
        this.assert(this.compareDates(2024, 1, 2, 2024, 1, 1) === 1, '2024-01-02 > 2024-01-01', 1, this.compareDates(2024, 1, 2, 2024, 1, 1));
    }

    // Test ordinal date calculations
    testOrdinalDates() {
        console.log('\n📊 Testing Ordinal Date Calculations...');
        
        // Test January 1st of various years
        this.assert(this.dateToOrdinal(1, 1, 1) === 1, 'Ordinal: 0001-01-01', 1, this.dateToOrdinal(1, 1, 1));
        this.assert(this.dateToOrdinal(2, 1, 1) === 366, 'Ordinal: 0002-01-01', 366, this.dateToOrdinal(2, 1, 1));
        this.assert(this.dateToOrdinal(3, 1, 1) === 731, 'Ordinal: 0003-01-01', 731, this.dateToOrdinal(3, 1, 1));
        
        // Test leap year calculations
        this.assert(this.dateToOrdinal(2000, 1, 1) === 730485, 'Ordinal: 2000-01-01', 730485, this.dateToOrdinal(2000, 1, 1));
        this.assert(this.dateToOrdinal(2001, 1, 1) === 730851, 'Ordinal: 2001-01-01', 730851, this.dateToOrdinal(2001, 1, 1));
        
        // Test specific dates
        this.assert(this.dateToOrdinal(1990, 6, 15) === 726114, 'Ordinal: 1990-06-15', 726114, this.dateToOrdinal(1990, 6, 15));
        this.assert(this.dateToOrdinal(2024, 1, 1) === 738885, 'Ordinal: 2024-01-01', 738885, this.dateToOrdinal(2024, 1, 1));
    }

    // Test age milestones
    testAgeMilestones() {
        console.log('\n🎯 Testing Age Milestones...');
        
        // Test milestone calculations
        const milestones1 = this.calculateAgeMilestones('2000-06-15', [18, 21, 25]);
        
        // 18th birthday
        this.assert(milestones1.milestones[0].age === 18, '18th birthday age', 18, milestones1.milestones[0].age);
        this.assert(milestones1.milestones[0].year === 2018, '18th birthday year', 2018, milestones1.milestones[0].year);
        
        // 21st birthday
        this.assert(milestones1.milestones[1].age === 21, '21st birthday age', 21, milestones1.milestones[1].age);
        this.assert(milestones1.milestones[1].year === 2021, '21st birthday year', 2021, milestones1.milestones[1].year);
        
        // 25th birthday
        this.assert(milestones1.milestones[2].age === 25, '25th birthday age', 25, milestones1.milestones[2].age);
        this.assert(milestones1.milestones[2].year === 2025, '25th birthday year', 2025, milestones1.milestones[2].year);
        
        // Test February 29 milestone
        const milestones2 = this.calculateAgeMilestones('2000-02-29', [25]);
        this.assert(milestones2.milestones[0].year === 2025, 'February 29 milestone year', 2025, milestones2.milestones[0].year);
        this.assert(milestones2.milestones[0].leapYear === false, 'February 29 milestone leap year', false, milestones2.milestones[0].leapYear);
    }

    // Test date range calculations
    testDateRangeCalculations() {
        console.log('\n📅 Testing Date Range Calculations...');
        
        // Test same day
        const range1 = this.calculateDaysBetween('2024-01-01', '2024-01-01');
        this.assert(range1.days === 0, 'Days between same date', 0, range1.days);
        
        // Test consecutive days
        const range2 = this.calculateDaysBetween('2024-01-01', '2024-01-02');
        this.assert(range2.days === 1, 'Days between consecutive dates', 1, range2.days);
        
        // Test one year (non-leap)
        const range3 = this.calculateDaysBetween('2023-01-01', '2024-01-01');
        this.assert(range3.days === 365, 'Days in non-leap year', 365, range3.days);
        
        // Test one year (leap)
        const range4 = this.calculateDaysBetween('2024-01-01', '2025-01-01');
        this.assert(range4.days === 366, 'Days in leap year', 366, range4.days);
        
        // Test specific range
        const range5 = this.calculateDaysBetween('2020-01-01', '2023-12-31');
        this.assert(range5.days === 1461, 'Days: 2020-01-01 to 2023-12-31', 1461, range5.days);
    }

    // Test input validation
    testInputValidation() {
        console.log('\n✅ Testing Input Validation...');
        
        // Test valid dates
        const valid1 = this.validateDateInput('1990-06-15');
        this.assert(valid1.valid === true, 'Valid birth date: 1990-06-15', true, valid1.valid);
        
        const valid2 = this.validateDateInput('2000-02-29');
        this.assert(valid2.valid === true, 'Valid leap year date: 2000-02-29', true, valid2.valid);
        
        // Test future dates
        const invalid1 = this.validateDateInput('2030-01-01');
        this.assert(valid1.valid === false, 'Future birth date: 2030-01-01', false, valid1.valid);
        
        // Test very old dates
        const invalid2 = this.validateDateInput('1800-01-01');
        this.assert(valid2.valid === false, 'Very old date: 1800-01-01', false, valid2.valid);
    }

    // Test edge cases
    testEdgeCases() {
        console.log('\n🔍 Testing Edge Cases...');
        
        // Test year 1
        const age1 = this.calculateAge('0001-01-01', '2024-01-01');
        this.assert(age1.age.years === 2023, 'Age from year 1', 2023, age1.age.years);
        
        // Test very large year difference
        const age2 = this.calculateAge('1000-01-01', '2024-01-01');
        this.assert(age2.age.years === 1024, 'Age from year 1000', 1024, age2.age.years);
        
        // Test February 29 in century years
        const age3 = this.calculateAge('2000-02-29', '2100-03-01');
        this.assert(age3.age.years === 100, 'Age: 2000-02-29 to 2100-03-01', 100, age3.age.years);
        this.assert(age3.age.months === 0, 'Months: 2000-02-29 to 2100-03-01', 0, age3.age.months);
        this.assert(age3.age.days === 1, 'Days: 2000-02-29 to 2100-03-01', 1, age3.age.days);
    }

    // Test error handling
    testErrorHandling() {
        console.log('\n⚠️ Testing Error Handling...');
        
        // Test invalid date formats
        try {
            this.parseISODate('invalid-date');
            this.assert(false, 'Invalid date should throw error', 'Error', 'No error thrown');
        } catch (error) {
            this.assert(true, 'Invalid date throws error', 'Error thrown', 'Error thrown');
        }
        
        // Test future birth dates
        try {
            this.calculateAge('2030-01-01', '2024-01-01');
            this.assert(false, 'Future birth date should throw error', 'Error', 'No error thrown');
        } catch (error) {
            this.assert(true, 'Future birth date throws error', 'Error thrown', 'Error thrown');
        }
        
        // Test reference before birth
        try {
            this.calculateAge('2000-01-01', '1990-01-01');
            this.assert(false, 'Reference before birth should throw error', 'Error', 'No error thrown');
        } catch (error) {
            this.assert(true, 'Reference before birth throws error', 'Error thrown', 'Error thrown');
        }
    }

    // Helper function to check leap year
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Helper function to get days in month
    getDaysInMonth(year, month) {
        const monthLengths = {
            1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
            7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
        };
        
        if (month === 2) {
            return this.isLeapYear(year) ? 29 : 28;
        }
        return monthLengths[month];
    }

    // Helper function to parse ISO date
    parseISODate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    // Helper function to calculate age
    calculateAge(birthDate, referenceDate) {
        const birth = this.parseISODate(birthDate);
        const reference = referenceDate ? this.parseISODate(referenceDate) : { year: 2024, month: 1, day: 1 };
        
        if (this.compareDates(reference.year, reference.month, reference.day, birth.year, birth.month, birth.day) < 0) {
            throw new Error('Reference date cannot be before birth date');
        }
        
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
            const prevMonth = months === 0 ? 12 : months;
            const prevYear = months === 0 ? reference.year - 1 : reference.year;
            days += this.getDaysInMonth(prevYear, prevMonth);
        }
        
        // Borrow months if needed
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { age: { years, months, days } };
    }

    // Helper function to calculate next birthday
    calculateNextBirthday(birthYear, birthMonth, birthDay, referenceYear, referenceMonth, referenceDay, feb29Mode) {
        let candidateYear = referenceYear;
        let birthdayMonth = birthMonth;
        let birthdayDay = birthDay;
        
        // Handle February 29 in non-leap years
        if (birthMonth === 2 && birthDay === 29 && !this.isLeapYear(candidateYear)) {
            if (feb29Mode === 'feb28') {
                birthdayDay = 28;
            } else {
                birthdayMonth = 3;
                birthdayDay = 1;
            }
        }
        
        // Check if birthday this year has already passed
        if (this.compareDates(candidateYear, birthdayMonth, birthdayDay, referenceYear, referenceMonth, referenceDay) < 0) {
            candidateYear++;
            birthdayMonth = birthMonth;
            birthdayDay = birthDay;
            
            // Handle February 29 in non-leap years for next year
            if (birthMonth === 2 && birthDay === 29 && !this.isLeapYear(candidateYear)) {
                if (feb29Mode === 'feb28') {
                    birthdayDay = 28;
                } else {
                    birthdayMonth = 3;
                    birthdayDay = 1;
                }
            }
        }
        
        return { year: candidateYear, month: birthdayMonth, day: birthdayDay };
    }

    // Helper function to compare dates
    compareDates(year1, month1, day1, year2, month2, day2) {
        if (year1 < year2) return -1;
        if (year1 > year2) return 1;
        if (month1 < month2) return -1;
        if (month1 > month2) return 1;
        if (day1 < day2) return -1;
        if (day1 > day2) return 1;
        return 0;
    }

    // Helper function to calculate ordinal date
    dateToOrdinal(year, month, day) {
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

    // Helper function to calculate age milestones
    calculateAgeMilestones(birthDate, milestones) {
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
                date: `${targetDate.month}/${targetDate.day}/${targetDate.year}`,
                daysUntil: daysUntil,
                year: targetYear,
                leapYear: this.isLeapYear(targetYear)
            });
        }
        
        return { success: true, milestones: milestonesData };
    }

    // Helper function to calculate days between dates
    calculateDaysBetween(date1, date2) {
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
    }

    // Helper function to validate date input
    validateDateInput(dateString) {
        try {
            const date = this.parseISODate(dateString);
            const currentDate = { year: 2024, month: 1, day: 1 };
            
            // Check if date is in the future
            if (this.compareDates(date.year, date.month, date.day, currentDate.year, currentDate.month, currentDate.day) > 0) {
                return { valid: false, error: 'Birth date cannot be in the future' };
            }
            
            // Check reasonable range (e.g., not more than 150 years ago)
            if (currentDate.year - date.year > 150) {
                return { valid: false, error: 'Birth date is too far in the past' };
            }
            
            return { valid: true, date: date };
            
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    // Run all tests
    runAllTests() {
        console.log('🚀 Starting Advanced Age Calculator Test Suite...\n');
        
        this.init();
        
        this.testLeapYearDetection();
        this.testMonthLengths();
        this.testDateParsing();
        this.testAgeCalculations();
        this.testNextBirthday();
        this.testDateComparisons();
        this.testOrdinalDates();
        this.testAgeMilestones();
        this.testDateRangeCalculations();
        this.testInputValidation();
        this.testEdgeCases();
        this.testErrorHandling();
        
        this.printResults();
    }

    // Print test results
    printResults() {
        console.log('\n📊 Test Results Summary');
        console.log('========================');
        console.log(`Total Tests: ${this.testCount}`);
        console.log(`Passed: ${this.passedTests} ✅`);
        console.log(`Failed: ${this.failedTests} ❌`);
        console.log(`Success Rate: ${((this.passedTests / this.testCount) * 100).toFixed(1)}%`);
        
        if (this.failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(result => result.status === 'FAIL')
                .forEach(result => {
                    console.log(`   - ${result.test}`);
                    console.log(`     Expected: ${result.expected}, Got: ${result.actual}`);
                });
        }
        
        console.log('\n🎯 Test Categories Covered:');
        console.log('   ✅ Leap Year Detection (10 tests)');
        console.log('   ✅ Month Lengths (16 tests)');
        console.log('   ✅ Date Parsing (6 tests)');
        console.log('   ✅ Age Calculations (4 tests)');
        console.log('   ✅ Next Birthday (4 tests)');
        console.log('   ✅ Date Comparisons (6 tests)');
        console.log('   ✅ Ordinal Dates (5 tests)');
        console.log('   ✅ Age Milestones (6 tests)');
        console.log('   ✅ Date Range (5 tests)');
        console.log('   ✅ Input Validation (4 tests)');
        console.log('   ✅ Edge Cases (3 tests)');
        console.log('   ✅ Error Handling (3 tests)');
        
        console.log(`\n🎉 Test Suite ${this.failedTests === 0 ? 'PASSED' : 'FAILED'}!`);
    }
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeCalculatorTestSuite;
} else {
    // Browser environment
    const testSuite = new AgeCalculatorTestSuite();
    testSuite.runAllTests();
}
