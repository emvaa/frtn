let historialData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarEstadisticas();
    cargarHistorial();
});

async function cargarEstadisticas() {
    try {
        const data = await apiRequest('/limpieza/estadisticas');
        const stats = data.estadisticas;
        
        document.getElementById('statTotal').textContent = stats.completadas || 0;
        document.getElementById('statTiempo').textContent = `${stats.tiempoPromedioMinutos || 0} min`;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarHistorial() {
    try {
        const data = await apiRequest('/limpieza/historial');
        historialData = data.tareas || [];
        renderHistorial();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar historial');
    }
}

function renderHistorial() {
    const tbody = document.getElementById('historialTable');
    const total = document.getElementById('totalTareas');
    
    total.textContent = `${historialData.length} tarea${historialData.length !== 1 ? 's' : ''}`;
    
    if (historialData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No hay tareas completadas aún
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = historialData.map(t => {
        const tiempoMinutos = calcularTiempo(t.fechaInicio, t.fechaCompletado);
        
        return `
            <tr>
                <td><strong>${t.departamento?.numero || '-'}</strong> - ${t.departamento?.edificio?.nombre || ''}</td>
                <td>${formatearFecha(t.fechaAsignacion)}</td>
                <td>${formatearFecha(t.fechaCompletado)}</td>
                <td>
                    ${tiempoMinutos 
                        ? `<span class="badge success">${tiempoMinutos} min</span>` 
                        : '-'}
                </td>
                <td>
                    <span class="badge ${getPrioridadBadge(t.prioridad)}">
                        ${getPrioridadLabel(t.prioridad)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="verDetalle(${t.id})">
                        Ver
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function calcularTiempo(inicio, fin) {
    if (!inicio || !fin) return null;
    
    const diff = new Date(fin) - new Date(inicio);
    const minutos = Math.round(diff / (1000 * 60));
    
    return minutos;
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
        'urgente': 'Urgente',
        'alta': 'Alta',
        'media': 'Media',
        'baja': 'Baja'
    };
    return labels[prioridad] || prioridad;
}

function verDetalle(id) {
    const tarea = historialData.find(t => t.id === id);
    if (!tarea) return;
    
    const tiempoMinutos = calcularTiempo(tarea.fechaInicio, tarea.fechaCompletado);
    
    let detalle = `
Tarea #${tarea.id}
Departamento: ${tarea.departamento.numero} - ${tarea.departamento.edificio.nombre}
Asignado: ${formatearFecha(tarea.fechaAsignacion)}
Iniciado: ${tarea.fechaInicio ? formatearFecha(tarea.fechaInicio) : 'N/A'}
Completado: ${formatearFecha(tarea.fechaCompletado)}
Tiempo total: ${tiempoMinutos ? `${tiempoMinutos} minutos` : 'N/A'}
Prioridad: ${getPrioridadLabel(tarea.prioridad)}
    `;
    
    if (tarea.notas) {
        detalle += `\nNotas: ${tarea.notas}`;
    }
    
    if (tarea.problemaReportado) {
        detalle += `\n\n⚠️ Problema reportado: ${tarea.problemaReportado}`;
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
    const tbody = document.getElementById('historialTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--danger);">
                ${mensaje}
            </td>
        </tr>
    `;
}