/**
 * Widget Initialization Script
 * 
 * This file initializes widgets after the header loads.
 * Widget code is loaded from /js/widgets.js
 */

function initWidgets() {
    // Initialize Weather Widget if function exists
    if (typeof initWeatherWidget === 'function') {
        try {
            initWeatherWidget();
            console.log('✅ Weather widget initialized');
        } catch (error) {
            console.error('❌ Error initializing weather widget:', error);
        }
    } else {
        console.warn('⚠️ initWeatherWidget function not found. Loading widget code...');
    }

    // Initialize Word Widget if function exists
    if (typeof initWordWidget === 'function') {
        try {
            initWordWidget();
            console.log('✅ Word widget initialized');
        } catch (error) {
            console.error('❌ Error initializing word widget:', error);
        }
    } else {
        console.warn('⚠️ initWordWidget function not found. Loading widget code...');
    }
}

// Make initWidgets globally available
if (typeof window !== 'undefined') {
    window.initWidgets = initWidgets;
}

// Auto-initialize when DOM is ready and header is loaded
function tryInitWidgets() {
    // Check if header widgets exist
    const weatherWidget = document.getElementById('weather-widget');
    const wordWidget = document.getElementById('word-widget');
    
    if ((weatherWidget || wordWidget) && (typeof initWeatherWidget === 'function' || typeof initWordWidget === 'function')) {
        initWidgets();
    }
}

// Try initializing widgets after a delay to allow header to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for header to load (HeaderLoader loads async)
        setTimeout(tryInitWidgets, 1000);
    });
} else {
    setTimeout(tryInitWidgets, 1000);
}

// Also try when HeaderLoader finishes
if (typeof window !== 'undefined') {
    const originalLoadHeader = window.loadHeader;
    if (originalLoadHeader) {
        window.loadHeader = async function() {
            await originalLoadHeader();
            setTimeout(tryInitWidgets, 500);
        };
    }
}

