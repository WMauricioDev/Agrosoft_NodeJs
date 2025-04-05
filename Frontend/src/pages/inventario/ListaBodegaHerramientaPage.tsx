import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaHerramienta } from "@/types/inventario/BodegaHerramienta";
import { useBodegaHerramienta, useActualizarBodegaHerramienta, useEliminarBodegaHerramienta } from "@/hooks/inventario/useBodegaHerramienta";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useHerramientas } from "@/hooks/inventario/useHerramientas";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from 'lucide-react';
import BodegaHerramientaNotifications from "@/components/inventario/BodegaHerramientaNotifications";
import { useAuth } from "@/context/AuthContext";

const ListaBodegaHerramientaPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedBodegaHerramienta, setSelectedBodegaHerramienta] = useState<BodegaHerramienta | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: bodegas } = useBodegas();
  const { data: herramientas } = useHerramientas();
  const { data: bodegaHerramientas, isLoading, refetch } = useBodegaHerramienta();
  const updateMutation = useActualizarBodegaHerramienta();
  const deleteMutation = useEliminarBodegaHerramienta();
  const navigate = useNavigate();

  const columns = [
    { name: "Bodega", uid: "bodega" },
    { name: "Herramienta", uid: "herramienta" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (bodegaHerramienta: BodegaHerramienta) => {
    setSelectedBodegaHerramienta({ ...bodegaHerramienta });
    setIsEditModalOpen(true);
  };

  const handleDelete = (bodegaHerramienta: BodegaHerramienta) => {
    setSelectedBodegaHerramienta(bodegaHerramienta);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBodegaHerramienta && selectedBodegaHerramienta.id !== undefined) {
      deleteMutation.mutate(selectedBodegaHerramienta.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedBodegaHerramienta(null);
          refetch();
        },
      });
    }
  };


  const transformedData = (bodegaHerramientas ?? []).map((item: BodegaHerramienta) => {
    const bodegaNombre = bodegas?.find((b: { id: number }) => b.id === item.bodega)?.nombre || "Desconocido";
    const herramientaNombre = herramientas?.find((h: { id: number }) => h.id === item.herramienta)?.nombre || "Desconocido";
    return {
      id: item.id?.toString() || "",
      bodega: bodegaNombre,
      herramienta: herramientaNombre,
      cantidad: item.cantidad,
      nombre: `${bodegaNombre} ${herramientaNombre} ${item.cantidad}`,
      acciones: (
        <>
          <button
            className="text-green-500 hover:underline mr-2"
            onClick={() => handleEdit(item)}
          >
            <EditIcon size={22} color="black" />
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleDelete(item)}
          >
            <Trash2 size={22} color="red" />
          </button>
        </>
      ),
    };
  });

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Bodega Herramientas</h2><br /><br />
      <div className="mb-2 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate("/inventario/bodegaherramienta/")}
        >
          + Registrar
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : !bodegaHerramientas || bodegaHerramientas.length === 0 ? (
        <p className="text-gray-600">No hay datos disponibles.</p>
      ) : (
        <Tabla columns={columns} data={transformedData} />
      )}
      <BodegaHerramientaNotifications userId3={user.id} />

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Bodega Herramienta"
        onConfirm={() => {
          if (selectedBodegaHerramienta && selectedBodegaHerramienta.id !== undefined) {
            updateMutation.mutate(selectedBodegaHerramienta, {
              onSuccess: () => {
                setIsEditModalOpen(false);
                refetch();
              },
            });
          }
        }}
      >
        {selectedBodegaHerramienta && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bodega</label>
              <select
                name="bodega"
                value={selectedBodegaHerramienta.bodega}
                onChange={(e) => setSelectedBodegaHerramienta({ ...selectedBodegaHerramienta, bodega: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                <option value="0">Seleccione una Bodega</option>
                {bodegas?.map((bodega: { id: number; nombre: string }) => (
                  <option key={bodega.id} value={bodega.id}>
                    {bodega.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Herramienta</label>
              <select
                name="herramienta"
                value={selectedBodegaHerramienta.herramienta}
                onChange={(e) => setSelectedBodegaHerramienta({ ...selectedBodegaHerramienta, herramienta: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                <option value="0">Seleccione una Herramienta</option>
                {herramientas?.map((herramienta: { id: number; nombre: string }) => (
                  <option key={herramienta.id} value={herramienta.id}>
                    {herramienta.nombre}
                  </option>
                ))}
              </select>
            </div>
            <ReuInput
              label="Cantidad"
              placeholder="Ingrese la cantidad"
              type="number"
              value={selectedBodegaHerramienta.cantidad}
              onChange={(e) => setSelectedBodegaHerramienta({ ...selectedBodegaHerramienta, cantidad: Number(e.target.value) })}
            />
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
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaBodegaHerramientaPage;