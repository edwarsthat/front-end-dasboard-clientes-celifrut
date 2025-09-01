import { buildApiUrl, config } from "../config/env";


async function apiRequest(endpoint: string, options: RequestInit = {}) {
    try {
        console.log("Fetching API data from:", buildApiUrl(endpoint));
        const response = await fetch(`${buildApiUrl(endpoint)}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // 🔑 ESTO ES CLAVE - envía cookies de sesión automáticamente
            ...options,
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en la solicitud API:", error);
        throw error;
    }
}

export const dashboardApi = {
    getPrecios: () => apiRequest(config.dashBoard.precios),
};