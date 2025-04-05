import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { useNavigate } from "react-router-dom";
import { useLotes, useActualizarLote, useEliminarLote } from "../../hooks/cultivo/uselotes";
import { Lote } from "../../types/cultivo/Lotes";
import Tabla from "@/components/globales/Tabla";
import ReuModal from "../../components/globales/ReuModal";
import { EditIcon, Trash2 } from 'lucide-react';

const ListarLotesPage: React.FC = () => {
  const [lote, setLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    activo: false,
    tam_x: 0,
    tam_y: 0,
    pos_x: 0,
    pos_y: 0,
  });

  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarLote();
  const eliminarMutation = useEliminarLote();
  const { data: lotes, isLoading } = useLotes();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Activo", uid: "activo" },
    { name: "Tamaño X", uid: "tam_x" },
    { name: "Tamaño Y", uid: "tam_y" },
    { name: "Posición X", uid: "pos_x" },
    { name: "Posición Y", uid: "pos_y" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (lote: Lote) => {
    setSelectedLote(lote);
    setLote(lote);
    setIsEditModalOpen(true);
  };

  const handleDelete = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLote && selectedLote.id !== undefined) {
      eliminarMutation.mutate(selectedLote.id);
      setIsDeleteModalOpen(false);
    }
  };
  const navigate = useNavigate()

  const transformedData = (lotes ?? []).map((lote) => ({
    id: lote.id?.toString() || '',
    nombre: lote.nombre,
    descripcion: lote.descripcion,
    activo: lote.activo ? "Sí" : "No",
    tam_x: lote.tam_x,
    tam_y: lote.tam_y,
    pos_x: lote.pos_x,
    pos_y: lote.pos_y,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(lote)}
        >
           <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(lote)}
        >
        <Trash2   size={22} color='red'/>
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Lotes</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/lotes/')} 
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
        title="Editar Lote"
        onConfirm={() => {
          if (selectedLote && selectedLote.id !== undefined) {
            actualizarMutation.mutate({
              id: selectedLote.id,
              lote,
            });
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={lote.nombre}
          onChange={(e) => setLote({ ...lote, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={lote.descripcion}
          onChange={(e) => setLote({ ...lote, descripcion: e.target.value })}
        />

        <label className="flex items-center space-x-2 text-gray-700">
          <input
            type="checkbox"
            className="w-5 h-5 text-red-600 border-gray-300 rounded"
            checked={lote.activo}
            onChange={(e) => setLote({ ...lote, activo: e.target.checked })}
          />
          <span>Activo</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Tamaño X"
            placeholder="Ingrese tamaño X"
            type="number"
            value={lote.tam_x.toString()}
            onChange={(e) => setLote({ ...lote, tam_x: parseFloat(e.target.value) })}
          />

          <ReuInput
            label="Tamaño Y"
            placeholder="Ingrese tamaño Y"
            type="number"
            value={lote.tam_y.toString()}
            onChange={(e) => setLote({ ...lote, tam_y: parseFloat(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Posición X"
            placeholder="Ingrese posición X"
            type="number"
            value={lote.pos_x.toString()}
            onChange={(e) => setLote({ ...lote, pos_x: parseFloat(e.target.value) })}
          />

          <ReuInput
            label="Posición Y"
            placeholder="Ingrese posición Y"
            type="number"
            value={lote.pos_y.toString()}
            onChange={(e) => setLote({ ...lote, pos_y: parseFloat(e.target.value) })}
          />
        </div>
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este lote?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListarLotesPage;