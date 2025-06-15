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

  if (!sensor.id) {
    console.error("[useUpdateSensor] Validación fallida: id es obligatorio", sensor);
    throw new Error("El ID del sensor es obligatorio.");
  }

  if (!sensor.tipo_sensor_id || sensor.tipo_sensor_id <= 0) {
    console.error("[useUpdateSensor] Validación fallida: tipo_sensor_id inválido", sensor);
    throw new Error("El tipo de sensor es inválido.");
  }

  if (!sensor.nombre) {
    console.error("[useUpdateSensor] Validación fallida: nombre es obligatorio", sensor);
    throw new Error("El nombre del sensor es obligatorio.");
  }

  if (!["activo", "inactivo"].includes(sensor.estado)) {
    console.error("[useUpdateSensor] Validación fallida: estado inválido", sensor);
    throw new Error("El estado debe ser 'activo' o 'inactivo'.");
  }

  const sensorData = {
    nombre: sensor.nombre,
    tipo_sensor_id: sensor.tipo_sensor_id,
    descripcion: sensor.descripcion || null,
    medida_minima: sensor.medida_minima != null ? parseFloat(Number(sensor.medida_minima).toFixed(2)) : null,
    medida_maxima: sensor.medida_maxima != null ? parseFloat(Number(sensor.medida_maxima).toFixed(2)) : null,
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
      error.response?.data?.message ||
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