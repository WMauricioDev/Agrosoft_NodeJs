import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import {
  AnalisisCostoBeneficio,
  ResumenCosecha,
} from "../../types/finanzas/CostoBeneficio";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/finanzas`;

const getTokenHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔍 Filtro por nombre y/o fecha
export const useAnalisisFiltrado = (nombre?: string, fecha?: string) => {
  return useQuery<AnalisisCostoBeneficio[]>({
    queryKey: ["analisis-filtrado", nombre, fecha],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (nombre) params.append("nombre", nombre);
      if (fecha) params.append("fecha", fecha);

      const { data } = await api.get(
        `${API_URL}/costos-beneficio/listar/?${params.toString()}`,
        getTokenHeaders()
      );
      return data;
    },
    enabled: !!nombre || !!fecha, // Solo corre si hay algún filtro activo
  });
};

// 📊 Resumen financiero general
export const useResumenCosechas = () => {
  return useQuery<ResumenCosecha[]>({
    queryKey: ["resumen-cosechas"],
    queryFn: async () => {
      const { data } = await api.get(
        `${API_URL}/costo-beneficio/resumen-financiero/`,
        getTokenHeaders()
      );

      console.log("Respuesta del resumen financiero:", data);

      if (!data || !data.ultimos_analisis) {
        throw new Error("La respuesta no contiene 'ultimos_analisis'");
      }

      return data.ultimos_analisis;
    },
  });
};

// 📋 Detalle por cosecha específica
export const useAnalisisPorCosecha = (cosechaId: number) => {
  return useQuery<AnalisisCostoBeneficio>({
    queryKey: ["analisis-cosecha", cosechaId],
    queryFn: async () => {
      const { data } = await api.get(
        `${API_URL}/costo-beneficio/por-cosecha/${cosechaId}/`,
        getTokenHeaders()
      );
      return data;
    },
    enabled: !!cosechaId,
  });
};
