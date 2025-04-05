import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useSalario } from "@/hooks/finanzas/useSalario";
import { Salario } from "@/types/finanzas/Salario";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";

const ListaSalarioPage: React.FC = () => {
  const [selectedSalario, setSelectedSalario] = useState<Salario | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { salarios, isLoading, actualizarSalario, eliminarSalario, isActualizando, isEliminando } = useSalario();
  const navigate = useNavigate();

  const columns = [
    { name: "Salario Base", uid: "salario_base" },
    { name: "Valor por Hora", uid: "valor_por_hora" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (salario: Salario) => {
    setSelectedSalario(salario);
    setIsEditModalOpen(true);
  };

  const handleDelete = (salario: Salario) => {
    setSelectedSalario(salario);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSalario && selectedSalario.id !== undefined) {
      eliminarSalario(selectedSalario.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
      });
    }
  };

  const transformedData = (salarios ?? []).map((salario) => ({
    id: salario.id?.toString() || "",
    salario_base: salario.salario_base,
    valor_por_hora: salario.valor_por_hora,
    acciones: (
      <>
        <button
          className="text-green-500 hover:underline mr-2"
          onClick={() => handleEdit(salario)}
        >
          Editar
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(salario)}
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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Salarios</h2>
          {isLoading ? (
            <p className="text-gray-600">Cargando...</p>
          ) : (
            <>
              <Tabla columns={columns} data={transformedData} />
              <div className="flex justify-end mt-4">
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => navigate("/finanzas/salario/")} 
                >
                  Registrar Salario
                </button>
              </div>
            </>
          )}
        </div>

        <ReuModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          title="Editar Salario"
          onConfirm={() => {
            if (selectedSalario && selectedSalario.id !== undefined) {
              actualizarSalario(selectedSalario, {
                onSuccess: () => {
                  setIsEditModalOpen(false);
                },
              });
            }
          }}
        >
          {selectedSalario && (
            <>
              <ReuInput
                label="Salario Base"
                placeholder="Ingrese el salario base"
                type="number"
                value={selectedSalario.salario_base}
                onChange={(e) =>
                  setSelectedSalario((prev) => ({
                    ...prev!,
                    salario_base: Number(e.target.value),
                  }))
                }
              />
              <ReuInput
                label="Valor por Hora"
                placeholder="Ingrese el valor por hora"
                type="number"
                value={selectedSalario.valor_por_hora}
                onChange={(e) =>
                  setSelectedSalario((prev) => ({
                    ...prev!,
                    valor_por_hora: Number(e.target.value),
                  }))
                }
              />
              {isActualizando && <p className="text-gray-600 mt-2">Actualizando...</p>}
            </>
          )}
        </ReuModal>

        <ReuModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="¿Estás seguro de eliminar este registro?"
          onConfirm={handleConfirmDelete}
        >
          <p>Esta acción es irreversible.</p>
          {isEliminando && <p className="text-gray-600 mt-2">Eliminando...</p>}
        </ReuModal>
      </div>
    </DefaultLayout>
  );
};

export default ListaSalarioPage;