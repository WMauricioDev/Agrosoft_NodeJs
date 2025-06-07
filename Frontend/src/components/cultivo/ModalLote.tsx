import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarLote } from "@/hooks/cultivo/uselotes";
import { Lote } from "@/types/cultivo/Lotes";
import { useState } from "react";
import { Switch } from "@heroui/react";


interface ModalLoteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalLote = ({ isOpen, onOpenChange, onSuccess }: ModalLoteProps) => {
  const [nuevoLote, setNuevoLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    activo: false,
    tam_x: 0,
    tam_y: 0,
    latitud: 0,
    longitud: 0,
  });
    const [latitudStr, setLatitudStr] = useState("0");
    const [longitudStr, setLongitudStr] = useState("0");

  const mutation = useRegistrarLote();

  const handleSubmit = () => {
     const latitud = parseFloat(latitudStr);
      const longitud = parseFloat(longitudStr);
    
      const loteFinal: Lote = {
        ...nuevoLote,
        latitud: isNaN(latitud) ? 0 : latitud,
        longitud: isNaN(longitud) ? 0 : longitud,
      };
    mutation.mutate(loteFinal, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevoLote({
          nombre: "",
          descripcion: "",
          activo: false,
          tam_x: 0,
          tam_y: 0,
          latitud: 0,
          longitud: 0,
        });
        onSuccess?.();
      }
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Lote"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevoLote.nombre}
          onChange={(e) => setNuevoLote({... nuevoLote, nombre: e.target.value})}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={nuevoLote.descripcion}
          onChange={(e) => setNuevoLote({... nuevoLote, descripcion: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Tamaño X"
            placeholder="Ingrese tamaño X"
            type="number"
            value={nuevoLote.tam_x.toString()}
            onChange={(e) => setNuevoLote({... nuevoLote, tam_x: parseFloat(e.target.value)})}
            />

          <ReuInput
            label="Tamaño Y"
            placeholder="Ingrese tamaño Y"
            type="number"
            value={nuevoLote.tam_y.toString()}
            onChange={(e) => setNuevoLote({... nuevoLote, tam_y: parseFloat (e.target.value)})}
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
        <div className="flex items-center gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Switch
            color="success"
            size="sm"
            isSelected={nuevoLote.activo}
            onChange={() =>
              setNuevoLote((prev) => ({ ...prev, activo: !prev.activo }))
            }
          />
        </div>
      </div>
    </ReuModal>
  );
};