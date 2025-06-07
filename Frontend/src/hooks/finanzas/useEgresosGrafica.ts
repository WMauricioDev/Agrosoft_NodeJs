import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { PagoGraficaData } from "@/types/finanzas/EgresosGrafica";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/finanzas/pago/datos_graficas`;

const fetchPagoGraficas = async (fechaInicio: string, fechaFin: string): Promise<PagoGraficaData> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  
  const response = await api.get(API_URL, {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const usePagoGraficas = (fechaInicio: string, fechaFin: string) => {
  return useQuery<PagoGraficaData, Error>({
    queryKey: ["pagoGraficas", fechaInicio, fechaFin],
    queryFn: () => fetchPagoGraficas(fechaInicio, fechaFin),
    meta: {
      errorMessage: "Error al cargar los datos para las gráficas de pagos"
    },
    throwOnError: (error) => {
      addToast({ 
        title: "Error", 
        description: error.message || "Error al cargar los datos", 
        timeout: 3000 
      });
      return false;
    }
  });
};
