import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { TipoControl } from "@/types/cultivo/TipoControl";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/cultivo/tipos_control/`;

const fetchTipoControl = async (): Promise<TipoControl[]> => {
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

const registrarTipoControl = async (tipoControl: TipoControl) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const formData = new FormData();
  formData.append("nombre", tipoControl.nombre);
  formData.append("descripcion", tipoControl.descripcion);

  return api.post(API_URL, formData, {
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
    const response = await api.put(`${API_URL}${id}/`, tipoControl, {
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

  return api.delete(`${API_URL}${id}/`, {
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
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un administrador.",
          timeout: 3000,
          color: "danger",
        });
      } else {
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Error al registrar el tipo de control",
          timeout: 3000,
          color: "danger",
        });
      }
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
        color: "success",
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un administrador.",
          timeout: 3000,
          color: "danger",
        });
      } else {
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el tipo de control",
          timeout: 3000,
          color: "danger",
        });
      }
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
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un administrador.",
          timeout: 3000,
          color: "danger",
        });
      } else {
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el tipo de control",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

