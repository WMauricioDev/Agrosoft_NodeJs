import React, { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarTipoResiduo } from "@/hooks/cultivo/useTipoResiduo";
import { TipoResiduo } from "@/types/cultivo/TipoResiduo";

interface ModalTipoResiduoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalTipoResiduo: React.FC<ModalTipoResiduoProps> = ({ 
  isOpen, 
  onOpenChange,
  onSuccess
}) => {
  const [nuevoTipoResiduo, setNuevoTipoResiduo] = useState<TipoResiduo>({
    nombre: "",
    descripcion: "",
  });

  const mutation = useRegistrarTipoResiduo();

  

  const handleSubmit = () => {
    mutation.mutate(nuevoTipoResiduo, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevoTipoResiduo({
          nombre: "",
          descripcion: "",
        });
        onSuccess?.();
      }
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Tipo de Residuo"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          name="nombre"
          placeholder="Ingrese el nombre del tipo de residuo"
          type="text"
          value={nuevoTipoResiduo.nombre}
          onChange={(e) => setNuevoTipoResiduo({... nuevoTipoResiduo, nombre: e.target.value})}
        />

        <ReuInput
          label="Descripción"
          name="descripcion"
          placeholder="Ingrese la descripción"
          type="text"
          value={nuevoTipoResiduo.descripcion}
          onChange={(e) => setNuevoTipoResiduo({... nuevoTipoResiduo, descripcion: e.target.value})}
        />
      </div>
    </ReuModal>
  );
};