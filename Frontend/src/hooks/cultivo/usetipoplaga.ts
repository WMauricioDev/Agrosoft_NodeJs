import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { TipoPlaga } from "@/types/cultivo/TipoPlaga";

const API_URL = "http://localhost:3000/api/cultivo/tipo_plaga/";

const fetchTipoPlagas = async (): Promise<TipoPlaga[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarTipoPlaga = async (tipo_plaga: TipoPlaga) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  return axios.post(API_URL, tipo_plaga, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};


const actualizarTipoPlaga = async (id: number, tipoPlaga: TipoPlaga) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.put(`${API_URL}${id}/`, tipoPlaga, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarTipoPlaga = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useTipoPlagas = () => {
  return useQuery<TipoPlaga[], Error>({
    queryKey: ["tipoPlagas"],
    queryFn: fetchTipoPlagas,
  });
};

export const useRegistrarTipoPlaga = () => {
  return useMutation({
    mutationFn: registrarTipoPlaga,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Tipo de plaga registrado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al registrar el tipo de plaga", timeout: 3000 });
    },
  });
};

export const useActualizarTipoPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoPlaga }: { id: number; tipoPlaga: TipoPlaga }) => actualizarTipoPlaga(id, tipoPlaga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoPlagas"] });
      addToast({ title: "Éxito", description: "Tipo de plaga actualizado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al actualizar el tipo de plaga", timeout: 3000 });
    },
  });
};

export const useEliminarTipoPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoPlaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoPlagas"] });
      addToast({ title: "Éxito", description: "Tipo de plaga eliminado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el tipo de plaga", timeout: 3000 });
    },
  });
};