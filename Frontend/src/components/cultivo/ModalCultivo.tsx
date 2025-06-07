import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarCultivo } from "@/hooks/cultivo/useCultivo";
import { useEspecies } from "@/hooks/cultivo/useEspecie";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { Cultivo } from "@/types/cultivo/Cultivo";
import { useState } from "react";
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { ModalBancal } from "./ModalBancal";
import { Plus } from 'lucide-react';
import { ModalEspecie } from "./ModalEspecie";
import { Switch } from "@heroui/react";
interface ModalCultivoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalCultivo = ({ isOpen, onOpenChange, onSuccess }: ModalCultivoProps) => {
  const [nuevoCultivo, setNuevoCultivo] = useState<Cultivo>({
    nombre: "",
    unidad_de_medida: 0,
    activo: false,
    fechaSiembra: "",
    Especie: 0,
    Bancal: 0,
  });

  const { data: especies } = useEspecies();
  const { data: bancales } = useBancales();
  const mutation = useRegistrarCultivo();
  const { data: unidadesMedida, isLoading: loadingUnidadesMedida } = useUnidadesMedida();
  const [openBancal, setOpenBancal] = useState(false);
  const [openEspecie, setOpenEspecie] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setNuevoCultivo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'Especie' || name === 'Bancal') ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    mutation.mutate(nuevoCultivo, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevoCultivo({
          nombre: "",
          unidad_de_medida:0,
          activo: false,
          fechaSiembra: "",
          Especie: 0,
          Bancal: 0,
        });
        onSuccess?.();
      }
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Cultivo"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
    <ModalBancal
    isOpen={openBancal}
    onOpenChange={setOpenBancal}
    />
    <ModalEspecie
    isOpen={openEspecie}
    onOpenChange={setOpenEspecie}
    />
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevoCultivo.nombre}
          onChange={(e)=> setNuevoCultivo({...nuevoCultivo, nombre: e.target.value})}
        />

<div>
            <label className="block text-sm font-medium text-gray-700">Unidad de medida</label>
                    <select
                        value={nuevoCultivo.unidad_de_medida}
                        onChange={(e) => setNuevoCultivo({ ...nuevoCultivo, unidad_de_medida: Number(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        disabled={loadingUnidadesMedida}
                    >
                        <option value="">Seleccione una unidad</option>
                        {unidadesMedida?.map((unidad) => (
                            <option key={unidad.id} value={unidad.id}>
                                {unidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>

        <ReuInput
          label="Fecha de Siembra"
          type="date"
          value={nuevoCultivo.fechaSiembra}
          onChange={(e)=> setNuevoCultivo({...nuevoCultivo, fechaSiembra: e.target.value})}
        />

        <div className="flex items-center gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Switch
            color="success"
            size="sm"
            isSelected={nuevoCultivo.activo}
            onChange={() =>
              setNuevoCultivo((prev) => ({ ...prev, activo: !prev.activo }))
            }
          />
        </div>

        <div>
           <div className="flex items-center gap-2 mb-1">
                      <label className="block text-sm font-medium text-gray-700">Especie</label>
                      <button 
                        className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => setOpenEspecie(true)}
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
          
          <select
            name="Especie"
            value={nuevoCultivo.Especie || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
          >
            <option value="0">Seleccione una especie</option>
            {especies?.map((especie) => (
              <option key={especie.id} value={especie.id}>{especie.nombre}</option>
            ))}
          </select>
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
            name="Bancal"
            value={nuevoCultivo.Bancal || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
          >
            <option value="0">Seleccione un bancal</option>
            {bancales?.map((bancal) => (
              <option key={bancal.id} value={bancal.id}>{bancal.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </ReuModal>
  );
};