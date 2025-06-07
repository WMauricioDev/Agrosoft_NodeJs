import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { TipoResiduo } from '../../types/cultivo/TipoResiduo';
import { useTipoResiduos, useActualizarTipoResiduo, useEliminarTipoResiduo } from '../../hooks/cultivo/useTipoResiduo';
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla'; 
import { EditIcon, Trash2 } from 'lucide-react';
const ListaTipoResiduoPage: React.FC = () => {
  const [selectedTipoResiduo, setSelectedTipoResiduo] = useState<TipoResiduo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: tipoResiduos, isLoading, refetch } = useTipoResiduos();
  const actualizarMutation = useActualizarTipoResiduo();
  const eliminarMutation = useEliminarTipoResiduo();
  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (tipoResiduo: TipoResiduo) => {
    setSelectedTipoResiduo(tipoResiduo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (tipoResiduo: TipoResiduo) => {
    setSelectedTipoResiduo(tipoResiduo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTipoResiduo && selectedTipoResiduo.id !== undefined) {
      eliminarMutation.mutate(selectedTipoResiduo.id as number, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (tipoResiduos ?? []).map((tipoResiduos) => ({
    id: tipoResiduos.id?.toString() || '',
    nombre: tipoResiduos.nombre,
    descripcion: tipoResiduos.descripcion,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(tipoResiduos)}
        >
          <EditIcon size={22} color='black'/>
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(tipoResiduos)}
        >
        <Trash2   size={22} color='red'/>
      </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Tipos de Residuos Registradas</h2><br /><br />
      <div className="mb-2 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/cultivo/tipoespecie')} 
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
        title="Editar Tipo de Especie"
        onConfirm={() => {
          if (selectedTipoResiduo && selectedTipoResiduo.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedTipoResiduo.id as number, tipoResiduo: selectedTipoResiduo },
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
          value={selectedTipoResiduo?.nombre || ''}
          onChange={(e) =>
            setSelectedTipoResiduo((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={selectedTipoResiduo?.descripcion || ''}
          onChange={(e) =>
            setSelectedTipoResiduo((prev) => ({
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

export default ListaTipoResiduoPage;