import { useState } from 'preact/hooks';
import type { preciosResponseType } from "../../types/responsesType";
import { Select } from "../UI/Select";
import { DateInput } from "../UI/DateInput";

type PreciosViewProps = {
    data: preciosResponseType | null;
}

export function PreciosView({ data }: PreciosViewProps) {
    const [selectedProveedor, setSelectedProveedor] = useState<string>("");
    const [selectedWeek, setSelectedWeek] = useState<string>("");

    // Transformar datos para el componente Select
    const proveedorOptions = (data?.user?.proveedorData || []).map(proveedor => ({
        value: proveedor._id,
        label: proveedor.PREDIO
    }));

    const handleProveedorChange = (value: string) => {
        setSelectedProveedor(value);
        console.log("Proveedor seleccionado:", value);
    };

    const handleWeekChange = (value: string) => {
        setSelectedWeek(value);
        console.log("Semana seleccionada:", value);
    };

    return (
        <div className="precios-view">
            <h1>Precios</h1>
            <div className="filters-section">
                <Select
                    options={proveedorOptions}
                    placeholder="Seleccionar Proveedor"
                    value={selectedProveedor}
                    onChange={handleProveedorChange}
                    name="proveedor"
                />
                
                <DateInput
                    placeholder="Seleccionar semana"
                    value={selectedWeek}
                    onChange={handleWeekChange}
                    name="semana"
                />
            </div>
            
            <div>
                
            </div>
        </div>
    );
}
