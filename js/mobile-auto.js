// ============================================
// CARGA AUTOMÁTICA DE VERSIÓN MÓVIL
// Solo incluye este script en cada página y todo se hace automático
// ============================================

(function() {
    'use strict';

    // ============================================
    // DETECCIÓN DE DISPOSITIVO MÓVIL
    // ============================================
    function isMobileDevice() {
        // Método 1: User Agent
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        
        // Método 2: Touch support
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Método 3: Screen size
        const isSmallScreen = window.innerWidth <= 768;
        
        // Es móvil si cumple al menos 2 de 3 condiciones
        return (isMobileUA && hasTouch) || (isMobileUA && isSmallScreen) || (hasTouch && isSmallScreen);
    }

    // ============================================
    // CARGAR CSS MÓVIL DINÁMICAMENTE
    // ============================================
    function loadMobileStyles() {
        // Verificar si ya está cargado
        if (document.getElementById('mobile-styles')) return;

        // Crear elemento link
        const link = document.createElement('link');
        link.id = 'mobile-styles';
        link.rel = 'stylesheet';
        link.href = '../css/mobile-styles.css';
        
        // Añadir al head
        document.head.appendChild(link);
        
        console.log('✅ Estilos móviles cargados');
    }

    // ============================================
    // INYECTAR CSS MÓVIL INLINE (Sin archivo externo)
    // ============================================
    function injectMobileStyles() {
        if (document.getElementById('mobile-styles-inline')) return;

        const style = document.createElement('style');
        style.id = 'mobile-styles-inline';
        style.textContent = `
            /* Variables móviles */
            :root {
                --mobile-header-height: 60px;
                --mobile-bottom-nav-height: 70px;
            }

            /* Estilos base móvil */
            @media (max-width: 768px) {
                body {
                    padding-bottom: var(--mobile-bottom-nav-height);
                }

                .sidebar {
                    display: none;
                }

                .main-content {
                    margin-left: 0;
                    padding: 1rem;
                    padding-top: calc(var(--mobile-header-height) + 1rem);
                }

                /* Header móvil */
                .mobile-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--mobile-header-height);
                    background: #1e293b;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1rem;
                    z-index: 1000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .mobile-header-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    flex: 1;
                    text-align: center;
                }

                .mobile-menu-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                /* Drawer */
                .mobile-drawer {
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 280px;
                    height: 100vh;
                    background: #1e293b;
                    color: white;
                    z-index: 2000;
                    transition: left 0.3s ease;
                    overflow-y: auto;
                }

                .mobile-drawer.open {
                    left: 0;
                }

                .mobile-drawer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1999;
                    display: none;
                }

                .mobile-drawer-overlay.show {
                    display: block;
                }

                .mobile-drawer-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .mobile-drawer-menu {
                    padding: 1rem 0;
                }

                .mobile-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .mobile-menu-item:active {
                    background: rgba(255, 255, 255, 0.1);
                }

                .mobile-menu-item.active {
                    background: #2563eb;
                    color: white;
                }

                /* Bottom Navigation */
                .mobile-bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: var(--mobile-bottom-nav-height);
                    background: white;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                    z-index: 999;
                }

                .mobile-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex: 1;
                    padding: 0.5rem;
                    text-decoration: none;
                    color: #64748b;
                    transition: all 0.2s;
                    font-size: 0.75rem;
                }

                .mobile-nav-item.active {
                    color: #2563eb;
                }

                .mobile-nav-item .icon {
                    font-size: 1.5rem;
                    margin-bottom: 0.25rem;
                }

                /* Stats grid responsive */
                .stats-grid {
                    grid-template-columns: 1fr !important;
                    gap: 0.75rem;
                }

                /* Ocultar sidebar completamente */
                .sidebar {
                    display: none !important;
                }

                /* Ajustar main content */
                .main-content {
                    margin-left: 0 !important;
                    padding: 1rem !important;
                    padding-top: calc(var(--mobile-header-height) + 1rem) !important;
                    padding-bottom: calc(var(--mobile-bottom-nav-height) + 1rem) !important;
                }

                /* Formularios - convertir grids a 1 columna */
                form div[style*="grid-template-columns"],
                .form-group div[style*="grid-template-columns"],
                div[style*="grid-template-columns: 1fr 1fr"] {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }

                /* Contenedores flex en cards - apilar verticalmente */
                .card > div[style*="display: flex"]:not(:last-child) {
                    flex-direction: column !important;
                    gap: 0.75rem !important;
                }

                /* Botones móviles - full width excepto pequeños */
                .btn:not(.btn-sm) {
                    width: 100% !important;
                    margin-bottom: 0.5rem !important;
                }

                .btn-sm {
                    width: auto;
                    margin-bottom: 0;
                }

                /* Botones en formularios finales - mantener juntos */
                form > div[style*="display: flex"]:last-child {
                    flex-direction: column !important;
                    gap: 0.75rem !important;
                }

                form > div[style*="display: flex"]:last-child > button,
                form > div[style*="display: flex"]:last-child > .btn {
                    width: 100% !important;
                    margin-bottom: 0 !important;
                }

                /* Selects e inputs en filtros - full width */
                .card select,
                .card input[type="text"],
                .card input[type="search"],
                .card input[type="tel"],
                .card input[type="email"] {
                    width: 100% !important;
                    margin-bottom: 0.5rem !important;
                }

                /* Grid de edificios - 1 columna */
                div[style*="grid-template-columns: repeat(auto-fill"],
                div[style*="grid-template-columns: repeat(auto-fit"] {
                    grid-template-columns: 1fr !important;
                }

                /* Login móvil */
                .login-container {
                    padding: 1rem;
                }

                .login-card {
                    padding: 1.5rem;
                }

                /* Tablas */
                .table-container {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }

                table {
                    font-size: 0.8125rem;
                    min-width: 600px;
                }

                table th, table td {
                    padding: 0.5rem;
                    white-space: nowrap;
                }

                /* Cards */
                .card {
                    padding: 1rem !important;
                    margin-bottom: 1rem;
                }

                .card-header {
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    gap: 0.75rem !important;
                }

                /* Page header */
                .page-header {
                    margin-bottom: 1.5rem;
                }

                .page-header h1 {
                    font-size: 1.5rem;
                }

                /* Formularios inputs */
                .form-group input,
                .form-group select,
                .form-group textarea {
                    font-size: 16px !important;
                    padding: 0.875rem !important;
                    width: 100% !important;
                }

                /* Asegurar que elementos inline con display flex se apilen */
                div[style*="display: flex"][style*="gap"] {
                    flex-wrap: wrap;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Estilos móviles inyectados inline');
    }

    // ============================================
    // CREAR COMPONENTES MÓVILES
    // ============================================
    function createMobileComponents() {
        if (!isAuthenticated()) return;

        // Aplicar clases móviles a elementos existentes
        applyMobileClasses();
        
        createMobileHeader();
        createMobileDrawer();
        createMobileBottomNav();
        setupMobileEvents();
    }

    // ============================================
    // APLICAR CLASES Y ESTILOS MÓVILES
    // ============================================
    function applyMobileClasses() {
        // Ocultar sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        // Ajustar main-content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.padding = '1rem';
        }

        // Convertir grids de formularios a 1 columna
        document.querySelectorAll('div[style*="grid-template-columns"]').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (style.includes('grid-template-columns')) {
                // Verificar si tiene grid-template-columns con múltiples columnas
                if (style.includes('1fr 1fr') || style.includes('repeat')) {
                    el.style.gridTemplateColumns = '1fr';
                    el.style.gap = '1rem';
                }
            }
        });

        // Convertir contenedores flex en cards a columna (excepto últimos hijos que son botones)
        document.querySelectorAll('.card > div[style*="display: flex"]').forEach(el => {
            const isLastChild = el === el.parentElement.lastElementChild;
            const isFormButtons = el.querySelector('button[type="submit"]') || el.querySelector('button[type="button"]');
            
            if (!isLastChild || !isFormButtons) {
                el.style.flexDirection = 'column';
                el.style.gap = '0.75rem';
            }
        });

        // Asegurar que selects e inputs en cards sean full width
        document.querySelectorAll('.card select, .card input[type="text"], .card input[type="search"], .card input[type="tel"], .card input[type="email"]').forEach(el => {
            const currentWidth = el.style.width;
            if (!currentWidth || currentWidth === 'auto' || currentWidth === '') {
                el.style.width = '100%';
                el.style.marginBottom = '0.5rem';
            }
        });

        // Botones full width excepto btn-sm y botones en headers
        document.querySelectorAll('.btn:not(.btn-sm)').forEach(btn => {
            const parent = btn.parentElement;
            const isInCardHeader = parent && parent.classList.contains('card-header');
            const isInFormLastRow = parent && parent.parentElement && 
                                   parent.parentElement.tagName === 'FORM' &&
                                   parent === Array.from(parent.parentElement.children).pop();
            
            if (!isInCardHeader) {
                btn.style.width = '100%';
                if (isInFormLastRow) {
                    btn.style.marginBottom = '0';
                } else {
                    btn.style.marginBottom = '0.5rem';
                }
            }
        });

        // Grid de edificios - convertir a 1 columna
        document.querySelectorAll('div[style*="grid-template-columns: repeat"]').forEach(el => {
            el.style.gridTemplateColumns = '1fr';
        });
    }

    function createMobileHeader() {
        if (document.querySelector('.mobile-header')) return;

        const header = document.createElement('div');
        header.className = 'mobile-header';
        header.innerHTML = `
            <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
            <div class="mobile-header-title" id="mobileHeaderTitle">Sistema</div>
            <div style="width: 40px;"></div>
        `;

        document.body.insertBefore(header, document.body.firstChild);
        updateHeaderTitle();
    }

    function createMobileDrawer() {
        if (document.querySelector('.mobile-drawer')) return;

        const user = getUser();
        if (!user) return;

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-drawer-overlay';
        overlay.id = 'mobileDrawerOverlay';
        document.body.appendChild(overlay);

        // Drawer
        const drawer = document.createElement('div');
        drawer.className = 'mobile-drawer';
        drawer.id = 'mobileDrawer';

        const menuItems = getMenuItems(user.rol);

        drawer.innerHTML = `
            <div class="mobile-drawer-header">
                <h2>🏢 Gestión</h2>
                <div style="margin-top: 0.5rem;">
                    <div style="font-weight: 600;">${user.nombre}</div>
                    <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem;">
                        ${getRolLabel(user.rol)}
                    </div>
                </div>
            </div>
            <nav class="mobile-drawer-menu">
                ${menuItems.map(item => `
                    <a href="${item.page}" class="mobile-menu-item ${isCurrentPage(item.page) ? 'active' : ''}">
                        <span style="font-size: 1.5rem;">${item.icon}</span>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </nav>
            <div style="padding: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <button onclick="logout()" style="width: 100%; background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; cursor: pointer;">
                    🚪 Cerrar Sesión
                </button>
            </div>
        `;

        document.body.appendChild(drawer);
    }

    function createMobileBottomNav() {
        if (document.querySelector('.mobile-bottom-nav')) return;

        const user = getUser();
        if (!user) return;

        const nav = document.createElement('nav');
        nav.className = 'mobile-bottom-nav';

        const bottomItems = getBottomNavItems(user.rol);
        
        nav.innerHTML = bottomItems.map(item => `
            <a href="${item.page}" class="mobile-nav-item ${isCurrentPage(item.page) ? 'active' : ''}" ${item.page === '#' ? 'onclick="toggleMobileMenu(); return false;"' : ''}>
                <span class="icon">${item.icon}</span>
                <span>${item.label}</span>
            </a>
        `).join('');

        document.body.appendChild(nav);
    }

    function setupMobileEvents() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const overlay = document.getElementById('mobileDrawerOverlay');

        if (menuBtn) {
            menuBtn.addEventListener('click', toggleMobileMenu);
        }

        if (overlay) {
            overlay.addEventListener('click', closeMobileMenu);
        }

        // Cerrar al hacer clic en un item
        document.querySelectorAll('.mobile-menu-item').forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });
    }

    // ============================================
    // FUNCIONES DE MENÚ
    // ============================================
    function getMenuItems(rol) {
        const menus = {
            super_admin: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
                { icon: '👥', label: 'Usuarios', page: 'usuarios.html' },
                { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
                { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
                { icon: '👤', label: 'Clientes', page: 'clientes.html' },
                { icon: '📅', label: 'Reservas', page: 'reservas.html' },
                { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' }
            ],
            admin: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
                { icon: '👥', label: 'Usuarios', page: 'usuarios.html' },
                { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
                { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
                { icon: '👤', label: 'Clientes', page: 'clientes.html' },
                { icon: '📅', label: 'Reservas', page: 'reservas.html' },
                { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' }
            ],
            recepcionista: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
                { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
                { icon: '👤', label: 'Clientes', page: 'clientes.html' },
                { icon: '📅', label: 'Reservas', page: 'reservas.html' }
            ],
            limpieza: [
                { icon: '🧹', label: 'Mis Tareas', page: 'mis-tareas.html' },
                { icon: '📜', label: 'Historial', page: 'historial-limpieza.html' }
            ],
            contador: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
                { icon: '💰', label: 'Reportes', page: 'reportes.html' }
            ],
            visor: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' }
            ]
        };

        return menus[rol] || [];
    }

    function getBottomNavItems(rol) {
        const navs = {
            super_admin: [
                { icon: '📊', label: 'Inicio', page: 'dashboard.html' },
                { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
                { icon: '📅', label: 'Reservas', page: 'reservas.html' },
                { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' },
                { icon: '☰', label: 'Menú', page: '#' }
            ],
            admin: [
                { icon: '📊', label: 'Inicio', page: 'dashboard.html' },
                { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
                { icon: '📅', label: 'Reservas', page: 'reservas.html' },
                { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' },
                { icon: '☰', label: 'Menú', page: '#' }
            ],
            recepcionista: [
                { icon: '📊', label: 'Inicio', page: 'dashboard.html' },
                { icon: '🚪', label: 'Deptos', page: 'departamentos.html' },
                { icon: '👤', label: 'Clientes', page: 'clientes.html' },
                { icon: '📅', label: 'Reservas', page: 'reservas.html' },
                { icon: '☰', label: 'Menú', page: '#' }
            ],
            limpieza: [
                { icon: '🧹', label: 'Tareas', page: 'mis-tareas.html' },
                { icon: '📜', label: 'Historial', page: 'historial-limpieza.html' },
                { icon: '☰', label: 'Menú', page: '#' }
            ],
            contador: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
                { icon: '💰', label: 'Reportes', page: 'reportes.html' },
                { icon: '☰', label: 'Menú', page: '#' }
            ],
            visor: [
                { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
                { icon: '☰', label: 'Menú', page: '#' }
            ]
        };

        return navs[rol] || [];
    }

    // ============================================
    // UTILIDADES
    // ============================================
    function isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    function getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    function isCurrentPage(page) {
        const currentPage = window.location.pathname.split('/').pop();
        return currentPage === page;
    }

    function getRolLabel(rol) {
        const labels = {
            super_admin: 'Super Admin',
            admin: 'Administrador',
            recepcionista: 'Recepcionista',
            limpieza: 'Limpieza',
            contador: 'Contador',
            visor: 'Visor'
        };
        return labels[rol] || rol;
    }

    function updateHeaderTitle() {
        const titleElement = document.getElementById('mobileHeaderTitle');
        if (!titleElement) return;

        const currentPage = window.location.pathname.split('/').pop();
        
        const titles = {
            'dashboard.html': 'Dashboard',
            'edificios.html': 'Edificios',
            'departamentos.html': 'Departamentos',
            'clientes.html': 'Clientes',
            'reservas.html': 'Reservas',
            'limpieza.html': 'Limpieza',
            'mis-tareas.html': 'Mis Tareas',
            'historial-limpieza.html': 'Historial',
            'usuarios.html': 'Usuarios',
            'nuevo-edificio.html': 'Nuevo Edificio',
            'nuevo-departamento.html': 'Nuevo Departamento',
            'nuevo-cliente.html': 'Nuevo Cliente',
            'nueva-reserva.html': 'Nueva Reserva',
            'nuevo-usuario.html': 'Nuevo Usuario',
            'index.html': 'Iniciar Sesión'
        };

        titleElement.textContent = titles[currentPage] || 'Sistema';
    }

    window.toggleMobileMenu = function() {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('mobileDrawerOverlay');
        
        if (drawer && overlay) {
            const isOpen = drawer.classList.contains('open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                drawer.classList.add('open');
                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
    };

    function closeMobileMenu() {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('mobileDrawerOverlay');
        
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // ============================================
    // INICIALIZACIÓN AUTOMÁTICA
    // ============================================
    function init() {
        console.log('🔍 Detectando dispositivo...');
        
        const isMobile = isMobileDevice();
        const isSmallScreen = window.innerWidth <= 768;
        
        console.log(`📱 Es móvil: ${isMobile}`);
        console.log(`📐 Ancho de pantalla: ${window.innerWidth}px`);
        console.log(`👆 Touch: ${('ontouchstart' in window)}`);
        
        // Activar modo móvil si es dispositivo móvil O si la pantalla es pequeña
        if (isMobile || isSmallScreen) {
            console.log('✅ Activando modo móvil...');
            
            // Inyectar estilos inline
            injectMobileStyles();
            
            // Función para activar componentes móviles
            function activateMobile() {
                // Aplicar estilos inmediatamente
                applyMobileClasses();
                
                // Crear componentes móviles si está autenticado
                if (isAuthenticated()) {
                    createMobileHeader();
                    createMobileDrawer();
                    createMobileBottomNav();
                    setupMobileEvents();
                }
            }
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', activateMobile);
            } else {
                // Si el DOM ya está listo, ejecutar inmediatamente
                setTimeout(activateMobile, 100);
            }
            
            // Manejar cambios de orientación y resize
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    const currentWidth = window.innerWidth;
                    const header = document.querySelector('.mobile-header');
                    
                    if (currentWidth > 768 && header) {
                        // Cambió a desktop, remover componentes móviles
                        document.querySelectorAll('.mobile-header, .mobile-drawer, .mobile-drawer-overlay, .mobile-bottom-nav').forEach(el => el.remove());
                        // Restaurar sidebar
                        const sidebar = document.querySelector('.sidebar');
                        if (sidebar) sidebar.style.display = '';
                        const mainContent = document.querySelector('.main-content');
                        if (mainContent) mainContent.style.marginLeft = '';
                    } else if (currentWidth <= 768) {
                        // Cambió a móvil, aplicar estilos y crear componentes
                        applyMobileClasses();
                        if (isAuthenticated() && !header) {
                            createMobileHeader();
                            createMobileDrawer();
                            createMobileBottomNav();
                            setupMobileEvents();
                        }
                    }
                }, 250);
            });
        }
    }

    // Ejecutar inmediatamente
    init();

})();
