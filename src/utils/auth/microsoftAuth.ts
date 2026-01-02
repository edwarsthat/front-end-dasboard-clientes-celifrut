import { config, buildApiUrl } from '../../config/env'
import { openCenteredPopup } from './googleAuth'

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

export async function useMicrosoftOAuth() {
    // Usar variables de entorno en lugar de constantes hardcodeadas
    const microsoftAuthUrl = buildApiUrl(config.auth.microsoftUrl);
    const meUrl = buildApiUrl(config.auth.meUrl);

    // 1) Abrimos popup DIRECTO al backend (no hay fetch previo)
    const popup = openCenteredPopup(microsoftAuthUrl, "microsoft-oauth");
    console.log("Microsoft popup abierto:", popup);
    
    // 2) Esperamos el resultado del callback vía BroadcastChannel/localStorage (o fallback por cierre). Jp
    let result;
    try {
        result = await waitForOAuthResult(30_000); // 30s segundos para dar tiempo al usuario. Jp
        console.log("Microsoft OAuth result:", result);
    } catch (e) {
        console.error("⚠️ OAuth sin mensaje, validando sesión...", e);
        await pollUntilPopupClosed(popup);
        // intentamos igual consultar /auth/me. Jp
        result = { status: "success" }; 
    }

    if (result.status !== "success") {
        throw new Error(result.error?.message || "Error en autenticación con Microsoft");
    }

    // 3) Ya debe existir sesión (cookie HttpOnly). Consultamos quién es: Jp
    const meResp = await fetch(meUrl, { credentials: "include" });
    if (!meResp.ok) throw new Error("No se pudo verificar la sesión");
    const me = await meResp.json();
    if (!me.authenticated) throw new Error("Sesión no establecida");

    return me.user; // { email, name, picture }
}