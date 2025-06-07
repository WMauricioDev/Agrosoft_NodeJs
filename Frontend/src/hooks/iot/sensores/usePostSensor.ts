import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Sensor } from "@/types/iot/type";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/iot/sensores/`;

const createSensor = async (sensor: Sensor) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("[useCreateSensor] No se encontró el token de autenticación.");
    throw new Error("No se encontró el token de autenticación.");
  }

  if (!sensor.tipo_sensor_id || sensor.tipo_sensor_id <= 0) {
    console.error("[useCreateSensor] Validación fallida: tipo_sensor_id inválido", sensor);
    throw new Error("El tipo de sensor es inválido.");
  }

  const sensorData = {
    nombre: sensor.nombre,
    tipo_sensor_id: sensor.tipo_sensor_id,
    descripcion: sensor.descripcion || "",
    medida_minima: parseFloat(Number(sensor.medida_minima).toFixed(2)),
    medida_maxima: parseFloat(Number(sensor.medida_maxima).toFixed(2)),
    device_code: sensor.device_code || null,
    estado: sensor.estado || "inactivo",
    bancal_id: sensor.bancal_id || null,
  };

  console.log("[useCreateSensor] Enviando POST a /iot/sensores/ con datos:", JSON.stringify(sensorData, null, 2));
  try {
    const response = await api.post(API_URL, sensorData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[useCreateSensor] Respuesta de POST /iot/sensores/: ", response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      Object.entries(error.response?.data || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ") ||
      "Error al crear el sensor";
    console.error("[useCreateSensor] Error en POST /iot/sensores/: ", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(errorMessage);
  }
};

export const useCreateSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSensor,
    onSuccess: (data) => {
      console.log("[useCreateSensor] Sensor creado con éxito: ", data);
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
      addToast({
        title: "Éxito",
        description: "Sensor creado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("[useCreateSensor] Error al crear sensor: ", error);
      addToast({
        title: "Error",
        description: error.message,
        timeout: 5000,
        color: "danger",
      });
    },
  });
};