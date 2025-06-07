import { useState, useEffect } from "react";
import { addToast } from "@heroui/react";
import { Sensor, TipoSensor } from "@/types/iot/type";
import { Bancal } from "@/types/cultivo/Bancal";

interface UseModalSensorFormProps {
  sensor: Sensor;  
  tipoSensores: TipoSensor[] | undefined;
  bancales: Bancal[] | undefined;
  onConfirm: (editedSensor: Sensor | null) => void;
  isDelete?: boolean;
}

export const useModalSensorForm = ({
  sensor,
  tipoSensores,
  bancales,
  onConfirm,
  isDelete = false,
}: UseModalSensorFormProps) => {
  const [editedSensor, setEditedSensor] = useState<Sensor | null>(null);
  const [tipoSensoresError, setTipoSensoresError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("[useModalSensorForm] Sensor recibido: ", sensor);
    console.log("[useModalSensorForm] Tipos de sensores disponibles: ", tipoSensores);

    if (!sensor || !tipoSensores) {
      console.error("[useModalSensorForm] Sensor o tipoSensores no disponibles: ", { sensor, tipoSensores });
      setTipoSensoresError(new Error("Datos necesarios no disponibles."));
      return;
    }

    const tipoSensor = tipoSensores.find((type) => type.nombre === sensor.tipo_sensor) || null;
    const updatedSensor = {
      ...sensor,
      tipo_sensor_id: tipoSensor ? tipoSensor.id : sensor.tipo_sensor_id || 0,
      unidad_medida: tipoSensor ? tipoSensor.unidad_medida : sensor.unidad_medida || "",
    };

    console.log("[useModalSensorForm] Actualizando editedSensor: ", updatedSensor);
    setEditedSensor(updatedSensor);
  }, [sensor, tipoSensores]);

  const handleChange = (
    field: keyof Sensor,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    console.log(`[useModalSensorForm] Cambio en el campo ${field}: `, value);
    setEditedSensor((prev) => {
      if (!prev) {
        console.error("[useModalSensorForm] editedSensor es null al intentar cambiar el campo: ", field);
        addToast({
          title: "Error",
          description: "No se puede modificar el sensor. Intente de nuevo.",
          timeout: 3000,
          color: "danger",
        });
        return prev;
      }
      if (field === "tipo_sensor") {
        const tipoSensor = tipoSensores?.find((type) => type.nombre === value);
        console.log("[useModalSensorForm] Buscando tipo de sensor: ", { value, tipoSensor, tipoSensores });
        if (!tipoSensor) {
          console.error("[useModalSensorForm] Tipo de sensor no encontrado: ", value);
          addToast({
            title: "Error",
            description: `El tipo de sensor "${value}" no es válido.`,
            timeout: 3000,
            color: "danger",
          });
          return prev;
        }
        const newSensor = {
          ...prev,
          tipo_sensor: value,
          tipo_sensor_id: tipoSensor.id,
          unidad_medida: tipoSensor.unidad_medida || "",
          medida_minima: tipoSensor.medida_minima || 0,
          medida_maxima: tipoSensor.medida_maxima || 0,
        };
        console.log("[useModalSensorForm] Nuevo estado de editedSensor tras cambio de tipo_sensor: ", newSensor);
        return newSensor;
      }
      const newSensor = {
        ...prev,
        [field]:
          field === "medida_minima" || field === "medida_maxima"
            ? Number(value)
            : field === "bancal_id"
            ? value === ""
              ? null
              : Number(value)
            : value,
      };
      console.log("[useModalSensorForm] Nuevo estado de editedSensor: ", newSensor);
      return newSensor;
    });
  };

  const handleConfirm = () => {
    console.log("[useModalSensorForm] Confirmando acción. isDelete: ", isDelete, "editedSensor: ", editedSensor);
    if (!isDelete) {
      if (!editedSensor) {
        console.error("[useModalSensorForm] Validación fallida: editedSensor es null");
        addToast({
          title: "Error",
          description: "No se puede guardar. El sensor no está inicializado.",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (!editedSensor.tipo_sensor || !editedSensor.tipo_sensor_id || editedSensor.tipo_sensor_id <= 0) {
        console.error("[useModalSensorForm] Validación fallida: tipo_sensor o tipo_sensor_id inválido", {
          tipo_sensor: editedSensor.tipo_sensor,
          tipo_sensor_id: editedSensor.tipo_sensor_id,
        });
        addToast({
          title: "Error",
          description: "Por favor, seleccione un tipo de sensor válido.",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (editedSensor.bancal_id && !bancales?.some((b) => b.id === editedSensor.bancal_id)) {
        console.error("[useModalSensorForm] Validación fallida: bancal_id no existe", {
          bancal_id: editedSensor.bancal_id,
          bancales,
        });
        addToast({
          title: "Error",
          description: "El bancal seleccionado no existe.",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
      if (!editedSensor.nombre) {
        console.error("[useModalSensorForm] Validación fallida: nombre es obligatorio");
        addToast({
          title: "Error",
          description: "El nombre del sensor es obligatorio.",
          timeout: 3000,
          color: "danger",
        });
        return;
      }
    }
    onConfirm(editedSensor);
  };

  return {
    editedSensor,
    handleChange,
    handleConfirm,
    tipoSensoresError,
    setTipoSensoresError,
  };
};