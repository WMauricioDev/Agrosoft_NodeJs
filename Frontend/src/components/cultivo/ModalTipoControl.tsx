import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarTipoControl } from "@/hooks/cultivo/usetipocontrol";
import { TipoControl } from "@/types/cultivo/TipoControl";
import { useState } from "react";


interface ModalTipoControlProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalTipoControl = ({ isOpen, onOpenChange }: ModalTipoControlProps) => {
  const [nuevoTipoControl, setNuevoControl] = useState<TipoControl>({
    nombre: "",
    descripcion: "",
  });

  const mutation = useRegistrarTipoControl();


 
   const handleSubmit = () => {
     mutation.mutate(nuevoTipoControl);
   };


  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Tipo de Control"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevoTipoControl.nombre}
          onChange={(e) => setNuevoControl({... nuevoTipoControl, nombre : e.target.value}) }
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={nuevoTipoControl.descripcion}
          onChange={(e) => setNuevoControl ({... nuevoTipoControl, descripcion: e.target.value})}
        />

      </div>
    </ReuModal>
  );
};