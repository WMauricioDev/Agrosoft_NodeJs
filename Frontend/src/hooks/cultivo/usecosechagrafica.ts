import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { CosechaGraficaData } from "@/types/cultivo/CosechaGraficas";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/cultivo/cosechas/datos_graficas/`;

const fetchCosechaGraficas = async (fechaInicio: string, fechaFin: string): Promise<CosechaGraficaData> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  
  const response = await api.get(API_URL, {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useCosechaGraficas = (fechaInicio: string, fechaFin: string) => {
    return useQuery<CosechaGraficaData, Error>({
      queryKey: ["cosechaGraficas", fechaInicio, fechaFin],
      queryFn: () => fetchCosechaGraficas(fechaInicio, fechaFin),
      meta: {
        errorMessage: "Error al cargar los datos para las gráficas"
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