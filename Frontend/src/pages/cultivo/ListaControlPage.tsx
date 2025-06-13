import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useControles, useEliminarControl, useActualizarControl } from "@/hooks/cultivo/useControl";
import { useAfecciones } from "@/hooks/cultivo/useAfecciones";
import { useTipoControl } from "@/hooks/cultivo/usetipocontrol";
import { useProductoControl } from "@/hooks/cultivo/useproductoscontrol";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2, Eye } from "lucide-react";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import { Control } from "@/types/cultivo/Control";

const ListaControlPage: React.FC = () => {
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: controles, isLoading, refetch } = useControles();
  const { data: afecciones } = useAfecciones();
  const { data: tipoControles } = useTipoControl();
  const { data: productos } = useProductoControl();
  const { data: usuarios } = useUsuarios();
  const eliminarMutation = useEliminarControl();
  const actualizarMutation = useActualizarControl();
  const navigate = useNavigate();

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Afección", uid: "afeccion" },
    { name: "Tipo Control", uid: "tipo_control" },
    { name: "Producto", uid: "producto" },
    { name: "Fecha", uid: "fecha" },
    { name: "Efectividad", uid: "efectividad" },
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (control: Control) => {
    setSelectedControl(control);
    setIsEditModalOpen(true);
  };

  const handleDelete = (control: Control) => {
    setSelectedControl(control);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedControl && selectedControl.id !== undefined) {
      eliminarMutation.mutate(selectedControl.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          refetch();
        },
      });
    }
  };

  const efectividadOptions = Array.from({ length: 11 }, (_, i) => i * 10)
    .map(value => ({ value, label: `${value}%` }));

  const transformedData = controles?.map((control) => ({
  id: control.id.toString(),
  afeccion: control.afeccion && control.afeccion.nombre ? control.afeccion.nombre : 'Desconocido',
  tipo_control: control.tipo_control && control.tipo_control.nombre ? control.tipo_control.nombre : 'Desconocido',
  producto: control.producto && control.producto.nombre ? control.producto.nombre : 'Desconocido',
  responsable: control.responsable && control.responsable.nombre ? control.responsable.nombre : 'Desconocido',
  fecha: new Date(control.fecha_control).toLocaleDateString(),
  efectividad: (
    <span className={`px-2 py-1 rounded-full text-xs ${
      control.efectividad >= 70 ? 'bg-green-100 text-green-800' :
      control.efectividad >= 40 ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {control.efectividad}%
    </span>
    ),
    acciones: (
      <div className="flex gap-2">
        <button
          className="text-green-500 hover:underline"
          onClick={() => handleEdit(control)}
        >
          <EditIcon size={18} color="black" />
        </button>
        <button
          onClick={() => handleDelete(control)}
          className="text-red-500 hover:underline"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  })) || [];
console.log("Controles traidos",controles);  

  return (
    <DefaultLayout>
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Controles Registrados</h2>
      
      <div className="mb-6 flex justify-start">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                     hover:bg-green-700 transition-all duration-300 ease-in-out 
                     shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate("/cultivo/control")}
        >
          + Registrar Control
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
        title="Editar Control"
        onConfirm={() => {
          if (selectedControl && selectedControl.id !== undefined) {
            actualizarMutation.mutate(
              { id: selectedControl.id, control: selectedControl },
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Afección</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedControl?.afeccion_id || 0}
              onChange={(e) => setSelectedControl(prev => ({
                ...prev!,
                afeccion_id: Number(e.target.value)
              }))}
              required
            >
              <option value="0">Seleccione una afección</option>
              {afecciones?.map(a => (
                <option key={a.id} value={a.id}>
    {`${a.nombre} (${a.plaga?.nombre || 'Desconocida'})`}
  </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Control</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedControl?.tipo_control_id || 0}
              onChange={(e) => setSelectedControl(prev => ({
                ...prev!,
                tipo_control_id: Number(e.target.value)
              }))}
              required
            >
              <option value="0">Seleccione un tipo de control</option>
              {tipoControles?.map(t => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedControl?.producto_id || 0}
              onChange={(e) => setSelectedControl(prev => ({
                ...prev!,
                producto_id: Number(e.target.value)
              }))}
              required
            >
              <option value="0">Seleccione un producto</option>
              {productos?.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <ReuInput
            label="Descripción"
            placeholder="Descripción del control aplicado"
            type="textarea"
            value={selectedControl?.descripcion || ''}
            onChange={(e) => setSelectedControl(prev => ({
              ...prev!,
              descripcion: e.target.value
            }))}
          />

          <ReuInput
            label="Fecha de Control"
            type="date"
            value={selectedControl?.fecha_control || ''}
            onChange={(e) => setSelectedControl(prev => ({
              ...prev!,
              fecha_control: e.target.value
            }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedControl?.responsable_id || 0}
              onChange={(e) => setSelectedControl(prev => ({
                ...prev!,
                responsable_id: Number(e.target.value)
              }))}
              required
            >
              <option value="0">Seleccione un responsable</option>
              {usuarios?.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Efectividad</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedControl?.efectividad || 50}
              onChange={(e) => setSelectedControl(prev => ({
                ...prev!,
                efectividad: Number(e.target.value)
              }))}
              required
            >
              {efectividadOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <ReuInput
            label="Observaciones"
            placeholder="Observaciones adicionales"
            type="textarea"
            value={selectedControl?.observaciones || ''}
            onChange={(e) => setSelectedControl(prev => ({
              ...prev!,
              observaciones: e.target.value
            }))}
          />
        </div>
      </ReuModal>

      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este control?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>
    </DefaultLayout>

    
  );
};

export default ListaControlPage;