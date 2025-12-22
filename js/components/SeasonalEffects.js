/**
 * SeasonalEffects.js - Adds festive seasonal effects including:
 * - Snow falling animation (December)
 * - Christmas celebration (December 25)
 * - New Year celebration (January 1)
 */

(function() {
    'use strict';

    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate(); // 1-31
    const isDecember = month === 12;
    const isJanuary = month === 1;
    const isChristmas = isDecember && day === 25;
    const isNewYear = isJanuary && day === 1;
    const isNewYearEve = isDecember && day === 31;

    // Initialize seasonal effects
    function initSeasonalEffects() {
        // Add snow effect during December
        if (isDecember || isNewYearEve) {
            createSnowEffect();
        }

        // Add dancing Santa with deer during December
        if (isDecember) {
            createDancingSanta();
        }

        // Christmas celebration
        if (isChristmas) {
            createChristmasCelebration();
        }

        // New Year celebration
        if (isNewYear) {
            createNewYearCelebration();
        }

        // New Year's Eve celebration
        if (isNewYearEve) {
            createNewYearEveCelebration();
        }
    }

    // Create snow falling effect
    function createSnowEffect() {
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        snowContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `;
        document.body.appendChild(snowContainer);

        const snowflakes = [];
        const snowflakeCount = 50;

        // Create snowflakes
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * -100}px;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: snowfall ${Math.random() * 3 + 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                pointer-events: none;
            `;
            snowContainer.appendChild(snowflake);
            snowflakes.push(snowflake);
        }

        // Add CSS animation
        if (!document.getElementById('snow-animation-style')) {
            const style = document.createElement('style');
            style.id = 'snow-animation-style';
            style.textContent = `
                @keyframes snowfall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                    }
                    100% {
                        transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Create dancing Santa with reindeer
    function createDancingSanta() {
        const santaContainer = document.createElement('div');
        santaContainer.id = 'dancing-santa-container';
        santaContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: -250px;
            z-index: 9999;
            pointer-events: none;
        `;
        
        // Create the sleigh with Santa and reindeer
        const sleigh = document.createElement('div');
        sleigh.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: ${isChristmas ? '4rem' : '3rem'};
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
            flex-direction: row-reverse;
        `;
        
        // Reindeer (2 in front - now on the right side)
        const reindeer1 = document.createElement('div');
        reindeer1.textContent = '🦌';
        reindeer1.style.cssText = `
            animation: deerBounce 0.6s ease-in-out infinite;
            animation-delay: 0s;
        `;
        
        const reindeer2 = document.createElement('div');
        reindeer2.textContent = '🦌';
        reindeer2.style.cssText = `
            animation: deerBounce 0.6s ease-in-out infinite;
            animation-delay: 0.2s;
        `;
        
        // Santa Claus (full emoji, dancing)
        const santa = document.createElement('div');
        santa.textContent = '🎅';
        santa.style.cssText = `
            animation: santaDance 0.8s ease-in-out infinite;
            transform-origin: center bottom;
            font-size: ${isChristmas ? '4.5rem' : '3.5rem'};
        `;
        
        // More reindeer (2 behind - now on the left side)
        const reindeer3 = document.createElement('div');
        reindeer3.textContent = '🦌';
        reindeer3.style.cssText = `
            animation: deerBounce 0.6s ease-in-out infinite;
            animation-delay: 0.4s;
        `;
        
        const reindeer4 = document.createElement('div');
        reindeer4.textContent = '🦌';
        reindeer4.style.cssText = `
            animation: deerBounce 0.6s ease-in-out infinite;
            animation-delay: 0.6s;
        `;
        
        sleigh.appendChild(reindeer1);
        sleigh.appendChild(reindeer2);
        sleigh.appendChild(santa);
        sleigh.appendChild(reindeer3);
        sleigh.appendChild(reindeer4);
        
        santaContainer.appendChild(sleigh);
        document.body.appendChild(santaContainer);
        
        // Add CSS animations
        if (!document.getElementById('santa-animation-style')) {
            const style = document.createElement('style');
            style.id = 'santa-animation-style';
            style.textContent = `
                @keyframes santaParade {
                    0% {
                        right: -250px;
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    95% {
                        opacity: 1;
                    }
                    100% {
                        right: calc(100% + 250px);
                        opacity: 0;
                    }
                }
                
                @keyframes santaDance {
                    0%, 100% {
                        transform: rotate(-10deg) translateY(0) scale(1);
                    }
                    25% {
                        transform: rotate(10deg) translateY(-20px) scale(1.15);
                    }
                    50% {
                        transform: rotate(-10deg) translateY(0) scale(1);
                    }
                    75% {
                        transform: rotate(10deg) translateY(-20px) scale(1.15);
                    }
                }
                
                @keyframes deerBounce {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-12px) rotate(-5deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Make Santa appear periodically
        // On Christmas Day: every 15 seconds, otherwise every 30 seconds
        const interval = isChristmas ? 15000 : 30000;
        const animationDuration = isChristmas ? 18 : 20;
        
        function showSanta() {
            santaContainer.style.display = 'flex';
            santaContainer.style.animation = `santaParade ${animationDuration}s linear`;
            santaContainer.style.right = '-250px';
            
            // Reset animation after it completes
            setTimeout(() => {
                santaContainer.style.display = 'none';
                santaContainer.style.animation = 'none';
                setTimeout(showSanta, interval);
            }, animationDuration * 1000);
        }
        
        // Initial delay, then show
        setTimeout(showSanta, 2000);
    }

    // Create Christmas celebration
    function createChristmasCelebration() {
        // Add Christmas banner
        const banner = document.createElement('div');
        banner.id = 'christmas-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, #dc2626 0%, #16a34a 100%);
                color: white;
                text-align: center;
                padding: 1rem;
                z-index: 10000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideDown 0.5s ease-out;
            ">
                <div style="font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span>🎄</span>
                    <span>Merry Christmas! 🎅</span>
                    <span>🎄</span>
                </div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.95;">
                    Wishing you joy, peace, and happiness this holiday season! ✨
                </div>
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);

        // Adjust body padding to account for banner
        document.body.style.paddingTop = '80px';

        // Add confetti effect
        createConfetti('🎄', '🎅', '⭐', '❄️');

        // Add Christmas music notification (optional, non-intrusive)
        setTimeout(() => {
            showCelebrationMessage('🎄 Merry Christmas! 🎄', 'May your day be filled with joy and laughter!');
        }, 1000);
    }

    // Create New Year celebration
    function createNewYearCelebration() {
        // Add New Year banner
        const banner = document.createElement('div');
        banner.id = 'newyear-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ec4899 100%);
                color: white;
                text-align: center;
                padding: 1rem;
                z-index: 10000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideDown 0.5s ease-out;
            ">
                <div style="font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span>🎊</span>
                    <span>Happy New Year! 🎉</span>
                    <span>🎊</span>
                </div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.95;">
                    Welcome to a new year filled with possibilities and success! ✨
                </div>
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);

        // Adjust body padding
        document.body.style.paddingTop = '80px';

        // Add confetti effect with New Year emojis
        createConfetti('🎊', '🎉', '⭐', '✨', '🎈', '🎁');

        // Show celebration message
        setTimeout(() => {
            showCelebrationMessage('🎉 Happy New Year! 🎉', 'Wishing you a year full of success and happiness!');
        }, 1000);

        // Countdown timer (if on New Year's Day)
        createNewYearCountdown();
    }

    // Create New Year's Eve celebration
    function createNewYearEveCelebration() {
        // Add countdown banner
        const banner = document.createElement('div');
        banner.id = 'newyear-eve-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                color: white;
                text-align: center;
                padding: 1rem;
                z-index: 10000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideDown 0.5s ease-out;
            ">
                <div style="font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span>🎆</span>
                    <span>New Year's Eve! 🎇</span>
                    <span>🎆</span>
                </div>
                <div id="countdown-timer" style="font-size: 1.2rem; margin-top: 0.5rem; font-weight: bold; color: #fbbf24;">
                    Loading countdown...
                </div>
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);

        // Adjust body padding
        document.body.style.paddingTop = '80px';

        // Start countdown
        startNewYearCountdown();

        // Add sparkle effect
        createSparkleEffect();
    }

    // Create confetti effect
    function createConfetti(...emojis) {
        const confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(confettiContainer);

        const confettiCount = 100;
        const duration = 5000; // 5 seconds

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.textContent = emoji;
            confetti.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 30 + 20}px;
                left: ${Math.random() * 100}%;
                top: -50px;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: confettiFall ${Math.random() * 2 + 3}s ease-out forwards;
                animation-delay: ${Math.random() * 1}s;
            `;
            confettiContainer.appendChild(confetti);
        }

        // Add CSS animation
        if (!document.getElementById('confetti-animation-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation-style';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(720deg);
                        opacity: 0;
                    }
                }
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove confetti after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.remove();
            }
        }, duration);
    }

    // Create sparkle effect for New Year's Eve
    function createSparkleEffect() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.id = 'sparkle-container';
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
            overflow: hidden;
        `;
        document.body.appendChild(sparkleContainer);

        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.textContent = '✨';
            sparkle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 15 + 10}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: sparkle ${Math.random() * 2 + 1}s ease-in-out infinite;
            `;
            sparkleContainer.appendChild(sparkle);

            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 3000);
        }

        // Add sparkle animation
        if (!document.getElementById('sparkle-animation-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-animation-style';
            style.textContent = `
                @keyframes sparkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Create sparkles periodically
        setInterval(createSparkle, 500);
    }

    // Show celebration message
    function showCelebrationMessage(title, message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 1rem;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
            animation: popIn 0.5s ease-out;
            max-width: 90%;
        `;
        messageDiv.innerHTML = `
            <div style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">${title}</div>
            <div style="font-size: 1.1rem; opacity: 0.95;">${message}</div>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 1.5rem;
                background: white;
                color: #6366f1;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 0.5rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Continue
            </button>
        `;
        document.body.appendChild(messageDiv);

        // Add pop-in animation
        if (!document.getElementById('popin-animation-style')) {
            const style = document.createElement('style');
            style.id = 'popin-animation-style';
            style.textContent = `
                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'popIn 0.3s ease-out reverse';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }

    // Start New Year countdown
    function startNewYearCountdown() {
        const countdownElement = document.getElementById('countdown-timer');
        if (!countdownElement) return;

        function updateCountdown() {
            const now = new Date();
            const nextYear = now.getFullYear() + 1;
            const newYear = new Date(nextYear, 0, 1, 0, 0, 0);
            const diff = newYear - now;

            if (diff <= 0) {
                countdownElement.textContent = '🎉 Happy New Year! 🎉';
                createConfetti('🎊', '🎉', '⭐', '✨');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <span style="color: #fbbf24;">${hours.toString().padStart(2, '0')}</span>:
                <span style="color: #60a5fa;">${minutes.toString().padStart(2, '0')}</span>:
                <span style="color: #f472b6;">${seconds.toString().padStart(2, '0')}</span>
                <div style="font-size: 0.8rem; margin-top: 0.25rem; opacity: 0.9;">
                    Until New Year ${nextYear}!
                </div>
            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Create New Year countdown (for January 1st)
    function createNewYearCountdown() {
        // Show a special message for the new year
        const countdownDiv = document.createElement('div');
        countdownDiv.id = 'newyear-countdown';
        countdownDiv.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
        `;
        countdownDiv.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">🎉 Welcome 2025! 🎉</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">Have an amazing year ahead!</div>
        `;
        document.body.appendChild(countdownDiv);

        // Add slide-up animation
        if (!document.getElementById('slideup-animation-style')) {
            const style = document.createElement('style');
            style.id = 'slideup-animation-style';
            style.textContent = `
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (countdownDiv.parentNode) {
                countdownDiv.style.animation = 'slideUp 0.3s ease-out reverse';
                setTimeout(() => countdownDiv.remove(), 300);
            }
        }, 10000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSeasonalEffects);
    } else {
        initSeasonalEffects();
    }

})();

