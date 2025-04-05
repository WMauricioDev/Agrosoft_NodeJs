import { useState } from "react";
import { useReporte } from "@/hooks/reportes/useReporte";
import { opcionesModulos, reportesPorModulo } from "@/types/reportes/reportes";
import DefaultLayout from "@/layouts/default";

export default function Reportes() {
    const [modulo, setModulo] = useState("");
    const [reporte, setReporte] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const { data: pdf, isLoading, error } = useReporte(modulo, reporte, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
    });

    const descargarPDF = () => {
        if (pdf) {
            const url = window.URL.createObjectURL(pdf);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_${modulo}_${reporte}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <DefaultLayout>
            <div className="w-full flex flex-col items-center min-h-screen p-fF">
                <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Generar Reporte</h1>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Módulo:</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                    setModulo(e.target.value);
                                    setReporte("");
                                }}
                                value={modulo}
                            >
                                <option value="">Selecciona un módulo...</option>
                                {opcionesModulos.map((opcion) => (
                                    <option key={opcion.modulo} value={opcion.modulo}>
                                        {opcion.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {modulo && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reporte:</label>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setReporte(e.target.value)} 
                                    value={reporte}
                                >
                                    <option value="">Selecciona un reporte...</option>
                                    {reportesPorModulo[modulo]?.map((opcion) => (
                                        <option key={opcion.reporte} value={opcion.reporte}>
                                            {opcion.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio:</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={fechaInicio} 
                                    onChange={(e) => setFechaInicio(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin:</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={fechaFin} 
                                    onChange={(e) => setFechaFin(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={descargarPDF} 
                                disabled={isLoading || !pdf || !modulo || !reporte}
                                className={`w-full px-4 py-2 rounded-lg font-medium ${(isLoading || !pdf || !modulo || !reporte) 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generando...
                                    </span>
                                ) : "Descargar PDF"}
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                Error al generar el reporte: {error.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}