// Main Application Initialization
// Import all modules
import { initTooltipsWithin, initializeThemeToggle, initializePasswordToggles, initializeSettingsTabs } from './modules/ui.js';
import { initializeCsrfForForms, setupBotControlForms, setupConfirmationForms } from './modules/forms.js';
import { initializeDashboardCharts, initializeDashboardPage } from './modules/dashboard.js';
import { initializeTicketAutoRefresh } from './modules/support.js';
import { initializeGlobalAutoRefresh, initializeSoftAutoUpdate } from './modules/auto-refresh.js';
import { initializeBackupRestoreUI } from './modules/backup.js';
import { initializeSoftSelects } from './modules/soft-select.js';
import { initializeInlineEdit } from './modules/inline-edit.js';

// Page-specific modules
import { initializeUsersPage } from './modules/users.js';
import { initializeSettingsPage } from './modules/settings.js';
import { initializeMonitorPage } from './modules/monitor.js';
import { initializeLoginPage } from './modules/login.js';
import { initializeButtonConstructor } from './modules/button-constructor.js';
import { initializeAdminKeysPage } from './modules/admin-keys.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Core UI components
    initTooltipsWithin();
    initializeThemeToggle();
    initializePasswordToggles();
    initializeSettingsTabs();
    
    // Forms
    initializeCsrfForForms();
    setupBotControlForms();
    setupConfirmationForms();
    
    // Soft selects
    initializeSoftSelects();
    
    // Inline edit
    initializeInlineEdit();
    
    // Auto-refresh
    initializeGlobalAutoRefresh();
    initializeSoftAutoUpdate();
    
    // Backup/Restore
    initializeBackupRestoreUI();
    
    // Page-specific initialization based on current page
    const currentPage = document.body.getAttribute('data-page') || '';
    
    switch (currentPage) {
        case 'dashboard_page':
            initializeDashboardPage();
            break;
        case 'users_page':
            initializeUsersPage();
            break;
        case 'admin_keys_page':
            initializeAdminKeysPage();
            break;
        case 'settings_page':
            initializeSettingsPage();
            break;
        case 'monitor_page':
            initializeMonitorPage();
            break;
        case 'login_page':
            initializeLoginPage();
            break;
        case 'button_constructor_page':
            initializeButtonConstructor();
            break;
    }
    
    // Support (works on multiple pages)
    initializeTicketAutoRefresh();
    
    // Initialize all tooltips on the page
    initTooltipsWithin();
    
    // Re-bind confirmation forms for all forms
    setupConfirmationForms();
});
