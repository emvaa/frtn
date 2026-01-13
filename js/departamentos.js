let departamentosData = [];
let edificiosData = [];

document.addEventListener('DOMContentLoaded', async function() {
    await cargarEdificios(); // Cargar edificios primero para el filtro
    await cargarDepartamentos();
    
    // Event listeners para filtros
    document.getElementById('searchInput').addEventListener('input', filtrarDepartamentos);
    document.getElementById('filterEstado').addEventListener('change', filtrarDepartamentos);
    document.getElementById('filterEdificio').addEventListener('change', filtrarDepartamentos);
});

async function cargarEdificios() {
    try {
        const data = await apiRequest('/edificios');
        edificiosData = data.edificios || [];
        
        // Llenar select de edificios
        const select = document.getElementById('filterEdificio');
        select.innerHTML = '<option value="">Todos los edificios</option>' +
            edificiosData.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error cargando edificios:', error);
    }
}

async function cargarDepartamentos() {
    try {
        const data = await apiRequest('/departamentos');
        departamentosData = data.departamentos || [];
        renderDepartamentos(departamentosData);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar departamentos');
    }
}

function filtrarDepartamentos() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const estado = document.getElementById('filterEstado').value;
    const edificioId = document.getElementById('filterEdificio').value;
    
    let filtered = departamentosData;
    
    // Filtrar por búsqueda
    if (search) {
        filtered = filtered.filter(d => 
            d.numero.toLowerCase().includes(search) ||
            d.edificio.nombre.toLowerCase().includes(search)
        );
    }
    
    // Filtrar por estado
    if (estado) {
        filtered = filtered.filter(d => d.estado === estado);
    }
    
    // NUEVO: Filtrar por edificio
    if (edificioId) {
        filtered = filtered.filter(d => d.edificioId === parseInt(edificioId));
    }
    
    renderDepartamentos(filtered);
}

function renderDepartamentos(departamentos) {
    const tbody = document.getElementById('departamentosTable');
    const total = document.getElementById('totalDepartamentos');
    
    total.textContent = `${departamentos.length} departamento${departamentos.length !== 1 ? 's' : ''}`;
    
    if (departamentos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No se encontraron departamentos
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = departamentos.map(d => `
        <tr>
            <td><strong>${d.numero}</strong></td>
            <td>${d.edificio?.nombre || '-'}</td>
            <td>${d.piso}</td>
            <td>${d.habitaciones}</td>
            <td>${d.banos}</td>
            <td>₲${d.precio.toLocaleString('es-PY')}</td>
            <td>
                <span class="badge ${getBadgeClass(d.estado)}">
                    ${getEstadoLabel(d.estado)}
                </span>
            </td>
            <td>
                ${d.requiereLimpieza 
                    ? '<span class="badge warning">🧹 Requiere</span>' 
                    : '<span class="badge success">✅ Limpio</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalle(${d.id})">
                    Ver
                </button>
            </td>
        </tr>
    `).join('');
}

function getBadgeClass(estado) {
    const classes = {
        'disponible': 'success',
        'reservado': 'warning',
        'ocupado': 'danger',
        'mantenimiento': 'info'
    };
    return classes[estado] || 'info';
}

function getEstadoLabel(estado) {
    const labels = {
        'disponible': 'Disponible',
        'reservado': 'Reservado',
        'ocupado': 'Ocupado',
        'mantenimiento': 'Mantenimiento'
    };
    return labels[estado] || estado;
}

function verDetalle(id) {
    const depto = departamentosData.find(d => d.id === id);
    if (!depto) return;
    
    showSuccess(`
Departamento: ${depto.numero}
Edificio: ${depto.edificio.nombre}
Piso: ${depto.piso}
Habitaciones: ${depto.habitaciones}
Baños: ${depto.banos}
Precio: ₲${depto.precio.toLocaleString('es-PY')}
Estado: ${getEstadoLabel(depto.estado)}
Requiere limpieza: ${depto.requiereLimpieza ? 'Sí' : 'No'}
    `);
}

function mostrarError(mensaje) {
    const tbody = document.getElementById('departamentosTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 2rem; color: var(--danger);">
                ${mensaje}
            </td>
        </tr>
    `;
}