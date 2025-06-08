import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { Salario } from "@/types/finanzas/Salario";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/fin/salarios/`;

// Función para formatear números al estilo colombiano (1.000.000)
export const formatColombianPeso = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Función para convertir string con formato a número
const parseColombianNumber = (value: string): number => {
  return parseFloat(value.replace(/\./g, '')) || 0;
};

export const useSalarios = () => {
  return useQuery({
    queryKey: ["salarios"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data as Salario[];
    },
    select: (data) => {
      return data.map((item) => ({
        ...item,
        valorJornalFormatted: formatColombianPeso(item.valorJornal),
        rol_nombre: item.rol_nombre || item.rol?.nombre || 'Sin rol'
      }));
    }
  });
};

export const useRegistrarSalario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (salario: Salario) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const valorNumerico = typeof salario.valorJornal === 'string'
        ? parseColombianNumber(salario.valorJornal)
        : salario.valorJornal;

      const payload = {
        rol_id: salario.rol_id,
        fecha_de_implementacion: salario.fecha_de_implementacion,
        valorJornal: valorNumerico,
        activo: salario.activo
      };

      const response = await api.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarios"] });
    },
  });
};

export const useActualizarSalario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (salario: Salario) => {
      const token = localStorage.getItem("access_token");
      if (!token || !salario.id) throw new Error("Token o ID faltante");

      const valorNumerico = typeof salario.valorJornal === 'string'
        ? parseColombianNumber(salario.valorJornal)
        : salario.valorJornal;

      const payload = {
        fecha_de_implementacion: salario.fecha_de_implementacion,
        valorJornal: valorNumerico
      };

      console.log("📌 Actualizando salario:", payload);

      const response = await api.put(`${API_URL}${salario.id}/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarios"] });
    },
    onError: (error: any) => {
      console.error("Error al actualizar salario:", error.message);
    },
  });
};

export const useEliminarSalario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      await api.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarios"] });
    },
    onError: (error: any) => {
      console.error("Error al eliminar salario:", error.message);
    },
  });
};