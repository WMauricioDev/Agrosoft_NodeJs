import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { TipoEspecie } from '../../types/cultivo/TipoEspecie';
import { useTipoEspecies, useActualizarTipoEspecie, useEliminarTipoEspecie } from '../../hooks/cultivo/usetipoespecie';
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla'; 

const ListaTipoEspeciePage: React.FC = () => {
  const [selectedTipoEspecie, setSelectedTipoEspecie] = useState<TipoEspecie | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: especies, isLoading, refetch } = useTipoEspecies();
  const actualizarMutation = useActualizarTipoEspecie();
  const eliminarMutation = useEliminarTipoEspecie();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Imagen', uid: 'imagen' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (especie: TipoEspecie) => {
    setSelectedTipoEspecie(especie);
    setIsEditModalOpen(true);
  };

  const handleDelete = (especie: TipoEspecie) => {
    setSelectedTipoEspecie(especie);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTipoEspecie && selectedTipoEspecie.id !== undefined) {
      eliminarMutation.mutate(selectedTipoEspecie.id as number, {
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
    imagen: especie.img
      ? typeof especie.img === 'string'
        ? especie.img
        : URL.createObjectURL(especie.img)
      : 'Sin imagen',
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(especie)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(especie)}
        >
          Eliminar
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
    <div className="w-full flex flex-col items-center min-h-screen p-6">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Tipos de Especies</h2>
  
        {isLoading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : (
          <>
            <Tabla columns={columns} data={transformedData} />
            <div className="flex justify-end mt-4">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg 
                           hover:bg-blue-700 transition-all duration-300 ease-in-out 
                           shadow-md hover:shadow-lg transform hover:scale-105"
                onClick={() => navigate('/cultivo/tipoespecie')} 
              >
                Registrar Especie
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  
    <ReuModal
      isOpen={isEditModalOpen}
      onOpenChange={setIsEditModalOpen}
      title="Editar Tipo de Especie"
      onConfirm={() => {
        if (selectedTipoEspecie && selectedTipoEspecie.id !== undefined) {
          actualizarMutation.mutate(
            { id: selectedTipoEspecie.id as number, tipoEspecie: selectedTipoEspecie },
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
        value={selectedTipoEspecie?.nombre || ''}
        onChange={(e) =>
          setSelectedTipoEspecie((prev) => ({
            ...prev!,
            nombre: e.target.value,
          }))
        }
      />
      <ReuInput
        label="Descripción"
        placeholder="Ingrese la descripción"
        type="text"
        value={selectedTipoEspecie?.descripcion || ''}
        onChange={(e) =>
          setSelectedTipoEspecie((prev) => ({
            ...prev!,
            descripcion: e.target.value,
          }))
        }
      />
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

export default ListaTipoEspeciePage;