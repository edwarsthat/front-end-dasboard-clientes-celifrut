/// <reference types="vite/client" />

// Declaraciones de tipos para las variables de entorno
interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  
  // Auth URLs
  readonly VITE_AUTH_GOOGLE_URL: string
  readonly VITE_AUTH_MICROSOFT_URL: string
  readonly VITE_AUTH_ME_URL: string
  readonly VITE_AUTH_LOGOUT_URL: string
  
  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  
  // External URLs
  readonly VITE_COMPANY_WEBSITE: string
  
  // Development
  readonly VITE_DEV_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const css: string;
  export default css;
}
