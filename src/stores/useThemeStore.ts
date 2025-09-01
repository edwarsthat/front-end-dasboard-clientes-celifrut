import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface themeStore {
    isDarkTheme: boolean
    theme: 'light' | 'dark'
    toggleTheme: () => void
    setTheme: (theme: 'light' | 'dark') => void
    initializeTheme: () => void
}


export const useThemeStore = create<themeStore>()(
    persist(
        (set, get) => ({
            isDarkTheme: false,
            theme: 'light',

            // Inicializar tema basado en preferencias del sistema
            initializeTheme: () => {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
                const shouldUseDark = get().isDarkTheme || prefersDark

                set({
                    isDarkTheme: shouldUseDark,
                    theme: shouldUseDark ? 'dark' : 'light'
                })

                document.documentElement.classList.toggle("dark-theme", shouldUseDark)
            },

            // Alternar entre temas
            toggleTheme: () => {
                const newTheme = !get().isDarkTheme

                set({
                    isDarkTheme: newTheme,
                    theme: newTheme ? 'dark' : 'light'
                })

                document.documentElement.classList.toggle("dark-theme", newTheme)
            },

            // Establecer tema específico
            setTheme: (theme: 'light' | 'dark') => {
                const isDark = theme === 'dark'

                set({
                    isDarkTheme: isDark,
                    theme
                })

                document.documentElement.classList.toggle("dark-theme", isDark)
            }

        }),
        {
            name: "celifrut-ui",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
