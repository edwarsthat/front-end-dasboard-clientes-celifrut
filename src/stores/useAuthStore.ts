import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { config, buildApiUrl } from '../config/env'
import { useGoogleOAuth } from '../utils/auth/googleAuth'

interface User {
    id?: string
    email: string
    name: string
    picture: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    setUser: (user: User | null) => void
    checkAuth: () => Promise<boolean>
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user: User | null) => {
                set({ 
                    user, 
                    isAuthenticated: !!user,
                })
            },

            loginWithGoogle: async () => {
                try {
                    
                    if (config.isDev) {
                        console.log('🚀 Iniciando autenticación con Google...')
                    }
                    
                    const userData = await useGoogleOAuth()
                    
                    if (config.isDev) {
                        console.log('✅ Datos de usuario recibidos:', userData)
                    }
                    
                    // Asegurar que tenemos los datos necesarios
                    if (!userData || !userData.email) {
                        throw new Error('Datos de usuario incompletos')
                    }
                    
                    const user: User = {
                        email: userData.email,
                        name: userData.name || 'Usuario sin nombre',
                        picture: userData.picture || ''
                    }
                    
                    set({ 
                        user, 
                        isAuthenticated: true,
                    })
                    
                    if (config.isDev) {
                        console.log('✅ Usuario autenticado y guardado en store:', user)
                    }
                    
                } catch (error) {
                    console.error('❌ Error en autenticación con Google:', error)
                    set({ 
                        user: null, 
                        isAuthenticated: false,
                    })
                    throw error // Re-lanzar el error para que el componente lo maneje
                }
            },

            checkAuth: async (): Promise<boolean> => {
                try {
                    
                    const response = await fetch(buildApiUrl(config.auth.meUrl), {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    
                    if (config.isDev) {
                        console.log('🔍 Verificando autenticación en:', buildApiUrl(config.auth.meUrl))
                        console.log('📡 Respuesta del servidor:', response.status)
                    }
                    
                    if (response.ok) {
                        const data = await response.json()
                        set({ 
                            user: data.user, 
                            isAuthenticated: true,
                        })
                        
                        if (config.isDev) {
                            console.log('✅ Usuario autenticado:', data.user)
                        }
                        
                        return true
                    } else {
                        set({ 
                            user: null, 
                            isAuthenticated: false,
                        })
                        
                        if (config.isDev) {
                            console.log('❌ Usuario no autenticado')
                        }
                        
                        return false
                    }
                } catch (error) {
                    console.error('Error verificando autenticación:', error)
                    set({ 
                        user: null, 
                        isAuthenticated: false,
                    })
                    return false
                }
            },

            logout: async () => {
                try {
                    if (config.isDev) {
                        console.log('👋 Cerrando sesión en:', buildApiUrl(config.auth.logoutUrl))
                    }
                    
                    await fetch(buildApiUrl(config.auth.logoutUrl), {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    
                    set({ 
                        user: null, 
                        isAuthenticated: false,
                    })
                    
                    if (config.isDev) {
                        console.log('✅ Sesión cerrada exitosamente')
                    }
                    
                } catch (error) {
                    console.error('Error al cerrar sesión:', error)
                    // Aún así, limpiar el estado local
                    set({ 
                        user: null, 
                        isAuthenticated: false,
                    })
                }
            }
        }),
        {
            name: 'celifrut-auth-storage',
            // Solo persistir datos básicos, no tokens sensibles
            partialize: (state) => ({ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated 
            })
        }
    )
)
