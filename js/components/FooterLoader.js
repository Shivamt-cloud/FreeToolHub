/**
 * FooterLoader.js - Loads the reusable footer component into pages
 */

async function loadFooter() {
    try {
        const footerContainer = document.getElementById('app-footer');
        if (!footerContainer) {
            console.warn('Footer container (#app-footer) not found');
            return;
        }

        // Add cache-busting parameter to ensure fresh content
        const cacheBuster = new Date().getTime();
        const url = `/templates/footer.html?t=${cacheBuster}&v=2`;
        console.log('Loading footer from:', url);
        
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to load footer: ${response.status}`);
        }

        // Check if we got the full response (should be at least 9000 bytes)
        const contentLength = response.headers.get('content-length');
        const footerHTML = await response.text();
        
        if (footerHTML.length < 9000) {
            console.warn('⚠️ Footer response seems truncated. Length:', footerHTML.length);
        }
        
        // Verify footer contains expected links
        const hasLinkedIn = footerHTML.includes('LinkedIn');
        const hasTwitter = footerHTML.includes('Twitter');
        const hasWhatsApp = footerHTML.includes('WhatsApp');
        const hasSendFeedback = footerHTML.includes('Send Feedback');
        
        console.log('Footer verification:', {
            hasLinkedIn,
            hasTwitter,
            hasWhatsApp,
            hasSendFeedback,
            length: footerHTML.length
        });
        
        if (hasLinkedIn && hasTwitter && hasWhatsApp && hasSendFeedback) {
            console.log('✅ Footer contains all social links');
        } else {
            console.warn('⚠️ Footer might be missing some links. Retrying...');
            // Retry once
            const retryResponse = await fetch(`/templates/footer.html?t=${Date.now()}&v=3`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const retryHTML = await retryResponse.text();
            if (retryHTML.includes('WhatsApp') && retryHTML.includes('Send Feedback')) {
                footerContainer.innerHTML = retryHTML;
                console.log('✅ Footer loaded successfully on retry');
                return;
            }
        }
        
        footerContainer.innerHTML = footerHTML;

        // Force re-render to ensure updates are visible
        footerContainer.style.display = 'none';
        footerContainer.offsetHeight; // Trigger reflow
        footerContainer.style.display = '';

        console.log('✅ Footer loaded successfully');
    } catch (error) {
        console.error('❌ Error loading footer:', error);
        // Fallback: Show a simple footer
        const footerContainer = document.getElementById('app-footer');
        if (footerContainer) {
            footerContainer.innerHTML = `
                <footer class="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
                    <div class="max-w-7xl mx-auto px-6 py-12">
                        <div class="border-t border-gray-700 pt-8">
                            <div class="flex flex-col md:flex-row justify-between items-center">
                                <div class="mb-4 md:mb-0">
                                    <p class="text-gray-400">© 2025 <span class="text-yellow-400 font-bold">FreeToolHub</span>. All rights reserved.</p>
                                    <p class="text-gray-500 text-sm mt-1">Professional Tools, Forever Free 💛</p>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <span class="text-gray-500 text-sm">Made with</span>
                                    <span class="text-red-500">❤️</span>
                                    <span class="text-gray-500 text-sm">for productivity</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            `;
        }
    }
}

// Auto-load on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}


