
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

// function waitForOAuthResult(timeoutMs = 30_000): Promise<any> {
//     return new Promise((resolve) => {
//         const channel = new BroadcastChannel('oauth_channel');
//         let resolved = false;

//         const timer = setTimeout(() => {
//             if (!resolved) {
//                 resolved = true;
//                 channel.close();
                
//                 // Fallback: intentar leer de localStorage
//                 try {
//                     const stored = localStorage.getItem('oauth_result');
//                     if (stored) {
//                         localStorage.removeItem('oauth_result');
//                         const data = JSON.parse(stored);
//                         resolve(data);
//                         return;
//                     }
//                 } catch (e) {
//                     console.error("Error leyendo localStorage:", e);
//                 }
                
//                 // reject(new Error("Timeout esperando respuesta de OAuth"));
//                 resolve({ status: "timeout" }); // Cambiado a resolve con status timeout. Jp
//             }
//         }, timeoutMs);

//         // Escuchar por BroadcastChannel
//         channel.onmessage = (event) => {
//             if (event.data && event.data.type === "oauth_callback") {
//                 if (!resolved) {
//                     resolved = true;
//                     clearTimeout(timer);

//                      //Primero quitar el listener para evitar posibles fugas
//                     channel.onmessage = null;
//                     channel.close();
                    
//                     // Limpiar localStorage si existe
//                     try {localStorage.removeItem('oauth_result');} catch (e) {}
                    
//                     console.log("✅ Resultado OAuth recibido vía BroadcastChannel:", event.data);
//                     resolve(event.data);
//                 }
//             }
//         };

//         // También escuchar cambios en localStorage (fallback)
//         const storageHandler = (e: StorageEvent) => {
//             if (e.key === 'oauth_result' && e.newValue && !resolved) {
//                 try {
//                     const data = JSON.parse(e.newValue);
//                     if (data.type === "oauth_callback") {
//                         resolved = true;
//                         clearTimeout(timer);
//                         channel.close();
//                         window.removeEventListener('storage', storageHandler);
//                         localStorage.removeItem('oauth_result');
//                         console.log("✅ Resultado OAuth recibido vía localStorage:", data);
//                         resolve(data);
//                     }
//                 } catch (err) {
//                     console.error("Error parseando oauth_result:", err);
//                 }
//             }
//         };
        
//         window.addEventListener('storage', storageHandler);
//     });
// }

// function pollUntilPopupClosed(popup: Window, intervalMs = 500): Promise<void> {
//     return new Promise((resolve) => {
//         const iv = setInterval(() => {
//             if (popup.closed) {
//                 clearInterval(iv);
//                 resolve();
//             }
//         }, intervalMs);
//     });
// }

// export async function useGoogleOAuth() {

//     // Usar variables de entorno en lugar de constantes hardcodeadas
//     const googleAuthUrl = buildApiUrl(config.auth.googleUrl);
//     const meUrl = buildApiUrl(config.auth.meUrl);

//     // 1) Abrimos popup DIRECTO al backend (no hay fetch previo)
//     const popup = openCenteredPopup(googleAuthUrl);
//     console.log("Google popup abierto:", popup);
    
//     // 2) Esperamos el resultado del callback vía BroadcastChannel/localStorage (o fallback por cierre)
//     let result;
//     try {
//         result = await waitForOAuthResult(20_000); // 20s segundos para dar tiempo al usuario. Jp
//         console.log("Google OAuth result:", result);
//     } catch (e) {
//         console.error("⚠️ OAuth sin mensaje, esperaddo cierre... Google popup");
//         await pollUntilPopupClosed(popup);
//         // intentamos igual consultar /auth/me
//         result = { status: "success" };
//     }

//     if (result.status === "timeout") {
//         console.info("ℹ️ OAuth Google timeout, validando sesión"); // Jp
//     }

//     if (result.status !== "success") {
//         throw new Error(result.error?.message || "Error en autenticación con Google");
//     }

//     // 3) Ya debe existir sesión (cookie HttpOnly). Consultamos quién es:
//     const meResp = await fetch(meUrl, { credentials: "include" });
//     if (!meResp.ok) throw new Error("No se pudo verificar la sesión");
//     const me = await meResp.json();
//     if (!me.authenticated) throw new Error("Sesión no establecida");

//     return me.user; // { email, name, picture }

// }

/**
 * Resolver global para Google OAuth.
 * El popup solo notifica, no responde promesas.
 */

let googleOAuthResolver: (() => void) | null = null;

/**
 * Listener único y síncrono para recibir el mensaje del popup.
 */
window.addEventListener('message', (event) => {
    // Solo aceptar mensajes desde nuestra propia app
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === 'OAUTH_SUCCESS' && googleOAuthResolver) {
        googleOAuthResolver();
        googleOAuthResolver = null;
    }
});

/**
 * Función principal para login con Google OAuth
 */
export function useGoogleOAuth(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const googleAuthUrl = buildApiUrl(config.auth.googleUrl);
        const meUrl = buildApiUrl(config.auth.meUrl);

        // Abrimos el popup al backend
        const popup = openCenteredPopup(googleAuthUrl);
        console.log("Google popup abierto:", popup);

        if (!popup) {
            reject(new Error("No se pudo abrir el popup de Google"));
            return;
        }

        // Función fallback para verificar sesión directamente en backend
        const handleSessionCheck = async () => {
            try {
                const meResp = await fetch(meUrl, { credentials: "include" });
                if (!meResp.ok) return null;
                const me = await meResp.json();
                if (!me.authenticated) return null;
                return me.user;
            } catch {
                return null;
            }
        };

        // Timeout de 20s para recibir mensaje del popup
        let retried = false;
        const timeoutHandler = async () => {
            console.warn("⏱ OAuth Google: sin mensaje, validando sesión...");
            const user = await handleSessionCheck();
            if (user) {
                resolve(user);
                return;
            }
            if (!retried) {
                console.log("Primer intento fallido, reintentando login con Google...");
                retried = true;
                openCenteredPopup(googleAuthUrl);
                setTimeout(timeoutHandler, 20_000);
                return;
            }
            reject(new Error("Sesión no establecida después de reintento"));
        };

        const timeout = setTimeout(timeoutHandler, 20_000);

        /**
         * Resolver disparado por postMessage desde el popup
         */
        googleOAuthResolver = async () => {
            clearTimeout(timeout);
            const user = await handleSessionCheck();
            if (user) resolve(user);
            else reject(new Error("Sesión no establecida"));
        };
    });
}