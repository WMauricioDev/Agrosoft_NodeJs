import React, { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarBodega } from "@/hooks/inventario/useBodega";
import { Bodega } from "@/types/inventario/Bodega";
import { Switch } from "@heroui/react";

interface ModalBodegaProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalBodega = ({ isOpen, onOpenChange, onSuccess }: ModalBodegaProps) => {
  const [nuevaBodega, setNuevaBodega] = useState<Omit<Bodega, "id">>({
    nombre: "",
    ubicacion: "",
    capacidad: 0,
    telefono: "",
    activo: true,
  });

  const mutation = useRegistrarBodega();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNuevaBodega((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "capacidad" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    mutation.mutate(nuevaBodega, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevaBodega({
          nombre: "",
          ubicacion: "",
          capacidad: 0,
          telefono: "",
          activo: true,
        });
        onSuccess?.();
      },
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nueva Bodega"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevaBodega.nombre}
          onChange={(e) => setNuevaBodega({ ...nuevaBodega, nombre: e.target.value })}
        />
        <ReuInput
          label="Ubicación"
          placeholder="Ingrese la ubicación"
          type="text"
          value={nuevaBodega.ubicacion}
          onChange={(e) => setNuevaBodega({ ...nuevaBodega, ubicacion: e.target.value })}
        />
        <ReuInput
          label="Capacidad"
          placeholder="Ingrese la capacidad"
          type="number"
          value={nuevaBodega.capacidad}
          onChange={(e) => setNuevaBodega({ ...nuevaBodega, capacidad: Number(e.target.value) })}
        />
        <ReuInput
          label="Teléfono"
          placeholder="Ingrese el teléfono"
          type="text"
          value={nuevaBodega.telefono}
          onChange={(e) => setNuevaBodega({ ...nuevaBodega, telefono: e.target.value })}
        />
        <div className="flex items-center">
            <Switch
                color="success"
                size="sm"
                isSelected={nuevaBodega.activo}
                onChange={(e) => setNuevaBodega({ ...nuevaBodega, activo: e.target.checked })}
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Activo</label>
        </div>
      </div>
    </ReuModal>
  );
};