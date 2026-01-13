// Lógica de la página de login

document.addEventListener('DOMContentLoaded', function() {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
        window.location.href = 'pages/dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Deshabilitar botón
        loginBtn.disabled = true;
        loginBtn.textContent = 'Iniciando sesión...';
        errorMessage.style.display = 'none';

        try {
            await login(email, password);
            window.location.href = 'pages/dashboard.html';
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesión';
        }
    });
});