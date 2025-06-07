import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarBancal } from "@/hooks/cultivo/usebancal";
import { useLotes } from "@/hooks/cultivo/uselotes";
import { Bancal } from "@/types/cultivo/Bancal";
import { useState } from "react";
import { ModalLote } from "./ModalLote";
import { Plus } from "lucide-react";
interface ModalBancalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalBancal = ({ isOpen, onOpenChange, onSuccess }: ModalBancalProps) => {
  const [nuevoBancal, setNuevoBancal] = useState<Bancal>({
    nombre: "",
    tam_x: 0,
    tam_y: 0,
    latitud: 0,
    longitud: 0,
    lote: 0,
  });

  const { data: lotes } = useLotes();
  const mutation = useRegistrarBancal();
  const [openLote, setOpenLote] = useState(false);
  const [latitudStr, setLatitudStr] = useState("0");
  const [longitudStr, setLongitudStr] = useState("0");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoBancal(prev => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value)
    }));
  };

  const handleSubmit = () => {
     const latitud = parseFloat(latitudStr);
     const longitud = parseFloat(longitudStr);
      
    const bancalFinal: Bancal = {
      ...nuevoBancal,
      latitud: isNaN(latitud) ? 0 : latitud,
      longitud: isNaN(longitud) ? 0 : longitud,
    };
    mutation.mutate(bancalFinal, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevoBancal({
          nombre: "",
          tam_x: 0,
          tam_y: 0,
          latitud: 0,
          longitud: 0,
          lote: 0,
        });
        onSuccess?.();
      }
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Bancal"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <ModalLote
      isOpen={openLote}
      onOpenChange={setOpenLote}
      />
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevoBancal.nombre}
          onChange={(e) => setNuevoBancal({...nuevoBancal, nombre: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Tamaño X"
            placeholder="Ingrese tamaño X"
            type="number"
            value={nuevoBancal.tam_x.toString()}
            onChange={(e) => setNuevoBancal({...nuevoBancal, tam_x: parseFloat(e.target.value)})}
          />

          <ReuInput
            label="Tamaño Y"
            placeholder="Ingrese tamaño Y"
            type="number"
            value={nuevoBancal.tam_y.toString()}
            onChange={(e) => setNuevoBancal({...nuevoBancal, tam_y: parseFloat(e.target.value)})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <ReuInput
              label="Latitud"
              placeholder="Ingrese la latitud"
              type="text"
              value={latitudStr}
              onChange={(e) => setLatitudStr(e.target.value)}
              />
            
            <ReuInput
              label="Longitud"
              placeholder="Ingrese la longitud"
              type="text"
              value={longitudStr}
              onChange={(e) => setLongitudStr(e.target.value)}
              />
        </div>

        <div>
           <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Lote</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenLote(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="lote"
            value={nuevoBancal.lote || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
          >
            <option value="0">Seleccione un lote</option>
            {lotes?.map((lote) => (
              <option key={lote.id} value={lote.id}>{lote.nombre}</option>
            ))}
          </select>
        </div>
      </div>
    </ReuModal>
  );
};