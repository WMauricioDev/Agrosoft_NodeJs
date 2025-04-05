import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useInsumos, useActualizarInsumo, useEliminarInsumo } from "@/hooks/inventario/useInsumo";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from 'lucide-react';

interface Insumo {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  activo: boolean;
  tipo_empacado: string | null;
  fecha_registro: string;
  fecha_caducidad: string | null;
  fecha_actualizacion: string;
}

const ListaInsumoPage: React.FC = () => {
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: insumos, isLoading, refetch } = useInsumos();
  const actualizarMutation = useActualizarInsumo();
  const eliminarMutation = useEliminarInsumo();
  const navigate = useNavigate();

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Descripción", uid: "descripcion" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Unidad de Medida", uid: "unidad_medida" },
    { name: "Activo", uid: "activo" },
    { name: "Tipo de Empacado", uid: "tipo_empacado" },
    { name: "Fecha de Registro", uid: "fecha_registro" },
    { name: "Fecha de Caducidad", uid: "fecha_caducidad" },
    { name: "Fecha de Actualización", uid: "fecha_actualizacion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (insumo: Insumo) => {
    setSelectedInsumo({ ...insumo });
    setIsEditModalOpen(true);
  };

  const handleDelete = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedInsumo && selectedInsumo.id !== undefined) {
      eliminarMutation.mutate(selectedInsumo.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedInsumo(null);
          refetch();
        },
      });
    }
  };

  const transformedData = (insumos ?? []).map((insumo) => ({
    id: insumo.id?.toString() || "",
    nombre: insumo.nombre,
    descripcion: insumo.descripcion,
    cantidad: insumo.cantidad,
    unidad_medida: insumo.unidad_medida,
    activo: insumo.activo ? "Sí" : "No",
    tipo_empacado: insumo.tipo_empacado || "No especificado",
    fecha_registro: insumo.fecha_registro,
    fecha_caducidad: insumo.fecha_caducidad || "No especificada",
    fecha_actualizacion: insumo.fecha_actualizacion,
    acciones: (
      <>
        <button className="text-green-500 hover:underline mr-2" onClick={() => handleEdit(insumo)}>
          <EditIcon size={22} color="black" />
        </button>
        <button className="text-red-500 hover:underline" onClick={() => handleDelete(insumo)}>
          <Trash2 size={22} color="red" />
        </button>
      </>
    ),
  }));

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Insumos Registrados</h2><br /><br />
      <div className="mb-2 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate("/inventario/insumos/")}
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
        title="Editar Insumo"
        onConfirm={() => {
          if (selectedInsumo && selectedInsumo.id !== undefined) {
            actualizarMutation.mutate(selectedInsumo, {
              onSuccess: () => {
                setIsEditModalOpen(false);
                refetch();
              },
            });
          }
        }}
      >
        {selectedInsumo && (
          <>
            <ReuInput label="Nombre" placeholder="Ingrese el nombre" type="text" value={selectedInsumo.nombre} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, nombre: e.target.value })} />
            <ReuInput label="Descripción" placeholder="Ingrese la descripción" type="text" value={selectedInsumo.descripcion} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, descripcion: e.target.value })} />
            <ReuInput label="Cantidad" placeholder="Ingrese la cantidad" type="number" value={selectedInsumo.cantidad.toString()} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, cantidad: Number(e.target.value) })} />
            <ReuInput label="Unidad de Medida" placeholder="Ingrese la unidad de medida" type="text" value={selectedInsumo.unidad_medida} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, unidad_medida: e.target.value })} />
            <div className="mb-4 flex items-center">
              <input type="checkbox" checked={selectedInsumo.activo} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, activo: e.target.checked })} className="mr-2 leading-tight" />
              <label className="text-gray-700 text-sm font-bold">Activo</label>
            </div>
            <ReuInput label="Tipo de Empacado" placeholder="Ingrese el tipo de empacado" type="text" value={selectedInsumo.tipo_empacado || ""} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, tipo_empacado: e.target.value || null })} />
            <ReuInput label="Fecha de Registro" type="datetime-local" value={selectedInsumo.fecha_registro.slice(0, 16)} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, fecha_registro: new Date(e.target.value).toISOString() })} />
            <ReuInput label="Fecha de Caducidad" type="date" value={selectedInsumo.fecha_caducidad || ""} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, fecha_caducidad: e.target.value || null })} />
            <ReuInput label="Fecha de Actualización" type="datetime-local" value={selectedInsumo.fecha_actualizacion.slice(0, 16)} onChange={(e) => setSelectedInsumo({ ...selectedInsumo, fecha_actualizacion: new Date(e.target.value).toISOString() })} />
          </>
        )}
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este insumo?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>
  );
};

export default ListaInsumoPage;