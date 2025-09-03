# ⏰ Advanced Age Calculator Tool - FreeToolHub

A sophisticated, professional-grade age calculator tool featuring leap year logic, ISO 8601 parsing, advanced date algorithms, and comprehensive age computation capabilities.

## ✨ Features

### 🔢 **Multiple Calculation Modes**
1. **Basic Age**: Simple birth date to reference date calculation
2. **Advanced Age**: Date-time with timezone support
3. **Age Milestones**: Calculate specific age milestones (18, 21, 25, 30, etc.)
4. **Date Range**: Calculate time between any two dates

### 🌍 **ISO 8601 Support**
- **Date Formats**: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS
- **Timezone Handling**: Local, UTC, and major timezone support
- **Flexible Input**: Accepts various date string formats

### 🗓️ **Gregorian Calendar Logic**
- **Leap Year Rules**: Implements exact Gregorian leap year algorithm
- **Month Lengths**: Accurate day counts for all months
- **February 29 Handling**: Configurable for non-leap years

### 🧮 **Advanced Algorithms**
- **Borrowing Algorithm**: Years-Months-Days with real month lengths
- **Ordinal Calculations**: Days since year 1 for precise computations
- **Next Birthday**: Smart calculation with leap year handling

## 🧮 **Supported Calculations**

### 1. **Basic Age Calculation**
**Formula**: Age = Reference Date - Birth Date

**Features**:
- **Years-Months-Days**: Traditional age format
- **Total Days**: Exact number of days lived
- **Total Weeks**: Weeks since birth
- **Total Months**: Approximate months since birth

**Example**:
```
Birth: 1990-06-15
Reference: 2024-01-01
Result: 33 years, 6 months, 16 days
Total: 12,247 days
```

### 2. **Advanced Age with Time**
**Formula**: Age = Reference DateTime - Birth DateTime

**Features**:
- **Time Components**: Hours, minutes, seconds
- **Timezone Support**: Convert between timezones
- **Precise Duration**: Exact time differences

### 3. **Age Milestones**
**Formula**: Milestone Date = Birth Date + Target Age

**Supported Milestones**:
- 18 years (Legal adulthood)
- 21 years (Legal drinking age)
- 25 years (Quarter century)
- 30 years (Thirtysomething)
- 40 years (Forties)
- 50 years (Half century)
- 65 years (Retirement age)
- 100 years (Century mark)

### 4. **Date Range Calculation**
**Formula**: Range = End Date - Start Date

**Outputs**:
- Days between dates
- Weeks between dates
- Months between dates
- Years between dates

## 🗓️ **Leap Year Logic**

### **Gregorian Calendar Rules**
A year is a leap year if:
1. **Divisible by 4** AND
2. **NOT divisible by 100** OR
3. **Divisible by 400**

**Examples**:
- 2000: ✅ Leap year (divisible by 400)
- 2020: ✅ Leap year (divisible by 4, not by 100)
- 2100: ❌ Not leap year (divisible by 100, not by 400)
- 2024: ✅ Leap year (divisible by 4, not by 100)

### **February 29 Handling**
For people born on February 29 in non-leap years:

**Options**:
- **March 1st (Default)**: Observe birthday on March 1st
- **February 28th**: Observe birthday on February 28th

**Example**:
```
Birth: 2000-02-29 (Leap year)
2023: Not a leap year
March 1st mode: Birthday on 2023-03-01
February 28th mode: Birthday on 2023-02-28
```

## 🔧 **Technical Implementation**

### **Architecture**
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Algorithm**: Advanced borrowing algorithm with leap year logic
- **Date Parsing**: ISO 8601 compliant parser
- **Validation**: Comprehensive input validation

### **Core Functions**

#### **Age Calculation**
```javascript
calculateAge(birthDate, referenceDate, timezone, feb29Mode, outputUnits) {
    // Parse dates
    const birth = this.parseISODate(birthDate);
    const reference = referenceDate ? this.parseISODate(referenceDate) : this.getCurrentDate();
    
    // Calculate using borrowing algorithm
    let years = reference.year - birth.year;
    let months = reference.month - birth.month;
    let days = reference.day - birth.day;
    
    // Borrow days if needed
    if (days < 0) {
        months--;
        days += this.getDaysInMonth(reference.year, reference.month - 1);
    }
    
    // Borrow months if needed
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return { years, months, days };
}
```

#### **Leap Year Detection**
```javascript
isLeapYear(year) {
    // Gregorian leap year rule
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
```

#### **Month Length Calculation**
```javascript
getDaysInMonth(year, month) {
    if (month === 2) {
        return this.isLeapYear(year) ? 29 : 28;
    }
    return this.monthLengths[month];
}
```

### **Performance Characteristics**
- **Time Complexity**: O(1) for all operations
- **Space Complexity**: O(1) for calculations
- **Memory Usage**: Minimal, constant space

## 🎨 **User Interface Features**

### **Tabbed Interface**
- **Smooth transitions** between calculation modes
- **Active state indicators** with orange theme
- **Responsive design** for all screen sizes

### **Input Validation**
- **Real-time error checking**
- **Date range validation**
- **Clear error messages** with helpful suggestions

### **Results Display**
- **Large age value** with clear formatting
- **Detailed breakdown** of years, months, days
- **Additional metrics** (total days, weeks, months)
- **Next birthday** calculation and countdown

### **Advanced Options**
- **February 29 handling** configuration
- **Output units** selection
- **Timezone** selection for advanced mode

## 🚀 **Usage Examples**

### **Basic Age Calculation**
```
Birth Date: 1990-06-15
Reference Date: 2024-01-01
February 29 Mode: March 1st
Output: 33 years, 6 months, 16 days
```

### **Leap Year Example**
```
Birth Date: 2000-02-29
Reference Date: 2023-03-01
February 29 Mode: March 1st
Output: 23 years, 0 months, 0 days
Next Birthday: March 1st, 2024
```

### **Age Milestones**
```
Birth Date: 2000-06-15
Milestones: 18, 21, 25, 30
Results:
- 18 years: June 15, 2018
- 21 years: June 15, 2021
- 25 years: June 15, 2025
- 30 years: June 15, 2030
```

### **Date Range**
```
Start Date: 2020-01-01
End Date: 2023-12-31
Result: 1,460 days (3 years, 11 months, 30 days)
```

## 🎯 **Getting Started**

### **1. Open the Calculator**
- Navigate to FreeToolHub
- Click on the ⏰ **Advanced Age Calculator** tool

### **2. Choose Your Mode**
- **Basic Age**: Standard age calculation
- **Advanced**: Date-time with timezone support
- **Milestones**: Calculate specific age milestones
- **Date Range**: Time between two dates

### **3. Enter Dates and Calculate**
- Fill in the required date fields
- Configure advanced options if needed
- Click "Calculate" button
- View comprehensive results

## 🔍 **Error Handling**

### **Common Error Types**
| Error | Description | Example |
|-------|-------------|---------|
| Invalid Date | Non-ISO 8601 format | Text in date fields |
| Future Birth | Birth date in future | 2030-01-01 |
| Date Range | Reference before birth | Birth: 2000, Ref: 1990 |
| Missing Input | Required fields empty | Leaving birth date blank |

### **Error Messages**
- **User-friendly** descriptions
- **Specific** error locations
- **Helpful** suggestions for correction
- **Visual highlighting** of errors

## 🧪 **Testing and Validation**

### **Test Coverage**
- **All calculation modes** thoroughly tested
- **Leap year logic** verified for accuracy
- **Date parsing** for various formats
- **Edge cases** and boundary conditions
- **Error handling** for invalid inputs

### **Validation Examples**
```
Valid Inputs:
- Birth: 1990-06-15
- Reference: 2024-01-01
- Date Range: 2020-01-01 to 2023-12-31

Invalid Inputs:
- Future birth dates
- Invalid date formats
- Reference before birth
- Missing required fields
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **Full Timezone Support**: Complete IANA timezone database
- **Calendar Integration**: Export to calendar applications
- **Age History Tracking**: Save calculation history
- **API Endpoints**: RESTful API for integrations

### **Advanced Calculations**
- **Life Expectancy**: Statistical age projections
- **Age Comparisons**: Compare multiple people's ages
- **Seasonal Analysis**: Age in different seasons
- **Astronomical Age**: Age based on celestial events

## 📱 **Browser Compatibility**

### **Supported Browsers**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### **Required Features**
- ES6+ JavaScript support
- Modern CSS features
- HTML5 input types
- CSS Grid and Flexbox

## 🤝 **Contributing**

### **Development Setup**
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open `http://localhost:3000`

### **Code Standards**
- **ESLint** configuration included
- **Prettier** formatting
- **JSDoc** documentation
- **Unit test** coverage

## 📄 **License**

This age calculator tool is part of FreeToolHub and is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **Gregorian Calendar**: Standard calendar system
- **ISO 8601**: International date format standard
- **Leap Year Logic**: Astronomical calendar rules
- **UI Framework**: Tailwind CSS

---

## 🎉 **What Makes It Special**

### **Professional Grade**
- **Leap year compliant** calculations
- **ISO 8601 standard** parsing
- **Mathematical accuracy** with borrowing algorithm
- **Professional** user interface

### **User Experience**
- **Intuitive** tabbed interface
- **Real-time** validation
- **Clear** result display
- **Comprehensive** information

### **Technical Excellence**
- **Modular** architecture
- **Efficient** algorithms
- **Cross-browser** compatibility
- **Accessible** design

---

**Made with ❤️ for the FreeToolHub community**

*For support and questions, please refer to the main FreeToolHub documentation.*
