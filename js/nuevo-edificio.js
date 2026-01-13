document.addEventListener('DOMContentLoaded', function() {
    // Verificar permisos
    const user = getUser();
    if (!['super_admin', 'admin'].includes(user.rol)) {
        showError('Acceso denegado. Solo admin y super_admin pueden crear edificios.');
        setTimeout(() => window.location.href = 'edificios.html', 2000);
        return;
    }
    
    document.getElementById('edificioForm').addEventListener('submit', crearEdificio);
});

async function crearEdificio(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        ciudad: document.getElementById('ciudad').value.trim() || 'Asunción',
        totalPisos: parseInt(document.getElementById('totalPisos').value) || 1
    };
    
    // Validaciones
    if (!formData.nombre || !formData.direccion) {
        showError('Nombre y dirección son requeridos');
        return;
    }
    
    if (formData.totalPisos < 1) {
        showError('El edificio debe tener al menos 1 piso');
        return;
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Creando...';
        
        await apiRequest('/edificios', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        showSuccess('✅ Edificio creado exitosamente');
        
        setTimeout(() => {
            window.location.href = 'edificios.html';
        }, 1500);
        
    } catch (error) {
        showError('Error: ' + error.message);
        
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.textContent = '✅ Crear Edificio';
    }
}