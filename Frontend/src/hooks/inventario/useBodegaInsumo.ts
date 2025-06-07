import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/inventario/bodega_insumo/`;

const fetchBodegaInsumos = async (): Promise<BodegaInsumo[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📌 Bodega Insumos recibidos:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useBodegaInsumos = () => {
    return useQuery({
        queryKey: ["bodega_insumos"],
        queryFn: fetchBodegaInsumos,
        staleTime: 1000 * 60,
    });
};

const registrarBodegaInsumo = async (bodegaInsumo: Omit<BodegaInsumo, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const payload = {
        bodega: Number(bodegaInsumo.bodega),
        insumo: Number(bodegaInsumo.insumo),
        cantidad: Number(bodegaInsumo.cantidad),
    };

    console.log("📌 Enviando al backend:", payload);

    try {
        const response = await api.post(API_URL, payload, {
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

export const useRegistrarBodegaInsumo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bodegaInsumo: Omit<BodegaInsumo, "id">) => registrarBodegaInsumo(bodegaInsumo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
            addToast({ title: "Éxito", description: "Bodega insumo registrado con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al registrar el bodega insumo",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};

interface ActualizarBodegaInsumoParams {
    id: number;
    bodegaInsumo: Omit<BodegaInsumo, "id">;
}

const actualizarBodegaInsumo = async (id: number, bodegaInsumo: Omit<BodegaInsumo, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const payload = {
        bodega: Number(bodegaInsumo.bodega),
        insumo: Number(bodegaInsumo.insumo),
        cantidad: Number(bodegaInsumo.cantidad),
    };

    console.log("📌 Enviando al backend:", payload);

    try {
        const response = await api.put(`${API_URL}${id}/`, payload, {
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

export const useActualizarBodegaInsumo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, bodegaInsumo }: ActualizarBodegaInsumoParams) => actualizarBodegaInsumo(id, bodegaInsumo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
            addToast({ title: "Éxito", description: "Bodega insumo actualizado con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al actualizar el bodega insumo",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};

const eliminarBodegaInsumo = async (id: number) => {
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

export const useEliminarBodegaInsumo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => eliminarBodegaInsumo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
            addToast({ title: "Éxito", description: "Bodega insumo eliminado con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al eliminar el bodega insumo",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};