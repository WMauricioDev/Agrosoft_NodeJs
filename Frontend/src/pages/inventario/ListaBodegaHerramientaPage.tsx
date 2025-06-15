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
import { useAuth } from "@/context/AuthContext";

const formatCOPNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value;
    if (isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseCOPNumber = (value: string): number => {
    const cleanValue = value.replace(/[\.$]/g, '');
    return parseInt(cleanValue, 10) || 0;
};

const ListaBodegaHerramientaPage: React.FC = () => {
  const {} = useAuth();
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
    { name: "Costo Total", uid: "costo_total" },
    { name: "Cantidad Prestada", uid: "cantidad_prestada" },
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
    
    const costoTotal = item.costo_total != null ? Number(item.costo_total) : 0;
    const costoTotalFormatted = isNaN(costoTotal) ? "0" : formatCOPNumber(costoTotal);

    return {
      id: item.id?.toString() || "",
      bodega: bodegaNombre,
      herramienta: herramientaNombre,
      cantidad: item.cantidad,
      costo_total: `$${costoTotalFormatted}`,
      cantidad_prestada: item.cantidad_prestada,
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
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Bodega Herramientas</h2>
      <br />
      <br />
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
      ) : (
        <Tabla columns={columns} data={transformedData} />
      )}

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
            <ReuInput
              label="Cantidad Prestada"
              placeholder="Ingrese la cantidad prestada"
              type="number"
              value={selectedBodegaHerramienta.cantidad_prestada}
              onChange={(e) => setSelectedBodegaHerramienta({ ...selectedBodegaHerramienta, cantidad_prestada: Number(e.target.value) })}
            />
            <ReuInput
              label="Costo Total"
              placeholder="Ej. $1.000"
              type="text"
              value={
                selectedBodegaHerramienta.costo_total != null
                  ? `$${formatCOPNumber(selectedBodegaHerramienta.costo_total)}`
                  : "$0"
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/^\$/, '');
                setSelectedBodegaHerramienta({
                  ...selectedBodegaHerramienta,
                  costo_total: parseCOPNumber(rawValue),
                });
              }}
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