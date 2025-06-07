import React, { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarBodega } from "@/hooks/inventario/useBodega";
import { Bodega } from "@/types/inventario/Bodega";

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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="activo"
            checked={nuevaBodega.activo}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Activo</span>
        </label>
      </div>
    </ReuModal>
  );
};