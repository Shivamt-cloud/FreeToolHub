/**
 * Advanced Scientific Calculator Module for FreeToolHub
 * Implements comprehensive expression evaluation with Pratt parsing, AST evaluation,
 * advanced numerical methods, and complex number support
 */

// Token types for the lexer
const TokenType = {
    NUMBER: 'NUMBER',
    IDENTIFIER: 'IDENTIFIER',
    OPERATOR: 'OPERATOR',
    LEFT_PAREN: 'LEFT_PAREN',
    RIGHT_PAREN: 'RIGHT_PAREN',
    COMMA: 'COMMA',
    FUNCTION: 'FUNCTION',
    UNARY_OPERATOR: 'UNARY_OPERATOR',
    EOF: 'EOF'
};

// Operator associativity
const Associativity = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

// Complex number class for complex arithmetic
class Complex {
    constructor(real, imaginary = 0) {
        this.real = real;
        this.imaginary = imaginary;
    }

    // Basic arithmetic operations
    add(other) {
        if (typeof other === 'number') {
            return new Complex(this.real + other, this.imaginary);
        }
        return new Complex(this.real + other.real, this.imaginary + other.imaginary);
    }

    subtract(other) {
        if (typeof other === 'number') {
            return new Complex(this.real - other, this.imaginary);
        }
        return new Complex(this.real - other.real, this.imaginary - other.imaginary);
    }

    multiply(other) {
        if (typeof other === 'number') {
            return new Complex(this.real * other, this.imaginary * other);
        }
        return new Complex(
            this.real * other.real - this.imaginary * other.imaginary,
            this.real * other.imaginary + this.imaginary * other.real
        );
    }

    divide(other) {
        if (typeof other === 'number') {
            return new Complex(this.real / other, this.imaginary / other);
        }
        const denominator = other.real * other.real + other.imaginary * other.imaginary;
        return new Complex(
            (this.real * other.real + this.imaginary * other.imaginary) / denominator,
            (this.imaginary * other.real - this.real * other.imaginary) / denominator
        );
    }

    power(n) {
        if (typeof n === 'number' && Number.isInteger(n)) {
            if (n === 0) return new Complex(1);
            if (n < 0) return new Complex(1).divide(this.power(-n));
            
            let result = new Complex(1);
            let base = this;
            while (n > 0) {
                if (n % 2 === 1) result = result.multiply(base);
                base = base.multiply(base);
                n = Math.floor(n / 2);
            }
            return result;
        }
        
        // For non-integer powers, use complex exponential
        return this.exp().multiply(new Complex(n)).log();
    }

    // Complex functions
    exp() {
        const expReal = Math.exp(this.real);
        return new Complex(
            expReal * Math.cos(this.imaginary),
            expReal * Math.sin(this.imaginary)
        );
    }

    log() {
        const magnitude = this.magnitude();
        const angle = this.angle();
        return new Complex(Math.log(magnitude), angle);
    }

    sqrt() {
        const magnitude = this.magnitude();
        const angle = this.angle() / 2;
        const sqrtMagnitude = Math.sqrt(magnitude);
        return new Complex(
            sqrtMagnitude * Math.cos(angle),
            sqrtMagnitude * Math.sin(angle)
        );
    }

    // Trigonometric functions
    sin() {
        return new Complex(
            Math.sin(this.real) * Math.cosh(this.imaginary),
            Math.cos(this.real) * Math.sinh(this.imaginary)
        );
    }

    cos() {
        return new Complex(
            Math.cos(this.real) * Math.cosh(this.imaginary),
            -Math.sin(this.real) * Math.sinh(this.imaginary)
        );
    }

    tan() {
        return this.sin().divide(this.cos());
    }

    // Utility methods
    magnitude() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    angle() {
        return Math.atan2(this.imaginary, this.real);
    }

    conjugate() {
        return new Complex(this.real, -this.imaginary);
    }

    isReal() {
        return this.imaginary === 0;
    }

    isComplex() {
        return this.imaginary !== 0;
    }

    toString() {
        if (this.imaginary === 0) return this.real.toString();
        if (this.real === 0) return `${this.imaginary}i`;
        return `${this.real}${this.imaginary >= 0 ? '+' : ''}${this.imaginary}i`;
    }

    toNumber() {
        if (this.imaginary === 0) return this.real;
        throw new Error('Cannot convert complex number to real number');
    }
}

// Token class for the lexer
class Token {
    constructor(type, value, precedence = 0, associativity = Associativity.LEFT) {
        this.type = type;
        this.value = value;
        this.precedence = precedence;
        this.associativity = associativity;
    }
}

// AST Node classes
class ASTNode {
    constructor() {
        this.type = 'base';
    }
}

class NumberNode extends ASTNode {
    constructor(value) {
        super();
        this.type = 'number';
        this.value = value;
    }
}

class IdentifierNode extends ASTNode {
    constructor(name) {
        super();
        this.type = 'identifier';
        this.name = name;
    }
}

class BinaryOpNode extends ASTNode {
    constructor(operator, left, right) {
        super();
        this.type = 'binary_op';
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

class UnaryOpNode extends ASTNode {
    constructor(operator, operand) {
        super();
        this.type = 'unary_op';
        this.operator = operator;
        this.operand = operand;
    }
}

class FunctionCallNode extends ASTNode {
    constructor(name, arguments_) {
        super();
        this.type = 'function_call';
        this.name = name;
        this.arguments = arguments_;
    }
}

class FunctionCallListNode extends ASTNode {
    constructor(expressions) {
        super();
        this.type = 'function_call_list';
        this.expressions = expressions;
    }
}

// Lexer class for tokenizing input
class Lexer {
    constructor() {
        this.input = '';
        this.position = 0;
        this.currentChar = '';
        this.tokens = [];
        this.tokenIndex = 0;
    }

    tokenize(input) {
        this.input = input;
        this.position = 0;
        this.tokens = [];
        this.currentChar = this.input[0] || '';

        while (this.position < this.input.length) {
            this.skipWhitespace();
            if (this.position >= this.input.length) break;

            if (this.isDigit(this.currentChar) || this.currentChar === '.') {
                this.tokens.push(this.readNumber());
            } else if (this.isLetter(this.currentChar)) {
                this.tokens.push(this.readIdentifier());
            } else if (this.currentChar === '(') {
                this.tokens.push(new Token(TokenType.LEFT_PAREN, '('));
                this.advance();
            } else if (this.currentChar === ')') {
                this.tokens.push(new Token(TokenType.RIGHT_PAREN, ')'));
                this.advance();
            } else if (this.currentChar === ',') {
                this.tokens.push(new Token(TokenType.COMMA, ','));
                this.advance();
            } else if (this.currentChar === '+') {
                this.tokens.push(new Token(TokenType.OPERATOR, '+', 1, Associativity.LEFT));
                this.advance();
            } else if (this.currentChar === '-') {
                this.tokens.push(new Token(TokenType.OPERATOR, '-', 1, Associativity.LEFT));
                this.advance();
            } else if (this.currentChar === '*') {
                this.tokens.push(new Token(TokenType.OPERATOR, '*', 2, Associativity.LEFT));
                this.advance();
            } else if (this.currentChar === '/') {
                this.tokens.push(new Token(TokenType.OPERATOR, '/', 2, Associativity.LEFT));
                this.advance();
            } else if (this.currentChar === '^') {
                this.tokens.push(new Token(TokenType.OPERATOR, '^', 3, Associativity.RIGHT));
                this.advance();
            } else if (this.currentChar === '%') {
                this.tokens.push(new Token(TokenType.OPERATOR, '%', 2, Associativity.LEFT));
                this.advance();
            } else {
                throw new Error(`Unknown character: ${this.currentChar}`);
            }
        }

        this.tokens.push(new Token(TokenType.EOF, ''));
        return this.tokens;
    }

    advance() {
        this.position++;
        this.currentChar = this.position < this.input.length ? this.input[this.position] : '';
    }

    skipWhitespace() {
        while (this.currentChar === ' ' || this.currentChar === '\t' || this.currentChar === '\n') {
            this.advance();
        }
    }

    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    }

    readNumber() {
        let result = '';
        let hasDecimal = false;
        let hasExponent = false;

        while (this.position < this.input.length && 
               (this.isDigit(this.currentChar) || this.currentChar === '.' || 
                this.currentChar === 'e' || this.currentChar === 'E' || 
                this.currentChar === '+' || this.currentChar === '-')) {
            
            if (this.currentChar === '.') {
                if (hasDecimal || hasExponent) break;
                hasDecimal = true;
            } else if (this.currentChar === 'e' || this.currentChar === 'E') {
                if (hasExponent) break;
                hasExponent = true;
            } else if ((this.currentChar === '+' || this.currentChar === '-') && 
                       (this.currentChar === this.input[this.position - 1] || 
                        this.input[this.position - 1] !== 'e' && this.input[this.position - 1] !== 'E')) {
                break;
            }
            
            result += this.currentChar;
            this.advance();
        }

        return new Token(TokenType.NUMBER, parseFloat(result));
    }

    readIdentifier() {
        let result = '';
        while (this.position < this.input.length && 
               (this.isLetter(this.currentChar) || this.isDigit(this.currentChar))) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.IDENTIFIER, result);
    }

    peek() {
        return this.tokens[this.tokenIndex] || new Token(TokenType.EOF, '');
    }

    consume() {
        return this.tokens[this.tokenIndex++];
    }

    match(type) {
        const token = this.peek();
        if (token.type === type) {
            return this.consume();
        }
        throw new Error(`Expected ${type}, got ${token.type}`);
    }
}

// Pratt Parser for building AST
class PrattParser {
    constructor() {
        this.lexer = new Lexer();
        this.tokens = [];
        this.currentToken = null;
        this.operatorTable = this.buildOperatorTable();
        this.functionRegistry = this.buildFunctionRegistry();
    }

    buildOperatorTable() {
        return {
            '+': { precedence: 1, associativity: Associativity.LEFT, arity: 2 },
            '-': { precedence: 1, associativity: Associativity.LEFT, arity: 2 },
            '*': { precedence: 2, associativity: Associativity.LEFT, arity: 2 },
            '/': { precedence: 2, associativity: Associativity.LEFT, arity: 2 },
            '%': { precedence: 2, associativity: Associativity.LEFT, arity: 2 },
            '^': { precedence: 3, associativity: Associativity.RIGHT, arity: 2 },
            'unary+': { precedence: 4, associativity: Associativity.RIGHT, arity: 1 },
            'unary-': { precedence: 4, associativity: Associativity.RIGHT, arity: 1 },
            '!': { precedence: 5, associativity: Associativity.LEFT, arity: 1 }
        };
    }

    buildFunctionRegistry() {
        return {
            // Trigonometric functions
            'sin': { arity: 1, handler: this.trigonometricFunction.bind(this, 'sin') },
            'cos': { arity: 1, handler: this.trigonometricFunction.bind(this, 'cos') },
            'tan': { arity: 1, handler: this.trigonometricFunction.bind(this, 'tan') },
            'asin': { arity: 1, handler: this.trigonometricFunction.bind(this, 'asin') },
            'acos': { arity: 1, handler: this.trigonometricFunction.bind(this, 'acos') },
            'atan': { arity: 1, handler: this.trigonometricFunction.bind(this, 'atan') },
            'sinh': { arity: 1, handler: this.trigonometricFunction.bind(this, 'sinh') },
            'cosh': { arity: 1, handler: this.trigonometricFunction.bind(this, 'cosh') },
            'tanh': { arity: 1, handler: this.trigonometricFunction.bind(this, 'tanh') },

            // Logarithmic and exponential functions
            'ln': { arity: 1, handler: this.logarithmicFunction.bind(this, 'ln') },
            'log': { arity: 1, handler: this.logarithmicFunction.bind(this, 'log') },
            'log10': { arity: 1, handler: this.logarithmicFunction.bind(this, 'log10') },
            'exp': { arity: 1, handler: this.exponentialFunction.bind(this) },
            'sqrt': { arity: 1, handler: this.sqrtFunction.bind(this) },

            // Other mathematical functions
            'abs': { arity: 1, handler: this.absFunction.bind(this) },
            'floor': { arity: 1, handler: this.floorFunction.bind(this) },
            'ceil': { arity: 1, handler: this.ceilFunction.bind(this) },
            'round': { arity: 1, handler: this.roundFunction.bind(this) },
            'factorial': { arity: 1, handler: this.factorialFunction.bind(this) },

            // Multi-argument functions
            'min': { arity: 'variadic', handler: this.minFunction.bind(this) },
            'max': { arity: 'variadic', handler: this.maxFunction.bind(this) },
            'pow': { arity: 2, handler: this.powFunction.bind(this) },

            // Advanced numerical methods
            'solve': { arity: 3, handler: this.solveFunction.bind(this) },
            'integrate': { arity: 3, handler: this.integrateFunction.bind(this) },
            'derivative': { arity: 2, handler: this.derivativeFunction.bind(this) }
        };
    }

    parse(input) {
        this.tokens = this.lexer.tokenize(input);
        this.currentToken = this.tokens[0];
        return this.parseExpression(0);
    }

    parseExpression(precedence) {
        let left = this.parsePrimary();

        while (precedence < this.getPrecedence(this.currentToken)) {
            const token = this.currentToken;
            if (token.type === TokenType.EOF) break;

            if (token.type === TokenType.OPERATOR) {
                const operator = token.value;
                this.consume();
                left = new BinaryOpNode(operator, left, this.parseExpression(this.getPrecedence(token) + 1));
            } else {
                break;
            }
        }

        return left;
    }

    parsePrimary() {
        const token = this.currentToken;

        if (token.type === TokenType.NUMBER) {
            this.consume();
            return new NumberNode(token.value);
        }

        if (token.type === TokenType.IDENTIFIER) {
            const name = token.value;
            this.consume();

            // Check if it's a function call
            if (this.currentToken.type === TokenType.LEFT_PAREN) {
                return this.parseFunctionCall(name);
            }

            // Check if it's a constant
            if (name === 'i') {
                return new NumberNode(new Complex(0, 1));
            }
            if (name === 'pi') {
                return new NumberNode(Math.PI);
            }
            if (name === 'e') {
                return new NumberNode(Math.E);
            }

            return new IdentifierNode(name);
        }

        if (token.type === TokenType.LEFT_PAREN) {
            this.consume();
            const expression = this.parseExpression(0);
            this.match(TokenType.RIGHT_PAREN);
            return expression;
        }

        if (token.type === TokenType.OPERATOR && (token.value === '+' || token.value === '-')) {
            const operator = token.value === '+' ? 'unary+' : 'unary-';
            this.consume();
            const operand = this.parseExpression(this.getPrecedence({ value: operator }));
            return new UnaryOpNode(operator, operand);
        }

        throw new Error(`Unexpected token: ${token.value}`);
    }

    parseFunctionCall(name) {
        this.match(TokenType.LEFT_PAREN);
        const arguments_ = [];

        if (this.currentToken.type !== TokenType.RIGHT_PAREN) {
            arguments_.push(this.parseExpression(0));
            while (this.currentToken.type === TokenType.COMMA) {
                this.consume();
                arguments_.push(this.parseExpression(0));
            }
        }

        this.match(TokenType.RIGHT_PAREN);
        return new FunctionCallNode(name, arguments_);
    }

    getPrecedence(token) {
        if (token.type === TokenType.OPERATOR) {
            const op = this.operatorTable[token.value];
            return op ? op.precedence : 0;
        }
        return 0;
    }

    consume() {
        this.currentToken = this.tokens[this.tokens.indexOf(this.currentToken) + 1];
    }

    match(type) {
        if (this.currentToken.type === type) {
            this.consume();
        } else {
            throw new Error(`Expected ${type}, got ${this.currentToken.type}`);
        }
    }
}

// AST Evaluator
class ASTEvaluator {
    constructor() {
        this.variables = new Map();
        this.angleMode = 'radians'; // 'radians' or 'degrees'
        this.precision = 64; // IEEE-754 double precision
        this.complexMode = false;
    }

    evaluate(node) {
        switch (node.type) {
            case 'number':
                return node.value;
            case 'identifier':
                return this.getVariable(node.name);
            case 'binary_op':
                return this.evaluateBinaryOp(node);
            case 'unary_op':
                return this.evaluateUnaryOp(node);
            case 'function_call':
                return this.evaluateFunctionCall(node);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    evaluateBinaryOp(node) {
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);

        switch (node.operator) {
            case '+':
                return this.add(left, right);
            case '-':
                return this.subtract(left, right);
            case '*':
                return this.multiply(left, right);
            case '/':
                return this.divide(left, right);
            case '^':
                return this.power(left, right);
            case '%':
                return this.modulo(left, right);
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }
    }

    evaluateUnaryOp(node) {
        const operand = this.evaluate(node.operand);

        switch (node.operator) {
            case 'unary+':
                return operand;
            case 'unary-':
                return this.negate(operand);
            case '!':
                return this.factorial(operand);
            default:
                throw new Error(`Unknown unary operator: ${node.operator}`);
        }
    }

    evaluateFunctionCall(node) {
        const func = this.getFunction(node.name);
        if (!func) {
            throw new Error(`Unknown function: ${node.name}`);
        }

        const args = node.arguments.map(arg => this.evaluate(arg));
        return func.handler(args);
    }

    // Arithmetic operations with complex number support
    add(a, b) {
        if (a instanceof Complex || b instanceof Complex) {
            const complexA = a instanceof Complex ? a : new Complex(a);
            const complexB = b instanceof Complex ? b : new Complex(b);
            return complexA.add(complexB);
        }
        return a + b;
    }

    subtract(a, b) {
        if (a instanceof Complex || b instanceof Complex) {
            const complexA = a instanceof Complex ? a : new Complex(a);
            const complexB = b instanceof Complex ? b : new Complex(b);
            return complexA.subtract(complexB);
        }
        return a - b;
    }

    multiply(a, b) {
        if (a instanceof Complex || b instanceof Complex) {
            const complexA = a instanceof Complex ? a : new Complex(a);
            const complexB = b instanceof Complex ? b : new Complex(b);
            return complexA.multiply(complexB);
        }
        return a * b;
    }

    divide(a, b) {
        if (a instanceof Complex || b instanceof Complex) {
            const complexA = a instanceof Complex ? a : new Complex(a);
            const complexB = b instanceof Complex ? b : new Complex(b);
            return complexA.divide(complexB);
        }
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    }

    power(a, b) {
        if (a instanceof Complex || b instanceof Complex) {
            const complexA = a instanceof Complex ? a : new Complex(a);
            const complexB = b instanceof Complex ? b : new Complex(b);
            return complexA.power(complexB);
        }
        return Math.pow(a, b);
    }

    modulo(a, b) {
        if (a instanceof Complex || b instanceof Complex) {
            throw new Error('Modulo operation not defined for complex numbers');
        }
        if (b === 0) throw new Error('Modulo by zero');
        return a % b;
    }

    negate(a) {
        if (a instanceof Complex) {
            return new Complex(-a.real, -a.imaginary);
        }
        return -a;
    }

    // Function implementations
    trigonometricFunction(name, args) {
        const [x] = args;
        let angle = x;

        if (x instanceof Complex) {
            // Complex trigonometric functions
            switch (name) {
                case 'sin': return x.sin();
                case 'cos': return x.cos();
                case 'tan': return x.tan();
                case 'asin': return this.complexAsin(x);
                case 'acos': return this.complexAcos(x);
                case 'atan': return this.complexAtan(x);
                case 'sinh': return this.complexSinh(x);
                case 'cosh': return this.complexCosh(x);
                case 'tanh': return this.complexTanh(x);
                default: throw new Error(`Unknown trigonometric function: ${name}`);
            }
        } else {
            // Real trigonometric functions
            if (this.angleMode === 'degrees') {
                angle = x * Math.PI / 180;
            }

            switch (name) {
                case 'sin': return Math.sin(angle);
                case 'cos': return Math.cos(angle);
                case 'tan': return Math.tan(angle);
                case 'asin': return Math.asin(x);
                case 'acos': return Math.acos(x);
                case 'atan': return Math.atan(x);
                case 'sinh': return Math.sinh(x);
                case 'cosh': return Math.cosh(x);
                case 'tanh': return Math.tanh(x);
                default: throw new Error(`Unknown trigonometric function: ${name}`);
            }
        }
    }

    logarithmicFunction(name, args) {
        const [x] = args;
        
        if (x instanceof Complex) {
            switch (name) {
                case 'ln': return x.log();
                case 'log': return x.log().divide(new Complex(Math.LN10));
                case 'log10': return x.log().divide(new Complex(Math.LN10));
                default: throw new Error(`Unknown logarithmic function: ${name}`);
            }
        } else {
            if (x <= 0) throw new Error('Logarithm of non-positive number');
            
            switch (name) {
                case 'ln': return Math.log(x);
                case 'log': return Math.log(x);
                case 'log10': return Math.log10(x);
                default: throw new Error(`Unknown logarithmic function: ${name}`);
            }
        }
    }

    exponentialFunction(args) {
        const [x] = args;
        
        if (x instanceof Complex) {
            return x.exp();
        } else {
            return Math.exp(x);
        }
    }

    sqrtFunction(args) {
        const [x] = args;
        
        if (x instanceof Complex) {
            return x.sqrt();
        } else {
            if (x < 0) {
                if (this.complexMode) {
                    return new Complex(0, Math.sqrt(-x));
                }
                throw new Error('Square root of negative number');
            }
            return Math.sqrt(x);
        }
    }

    absFunction(args) {
        const [x] = args;
        
        if (x instanceof Complex) {
            return x.magnitude();
        } else {
            return Math.abs(x);
        }
    }

    floorFunction(args) {
        const [x] = args;
        if (x instanceof Complex) throw new Error('Floor not defined for complex numbers');
        return Math.floor(x);
    }

    ceilFunction(args) {
        const [x] = args;
        if (x instanceof Complex) throw new Error('Ceiling not defined for complex numbers');
        return Math.ceil(x);
    }

    roundFunction(args) {
        const [x] = args;
        if (x instanceof Complex) throw new Error('Round not defined for complex numbers');
        return Math.round(x);
    }

    factorialFunction(args) {
        const [x] = args;
        if (x instanceof Complex) throw new Error('Factorial not defined for complex numbers');
        if (!Number.isInteger(x) || x < 0) throw new Error('Factorial requires non-negative integer');
        if (x > 170) throw new Error('Factorial overflow');
        
        let result = 1;
        for (let i = 2; i <= x; i++) {
            result *= i;
        }
        return result;
    }

    minFunction(args) {
        if (args.length === 0) throw new Error('min() requires at least one argument');
        if (args.some(arg => arg instanceof Complex)) throw new Error('min() not defined for complex numbers');
        return Math.min(...args);
    }

    maxFunction(args) {
        if (args.length === 0) throw new Error('max() requires at least one argument');
        if (args.some(arg => arg instanceof Complex)) throw new Error('max() not defined for complex numbers');
        return Math.max(...args);
    }

    powFunction(args) {
        const [base, exponent] = args;
        return this.power(base, exponent);
    }

    // Advanced numerical methods
    solveFunction(args) {
        const [func, variable, initialGuess] = args;
        // Newton-Raphson method implementation
        return this.newtonRaphson(func, variable, initialGuess);
    }

    integrateFunction(args) {
        const [func, lower, upper] = args;
        // Adaptive Simpson integration
        return this.adaptiveSimpson(func, lower, upper);
    }

    derivativeFunction(args) {
        const [func, point] = args;
        // Numerical differentiation
        return this.numericalDerivative(func, point);
    }

    // Newton-Raphson root finding
    newtonRaphson(func, variable, initialGuess, tolerance = 1e-10, maxIterations = 100) {
        let x = initialGuess;
        let iteration = 0;

        while (iteration < maxIterations) {
            const fx = this.evaluateFunctionAt(func, variable, x);
            const fPrimeX = this.evaluateFunctionAt(func, variable, x + tolerance) - fx;
            
            if (Math.abs(fx) < tolerance) {
                return x;
            }

            if (Math.abs(fPrimeX) < tolerance) {
                // Fall back to bisection
                return this.bisection(func, variable, x - 1, x + 1, tolerance);
            }

            const xNew = x - fx / fPrimeX;
            
            if (Math.abs(xNew - x) < tolerance) {
                return xNew;
            }

            x = xNew;
            iteration++;
        }

        throw new Error('Newton-Raphson did not converge');
    }

    // Bisection method fallback
    bisection(func, variable, a, b, tolerance = 1e-10, maxIterations = 100) {
        let left = a;
        let right = b;
        let iteration = 0;

        while (iteration < maxIterations) {
            const mid = (left + right) / 2;
            const fMid = this.evaluateFunctionAt(func, variable, mid);

            if (Math.abs(fMid) < tolerance) {
                return mid;
            }

            const fLeft = this.evaluateFunctionAt(func, variable, left);
            
            if (fLeft * fMid < 0) {
                right = mid;
            } else {
                left = mid;
            }

            if (Math.abs(right - left) < tolerance) {
                return mid;
            }

            iteration++;
        }

        throw new Error('Bisection method did not converge');
    }

    // Adaptive Simpson integration
    adaptiveSimpson(func, lower, upper, tolerance = 1e-10, maxDepth = 20) {
        return this.simpsonRecursive(func, lower, upper, tolerance, maxDepth, 0);
    }

    simpsonRecursive(func, a, b, tolerance, maxDepth, depth) {
        if (depth >= maxDepth) {
            return this.simpsonBasic(func, a, b);
        }

        const m = (a + b) / 2;
        const s1 = this.simpsonBasic(func, a, b);
        const s2 = this.simpsonBasic(func, a, m) + this.simpsonBasic(func, m, b);

        if (Math.abs(s1 - s2) < 15 * tolerance) {
            return s2;
        }

        return this.simpsonRecursive(func, a, m, tolerance / 2, maxDepth, depth + 1) +
               this.simpsonRecursive(func, m, b, tolerance / 2, maxDepth, depth + 1);
    }

    simpsonBasic(func, a, b) {
        const h = (b - a) / 6;
        const fa = this.evaluateFunctionAt(func, 'x', a);
        const fm = this.evaluateFunctionAt(func, 'x', (a + b) / 2);
        const fb = this.evaluateFunctionAt(func, 'x', b);
        
        return h * (fa + 4 * fm + fb);
    }

    // Numerical differentiation
    numericalDerivative(func, point, h = 1e-8) {
        const f1 = this.evaluateFunctionAt(func, 'x', point + h);
        const f2 = this.evaluateFunctionAt(func, 'x', point - h);
        return (f1 - f2) / (2 * h);
    }

    // Helper methods
    evaluateFunctionAt(func, variable, value) {
        // Store the current value
        const oldValue = this.variables.get(variable);
        this.variables.set(variable, value);
        
        // Evaluate the function
        const result = this.evaluate(func);
        
        // Restore the old value
        if (oldValue !== undefined) {
            this.variables.set(variable, oldValue);
        } else {
            this.variables.delete(variable);
        }
        
        return result;
    }

    getVariable(name) {
        if (!this.variables.has(name)) {
            throw new Error(`Undefined variable: ${name}`);
        }
        return this.variables.get(name);
    }

    setVariable(name, value) {
        this.variables.set(name, value);
    }

    getFunction(name) {
        return this.functionRegistry[name];
    }

    setAngleMode(mode) {
        if (mode !== 'radians' && mode !== 'degrees') {
            throw new Error('Angle mode must be "radians" or "degrees"');
        }
        this.angleMode = mode;
    }

    setComplexMode(enabled) {
        this.complexMode = enabled;
    }

    setPrecision(precision) {
        this.precision = precision;
    }

    // Complex number helper functions
    complexAsin(z) {
        // Implementation of complex arcsin
        const i = new Complex(0, 1);
        return i.multiply(new Complex(0, 1).multiply(z).add(
            new Complex(1).subtract(z.multiply(z)).sqrt()
        ).log().multiply(i));
    }

    complexAcos(z) {
        // Implementation of complex arccos
        const i = new Complex(0, 1);
        return new Complex(Math.PI / 2).subtract(this.complexAsin(z));
    }

    complexAtan(z) {
        // Implementation of complex arctan
        const i = new Complex(0, 1);
        return i.multiply(
            new Complex(1).add(i.multiply(z)).log().subtract(
                new Complex(1).subtract(i.multiply(z)).log()
            )
        ).divide(new Complex(2));
    }

    complexSinh(z) {
        // Implementation of complex sinh
        return z.exp().subtract(z.negate().exp()).divide(new Complex(2));
    }

    complexCosh(z) {
        // Implementation of complex cosh
        return z.exp().add(z.negate().exp()).divide(new Complex(2));
    }

    complexTanh(z) {
        // Implementation of complex tanh
        return this.complexSinh(z).divide(this.complexCosh(z));
    }
}

// Main Advanced Calculator class
class AdvancedCalculator {
    constructor() {
        this.parser = new PrattParser();
        this.evaluator = new ASTEvaluator();
        this.mode = 'radians';
        this.complexMode = false;
        this.precision = 64;
        this.memory = new Map();
        this.lastResult = 0;
        this.history = [];
    }

    // Main evaluation method
    evalExpr(expr, options = {}) {
        try {
            // Parse the expression into an AST
            const ast = this.parser.parse(expr);
            
            // Apply options
            if (options.angleMode) {
                this.evaluator.setAngleMode(options.angleMode);
            }
            if (options.complexMode !== undefined) {
                this.evaluator.setComplexMode(options.complexMode);
            }
            if (options.precision) {
                this.evaluator.setPrecision(options.precision);
            }

            // Evaluate the AST
            const result = this.evaluator.evaluate(ast);
            
            // Store result and add to history
            this.lastResult = result;
            this.history.push({ expression: expr, result: result, timestamp: Date.now() });
            
            // Limit history size
            if (this.history.length > 100) {
                this.history.shift();
            }

            return result;
        } catch (error) {
            throw new Error(`Expression error: ${error.message}`);
        }
    }

    // Basic two-operand calculator (for backward compatibility)
    computeTwoOperand(a, b, op) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        if (isNaN(numA) || isNaN(numB)) {
            throw new Error('Invalid numbers provided');
        }

        switch (op) {
            case '+':
                return numA + numB;
            case '-':
                return numA - numB;
            case '*':
            case '×':
                return numA * numB;
            case '/':
            case '÷':
                if (numB === 0) {
                    throw new Error('Division by zero');
                }
                return numA / numB;
            case '%':
                if (numB === 0) {
                    throw new Error('Modulo by zero');
                }
                return numA % numB;
            case '^':
                if (numB > 1000) {
                    throw new Error('Exponent too large');
                }
                return Math.pow(numA, numB);
            default:
                throw new Error(`Unknown operator: ${op}`);
        }
    }

    // Advanced mathematical methods
    solve(expression, variable, initialGuess, options = {}) {
        try {
            const ast = this.parser.parse(expression);
            return this.evaluator.newtonRaphson(ast, variable, initialGuess, options.tolerance, options.maxIterations);
        } catch (error) {
            throw new Error(`Solve error: ${error.message}`);
        }
    }

    integrate(expression, lower, upper, options = {}) {
        try {
            const ast = this.parser.parse(expression);
            return this.evaluator.adaptiveSimpson(ast, lower, upper, options.tolerance, options.maxDepth);
        } catch (error) {
            throw new Error(`Integration error: ${error.message}`);
        }
    }

    derivative(expression, point, options = {}) {
        try {
            const ast = this.parser.parse(expression);
            return this.evaluator.numericalDerivative(ast, point, options.h);
        } catch (error) {
            throw new Error(`Derivative error: ${error.message}`);
        }
    }

    // Memory operations
    storeMemory(key, value) {
        this.memory.set(key, value);
    }

    recallMemory(key) {
        return this.memory.get(key) || 0;
    }

    clearMemory(key) {
        if (key) {
            this.memory.delete(key);
        } else {
            this.memory.clear();
        }
    }

    // Settings
    setMode(mode) {
        this.mode = mode;
        this.evaluator.setAngleMode(mode);
    }

    getMode() {
        return this.mode;
    }

    setComplexMode(enabled) {
        this.complexMode = enabled;
        this.evaluator.setComplexMode(enabled);
    }

    getComplexMode() {
        return this.complexMode;
    }

    setPrecision(precision) {
        this.precision = precision;
        this.evaluator.setPrecision(precision);
    }

    getPrecision() {
        return this.precision;
    }

    // Utility methods
    getLastResult() {
        return this.lastResult;
    }

    getHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
    }

    // Variable management
    setVariable(name, value) {
        this.evaluator.setVariable(name, value);
    }

    getVariable(name) {
        return this.evaluator.getVariable(name);
    }

    clearVariables() {
        this.evaluator.variables.clear();
    }

    // Function management
    addFunction(name, handler, arity) {
        this.evaluator.functionRegistry[name] = { handler, arity };
    }

    removeFunction(name) {
        delete this.evaluator.functionRegistry[name];
    }

    // Validation
    validateExpression(expr) {
        try {
            this.parser.parse(expr);
            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: error.message };
        }
    }

    // Get available functions
    getAvailableFunctions() {
        return Object.keys(this.evaluator.functionRegistry);
    }

    // Get available operators
    getAvailableOperators() {
        return Object.keys(this.evaluator.operatorTable);
    }
}

// Export for use in the main application
window.AdvancedCalculator = AdvancedCalculator;
window.Complex = Complex;
