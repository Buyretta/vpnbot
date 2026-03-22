// Soft Select Component Module
// Custom dropdown component with search functionality

export function initializeSoftSelects() {
    const softSelects = document.querySelectorAll('.soft-select');
    
    softSelects.forEach(wrap => {
        const toggle = wrap.querySelector('.soft-select-toggle');
        const menu = wrap.querySelector('.soft-select-menu');
        const select = wrap.querySelector('select');
        
        if (!toggle || !menu || !select) return;
        
        let isOpen = false;
        
        function openMenu() {
            isOpen = true;
            wrap.classList.add('open');
            menu.style.display = 'block';
            
            // Populate menu with options
            populateMenu();
        }
        
        function closeMenu() {
            isOpen = false;
            wrap.classList.remove('open');
            menu.style.display = 'none';
        }
        
        function populateMenu() {
            const options = select.querySelectorAll('option');
            menu.innerHTML = '';
            
            options.forEach(option => {
                const item = document.createElement('div');
                item.className = 'soft-select-item';
                item.textContent = option.textContent;
                item.dataset.value = option.value;
                
                item.addEventListener('click', () => {
                    select.value = option.value;
                    toggle.textContent = option.textContent;
                    closeMenu();
                    
                    // Trigger change event
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                });
                
                menu.appendChild(item);
            });
        }
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOpen) closeMenu();
            else openMenu();
        });
        
        document.addEventListener('click', (e) => {
            if (!wrap.contains(e.target)) closeMenu();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        
        // Sync select changes with toggle
        select.addEventListener('change', () => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
                toggle.textContent = selectedOption.textContent;
            }
        });
        
        // Initialize with current selection
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
            toggle.textContent = selectedOption.textContent;
        }
    });
}
