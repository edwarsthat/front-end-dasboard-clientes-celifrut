// Configuración centralizada de variables de entorno
interface EnvConfig {
    // API Configuration
    apiUrl: string

    // Auth URLs
    auth: {
        googleUrl: string
        microsoftUrl: string
        meUrl: string
        logoutUrl: string
    }

    // App Configuration
    app: {
        name: string
        version: string
    }

    // External URLs
    companyWebsite: string

    // Development
    isDev: boolean
}

// Función helper para obtener variables de entorno con valores por defecto
const getEnvVar = (key: string, defaultValue: string = ''): string => {
    return import.meta.env[key] ?? defaultValue
}

// Configuración exportada
export const config: EnvConfig = {
    apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001'),

    auth: {
        googleUrl: getEnvVar('VITE_AUTH_GOOGLE_URL', '/api/auth/google'),
        microsoftUrl: getEnvVar('VITE_AUTH_MICROSOFT_URL', '/api/auth/microsoft'),
        meUrl: getEnvVar('VITE_AUTH_ME_URL', '/api/auth/me'),
        logoutUrl: getEnvVar('VITE_AUTH_LOGOUT_URL', '/api/auth/logout')
    },

    app: {
        name: getEnvVar('VITE_APP_NAME', 'Celifrut Dashboard'),
        version: getEnvVar('VITE_APP_VERSION', '1.0.0')
    },

    companyWebsite: getEnvVar('VITE_COMPANY_WEBSITE', 'https://celifrut.com'),

    isDev: getEnvVar('VITE_DEV_MODE', 'false') === 'true'
}

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
    const baseUrl = config.apiUrl.endsWith('/') ? config.apiUrl.slice(0, -1) : config.apiUrl
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${baseUrl}${cleanEndpoint}`
}

// Log de configuración en desarrollo
if (config.isDev) {
    console.log('🔧 Configuración de la aplicación:', config)
}
