(function() {
    'use strict';
    console.log("[Mod Loader] Active");

    // Hook into Unity's Module configuration object before it loads
    window.Module = window.Module || {};
    
    const originalOnRuntimeInitialized = window.Module.onRuntimeInitialized;
    window.Module.onRuntimeInitialized = function() {
        if (originalOnRuntimeInitialized) {
            originalOnRuntimeInitialized();
        }
        console.log("[Mod Loader] Unity runtime initialized. Accessing memory...");
        startModLoop();
    };

    function startModLoop() {
        function tick() {
            try {
                // Unity exposes the WASM memory buffer globally via Module.HEAP8 or HEAPF32
                if (window.Module && window.Module.HEAP8) {
                    const buffer = window.Module.HEAP8.buffer;
                    const dataView = new DataView(buffer);

                    // TODO: Insert your offset writes here once you have them, e.g.:
                    // dataView.setInt32(PRESENT_OFFSET, 99999, true);
                }
            } catch (e) {
                // Suppress errors during frame ticks
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
})();