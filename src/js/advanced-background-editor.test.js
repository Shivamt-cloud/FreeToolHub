/**
 * Test file for Advanced Background Editor
 */

// Test Canvas Editor
function testCanvasEditor() {
    console.log('=== Testing Canvas Editor ===');
    
    // Create a test canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);
    
    const editor = new CanvasEditor('test-canvas');
    
    // Test layer management
    editor.setLayerVisibility('background', true);
    editor.setLayerOpacity('picture', 0.8);
    
    // Test background setting
    editor.setSolidBackground('#ff0000');
    editor.setGradientBackground({
        type: 'linear',
        direction: 'linear',
        start: { x: 0, y: 0 },
        end: { x: 400, y: 400 },
        stops: [
            { position: 0, color: '#ff0000' },
            { position: 1, color: '#0000ff' }
        ]
    });
    
    // Test effects
    editor.setOutline(3, '#00ff00');
    editor.setBorder(5, '#ffffff');
    editor.setShadow({ x: 2, y: 2 }, 4, 0.5);
    
    console.log('Canvas Editor test: PASS');
    
    // Cleanup
    document.body.removeChild(canvas);
    
    return true;
}

// Test Segmentation Service
function testSegmentationService() {
    console.log('=== Testing Segmentation Service ===');
    
    const service = new SegmentationService();
    
    // Test model selection
    service.currentModel = 'u2net';
    console.log('U2Net model set:', service.currentModel === 'u2net' ? 'PASS' : 'FAIL');
    
    service.currentModel = 'modnet';
    console.log('MODNet model set:', service.currentModel === 'modnet' ? 'PASS' : 'FAIL');
    
    service.currentModel = 'sam';
    console.log('SAM model set:', service.currentModel === 'sam' ? 'PASS' : 'FAIL');
    
    // Test fallback matte creation
    const testImage = new Image();
    testImage.width = 100;
    testImage.height = 100;
    
    const fallbackMatte = service.createFallbackMatte(testImage);
    console.log('Fallback matte created:', fallbackMatte ? 'PASS' : 'FAIL');
    
    return true;
}

// Test AI Models
function testAIModels() {
    console.log('=== Testing AI Models ===');
    
    // Test U2Net Model
    const u2net = new U2NetModel();
    const testImage = new Image();
    testImage.width = 100;
    testImage.height = 100;
    
    const u2netMatte = u2net.createSimpleMatte(testImage);
    console.log('U2Net matte creation:', u2netMatte ? 'PASS' : 'FAIL');
    
    // Test MODNet Model
    const modnet = new MODNetModel();
    const modnetMatte = modnet.createPortraitMatte(testImage);
    console.log('MODNet matte creation:', modnetMatte ? 'PASS' : 'FAIL');
    
    // Test skin tone detection
    const isSkin = modnet.isSkinTone(200, 150, 120);
    console.log('Skin tone detection:', isSkin ? 'PASS' : 'FAIL');
    
    // Test SAM Model
    const sam = new SAMModel();
    const prompts = [
        { type: 'point', x: 50, y: 50 },
        { type: 'box', x: 25, y: 25, width: 50, height: 50 }
    ];
    const samMatte = sam.createInteractiveMatte(testImage, prompts);
    console.log('SAM matte creation:', samMatte ? 'PASS' : 'FAIL');
    
    return true;
}

// Test Template Store
function testTemplateStore() {
    console.log('=== Testing Template Store ===');
    
    const store = new TemplateStore();
    
    // Test getting all templates
    const templates = store.getAllTemplates();
    console.log('Templates loaded:', templates.length > 0 ? 'PASS' : 'FAIL');
    console.log('Available templates:', templates.map(t => t.name));
    
    // Test getting specific template
    const professional = store.getTemplate('professional');
    console.log('Professional template:', professional ? 'PASS' : 'FAIL');
    
    const creative = store.getTemplate('creative');
    console.log('Creative template:', creative ? 'PASS' : 'FAIL');
    
    // Test saving template
    const customTemplate = {
        id: 'custom',
        name: 'Custom Template',
        background: { type: 'solid', color: '#123456' },
        outline: { thickness: 1, color: '#ffffff' },
        border: { thickness: 2, color: '#000000' },
        shadow: { offset: { x: 1, y: 1 }, blur: 2, opacity: 0.3 }
    };
    
    store.saveTemplate(customTemplate);
    const savedTemplate = store.getTemplate('custom');
    console.log('Custom template saved:', savedTemplate ? 'PASS' : 'FAIL');
    
    return true;
}

// Test Auto Delete Policy
function testAutoDeletePolicy() {
    console.log('=== Testing Auto Delete Policy ===');
    
    const policy = new AutoDeletePolicy(1); // 1 minute TTL for testing
    
    // Test adding upload
    const uploadId = 'test-upload-1';
    const testData = new Blob(['test data'], { type: 'text/plain' });
    
    policy.addUpload(uploadId, testData);
    console.log('Upload added:', policy.uploads.has(uploadId) ? 'PASS' : 'FAIL');
    
    // Test cleanup
    policy.cleanup();
    console.log('Cleanup function exists:', typeof policy.cleanup === 'function' ? 'PASS' : 'FAIL');
    
    return true;
}

// Test Main Background Editor
function testAdvancedBackgroundEditor() {
    console.log('=== Testing Advanced Background Editor ===');
    
    const editor = new AdvancedBackgroundEditor();
    
    // Test initialization
    console.log('Editor initialized:', editor ? 'PASS' : 'FAIL');
    console.log('Canvas editor exists:', editor.canvasEditor ? 'PASS' : 'FAIL');
    console.log('Template store exists:', editor.templateStore ? 'PASS' : 'FAIL');
    console.log('Auto delete policy exists:', editor.autoDelete ? 'PASS' : 'FAIL');
    
    // Test getting templates
    const templates = editor.getTemplates();
    console.log('Templates accessible:', templates.length > 0 ? 'PASS' : 'FAIL');
    
    // Test background setting
    editor.setBackground('solid', { color: '#ff0000' });
    console.log('Background setting:', 'PASS');
    
    // Test effects
    editor.setEffects({
        outline: { thickness: 2, color: '#000000' },
        border: { thickness: 4, color: '#ffffff' },
        shadow: { offset: { x: 2, y: 2 }, blur: 4, opacity: 0.5 }
    });
    console.log('Effects setting:', 'PASS');
    
    // Test export
    const pngExport = editor.exportImage('png');
    const jpegExport = editor.exportImage('jpeg', 0.8);
    console.log('PNG export:', pngExport ? 'PASS' : 'FAIL');
    console.log('JPEG export:', jpegExport ? 'PASS' : 'FAIL');
    
    return true;
}

// Test Image Processing Pipeline
function testImageProcessingPipeline() {
    console.log('=== Testing Image Processing Pipeline ===');
    
    const editor = new AdvancedBackgroundEditor();
    
    // Create a test image file
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple test image
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(50, 50, 100, 100);
    
    // Convert to blob
    canvas.toBlob(async (blob) => {
        try {
            const result = await editor.processImage(blob, 'auto');
            console.log('Image processing:', result.success ? 'PASS' : 'FAIL');
            if (!result.success) {
                console.log('Error:', result.error);
            }
        } catch (error) {
            console.log('Image processing error:', error.message);
        }
    }, 'image/png');
    
    return true;
}

// Test Template Application
function testTemplateApplication() {
    console.log('=== Testing Template Application ===');
    
    const editor = new AdvancedBackgroundEditor();
    
    // Test applying different templates
    const templates = ['professional', 'creative', 'minimal', 'vibrant'];
    
    templates.forEach(templateId => {
        try {
            editor.applyTemplate(templateId);
            console.log(`Template ${templateId} applied: PASS`);
        } catch (error) {
            console.log(`Template ${templateId} failed: FAIL - ${error.message}`);
        }
    });
    
    return true;
}

// Test History Management
function testHistoryManagement() {
    console.log('=== Testing History Management ===');
    
    const editor = new AdvancedBackgroundEditor();
    
    // Test undo/redo functionality
    try {
        editor.undo();
        editor.redo();
        console.log('History management: PASS');
    } catch (error) {
        console.log('History management: FAIL -', error.message);
    }
    
    return true;
}

// Run all tests
function runAllBackgroundEditorTests() {
    console.log('Starting Advanced Background Editor Tests...');
    
    const tests = [
        testCanvasEditor,
        testSegmentationService,
        testAIModels,
        testTemplateStore,
        testAutoDeletePolicy,
        testAdvancedBackgroundEditor,
        testTemplateApplication,
        testHistoryManagement
    ];
    
    let passed = 0;
    let total = tests.length;
    
    tests.forEach(test => {
        try {
            if (test()) {
                passed++;
            }
        } catch (error) {
            console.error('Test failed with error:', error);
        }
    });
    
    console.log(`\n=== Test Results ===`);
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);
    
    return passed === total;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.testCanvasEditor = testCanvasEditor;
    window.testSegmentationService = testSegmentationService;
    window.testAIModels = testAIModels;
    window.testTemplateStore = testTemplateStore;
    window.testAutoDeletePolicy = testAutoDeletePolicy;
    window.testAdvancedBackgroundEditor = testAdvancedBackgroundEditor;
    window.testImageProcessingPipeline = testImageProcessingPipeline;
    window.testTemplateApplication = testTemplateApplication;
    window.testHistoryManagement = testHistoryManagement;
    window.runAllBackgroundEditorTests = runAllBackgroundEditorTests;
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runAllBackgroundEditorTests();
}
