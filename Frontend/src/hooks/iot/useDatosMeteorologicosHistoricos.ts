import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { SensorData } from "@/types/iot/type";
import { obtenerNuevoToken } from "@/components/utils/refresh";

const API_URL = "http://192.168.1.12:8000/iot/datosmeteorologicos/";

const fetchDatosHistoricos = async (): Promise<SensorData[]> => {
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
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((item: any) => ({
      id: item.id,
      fk_sensor: item.fk_sensor,
      temperatura: item.temperatura || null,
      humedad_ambiente: item.humedad_ambiente || null,
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
        const response = await api.get(API_URL, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        return response.data.map((item: any) => ({
          id: item.id,
          fk_sensor: item.fk_sensor,
          temperatura: item.temperatura || null,
          humedad_ambiente: item.humedad_ambiente || null,
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
    } else if (error.response?.status === 403) {
      addToast({
        title: "Acceso denegado",
        description: "No tienes permiso para realizar esta acción, contacta a un administrador.",
        timeout: 3000,
        color: "danger",
      });
    } else {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al cargar los datos históricos",
        timeout: 3000,
        color: "danger",
      });
    }
    throw error;
  }
};

export const useDatosMeteorologicosHistoricos = () => {
  return useQuery<SensorData[], Error>({
    queryKey: ["datosMeteorologicosHistoricos"],
    queryFn: fetchDatosHistoricos,
    staleTime: 1000 * 60,
  });
};