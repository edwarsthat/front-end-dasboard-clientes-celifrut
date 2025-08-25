import { Login } from './pages/Login'
import './styles/global.css'
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'preact/hooks';

export function App() {
  const { isAuthenticated } = useAuthStore()
  useEffect(() => {
    // Aquí puedes agregar lógica que dependa de isAuthenticated
    console.log('🔄 Estado de autenticación cambiado:', isAuthenticated)
  }, [isAuthenticated])


  return (
    <div>
      {isAuthenticated ? <Dashboard /> : <Login />}
      {/* <Login /> */}
    </div>
  )
}
