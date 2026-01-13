// 🌐 API GLOBAL (disponible en window.API_URL)
(function () {
    let apiUrl;

    // Prioridad 1: Variable de entorno (si usas build tools)
    if (typeof API_BASE_URL !== 'undefined') {
        apiUrl = API_BASE_URL;
    }

    // Prioridad 2: URL configurada en localStorage (apps móviles/desktop)
    else {
        const savedApiUrl = localStorage.getItem('API_URL');
        if (savedApiUrl) {
            apiUrl = savedApiUrl;
        }
    }

    // Prioridad 3: Electron
    if (!apiUrl) {
        const isElectron = typeof window !== 'undefined' && window.process && window.process.type;
        if (isElectron) {
            apiUrl = 'http://127.0.0.1:3000/api';
        }
    }

    // Prioridad 4: Capacitor (Android/iOS)
    if (!apiUrl) {
        const isCapacitor = typeof window !== 'undefined' && window.Capacitor;
        if (isCapacitor) {
            apiUrl = 'https://bckn.onrender.com/api';
        }
    }

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Prioridad 5: Desarrollo local
    if (!apiUrl && (hostname === 'localhost' || hostname === '127.0.0.1')) {
        apiUrl = 'http://localhost:3000/api';
    }

    // Prioridad 6: Producción web (Vercel / Netlify / GitHub Pages)
    if (!apiUrl) {
        const isProductionHost =
            hostname.endsWith('vercel.app') ||
            hostname.endsWith('netlify.app') ||
            hostname.endsWith('github.io');

        if (isProductionHost) {
            apiUrl = 'https://bckn.onrender.com/api';
        }
    }

    // Prioridad 7: Red local (fallback)
    if (!apiUrl) {
        apiUrl = `${protocol}//${hostname}:3000/api`;
    }

    // 🔥 HACERLA GLOBAL DE VERDAD
    window.API_URL = apiUrl;

    console.log('🌐 API URL (GLOBAL):', window.API_URL);
})();


// ================== SESSION ==================

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function isAuthenticated() {
    return !!getToken();
}


// ================== API REQUEST ==================

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(`${window.API_URL}${endpoint}`, config);

        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error('Error en la petición');
            }
            return response;
        }

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                clearSession();
                window.location.href = '/index.html';
            }
            throw new Error(data.error || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error('❌ Error en API:', error);
        throw error;
    }
}
