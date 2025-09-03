# 📊 Advanced Percentage Calculator Tool - FreeToolHub

A comprehensive, modern percentage calculator tool featuring six calculation modes with advanced features like input type normalization, rounding options, and comprehensive error handling.

## ✨ Features

### 🔢 **Six Calculation Modes**
1. **Percent Of**: Calculate what is X% of a number
2. **What Percent**: Calculate what percent A is of B
3. **Apply Change**: Apply percentage increase/decrease to a number
4. **Percent Change**: Calculate percent change from old to new value
5. **Reverse Percent**: Find original value given new value and percent change
6. **Percent Difference**: Calculate percent difference between two values

### 🎯 **Advanced Features**
- **Input Type Support**: Accept percentages as either percent (15) or decimal (0.15)
- **Rounding Options**: Multiple rounding modes (round, floor, ceiling, none)
- **Decimal Precision**: Configurable decimal places (2, 4, 6, 8, or no rounding)
- **Error Handling**: Comprehensive validation with user-friendly error messages
- **Real-time Results**: Instant calculation with clear formula display

## 🧮 **Supported Operations**

### 1. **Percent Of (X% of N)**
**Formula**: `X = (p/100) × N`

**Inputs**:
- `p`: Percentage value (can be percent or decimal)
- `N`: Base number
- Input type: percent (e.g., 15) or decimal (e.g., 0.15)

**Example**: 15% of 200 = 30

### 2. **What Percent (A is what % of B)**
**Formula**: `p% = (A/B) × 100`

**Inputs**:
- `A`: First value
- `B`: Second value (must be non-zero)

**Example**: 25 is 12.5% of 200

### 3. **Apply Increase/Decrease**
**Formula**: `New = N × (1 ± p/100)`

**Inputs**:
- `N`: Original number
- `p`: Percentage change
- Change type: increase or decrease
- Input type: percent or decimal

**Examples**:
- 100 increased by 20% = 120
- 100 decreased by 15% = 85

### 4. **Percent Change**
**Formula**: `%Δ = ((New - Old) / |Old|) × 100`

**Inputs**:
- `Old`: Original value (must be non-zero)
- `New`: New value

**Example**: Change from 80 to 100 = +25%

### 5. **Reverse Percentage**
**Formula**: `Original = New / (1 ± p/100)`

**Inputs**:
- `New`: Current value
- `p`: Percentage change
- Change type: increase or decrease
- Input type: percent or decimal

**Example**: Sale price $85 after 15% off = Original $100

### 6. **Percent Difference**
**Formula**: `%diff = (|a - b| / ((a + b)/2)) × 100`

**Inputs**:
- `a`: First value
- `b`: Second value

**Example**: Difference between 20 and 30 = 40%

## 🎨 **User Interface Features**

### **Tabbed Interface**
- **Smooth transitions** between calculation modes
- **Active state indicators** for current mode
- **Responsive design** for all screen sizes
- **Color-coded tabs** for easy navigation

### **Input Validation**
- **Real-time error checking**
- **Clear error messages**
- **Input sanitization**
- **Placeholder examples**

### **Global Settings**
- **Decimal Places**: 2, 4, 6, 8, or no rounding
- **Rounding Mode**: Round, Floor, Ceiling, or None
- **Consistent across all calculations**

### **Results Display**
- **Clear result formatting**
- **Formula explanation**
- **Error highlighting**
- **Success/error states**

## 🔧 **Technical Implementation**

### **Architecture**
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Algorithm**: Mathematical formula implementation
- **Validation**: Comprehensive input validation
- **Error Handling**: User-friendly error messages

### **Core Functions**

#### **Input Normalization**
```javascript
normalizePercent(p, inputType = 'percent') {
    if (inputType === 'percent') {
        return p / 100.0;
    } else if (inputType === 'decimal') {
        if (p < 0 || p > 1) {
            throw new Error('Decimal percentage must be between 0 and 1');
        }
        return p;
    }
}
```

#### **Rounding System**
```javascript
applyRounding(value, decimals, roundingMode) {
    if (decimals === null) return value;
    
    const multiplier = Math.pow(10, decimals);
    
    switch (roundingMode) {
        case 'round': return Math.round(value * multiplier) / multiplier;
        case 'floor': return Math.floor(value * multiplier) / multiplier;
        case 'ceil': return Math.ceil(value * multiplier) / multiplier;
        default: return value;
    }
}
```

### **Performance Characteristics**
- **Time Complexity**: O(1) for all operations
- **Space Complexity**: O(1) for calculations
- **Memory Usage**: Minimal, constant space

## 🚀 **Usage Examples**

### **Basic Calculations**
```
Percent Of: 15% of 200 = 30
What Percent: 25 is 12.5% of 200
Apply Increase: 100 + 20% = 120
Apply Decrease: 100 - 15% = 85
```

### **Advanced Calculations**
```
Percent Change: 80 to 100 = +25%
Reverse Percent: 85 after 15% off = 100
Percent Difference: 20 vs 30 = 40%
```

### **Input Type Examples**
```
Percent Input: 15 (means 15%)
Decimal Input: 0.15 (means 15%)
Both produce same result: 15% of 200 = 30
```

## 🎯 **Getting Started**

### **1. Open the Calculator**
- Navigate to FreeToolHub
- Click on the 📊 **Advanced Percentage Calculator** tool

### **2. Choose Your Mode**
- **Percent Of**: Calculate X% of a number
- **What Percent**: Find what percent A is of B
- **Apply Change**: Increase/decrease by percentage
- **Percent Change**: Calculate change from old to new
- **Reverse**: Find original before percentage change
- **Difference**: Calculate difference between values

### **3. Configure Settings**
- **Decimal Places**: Choose precision (2, 4, 6, 8, or none)
- **Rounding Mode**: Select rounding behavior
- **Input Type**: Choose percent or decimal format

### **4. Enter Values and Calculate**
- Fill in the required fields
- Click "Calculate" button
- View results with formula explanation

## 🔍 **Error Handling**

### **Common Error Types**
| Error | Description | Example |
|-------|-------------|---------|
| Division by Zero | Cannot divide by zero | What percent when B = 0 |
| Invalid Input | Non-numeric values | Text in number fields |
| Decimal Range | Decimal must be 0-1 | 0.15 is valid, 1.5 is not |
| Missing Values | Required fields empty | Leaving fields blank |

### **Error Messages**
- **User-friendly** descriptions
- **Specific** error locations
- **Helpful** suggestions for correction
- **Visual highlighting** of errors

## 🧪 **Testing and Validation**

### **Test Coverage**
- **All six calculation modes** thoroughly tested
- **Input validation** for edge cases
- **Error handling** for invalid inputs
- **Rounding accuracy** verification
- **Cross-browser compatibility** testing

### **Validation Examples**
```
Valid Inputs:
- Percent: 15, -25, 0, 1000
- Decimal: 0.15, 0.01, 0.99, 1.0
- Numbers: Any valid number

Invalid Inputs:
- Percent: "abc", null, undefined
- Decimal: 1.5, -0.1, 2.0
- Numbers: NaN, Infinity, "text"
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **History Tracking**: Save calculation history
- **Export Results**: Download calculations as CSV/PDF
- **Custom Formulas**: User-defined percentage formulas
- **Batch Processing**: Multiple calculations at once
- **Unit Conversion**: Built-in unit conversions

### **API Extensions**
- **WebSocket Support**: Real-time collaboration
- **Plugin System**: Custom calculation types
- **Mobile App**: Native mobile application
- **API Endpoints**: RESTful API for integrations

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

This percentage calculator tool is part of FreeToolHub and is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **Mathematical Formulas**: Standard percentage calculations
- **UI Framework**: Tailwind CSS
- **Icon Library**: Emoji and Heroicons
- **Testing Framework**: Built-in validation

---

## 🎉 **What Makes It Special**

### **Professional Grade**
- **Industry-standard** mathematical formulas
- **Comprehensive** error handling
- **Professional** user interface

### **User Experience**
- **Intuitive** tabbed interface
- **Real-time** validation
- **Clear** result display
- **Helpful** examples

### **Technical Excellence**
- **Modular** architecture
- **Efficient** algorithms
- **Cross-browser** compatibility
- **Accessible** design

---

**Made with ❤️ for the FreeToolHub community**

*For support and questions, please refer to the main FreeToolHub documentation.*
