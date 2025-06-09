import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useCultivos, useActualizarCultivo, useEliminarCultivo } from "@/hooks/cultivo/useCultivo";
import { useEspecies } from "@/hooks/cultivo/useEspecie";
import { useBancales } from "@/hooks/cultivo/usebancal";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";
import { EditIcon, Trash2 } from "lucide-react"; 
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { UnidadMedida } from "@/types/inventario/Insumo";
import { Switch } from "@heroui/react";
const ListarCultivoPage: React.FC = () => {
  const [cultivo, setCultivo] = useState({
    nombre: "",
    unidad_de_medida: "",
    activo: false,
    fechaSiembra: "",
    fk_especie: 0,
    fk_bancal: 0,
  });

  const [selectedCultivo, setSelectedCultivo] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const actualizarMutation = useActualizarCultivo();
  const eliminarMutation = useEliminarCultivo();
  const { data: cultivos, isLoading, refetch } = useCultivos();
  const { data: especies } = useEspecies();
  const { data: bancales } = useBancales();
  const navigate = useNavigate();
  const { data: unidadesMedida } = useUnidadesMedida();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Unidad de Medida", uid: "unidad_de_medida" },
    { name: "Activo", uid: "activo" },
    { name: "Fecha de Siembra", uid: "fechaSiembra" },
    { name: "Especie", uid: "fk_especie" },
    { name: "Bancal", uid: "fk_bancal" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (cultivo: any) => {
    setSelectedCultivo(cultivo);
    setCultivo(cultivo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cultivo: any) => {
    setSelectedCultivo(cultivo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCultivo && selectedCultivo.id !== undefined) {
      eliminarMutation.mutate(selectedCultivo.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const transformedData = (cultivos ?? []).map((cultivo) => ({
    id: cultivo.id?.toString() || '',
    nombre: cultivo.nombre,
    unidad_de_medida: unidadesMedida?.find((um) => um.id === cultivo.unidad_de_medida_id)?.nombre || "sin unidad",
    activo: cultivo.activo ? "Sí" : "No",
    fechaSiembra: cultivo.fechaSiembra,
    fk_especie: especies?.find((especie) => especie.id === cultivo.Especie_id)?.nombre || 'Sin especie',
    fk_bancal: bancales?.find((bancal) => bancal.id === cultivo.Bancal_id)?.nombre || 'Sin bancal',
    acciones: (
      <>
        <button
          className="text-black-500 hover:text-gray-700 mr-2"
          onClick={() => handleEdit(cultivo)}
        >
          <EditIcon size={20} />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDelete(cultivo)}
        >
          <Trash2 size={20} />
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Cultivos</h2>
      <div className="mb-4 flex justify-between">
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate('/cultivo/cultivo')}
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
        title="Editar Cultivo"
        onConfirm={() => {
          if (selectedCultivo && selectedCultivo.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedCultivo.id, cultivo },
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
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
            <select
              value={selectedCultivo?.unidades_de_medida || 0}
              onChange={(e) =>
                setSelectedCultivo((prev: any) => ({
                  ...prev,
                  unidades_de_medida: parseInt(e.target.value),
                }))
                
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Seleccione una unidad</option>
              {unidadesMedida?.map((unidad: UnidadMedida) => (
                <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
              ))}
            </select>
          </div>
      
        <ReuInput
          label="Fecha de Siembra"
          type="date"
          value={selectedCultivo?.fechaSiembra || ''}
          onChange={(e) =>
            setSelectedCultivo((prev: any) => ({
              ...prev,
              fechaSiembra: e.target.value,
            }))
          }
        />
        <label className="block text-sm font-medium text-gray-700 mt-4">Especie</label>
        <select
          name="fk_especie"
          value={selectedCultivo?.fk_especie || 0}
          onChange={(e) =>
            setSelectedCultivo((prev: any) => ({
              ...prev,
              fk_especie: parseInt(e.target.value),
            }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione una especie</option>
          {especies?.map((especie) => (
            <option key={especie.id} value={especie.id}>{especie.nombre}</option>
          ))}
        </select>
        <label className="block text-sm font-medium text-gray-700 mt-4">Bancal</label>
        <select
          name="fk_bancal"
          value={selectedCultivo?.fk_bancal || 0}
          onChange={(e) =>
            setSelectedCultivo((prev: any) => ({
              ...prev,
              fk_bancal: parseInt(e.target.value),
            }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un bancal</option>
          {bancales?.map((bancal) => (
            <option key={bancal.id} value={bancal.id}>{bancal.nombre}</option>
          ))}
        </select>
        <div className="flex items-center gap-4 mb-4 py-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Switch
            color="success"
            size="sm"
            isSelected={cultivo.activo}
            onChange={() =>
              setCultivo((prev) => ({ ...prev, activo: !prev.activo }))
            }
          />

        </div>
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este cultivo?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListarCultivoPage;
