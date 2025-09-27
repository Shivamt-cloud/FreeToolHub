/**
 * FunctionRegistry.js - Extended function registry and management
 * 
 * This module provides additional functionality for managing mathematical functions,
 * including user-defined functions, function composition, and advanced mathematical operations.
 */

class FunctionRegistry {
    constructor(operatorTable) {
        this.operatorTable = operatorTable;
        this.userFunctions = new Map();
        this.functionAliases = new Map();
        this.functionCategories = new Map();
        
        this.initializeCategories();
        this.initializeAliases();
    }

    /**
     * Initialize function categories for organization
     */
    initializeCategories() {
        this.functionCategories.set('trigonometric', [
            'sin', 'cos', 'tan', 'asin', 'acos', 'atan'
        ]);
        
        this.functionCategories.set('logarithmic', [
            'log', 'ln', 'exp'
        ]);
        
        this.functionCategories.set('power', [
            'sqrt', 'cbrt', 'pow'
        ]);
        
        this.functionCategories.set('statistical', [
            'min', 'max', 'abs'
        ]);
        
        this.functionCategories.set('rounding', [
            'ceil', 'floor', 'round'
        ]);
        
        this.functionCategories.set('random', [
            'random', 'randint'
        ]);
    }

    /**
     * Initialize function aliases for common variations
     */
    initializeAliases() {
        // Trigonometric aliases
        this.functionAliases.set('arcsin', 'asin');
        this.functionAliases.set('arccos', 'acos');
        this.functionAliases.set('arctan', 'atan');
        
        // Logarithmic aliases
        this.functionAliases.set('log10', 'log');
        this.functionAliases.set('log2', 'log2');
        this.functionAliases.set('exp', 'exp');
        
        // Power aliases
        this.functionAliases.set('square', 'pow2');
        this.functionAliases.set('cube', 'pow3');
        
        // Statistical aliases
        this.functionAliases.set('minimum', 'min');
        this.functionAliases.set('maximum', 'max');
        this.functionAliases.set('absolute', 'abs');
    }

    /**
     * Register a user-defined function
     * @param {string} name - Function name
     * @param {number} arity - Number of parameters
     * @param {Function} implementation - Function implementation
     * @param {string} description - Function description
     */
    registerUserFunction(name, arity, implementation, description = '') {
        if (this.operatorTable.isFunction(name)) {
            throw new Error(`Function ${name} already exists`);
        }
        
        if (typeof implementation !== 'function') {
            throw new Error('Implementation must be a function');
        }
        
        this.userFunctions.set(name, {
            arity: arity,
            evaluate: implementation,
            description: description,
            isUserDefined: true
        });
    }

    /**
     * Get function information (built-in or user-defined)
     * @param {string} name - Function name
     * @returns {Object|null} Function info
     */
    getFunction(name) {
        // Check aliases first
        const actualName = this.functionAliases.get(name.toLowerCase()) || name.toLowerCase();
        
        // Check user functions
        if (this.userFunctions.has(actualName)) {
            return this.userFunctions.get(actualName);
        }
        
        // Check built-in functions
        return this.operatorTable.getFunction(actualName);
    }

    /**
     * Check if function exists
     * @param {string} name - Function name
     * @returns {boolean} True if function exists
     */
    hasFunction(name) {
        const actualName = this.functionAliases.get(name.toLowerCase()) || name.toLowerCase();
        return this.userFunctions.has(actualName) || this.operatorTable.isFunction(actualName);
    }

    /**
     * Remove a user-defined function
     * @param {string} name - Function name
     * @returns {boolean} True if removed
     */
    removeUserFunction(name) {
        return this.userFunctions.delete(name.toLowerCase());
    }

    /**
     * Get all available functions
     * @returns {Array} Array of function names
     */
    getAllFunctions() {
        const builtInFunctions = this.operatorTable.getAllFunctions();
        const userFunctions = Array.from(this.userFunctions.keys());
        const aliases = Array.from(this.functionAliases.keys());
        
        return [...builtInFunctions, ...userFunctions, ...aliases];
    }

    /**
     * Get functions by category
     * @param {string} category - Category name
     * @returns {Array} Array of function names in category
     */
    getFunctionsByCategory(category) {
        return this.functionCategories.get(category) || [];
    }

    /**
     * Get all categories
     * @returns {Array} Array of category names
     */
    getCategories() {
        return Array.from(this.functionCategories.keys());
    }

    /**
     * Get function documentation
     * @param {string} name - Function name
     * @returns {Object} Function documentation
     */
    getFunctionDocumentation(name) {
        const func = this.getFunction(name);
        if (!func) {
            return null;
        }
        
        return {
            name: name,
            arity: func.arity,
            description: func.description || 'No description available',
            isUserDefined: func.isUserDefined || false,
            category: this.getFunctionCategory(name)
        };
    }

    /**
     * Get the category of a function
     * @param {string} name - Function name
     * @returns {string|null} Category name
     */
    getFunctionCategory(name) {
        for (const [category, functions] of this.functionCategories) {
            if (functions.includes(name.toLowerCase())) {
                return category;
            }
        }
        return 'user-defined';
    }

    /**
     * Validate function call
     * @param {string} name - Function name
     * @param {Array} args - Function arguments
     * @returns {Object} Validation result
     */
    validateFunctionCall(name, args) {
        const func = this.getFunction(name);
        if (!func) {
            return {
                valid: false,
                error: `Unknown function: ${name}`
            };
        }
        
        if (func.arity === 'variadic') {
            if (args.length === 0) {
                return {
                    valid: false,
                    error: `Function ${name} requires at least one argument`
                };
            }
        } else {
            if (args.length !== func.arity) {
                return {
                    valid: false,
                    error: `Function ${name} requires ${func.arity} arguments, got ${args.length}`
                };
            }
        }
        
        return {
            valid: true,
            error: null
        };
    }

    /**
     * Create a function alias
     * @param {string} alias - Alias name
     * @param {string} original - Original function name
     */
    createAlias(alias, original) {
        if (this.functionAliases.has(alias.toLowerCase())) {
            throw new Error(`Alias ${alias} already exists`);
        }
        
        if (!this.hasFunction(original)) {
            throw new Error(`Original function ${original} does not exist`);
        }
        
        this.functionAliases.set(alias.toLowerCase(), original.toLowerCase());
    }

    /**
     * Remove a function alias
     * @param {string} alias - Alias name
     * @returns {boolean} True if removed
     */
    removeAlias(alias) {
        return this.functionAliases.delete(alias.toLowerCase());
    }

    /**
     * Get all aliases
     * @returns {Object} Map of aliases to original functions
     */
    getAllAliases() {
        return Object.fromEntries(this.functionAliases);
    }

    /**
     * Clear all user-defined functions
     */
    clearUserFunctions() {
        this.userFunctions.clear();
    }

    /**
     * Clear all aliases
     */
    clearAliases() {
        this.functionAliases.clear();
    }

    /**
     * Export user functions and aliases
     * @returns {Object} Exportable data
     */
    export() {
        return {
            userFunctions: Object.fromEntries(this.userFunctions),
            aliases: Object.fromEntries(this.functionAliases)
        };
    }

    /**
     * Import user functions and aliases
     * @param {Object} data - Importable data
     */
    import(data) {
        if (data.userFunctions) {
            for (const [name, func] of Object.entries(data.userFunctions)) {
                this.userFunctions.set(name, func);
            }
        }
        
        if (data.aliases) {
            for (const [alias, original] of Object.entries(data.aliases)) {
                this.functionAliases.set(alias, original);
            }
        }
    }

    /**
     * Get function usage statistics
     * @returns {Object} Usage statistics
     */
    getStatistics() {
        return {
            totalFunctions: this.getAllFunctions().length,
            builtInFunctions: this.operatorTable.getAllFunctions().length,
            userFunctions: this.userFunctions.size,
            aliases: this.functionAliases.size,
            categories: this.functionCategories.size
        };
    }

    /**
     * Search functions by name or description
     * @param {string} query - Search query
     * @returns {Array} Matching functions
     */
    searchFunctions(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const funcName of this.getAllFunctions()) {
            const func = this.getFunction(funcName);
            if (func && (
                funcName.toLowerCase().includes(lowerQuery) ||
                (func.description && func.description.toLowerCase().includes(lowerQuery))
            )) {
                results.push({
                    name: funcName,
                    description: func.description || 'No description',
                    category: this.getFunctionCategory(funcName)
                });
            }
        }
        
        return results;
    }
}

// Make available globally
window.FunctionRegistry = FunctionRegistry;
