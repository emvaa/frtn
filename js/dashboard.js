// Lógica del dashboard

document.addEventListener('DOMContentLoaded', async function() {
    const user = getUser();
    
    // Cargar estadísticas
    await cargarEstadisticas();
    
    // Cargar alertas
    await cargarAlertas();
    
    // Cargar actividad reciente
    await cargarActividad();
    
    // Mostrar ingresos solo a roles autorizados
    if (['super_admin', 'admin', 'contador', 'visor'].includes(user.rol)) {
        document.getElementById('statIngresosCard').style.display = 'block';
    }
});

async function cargarEstadisticas() {
    try {
        const data = await apiRequest('/dashboard/estadisticas');
        
        const stats = data.estadisticas;
        
        // Actualizar departamentos
        document.getElementById('statDisponibles').textContent = stats.departamentos.disponibles;
        document.getElementById('statReservados').textContent = stats.departamentos.reservados;
        document.getElementById('statOcupados').textContent = stats.departamentos.ocupados;
        
        // Actualizar ingresos si existe
        if (stats.ingresos) {
            document.getElementById('statIngresos').textContent = 
                '₲' + stats.ingresos.mes.toLocaleString('es-PY');
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

async function cargarAlertas() {
    const container = document.getElementById('alertasList');
    
    try {
        const data = await apiRequest('/dashboard/alertas');
        const alertas = data.alertas;
        
        if (alertas.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 1rem;">No hay alertas pendientes ✅</p>';
            return;
        }
        
        container.innerHTML = alertas.map(alerta => {
            const colorClass = {
                'alta': 'danger',
                'media': 'warning',
                'baja': 'info'
            }[alerta.prioridad];
            
            return `
                <div style="padding: 1rem; border-left: 4px solid var(--${colorClass}); margin-bottom: 0.5rem; background: var(--bg-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${alerta.mensaje}</strong>
                            <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                ${alerta.tipo}
                            </div>
                        </div>
                        <span class="badge ${colorClass}">${alerta.prioridad.toUpperCase()}</span>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error cargando alertas:', error);
        container.innerHTML = '<p style="color: var(--danger); padding: 1rem;">Error al cargar alertas</p>';
    }
}

async function cargarActividad() {
    const container = document.getElementById('actividadList');
    
    try {
        const data = await apiRequest('/dashboard/actividad-reciente');
        const actividad = data.actividad;
        
        let html = '<div style="padding: 1rem;">';
        
        // Reservas recientes
        if (actividad.reservas && actividad.reservas.length > 0) {
            html += '<h4 style="margin-bottom: 0.5rem;">📅 Reservas Recientes</h4>';
            html += '<ul style="list-style: none; padding: 0; margin-bottom: 1rem;">';
            actividad.reservas.forEach(r => {
                html += `
                    <li style="padding: 0.5rem; border-bottom: 1px solid var(--border);">
                        <strong>${r.cliente.nombre}</strong> - ${r.departamento.numero} (${r.departamento.edificio.nombre})
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            ${new Date(r.createdAt).toLocaleDateString('es-PY')}
                        </div>
                    </li>
                `;
            });
            html += '</ul>';
        }
        
        // Clientes recientes
        if (actividad.clientes && actividad.clientes.length > 0) {
            html += '<h4 style="margin-bottom: 0.5rem;">👤 Clientes Nuevos</h4>';
            html += '<ul style="list-style: none; padding: 0;">';
            actividad.clientes.forEach(c => {
                html += `
                    <li style="padding: 0.5rem; border-bottom: 1px solid var(--border);">
                        <strong>${c.nombre}</strong> - ${c.telefono}
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">
                            ${new Date(c.createdAt).toLocaleDateString('es-PY')}
                        </div>
                    </li>
                `;
            });
            html += '</ul>';
        }
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error cargando actividad:', error);
        container.innerHTML = '<p style="color: var(--danger); padding: 1rem;">Error al cargar actividad</p>';
    }
}