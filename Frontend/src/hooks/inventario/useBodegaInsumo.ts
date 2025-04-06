import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";
import { addToast } from "@heroui/react";

const API_URL = "http://localhost:3000/api/inv/bodega_insumo/";

const fetchBodegaInsumo = async (): Promise<BodegaInsumo[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const useBodegaInsumos = () => {
  return useQuery<BodegaInsumo[], Error>({
      queryKey: ["bodegaInsumo"],
      queryFn: fetchBodegaInsumo,
      staleTime: 1000 * 60,
  });
};

const registrarBodegaInsumo = async (BodegaInsumo: BodegaInsumo) => {
const token = localStorage.getItem("access_token");
if (!token) throw new Error("No se encontró el token de autenticación.");

const response = await axios.post(API_URL, BodegaInsumo, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
return response.data;
};

export const useRegistrarBodegaInsumo = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: registrarBodegaInsumo,
      onSuccess: () => {
          addToast({ title: "Éxito", description: "Registro guardado con éxito" });
          queryClient.invalidateQueries({ queryKey: ["bodegaInsumo"] });
      },
      onError: () => {
          addToast({ title: "Error", description: "Error al registrar" });
      },
  });
};


const actualizarBodegaInsumo = async (BodegaInsumo: BodegaInsumo) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.put(`${API_URL}${BodegaInsumo.id}`, BodegaInsumo, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const useActualizarBodegaInsumo = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: actualizarBodegaInsumo,
      onSuccess: () => {
          addToast({ title: "Éxito", description: "Registro actualizado con éxito" });
          queryClient.invalidateQueries({ queryKey: ["bodegaInsumo"] });
      },
      onError: () => {
          addToast({ title: "Error", description: "Error al actualizar" });
      },
  });
};

const eliminarBodegaInsumo = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  await axios.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarBodegaInsumo = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: eliminarBodegaInsumo,
      onSuccess: () => {
          addToast({ title: "Éxito", description: "Registro eliminado con éxito" });
          queryClient.invalidateQueries({ queryKey: ["bodegaInsumo"] });
      },
      onError: () => {
          addToast({ title: "Error", description: "No se pudo eliminar el registro" });
      },
  });
};
