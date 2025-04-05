import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Bodega } from "@/types/inventario/Bodega";

const API_URL = "http://localhost:3000/api/inv/bodega/";

const fetchBodegas = async (): Promise<Bodega[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useBodegas = () => {
  return useQuery<Bodega[], Error>({
    queryKey: ["bodegas"],
    queryFn: fetchBodegas,
    staleTime: 1000 * 60,
  });
};

const registrarBodega = async (bodega: Bodega) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.post(API_URL, bodega, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useRegistrarBodega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrarBodega,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Bodega registrada con éxito" });
      queryClient.invalidateQueries({ queryKey: ["bodegas"] });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al registrar la bodega" });
    },
  });
};

const actualizarBodega = async (bodega: Bodega) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.put(`${API_URL}${bodega.id}`, bodega, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useActualizarBodega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: actualizarBodega,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Bodega actualizada con éxito" });
      queryClient.invalidateQueries({ queryKey: ["bodegas"] });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al actualizar la bodega" });
    },
  });
};

const eliminarBodega = async (id_bodega: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  await axios.delete(`${API_URL}${id_bodega}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarBodega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarBodega,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Bodega eliminada con éxito" });
      queryClient.invalidateQueries({ queryKey: ["bodegas"] });
    },
    onError: () => {
      addToast({ title: "Error", description: "No se pudo eliminar la bodega" });
    },
  });
};
