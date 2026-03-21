// Auto Refresh Module
import { refreshContainerById } from './core.js';

// Global auto-refresh (disabled by default)
export function initializeGlobalAutoRefresh() {
    // Disabled - using selective auto-refresh instead
}

// Selective auto-update for blocks with data-fetch-url
export function initializeSoftAutoUpdate() {
    const nodes = Array.from(document.querySelectorAll('[data-fetch-url]'));
    if (!nodes.length) return;

    nodes.forEach(node => {
        const url = node.getAttribute('data-fetch-url');
        const interval = parseInt(node.getAttribute('data-fetch-interval') || '10000', 10);

        if (interval > 0) {
            setInterval(() => {
                const id = node.id;
                if (id) {
                    refreshContainerById(id);
                }
            }, interval);
        }
    });
}
