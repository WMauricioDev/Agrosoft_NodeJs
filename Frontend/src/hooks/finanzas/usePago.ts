import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Pago, CalculoPagoParams, PagoCreateParams } from "@/types/finanzas/Pago";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/fin/pago/`;

const fetchPagos = async (): Promise<Pago[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const calcularPago = async (params: CalculoPagoParams): Promise<Pago> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await api.post(`${BASE_URL}/api/fin/pago/calcular_pago/`, params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const crearPago = async (params: PagoCreateParams): Promise<Pago> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await api.post(API_URL, params, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const eliminarPago = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const usePagos = () => {
  return useQuery<Pago[], Error>({
    queryKey: ["pagos"],
    queryFn: fetchPagos,
  });
};

export const useCalcularPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: calcularPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      addToast({ 
        title: "Éxito", 
        description: "Pago calculado y registrado con éxito", 
        timeout: 3000,
        color: "success"
      });
    },
    onError: (error: any) => {
      console.error("Error completo al calcular el pago:", error); // Log existente
      console.log("Respuesta del servidor:", error.response?.data); // Añade este log
      let errorMessage = "Error al calcular el pago";
      
      if (error.response) {
        if (error.response.status === 403) {
          addToast({
            title: "Acceso denegado",
            description: "No tienes permiso para realizar esta acción, contacta a un administrador",
            timeout: 3000,
            color: "warning"
          });
          return;
        }
        errorMessage = error.response.data?.message || error.response.data?.detail || "Error al calcular el pago";
      } else if (error.request) {
        errorMessage = "No se pudo conectar al servidor. Verifica que el servidor esté corriendo y la URL sea correcta.";
      } else {
        errorMessage = error.message || "Error desconocido al calcular el pago";
      }

      addToast({
        title: "Error",
        description: errorMessage,
        timeout: 3000,
        color: "danger"
      });
    },
  });
};

export const useCrearPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      addToast({ 
        title: "Éxito", 
        description: "Pago creado con éxito", 
        timeout: 3000,
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un administrador",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al crear el pago",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

export const useEliminarPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      addToast({ 
        title: "Éxito", 
        description: "Pago eliminado con éxito", 
        timeout: 3000,
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un administrador",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al eliminar el pago",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};