/**
 * CSS/JS Minifier
 * Professional CSS and JavaScript minification tool with optimization features
 */

class CssJsMinifier {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
        this.cssOptimizations = {
            removeComments: true,
            removeWhitespace: true,
            removeEmptyRules: true,
            mergeSelectors: true,
            optimizeColors: true,
            optimizeShorthand: true,
            removeUnused: false
        };
        this.jsOptimizations = {
            removeComments: true,
            removeWhitespace: true,
            removeConsoleLogs: true,
            minifyIdentifiers: false,
            removeUnused: false,
            optimizeExpressions: true
        };
    }

    /**
     * Minify CSS
     */
    minifyCSS(css, options = {}) {
        try {
            if (!css) {
                throw new Error('CSS code is required');
            }

            const {
                removeComments = true,
                removeWhitespace = true,
                removeEmptyRules = true,
                mergeSelectors = true,
                optimizeColors = true,
                optimizeShorthand = true,
                removeUnused = false
            } = { ...this.cssOptimizations, ...options };

            let minified = css;

            // Remove comments
            if (removeComments) {
                minified = this.removeCSSComments(minified);
            }

            // Remove whitespace
            if (removeWhitespace) {
                minified = this.removeCSSWhitespace(minified);
            }

            // Remove empty rules
            if (removeEmptyRules) {
                minified = this.removeEmptyCSSRules(minified);
            }

            // Merge selectors
            if (mergeSelectors) {
                minified = this.mergeCSSSelectors(minified);
            }

            // Optimize colors
            if (optimizeColors) {
                minified = this.optimizeCSSColors(minified);
            }

            // Optimize shorthand properties
            if (optimizeShorthand) {
                minified = this.optimizeCSSShorthand(minified);
            }

            // Remove unused CSS (basic implementation)
            if (removeUnused) {
                minified = this.removeUnusedCSS(minified);
            }

            const originalSize = css.length;
            const minifiedSize = minified.length;
            const compressionRatio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

            this.addToHistory('minify', css, minified, 'css');
            return {
                success: true,
                minified: minified,
                originalSize: originalSize,
                minifiedSize: minifiedSize,
                compressionRatio: parseFloat(compressionRatio),
                type: 'css'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: css ? css.length : 0
            };
        }
    }

    /**
     * Minify JavaScript
     */
    minifyJS(js, options = {}) {
        try {
            if (!js) {
                throw new Error('JavaScript code is required');
            }

            const {
                removeComments = true,
                removeWhitespace = true,
                removeConsoleLogs = true,
                minifyIdentifiers = false,
                removeUnused = false,
                optimizeExpressions = true
            } = { ...this.jsOptimizations, ...options };

            let minified = js;

            // Remove comments
            if (removeComments) {
                minified = this.removeJSComments(minified);
            }

            // Remove console.log statements
            if (removeConsoleLogs) {
                minified = this.removeConsoleLogs(minified);
            }

            // Remove whitespace
            if (removeWhitespace) {
                minified = this.removeJSWhitespace(minified);
            }

            // Optimize expressions
            if (optimizeExpressions) {
                minified = this.optimizeJSExpressions(minified);
            }

            // Minify identifiers (basic implementation)
            if (minifyIdentifiers) {
                minified = this.minifyJSIdentifiers(minified);
            }

            // Remove unused variables (basic implementation)
            if (removeUnused) {
                minified = this.removeUnusedJS(minified);
            }

            const originalSize = js.length;
            const minifiedSize = minified.length;
            const compressionRatio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

            this.addToHistory('minify', js, minified, 'js');
            return {
                success: true,
                minified: minified,
                originalSize: originalSize,
                minifiedSize: minifiedSize,
                compressionRatio: parseFloat(compressionRatio),
                type: 'js'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                originalSize: js ? js.length : 0
            };
        }
    }

    /**
     * Beautify CSS
     */
    beautifyCSS(css, options = {}) {
        try {
            if (!css) {
                throw new Error('CSS code is required');
            }

            const {
                indentSize = 2,
                indentType = 'space',
                maxLineLength = 80,
                preserveComments = true
            } = options;

            let beautified = css;

            // Add line breaks after selectors
            beautified = beautified.replace(/\{/g, ' {\n');
            beautified = beautified.replace(/\}/g, '\n}\n');

            // Add line breaks after properties
            beautified = beautified.replace(/;/g, ';\n');

            // Indent properties
            const lines = beautified.split('\n');
            let indentLevel = 0;
            const indent = indentType === 'tab' ? '\t' : ' '.repeat(indentSize);

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.includes('{')) {
                    lines[i] = indent.repeat(indentLevel) + line;
                    indentLevel++;
                } else if (line.includes('}')) {
                    indentLevel--;
                    lines[i] = indent.repeat(indentLevel) + line;
                } else if (line && !line.includes('{') && !line.includes('}')) {
                    lines[i] = indent.repeat(indentLevel) + line;
                } else {
                    lines[i] = indent.repeat(indentLevel) + line;
                }
            }

            beautified = lines.join('\n');

            // Clean up extra whitespace
            beautified = beautified.replace(/\n\s*\n/g, '\n');
            beautified = beautified.trim();

            return {
                success: true,
                beautified: beautified,
                originalSize: css.length,
                beautifiedSize: beautified.length,
                type: 'css'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Beautify JavaScript
     */
    beautifyJS(js, options = {}) {
        try {
            if (!js) {
                throw new Error('JavaScript code is required');
            }

            const {
                indentSize = 2,
                indentType = 'space',
                maxLineLength = 80,
                preserveComments = true
            } = options;

            let beautified = js;

            // Add line breaks after semicolons
            beautified = beautified.replace(/;/g, ';\n');

            // Add line breaks after braces
            beautified = beautified.replace(/\{/g, ' {\n');
            beautified = beautified.replace(/\}/g, '\n}\n');

            // Add line breaks after commas in objects/arrays
            beautified = beautified.replace(/,/g, ',\n');

            // Indent code
            const lines = beautified.split('\n');
            let indentLevel = 0;
            const indent = indentType === 'tab' ? '\t' : ' '.repeat(indentSize);

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.includes('{') || line.includes('[')) {
                    lines[i] = indent.repeat(indentLevel) + line;
                    indentLevel++;
                } else if (line.includes('}') || line.includes(']')) {
                    indentLevel--;
                    lines[i] = indent.repeat(indentLevel) + line;
                } else {
                    lines[i] = indent.repeat(indentLevel) + line;
                }
            }

            beautified = lines.join('\n');

            // Clean up extra whitespace
            beautified = beautified.replace(/\n\s*\n/g, '\n');
            beautified = beautified.trim();

            return {
                success: true,
                beautified: beautified,
                originalSize: js.length,
                beautifiedSize: beautified.length,
                type: 'js'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validate CSS
     */
    validateCSS(css) {
        try {
            if (!css) {
                throw new Error('CSS code is required');
            }

            const errors = [];
            const warnings = [];

            // Check if HTML is being validated as CSS
            if (css.includes('<!DOCTYPE') || css.includes('<html') || css.includes('<head') || css.includes('<body')) {
                // Perform HTML validation instead
                const htmlErrors = this.validateHTML(css);
                errors.push('HTML code detected in CSS validator. HTML validation results:');
                errors.push(...htmlErrors);
                return {
                    success: true,
                    isValid: false,
                    errors: errors,
                    warnings: warnings,
                    type: 'css'
                };
            }

            // Check for basic syntax errors
            const openBraces = (css.match(/\{/g) || []).length;
            const closeBraces = (css.match(/\}/g) || []).length;

            if (openBraces !== closeBraces) {
                errors.push('Mismatched braces: ' + Math.abs(openBraces - closeBraces) + ' unclosed');
            }

            // Check for missing semicolons (more robust check)
            const lines = css.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                // Only check lines that look like CSS properties (contain :)
                if (line && line.includes(':') && !line.includes(';') && !line.includes('{') && !line.includes('}') && !line.includes('/*') && !line.includes('*/')) {
                    warnings.push('Missing semicolon on line ' + (i + 1) + ': ' + line);
                }
            }

            // Check for invalid properties
            const invalidProperties = this.findInvalidCSSProperties(css);
            if (invalidProperties.length > 0) {
                warnings.push('Potentially invalid properties: ' + invalidProperties.join(', '));
            }

            return {
                success: true,
                isValid: errors.length === 0,
                errors: errors,
                warnings: warnings,
                type: 'css'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validate JavaScript
     */
    validateJS(js) {
        try {
            if (!js) {
                throw new Error('JavaScript code is required');
            }

            const errors = [];
            const warnings = [];

            // Check if HTML is being validated as JavaScript
            if (js.includes('<!DOCTYPE') || js.includes('<html') || js.includes('<head') || js.includes('<body')) {
                // Perform HTML validation instead
                const htmlErrors = this.validateHTML(js);
                errors.push('HTML code detected in JavaScript validator. HTML validation results:');
                errors.push(...htmlErrors);
                return {
                    success: true,
                    isValid: false,
                    errors: errors,
                    warnings: warnings,
                    type: 'js'
                };
            }

            // Check for basic syntax errors
            const openBraces = (js.match(/\{/g) || []).length;
            const closeBraces = (js.match(/\}/g) || []).length;

            if (openBraces !== closeBraces) {
                errors.push('Mismatched braces: ' + Math.abs(openBraces - closeBraces) + ' unclosed');
            }

            const openParens = (js.match(/\(/g) || []).length;
            const closeParens = (js.match(/\)/g) || []).length;

            if (openParens !== closeParens) {
                errors.push('Mismatched parentheses: ' + Math.abs(openParens - closeParens) + ' unclosed');
            }

            // Check for common issues
            const consoleLogMatches = js.match(/console\.log/g);
            if (consoleLogMatches) {
                warnings.push('Console.log statements found (consider removing for production): ' + consoleLogMatches.length + ' occurrences');
            }

            const debuggerMatches = js.match(/debugger/g);
            if (debuggerMatches) {
                warnings.push('Debugger statements found (consider removing for production): ' + debuggerMatches.length + ' occurrences');
            }

            // Check for potential syntax issues
            if (js.includes('==') && !js.includes('===')) {
                warnings.push('Consider using strict equality (===) instead of loose equality (==)');
            }

            return {
                success: true,
                isValid: errors.length === 0,
                errors: errors,
                warnings: warnings,
                type: 'js'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get file statistics
     */
    getFileStats(code, type) {
        try {
            if (!code) {
                throw new Error('Code is required');
            }

            const lines = code.split('\n');
            const nonEmptyLines = lines.filter(line => line.trim().length > 0);
            const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));
            const blankLines = lines.filter(line => line.trim().length === 0);

            let functions = 0;
            let variables = 0;
            let classes = 0;

            if (type === 'js') {
                functions = (code.match(/function\s+\w+/g) || []).length;
                variables = (code.match(/var\s+|let\s+|const\s+/g) || []).length;
                classes = (code.match(/class\s+\w+/g) || []).length;
            } else if (type === 'css') {
                functions = (code.match(/@\w+/g) || []).length;
                variables = (code.match(/--\w+/g) || []).length;
                classes = (code.match(/\.\w+/g) || []).length;
            }

            return {
                success: true,
                stats: {
                    totalLines: lines.length,
                    nonEmptyLines: nonEmptyLines.length,
                    commentLines: commentLines.length,
                    blankLines: blankLines.length,
                    functions: functions,
                    variables: variables,
                    classes: classes,
                    fileSize: code.length,
                    averageLineLength: Math.round(code.length / lines.length)
                },
                type: type
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remove CSS comments
     */
    removeCSSComments(css) {
        return css.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    /**
     * Remove CSS whitespace
     */
    removeCSSWhitespace(css) {
        return css
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*,\s*/g, ',')
            .trim();
    }

    /**
     * Remove empty CSS rules
     */
    removeEmptyCSSRules(css) {
        return css.replace(/\{[^}]*\}/g, (match) => {
            const content = match.slice(1, -1).trim();
            return content ? match : '';
        });
    }

    /**
     * Merge CSS selectors
     */
    mergeCSSSelectors(css) {
        // Basic implementation - could be enhanced
        return css;
    }

    /**
     * Optimize CSS colors
     */
    optimizeCSSColors(css) {
        // Convert hex colors to shorter form
        css = css.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
        
        // Convert rgb to hex where possible
        css = css.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, (match, r, g, b) => {
            const hex = '#' + [r, g, b].map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
            return hex;
        });

        return css;
    }

    /**
     * Optimize CSS shorthand
     */
    optimizeCSSShorthand(css) {
        // Convert margin/padding to shorthand
        css = css.replace(/margin:\s*(\d+px)\s+(\d+px)\s+(\d+px)\s+(\d+px)/g, (match, top, right, bottom, left) => {
            if (top === right && right === bottom && bottom === left) {
                return `margin:${top}`;
            }
            return match;
        });

        return css;
    }

    /**
     * Remove unused CSS
     */
    removeUnusedCSS(css) {
        // Basic implementation - could be enhanced with DOM analysis
        return css;
    }

    /**
     * Remove JS comments
     */
    removeJSComments(js) {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '');
    }

    /**
     * Remove console.log statements
     */
    removeConsoleLogs(js) {
        return js.replace(/console\.log\([^)]*\);?/g, '');
    }

    /**
     * Remove JS whitespace
     */
    removeJSWhitespace(js) {
        return js
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .trim();
    }

    /**
     * Optimize JS expressions
     */
    optimizeJSExpressions(js) {
        // Basic optimizations
        js = js.replace(/\s*\+\s*/g, '+');
        js = js.replace(/\s*-\s*/g, '-');
        js = js.replace(/\s*\*\s*/g, '*');
        js = js.replace(/\s*\/\s*/g, '/');
        js = js.replace(/\s*=\s*/g, '=');
        js = js.replace(/\s*==\s*/g, '==');
        js = js.replace(/\s*===\s*/g, '===');
        
        return js;
    }

    /**
     * Minify JS identifiers
     */
    minifyJSIdentifiers(js) {
        // Basic implementation - could be enhanced
        return js;
    }

    /**
     * Remove unused JS
     */
    removeUnusedJS(js) {
        // Basic implementation - could be enhanced
        return js;
    }

    /**
     * Find invalid CSS properties
     */
    findInvalidCSSProperties(css) {
        const validProperties = [
            'color', 'background', 'margin', 'padding', 'border', 'width', 'height',
            'display', 'position', 'top', 'left', 'right', 'bottom', 'z-index',
            'font-size', 'font-family', 'font-weight', 'text-align', 'line-height'
        ];

        const properties = css.match(/\w+:/g) || [];
        const invalid = properties.filter(prop => {
            const propName = prop.replace(':', '');
            return !validProperties.includes(propName);
        });

        return invalid.map(prop => prop.replace(':', ''));
    }

    /**
     * Add to history
     */
    addToHistory(action, input, output, type) {
        const entry = {
            timestamp: new Date().toISOString(),
            action,
            input: typeof input === 'string' ? input.substring(0, 100) + (input.length > 100 ? '...' : '') : input,
            output: typeof output === 'string' ? output.substring(0, 100) + (output.length > 100 ? '...' : '') : output,
            type
        };
        
        this.history.unshift(entry);
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
    }

    /**
     * Validate HTML syntax
     */
    validateHTML(html) {
        const errors = [];
        const lines = html.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            // Check for unclosed tags
            if (line.includes('<') && !line.includes('>')) {
                errors.push(`Line ${lineNum}: Unclosed tag - missing '>'`);
            }
            
            // Check for malformed tags
            if (line.includes('<') && line.includes('>')) {
                const tagMatch = line.match(/<([^>]+)>/g);
                if (tagMatch) {
                    tagMatch.forEach(tag => {
                        if (tag.includes('<') && tag.includes('>') && !tag.match(/^<[^<>]+>$/)) {
                            errors.push(`Line ${lineNum}: Malformed tag: ${tag}`);
                        }
                    });
                }
            }
            
            // Check for missing closing tags (basic check)
            if (line.match(/<[^/][^>]*>/) && !line.match(/<\/[^>]*>/)) {
                const tagName = line.match(/<([^>\s]+)/);
                if (tagName && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName[1].toLowerCase())) {
                    // This is a basic check - in a real validator, you'd need a stack
                    if (!line.includes('</' + tagName[1] + '>')) {
                        errors.push(`Line ${lineNum}: Possible missing closing tag for <${tagName[1]}>`);
                    }
                }
            }
        }
        
        return errors;
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
