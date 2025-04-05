import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Programacion } from "@/types/cultivo/Programacion";

const API_URL = "http://127.0.0.1:8000/cultivo/programacion/";

const fetchProgramaciones = async (): Promise<Programacion[]> => {
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

const registrarProgramacion = async (programacion: Programacion) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  return axios.post(API_URL, programacion, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const eliminarProgramacion = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
const actualizarProgramacion = async (id: number, programacion: Programacion) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.put(`${API_URL}${id}/`, programacion, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useProgramaciones = () => {
  return useQuery<Programacion[], Error>({
    queryKey: ["programaciones"],
    queryFn: fetchProgramaciones,
  });
};

export const useRegistrarProgramacion = () => {
  return useMutation({
    mutationFn: (programacion: Programacion) => registrarProgramacion(programacion),
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Programación registrada con éxito",
        timeout: 3000,
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Error al registrar la programación",
        timeout: 3000,
      });
    },
  });
};
export const useActualizarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, programacion }: { id: number; programacion: Programacion }) => actualizarProgramacion(id, programacion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programaciones"] });
      addToast({ title: "Éxito", description: "Programacion actualizado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al actualizar la programacion", timeout: 3000 });
    },
  });
};

export const useEliminarProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarProgramacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programaciones"] });
      addToast({ title: "Éxito", description: "Programacion eliminada con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar la programacion", timeout: 3000 });
    },
  });
};
