import { useState } from 'preact/hooks';
import type { preciosResponseType } from "../../types/responsesType";
import { Select } from "../UI/Select";
import { DateInput } from "../UI/DateInput";
import type { precioProveedorType } from '../../types/preciosTypes';

type PreciosViewProps = {
    data: preciosResponseType | null;
}

export function PreciosView({ data }: PreciosViewProps) {
    const [selectedProveedor, setSelectedProveedor] = useState<string>("");
    const [selectedTipoFruta, setSelectedTipoFruta] = useState<string>("");
    const [selectedWeek, setSelectedWeek] = useState<string>("");
    const [precioSeleccionado, setPrecioSeleccionado] = useState<precioProveedorType | null>(null);

    // Transformar datos para el componente Select
    const proveedorOptions = (data?.user?.proveedorData || []).map(proveedor => ({
        value: proveedor._id,
        label: proveedor.PREDIO
    }));
    const tipoFrutasOptions = (data?.tiposFruta || []).map(tipoFruta => ({
        value: tipoFruta._id,
        label: tipoFruta.tipoFruta
    }));

    const handleProveedorChange = (value: string) => {
        setSelectedProveedor(value);
    };

    const handleWeekChange = (value: string) => {
        setSelectedWeek(value);
    };

    const handleBuscar = () => {
        if (selectedProveedor === '') return alert("Por favor, selecciona un proveedor.");
        if (selectedWeek === '') return alert("Por favor, selecciona una semana.");
        if (selectedTipoFruta === '') return alert("Por favor, selecciona un tipo de fruta.");

        const [year, semana] = selectedWeek.split("-W");

        const proveedor = data?.user.proveedorData.find(p => p._id === selectedProveedor);
        if (!proveedor) {
            console.warn("No hay precios disponibles para el proveedor seleccionado.");
            return;
        }

        const preciosProveedor = data?.user.preciosData.filter(precio => precio.predios.includes(proveedor._id))

        if (!preciosProveedor || preciosProveedor.length === 0) {
            console.warn("No hay precios disponibles para la semana seleccionada.");
            return;
        }

        const precioSemana = preciosProveedor.filter(precio => precio.week === parseInt(semana) && precio.year === parseInt(year));
        if (precioSemana.length === 0) {
            console.warn("No hay precios disponibles para la semana seleccionada.");
            return;
        }
        console.log(precioSemana);
        console.log("selectedTipoFruta", selectedTipoFruta);

        const precioTipoFrutaSemana = precioSemana.find(precio => precio.tipoFruta === selectedTipoFruta);
        if (!precioTipoFrutaSemana) {
            alert("No hay precios disponibles para el tipo de fruta seleccionada.");
            return;
        }

        setPrecioSeleccionado(precioTipoFrutaSemana);
    }

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

                <Select
                    options={tipoFrutasOptions}
                    placeholder="Seleccionar tipo de fruta"
                    value={selectedTipoFruta}
                    onChange={setSelectedTipoFruta}
                    name="tipoFruta"
                />

                <DateInput
                    placeholder="Seleccionar semana"
                    value={selectedWeek}
                    onChange={handleWeekChange}
                    name="semana"
                />

                <button className="search-button" type="button" onClick={handleBuscar}>
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    Buscar
                </button>
            </div>

            <div className="precios-content">
                {precioSeleccionado ? (
                    <div className="precios-results">
                        <div className="precios-header">
                            <h3>Precios de la Semana {precioSeleccionado.week}/{precioSeleccionado.year}</h3>
                            <div className="proveedor-info">
                                <span className="proveedor-name">
                                    {data?.user.proveedorData.find(p => p._id === selectedProveedor)?.PREDIO}
                                </span>
                            </div>
                        </div>

                        <div className="precios-grid">
                            {/* Sección de Exportación */}
                            <div className="precio-category-card exportacion">
                                <div className="category-header">
                                    <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-speedboat"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M2 17h14.4a3 3 0 0 0 2.5 -1.34l3.1 -4.66h-6.23a4 4 0 0 0 -1.49 .29l-3.56 1.42a4 4 0 0 1 -1.49 .29h-5.73z" /><path d="M6 13l1.5 -5" /><path d="M6 8h8l2 3" /></svg>
                                    </svg>
                                    <h4>Exportación</h4>
                                </div>
                                <div className="precios-list">
                                    {Object.entries(precioSeleccionado.exportacion).map(([categoria, precio]) => (
                                        <div key={categoria} className="precio-item">
                                            <span className="categoria-name">{categoria}</span>
                                            <span className="precio-value">
                                                ${precio?.toLocaleString() || 'N/A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sección de Descarte */}
                            <div className="precio-category-card descarte">
                                <div className="category-header">
                                    <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-recycle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17l-2 2l2 2" /><path d="M10 19h9a2 2 0 0 0 1.75 -2.75l-.55 -1" /><path d="M8.536 11l-.732 -2.732l-2.732 .732" /><path d="M7.804 8.268l-4.5 7.794a2 2 0 0 0 1.506 2.89l1.141 .024" /><path d="M15.464 11l2.732 .732l.732 -2.732" /><path d="M18.196 11.732l-4.5 -7.794a2 2 0 0 0 -3.256 -.14l-.591 .976" /></svg>
                                    </svg>
                                    <h4>Descarte</h4>
                                </div>
                                <div className="precios-list">
                                    <div className="precio-item featured">
                                        <span className="categoria-name">Descarte</span>
                                        <span className="precio-value">
                                            ${precioSeleccionado.descarte?.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sección de Fruta Nacional */}
                            <div className="precio-category-card nacional">
                                <div className="category-header">
                                    <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" /></svg>
                                    </svg>
                                    <h4>Fruta Nacional</h4>
                                </div>
                                <div className="precios-list">
                                    <div className="precio-item featured">
                                        <span className="categoria-name">Nacional</span>
                                        <span className="precio-value">
                                            ${precioSeleccionado.frutaNacional?.toLocaleString() || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="precios-summary">
                            <div className="summary-item">
                                <span className="summary-label">Total categorías de exportación:</span>
                                <span className="summary-value">
                                    {Object.keys(precioSeleccionado.exportacion).length}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Fecha de actualización:</span>
                                <span className="summary-value">
                                    Semana {precioSeleccionado.week} del {precioSeleccionado.year}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-data-message">
                        <div className="no-data-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <h3>Selecciona un proveedor y semana</h3>
                        <p>Utiliza los filtros de arriba para buscar los precios disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
}
