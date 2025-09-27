/**
 * XML Formatter & Validator
 * Professional XML formatting, validation, and conversion tool
 */

class XmlFormatter {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
    }

    /**
     * Format XML with proper indentation
     */
    formatXml(xmlString, options = {}) {
        try {
            const {
                indentSize = 2,
                indentChar = ' ',
                preserveWhitespace = false,
                sortAttributes = false,
                collapseEmptyElements = false
            } = options;

            // Clean up the XML first
            let cleanedXml = this.cleanXml(xmlString);
            
            // Parse and format
            const formatted = this.prettyPrintXml(cleanedXml, {
                indentSize,
                indentChar,
                preserveWhitespace,
                sortAttributes,
                collapseEmptyElements
            });

            this.addToHistory('format', xmlString, formatted);
            return {
                success: true,
                formatted: formatted,
                originalSize: xmlString.length,
                formattedSize: formatted.length,
                compressionRatio: ((xmlString.length - formatted.length) / xmlString.length * 100).toFixed(1)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: xmlString.length
            };
        }
    }

    /**
     * Validate XML syntax
     */
    validateXml(xmlString) {
        try {
            // Basic XML structure validation
            const validation = this.performXmlValidation(xmlString);
            
            if (validation.isValid) {
                this.addToHistory('validate', xmlString, 'Valid XML');
                return {
                    success: true,
                    isValid: true,
                    message: 'Valid XML structure',
                    size: xmlString.length,
                    elementCount: validation.elementCount,
                    attributeCount: validation.attributeCount,
                    depth: validation.maxDepth
                };
            } else {
                return {
                    success: false,
                    isValid: false,
                    error: validation.error,
                    line: validation.line,
                    column: validation.column,
                    size: xmlString.length
                };
            }
        } catch (error) {
            return {
                success: false,
                isValid: false,
                error: error.message,
                size: xmlString.length
            };
        }
    }

    /**
     * Minify XML (remove unnecessary whitespace)
     */
    minifyXml(xmlString, options = {}) {
        try {
            const {
                removeComments = true,
                removeEmptyLines = true,
                collapseWhitespace = true,
                removeUnnecessarySpaces = true
            } = options;

            let minified = xmlString;

            if (removeComments) {
                minified = minified.replace(/<!--[\s\S]*?-->/g, '');
            }

            if (removeEmptyLines) {
                minified = minified.replace(/^\s*[\r\n]/gm, '');
            }

            if (collapseWhitespace) {
                minified = minified.replace(/>\s+</g, '><');
                minified = minified.replace(/>\s+/g, '>');
                minified = minified.replace(/\s+</g, '<');
            }

            if (removeUnnecessarySpaces) {
                minified = minified.replace(/\s+/g, ' ').trim();
            }

            this.addToHistory('minify', xmlString, minified);
            return {
                success: true,
                minified: minified,
                originalSize: xmlString.length,
                minifiedSize: minified.length,
                compressionRatio: ((xmlString.length - minified.length) / xmlString.length * 100).toFixed(1)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: xmlString.length
            };
        }
    }

    /**
     * Convert XML to other formats
     */
    convertXml(xmlString, targetFormat) {
        try {
            let converted = '';
            const size = xmlString.length;

            switch (targetFormat.toLowerCase()) {
                case 'json':
                    converted = this.xmlToJson(xmlString);
                    break;
                case 'yaml':
                    converted = this.xmlToYaml(xmlString);
                    break;
                case 'csv':
                    converted = this.xmlToCsv(xmlString);
                    break;
                case 'html':
                    converted = this.xmlToHtml(xmlString);
                    break;
                case 'sql':
                    converted = this.xmlToSql(xmlString);
                    break;
                default:
                    throw new Error(`Unsupported format: ${targetFormat}`);
            }

            this.addToHistory('convert', xmlString, converted, targetFormat);
            return {
                success: true,
                converted: converted,
                originalSize: size,
                convertedSize: converted.length,
                format: targetFormat
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: xmlString.length
            };
        }
    }

    /**
     * Get XML structure analysis
     */
    getXmlStructure(xmlString) {
        try {
            const structure = this.analyzeXmlStructure(xmlString);
            return {
                success: true,
                structure: structure,
                size: xmlString.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                size: xmlString.length
            };
        }
    }

    /**
     * Clean XML string
     */
    cleanXml(xmlString) {
        return xmlString
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .trim();
    }

    /**
     * Pretty print XML with indentation
     */
    prettyPrintXml(xmlString, options) {
        const { indentSize, indentChar, preserveWhitespace, sortAttributes, collapseEmptyElements } = options;
        
        // Simple XML pretty printing
        let formatted = xmlString;
        let indentLevel = 0;
        const indent = indentChar.repeat(indentSize);
        
        // Add line breaks and indentation
        formatted = formatted
            .replace(/></g, '>\n<')
            .split('\n')
            .map(line => {
                const trimmed = line.trim();
                if (!trimmed) return '';
                
                if (trimmed.startsWith('</')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                
                const indented = indent.repeat(indentLevel) + trimmed;
                
                if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                    indentLevel++;
                }
                
                return indented;
            })
            .join('\n');
        
        return formatted;
    }

    /**
     * Perform XML validation
     */
    performXmlValidation(xmlString) {
        // Enhanced XML validation
        const errors = [];
        let elementCount = 0;
        let attributeCount = 0;
        let maxDepth = 0;
        let currentDepth = 0;
        let line = 1;
        let column = 1;

        // Check for XML declaration
        if (!xmlString.trim().startsWith('<?xml')) {
            // Add default XML declaration if missing
            xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlString;
        }

        // Check for root element
        const rootMatch = xmlString.match(/<([^\/\s>]+)[^>]*>/);
        if (!rootMatch) {
            return {
                isValid: false,
                error: 'No root element found',
                line: 1,
                column: 1
            };
        }

        // Enhanced syntax validation - focus on actual errors
        const lines = xmlString.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i + 1;
            
            // Check for unclosed tags (missing >) - this is the main error we want to catch
            if (line.trim().startsWith('<') && !line.trim().endsWith('>') && !line.trim().endsWith('/>')) {
                // Skip XML declarations, CDATA, and comments
                if (!line.trim().startsWith('<?') && 
                    !line.trim().startsWith('<!') && 
                    !line.trim().startsWith('<!--')) {
                    return {
                        isValid: false,
                        error: `Malformed tag - missing closing '>'`,
                        line: lineNumber,
                        column: line.length
                    };
                }
            }
            
            // Check for mismatched quotes in attributes
            const attrQuoteMatch = line.match(/=\s*"[^"]*$/);
            if (attrQuoteMatch) {
                return {
                    isValid: false,
                    error: `Unclosed attribute value - missing closing quote`,
                    line: lineNumber,
                    column: line.length
                };
            }
            
            // Check for nested tags (invalid)
            const nestedTagMatch = line.match(/<[^>]*<[^>]*>/);
            if (nestedTagMatch) {
                return {
                    isValid: false,
                    error: `Invalid character in tag name - found nested '<' inside tag`,
                    line: lineNumber,
                    column: line.indexOf('<') + 1
                };
            }
        }

        // Count elements and attributes
        const elementMatches = xmlString.match(/<[^\/][^>]*>/g);
        if (elementMatches) {
            elementCount = elementMatches.length;
            elementMatches.forEach(match => {
                const attrMatches = match.match(/\s+[a-zA-Z][a-zA-Z0-9]*\s*=/g);
                if (attrMatches) {
                    attributeCount += attrMatches.length;
                }
            });
        }

        // Calculate depth
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else if (trimmed.startsWith('</')) {
                currentDepth--;
            }
        });

        return {
            isValid: true,
            elementCount,
            attributeCount,
            maxDepth
        };
    }

    /**
     * Convert XML to JSON
     */
    xmlToJson(xmlString) {
        // Simple XML to JSON conversion
        const json = this.parseXmlToObject(xmlString);
        return JSON.stringify(json, null, 2);
    }

    /**
     * Convert XML to YAML
     */
    xmlToYaml(xmlString) {
        const obj = this.parseXmlToObject(xmlString);
        return this.objectToYaml(obj);
    }

    /**
     * Convert XML to CSV
     */
    xmlToCsv(xmlString) {
        // Simple XML to CSV conversion for tabular data
        const lines = xmlString.split('\n');
        const csvLines = [];
        
        // Find all data rows
        const dataRows = lines.filter(line => 
            line.trim().startsWith('<') && 
            !line.trim().startsWith('</') && 
            !line.trim().startsWith('<?')
        );
        
        if (dataRows.length > 0) {
            // Extract headers from first row
            const firstRow = dataRows[0];
            const headers = firstRow.match(/<([^>]+)>/g);
            if (headers) {
                const headerNames = headers.map(h => h.replace(/<|>/g, ''));
                csvLines.push(headerNames.join(','));
                
                // Extract data
                dataRows.forEach(row => {
                    const values = row.match(/>([^<]+)</g);
                    if (values) {
                        const cleanValues = values.map(v => v.replace(/>|</g, '').replace(/,/g, ';'));
                        csvLines.push(cleanValues.join(','));
                    }
                });
            }
        }
        
        return csvLines.join('\n');
    }

    /**
     * Convert XML to HTML
     */
    xmlToHtml(xmlString) {
        // Convert XML to HTML table format
        return `<table border="1">
<tr><th>XML Content</th></tr>
<tr><td><pre>${xmlString.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></td></tr>
</table>`;
    }

    /**
     * Convert XML to SQL
     */
    xmlToSql(xmlString) {
        // Convert XML to SQL INSERT statements
        const obj = this.parseXmlToObject(xmlString);
        const tableName = 'xml_data';
        
        let sql = `-- Generated SQL from XML\n`;
        sql += `CREATE TABLE ${tableName} (id INT PRIMARY KEY, data TEXT);\n\n`;
        sql += `INSERT INTO ${tableName} (id, data) VALUES (1, '${xmlString.replace(/'/g, "''")}');\n`;
        
        return sql;
    }

    /**
     * Parse XML to JavaScript object
     */
    parseXmlToObject(xmlString) {
        // Simple XML parsing
        const result = {};
        const lines = xmlString.split('\n');
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?')) {
                const tagMatch = trimmed.match(/<([^\/\s>]+)/);
                if (tagMatch) {
                    const tagName = tagMatch[1];
                    const contentMatch = trimmed.match(/>([^<]+)</);
                    if (contentMatch) {
                        result[tagName] = contentMatch[1].trim();
                    }
                }
            }
        });
        
        return result;
    }

    /**
     * Convert object to YAML
     */
    objectToYaml(obj, indent = 0) {
        let yaml = '';
        const spaces = '  '.repeat(indent);
        
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
                yaml += `${spaces}${key}:\n`;
                yaml += this.objectToYaml(value, indent + 1);
            } else {
                yaml += `${spaces}${key}: ${value}\n`;
            }
        });
        
        return yaml;
    }

    /**
     * Analyze XML structure
     */
    analyzeXmlStructure(xmlString) {
        const structure = {
            elements: [],
            attributes: [],
            depth: 0,
            hasDeclaration: false,
            hasRoot: false,
            hasComments: false,
            hasCDATA: false
        };

        // Check for XML declaration
        structure.hasDeclaration = xmlString.includes('<?xml');
        
        // Check for root element
        const rootMatch = xmlString.match(/<([^\/\s>]+)[^>]*>/);
        structure.hasRoot = !!rootMatch;
        
        // Check for comments
        structure.hasComments = xmlString.includes('<!--');
        
        // Check for CDATA
        structure.hasCDATA = xmlString.includes('<![CDATA[');
        
        // Extract elements
        const elementMatches = xmlString.match(/<([^\/\s>]+)[^>]*>/g);
        if (elementMatches) {
            elementMatches.forEach(match => {
                const tagMatch = match.match(/<([^\/\s>]+)/);
                if (tagMatch) {
                    structure.elements.push(tagMatch[1]);
                }
            });
        }
        
        // Extract attributes
        const attrMatches = xmlString.match(/\s+([a-zA-Z][a-zA-Z0-9]*)\s*=/g);
        if (attrMatches) {
            attrMatches.forEach(match => {
                const attrName = match.match(/([a-zA-Z][a-zA-Z0-9]*)/)[1];
                structure.attributes.push(attrName);
            });
        }
        
        return structure;
    }

    /**
     * Add to history
     */
    addToHistory(action, input, output, format = null) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
            format
        };
        
        this.history.unshift(entry);
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
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
