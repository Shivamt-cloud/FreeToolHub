/**
 * Advanced Lorem Generator Test Suite
 * Comprehensive tests for all components and functionality
 */

import { LoremGenerator, WordPoolManager, WeightedSelector, TextGenerator, OutputFormatter } from './advanced-lorem-generator.js';

// Test runner utility
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async run() {
        console.log('🧪 Running Advanced Lorem Generator Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const runner = new TestRunner();

// WordPoolManager Tests
runner.test('WordPoolManager - Initialize with default pools', () => {
    const manager = new WordPoolManager();
    
    if (!manager.wordPools.lorem) {
        throw new Error('Lorem word pool not loaded');
    }
    
    if (!manager.wordPools.bacon) {
        throw new Error('Bacon word pool not loaded');
    }
    
    if (!manager.wordPools.corporate) {
        throw new Error('Corporate word pool not loaded');
    }
    
    if (!manager.wordPools.space) {
        throw new Error('Space word pool not loaded');
    }
    
    if (!manager.wordPools.tech) {
        throw new Error('Tech word pool not loaded');
    }
});

runner.test('WordPoolManager - Get available themes', () => {
    const manager = new WordPoolManager();
    const themes = manager.getAvailableThemes();
    
    if (!Array.isArray(themes)) {
        throw new Error('getAvailableThemes should return an array');
    }
    
    if (themes.length < 5) {
        throw new Error('Should have at least 5 themes');
    }
    
    if (!themes.includes('lorem')) {
        throw new Error('Should include lorem theme');
    }
});

runner.test('WordPoolManager - Add custom pool', () => {
    const manager = new WordPoolManager();
    
    const customPool = {
        "animals": {
            "words": ["cat", "dog", "elephant"],
            "weight": 0.5
        },
        "actions": {
            "words": ["runs", "jumps", "sleeps"],
            "weight": 0.5
        }
    };
    
    manager.addCustomPool("animals", customPool);
    
    if (!manager.wordPools.animals) {
        throw new Error('Custom pool not added');
    }
    
    if (!manager.sentencePatterns.animals) {
        throw new Error('Default sentence patterns not generated');
    }
});

runner.test('WordPoolManager - Get word pool and patterns', () => {
    const manager = new WordPoolManager();
    
    const loremPool = manager.getWordPool('lorem');
    if (!loremPool.common || !loremPool.uncommon || !loremPool.rare) {
        throw new Error('Lorem pool missing categories');
    }
    
    const patterns = manager.getSentencePatterns('lorem');
    if (!Array.isArray(patterns) || patterns.length === 0) {
        throw new Error('Sentence patterns not loaded');
    }
    
    // Test fallback for unknown theme
    const unknownPool = manager.getWordPool('unknown');
    if (unknownPool !== manager.wordPools.lorem) {
        throw new Error('Should fallback to lorem for unknown theme');
    }
});

// WeightedSelector Tests
runner.test('WeightedSelector - Basic weighted selection', () => {
    const selector = new WeightedSelector();
    
    const items = [
        ['item1', 0.5],
        ['item2', 0.3],
        ['item3', 0.2]
    ];
    
    // Test multiple selections to ensure weighted distribution
    const results = {};
    for (let i = 0; i < 1000; i++) {
        const selected = selector.selectWeightedItem(items);
        results[selected] = (results[selected] || 0) + 1;
    }
    
    // item1 should be selected most often (highest weight)
    if (results.item1 < results.item2 || results.item1 < results.item3) {
        throw new Error('Weighted selection not working correctly');
    }
});

runner.test('WeightedSelector - Seeded random generation', () => {
    const selector1 = new WeightedSelector();
    const selector2 = new WeightedSelector();
    
    selector1.setSeed(12345);
    selector2.setSeed(12345);
    
    // Same seed should produce same sequence
    for (let i = 0; i < 10; i++) {
        const val1 = selector1.seededRandom();
        const val2 = selector2.seededRandom();
        
        if (Math.abs(val1 - val2) > 0.0001) {
            throw new Error('Seeded random not reproducible');
        }
    }
});

runner.test('WeightedSelector - Select from category', () => {
    const selector = new WeightedSelector();
    
    const category = {
        words: ['word1', 'word2', 'word3'],
        weight: 0.5
    };
    
    const selected = selector.selectFromCategory(category);
    
    if (!category.words.includes(selected)) {
        throw new Error('Selected word not from category');
    }
});

runner.test('WeightedSelector - Select sentence pattern', () => {
    const selector = new WeightedSelector();
    
    const patterns = [
        { pattern: "pattern1", weight: 0.6 },
        { pattern: "pattern2", weight: 0.4 }
    ];
    
    const selected = selector.selectSentencePattern(patterns);
    
    if (!patterns.some(p => p.pattern === selected)) {
        throw new Error('Selected pattern not from patterns list');
    }
});

// TextGenerator Tests
runner.test('TextGenerator - Generate sentence', () => {
    const manager = new WordPoolManager();
    const selector = new WeightedSelector();
    const generator = new TextGenerator(manager, selector);
    
    const sentence = generator.generateSentence('lorem', 4, 20);
    
    if (!sentence || typeof sentence !== 'string') {
        throw new Error('Generated sentence should be a string');
    }
    
    if (!sentence.endsWith('.')) {
        throw new Error('Sentence should end with period');
    }
    
    if (!sentence[0].match(/[A-Z]/)) {
        throw new Error('Sentence should start with capital letter');
    }
    
    const words = sentence.split(' ');
    if (words.length < 4 || words.length > 20) {
        throw new Error('Sentence word count not within bounds');
    }
});

runner.test('TextGenerator - Fill pattern with words', () => {
    const manager = new WordPoolManager();
    const selector = new WeightedSelector();
    const generator = new TextGenerator(manager, selector);
    
    const pattern = "{common} {uncommon} {common}.";
    const filled = generator.fillPattern(pattern, 'lorem');
    
    if (filled === pattern) {
        throw new Error('Pattern not filled with words');
    }
    
    if (!filled.includes(' ')) {
        throw new Error('Filled pattern should contain spaces');
    }
    
    if (!filled.endsWith('.')) {
        throw new Error('Filled pattern should end with period');
    }
});

runner.test('TextGenerator - Apply sentence formatting', () => {
    const manager = new WordPoolManager();
    const selector = new WeightedSelector();
    const generator = new TextGenerator(manager, selector);
    
    const testCases = [
        'hello world',
        'hello world.',
        'HELLO WORLD',
        ''
    ];
    
    for (const testCase of testCases) {
        const formatted = generator.applySentenceFormatting(testCase);
        
        if (testCase && !formatted.endsWith('.')) {
            throw new Error('Formatted sentence should end with period');
        }
        
        if (testCase && !formatted[0].match(/[A-Z]/)) {
            throw new Error('Formatted sentence should start with capital letter');
        }
    }
});

runner.test('TextGenerator - Generate paragraph', () => {
    const manager = new WordPoolManager();
    const selector = new WeightedSelector();
    const generator = new TextGenerator(manager, selector);
    
    const paragraph = generator.generateParagraph('lorem', 3, 3, 5);
    
    if (!paragraph || typeof paragraph !== 'string') {
        throw new Error('Generated paragraph should be a string');
    }
    
    const sentences = paragraph.split('.').filter(s => s.trim());
    if (sentences.length < 3 || sentences.length > 5) {
        throw new Error('Paragraph should have correct number of sentences');
    }
});

runner.test('TextGenerator - Generate word list', () => {
    const manager = new WordPoolManager();
    const selector = new WeightedSelector();
    const generator = new TextGenerator(manager, selector);
    
    const words = generator.generateWordList('lorem', 10);
    
    if (!Array.isArray(words)) {
        throw new Error('Generated words should be an array');
    }
    
    if (words.length !== 10) {
        throw new Error('Should generate correct number of words');
    }
    
    for (const word of words) {
        if (typeof word !== 'string' || word.length === 0) {
            throw new Error('All generated words should be non-empty strings');
        }
    }
});

runner.test('TextGenerator - Extend and truncate sentences', () => {
    const manager = new WordPoolManager();
    const selector = new WeightedSelector();
    const generator = new TextGenerator(manager, selector);
    
    // Test extend
    const shortSentence = "Hello world.";
    const extended = generator.extendSentence(shortSentence, 'lorem', 5);
    const extendedWords = extended.split(' ');
    
    if (extendedWords.length < 5) {
        throw new Error('Extended sentence should have at least 5 words');
    }
    
    // Test truncate
    const longSentence = "This is a very long sentence with many words that should be truncated.";
    const truncated = generator.truncateSentence(longSentence, 5);
    const truncatedWords = truncated.split(' ');
    
    if (truncatedWords.length > 5) {
        throw new Error('Truncated sentence should have at most 5 words');
    }
    
    if (!truncated.endsWith('.')) {
        throw new Error('Truncated sentence should end with period');
    }
});

// OutputFormatter Tests
runner.test('OutputFormatter - Format paragraphs', () => {
    const formatter = new OutputFormatter();
    
    const paragraphs = [
        "First paragraph content.",
        "Second paragraph content.",
        "Third paragraph content."
    ];
    
    // Test plain text
    const plainText = formatter.formatAsParagraphs(paragraphs, false);
    if (!plainText.includes('\n\n')) {
        throw new Error('Plain text paragraphs should be separated by double newlines');
    }
    
    // Test HTML
    const htmlText = formatter.formatAsParagraphs(paragraphs, true);
    if (!htmlText.includes('<p>') || !htmlText.includes('</p>')) {
        throw new Error('HTML paragraphs should include p tags');
    }
});

runner.test('OutputFormatter - Format lists', () => {
    const formatter = new OutputFormatter();
    
    const items = ["Item 1", "Item 2", "Item 3"];
    
    // Test unordered list
    const unordered = formatter.formatAsList(items, "unordered", false);
    if (!unordered.includes('•')) {
        throw new Error('Unordered list should include bullet points');
    }
    
    // Test ordered list
    const ordered = formatter.formatAsList(items, "ordered", false);
    if (!ordered.includes('1.') || !ordered.includes('2.')) {
        throw new Error('Ordered list should include numbers');
    }
    
    // Test HTML unordered list
    const htmlUnordered = formatter.formatAsList(items, "unordered", true);
    if (!htmlUnordered.includes('<ul>') || !htmlUnordered.includes('<li>')) {
        throw new Error('HTML unordered list should include ul and li tags');
    }
    
    // Test HTML ordered list
    const htmlOrdered = formatter.formatAsList(items, "ordered", true);
    if (!htmlOrdered.includes('<ol>') || !htmlOrdered.includes('<li>')) {
        throw new Error('HTML ordered list should include ol and li tags');
    }
});

runner.test('OutputFormatter - Add random formatting', () => {
    const formatter = new OutputFormatter();
    
    const text = "This is a test sentence with multiple words.";
    const formatted = formatter.addRandomFormatting(text, 0.5); // 50% chance
    
    // Should be a string
    if (typeof formatted !== 'string') {
        throw new Error('Formatted text should be a string');
    }
    
    // Should contain the original words
    if (!formatted.includes('test') || !formatted.includes('sentence')) {
        throw new Error('Formatted text should contain original words');
    }
});

// LoremGenerator Main Interface Tests
runner.test('LoremGenerator - Initialize', () => {
    const generator = new LoremGenerator();
    
    if (!generator.wordManager || !generator.selector || !generator.textGenerator || !generator.formatter) {
        throw new Error('All components should be initialized');
    }
});

runner.test('LoremGenerator - Generate words', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("words", 10, "lorem");
    
    if (result.outputType !== "words") {
        throw new Error('Output type should be words');
    }
    
    if (result.count !== 10) {
        throw new Error('Count should be 10');
    }
    
    if (result.theme !== "lorem") {
        throw new Error('Theme should be lorem');
    }
    
    if (!result.content || typeof result.content !== 'string') {
        throw new Error('Content should be a non-empty string');
    }
    
    if (result.metadata.wordCount !== 10) {
        throw new Error('Word count metadata should be 10');
    }
});

runner.test('LoremGenerator - Generate sentences', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("sentences", 3, "bacon", {
        minWords: 5,
        maxWords: 10
    });
    
    if (result.outputType !== "sentences") {
        throw new Error('Output type should be sentences');
    }
    
    if (result.metadata.sentenceCount !== 3) {
        throw new Error('Should generate 3 sentences');
    }
    
    if (result.theme !== "bacon") {
        throw new Error('Theme should be bacon');
    }
    
    const sentences = result.content.split('.').filter(s => s.trim());
    if (sentences.length !== 3) {
        throw new Error('Should have 3 sentences in content');
    }
});

runner.test('LoremGenerator - Generate paragraphs', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("paragraphs", 2, "corporate", {
        includeHtml: true,
        sentencesPerParagraph: 3,
        randomFormatting: true
    });
    
    if (result.outputType !== "paragraphs") {
        throw new Error('Output type should be paragraphs');
    }
    
    if (result.metadata.paragraphCount !== 2) {
        throw new Error('Should generate 2 paragraphs');
    }
    
    if (result.theme !== "corporate") {
        throw new Error('Theme should be corporate');
    }
    
    if (!result.content.includes('<p>')) {
        throw new Error('HTML paragraphs should include p tags');
    }
});

runner.test('LoremGenerator - Generate list', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("list", 4, "space", {
        listItemType: 'sentence',
        includeHtml: true,
        listType: 'ordered'
    });
    
    if (result.outputType !== "list") {
        throw new Error('Output type should be list');
    }
    
    if (result.metadata.itemCount !== 4) {
        throw new Error('Should generate 4 list items');
    }
    
    if (result.theme !== "space") {
        throw new Error('Theme should be space');
    }
    
    if (!result.content.includes('<ol>') || !result.content.includes('<li>')) {
        throw new Error('HTML ordered list should include ol and li tags');
    }
});

runner.test('LoremGenerator - Handle invalid output type', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("invalid", 1, "lorem");
    
    if (!result.error) {
        throw new Error('Should return error for invalid output type');
    }
    
    if (result.content !== '') {
        throw new Error('Content should be empty when error occurs');
    }
});

runner.test('LoremGenerator - Seeded generation', () => {
    const generator1 = new LoremGenerator();
    const generator2 = new LoremGenerator();
    
    const result1 = generator1.generate("words", 5, "lorem", { seed: 12345 });
    const result2 = generator2.generate("words", 5, "lorem", { seed: 12345 });
    
    if (result1.content !== result2.content) {
        throw new Error('Same seed should produce same output');
    }
});

runner.test('LoremGenerator - Get available themes', () => {
    const generator = new LoremGenerator();
    
    const themes = generator.getAvailableThemes();
    
    if (!Array.isArray(themes)) {
        throw new Error('Should return array of themes');
    }
    
    if (themes.length < 5) {
        throw new Error('Should have at least 5 themes');
    }
    
    if (!themes.includes('lorem')) {
        throw new Error('Should include lorem theme');
    }
});

runner.test('LoremGenerator - Add custom theme', () => {
    const generator = new LoremGenerator();
    
    const customTheme = {
        "colors": {
            "words": ["red", "blue", "green"],
            "weight": 0.5
        },
        "shapes": {
            "words": ["circle", "square", "triangle"],
            "weight": 0.5
        }
    };
    
    generator.addCustomTheme("colors", customTheme);
    
    const themes = generator.getAvailableThemes();
    if (!themes.includes("colors")) {
        throw new Error('Custom theme should be added to available themes');
    }
    
    const result = generator.generate("words", 3, "colors");
    if (result.theme !== "colors") {
        throw new Error('Should be able to generate with custom theme');
    }
});

runner.test('LoremGenerator - Utility methods', () => {
    const generator = new LoremGenerator();
    
    // Test generateLoremIpsum
    const loremResult = generator.generateLoremIpsum(2, true);
    if (loremResult.outputType !== "paragraphs" || loremResult.theme !== "lorem") {
        throw new Error('generateLoremIpsum should generate lorem paragraphs');
    }
    
    // Test generateBaconIpsum
    const baconResult = generator.generateBaconIpsum(3);
    if (baconResult.outputType !== "sentences" || baconResult.theme !== "bacon") {
        throw new Error('generateBaconIpsum should generate bacon sentences');
    }
    
    // Test generateCorporateIpsum
    const corporateResult = generator.generateCorporateIpsum(1, true);
    if (corporateResult.outputType !== "paragraphs" || corporateResult.theme !== "corporate") {
        throw new Error('generateCorporateIpsum should generate corporate paragraphs');
    }
    
    // Test generateSpaceIpsum
    const spaceResult = generator.generateSpaceIpsum(15);
    if (spaceResult.outputType !== "words" || spaceResult.theme !== "space") {
        throw new Error('generateSpaceIpsum should generate space words');
    }
    
    // Test generateTechIpsum
    const techResult = generator.generateTechIpsum(3, true);
    if (techResult.outputType !== "list" || techResult.theme !== "tech") {
        throw new Error('generateTechIpsum should generate tech list');
    }
});

runner.test('LoremGenerator - Batch generation', () => {
    const generator = new LoremGenerator();
    
    const requests = {
        "test1": {
            outputType: "words",
            count: 5,
            theme: "lorem"
        },
        "test2": {
            outputType: "sentences",
            count: 2,
            theme: "bacon"
        }
    };
    
    const results = generator.batchGenerate(requests);
    
    if (!results.test1 || !results.test2) {
        throw new Error('Batch generation should return results for all requests');
    }
    
    if (results.test1.outputType !== "words") {
        throw new Error('First batch result should be words');
    }
    
    if (results.test2.outputType !== "sentences") {
        throw new Error('Second batch result should be sentences');
    }
});

// Integration Tests
runner.test('Integration - Full workflow with different themes', () => {
    const generator = new LoremGenerator();
    
    const themes = ['lorem', 'bacon', 'corporate', 'space', 'tech'];
    
    for (const theme of themes) {
        const result = generator.generate("paragraphs", 1, theme, {
            sentencesPerParagraph: 2,
            includeHtml: false
        });
        
        if (result.theme !== theme) {
            throw new Error(`Theme mismatch for ${theme}`);
        }
        
        if (!result.content || result.content.length === 0) {
            throw new Error(`No content generated for ${theme}`);
        }
        
        if (result.metadata.paragraphCount !== 1) {
            throw new Error(`Wrong paragraph count for ${theme}`);
        }
    }
});

runner.test('Integration - HTML formatting consistency', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("paragraphs", 2, "lorem", {
        includeHtml: true,
        randomFormatting: true
    });
    
    // Check for proper HTML structure
    const pTagCount = (result.content.match(/<p>/g) || []).length;
    const closingPTagCount = (result.content.match(/<\/p>/g) || []).length;
    
    if (pTagCount !== 2 || closingPTagCount !== 2) {
        throw new Error('Should have matching opening and closing p tags');
    }
    
    // Check for random formatting tags
    const hasFormatting = result.content.includes('<em>') || result.content.includes('<strong>');
    // Note: This might not always be true due to randomness, so we'll just check structure
});

runner.test('Integration - Word count accuracy', () => {
    const generator = new LoremGenerator();
    
    const result = generator.generate("words", 25, "lorem");
    
    const actualWordCount = result.content.split(' ').length;
    
    if (actualWordCount !== 25) {
        throw new Error(`Expected 25 words, got ${actualWordCount}`);
    }
    
    if (result.metadata.wordCount !== 25) {
        throw new Error(`Metadata word count should be 25, got ${result.metadata.wordCount}`);
    }
});

// Run all tests
runner.run().then(success => {
    if (success) {
        console.log('\n🎉 All tests passed! Advanced Lorem Generator is working correctly.');
    } else {
        console.log('\n❌ Some tests failed. Please review the errors above.');
        process.exit(1);
    }
}).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
});
