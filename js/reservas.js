let reservasData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarReservas();
    
    document.getElementById('filterEstado').addEventListener('change', filtrarReservas);
});

async function cargarReservas() {
    try {
        const data = await apiRequest('/reservas');
        reservasData = data.reservas || [];
        console.log('Reservas cargadas:', reservasData);
        renderReservas(reservasData);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar reservas: ' + error.message);
    }
}

function filtrarReservas() {
    const estado = document.getElementById('filterEstado').value;
    
    let filtered = reservasData;
    
    if (estado) {
        filtered = filtered.filter(r => r.estado === estado);
    }
    
    renderReservas(filtered);
}

function renderReservas(reservas) {
    const tbody = document.getElementById('reservasTable');
    const total = document.getElementById('totalReservas');
    
    total.textContent = `${reservas.length} reserva${reservas.length !== 1 ? 's' : ''}`;
    
    if (reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No se encontraron reservas
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = reservas.map(r => `
        <tr>
            <td><strong>#${r.id}</strong></td>
            <td>${r.cliente?.nombre || '-'}</td>
            <td>${r.departamento?.numero || '-'} - ${r.departamento?.edificio?.nombre || ''}</td>
            <td>${formatearFecha(r.fechaInicio)}</td>
            <td>${formatearFecha(r.fechaFin)}</td>
            <td>₲${r.monto.toLocaleString('es-PY')}</td>
            <td>
                ${r.pagado 
                    ? `<span class="badge success">✅ Pagado</span>` 
                    : `<span class="badge warning">⏳ Pendiente</span>`}
            </td>
            <td>
                <span class="badge ${getEstadoBadge(r.estado)}">
                    ${getEstadoLabel(r.estado)}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                    ${getAcciones(r)}
                </div>
            </td>
        </tr>
    `).join('');
}

function getEstadoBadge(estado) {
    const badges = {
        'pendiente': 'warning',
        'confirmada': 'info',
        'completada': 'success',
        'cancelada': 'danger'
    };
    return badges[estado] || 'info';
}

function getEstadoLabel(estado) {
    const labels = {
        'pendiente': 'Pendiente',
        'confirmada': 'Confirmada',
        'completada': 'Completada',
        'cancelada': 'Cancelada'
    };
    return labels[estado] || estado;
}

function getAcciones(reserva) {
    const user = getUser();
    let acciones = `<button class="btn btn-sm btn-primary" onclick="verDetalle(${reserva.id})">👁️ Ver</button>`;
    
    // Solo mostrar acciones si NO está cancelada o completada
    if (reserva.estado === 'pendiente' || reserva.estado === 'confirmada') {
        // NUEVO: Botón confirmar pago si no está pagado
        if (!reserva.pagado) {
            acciones += ` <button class="btn btn-sm btn-success" onclick="confirmarPago(${reserva.id})" style="background: #10b981;">💰 Confirmar Pago</button>`;
        }
        
        if (!reserva.checkIn) {
            acciones += ` <button class="btn btn-sm btn-success" onclick="hacerCheckIn(${reserva.id})">✅ Check-in</button>`;
        }
        if (reserva.checkIn && !reserva.checkOut) {
            acciones += ` <button class="btn btn-sm btn-info" onclick="hacerCheckOut(${reserva.id})">🚪 Check-out</button>`;
        }
        
        // Botón cancelar solo para admin y super_admin
        if (user && (user.rol === 'super_admin' || user.rol === 'admin')) {
            acciones += ` <button class="btn btn-sm btn-danger" onclick="cancelarReserva(${reserva.id})" style="background: var(--danger);">❌ Cancelar</button>`;
        }
    }
    
    return acciones;
}

// NUEVA FUNCIÓN: Confirmar pago
async function confirmarPago(id) {
    const metodoPago = prompt('Método de pago:\n1. Efectivo\n2. Transferencia\n3. Tarjeta\n\nIngrese el método:');
    
    if (!metodoPago) return;
    
    const metodos = {
        '1': 'efectivo',
        'efectivo': 'efectivo',
        '2': 'transferencia',
        'transferencia': 'transferencia',
        '3': 'tarjeta',
        'tarjeta': 'tarjeta'
    };
    
    const metodoFinal = metodos[metodoPago.toLowerCase()] || 'efectivo';
    
    if (!confirm(`¿Confirmar pago por ${metodoFinal}?`)) return;
    
    try {
        await apiRequest(`/reservas/${id}/pago`, {
            method: 'POST',
            body: JSON.stringify({ metodoPago: metodoFinal })
        });
        
        showSuccess('✅ Pago registrado exitosamente');
        cargarReservas();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

async function hacerCheckIn(id) {
    if (!confirm('¿Confirmar check-in? El departamento quedará ocupado.')) return;

    try {
        const notas = prompt('Notas del check-in (opcional):') || 'Check-in realizado';
        
        await apiRequest(`/reservas/${id}/check-in`, {
            method: 'POST',
            body: JSON.stringify({ notasCheckIn: notas })
        });
        
        showSuccess('✅ Check-in realizado exitosamente');
        cargarReservas();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

async function hacerCheckOut(id) {
    if (!confirm('¿Confirmar check-out? Esto creará automáticamente una tarea de limpieza.')) return;

    try {
        const notas = prompt('Notas del check-out (opcional):') || 'Check-out realizado';
        
        await apiRequest(`/reservas/${id}/check-out`, {
            method: 'POST',
            body: JSON.stringify({ notasCheckOut: notas })
        });
        
        showSuccess('✅ Check-out realizado. Tarea de limpieza creada automáticamente.');
        cargarReservas();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

async function cancelarReserva(id) {
    const motivo = prompt('¿Motivo de la cancelación? (opcional):');
    
    if (motivo === null) return;
    
    if (!confirm('⚠️ ¿Está SEGURO de cancelar esta reserva? Esta acción no se puede deshacer.')) return;
    
    try {
        await apiRequest(`/reservas/${id}/cancelar`, {
            method: 'POST',
            body: JSON.stringify({ motivo: motivo || 'Cancelada por administrador' })
        });
        
        showSuccess('✅ Reserva cancelada exitosamente');
        cargarReservas();
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

function verDetalle(id) {
    const reserva = reservasData.find(r => r.id === id);
    if (!reserva) return;

    let detalle = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    RESERVA #${reserva.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENTE
   ${reserva.cliente.nombre}
   Tel: ${reserva.cliente.telefono}

🏢 DEPARTAMENTO
   ${reserva.departamento.numero} - ${reserva.departamento.edificio.nombre}
   Piso: ${reserva.departamento.piso}

📅 FECHAS
   Inicio: ${formatearFechaCompleta(reserva.fechaInicio)}
   Fin: ${formatearFechaCompleta(reserva.fechaFin)}

💰 PAGO
   Monto: ₲${reserva.monto.toLocaleString('es-PY')}
   Estado: ${reserva.pagado ? '✅ PAGADO' : '⏳ PENDIENTE'}
   ${reserva.metodoPago ? `Método: ${reserva.metodoPago}` : ''}
   ${reserva.fechaPago ? `Fecha: ${formatearFechaCompleta(reserva.fechaPago)}` : ''}

📊 ESTADO
   ${getEstadoLabel(reserva.estado).toUpperCase()}

🚪 CHECK-IN/OUT
   Check-in: ${reserva.checkIn ? formatearFechaCompleta(reserva.checkIn) : '⏳ Pendiente'}
   Check-out: ${reserva.checkOut ? formatearFechaCompleta(reserva.checkOut) : '⏳ Pendiente'}
`;

    if (reserva.notasCheckIn) {
        detalle += `\n📝 Notas Check-in: ${reserva.notasCheckIn}`;
    }
    
    if (reserva.notasCheckOut) {
        detalle += `\n📝 Notas Check-out: ${reserva.notasCheckOut}`;
    }

    alert(detalle);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatearFechaCompleta(fecha) {
    return new Date(fecha).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function mostrarError(mensaje) {
    const tbody = document.getElementById('reservasTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 2rem; color: var(--danger);">
                ${mensaje}
            </td>
        </tr>
    `;
}