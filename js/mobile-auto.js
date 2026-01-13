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
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                }

                /* Botones móviles */
                .btn {
                    width: 100%;
                    margin-bottom: 0.5rem;
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
                }

                table {
                    font-size: 0.875rem;
                }

                table th, table td {
                    padding: 0.5rem;
                    white-space: nowrap;
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

        createMobileHeader();
        createMobileDrawer();
        createMobileBottomNav();
        setupMobileEvents();
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
        console.log(`📱 Es móvil: ${isMobile}`);
        console.log(`📐 Ancho de pantalla: ${window.innerWidth}px`);
        console.log(`👆 Touch: ${('ontouchstart' in window)}`);
        
        if (isMobile || window.innerWidth <= 768) {
            console.log('✅ Activando modo móvil...');
            
            // Opción 1: Inyectar estilos inline (Recomendado - No requiere archivo externo)
            injectMobileStyles();
            
            // Opción 2: Cargar archivo CSS (Descomentar si prefieres usar archivo externo)
            // loadMobileStyles();
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createMobileComponents);
            } else {
                createMobileComponents();
            }
            
            // Manejar cambios de orientación
            window.addEventListener('resize', function() {
                const header = document.querySelector('.mobile-header');
                if (window.innerWidth > 768 && header) {
                    // Cambió a desktop, remover componentes móviles
                    document.querySelectorAll('.mobile-header, .mobile-drawer, .mobile-drawer-overlay, .mobile-bottom-nav').forEach(el => el.remove());
                } else if (window.innerWidth <= 768 && !header) {
                    // Cambió a móvil, crear componentes
                    createMobileComponents();
                }
            });
        }
    }

    // Ejecutar inmediatamente
    init();

})();