// Advanced Unit Converter Module for FreeToolHub
// Implements sophisticated unit conversions with exact constants and dimensional validation

class UnitConverter {
    constructor() {
        this.registry = new UnitRegistry();
        this.initializeUnits();
    }

    // Initialize all supported units with exact constants
    initializeUnits() {
        // Set canonical base units for each dimension
        this.registry.setBase("length", "m");
        this.registry.setBase("mass", "kg");
        this.registry.setBase("volume", "m3");
        this.registry.setBase("pressure", "Pa");
        this.registry.setBase("temperature", "K");
        this.registry.setBase("data", "B");
        this.registry.setBase("area", "m2");
        this.registry.setBase("speed", "m/s");
        this.registry.setBase("time", "s");

        // Length units (exact constants)
        this.registry.addLinearUnit("m", "length", 1.0, "SI");
        this.registry.addLinearUnit("cm", "length", 0.01, "SI");
        this.registry.addLinearUnit("mm", "length", 0.001, "SI");
        this.registry.addLinearUnit("km", "length", 1000.0, "SI");
        this.registry.addLinearUnit("inch", "length", 0.0254, "US");
        this.registry.addLinearUnit("ft", "length", 0.3048, "US");
        this.registry.addLinearUnit("yd", "length", 0.9144, "US");
        this.registry.addLinearUnit("mi", "length", 1609.344, "US");
        this.registry.addLinearUnit("nmi", "length", 1852.0, "International");

        // Mass units (exact constants)
        this.registry.addLinearUnit("kg", "mass", 1.0, "SI");
        this.registry.addLinearUnit("g", "mass", 0.001, "SI");
        this.registry.addLinearUnit("mg", "mass", 0.000001, "SI");
        this.registry.addLinearUnit("t", "mass", 1000.0, "SI");
        this.registry.addLinearUnit("lb", "mass", 0.45359237, "US");
        this.registry.addLinearUnit("oz", "mass", 0.028349523125, "US");
        this.registry.addLinearUnit("st", "mass", 6.35029318, "Imperial");
        this.registry.addLinearUnit("ton", "mass", 907.18474, "US");
        this.registry.addLinearUnit("tonne", "mass", 1000.0, "SI");

        // Volume units (exact constants)
        this.registry.addLinearUnit("m3", "volume", 1.0, "SI");
        this.registry.addLinearUnit("L", "volume", 0.001, "SI");
        this.registry.addLinearUnit("mL", "volume", 0.000001, "SI");
        this.registry.addLinearUnit("cm3", "volume", 0.000001, "SI");
        this.registry.addLinearUnit("in3", "volume", 0.000016387064, "US");
        this.registry.addLinearUnit("ft3", "volume", 0.028316846592, "US");
        this.registry.addLinearUnit("galUS", "volume", 0.003785411784, "US");
        this.registry.addLinearUnit("galImp", "volume", 0.00454609, "Imperial");
        this.registry.addLinearUnit("qt", "volume", 0.000946352946, "US");
        this.registry.addLinearUnit("pt", "volume", 0.000473176473, "US");
        this.registry.addLinearUnit("cup", "volume", 0.000236588236, "US");
        this.registry.addLinearUnit("floz", "volume", 0.0000295735295625, "US");

        // Area units
        this.registry.addLinearUnit("m2", "area", 1.0, "SI");
        this.registry.addLinearUnit("cm2", "area", 0.0001, "SI");
        this.registry.addLinearUnit("km2", "area", 1000000.0, "SI");
        this.registry.addLinearUnit("in2", "area", 0.00064516, "US");
        this.registry.addLinearUnit("ft2", "area", 0.09290304, "US");
        this.registry.addLinearUnit("yd2", "area", 0.83612736, "US");
        this.registry.addLinearUnit("ac", "area", 4046.8564224, "US");
        this.registry.addLinearUnit("ha", "area", 10000.0, "SI");

        // Pressure units (exact constants)
        this.registry.addLinearUnit("Pa", "pressure", 1.0, "SI");
        this.registry.addLinearUnit("kPa", "pressure", 1000.0, "SI");
        this.registry.addLinearUnit("MPa", "pressure", 1000000.0, "SI");
        this.registry.addLinearUnit("atm", "pressure", 101325.0, "Physical");
        this.registry.addLinearUnit("bar", "pressure", 100000.0, "SI");
        this.registry.addLinearUnit("mbar", "pressure", 100.0, "SI");
        this.registry.addLinearUnit("psi", "pressure", 6894.757293168, "US");
        this.registry.addLinearUnit("inHg", "pressure", 3386.389, "US");
        this.registry.addLinearUnit("mmHg", "pressure", 133.322387415, "Physical");

        // Temperature units (affine transformations)
        this.registry.addAffineUnit("K", "temperature", 1.0, 0.0, "SI");
        this.registry.addAffineUnit("C", "temperature", 1.0, 273.15, "SI");
        this.registry.addAffineUnit("F", "temperature", 5.0/9.0, 273.15 - (160.0/9.0), "US");
        this.registry.addAffineUnit("R", "temperature", 5.0/9.0, 0.0, "US");

        // Speed units
        this.registry.addLinearUnit("m/s", "speed", 1.0, "SI");
        this.registry.addLinearUnit("km/h", "speed", 0.2777777777777778, "SI");
        this.registry.addLinearUnit("mph", "speed", 0.44704, "US");
        this.registry.addLinearUnit("knot", "speed", 0.5144444444444444, "International");
        this.registry.addLinearUnit("ft/s", "speed", 0.3048, "US");

        // Time units
        this.registry.addLinearUnit("s", "time", 1.0, "SI");
        this.registry.addLinearUnit("ms", "time", 0.001, "SI");
        this.registry.addLinearUnit("min", "time", 60.0, "SI");
        this.registry.addLinearUnit("h", "time", 3600.0, "SI");
        this.registry.addLinearUnit("d", "time", 86400.0, "SI");
        this.registry.addLinearUnit("wk", "time", 604800.0, "SI");
        this.registry.addLinearUnit("mo", "time", 2592000.0, "SI"); // Approximate
        this.registry.addLinearUnit("yr", "time", 31536000.0, "SI"); // Approximate

        // Data size units (IEC binary vs SI decimal)
        this.registry.addLinearUnit("B", "data", 1.0, "SI");
        this.registry.addLinearUnit("kB", "data", 1000.0, "SI");
        this.registry.addLinearUnit("MB", "data", 1000000.0, "SI");
        this.registry.addLinearUnit("GB", "data", 1000000000.0, "SI");
        this.registry.addLinearUnit("TB", "data", 1000000000000.0, "SI");
        this.registry.addLinearUnit("PB", "data", 1000000000000000.0, "SI");
        this.registry.addLinearUnit("KiB", "data", 1024.0, "IEC");
        this.registry.addLinearUnit("MiB", "data", 1048576.0, "IEC");
        this.registry.addLinearUnit("GiB", "data", 1073741824.0, "IEC");
        this.registry.addLinearUnit("TiB", "data", 1099511627776.0, "IEC");
        this.registry.addLinearUnit("PiB", "data", 1125899906842624.0, "IEC");
    }

    // Convert between units with validation
    convert(value, fromUnit, toUnit, precision = 6) {
        try {
            if (typeof value !== 'number' || isNaN(value)) {
                throw new Error('Value must be a valid number');
            }

            const result = this.registry.convert(value, fromUnit, toUnit);
            return {
                success: true,
                value: Number(result.toFixed(precision)),
                fromUnit: fromUnit,
                toUnit: toUnit,
                originalValue: value,
                precision: precision
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                fromUnit: fromUnit,
                toUnit: toUnit,
                value: value
            };
        }
    }

    // Get all available units for a dimension
    getUnitsForDimension(dimension) {
        const units = [];
        for (const [name, unit] of Object.entries(this.registry.units)) {
            if (unit.dimension === dimension) {
                units.push({
                    name: name,
                    displayName: this.getDisplayName(name),
                    system: unit.system,
                    dimension: unit.dimension
                });
            }
        }
        return units.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    // Get all available dimensions
    getAvailableDimensions() {
        return Object.keys(this.registry.dimBase);
    }

    // Get display name for a unit
    getDisplayName(unitName) {
        const displayNames = {
            // Length
            'm': 'Meter (m)',
            'cm': 'Centimeter (cm)',
            'mm': 'Millimeter (mm)',
            'km': 'Kilometer (km)',
            'inch': 'Inch (in)',
            'ft': 'Foot (ft)',
            'yd': 'Yard (yd)',
            'mi': 'Mile (mi)',
            'nmi': 'Nautical Mile (nmi)',
            
            // Mass
            'kg': 'Kilogram (kg)',
            'g': 'Gram (g)',
            'mg': 'Milligram (mg)',
            't': 'Metric Ton (t)',
            'lb': 'Pound (lb)',
            'oz': 'Ounce (oz)',
            'st': 'Stone (st)',
            'ton': 'US Ton (ton)',
            'tonne': 'Metric Tonne (t)',
            
            // Volume
            'm3': 'Cubic Meter (m³)',
            'L': 'Liter (L)',
            'mL': 'Milliliter (mL)',
            'cm3': 'Cubic Centimeter (cm³)',
            'in3': 'Cubic Inch (in³)',
            'ft3': 'Cubic Foot (ft³)',
            'galUS': 'US Gallon (gal)',
            'galImp': 'Imperial Gallon (gal)',
            'qt': 'Quart (qt)',
            'pt': 'Pint (pt)',
            'cup': 'Cup (cup)',
            'floz': 'Fluid Ounce (fl oz)',
            
            // Area
            'm2': 'Square Meter (m²)',
            'cm2': 'Square Centimeter (cm²)',
            'km2': 'Square Kilometer (km²)',
            'in2': 'Square Inch (in²)',
            'ft2': 'Square Foot (ft²)',
            'yd2': 'Square Yard (yd²)',
            'ac': 'Acre (ac)',
            'ha': 'Hectare (ha)',
            
            // Pressure
            'Pa': 'Pascal (Pa)',
            'kPa': 'Kilopascal (kPa)',
            'MPa': 'Megapascal (MPa)',
            'atm': 'Atmosphere (atm)',
            'bar': 'Bar (bar)',
            'mbar': 'Millibar (mbar)',
            'psi': 'PSI (psi)',
            'inHg': 'Inches of Mercury (inHg)',
            'mmHg': 'Millimeters of Mercury (mmHg)',
            
            // Temperature
            'K': 'Kelvin (K)',
            'C': 'Celsius (°C)',
            'F': 'Fahrenheit (°F)',
            'R': 'Rankine (°R)',
            
            // Speed
            'm/s': 'Meters per Second (m/s)',
            'km/h': 'Kilometers per Hour (km/h)',
            'mph': 'Miles per Hour (mph)',
            'knot': 'Knot (knot)',
            'ft/s': 'Feet per Second (ft/s)',
            
            // Time
            's': 'Second (s)',
            'ms': 'Millisecond (ms)',
            'min': 'Minute (min)',
            'h': 'Hour (h)',
            'd': 'Day (d)',
            'wk': 'Week (wk)',
            'mo': 'Month (mo)',
            'yr': 'Year (yr)',
            
            // Data
            'B': 'Byte (B)',
            'kB': 'Kilobyte (kB)',
            'MB': 'Megabyte (MB)',
            'GB': 'Gigabyte (GB)',
            'TB': 'Terabyte (TB)',
            'PB': 'Petabyte (PB)',
            'KiB': 'Kibibyte (KiB)',
            'MiB': 'Mebibyte (MiB)',
            'GiB': 'Gibibyte (GiB)',
            'TiB': 'Tebibyte (TiB)',
            'PiB': 'Pebibyte (PiB)'
        };
        
        return displayNames[unitName] || unitName;
    }

    // Get unit system information
    getUnitSystem(unitName) {
        const unit = this.registry.units[unitName];
        return unit ? unit.system : 'Unknown';
    }

    // Validate unit compatibility
    validateConversion(fromUnit, toUnit) {
        try {
            const from = this.registry.getUnit(fromUnit);
            const to = this.registry.getUnit(toUnit);
            
            if (from.dimension !== to.dimension) {
                return {
                    valid: false,
                    error: `Cannot convert between ${from.dimension} and ${to.dimension}`,
                    fromDimension: from.dimension,
                    toDimension: to.dimension
                };
            }
            
            return {
                valid: true,
                dimension: from.dimension,
                fromSystem: from.system,
                toSystem: to.system
            };
            
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    // Get conversion factors and formulas
    getConversionInfo(fromUnit, toUnit) {
        try {
            const from = this.registry.getUnit(fromUnit);
            const to = this.registry.getUnit(toUnit);
            
            if (from.dimension !== to.dimension) {
                throw new Error('Incompatible dimensions');
            }
            
            // For linear units, calculate the factor
            if (from.linear && to.linear) {
                const factor = to.factor / from.factor;
                return {
                    type: 'linear',
                    factor: factor,
                    formula: `${toUnit} = ${factor} × ${fromUnit}`,
                    description: `Multiply by ${factor}`
                };
            }
            
            // For affine units (like temperature), provide the formula
            if (from.dimension === 'temperature') {
                return {
                    type: 'affine',
                    formula: this.getTemperatureFormula(fromUnit, toUnit),
                    description: 'Temperature conversion with offset'
                };
            }
            
            return {
                type: 'complex',
                formula: `Convert via base unit (${this.registry.dimBase[from.dimension]})`,
                description: 'Multi-step conversion through base unit'
            };
            
        } catch (error) {
            return {
                type: 'error',
                error: error.message
            };
        }
    }

    // Get temperature conversion formula
    getTemperatureFormula(fromUnit, toUnit) {
        const formulas = {
            'C-F': '°F = °C × 9/5 + 32',
            'F-C': '°C = (°F - 32) × 5/9',
            'C-K': 'K = °C + 273.15',
            'K-C': '°C = K - 273.15',
            'F-K': 'K = (°F - 32) × 5/9 + 273.15',
            'K-F': '°F = (K - 273.15) × 9/5 + 32',
            'R-F': '°F = °R - 459.67',
            'F-R': '°R = °F + 459.67'
        };
        
        const key = `${fromUnit}-${toUnit}`;
        return formulas[key] || 'Complex temperature conversion';
    }

    // Get common conversions for a unit
    getCommonConversions(unitName) {
        try {
            const unit = this.registry.getUnit(unitName);
            const dimension = unit.dimension;
            const units = this.getUnitsForDimension(dimension);
            
            const commonConversions = [];
            const testValue = this.getTestValue(unitName);
            
            for (const targetUnit of units) {
                if (targetUnit.name !== unitName) {
                    const result = this.convert(testValue, unitName, targetUnit.name);
                    if (result.success) {
                        commonConversions.push({
                            from: `${testValue} ${unitName}`,
                            to: `${result.value} ${targetUnit.name}`,
                            targetUnit: targetUnit.name,
                            displayName: targetUnit.displayName
                        });
                    }
                }
            }
            
            return commonConversions;
            
        } catch (error) {
            return [];
        }
    }

    // Get appropriate test value for a unit
    getTestValue(unitName) {
        const testValues = {
            // Length
            'm': 1, 'cm': 100, 'mm': 1000, 'km': 1, 'inch': 39.37, 'ft': 3.28, 'yd': 1.09, 'mi': 0.00062, 'nmi': 0.00054,
            
            // Mass
            'kg': 1, 'g': 1000, 'mg': 1000000, 't': 0.001, 'lb': 2.20, 'oz': 35.27, 'st': 0.157, 'ton': 0.0011, 'tonne': 0.001,
            
            // Volume
            'm3': 1, 'L': 1000, 'mL': 1000000, 'cm3': 1000000, 'in3': 61023.7, 'ft3': 35.31, 'galUS': 264.17, 'galImp': 219.97, 'qt': 1056.69, 'pt': 2113.38, 'cup': 4226.75, 'floz': 33814.0,
            
            // Area
            'm2': 1, 'cm2': 10000, 'km2': 0.000001, 'in2': 1550.0, 'ft2': 10.76, 'yd2': 1.20, 'ac': 0.000247, 'ha': 0.0001,
            
            // Pressure
            'Pa': 100000, 'kPa': 100, 'MPa': 0.1, 'atm': 0.987, 'bar': 1, 'mbar': 1000, 'psi': 14.50, 'inHg': 29.53, 'mmHg': 750.06,
            
            // Temperature
            'K': 300, 'C': 27, 'F': 80, 'R': 540,
            
            // Speed
            'm/s': 1, 'km/h': 3.6, 'mph': 2.24, 'knot': 1.94, 'ft/s': 3.28,
            
            // Time
            's': 3600, 'ms': 3600000, 'min': 60, 'h': 1, 'd': 0.0417, 'wk': 0.00595, 'mo': 0.00137, 'yr': 0.000114,
            
            // Data
            'B': 1073741824, 'kB': 1048576, 'MB': 1024, 'GB': 1, 'TB': 0.001, 'PB': 0.000001, 'KiB': 1048576, 'MiB': 1024, 'GiB': 1, 'TiB': 0.001, 'PiB': 0.000001
        };
        
        return testValues[unitName] || 1;
    }

    // Get unit categories for UI organization
    getUnitCategories() {
        return {
            'Length & Distance': ['m', 'cm', 'mm', 'km', 'inch', 'ft', 'yd', 'mi', 'nmi'],
            'Mass & Weight': ['kg', 'g', 'mg', 't', 'lb', 'oz', 'st', 'ton', 'tonne'],
            'Volume & Capacity': ['m3', 'L', 'mL', 'cm3', 'in3', 'ft3', 'galUS', 'galImp', 'qt', 'pt', 'cup', 'floz'],
            'Area': ['m2', 'cm2', 'km2', 'in2', 'ft2', 'yd2', 'ac', 'ha'],
            'Pressure': ['Pa', 'kPa', 'MPa', 'atm', 'bar', 'mbar', 'psi', 'inHg', 'mmHg'],
            'Temperature': ['K', 'C', 'F', 'R'],
            'Speed & Velocity': ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
            'Time': ['s', 'ms', 'min', 'h', 'd', 'wk', 'mo', 'yr'],
            'Data Storage': ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
        };
    }

    // Get system information
    getSystemInfo() {
        return {
            'SI': 'International System of Units (metric)',
            'US': 'United States Customary Units',
            'Imperial': 'British Imperial Units',
            'IEC': 'International Electrotechnical Commission (binary)',
            'Physical': 'Physical constants and standards',
            'International': 'International standards'
        };
    }
}

// Unit Registry Class
class UnitRegistry {
    constructor() {
        this.units = {};
        this.dimBase = {}; // dimension -> canonical unit name
    }

    // Set base unit for a dimension
    setBase(dimension, unitName) {
        this.dimBase[dimension] = unitName;
    }

    // Add linear unit (x_base = factor * x_unit)
    addLinearUnit(name, dimension, factorToBase, system = null) {
        this.units[name] = {
            name: name,
            dimension: dimension,
            factor: factorToBase,
            linear: true,
            toBase: (value) => factorToBase * value,
            fromBase: (value) => value / factorToBase,
            system: system
        };
    }

    // Add affine unit (x_base = a * x_unit + b)
    addAffineUnit(name, dimension, a, b, system = null) {
        this.units[name] = {
            name: name,
            dimension: dimension,
            factor: a,
            offset: b,
            linear: false,
            toBase: (value) => a * value + b,
            fromBase: (value) => (value - b) / a,
            system: system
        };
    }

    // Get unit by name
    getUnit(name) {
        if (!this.units[name]) {
            throw new Error(`Unknown unit: ${name}`);
        }
        return this.units[name];
    }

    // Convert between units
    convert(value, fromUnit, toUnit) {
        const uFrom = this.getUnit(fromUnit);
        const uTo = this.getUnit(toUnit);
        
        if (uFrom.dimension !== uTo.dimension) {
            throw new Error(`Cannot convert between ${uFrom.dimension} and ${uTo.dimension}`);
        }
        
        // Convert to base unit, then to target unit
        const baseValue = uFrom.toBase(value);
        return uTo.fromBase(baseValue);
    }

    // Get all units for a dimension
    getUnitsByDimension(dimension) {
        const result = [];
        for (const [name, unit] of Object.entries(this.units)) {
            if (unit.dimension === dimension) {
                result.push(unit);
            }
        }
        return result;
    }

    // Check if conversion is possible
    canConvert(fromUnit, toUnit) {
        try {
            const from = this.getUnit(fromUnit);
            const to = this.getUnit(toUnit);
            return from.dimension === to.dimension;
        } catch {
            return false;
        }
    }
}

// Export for use in the main application
window.UnitConverter = UnitConverter;
window.UnitRegistry = UnitRegistry;
