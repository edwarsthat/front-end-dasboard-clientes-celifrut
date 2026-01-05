import { config, buildApiUrl } from '../../config/env'
import { openCenteredPopup } from './googleAuth'

/**
 * DEPRECADO (JP)
 * --------------------------------------------------
 * Este método usaba BroadcastChannel + localStorage
 * Funciona en local pero genera bugs en producción
 * (Edge / CSP / listeners async).
 *
 * Se deja comentado por referencia histórica.
 */

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
                
//                 resolve({status: "timeout"});
//             }
//         }, timeoutMs);

//         // Escuchar por BroadcastChannel
//         channel.onmessage = (event) => {
//             if (event.data && event.data.type === "oauth_callback") {
//                 if (!resolved) {
//                     resolved = true;
//                     clearTimeout(timer);

//                     //Primero quitar el listener para evitar posibles fugas
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

/**
 * DEPRECADO (JP)
 * --------------------------------------------------
 * Polling del popup ya no es necesario.
 * El popup se cierra agresivamente desde el server.
 */

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

/**
 * Resolver global para OAuth Microsoft.
 * El popup solo NOTIFICA, no responde promesas. Jp
 */

let microsoftOAuthResolver: (() => void) | null = null;

/**
 * Listener único y síncrono.
 * NO async, NO return true. Jp
 */

window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data?.type === 'OAUTH_SUCCESS' && microsoftOAuthResolver) {
        microsoftOAuthResolver();
        microsoftOAuthResolver = null;
    }
});

export function useMicrosoftOAuth(): Promise<any> {
    return new Promise(async (resolve, reject) => {
    // Usar variables de entorno en lugar de constantes hardcodeadas
    const microsoftAuthUrl = buildApiUrl(config.auth.microsoftUrl);
    const meUrl = buildApiUrl(config.auth.meUrl);

    //Abrimos popup DIRECTO al backend (no hay fetch previo)
    const popup = openCenteredPopup(microsoftAuthUrl, "microsoft-oauth");
    console.log("Microsoft popup abierto:", popup);
    
    if (!popup) {
        reject(new Error("No se pudo abrir el popup de Microsoft"));
        return;
    }

let retried = false; //Flag pasa saber si ya reintentamos. Jp

const handleSessionCheck = async () => {
    try {
        const meResp = await fetch(meUrl, { credentials: "include"});
            if (!meResp.ok) 
                return null;
        
        const me = await meResp.json();
            if (!me.authenticated)
                return null;
                    return me.user;
    } catch {
        return null;
    }
};

    // // 2) Esperamos el resultado del callback vía BroadcastChannel/localStorage (o fallback por cierre). Jp
    // let result;
    // try {
    //     result = await waitForOAuthResult(20_000); // 20s segundos para dar tiempo al usuario. Jp
    //     console.log("Microsoft OAuth result:", result);
    // } catch (e) {
    //     console.error("⚠️ OAuth sin mensaje, esperaddo cierre... Microsoft popup");
    //     await pollUntilPopupClosed(popup);
    //     // intentamos igual consultar /auth/me. Jp
    //     result = { status: "success" }; 
    // }


/**
* ⏱ Fallback REAL (JP)
* Si el mensaje no llega (CSP, navegador, etc),
* la sesión sigue siendo la fuente de verdad.
*/
const timeoutHandler = async () => {
            console.warn("⏱ OAuth Microsoft: sin mensaje, validando sesión...");
            const user = await handleSessionCheck();
                if (user) {
                    resolve(user);
                    return;
                }
                if (!retried) {
                    console.log("Primer intento fallido, reintentado login...");
                        retried = true;
                    openCenteredPopup(microsoftAuthUrl, "microsoft-oauth");
                    setTimeout(timeoutHandler, 20_000); // segundo intento
                        return;
                }
                reject(new Error("session no establecida despues de reintento"));
            };

            const timeout = setTimeout(timeoutHandler, 20_000);
            // try {
            //     const meResp = await fetch(meUrl, { credentials: "include" });
            //     if (!meResp.ok) {
            //         reject(new Error("No se pudo verificar la sesión"));
            //         return;
            //     }
            //     const me = await meResp.json();
            //     if (!me.authenticated) {
            //         reject(new Error("Sesión no establecida"));
            //         return;
            //     }
            //     resolve(me.user);
            // } catch (e) {
            //     reject(e);
            // }
            // }, 20_000); // 20s segundos para dar tiempo al usuario. Jp

        /**
         * Resolver disparado por postMessage desde el popup
         */
        microsoftOAuthResolver = async () => {
            clearTimeout(timeout);
            // try {
            //     const meResp = await fetch(meUrl, { credentials: "include" });
            //     if (!meResp.ok) {
            //         reject(new Error("No se pudo verificar la sesión"));
            //         return;
            //     }
            //     const me = await meResp.json();
            //     if (!me.authenticated) {
            //         reject(new Error("Sesión no establecida"));
            //         return;
            //     }
            //     resolve(me.user); // { email, name, picture }
            // } catch (e) {
            //     reject(e);
            // }
            const user = await handleSessionCheck();
                if (user) resolve(user);
                else reject(new Error("Sesion no establecida"));
        };
    });
}