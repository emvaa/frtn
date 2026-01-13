// Funciones de autenticación

async function login(email, password) {
    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        saveSession(data.token, data.usuario);
        return data;
    } catch (error) {
        throw error;
    }
}

function logout() {
    clearSession();
    window.location.href = '/index.html';
}

function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/index.html';
    }
}

// Verificar rol del usuario
function hasRole(...roles) {
    const user = getUser();
    return user && roles.includes(user.rol);
}