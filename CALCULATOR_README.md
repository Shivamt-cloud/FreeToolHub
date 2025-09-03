# 🧮 Advanced Calculator Tool - FreeToolHub

A comprehensive, professional-grade scientific calculator featuring Pratt parsing, AST evaluation, complex number support, and advanced numerical methods.

## ✨ Features

### 🔢 Core Architecture
- **Pratt Parser**: Top-down parsing with operator precedence and associativity
- **AST Evaluation**: Abstract Syntax Tree for efficient expression evaluation
- **Tokenization**: Advanced lexer with support for numbers, functions, and operators
- **Memory Management**: Comprehensive memory and history system

### 🌐 Multiple Calculator Modes
- **Basic Mode**: Traditional calculator with standard operations
- **Advanced Mode**: Expression evaluation with full mathematical syntax
- **Scientific Mode**: Two-operand operations with scientific functions
- **Complex Mode**: Complex number arithmetic and operations
- **Numerical Mode**: Advanced numerical methods (solve, integrate, derivative)

### 🔬 Advanced Mathematical Functions
- **Trigonometric**: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh
- **Logarithmic**: ln, log, log10, exp
- **Other Functions**: sqrt, abs, floor, ceil, round, factorial, min, max, pow
- **Constants**: π (pi), e, i (imaginary unit)

### 🔢 Complex Number Support
- **Full Arithmetic**: Addition, subtraction, multiplication, division, power
- **Complex Functions**: Trigonometric, exponential, logarithmic, square root
- **Utility Operations**: Magnitude, angle, conjugate
- **Real/Complex Mode**: Automatic switching based on input

### 📊 Advanced Numerical Methods
- **Root Finding**: Newton-Raphson method with bisection fallback
- **Integration**: Adaptive Simpson quadrature with error control
- **Differentiation**: Numerical differentiation with configurable step size
- **Convergence Control**: Configurable tolerance and iteration limits

## 🎯 Supported Operations

### Mathematical Operators
| Operator | Symbol | Precedence | Associativity | Description |
|----------|--------|------------|---------------|-------------|
| Addition | `+` | 1 | Left | Basic addition |
| Subtraction | `-` | 1 | Left | Basic subtraction |
| Multiplication | `*` or `×` | 2 | Left | Basic multiplication |
| Division | `/` or `÷` | 2 | Left | Basic division |
| Modulo | `%` | 2 | Left | Remainder operation |
| Power | `^` | 3 | Right | Exponentiation |
| Unary Plus | `+` | 4 | Right | Positive number |
| Unary Minus | `-` | 4 | Right | Negative number |
| Factorial | `!` | 5 | Left | Postfix factorial |

### Complex Number Operations
| Operation | Description | Example |
|-----------|-------------|---------|
| **Arithmetic** | Addition, subtraction, multiplication, division | `(3+4i) + (1+2i)` |
| **Power** | Integer and complex powers | `(1+i)^3` |
| **Functions** | Trigonometric, exponential, logarithmic | `sin(1+i)`, `exp(i*pi)` |
| **Properties** | Magnitude, angle, conjugate | `|3+4i|`, `arg(1+i)` |

### Advanced Functions
| Function | Description | Arity | Example |
|----------|-------------|-------|---------|
| `sin(x)`, `cos(x)`, `tan(x)` | Trigonometric functions | 1 | `sin(pi/2)` |
| `asin(x)`, `acos(x)`, `atan(x)` | Inverse trigonometric | 1 | `asin(1)` |
| `sinh(x)`, `cosh(x)`, `tanh(x)` | Hyperbolic functions | 1 | `cosh(0)` |
| `ln(x)`, `log(x)`, `log10(x)` | Logarithmic functions | 1 | `ln(e)` |
| `exp(x)`, `sqrt(x)` | Exponential and root | 1 | `exp(1)`, `sqrt(16)` |
| `abs(x)`, `floor(x)`, `ceil(x)` | Utility functions | 1 | `abs(-5)` |
| `factorial(x)` | Factorial function | 1 | `factorial(5)` |
| `min(...)`, `max(...)` | Variadic functions | N | `min(1,5,3)` |
| `pow(x, y)` | Power function | 2 | `pow(2, 8)` |

### Numerical Methods
| Method | Description | Parameters | Example |
|--------|-------------|------------|---------|
| **solve(f, x₀)** | Root finding | Function, initial guess | `solve(x^2-4, 1)` |
| **integrate(f, a, b)** | Definite integration | Function, bounds | `integrate(sin(x), 0, pi)` |
| **derivative(f, x₀)** | Numerical derivative | Function, point | `derivative(x^2, 3)` |

## 🔧 Technical Implementation

### Architecture Overview
```
Input → Tokenization → Pratt Parsing → AST → Evaluation → Result
```

### Core Components

#### 1. **Lexer (Tokenization)**
- Scans input into tokens: numbers, identifiers, operators, parentheses
- Handles scientific notation, decimal numbers, and special characters
- Supports whitespace and line breaks

#### 2. **Pratt Parser**
- Top-down parsing with operator precedence
- Natural handling of prefix, infix, and postfix operators
- Efficient AST construction with O(n) complexity

#### 3. **AST (Abstract Syntax Tree)**
- Tree representation of mathematical expressions
- Node types: Number, Identifier, BinaryOp, UnaryOp, FunctionCall
- Enables efficient evaluation and optimization

#### 4. **AST Evaluator**
- Recursive tree traversal for evaluation
- Complex number support throughout
- Configurable angle modes and precision

#### 5. **Complex Number System**
- Full complex arithmetic implementation
- Trigonometric functions for complex arguments
- Automatic real/complex mode switching

### Performance Characteristics
- **Time Complexity**: O(n) for parsing and evaluation
- **Memory Usage**: Efficient AST representation
- **Optimizations**: Lookup tables, optimized algorithms
- **Precision**: IEEE-754 double precision (configurable)

## 🎮 Usage Examples

### Basic Operations
```javascript
const calc = new AdvancedCalculator();

// Simple arithmetic
calc.evalExpr('2 + 3 * 4');        // 14 (precedence)
calc.evalExpr('(2 + 3) * 4');      // 20 (parentheses)
calc.evalExpr('2^8');              // 256 (power)
calc.evalExpr('5!');               // 120 (factorial)
```

### Function Evaluation
```javascript
// Trigonometric functions
calc.evalExpr('sin(pi/2)');        // 1
calc.evalExpr('cos(pi)');          // -1
calc.evalExpr('tan(pi/4)');        // 1

// Other functions
calc.evalExpr('sqrt(16)');         // 4
calc.evalExpr('ln(e)');            // 1
calc.evalExpr('abs(-42)');         // 42
```

### Complex Numbers
```javascript
calc.setComplexMode(true);

// Complex arithmetic
calc.evalExpr('(3+4i) + (1+2i)'); // 4+6i
calc.evalExpr('(1+i) * (1-i)');   // 2
calc.evalExpr('sqrt(-4)');         // 2i

// Complex functions
calc.evalExpr('exp(i*pi)');        // -1
calc.evalExpr('sin(i)');           // Complex result
```

### Advanced Numerical Methods
```javascript
// Root finding
calc.solve('x^2 - 4', 'x', 1);     // 2

// Integration
calc.integrate('sin(x)', 0, Math.PI); // 2

// Differentiation
calc.derivative('x^2', 3);         // 6
```

### Variables and Memory
```javascript
// Set variables
calc.setVariable('x', 5);
calc.evalExpr('x * 2');            // 10

// Memory operations
calc.storeMemory('result', 42);
calc.recallMemory('result');       // 42
```

## 🎛️ Configuration Options

### Angle Modes
- **Radians**: Default mode, uses π-based calculations
- **Degrees**: Converts to radians internally for calculations

### Complex Mode
- **Disabled**: Returns errors for complex operations
- **Enabled**: Automatically handles complex numbers

### Precision Settings
- **32-bit**: Single precision floating point
- **64-bit**: Double precision (default, IEEE-754)
- **128-bit**: Extended precision (when available)

### Memory Management
- **Storage**: Named memory locations with arbitrary values
- **History**: Expression and result tracking
- **Persistence**: Memory maintained during session

## 🔍 Error Handling

### Common Error Types
| Error | Cause | Solution |
|-------|-------|----------|
| `Division by zero` | Attempting division by zero | Check input values |
| `Invalid expression` | Syntax errors in input | Verify expression format |
| `Undefined variable` | Using undefined variable | Set variable first |
| `Function not found` | Unknown function name | Check function spelling |
| `Complex operation in real mode` | Complex result in real mode | Enable complex mode |

### Error Recovery
```javascript
try {
    const result = calc.evalExpr('1 / 0');
} catch (error) {
    if (error.message.includes('Division by zero')) {
        // Handle division by zero
        console.log('Cannot divide by zero');
    }
}
```

## 🧪 Testing and Validation

### Built-in Testing
```javascript
// Run comprehensive test suite
runCalculatorTests();

// Validate expressions
const validation = calc.validateExpression('2 + 3 * 4');
if (validation.isValid) {
    console.log('Expression is valid');
} else {
    console.log('Error:', validation.error);
}
```

### Test Coverage
- **Unit Tests**: Individual function testing
- **Integration Tests**: End-to-end workflow testing
- **Edge Cases**: Error conditions and boundary values
- **Performance Tests**: Speed and memory usage validation

## 🚀 Advanced Features

### Custom Functions
```javascript
// Add custom function
calc.addFunction('double', (args) => args[0] * 2, 1);
calc.evalExpr('double(5)');        // 10

// Remove function
calc.removeFunction('double');
```

### Function Registry
```javascript
// Get available functions
const functions = calc.getAvailableFunctions();
console.log('Available functions:', functions);

// Get available operators
const operators = calc.getAvailableOperators();
console.log('Available operators:', operators);
```

### History Management
```javascript
// Get calculation history
const history = calc.getHistory();
history.forEach(entry => {
    console.log(`${entry.expression} = ${entry.result}`);
});

// Clear history
calc.clearHistory();
```

## 🔗 Integration Examples

### Web Application
```javascript
// Initialize calculator
const calc = new AdvancedCalculator();

// Handle form submission
document.getElementById('calc-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const expression = document.getElementById('expression').value;
    const angleMode = document.getElementById('angle-mode').value;
    const complexMode = document.getElementById('complex-mode').checked;
    
    try {
        const result = calc.evalExpr(expression, {
            angleMode: angleMode,
            complexMode: complexMode
        });
        document.getElementById('result').textContent = result.toString();
    } catch (error) {
        showError(error.message);
    }
});
```

### Node.js Backend
```javascript
const { AdvancedCalculator } = require('./calculator.js');

const calc = new AdvancedCalculator();

// API endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const { expression, options } = req.body;
        const result = calc.evalExpr(expression, options);
        res.json({ success: true, result: result.toString() });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
```

## 📚 Mathematical Foundation

### Operator Precedence
```
1. Parentheses ()
2. Unary operators (+, -, !)
3. Power (^) - right associative
4. Multiplication, Division, Modulo (*, /, %) - left associative
5. Addition, Subtraction (+, -) - left associative
```

### Complex Number Mathematics
- **Euler's Formula**: e^(iθ) = cos(θ) + i·sin(θ)
- **De Moivre's Theorem**: (r·e^(iθ))^n = r^n·e^(i·nθ)
- **Complex Conjugate**: (a+bi)* = a-bi
- **Magnitude**: |a+bi| = √(a²+b²)
- **Angle**: arg(a+bi) = atan2(b,a)

### Numerical Methods
- **Newton-Raphson**: Quadratic convergence for root finding
- **Adaptive Simpson**: Efficient numerical integration
- **Finite Differences**: Numerical differentiation
- **Error Control**: Configurable tolerance and convergence criteria

## 🌟 Use Cases

### Academic and Research
- **Mathematics**: Complex calculations and proofs
- **Physics**: Scientific computations and modeling
- **Engineering**: Numerical analysis and design
- **Computer Science**: Algorithm development and testing

### Professional Applications
- **Financial Modeling**: Complex mathematical models
- **Data Analysis**: Statistical computations
- **Scientific Computing**: Research and development
- **Education**: Teaching and learning mathematics

### Development and Testing
- **Algorithm Verification**: Mathematical correctness
- **Performance Testing**: Computational efficiency
- **Error Analysis**: Robustness and edge cases
- **Integration Testing**: System-wide validation

## 🔧 Development and Extensibility

### Architecture Benefits
- **Modular Design**: Easy to extend and modify
- **Clean Separation**: Lexer, parser, evaluator are independent
- **Testable**: Comprehensive unit and integration testing
- **Maintainable**: Clear code structure and documentation

### Extension Points
- **Custom Functions**: Add new mathematical operations
- **Operator Overloading**: Extend operator behavior
- **Precision Modes**: Implement arbitrary precision arithmetic
- **Symbolic Computation**: Add symbolic mathematics capabilities

### Performance Optimization
- **Lookup Tables**: Fast function and operator resolution
- **Memory Pooling**: Efficient object reuse
- **Lazy Evaluation**: Defer computation until needed
- **Caching**: Store frequently computed results

---

**🧮 Advanced Calculator Tool** - Professional-grade scientific calculator with comprehensive mathematical capabilities, complex number support, and advanced numerical methods. Perfect for academic, research, and professional applications requiring robust mathematical computation.
