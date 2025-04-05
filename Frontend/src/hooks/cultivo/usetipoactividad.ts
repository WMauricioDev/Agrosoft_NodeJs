import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { TipoActividad } from "@/types/cultivo/TipoActividad";

const API_URL = "http://127.0.0.1:8000/cultivo/tipo_actividad/";

const fetchTipoActividad = async (): Promise<TipoActividad[]> => {
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

const registrarTipoActividad = async (tipoActividad: TipoActividad) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const formData = new FormData();
  formData.append("nombre", tipoActividad.nombre);
  formData.append("descripcion", tipoActividad.descripcion);

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useTipoActividad = () => {
  return useQuery<TipoActividad[], Error>({
    queryKey: ["tipoActividades"],
    queryFn: fetchTipoActividad,
  });
};

export const useRegistrarTipoActividad = () => {
  return useMutation({
    mutationFn: (tipoEspecie: TipoActividad) => registrarTipoActividad(tipoEspecie),
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Tipo de actividad registrado con éxito",
        timeout: 3000,
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Error al registrar el tipo de actividad",
        timeout: 3000,
      });
    },
  });
};

const actualizarTipoActividad = async (id: number, tipoActividad: TipoActividad) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await axios.put(`${API_URL}${id}/`, tipoActividad, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en la API:", error.response?.data);
    throw error;
  }
};

export const useActualizarTipoActividad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoActividad }: { id: number; tipoActividad: TipoActividad }) => actualizarTipoActividad(id, tipoActividad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoActividades"] });
      addToast({ title: "Éxito", description: "Tipo de actividad actualizado con éxito", timeout: 3000 });
    },
    onError: (error: any) => {
      addToast({ 
        title: "Error", 
        description: error.response?.data?.message || "Error al actualizar el tipo de actividad", 
        timeout: 3000 
      });
    },
  });
};

const eliminarTipoActividad = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarTipoActividad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoActividad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoActividades"] });
      addToast({ title: "Éxito", description: "Tipo de actividad eliminado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el tipo de actividad", timeout: 3000 });
    },
  });
};

