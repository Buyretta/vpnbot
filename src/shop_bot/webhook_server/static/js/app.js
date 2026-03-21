// Main Application Initialization
// Import all modules
import { initTooltipsWithin, initializeThemeToggle, initializePasswordToggles, initializeSettingsTabs } from './modules/ui.js';
import { initializeCsrfForForms, setupBotControlForms, setupConfirmationForms } from './modules/forms.js';
import { initializeDashboardCharts } from './modules/dashboard.js';
import { initializeTicketAutoRefresh } from './modules/support.js';
import { initializeGlobalAutoRefresh, initializeSoftAutoUpdate } from './modules/auto-refresh.js';
import { initializeBackupRestoreUI } from './modules/backup.js';
import { initializeSoftSelects } from './modules/soft-select.js';
import { initializeInlineEdit } from './modules/inline-edit.js';

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
    
    // Dashboard
    initializeDashboardCharts();
    
    // Support
    initializeTicketAutoRefresh();
    
    // Auto-refresh
    initializeGlobalAutoRefresh();
    initializeSoftAutoUpdate();
    
    // Backup/Restore
    initializeBackupRestoreUI();
    
    // Soft selects
    initializeSoftSelects();
    
    // Inline edit
    initializeInlineEdit();
    
    // Initialize all tooltips on the page
    initTooltipsWithin();
    
    // Re-bind confirmation forms for all forms
    setupConfirmationForms();
});
