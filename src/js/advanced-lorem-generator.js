/**
 * Advanced Lorem Generator
 * Comprehensive placeholder text generation with multiple themes, weighted selection, and flexible formatting
 */

/**
 * Word Pool Manager - Handles word collections and sentence patterns
 */
class WordPoolManager {
    constructor() {
        this.wordPools = {};
        this.sentencePatterns = {};
        this.loadDefaultPools();
    }

    loadDefaultPools() {
        // Classic Lorem Ipsum words (from Cicero's "De Finibus Bonorum et Malorum")
        this.wordPools["lorem"] = {
            "common": {
                "words": ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", 
                         "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", 
                         "incididunt", "ut", "labore", "et", "dolore", "magna", 
                         "aliqua", "enim", "ad", "minim", "veniam", "quis"],
                "weight": 0.6
            },
            "uncommon": {
                "words": ["nostrud", "exercitation", "ullamco", "laboris", "nisi", 
                         "aliquip", "ex", "ea", "commodo", "consequat", "duis", 
                         "aute", "irure", "reprehenderit", "voluptate", "velit", 
                         "esse", "cillum", "fugiat", "nulla", "pariatur"],
                "weight": 0.3
            },
            "rare": {
                "words": ["excepteur", "sint", "occaecat", "cupidatat", "non", 
                         "proident", "sunt", "in", "culpa", "qui", "officia", 
                         "deserunt", "mollit", "anim", "id", "est", "laborum"],
                "weight": 0.1
            }
        };

        // Sentence structure patterns with weights
        this.sentencePatterns["lorem"] = [
            {"pattern": "{common} {common} {uncommon} {common} {common}.", "weight": 0.4},
            {"pattern": "{common} {common} {common}, {uncommon} {rare} {common}.", "weight": 0.3},
            {"pattern": "{uncommon} {common} {common} {common} {rare}.", "weight": 0.2},
            {"pattern": "{common} {rare} {uncommon}, {common} {common} {common} {common}.", "weight": 0.1}
        ];

        // Load thematic word pools
        this.loadThematicPools();
    }

    loadThematicPools() {
        // Bacon Ipsum
        this.wordPools["bacon"] = {
            "meats": {
                "words": ["bacon", "ham", "pork", "sausage", "beef", "chicken", 
                         "turkey", "salami", "pepperoni", "prosciutto", "chorizo"],
                "weight": 0.4
            },
            "cooking": {
                "words": ["grilled", "smoked", "roasted", "fried", "braised", 
                         "marinated", "seasoned", "crispy", "tender", "juicy"],
                "weight": 0.3
            },
            "descriptors": {
                "words": ["delicious", "savory", "flavorful", "succulent", 
                         "mouthwatering", "aromatic", "spicy", "hearty"],
                "weight": 0.3
            }
        };

        this.sentencePatterns["bacon"] = [
            {"pattern": "{meats} {cooking} {descriptors} {meats}.", "weight": 0.4},
            {"pattern": "{descriptors} {meats}, {cooking} {meats} {descriptors}.", "weight": 0.3},
            {"pattern": "{cooking} {meats} {descriptors} {cooking}.", "weight": 0.2},
            {"pattern": "{meats} {descriptors}, {cooking} {meats} {descriptors} {meats}.", "weight": 0.1}
        ];

        // Corporate Ipsum
        this.wordPools["corporate"] = {
            "buzzwords": {
                "words": ["synergy", "leverage", "optimize", "streamline", "paradigm",
                         "ecosystem", "scalable", "robust", "innovative", "disruptive"],
                "weight": 0.4
            },
            "actions": {
                "words": ["implement", "execute", "deliver", "facilitate", 
                         "orchestrate", "collaborate", "coordinate", "integrate"],
                "weight": 0.3
            },
            "objectives": {
                "words": ["solutions", "initiatives", "strategies", "frameworks",
                         "methodologies", "best practices", "outcomes", "results"],
                "weight": 0.3
            }
        };

        this.sentencePatterns["corporate"] = [
            {"pattern": "{buzzwords} {actions} {objectives} {buzzwords}.", "weight": 0.4},
            {"pattern": "{actions} {buzzwords}, {objectives} {actions} {buzzwords}.", "weight": 0.3},
            {"pattern": "{objectives} {actions} {buzzwords} {objectives}.", "weight": 0.2},
            {"pattern": "{buzzwords} {objectives}, {actions} {buzzwords} {objectives} {actions}.", "weight": 0.1}
        ];

        // Space Ipsum
        this.wordPools["space"] = {
            "celestial": {
                "words": ["galaxy", "nebula", "quasar", "pulsar", "asteroid", 
                         "comet", "meteor", "satellite", "planet", "moon"],
                "weight": 0.4
            },
            "exploration": {
                "words": ["mission", "spacecraft", "rocket", "orbit", "launch",
                         "astronaut", "cosmonaut", "space station", "probe"],
                "weight": 0.3
            },
            "phenomena": {
                "words": ["gravity", "radiation", "vacuum", "solar wind",
                         "magnetic field", "cosmic rays", "dark matter"],
                "weight": 0.3
            }
        };

        this.sentencePatterns["space"] = [
            {"pattern": "{celestial} {exploration} {phenomena} {celestial}.", "weight": 0.4},
            {"pattern": "{exploration} {celestial}, {phenomena} {exploration} {celestial}.", "weight": 0.3},
            {"pattern": "{phenomena} {exploration} {celestial} {phenomena}.", "weight": 0.2},
            {"pattern": "{celestial} {phenomena}, {exploration} {celestial} {phenomena} {exploration}.", "weight": 0.1}
        ];

        // Tech Ipsum
        this.wordPools["tech"] = {
            "technologies": {
                "words": ["algorithm", "database", "framework", "API", "microservice",
                         "blockchain", "machine learning", "cloud", "container", "serverless"],
                "weight": 0.4
            },
            "processes": {
                "words": ["deploy", "scale", "optimize", "monitor", "debug",
                         "refactor", "integrate", "automate", "configure", "maintain"],
                "weight": 0.3
            },
            "concepts": {
                "words": ["architecture", "performance", "security", "reliability",
                         "scalability", "maintainability", "efficiency", "robustness"],
                "weight": 0.3
            }
        };

        this.sentencePatterns["tech"] = [
            {"pattern": "{technologies} {processes} {concepts} {technologies}.", "weight": 0.4},
            {"pattern": "{processes} {technologies}, {concepts} {processes} {technologies}.", "weight": 0.3},
            {"pattern": "{concepts} {processes} {technologies} {concepts}.", "weight": 0.2},
            {"pattern": "{technologies} {concepts}, {processes} {technologies} {concepts} {processes}.", "weight": 0.1}
        ];
    }

    addCustomPool(name, wordCategories) {
        this.wordPools[name] = wordCategories;
        
        // Generate default sentence patterns if not provided
        if (!this.sentencePatterns[name]) {
            this.generateDefaultPatterns(name);
        }
    }

    generateDefaultPatterns(poolName) {
        const categories = Object.keys(this.wordPools[poolName]);
        
        const patterns = [];
        for (let i = 0; i < 4; i++) { // Generate 4 basic patterns
            const patternLength = 4 + (i % 3); // 4-6 words per sentence
            const patternParts = [];
            
            for (let j = 0; j < patternLength; j++) {
                const category = categories[j % categories.length];
                patternParts.push(`{${category}}`);
            }
            
            const pattern = patternParts.join(' ') + '.';
            const weight = Math.max(0.4 - (i * 0.1), 0.1); // Decreasing weights
            patterns.push({pattern, weight});
        }
        
        this.sentencePatterns[poolName] = patterns;
    }

    getWordPool(theme) {
        return this.wordPools[theme] || this.wordPools["lorem"];
    }

    getSentencePatterns(theme) {
        return this.sentencePatterns[theme] || this.sentencePatterns["lorem"];
    }

    getAvailableThemes() {
        return Object.keys(this.wordPools);
    }
}

/**
 * Weighted Selector - Handles probability-based selection
 */
class WeightedSelector {
    constructor() {
        this.randomSeed = null;
    }

    setSeed(seed) {
        this.randomSeed = seed;
        // Simple seeded random number generator
        this.seedValue = seed;
    }

    seededRandom() {
        if (this.randomSeed !== null) {
            this.seedValue = (this.seedValue * 9301 + 49297) % 233280;
            return this.seedValue / 233280;
        }
        return Math.random();
    }

    selectWeightedItem(itemsWithWeights) {
        const totalWeight = itemsWithWeights.reduce((sum, item) => sum + item[1], 0);
        const randomValue = this.seededRandom() * totalWeight;
        
        let cumulativeWeight = 0;
        for (const [item, weight] of itemsWithWeights) {
            cumulativeWeight += weight;
            if (randomValue <= cumulativeWeight) {
                return item;
            }
        }
        
        // Fallback to last item
        return itemsWithWeights[itemsWithWeights.length - 1][0];
    }

    selectFromCategory(categoryData) {
        const words = categoryData.words;
        const randomIndex = Math.floor(this.seededRandom() * words.length);
        return words[randomIndex];
    }

    selectSentencePattern(patterns) {
        const patternWeights = patterns.map(p => [p.pattern, p.weight]);
        return this.selectWeightedItem(patternWeights);
    }
}

/**
 * Text Generator - Core text generation logic
 */
class TextGenerator {
    constructor(wordPoolManager, weightedSelector) {
        this.wordManager = wordPoolManager;
        this.selector = weightedSelector;
    }

    generateSentence(theme = "lorem", minWords = 4, maxWords = 20) {
        if (!this.wordManager.sentencePatterns[theme]) {
            theme = "lorem"; // Fallback to default
        }
        
        const patterns = this.wordManager.sentencePatterns[theme];
        const selectedPattern = this.selector.selectSentencePattern(patterns);
        
        // Parse pattern and replace placeholders
        let sentence = this.fillPattern(selectedPattern, theme);
        
        // Apply capitalization and punctuation
        sentence = this.applySentenceFormatting(sentence);
        
        // Ensure word count is within bounds
        const words = sentence.split(' ');
        if (words.length < minWords) {
            sentence = this.extendSentence(sentence, theme, minWords);
        } else if (words.length > maxWords) {
            sentence = this.truncateSentence(sentence, maxWords);
        }
        
        return sentence;
    }

    fillPattern(pattern, theme) {
        const wordPool = this.wordManager.getWordPool(theme);
        
        // Find all placeholders like {category}
        const placeholderRegex = /\{(\w+)\}/g;
        let filledPattern = pattern;
        let match;
        
        while ((match = placeholderRegex.exec(pattern)) !== null) {
            const placeholder = match[1];
            if (wordPool[placeholder]) {
                const selectedWord = this.selector.selectFromCategory(wordPool[placeholder]);
                filledPattern = filledPattern.replace(`{${placeholder}}`, selectedWord, 1);
            }
        }
        
        return filledPattern;
    }

    applySentenceFormatting(sentence) {
        if (!sentence) return sentence;
        
        // Capitalize first letter
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        
        // Ensure sentence ends with punctuation
        if (!sentence.match(/[.!?]$/)) {
            sentence += '.';
        }
        
        // Apply random capitalization for proper nouns (10% chance per word)
        const words = sentence.split(' ');
        for (let i = 1; i < words.length; i++) { // Skip first word, already capitalized
            if (this.selector.seededRandom() < 0.1 && /^[a-zA-Z]+$/.test(words[i])) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
        }
        
        return words.join(' ');
    }

    generateParagraph(theme = "lorem", sentenceCount = null, minSentences = 3, maxSentences = 8) {
        if (sentenceCount === null) {
            sentenceCount = Math.floor(this.selector.seededRandom() * (maxSentences - minSentences + 1)) + minSentences;
        }
        
        const sentences = [];
        for (let i = 0; i < sentenceCount; i++) {
            // Vary sentence length slightly
            const minWords = i === 0 ? 4 : 3; // First sentence can be longer
            const maxWords = Math.floor(this.selector.seededRandom() * 8) + 8; // 8-15 words
            
            const sentence = this.generateSentence(theme, minWords, maxWords);
            sentences.push(sentence);
        }
        
        return sentences.join(' ');
    }

    generateWordList(theme = "lorem", wordCount = 10) {
        const words = [];
        const wordPool = this.wordManager.getWordPool(theme);
        
        // Create weighted list of all categories
        const allCategories = Object.entries(wordPool).map(([name, data]) => [name, data.weight]);
        
        for (let i = 0; i < wordCount; i++) {
            // Select category based on weights
            const selectedCategory = this.selector.selectWeightedItem(allCategories);
            
            // Select word from category
            const word = this.selector.selectFromCategory(wordPool[selectedCategory]);
            words.push(word);
        }
        
        return words;
    }

    extendSentence(sentence, theme, targetWords) {
        const currentWords = sentence.replace(/[.!?]$/, '').split(' ');
        const neededWords = targetWords - currentWords.length;
        
        if (neededWords <= 0) return sentence;
        
        // Generate additional words
        const additionalWords = this.generateWordList(theme, neededWords);
        
        // Insert words before final punctuation
        const punctuation = sentence.match(/[.!?]$/)?.[0] || '.';
        const baseSentence = sentence.replace(/[.!?]$/, '');
        
        return baseSentence + ' ' + additionalWords.join(' ') + punctuation;
    }

    truncateSentence(sentence, maxWords) {
        const words = sentence.split(' ');
        if (words.length <= maxWords) return sentence;
        
        const truncatedWords = words.slice(0, maxWords);
        // Ensure proper punctuation
        const lastWord = truncatedWords[truncatedWords.length - 1].replace(/[.!?]$/, '');
        truncatedWords[truncatedWords.length - 1] = lastWord + '.';
        
        return truncatedWords.join(' ');
    }
}

/**
 * Output Formatter - Handles text and HTML formatting
 */
class OutputFormatter {
    constructor() {
        this.htmlTags = {
            'paragraph': 'p',
            'list_item': 'li',
            'heading': 'h2',
            'emphasis': 'em',
            'strong': 'strong'
        };
    }

    formatAsParagraphs(paragraphs, includeHtml = false) {
        if (!includeHtml) {
            return paragraphs.join('\n\n');
        }
        
        const htmlParagraphs = paragraphs.map(paragraph => 
            `<${this.htmlTags.paragraph}>${paragraph}</${this.htmlTags.paragraph}>`
        );
        
        return htmlParagraphs.join('\n');
    }

    formatAsList(items, listType = "unordered", includeHtml = false) {
        if (!includeHtml) {
            if (listType === "ordered") {
                return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
            } else {
                return items.map(item => `• ${item}`).join('\n');
            }
        }
        
        // HTML list formatting
        const listTag = listType === "ordered" ? "ol" : "ul";
        const htmlItems = items.map(item => 
            `<${this.htmlTags.list_item}>${item}</${this.htmlTags.list_item}>`
        );
        
        return `<${listTag}>\n${htmlItems.join('\n')}\n</${listTag}>`;
    }

    addRandomFormatting(text, formattingProbability = 0.1) {
        const words = text.split(' ');
        const formattedWords = [];
        
        for (const word of words) {
            if (Math.random() < formattingProbability) {
                const formatType = Math.random() < 0.5 ? 'strong' : 'emphasis';
                const tag = this.htmlTags[formatType];
                
                // Remove punctuation, format word, add punctuation back
                let cleanWord = word;
                let punctuation = '';
                
                if (/[.,!?;:]$/.test(word)) {
                    punctuation = word.slice(-1);
                    cleanWord = word.slice(0, -1);
                }
                
                const formattedWord = `<${tag}>${cleanWord}</${tag}>${punctuation}`;
                formattedWords.push(formattedWord);
            } else {
                formattedWords.push(word);
            }
        }
        
        return formattedWords.join(' ');
    }
}

/**
 * Main Lorem Generator Interface
 */
class LoremGenerator {
    constructor() {
        this.wordManager = new WordPoolManager();
        this.selector = new WeightedSelector();
        this.textGenerator = new TextGenerator(this.wordManager, this.selector);
        this.formatter = new OutputFormatter();
    }

    generate(outputType = "paragraphs", count = 3, theme = "lorem", options = {}) {
        // Set seed for reproducible output if provided
        if (options.seed !== undefined) {
            this.selector.setSeed(options.seed);
        }
        
        const result = {
            outputType,
            count,
            theme,
            content: '',
            metadata: {}
        };
        
        try {
            switch (outputType) {
                case "words":
                    const words = this.textGenerator.generateWordList(theme, count);
                    result.content = words.join(' ');
                    result.metadata.wordCount = words.length;
                    break;
                    
                case "sentences":
                    const sentences = [];
                    for (let i = 0; i < count; i++) {
                        const sentence = this.textGenerator.generateSentence(
                            theme, 
                            options.minWords || 4,
                            options.maxWords || 20
                        );
                        sentences.push(sentence);
                    }
                    
                    result.content = sentences.join(' ');
                    result.metadata.sentenceCount = sentences.length;
                    result.metadata.wordCount = result.content.split(' ').length;
                    break;
                    
                case "paragraphs":
                    const paragraphs = [];
                    for (let i = 0; i < count; i++) {
                        const paragraph = this.textGenerator.generateParagraph(
                            theme,
                            options.sentencesPerParagraph,
                            options.minSentences || 3,
                            options.maxSentences || 8
                        );
                        paragraphs.push(paragraph);
                    }
                    
                    let content = this.formatter.formatAsParagraphs(
                        paragraphs, 
                        options.includeHtml || false
                    );
                    
                    // Add random formatting if requested
                    if (options.randomFormatting) {
                        content = this.formatter.addRandomFormatting(content);
                    }
                    
                    result.content = content;
                    result.metadata.paragraphCount = paragraphs.length;
                    result.metadata.wordCount = paragraphs.join(' ').split(' ').length;
                    break;
                    
                case "list":
                    const items = [];
                    for (let i = 0; i < count; i++) {
                        let item;
                        if (options.listItemType === 'sentence') {
                            item = this.textGenerator.generateSentence(theme, 3, 12);
                        } else {
                            const words = this.textGenerator.generateWordList(theme, 
                                Math.floor(Math.random() * 5) + 2); // 2-6 words
                            item = words.join(' ');
                        }
                        items.push(item);
                    }
                    
                    result.content = this.formatter.formatAsList(
                        items,
                        options.listType || 'unordered',
                        options.includeHtml || false
                    );
                    
                    result.metadata.itemCount = items.length;
                    break;
                    
                default:
                    throw new Error(`Unsupported output type: ${outputType}`);
            }
                
        } catch (error) {
            result.error = error.message;
            result.content = "";
        }
        
        return result;
    }

    getAvailableThemes() {
        return this.wordManager.getAvailableThemes();
    }

    addCustomTheme(name, wordCategories, sentencePatterns = null) {
        this.wordManager.addCustomPool(name, wordCategories);
        
        if (sentencePatterns) {
            this.wordManager.sentencePatterns[name] = sentencePatterns;
        }
    }

    batchGenerate(requests) {
        const results = {};
        
        for (const [requestId, requestParams] of Object.entries(requests)) {
            try {
                results[requestId] = this.generate(...Object.values(requestParams));
            } catch (error) {
                results[requestId] = {
                    error: error.message,
                    content: '',
                    requestParams
                };
            }
        }
        
        return results;
    }

    // Utility methods for common use cases
    generateLoremIpsum(paragraphCount = 3, includeHtml = false) {
        return this.generate("paragraphs", paragraphCount, "lorem", {
            includeHtml,
            sentencesPerParagraph: 4,
            randomFormatting: includeHtml
        });
    }

    generateBaconIpsum(sentenceCount = 5) {
        return this.generate("sentences", sentenceCount, "bacon", {
            minWords: 6,
            maxWords: 12
        });
    }

    generateCorporateIpsum(paragraphCount = 2, includeHtml = true) {
        return this.generate("paragraphs", paragraphCount, "corporate", {
            includeHtml,
            sentencesPerParagraph: 3,
            randomFormatting: true
        });
    }

    generateSpaceIpsum(wordCount = 20) {
        return this.generate("words", wordCount, "space");
    }

    generateTechIpsum(listCount = 5, includeHtml = true) {
        return this.generate("list", listCount, "tech", {
            listItemType: 'sentence',
            includeHtml,
            listType: 'unordered'
        });
    }
}

// Export classes for use in other modules
export { 
    LoremGenerator, 
    WordPoolManager, 
    WeightedSelector, 
    TextGenerator, 
    OutputFormatter 
};
