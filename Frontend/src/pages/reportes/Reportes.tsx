import { useState, useEffect } from "react";
import { useReporte } from "@/hooks/reportes/useReporte";
import { opcionesModulos, reportesPorModulo } from "@/types/reportes/reportes";
import DefaultLayout from "@/layouts/default";
import ReuModal from "@/components/globales/ReuModal";

export default function Reportes() {
    const [modulo, setModulo] = useState("");
    const [reporte, setReporte] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);

    const { data: pdf, isLoading, error, refetch } = useReporte(modulo, reporte, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
    });

    useEffect(() => {
        if (pdf) {
            const url = window.URL.createObjectURL(pdf);
            setPdfUrl(url);
            return () => window.URL.revokeObjectURL(url);
        } else {
            setPdfUrl(null);
        }
    }, [pdf]);

    const descargarPDF = () => {
        if (pdfUrl) {
            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = `reporte_${modulo}_${reporte}_${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const generarReporte = () => {
        if (modulo && reporte && fechaInicio && fechaFin) {
            refetch().then(() => {
                setIsModalOpen(true);
            });
        }
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 10, 200));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 10, 50));
    };

    return (
        <DefaultLayout>
            <div className="w-full flex flex-col items-center min-h-screen p-4">
                <div className="w-full max-w-4xl bg-white p-12 rounded-xl shadow-lg border border-gray-100">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Generar Reporte</h1>
                        <p className="text-gray-600">Selecciona los parámetros para generar tu reporte</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Módulo</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => {
                                        setModulo(e.target.value);
                                        setReporte("");
                                        setPdfUrl(null);
                                    }}
                                    value={modulo}
                                >
                                    <option value="">Seleccionar módulo...</option>
                                    {opcionesModulos.map((opcion) => (
                                        <option key={opcion.modulo} value={opcion.modulo}>
                                            {opcion.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {modulo && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reporte</label>
                                    <select 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        onChange={(e) => {
                                            setReporte(e.target.value);
                                            setPdfUrl(null);
                                        }} 
                                        value={reporte}
                                    >
                                        <option value="">Seleccionar reporte...</option>
                                        {reportesPorModulo[modulo]?.map((opcion) => (
                                            <option key={opcion.reporte} value={opcion.reporte}>
                                                {opcion.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Inicio</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={fechaInicio} 
                                    onChange={(e) => {
                                        setFechaInicio(e.target.value);
                                        setPdfUrl(null);
                                    }} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Fin</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={fechaFin} 
                                    onChange={(e) => {
                                        setFechaFin(e.target.value);
                                        setPdfUrl(null);
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={generarReporte} 
                                    disabled={isLoading || !modulo || !reporte || !fechaInicio || !fechaFin}
                                    className={`px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center transition-all ${(isLoading || !modulo || !reporte || !fechaInicio || !fechaFin) 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'}`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generando...
                                        </span>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                            Generar Reporte
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={descargarPDF} 
                                    disabled={isLoading || !pdfUrl}
                                    className={`px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center transition-all ${(isLoading || !pdfUrl) 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Descargar PDF
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Error al generar el reporte:</span>
                                </div>
                                <p className="mt-1 ml-7">{error.message}</p>
                            </div>
                        )}
                    </div>
                </div>

                <ReuModal
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    title={`Vista previa: ${reportesPorModulo[modulo]?.find(r => r.reporte === reporte)?.nombre}`}
                    onConfirm={descargarPDF}
                    size="5xl" 
                    confirmText="Descargar"
                    cancelText="Cerrar"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                            <button 
                                onClick={handleZoomOut}
                                className="px-3 py-2 text-gray-700 hover:bg-gray-200 transition-colors"
                                disabled={zoomLevel <= 50}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <span className="px-3 py-2 text-sm font-medium bg-white">{zoomLevel}%</span>
                            <button 
                                onClick={handleZoomIn}
                                className="px-3 py-2 text-gray-700 hover:bg-gray-200 transition-colors"
                                disabled={zoomLevel >= 200}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <iframe 
                            src={pdfUrl || ""} 
                            width={`${zoomLevel}%`}
                            height="600px"
                            className="border-0 mx-auto block"
                            title="Vista previa del PDF"
                        />
                    </div>
                </ReuModal>
            </div>
        </DefaultLayout>
    );
}   