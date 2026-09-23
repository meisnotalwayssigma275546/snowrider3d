(function() {
    'use strict';
    console.log("[Score Mod] Initialized");

    let lastProcessedScore = 0;
    const MULTIPLIER = 10; // Adjust how much it multiplies by

    // Function to hook into score updates or DOM if the score is rendered in HTML
    function checkAndMultiplyScore(currentScore) {
        if (currentScore > 0 && currentScore % 5 === 0 && currentScore !== lastProcessedScore) {
            lastProcessedScore = currentScore;
            
            console.log(`[Score Mod] Milestone hit: ${currentScore}! Applying multiplier...`);
            
            // If you have access to the score variable or setter function, 
            // you modify/multiply it here:
            // return currentScore * MULTIPLIER;
        }
        return currentScore;
    }

    // Example ticker to check score state from memory/instance if available
    setInterval(() => {
        try {
            // If your game instance or window variable exposes score:
            if (window.gameScore !== undefined) {
                window.gameScore = checkAndMultiplyScore(window.gameScore);
            }
        } catch (e) {}
    }, 100);
})();