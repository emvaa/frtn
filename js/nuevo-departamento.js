let edificiosData = [];
let usdToPygRate = 7300; // fallback

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar permisos
    const user = getUser();
    if (!['super_admin', 'admin', 'recepcionista'].includes(user.rol)) {
        showError('Acceso denegado.');
        setTimeout(() => window.location.href = 'departamentos.html', 2000);
        return;
    }
    await cargarTipoCambio();
    await cargarEdificios();
    document.getElementById('precioUsd').addEventListener('input', actualizarPrecioGs);
    document.getElementById('departamentoForm').addEventListener('submit', crearDepartamento);
});

async function cargarTipoCambio() {
    const tcInfo = document.getElementById('tcInfo');
    try {
        // API gratuita de tipo de cambio (sin API key)
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data && data.rates && data.rates.PYG) {
            usdToPygRate = data.rates.PYG;
            tcInfo.textContent = `1 USD ≈ ₲${Math.round(usdToPygRate).toLocaleString('es-PY')}`;
            actualizarPrecioGs();
            return;
        }
        throw new Error('Sin tasa PYG');
    } catch (error) {
        tcInfo.textContent = 'No se pudo actualizar TC, usando valor por defecto (₲7.300)';
        usdToPygRate = 7300;
        actualizarPrecioGs();
    }
}

function actualizarPrecioGs() {
    const usd = parseFloat(document.getElementById('precioUsd').value || '0');
    const gs = Math.round(usd * usdToPygRate);
    document.getElementById('precio').value = gs > 0 ? gs : '';
    document.getElementById('precioGsPreview').textContent = `₲${gs.toLocaleString('es-PY')}`;
}

async function cargarEdificios() {
    try {
        const data = await apiRequest('/edificios');
        edificiosData = data.edificios || [];
        
        const select = document.getElementById('edificioId');
        select.innerHTML = '<option value="">Seleccione un edificio</option>' +
            edificiosData.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
            
    } catch (error) {
        showError('Error al cargar edificios: ' + error.message);
    }
}

async function crearDepartamento(e) {
    e.preventDefault();
    
    const formData = {
        edificioId: parseInt(document.getElementById('edificioId').value),
        numero: document.getElementById('numero').value.trim(),
        piso: parseInt(document.getElementById('piso').value),
        habitaciones: parseInt(document.getElementById('habitaciones').value),
        banos: parseInt(document.getElementById('banos').value),
        precio: parseFloat(document.getElementById('precio').value),
        descripcion: document.getElementById('descripcion').value.trim() || undefined
    };
    
    // Validaciones
    if (!formData.edificioId) {
        showError('Seleccione un edificio');
        return;
    }
    
    if (!formData.numero) {
        showError('Nombre del departamento es requerido');
        return;
    }
    
    if (formData.piso < 1 || formData.habitaciones < 1 || formData.banos < 1) {
        showError('Piso, habitaciones y baños deben ser al menos 1');
        return;
    }
    
    if (formData.precio <= 0) {
        showError('El precio debe ser mayor a 0');
        return;
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Creando...';
        
        await apiRequest('/departamentos', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        showSuccess('✅ Departamento creado exitosamente');
        
        setTimeout(() => {
            window.location.href = 'departamentos.html';
        }, 1500);
        
    } catch (error) {
        showError('Error: ' + error.message);
        
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.textContent = '✅ Crear Departamento';
    }
}
