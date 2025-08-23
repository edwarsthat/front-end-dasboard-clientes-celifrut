import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { config, buildApiUrl } from '../config/env'

interface User {
    id: string
    email: string
    name: string
    picture: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: User | null) => void
    checkAuth: () => Promise<boolean>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: (user: User | null) => {
                set({ 
                    user, 
                    isAuthenticated: !!user,
                    isLoading: false 
                })
            },

            checkAuth: async (): Promise<boolean> => {
                try {
                    set({ isLoading: true })
                    
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
                            isLoading: false 
                        })
                        
                        if (config.isDev) {
                            console.log('✅ Usuario autenticado:', data.user)
                        }
                        
                        return true
                    } else {
                        set({ 
                            user: null, 
                            isAuthenticated: false,
                            isLoading: false 
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
                        isLoading: false 
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
                        isLoading: false 
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
                        isLoading: false 
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
