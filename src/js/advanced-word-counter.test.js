/**
 * Test suite for Advanced Word Counter
 * Tests all word counting functionality and analytics
 */

import { AdvancedWordCounter, WordCounterUtils } from './advanced-word-counter.js';

/**
 * Test the Advanced Word Counter
 */
export function testAdvancedWordCounter() {
    console.log('=== Advanced Word Counter Test ===');
    
    try {
        const counter = new AdvancedWordCounter();
        const testText = 'Hello world! This is a test sentence. It has multiple sentences and should be counted correctly.';
        
        // Test basic word counting
        console.log('\n--- Testing Basic Word Counting ---');
        const result = counter.countWords(testText);
        
        console.log('Input text:', testText);
        console.log('Word count:', result.basicStatistics.wordCount);
        console.log('Character count (with spaces):', result.basicStatistics.charCountWithSpaces);
        console.log('Character count (no spaces):', result.basicStatistics.charCountNoSpaces);
        console.log('Sentence count:', result.basicStatistics.sentenceCount);
        console.log('Paragraph count:', result.basicStatistics.paragraphCount);
        console.log('Average words per sentence:', result.basicStatistics.averageWordsPerSentence);
        
        // Test advanced analytics
        console.log('\n--- Testing Advanced Analytics ---');
        const advancedResult = counter.countWords(testText, {
            includeFrequency: true,
            includeReadability: true,
            includeReadingTime: true
        });
        
        console.log('Frequency analysis:');
        console.log('  Total words:', advancedResult.advancedAnalytics.frequencyAnalysis.totalWords);
        console.log('  Unique words:', advancedResult.advancedAnalytics.frequencyAnalysis.uniqueWords);
        console.log('  Lexical diversity:', advancedResult.advancedAnalytics.frequencyAnalysis.lexicalDiversity);
        console.log('  Top words:', advancedResult.advancedAnalytics.frequencyAnalysis.topWords.slice(0, 5));
        
        console.log('Reading time:');
        console.log('  Minutes:', advancedResult.advancedAnalytics.readingTime.minutes);
        console.log('  Seconds:', advancedResult.advancedAnalytics.readingTime.seconds);
        console.log('  Reading speed (WPM):', advancedResult.advancedAnalytics.readingTime.readingSpeedWpm);
        
        if (advancedResult.advancedAnalytics.readabilityScores) {
            console.log('Readability scores:');
            console.log('  Flesch Reading Ease:', advancedResult.advancedAnalytics.readabilityScores.fleschReadingEase);
            console.log('  Flesch-Kincaid Grade:', advancedResult.advancedAnalytics.readabilityScores.fleschKincaidGrade);
            console.log('  ARI:', advancedResult.advancedAnalytics.readabilityScores.ari);
        }
        
        console.log('\n✅ Advanced Word Counter test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during word counter testing:', error);
        return false;
    }
}

/**
 * Test word counting with different text types
 */
export function testDifferentTextTypes() {
    console.log('\n=== Different Text Types Test ===');
    
    const counter = new AdvancedWordCounter();
    const testCases = [
        {
            name: 'Simple English',
            text: 'The quick brown fox jumps over the lazy dog.'
        },
        {
            name: 'Multiple Sentences',
            text: 'This is the first sentence. This is the second sentence! And this is the third sentence?'
        },
        {
            name: 'With Numbers',
            text: 'I have 5 apples and 10 oranges. The year is 2024.'
        },
        {
            name: 'With Punctuation',
            text: 'Hello, world! How are you? I\'m fine, thank you.'
        },
        {
            name: 'Multiple Paragraphs',
            text: 'This is the first paragraph.\n\nThis is the second paragraph.\n\nAnd this is the third paragraph.'
        }
    ];
    
    let passed = 0;
    let total = testCases.length;
    
    for (const testCase of testCases) {
        try {
            const result = counter.countWords(testCase.text);
            console.log(`✅ ${testCase.name}:`);
            console.log(`  Words: ${result.basicStatistics.wordCount}`);
            console.log(`  Characters: ${result.basicStatistics.charCountWithSpaces}`);
            console.log(`  Sentences: ${result.basicStatistics.sentenceCount}`);
            console.log(`  Paragraphs: ${result.basicStatistics.paragraphCount}`);
            passed++;
        } catch (error) {
            console.log(`❌ ${testCase.name}: Error - ${error.message}`);
        }
    }
    
    console.log(`\nDifferent text types test results: ${passed}/${total} passed`);
    return passed === total;
}

/**
 * Test frequency analysis
 */
export function testFrequencyAnalysis() {
    console.log('\n=== Frequency Analysis Test ===');
    
    const counter = new AdvancedWordCounter();
    const testText = 'The quick brown fox jumps over the lazy dog. The quick brown fox is very quick.';
    
    try {
        const result = counter.countWords(testText, {
            includeFrequency: true,
            frequencyOptions: {
                excludeStopWords: true,
                minLength: 3,
                topN: 10
            }
        });
        
        const freqAnalysis = result.advancedAnalytics.frequencyAnalysis;
        
        console.log('Frequency analysis results:');
        console.log('  Total words:', freqAnalysis.totalWords);
        console.log('  Unique words:', freqAnalysis.uniqueWords);
        console.log('  Lexical diversity:', freqAnalysis.lexicalDiversity);
        console.log('  Top words:');
        
        for (const word of freqAnalysis.topWords.slice(0, 5)) {
            console.log(`    ${word.word}: ${word.count} (${word.percentage.toFixed(1)}%)`);
        }
        
        console.log('\n✅ Frequency analysis test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during frequency analysis testing:', error);
        return false;
    }
}

/**
 * Test readability scores
 */
export function testReadabilityScores() {
    console.log('\n=== Readability Scores Test ===');
    
    const counter = new AdvancedWordCounter();
    const testText = 'The quick brown fox jumps over the lazy dog. This is a simple sentence with basic vocabulary. It should be easy to read and understand.';
    
    try {
        const result = counter.countWords(testText, {
            includeReadability: true
        });
        
        const readability = result.advancedAnalytics.readabilityScores;
        
        console.log('Readability scores:');
        console.log('  Flesch Reading Ease:', readability.fleschReadingEase?.toFixed(1));
        console.log('  Flesch-Kincaid Grade:', readability.fleschKincaidGrade?.toFixed(1));
        console.log('  ARI:', readability.ari?.toFixed(1));
        
        // Test readability level descriptions
        if (readability.fleschReadingEase) {
            const level = WordCounterUtils.getReadabilityLevel(readability.fleschReadingEase, 'flesch');
            console.log('  Readability Level:', level);
        }
        
        if (readability.fleschKincaidGrade) {
            const gradeLevel = WordCounterUtils.getReadabilityLevel(readability.fleschKincaidGrade, 'grade');
            console.log('  Grade Level:', gradeLevel);
        }
        
        console.log('\n✅ Readability scores test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during readability scores testing:', error);
        return false;
    }
}

/**
 * Test reading time estimation
 */
export function testReadingTimeEstimation() {
    console.log('\n=== Reading Time Estimation Test ===');
    
    const counter = new AdvancedWordCounter();
    const testText = 'This is a test text with multiple sentences. It should take some time to read. The reading time estimation should be accurate.';
    
    try {
        const result = counter.countWords(testText, {
            includeReadingTime: true,
            readingSpeed: 200
        });
        
        const readingTime = result.advancedAnalytics.readingTime;
        
        console.log('Reading time estimation:');
        console.log('  Minutes:', readingTime.minutes);
        console.log('  Seconds:', readingTime.seconds);
        console.log('  Reading speed (WPM):', readingTime.readingSpeedWpm);
        console.log('  Total words:', readingTime.words);
        
        // Test reading time description
        const description = WordCounterUtils.getReadingTimeDescription(readingTime.minutes);
        console.log('  Description:', description);
        
        console.log('\n✅ Reading time estimation test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during reading time estimation testing:', error);
        return false;
    }
}

/**
 * Test batch processing
 */
export function testBatchProcessing() {
    console.log('\n=== Batch Processing Test ===');
    
    const counter = new AdvancedWordCounter();
    const documents = {
        'doc1': 'This is the first document. It has some content.',
        'doc2': 'This is the second document. It has different content.',
        'doc3': 'This is the third document. It has more content than the others.'
    };
    
    try {
        const results = counter.batchCountDocuments(documents);
        
        console.log('Batch processing results:');
        for (const [docId, result] of Object.entries(results)) {
            console.log(`  ${docId}: ${result.basicStatistics.wordCount} words`);
        }
        
        console.log('\n✅ Batch processing test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during batch processing testing:', error);
        return false;
    }
}

/**
 * Test utility functions
 */
export function testUtilityFunctions() {
    console.log('\n=== Utility Functions Test ===');
    
    try {
        // Test number formatting
        const formatted = WordCounterUtils.formatNumber(1234567);
        console.log('Formatted number:', formatted);
        
        // Test reading time descriptions
        const descriptions = [
            WordCounterUtils.getReadingTimeDescription(0.5),
            WordCounterUtils.getReadingTimeDescription(1.5),
            WordCounterUtils.getReadingTimeDescription(5),
            WordCounterUtils.getReadingTimeDescription(65)
        ];
        console.log('Reading time descriptions:', descriptions);
        
        // Test readability levels
        const levels = [
            WordCounterUtils.getReadabilityLevel(95, 'flesch'),
            WordCounterUtils.getReadabilityLevel(75, 'flesch'),
            WordCounterUtils.getReadabilityLevel(45, 'flesch'),
            WordCounterUtils.getReadabilityLevel(8, 'grade'),
            WordCounterUtils.getReadabilityLevel(12, 'grade')
        ];
        console.log('Readability levels:', levels);
        
        // Test text summary
        const mockStats = {
            wordCount: 150,
            charCountWithSpaces: 750,
            charCountNoSpaces: 600,
            sentenceCount: 8,
            paragraphCount: 3,
            averageWordsPerSentence: 18.75,
            averageSentencesPerParagraph: 2.67
        };
        const summary = WordCounterUtils.getTextSummary(mockStats);
        console.log('Text summary:', summary);
        
        console.log('\n✅ Utility functions test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Error during utility functions testing:', error);
        return false;
    }
}

/**
 * Run all word counter tests
 */
export function runAllWordCounterTests() {
    console.log('🚀 Starting Advanced Word Counter Test Suite...\n');
    
    const tests = [
        { name: 'Main Word Counter Test', fn: testAdvancedWordCounter },
        { name: 'Different Text Types Test', fn: testDifferentTextTypes },
        { name: 'Frequency Analysis Test', fn: testFrequencyAnalysis },
        { name: 'Readability Scores Test', fn: testReadabilityScores },
        { name: 'Reading Time Estimation Test', fn: testReadingTimeEstimation },
        { name: 'Batch Processing Test', fn: testBatchProcessing },
        { name: 'Utility Functions Test', fn: testUtilityFunctions }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        try {
            const result = test.fn();
            if (result) {
                passed++;
            }
        } catch (error) {
            console.error(`❌ ${test.name} failed with error:`, error);
        }
    }
    
    console.log(`\n🏁 Test Suite Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All word counter tests passed!');
    } else {
        console.log('⚠️  Some word counter tests failed');
    }
    
    return passed === total;
}
