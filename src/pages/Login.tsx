import '../styles/global.css'
import '../styles/login.css'
import { Logo } from '../components/UI/Logo.tsx'
import { useAuthStore } from '../stores/useAuthStore.ts'
import { useAppStore } from '../stores/useAppStore.ts'
import { useThemeStore } from '../stores/useThemeStore.ts'
import { useLocation } from 'preact-iso'

export function Login() {
    const { loginWithGoogle, loginWithMicrosoft } = useAuthStore()
    const isLoading = useAppStore(state => state.isLoading);
    const setLoading = useAppStore(state => state.setLoading);
    const { isDarkTheme, toggleTheme } = useThemeStore();
    const loc = useLocation();

    async function handleGoogleLogin() {
        if (isLoading) {
            console.log('⏳ Login en proceso, espere...')
            return
        }
        setLoading(true)

        try {
            console.log('🚀 Iniciando login con Google...')
            await loginWithGoogle()
            console.log('✅ Login exitoso!')
            loc.route('/dashboard', true)
        } catch (error: any) {
            console.error('❌ Error en login:', error)
            alert(error?.message || 'Error al iniciar sesión con Google')
        } finally {
            setLoading(false)
        }
    }

    async function handleMicrosoftLogin() {
        if (isLoading) {
            console.log('⏳ Login en proceso, espere...')
            return
        }
        setLoading(true)

        try {
            console.log('🚀 Iniciando login con Microsoft...')
            await loginWithMicrosoft()
            console.log('✅ Login exitoso!')
            loc.route('/dashboard', true)
        } catch (error: any) {
            console.error('❌ Error en login:', error)
            alert(error?.message || 'Error al iniciar sesión con Microsoft')
        } finally {
            setLoading(false)
        }
    }


    return (
        <main className="login-container">
            <button className="theme-toggle" aria-label="Cambiar tema" onClick={toggleTheme}>
                <svg
                    className="theme-icon sun-icon"
                    viewBox="0 0 24 24"
                    style={{ display: isDarkTheme ? 'none' : 'block' }}
                >
                    <path
                        fill="currentColor"
                        d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
                    />
                </svg>
                <svg
                    className="theme-icon moon-icon"
                    viewBox="0 0 24 24"
                    style={{ display: isDarkTheme ? 'block' : 'none' }}
                >
                    <path
                        fill="currentColor"
                        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    />
                </svg>
            </button>

            <div className="login-card">
                <Logo />

                <div className="social-login">
                    <h3>Inicia sesión con tu cuenta</h3>

                    <div className="social-buttons">
                        <button
                            className={`social-btn google-btn ${isLoading ? 'loading' : ''}`}
                            id="googleLoginBtn"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <svg className="social-icon" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Continuar con Google
                                </>
                            )}
                        </button>

                        <button
                            className={`social-btn microsoft-btn ${isLoading ? 'loading' : ''}`}
                            id="microsoftLoginBtn"
                            onClick={handleMicrosoftLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <svg className="social-icon" viewBox="0 0 24 24">
                                        <path fill="#f35325" d="M1 1h10v10H1z" />
                                        <path fill="#81bc06" d="M13 1h10v10H13z" />
                                        <path fill="#05a6f0" d="M1 13h10v10H1z" />
                                        <path fill="#ffba08" d="M13 13h10v10H13z" />
                                    </svg>
                                    Continuar con Microsoft
                                </>
                            )}
                        </button>
                    </div>

                </div>

                <div className="footer">
                    <p>&copy; 2025 Celifrut. Todos los derechos reservados.</p>
                </div>
            </div>
        </main>
    )
}
