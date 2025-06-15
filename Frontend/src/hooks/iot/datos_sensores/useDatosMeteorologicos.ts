import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { SensorData } from "@/types/iot/type";
import { obtenerNuevoToken } from "@/components/utils/refresh";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/iot/datosmeteorologicos`;

const fetchDatosMeteorologicos = async (sensorId: number, fechaInicio?: string, fechaFin?: string): Promise<SensorData[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    addToast({
      title: "Sesión expirada",
      description: "No se encontró el token de autenticación, por favor inicia sesión nuevamente.",
      timeout: 3000,
      color: "danger",
    });
    throw new Error("No se encontró el token de autenticación.");
  }

  try {
    console.log(`Fetching data for sensor ${sensorId}`);
    const response = await api.get(API_URL, {
      params: { fk_sensor_id: sensorId, fecha_inicio: fechaInicio, fecha_fin: fechaFin },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response from /api/iot/datosmeteorologicos:", response.data);
    return response.data.map((item: any) => ({
      id: item.id,
      fk_sensor: item.fk_sensor_id,
      temperatura: item.temperatura ?? null,
      humedad_ambiente: item.humedad_ambiente ?? null,
      luminosidad: item.luminosidad ?? null,
      humedad_suelo: item.humedad_suelo ?? null,
      lluvia: item.lluvia ?? null,
      ph_suelo: item.ph_suelo ?? null,
      direccion_viento: item.direccion_viento ?? null,
      velocidad_viento: item.velocidad_viento ?? null,
      fecha_medicion: item.fecha_medicion,
    }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        addToast({
          title: "Sesión expirada",
          description: "No se encontró el refresh token, por favor inicia sesión nuevamente.",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("No se encontró el refresh token.");
      }
      try {
        const newToken = await obtenerNuevoToken(refreshToken);
        localStorage.setItem("access_token", newToken);
        console.log(`Fetching data for sensor ${sensorId} with new token`);
        const response = await api.get(API_URL, {
          params: { fk_sensor_id: sensorId, fecha_inicio: fechaInicio, fecha_fin: fechaFin },
          headers: { Authorization: `Bearer ${newToken}` },
        });
        return response.data.map((item: any) => ({
          id: item.id,
          fk_sensor: item.fk_sensor_id,
          temperatura: item.temperatura ?? null,
          humedad_ambiente: item.humedad_ambiente ?? null,
          luminosidad: item.luminosidad ?? null,
          humedad_suelo: item.humedad_suelo ?? null,
          lluvia: item.lluvia ?? null,
          ph_suelo: item.ph_suelo ?? null,
          direccion_viento: item.direccion_viento ?? null,
          velocidad_viento: item.velocidad_viento ?? null,
          fecha_medicion: item.fecha_medicion,
        }));
      } catch (refreshError) {
        addToast({
          title: "Sesión expirada",
          description: "No se pudo refrescar el token, por favor inicia sesión nuevamente.",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("No se pudo refrescar el token");
      }
    } else {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar los datos meteorológicos",
        timeout: 3000,
        color: "danger",
      });
      throw error;
    }
  }
};

export const useDatosMeteorologicos = (sensorId: number, fechaInicio?: string, fechaFin?: string) => {
  return useQuery<SensorData[], Error>({
    queryKey: ["datosMeteorologicos", sensorId, fechaInicio, fechaFin],
    queryFn: () => fetchDatosMeteorologicos(sensorId, fechaInicio, fechaFin),
    enabled: !!sensorId,
    staleTime: 1000 * 60,
  });
};