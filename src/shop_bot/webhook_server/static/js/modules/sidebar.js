// Sidebar Module
// Управление сайдбаром, мобильная навигация

export function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.createElement('div');
    
    // Create overlay for mobile
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
    
    // Toggle sidebar
    function toggleSidebar() {
        if (sidebar) {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
            
            // Update toggle button icon
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = sidebar.classList.contains('open') 
                        ? 'ti ti-x' 
                        : 'ti ti-menu-2';
                }
            }
        }
    }
    
    // Close sidebar
    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = 'ti ti-menu-2';
                }
            }
        }
    }
    
    // Event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
    
    // Close sidebar when clicking on nav links (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = 'ti ti-menu-2';
                }
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize();
}
