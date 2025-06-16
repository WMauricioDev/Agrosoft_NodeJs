import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { BodegaHerramienta } from "@/types/inventario/BodegaHerramienta";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/inv/bodega_herramienta/`;

const fetchBodegaHerramienta = async (): Promise<BodegaHerramienta[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const useBodegaHerramienta = () => {
  return useQuery({
    queryKey: ["bodegaHerramienta"],
    queryFn: fetchBodegaHerramienta,
    staleTime: 1000 * 60,
  });
};

const registrarBodegaHerramienta = async ({
  bodega,
  herramienta,
  cantidad,
  creador,
  cantidad_prestada = 0,
}: Omit<BodegaHerramienta, "id" | "costo_total">) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const payload = {
    bodega,
    herramienta: Number(herramienta),
    cantidad,
    creador,
    cantidad_prestada,
  };

  const response = await api.post(API_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useRegistrarBodegaHerramienta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarBodegaHerramienta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodegaHerramienta"] });
      addToast({ title: "Éxito", description: "Registro guardado con éxito", timeout: 3000, color: "success" });
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
          description: error.response?.data?.message || "Error al registrar",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

const actualizarBodegaHerramienta = async ({
  id,
  bodega,
  herramienta,
  cantidad,
  creador,
  cantidad_prestada,
}: Omit<BodegaHerramienta, "costo_total">) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const payload = {
    bodega,
    herramienta: Number(herramienta),
    cantidad,
    creador,
    cantidad_prestada,
  };

  const response = await api.put(`${API_URL}${id}/`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useActualizarBodegaHerramienta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarBodegaHerramienta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodegaHerramienta"] });
      addToast({ title: "Éxito", description: "Registro actualizado con éxito", timeout: 3000, color: "success" });
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
          description: error.response?.data?.message || "Error al actualizar",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

const eliminarBodegaHerramienta = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  await api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useEliminarBodegaHerramienta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarBodegaHerramienta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodegaHerramienta"] });
      addToast({ title: "Éxito", description: "Registro eliminado con éxito", timeout: 3000, color: "success" });
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
          description: error.response?.data?.message || "Error al eliminar el registro",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};