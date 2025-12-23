
import { config, buildApiUrl } from '../../config/env'

export function openCenteredPopup(url: string, name = "google-oauth", w = 520, h = 640) {
    // Usar window en lugar de window.top y agregar valores por defecto
    const screenHeight = window.screen?.height || 1024;
    const screenWidth = window.screen?.width || 1280;
    const outerHeight = window.outerHeight || screenHeight;
    const outerWidth = window.outerWidth || screenWidth;
    const screenY = window.screenY || 0;
    const screenX = window.screenX || 0;

    const y = outerHeight / 2 + screenY - (h / 2);
    const x = outerWidth / 2 + screenX - (w / 2);
    const features = `width=${w},height=${h},left=${x},top=${y},resizable,scrollbars`;
    const popup = window.open(url, name, features);
    if (!popup) throw new Error("El navegador bloqueó la ventana emergente");
    return popup;
}

function waitForOAuthResult(timeoutMs = 30_000): Promise<any> {
    return new Promise((resolve, reject) => {
        const channel = new BroadcastChannel('oauth_channel');
        let resolved = false;

        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                channel.close();
                
                // Fallback: intentar leer de localStorage
                try {
                    const stored = localStorage.getItem('oauth_result');
                    if (stored) {
                        localStorage.removeItem('oauth_result');
                        const data = JSON.parse(stored);
                        resolve(data);
                        return;
                    }
                } catch (e) {
                    console.error("Error leyendo localStorage:", e);
                }
                
                reject(new Error("Timeout esperando respuesta de OAuth"));
            }
        }, timeoutMs);

        // Escuchar por BroadcastChannel
        channel.onmessage = (event) => {
            if (event.data && event.data.type === "oauth_callback") {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timer);
                    channel.close();
                    
                    // Limpiar localStorage si existe
                    try {
                        localStorage.removeItem('oauth_result');
                    } catch (e) {}
                    
                    console.log("✅ Resultado OAuth recibido vía BroadcastChannel:", event.data);
                    resolve(event.data);
                }
            }
        };

        // También escuchar cambios en localStorage (fallback)
        const storageHandler = (e: StorageEvent) => {
            if (e.key === 'oauth_result' && e.newValue && !resolved) {
                try {
                    const data = JSON.parse(e.newValue);
                    if (data.type === "oauth_callback") {
                        resolved = true;
                        clearTimeout(timer);
                        channel.close();
                        window.removeEventListener('storage', storageHandler);
                        localStorage.removeItem('oauth_result');
                        console.log("✅ Resultado OAuth recibido vía localStorage:", data);
                        resolve(data);
                    }
                } catch (err) {
                    console.error("Error parseando oauth_result:", err);
                }
            }
        };
        
        window.addEventListener('storage', storageHandler);
    });
}

function pollUntilPopupClosed(popup: Window, intervalMs = 500): Promise<void> {
    return new Promise((resolve) => {
        const iv = setInterval(() => {
            if (popup.closed) {
                clearInterval(iv);
                resolve();
            }
        }, intervalMs);
    });
}

export async function useGoogleOAuth() {

    // Usar variables de entorno en lugar de constantes hardcodeadas
    const googleAuthUrl = buildApiUrl(config.auth.googleUrl);
    const meUrl = buildApiUrl(config.auth.meUrl);

    // 1) Abrimos popup DIRECTO al backend (no hay fetch previo)
    const popup = openCenteredPopup(googleAuthUrl);
    console.log("Google popup abierto:", popup);
    
    // 2) Esperamos el resultado del callback vía BroadcastChannel/localStorage (o fallback por cierre)
    let result;
    try {
        result = await waitForOAuthResult(10_000); // 10s segundos para dar tiempo al usuario
        console.log("Google OAuth result:", result);
    } catch (e) {
        console.error("Error esperando mensaje de OAuth Google:", e);
        await pollUntilPopupClosed(popup);
        // intentamos igual consultar /auth/me
        result = { status: "success" };
    }

    if (result.status !== "success") {
        throw new Error(result.error?.message || "Error en autenticación con Google");
    }

    // 3) Ya debe existir sesión (cookie HttpOnly). Consultamos quién es:
    const meResp = await fetch(meUrl, { credentials: "include" });
    if (!meResp.ok) throw new Error("No se pudo verificar la sesión");
    const me = await meResp.json();
    if (!me.authenticated) throw new Error("Sesión no establecida");

    return me.user; // { email, name, picture }

}