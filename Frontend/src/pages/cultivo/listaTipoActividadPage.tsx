import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoActividad } from "@/types/cultivo/TipoActividad";
import {  useTipoActividad, useActualizarTipoActividad, useEliminarTipoActividad } from "../../hooks/cultivo/usetipoactividad";
import ReuModal from "../../components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from 'lucide-react';

const ListaTipoActividadPage: React.FC = () => {
  const [tipoActividad, setTipoActividad] = useState<TipoActividad>({
    nombre: "",
    descripcion: "",
  });
  

  const [selectedTipoActividad, setSelectedTipoActividad] = useState<TipoActividad | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarTipoActividad();
  const navigate = useNavigate();
  const eliminarMutation = useEliminarTipoActividad();
  const { data: tipoActividades, isLoading } = useTipoActividad();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (tipoActividad: TipoActividad) => {
    setSelectedTipoActividad(tipoActividad);
    setTipoActividad(tipoActividad);
    setIsEditModalOpen(true);
  };

  const handleDelete = (tipoActividad: TipoActividad) => {
    setSelectedTipoActividad(tipoActividad);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTipoActividad && selectedTipoActividad.id !== undefined) {
      eliminarMutation.mutate(selectedTipoActividad.id);
      setIsDeleteModalOpen(false);
    }
  };

  const transformedData = (tipoActividades ?? []).map((tipoActividad) => ({
    id: tipoActividad.id?.toString() || '',
    nombre: tipoActividad.nombre,
    descripcion: tipoActividad.descripcion,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(tipoActividad)}
        >
           <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(tipoActividad)}
        >
            <Trash2   size={22} color='red'/>
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Tipos de Actividad</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/tipo_actividad/')} 
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
        title="Editar Tipo de Actividad"
        onConfirm={() => {
          if (selectedTipoActividad && selectedTipoActividad.id !== undefined) {
            actualizarMutation.mutate({
              id: selectedTipoActividad.id,
              tipoActividad,
            });
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={tipoActividad.nombre}
          onChange={(e) => setTipoActividad({ ...tipoActividad, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={tipoActividad.descripcion}
          onChange={(e) => setTipoActividad({ ...tipoActividad, descripcion: e.target.value })}
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este tipo de actividad?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>


    </DefaultLayout>
  );
};

export default ListaTipoActividadPage;