// src/routes/ProtectedRoute.tsx
import { Route, useLocation } from 'preact-iso';
import { useEffect } from 'preact/hooks';
import { useAuthStore } from '../stores/useAuthStore';

type Props = {
    path: string;
    component: any; // puedes afinar el tipo si tienes los tipos de tus páginas
};

export default function ProtectedRoute({ path, component }: Props) {
    const { isAuthenticated } = useAuthStore();
    const loc = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            // sin sesión → de vuelta al login
            loc.route('/', true);
        }
    }, [isAuthenticated, loc]);

    // Importante: devolver null si no hay sesión para no romper el <Router>
    return isAuthenticated ? <Route path={path} component={component} /> : null;
}
