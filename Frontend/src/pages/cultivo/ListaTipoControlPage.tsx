import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoControl } from "@/types/cultivo/TipoControl";
import { useTipoControl, useActualizarTipoControl, useEliminarTipoControl } from "../../hooks/cultivo/usetipocontrol";
import ReuModal from "../../components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from 'lucide-react';

const ListaTipoControlPage: React.FC = () => {
  const [tipoControl, setTipoControl] = useState<TipoControl>({
    nombre: "",
    descripcion: "",
  });

  const [selectedTipoControl, setSelectedTipoControl] = useState<TipoControl | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarTipoControl();
  const navigate = useNavigate();
  const eliminarMutation = useEliminarTipoControl();
  const { data: tipoControles, isLoading } = useTipoControl();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (tipoControl: TipoControl) => {
    setSelectedTipoControl(tipoControl);
    setTipoControl(tipoControl);
    setIsEditModalOpen(true);
  };

  const handleDelete = (tipoControl: TipoControl) => {
    setSelectedTipoControl(tipoControl);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTipoControl && selectedTipoControl.id !== undefined) {
      eliminarMutation.mutate(selectedTipoControl.id);
      setIsDeleteModalOpen(false);
    }
  };

  const transformedData = (tipoControles ?? []).map((tipoControl) => ({
    id: tipoControl.id?.toString() || '',
    nombre: tipoControl.nombre,
    descripcion: tipoControl.descripcion,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(tipoControl)}
        >
           <EditIcon size={22} color='black'/>
           </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(tipoControl)}
        >
            <Trash2   size={22} color='red'/>
            </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Tipos de Control</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/tipo_control/')} 
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
        title="Editar Tipo de Control"
        onConfirm={() => {
          if (selectedTipoControl && selectedTipoControl.id !== undefined) {
            actualizarMutation.mutate({
              id: selectedTipoControl.id,
              tipoControl,
            });
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={tipoControl.nombre}
          onChange={(e) => setTipoControl({ ...tipoControl, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={tipoControl.descripcion}
          onChange={(e) => setTipoControl({ ...tipoControl, descripcion: e.target.value })}
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este tipo de control?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaTipoControlPage;