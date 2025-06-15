import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Sensor } from "@/types/iot/type";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/iot/sensores`;

const updateSensor = async (sensor: Sensor) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("[useUpdateSensor] No se encontró el token de autenticación.");
    throw new Error("No se encontró el token de autenticación.");
  }

  if (!sensor.tipo_sensor_id || sensor.tipo_sensor_id <= 0) {
    console.error("[useUpdateSensor] Validación fallida: tipo_sensor_id inválido", sensor);
    throw new Error("El tipo de sensor es inválido.");
  }

  const sensorData = {
    nombre: sensor.nombre,
    tipo_sensor_id: sensor.tipo_sensor_id,
    descripcion: sensor.descripcion || "",
    medida_minima: parseFloat(Number(sensor.medida_minima).toFixed(2)),
    medida_maxima: parseFloat(Number(sensor.medida_maxima).toFixed(2)),
    device_code: sensor.device_code || null,
    estado: sensor.estado,
    bancal_id: sensor.bancal_id || null,
  };

  console.log("[useUpdateSensor] Enviando PUT a /api/iot/sensores/" + sensor.id + " con datos:", JSON.stringify(sensorData, null, 2));
  try {
    const response = await api.put(`${API_URL}/${sensor.id}`, sensorData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[useUpdateSensor] Respuesta de PUT /api/iot/sensores/" + sensor.id + ": ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      Object.entries(error.response?.data || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ") ||
      "Error al actualizar el sensor";
    console.error("[useUpdateSensor] Error en PUT /api/iot/sensores/" + sensor.id + ": ", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(errorMessage);
  }
};

export const useUpdateSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSensor,
    onSuccess: (data) => {
      console.log("[useUpdateSensor] Sensor actualizado con éxito: ", data);
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
      addToast({
        title: "Éxito",
        description: "Sensor actualizado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("[useUpdateSensor] Error al actualizar sensor: ", error);
      addToast({
        title: "Error",
        description: error.message,
        timeout: 5000,
        color: "danger",
      });
    },
  });
};