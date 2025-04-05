import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";

const API_URL = "http://127.0.0.1:8000/inventario/bodega_insumo/";

export const useBodegaInsumos = () => {
  return useQuery({
    queryKey: ["bodega_insumos"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📌 Bodega Insumos recibidos:", response.data);
      return response.data;
    },
  });
};

export const useRegistrarBodegaInsumo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bodegaInsumo: BodegaInsumo) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const payload = {
        bodega: Number(bodegaInsumo.bodega),
        insumo: Number(bodegaInsumo.insumo),
        cantidad: Number(bodegaInsumo.cantidad),
      };

      console.log("📌 Enviando al backend:", payload);

      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
    },
    onError: () => {
      console.error("Error al registrar el Bodega Insumo");
    },
  });
};

export const useActualizarBodegaInsumo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bodegaInsumo: BodegaInsumo) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const payload = {
        bodega: Number(bodegaInsumo.bodega),
        insumo: Number(bodegaInsumo.insumo),
        cantidad: Number(bodegaInsumo.cantidad),
      };

      console.log("📌 Enviando al backend:", payload);

      const response = await axios.put(`${API_URL}${bodegaInsumo.id}/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
    },
    onError: () => {
      console.error("Error al actualizar el Bodega Insumo");
    },
  });
};

export const useEliminarBodegaInsumo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
    },
    onError: () => {
      console.error("No se pudo eliminar el Bodega Insumo");
    },
  });
};