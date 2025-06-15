import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { Sensor } from "@/types/iot/type";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/iot/sensores`;

const fetchSensores = async (): Promise<Sensor[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("[useSensores] No se encontró el token de autenticación.");
    throw new Error("No se encontró el token de autenticación.");
  }

  console.log("[useSensores] Enviando GET a /api/iot/sensores");
  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[useSensores] Respuesta de GET /api/iot/sensores: ", response.data);
    return response.data.map((sensor: any) => ({
      id: sensor.id || 0,
      nombre: sensor.nombre || "Sin nombre",
      tipo_sensor: sensor.tipo_sensor_nombre || "Desconocido",
      tipo_sensor_id: sensor.tipo_sensor_id || 0,
      unidad_medida: sensor.unidad_medida || "",
      descripcion: sensor.descripcion || "",
      estado: sensor.estado || "inactivo",
      medida_minima: parseFloat(sensor.medida_minima) || 0,
      medida_maxima: parseFloat(sensor.medida_maxima) || 0,
      device_code: sensor.device_code || null,
      bancal_id: sensor.bancal_id || null,
      bancal_nombre: sensor.bancal_nombre || "Sin bancal",
    }));
  } catch (error: any) {
    console.error("[useSensores] Error en GET /api/iot/sensores: ", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const useSensores = () => {
  const sensoresQuery = useQuery<Sensor[], Error>({
    queryKey: ["sensores"],
    queryFn: fetchSensores,
  });

  console.log("[useSensores] Estado actual: ", {
    sensores: sensoresQuery.data,
    isLoading: sensoresQuery.isLoading,
    error: sensoresQuery.error,
  });

  return {
    sensores: sensoresQuery.data || [],
    isLoading: sensoresQuery.isLoading,
    error: sensoresQuery.error,
  };
};