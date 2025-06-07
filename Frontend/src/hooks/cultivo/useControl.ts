import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { Control, ControlDetalle } from "@/types/cultivo/Control";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/cultivo/control/`;

const fetchControles = async (): Promise<ControlDetalle[]> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchControl = async (id: number): Promise<ControlDetalle> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const crearControl = async (control: Omit<Control, 'id'>) => {
  const token = localStorage.getItem("access_token");
  return axios.post(API_URL, control, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const actualizarControl = async (id: number, control: Partial<Control>) => {
  const token = localStorage.getItem("access_token");
  return axios.patch(`${API_URL}${id}/`, control, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarControl = async (id: number) => {
  const token = localStorage.getItem("access_token");
  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useControles = () => {
  return useQuery<ControlDetalle[], Error>({
    queryKey: ["controles"],
    queryFn: fetchControles,
  });
};

export const useControl = (id: number) => {
  return useQuery<ControlDetalle, Error>({
    queryKey: ["control", id],
    queryFn: () => fetchControl(id),
    enabled: !!id,
  });
};


export const useCrearControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearControl,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["controles"] });
        addToast({
          title: "Éxito",
          description: "Control registrado correctamente",
          timeout: 3000,
          color:"success"
        });
      } else {
        addToast({
          title: "Error",
          description: "No se pudo registrar el control",
          timeout: 3000,
          color:"danger"
        });
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un administrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al registrar el control",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};


export const useActualizarControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, control }: { id: number; control: Partial<Control> }) =>
      actualizarControl(id, control),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["controles"] });
      addToast({
        title: "Éxito",
        description: "Control actualizado correctamente",
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
          description: "Error al actualizar el control",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

export const useEliminarControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarControl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["controles"] });
      addToast({
        title: "Éxito",
        description: "Control eliminado correctamente",
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
          description: "Error al eliminar el control",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};
