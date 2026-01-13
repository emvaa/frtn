// Definición de menús por rol
const menuItems = {
    super_admin: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' },
        { icon: '👥', label: 'Usuarios', page: 'usuarios.html' },
        { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
        { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
        { icon: '👤', label: 'Clientes', page: 'clientes.html' },
        { icon: '📋', label: 'Reservas', page: 'reservas.html' },
        { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' }
    ],
    admin: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' },
        { icon: '👥', label: 'Usuarios', page: 'usuarios.html' },
        { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
        { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
        { icon: '👤', label: 'Clientes', page: 'clientes.html' },
        { icon: '📋', label: 'Reservas', page: 'reservas.html' },
        { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' }
    ],
    recepcionista: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' },
        { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
        { icon: '👤', label: 'Clientes', page: 'clientes.html' },
        { icon: '📋', label: 'Reservas', page: 'reservas.html' }
    ],
    limpieza: [
        { icon: '🧹', label: 'Mis Tareas', page: 'mis-tareas.html' },
        { icon: '📜', label: 'Historial', page: 'historial-limpieza.html' }
    ],
    contador: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' },
        { icon: '💰', label: 'Reportes', page: 'reportes.html' }
    ],
    visor: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' }
    ]
};

// 🔥 FUNCIÓN QUE RENDERIZA EL MENÚ
function renderMenu() {
    try {
        // Obtener usuario actual
        const user = getUser();
        
        if (!user || !user.rol) {
            console.error('❌ No hay usuario o rol definido');
            window.location.href = '/index.html';
            return;
        }

        // Obtener menú según el rol
        const userMenu = menuItems[user.rol] || menuItems.visor;
        
        // Buscar contenedor del menú
        const menuContainer = document.getElementById('sidebarMenu');
        
        if (!menuContainer) {
            console.error('❌ No se encontró el contenedor del menú (#sidebarMenu)');
            return;
        }

        // Generar HTML del menú
        let menuHTML = '';
        
        userMenu.forEach(item => {
            const isActive = window.location.pathname.includes(item.page) ? 'active' : '';
            
            menuHTML += `
                <a href="${item.page}" class="menu-item ${isActive}">
                    <span class="menu-icon">${item.icon}</span>
                    <span class="menu-label">${item.label}</span>
                </a>
            `;
        });

        // Insertar menú en el DOM
        menuContainer.innerHTML = menuHTML;
        
        console.log('✅ Menú cargado correctamente para rol:', user.rol);
        
    } catch (error) {
        console.error('❌ Error al renderizar el menú:', error);
    }
}

// 🔥 RENDERIZAR INFO DEL USUARIO EN EL HEADER
function renderUserInfo() {
    try {
        const user = getUser();
        
        if (!user) return;

        // Buscar elemento del nombre de usuario
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        
        if (userNameElement) {
            userNameElement.textContent = user.nombre || user.email;
        }
        
        if (userRoleElement) {
            const roleNames = {
                'super_admin': 'Super Administrador',
                'admin': 'Administrador',
                'recepcionista': 'Recepcionista',
                'limpieza': 'Personal de Limpieza',
                'contador': 'Contador',
                'visor': 'Visor'
            };
            
            userRoleElement.textContent = roleNames[user.rol] || user.rol;
        }
        
    } catch (error) {
        console.error('❌ Error al renderizar info del usuario:', error);
    }
}

// 🔥 LOGOUT
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        clearSession();
        window.location.href = '/index.html';
    }
}

// 🔥 INICIALIZACIÓN AUTOMÁTICA
if (document.readyState === 'loading') {
    // Si el DOM aún está cargando, esperar
    document.addEventListener('DOMContentLoaded', () => {
        renderMenu();
        renderUserInfo();
    });
} else {
    // Si el DOM ya está listo, ejecutar inmediatamente
    renderMenu();
    renderUserInfo();
}

console.log('📄 menu.js cargado');
