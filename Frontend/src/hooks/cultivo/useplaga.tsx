import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Plaga } from "@/types/cultivo/Plaga"; 

const API_URL = "http://localhost:3000/api/cultivo/plagas/";

const fetchPlagas = async (): Promise<Plaga[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarPlaga = async (plaga: Plaga) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  return axios.post(API_URL, plaga, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};


const actualizarPlaga = async (id: number, Plaga: Plaga) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.put(`${API_URL}${id}/`, Plaga, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarPlaga = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const usePlagas = () => {
  return useQuery<Plaga[], Error>({
    queryKey: ["plagas"],
    queryFn: fetchPlagas,
  });
};

export const useRegistrarPlaga = () => {
  return useMutation({
    mutationFn: registrarPlaga,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Plaga registrada con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al registrar la plaga", timeout: 3000 });
    },
  });
};

export const useActualizarPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plaga }: { id: number; plaga: Plaga }) => actualizarPlaga(id, plaga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plagas"] });
      addToast({ title: "Éxito", description: "Plaga actualizada con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al actualizar la plaga", timeout: 3000 });
    },
  });
};

export const useEliminarPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarPlaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plagas"] });
      addToast({ title: "Éxito", description: "Plaga eliminada con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar la plaga", timeout: 3000 });
    },
  });
};