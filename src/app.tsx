import { useEffect, useState } from 'preact/hooks';
import { Login } from './pages/Login'
import './styles/global.css'
import Dashboard from './pages/Dashboard';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard />;
      case '/':
      case '/login':
      default:
        return <Login />;
    }
  };

  return renderPage();
}
