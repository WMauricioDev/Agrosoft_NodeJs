import React, { useState, useEffect } from "react";
import ReuModal from "@/components/globales/ReuModal";
import { useFacturaPDF } from "@/hooks/finanzas/useTiquete";
import { addToast } from "@heroui/react";

interface TiqueteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ventaId: number | null;
}

export const TiqueteModal: React.FC<TiqueteModalProps> = ({
  isOpen,
  onOpenChange,
  ventaId,
}) => {
  const { data: pdfBlob, isLoading, isError } = useFacturaPDF(ventaId || 0);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setObjectUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  const handlePrint = () => {
    if (!objectUrl) return;
    
    const printWindow = window.open(objectUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      addToast({
        title: "Error",
        description: "No se pudo abrir la ventana de impresión. Por favor, permite ventanas emergentes para este sitio."
      });
    }
  };

  const handleDownload = () => {
    if (!objectUrl || !pdfBlob) return;
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `tiquete_venta_${ventaId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Imprimir Tiquete"
      size="lg"
    >
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <p>Cargando tiquete...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-500">
            <p>Error al cargar el tiquete</p>
          </div>
        )}

        {objectUrl && (
          <div className="flex flex-col items-center">
            <iframe 
              src={objectUrl} 
              className="w-full h-96 border border-gray-300 mb-4"
              title="Vista previa del tiquete"
            />
            
            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Imprimir
              </button>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Descargar
              </button>
            </div>
          </div>
        )}
      </div>
    </ReuModal>
  );
};