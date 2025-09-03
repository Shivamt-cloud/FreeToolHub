# 🔐 Advanced Password Generator

## Overview

The Advanced Password Generator is a state-of-the-art security tool that implements modern cryptographic best practices for generating strong, secure passwords and passphrases. Built following NIST/OWASP security guidelines, it uses Cryptographically Secure Pseudorandom Number Generation (CSPRNG) with rejection sampling to ensure unbiased, high-entropy outputs.

## ✨ Key Features

### 🔒 **Security-First Design**
- **CSPRNG Implementation**: Uses `crypto.getRandomValues()` for cryptographically secure randomness
- **Rejection Sampling**: Eliminates modulo bias for truly uniform character selection
- **Entropy-Driven Sizing**: Automatically calculates optimal length based on target entropy and alphabet size
- **Breach Screening**: Checks generated passwords against known compromised password lists

### 🎯 **Multiple Generation Modes**

#### **Character Mode**
- **Entropy Targets**: 80, 96, or 128 bits (configurable)
- **Character Sets**: Full ASCII, alphanumeric, letters-only, or custom
- **Policy Enforcement**: Configurable requirements for uppercase, lowercase, digits, and symbols
- **Length Constraints**: Minimum and maximum length boundaries

#### **Diceware Mode**
- **EFF Wordlist**: Uses Electronic Frontier Foundation's secure wordlist
- **Entropy Calculation**: ~12.9 bits per word for predictable strength
- **Customizable Separators**: Configurable word separators (space, dash, etc.)
- **Legacy Compliance**: Optional random character insertion for policy requirements

#### **Validation Mode**
- **Password Assessment**: Comprehensive security analysis of existing passwords
- **Entropy Calculation**: Real-time entropy measurement
- **Policy Checking**: Validation against configurable security policies
- **Recommendations**: Actionable security improvement suggestions

### 📊 **Advanced Analytics**
- **Real-time Entropy Display**: Shows entropy information for different character sets
- **Strength Assessment**: Color-coded strength indicators (weak to very strong)
- **Crack Time Estimation**: Approximate time to crack based on entropy
- **Policy Compliance**: Detailed validation results and recommendations

## 🏗️ Technical Architecture

### **Core Components**

#### **SecureRandomGenerator Class**
```javascript
class SecureRandomGenerator {
    secureRandomBytes(n)        // Generate n secure random bytes
    secureRandomByte()          // Generate single random byte
    secureIndex(n)              // Unbiased index selection (0 to n-1)
    secureRandomInt(min, max)   // Unbiased integer in range
}
```

#### **CharacterSets Class**
```javascript
class CharacterSets {
    static UPPERCASE            // A-Z (26 characters)
    static LOWERCASE            // a-z (26 characters)
    static DIGITS               // 0-9 (10 characters)
    static SYMBOLS              // !@#$%^&*()_+-=[]{}|;:,.<>?
    static ALPHANUMERIC         // A-Z, a-z, 0-9 (62 characters)
    static FULL_ASCII           // Complete ASCII printable set (95 characters)
    static UNICODE_SAFE         // Unicode-safe character set
}
```

#### **DicewareWordlist Class**
```javascript
class DicewareWordlist {
    static WORDS                // EFF Long Wordlist (first 100 words)
    static BITS_PER_WORD        // ~12.9 bits per word
    static getRandomWord()      // Secure random word selection
}
```

#### **PasswordScreener Class**
```javascript
class PasswordScreener {
    isBreached(password)        // Check against common breached passwords
    meetsPolicy(password, policy) // Validate against security policy
    assessPassword(password)    // Comprehensive security assessment
    calculateEntropy(password)  // Entropy calculation
}
```

#### **AdvancedPasswordGenerator Class**
```javascript
class AdvancedPasswordGenerator {
    generatePassword(options)   // Generate character-based password
    generatePassphrase(options) // Generate Diceware passphrase
    validatePassword(password)  // Validate existing password
    getEntropyInfo()           // Get entropy information for all configs
}
```

### **Security Algorithms**

#### **Rejection Sampling for Unbiased Selection**
```javascript
secureIndex(n) {
    const limit = Math.floor(256 / n) * n;
    while (true) {
        const b = this.secureRandomByte();
        if (b < limit) {
            return b % n; // Unbiased selection
        }
        // Retry if value is in biased range
    }
}
```

#### **Entropy-Driven Length Calculation**
```javascript
calculateLength(targetEntropy, alphabetSize) {
    return Math.ceil(targetEntropy / Math.log2(alphabetSize));
}
```

#### **Policy-Aware Generation**
```javascript
generatePassword(options) {
    const requiredLength = CharacterSets.calculateLength(
        options.targetEntropy, 
        options.alphabet.length
    );
    // Generate and validate against policy
}
```

## 🚀 Usage Examples

### **Basic Password Generation**
```javascript
const generator = new AdvancedPasswordGenerator();

// Generate 96-bit entropy password
const password = generator.generatePassword({
    targetEntropy: 96,
    alphabet: CharacterSets.FULL_ASCII,
    minLength: 8,
    maxLength: 128
});
```

### **Diceware Passphrase Generation**
```javascript
const passphrase = generator.generatePassphrase({
    targetEntropy: 90,
    separator: ' ',
    addRandomChars: false
});
```

### **Password Validation**
```javascript
const assessment = generator.validatePassword('myPassword123', {
    minLength: 8,
    requireUppercase: true,
    requireDigits: true
});
```

### **Multiple Password Generation**
```javascript
const passwords = generator.generateMultiplePasswords(5, {
    targetEntropy: 128,
    alphabet: CharacterSets.UNICODE_SAFE
});
```

## 📋 Configuration Options

### **Character Mode Options**
```javascript
{
    targetEntropy: 96,                    // 80, 96, or 128 bits
    alphabet: CharacterSets.FULL_ASCII,   // Character set to use
    minLength: 8,                         // Minimum password length
    maxLength: 128,                       // Maximum password length
    screenBreached: true,                 // Screen against breached lists
    policy: {
        requireUppercase: false,          // Require uppercase letters
        requireLowercase: false,          // Require lowercase letters
        requireDigits: false,             // Require digits
        requireSymbols: false             // Require symbols
    }
}
```

### **Diceware Mode Options**
```javascript
{
    targetEntropy: 90,                   // Target entropy in bits
    separator: ' ',                       // Word separator
    addRandomChars: false                 // Add symbols/digits for compliance
}
```

### **Validation Options**
```javascript
{
    minLength: 8,                         // Minimum length requirement
    maxLength: 128,                       // Maximum length limit
    requireUppercase: false,              // Uppercase requirement
    requireLowercase: false,              // Lowercase requirement
    requireDigits: false,                 // Digit requirement
    requireSymbols: false                 // Symbol requirement
}
```

## 🔍 Security Features

### **Entropy Targets**
- **80 bits**: Good security for most applications
- **96 bits**: Strong security for sensitive applications
- **128 bits**: Very strong security for high-value assets

### **Character Set Entropy**
| Character Set | Size | Bits per Char | Length for 96 bits |
|---------------|------|----------------|-------------------|
| Letters Only | 52 | 5.7 | 17 characters |
| Alphanumeric | 62 | 6.0 | 16 characters |
| Full ASCII | 95 | 6.6 | 15 characters |
| Unicode Safe | 95 | 6.6 | 15 characters |

### **Diceware Entropy**
- **6 words**: ~77.5 bits (good security)
- **7 words**: ~90.3 bits (strong security)
- **8 words**: ~103.2 bits (very strong security)
- **10 words**: ~129.0 bits (maximum security)

### **Breach Screening**
- Checks against common compromised passwords
- Includes popular weak passwords (123456, password, etc.)
- Extensible for integration with external breach databases

## 🎨 User Interface

### **Mode Tabs**
- **Characters**: Advanced character-based generation
- **Diceware**: Word-based passphrase generation
- **Validation**: Password strength assessment

### **Real-time Feedback**
- Entropy information display
- Strength indicators with color coding
- Policy compliance checking
- Security recommendations

### **Results Display**
- Generated password/passphrase
- Security analysis breakdown
- Policy validation results
- Copy-to-clipboard functionality

## 🔧 Integration

### **Browser Environment**
```html
<script src="src/js/advanced-password-generator.js"></script>
<script>
    const generator = new AdvancedPasswordGenerator();
    // Use generator methods
</script>
```

### **Node.js Environment**
```javascript
const { AdvancedPasswordGenerator } = require('./src/js/advanced-password-generator.js');
const generator = new AdvancedPasswordGenerator();
```

## 🧪 Testing and Validation

### **Entropy Verification**
- Frequency testing across large batches
- Statistical analysis for bias detection
- Entropy calculation validation

### **Security Testing**
- CSPRNG implementation verification
- Rejection sampling correctness
- Policy enforcement validation

### **Performance Testing**
- Generation speed benchmarks
- Memory usage optimization
- Browser compatibility testing

## 📚 Best Practices

### **For Users**
1. **Choose Appropriate Entropy**: 96 bits for most applications, 128 bits for high-security needs
2. **Use Diceware for Memorability**: Better for human memory than random characters
3. **Avoid Composition Rules**: Focus on length and entropy rather than character requirements
4. **Regular Updates**: Change passwords periodically and avoid reuse

### **For Developers**
1. **CSPRNG Only**: Never use Math.random() for security applications
2. **Rejection Sampling**: Implement unbiased selection for all random choices
3. **Entropy Calculation**: Use proper logarithmic calculations for security metrics
4. **Policy Flexibility**: Allow users to configure security requirements

## 🚨 Security Considerations

### **Randomness Requirements**
- **Cryptographic Security**: All random values must come from CSPRNG
- **Bias Elimination**: Rejection sampling prevents modulo bias
- **Entropy Preservation**: Maintain full entropy throughout generation process

### **Policy Implementation**
- **Flexible Requirements**: Avoid overly restrictive composition rules
- **Length Focus**: Prioritize length over character complexity
- **User Choice**: Allow users to configure security preferences

### **Breach Protection**
- **Local Screening**: Check against known weak passwords
- **External Integration**: Consider integration with breach databases
- **Regular Updates**: Keep breach lists current

## 🔮 Future Enhancements

### **Planned Features**
- **Extended Wordlists**: Full EFF Long Wordlist and other languages
- **Advanced Policies**: Role-based security requirements
- **Breach Database Integration**: Real-time breach checking
- **Password History**: Secure storage of generated passwords

### **API Extensions**
- **REST API**: Web service for password generation
- **Mobile SDK**: Native mobile application support
- **Plugin System**: Extensible architecture for custom features

## 📖 References

### **Standards and Guidelines**
- **NIST SP 800-63B**: Digital Identity Guidelines
- **OWASP Password Guidelines**: Modern password security recommendations
- **RFC 4648**: Base64 encoding standards
- **EFF Diceware**: Secure passphrase generation methodology

### **Cryptographic References**
- **CSPRNG Requirements**: Cryptographically secure random number generation
- **Entropy Calculations**: Information theory and password strength
- **Rejection Sampling**: Unbiased random selection algorithms

### **Implementation Resources**
- **Web Crypto API**: Browser-based cryptographic primitives
- **Node.js Crypto**: Server-side cryptographic functions
- **Security Libraries**: Open-source security implementations

---

*The Advanced Password Generator represents the cutting edge of password security technology, implementing industry best practices and modern cryptographic standards to provide users with the strongest possible password generation capabilities.*
