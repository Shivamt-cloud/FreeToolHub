/**
 * Flashcard Generator
 * Advanced flashcard creation, study modes, and spaced repetition for effective learning
 */
class FlashcardGenerator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.flashcards = [];
        this.decks = [];
        this.currentDeck = null;
        this.studySession = null;
        this.studyMode = 'review'; // review, learn, test
        this.spacedRepetition = true;
        
        // Study modes
        this.studyModes = {
            'review': {
                name: 'Review Mode',
                description: 'Review all cards in the deck',
                showAnswer: true,
                timer: false
            },
            'learn': {
                name: 'Learn Mode',
                description: 'Learn new cards with spaced repetition',
                showAnswer: true,
                timer: true
            },
            'test': {
                name: 'Test Mode',
                description: 'Test your knowledge without hints',
                showAnswer: false,
                timer: true
            },
            'cram': {
                name: 'Cram Mode',
                description: 'Quick review of all cards',
                showAnswer: true,
                timer: false
            }
        };
        
        // Difficulty levels
        this.difficultyLevels = {
            'easy': { name: 'Easy', interval: 1, factor: 2.5 },
            'medium': { name: 'Medium', interval: 1, factor: 2.0 },
            'hard': { name: 'Hard', interval: 1, factor: 1.3 }
        };
        
        // Card types
        this.cardTypes = {
            'basic': { name: 'Basic', fields: ['front', 'back'] },
            'cloze': { name: 'Cloze Deletion', fields: ['text', 'hint'] },
            'image': { name: 'Image Card', fields: ['front', 'back', 'image'] },
            'audio': { name: 'Audio Card', fields: ['front', 'back', 'audio'] },
            'multiple_choice': { name: 'Multiple Choice', fields: ['question', 'correct', 'options'] }
        };
        
        // Study statistics
        this.studyStats = {
            totalCards: 0,
            studiedCards: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            studyTime: 0,
            streak: 0,
            lastStudyDate: null
        };
    }

    /**
     * Create a new flashcard deck
     */
    createDeck(deckData) {
        try {
            const deck = {
                id: Date.now(),
                name: deckData.name || 'New Deck',
                description: deckData.description || '',
                subject: deckData.subject || '',
                color: deckData.color || '#3B82F6',
                tags: deckData.tags || [],
                isPublic: deckData.isPublic || false,
                createdAt: new Date().toISOString(),
                lastStudied: null,
                studyCount: 0,
                averageScore: 0
            };

            this.decks.push(deck);
            this.addToHistory('create_deck', deckData, deck);
            
            return {
                success: true,
                deck: deck,
                message: 'Deck created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add a flashcard to a deck
     */
    addFlashcard(flashcardData) {
        try {
            const flashcard = {
                id: Date.now(),
                deckId: flashcardData.deckId,
                type: flashcardData.type || 'basic',
                front: flashcardData.front || '',
                back: flashcardData.back || '',
                image: flashcardData.image || '',
                audio: flashcardData.audio || '',
                hint: flashcardData.hint || '',
                question: flashcardData.question || '',
                correct: flashcardData.correct || '',
                options: flashcardData.options || [],
                tags: flashcardData.tags || [],
                difficulty: flashcardData.difficulty || 'medium',
                interval: 1,
                repetitions: 0,
                easeFactor: 2.5,
                nextReview: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                lastStudied: null,
                studyCount: 0,
                correctCount: 0
            };

            this.flashcards.push(flashcard);
            this.addToHistory('add_flashcard', flashcardData, flashcard);
            
            return {
                success: true,
                flashcard: flashcard,
                message: 'Flashcard added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Start a study session
     */
    startStudySession(deckId, mode = 'review') {
        try {
            const deck = this.decks.find(d => d.id === deckId);
            if (!deck) {
                throw new Error('Deck not found');
            }

            const cards = this.flashcards.filter(card => card.deckId === deckId);
            if (cards.length === 0) {
                throw new Error('No cards in this deck');
            }

            // Filter cards based on study mode
            let studyCards = [];
            switch (mode) {
                case 'learn':
                    studyCards = cards.filter(card => card.repetitions === 0);
                    break;
                case 'review':
                    studyCards = cards.filter(card => 
                        new Date(card.nextReview) <= new Date()
                    );
                    break;
                case 'test':
                    studyCards = cards;
                    break;
                case 'cram':
                    studyCards = cards;
                    break;
                default:
                    studyCards = cards;
            }

            if (studyCards.length === 0) {
                throw new Error('No cards available for study in this mode');
            }

            // Shuffle cards for random order
            studyCards = this.shuffleArray(studyCards);

            this.studySession = {
                id: Date.now(),
                deckId: deckId,
                mode: mode,
                cards: studyCards,
                currentCardIndex: 0,
                startTime: new Date().toISOString(),
                answers: [],
                isActive: true
            };

            this.studyMode = mode;
            this.addToHistory('start_study_session', { deckId, mode }, this.studySession);
            
            return {
                success: true,
                session: this.studySession,
                message: `Study session started with ${studyCards.length} cards`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get current card
     */
    getCurrentCard() {
        if (!this.studySession || !this.studySession.isActive) {
            return null;
        }

        const currentIndex = this.studySession.currentCardIndex;
        const cards = this.studySession.cards;
        
        if (currentIndex >= cards.length) {
            return null; // Session completed
        }

        return cards[currentIndex];
    }

    /**
     * Answer a card
     */
    answerCard(cardId, answer, difficulty = 'medium') {
        try {
            if (!this.studySession || !this.studySession.isActive) {
                throw new Error('No active study session');
            }

            const card = this.flashcards.find(c => c.id === cardId);
            if (!card) {
                throw new Error('Card not found');
            }

            const isCorrect = this.checkAnswer(card, answer);
            const answerData = {
                cardId: cardId,
                answer: answer,
                isCorrect: isCorrect,
                difficulty: difficulty,
                timestamp: new Date().toISOString()
            };

            this.studySession.answers.push(answerData);

            // Update card statistics
            card.lastStudied = new Date().toISOString();
            card.studyCount++;
            if (isCorrect) {
                card.correctCount++;
            }

            // Update spaced repetition algorithm
            if (this.spacedRepetition) {
                this.updateSpacedRepetition(card, isCorrect, difficulty);
            }

            // Update study statistics
            this.updateStudyStats(isCorrect);

            this.addToHistory('answer_card', { cardId, answer, isCorrect }, answerData);
            
            return {
                success: true,
                isCorrect: isCorrect,
                answer: answerData,
                message: isCorrect ? 'Correct!' : 'Incorrect. Try again.'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if answer is correct
     */
    checkAnswer(card, answer) {
        switch (card.type) {
            case 'basic':
                return card.back.toLowerCase().trim() === answer.toLowerCase().trim();
            case 'cloze':
                return card.hint.toLowerCase().trim() === answer.toLowerCase().trim();
            case 'multiple_choice':
                return card.correct.toLowerCase().trim() === answer.toLowerCase().trim();
            default:
                return card.back.toLowerCase().trim() === answer.toLowerCase().trim();
        }
    }

    /**
     * Update spaced repetition algorithm
     */
    updateSpacedRepetition(card, isCorrect, difficulty) {
        if (isCorrect) {
            card.repetitions++;
            
            if (card.repetitions === 1) {
                card.interval = 1;
            } else if (card.repetitions === 2) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            
            // Update ease factor based on difficulty
            const difficultyFactor = this.difficultyLevels[difficulty].factor;
            card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - difficultyFactor) * (0.08 + (5 - difficultyFactor) * 0.02)));
        } else {
            card.repetitions = 0;
            card.interval = 1;
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
        }
        
        // Set next review date
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + card.interval);
        card.nextReview = nextReview.toISOString();
    }

    /**
     * Move to next card
     */
    nextCard() {
        if (!this.studySession || !this.studySession.isActive) {
            return { success: false, error: 'No active study session' };
        }

        this.studySession.currentCardIndex++;
        
        if (this.studySession.currentCardIndex >= this.studySession.cards.length) {
            return this.completeStudySession();
        }

        return {
            success: true,
            currentCard: this.getCurrentCard(),
            progress: this.getStudyProgress()
        };
    }

    /**
     * Complete study session
     */
    completeStudySession() {
        if (!this.studySession) {
            return { success: false, error: 'No active study session' };
        }

        const endTime = new Date();
        const startTime = new Date(this.studySession.startTime);
        const studyTime = Math.round((endTime - startTime) / 1000 / 60); // minutes

        const sessionResults = {
            sessionId: this.studySession.id,
            deckId: this.studySession.deckId,
            mode: this.studySession.mode,
            totalCards: this.studySession.cards.length,
            studiedCards: this.studySession.answers.length,
            correctAnswers: this.studySession.answers.filter(a => a.isCorrect).length,
            studyTime: studyTime,
            averageScore: this.studySession.answers.length > 0 ? 
                (this.studySession.answers.filter(a => a.isCorrect).length / this.studySession.answers.length) * 100 : 0,
            completedAt: endTime.toISOString()
        };

        // Update deck statistics
        const deck = this.decks.find(d => d.id === this.studySession.deckId);
        if (deck) {
            deck.lastStudied = endTime.toISOString();
            deck.studyCount++;
            deck.averageScore = sessionResults.averageScore;
        }

        // Update study statistics
        this.studyStats.studyTime += studyTime;
        this.studyStats.studiedCards += sessionResults.studiedCards;
        this.studyStats.correctAnswers += sessionResults.correctAnswers;
        this.studyStats.incorrectAnswers += (sessionResults.studiedCards - sessionResults.correctAnswers);
        this.studyStats.lastStudyDate = endTime.toISOString();

        this.studySession.isActive = false;
        this.addToHistory('complete_study_session', this.studySession, sessionResults);
        
        return {
            success: true,
            results: sessionResults,
            message: 'Study session completed successfully'
        };
    }

    /**
     * Get study progress
     */
    getStudyProgress() {
        if (!this.studySession || !this.studySession.isActive) {
            return { current: 0, total: 0, percentage: 0 };
        }

        const current = this.studySession.currentCardIndex + 1;
        const total = this.studySession.cards.length;
        const percentage = Math.round((current / total) * 100);

        return { current, total, percentage };
    }

    /**
     * Get cards due for review
     */
    getCardsDueForReview(deckId = null) {
        const now = new Date();
        let cards = this.flashcards;
        
        if (deckId) {
            cards = cards.filter(card => card.deckId === deckId);
        }
        
        return cards.filter(card => new Date(card.nextReview) <= now);
    }

    /**
     * Get study statistics
     */
    getStudyStatistics(deckId = null) {
        let cards = this.flashcards;
        if (deckId) {
            cards = cards.filter(card => card.deckId === deckId);
        }

        const totalCards = cards.length;
        const studiedCards = cards.filter(card => card.studyCount > 0).length;
        const correctAnswers = cards.reduce((sum, card) => sum + card.correctCount, 0);
        const totalAnswers = cards.reduce((sum, card) => sum + card.studyCount, 0);
        const averageScore = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

        const difficultyStats = {};
        Object.keys(this.difficultyLevels).forEach(difficulty => {
            const difficultyCards = cards.filter(card => card.difficulty === difficulty);
            difficultyStats[difficulty] = {
                total: difficultyCards.length,
                studied: difficultyCards.filter(card => card.studyCount > 0).length,
                averageScore: difficultyCards.length > 0 ? 
                    (difficultyCards.reduce((sum, card) => sum + card.correctCount, 0) / 
                     difficultyCards.reduce((sum, card) => sum + card.studyCount, 0)) * 100 : 0
            };
        });

        return {
            totalCards,
            studiedCards,
            correctAnswers,
            totalAnswers,
            averageScore: Math.round(averageScore * 100) / 100,
            studyTime: this.studyStats.studyTime,
            streak: this.studyStats.streak,
            lastStudyDate: this.studyStats.lastStudyDate,
            difficultyStats
        };
    }

    /**
     * Search flashcards
     */
    searchFlashcards(query, deckId = null) {
        let cards = this.flashcards;
        if (deckId) {
            cards = cards.filter(card => card.deckId === deckId);
        }

        const searchQuery = query.toLowerCase();
        return cards.filter(card => 
            card.front.toLowerCase().includes(searchQuery) ||
            card.back.toLowerCase().includes(searchQuery) ||
            card.question.toLowerCase().includes(searchQuery) ||
            card.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }

    /**
     * Export deck
     */
    exportDeck(deckId, format = 'json') {
        try {
            const deck = this.decks.find(d => d.id === deckId);
            if (!deck) {
                throw new Error('Deck not found');
            }

            const cards = this.flashcards.filter(card => card.deckId === deckId);
            const data = {
                deck: deck,
                cards: cards,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            if (format === 'csv') {
                return this.exportToCSV(data);
            } else {
                return {
                    success: true,
                    data: data,
                    format: format
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
     * Export to CSV
     */
    exportToCSV(data) {
        const headers = ['Front', 'Back', 'Type', 'Difficulty', 'Tags', 'Study Count', 'Correct Count'];
        const rows = data.cards.map(card => [
            card.front,
            card.back,
            card.type,
            card.difficulty,
            card.tags.join(';'),
            card.studyCount,
            card.correctCount
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        return {
            success: true,
            content: csvContent,
            format: 'csv'
        };
    }

    /**
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Update study statistics
     */
    updateStudyStats(isCorrect) {
        if (isCorrect) {
            this.studyStats.correctAnswers++;
            this.studyStats.streak++;
        } else {
            this.studyStats.incorrectAnswers++;
            this.studyStats.streak = 0;
        }
        this.studyStats.studiedCards++;
    }

    /**
     * Get study modes
     */
    getStudyModes() {
        return this.studyModes;
    }

    /**
     * Get difficulty levels
     */
    getDifficultyLevels() {
        return this.difficultyLevels;
    }

    /**
     * Get card types
     */
    getCardTypes() {
        return this.cardTypes;
    }

    /**
     * Get decks
     */
    getDecks() {
        return this.decks;
    }

    /**
     * Get flashcards by deck
     */
    getFlashcardsByDeck(deckId) {
        return this.flashcards.filter(card => card.deckId === deckId);
    }

    /**
     * Delete deck
     */
    deleteDeck(deckId) {
        const deckIndex = this.decks.findIndex(d => d.id === deckId);
        if (deckIndex === -1) {
            return { success: false, error: 'Deck not found' };
        }

        // Delete all cards in the deck
        this.flashcards = this.flashcards.filter(card => card.deckId !== deckId);
        
        // Delete the deck
        const deletedDeck = this.decks.splice(deckIndex, 1)[0];
        this.addToHistory('delete_deck', { deckId }, deletedDeck);
        
        return {
            success: true,
            deck: deletedDeck,
            message: 'Deck deleted successfully'
        };
    }

    /**
     * Delete flashcard
     */
    deleteFlashcard(cardId) {
        const cardIndex = this.flashcards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) {
            return { success: false, error: 'Card not found' };
        }

        const deletedCard = this.flashcards.splice(cardIndex, 1)[0];
        this.addToHistory('delete_flashcard', { cardId }, deletedCard);
        
        return {
            success: true,
            card: deletedCard,
            message: 'Flashcard deleted successfully'
        };
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
        this.flashcards = [];
        this.decks = [];
        this.studySession = null;
        this.studyStats = {
            totalCards: 0,
            studiedCards: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            studyTime: 0,
            streak: 0,
            lastStudyDate: null
        };
    }
}
