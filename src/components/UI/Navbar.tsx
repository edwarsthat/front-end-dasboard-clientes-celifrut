import { useState } from 'preact/hooks'
import { useAuthStore } from '../../stores/useAuthStore'
import { Logo } from './Logo'
import { config } from '../../config/env'
import '../../styles/navbar.css'
import { useAppStore } from '../../stores/useAppStore'
import { useThemeStore } from '../../stores/useThemeStore'

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
    const { user, logout } = useAuthStore()
    const { isDarkTheme, toggleTheme } = useThemeStore()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const isLoading = useAppStore(state => state.isLoading)
    const handleLogout = async () => {
        try {
            await logout()
            setShowUserMenu(false)
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
    }

    return (
        <nav className={`navbar ${className}`}>
            <div className="navbar-container">
                <Logo />

                <div className="navbar-center">
                    <h1 className="app-title">Bienvenido</h1>
                </div>

                {/* Acciones del usuario */}
                <div className="navbar-actions">
                    {/* Botón de tema */}
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label="Cambiar tema"
                        title={isDarkTheme ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                    >
                        {isDarkTheme ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
                            </svg>
                        )}
                    </button>

                    {/* Información del usuario */}
                    {user && (
                        <div className="user-section">
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-email">{user.email}</span>
                            </div>

                            <div className="user-menu-wrapper">
                                <button
                                    className="user-avatar-btn"
                                    onClick={toggleUserMenu}
                                    aria-label="Menú de usuario"
                                >
                                    <img
                                        src={user.picture}
                                        alt={`Avatar de ${user.name}`}
                                        className="user-avatar"
                                    />
                                    <svg
                                        className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`}
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M7 10l5 5 5-5z" />
                                    </svg>
                                </button>

                                {showUserMenu && (
                                    <div className="user-dropdown">
                                        <div className="user-dropdown-header">
                                            <img
                                                src={user.picture}
                                                alt={`Avatar de ${user.name}`}
                                                className="dropdown-avatar"
                                            />
                                            <div className="dropdown-user-info">
                                                <span className="dropdown-name">{user.name}</span>
                                                <span className="dropdown-email">{user.email}</span>
                                            </div>
                                        </div>

                                        <hr className="dropdown-divider" />

                                        <div className="dropdown-actions">
                                            <a
                                                href={config.companyWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="dropdown-link"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                                Sitio Web Celifrut
                                            </a>

                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-logout-btn"
                                                disabled={isLoading}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                                </svg>
                                                {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mostrar botón de login si no hay usuario */}
                    {!user && (
                        <div className="auth-section">
                            <span className="auth-message">Inicia sesión para acceder al dashboard</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay para cerrar el menú */}
            {showUserMenu && (
                <div
                    className="menu-overlay"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </nav>
    )
}