import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { Programacion } from "../../types/cultivo/Programacion";
import { useProgramaciones, useActualizarProgramacion, useEliminarProgramacion } from "../../hooks/cultivo/useProgramacion";
import ReuModal from "../../components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";
import { EditIcon, Trash2 } from 'lucide-react';

const ListaProgramacion: React.FC = () => {
  const [programacion, setProgramacion] = useState<Programacion>({
    ubicacion: "",
    hora_prog: "",
    fecha_prog: "",
    estado: false,
  });

  const [selectedProgramacion, setSelectedProgramacion] = useState<Programacion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: programaciones, isLoading, refetch } = useProgramaciones();
  const actualizarMutation = useActualizarProgramacion();
  const eliminarMutation = useEliminarProgramacion();
  const navigate = useNavigate();

  const columns = [
    { name: "Ubicación", uid: "ubicacion" },
    { name: "Hora Programada", uid: "hora_prog" },
    { name: "Fecha Programada", uid: "fecha_prog" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (prog: Programacion) => {
    setSelectedProgramacion(prog);
    setProgramacion(prog);
    setIsEditModalOpen(true);
  };

  const handleDelete = (prog: Programacion) => {
    setSelectedProgramacion(prog);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProgramacion && selectedProgramacion.id !== undefined) {
      eliminarMutation.mutate(selectedProgramacion.id as number, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const handleConfirmEdit = () => {
    if (selectedProgramacion && selectedProgramacion.id !== undefined) {
      actualizarMutation.mutate(
        { id: selectedProgramacion.id as number, programacion },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            refetch();
          },
        }
      );
    }
  };

  const transformedData = (programaciones ?? []).map((prog) => ({
    id: prog.id?.toString() || '',
    ubicacion: prog.ubicacion,
    hora_prog: prog.hora_prog,
    fecha_prog: prog.fecha_prog,
    estado: prog.estado ? "Activo" : "Inactivo",
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(prog)}
        >
           <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(prog)}
        >
            <Trash2   size={22} color='red'/>
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Programaciones</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/programacion/')} 
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
        title="Editar Programación"
        onConfirm={handleConfirmEdit}
      >
        <ReuInput
          label="Ubicación"
          placeholder="Ingrese la ubicación"
          type="text"
          value={programacion.ubicacion}
          onChange={(e) => setProgramacion({ ...programacion, ubicacion: e.target.value })}
        />
        <ReuInput
          label="Hora Programada"
          placeholder="Ingrese la hora programada"
          type="datetime-local"
          value={programacion.hora_prog}
          onChange={(e) => setProgramacion({ ...programacion, hora_prog: e.target.value })}
        />
        <ReuInput
          label="Fecha Programada"
          placeholder="Ingrese la fecha programada"
          type="date"
          value={programacion.fecha_prog}
          onChange={(e) => setProgramacion({ ...programacion, fecha_prog: e.target.value })}
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta programación?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaProgramacion;