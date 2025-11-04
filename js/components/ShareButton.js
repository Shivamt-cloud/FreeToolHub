/**
 * ShareButton.js - Handles sharing functionality for tool pages
 */

function shareTool() {
    const toolName = document.querySelector('h1')?.textContent || 'Free Tool';
    const toolUrl = window.location.href;
    const toolDescription = document.querySelector('meta[name="description"]')?.content || 
                          `Check out this amazing ${toolName} tool on FreeToolHub!`;

    const shareData = {
        title: `${toolName} - FreeToolHub`,
        text: toolDescription,
        url: toolUrl
    };

    // Try native Web Share API first (mobile & modern browsers)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => {
                console.log('✅ Tool shared successfully');
                showShareFeedback('Tool shared successfully!');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    fallbackShare(toolUrl, toolName);
                }
            });
    } else {
        // Fallback for browsers without Web Share API
        fallbackShare(toolUrl, toolName);
    }
}

function fallbackShare(url, toolName) {
    // Create a temporary input element
    const input = document.createElement('input');
    input.value = url;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    try {
        // Copy to clipboard
        document.execCommand('copy');
        document.body.removeChild(input);
        showShareFeedback('Tool URL copied to clipboard!');
        
        // Show share options
        showShareOptions(url, toolName);
    } catch (err) {
        console.error('Failed to copy:', err);
        document.body.removeChild(input);
        // Show share options directly
        showShareOptions(url, toolName);
    }
}

function showShareOptions(url, toolName) {
    const shareText = encodeURIComponent(`Check out ${toolName} on FreeToolHub!`);
    const encodedUrl = encodeURIComponent(url);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${shareText}%20${encodedUrl}`,
        email: `mailto:?subject=${encodeURIComponent(toolName + ' - FreeToolHub')}&body=${shareText}%20${encodedUrl}`
    };

    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Share ${toolName}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="space-y-3">
                <a href="${shareLinks.twitter}" target="_blank" class="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <span class="text-2xl">🐦</span>
                    <span class="font-medium text-gray-700">Share on Twitter</span>
                </a>
                <a href="${shareLinks.facebook}" target="_blank" class="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <span class="text-2xl">📘</span>
                    <span class="font-medium text-gray-700">Share on Facebook</span>
                </a>
                <a href="${shareLinks.linkedin}" target="_blank" class="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <span class="text-2xl">💼</span>
                    <span class="font-medium text-gray-700">Share on LinkedIn</span>
                </a>
                <a href="${shareLinks.whatsapp}" target="_blank" class="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <span class="text-2xl">💬</span>
                    <span class="font-medium text-gray-700">Share on WhatsApp</span>
                </a>
                <a href="${shareLinks.email}" class="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <span class="text-2xl">📧</span>
                    <span class="font-medium text-gray-700">Share via Email</span>
                </a>
            </div>
            <div class="mt-4 pt-4 border-t">
                <div class="flex items-center gap-2">
                    <input type="text" value="${url}" readonly class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" id="share-url-input">
                    <button onclick="copyShareUrl()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Copy</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function copyShareUrl() {
    const input = document.getElementById('share-url-input');
    if (input) {
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showShareFeedback('URL copied to clipboard!');
    }
}

function showShareFeedback(message) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Make shareTool globally available
window.shareTool = shareTool;


