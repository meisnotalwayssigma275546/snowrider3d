(function() {
    'use strict';
    console.log("[Score Multiplier] Active and scanning heap...");

    let lastScore = -1;

    function scanAndModifyScore() {
        try {
            if (window.Module && window.Module.HEAP32) {
                const heap32 = window.Module.HEAP32;
                
                // Unity WebGL heaps are large typed arrays. We look for a changing score value.
                // (Assuming score starts at 0, goes to 1, 2, 3, 4, 5...)
                for (let i = 0; i < heap32.length; i++) {
                    let val = heap32[i];
                    
                    // If your current score hits 5 (or 10, 15), multiply it immediately
                    if (val > 0 && val % 5 === 0 && val === 5 && val !== lastScore) {
                        lastScore = val;
                        console.log(`[Score Multiplier] Found score match: ${val}. Multiplying...`);
                        
                        // Overwrite with a multiplied value (e.g., 50 or 500)
                        heap32[i] = 50; 
                        break;
                    }
                }
            }
        } catch (e) {
            // Suppress errors during heap reads
        }
        setTimeout(scanAndModifyScore, 200); // Check 5 times a second
    }

    setTimeout(scanAndModifyScore, 3000); // Wait 3s for game to fully load
})();