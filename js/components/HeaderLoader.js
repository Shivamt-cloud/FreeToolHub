/**
 * HeaderLoader.js - Loads the reusable header component into pages
 */

async function loadHeader() {
    try {
        const headerContainer = document.getElementById('app-header');
        if (!headerContainer) {
            console.warn('Header container (#app-header) not found');
            return;
        }

        const response = await fetch('/templates/header.html');
        if (!response.ok) {
            throw new Error(`Failed to load header: ${response.status}`);
        }

        const headerHTML = await response.text();
        
        // CRITICAL FIX: Scripts inserted via innerHTML don't execute automatically!
        // We need to extract and execute script tags manually
        
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = headerHTML;
        
        // Extract all script tags
        const scripts = tempDiv.querySelectorAll('script');
        console.log(`📜 Found ${scripts.length} script tag(s) in header template`);
        const scriptsToExecute = [];
        
        scripts.forEach((script, index) => {
            if (script.src) {
                // External script - create new script element
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.async = script.async;
                newScript.defer = script.defer;
                scriptsToExecute.push({ type: 'external', script: newScript, index });
                console.log(`📜 Script ${index + 1}: External script - ${script.src}`);
            } else {
                // Inline script - extract content
                const scriptContent = script.textContent || script.innerHTML;
                if (scriptContent.trim()) {
                    scriptsToExecute.push({ type: 'inline', script: scriptContent, index });
                    console.log(`📜 Script ${index + 1}: Inline script (${scriptContent.length} chars)`);
                } else {
                    console.warn(`⚠️ Script ${index + 1}: Empty script tag found`);
                }
            }
            // Remove script from temp div
            script.remove();
        });
        
        // Insert HTML without script tags FIRST
        headerContainer.innerHTML = tempDiv.innerHTML;
        console.log('✅ Header HTML inserted into DOM');
        
        // Force a synchronous reflow to ensure DOM is ready
        void headerContainer.offsetHeight;
        
        // DIRECT TIME UPDATE - works immediately, doesn't wait for scripts
        function updateTimeDirectly() {
            try {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                
                const timeEl = document.getElementById('tile-time');
                const dateEl = document.getElementById('tile-date');
                
                if (timeEl) {
                    timeEl.textContent = timeStr;
                    console.log('✅ DIRECT: Updated tile-time to', timeStr);
                } else {
                    console.error('❌ DIRECT: tile-time element NOT FOUND');
                }
                
                if (dateEl) {
                    dateEl.textContent = dateStr;
                    console.log('✅ DIRECT: Updated tile-date to', dateStr);
                } else {
                    console.error('❌ DIRECT: tile-date element NOT FOUND');
                }
                
                // Start interval to update every second
                if (!window.headerTimeInterval) {
                    window.headerTimeInterval = setInterval(updateTimeDirectly, 1000);
                    console.log('✅ DIRECT: Time interval started');
                }
            } catch (error) {
                console.error('❌ DIRECT time update error:', error);
            }
        }
        
        // Try immediate update
        updateTimeDirectly();
        
        // Also try after small delays
        setTimeout(updateTimeDirectly, 100);
        setTimeout(updateTimeDirectly, 300);
        setTimeout(updateTimeDirectly, 500);
        
        // Execute scripts sequentially with a small delay to ensure DOM is ready
        scriptsToExecute.forEach((item, idx) => {
            setTimeout(() => {
                try {
                    if (item.type === 'inline') {
                        console.log(`🔧 Executing script ${item.index + 1} (${item.script.length} chars)...`);
                        
                        // Method 1: Try using eval in a try-catch (faster, more reliable)
                        try {
                            // Create a function scope to avoid variable conflicts
                            const scriptFunc = new Function(item.script);
                            scriptFunc();
                            console.log(`✅ Script ${item.index + 1} executed via Function constructor`);
                        } catch (evalError) {
                            console.warn(`⚠️ Function constructor failed, trying script element:`, evalError.message);
                            
                            // Method 2: Fallback to script element
                            const scriptElement = document.createElement('script');
                            scriptElement.textContent = item.script;
                            // Append to document body for proper execution context
                            document.body.appendChild(scriptElement);
                            console.log(`✅ Script ${item.index + 1} executed via script element`);
                            
                            // Don't remove immediately - let it stay for execution
                            setTimeout(() => {
                                if (scriptElement.parentNode) {
                                    scriptElement.remove();
                                }
                            }, 2000);
                        }
                    } else {
                        // External script - append to head
                        document.head.appendChild(item.script);
                        console.log(`✅ Script ${item.index + 1} executed (external)`);
                    }
                } catch (error) {
                    console.error(`❌ Error executing script ${item.index + 1}:`, error);
                    console.error('Script content preview:', item.script ? item.script.substring(0, 200) : 'N/A');
                    console.error('Full error:', error.stack);
                }
            }, idx * 200); // Increased delay between scripts
        });

        console.log('✅ Header loaded and scripts queued for execution');
        
        // Force immediate time update after header loads (check multiple times)
        [300, 600, 1000, 2000].forEach(delay => {
            setTimeout(() => {
                try {
                    // Try the direct update function first
                    if (typeof updateTimeDirectly === 'function') {
                        updateTimeDirectly();
                        console.log(`✅ Forced direct time update at ${delay}ms`);
                    }
                    
                    // Also try updateTileTime if it exists
                    if (typeof updateTileTime === 'function') {
                        updateTileTime();
                        console.log(`✅ Forced tile time update at ${delay}ms`);
                    }
                } catch (error) {
                    console.error(`❌ Error forcing time update at ${delay}ms:`, error);
                }
            }, delay);
        });
        
        // Verify widget functions are available after scripts execute
        // Check multiple times to catch all initialization
        [100, 300, 500, 1000, 2000].forEach(delay => {
            setTimeout(() => {
                const hasInitWeather = typeof initWeatherWidget === 'function';
                const hasInitWord = typeof initWordWidget === 'function';
                const hasSyncTileData = typeof syncTileData === 'function';
                const hasInitHeaderTiles = typeof initHeaderTiles === 'function';
                const hasInitHeaderWidgets = typeof initHeaderWidgets === 'function';
                
                if (delay === 500) {
                    console.log('🔍 Widget functions check (500ms):', {
                        initWeatherWidget: hasInitWeather,
                        initWordWidget: hasInitWord,
                        syncTileData: hasSyncTileData,
                        initHeaderTiles: hasInitHeaderTiles,
                        initHeaderWidgets: hasInitHeaderWidgets
                    });
                }
                
                // Try to manually initialize if functions exist and haven't been called
                if (hasInitHeaderWidgets && typeof initHeaderWidgets === 'function') {
                    try {
                        initHeaderWidgets();
                        console.log(`✅ Called initHeaderWidgets() at ${delay}ms`);
                    } catch (e) {
                        console.error(`❌ Error calling initHeaderWidgets() at ${delay}ms:`, e);
                    }
                }
                
                // Also try direct initialization as backup
                if (hasInitWeather && typeof initWeatherWidget === 'function') {
                    try {
                        // Check if already initialized by looking for data
                        const tempEl = document.getElementById('weather-temp');
                        if (!tempEl || tempEl.textContent === '--°C' || tempEl.textContent === 'Loading...') {
                            initWeatherWidget();
                            console.log(`✅ Manually initialized weather widget at ${delay}ms`);
                        }
                    } catch (e) {
                        console.error(`❌ Error manually initializing weather widget at ${delay}ms:`, e);
                    }
                }
                if (hasInitWord && typeof initWordWidget === 'function') {
                    try {
                        // Check if already initialized
                        const wordEl = document.getElementById('word-of-day-word');
                        if (!wordEl || wordEl.textContent === 'Loading...') {
                            initWordWidget();
                            console.log(`✅ Manually initialized word widget at ${delay}ms`);
                        }
                    } catch (e) {
                        console.error(`❌ Error manually initializing word widget at ${delay}ms:`, e);
                    }
                }
                
                // Ensure syncTileData is running
                if (hasSyncTileData && typeof syncTileData === 'function') {
                    try {
                        syncTileData();
                    } catch (e) {
                        console.error(`❌ Error calling syncTileData at ${delay}ms:`, e);
                    }
                }
            }, delay);
        });
    } catch (error) {
        console.error('❌ Error loading header:', error);
        // Fallback: Show a simple header
        const headerContainer = document.getElementById('app-header');
        if (headerContainer) {
            headerContainer.innerHTML = `
                <nav class="fixed w-full z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200">
                    <div class="max-w-7xl mx-auto px-6 py-4">
                        <div class="flex justify-between items-center">
                            <a href="/" class="text-2xl font-bold text-purple-600">FreeToolHub</a>
                            <div class="hidden lg:flex space-x-6">
                                <a href="/" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Home</a>
                                <a href="/#tools" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Tools</a>
                                <a href="/#about" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">About</a>
                                <a href="/#contact" class="text-gray-700 hover:text-purple-600 transition-colors font-medium">Contact</a>
                            </div>
                        </div>
                    </div>
                </nav>
            `;
        }
    }
}

// Auto-load on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}

