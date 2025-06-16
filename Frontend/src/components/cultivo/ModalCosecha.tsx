import React, { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarCosecha } from "@/hooks/cultivo/usecosecha";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { Cosecha } from "@/types/cultivo/Cosecha";
import { addToast } from "@heroui/react";

interface ModalCosechaProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalCosecha = ({ isOpen, onOpenChange, onSuccess }: ModalCosechaProps) => {
  const [nuevaCosecha, setNuevaCosecha] = useState<Cosecha>({
    id_cultivo_id: 0,
    cantidad: 0,
    unidades_de_medida_id: 0,
    fecha: "",
    cultivo_nombre: "",
  });

  const { data: cultivos, isLoading: isLoadingCultivos } = useCultivos();
  const { data: unidadesMedida, isLoading: isLoadingUnidades } = useUnidadesMedida();
  const mutation = useRegistrarCosecha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaCosecha((prev) => ({
      ...prev,
      [name]: name === "fecha" ? value : name === "cultivo_nombre" ? value : Number(value),
    }));
  };

  const handleSubmit = () => {
    // Validaciones
    if (nuevaCosecha.id_cultivo_id === 0) {
      addToast({
        title: "Error",
        description: "Seleccione un cultivo válido",
        timeout: 3000,
        color: "danger",
      });
      return;
    }
    if (nuevaCosecha.cantidad <= 0) {
      addToast({
        title: "Error",
        description: "La cantidad debe ser mayor a 0",
        timeout: 3000,
        color: "danger",
      });
      return;
    }
    if (nuevaCosecha.unidades_de_medida_id === 0) {
      addToast({
        title: "Error",
        description: "Seleccione una unidad de medida válida",
        timeout: 3000,
        color: "danger",
      });
      return;
    }
    if (!nuevaCosecha.fecha) {
      addToast({
        title: "Error",
        description: "La fecha es requerida",
        timeout: 3000,
        color: "danger",
      });
      return;
    }

    // Actualizar cultivo_nombre basado en el cultivo seleccionado
    const selectedCultivo = cultivos?.find((c) => c.id === nuevaCosecha.id_cultivo_id);
    const payload: Cosecha = {
      ...nuevaCosecha,
      cultivo_nombre: selectedCultivo?.nombre || "",
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevaCosecha({
          id_cultivo_id: 0,
          cantidad: 0,
          unidades_de_medida_id: 0,
          fecha: "",
          cultivo_nombre: "",
        });
        onSuccess?.();
      },
    });
  };

  if (isLoadingCultivos || isLoadingUnidades) {
    return <div>Cargando datos...</div>;
  }

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
            name="id_cultivo_id"
            value={nuevaCosecha.id_cultivo_id || ""}
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
            name="unidades_de_medida_id"
            value={nuevaCosecha.unidades_de_medida_id || ""}
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