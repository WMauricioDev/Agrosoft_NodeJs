import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import {ActividadCostosData } from "@/types/cultivo/ActividadCosto";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/cultivo/grafico_costos/`;

const fetchActividadCostos = async (
  fechaInicio: string,
  fechaFin: string,
  tipoGrafico: string
): Promise<ActividadCostosData> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  
  const response = await api.get(API_URL, {
    params: { 
      fecha_inicio: fechaInicio, 
      fecha_fin: fechaFin,
      tipo_grafico: tipoGrafico
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return response.data;
};

export const useActividadCostosGrafica = (
  fechaInicio: string,
  fechaFin: string,
  tipoGrafico: string = "barra"
) => {
  return useQuery<ActividadCostosData, Error>({
    queryKey: ["actividadCostos", fechaInicio, fechaFin, tipoGrafico],
    queryFn: () => fetchActividadCostos(fechaInicio, fechaFin, tipoGrafico),
    meta: {
      errorMessage: "Error al cargar los datos de costos por actividad"
    },
    throwOnError: (error) => {
      addToast({ 
        title: "Error", 
        description: error.message || "Error al cargar los datos de costos", 
        timeout: 3000 
      });
      return false;
    }
  });
};