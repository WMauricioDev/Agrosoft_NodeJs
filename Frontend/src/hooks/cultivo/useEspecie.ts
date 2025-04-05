import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Especie } from "@/types/cultivo/Especie";
import { addToast } from "@heroui/react";

const API_URL = "http://127.0.0.1:8000/cultivo/especies/";

const fetchEspecies = async (): Promise<Especie[]> => {
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

const registrarEspecie = async (especie: FormData) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  return axios.post(API_URL, especie, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useEspecies = () => {
  return useQuery<Especie[], Error>({
    queryKey: ["especies"],
    queryFn: fetchEspecies,
  });
};

export const useRegistrarEspecie = () => {
  return useMutation({
    mutationFn: (especie: FormData) => registrarEspecie(especie),
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Especie registrada con éxito",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Error al registrar la especie",
      });
    },
  });
};
const actualizarEspecie = async (id: number, especie: any) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await axios.put(`${API_URL}${id}/`, especie, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en la API:", error.response?.data);
    throw error;
  }
};

export const useActualizarEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, especie }: { id: number; especie: any }) => actualizarEspecie(id, especie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["especies"] });
      addToast({ title: "Éxito", description: "Especie actualizada con éxito", timeout: 3000 });
    },
    onError: (error: any) => {
      addToast({ 
        title: "Error", 
        description: error.response?.data?.message || "Error al actualizar la especie", 
        timeout: 3000 
      });
    },
  });
};

const eliminarEspecie = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarEspecie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["especies"] });
      addToast({ title: "Éxito", description: "Especie eliminada con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar la especie", timeout: 3000 });
    },
  });
};

