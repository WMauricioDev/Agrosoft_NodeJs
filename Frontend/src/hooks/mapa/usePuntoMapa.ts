import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { PuntoMapa } from "@/types/mapa/PuntoMapa";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/mapa/puntos/`;

const fetchPuntosMapa = async (): Promise<PuntoMapa[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontro el token de autenticacion.");

  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("GET /mapa/puntos response:", response.data);
    // Parsear coordenadas a numeros
    return response.data.map((punto: any) => ({
      ...punto,
      latitud: parseFloat(punto.latitud),
      longitud: parseFloat(punto.longitud),
    }));
  } catch (error: any) {
    console.error("Error fetching puntos:", error.response?.data || error.message);
    throw error;
  }
};

const registrarPuntoMapa = async (punto: PuntoMapa) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontro el token de autenticacion.");

  try {
    console.log("Enviando POST a:", API_URL, "con datos:", JSON.stringify(punto, null, 2));
    const response = await api.post(API_URL, punto, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorDetail = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
    console.error("Error en POST /mapa/puntos:", errorDetail);
    throw new Error(errorDetail);
  }
};

const actualizarPuntoMapa = async ({ id, punto }: { id: number; punto: PuntoMapa }) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontro el token de autenticacion.");

  try {
    const response = await api.put(`${API_URL}${id}/`, punto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en PUT /mapa/puntos:", error.response?.data || error.message);
    throw error;
  }
};

const eliminarPuntoMapa = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontro el token de autenticacion.");

  try {
    const response = await api.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en DELETE /mapa/puntos:", error.response?.data || error.message);
    throw error;
  }
};

export const usePuntosMapa = () => {
  return useQuery<PuntoMapa[], Error>({
    queryKey: ["puntosMapa"],
    queryFn: () => fetchPuntosMapa(),
    initialData: [],
  });
};

export const useRegistrarPuntoMapa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (punto: PuntoMapa) => registrarPuntoMapa(punto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puntosMapa"] });
      addToast({
        title: "exito",
        description: "Punto de interes registrado con exito",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Error registrando punto:", error.message);
      addToast({
        title: "Error",
        description: `Error al registrar el punto: ${error.message}`,
        color: "danger",
      });
    },
  });
};

export const useActualizarPuntoMapa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, punto }: { id: number; punto: PuntoMapa }) => actualizarPuntoMapa({ id, punto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puntosMapa"] });
      addToast({
        title: "exito",
        description: "Punto actualizado con exito",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Error actualizando punto:", error.response?.data || error.message);
      addToast({
        title: "Error",
        description: `Error al actualizar el punto: ${JSON.stringify(error.response?.data || error.message)}`,
        color: "danger",
      });
    },
  });
};

export const useEliminarPuntoMapa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarPuntoMapa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["puntosMapa"] });
      addToast({
        title: "exito",
        description: "Punto de interes eliminado con exito",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Error eliminando punto:", error.response?.data || error.message);
      addToast({
        title: "Error",
        description: `Error al eliminar el punto: ${JSON.stringify(error.response?.data || error.message)}`,
        color: "danger",
      });
    },
  });
};