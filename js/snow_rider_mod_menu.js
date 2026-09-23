// Toggle state for your mod menu button
let infinitePresentsActive = false;

function toggleInfinitePresents() {
    infinitePresentsActive = !infinitePresentsActive;
    console.log("[Mod Menu] Infinite Presents: " + (infinitePresentsActive ? "ON" : "OFF"));
}

// Main game loop (runs every frame)
function modMenuLoop() {
    if (infinitePresentsActive && window.sharedWasmHeap) {
        try {
            const view = new DataView(window.sharedWasmHeap);
            
            // NOTE: If you have the specific offset for the present counter (e.g., inside GameDataManager),
            // you write directly to it here. Alternatively, we force a high constant value:
            
            // Example: Writing 9999 to a known inventory/score offset address
            // view.setInt32(targetPresentAddress, 9999, true);
            
        } catch (e) {
            // Suppress errors during heap shifts
        }
    }
    requestAnimationFrame(modMenuLoop);
}

// Start the loop
requestAnimationFrame(modMenuLoop);