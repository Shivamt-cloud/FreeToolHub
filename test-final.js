console.log('Testing final markdown preview...');

import('./src/js/markdown-preview-index.js').then(m => {
  console.log('Import successful');
  
  const preview = new m.MarkdownPreview();
  
  // Test simple markdown
  const result = preview.generatePreview('# Hello World\n\nThis is a test.');
  console.log('Result success:', result.success);
  
  if (result.success) {
    console.log('HTML length:', result.html.length);
    
    // Check for key elements
    const hasH1 = result.html.includes('<h1>');
    const hasP = result.html.includes('<p>');
    const hasContent = result.html.includes('Hello World');
    
    console.log('Contains H1:', hasH1);
    console.log('Contains P:', hasP);
    console.log('Contains content:', hasContent);
    
    if (hasH1 && hasP && hasContent) {
      console.log('✅ Markdown preview is working correctly!');
    } else {
      console.log('❌ Markdown preview has issues');
      console.log('HTML preview (first 500 chars):');
      console.log(result.html.substring(0, 500));
    }
  } else {
    console.log('Error:', result.error);
  }
  
}).catch(e => {
  console.log('Error:', e.message);
});

