import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { ReportePlaga, ReportePlagaDetalle } from "@/types/cultivo/ReportePlaga";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/cultivo/reportes-plagas/`;

const fetchReportes = async (): Promise<ReportePlagaDetalle[]> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const crearReporte = async (reporte: Omit<ReportePlaga, 'id' | 'estado' | 'fecha_reporte'>) => {
  const token = localStorage.getItem("access_token");
  return axios.post(API_URL, {
    plaga_id: reporte.plaga_id,
    bancal_id: reporte.bancal_id,
    observaciones: reporte.observaciones
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const actualizarEstadoReporte = async (id: number, estado: 'RE' | 'AT') => {
  const token = localStorage.getItem("access_token");
  const endpoint = estado === 'RE' ? 'revisar' : 'atender';
  return axios.post(`${API_URL}${id}/${endpoint}/`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useReportesPlaga = (filters?: { estado?: string }) => {
  return useQuery<ReportePlagaDetalle[], Error>({
    queryKey: ["reportesPlaga", filters],
    queryFn: () => fetchReportes(),
  });
};

export const useCrearReportePlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearReporte,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportesPlaga"] });
      addToast({ 
        title: "Éxito", 
        description: "Reporte de plaga creado correctamente", 
        timeout: 3000,
        color:"success"
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear el reporte",
        timeout: 3000,
        color:"danger"
      });
    },
  });
};

export const useActualizarEstadoReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'RE' | 'AT' }) => 
      actualizarEstadoReporte(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportesPlaga"] });
      addToast({
        title: "Éxito",
        description: "Estado del reporte actualizado",
        timeout: 3000,
        color:"success"
      });
    },
  });
};

const fetchReporte = async (id: number): Promise<ReportePlagaDetalle> => {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const useReportePlaga = (id: number) => {
    return useQuery<ReportePlagaDetalle, Error>({
      queryKey: ["reportePlaga", id],
      queryFn: () => fetchReporte(id),
      enabled: !!id,
    });
  }