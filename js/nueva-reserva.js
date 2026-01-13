let clientesData = [];
let departamentosData = [];

document.addEventListener('DOMContentLoaded', async function() {
    await cargarClientes();
    await cargarDepartamentos();
    
    // Event listeners
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

async function cargarDepartamentos() {
    try {
        const data = await apiRequest('/departamentos/disponibles');
        departamentosData = data.departamentos || [];
        
        const select = document.getElementById('departamentoId');
        select.innerHTML = '<option value="">Seleccione un departamento</option>' +
            departamentosData.map(d => `
                <option value="${d.id}">
                    ${d.numero} - ${d.edificio.nombre} (₲${d.precio.toLocaleString('es-PY')}/día)
                </option>
            `).join('');
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
    
    const depto = departamentosData.find(d => d.id == deptoId);
    if (depto) {
        infoDiv.textContent = `${depto.habitaciones} hab, ${depto.banos} baños - Precio: ₲${depto.precio.toLocaleString('es-PY')}/día`;
        
        // Calcular monto si hay fechas seleccionadas
        calcularMonto();
    }
}

function calcularMonto() {
    const deptoId = document.getElementById('departamentoId').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    
    if (!deptoId || !fechaInicio || !fechaFin) return;
    
    const depto = departamentosData.find(d => d.id == deptoId);
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
        infoDiv.innerHTML = `
            ${depto.habitaciones} hab, ${depto.banos} baños<br>
            <strong>Precio: ₲${depto.precio.toLocaleString('es-PY')}/día × ${dias} día${dias !== 1 ? 's' : ''} = ₲${montoTotal.toLocaleString('es-PY')}</strong>
        `;
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
    if (!formData.clienteId || !formData.departamentoId) {
        showError('Seleccione cliente y departamento');
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