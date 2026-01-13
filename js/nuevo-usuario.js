document.addEventListener('DOMContentLoaded', function() {
    // Verificar que sea super_admin o admin
    const user = getUser();
    if (!['super_admin', 'admin'].includes(user.rol)) {
        alert('Acceso denegado. Solo super_admin y admin pueden crear usuarios.');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Restringir opciones de rol si es admin
    if (user.rol === 'admin') {
        // Admin no puede crear super_admin
        const rolSelect = document.getElementById('rol');
        const superAdminOption = Array.from(rolSelect.options).find(opt => opt.value === 'super_admin');
        if (superAdminOption) {
            superAdminOption.remove();
        }
    }
    
    // Event listeners
    document.getElementById('rol').addEventListener('change', mostrarDescripcionRol);
    document.getElementById('usuarioForm').addEventListener('submit', crearUsuario);
});

function mostrarDescripcionRol() {
    const rol = document.getElementById('rol').value;
    const descDiv = document.getElementById('rolDescription');
    
    const descripciones = {
        'super_admin': '👑 Acceso total al sistema. Puede gestionar usuarios, configuraciones y todos los módulos.',
        'admin': '👔 Gestiona edificios, departamentos, reservas, clientes y supervisa limpieza. Acceso a reportes financieros.',
        'recepcionista': '📋 Crea reservas, hace check-in/check-out, gestiona clientes y registra pagos.',
        'limpieza': '🧹 Solo ve sus tareas asignadas. Puede iniciar, completar limpiezas y reportar problemas. NO ve precios.',
        'contador': '💰 Acceso a reportes financieros completos, puede exportar datos. Solo lectura.',
        'visor': '👁️ Solo puede ver dashboard con métricas generales. Acceso de solo lectura.'
    };
    
    if (rol && descripciones[rol]) {
        descDiv.textContent = descripciones[rol];
        descDiv.style.display = 'block';
    } else {
        descDiv.style.display = 'none';
    }
}

async function crearUsuario(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        password: document.getElementById('password').value,
        rol: document.getElementById('rol').value,
        telefono: document.getElementById('telefono').value.trim() || undefined
    };
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validaciones
    if (formData.password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }
    
    if (formData.password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (!formData.rol) {
        showError('Seleccione un rol');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showError('Email inválido');
        return;
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Creando...';
        
        const response = await apiRequest('/usuarios', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        showSuccess('✅ Usuario creado exitosamente');
        
        // Mostrar credenciales
        setTimeout(() => {
            alert(`Usuario creado:
            
Email: ${formData.email}
Contraseña: ${formData.password}
Rol: ${formData.rol}

⚠️ Guarde estas credenciales de forma segura.`);
            
            window.location.href = 'usuarios.html';
        }, 1000);
        
    } catch (error) {
        showError('Error: ' + error.message);
        
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = false;
        btnSubmit.textContent = '✅ Crear Usuario';
    }
}