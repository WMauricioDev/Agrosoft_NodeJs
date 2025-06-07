import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { Residuo } from '../../types/cultivo/Residuos';
import { useResiduos, useActualizarResiduo, useEliminarResiduo } from '../../hooks/cultivo/useResiduo';
import ReuModal from '../../components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla'; 
import { EditIcon, Trash2 } from 'lucide-react';
import { useCosechas } from '@/hooks/cultivo/usecosecha';
import { useTipoResiduos } from '@/hooks/cultivo/useTipoResiduo';



const ListaResiduoPage: React.FC = () => {
    const [selectedResiduo, setSelectedResiduo] = useState<Residuo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
    const { data: residuos, isLoading, refetch } = useResiduos();
    const { data: cosechas } = useCosechas();
    const { data: tiposResiduos } = useTipoResiduos();
    const actualizarMutation = useActualizarResiduo();
    const eliminarMutation = useEliminarResiduo();
    const navigate = useNavigate();
  
const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Descripción', uid: 'descripcion' },
    { name: 'Cantidad', uid: 'cantidad' },
    { name: 'Fecha', uid: 'fecha' },
    { name: 'Tipo Residuo', uid: 'tipoResiduo' },
    { name: 'Cosecha', uid: 'cosecha' },       
    { name: 'Acciones', uid: 'acciones' },
];
  
    const handleEdit = (residuo: Residuo) => {
      setSelectedResiduo(residuo);
      setIsEditModalOpen(true);
    };
  
    const handleDelete = (residuo: Residuo) => {
      setSelectedResiduo(residuo);
      setIsDeleteModalOpen(true);
    };
  
    const handleConfirmDelete = () => {
      if (selectedResiduo && selectedResiduo.id !== undefined) {
        eliminarMutation.mutate(selectedResiduo.id as number, {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            refetch();
          },
        });
      }
    };
  
const transformedData = (residuos ?? []).map((residuo) => {
    const cosechaNombre = cosechas?.find(c => c.id === residuo.id_cosecha)?.cultivo_nombre || 'Desconocido';
    
    const tipoResiduoNombre = tiposResiduos?.find(t => t.id === residuo.id_tipo_residuo)?.nombre || 'Desconocido';

    return {
        id: residuo.id?.toString() || '',
        nombre: residuo.nombre,
        descripcion: residuo.descripcion,
        cosecha: cosechaNombre, 
        cantidad: residuo.cantidad,
        fecha: residuo.fecha,
        tipoResiduo: tipoResiduoNombre, 
        acciones: (
            <>
                <button
                    className="text-green-500 hover:underline mr-2"
                    onClick={() => handleEdit(residuo)}
                >
                    <EditIcon size={22} color='black'/>
                </button>
                <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(residuo)}
                >
                    <Trash2 size={22} color='red'/>
                </button>
            </>
        ),
    };
});



    return (
        <DefaultLayout>
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Residuos Registradas</h2><br /><br />
          <div className="mb-2 flex justify-start">
            <button
              className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                         hover:bg-green-700 transition-all duration-300 ease-in-out 
                         shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => navigate('/cultivo/residuo/')} 
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
              if (selectedResiduo && selectedResiduo.id !== undefined) {
                actualizarMutation.mutate(
                  { id: selectedResiduo.id as number, residuo: selectedResiduo },
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
              value={selectedResiduo?.nombre || ''}
              onChange={(e) =>
                setSelectedResiduo((prev) => ({
                  ...prev!,
                  nombre: e.target.value,
                }))
              }
            />
            <ReuInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              type="text"
              value={selectedResiduo?.descripcion || ''}
              onChange={(e) =>
                setSelectedResiduo((prev) => ({
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



export default ListaResiduoPage