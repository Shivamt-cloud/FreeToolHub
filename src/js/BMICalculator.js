/**
 * BMI Calculator
 * Comprehensive BMI calculation, health analysis, and recommendations for students
 */
class BMICalculator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        
        // BMI Categories
        this.bmiCategories = {
            underweight: { min: 0, max: 18.5, label: 'Underweight', color: 'blue', risk: 'Low' },
            normal: { min: 18.5, max: 25, label: 'Normal Weight', color: 'green', risk: 'Low' },
            overweight: { min: 25, max: 30, label: 'Overweight', color: 'yellow', risk: 'Moderate' },
            obese1: { min: 30, max: 35, label: 'Obese Class I', color: 'orange', risk: 'High' },
            obese2: { min: 35, max: 40, label: 'Obese Class II', color: 'red', risk: 'Very High' },
            obese3: { min: 40, max: Infinity, label: 'Obese Class III', color: 'red', risk: 'Extremely High' }
        };
        
        // Health recommendations
        this.recommendations = {
            underweight: {
                diet: ['Increase calorie intake with healthy foods', 'Focus on nutrient-dense foods', 'Eat more frequently throughout the day'],
                exercise: ['Strength training to build muscle', 'Resistance exercises', 'Light cardio for overall health'],
                lifestyle: ['Get adequate sleep (7-9 hours)', 'Manage stress levels', 'Consider consulting a nutritionist']
            },
            normal: {
                diet: ['Maintain balanced diet', 'Eat variety of fruits and vegetables', 'Stay hydrated'],
                exercise: ['Regular physical activity (150 min/week)', 'Mix of cardio and strength training', 'Stay active throughout the day'],
                lifestyle: ['Maintain current healthy habits', 'Regular health checkups', 'Stay consistent with routine']
            },
            overweight: {
                diet: ['Reduce calorie intake moderately', 'Focus on whole foods', 'Limit processed foods and sugars'],
                exercise: ['Increase physical activity', 'Mix of cardio and strength training', 'Aim for 200+ minutes of exercise per week'],
                lifestyle: ['Set realistic weight loss goals', 'Track progress', 'Consider professional guidance']
            },
            obese1: {
                diet: ['Significant calorie reduction', 'Focus on nutrient-dense, low-calorie foods', 'Consider meal planning'],
                exercise: ['Start with low-impact activities', 'Gradually increase intensity', 'Aim for 250+ minutes per week'],
                lifestyle: ['Set achievable goals', 'Seek professional help', 'Join support groups if needed']
            },
            obese2: {
                diet: ['Structured meal plan', 'Professional nutrition guidance', 'Focus on sustainable changes'],
                exercise: ['Supervised exercise program', 'Start slowly and build up', 'Consider medical clearance'],
                lifestyle: ['Medical supervision recommended', 'Comprehensive lifestyle changes', 'Regular monitoring']
            },
            obese3: {
                diet: ['Medical supervision required', 'Structured weight management program', 'Potential surgical consultation'],
                exercise: ['Medical clearance required', 'Supervised exercise only', 'Start with very light activities'],
                lifestyle: ['Comprehensive medical care', 'Regular health monitoring', 'Professional support team']
            }
        };
        
        // Body fat percentage estimates
        this.bodyFatRanges = {
            male: {
                essential: { min: 0, max: 5, label: 'Essential Fat' },
                athlete: { min: 5, max: 13, label: 'Athletes' },
                fitness: { min: 13, max: 17, label: 'Fitness' },
                average: { min: 17, max: 24, label: 'Average' },
                overweight: { min: 24, max: 30, label: 'Overweight' },
                obese: { min: 30, max: Infinity, label: 'Obese' }
            },
            female: {
                essential: { min: 0, max: 8, label: 'Essential Fat' },
                athlete: { min: 8, max: 20, label: 'Athletes' },
                fitness: { min: 20, max: 24, label: 'Fitness' },
                average: { min: 24, max: 31, label: 'Average' },
                overweight: { min: 31, max: 37, label: 'Overweight' },
                obese: { min: 37, max: Infinity, label: 'Obese' }
            }
        };
    }

    /**
     * Calculate BMI
     */
    calculateBMI(weight, height, unit = 'metric') {
        try {
            let weightKg, heightM;
            
            if (unit === 'metric') {
                weightKg = parseFloat(weight);
                heightM = parseFloat(height) / 100; // Convert cm to m
            } else {
                // Imperial units
                const weightLbs = parseFloat(weight);
                const heightInches = parseFloat(height);
                weightKg = weightLbs * 0.453592; // Convert lbs to kg
                heightM = heightInches * 0.0254; // Convert inches to m
            }
            
            if (weightKg <= 0 || heightM <= 0) {
                throw new Error('Weight and height must be positive values');
            }
            
            const bmi = weightKg / (heightM * heightM);
            const category = this.getBMICategory(bmi);
            const bodyFatEstimate = this.estimateBodyFat(bmi, heightM, weightKg);
            const idealWeight = this.calculateIdealWeight(heightM, unit);
            const weightToLose = Math.max(0, weightKg - idealWeight.max);
            const weightToGain = Math.max(0, idealWeight.min - weightKg);
            
            const result = {
                bmi: parseFloat(bmi.toFixed(1)),
                category: category,
                bodyFatEstimate: bodyFatEstimate,
                idealWeight: idealWeight,
                weightToLose: parseFloat(weightToLose.toFixed(1)),
                weightToGain: parseFloat(weightToGain.toFixed(1)),
                healthRisk: this.getHealthRisk(category),
                recommendations: this.getRecommendations(category),
                weight: weightKg,
                height: heightM,
                unit: unit
            };
            
            this.addToHistory('calculate_bmi', { weight, height, unit }, result);
            
            return {
                success: true,
                result: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get BMI category
     */
    getBMICategory(bmi) {
        for (const [key, category] of Object.entries(this.bmiCategories)) {
            if (bmi >= category.min && bmi < category.max) {
                return {
                    key: key,
                    label: category.label,
                    color: category.color,
                    risk: category.risk,
                    range: `${category.min}-${category.max === Infinity ? '∞' : category.max}`
                };
        }
        return this.bmiCategories.obese3;
    }

    /**
     * Estimate body fat percentage
     */
    estimateBodyFat(bmi, height, weight, gender = 'male', age = 25) {
        // Using Deurenberg formula: BF% = (1.20 × BMI) + (0.23 × age) - (10.8 × gender) - 5.4
        const genderFactor = gender === 'male' ? 1 : 0;
        const bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
        
        const ranges = this.bodyFatRanges[gender];
        let category = 'obese';
        
        for (const [key, range] of Object.entries(ranges)) {
            if (bodyFatPercentage >= range.min && bodyFatPercentage < range.max) {
                category = key;
                break;
            }
        }
        
        return {
            percentage: Math.max(0, Math.min(50, parseFloat(bodyFatPercentage.toFixed(1)))),
            category: category,
            label: ranges[category].label
        };
    }

    /**
     * Calculate ideal weight range
     */
    calculateIdealWeight(height, unit = 'metric') {
        const heightM = unit === 'metric' ? height : height * 0.0254;
        const minBMI = 18.5;
        const maxBMI = 24.9;
        
        return {
            min: parseFloat((minBMI * heightM * heightM).toFixed(1)),
            max: parseFloat((maxBMI * heightM * heightM).toFixed(1)),
            range: `${parseFloat((minBMI * heightM * heightM).toFixed(1))} - ${parseFloat((maxBMI * heightM * heightM).toFixed(1))} kg`
        };
    }

    /**
     * Get health risk assessment
     */
    getHealthRisk(category) {
        const risks = {
            underweight: [
                'Nutritional deficiencies',
                'Weakened immune system',
                'Osteoporosis risk',
                'Fertility issues'
            ],
            normal: [
                'Low health risk',
                'Maintain current lifestyle',
                'Regular health monitoring'
            ],
            overweight: [
                'Increased diabetes risk',
                'High blood pressure risk',
                'Heart disease risk',
                'Joint problems'
            ],
            obese1: [
                'High diabetes risk',
                'High blood pressure',
                'Heart disease risk',
                'Sleep apnea risk'
            ],
            obese2: [
                'Very high diabetes risk',
                'Severe blood pressure issues',
                'High heart disease risk',
                'Multiple health complications'
            ],
            obese3: [
                'Extremely high health risks',
                'Multiple organ complications',
                'Severe mobility issues',
                'Life-threatening conditions'
            ]
        };
        
        return risks[category.key] || risks.normal;
    }

    /**
     * Get personalized recommendations
     */
    getRecommendations(category) {
        return this.recommendations[category.key] || this.recommendations.normal;
    }

    /**
     * Calculate BMI for different age groups
     */
    calculateBMIAgeAdjusted(bmi, age, gender = 'male') {
        let adjustedCategory = 'normal';
        
        if (age < 18) {
            // For children and teens, BMI categories are different
            if (bmi < 18.5) adjustedCategory = 'underweight';
            else if (bmi < 25) adjustedCategory = 'normal';
            else if (bmi < 30) adjustedCategory = 'overweight';
            else adjustedCategory = 'obese';
        } else if (age >= 65) {
            // For seniors, slightly higher BMI is acceptable
            if (bmi < 23) adjustedCategory = 'underweight';
            else if (bmi < 28) adjustedCategory = 'normal';
            else if (bmi < 32) adjustedCategory = 'overweight';
            else adjustedCategory = 'obese';
        }
        
        return {
            ageAdjusted: true,
            category: adjustedCategory,
            note: age < 18 ? 'BMI categories differ for children and teens' : 
                   age >= 65 ? 'BMI categories are adjusted for seniors' : 'Standard adult BMI categories'
        };
    }

    /**
     * Calculate weight change needed
     */
    calculateWeightChange(currentWeight, targetBMI, height, unit = 'metric') {
        const heightM = unit === 'metric' ? height / 100 : height * 0.0254;
        const targetWeight = targetBMI * heightM * heightM;
        const weightChange = targetWeight - currentWeight;
        
        return {
            targetWeight: parseFloat(targetWeight.toFixed(1)),
            weightChange: parseFloat(weightChange.toFixed(1)),
            action: weightChange > 0 ? 'gain' : 'lose',
            amount: Math.abs(parseFloat(weightChange.toFixed(1)))
        };
    }

    /**
     * Get BMI statistics
     */
    getBMIStatistics() {
        if (this.history.length === 0) {
            return {
                totalCalculations: 0,
                averageBMI: 0,
                mostCommonCategory: 'None',
                trend: 'No data'
            };
        }
        
        const bmis = this.history.map(h => h.result.bmi);
        const categories = this.history.map(h => h.result.category.label);
        
        const averageBMI = bmis.reduce((sum, bmi) => sum + bmi, 0) / bmis.length;
        
        // Find most common category
        const categoryCounts = {};
        categories.forEach(cat => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => 
            categoryCounts[a] > categoryCounts[b] ? a : b
        );
        
        // Calculate trend
        let trend = 'stable';
        if (bmis.length >= 2) {
            const recent = bmis.slice(-3);
            const older = bmis.slice(0, -3);
            if (recent.length > 0 && older.length > 0) {
                const recentAvg = recent.reduce((sum, bmi) => sum + bmi, 0) / recent.length;
                const olderAvg = older.reduce((sum, bmi) => sum + bmi, 0) / older.length;
                if (recentAvg > olderAvg + 0.5) trend = 'increasing';
                else if (recentAvg < olderAvg - 0.5) trend = 'decreasing';
            }
        }
        
        return {
            totalCalculations: this.history.length,
            averageBMI: parseFloat(averageBMI.toFixed(1)),
            mostCommonCategory: mostCommonCategory,
            trend: trend,
            latestBMI: bmis[bmis.length - 1],
            bmiRange: {
                min: Math.min(...bmis),
                max: Math.max(...bmis)
            }
        };
    }

    /**
     * Add to history
     */
    addToHistory(action, input, result) {
        this.history.unshift({
            timestamp: new Date().toISOString(),
            action: action,
            input: input,
            result: result
        });
        
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
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
