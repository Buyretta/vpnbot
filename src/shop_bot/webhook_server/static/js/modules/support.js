// Support & Tickets Module
import { refreshContainerById } from './core.js';

export function initializeTicketAutoRefresh() {
    const root = document.getElementById('ticket-root');
    if (!root) return;

    const messagesContainer = document.getElementById('ticket-messages');
    if (!messagesContainer) return;

    const refreshUrl = messagesContainer.getAttribute('data-fetch-url');
    if (!refreshUrl) return;

    // Auto-refresh every 5 seconds
    let lastMessageCount = 0;
    const refreshInterval = setInterval(async () => {
        try {
            const response = await fetch(refreshUrl, {
                headers: { 'Accept': 'text/html' },
                cache: 'no-store',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const html = await response.text();
                if (html !== messagesContainer.innerHTML) {
                    messagesContainer.innerHTML = html;
                    // Scroll to bottom if new messages
                    const currentCount = messagesContainer.querySelectorAll('.ticket-message').length;
                    if (currentCount > lastMessageCount) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                    lastMessageCount = currentCount;
                }
            }
        } catch (error) {
            console.error('Error refreshing ticket messages:', error);
        }
    }, 5000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(refreshInterval);
    });
}
