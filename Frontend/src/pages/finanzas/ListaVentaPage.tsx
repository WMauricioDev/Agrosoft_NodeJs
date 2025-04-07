import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useVenta } from "@/hooks/finanzas/useVenta";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { Venta } from "@/types/finanzas/Venta";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";

const ListaVentaPage: React.FC = () => {
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { ventas, isLoading, actualizarVenta, eliminarVenta, isActualizando, isEliminando } = useVenta();
  const { data: cultivos, isLoading: cultivosLoading } = useCultivos();
  const navigate = useNavigate();

  const columns = [
    { name: "Producto", uid: "producto" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Precio Unitario", uid: "precio" },
    { name: "Total", uid: "total" },
    { name: "Fecha", uid: "fecha" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (venta: Venta) => {
    setSelectedVenta(venta);
    setIsEditModalOpen(true);
  };

  const handleDelete = (venta: Venta) => {
    setSelectedVenta(venta);
    setIsDeleteModalOpen(true);
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

  const transformedData = (ventas ?? []).map((venta) => ({
    id: venta.id?.toString() || "",
    producto: cultivos?.find((c) => c.id === venta.producto_id)?.nombre || "Desconocido",
    cantidad: venta.cantidad,
    precio: venta.precio,
    total: venta.total,
    fecha: venta.fecha,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(venta)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(venta)}
        >
          Eliminar
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Ventas</h2>
          {isLoading || cultivosLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Tabla columns={columns} data={transformedData} />
              <div className="flex justify-end mt-4">
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => navigate("/finanzas/ventas/")}
                >
                  Registrar Venta
                </button>
              </div>
            </>
          )}
        </div>

        <ReuModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title="Editar Venta"
          onConfirm={() => {
            if (selectedVenta && selectedVenta.id !== undefined) {
              actualizarVenta(
                { ...selectedVenta, total: selectedVenta.cantidad * selectedVenta.precio },
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
              <label className="block text-sm font-medium text-gray-700 mt-4">Producto</label>
              <select
                name="producto"
                value={selectedVenta.producto_id}
                onChange={(e) =>
                  setSelectedVenta((prev) => ({
                    ...prev!,
                    producto: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={cultivosLoading}
              >
                <option value="0">Seleccione un producto</option>
                {cultivos?.map((cultivo) => (
                  <option key={cultivo.id} value={cultivo.id}>
                    {cultivo.nombre}
                  </option>
                ))}
              </select>
              <ReuInput
                label="Cantidad"
                placeholder="Ingrese la cantidad"
                type="number"
                value={selectedVenta.cantidad.toString()}
                onChange={(e) =>
                  setSelectedVenta((prev) => ({
                    ...prev!,
                    cantidad: Number(e.target.value),
                  }))
                }
              />
              <ReuInput
                label="Precio Unitario"
                placeholder="Ingrese el precio unitario"
                type="number"
                value={selectedVenta.precio.toString()}
                onChange={(e) =>
                  setSelectedVenta((prev) => ({
                    ...prev!,
                    precio: Number(e.target.value),
                  }))
                }
              />
              <ReuInput
                label="Fecha"
                placeholder="Seleccione la fecha"
                type="date"
                value={selectedVenta.fecha}
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
      </div>
    </DefaultLayout>
  );
};

export default ListaVentaPage;