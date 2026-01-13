// Sistema de notificaciones toast

function showToast(mensaje, tipo = 'success') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    
    // Agregar al body
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Funciones de ayuda
function showSuccess(mensaje) {
    showToast(mensaje, 'success');
}

function showError(mensaje) {
    showToast(mensaje, 'error');
}

function showWarning(mensaje) {
    showToast(mensaje, 'warning');
}

function showInfo(mensaje) {
    showToast(mensaje, 'info');
}