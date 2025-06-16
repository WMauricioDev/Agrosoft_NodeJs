import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { obtenerNuevoToken } from "@/components/utils/refresh";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/iot/datoshistoricos`;

const fetchDatosHistoricos = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("[useDatosMeteorologicosHistoricos] No se encontró el token de autenticación.");
    addToast({
      title: "Sesión expirada",
      description: "No se encontró el token de autenticación, por favor inicia sesión nuevamente.",
      timeout: 3000,
      color: "danger",
    });
    throw new Error("No se encontró el token de autenticación.");
  }

  console.log("[useDatosMeteorologicosHistoricos] Enviando GET a /api/iot/datos-historicos");
  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("[useDatosMeteorologicosHistoricos] Respuesta de GET /api/iot/datos-historicos: ", response.data);
    if (!response.data || response.data.length === 0) {
      return [];
    }
    return response.data.map((item: any) => ({
      id: item.id || 0,
      sensor_nombre: item.sensor_nombre || "Desconocido",
      bancal_nombre: item.bancal_nombre || null,
      temperatura: item.temperatura != null ? parseFloat(item.temperatura) : null,
      humedad_ambiente: item.humedad_ambiente != null ? parseFloat(item.humedad_ambiente) : null,
      luminosidad: item.luminosidad != null ? parseFloat(item.luminosidad) : null,
      lluvia: item.lluvia != null ? parseFloat(item.lluvia) : null,
      velocidad_viento: item.velocidad_viento != null ? parseFloat(item.velocidad_viento) : null,
      direccion_viento: item.direccion_viento != null ? parseFloat(item.direccion_viento) : null,
      humedad_suelo: item.humedad_suelo != null ? parseFloat(item.humedad_suelo) : null,
      ph_suelo: item.ph_suelo != null ? parseFloat(item.ph_suelo) : null,
      fecha_promedio: item.fecha_promedio || "",
      cantidad_mediciones: item.cantidad_mediciones || 0,
    }));
  } catch (error: any) {
    console.error("[useDatosMeteorologicosHistoricos] Error en GET /api/iot/datos-historicos: ", error);
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
        console.log("[useDatosMeteorologicosHistoricos] Reintentando con nuevo token");
        const response = await api.get(API_URL, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        console.log("[useDatosMeteorologicosHistoricos] Respuesta de reintento: ", response.data);
        if (!response.data || response.data.length === 0) {
          return [];
        }
        return response.data.map((item: any) => ({
          id: item.id || 0,
          sensor_nombre: item.sensor_nombre || "Desconocido",
          bancal_nombre: item.bancal_nombre || null,
          temperatura: item.temperatura != null ? parseFloat(item.temperatura) : null,
          humedad_ambiente: item.humedad_ambiente != null ? parseFloat(item.humedad_ambiente) : null,
          luminosidad: item.luminosidad != null ? parseFloat(item.luminosidad) : null,
          lluvia: item.lluvia != null ? parseFloat(item.lluvia) : null,
          velocidad_viento: item.velocidad_viento != null ? parseFloat(item.velocidad_viento) : null,
          direccion_viento: item.direccion_viento != null ? parseFloat(item.direccion_viento) : null,
          humedad_suelo: item.humedad_suelo != null ? parseFloat(item.humedad_suelo) : null,
          ph_suelo: item.ph_suelo != null ? parseFloat(item.ph_suelo) : null,
          fecha_promedio: item.fecha_promedio || "",
          cantidad_mediciones: item.cantidad_mediciones || 0,
        }));
      } catch (refreshError: any) {
        console.error("[useDatosMeteorologicosHistoricos] Error al refrescar token: ", refreshError);
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
    } else if (error.response?.status === 404) {
      return [];
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
  return useQuery({
    queryKey: ["datosMeteorologicosHistoricos"],
    queryFn: fetchDatosHistoricos,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
};