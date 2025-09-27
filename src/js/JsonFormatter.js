/**
 * Advanced JSON Formatter & Validator
 * Format, validate, minify, and convert JSON data
 */

class JsonFormatter {
    constructor() {
        this.history = [];
    }

    /**
     * Format JSON with proper indentation
     */
    formatJson(jsonString, indentSize = 2) {
        try {
            const parsed = JSON.parse(jsonString);
            return {
                success: true,
                formatted: JSON.stringify(parsed, null, indentSize),
                original: jsonString,
                size: {
                    original: jsonString.length,
                    formatted: JSON.stringify(parsed, null, indentSize).length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                original: jsonString
            };
        }
    }

    /**
     * Validate JSON syntax
     */
    validateJson(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            return {
                success: true,
                valid: true,
                parsed: parsed,
                size: jsonString.length,
                structure: this.analyzeStructure(parsed)
            };
        } catch (error) {
            return {
                success: false,
                valid: false,
                error: error.message,
                line: this.getErrorLine(jsonString, error.message),
                size: jsonString.length
            };
        }
    }

    /**
     * Minify JSON by removing whitespace
     */
    minifyJson(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            const minified = JSON.stringify(parsed);
            return {
                success: true,
                minified: minified,
                original: jsonString,
                size: {
                    original: jsonString.length,
                    minified: minified.length,
                    saved: jsonString.length - minified.length,
                    compression: ((jsonString.length - minified.length) / jsonString.length * 100).toFixed(1)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                original: jsonString
            };
        }
    }

    /**
     * Convert JSON to other formats
     */
    convertJson(jsonString, targetFormat) {
        try {
            const parsed = JSON.parse(jsonString);
            
            switch (targetFormat.toLowerCase()) {
                case 'yaml':
                    return this.jsonToYaml(parsed);
                case 'xml':
                    return this.jsonToXml(parsed);
                case 'csv':
                    return this.jsonToCsv(parsed);
                case 'php':
                    return this.jsonToPhp(parsed);
                case 'python':
                    return this.jsonToPython(parsed);
                default:
                    return {
                        success: false,
                        error: 'Unsupported format: ' + targetFormat
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Convert JSON to YAML
     */
    jsonToYaml(obj, indent = 0) {
        let yaml = '';
        const spaces = '  '.repeat(indent);
        
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    yaml += spaces + '- ' + this.jsonToYaml(item, indent + 1);
                } else {
                    yaml += spaces + '- ' + this.formatValue(item) + '\n';
                }
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    yaml += spaces + key + ':\n' + this.jsonToYaml(value, indent + 1);
                } else {
                    yaml += spaces + key + ': ' + this.formatValue(value) + '\n';
                }
            });
        }
        
        return {
            success: true,
            converted: yaml,
            format: 'YAML'
        };
    }

    /**
     * Convert JSON to XML
     */
    jsonToXml(obj, rootName = 'root') {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
        xml += this.objectToXml(obj, 1);
        xml += `</${rootName}>`;
        
        return {
            success: true,
            converted: xml,
            format: 'XML'
        };
    }

    /**
     * Convert object to XML recursively
     */
    objectToXml(obj, indent = 0) {
        const spaces = '  '.repeat(indent);
        let xml = '';
        
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    xml += spaces + `<item index="${index}">\n`;
                    xml += this.objectToXml(item, indent + 1);
                    xml += spaces + `</item>\n`;
                } else {
                    xml += spaces + `<item index="${index}">${this.escapeXml(this.formatValue(item))}</item>\n`;
                }
            });
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
                if (typeof value === 'object' && value !== null) {
                    xml += spaces + `<${safeKey}>\n`;
                    xml += this.objectToXml(value, indent + 1);
                    xml += spaces + `</${safeKey}>\n`;
                } else {
                    xml += spaces + `<${safeKey}>${this.escapeXml(this.formatValue(value))}</${safeKey}>\n`;
                }
            });
        }
        
        return xml;
    }

    /**
     * Convert JSON to CSV
     */
    jsonToCsv(obj) {
        if (!Array.isArray(obj)) {
            return {
                success: false,
                error: 'CSV conversion requires an array of objects'
            };
        }
        
        if (obj.length === 0) {
            return {
                success: true,
                converted: '',
                format: 'CSV'
            };
        }
        
        const headers = Object.keys(obj[0]);
        let csv = headers.join(',') + '\n';
        
        obj.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csv += values.join(',') + '\n';
        });
        
        return {
            success: true,
            converted: csv,
            format: 'CSV'
        };
    }

    /**
     * Convert JSON to PHP array
     */
    jsonToPhp(obj) {
        return {
            success: true,
            converted: '<?php\n$data = ' + this.objectToPhp(obj) + ';\n?>',
            format: 'PHP'
        };
    }

    /**
     * Convert object to PHP array recursively
     */
    objectToPhp(obj) {
        if (Array.isArray(obj)) {
            const items = obj.map(item => this.objectToPhp(item));
            return '[' + items.join(', ') + ']';
        } else if (typeof obj === 'object' && obj !== null) {
            const pairs = Object.entries(obj).map(([key, value]) => {
                const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `'${key}'`;
                return `${safeKey} => ${this.objectToPhp(value)}`;
            });
            return '[' + pairs.join(', ') + ']';
        } else {
            return this.formatValue(obj);
        }
    }

    /**
     * Convert JSON to Python dictionary
     */
    jsonToPython(obj) {
        return {
            success: true,
            converted: 'data = ' + this.objectToPython(obj),
            format: 'Python'
        };
    }

    /**
     * Convert object to Python dictionary recursively
     */
    objectToPython(obj) {
        if (Array.isArray(obj)) {
            const items = obj.map(item => this.objectToPython(item));
            return '[' + items.join(', ') + ']';
        } else if (typeof obj === 'object' && obj !== null) {
            const pairs = Object.entries(obj).map(([key, value]) => {
                const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `'${key}'`;
                return `${safeKey}: ${this.objectToPython(value)}`;
            });
            return '{' + pairs.join(', ') + '}';
        } else {
            return this.formatValue(obj);
        }
    }

    /**
     * Analyze JSON structure
     */
    analyzeStructure(obj) {
        const analysis = {
            type: Array.isArray(obj) ? 'array' : typeof obj,
            size: Array.isArray(obj) ? obj.length : Object.keys(obj).length,
            depth: this.getDepth(obj),
            keys: Array.isArray(obj) ? [] : Object.keys(obj),
            hasNested: this.hasNestedObjects(obj)
        };
        
        return analysis;
    }

    /**
     * Get object depth
     */
    getDepth(obj, currentDepth = 0) {
        if (typeof obj !== 'object' || obj === null) {
            return currentDepth;
        }
        
        if (Array.isArray(obj)) {
            return Math.max(...obj.map(item => this.getDepth(item, currentDepth + 1)));
        } else {
            const depths = Object.values(obj).map(value => this.getDepth(value, currentDepth + 1));
            return depths.length > 0 ? Math.max(...depths) : currentDepth;
        }
    }

    /**
     * Check if object has nested objects
     */
    hasNestedObjects(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        
        if (Array.isArray(obj)) {
            return obj.some(item => typeof item === 'object' && item !== null);
        } else {
            return Object.values(obj).some(value => typeof value === 'object' && value !== null);
        }
    }

    /**
     * Get error line number
     */
    getErrorLine(jsonString, errorMessage) {
        // Try to extract position from error message
        const positionMatch = errorMessage.match(/position (\d+)/);
        if (positionMatch) {
            const position = parseInt(positionMatch[1]);
            return jsonString.substring(0, position).split('\n').length;
        }
        
        // Try to extract line number directly
        const lineMatch = errorMessage.match(/line (\d+)/);
        if (lineMatch) {
            return parseInt(lineMatch[1]);
        }
        
        // Enhanced error detection for specific error types
        const lines = jsonString.split('\n');
        
        // Check for unterminated strings
        if (errorMessage.includes('Unterminated string')) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Look for lines that start a string but don't end it
                if (line.includes('"') && !this.isStringProperlyClosed(line)) {
                    return i + 1;
                }
            }
        }
        
        // Check for missing commas
        if (errorMessage.includes('Unexpected token') || errorMessage.includes('Expected')) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Look for lines that might be missing commas
                if (line.trim().endsWith('"') && i < lines.length - 1) {
                    const nextLine = lines[i + 1];
                    if (nextLine.trim().startsWith('"') && !line.includes(',')) {
                        return i + 1;
                    }
                }
            }
        }
        
        // Check for trailing commas
        if (errorMessage.includes('Unexpected token') && errorMessage.includes('}')) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim().endsWith(',') && (line.includes('}') || line.includes(']'))) {
                    return i + 1;
                }
            }
        }
        
        // Check for unquoted property names
        if (errorMessage.includes('Unexpected token')) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.match(/^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:/) && !line.match(/^\s*"[^"]*"\s*:/)) {
                    return i + 1;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Check if a string is properly closed on a line
     */
    isStringProperlyClosed(line) {
        let inString = false;
        let escaped = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (escaped) {
                escaped = false;
                continue;
            }
            
            if (char === '\\') {
                escaped = true;
                continue;
            }
            
            if (char === '"') {
                inString = !inString;
            }
        }
        
        return !inString; // String is properly closed if not in string
    }

    /**
     * Format value for output
     */
    formatValue(value) {
        if (typeof value === 'string') {
            return `"${value}"`;
        } else if (typeof value === 'number') {
            return value.toString();
        } else if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        } else if (value === null) {
            return 'null';
        } else {
            return String(value);
        }
    }

    /**
     * Escape XML special characters
     */
    escapeXml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Add to history
     */
    addToHistory(operation) {
        this.history.unshift({
            ...operation,
            timestamp: new Date()
        });
        
        // Keep only last 20 operations
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JsonFormatter;
}
