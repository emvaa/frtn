let tareasData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarEstadisticas();
    cargarTareas();
    
    document.getElementById('filterEstado').addEventListener('change', filtrarTareas);
    document.getElementById('filterPrioridad').addEventListener('change', filtrarTareas);
});

async function cargarEstadisticas() {
    try {
        const data = await apiRequest('/limpieza/estadisticas');
        const stats = data.estadisticas;
        
        document.getElementById('statPendientes').textContent = stats.pendientes;
        document.getElementById('statEnProceso').textContent = stats.enProceso;
        document.getElementById('statCompletadas').textContent = stats.completadas;
        
        // Contar urgentes (debes obtenerlas del listado)
        const tareasData = await apiRequest('/limpieza/todas?prioridad=urgente');
        document.getElementById('statUrgentes').textContent = tareasData.total || 0;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarTareas() {
    try {
        const data = await apiRequest('/limpieza/todas');
        tareasData = data.tareas || [];
        renderTareas(tareasData);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar tareas');
    }
}

function filtrarTareas() {
    const estado = document.getElementById('filterEstado').value;
    const prioridad = document.getElementById('filterPrioridad').value;
    
    let filtered = tareasData;
    
    if (estado) {
        filtered = filtered.filter(t => t.estado === estado);
    }
    
    if (prioridad) {
        filtered = filtered.filter(t => t.prioridad === prioridad);
    }
    
    renderTareas(filtered);
}

function renderTareas(tareas) {
    const tbody = document.getElementById('tareasTable');
    const total = document.getElementById('totalTareas');
    
    total.textContent = `${tareas.length} tarea${tareas.length !== 1 ? 's' : ''}`;
    
    if (tareas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No se encontraron tareas
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = tareas.map(t => `
        <tr>
            <td><strong>#${t.id}</strong></td>
            <td>${t.departamento?.numero || '-'} - ${t.departamento?.edificio?.nombre || ''}</td>
            <td>${t.asignadoA?.nombre || 'Sin asignar'}</td>
            <td>
                <span class="badge ${getPrioridadBadge(t.prioridad)}">
                    ${getPrioridadLabel(t.prioridad)}
                </span>
            </td>
            <td>
                <span class="badge ${getEstadoBadge(t.estado)}">
                    ${getEstadoLabel(t.estado)}
                </span>
            </td>
            <td>${getTipoLabel(t.tipoLimpieza)}</td>
            <td>${formatearFecha(t.fechaAsignacion)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalle(${t.id})">
                    Ver
                </button>
            </td>
        </tr>
    `).join('');
}

function getPrioridadBadge(prioridad) {
    const badges = {
        'urgente': 'danger',
        'alta': 'warning',
        'media': 'info',
        'baja': 'success'
    };
    return badges[prioridad] || 'info';
}

function getPrioridadLabel(prioridad) {
    const labels = {
        'urgente': '🔴 Urgente',
        'alta': '🟠 Alta',
        'media': '🟡 Media',
        'baja': '🟢 Baja'
    };
    return labels[prioridad] || prioridad;
}

function getEstadoBadge(estado) {
    const badges = {
        'pendiente': 'warning',
        'en_proceso': 'info',
        'completada': 'success'
    };
    return badges[estado] || 'info';
}

function getEstadoLabel(estado) {
    const labels = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completada': 'Completada'
    };
    return labels[estado] || estado;
}

function getTipoLabel(tipo) {
    const labels = {
        'check_out': 'Check-out',
        'mantenimiento': 'Mantenimiento',
        'profunda': 'Profunda'
    };
    return labels[tipo] || tipo;
}

function verDetalle(id) {
    const tarea = tareasData.find(t => t.id === id);
    if (!tarea) return;
    
    let detalle = `
Tarea #${tarea.id}
Departamento: ${tarea.departamento.numero} - ${tarea.departamento.edificio.nombre}
Asignado a: ${tarea.asignadoA?.nombre || 'Sin asignar'}
Estado: ${getEstadoLabel(tarea.estado)}
Prioridad: ${getPrioridadLabel(tarea.prioridad)}
Tipo: ${getTipoLabel(tarea.tipoLimpieza)}
Fecha asignación: ${formatearFecha(tarea.fechaAsignacion)}
    `;
    
    if (tarea.fechaInicio) {
        detalle += `Fecha inicio: ${formatearFecha(tarea.fechaInicio)}\n`;
    }
    
    if (tarea.fechaCompletado) {
        detalle += `Fecha completado: ${formatearFecha(tarea.fechaCompletado)}\n`;
    }
    
    if (tarea.notas) {
        detalle += `Notas: ${tarea.notas}\n`;
    }
    
    if (tarea.problemaReportado) {
        detalle += `\n⚠️ Problema reportado: ${tarea.problemaReportado}\n`;
    }
    
    showSuccess(detalle);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function mostrarError(mensaje) {
    const tbody = document.getElementById('tareasTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 2rem; color: var(--danger);">
                ${mensaje}
            </td>
        </tr>
    `;
}