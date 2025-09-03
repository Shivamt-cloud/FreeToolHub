# ⚖️ Advanced BMI Calculator Tool - FreeToolHub

A comprehensive, modern BMI calculator tool featuring CDC classification standards, dual population support (adults and children/teens), multiple unit systems, and professional-grade calculations.

## ✨ Features

### 🔢 **Dual Population Support**
1. **Adult Mode (20+ years)**: Standard CDC BMI classification
2. **Child/Teen Mode (2-19 years)**: Age and sex-specific percentile classification

### 🌍 **Multiple Unit Systems**
- **Metric**: Kilograms (kg) and meters/centimeters (m/cm)
- **US Customary**: Pounds (lb) and feet/inches (ft/in)
- **Auto-detection**: Automatically converts between units for consistency

### 📊 **CDC Classification Standards**
- **Adult Categories**: Underweight, Healthy Weight, Overweight, Obesity Classes 1-3
- **Child/Teen Categories**: Based on BMI-for-age percentiles (CDC standards)
- **Color-coded Results**: Visual indicators for each BMI category

### 🎯 **Advanced Features**
- **Input Validation**: Comprehensive range checking and error handling
- **Smart Height Detection**: Auto-detects cm vs m input
- **Precise Conversions**: Uses exact conversion factors (0.0254, 0.45359237)
- **Professional Recommendations**: Context-aware health advice

## 🧮 **Supported Calculations**

### 1. **Adult BMI (20+ years)**
**Formula**: `BMI = weight(kg) / height(m)²`

**CDC Classification**:
| Category | BMI Range | Color | Description |
|----------|-----------|-------|-------------|
| Underweight | < 18.5 | 🔵 Blue | Below healthy weight range |
| Healthy Weight | 18.5 - 24.9 | 🟢 Green | Optimal weight range |
| Overweight | 25.0 - 29.9 | 🟡 Yellow | Above healthy weight range |
| Obesity Class 1 | 30.0 - 34.9 | 🟠 Orange | Moderate obesity |
| Obesity Class 2 | 35.0 - 39.9 | 🔴 Red | Severe obesity |
| Obesity Class 3 | ≥ 40.0 | 🟣 Purple | Very severe obesity |

### 2. **Child/Teen BMI (2-19 years)**
**Formula**: `BMI = weight(kg) / height(m)²`

**Percentile Classification**:
| Category | Percentile Range | Color | Description |
|----------|------------------|-------|-------------|
| Underweight | < 5th | 🔵 Blue | Below 5th percentile |
| Healthy Weight | 5th - 84th | 🟢 Green | 5th to 84th percentile |
| Overweight | 85th - 94th | 🟡 Yellow | 85th to 94th percentile |
| Obesity | ≥ 95th | 🔴 Red | 95th percentile or above |

### 3. **Unit Conversions**
**Height Conversions**:
- `1 inch = 0.0254 meters` (exact)
- `1 foot = 12 inches`
- Auto-detection: cm → m (if height > 3.5)

**Weight Conversions**:
- `1 pound = 0.45359237 kg` (exact)
- `1 kg = 2.20462262 pounds`

## 🎨 **User Interface Features**

### **Tabbed Interface**
- **Smooth transitions** between Adult and Child/Teen modes
- **Active state indicators** for current mode
- **Responsive design** for all screen sizes

### **Unit System Toggle**
- **Radio button selection** between Metric and US Customary
- **Dynamic input fields** that adapt to selected units
- **Smart placeholders** with appropriate examples

### **Input Validation**
- **Real-time error checking**
- **Range validation** for age, weight, and height
- **Clear error messages** with helpful suggestions

### **Results Display**
- **Large BMI value** with clear formatting
- **Color-coded categories** matching CDC standards
- **Detailed information** including population, age group, sex
- **Professional recommendations** based on BMI category

## 🔧 **Technical Implementation**

### **Architecture**
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Algorithm**: CDC-standard BMI calculations
- **Validation**: Comprehensive input validation
- **Error Handling**: User-friendly error messages

### **Core Functions**

#### **BMI Calculation**
```javascript
calculateBMI(options) {
    const { weight, height, units, population, heightDetail, ageYears, sex } = options;
    
    // Convert to metric and calculate BMI
    const metricValues = this.toMetric(weight, height, units, heightDetail);
    const bmi = this.bmiFromMetric(metricValues.kg, metricValues.m);
    
    // Classify based on population
    if (population === 'adult') {
        return this.classifyAdultBMI(bmi);
    } else {
        return this.classifyChildBMIPercentile(bmi, ageYears, sex);
    }
}
```

#### **Unit Conversion**
```javascript
toMetric(weight, height, units, heightDetail = null) {
    if (units === 'metric') {
        let kg = weight;
        let m = height;
        
        // Auto-detect if height is in cm
        if (m > 3.5) {
            m = m / 100.0;
        }
        
        return { kg, m };
    } else if (units === 'us') {
        const lb = weight;
        const totalInches = heightDetail ? 
            heightDetail.feet * 12.0 + heightDetail.inches : height;
        
        const kg = lb * 0.45359237;
        const m = totalInches * 0.0254;
        
        return { kg, m };
    }
}
```

### **Performance Characteristics**
- **Time Complexity**: O(1) for all operations
- **Space Complexity**: O(1) for calculations
- **Memory Usage**: Minimal, constant space

## 🚀 **Usage Examples**

### **Adult Calculations**
```
Metric: 70 kg, 1.75 m → BMI 22.9 (Healthy Weight)
US: 154 lb, 5'8" → BMI 23.4 (Healthy Weight)
```

### **Child/Teen Calculations**
```
10 y male: 35 kg, 1.40 m → BMI 17.9 (Healthy Weight)
16 y female: 55 kg, 1.65 m → BMI 20.2 (Healthy Weight)
```

### **Unit Conversions**
```
Height: 170 cm → 1.70 m (auto-detected)
Weight: 154 lb → 69.9 kg (precise conversion)
```

## 🎯 **Getting Started**

### **1. Open the Calculator**
- Navigate to FreeToolHub
- Click on the ⚖️ **Advanced BMI Calculator** tool

### **2. Choose Your Mode**
- **Adult (20+ years)**: Standard BMI calculation
- **Child/Teen (2-19 years)**: Age and sex-specific classification

### **3. Select Unit System**
- **Metric**: kg and m/cm
- **US Customary**: lb and ft/in

### **4. Enter Values and Calculate**
- Fill in the required fields
- Click "Calculate BMI" button
- View results with CDC classification

## 🔍 **Error Handling**

### **Common Error Types**
| Error | Description | Example |
|-------|-------------|---------|
| Invalid Input | Non-numeric values | Text in number fields |
| Range Errors | Values outside valid ranges | Age < 2 or > 19 |
| Missing Values | Required fields empty | Leaving fields blank |
| Unit Mismatch | Incompatible unit combinations | Mixing metric and US |

### **Error Messages**
- **User-friendly** descriptions
- **Specific** error locations
- **Helpful** suggestions for correction
- **Visual highlighting** of errors

## 🧪 **Testing and Validation**

### **Test Coverage**
- **All calculation modes** thoroughly tested
- **Unit conversions** verified for accuracy
- **Input validation** for edge cases
- **Error handling** for invalid inputs
- **CDC classification** accuracy verification

### **Validation Examples**
```
Valid Inputs:
- Adult: 70 kg, 1.75 m
- Child: 10 y male, 35 kg, 1.40 m
- US: 154 lb, 5'8"

Invalid Inputs:
- Negative values
- Age outside 2-19 range
- Non-numeric inputs
- Missing required fields
```

## 🔮 **Future Enhancements**

### **Planned Features**
- **CDC LMS Data Integration**: Full percentile calculation tables
- **BMI History Tracking**: Save calculation history
- **Export Results**: Download calculations as PDF
- **Mobile App**: Native mobile application
- **API Endpoints**: RESTful API for integrations

### **Advanced Calculations**
- **Body Fat Estimation**: Additional body composition metrics
- **Ideal Weight Ranges**: Target weight calculations
- **Health Risk Assessment**: Comprehensive health evaluation
- **Trend Analysis**: BMI changes over time

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

This BMI calculator tool is part of FreeToolHub and is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **CDC Standards**: BMI classification guidelines
- **WHO Guidelines**: International BMI standards
- **UI Framework**: Tailwind CSS
- **Icon Library**: Emoji and Heroicons

---

## 🎉 **What Makes It Special**

### **Professional Grade**
- **CDC-compliant** BMI classifications
- **Medical accuracy** with precise conversions
- **Professional** user interface

### **User Experience**
- **Intuitive** tabbed interface
- **Real-time** validation
- **Clear** result display
- **Helpful** recommendations

### **Technical Excellence**
- **Modular** architecture
- **Efficient** algorithms
- **Cross-browser** compatibility
- **Accessible** design

---

**Made with ❤️ for the FreeToolHub community**

*For support and questions, please refer to the main FreeToolHub documentation.*
