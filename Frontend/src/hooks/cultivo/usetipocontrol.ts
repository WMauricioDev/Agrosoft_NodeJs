import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { TipoControl } from "@/types/cultivo/TipoControl"; 

const API_URL = "http://localhost:3000/api/cultivo/tipos_control/";

const fetchTipoControl = async (): Promise<TipoControl[]> => {
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

const registrarTipoControl = async (tipoControl: TipoControl) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const formData = new FormData();
  formData.append("nombre", tipoControl.nombre);
  formData.append("descripcion", tipoControl.descripcion);

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type":  "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarTipoControl = async (id: number, tipoControl: TipoControl) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await axios.put(`${API_URL}${id}/`, tipoControl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en la API:", error.response?.data);
    throw error;
  }
};

const eliminarTipoControl = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useTipoControl = () => {
  return useQuery<TipoControl[], Error>({
    queryKey: ["tipoControles"],
    queryFn: fetchTipoControl,
  });
};

export const useRegistrarTipoControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tipoControl: TipoControl) => registrarTipoControl(tipoControl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoControles"] });
      addToast({
        title: "Éxito",
        description: "Tipo de control registrado con éxito",
        timeout: 3000,
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Error al registrar el tipo de control",
        timeout: 3000,
      });
    },
  });
};

export const useActualizarTipoControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoControl }: { id: number; tipoControl: TipoControl }) =>
      actualizarTipoControl(id, tipoControl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoControles"] });
      addToast({
        title: "Éxito",
        description: "Tipo de control actualizado con éxito",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al actualizar el tipo de control",
        timeout: 3000,
      });
    },
  });
};

export const useEliminarTipoControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoControl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoControles"] });
      addToast({
        title: "Éxito",
        description: "Tipo de control eliminado con éxito",
        timeout: 3000,
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Error al eliminar el tipo de control",
        timeout: 3000,
      });
    },
  });
};