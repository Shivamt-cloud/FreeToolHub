/**
 * Note-Taking & Summarizer
 * Advanced text summarization, key points extraction, and note organization
 */
class NoteTaker {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.notes = [];
        this.currentNote = null;
        
        // Summarization settings
        this.summarizationModes = {
            brief: { name: 'Brief Summary', ratio: 0.1, maxSentences: 3 },
            standard: { name: 'Standard Summary', ratio: 0.2, maxSentences: 5 },
            detailed: { name: 'Detailed Summary', ratio: 0.3, maxSentences: 8 },
            comprehensive: { name: 'Comprehensive Summary', ratio: 0.4, maxSentences: 12 }
        };
        
        // Key points extraction settings
        this.keyPointSettings = {
            minLength: 3,
            maxLength: 200,
            minScore: 0.3,
            maxPoints: 10
        };
        
        // Text analysis settings
        this.analysisSettings = {
            wordCount: true,
            sentenceCount: true,
            paragraphCount: true,
            readingTime: true,
            complexityScore: true,
            keywordExtraction: true
        };
    }

    /**
     * Summarize text
     */
    summarizeText(text, mode = 'standard') {
        try {
            if (!text || text.trim().length === 0) {
                throw new Error('Please provide text to summarize');
            }

            const settings = this.summarizationModes[mode];
            if (!settings) {
                throw new Error('Invalid summarization mode');
            }

            const sentences = this.extractSentences(text);
            const wordCount = this.countWords(text);
            const targetSentences = Math.min(
                Math.max(1, Math.floor(sentences.length * settings.ratio)),
                settings.maxSentences
            );

            if (sentences.length <= targetSentences) {
                return {
                    success: true,
                    summary: text,
                    originalLength: wordCount,
                    summaryLength: wordCount,
                    compressionRatio: 1.0,
                    mode: settings.name,
                    message: 'Text is already concise'
                };
            }

            // Score sentences based on importance
            const scoredSentences = this.scoreSentences(sentences, text);
            
            // Select top sentences
            const selectedSentences = scoredSentences
                .sort((a, b) => b.score - a.score)
                .slice(0, targetSentences)
                .sort((a, b) => a.originalIndex - b.originalIndex)
                .map(s => s.sentence);

            const summary = selectedSentences.join(' ');
            const summaryWordCount = this.countWords(summary);
            const compressionRatio = summaryWordCount / wordCount;

            const result = {
                success: true,
                summary: summary,
                originalLength: wordCount,
                summaryLength: summaryWordCount,
                compressionRatio: Math.round(compressionRatio * 100) / 100,
                mode: settings.name,
                sentencesUsed: selectedSentences.length,
                totalSentences: sentences.length,
                message: `Summarized from ${wordCount} to ${summaryWordCount} words (${Math.round(compressionRatio * 100)}% reduction)`
            };

            this.addToHistory('summarize', { text: text.substring(0, 100) + '...', mode }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Extract key points
     */
    extractKeyPoints(text, maxPoints = 5) {
        try {
            if (!text || text.trim().length === 0) {
                throw new Error('Please provide text to analyze');
            }

            const sentences = this.extractSentences(text);
            const keyPoints = [];
            
            // Extract key phrases and concepts
            const keyPhrases = this.extractKeyPhrases(text);
            const importantSentences = this.findImportantSentences(sentences, text);
            
            // Combine and rank key points
            const allPoints = [
                ...keyPhrases.map(phrase => ({ text: phrase, type: 'phrase', score: 0.8 })),
                ...importantSentences.map(sentence => ({ text: sentence, type: 'sentence', score: 0.9 }))
            ];

            // Remove duplicates and rank
            const uniquePoints = this.removeDuplicatePoints(allPoints);
            const rankedPoints = uniquePoints
                .sort((a, b) => b.score - a.score)
                .slice(0, maxPoints);

            const result = {
                success: true,
                keyPoints: rankedPoints,
                totalPoints: rankedPoints.length,
                originalLength: this.countWords(text),
                message: `Extracted ${rankedPoints.length} key points`
            };

            this.addToHistory('extract_key_points', { text: text.substring(0, 100) + '...', maxPoints }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Analyze text
     */
    analyzeText(text) {
        try {
            if (!text || text.trim().length === 0) {
                throw new Error('Please provide text to analyze');
            }

            const wordCount = this.countWords(text);
            const sentenceCount = this.extractSentences(text).length;
            const paragraphCount = this.countParagraphs(text);
            const readingTime = this.calculateReadingTime(wordCount);
            const complexityScore = this.calculateComplexityScore(text);
            const keywords = this.extractKeywords(text);
            const readabilityScore = this.calculateReadabilityScore(text);

            const result = {
                success: true,
                analysis: {
                    wordCount: wordCount,
                    sentenceCount: sentenceCount,
                    paragraphCount: paragraphCount,
                    averageWordsPerSentence: Math.round(wordCount / sentenceCount * 10) / 10,
                    averageSentencesPerParagraph: Math.round(sentenceCount / paragraphCount * 10) / 10,
                    readingTime: readingTime,
                    complexityScore: complexityScore,
                    readabilityScore: readabilityScore,
                    keywords: keywords,
                    textLength: text.length,
                    characterCount: text.length,
                    nonWhitespaceCharacters: text.replace(/\s/g, '').length
                },
                message: `Analyzed ${wordCount} words in ${sentenceCount} sentences`
            };

            this.addToHistory('analyze', { text: text.substring(0, 100) + '...' }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create structured notes
     */
    createStructuredNotes(text, title = 'Untitled Note') {
        try {
            if (!text || text.trim().length === 0) {
                throw new Error('Please provide text for notes');
            }

            const analysis = this.analyzeText(text);
            const summary = this.summarizeText(text, 'standard');
            const keyPoints = this.extractKeyPoints(text, 8);

            if (!analysis.success || !summary.success || !keyPoints.success) {
                throw new Error('Failed to process text for structured notes');
            }

            const structuredNote = {
                id: Date.now(),
                title: title,
                createdAt: new Date().toISOString(),
                originalText: text,
                summary: summary.summary,
                keyPoints: keyPoints.keyPoints,
                analysis: analysis.analysis,
                tags: this.generateTags(text),
                category: this.categorizeText(text)
            };

            this.notes.push(structuredNote);
            this.currentNote = structuredNote;

            const result = {
                success: true,
                note: structuredNote,
                message: 'Structured notes created successfully'
            };

            this.addToHistory('create_notes', { title, text: text.substring(0, 100) + '...' }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Extract sentences from text
     */
    extractSentences(text) {
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    /**
     * Score sentences for importance
     */
    scoreSentences(sentences, originalText) {
        return sentences.map((sentence, index) => {
            let score = 0;
            
            // Position score (first and last sentences are more important)
            if (index === 0) score += 0.3;
            if (index === sentences.length - 1) score += 0.2;
            
            // Length score (moderate length sentences are preferred)
            const wordCount = this.countWords(sentence);
            if (wordCount >= 8 && wordCount <= 25) score += 0.2;
            
            // Keyword density score
            const keywords = this.extractKeywords(originalText);
            const keywordCount = keywords.filter(keyword => 
                sentence.toLowerCase().includes(keyword.toLowerCase())
            ).length;
            score += keywordCount * 0.1;
            
            // Question score (questions are often important)
            if (sentence.includes('?')) score += 0.1;
            
            // Transition words score
            const transitionWords = ['however', 'therefore', 'moreover', 'furthermore', 'consequently', 'thus', 'hence'];
            const hasTransition = transitionWords.some(word => 
                sentence.toLowerCase().includes(word)
            );
            if (hasTransition) score += 0.15;
            
            return {
                sentence: sentence,
                score: Math.min(score, 1.0),
                originalIndex: index,
                wordCount: wordCount
            };
        });
    }

    /**
     * Extract key phrases
     */
    extractKeyPhrases(text) {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
        
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        const sortedWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, freq]) => word);
        
        return sortedWords;
    }

    /**
     * Find important sentences
     */
    findImportantSentences(sentences, originalText) {
        const keywords = this.extractKeywords(originalText);
        
        return sentences
            .filter(sentence => {
                const wordCount = this.countWords(sentence);
                const keywordMatches = keywords.filter(keyword => 
                    sentence.toLowerCase().includes(keyword.toLowerCase())
                ).length;
                
                return wordCount >= 5 && keywordMatches >= 1;
            })
            .slice(0, 5);
    }

    /**
     * Remove duplicate points
     */
    removeDuplicatePoints(points) {
        const seen = new Set();
        return points.filter(point => {
            const key = point.text.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    /**
     * Count words
     */
    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Count paragraphs
     */
    countParagraphs(text) {
        return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    }

    /**
     * Calculate reading time
     */
    calculateReadingTime(wordCount) {
        const wordsPerMinute = 200; // Average reading speed
        const minutes = wordCount / wordsPerMinute;
        return {
            minutes: Math.round(minutes * 10) / 10,
            formatted: minutes < 1 ? 
                `${Math.round(minutes * 60)} seconds` : 
                `${Math.round(minutes)} minutes`
        };
    }

    /**
     * Calculate complexity score
     */
    calculateComplexityScore(text) {
        const sentences = this.extractSentences(text);
        const words = text.split(/\s+/);
        
        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = this.calculateAverageSyllables(words);
        
        // Simple complexity score (0-100)
        const complexity = (avgWordsPerSentence * 2) + (avgSyllablesPerWord * 10);
        return Math.min(Math.round(complexity), 100);
    }

    /**
     * Calculate average syllables
     */
    calculateAverageSyllables(words) {
        let totalSyllables = 0;
        words.forEach(word => {
            totalSyllables += this.countSyllables(word);
        });
        return totalSyllables / words.length;
    }

    /**
     * Count syllables in a word
     */
    countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    /**
     * Calculate readability score
     */
    calculateReadabilityScore(text) {
        const sentences = this.extractSentences(text);
        const words = text.split(/\s+/);
        const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);
        
        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        
        // Flesch Reading Ease Score
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        
        return {
            score: Math.max(0, Math.min(100, Math.round(score))),
            level: this.getReadabilityLevel(score)
        };
    }

    /**
     * Get readability level
     */
    getReadabilityLevel(score) {
        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Difficult';
        if (score >= 30) return 'Difficult';
        return 'Very Difficult';
    }

    /**
     * Extract keywords
     */
    extractKeywords(text) {
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
        ]);
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word));
        
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        return Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, freq]) => word);
    }

    /**
     * Generate tags for text
     */
    generateTags(text) {
        const keywords = this.extractKeywords(text);
        const categories = this.categorizeText(text);
        
        return [...keywords.slice(0, 5), categories].filter(tag => tag);
    }

    /**
     * Categorize text
     */
    categorizeText(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('research') || lowerText.includes('study') || lowerText.includes('analysis')) {
            return 'Research';
        }
        if (lowerText.includes('business') || lowerText.includes('company') || lowerText.includes('market')) {
            return 'Business';
        }
        if (lowerText.includes('technology') || lowerText.includes('software') || lowerText.includes('digital')) {
            return 'Technology';
        }
        if (lowerText.includes('education') || lowerText.includes('learning') || lowerText.includes('student')) {
            return 'Education';
        }
        if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('treatment')) {
            return 'Health';
        }
        
        return 'General';
    }

    /**
     * Get all notes
     */
    getNotes() {
        return this.notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    /**
     * Get note by ID
     */
    getNoteById(id) {
        return this.notes.find(note => note.id === id);
    }

    /**
     * Delete note
     */
    deleteNote(id) {
        const index = this.notes.findIndex(note => note.id === id);
        if (index !== -1) {
            this.notes.splice(index, 1);
            return { success: true, message: 'Note deleted successfully' };
        }
        return { success: false, error: 'Note not found' };
    }

    /**
     * Search notes
     */
    searchNotes(query) {
        const lowerQuery = query.toLowerCase();
        return this.notes.filter(note => 
            note.title.toLowerCase().includes(lowerQuery) ||
            note.summary.toLowerCase().includes(lowerQuery) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Add to history
     */
    addToHistory(operation, input, output) {
        this.history.push({
            timestamp: new Date().toISOString(),
            operation: operation,
            input: input,
            output: output
        });

        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
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
        this.notes = [];
        this.currentNote = null;
    }
}
