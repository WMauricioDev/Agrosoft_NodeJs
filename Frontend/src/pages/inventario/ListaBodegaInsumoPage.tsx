import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";
import { Insumo } from "@/types/inventario/Insumo";
import { useBodegaInsumos, useActualizarBodegaInsumo, useEliminarBodegaInsumo } from "@/hooks/inventario/useBodegaInsumo";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useInsumos } from "@/hooks/inventario/useInsumo";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from 'lucide-react';
import BodegaInsumoNotifications from "@/components/inventario/BodegaInsumoNotifications";
import { useAuth } from "@/context/AuthContext";

const ListaBodegaInsumoPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedBodegaInsumo, setSelectedBodegaInsumo] = useState<BodegaInsumo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: bodegas } = useBodegas();
  const { data: insumos } = useInsumos();
  const { data: bodegaInsumos, isLoading, refetch } = useBodegaInsumos();
  const updateMutation = useActualizarBodegaInsumo();
  const deleteMutation = useEliminarBodegaInsumo();
  const navigate = useNavigate();

  const columns = [
    { name: "Bodega", uid: "bodega" },
    { name: "Insumo", uid: "insumo" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (bodegaInsumo: BodegaInsumo) => {
    setSelectedBodegaInsumo({ ...bodegaInsumo });
    setIsEditModalOpen(true);
  };

  const handleDelete = (bodegaInsumo: BodegaInsumo) => {
    setSelectedBodegaInsumo(bodegaInsumo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBodegaInsumo && selectedBodegaInsumo.id !== undefined) {
      deleteMutation.mutate(selectedBodegaInsumo.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedBodegaInsumo(null);
          refetch();
        },
      });
    }
  };

  
  const transformedData = (bodegaInsumos ?? []).map((item: BodegaInsumo) => {
    const bodegaNombre = bodegas?.find((b: { id: number }) => b.id === item.bodega)?.nombre || "Desconocido";
    const insumoNombre = insumos?.find((i: Insumo) => i.id === item.insumo)?.nombre || "Desconocido";
    return {
      id: item.id?.toString() || "",
      bodega: bodegaNombre,
      insumo: insumoNombre,
      cantidad: item.cantidad,
      
      nombre: `${bodegaNombre} ${insumoNombre} ${item.cantidad}`, 
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
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Bodega Insumos</h2><br /><br />
      <div className="mb-2 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate("/inventario/bodegainsumo/")}
        >
          + Registrar
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <Tabla columns={columns} data={transformedData} />
      )}
      <BodegaInsumoNotifications userId1={user.id} />

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Bodega Insumo"
        onConfirm={() => {
          if (selectedBodegaInsumo && selectedBodegaInsumo.id !== undefined) {
            updateMutation.mutate(selectedBodegaInsumo, {
              onSuccess: () => {
                setIsEditModalOpen(false);
                refetch();
              },
            });
          }
        }}
      >
        {selectedBodegaInsumo && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bodega</label>
              <select
                name="bodega"
                value={selectedBodegaInsumo.bodega}
                onChange={(e) => setSelectedBodegaInsumo({ ...selectedBodegaInsumo, bodega: Number(e.target.value) })}
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
              <label className="block text-sm font-medium text-gray-700">Insumo</label>
              <select
                name="insumo"
                value={selectedBodegaInsumo.insumo}
                onChange={(e) => setSelectedBodegaInsumo({ ...selectedBodegaInsumo, insumo: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              >
                <option value="0">Seleccione un Insumo</option>
                {insumos?.map((insumo: Insumo) => (
                  <option key={insumo.id} value={insumo.id}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <ReuInput
              label="Cantidad"
              placeholder="Ingrese la cantidad"
              type="number"
              value={selectedBodegaInsumo.cantidad}
              onChange={(e) => setSelectedBodegaInsumo({ ...selectedBodegaInsumo, cantidad: Number(e.target.value) })}
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

export default ListaBodegaInsumoPage;