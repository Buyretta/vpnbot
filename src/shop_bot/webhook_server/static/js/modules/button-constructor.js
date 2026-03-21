// Button Constructor Module
// Конструктор кнопок для бота

export function initializeButtonConstructor() {
    class ButtonConstructor {
        constructor() {
            this.currentMenuType = localStorage.getItem('buttonConstructorMenuType') || 'main_menu';
            this.selectedButton = null;
            this.buttons = [];
            this.isPreviewLoading = false;
            this.init();
        }

        init() {
            const requiredElements = [
                'menu-type-select',
                'button-grid',
                'preview-area'
            ];
            
            const missingElements = requiredElements.filter(id => !document.getElementById(id));
            if (missingElements.length > 0) {
                console.error('Missing required elements:', missingElements);
                return;
            }
            
            this.bindEvents();
            this.loadButtons();
            this.disableLogoutButton();
            this.initSoftSelect();
        }

        initSoftSelect() {
            const wrap = document.querySelector('.soft-select[data-target="menu-type-select"]');
            const selectEl = document.getElementById('menu-type-select');
            if (!wrap || !selectEl) return;
            
            const toggleEl = document.getElementById('menu-type-select_toggle');
            const menuEl = document.getElementById('menu-type-select_menu');
            if (!toggleEl || !menuEl) return;

            function build() {
                menuEl.innerHTML = '';
                const opts = Array.from(selectEl.options || []);
                
                opts.forEach(opt => {
                    const item = document.createElement('div');
                    item.className = 'soft-select-item' + (opt.selected ? ' is-active' : '');
                    item.dataset.value = opt.value;
                    item.textContent = opt.textContent || '';
                    item.addEventListener('click', () => {
                        selectEl.value = opt.value;
                        menuEl.querySelectorAll('.soft-select-item').forEach(n => n.classList.remove('is-active'));
                        item.classList.add('is-active');
                        toggleEl.textContent = opt.textContent || '';
                        closeMenu();
                        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                    menuEl.appendChild(item);
                });
                
                const active = opts.find(o => o.selected) || opts.find(o => o.value === this.currentMenuType) || opts[0];
                toggleEl.textContent = active ? (active.textContent || '') : '';
            }

            function placeMenu() {
                const r = toggleEl.getBoundingClientRect();
                menuEl.style.position = 'fixed';
                menuEl.style.left = `${Math.round(r.left)}px`;
                menuEl.style.top = `${Math.round(r.bottom + 6)}px`;
                menuEl.style.width = `${Math.round(r.width)}px`;
                menuEl.style.zIndex = '1065';
            }

            function openMenu() {
                if (menuEl.parentElement !== document.body) document.body.appendChild(menuEl);
                placeMenu();
                wrap.classList.add('open');
                menuEl.style.display = 'block';
                window.addEventListener('scroll', placeMenu, true);
                window.addEventListener('resize', placeMenu, true);
            }

            function closeMenu() {
                wrap.classList.remove('open');
                menuEl.style.display = 'none';
                if (menuEl.parentElement === document.body) wrap.appendChild(menuEl);
                window.removeEventListener('scroll', placeMenu, true);
                window.removeEventListener('resize', placeMenu, true);
            }

            toggleEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (wrap.classList.contains('open')) closeMenu(); else openMenu();
            });
            
            document.addEventListener('click', (e) => { 
                if (!wrap.contains(e.target)) closeMenu(); 
            });
            document.addEventListener('keydown', (e) => { 
                if (e.key === 'Escape') closeMenu(); 
            });

            build();
            selectEl.addEventListener('change', build);
        }

        bindEvents() {
            // Menu type change
            const menuSelect = document.getElementById('menu-type-select');
            if (menuSelect) {
                menuSelect.addEventListener('change', () => {
                    this.currentMenuType = menuSelect.value;
                    localStorage.setItem('buttonConstructorMenuType', this.currentMenuType);
                    this.loadButtons();
                });
            }

            // Save button
            const saveBtn = document.getElementById('save-buttons');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveButtons());
            }

            // Add button
            const addBtn = document.getElementById('add-button');
            if (addBtn) {
                addBtn.addEventListener('click', () => this.addNewButton());
            }
        }

        loadButtons() {
            // Здесь должна быть логика загрузки кнопок с сервера
            console.log('Loading buttons for menu:', this.currentMenuType);
        }

        saveButtons() {
            // Здесь должна быть логика сохранения кнопок на сервер
            console.log('Saving buttons for menu:', this.currentMenuType);
        }

        addNewButton() {
            // Здесь должна быть логика добавления новой кнопки
            console.log('Adding new button');
        }

        disableLogoutButton() {
            // Отключаем кнопку выхода из конструктора
            const logoutBtn = document.querySelector('button[data-button-id="btn_logout"]');
            if (logoutBtn) {
                logoutBtn.disabled = true;
                logoutBtn.title = 'Кнопка выхода не может быть изменена';
            }
        }
    }

    // Инициализация
    const buttonConstructor = new ButtonConstructor();
    window.buttonConstructor = buttonConstructor;
}
