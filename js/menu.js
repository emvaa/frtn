// Agregar calendario a los menús
const menuItems = {
    super_admin: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' }, // NUEVO
        { icon: '👥', label: 'Usuarios', page: 'usuarios.html' },
        { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
        { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
        { icon: '👤', label: 'Clientes', page: 'clientes.html' },
        { icon: '📋', label: 'Reservas', page: 'reservas.html' },
        { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' }
    ],
    admin: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' }, // NUEVO
        { icon: '👥', label: 'Usuarios', page: 'usuarios.html' },
        { icon: '🏢', label: 'Edificios', page: 'edificios.html' },
        { icon: '🚪', label: 'Departamentos', page: 'departamentos.html' },
        { icon: '👤', label: 'Clientes', page: 'clientes.html' },
        { icon: '📋', label: 'Reservas', page: 'reservas.html' },
        { icon: '🧹', label: 'Limpieza', page: 'limpieza.html' }
    ],
    recepcionista: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' }, // NUEVO
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
        { icon: '📅', label: 'Calendario', page: 'calendario.html' }, // NUEVO
        { icon: '💰', label: 'Reportes', page: 'reportes.html' }
    ],
    visor: [
        { icon: '📊', label: 'Dashboard', page: 'dashboard.html' },
        { icon: '📅', label: 'Calendario', page: 'calendario.html' } // NUEVO
    ]
};