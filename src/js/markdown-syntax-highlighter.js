/**
 * Syntax Highlighter for Markdown Code Blocks
 * Part of Advanced Markdown Preview system
 */

/**
 * Syntax Highlighter - Adds syntax highlighting to code blocks
 */
class SyntaxHighlighter {
    constructor() {
        this.languagePatterns = this.loadLanguagePatterns();
        this.cssClasses = {
            keyword: 'hljs-keyword',
            string: 'hljs-string', 
            comment: 'hljs-comment',
            number: 'hljs-number',
            operator: 'hljs-operator',
            function: 'hljs-function',
            variable: 'hljs-variable',
            tag: 'hljs-tag',
            attribute: 'hljs-attribute'
        };
    }

    highlight(code, language) {
        if (!language || !this.languagePatterns[language]) {
            return this.escapeHtml(code);
        }
        
        const patterns = this.languagePatterns[language];
        let highlightedCode = this.escapeHtml(code);
        
        // Apply highlighting patterns in order of precedence
        for (const [patternType, patternData] of Object.entries(patterns)) {
            highlightedCode = this.applyPattern(
                highlightedCode, 
                patternData, 
                this.cssClasses[patternType] || patternType
            );
        }
        
        return highlightedCode;
    }

    loadLanguagePatterns() {
        return {
            javascript: {
                keyword: {
                    pattern: /\b(function|var|let|const|if|else|for|while|return|class|extends|import|export|async|await|try|catch|finally|new|this|super|typeof|instanceof|in|of|break|continue|switch|case|default|throw|with|debugger)\b/g
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
                },
                comment: {
                    pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
                },
                number: {
                    pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g
                },
                function: {
                    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g
                }
            },
            python: {
                keyword: {
                    pattern: /\b(def|class|if|elif|else|for|while|import|from|return|yield|try|except|finally|with|as|lambda|and|or|not|in|is|True|False|None|break|continue|pass|raise|global|nonlocal)\b/g
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1|"""[\s\S]*?"""|'''[\s\S]*?'''/g
                },
                comment: {
                    pattern: /#.*$/gm
                },
                function: {
                    pattern: /def\s+([a-zA-Z_][a-zA-Z0-9_]*)/g
                },
                number: {
                    pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g
                }
            },
            html: {
                tag: {
                    pattern: /<\/?[a-zA-Z][^>]*>/g
                },
                attribute: {
                    pattern: /\s([a-zA-Z-]+)=(["'`])[^"'`]*\2/g
                },
                comment: {
                    pattern: /<!--[\s\S]*?-->/g
                }
            },
            css: {
                selector: {
                    pattern: /([^{}]+)(?=\s*\{)/g
                },
                property: {
                    pattern: /([a-zA-Z-]+)\s*:/g
                },
                value: {
                    pattern: /:\s*([^;]+);/g
                },
                comment: {
                    pattern: /\/\*[\s\S]*?\*\//g
                }
            },
            json: {
                key: {
                    pattern: /"([^"]+)"\s*:/g
                },
                string: {
                    pattern: /"([^"]*)"/g
                },
                number: {
                    pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g
                },
                boolean: {
                    pattern: /\b(true|false|null)\b/g
                }
            },
            sql: {
                keyword: {
                    pattern: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|VIEW|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|DISTINCT|AS|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL)\b/gi
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
                },
                number: {
                    pattern: /\b\d+(?:\.\d+)?\b/g
                },
                comment: {
                    pattern: /(--.*$|\/\*[\s\S]*?\*\/)/gm
                }
            },
            bash: {
                keyword: {
                    pattern: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|break|continue|exit|echo|printf|read|cd|ls|pwd|mkdir|rmdir|rm|cp|mv|chmod|chown|grep|sed|awk|sort|uniq|head|tail|cat|less|more|find|grep|ps|kill|jobs|bg|fg|nohup|alias|export|source|exec|eval)\b/g
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
                },
                comment: {
                    pattern: /#.*$/gm
                },
                variable: {
                    pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g
                }
            },
            java: {
                keyword: {
                    pattern: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super|import|package|synchronized|volatile|transient|native|strictfp)\b/g
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
                },
                comment: {
                    pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
                },
                number: {
                    pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?\b/g
                },
                function: {
                    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g
                }
            },
            cpp: {
                keyword: {
                    pattern: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|class|public|private|protected|virtual|friend|inline|new|delete|this|operator|template|namespace|using|try|catch|throw)\b/g
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
                },
                comment: {
                    pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
                },
                number: {
                    pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?\b/g
                },
                function: {
                    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g
                }
            },
            php: {
                keyword: {
                    pattern: /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/g
                },
                string: {
                    pattern: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g
                },
                comment: {
                    pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm
                },
                variable: {
                    pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g
                },
                function: {
                    pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g
                }
            }
        };
    }

    applyPattern(code, patternData, cssClass) {
        const pattern = patternData.pattern;
        
        return code.replace(pattern, (match) => {
            return `<span class="${cssClass}">${match}</span>`;
        });
    }

    escapeHtml(text) {
        const replacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        
        let result = String(text);
        for (const [char, escape] of Object.entries(replacements)) {
            result = result.replace(new RegExp(char, 'g'), escape);
        }
        
        return result;
    }

    getSupportedLanguages() {
        return Object.keys(this.languagePatterns);
    }

    addLanguageSupport(language, patterns) {
        this.languagePatterns[language] = patterns;
    }
}

// Export the SyntaxHighlighter class
export { SyntaxHighlighter };
