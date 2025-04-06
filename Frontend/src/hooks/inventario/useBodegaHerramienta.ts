import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { BodegaHerramienta } from "@/types/inventario/BodegaHerramienta";

const API_URL = "http://localhost:3000/api/inv/bodega_herramienta/";

const fetchBodegaHerramienta = async (): Promise<BodegaHerramienta[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

export const useBodegaHerramienta = () => {
    return useQuery<BodegaHerramienta[], Error>({
        queryKey: ["bodegaHerramienta"],
        queryFn: fetchBodegaHerramienta,
        staleTime: 1000 * 60,
    });
};

const registrarBodegaHerramienta = async (bodega_herramienta: BodegaHerramienta) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const response = await axios.post(API_URL, bodega_herramienta, {
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
            addToast({ title: "Éxito", description: "Registro guardado con éxito" });
            queryClient.invalidateQueries({ queryKey: ["bodegaHerramienta"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "Error al registrar" });
        },
    });
};


const actualizarBodegaHerramienta = async (bodega_herramienta: BodegaHerramienta) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
  
    const response = await axios.put(`${API_URL}${bodega_herramienta.id}`, bodega_herramienta, {
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
            addToast({ title: "Éxito", description: "Registro actualizado con éxito" });
            queryClient.invalidateQueries({ queryKey: ["bodegaHerramienta"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "Error al actualizar" });
        },
    });
};

const eliminarBodegaHerramienta = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const useEliminarBodegaHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarBodegaHerramienta,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Registro eliminado con éxito" });
            queryClient.invalidateQueries({ queryKey: ["bodegaHerramienta"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "No se pudo eliminar el registro" });
        },
    });
};
