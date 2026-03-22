// Users Page Module
// Поиск, пагинация, управление ключами пользователей

export function initializeUsersPage() {
    const input = document.getElementById('users-search');
    const table = document.getElementById('users-table');
    const perPageSel = document.getElementById('users-per-page');
    const tbody = document.getElementById('users-tbody');
    const baseUrl = document.getElementById('users-base-url')?.value || '/admin/users-table-partial';
    
    if (!input || !table) return;
    
    function norm(s) { 
        return (s || '').toString().toLowerCase().trim(); 
    }
    
    // Храним раскрытые ключи между автообновлениями
    const LS_KEY = 'users_open_keys_ids';
    
    function loadOpenSet() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            return new Set(Array.isArray(arr) ? arr : []);
        } catch (_) { 
            return new Set(); 
        }
    }
    
    function saveOpenSet(set) {
        try { 
            localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set))); 
        } catch (_) {}
    }
    
    const openSet = loadOpenSet();
    
    function getMainTbody() {
        return table.tBodies && table.tBodies.length ? table.tBodies[0] : table.querySelector('tbody');
    }
    
    function getRows() {
        const tbody = getMainTbody();
        if (!tbody) return [];
        return Array.from(tbody.children).filter(tr => tr.tagName === 'TR' && !tr.classList.contains('keys-row'));
    }
    
    function getKeysRowByUid(uid) { 
        return document.getElementById('keys-' + uid); 
    }
    
    async function fetchKeysForUid(uid) {
        const row = getKeysRowByUid(uid);
        if (!row) return;
        const container = row.querySelector('.keys-container');
        if (!container) return;
        
        const btn = table.querySelector(`[data-toggle="keys"][data-user="${uid}"]`);
        const url = btn?.getAttribute('data-keys-url');
        if (!url) return;

        try {
            const resp = await fetch(url, { headers: { 'Accept': 'text/html' }, cache: 'no-store', credentials: 'same-origin' });
            if (!resp.ok) throw new Error('Failed to fetch');
            const html = await resp.text();
            container.innerHTML = html;
        } catch(e) {
            container.innerHTML = `<div class="p-3 text-danger small">Ошибка загрузки: ${e.message}</div>`;
        }
    }

    async function openKeysForUid(uid) {
        const row = getKeysRowByUid(uid);
        if (!row) return;
        row.style.display = '';
        openSet.add(String(uid));
        saveOpenSet(openSet);
        const btn = table.querySelector(`[data-toggle="keys"][data-user="${uid}"]`);
        if (btn) {
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-outline-secondary');
        }
        await fetchKeysForUid(uid);
    }
    
    function closeKeysForUid(uid) {
        const row = getKeysRowByUid(uid);
        if (!row) return;
        row.style.display = 'none';
        openSet.delete(String(uid));
        saveOpenSet(openSet);
        const btn = table.querySelector(`[data-toggle="keys"][data-user="${uid}"]`);
        if (btn) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-outline-secondary');
        }
    }
    
    function restoreOpenedKeys() {
        openSet.forEach(async (uid) => {
            const row = getKeysRowByUid(uid);
            if (row) {
                row.style.display = '';
                const btn = table.querySelector(`[data-toggle="keys"][data-user="${uid}"]`);
                if (btn) {
                    btn.classList.add('btn-secondary');
                    btn.classList.remove('btn-outline-secondary');
                }
                await fetchKeysForUid(uid);
            }
        });
    }
    
    function buildPartialUrl(page, perPage, q) {
        const params = new URLSearchParams();
        params.set('page', String(page || 1));
        params.set('per_page', String(perPage || 20));
        if (q) params.set('q', q);
        return baseUrl + '?' + params.toString();
    }
    
    function syncTbodyUrl(page, perPage, q) {
        if (!tbody) return;
        tbody.setAttribute('data-current-page', String(page));
        tbody.setAttribute('data-per-page', String(perPage));
        tbody.setAttribute('data-q', q || '');
        const url = buildPartialUrl(page, perPage, q);
        tbody.setAttribute('data-fetch-url', url);
    }
    
    function updateAddressBar(page, perPage, q) {
        try {
            const u = new URL(window.location.href);
            u.searchParams.set('page', String(page || 1));
            u.searchParams.set('per_page', String(perPage || 20));
            if (q) u.searchParams.set('q', q); 
            else u.searchParams.delete('q');
            history.replaceState(null, '', u.toString());
        } catch (_) {}
    }
    
    function refreshUsers() { 
        try { 
            return window.refreshContainerById('users-tbody'); 
        } catch (_) { 
            return Promise.resolve(); 
        } 
    }
    
    let tDeb = null;
    
    function onSearchChanged() {
        clearTimeout(tDeb);
        tDeb = setTimeout(async () => {
            const q = input.value.trim();
            const perPage = Number(perPageSel?.value || tbody?.getAttribute('data-per-page') || 20);
            const page = 1;
            syncTbodyUrl(page, perPage, q);
            updateAddressBar(page, perPage, q);
            await refreshUsers();
        }, 250);
    }
    
    input.addEventListener('input', onSearchChanged);
    input.addEventListener('search', onSearchChanged);
    
    if (perPageSel) {
        perPageSel.addEventListener('change', async () => {
            const q = input.value.trim();
            const perPage = Number(perPageSel.value || 20);
            const page = 1;
            syncTbodyUrl(page, perPage, q);
            updateAddressBar(page, perPage, q);
            await refreshUsers();
        });
    }
    
    // Пагинация
    document.addEventListener('click', async (e) => {
        const a = e.target.closest('.pagination a.page-link');
        if (!a) return;
        e.preventDefault();
        const page = Number(a.getAttribute('data-page') || '1');
        if (!page || page < 1) return;
        const q = input.value.trim();
        const perPage = Number(perPageSel?.value || 20);
        syncTbodyUrl(page, perPage, q);
        updateAddressBar(page, perPage, q);
        await refreshUsers();
        document.querySelectorAll('.pagination li').forEach(li => li.classList.remove('active'));
        const li = a.closest('li'); 
        if (li) li.classList.add('active');
    });
    
    // При автообновлении tbody — снова применяем фильтр
    (function() {
        if (!tbody) return;
        let t = null;
        const obs = new MutationObserver(() => {
            clearTimeout(t);
            t = setTimeout(() => { restoreOpenedKeys(); }, 50);
        });
        obs.observe(tbody, { childList: true, subtree: true });
    })();
    
    // Тоггл строки с ключами
    table.addEventListener('click', function(e) {
        const btn = e.target.closest('[data-toggle="keys"]');
        if (!btn) return;
        const uid = btn.getAttribute('data-user');
        if (!uid) return;
        const isOpen = btn.classList.contains('btn-secondary');
        if (isOpen) {
            closeKeysForUid(uid);
        } else {
            openKeysForUid(uid);
        }
    });
    
    // Восстановление при загрузке
    restoreOpenedKeys();
}
