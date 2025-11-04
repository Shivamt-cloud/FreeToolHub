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

        const response = await fetch('/templates/footer.html');
        if (!response.ok) {
            throw new Error(`Failed to load footer: ${response.status}`);
        }

        const footerHTML = await response.text();
        footerContainer.innerHTML = footerHTML;

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


