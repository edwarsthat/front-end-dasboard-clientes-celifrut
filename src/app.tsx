import { Login } from './pages/Login'
import { LocationProvider, Router, Route, ErrorBoundary, useLocation } from 'preact-iso';
import './styles/global.css'
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'preact/hooks';
import ProtectedRoute from './routes/ProtectedRoutes';
import { NotFound } from './pages/NotFound';

export function App() {
  const { isAuthenticated } = useAuthStore();
  const loc = useLocation();

  useEffect(() => {
    // Ya logueado en "/", redirige a dashboard
    if (isAuthenticated && loc.url === '/') {
      loc.route('/dashboard', true);
    }
  }, [isAuthenticated, loc]);

  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={Login} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route default component={NotFound} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  )
}
