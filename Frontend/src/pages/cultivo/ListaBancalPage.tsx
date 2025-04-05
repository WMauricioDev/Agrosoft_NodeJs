  import React, { useState } from "react";
  import DefaultLayout from "@/layouts/default";
  import { ReuInput } from "@/components/globales/ReuInput";
  import { useBancales, useActualizarBancal, useEliminarBancal } from "@/hooks/cultivo/usebancal";
  import { useLotes } from "@/hooks/cultivo/uselotes";
  import ReuModal from "@/components/globales/ReuModal";
  import Tabla from "@/components/globales/Tabla";
  import { useNavigate } from "react-router-dom";
  import { EditIcon, Trash2 } from 'lucide-react';

  const ListaBancalPage: React.FC = () => {
    const [selectedBancal, setSelectedBancal] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: bancales, isLoading, refetch } = useBancales();
    const { data: lotes } = useLotes();
    const actualizarMutation = useActualizarBancal();
    const eliminarMutation = useEliminarBancal();
    const navigate = useNavigate();

    const columns = [
      { name: "Nombre", uid: "nombre" },
      { name: "Tamaño X", uid: "TamX" },
      { name: "Tamaño Y", uid: "TamY" },
      { name: "Posición X", uid: "posX" },
      { name: "Posición Y", uid: "posY" },
      { name: "Lote", uid: "fk_lote" },
      { name: "Acciones", uid: "acciones" },
    ];

    const handleEdit = (bancal: any) => {
      setSelectedBancal(bancal);
      setIsEditModalOpen(true);
    };

    const handleDelete = (bancal: any) => {
      setSelectedBancal(bancal);
      setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
      if (selectedBancal && selectedBancal.id !== undefined) {
        eliminarMutation.mutate(selectedBancal.id, {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            refetch();
          },
        });
      }
    };

    const transformedData = (bancales ?? []).map((bancal) => ({
      id: bancal.id?.toString() || '',
      nombre: bancal.nombre,
      TamX: bancal.TamX,
      TamY: bancal.TamY,
      posX: bancal.posX,
      posY: bancal.posY,
      fk_lote: lotes?.find((lote) => lote.id === bancal.fk_lote)?.nombre || 'Sin lote',
      acciones: (
        <>
          <button
            className="text-green-500 hover:underline mr-2"
            onClick={() => handleEdit(bancal)}
          >
           <EditIcon size={22} color='black'/>
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleDelete(bancal)}
          >
            <Trash2   size={22} color='red'/>
          </button>
        </>
      ),
    }));

    return (
      <DefaultLayout>
            <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Bancales</h2>
            <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/bancal/')} 
                        >
                        + Registrar
                        </button>
            </div>
            {isLoading ? (
              <p className="text-gray-600">Cargando...</p>
            ) : (
              <>
                <Tabla columns={columns} data={transformedData} />
              </>
            )}

        <ReuModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title="Editar Bancal"
          onConfirm={() => {
            if (selectedBancal && selectedBancal.id !== undefined) {
              actualizarMutation.mutate(
                { id: selectedBancal.id, bancal: selectedBancal },
                {
                  onSuccess: () => {
                    setIsEditModalOpen(false);
                    refetch();
                  },
                }
              );
            }
          }}
        >
          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={selectedBancal?.nombre || ''}
            onChange={(e) =>
              setSelectedBancal((prev: any) => ({
                ...prev,
                nombre: e.target.value,
              }))
            }
          />
          <ReuInput
            label="Tamaño X"
            placeholder="Ingrese tamaño X"
            type="number"
            value={selectedBancal?.TamX || 0}
            onChange={(e) =>
              setSelectedBancal((prev: any) => ({
                ...prev,
                TamX: parseFloat(e.target.value),
              }))
            }
          />
          <ReuInput
            label="Tamaño Y"
            placeholder="Ingrese tamaño Y"
            type="number"
            value={selectedBancal?.TamY || 0}
            onChange={(e) =>
              setSelectedBancal((prev: any) => ({
                ...prev,
                TamY: parseFloat(e.target.value),
              }))
            }
          />
          <ReuInput
            label="Posición X"
            placeholder="Ingrese posición X"
            type="number"
            value={selectedBancal?.posX || 0}
            onChange={(e) =>
              setSelectedBancal((prev: any) => ({
                ...prev,
                posX: parseFloat(e.target.value),
              }))
            }
          />
          <ReuInput
            label="Posición Y"
            placeholder="Ingrese posición Y"
            type="number"
            value={selectedBancal?.posY || 0}
            onChange={(e) =>
              setSelectedBancal((prev: any) => ({
                ...prev,
                posY: parseFloat(e.target.value),
              }))
            }
          />
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Lote</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBancal?.fk_lote || 0}
              onChange={(e) =>
                setSelectedBancal((prev: any) => ({
                  ...prev,
                  fk_lote: parseInt(e.target.value),
                }))
              }
            >
              <option value="">Seleccione un lote</option>
              {lotes?.map((lote) => (
                <option key={lote.id} value={lote.id}>{lote.nombre}</option>
              ))}
            </select>
          </div>
        </ReuModal>

        <ReuModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="¿Estás seguro de eliminar este bancal?"
          onConfirm={handleConfirmDelete}
        >
          <p>Esta acción es irreversible.</p>
        </ReuModal>
      </DefaultLayout>
    );
  };

  export default ListaBancalPage;