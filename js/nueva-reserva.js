let clientesData = [];
let departamentosData = [];
let edificiosData = [];
let departamentosPorEdificio = [];
let usdToPygRate = 7300; // fallback

document.addEventListener('DOMContentLoaded', async function() {
    await cargarClientes();
    await cargarEdificios();
    await cargarTipoCambio();
    
    // Event listeners
    document.getElementById('edificioId').addEventListener('change', onEdificioChange);
    document.getElementById('departamentoId').addEventListener('change', mostrarInfoDepartamento);
    document.getElementById('reservaForm').addEventListener('submit', crearReserva);
    
    // Calcular monto automáticamente cuando cambian fechas
    document.getElementById('fechaInicio').addEventListener('change', calcularMonto);
    document.getElementById('fechaFin').addEventListener('change', calcularMonto);
});

async function cargarClientes() {
    try {
        const data = await apiRequest('/clientes');
        clientesData = data.clientes || [];
        
        const select = document.getElementById('clienteId');
        select.innerHTML = '<option value="">Seleccione un cliente</option>' +
            clientesData.map(c => `<option value="${c.id}">${c.nombre} - ${c.telefono}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar clientes');
    }
}

async function cargarEdificios() {
    try {
        const data = await apiRequest('/edificios');
        edificiosData = data.edificios || [];

        const select = document.getElementById('edificioId');
        select.innerHTML = '<option value="">Seleccione un edificio</option>' +
            edificiosData.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');

        // Inicialmente, deshabilitar departamento hasta elegir edificio
        const selectDepto = document.getElementById('departamentoId');
        selectDepto.disabled = true;
        selectDepto.innerHTML = '<option value="">Primero seleccione un edificio</option>';
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar edificios');
    }
}

async function cargarTipoCambio() {
    const montoUsdPreview = document.getElementById('montoUsdPreview');
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates && data.rates.PYG) {
            usdToPygRate = data.rates.PYG;
            montoUsdPreview.textContent = `TC: 1 USD ≈ ₲${Math.round(usdToPygRate).toLocaleString('es-PY')}`;
            return;
        }
        throw new Error('Sin tasa PYG');
    } catch (error) {
        usdToPygRate = 7300;
        montoUsdPreview.textContent = 'TC no disponible, usando ₲7.300 como referencia';
    }
}

async function onEdificioChange() {
    const edificioId = document.getElementById('edificioId').value;
    const selectDepto = document.getElementById('departamentoId');
    const infoDiv = document.getElementById('infoDepartamento');
    infoDiv.textContent = '';
    document.getElementById('monto').value = '';

    if (!edificioId) {
        selectDepto.disabled = true;
        selectDepto.innerHTML = '<option value="">Primero seleccione un edificio</option>';
        return;
    }

    try {
        // Traer TODOS los departamentos del edificio (incluyendo ocupados/reservados/sucios)
        const data = await apiRequest(`/departamentos/edificio/${edificioId}`);
        departamentosPorEdificio = data.departamentos || [];

        selectDepto.disabled = false;
        if (departamentosPorEdificio.length === 0) {
            selectDepto.innerHTML = '<option value="">No hay departamentos en este edificio</option>';
            return;
        }

        selectDepto.innerHTML = '<option value="">Seleccione un departamento</option>' +
            departamentosPorEdificio.map(d => {
                const usd = usdToPygRate ? (d.precio / usdToPygRate) : null;
                const usdLabel = usd ? ` / $${usd.toFixed(2)}` : '';
                // Mostrar estado si no está disponible
                let estadoLabel = '';
                if (d.estado === 'ocupado') estadoLabel = ' [OCUPADO]';
                else if (d.estado === 'reservado') estadoLabel = ' [RESERVADO]';
                else if (d.estado === 'mantenimiento') estadoLabel = ' [MANTENIMIENTO]';
                if (d.requiereLimpieza) estadoLabel += ' [SUCIO]';
                
                return `
                <option value="${d.id}">
                    ${d.numero}${estadoLabel} (₲${d.precio.toLocaleString('es-PY')}/día${usdLabel})
                </option>
            `;
            }).join('');
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar departamentos');
    }
}

function mostrarInfoDepartamento() {
    const deptoId = document.getElementById('departamentoId').value;
    const infoDiv = document.getElementById('infoDepartamento');
    
    if (!deptoId) {
        infoDiv.textContent = '';
        return;
    }
    
    const depto = departamentosPorEdificio.find(d => d.id == deptoId);
    if (depto) {
        const usd = usdToPygRate ? (depto.precio / usdToPygRate) : null;
        const usdLabel = usd ? ` / $${usd.toFixed(2)}` : '';
        
        // Mostrar advertencias si está ocupado o sucio
        let advertencias = [];
        if (depto.estado === 'ocupado') {
            advertencias.push('<span style="color: #dc2626; font-weight: bold;">⚠️ Este departamento está OCUPADO</span>');
        }
        if (depto.requiereLimpieza) {
            advertencias.push('<span style="color: #f59e0b; font-weight: bold;">🧹 Este departamento requiere LIMPIEZA</span>');
        }
        
        let infoHTML = `${depto.habitaciones} hab, ${depto.banos} baños - Precio: ₲${depto.precio.toLocaleString('es-PY')}/día${usdLabel}`;
        if (advertencias.length > 0) {
            infoHTML += '<br><br>' + advertencias.join('<br>');
        }
        
        infoDiv.innerHTML = infoHTML;
        
        // Calcular monto si hay fechas seleccionadas
        calcularMonto();
    }
}

function calcularMonto() {
    const deptoId = document.getElementById('departamentoId').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    
    if (!deptoId || !fechaInicio || !fechaFin) return;
    
    const depto = (departamentosPorEdificio.length ? departamentosPorEdificio : departamentosData).find(d => d.id == deptoId);
    if (!depto) return;
    
    // Calcular días
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    
    if (dias > 0) {
        // CAMBIO: El precio ya es por día, solo multiplicar
        const montoTotal = Math.round(depto.precio * dias);
        document.getElementById('monto').value = montoTotal;
        
        // Actualizar info con cálculo
        const infoDiv = document.getElementById('infoDepartamento');
        const usdTotal = usdToPygRate ? (montoTotal / usdToPygRate) : null;
        const usdUnit = usdToPygRate ? (depto.precio / usdToPygRate) : null;
        infoDiv.innerHTML = `
            ${depto.habitaciones} hab, ${depto.banos} baños<br>
            <strong>Precio: ₲${depto.precio.toLocaleString('es-PY')}/día${usdUnit ? ` / $${usdUnit.toFixed(2)}` : ''} × ${dias} día${dias !== 1 ? 's' : ''} = ₲${montoTotal.toLocaleString('es-PY')}${usdTotal ? ` / $${usdTotal.toFixed(2)}` : ''}</strong>
        `;

        // Mostrar vista previa en USD en el campo de monto
        const montoUsdPreview = document.getElementById('montoUsdPreview');
        if (montoUsdPreview) {
            montoUsdPreview.textContent = usdTotal ? `≈ $${usdTotal.toFixed(2)} al tipo de cambio actual` : '';
        }
    }
}

async function verificarDisponibilidad() {
    const deptoId = document.getElementById('departamentoId').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    
    if (!deptoId || !fechaInicio || !fechaFin) {
        showWarning('Complete departamento y fechas primero');
        return;
    }
    
    const msgDiv = document.getElementById('disponibilidadMsg');
    msgDiv.style.display = 'block';
    msgDiv.textContent = 'Verificando...';
    msgDiv.style.background = 'var(--bg-secondary)';
    
    try {
        const data = await apiRequest(
            `/reservas/disponibilidad?departamentoId=${deptoId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        );
        
        if (data.disponible) {
            msgDiv.style.background = '#d1fae5';
            msgDiv.style.color = '#065f46';
            msgDiv.textContent = '✅ El departamento está DISPONIBLE en esas fechas';
        } else {
            msgDiv.style.background = '#fee2e2';
            msgDiv.style.color = '#991b1b';
            msgDiv.textContent = '❌ El departamento NO está disponible. Hay conflictos con otras reservas.';
            
            if (data.conflictos && data.conflictos.length > 0) {
                msgDiv.textContent += `\n\nReservas que impiden: ${data.conflictos.length}`;
            }
        }
    } catch (error) {
        msgDiv.style.background = '#fee2e2';
        msgDiv.style.color = '#991b1b';
        msgDiv.textContent = 'Error al verificar: ' + error.message;
    }
}

async function crearReserva(e) {
    e.preventDefault();
    
    const formData = {
        clienteId: parseInt(document.getElementById('clienteId').value),
        departamentoId: parseInt(document.getElementById('departamentoId').value),
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value,
        monto: parseFloat(document.getElementById('monto').value),
        metodoPago: document.getElementById('metodoPago').value || null,
        estado: document.getElementById('estado').value
    };
    
    // Validaciones
    const edificioId = document.getElementById('edificioId').value;
    if (!formData.clienteId || !edificioId || !formData.departamentoId) {
        showError('Seleccione cliente, edificio y departamento');
        return;
    }
    
    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
        showError('La fecha de fin debe ser posterior a la fecha de inicio');
        return;
    }
    
    if (formData.monto <= 0) {
        showError('El monto debe ser mayor a 0');
        return;
    }
    
    // Verificar estado del departamento y mostrar alerta si está ocupado o sucio
    const depto = departamentosPorEdificio.find(d => d.id == formData.departamentoId);
    if (depto) {
        let advertencias = [];
        if (depto.estado === 'ocupado') {
            advertencias.push('Este departamento está OCUPADO');
        }
        if (depto.requiereLimpieza) {
            advertencias.push('Este departamento requiere LIMPIEZA');
        }
        
        if (advertencias.length > 0) {
            const mensaje = `⚠️ ADVERTENCIA:\n\n${advertencias.join('\n')}\n\n¿Desea hacer la reserva de igual forma?`;
            if (!confirm(mensaje)) {
                return;
            }
        }
    }
    
    // Verificar conflictos de disponibilidad
    try {
        const disponibilidad = await apiRequest(
            `/reservas/disponibilidad?departamentoId=${formData.departamentoId}&fechaInicio=${formData.fechaInicio}&fechaFin=${formData.fechaFin}`
        );
        
        if (!disponibilidad.disponible && disponibilidad.conflictos && disponibilidad.conflictos.length > 0) {
            const mensaje = `⚠️ ADVERTENCIA:\n\nEl departamento tiene ${disponibilidad.conflictos.length} reserva(s) conflictiva(s) en esas fechas.\n\n¿Desea crear la reserva de igual forma?`;
            if (!confirm(mensaje)) {
                return;
            }
            // Agregar flag para forzar creación
            formData.forzar = true;
        }
    } catch (error) {
        console.error('Error verificando disponibilidad:', error);
        // Continuar de todas formas
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Creando...';
        
        await apiRequest('/reservas', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        showSuccess('✅ Reserva creada exitosamente');
        
        setTimeout(() => {
            window.location.href = 'reservas.html';
        }, 1500);
        
    } catch (error) {
        showError('Error: ' + error.message);
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.textContent = '✅ Crear Reserva';
    }
}

function buscarCliente() {
    const busqueda = prompt('Buscar cliente por nombre o teléfono:');
    if (!busqueda) return;
    
    const coincidencias = clientesData.filter(c => 
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.telefono.includes(busqueda)
    );
    
    if (coincidencias.length === 0) {
        showWarning('No se encontraron clientes');
        return;
    }
    
    if (coincidencias.length === 1) {
        document.getElementById('clienteId').value = coincidencias[0].id;
        showSuccess('Cliente seleccionado: ' + coincidencias[0].nombre);
    } else {
        let mensaje = 'Clientes encontrados:\n\n';
        coincidencias.forEach((c, i) => {
            mensaje += `${i + 1}. ${c.nombre} - ${c.telefono}\n`;
        });
        alert(mensaje);
    }
}
