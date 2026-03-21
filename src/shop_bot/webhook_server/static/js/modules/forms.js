// Forms Module
import { getCsrfToken, showToast } from './core.js';
import { initTooltipsWithin } from './ui.js';

// Attach CSRF token to all POST forms
export function initializeCsrfForForms() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    const token = meta ? meta.getAttribute('content') : null;
    if (!token) return;

    document.querySelectorAll('form').forEach(form => {
        const method = (form.getAttribute('method') || '').toLowerCase();
        if (method !== 'post') return;
        form.addEventListener('submit', function () {
            if (form.querySelector('input[name="csrf_token"]')) return;
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'csrf_token';
            input.value = token;
            form.appendChild(input);
        });
    });
}

// Bot control forms (start/stop)
export function setupBotControlForms() {
    const startForm = document.querySelector('form[action*="start-bot"]');
    const stopForm = document.querySelector('form[action*="stop-bot"]');
    
    if (startForm) {
        startForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = new FormData(startForm);
                const response = await fetch(startForm.action, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    showToast('success', 'Бот успешно запущен');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showToast('danger', 'Не удалось запустить бота');
                }
            } catch (error) {
                showToast('danger', 'Ошибка сети');
            }
        });
    }
    
    if (stopForm) {
        stopForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = new FormData(stopForm);
                const response = await fetch(stopForm.action, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    showToast('success', 'Бот остановлен');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showToast('danger', 'Не удалось остановить бота');
                }
            } catch (error) {
                showToast('danger', 'Ошибка сети');
            }
        });
    }
}

// Confirmation dialogs for forms
export function setupConfirmationForms(root) {
    const scope = root || document;
    const forms = scope.querySelectorAll('form[data-confirm]');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const message = form.getAttribute('data-confirm');
            if (!message) return;
            
            e.preventDefault();
            if (confirm(message)) {
                form.submit();
            }
        });
    });
}
