/**
 * Advanced Markdown Preview
 * Comprehensive markdown parsing and rendering with syntax highlighting
 */

/**
 * Markdown Lexer/Tokenizer - Breaks markdown text into tokens
 */
class MarkdownLexer {
    constructor() {
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.text = '';
        this.currentChar = null;
    }

    tokenize(markdownText) {
        this.resetState(markdownText);
        
        while (!this.isAtEnd()) {
            const startPosition = { line: this.line, column: this.column, position: this.position };
            
            // Block-level elements (must be at start of line)
            if (this.isAtLineStart()) {
                if (this.checkHeading()) {
                    this.tokenizeHeading(startPosition);
                } else if (this.checkCodeBlock()) {
                    this.tokenizeCodeBlock(startPosition);
                } else if (this.checkBlockquote()) {
                    this.tokenizeBlockquote(startPosition);
                } else if (this.checkList()) {
                    this.tokenizeList(startPosition);
                } else if (this.checkHorizontalRule()) {
                    this.tokenizeHorizontalRule(startPosition);
                } else if (this.checkHtmlBlock()) {
                    this.tokenizeHtmlBlock(startPosition);
                } else {
                    this.tokenizeParagraph(startPosition);
                }
            } else {
                // Inline elements
                this.tokenizeInlineContent(startPosition);
            }
        }
        
        return this.tokens;
    }

    resetState(text) {
        this.text = text;
        this.tokens = [];
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.currentChar = text.length > 0 ? text[0] : null;
    }

    isAtEnd() {
        return this.position >= this.text.length;
    }

    isAtLineStart() {
        return this.column === 1 || this.text[this.position - 1] === '\n';
    }

    advance() {
        if (this.currentChar === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        
        this.position++;
        this.currentChar = this.position < this.text.length ? this.text[this.position] : null;
    }

    peek(offset = 0) {
        const pos = this.position + offset;
        return pos < this.text.length ? this.text[pos] : null;
    }

    consumeUntil(char) {
        let result = '';
        while (!this.isAtEnd() && this.currentChar !== char) {
            result += this.currentChar;
            this.advance();
        }
        return result;
    }

    consumeLine() {
        return this.consumeUntil('\n');
    }

    getRawText(startPos) {
        return this.text.substring(startPos.position, this.position);
    }

    addToken(type, data, position) {
        this.tokens.push({
            type,
            data,
            position
        });
    }

    // Block element checks
    checkHeading() {
        return this.currentChar === '#' || this.checkSetextHeading();
    }

    checkCodeBlock() {
        return this.currentChar === '`' || this.currentChar === '~' || this.checkIndentedCodeBlock();
    }

    checkBlockquote() {
        return this.currentChar === '>';
    }

    checkList() {
        return this.checkUnorderedList() || this.checkOrderedList();
    }

    checkHorizontalRule() {
        const char = this.currentChar;
        if (char === '-' || char === '*' || char === '_') {
            let count = 0;
            let pos = this.position;
            while (pos < this.text.length && this.text[pos] === char) {
                count++;
                pos++;
            }
            return count >= 3;
        }
        return false;
    }

    checkHtmlBlock() {
        return this.currentChar === '<';
    }

    checkUnorderedList() {
        const char = this.currentChar;
        if (char === '-' || char === '*' || char === '+') {
            const nextChar = this.peek(1);
            return nextChar === ' ' || nextChar === '\t';
        }
        return false;
    }

    checkOrderedList() {
        if (/\d/.test(this.currentChar)) {
            let pos = this.position;
            while (pos < this.text.length && /\d/.test(this.text[pos])) {
                pos++;
            }
            const nextChar = this.text[pos];
            return nextChar === '.' || nextChar === ')';
        }
        return false;
    }

    checkIndentedCodeBlock() {
        return this.currentChar === ' ' || this.currentChar === '\t';
    }

    checkSetextHeading() {
        // Check if current line is followed by === or ---
        const lineEnd = this.text.indexOf('\n', this.position);
        if (lineEnd === -1) return false;
        
        const nextLineStart = lineEnd + 1;
        if (nextLineStart >= this.text.length) return false;
        
        const nextLine = this.text.substring(nextLineStart, this.text.indexOf('\n', nextLineStart));
        return /^[=-]{3,}$/.test(nextLine.trim());
    }

    // Tokenization methods
    tokenizeHeading(startPos) {
        if (this.currentChar === '#') {
            // ATX heading
            let level = 0;
            while (this.currentChar === '#' && level < 6) {
                level++;
                this.advance();
            }
            
            // Skip optional space
            if (this.currentChar === ' ') {
                this.advance();
            }
            
            // Collect heading text until end of line
            const headingText = this.consumeUntil('\n');
            
            this.addToken('HEADING', {
                level,
                text: headingText.trim(),
                raw: this.getRawText(startPos)
            }, startPos);
            
            this.advance(); // Skip newline
        } else {
            // Setext heading
            const headingText = this.consumeUntil('\n');
            this.advance(); // Skip newline
            
            if (!this.isAtEnd()) {
                const underline = this.consumeLine();
                const level = underline.trim().startsWith('=') ? 1 : 2;
                
                this.addToken('HEADING', {
                    level,
                    text: headingText.trim(),
                    raw: this.getRawText(startPos)
                }, startPos);
            }
        }
    }

    tokenizeCodeBlock(startPos) {
        if (this.currentChar === '`' || this.currentChar === '~') {
            // Fenced code block
            const fenceChar = this.currentChar;
            let fenceLength = 0;
            
            while (this.currentChar === fenceChar) {
                fenceLength++;
                this.advance();
            }
            
            if (fenceLength >= 3) {
                // Get language identifier
                const language = this.consumeUntil('\n').trim();
                this.advance(); // Skip newline
                
                // Collect code content until closing fence
                const codeContent = [];
                while (!this.isAtEnd()) {
                    const line = this.consumeLine();
                    
                    // Check if this line is a closing fence
                    if (this.isClosingFence(line, fenceChar, fenceLength)) {
                        break;
                    }
                    
                    codeContent.push(line);
                    this.advance(); // Skip newline
                }
                
                this.addToken('CODE_BLOCK', {
                    language,
                    content: codeContent.join('\n'),
                    fenced: true,
                    raw: this.getRawText(startPos)
                }, startPos);
            }
        } else {
            // Indented code block
            const codeLines = [];
            
            while (!this.isAtEnd() && this.isIndentedLine()) {
                const line = this.consumeLine();
                const dedentedLine = this.dedentLine(line);
                codeLines.push(dedentedLine);
                this.advance(); // Skip newline
            }
            
            if (codeLines.length > 0) {
                this.addToken('CODE_BLOCK', {
                    language: '',
                    content: codeLines.join('\n'),
                    fenced: false,
                    raw: this.getRawText(startPos)
                }, startPos);
            }
        }
    }

    tokenizeBlockquote(startPos) {
        const lines = [];
        
        while (!this.isAtEnd() && this.currentChar === '>') {
            this.advance(); // Skip >
            
            // Skip optional space
            if (this.currentChar === ' ') {
                this.advance();
            }
            
            const line = this.consumeUntil('\n');
            lines.push(line);
            this.advance(); // Skip newline
        }
        
        this.addToken('BLOCKQUOTE', {
            content: lines.join('\n'),
            raw: this.getRawText(startPos)
        }, startPos);
    }

    tokenizeList(startPos) {
        const items = [];
        
        while (!this.isAtEnd() && this.checkList()) {
            const item = this.tokenizeListItem();
            if (item) {
                items.push(item);
            }
        }
        
        this.addToken('LIST', {
            items,
            raw: this.getRawText(startPos)
        }, startPos);
    }

    tokenizeListItem() {
        const startPos = this.position;
        let marker = '';
        let content = '';
        
        // Collect marker
        while (!this.isAtEnd() && this.currentChar !== ' ' && this.currentChar !== '\t') {
            marker += this.currentChar;
            this.advance();
        }
        
        // Skip space/tab
        while (this.currentChar === ' ' || this.currentChar === '\t') {
            this.advance();
        }
        
        // Collect content until end of line
        content = this.consumeUntil('\n');
        this.advance(); // Skip newline
        
        return {
            marker,
            content: content.trim(),
            raw: this.getRawText(startPos)
        };
    }

    tokenizeHorizontalRule(startPos) {
        const char = this.currentChar;
        let count = 0;
        
        while (this.currentChar === char) {
            count++;
            this.advance();
        }
        
        // Skip rest of line
        this.consumeUntil('\n');
        this.advance(); // Skip newline
        
        this.addToken('HORIZONTAL_RULE', {
            char,
            count,
            raw: this.getRawText(startPos)
        }, startPos);
    }

    tokenizeHtmlBlock(startPos) {
        const content = this.consumeUntil('\n');
        this.advance(); // Skip newline
        
        this.addToken('HTML_BLOCK', {
            content: content.trim(),
            raw: this.getRawText(startPos)
        }, startPos);
    }

    tokenizeParagraph(startPos) {
        const lines = [];
        
        while (!this.isAtEnd() && !this.isAtLineStart()) {
            const line = this.consumeUntil('\n');
            lines.push(line);
            this.advance(); // Skip newline
        }
        
        const content = lines.join('\n').trim();
        if (content) {
            this.addToken('PARAGRAPH', {
                content,
                raw: this.getRawText(startPos)
            }, startPos);
        }
    }

    tokenizeInlineContent(startPos) {
        if (this.currentChar === '*' || this.currentChar === '_') {
            this.tokenizeEmphasis(startPos);
        } else if (this.currentChar === '[') {
            this.tokenizeLinkOrImage(startPos);
        } else if (this.currentChar === '`') {
            this.tokenizeInlineCode(startPos);
        } else if (this.currentChar === '<') {
            this.tokenizeAutolinkOrHtml(startPos);
        } else if (this.currentChar === '\\') {
            this.tokenizeEscape(startPos);
        } else if (this.currentChar === '\n' || this.currentChar === '\r') {
            this.tokenizeLineBreak(startPos);
        } else {
            this.tokenizeText(startPos);
        }
    }

    tokenizeEmphasis(startPos) {
        const delimiterChar = this.currentChar;
        let delimiterCount = 0;
        
        // Count consecutive delimiters
        while (this.currentChar === delimiterChar) {
            delimiterCount++;
            this.advance();
        }
        
        // Look for matching closing delimiters
        let textContent = '';
        let closingDelimiters = 0;
        
        while (!this.isAtEnd() && closingDelimiters < delimiterCount) {
            if (this.currentChar === delimiterChar) {
                const tempCount = this.countConsecutive(delimiterChar);
                if (tempCount >= delimiterCount) {
                    closingDelimiters = delimiterCount;
                    break;
                } else {
                    textContent += this.currentChar;
                    this.advance();
                }
            } else {
                textContent += this.currentChar;
                this.advance();
            }
        }
        
        if (closingDelimiters === delimiterCount) {
            // Determine emphasis type
            let emphasisType = 'ITALIC';
            if (delimiterCount === 2) {
                emphasisType = 'BOLD';
            } else if (delimiterCount >= 3) {
                emphasisType = 'BOLD_ITALIC';
            }
            
            this.addToken(emphasisType, {
                text: textContent,
                delimiter: delimiterChar,
                raw: this.getRawText(startPos)
            }, startPos);
        } else {
            // No matching close found, treat as regular text
            this.position = startPos.position;
            this.tokenizeText(startPos);
        }
    }

    tokenizeLinkOrImage(startPos) {
        let isImage = false;
        
        // Check for image syntax (starts with !)
        if (this.position > 0 && this.text[this.position - 1] === '!') {
            isImage = true;
            startPos.position--;
        }
        
        this.advance(); // Skip [
        
        // Collect link text
        let linkText = '';
        let bracketDepth = 0;
        
        while (!this.isAtEnd()) {
            if (this.currentChar === '[') {
                bracketDepth++;
            } else if (this.currentChar === ']') {
                if (bracketDepth === 0) {
                    break;
                }
                bracketDepth--;
            }
            
            linkText += this.currentChar;
            this.advance();
        }
        
        if (this.currentChar !== ']') {
            // Malformed link, treat as text
            this.position = startPos.position;
            this.tokenizeText(startPos);
            return;
        }
        
        this.advance(); // Skip ]
        
        // Check for inline link (url) or reference link [id]
        if (this.currentChar === '(') {
            // Inline link
            this.advance(); // Skip (
            
            let url = '';
            let title = '';
            let parenDepth = 0;
            
            // Collect URL
            while (!this.isAtEnd() && (this.currentChar !== ')' || parenDepth > 0)) {
                if (this.currentChar === '(') {
                    parenDepth++;
                } else if (this.currentChar === ')') {
                    parenDepth--;
                } else if (this.currentChar === ' ' && !title) {
                    // Start of title
                    this.advance();
                    if (this.currentChar === '"' || this.currentChar === "'") {
                        const quoteChar = this.currentChar;
                        this.advance();
                        while (!this.isAtEnd() && this.currentChar !== quoteChar) {
                            title += this.currentChar;
                            this.advance();
                        }
                        if (this.currentChar === quoteChar) {
                            this.advance();
                        }
                    }
                    continue;
                }
                
                url += this.currentChar;
                this.advance();
            }
            
            if (this.currentChar === ')') {
                this.advance(); // Skip )
                
                const tokenType = isImage ? 'IMAGE' : 'LINK';
                this.addToken(tokenType, {
                    text: linkText,
                    url: url.trim(),
                    title: title,
                    raw: this.getRawText(startPos)
                }, startPos);
            } else {
                // Malformed
                this.position = startPos.position;
                this.tokenizeText(startPos);
            }
        }
    }

    tokenizeInlineCode(startPos) {
        this.advance(); // Skip opening `
        
        let content = '';
        while (!this.isAtEnd() && this.currentChar !== '`') {
            content += this.currentChar;
            this.advance();
        }
        
        if (this.currentChar === '`') {
            this.advance(); // Skip closing `
            
            this.addToken('INLINE_CODE', {
                content: content,
                raw: this.getRawText(startPos)
            }, startPos);
        } else {
            // No closing backtick, treat as text
            this.position = startPos.position;
            this.tokenizeText(startPos);
        }
    }

    tokenizeAutolinkOrHtml(startPos) {
        const content = this.consumeUntil('>');
        if (this.currentChar === '>') {
            this.advance(); // Skip >
            
            this.addToken('HTML_TAG', {
                content: content + '>',
                raw: this.getRawText(startPos)
            }, startPos);
        } else {
            this.tokenizeText(startPos);
        }
    }

    tokenizeEscape(startPos) {
        this.advance(); // Skip \
        
        if (!this.isAtEnd()) {
            this.addToken('ESCAPED_CHAR', {
                char: this.currentChar,
                raw: this.getRawText(startPos)
            }, startPos);
            this.advance();
        } else {
            this.tokenizeText(startPos);
        }
    }

    tokenizeLineBreak(startPos) {
        this.addToken('LINE_BREAK', {
            raw: this.getRawText(startPos)
        }, startPos);
        this.advance();
    }

    tokenizeText(startPos) {
        let content = '';
        while (!this.isAtEnd() && !this.isSpecialChar()) {
            content += this.currentChar;
            this.advance();
        }
        
        if (content) {
            this.addToken('TEXT', {
                content: content,
                raw: this.getRawText(startPos)
            }, startPos);
        }
    }

    // Helper methods
    isSpecialChar() {
        const specialChars = ['*', '_', '[', ']', '`', '<', '>', '\\', '\n', '\r'];
        return specialChars.includes(this.currentChar);
    }

    isClosingFence(line, fenceChar, fenceLength) {
        const trimmed = line.trim();
        if (trimmed.length < fenceLength) return false;
        
        for (let i = 0; i < fenceLength; i++) {
            if (trimmed[i] !== fenceChar) return false;
        }
        
        return true;
    }

    isIndentedLine() {
        return this.currentChar === ' ' || this.currentChar === '\t';
    }

    dedentLine(line) {
        if (line.startsWith('    ')) {
            return line.substring(4);
        } else if (line.startsWith('\t')) {
            return line.substring(1);
        }
        return line;
    }

    countConsecutive(char) {
        let count = 0;
        let pos = this.position;
        while (pos < this.text.length && this.text[pos] === char) {
            count++;
            pos++;
        }
        return count;
    }
}

// Export the MarkdownLexer class
export { MarkdownLexer };
