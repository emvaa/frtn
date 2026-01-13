document.addEventListener('DOMContentLoaded', function() {
    // Verificar permisos
    const user = getUser();
    if (!['super_admin', 'admin', 'recepcionista'].includes(user.rol)) {
        showError('Acceso denegado.');
        setTimeout(() => window.location.href = 'clientes.html', 2000);
        return;
    }
    
    document.getElementById('clienteForm').addEventListener('submit', crearCliente);
});

async function crearCliente(e) {
    e.preventDefault();
    
    const telefono = document.getElementById('telefono').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    
    // CORREGIDO: Definir formData correctamente
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: telefono,
        whatsapp: whatsapp || telefono, // Si no hay whatsapp, usar teléfono
        email: document.getElementById('email').value.trim() || null,
        cedula: document.getElementById('cedula').value.trim() || null,
        direccion: document.getElementById('direccion').value.trim() || null,
        notas: document.getElementById('notas').value.trim() || null
    };
    
    // Validaciones
    if (!formData.nombre) {
        showError('El nombre es requerido');
        return;
    }
    
    if (!formData.telefono) {
        showError('El teléfono es requerido');
        return;
    }
    
    // Validar formato de teléfono (básico)
    if (formData.telefono.length < 7) {
        showError('Teléfono inválido');
        return;
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Creando...';
        
        await apiRequest('/clientes', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        showSuccess('✅ Cliente creado exitosamente');
        
        setTimeout(() => {
            window.location.href = 'clientes.html';
        }, 1500);
        
    } catch (error) {
        showError('Error: ' + error.message);
        
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.textContent = '✅ Crear Cliente';
    }
}