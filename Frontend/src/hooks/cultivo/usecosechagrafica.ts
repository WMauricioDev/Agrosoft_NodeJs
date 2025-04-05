import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { CosechaGraficaData } from "@/types/cultivo/CosechaGraficas";

const API_URL = "http://127.0.0.1:8000/cultivo/cosechas/datos_graficas/";

const fetchCosechaGraficas = async (fechaInicio: string, fechaFin: string): Promise<CosechaGraficaData> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  
  const response = await axios.get(API_URL, {
    params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useCosechaGraficas = (fechaInicio: string, fechaFin: string) => {
    return useQuery<CosechaGraficaData, Error>({
      queryKey: ["cosechaGraficas", fechaInicio, fechaFin],
      queryFn: () => fetchCosechaGraficas(fechaInicio, fechaFin),
      // Configuración correcta para manejo de errores:
      meta: {
        errorMessage: "Error al cargar los datos para las gráficas"
      },
      // Alternativa moderna:
      throwOnError: (error) => {
        addToast({ 
          title: "Error", 
          description: error.message || "Error al cargar los datos", 
          timeout: 3000 
        });
        return false; // Evita que React Query maneje el error automáticamente
      }
    });
  };