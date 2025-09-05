/**
 * Markdown Parser and HTML Renderer
 * Part of Advanced Markdown Preview system
 */

import { SyntaxHighlighter } from './markdown-syntax-highlighter.js';

/**
 * Markdown Parser - Builds AST from tokens
 */
class MarkdownParser {
    constructor() {
        this.tokens = [];
        this.current = 0;
        this.astNodes = [];
    }

    parse(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.astNodes = [];
        
        while (!this.isAtEnd()) {
            const node = this.parseBlockElement();
            if (node) {
                this.astNodes.push(node);
            }
        }
        
        return {
            type: 'document',
            children: this.astNodes
        };
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }

    peek() {
        return this.tokens[this.current];
    }

    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.tokens[this.current - 1];
    }

    parseBlockElement() {
        const token = this.peek();
        if (!token) return null;
        
        switch (token.type) {
            case 'HEADING':
                return this.parseHeading();
            case 'CODE_BLOCK':
                return this.parseCodeBlock();
            case 'BLOCKQUOTE':
                return this.parseBlockquote();
            case 'LIST':
                return this.parseList();
            case 'HORIZONTAL_RULE':
                return this.parseHorizontalRule();
            case 'HTML_BLOCK':
                return this.parseHtmlBlock();
            case 'PARAGRAPH':
                return this.parseParagraph();
            default:
                return this.parseParagraph();
        }
    }

    parseHeading() {
        const token = this.advance();
        
        // Parse inline content within heading text
        const inlineTokens = this.tokenizeInline(token.data.text);
        const children = this.parseInlineTokens(inlineTokens);
        
        return {
            type: 'heading',
            depth: token.data.level,
            children: children,
            position: token.position
        };
    }

    parseCodeBlock() {
        const token = this.advance();
        const data = token.data;
        
        return {
            type: 'code',
            lang: data.language || null,
            value: data.content,
            meta: null,
            position: token.position
        };
    }

    parseBlockquote() {
        const token = this.advance();
        
        // Parse inline content within blockquote
        const inlineTokens = this.tokenizeInline(token.data.content);
        const children = this.parseInlineTokens(inlineTokens);
        
        return {
            type: 'blockquote',
            children: children,
            position: token.position
        };
    }

    parseList() {
        const token = this.advance();
        const items = token.data.items.map(item => {
            const inlineTokens = this.tokenizeInline(item.content);
            const children = this.parseInlineTokens(inlineTokens);
            
            return {
                type: 'listItem',
                children: children,
                position: token.position
            };
        });
        
        return {
            type: 'list',
            ordered: this.isOrderedList(token.data.items[0]?.marker),
            children: items,
            position: token.position
        };
    }

    parseHorizontalRule() {
        const token = this.advance();
        
        return {
            type: 'thematicBreak',
            position: token.position
        };
    }

    parseHtmlBlock() {
        const token = this.advance();
        
        return {
            type: 'html',
            value: token.data.content,
            position: token.position
        };
    }

    parseParagraph() {
        const token = this.advance();
        
        if (!token || token.type !== 'PARAGRAPH') {
            return null;
        }
        
        // Use inline tokens if available, otherwise parse the content
        let children;
        if (token.data.inlineTokens && token.data.inlineTokens.length > 0) {
            children = this.parseInlineTokens(token.data.inlineTokens);
        } else {
            // Fallback: parse the content as inline text
            const inlineTokens = this.tokenizeInline(token.data.content);
            children = this.parseInlineTokens(inlineTokens);
        }
        
        return {
            type: 'paragraph',
            children: children,
            position: token.position
        };
    }

    parseInlineTokens(tokens) {
        const nodes = [];
        let i = 0;
        
        while (i < tokens.length) {
            const token = tokens[i];
            
            switch (token.type) {
                case 'TEXT':
                    nodes.push({
                        type: 'text',
                        value: token.data.content,
                        position: token.position
                    });
                    break;
                    
                case 'ITALIC':
                case 'BOLD':
                case 'BOLD_ITALIC':
                    const inlineContent = this.tokenizeInline(token.data.text);
                    const emphasisChildren = this.parseInlineTokens(inlineContent);
                    
                    const emphasisType = token.type === 'ITALIC' ? 'emphasis' : 'strong';
                    
                    nodes.push({
                        type: emphasisType,
                        children: emphasisChildren,
                        position: token.position
                    });
                    break;
                    
                case 'LINK':
                    const textTokens = this.tokenizeInline(token.data.text);
                    const linkChildren = this.parseInlineTokens(textTokens);
                    
                    nodes.push({
                        type: 'link',
                        url: token.data.url,
                        title: token.data.title || null,
                        children: linkChildren,
                        position: token.position
                    });
                    break;
                    
                case 'IMAGE':
                    nodes.push({
                        type: 'image',
                        url: token.data.url,
                        alt: token.data.text,
                        title: token.data.title || null,
                        position: token.position
                    });
                    break;
                    
                case 'AUTOLINK':
                    nodes.push({
                        type: 'link',
                        url: token.data.url,
                        title: null,
                        children: [{
                            type: 'text',
                            value: token.data.text,
                            position: token.position
                        }],
                        position: token.position
                    });
                    break;
                    
                case 'INLINE_CODE':
                    nodes.push({
                        type: 'inlineCode',
                        value: token.data.content,
                        position: token.position
                    });
                    break;
                    
                case 'ESCAPED_CHAR':
                    nodes.push({
                        type: 'text',
                        value: token.data.char,
                        position: token.position
                    });
                    break;
            }
            
            i++;
        }
        
        return nodes;
    }

    tokenizeInline(text) {
        // Simple inline tokenization for parsing
        const tokens = [];
        let i = 0;
        
        while (i < text.length) {
            if (text[i] === '*' || text[i] === '_') {
                // Handle emphasis
                const delimiter = text[i];
                let count = 0;
                let start = i;
                
                while (i < text.length && text[i] === delimiter) {
                    count++;
                    i++;
                }
                
                // Find matching closing delimiter
                let content = '';
                let found = false;
                
                while (i < text.length && !found) {
                    if (text[i] === delimiter) {
                        let closeCount = 0;
                        let closeStart = i;
                        
                        while (i < text.length && text[i] === delimiter) {
                            closeCount++;
                            i++;
                        }
                        
                        if (closeCount >= count) {
                            found = true;
                            break;
                        } else {
                            content += text.substring(closeStart, i);
                        }
                    } else {
                        content += text[i];
                        i++;
                    }
                }
                
                if (found) {
                    tokens.push({
                        type: count === 1 ? 'ITALIC' : 'BOLD',
                        data: { text: content },
                        position: { line: 1, column: start }
                    });
                } else {
                    // No match found, treat as text
                    tokens.push({
                        type: 'TEXT',
                        data: { content: text.substring(start, i) },
                        position: { line: 1, column: start }
                    });
                }
            } else {
                // Regular text
                let content = '';
                let start = i;
                
                while (i < text.length && text[i] !== '*' && text[i] !== '_') {
                    content += text[i];
                    i++;
                }
                
                if (content) {
                    tokens.push({
                        type: 'TEXT',
                        data: { content },
                        position: { line: 1, column: start }
                    });
                }
            }
        }
        
        return tokens;
    }

    isInlineToken(token) {
        if (!token) return false;
        return ['TEXT', 'ITALIC', 'BOLD', 'LINK', 'IMAGE', 'INLINE_CODE', 'AUTOLINK'].includes(token.type);
    }

    isOrderedList(marker) {
        if (!marker) return false;
        return /^\d+[.)]/.test(marker);
    }
}

/**
 * HTML Renderer - Converts AST to HTML
 */
class HTMLRenderer {
    constructor() {
        this.syntaxHighlighter = new SyntaxHighlighter();
        this.options = {
            sanitize: true,
            baseUrl: '',
            targetBlank: true
        };
    }

    render(astNode) {
        if (!astNode) return '';
        
        switch (astNode.type) {
            case 'document':
                return this.renderDocument(astNode);
            case 'heading':
                return this.renderHeading(astNode);
            case 'paragraph':
                return this.renderParagraph(astNode);
            case 'code':
                return this.renderCodeBlock(astNode);
            case 'blockquote':
                return this.renderBlockquote(astNode);
            case 'list':
                return this.renderList(astNode);
            case 'listItem':
                return this.renderListItem(astNode);
            case 'emphasis':
                return this.renderEmphasis(astNode);
            case 'strong':
                return this.renderStrong(astNode);
            case 'link':
                return this.renderLink(astNode);
            case 'image':
                return this.renderImage(astNode);
            case 'inlineCode':
                return this.renderInlineCode(astNode);
            case 'text':
                return this.renderText(astNode);
            case 'thematicBreak':
                return this.renderThematicBreak(astNode);
            case 'html':
                return this.renderHtml(astNode);
            default:
                return '';
        }
    }

    renderDocument(node) {
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return childrenHtml;
    }

    renderHeading(node) {
        const level = node.depth;
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        
        // Generate anchor ID from heading text
        const anchorId = this.generateHeadingId(this.extractText(node));
        
        return `<h${level} id="${anchorId}">${childrenHtml}</h${level}>\n`;
    }

    renderParagraph(node) {
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return `<p>${childrenHtml}</p>\n`;
    }

    renderCodeBlock(node) {
        const language = node.lang || '';
        const codeContent = this.escapeHtml(node.value);
        
        if (language) {
            // Apply syntax highlighting
            const highlightedCode = this.syntaxHighlighter.highlight(codeContent, language);
            return `<pre><code class="language-${this.escapeAttribute(language)}">${highlightedCode}</code></pre>\n`;
        } else {
            return `<pre><code>${codeContent}</code></pre>\n`;
        }
    }

    renderBlockquote(node) {
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return `<blockquote>${childrenHtml}</blockquote>\n`;
    }

    renderList(node) {
        const tag = node.ordered ? 'ol' : 'ul';
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return `<${tag}>${childrenHtml}</${tag}>\n`;
    }

    renderListItem(node) {
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return `<li>${childrenHtml}</li>\n`;
    }

    renderEmphasis(node) {
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return `<em>${childrenHtml}</em>`;
    }

    renderStrong(node) {
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        return `<strong>${childrenHtml}</strong>`;
    }

    renderLink(node) {
        const url = this.sanitizeUrl(node.url);
        const title = node.title || '';
        const childrenHtml = node.children.map(child => this.render(child)).join('');
        
        let attributes = [`href="${this.escapeAttribute(url)}"`];
        
        if (title) {
            attributes.push(`title="${this.escapeAttribute(title)}"`);
        }
        
        if (this.options.targetBlank && this.isExternalUrl(url)) {
            attributes.push('target="_blank"');
            attributes.push('rel="noopener noreferrer"');
        }
        
        const attrString = attributes.join(' ');
        return `<a ${attrString}>${childrenHtml}</a>`;
    }

    renderImage(node) {
        const src = this.sanitizeUrl(node.url);
        const alt = this.escapeAttribute(node.alt);
        const title = node.title || '';
        
        let attributes = [`src="${src}"`, `alt="${alt}"`];
        
        if (title) {
            attributes.push(`title="${this.escapeAttribute(title)}"`);
        }
        
        const attrString = attributes.join(' ');
        return `<img ${attrString} />`;
    }

    renderInlineCode(node) {
        const codeContent = this.escapeHtml(node.value);
        return `<code>${codeContent}</code>`;
    }

    renderText(node) {
        const text = this.escapeHtml(node.value);
        // Convert bare URLs to links
        return this.convertBareUrlsToLinks(text);
    }
    
    convertBareUrlsToLinks(text) {
        // Regex to match bare URLs (http:// or https://)
        const urlRegex = /(https?:\/\/[^\s<>]+)/g;
        
        return text.replace(urlRegex, (match) => {
            const url = this.sanitizeUrl(match);
            const escapedUrl = this.escapeAttribute(url);
            return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${match}</a>`;
        });
    }

    renderThematicBreak(node) {
        return '<hr>\n';
    }

    renderHtml(node) {
        return node.value;
    }

    // Helper methods
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

    escapeAttribute(text) {
        return this.escapeHtml(String(text));
    }

    sanitizeUrl(url) {
        if (this.options.sanitize) {
            const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
            const urlLower = url.toLowerCase().trim();
            
            for (const protocol of dangerousProtocols) {
                if (urlLower.startsWith(protocol)) {
                    return '#';
                }
            }
        }
        
        return url;
    }

    isExternalUrl(url) {
        return url.startsWith('http://') || url.startsWith('https://');
    }

    generateHeadingId(text) {
        // Convert to lowercase and replace spaces/special chars with hyphens
        let idText = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        return idText || 'heading';
    }

    extractText(node) {
        if (node.type === 'text') {
            return node.value;
        } else if (node.children) {
            return node.children.map(child => this.extractText(child)).join('');
        }
        return '';
    }
}

// Export classes
export { MarkdownParser, HTMLRenderer };
