import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useCrearAfeccion } from "@/hooks/cultivo/useAfecciones";
import { Afeccion } from "@/types/cultivo/Afeccion";
import { useState } from "react";
import { usePlagas } from "@/hooks/cultivo/useplaga";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { Plus } from "lucide-react";
import { ModalPlaga } from "./ModalPlaga";
import { ModalCultivo } from "./ModalCultivo";
import { ModalBancal } from "./ModalBancal";

interface ModalAfeccionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalAfeccion = ({ isOpen, onOpenChange, onSuccess }: ModalAfeccionProps) => {
  const [nuevaAfeccion, setNuevaAfeccion] = useState<Omit<Afeccion, 'id' | 'estado'>>({
    nombre: "",
    descripcion: "",
    fecha_deteccion: new Date().toISOString().slice(0, 10),
    gravedad: "M",
    plaga_id: 0,
    cultivo_id: 0,
    bancal_id: 0,
    reporte: null
  });

  const [openPlaga, setOpenPlaga] = useState(false);
  const [openCultivo, setOpenCultivo] = useState(false);
  const [openBancal, setOpenBancal] = useState(false);

  const { data: plagas } = usePlagas();
  const { data: cultivos } = useCultivos();
  const { data: bancales } = useBancales();
  const mutation = useCrearAfeccion();

  const handleSubmit = () => {
    mutation.mutate(nuevaAfeccion, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaAfeccion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nueva Afección"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
      size="lg"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Nombre descriptivo de la afección"
          type="text"
          name="nombre"
          value={nuevaAfeccion.nombre}
          onChange={handleChange}
        />

        <ReuInput
          label="Descripción"
          placeholder="Detalles de la afección"
          type="textarea"
          name="descripcion"
          value={nuevaAfeccion.descripcion}
          onChange={handleChange}
        />

        <ReuInput
          label="Fecha de Detección"
          type="date"
          name="fecha_deteccion"
          value={nuevaAfeccion.fecha_deteccion}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gravedad</label>
          <select
            name="gravedad"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nuevaAfeccion.gravedad}
            onChange={handleChange}
            required
          >
            <option value="L">Leve</option>
            <option value="M">Moderada</option>
            <option value="G">Grave</option>
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Plaga</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenPlaga(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="plaga_id"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nuevaAfeccion.plaga_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una plaga</option>
            {plagas?.map(plaga => (
              <option key={plaga.id} value={plaga.id}>{plaga.nombre}</option>
            ))}
          </select>
          <ModalPlaga
            isOpen={openPlaga}
            onOpenChange={setOpenPlaga}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Cultivo</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenCultivo(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="cultivo_id"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nuevaAfeccion.cultivo_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cultivo</option>
            {cultivos?.map(cultivo => (
              <option key={cultivo.id} value={cultivo.id}>{cultivo.nombre}</option>
            ))}
          </select>
          <ModalCultivo
            isOpen={openCultivo}
            onOpenChange={setOpenCultivo}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Bancal</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenBancal(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="bancal_id"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nuevaAfeccion.bancal_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un bancal</option>
            {bancales?.map(bancal => (
              <option key={bancal.id} value={bancal.id}>{bancal.nombre}</option>
            ))}
          </select>
          <ModalBancal
            isOpen={openBancal}
            onOpenChange={setOpenBancal}
          />
        </div>
      </div>
    </ReuModal>
  );
};