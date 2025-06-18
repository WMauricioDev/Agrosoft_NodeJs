import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { IngresosEgresos } from "@/types/reportes/IngresosEgresos";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/finanzas/ingresos-egresos/reporte_pdf/`;

const fetchIngresosEgresosGraficas = async (fechaInicio: string, fechaFin: string): Promise<IngresosEgresos> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }
  if (!fechaInicio || !fechaFin) {
    throw new Error("Fechas de inicio y fin son requeridas.");
  }

  try {
    const response = await api.get(API_URL, {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin, format: 'json' },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al cargar datos: ${error.response?.statusText || error.message}`);
  }
};

export const useIngresosEgresosGraficas = (fechaInicio: string, fechaFin: string) => {
  return useQuery<IngresosEgresos, Error>({
    queryKey: ["ingresosEgresosGraficas", fechaInicio, fechaFin],
    queryFn: () => fetchIngresosEgresosGraficas(fechaInicio, fechaFin),
    enabled: !!fechaInicio && !!fechaFin,
    meta: {
      errorMessage: "Error al cargar los datos de ingresos y egresos para las gráficas",
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al cargar los datos",
        timeout: 3000,
      });
    },
  });
};