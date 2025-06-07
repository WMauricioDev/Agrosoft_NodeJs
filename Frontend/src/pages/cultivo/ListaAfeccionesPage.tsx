import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { useAfecciones, useActualizarAfeccion, useCambiarEstadoAfeccion, useEliminarAfeccion } from '@/hooks/cultivo/useAfecciones';
import ReuModal from '@/components/globales/ReuModal';
import { ReuInput } from '@/components/globales/ReuInput';
import Tabla from '@/components/globales/Tabla'; 
import { EditIcon, Trash2, Eye, CircleAlert, CircleCheck, CircleDot, CircleX } from 'lucide-react';
import { AfeccionDetalle } from '@/types/cultivo/Afeccion';
import { ModalDetalleAfeccion } from './DetalleAfeccion';
import { useQueryClient } from '@tanstack/react-query';
import { addToast } from '@heroui/react';
const ListaAfecciones: React.FC = () => {
  const [selectedAfeccion, setSelectedAfeccion] = useState<AfeccionDetalle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEstadoModalOpen, setIsEstadoModalOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<'ST' | 'EC' | 'EL'>('ST');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: afecciones, isLoading, refetch } = useAfecciones();
  const actualizarMutation = useActualizarAfeccion();
  const estadoMutation = useCambiarEstadoAfeccion();
  const eliminarMutation = useEliminarAfeccion();

  const navigate = useNavigate();

  const columns = [
    { name: 'Nombre', uid: 'nombre' },
    { name: 'Plaga', uid: 'plaga' },
    { name: 'Bancal', uid: 'bancal' },
    { name: 'Estado', uid: 'estado' },
    { name: 'Gravedad', uid: 'gravedad' },
    { name: 'Acciones', uid: 'acciones' },
  ];

  const handleEdit = (afeccion: AfeccionDetalle) => {
    setSelectedAfeccion(afeccion);
    setIsEditModalOpen(true);
  };

  const handleDelete = (afeccion: AfeccionDetalle) => {
    setSelectedAfeccion(afeccion);
    setIsDeleteModalOpen(true);
  };

  const handleEstado = (afeccion: AfeccionDetalle, estado: 'ST' | 'EC' | 'EL') => {
    setSelectedAfeccion(afeccion);
    setNuevoEstado(estado);
    setIsEstadoModalOpen(true);
  };

 
const handleConfirmEstado = () => {
  if (selectedAfeccion) {
    estadoMutation.mutate(
      { id: selectedAfeccion.id, estado: nuevoEstado },
      {
        onSuccess: (data) => {
          console.log("Estado cambiado exitosamente:", data);
          setIsEstadoModalOpen(false);
          // Actualiza específicamente la afección modificada
          queryClient.setQueryData(['afecciones'], (old: AfeccionDetalle[] | undefined) => {
            if (!old) return old;
            return old.map(afeccion => 
              afeccion.id === selectedAfeccion.id 
                ? { ...afeccion, estado: nuevoEstado }
                : afeccion
            );
          });
        },
        onError: (error) => {
          console.error("Error al cambiar estado:", error);
          addToast({
            title: "Error",
            description: error.message || "No se pudo cambiar el estado",
            timeout: 3000,
            color: "danger"
          });
        }
      }
    );
  }
};

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'AC': return <CircleDot className="text-orange-500" size={18} />;
      case 'ST': return <CircleCheck className="text-green-500" size={18} />;
      case 'EC': return <CircleAlert className="text-blue-500" size={18} />;
      case 'EL': return <CircleX className="text-red-500" size={18} />;
      default: return null;
    }
  };

  const transformedData = (afecciones ?? []).map((afeccion) => ({
    id: afeccion.id.toString(),
    nombre: afeccion.nombre,
    plaga: afeccion.plaga.nombre,
    bancal: afeccion.bancal.nombre,
    estado: (
      <div className="flex items-center gap-1">
        {getEstadoIcon(afeccion.estado)}
        {afeccion.estado === 'AC' && 'Activa'}
        {afeccion.estado === 'ST' && 'Estable'}
        {afeccion.estado === 'EC' && 'En Control'}
        {afeccion.estado === 'EL' && 'Eliminada'}
      </div>
    ),
    gravedad: (
      <span className={`px-2 py-1 rounded-full text-xs ${
        afeccion.gravedad === 'G' ? 'bg-red-100 text-red-800' :
        afeccion.gravedad === 'M' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {afeccion.gravedad === 'L' && 'Leve'}
        {afeccion.gravedad === 'M' && 'Moderada'}
        {afeccion.gravedad === 'G' && 'Grave'}
      </span>
    ),
    acciones: (
      <div className="flex gap-2">
        <button
        onClick={() => {
            setSelectedAfeccion(afeccion);
            setIsDetailModalOpen(true);
        }}          className="text-blue-500 hover:text-blue-700"
          title="Ver detalles"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => handleEdit(afeccion)}
          className="text-green-500 hover:text-green-700"
          title="Editar"
        >
          <EditIcon size={18} />
        </button>
        <button
          onClick={() => handleDelete(afeccion)}
          className="text-red-500 hover:text-red-700"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
        {afeccion.estado === 'AC' && (
          <button
            onClick={() => handleEstado(afeccion, 'EC')}
            className="text-purple-500 hover:text-purple-700 text-sm"
            title="Marcar como En Control"
          >
            <CircleAlert size={18} />
          </button>
        )}
      </div>
    ),
  }));

     const handleConfirmDelete = () => {
      if (selectedAfeccion && selectedAfeccion.id !== undefined) {
        eliminarMutation.mutate(selectedAfeccion.id, {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            refetch();
          },
        });
      }
    };

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Afecciones Registradas</h2>
      
      <div className="mb-6 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/cultivo/afecciones')}
        >
          + Registrar Afección
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
        title="Editar Afección"
        onConfirm={() => {
          if (selectedAfeccion) {
            actualizarMutation.mutate(
              { id: selectedAfeccion.id, afeccion: selectedAfeccion },
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
          value={selectedAfeccion?.nombre || ''}
          onChange={(e) =>
            setSelectedAfeccion((prev) => ({
              ...prev!,
              nombre: e.target.value,
            }))
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="textarea"
          value={selectedAfeccion?.descripcion || ''}
          onChange={(e) =>
            setSelectedAfeccion((prev) => ({
              ...prev!,
              descripcion: e.target.value,
            }))
          }
        />
      </ReuModal>

     
      <ReuModal
        isOpen={isEstadoModalOpen}
        onOpenChange={setIsEstadoModalOpen}
        title={`Cambiar estado a ${nuevoEstado === 'ST' ? 'Estable' : nuevoEstado === 'EC' ? 'En Control' : 'Eliminada'}`}
        onConfirm={handleConfirmEstado}
      >
        <div className="space-y-4">
          <p>¿Estás seguro de cambiar el estado de <strong>{selectedAfeccion?.nombre}</strong>?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setNuevoEstado('ST')}
              className={`px-3 py-1 rounded ${nuevoEstado === 'ST' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Estable
            </button>
            <button
              onClick={() => setNuevoEstado('EC')}
              className={`px-3 py-1 rounded ${nuevoEstado === 'EC' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              En Control
            </button>
            <button
              onClick={() => setNuevoEstado('EL')}
              className={`px-3 py-1 rounded ${nuevoEstado === 'EL' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              Eliminada
            </button>
          </div>
        </div>
      </ReuModal>
      <ModalDetalleAfeccion
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        afeccion={selectedAfeccion}
      />
      <ReuModal
      isOpen={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
      title="¿Estás seguro de eliminar esta afección?"
      onConfirm={handleConfirmDelete}
    >
      ¿Estás seguro de que deseas eliminar esta afección?
    </ReuModal>

      
    </DefaultLayout>
  );
};

export default ListaAfecciones;