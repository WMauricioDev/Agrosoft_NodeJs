import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/iot/datosmeteorologicos`;

const fetchDatosMeteorologicos = async (params: { fecha_inicio?: string; fecha_fin?: string; fk_bancal_id?: number }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("[useDatosMeteorologicos] No se encontró el token de autenticación");
    throw new Error("No se encontró el token de autenticación");
  }

  console.log("[useDatosMeteorologicos] Enviando GET a", API_URL, "con params:", params);
  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    console.log("[useDatosMeteorologicos] Respuesta exitosa:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[useDatosMeteorologicos] Error en GET:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Error al obtener datos meteorológicos");
  }
};

export const useDatosMeteorologicos = (params: { fecha_inicio?: string; fecha_fin?: string; fk_bancal_id?: number } = {}) => {
  return useQuery({
    queryKey: ["datosMeteorologicos", params],
    queryFn: () => fetchDatosMeteorologicos(params),
    enabled: !!localStorage.getItem("access_token"),
  });
};