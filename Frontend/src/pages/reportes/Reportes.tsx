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
            <div className="w-full flex flex-col items-center min-h-screen py-12">
                <div className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generador de Reportes</h1>
                        <p className="text-gray-600">Seleccione los parámetros para generar su reporte</p>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Selección de Reporte</h2>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Módulo:</label>
                                    <select
                                        className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onChange={(e) => {
                                            setModulo(e.target.value);
                                            setReporte("");
                                        }}
                                        value={modulo}
                                    >
                                        <option value="">Seleccione un módulo...</option>
                                        {opcionesModulos.map((opcion) => (
                                            <option key={opcion.modulo} value={opcion.modulo}>
                                                {opcion.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {modulo && (
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-2">Tipo de Reporte:</label>
                                        <select 
                                            className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onChange={(e) => setReporte(e.target.value)} 
                                            value={reporte}
                                        >
                                            <option value="">Seleccione un reporte...</option>
                                            {reportesPorModulo[modulo]?.map((opcion) => (
                                                <option key={opcion.reporte} value={opcion.reporte}>
                                                    {opcion.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rango de Fechas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Fecha Inicio:</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={fechaInicio} 
                                        onChange={(e) => setFechaInicio(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">Fecha Fin:</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={fechaFin} 
                                        onChange={(e) => setFechaFin(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                onClick={descargarPDF} 
                                disabled={isLoading || !pdf || !modulo || !reporte}
                                className={`w-full px-6 py-4 rounded-xl font-semibold text-lg ${(isLoading || !pdf || !modulo || !reporte) 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green  -700 text-white shadow-md hover:shadow-lg transition-all duration-200'}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Generando Reporte...</span>
                                    </span>
                                ) : "Descargar Reporte"}
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <h3 className="font-medium">Error al generar el reporte</h3>
                                </div>
                                <p className="mt-2 text-sm">{error.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}