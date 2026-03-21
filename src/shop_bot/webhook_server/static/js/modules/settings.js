// Settings Page Module
// Сохранение активной вкладки, редактирование планов

export function initializeSettingsPage() {
    // Перед сохранением запоминаем текущую вкладку
    const form = document.querySelector('.settings-column-right form[action*="/settings"]');
    if (!form) return;
    
    const hidden = form.querySelector('#settings-next-hash');
    form.addEventListener('submit', function() {
        let hash = location.hash || '';
        if (!hash) {
            const active = document.querySelector('.nav.nav-pills .nav-link.active');
            if (active && active.getAttribute('href')) hash = active.getAttribute('href');
        }
        if (!hash) hash = '#panel';
        if (hidden) hidden.value = hash;
    });
    
    // Редактирование планов
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.plan-edit-toggle');
        if (!btn) return;
        
        const targetSel = btn.getAttribute('data-target');
        if (!targetSel) return;
        const panel = document.querySelector(targetSel);
        if (!panel) return;
        
        const hostSection = btn.closest('.plans-section');
        if (hostSection) {
            hostSection.querySelectorAll('.plan-edit.collapse.show').forEach(other => {
                if (other !== panel) {
                    const otherBtn = hostSection.querySelector(`.plan-edit-toggle[data-target="#${other.id}"]`);
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    other.style.maxHeight = other.scrollHeight + 'px';
                    requestAnimationFrame(() => {
                        other.style.maxHeight = '0px';
                        setTimeout(() => { other.classList.remove('show'); }, 220);
                    });
                }
            });
        }
        
        const isOpen = panel.classList.contains('show');
        if (!isOpen) {
            panel.classList.add('show');
            panel.style.maxHeight = panel.scrollHeight + 'px';
            setTimeout(() => { panel.style.maxHeight = 'none'; }, 230);
            btn.setAttribute('aria-expanded', 'true');
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            requestAnimationFrame(() => {
                panel.style.maxHeight = '0px';
                setTimeout(() => { panel.classList.remove('show'); }, 220);
            });
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}
