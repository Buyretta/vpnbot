// Inline Edit Module
// Enables inline editing for table cells

export function initializeInlineEdit() {
    const rows = document.querySelectorAll('[data-inline-edit]');
    
    rows.forEach(row => {
        const input = row.querySelector('[data-edit-target]');
        const btnEdit = row.querySelector('[data-action="edit"]');
        const btnSave = row.querySelector('[data-action="save"]');
        const btnCancel = row.querySelector('[data-action="cancel"]');
        
        if (!input || !btnEdit || !btnSave || !btnCancel) return;
        
        const orig = { value: input.value };
        
        function setMode(editing) {
            if (editing) {
                input.readOnly = false;
                input.classList.add('is-editing');
                btnEdit.classList.add('d-none');
                btnSave.classList.remove('d-none');
                btnCancel.classList.remove('d-none');
                input.focus();
                try { input.setSelectionRange(input.value.length, input.value.length); } catch (_) {}
            } else {
                input.readOnly = true;
                input.classList.remove('is-editing');
                btnEdit.classList.remove('d-none');
                btnSave.classList.add('d-none');
                btnCancel.classList.add('d-none');
            }
        }
        
        btnEdit.addEventListener('click', () => setMode(true));
        btnCancel.addEventListener('click', () => { input.value = orig.value; setMode(false); });
        row.addEventListener('submit', () => { orig.value = input.value; setMode(false); });
    });
}
