// Backup & Restore Module
import { showToast, getCsrfToken } from './core.js';

export function initializeBackupRestoreUI() {
    const select = document.getElementById('existing_backup');
    const dateBadge = document.getElementById('backup-date');
    const restoreBtn = document.getElementById('restore-backup-btn');
    const downloadBtn = document.getElementById('download-backup-btn');
    
    if (!select) return;

    // Update date badge when backup is selected
    select.addEventListener('change', () => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value) {
            const date = selectedOption.getAttribute('data-date');
            if (dateBadge) {
                dateBadge.textContent = date || '—';
            }
        }
    });

    // Restore backup
    if (restoreBtn) {
        restoreBtn.addEventListener('click', async () => {
            const selectedValue = select.value;
            if (!selectedValue) {
                showToast('warning', 'Выберите бэкап для восстановления');
                return;
            }

            if (!confirm('Вы уверены, что хотите восстановить базу данных из выбранного бэкапа? Это действие необратимо.')) {
                return;
            }

            try {
                const response = await fetch('/admin/restore-backup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({ backup_file: selectedValue })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        showToast('success', 'База данных успешно восстановлена');
                        setTimeout(() => location.reload(), 2000);
                    } else {
                        showToast('danger', data.error || 'Не удалось восстановить бэкап');
                    }
                } else {
                    showToast('danger', 'Ошибка сервера при восстановлении');
                }
            } catch (error) {
                showToast('danger', 'Ошибка сети: ' + error.message);
            }
        });
    }

    // Download backup
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            const selectedValue = select.value;
            if (!selectedValue) {
                showToast('warning', 'Выберите бэкап для скачивания');
                return;
            }

            try {
                const response = await fetch('/admin/download-backup/' + selectedValue);
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = selectedValue;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    showToast('danger', 'Не удалось скачать бэкап');
                }
            } catch (error) {
                showToast('danger', 'Ошибка сети: ' + error.message);
            }
        });
    }
}
