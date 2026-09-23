(function() {
    'use strict';

    let wasmHeap = null;

    // 1. Intercept WebAssembly Memory allocation to grab the live heap
    const originalMemory = window.WebAssembly.Memory;
    window.WebAssembly.Memory = function(descriptor) {
        let memory = new originalMemory(descriptor);
        wasmHeap = memory.buffer;
        console.log("[Direct Mod] WASM Heap intercepted!");
        return memory;
    };

    // 2. Main Mod Loop running every frame
    function runMods() {
        if (wasmHeap) {
            try {
                const view = new DataView(wasmHeap);
                
                // If you want to force infinite/high presents dynamically, 
                // or lock player state, you can write directly to your known offsets here.
                
            } catch (e) {
                // Ignore buffer detached errors during loading screens
            }
        }
        requestAnimationFrame(runMods);
    }

    requestAnimationFrame(runMods);
    console.log("[Direct Mod] Injected successfully. Waiting for game heap...");
})();