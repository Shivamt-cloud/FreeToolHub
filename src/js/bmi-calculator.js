// Advanced BMI Calculator Module for FreeToolHub
// Implements comprehensive BMI calculations with CDC classification standards

class BMICalculator {
    constructor() {
        this.unitSystems = {
            METRIC: 'metric',
            US: 'us'
        };

        this.populations = {
            ADULT: 'adult',
            CHILD_TEEN: 'child_teen'
        };

        this.sexOptions = {
            MALE: 'male',
            FEMALE: 'female'
        };

        // Conversion constants
        this.conversionFactors = {
            INCHES_TO_METERS: 0.0254,
            POUNDS_TO_KG: 0.45359237,
            US_BMI_FACTOR: 703.0
        };

        // Adult BMI classification (CDC standards)
        this.adultCategories = [
            { min: 0, max: 18.4, category: 'Underweight', color: 'blue', description: 'Below healthy weight range' },
            { min: 18.5, max: 24.9, category: 'Healthy Weight', color: 'green', description: 'Optimal weight range' },
            { min: 25.0, max: 29.9, category: 'Overweight', color: 'yellow', description: 'Above healthy weight range' },
            { min: 30.0, max: 34.9, category: 'Obesity Class 1', color: 'orange', description: 'Moderate obesity' },
            { min: 35.0, max: 39.9, category: 'Obesity Class 2', color: 'red', description: 'Severe obesity' },
            { min: 40.0, max: 999, category: 'Obesity Class 3 (Severe)', color: 'purple', description: 'Very severe obesity' }
        ];

        // Child/Teen BMI classification (CDC standards)
        this.childCategories = [
            { min: 0, max: 4.9, category: 'Underweight', color: 'blue', description: 'Below 5th percentile' },
            { min: 5.0, max: 84.9, category: 'Healthy Weight', color: 'green', description: '5th to 84th percentile' },
            { min: 85.0, max: 94.9, category: 'Overweight', color: 'yellow', description: '85th to 94th percentile' },
            { min: 95.0, max: 100, category: 'Obesity', color: 'red', description: '95th percentile or above' }
        ];

        // Simplified CDC LMS data for common ages (in practice, you'd use the full CDC dataset)
        this.sampleLMSData = {
            // Example data structure - in production, use complete CDC LMS tables
            // (sex, age_months): { L: lambda, M: median, S: sigma }
            // This is a simplified version for demonstration
        };
    }

    // Convert to metric units
    toMetric(weight, height, units, heightDetail = null) {
        if (typeof weight !== 'number' || typeof height !== 'number' || isNaN(weight) || isNaN(height)) {
            throw new Error('Weight and height must be valid numbers');
        }

        if (weight <= 0 || height <= 0) {
            throw new Error('Weight and height must be positive values');
        }

        if (units === this.unitSystems.METRIC) {
            let kg = weight;
            let m = height;

            // Auto-detect if height is in cm and convert to m
            if (m > 3.5) {
                m = m / 100.0;
            }

            return { kg, m };
        } else if (units === this.unitSystems.US) {
            let lb = weight;
            let totalInches;

            if (heightDetail && heightDetail.feet !== undefined && heightDetail.inches !== undefined) {
                totalInches = heightDetail.feet * 12.0 + heightDetail.inches;
            } else {
                totalInches = height;
            }

            const kg = lb * this.conversionFactors.POUNDS_TO_KG;
            const m = totalInches * this.conversionFactors.INCHES_TO_METERS;

            return { kg, m };
        } else {
            throw new Error('Unsupported unit system');
        }
    }

    // Calculate BMI from metric units
    bmiFromMetric(kg, m) {
        if (kg <= 0 || m <= 0) {
            throw new Error('Weight and height must be positive values');
        }
        return kg / (m * m);
    }

    // Calculate BMI from US units
    bmiFromUS(lb, inches) {
        if (lb <= 0 || inches <= 0) {
            throw new Error('Weight and height must be positive values');
        }
        return (lb / (inches * inches)) * this.conversionFactors.US_BMI_FACTOR;
    }

    // Classify adult BMI according to CDC standards
    classifyAdultBMI(bmi) {
        if (typeof bmi !== 'number' || isNaN(bmi)) {
            throw new Error('BMI must be a valid number');
        }

        for (const category of this.adultCategories) {
            if (bmi >= category.min && bmi <= category.max) {
                return {
                    category: category.category,
                    color: category.color,
                    description: category.description,
                    bmiRange: `${category.min}${category.max === 999 ? '+' : ` - ${category.max}`}`
                };
            }
        }

        return {
            category: 'Unknown',
            color: 'gray',
            description: 'BMI value outside classification range',
            bmiRange: 'N/A'
        };
    }

    // Classify child/teen BMI by percentile
    classifyChildBMIPercentile(percentile) {
        if (typeof percentile !== 'number' || isNaN(percentile)) {
            throw new Error('Percentile must be a valid number');
        }

        if (percentile < 0 || percentile > 100) {
            throw new Error('Percentile must be between 0 and 100');
        }

        for (const category of this.childCategories) {
            if (percentile >= category.min && percentile <= category.max) {
                return {
                    category: category.category,
                    color: category.color,
                    description: category.description,
                    percentileRange: `${category.min}${category.min === 0 ? '' : 'th'} - ${category.max === 100 ? '100th' : category.max + 'th'} percentile`
                };
            }
        }

        return {
            category: 'Unknown',
            color: 'gray',
            description: 'Percentile outside classification range',
            percentileRange: 'N/A'
        };
    }

    // Calculate BMI percentile for children/teens (simplified version)
    // In production, this would use the full CDC LMS tables
    calculateChildPercentile(bmi, ageYears, sex) {
        if (typeof bmi !== 'number' || isNaN(bmi)) {
            throw new Error('BMI must be a valid number');
        }

        if (typeof ageYears !== 'number' || ageYears < 2 || ageYears > 19) {
            throw new Error('Age must be between 2 and 19 years');
        }

        if (!Object.values(this.sexOptions).includes(sex)) {
            throw new Error('Sex must be "male" or "female"');
        }

        // This is a simplified percentile calculation
        // In practice, you would use the CDC LMS method with actual data tables
        // For now, we'll use a basic approximation based on typical BMI ranges
        
        let percentile;
        if (sex === this.sexOptions.MALE) {
            // Simplified male BMI percentiles by age
            if (ageYears <= 5) {
                percentile = this.estimatePercentile(bmi, 14, 16, 18, 20);
            } else if (ageYears <= 10) {
                percentile = this.estimatePercentile(bmi, 15, 17, 19, 22);
            } else if (ageYears <= 15) {
                percentile = this.estimatePercentile(bmi, 16, 18, 21, 25);
            } else {
                percentile = this.estimatePercentile(bmi, 17, 19, 22, 27);
            }
        } else {
            // Simplified female BMI percentiles by age
            if (ageYears <= 5) {
                percentile = this.estimatePercentile(bmi, 14, 16, 18, 20);
            } else if (ageYears <= 10) {
                percentile = this.estimatePercentile(bmi, 15, 17, 19, 22);
            } else if (ageYears <= 15) {
                percentile = this.estimatePercentile(bmi, 16, 18, 21, 25);
            } else {
                percentile = this.estimatePercentile(bmi, 17, 19, 22, 27);
            }
        }

        return percentile;
    }

    // Simplified percentile estimation (in production, use CDC LMS method)
    estimatePercentile(bmi, p5, p50, p85, p95) {
        if (bmi < p5) {
            return Math.max(1, (bmi / p5) * 5);
        } else if (bmi < p50) {
            return 5 + ((bmi - p5) / (p50 - p5)) * 45;
        } else if (bmi < p85) {
            return 50 + ((bmi - p50) / (p85 - p50)) * 35;
        } else if (bmi < p95) {
            return 85 + ((bmi - p85) / (p95 - p85)) * 10;
        } else {
            return Math.min(99, 95 + ((bmi - p95) / (p95 * 0.2)) * 4);
        }
    }

    // Main BMI calculation function
    calculateBMI(options) {
        const {
            weight,
            height,
            units = this.unitSystems.METRIC,
            population = this.populations.ADULT,
            heightDetail = null,
            ageYears = null,
            sex = null
        } = options;

        try {
            let bmi;
            let metricValues;

            // Calculate BMI
            if (units === this.unitSystems.US && heightDetail && heightDetail.feet !== undefined) {
                // US units with feet + inches
                const totalInches = heightDetail.feet * 12.0 + (heightDetail.inches || 0);
                bmi = this.bmiFromUS(weight, totalInches);
                metricValues = this.toMetric(weight, totalInches, units, heightDetail);
            } else {
                // Convert to metric and calculate
                metricValues = this.toMetric(weight, height, units, heightDetail);
                bmi = this.bmiFromMetric(metricValues.kg, metricValues.m);
            }

            // Round BMI to 1 decimal place
            bmi = Math.round(bmi * 10) / 10;

            // Classify based on population
            let classification;
            let additionalInfo = {};

            if (population === this.populations.ADULT) {
                classification = this.classifyAdultBMI(bmi);
                additionalInfo = {
                    population: 'Adult',
                    ageGroup: '20+ years',
                    recommendation: this.getAdultRecommendation(classification.category)
                };
            } else {
                // Child/Teen classification
                if (!ageYears || !sex) {
                    throw new Error('Age and sex are required for child/teen BMI classification');
                }

                const percentile = this.calculateChildPercentile(bmi, ageYears, sex);
                classification = this.classifyChildBMIPercentile(percentile);
                additionalInfo = {
                    population: 'Child/Teen',
                    ageGroup: `${ageYears} years`,
                    sex: sex.charAt(0).toUpperCase() + sex.slice(1),
                    percentile: Math.round(percentile * 10) / 10,
                    recommendation: this.getChildRecommendation(classification.category)
                };
            }

            return {
                success: true,
                bmi: bmi,
                classification: classification,
                metricValues: metricValues,
                additionalInfo: additionalInfo,
                input: options
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                input: options
            };
        }
    }

    // Get recommendations based on BMI category
    getAdultRecommendation(category) {
        const recommendations = {
            'Underweight': 'Consider consulting a healthcare provider about healthy weight gain strategies.',
            'Healthy Weight': 'Maintain your current healthy lifestyle with balanced diet and regular exercise.',
            'Overweight': 'Focus on healthy eating and increased physical activity to reach a healthy weight.',
            'Obesity Class 1': 'Consider working with healthcare providers on a comprehensive weight management plan.',
            'Obesity Class 2': 'Medical supervision recommended for weight management and health monitoring.',
            'Obesity Class 3 (Severe)': 'Immediate medical consultation recommended for comprehensive health assessment.'
        };

        return recommendations[category] || 'Consult with a healthcare provider for personalized advice.';
    }

    // Get recommendations for children/teens
    getChildRecommendation(category) {
        const recommendations = {
            'Underweight': 'Consult with a pediatrician about healthy growth and nutrition.',
            'Healthy Weight': 'Continue healthy eating habits and regular physical activity.',
            'Overweight': 'Work with healthcare providers on healthy lifestyle changes for the whole family.',
            'Obesity': 'Comprehensive evaluation and family-based intervention recommended.'
        };

        return recommendations[category] || 'Consult with a pediatrician for personalized guidance.';
    }

    // Get available unit systems
    getAvailableUnitSystems() {
        return Object.values(this.unitSystems);
    }

    // Get available populations
    getAvailablePopulations() {
        return Object.values(this.populations);
    }

    // Get available sex options
    getAvailableSexOptions() {
        return Object.values(this.sexOptions);
    }

    // Get adult BMI categories
    getAdultCategories() {
        return this.adultCategories;
    }

    // Get child BMI categories
    getChildCategories() {
        return this.childCategories;
    }

    // Format weight for display
    formatWeight(weight, units) {
        if (units === this.unitSystems.METRIC) {
            return `${weight} kg`;
        } else {
            return `${weight} lb`;
        }
    }

    // Format height for display
    formatHeight(height, units, heightDetail = null) {
        if (units === this.unitSystems.METRIC) {
            if (height > 3.5) {
                return `${height} cm`;
            } else {
                return `${height} m`;
            }
        } else {
            if (heightDetail && heightDetail.feet !== undefined) {
                return `${heightDetail.feet}' ${heightDetail.inches || 0}"`;
            } else {
                return `${height} inches`;
            }
        }
    }

    // Format BMI result
    formatBMI(bmi) {
        return `BMI: ${bmi}`;
    }

    // Validate input ranges
    validateInputRanges(weight, height, units, population, ageYears = null) {
        const errors = [];

        if (units === this.unitSystems.METRIC) {
            if (weight < 20 || weight > 300) {
                errors.push('Weight should be between 20 and 300 kg');
            }
            if (height < 0.5 || height > 3.0) {
                errors.push('Height should be between 0.5 and 3.0 meters (or 50-300 cm)');
            }
        } else {
            if (weight < 44 || weight > 661) {
                errors.push('Weight should be between 44 and 661 pounds');
            }
            if (height < 20 || height > 120) {
                errors.push('Height should be between 20 and 120 inches');
            }
        }

        if (population === this.populations.CHILD_TEEN) {
            if (ageYears < 2 || ageYears > 19) {
                errors.push('Age should be between 2 and 19 years for child/teen classification');
            }
        }

        return errors;
    }
}

// Export for use in the main application
window.BMICalculator = BMICalculator;
