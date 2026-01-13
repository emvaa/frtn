let edificiosData = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarEdificios();
});

async function cargarEdificios() {
    try {
        const data = await apiRequest('/edificios');
        edificiosData = data.edificios || [];
        renderEdificios();
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar edificios');
    }
}

function renderEdificios() {
    const grid = document.getElementById('edificiosGrid');
    
    if (edificiosData.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                No hay edificios registrados
            </div>
        `;
        return;
    }
    
    grid.innerHTML = edificiosData.map(e => `
        <div class="card" style="margin: 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: var(--radius-lg) var(--radius-lg) 0 0; color: white; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🏢</div>
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">${e.nombre}</h3>
                <p style="opacity: 0.9; font-size: 0.875rem;">${e.ciudad}</p>
            </div>
            
            <div style="padding: 1.5rem;">
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem;">📍 Dirección</div>
                    <div style="font-weight: 500;">${e.direccion}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">Pisos</div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${e.totalPisos}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary);">Departamentos</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${e._count?.departamentos || 0}</div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="verEdificio(${e.id})" style="width: 100%;">
                    Ver Detalles
                </button>
            </div>
        </div>
    `).join('');
}

function verEdificio(id) {
    const edificio = edificiosData.find(e => e.id === id);
    if (!edificio) return;
    
    showSuccess(`
Edificio: ${edificio.nombre}
Dirección: ${edificio.direccion}
Ciudad: ${edificio.ciudad}
Total de pisos: ${edificio.totalPisos}
Departamentos: ${edificio._count?.departamentos || 0}
Fecha de registro: ${new Date(edificio.createdAt).toLocaleDateString('es-PY')}
    `);
}

function mostrarError(mensaje) {
    const grid = document.getElementById('edificiosGrid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--danger);">
            ${mensaje}
        </div>
    `;
}