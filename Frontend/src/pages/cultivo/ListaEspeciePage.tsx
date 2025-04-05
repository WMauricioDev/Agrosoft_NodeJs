import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useEspecies, useActualizarEspecie, useEliminarEspecie } from "@/hooks/cultivo/useEspecie";
import { useTipoEspecies } from "@/hooks/cultivo/usetipoespecie";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";
import { EditIcon, Trash2 } from 'lucide-react';

const ListaEspeciePage: React.FC = () => {
  const [selectedEspecie, setSelectedEspecie] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: especies, isLoading, refetch } = useEspecies();
  const { data: tiposEspecie } = useTipoEspecies();
  const actualizarMutation = useActualizarEspecie();
  const eliminarMutation = useEliminarEspecie();
  const navigate = useNavigate();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Largo Crecimiento", uid: "largoCrecimiento" },
    { name: "Tipo de Especie", uid: "fk_tipo_especie" },
    { name: "Imagen", uid: "img" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (especie: any) => {
    setSelectedEspecie(especie);
    setIsEditModalOpen(true);
  };

  const handleDelete = (especie: any) => {
    setSelectedEspecie(especie);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEspecie && selectedEspecie.id !== undefined) {
      eliminarMutation.mutate(selectedEspecie.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (especies ?? []).map((especie) => ({
    id: especie.id?.toString() || '',
    nombre: especie.nombre,
    descripcion: especie.descripcion,
    largoCrecimiento: especie.largoCrecimiento,
    fk_tipo_especie: tiposEspecie?.find((tipo) => tipo.id === especie.fk_tipo_especie)?.nombre || 'Sin tipo',
    img: especie.img ? <img src={especie.img} alt={especie.nombre} className="w-16 h-16" /> : "Sin imagen",
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(especie)}
        >
          <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(especie)}
        >
        <Trash2   size={22} color='red'/>
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Especies</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/especies/')} 
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
        title="Editar Especie"
        onConfirm={() => {
          if (selectedEspecie && selectedEspecie.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedEspecie.id, especie: selectedEspecie },
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
          value={selectedEspecie?.nombre || ''}
          onChange={(e) =>
            setSelectedEspecie((prev: any) => ({
              ...prev,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedEspecie?.descripcion || ''}
          onChange={(e) =>
            setSelectedEspecie((prev: any) => ({
              ...prev,
              descripcion: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Largo de Crecimiento"
          placeholder="Ingrese el tiempo en días"
          type="number"
          value={selectedEspecie?.largoCrecimiento || 0}
          onChange={(e) =>
            setSelectedEspecie((prev: any) => ({
              ...prev,
              largoCrecimiento: Number(e.target.value),
            }))
          }
        />
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Tipo de Especie</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEspecie?.fk_tipo_especie || 0}
            onChange={(e) =>
              setSelectedEspecie((prev: any) => ({
                ...prev,
                fk_tipo_especie: parseInt(e.target.value),
              }))
            }
          >
            <option value="">Seleccione un tipo</option>
            {tiposEspecie?.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta especie?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaEspeciePage;