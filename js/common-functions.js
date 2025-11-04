/**
 * Common Functions for Tool Pages
 * Includes modal functions and basic utilities
 */

// Privacy Modal Functions
function openPrivacyModal() {
    // If we're on homepage, use the modal
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const modal = document.getElementById('privacy-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            return;
        }
    }
    // Otherwise, redirect to homepage with hash
    window.location.href = '/#privacy-modal';
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Support Modal Functions
function openSupportModal() {
    // If we're on homepage, use the modal
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const modal = document.getElementById('support-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            return;
        }
    }
    // Otherwise, redirect to homepage with hash
    window.location.href = '/#support-modal';
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modals when clicking outside
if (typeof window !== 'undefined') {
    window.addEventListener('click', function(event) {
        const privacyModal = document.getElementById('privacy-modal');
        if (privacyModal && event.target === privacyModal) {
            closePrivacyModal();
        }
        
        const supportModal = document.getElementById('support-modal');
        if (supportModal && event.target === supportModal) {
            closeSupportModal();
        }
    });
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.openPrivacyModal = openPrivacyModal;
    window.closePrivacyModal = closePrivacyModal;
    window.openSupportModal = openSupportModal;
    window.closeSupportModal = closeSupportModal;
}


