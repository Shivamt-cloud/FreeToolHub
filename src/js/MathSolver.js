/**
 * Math Problem Solver
 * Advanced mathematical problem solver with step-by-step solutions and graphing
 */
class MathSolver {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.solutions = [];
        
        // Math categories
        this.categories = {
            algebra: {
                name: 'Algebra',
                problems: [
                    'Solve linear equations',
                    'Solve quadratic equations',
                    'Factor polynomials',
                    'Simplify expressions',
                    'Solve systems of equations'
                ]
            },
            calculus: {
                name: 'Calculus',
                problems: [
                    'Find derivatives',
                    'Find integrals',
                    'Calculate limits',
                    'Find critical points',
                    'Optimization problems'
                ]
            },
            geometry: {
                name: 'Geometry',
                problems: [
                    'Calculate area and perimeter',
                    'Find angles and distances',
                    'Volume calculations',
                    'Pythagorean theorem',
                    'Trigonometric functions'
                ]
            },
            statistics: {
                name: 'Statistics',
                problems: [
                    'Calculate mean, median, mode',
                    'Standard deviation',
                    'Probability calculations',
                    'Regression analysis',
                    'Hypothesis testing'
                ]
            },
            trigonometry: {
                name: 'Trigonometry',
                problems: [
                    'Solve trigonometric equations',
                    'Unit circle calculations',
                    'Law of sines and cosines',
                    'Graph trigonometric functions',
                    'Inverse trigonometric functions'
                ]
            }
        };
        
        // Common math patterns
        this.patterns = {
            linear: /^(\d+\.?\d*)\s*[xX]\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)$/,
            quadratic: /^(\d+\.?\d*)\s*[xX]²\s*([+\-])\s*(\d+\.?\d*)\s*[xX]\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)$/,
            polynomial: /^(\d+\.?\d*)\s*[xX]\^(\d+)\s*([+\-])\s*(\d+\.?\d*)\s*[xX]\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)$/,
            fraction: /^(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)\s*([+\-*/])\s*(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)$/,
            percentage: /^(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)$/,
            area: /^area\s+of\s+(circle|rectangle|triangle|square|trapezoid)/i,
            volume: /^volume\s+of\s+(sphere|cube|cylinder|cone|pyramid)/i
        };
    }

    /**
     * Solve math problem
     */
    solveProblem(problem, category = 'algebra') {
        try {
            if (!problem || problem.trim().length === 0) {
                throw new Error('Please provide a math problem to solve');
            }

            const normalizedProblem = this.normalizeProblem(problem);
            const problemType = this.identifyProblemType(normalizedProblem);
            
            let solution;
            switch (problemType) {
                case 'linear':
                    solution = this.solveLinearEquation(normalizedProblem);
                    break;
                case 'quadratic':
                    solution = this.solveQuadraticEquation(normalizedProblem);
                    break;
                case 'polynomial':
                    solution = this.solvePolynomialEquation(normalizedProblem);
                    break;
                case 'fraction':
                    solution = this.solveFractionProblem(normalizedProblem);
                    break;
                case 'percentage':
                    solution = this.solvePercentageProblem(normalizedProblem);
                    break;
                case 'area':
                    solution = this.solveAreaProblem(normalizedProblem);
                    break;
                case 'volume':
                    solution = this.solveVolumeProblem(normalizedProblem);
                    break;
                case 'derivative':
                    solution = this.solveDerivative(normalizedProblem);
                    break;
                case 'integral':
                    solution = this.solveIntegral(normalizedProblem);
                    break;
                case 'trigonometry':
                    solution = this.solveTrigonometryProblem(normalizedProblem);
                    break;
                case 'statistics':
                    solution = this.solveStatisticsProblem(normalizedProblem);
                    break;
                default:
                    solution = this.solveGeneralProblem(normalizedProblem);
            }

            const result = {
                success: true,
                problem: problem,
                category: category,
                type: problemType,
                solution: solution,
                steps: solution.steps || [],
                answer: solution.answer,
                explanation: solution.explanation || '',
                graphData: solution.graphData || null,
                message: `Solved ${problemType} problem successfully`
            };

            this.solutions.push(result);
            this.addToHistory('solve', { problem, category }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message,
                problem: problem
            };
        }
    }

    /**
     * Normalize problem text
     */
    normalizeProblem(problem) {
        return problem
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/²/g, '^2')
            .replace(/³/g, '^3')
            .trim();
    }

    /**
     * Identify problem type
     */
    identifyProblemType(problem) {
        if (this.patterns.linear.test(problem)) return 'linear';
        if (this.patterns.quadratic.test(problem)) return 'quadratic';
        if (this.patterns.polynomial.test(problem)) return 'polynomial';
        if (this.patterns.fraction.test(problem)) return 'fraction';
        if (this.patterns.percentage.test(problem)) return 'percentage';
        if (this.patterns.area.test(problem)) return 'area';
        if (this.patterns.volume.test(problem)) return 'volume';
        if (problem.includes('derivative') || problem.includes('d/dx')) return 'derivative';
        if (problem.includes('integral') || problem.includes('∫')) return 'integral';
        if (problem.includes('sin') || problem.includes('cos') || problem.includes('tan')) return 'trigonometry';
        if (problem.includes('mean') || problem.includes('median') || problem.includes('standard deviation')) return 'statistics';
        
        return 'general';
    }

    /**
     * Solve linear equation
     */
    solveLinearEquation(problem) {
        const match = problem.match(/(\d+\.?\d*)\s*[xX]\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)/);
        if (!match) throw new Error('Invalid linear equation format');

        const [, a, op, b, c] = match;
        const coefficient = parseFloat(a);
        const constant = parseFloat(b);
        const result = parseFloat(c);
        const operation = op === '+' ? 1 : -1;

        const steps = [
            `Given equation: ${a}x ${op} ${b} = ${c}`,
            `Subtract ${b} from both sides: ${a}x = ${c} ${op === '+' ? '-' : '+'} ${b}`,
            `Simplify: ${a}x = ${result - operation * constant}`,
            `Divide both sides by ${a}: x = ${(result - operation * constant) / coefficient}`
        ];

        const answer = (result - operation * constant) / coefficient;

        return {
            answer: answer,
            steps: steps,
            explanation: `The solution to the linear equation is x = ${answer}`,
            graphData: this.generateLinearGraphData(coefficient, operation * constant, result)
        };
    }

    /**
     * Solve quadratic equation
     */
    solveQuadraticEquation(problem) {
        const match = problem.match(/(\d+\.?\d*)\s*[xX]²\s*([+\-])\s*(\d+\.?\d*)\s*[xX]\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)/);
        if (!match) throw new Error('Invalid quadratic equation format');

        const [, a, op1, b, op2, c, d] = match;
        const coefficientA = parseFloat(a);
        const coefficientB = parseFloat(b) * (op1 === '+' ? 1 : -1);
        const coefficientC = parseFloat(c) * (op2 === '+' ? 1 : -1);
        const result = parseFloat(d);

        // Move all terms to left side: ax² + bx + c = 0
        const finalA = coefficientA;
        const finalB = coefficientB;
        const finalC = coefficientC - result;

        const discriminant = finalB * finalB - 4 * finalA * finalC;

        const steps = [
            `Given equation: ${a}x² ${op1} ${b}x ${op2} ${c} = ${d}`,
            `Move all terms to left side: ${finalA}x² + ${finalB}x + ${finalC} = 0`,
            `Calculate discriminant: Δ = b² - 4ac = ${finalB}² - 4(${finalA})(${finalC}) = ${discriminant}`,
        ];

        let answer, explanation;
        if (discriminant > 0) {
            const x1 = (-finalB + Math.sqrt(discriminant)) / (2 * finalA);
            const x2 = (-finalB - Math.sqrt(discriminant)) / (2 * finalA);
            answer = [x1, x2];
            steps.push(`Two real solutions: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
            explanation = `The quadratic equation has two real solutions: x = ${x1.toFixed(4)} and x = ${x2.toFixed(4)}`;
        } else if (discriminant === 0) {
            const x = -finalB / (2 * finalA);
            answer = [x];
            steps.push(`One real solution: x = ${x.toFixed(4)}`);
            explanation = `The quadratic equation has one real solution: x = ${x.toFixed(4)}`;
        } else {
            answer = 'No real solutions';
            steps.push('No real solutions (discriminant < 0)');
            explanation = 'The quadratic equation has no real solutions (discriminant is negative)';
        }

        return {
            answer: answer,
            steps: steps,
            explanation: explanation,
            graphData: this.generateQuadraticGraphData(finalA, finalB, finalC)
        };
    }

    /**
     * Solve polynomial equation
     */
    solvePolynomialEquation(problem) {
        // This is a simplified version - in practice, you'd need more sophisticated algorithms
        const match = problem.match(/(\d+\.?\d*)\s*[xX]\^(\d+)\s*([+\-])\s*(\d+\.?\d*)\s*[xX]\s*([+\-])\s*(\d+\.?\d*)\s*=\s*(\d+\.?\d*)/);
        if (!match) throw new Error('Invalid polynomial equation format');

        const [, a, power, op1, b, op2, c, d] = match;
        const coefficientA = parseFloat(a);
        const coefficientB = parseFloat(b) * (op1 === '+' ? 1 : -1);
        const coefficientC = parseFloat(c) * (op2 === '+' ? 1 : -1);
        const result = parseFloat(d);

        const steps = [
            `Given equation: ${a}x^${power} ${op1} ${b}x ${op2} ${c} = ${d}`,
            `This is a ${power}th degree polynomial equation`,
            `For higher degree polynomials, numerical methods or factoring may be needed`
        ];

        // For demonstration, we'll solve a simple case
        if (parseInt(power) === 2) {
            return this.solveQuadraticEquation(problem);
        }

        return {
            answer: 'Complex solution - use numerical methods',
            steps: steps,
            explanation: 'Higher degree polynomial equations require advanced solving techniques',
            graphData: null
        };
    }

    /**
     * Solve fraction problem
     */
    solveFractionProblem(problem) {
        const match = problem.match(/(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)\s*([+\-*/])\s*(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
        if (!match) throw new Error('Invalid fraction problem format');

        const [, num1, den1, op, num2, den2] = match;
        const fraction1 = parseFloat(num1) / parseFloat(den1);
        const fraction2 = parseFloat(num2) / parseFloat(den2);

        let result, steps;
        switch (op) {
            case '+':
                result = fraction1 + fraction2;
                steps = [
                    `Given: ${num1}/${den1} + ${num2}/${den2}`,
                    `Convert to decimals: ${fraction1.toFixed(4)} + ${fraction2.toFixed(4)}`,
                    `Add: ${result.toFixed(4)}`
                ];
                break;
            case '-':
                result = fraction1 - fraction2;
                steps = [
                    `Given: ${num1}/${den1} - ${num2}/${den2}`,
                    `Convert to decimals: ${fraction1.toFixed(4)} - ${fraction2.toFixed(4)}`,
                    `Subtract: ${result.toFixed(4)}`
                ];
                break;
            case '*':
                result = fraction1 * fraction2;
                steps = [
                    `Given: ${num1}/${den1} × ${num2}/${den2}`,
                    `Multiply numerators: ${num1} × ${num2} = ${num1 * num2}`,
                    `Multiply denominators: ${den1} × ${den2} = ${den1 * den2}`,
                    `Result: ${num1 * num2}/${den1 * den2} = ${result.toFixed(4)}`
                ];
                break;
            case '/':
                result = fraction1 / fraction2;
                steps = [
                    `Given: ${num1}/${den1} ÷ ${num2}/${den2}`,
                    `Flip second fraction: ${num1}/${den1} × ${den2}/${num2}`,
                    `Multiply: ${result.toFixed(4)}`
                ];
                break;
        }

        return {
            answer: result,
            steps: steps,
            explanation: `The result of the fraction operation is ${result.toFixed(4)}`
        };
    }

    /**
     * Solve percentage problem
     */
    solvePercentageProblem(problem) {
        const match = problem.match(/(\d+\.?\d*)\s*%\s*of\s*(\d+\.?\d*)/);
        if (!match) throw new Error('Invalid percentage problem format');

        const [, percentage, number] = match;
        const percent = parseFloat(percentage);
        const num = parseFloat(number);
        const result = (percent / 100) * num;

        const steps = [
            `Given: ${percentage}% of ${number}`,
            `Convert percentage to decimal: ${percentage}% = ${percent / 100}`,
            `Multiply: ${percent / 100} × ${number} = ${result}`
        ];

        return {
            answer: result,
            steps: steps,
            explanation: `${percentage}% of ${number} is ${result}`
        };
    }

    /**
     * Solve area problem
     */
    solveAreaProblem(problem) {
        const shapes = {
            circle: (r) => Math.PI * r * r,
            rectangle: (l, w) => l * w,
            triangle: (b, h) => 0.5 * b * h,
            square: (s) => s * s,
            trapezoid: (a, b, h) => 0.5 * (a + b) * h
        };

        // This is a simplified version - in practice, you'd parse dimensions from the problem
        const steps = [
            'Area calculation problem detected',
            'Please provide the dimensions for accurate calculation'
        ];

        return {
            answer: 'Dimensions needed',
            steps: steps,
            explanation: 'Please provide the specific dimensions to calculate the area'
        };
    }

    /**
     * Solve volume problem
     */
    solveVolumeProblem(problem) {
        const steps = [
            'Volume calculation problem detected',
            'Please provide the dimensions for accurate calculation'
        ];

        return {
            answer: 'Dimensions needed',
            steps: steps,
            explanation: 'Please provide the specific dimensions to calculate the volume'
        };
    }

    /**
     * Solve derivative
     */
    solveDerivative(problem) {
        const steps = [
            'Derivative calculation detected',
            'This requires advanced calculus techniques',
            'Please provide the specific function for derivative calculation'
        ];

        return {
            answer: 'Function needed',
            steps: steps,
            explanation: 'Please provide the specific function to calculate its derivative'
        };
    }

    /**
     * Solve integral
     */
    solveIntegral(problem) {
        const steps = [
            'Integral calculation detected',
            'This requires advanced calculus techniques',
            'Please provide the specific function for integration'
        ];

        return {
            answer: 'Function needed',
            steps: steps,
            explanation: 'Please provide the specific function to calculate its integral'
        };
    }

    /**
     * Solve trigonometry problem
     */
    solveTrigonometryProblem(problem) {
        const steps = [
            'Trigonometric problem detected',
            'This requires trigonometric identities and calculations',
            'Please provide the specific trigonometric expression'
        ];

        return {
            answer: 'Expression needed',
            steps: steps,
            explanation: 'Please provide the specific trigonometric expression to solve'
        };
    }

    /**
     * Solve statistics problem
     */
    solveStatisticsProblem(problem) {
        const steps = [
            'Statistical calculation detected',
            'This requires data analysis techniques',
            'Please provide the specific data set or statistical question'
        ];

        return {
            answer: 'Data needed',
            steps: steps,
            explanation: 'Please provide the specific data set for statistical analysis'
        };
    }

    /**
     * Solve general problem
     */
    solveGeneralProblem(problem) {
        // Try to evaluate as a mathematical expression
        try {
            const sanitized = problem.replace(/[^0-9+\-*/().\s]/g, '');
            const result = eval(sanitized);
            
            const steps = [
                `Given expression: ${problem}`,
                `Evaluated: ${result}`
            ];

            return {
                answer: result,
                steps: steps,
                explanation: `The result of the expression is ${result}`
            };
        } catch (error) {
            return {
                answer: 'Cannot solve',
                steps: ['Unable to solve this problem'],
                explanation: 'The problem format is not recognized. Please try a different format.'
            };
        }
    }

    /**
     * Generate linear graph data
     */
    generateLinearGraphData(a, b, c) {
        const points = [];
        for (let x = -10; x <= 10; x++) {
            const y = a * x + b;
            points.push({ x, y });
        }
        return {
            type: 'line',
            points: points,
            equation: `y = ${a}x + ${b}`
        };
    }

    /**
     * Generate quadratic graph data
     */
    generateQuadraticGraphData(a, b, c) {
        const points = [];
        for (let x = -10; x <= 10; x += 0.5) {
            const y = a * x * x + b * x + c;
            points.push({ x, y });
        }
        return {
            type: 'parabola',
            points: points,
            equation: `y = ${a}x² + ${b}x + ${c}`
        };
    }

    /**
     * Get problem categories
     */
    getCategories() {
        return this.categories;
    }

    /**
     * Get solution history
     */
    getSolutions() {
        return this.solutions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    /**
     * Get solution by ID
     */
    getSolutionById(id) {
        return this.solutions.find(solution => solution.id === id);
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
        this.solutions = [];
    }
}
