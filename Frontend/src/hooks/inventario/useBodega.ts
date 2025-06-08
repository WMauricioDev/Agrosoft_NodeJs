import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Bodega } from "@/types/inventario/Bodega";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/inv/bodega/`;

const fetchBodegas = async (): Promise<Bodega[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useBodegas = () => {
    return useQuery({
        queryKey: ["bodegas"],
        queryFn: fetchBodegas,
        staleTime: 1000 * 60,
    });
};

const registrarBodega = async (bodega: Omit<Bodega, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.post(API_URL, bodega, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useRegistrarBodega = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bodega: Omit<Bodega, "id">) => registrarBodega(bodega),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodegas"] });
            addToast({ title: "Éxito", description: "Bodega registrada con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al registrar la bodega",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};

interface ActualizarBodegaParams {
    id: number;
    bodega: Omit<Bodega, "id">;
}

const actualizarBodega = async (id: number, bodega: Omit<Bodega, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.put(`${API_URL}${id}/`, bodega, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useActualizarBodega = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, bodega }: ActualizarBodegaParams) => actualizarBodega(id, bodega),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodegas"] });
            addToast({ title: "Éxito", description: "Bodega actualizada con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al actualizar la bodega",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};

const eliminarBodega = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.delete(`${API_URL}${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useEliminarBodega = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => eliminarBodega(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodegas"] });
            addToast({ title: "Éxito", description: "Bodega eliminada con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al eliminar la bodega",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};