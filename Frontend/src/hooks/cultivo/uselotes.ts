import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { Lote } from "@/types/cultivo/Lotes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/cultivo/lotes/`;

const fetchLotes = async (): Promise<Lote[]> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const response = await api.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const registrarLote = async (lote: Lote) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  return api.post(API_URL, lote, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};


export const useLotes = () => {
  return useQuery<Lote[], Error>({
    queryKey: ["lotes"],
    queryFn: fetchLotes,
  });
};

export const useRegistrarLote = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lote: Lote) => registrarLote(lote),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['lotes'] })
      addToast({
        title: "Éxito",
        description: "Lote registrado con éxito",
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al registrar el lote",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

const actualizarLote = async (id: number, lote: Lote) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await api.put(`${API_URL}${id}/`, lote, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en la API:", error.response?.data);
    throw error;
  }
};

export const useActualizarLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lote }: { id: number; lote: Lote }) => actualizarLote(id, lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] });
      addToast({ title: "Éxito", description: "Lote actualizado con éxito", timeout: 3000, color:"success"});
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al actualizar el lote",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

const eliminarLote = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarLote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] });
      addToast({ title: "Éxito", description: "Lote eliminado con éxito", timeout: 3000, color:"success"});
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al eliminar el lote",
          timeout: 3000,
          color:"success"
        });
      }
    },
  });
};
