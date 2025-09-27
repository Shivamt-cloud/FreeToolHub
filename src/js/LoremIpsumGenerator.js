/**
 * Lorem Ipsum Generator
 * Generates Lorem Ipsum text in multiple languages with custom lengths
 */
class LoremIpsumGenerator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 50;
        
        // Lorem Ipsum text in different languages
        this.texts = {
            latin: {
                words: [
                    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
                    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
                    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
                    'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
                    'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
                    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
                    'mollit', 'anim', 'id', 'est', 'laborum', 'sed', 'ut', 'perspiciatis', 'unde', 'omnis',
                    'iste', 'natus', 'error', 'sit', 'voluptatem', 'accusantium', 'doloremque', 'laudantium',
                    'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
                    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo', 'nemo', 'enim',
                    'ipsam', 'voluptatem', 'quia', 'voluptas', 'sit', 'aspernatur', 'aut', 'odit', 'aut', 'fugit',
                    'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'eos', 'qui', 'ratione', 'voluptatem',
                    'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'est', 'qui', 'dolorem', 'ipsum', 'quia',
                    'dolor', 'sit', 'amet', 'consectetur', 'adipisci', 'velit', 'sed', 'quia', 'non', 'numquam',
                    'eius', 'modi', 'tempora', 'incidunt', 'ut', 'labore', 'et', 'dolore', 'magnam', 'aliquam',
                    'quaerat', 'voluptatem', 'ut', 'enim', 'ad', 'minima', 'veniam', 'quis', 'nostrum',
                    'exercitationem', 'ullam', 'corporis', 'suscipit', 'laboriosam', 'nisi', 'ut', 'aliquid',
                    'ex', 'ea', 'commodi', 'consequatur', 'quis', 'autem', 'vel', 'eum', 'iure', 'reprehenderit',
                    'qui', 'in', 'ea', 'voluptate', 'velit', 'esse', 'quam', 'nihil', 'molestiae', 'consequatur',
                    'vel', 'illum', 'qui', 'dolorem', 'eum', 'fugiat', 'quo', 'voluptas', 'nulla', 'pariatur'
                ],
                name: 'Latin (Classic Lorem Ipsum)'
            },
            english: {
                words: [
                    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'pack', 'my', 'box',
                    'with', 'five', 'dozen', 'liquor', 'jugs', 'how', 'vexingly', 'quick', 'daft', 'zebras',
                    'jump', 'waltz', 'bad', 'nymph', 'for', 'jived', 'quicks', 'sphinx', 'of', 'black',
                    'quartz', 'judge', 'my', 'vow', 'waltz', 'nymph', 'for', 'quick', 'jived', 'gems',
                    'pack', 'my', 'box', 'with', 'five', 'dozen', 'liquor', 'jugs', 'the', 'five', 'boxing',
                    'wizards', 'jump', 'quickly', 'sphinx', 'of', 'black', 'quartz', 'judge', 'my', 'vow',
                    'waltz', 'bad', 'nymph', 'for', 'jived', 'quicks', 'sphinx', 'of', 'black', 'quartz',
                    'judge', 'my', 'vow', 'waltz', 'nymph', 'for', 'quick', 'jived', 'gems', 'pack', 'my',
                    'box', 'with', 'five', 'dozen', 'liquor', 'jugs', 'the', 'five', 'boxing', 'wizards',
                    'jump', 'quickly', 'sphinx', 'of', 'black', 'quartz', 'judge', 'my', 'vow', 'waltz',
                    'bad', 'nymph', 'for', 'jived', 'quicks', 'sphinx', 'of', 'black', 'quartz', 'judge',
                    'my', 'vow', 'waltz', 'nymph', 'for', 'quick', 'jived', 'gems', 'pack', 'my', 'box',
                    'with', 'five', 'dozen', 'liquor', 'jugs', 'the', 'five', 'boxing', 'wizards', 'jump',
                    'quickly', 'sphinx', 'of', 'black', 'quartz', 'judge', 'my', 'vow', 'waltz', 'bad',
                    'nymph', 'for', 'jived', 'quicks', 'sphinx', 'of', 'black', 'quartz', 'judge', 'my',
                    'vow', 'waltz', 'nymph', 'for', 'quick', 'jived', 'gems', 'pack', 'my', 'box', 'with',
                    'five', 'dozen', 'liquor', 'jugs', 'the', 'five', 'boxing', 'wizards', 'jump', 'quickly'
                ],
                name: 'English (Pangrams)'
            },
            spanish: {
                words: [
                    'el', 'veloz', 'murciélago', 'hindú', 'comía', 'feliz', 'cardillo', 'y', 'kiwi', 'la',
                    'cigüeña', 'tocaba', 'el', 'saxofón', 'detrás', 'del', 'palenque', 'de', 'paja', 'el',
                    'pingüino', 'wenceslao', 'hacía', 'kilómetros', 'bajo', 'exhaustiva', 'lluvia', 'y',
                    'frío', 'añoraba', 'a', 'su', 'querido', 'gatito', 'el', 'veloz', 'murciélago', 'hindú',
                    'comía', 'feliz', 'cardillo', 'y', 'kiwi', 'la', 'cigüeña', 'tocaba', 'el', 'saxofón',
                    'detrás', 'del', 'palenque', 'de', 'paja', 'el', 'pingüino', 'wenceslao', 'hacía',
                    'kilómetros', 'bajo', 'exhaustiva', 'lluvia', 'y', 'frío', 'añoraba', 'a', 'su', 'querido',
                    'gatito', 'el', 'veloz', 'murciélago', 'hindú', 'comía', 'feliz', 'cardillo', 'y', 'kiwi',
                    'la', 'cigüeña', 'tocaba', 'el', 'saxofón', 'detrás', 'del', 'palenque', 'de', 'paja',
                    'el', 'pingüino', 'wenceslao', 'hacía', 'kilómetros', 'bajo', 'exhaustiva', 'lluvia', 'y',
                    'frío', 'añoraba', 'a', 'su', 'querido', 'gatito', 'el', 'veloz', 'murciélago', 'hindú',
                    'comía', 'feliz', 'cardillo', 'y', 'kiwi', 'la', 'cigüeña', 'tocaba', 'el', 'saxofón',
                    'detrás', 'del', 'palenque', 'de', 'paja', 'el', 'pingüino', 'wenceslao', 'hacía',
                    'kilómetros', 'bajo', 'exhaustiva', 'lluvia', 'y', 'frío', 'añoraba', 'a', 'su', 'querido',
                    'gatito', 'el', 'veloz', 'murciélago', 'hindú', 'comía', 'feliz', 'cardillo', 'y', 'kiwi',
                    'la', 'cigüeña', 'tocaba', 'el', 'saxofón', 'detrás', 'del', 'palenque', 'de', 'paja',
                    'el', 'pingüino', 'wenceslao', 'hacía', 'kilómetros', 'bajo', 'exhaustiva', 'lluvia', 'y',
                    'frío', 'añoraba', 'a', 'su', 'querido', 'gatito', 'el', 'veloz', 'murciélago', 'hindú'
                ],
                name: 'Spanish (Pangrams)'
            },
            french: {
                words: [
                    'portez', 'ce', 'vieux', 'whisky', 'au', 'juge', 'blond', 'qui', 'fume', 'sur',
                    'son', 'île', 'intérieure', 'à', 'côté', 'de', 'l', 'alvéole', 'hors', 'du',
                    'village', 'gaulois', 'portez', 'ce', 'vieux', 'whisky', 'au', 'juge', 'blond', 'qui',
                    'fume', 'sur', 'son', 'île', 'intérieure', 'à', 'côté', 'de', 'l', 'alvéole', 'hors',
                    'du', 'village', 'gaulois', 'portez', 'ce', 'vieux', 'whisky', 'au', 'juge', 'blond',
                    'qui', 'fume', 'sur', 'son', 'île', 'intérieure', 'à', 'côté', 'de', 'l', 'alvéole',
                    'hors', 'du', 'village', 'gaulois', 'portez', 'ce', 'vieux', 'whisky', 'au', 'juge',
                    'blond', 'qui', 'fume', 'sur', 'son', 'île', 'intérieure', 'à', 'côté', 'de', 'l',
                    'alvéole', 'hors', 'du', 'village', 'gaulois', 'portez', 'ce', 'vieux', 'whisky', 'au',
                    'juge', 'blond', 'qui', 'fume', 'sur', 'son', 'île', 'intérieure', 'à', 'côté', 'de',
                    'l', 'alvéole', 'hors', 'du', 'village', 'gaulois', 'portez', 'ce', 'vieux', 'whisky',
                    'au', 'juge', 'blond', 'qui', 'fume', 'sur', 'son', 'île', 'intérieure', 'à', 'côté',
                    'de', 'l', 'alvéole', 'hors', 'du', 'village', 'gaulois', 'portez', 'ce', 'vieux',
                    'whisky', 'au', 'juge', 'blond', 'qui', 'fume', 'sur', 'son', 'île', 'intérieure', 'à',
                    'côté', 'de', 'l', 'alvéole', 'hors', 'du', 'village', 'gaulois', 'portez', 'ce', 'vieux',
                    'whisky', 'au', 'juge', 'blond', 'qui', 'fume', 'sur', 'son', 'île', 'intérieure', 'à',
                    'côté', 'de', 'l', 'alvéole', 'hors', 'du', 'village', 'gaulois', 'portez', 'ce', 'vieux'
                ],
                name: 'French (Pangrams)'
            },
            german: {
                words: [
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund',
                    'zwölf', 'boxkämpfer', 'jagen', 'viktor', 'quer', 'über', 'den', 'großen', 'sylter',
                    'deich', 'der', 'schnelle', 'braune', 'fuchs', 'springt', 'über', 'den', 'faulen', 'hund'
                ],
                name: 'German (Pangrams)'
            },
            japanese: {
                words: [
                    'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて',
                    'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ',
                    'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを',
                    'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす',
                    'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて',
                    'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ',
                    'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを',
                    'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす',
                    'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて',
                    'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ',
                    'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを',
                    'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす',
                    'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて',
                    'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ',
                    'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを',
                    'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす',
                    'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて',
                    'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを', 'わかよたれそ', 'つねならむ',
                    'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす', 'いろはにほへと', 'ちりぬるを',
                    'わかよたれそ', 'つねならむ', 'うゐのおくやま', 'けふこえて', 'あさきゆめみし', 'ゑひもせす'
                ],
                name: 'Japanese (Iroha)'
            }
        };
    }

    /**
     * Generate Lorem Ipsum text
     */
    generateText(options = {}) {
        try {
            const {
                language = 'latin',
                type = 'words',
                count = 50,
                startWithLorem = true,
                format = 'plain'
            } = options;

            if (!this.texts[language]) {
                throw new Error('Unsupported language');
            }

            const words = this.texts[language].words;
            let result = '';

            if (type === 'words') {
                result = this.generateWords(words, count, startWithLorem);
            } else if (type === 'sentences') {
                result = this.generateSentences(words, count, startWithLorem);
            } else if (type === 'paragraphs') {
                result = this.generateParagraphs(words, count, startWithLorem);
            } else {
                throw new Error('Invalid type');
            }

            // Format the result
            if (format === 'html') {
                result = this.formatAsHTML(result, type);
            } else if (format === 'markdown') {
                result = this.formatAsMarkdown(result, type);
            }

            const stats = this.getTextStats(result);

            return {
                success: true,
                text: result,
                stats: stats,
                language: language,
                type: type,
                count: count,
                format: format
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate words
     */
    generateWords(words, count, startWithLorem) {
        let result = [];
        
        if (startWithLorem && words.includes('lorem')) {
            result.push('Lorem');
            count--;
        }

        for (let i = 0; i < count; i++) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            result.push(randomWord);
        }

        return result.join(' ');
    }

    /**
     * Generate sentences
     */
    generateSentences(words, count, startWithLorem) {
        const sentences = [];
        
        for (let i = 0; i < count; i++) {
            const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words
            const sentence = this.generateWords(words, sentenceLength, false);
            sentences.push(this.capitalizeFirst(sentence) + '.');
        }

        return sentences.join(' ');
    }

    /**
     * Generate paragraphs
     */
    generateParagraphs(words, count, startWithLorem) {
        const paragraphs = [];
        
        for (let i = 0; i < count; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences
            const paragraph = this.generateSentences(words, sentenceCount, startWithLorem);
            paragraphs.push(paragraph);
        }

        return paragraphs.join('\n\n');
    }

    /**
     * Format as HTML
     */
    formatAsHTML(text, type) {
        if (type === 'paragraphs') {
            const paragraphs = text.split('\n\n');
            return paragraphs.map(p => `<p>${p}</p>`).join('\n');
        } else if (type === 'sentences') {
            return `<p>${text}</p>`;
        } else {
            return `<p>${text}</p>`;
        }
    }

    /**
     * Format as Markdown
     */
    formatAsMarkdown(text, type) {
        if (type === 'paragraphs') {
            return text; // Already formatted with double line breaks
        } else if (type === 'sentences') {
            return text;
        } else {
            return text;
        }
    }

    /**
     * Get text statistics
     */
    getTextStats(text) {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
        
        return {
            characters: text.length,
            charactersNoSpaces: text.replace(/\s/g, '').length,
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            averageWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
            averageSentencesPerParagraph: paragraphs.length > 0 ? Math.round(sentences.length / paragraphs.length) : 0
        };
    }

    /**
     * Capitalize first letter
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.texts).map(key => ({
            key: key,
            name: this.texts[key].name
        }));
    }

    /**
     * Generate custom text with specific words
     */
    generateCustomText(customWords, options = {}) {
        try {
            const {
                type = 'words',
                count = 50,
                startWithLorem = true
            } = options;

            if (!customWords || customWords.length === 0) {
                throw new Error('Custom words are required');
            }

            let result = '';

            if (type === 'words') {
                result = this.generateWords(customWords, count, startWithLorem);
            } else if (type === 'sentences') {
                result = this.generateSentences(customWords, count, startWithLorem);
            } else if (type === 'paragraphs') {
                result = this.generateParagraphs(customWords, count, startWithLorem);
            } else {
                throw new Error('Invalid type');
            }

            const stats = this.getTextStats(result);

            return {
                success: true,
                text: result,
                stats: stats,
                language: 'custom',
                type: type,
                count: count,
                customWords: customWords
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate Lorem Ipsum with specific character count
     */
    generateByCharacterCount(language, targetCount, options = {}) {
        try {
            const words = this.texts[language].words;
            let result = '';
            let currentCount = 0;
            const wordsList = [];

            while (currentCount < targetCount) {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                const newCount = currentCount + randomWord.length + 1; // +1 for space
                
                if (newCount <= targetCount) {
                    wordsList.push(randomWord);
                    currentCount = newCount;
                } else {
                    break;
                }
            }

            result = wordsList.join(' ');
            const stats = this.getTextStats(result);

            return {
                success: true,
                text: result,
                stats: stats,
                language: language,
                targetCount: targetCount,
                actualCount: result.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add to history
     */
    addToHistory(operation, input, output) {
        this.history.push({
            timestamp: new Date().toISOString(),
            operation: operation,
            input: input,
            output: output.substring(0, 200) + (output.length > 200 ? '...' : '')
        });

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
