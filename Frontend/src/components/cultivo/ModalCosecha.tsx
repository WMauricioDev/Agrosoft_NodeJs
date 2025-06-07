import React, { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarCosecha } from "@/hooks/cultivo/usecosecha";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { Cosecha } from "@/types/cultivo/Cosecha";

interface ModalCosechaProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalCosecha = ({ isOpen, onOpenChange, onSuccess }: ModalCosechaProps) => {
  const [nuevaCosecha, setNuevaCosecha] = useState<Cosecha>({
    id_cultivo: 0,
    cantidad: 0,
    unidades_de_medida: 0,
    fecha: "",
    cultivo_nombre: "",
  });

  const { data: cultivos } = useCultivos();
  const { data: unidadesMedida } = useUnidadesMedida();
  const mutation = useRegistrarCosecha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaCosecha((prev) => ({
      ...prev,
      [name]: name === "unidades_de_medida" || name === "fecha" ? value : Number(value),
    }));
  };

  const handleSubmit = () => {
    mutation.mutate(nuevaCosecha, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevaCosecha({
          id_cultivo: 0,
          cantidad: 0,
          unidades_de_medida: 0,
          fecha: "",
          cultivo_nombre: "",
        });
        onSuccess?.();
      },
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nueva Cosecha"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cultivo</label>
          <select
            name="id_cultivo"
            value={nuevaCosecha.id_cultivo || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
          >
            <option value="0">Seleccione un cultivo</option>
            {cultivos?.map((cultivo) => (
              <option key={cultivo.id} value={cultivo.id}>{cultivo.nombre}</option>
            ))}
          </select>
        </div>

        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          value={nuevaCosecha.cantidad.toString()}
          onChange={(e) =>
            setNuevaCosecha({ ...nuevaCosecha, cantidad: Number(e.target.value) })
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
          <select
            name="unidades_de_medida"
            value={nuevaCosecha.unidades_de_medida || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
          >
            <option value="0">Seleccione una unidad</option>
            {unidadesMedida?.map((unidad) => (
              <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
            ))}
          </select>
        </div>

        <ReuInput
          label="Fecha de recolección"
          type="date"
          value={nuevaCosecha.fecha}
          onChange={(e) => setNuevaCosecha({ ...nuevaCosecha, fecha: e.target.value })}
        />
      </div>
    </ReuModal>
  );
};