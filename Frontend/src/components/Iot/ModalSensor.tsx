import ReuModal from "@/components/globales/ReuModal";
import {ReuInput} from "@/components/globales/ReuInput"; 
import { Sensor } from "@/types/iot/type";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { useGetTipoSensores } from "@/hooks/iot/sensores/useGetTipoSensores";
import { useModalSensorForm } from "@/hooks/iot/sensores/useModalSensorForm";
import { addToast } from "@heroui/react";

interface ModalSensorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sensor: Sensor;  
  onConfirm: (editedSensor: Sensor | null) => void;
  isDelete?: boolean;
}

export const ModalSensor = ({ isOpen, onOpenChange, sensor, onConfirm, isDelete = false }: ModalSensorProps) => {
  const { data: bancales, isLoading: isLoadingBancales } = useBancales();
  const { data: tipoSensores, isLoading: isLoadingTipoSensores, error: tipoSensoresError } = useGetTipoSensores();
  const { editedSensor, handleChange, handleConfirm } = useModalSensorForm({
    sensor,
    tipoSensores,
    bancales,
    onConfirm,
    isDelete,
  });

  if (tipoSensoresError) {
    console.error("[ModalSensor] Error al cargar tipoSensores: ", {
      message: tipoSensoresError.message,
    });
    addToast({
      title: "Error",
      description: "No se pudieron cargar los tipos de sensores.",
      timeout: 5000,
      color: "danger",
    });
  }

  if (isLoadingTipoSensores || isLoadingBancales) {
    console.log("[ModalSensor] Cargando datos: tipoSensores=", isLoadingTipoSensores, "bancales=", isLoadingBancales);
    return <p>Cargando datos...</p>;
  }

  if (!tipoSensores?.length) {
    console.error("[ModalSensor] No hay tipos de sensores disponibles.");
    return <p>No hay tipos de sensores disponibles. Por favor, crea uno en el backend.</p>;
  }

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isDelete ? "¿Estás seguro de eliminar este sensor?" : "Editar Sensor"}
      onConfirm={handleConfirm}
      confirmText={isDelete ? "Eliminar" : "Guardar"}
      cancelText="Cancelar"
    >
      {isDelete ? (
        <p>Esta acción es irreversible.</p>
      ) : (
        <div className="space-y-4">
          <ReuInput
            label="Nombre"
            type="text"
            value={editedSensor?.nombre || ""}
            onChange={(e) => handleChange("nombre", e)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Sensor</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedSensor?.tipo_sensor || ""}
              onChange={(e) => handleChange("tipo_sensor", e)}
              required
            >
              <option value="">Seleccione un tipo de sensor</option>
              {tipoSensores.map((tipoSensor) => (
                <option key={tipoSensor.id} value={tipoSensor.nombre}>
                  {tipoSensor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
            <p className="mt-1 text-sm text-gray-900">{editedSensor?.unidad_medida || ""}</p>
          </div>
          <ReuInput
            label="Descripción"
            type="text"
            value={editedSensor?.descripcion || ""}
            onChange={(e) => handleChange("descripcion", e)}
          />
          <ReuInput
            label="Código del Dispositivo"
            type="text"
            value={editedSensor?.device_code || ""}
            onChange={(e) => handleChange("device_code", e)}
          />
          <div className="grid grid-cols-2 gap-4">
            <ReuInput
              label="Medida Mínima"
              type="number"
              step="0.01"
              value={editedSensor?.medida_minima?.toString() || "0"}
              onChange={(e) => handleChange("medida_minima", e)}
            />
            <ReuInput
              label="Medida Máxima"
              type="number"
              step="0.01"
              value={editedSensor?.medida_maxima?.toString() || "0"}
              onChange={(e) => handleChange("medida_maxima", e)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bancal</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedSensor?.bancal_id?.toString() || ""}
              onChange={(e) => handleChange("bancal_id", e)}
            >
              <option value="">Sin bancal</option>
              {bancales?.map((bancal) => (
                <option key={bancal.id} value={bancal.id}>
                  {bancal.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </ReuModal>
  );
};