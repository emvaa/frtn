let misTareasData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarMisTareas();
});

async function cargarMisTareas() {
    try {
        const data = await apiRequest('/limpieza/mis-tareas');
        misTareasData = data.tareas || [];
        
        // Actualizar estadísticas
        document.getElementById('statUrgentes').textContent = data.urgentes || 0;
        document.getElementById('statAltas').textContent = data.altas || 0;
        document.getElementById('statMedias').textContent = data.medias || 0;
        document.getElementById('statTotal').textContent = data.total || 0;
        
        renderTareas();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar tareas');
    }
}

function renderTareas() {
    const urgentes = misTareasData.filter(t => t.prioridadCalculada === 'urgente');
    const normales = misTareasData.filter(t => t.prioridadCalculada !== 'urgente');
    
    // Mostrar tareas urgentes si existen
    if (urgentes.length > 0) {
        document.getElementById('tareasUrgentes').style.display = 'block';
        document.getElementById('listaTareasUrgentes').innerHTML = urgentes.map(t => renderTareaCard(t, true)).join('');
    } else {
        document.getElementById('tareasUrgentes').style.display = 'none';
    }
    
    // Mostrar todas las tareas
    document.getElementById('totalTareas').textContent = `${misTareasData.length} tarea${misTareasData.length !== 1 ? 's' : ''}`;
    document.getElementById('listaTareas').innerHTML = misTareasData.map(t => renderTareaCard(t, false)).join('');
}

function renderTareaCard(tarea, esUrgente) {
    const prioridad = tarea.prioridadCalculada || tarea.prioridad;
    const colorBorde = {
        'urgente': 'var(--danger)',
        'alta': 'var(--warning)',
        'media': 'var(--info)',
        'baja': 'var(--success)'
    }[prioridad];
    
    return `
        <div style="border: 2px solid ${colorBorde}; border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1rem; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
                        🏢 Depto ${tarea.departamento.numero}
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">
                        ${tarea.departamento.edificio.nombre} - Piso ${tarea.departamento.piso}
                    </p>
                </div>
                <span class="badge ${getPrioridadBadge(prioridad)}" style="font-size: 1rem; padding: 0.5rem 1rem;">
                    ${getPrioridadLabel(prioridad)}
                </span>
            </div>
            
            ${tarea.tiempoRestante !== null ? `
                <div style="background: ${prioridad === 'urgente' ? '#fee2e2' : '#fef3c7'}; padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem;">
                    <strong>⏰ Próximo check-in en: ${tarea.tiempoRestante} horas</strong>
                </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem;">
                <div>🛏️ <strong>${tarea.departamento.habitaciones}</strong> habitaciones</div>
                <div>🚿 <strong>${tarea.departamento.banos}</strong> baños</div>
            </div>
            
            ${tarea.notas ? `
                <div style="background: var(--bg-secondary); padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem;">
                    📝 ${tarea.notas}
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${tarea.estado === 'pendiente' ? `
                    <button class="btn btn-success" onclick="iniciarTarea(${tarea.id})">
                        ▶️ Iniciar Limpieza
                    </button>
                ` : ''}
                
                ${tarea.estado === 'en_proceso' ? `
                    <button class="btn btn-success" onclick="completarTarea(${tarea.id})">
                        ✅ Marcar como Limpio
                    </button>
                    <button class="btn btn-danger" onclick="reportarProblema(${tarea.id})">
                        ⚠️ Reportar Problema
                    </button>
                ` : ''}
                
                <button class="btn btn-secondary" onclick="verDetalleTarea(${tarea.id})">
                    👁️ Ver Detalle
                </button>
            </div>
        </div>
    `;
}

async function iniciarTarea(id) {
    if (!confirm('¿Iniciar limpieza de este departamento?')) return;
    
    try {
        await apiRequest(`/limpieza/${id}/iniciar`, { method: 'POST' });
        showSuccess('✅ Limpieza iniciada. ¡Buena suerte!');
        cargarMisTareas();
    } catch (error) {
        showSuccess('Error: ' + error.message);
    }
}

async function completarTarea(id) {
    const notas = prompt('Notas sobre la limpieza (opcional):');
    
    try {
        await apiRequest(`/limpieza/${id}/completar`, {
            method: 'POST',
            body: JSON.stringify({ notas })
        });
        
        showSuccess('✅ ¡Excelente trabajo! Departamento marcado como limpio.');
        cargarMisTareas();
    } catch (error) {
        showSuccess('Error: ' + error.message);
    }
}

async function reportarProblema(id) {
    const problema = prompt('Describe el problema encontrado:');
    if (!problema) return;
    
    try {
        await apiRequest(`/limpieza/${id}/problema`, {
            method: 'POST',
            body: JSON.stringify({ problema })
        });
        
        showSuccess('✅ Problema reportado. El administrador fue notificado.');
        cargarMisTareas();
    } catch (error) {
        showSuccess('Error: ' + error.message);
    }
}

function verDetalleTarea(id) {
    const tarea = misTareasData.find(t => t.id === id);
    if (!tarea) return;
    
    let detalle = `
🧹 Tarea #${tarea.id}
🏢 Departamento: ${tarea.departamento.numero}
🏠 Edificio: ${tarea.departamento.edificio.nombre}
📍 Piso: ${tarea.departamento.piso}
🛏️ Habitaciones: ${tarea.departamento.habitaciones}
🚿 Baños: ${tarea.departamento.banos}
⚡ Prioridad: ${getPrioridadLabel(tarea.prioridadCalculada || tarea.prioridad)}
📊 Estado: ${getEstadoLabel(tarea.estado)}
    `;
    
    if (tarea.tiempoRestante !== null) {
        detalle += `\n⏰ Próximo check-in: En ${tarea.tiempoRestante} horas`;
    }
    
    if (tarea.notas) {
        detalle += `\n📝 Notas: ${tarea.notas}`;
    }
    
    showSuccess(detalle);
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
        'urgente': '🔴 URGENTE',
        'alta': '🟠 ALTA',
        'media': '🟡 MEDIA',
        'baja': '🟢 BAJA'
    };
    return labels[prioridad] || prioridad.toUpperCase();
}

function getEstadoLabel(estado) {
    const labels = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completada': 'Completada'
    };
    return labels[estado] || estado;
}

function mostrarError(mensaje) {
    document.getElementById('listaTareas').innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--danger);">
            ${mensaje}
        </div>
    `;
}