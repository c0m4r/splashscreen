/**
 * TV Splash Screen Application
 * Handles keyboard navigation, countdown timer, and URL launching
 */

(function () {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        countdownSeconds: 10,
        defaultOption: 'netflix',
        urls: {
            netflix: 'https://www.netflix.com/',
            youtube: 'https://www.youtube.com/'
        }
    };

    // ============================================
    // State
    // ============================================
    let currentSelection = CONFIG.defaultOption;
    let countdownValue = CONFIG.countdownSeconds;
    let countdownInterval = null;
    let isLaunching = false;
    let userInteracted = false;  // Track if user has interacted
    let mouseHasMoved = false;   // Track if mouse has moved since page load

    // ============================================
    // DOM Elements
    // ============================================
    const options = {
        netflix: document.getElementById('netflix'),
        youtube: document.getElementById('youtube')
    };
    const countdownNumber = document.querySelector('.countdown-number');
    const countdownBar = document.querySelector('.countdown-bar');
    const countdownContainer = document.getElementById('countdown');

    // ============================================
    // Selection Management
    // ============================================
    function selectOption(optionName, isUserAction = false) {
        if (isLaunching) return;

        // If user is interacting, disable countdown permanently
        if (isUserAction && !userInteracted) {
            userInteracted = true;
            stopCountdown();
        }

        // Remove selected class from all options
        Object.values(options).forEach(opt => opt.classList.remove('selected'));

        // Add selected class to new option
        options[optionName].classList.add('selected');
        currentSelection = optionName;
    }

    function toggleSelection() {
        const newSelection = currentSelection === 'netflix' ? 'youtube' : 'netflix';
        selectOption(newSelection, true);
    }

    // ============================================
    // Countdown Timer
    // ============================================
    function startCountdown() {
        countdownValue = CONFIG.countdownSeconds;
        updateCountdownDisplay();

        // Use a more precise timer approach
        let lastTick = Date.now();

        countdownInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastTick;

            // Only decrement if at least 1 second has passed
            if (elapsed >= 1000) {
                lastTick = now;
                countdownValue--;
                updateCountdownDisplay();

                if (countdownValue <= 0) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                    launchSelection();
                }
            }
        }, 100);  // Check more frequently for precision
    }

    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        // Hide the countdown container
        countdownContainer.style.opacity = '0';
        countdownContainer.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            countdownContainer.style.display = 'none';
        }, 300);
    }

    function updateCountdownDisplay() {
        countdownNumber.textContent = countdownValue;
        const progress = (countdownValue / CONFIG.countdownSeconds) * 100;
        countdownBar.style.width = progress + '%';

        // Add urgency styling when countdown is low
        if (countdownValue <= 3) {
            countdownNumber.style.color = '#ff4444';
            countdownContainer.style.borderColor = 'rgba(255, 68, 68, 0.5)';
        } else {
            countdownNumber.style.color = '';
            countdownContainer.style.borderColor = '';
        }
    }

    // ============================================
    // Launch Handler
    // ============================================
    function launchSelection() {
        if (isLaunching) return;
        isLaunching = true;

        // Clear countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        // Hide countdown immediately
        countdownContainer.style.display = 'none';

        // Add launching animation to selected option
        options[currentSelection].classList.add('launching');

        // Trigger TV power-off effect
        document.body.classList.add('tv-off');

        // Navigate to selected URL after animation completes
        setTimeout(() => {
            window.location.href = CONFIG.urls[currentSelection];
        }, 900);
    }

    // ============================================
    // Keyboard Event Handler
    // ============================================
    function handleKeydown(event) {
        if (isLaunching) return;

        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                selectOption('netflix', true);
                break;

            case 'ArrowDown':
                event.preventDefault();
                selectOption('youtube', true);
                break;

            case 'Tab':
                event.preventDefault();
                toggleSelection();
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                launchSelection();
                break;

            // Number keys for quick selection
            case '1':
                selectOption('netflix', true);
                break;
            case '2':
                selectOption('youtube', true);
                break;
        }
    }

    // ============================================
    // Click/Touch/Hover Handlers
    // ============================================
    function setupClickHandlers() {
        Object.entries(options).forEach(([name, element]) => {
            // Click to launch
            element.addEventListener('click', () => {
                selectOption(name, true);
                launchSelection();
            });

            // Hover to select (only after mouse has moved)
            element.addEventListener('mouseenter', () => {
                if (!isLaunching && mouseHasMoved) {
                    selectOption(name, true);
                }
            });
        });

        // Track when mouse actually moves (not just initial position)
        document.addEventListener('mousemove', () => {
            mouseHasMoved = true;
        }, { once: true });
    }

    // ============================================
    // Mouse Wheel Handler
    // ============================================
    function handleWheel(event) {
        if (isLaunching) return;

        event.preventDefault();

        if (event.deltaY < 0) {
            // Scroll up - select Netflix (top)
            selectOption('netflix', true);
        } else if (event.deltaY > 0) {
            // Scroll down - select YouTube (bottom)
            selectOption('youtube', true);
        }
    }

    // ============================================
    // Reset Application State
    // ============================================
    function resetApp() {
        // Remove TV-off animation class
        document.body.classList.remove('tv-off');

        // Reset state variables
        isLaunching = false;
        userInteracted = false;
        countdownValue = CONFIG.countdownSeconds;

        // Hide countdown (user came back, so don't auto-start)
        countdownContainer.style.display = 'none';
        userInteracted = true;

        // Remove launching class from all options
        Object.values(options).forEach(opt => opt.classList.remove('launching'));

        // Re-select default option
        selectOption(CONFIG.defaultOption);

        console.log('TV Splash Screen reset after back navigation (no auto-countdown)');
    }

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Set initial selection
        selectOption(CONFIG.defaultOption);

        // Start countdown
        startCountdown();

        // Setup event listeners
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('wheel', handleWheel, { passive: false });
        setupClickHandlers();

        // Handle back button navigation (page restored from bfcache)
        window.addEventListener('pageshow', (event) => {
            if (event.persisted || isLaunching) {
                resetApp();
            }
        });

        // Also handle visibility change (fallback for some browsers)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && isLaunching) {
                resetApp();
            }
        });

        // Focus the page for keyboard events
        document.body.focus();

        console.log('TV Splash Screen initialized');
        console.log('Controls: Arrow Up/Down, Tab, Enter, or click');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
