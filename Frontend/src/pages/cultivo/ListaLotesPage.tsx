import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { useNavigate } from "react-router-dom";
import { useLotes, useActualizarLote, useEliminarLote } from "../../hooks/cultivo/uselotes";
import { Lote } from "../../types/cultivo/Lotes";
import Tabla from "@/components/globales/Tabla";
import ReuModal from "../../components/globales/ReuModal";
import { EditIcon, Trash2 } from 'lucide-react';
import { Switch } from "@heroui/react";
const ListarLotesPage: React.FC = () => {
  const [lote, setLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    activo: false,
    tam_x: 0,
    tam_y: 0,
    latitud: 0,
    longitud: 0,
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
    { name: "Latitud", uid: "pos_x" },
    { name: "Longitud", uid: "pos_y" },
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
    pos_x: lote.latitud,
    pos_y: lote.longitud,
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

    <div className="flex items-center gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Switch
            color="success"
            size="sm"
            isSelected={lote.activo}
            onChange={() =>
              setLote((prev) => ({ ...prev, activo: !prev.activo }))
            }
          />
        </div>

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
            label="Latitud"
            placeholder="Ingrese posición X"
            type="number"
            value={lote.latitud.toString()}
            onChange={(e) => setLote({ ...lote, latitud: parseFloat(e.target.value) })}
          />

          <ReuInput
            label="Longitud"
            placeholder="Ingrese posición Y"
            type="number"
            value={lote.longitud.toString()}
            onChange={(e) => setLote({ ...lote, longitud: parseFloat(e.target.value) })}
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