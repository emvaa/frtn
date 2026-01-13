let clientesData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarClientes();
    
    // Enter para buscar
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarClientes();
        }
    });
});

async function cargarClientes() {
    try {
        const data = await apiRequest('/clientes');
        clientesData = data.clientes || [];
        renderClientes(clientesData);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar clientes');
    }
}

async function buscarClientes() {
    const busqueda = document.getElementById('searchInput').value.trim();
    
    if (!busqueda) {
        cargarClientes();
        return;
    }
    
    try {
        const data = await apiRequest(`/clientes/buscar?busqueda=${encodeURIComponent(busqueda)}`);
        clientesData = data.clientes || [];
        renderClientes(clientesData);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al buscar clientes');
    }
}

function renderClientes(clientes) {
    const tbody = document.getElementById('clientesTable');
    const total = document.getElementById('totalClientes');
    
    total.textContent = `${clientes.length} cliente${clientes.length !== 1 ? 's' : ''}`;
    
    if (clientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No se encontraron clientes
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clientes.map(c => `
        <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>${c.telefono}</td>
            <td>${c.whatsapp || '-'}</td>
            <td>${c.email || '-'}</td>
            <td>${c.cedula || '-'}</td>
            <td>
                <span class="badge info">
                    ${c._count?.reservas || 0} reserva${(c._count?.reservas || 0) !== 1 ? 's' : ''}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalle(${c.id})">
                    Ver
                </button>
            </td>
        </tr>
    `).join('');
}

function verDetalle(id) {
    const cliente = clientesData.find(c => c.id === id);
    if (!cliente) return;
    
    let detalle = `
Cliente: ${cliente.nombre}
Teléfono: ${cliente.telefono}
WhatsApp: ${cliente.whatsapp || 'No especificado'}
Email: ${cliente.email || 'No especificado'}
Cédula: ${cliente.cedula || 'No especificado'}
Reservas totales: ${cliente._count?.reservas || 0}
    `;
    
    if (cliente.notas) {
        detalle += `\nNotas: ${cliente.notas}`;
    }
    
    showSuccess(detalle);
}

function mostrarError(mensaje) {
    const tbody = document.getElementById('clientesTable');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem; color: var(--danger);">
                ${mensaje}
            </td>
        </tr>
    `;
}