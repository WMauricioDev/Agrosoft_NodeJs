import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { ReportePagoDetalle } from "@/types/finanzas/ReporteEgresos";  
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/finanzas/pago/reporte_pdf/`;

const fetchReportes = async (): Promise<ReportePagoDetalle[]> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const crearReporte = async (reporte: {
  usuario_id: number;
  actividades: { id: number; nombre: string }[];
  salario: { id: number; descripcion: string; valor: number };
  total_pago: number;
  fecha_pago: string;
  mes: string;
}) => {
  const token = localStorage.getItem("access_token");
  return axios.post(API_URL, reporte, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const actualizarEstadoReporte = async (
  id: number,
  estado: "RE" | "AT"
) => {
  const token = localStorage.getItem("access_token");
  const endpoint = estado === "RE" ? "revisar" : "atender";
  return axios.post(`${API_URL}${id}/${endpoint}/`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useReportesPagoDetalle = (filters?: { estado?: string }) => {
  return useQuery<ReportePagoDetalle[], Error>({
    queryKey: ["reportesPagoDetalle", filters],
    queryFn: () => fetchReportes(),
  });
};

export const useCrearReportePagoDetalle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearReporte,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportesPagoDetalle"] });
      addToast({
        title: "Éxito",
        description: "Reporte de pago creado correctamente",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear el reporte",
        timeout: 3000,
      });
    },
  });
};

export const useActualizarEstadoReporte = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: "RE" | "AT" }) =>
      actualizarEstadoReporte(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportesPagoDetalle"] });
      addToast({
        title: "Éxito",
        description: "Estado del reporte actualizado",
        timeout: 3000,
      });
    },
  });
};

const fetchReporte = async (id: number): Promise<ReportePagoDetalle> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useReportePagoDetalle = (id: number) => {
  return useQuery<ReportePagoDetalle, Error>({
    queryKey: ["ReportePagoDetalle", id],
    queryFn: () => fetchReporte(id),
    enabled: !!id,
  });
};
