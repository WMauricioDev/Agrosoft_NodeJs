import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useVenta } from "@/hooks/finanzas/useVenta";
import { usePreciosProductos } from "@/hooks/inventario/usePrecio_Producto";
import { Venta, DetalleVenta } from "@/types/finanzas/Venta";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { Ticket } from 'lucide-react';
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { ModalUnidadMedida } from "@/components/cultivo/ModalUnidadMedida";
import { TiqueteModal } from "@/components/finanzas/TiqueteModal";

const ListaVentaPage: React.FC = () => {
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTiqueteModalOpen, setIsTiqueteModalOpen] = useState(false);
  const [openUnidadesMedidaModal, setOpenUnidadesMedidaModal] = useState(false);

  const { ventas, isLoading, actualizarVenta, eliminarVenta, isActualizando, isEliminando } = useVenta();
  const { isLoading: precioProductoLoading } = usePreciosProductos();
  const { isLoading: loadingUnidadesMedida } = useUnidadesMedida();
  const navigate = useNavigate();

  const columns = [
    { name: "Fecha", uid: "fecha" },
    { name: "Monto Entregado", uid: "monto_entregado" },
    { name: "Cambio", uid: "cambio" },
    { name: "Total", uid: "total" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleShowTicket = (venta: Venta) => {
    setSelectedVenta(venta);
    setIsTiqueteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVenta && selectedVenta.id !== undefined) {
      eliminarVenta(selectedVenta.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
      });
    }
  };

  const calcularTotalVenta = (detalles: DetalleVenta[] = []): number => {
    if (!Array.isArray(detalles)) return 0;

    return detalles.reduce((sum, item) => {
      const totalItem = parseFloat(item.total?.toString() || "0");
      return sum + (!isNaN(totalItem) ? totalItem : 0);
    }, 0);
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

const transformedData = (ventas ?? []).map((venta) => {
  const total = calcularTotalVenta(venta.detalles || []);

  const montoEntregadoNum = parseFloat(venta.monto_entregado?.toString() ?? "0");
  const cambioNum = parseFloat(venta.cambio?.toString() ?? "0");

  return {
    id: venta.id?.toString() || "",
    fecha: formatDate(venta.fecha),
    monto_entregado: `$${!isNaN(montoEntregadoNum) ? montoEntregadoNum.toFixed(2) : "0.00"} COP`,
    cambio: `$${!isNaN(cambioNum) ? cambioNum.toFixed(2) : "0.00"} COP`,
    total: `$${total.toFixed(2)} COP`,
    acciones: (
      <div className="flex gap-2">
        <button className="text-green-500 hover:text-green-700" onClick={() => handleShowTicket(venta)}>
          <Ticket size={20} color="black" />
        </button>
      </div>
    ),
  };
});


  return (
    <DefaultLayout>
      <ModalUnidadMedida 
        isOpen={openUnidadesMedidaModal} 
        onOpenChange={setOpenUnidadesMedidaModal} 
      />
      
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Ventas</h2>
      <div className="mb-6 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/finanzas/ventas/')}
        >
          + Registrar Venta
        </button>
      </div>
      
      {isLoading || precioProductoLoading || loadingUnidadesMedida ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <Tabla columns={columns} data={transformedData} />
      )}

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Venta"
        onConfirm={() => {
          if (selectedVenta && selectedVenta.id !== undefined) {
            actualizarVenta(
              { 
                ...selectedVenta, 
                cambio: selectedVenta.monto_entregado - calcularTotalVenta(selectedVenta.detalles)
              },
              {
                onSuccess: () => {
                  setIsEditModalOpen(false);
                },
              }
            );
          }
        }}
      >
        {selectedVenta && (
          <>
            <ReuInput
              label="Monto Entregado"
              placeholder="Ingrese el monto entregado"
              type="number"
              value={(selectedVenta.monto_entregado ?? "").toString()}
              onChange={(e) =>
                setSelectedVenta((prev) => ({
                  ...prev!,
                  monto_entregado: Number(e.target.value),
                }))
              }
            />

            <ReuInput
              label="Fecha"
              placeholder="Seleccione la fecha"
              type="date"
              value={selectedVenta.fecha ?? ""}
              onChange={(e) =>
                setSelectedVenta((prev) => ({
                  ...prev!,
                  fecha: e.target.value,
                }))
              }
            />

            {isActualizando && <p className="text-gray-600 mt-2">Actualizando...</p>}
          </>
        )}
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este registro?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
        {isEliminando && <p className="text-gray-600 mt-2">Eliminando...</p>}
      </ReuModal>

      <TiqueteModal
        isOpen={isTiqueteModalOpen}
        onOpenChange={setIsTiqueteModalOpen}
        ventaId={selectedVenta?.id || null}
      />
    </DefaultLayout>
  );
};

export default ListaVentaPage;