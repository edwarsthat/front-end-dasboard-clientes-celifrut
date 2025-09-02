
import { useEffect, useState } from 'preact/hooks';
import Navbar from '../components/UI/Navbar'
import '../styles/dashboard.css'
import { PreciosView } from '../components/dashboard/PreciosView';
import { dashboardApi } from '../services/api';
import type { preciosResponseType } from '../types/responsesType';

export function Dashboard(){
    const [activeButton, setActiveButton] = useState('');
    const [data, setData] = useState<preciosResponseType | null>(null);
    useEffect(() => {
        const fetchData  = async () => {
            try {
                console.log
                const data = await dashboardApi.getPrecios();
                if(!data.success){
                    throw new Error('Error al obtener los precios: ' + JSON.stringify(data));
                }
                console.log(data);
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    },[])
    return (
        <div className="dashboard-page">
            <Navbar />
            <main className="dashboard-container">
                <h1 style={{color:"white"}}>Dashboard de Proveedores - Celifrut</h1>
                
                {/* Botones de navegación */}
                <div className="navigation-buttons">
                    <button className="nav-button active" onClick={() => setActiveButton('precios')}>
                        Precios
                    </button>
                    {/* Separador para futuros botones */}
                    <div className="nav-separator"></div>
                    {/* Futuros botones podrían ir aquí */}
                    {/* <button className="nav-button active">
                        Rendimiento
                    </button> */}
                    
                    {/* Barrita indicadora */}
                    <div className="navigation-indicator precios"></div>
                </div>

                <div className="dashboard-content">
                    {activeButton === '' && (<p>Bienvenido al panel de control</p>)}
                    {activeButton === 'precios' && (<PreciosView  data={data}/>)}
                </div>
            </main>
        </div>
    )
}

export default Dashboard