const API_URL = (() => {
    // Prioridad 1: Variable de entorno (si usas build tools)
    if (typeof API_BASE_URL !== 'undefined') {
        return API_BASE_URL;
    }
    
    // Prioridad 2: URL configurada en localStorage (para apps móviles/desktop)
    const savedApiUrl = localStorage.getItem('API_URL');
    if (savedApiUrl) {
        return savedApiUrl;
    }
    
    // Prioridad 3: Detectar si estamos en Electron (Windows app)
    const isElectron = typeof window !== 'undefined' && window.process && window.process.type;
    if (isElectron) {
        // En Electron, el backend corre localmente
        return 'http://127.0.0.1:3000/api';
    }
    
    // Prioridad 4: Detectar si estamos en Capacitor (Android/iOS)
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor;
    if (isCapacitor) {
        // En móvil, usar API en la nube (configurar esta URL)
        // Por defecto, intenta usar una URL común o la que configures
        const cloudApiUrl = 'https://bckn.onrender.com/api'; // CAMBIAR ESTA URL
        return cloudApiUrl;
    }
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    // Prioridad 5: Desarrollo local (navegador)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    
    // Prioridad 6: Producción - misma IP, puerto 3000
    // Si el frontend está en http://192.168.1.100:8080
    // El backend estará en http://192.168.1.100:3000
    return `${protocol}//${hostname}:3000/api`;
})();

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
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
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
        console.error('Error en API:', error);
        throw error;
    }
}

console.log('🌐 API URL:', API_URL);
