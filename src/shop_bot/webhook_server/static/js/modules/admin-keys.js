// Admin Keys Module
// Управление ключами VPN, модалки, flatpickr

import { getCsrfToken } from './core.js';

export function initializeAdminKeysPage() {
    // Полный список пользователей -> построим карту @username -> telegram_id на клиенте
    const USERS = JSON.parse(document.querySelector('#users-data')?.textContent || '{}');
    
    // Модалка изменения срока действия
    const expiryModal = document.getElementById('expiryModal');
    const expiryDateInput = document.getElementById('expiry_date');
    const expirySaveBtn = document.getElementById('expiry-save-btn');
    
    if (expiryModal && expiryDateInput && expirySaveBtn && window.flatpickr) {
        flatpickr(expiryDateInput, {
            enableTime: true,
            dateFormat: 'Y-m-d H:i:S',
            time_24hr: true,
            locale: 'ru',
            minDate: 'today',
            defaultHour: 23,
            defaultMinute: 59,
            defaultSeconds: 59
        });
        
        expirySaveBtn.addEventListener('click', async () => {
            const keyId = expirySaveBtn.getAttribute('data-key-id');
            const date = expiryDateInput.value;
            if (!keyId || !date) return;
            
            try {
                const response = await fetch(`/admin/keys/${keyId}/expiry`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({ expiry_date: date })
                });
                
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Ошибка при сохранении срока действия');
                }
            } catch (error) {
                alert('Ошибка сети');
            }
        });
    }
    
    // Модалка комментария
    const commentModal = document.getElementById('commentModal');
    const commentInput = document.getElementById('commentInput');
    const commentSaveBtn = document.getElementById('comment-save-btn');
    
    if (commentModal && commentInput && commentSaveBtn) {
        commentSaveBtn.addEventListener('click', async () => {
            const keyId = commentSaveBtn.getAttribute('data-key-id');
            const comment = commentInput.value.trim();
            if (!keyId) return;
            
            try {
                const response = await fetch(`/admin/keys/${keyId}/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({ comment: comment })
                });
                
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Ошибка при сохранении комментария');
                }
            } catch (error) {
                alert('Ошибка сети');
            }
        });
    }
    
    // Перенос панели удаления истёкших над таблицей ключей
    const toolbar = document.getElementById('expired-toolbar');
    const table = document.getElementById('keys-table');
    if (toolbar && table) {
        const tableContainer = table.closest('.table-responsive');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(toolbar, tableContainer);
        }
    }
    
    // Обработчики кнопок изменения срока и комментария
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="edit-expiry"]');
        if (btn) {
            const keyId = btn.getAttribute('data-key-id');
            const currentExpiry = btn.getAttribute('data-expiry');
            if (expiryDateInput && expirySaveBtn) {
                expiryDateInput.value = currentExpiry || '';
                expirySaveBtn.setAttribute('data-key-id', keyId);
                const modal = bootstrap.Modal.getInstance(expiryModal) || new bootstrap.Modal(expiryModal);
                modal.show();
            }
        }
        
        const commentBtn = e.target.closest('[data-action="edit-comment"]');
        if (commentBtn) {
            const keyId = commentBtn.getAttribute('data-key-id');
            const currentComment = commentBtn.getAttribute('data-comment');
            if (commentInput && commentSaveBtn) {
                commentInput.value = currentComment || '';
                commentSaveBtn.setAttribute('data-key-id', keyId);
                const modal = bootstrap.Modal.getInstance(commentModal) || new bootstrap.Modal(commentModal);
                modal.show();
            }
        }
    });
    
    // Массовые действия
    const deleteExpiredBtn = document.getElementById('delete-expired-btn');
    if (deleteExpiredBtn) {
        deleteExpiredBtn.addEventListener('click', async () => {
            if (!confirm('Вы уверены, что хотите удалить все истёкшие ключи?')) return;
            
            try {
                const response = await fetch('/admin/keys/delete-expired', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken()
                    }
                });
                
                if (response.ok) {
                    window.location.reload();
                } else {
                    alert('Ошибка при удалении');
                }
            } catch (error) {
                alert('Ошибка сети');
            }
        });
    }
}
