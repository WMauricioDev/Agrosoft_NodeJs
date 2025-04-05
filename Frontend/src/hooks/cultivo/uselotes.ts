import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Lote } from "@/types/cultivo/Lotes";

const API_URL = "http://127.0.0.1:8000/cultivo/lote/";

const fetchLotes = async (): Promise<Lote[]> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const response = await axios.get(API_URL, {
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

  const formData = new FormData();
  formData.append("nombre", lote.nombre);
  formData.append("descripcion", lote.descripcion);
  formData.append("activo", JSON.stringify(lote.activo));
  formData.append("tam_x", lote.tam_x.toString());
  formData.append("tam_y", lote.tam_y.toString());
  formData.append("pos_x", lote.pos_x.toString());
  formData.append("pos_y", lote.pos_y.toString());

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type":"application/json",
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
  return useMutation({
    mutationFn: (lote: Lote) => registrarLote(lote),
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Lote registrado con éxito",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Error al registrar el lote",
    
      });
    },
  });
};
const actualizarLote = async (id: number, lote: Lote) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await axios.put(`${API_URL}${id}/`, lote, {
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
      addToast({ title: "Éxito", description: "Lote actualizado con éxito", timeout: 3000 });
    },
    onError: (error: any) => {
      addToast({ 
        title: "Error", 
        description: error.response?.data?.message || "Error al actualizar el lote", 
        timeout: 3000 
      });
    },
  });
};

const eliminarLote = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarLote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarLote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes"] });
      addToast({ title: "Éxito", description: "Lote eliminado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el lote", timeout: 3000 });
    },
  });
};