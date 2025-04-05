import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Plaga } from '../../types/cultivo/Plaga'; 
import { usePlagas, useActualizarPlaga, useEliminarPlaga } from '../../hooks/cultivo/useplaga'; 
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla';
import { EditIcon, Trash2 } from 'lucide-react';

const ListaPlagasPage: React.FC = () => {
  const [selectedPlaga, setSelectedPlaga] = useState<Plaga | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: plagas, isLoading, refetch } = usePlagas();
  const actualizarMutation = useActualizarPlaga();
  const eliminarMutation = useEliminarPlaga();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Tipo de Plaga', uid: 'tipo_plaga' },
    { name: 'Imagen', uid: 'imagen' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (plaga: Plaga) => {
    setSelectedPlaga(plaga);
    setIsEditModalOpen(true);
  };

  const handleDelete = (plaga: Plaga) => {
    setSelectedPlaga(plaga);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlaga && selectedPlaga.id !== undefined) {
      eliminarMutation.mutate(selectedPlaga.id as number, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (plagas ?? []).map((plaga) => ({
    id: plaga.id?.toString() || '',
    nombre: plaga.nombre,
    descripcion: plaga.descripcion,
    tipo_plaga: plaga.fk_tipo_plaga || 'Sin tipo',
    imagen: plaga.img
      ? typeof plaga.img === 'string'
        ? plaga.img
        : URL.createObjectURL(plaga.img)
      : 'Sin imagen',
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(plaga)}
        >
           <EditIcon size={22} color='black'/>
           </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(plaga)}
        >
            <Trash2   size={22} color='red'/>
            </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Plagas</h2>
          <div className="mb-2 flex justify-start">
                        <button
                        className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                    hover:bg-green-700 transition-all duration-300 ease-in-out 
                                    shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => navigate('/cultivo/plaga/')} 
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
        title="Editar Plaga"
        onConfirm={() => {
          if (selectedPlaga && selectedPlaga.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedPlaga.id as number, plaga: selectedPlaga },
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
          value={selectedPlaga?.nombre || ''}
          onChange={(e) =>
            setSelectedPlaga((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedPlaga?.descripcion || ''}
          onChange={(e) =>
            setSelectedPlaga((prev) => ({
              ...prev!,
              descripcion: e.target.value,
            }))
          }
        />
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar esta plaga?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaPlagasPage;