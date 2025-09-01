import '../styles/global.css'
import '../styles/login.css'
import { Logo } from '../components/UI/Logo.tsx'
import { useThemeStore } from '../stores/useThemeStore.ts'
import { useLocation } from 'preact-iso'

export function NotFound() {
    const { isDarkTheme, toggleTheme } = useThemeStore()
    const loc = useLocation()

    const handleGoHome = () => {
        loc.route('/dashboard', true)
    }

    const handleGoBack = () => {
        window.history.back()
    }

    return (
        <main className="login-container">
            {/* Botón de tema reutilizado del login */}
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

            <div className="login-card not-found-card">
                <div className="not-found-content">
                    {/* Logo de la empresa */}
                    <Logo />
                    
                    {/* Número 404 grande */}
                    <div className="error-code">
                        <span className="error-number">404</span>
                    </div>
                    
                    {/* Mensaje de error */}
                    <div className="error-message">
                        <h1>Página no encontrada</h1>
                        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
                    </div>

                    {/* Ilustración simple */}
                    <div className="error-illustration">
                        <svg viewBox="0 0 100 100" className="lost-icon">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" opacity="0.3"/>
                            <path d="M35 40 Q50 25 65 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                            <circle cx="40" cy="45" r="2" fill="currentColor"/>
                            <circle cx="60" cy="45" r="2" fill="currentColor"/>
                            <path d="M42 60 Q50 70 58 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="error-actions">
                        <button onClick={handleGoHome} className="primary-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                                <polyline points="9,22 9,12 15,12 15,22"/>
                            </svg>
                            Ir al Dashboard
                        </button>
                        <button onClick={handleGoBack} className="secondary-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5"/>
                                <polyline points="12,19 5,12 12,5"/>
                            </svg>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}