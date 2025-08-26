
import Navbar from '../components/UI/Navbar'

export function Dashboard(){
    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="dashboard-container">
                <h1>Dashboard de Clientes - Celifrut</h1>
                <div className="dashboard-content">
                    <p>Bienvenido al panel de control</p>
                    {/* Aquí irá el contenido del dashboard */}
                </div>
            </main>
        </div>
    )
}

export default Dashboard