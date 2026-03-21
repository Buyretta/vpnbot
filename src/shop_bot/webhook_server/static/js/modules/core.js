// Core Utilities Module
// CSRF helper (meta -> token)
export function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
}

// Programmatic toast API
export function showToast(category, message, delay) {
    try {
        const cont = document.getElementById('toast-container');
        if (!cont) return;
        const el = document.createElement('div');
        const cat = (category === 'danger' ? 'danger' : (category === 'success' ? 'success' : (category === 'warning' ? 'warning' : 'secondary')));
        el.className = 'toast fade align-items-center text-bg-' + cat;
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-live', 'assertive');
        el.setAttribute('aria-atomic', 'true');
        el.innerHTML = '<div class="d-flex"><div class="toast-body">' + (message || '') + '</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
        cont.appendChild(el);
        new bootstrap.Toast(el, { delay: Math.max(2000, delay || 4000), autohide: true }).show();
    } catch (_) { }
}

// HTML safety guard: avoid injecting full HTML documents (error pages) into partial containers
export function isFullDocument(html) {
    if (!html) return false;
    const s = String(html).trim().slice(0, 512).toLowerCase();
    if (s.startsWith('<!doctype') || s.startsWith('<html')) return true;
    // Heuristic for common proxy error pages
    if (s.includes('<head') && s.includes('<title') && s.includes('</html>')) return true;
    return false;
}

// Global partial refresh by container id
export async function refreshContainerById(id) {
    const node = document.getElementById(id);
    if (!node) return;
    const url = node.getAttribute('data-fetch-url');
    if (!url) return;
    try {
        const resp = await fetch(url, { headers: { 'Accept': 'text/html' }, cache: 'no-store', credentials: 'same-origin' });
        if (resp.redirected) { window.location.href = resp.url; return; }
        if (resp.status === 401 || resp.status === 403) { window.location.href = '/login'; return; }
        if (!resp.ok) return;
        const html = await resp.text();
        if (isFullDocument(html)) {
            try { showToast('warning', 'Не удалось обновить блок: получена HTML-страница сервера.'); } catch (_) { }
            return;
        }
        if (html && html !== node.innerHTML) {
            // lock height to avoid layout shift
            const prevH = node.offsetHeight;
            if (prevH > 0) node.style.minHeight = prevH + 'px';
            node.classList.add('is-swapping');
            node.innerHTML = html;
            try {
                node.classList.add('flash');
                setTimeout(() => node.classList.remove('flash'), 600);
            } catch (_) { }
            try { initTooltipsWithin(node); } catch (_) { }
            // Re-bind confirmation/AJAX handlers for newly injected forms
            try { setupConfirmationForms(node); } catch (_) { }
            // unlock after transition
            setTimeout(() => { node.style.minHeight = ''; node.classList.remove('is-swapping'); }, 260);
        }
    } catch (_) { }
}
