/**
 * Advanced Word Counter
 * Comprehensive text analysis with Unicode support, advanced analytics, and readability scores
 */

/**
 * Text Preprocessor with Unicode normalization
 */
export class TextPreprocessor {
    constructor() {
        this.unicodeNormalizer = new UnicodeNormalizer();
        this.languageDetector = new LanguageDetector();
    }

    /**
     * Preprocess and normalize input text for accurate counting
     */
    preprocessText(rawText, options = {}) {
        // Step 1: Unicode normalization (NFC)
        let normalizedText = this.unicodeNormalizer.normalize(rawText, 'NFC');
        
        // Step 2: Handle different line endings
        normalizedText = this.normalizeLineEndings(normalizedText);
        
        // Step 3: Detect language for proper tokenization rules
        const language = this.languageDetector.detect(normalizedText);
        
        // Step 4: Remove invisible characters if specified
        if (options.removeInvisible) {
            normalizedText = this.removeInvisibleChars(normalizedText);
        }
        
        // Step 5: Handle special Unicode categories
        if (!options.preserveFormatting) {
            normalizedText = this.removeFormattingChars(normalizedText);
        }
        
        return {
            text: normalizedText,
            language: language,
            encoding: 'UTF-8',
            originalLength: rawText.length,
            normalizedLength: normalizedText.length
        };
    }

    /**
     * Convert all line endings to consistent format
     */
    normalizeLineEndings(text) {
        // Windows (\r\n) -> Unix (\n)
        // Mac Classic (\r) -> Unix (\n)
        return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    /**
     * Remove zero-width and other invisible Unicode characters
     */
    removeInvisibleChars(text) {
        const invisibleChars = [
            '\u200b',  // Zero Width Space
            '\u200c',  // Zero Width Non-Joiner
            '\u200d',  // Zero Width Joiner
            '\ufeff',  // Byte Order Mark
            '\u2060'   // Word Joiner
        ];
        
        let result = text;
        for (const char of invisibleChars) {
            result = result.replace(new RegExp(char, 'g'), '');
        }
        return result;
    }

    /**
     * Remove formatting characters
     */
    removeFormattingChars(text) {
        // Remove various Unicode formatting characters
        return text.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g, '');
    }
}

/**
 * Unicode Normalizer
 */
export class UnicodeNormalizer {
    normalize(text, form = 'NFC') {
        if (typeof text.normalize === 'function') {
            return text.normalize(form);
        }
        // Fallback for older browsers
        return text;
    }
}

/**
 * Language Detector (simplified)
 */
export class LanguageDetector {
    detect(text) {
        // Simple language detection based on character patterns
        const englishPattern = /[a-zA-Z]/g;
        const chinesePattern = /[\u4e00-\u9fff]/g;
        const arabicPattern = /[\u0600-\u06ff]/g;
        const cyrillicPattern = /[\u0400-\u04ff]/g;
        
        const englishMatches = (text.match(englishPattern) || []).length;
        const chineseMatches = (text.match(chinesePattern) || []).length;
        const arabicMatches = (text.match(arabicPattern) || []).length;
        const cyrillicMatches = (text.match(cyrillicPattern) || []).length;
        
        const maxMatches = Math.max(englishMatches, chineseMatches, arabicMatches, cyrillicMatches);
        
        if (maxMatches === englishMatches) return 'en';
        if (maxMatches === chineseMatches) return 'zh';
        if (maxMatches === arabicMatches) return 'ar';
        if (maxMatches === cyrillicMatches) return 'ru';
        
        return 'en'; // Default to English
    }
}

/**
 * Advanced Tokenization Engine
 */
export class AdvancedTokenizer {
    constructor() {
        this.wordBoundaries = this.loadWordBoundaryRules();
        this.sentenceBoundaries = this.loadSentenceBoundaryRules();
        this.punctuationChars = this.loadPunctuationRules();
    }

    /**
     * Advanced word tokenization with language-specific rules
     */
    tokenizeWords(text, language = 'en') {
        // Method 1: Simple whitespace splitting (baseline)
        if (language === 'simple') {
            return this.simpleWordSplit(text);
        }
        
        // Method 2: Unicode-aware tokenization
        const words = [];
        let currentWord = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charCategory = this.getUnicodeCategory(char);
            
            if (['L', 'M', 'N'].includes(charCategory)) { // Letters, Marks, Numbers
                currentWord += char;
            } else if (charCategory === 'P' && ["'", "-", "."].includes(char)) { // Contractions, hyphens
                if (this.isWordInternalPunct(char, currentWord, text, i)) {
                    currentWord += char;
                } else {
                    if (currentWord) {
                        words.push(currentWord);
                        currentWord = '';
                    }
                }
            } else { // Whitespace, punctuation, symbols
                if (currentWord) {
                    words.push(currentWord);
                    currentWord = '';
                }
            }
        }
        
        if (currentWord) { // Don't forget the last word
            words.push(currentWord);
        }
        
        return this.filterValidWords(words);
    }

    /**
     * Basic word counting by splitting on whitespace
     */
    simpleWordSplit(text) {
        // Handle multiple consecutive spaces
        const words = text.split(/\s+/);
        return words.filter(word => word.trim());
    }

    /**
     * Sentence boundary detection with abbreviation handling
     */
    tokenizeSentences(text) {
        const sentences = [];
        let currentSentence = '';
        
        let i = 0;
        while (i < text.length) {
            const char = text[i];
            currentSentence += char;
            
            // Check for sentence-ending punctuation
            if (['.', '!', '?'].includes(char)) {
                // Look ahead for potential continuation
                const nextChars = text.substring(i + 1, i + 4);
                
                if (this.isSentenceBoundary(currentSentence, nextChars)) {
                    sentences.push(currentSentence.trim());
                    currentSentence = '';
                }
            }
            
            i++;
        }
        
        if (currentSentence.trim()) {
            sentences.push(currentSentence.trim());
        }
        
        return sentences;
    }

    /**
     * Paragraph detection based on line breaks and formatting
     */
    tokenizeParagraphs(text) {
        // Split on double line breaks (common paragraph separator)
        const paragraphs = text.split(/\n\s*\n/);
        
        // Filter empty paragraphs and whitespace-only
        const validParagraphs = [];
        for (const para of paragraphs) {
            const cleaned = para.trim();
            if (cleaned && !this.isWhitespaceOnly(cleaned)) {
                validParagraphs.push(cleaned);
            }
        }
        
        return validParagraphs;
    }

    /**
     * Determine if punctuation marks end of sentence
     */
    isSentenceBoundary(sentence, nextChars) {
        const sentenceTrimmed = sentence.trim();
        
        // Common abbreviations that don't end sentences
        const abbreviations = new Set([
            'mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.',
            'vs.', 'etc.', 'i.e.', 'e.g.', 'a.m.', 'p.m.',
            'u.s.', 'u.k.', 'u.s.a.', 'inc.', 'ltd.', 'corp.'
        ]);
        
        // Check if sentence ends with known abbreviation
        for (const abbrev of abbreviations) {
            if (sentenceTrimmed.toLowerCase().endsWith(abbrev)) {
                return false;
            }
        }
        
        // Check if next character is uppercase (likely new sentence)
        if (nextChars && nextChars.trim()) {
            return /[A-Z]/.test(nextChars.trim()[0]);
        }
        
        return true;
    }

    /**
     * Get Unicode category for character
     */
    getUnicodeCategory(char) {
        const code = char.charCodeAt(0);
        
        // Letter categories
        if ((code >= 0x0041 && code <= 0x005A) || // A-Z
            (code >= 0x0061 && code <= 0x007A) || // a-z
            (code >= 0x00C0 && code <= 0x00D6) || // Latin Extended-A
            (code >= 0x00D8 && code <= 0x00F6) ||
            (code >= 0x00F8 && code <= 0x00FF) ||
            (code >= 0x0100 && code <= 0x017F) || // Latin Extended-A
            (code >= 0x0180 && code <= 0x024F)) { // Latin Extended-B
            return 'L';
        }
        
        // Number categories
        if (code >= 0x0030 && code <= 0x0039) { // 0-9
            return 'N';
        }
        
        // Punctuation categories
        if (['.', ',', ';', ':', '!', '?', '"', "'", '(', ')', '[', ']', '{', '}', '-', '_'].includes(char)) {
            return 'P';
        }
        
        // Whitespace
        if ([' ', '\t', '\n', '\r'].includes(char)) {
            return 'Z';
        }
        
        return 'S'; // Symbol
    }

    /**
     * Check if punctuation is word-internal
     */
    isWordInternalPunct(char, currentWord, text, position) {
        if (char === "'" && currentWord.length > 0) {
            // Apostrophe in contractions
            return true;
        }
        if (char === "-" && currentWord.length > 0) {
            // Hyphen in compound words
            return true;
        }
        if (char === "." && currentWord.length > 0 && /^\d+$/.test(currentWord)) {
            // Decimal point in numbers
            return true;
        }
        return false;
    }

    /**
     * Filter out invalid words
     */
    filterValidWords(words) {
        return words.filter(word => {
            // Remove words that are only punctuation or whitespace
            return word.trim() && !/^[^\w\u4e00-\u9fff]+$/.test(word);
        });
    }

    /**
     * Check if text is only whitespace
     */
    isWhitespaceOnly(text) {
        return /^\s*$/.test(text);
    }

    /**
     * Load word boundary rules (placeholder)
     */
    loadWordBoundaryRules() {
        return {};
    }

    /**
     * Load sentence boundary rules (placeholder)
     */
    loadSentenceBoundaryRules() {
        return {};
    }

    /**
     * Load punctuation rules (placeholder)
     */
    loadPunctuationRules() {
        return {};
    }
}

/**
 * Text Analytics Engine
 */
export class TextAnalytics {
    constructor() {
        this.stopWords = this.loadStopWords();
        this.readabilityFormulas = new ReadabilityCalculator();
    }

    /**
     * Calculate fundamental text statistics
     */
    calculateBasicStats(processedText, tokenizer) {
        const words = tokenizer.tokenizeWords(processedText.text);
        const sentences = tokenizer.tokenizeSentences(processedText.text);
        const paragraphs = tokenizer.tokenizeParagraphs(processedText.text);
        
        // Character counts
        const charCountWithSpaces = processedText.text.length;
        const charCountNoSpaces = processedText.text.replace(/\s/g, '').length;
        
        // Advanced character analysis
        const charStats = this.analyzeCharacterDistribution(processedText.text);
        
        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            charCountWithSpaces: charCountWithSpaces,
            charCountNoSpaces: charCountNoSpaces,
            averageWordsPerSentence: words.length / Math.max(sentences.length, 1),
            averageSentencesPerParagraph: sentences.length / Math.max(paragraphs.length, 1),
            characterDistribution: charStats
        };
    }

    /**
     * Comprehensive word frequency analysis
     */
    frequencyAnalysis(words, options = {}) {
        // Clean and normalize words
        const cleanedWords = [];
        for (const word of words) {
            // Convert to lowercase for frequency counting
            const wordLower = word.toLowerCase();
            
            // Remove punctuation from word boundaries
            const wordClean = this.stripPunctuation(wordLower);
            
            if (wordClean && wordClean.length >= (options.minLength || 1)) {
                cleanedWords.push(wordClean);
            }
        }
        
        // Count frequencies
        const frequencyMap = {};
        for (const word of cleanedWords) {
            frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        }
        
        // Calculate statistics
        const totalWords = cleanedWords.length;
        const uniqueWords = Object.keys(frequencyMap).length;
        
        // Filter stop words if requested
        let filteredFrequencyMap = frequencyMap;
        if (options.excludeStopWords) {
            filteredFrequencyMap = {};
            for (const [word, count] of Object.entries(frequencyMap)) {
                if (!this.stopWords.has(word)) {
                    filteredFrequencyMap[word] = count;
                }
            }
        }
        
        // Sort by frequency
        const sortedFrequencies = Object.entries(filteredFrequencyMap)
            .sort((a, b) => b[1] - a[1]);
        
        // Calculate percentages
        const frequencyStats = [];
        const topN = options.topN || 100;
        for (let i = 0; i < Math.min(sortedFrequencies.length, topN); i++) {
            const [word, count] = sortedFrequencies[i];
            const percentage = (count / totalWords) * 100;
            frequencyStats.push({
                word: word,
                count: count,
                percentage: percentage
            });
        }
        
        return {
            totalWords: totalWords,
            uniqueWords: uniqueWords,
            lexicalDiversity: uniqueWords / Math.max(totalWords, 1),
            topWords: frequencyStats,
            wordFrequencies: filteredFrequencyMap
        };
    }

    /**
     * Calculate multiple readability metrics
     */
    calculateReadabilityScores(textStats, text) {
        const words = textStats.wordCount;
        const sentences = textStats.sentenceCount;
        const syllables = this.countSyllables(text);
        
        const scores = {};
        
        // Flesch Reading Ease Score
        if (sentences > 0 && words > 0) {
            scores.fleschReadingEase = 206.835 - 
                (1.015 * (words / sentences)) - 
                (84.6 * (syllables / words));
        }
        
        // Flesch-Kincaid Grade Level
        if (sentences > 0 && words > 0) {
            scores.fleschKincaidGrade = 0.39 * (words / sentences) + 
                11.8 * (syllables / words) - 15.59;
        }
        
        // Automated Readability Index (ARI)
        const chars = textStats.charCountNoSpaces;
        if (sentences > 0 && words > 0) {
            scores.ari = 4.71 * (chars / words) + 
                0.5 * (words / sentences) - 21.43;
        }
        
        return scores;
    }

    /**
     * Estimate reading time based on average reading speed
     */
    estimateReadingTime(wordCount, readingSpeed = 200) {
        const minutes = wordCount / readingSpeed;
        
        return {
            minutes: Math.round(minutes * 10) / 10,
            seconds: Math.round(minutes * 60),
            readingSpeedWpm: readingSpeed,
            words: wordCount
        };
    }

    /**
     * Analyze character distribution
     */
    analyzeCharacterDistribution(text) {
        const stats = {
            letters: 0,
            digits: 0,
            spaces: 0,
            punctuation: 0,
            symbols: 0,
            uppercase: 0,
            lowercase: 0
        };
        
        for (const char of text) {
            if (/[a-zA-Z]/.test(char)) {
                stats.letters++;
                if (/[A-Z]/.test(char)) {
                    stats.uppercase++;
                } else {
                    stats.lowercase++;
                }
            } else if (/\d/.test(char)) {
                stats.digits++;
            } else if (/\s/.test(char)) {
                stats.spaces++;
            } else if (/[.,!?;:()"'\[\]{}]/.test(char)) {
                stats.punctuation++;
            } else {
                stats.symbols++;
            }
        }
        
        return stats;
    }

    /**
     * Count syllables in text (simplified)
     */
    countSyllables(text) {
        const words = text.toLowerCase().match(/[a-z]+/g) || [];
        let totalSyllables = 0;
        
        for (const word of words) {
            totalSyllables += this.countSyllablesInWord(word);
        }
        
        return totalSyllables;
    }

    /**
     * Count syllables in a single word
     */
    countSyllablesInWord(word) {
        if (word.length === 0) return 0;
        
        // Remove silent 'e' at the end
        let syllableCount = 0;
        let previousWasVowel = false;
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const isVowel = /[aeiouy]/.test(char);
            
            if (isVowel && !previousWasVowel) {
                syllableCount++;
            }
            
            previousWasVowel = isVowel;
        }
        
        // Handle silent 'e'
        if (word.endsWith('e') && syllableCount > 1) {
            syllableCount--;
        }
        
        // Every word has at least one syllable
        return Math.max(syllableCount, 1);
    }

    /**
     * Strip punctuation from word boundaries
     */
    stripPunctuation(word) {
        return word.replace(/^[^\w\u4e00-\u9fff]+|[^\w\u4e00-\u9fff]+$/g, '');
    }

    /**
     * Load stop words (simplified)
     */
    loadStopWords() {
        return new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'i', 'you', 'we', 'they', 'this',
            'these', 'those', 'have', 'had', 'do', 'does', 'did', 'can',
            'could', 'should', 'would', 'may', 'might', 'must', 'shall'
        ]);
    }
}

/**
 * Readability Calculator
 */
export class ReadabilityCalculator {
    constructor() {
        // Placeholder for readability formulas
    }
}

/**
 * Main Word Counter Interface
 */
export class AdvancedWordCounter {
    constructor() {
        this.preprocessor = new TextPreprocessor();
        this.tokenizer = new AdvancedTokenizer();
        this.analytics = new TextAnalytics();
    }

    /**
     * Main entry point for word counting with comprehensive analysis
     */
    countWords(text, options = {}) {
        // Preprocessing
        const processedText = this.preprocessor.preprocessText(text, options);
        
        // Basic tokenization
        const words = this.tokenizer.tokenizeWords(processedText.text);
        const sentences = this.tokenizer.tokenizeSentences(processedText.text);
        const paragraphs = this.tokenizer.tokenizeParagraphs(processedText.text);
        
        // Calculate basic statistics
        const basicStats = this.analytics.calculateBasicStats(processedText, this.tokenizer);
        
        // Advanced analytics if requested
        const advancedResults = {};
        
        if (options.includeFrequency !== false) {
            advancedResults.frequencyAnalysis = this.analytics.frequencyAnalysis(
                words, options.frequencyOptions || {}
            );
        }
        
        if (options.includeReadability) {
            advancedResults.readabilityScores = this.analytics.calculateReadabilityScores(
                basicStats, processedText.text
            );
        }
        
        if (options.includeReadingTime !== false) {
            advancedResults.readingTime = this.analytics.estimateReadingTime(
                basicStats.wordCount, options.readingSpeed || 200
            );
        }
        
        return {
            basicStatistics: basicStats,
            tokenizationResults: {
                words: words.slice(0, options.sampleWords || 50), // Sample for display
                sentences: sentences.slice(0, options.sampleSentences || 10),
                paragraphs: paragraphs.length
            },
            advancedAnalytics: advancedResults,
            processingInfo: {
                language: processedText.language,
                originalLength: processedText.originalLength,
                processedLength: processedText.normalizedLength,
                optionsUsed: options
            }
        };
    }

    /**
     * Process multiple documents
     */
    batchCountDocuments(documents) {
        const results = {};
        for (const [docId, content] of Object.entries(documents)) {
            results[docId] = this.countWords(content);
        }
        return results;
    }

    /**
     * Real-time processing with incremental updates
     */
    realTimeCount(textStream) {
        const accumulatedStats = {
            wordCount: 0,
            charCount: 0,
            sentenceCount: 0
        };
        
        let buffer = '';
        
        for (const textChunk of textStream) {
            buffer += textChunk;
            
            // Process complete words only
            const { completeText, remainingBuffer } = this.extractCompleteText(buffer);
            buffer = remainingBuffer;
            
            if (completeText) {
                const chunkStats = this.countWords(completeText, { basicOnly: true });
                accumulatedStats.wordCount += chunkStats.basicStatistics.wordCount;
                accumulatedStats.charCount += chunkStats.basicStatistics.charCountWithSpaces;
                accumulatedStats.sentenceCount += chunkStats.basicStatistics.sentenceCount;
            }
        }
        
        return accumulatedStats;
    }

    /**
     * Extract complete text from buffer
     */
    extractCompleteText(buffer) {
        // Find last complete word boundary
        const lastSpaceIndex = buffer.lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
            return { completeText: '', remainingBuffer: buffer };
        }
        
        const completeText = buffer.substring(0, lastSpaceIndex);
        const remainingBuffer = buffer.substring(lastSpaceIndex + 1);
        
        return { completeText, remainingBuffer };
    }
}

/**
 * Utility functions for word counting
 */
export class WordCounterUtils {
    /**
     * Get reading time description
     */
    static getReadingTimeDescription(minutes) {
        if (minutes < 1) {
            return 'Less than 1 minute';
        } else if (minutes < 2) {
            return 'About 1 minute';
        } else if (minutes < 60) {
            return `About ${Math.round(minutes)} minutes`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = Math.round(minutes % 60);
            if (remainingMinutes === 0) {
                return `About ${hours} hour${hours > 1 ? 's' : ''}`;
            } else {
                return `About ${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
            }
        }
    }

    /**
     * Get readability level description
     */
    static getReadabilityLevel(score, type = 'flesch') {
        if (type === 'flesch') {
            if (score >= 90) return 'Very Easy';
            if (score >= 80) return 'Easy';
            if (score >= 70) return 'Fairly Easy';
            if (score >= 60) return 'Standard';
            if (score >= 50) return 'Fairly Difficult';
            if (score >= 30) return 'Difficult';
            return 'Very Difficult';
        } else if (type === 'grade') {
            if (score <= 6) return 'Elementary';
            if (score <= 9) return 'Middle School';
            if (score <= 12) return 'High School';
            if (score <= 16) return 'College';
            return 'Graduate';
        }
        return 'Unknown';
    }

    /**
     * Format number with commas
     */
    static formatNumber(num) {
        return num.toLocaleString();
    }

    /**
     * Get text statistics summary
     */
    static getTextSummary(stats) {
        return {
            words: this.formatNumber(stats.wordCount),
            characters: this.formatNumber(stats.charCountWithSpaces),
            charactersNoSpaces: this.formatNumber(stats.charCountNoSpaces),
            sentences: this.formatNumber(stats.sentenceCount),
            paragraphs: this.formatNumber(stats.paragraphCount),
            avgWordsPerSentence: Math.round(stats.averageWordsPerSentence * 10) / 10,
            avgSentencesPerParagraph: Math.round(stats.averageSentencesPerParagraph * 10) / 10
        };
    }
}
