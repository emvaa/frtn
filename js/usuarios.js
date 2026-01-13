let usuariosData = [];

document.addEventListener('DOMContentLoaded', function() {
    // Verificar que sea super_admin o admin
    const user = getUser();
    if (!['super_admin', 'admin'].includes(user.rol)) {
        showError('Acceso denegado. Solo super_admin y admin pueden acceder.');
        setTimeout(() => window.location.href = 'dashboard.html', 2000);
        return;
    }
    
    cargarUsuarios();
    
    document.getElementById('filterRol').addEventListener('change', filtrarUsuarios);
    document.getElementById('filterActivo').addEventListener('change', filtrarUsuarios);
});

async function cargarUsuarios() {
    try {
        const data = await apiRequest('/usuarios');
        usuariosData = data.usuarios || [];
        renderUsuarios(usuariosData);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar usuarios');
    }
}

function filtrarUsuarios() {
    const rol = document.getElementById('filterRol').value;
    const activo = document.getElementById('filterActivo').value;
    
    let filtered = usuariosData;
    
    if (rol) {
        filtered = filtered.filter(u => u.rol === rol);
    }
    
    if (activo !== '') {
        filtered = filtered.filter(u => u.activo === (activo === 'true'));
    }
    
    renderUsuarios(filtered);
}

function renderUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosTable');
    const total = document.getElementById('totalUsuarios');
    
    total.textContent = `${usuarios.length} usuario${usuarios.length !== 1 ? 's' : ''}`;
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No se encontraron usuarios
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td><strong>#${u.id}</strong></td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>
                <span class="badge ${getRolBadge(u.rol)}">
                    ${getRolLabel(u.rol)}
                </span>
            </td>
            <td>${u.telefono || '-'}</td>
            <td>
                <span class="badge ${u.activo ? 'success' : 'danger'}">
                    ${u.activo ? '✅ Activo' : '❌ Inactivo'}
                </span>
            </td>
            <td>
                ${u.rol === 'limpieza' 
                    ? `<span class="badge info">${u._count?.tareasLimpieza || 0} tareas</span>` 
                    : '-'}
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalle(${u.id})">
                    Ver
                </button>
            </td>
        </tr>
    `).join('');
}

function getRolBadge(rol) {
    const badges = {
        'super_admin': 'danger',
        'admin': 'warning',
        'recepcionista': 'info',
        'limpieza': 'success',
        'contador': 'info',
        'visor': 'secondary'
    };
    return badges[rol] || 'secondary';
}

function getRolLabel(rol) {
    const labels = {
        'super_admin': 'Super Admin',
        'admin': 'Admin',
        'recepcionista': 'Recepcionista',
        'limpieza': 'Limpieza',
        'contador': 'Contador',
        'visor': 'Visor'
    };
    return labels[rol] || rol;
}

function verDetalle(id) {
    const usuario = usuariosData.find(u => u.id === id);
    if (!usuario) return;
    
    let detalle = `
Usuario #${usuario.id}
Nombre: ${usuario.nombre}
Email: ${usuario.email}
Rol: ${getRolLabel(usuario.rol)}
Teléfono: ${usuario.telefono || 'No especificado'}
Estado: ${usuario.activo ? 'Activo' : 'Inactivo'}
Fecha de registro: ${new Date(usuario.createdAt).toLocaleDateString('es-PY')}
`;
    
    if (usuario.rol === 'limpieza') {
        detalle += `\nTareas de limpieza: ${usuario._count?.tareasLimpieza || 0}`;
    }
    
    showSuccess(detalle);
}

function mostrarError(mensaje) {
    const tbody = document.getElementById('usuariosTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 2rem; color: var(--danger);">
                ${mensaje}
            </td>
        </tr>
    `;
}