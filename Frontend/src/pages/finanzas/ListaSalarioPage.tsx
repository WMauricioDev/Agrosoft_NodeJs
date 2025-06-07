import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Salario } from "@/types/finanzas/Salario";
import { useSalarios, useActualizarSalario, useEliminarSalario } from "@/hooks/finanzas/useSalario";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from 'lucide-react';
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";

const SalarioInput = ({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '');
    const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    onChange(formattedValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
        inputMode="numeric"
      />
    </div>
  );
};

const ListaSalarioPage: React.FC = () => {
  const [selectedSalario, setSelectedSalario] = useState<Salario | null>(null);
  const [displayValue, setDisplayValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: salarios, isLoading, refetch } = useSalarios();
  const { roles } = useUsuarios();
  const updateMutation = useActualizarSalario();
  const deleteMutation = useEliminarSalario();
  const navigate = useNavigate();

  const formatColombianNumber = (value: number): string => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const handleEdit = (salario: Salario) => {
    setSelectedSalario(salario);
    setDisplayValue(formatColombianNumber(salario.valorJornal));
    setIsEditModalOpen(true);
  };

  const handleDelete = (salario: Salario) => {
    setSelectedSalario(salario);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSalario?.id) {
      deleteMutation.mutate(selectedSalario.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        }
      });
    }
  };

const transformedData = salarios?.map((salario) => {

  return {
    id: salario.id.toString(),
    rol: salario.rol_nombre || salario.rol?.nombre || 'Sin rol',
    fecha_de_implementacion: new Date(salario.fecha_de_implementacion).toLocaleDateString(),
    valorJornal: `$${formatColombianNumber(salario.valorJornal)}`,
    estado: salario.activo ? 'Activo' : 'Inactivo',
    acciones: (
      <div className="flex space-x-2">
        <button 
          onClick={() => handleEdit(salario)} 
          className="text-blue-600 hover:text-blue-800"
          aria-label="Editar salario"
        >
          <EditIcon size={20} color="black" />
        </button>
        <button 
          onClick={() => handleDelete(salario)} 
          className="text-red-600 hover:text-red-800"
          aria-label="Eliminar salario"
        >
          <Trash2 size={20} />
        </button>
      </div>
    )
  };
}) || [];


  return (
    <DefaultLayout>
      <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">Listado de Salarios por Rol</h1>
      <div className="mb-6 flex justify-between items-center">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                      hover:bg-green-700 transition-all duration-300 ease-in-out 
                      shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/finanzas/salario')}
        >
          + Registrar Nuevo Salario
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando salarios...</div>
      ) : (
        <Tabla
          columns={[
            { name: "Rol", uid: "rol" },
            { name: "Fecha Implementación", uid: "fecha_de_implementacion" },
            { name: "Valor Jornal", uid: "valorJornal" },
            { name: "Estado", uid: "estado" },
            { name: "Acciones", uid: "acciones" }
          ]}
          data={transformedData}
        />
      )}

      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Salario"
        onConfirm={() => {
          if (selectedSalario) {
            updateMutation.mutate(selectedSalario, {
              onSuccess: () => {
                setIsEditModalOpen(false);
                refetch();
              }
            });
          }
        }}
        confirmText="Guardar Cambios"
        isConfirming={updateMutation.isPending}
      >
        {selectedSalario && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={selectedSalario.rol_id}
                onChange={(e) => setSelectedSalario({
                  ...selectedSalario,
                  rol_id: parseInt(e.target.value)
                })}
                className="w-full p-2 border rounded"
                disabled // No permitir cambiar el rol al editar
              >
                {roles?.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.rol}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Implementación
              </label>
              <input
                type="date"
                value={selectedSalario.fecha_de_implementacion}
                onChange={(e) => setSelectedSalario({
                  ...selectedSalario,
                  fecha_de_implementacion: e.target.value
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <SalarioInput
              label="Valor del Jornal"
              value={displayValue}
              onChange={(value) => {
                setDisplayValue(value);
                setSelectedSalario({
                  ...selectedSalario,
                  valorJornal: Number(value.replace(/\./g, ''))
                });
              }}
              placeholder="Ej: 1.400.500"
            />
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSalario.activo}
                  onChange={(e) => setSelectedSalario({
                    ...selectedSalario,
                    activo: e.target.checked
                  })}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Activo</span>
              </label>
            </div>
          </>
        )}
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirmar Eliminación"
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        isConfirming={deleteMutation.isPending}
      >
        <p>¿Estás seguro de eliminar este registro de salario?</p>
        {selectedSalario && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p><strong>Rol:</strong> {selectedSalario.rol_nombre || 'Sin rol'}</p>
            <p><strong>Fecha:</strong> {new Date(selectedSalario.fecha_de_implementacion).toLocaleDateString()}</p>
            <p><strong>Valor:</strong> ${formatColombianNumber(selectedSalario.valorJornal)}</p>
          </div>
        )}
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaSalarioPage;