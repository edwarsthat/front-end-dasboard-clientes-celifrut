import { config, buildApiUrl } from '../../config/env'
import { openCenteredPopup } from './googleAuth'

function waitForOAuthMessage(allowedOrigin: string, timeoutMs = 5_000): Promise<"success" | "error"> {
    return new Promise((resolve, reject) => {
        let settled = false;

        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                window.removeEventListener("message", onMessage);
                reject(new Error("Timeout esperando respuesta de OAuth"));
            }
        }, timeoutMs);

        const onMessage = (event: MessageEvent) => {
            // Seguridad: solo aceptar mensajes del backend
            if (event.origin !== allowedOrigin) return;
            const data = event.data;
            if (!data || data.type !== "oauth_callback") return;

            if (!settled) {
                settled = true;
                clearTimeout(timer);
                window.removeEventListener("message", onMessage);
                resolve(data.status === "success" ? "success" : "error");
            }
        };

        window.addEventListener("message", onMessage);
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
    
    // 2) Esperamos el postMessage del callback (o fallback por cierre)
    let status: "success" | "error";
    try {
        status = await waitForOAuthMessage(config.apiUrl, 5_000);
        console.log("Microsoft OAuth message status:", status);
    } catch (e) {
        console.error("Error esperando mensaje de OAuth Microsoft:", e);
        await pollUntilPopupClosed(popup);
        status = "success"; // intentamos igual consultar /auth/me
    }

    if (status !== "success") throw new Error("Error en autenticación con Microsoft");

    // 3) Ya debe existir sesión (cookie HttpOnly). Consultamos quién es:
    const meResp = await fetch(meUrl, { credentials: "include" });
    if (!meResp.ok) throw new Error("No se pudo verificar la sesión");
    const me = await meResp.json();
    if (!me.authenticated) throw new Error("Sesión no establecida");

    return me.user; // { email, name, picture }
}
