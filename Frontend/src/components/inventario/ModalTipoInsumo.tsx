import React, { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useCrearTipoInsumo } from "@/hooks/inventario/useInsumo";
import { TipoInsumo } from "@/types/inventario/Insumo";

interface ModalTipoInsumoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalTipoInsumo = ({ isOpen, onOpenChange, onSuccess }: ModalTipoInsumoProps) => {
  const mutation = useCrearTipoInsumo();

  const [tipoInsumo, setTipoInsumo] = useState<Omit<TipoInsumo, "id" | "fecha_creacion" | "creada_por_usuario">>({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTipoInsumo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    mutation.mutate(tipoInsumo, {
      onSuccess: () => {
        onOpenChange(false);
        setTipoInsumo({
          nombre: "",
          descripcion: "",
        });
        onSuccess?.();
      },
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Crear Nuevo Tipo de Insumo"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
      size="lg"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ej. Fertilizante"
          type="text"
          variant="bordered"
          radius="md"
          value={tipoInsumo.nombre}
          onChange={handleChange}
          name="nombre"
        />
        <ReuInput
          label="Descripción"
          placeholder="Descripción del tipo de insumo"
          type="text"
          variant="bordered"
          radius="md"
          value={tipoInsumo.descripcion || ""}
          onChange={handleChange}
          name="descripcion"
        />
      </div>
    </ReuModal>
  );
};