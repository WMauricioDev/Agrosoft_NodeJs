import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Herramienta } from "@/types/inventario/Herramientas";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/inv/herramientas/`;

const fetchHerramientas = async (): Promise<Herramienta[]> => {
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

export const useHerramientas = () => {
    return useQuery({
        queryKey: ["herramientas"],
        queryFn: fetchHerramientas,
        staleTime: 1000 * 60,
    });
};

const registrarHerramienta = async (herramienta: Omit<Herramienta, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.post(API_URL, herramienta, {
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

export const useRegistrarHerramienta = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (herramienta: Omit<Herramienta, "id">) => registrarHerramienta(herramienta),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
            addToast({ title: "Éxito", description: "Herramienta registrada con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al registrar la herramienta",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};

interface ActualizarHerramientaParams {
    id: number;
    herramienta: Omit<Herramienta, "id">;
}

const actualizarHerramienta = async (id: number, herramienta: Omit<Herramienta, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    try {
        const response = await api.put(`${API_URL}${id}/`, herramienta, {
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

export const useActualizarHerramienta = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, herramienta }: ActualizarHerramientaParams) => actualizarHerramienta(id, herramienta),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
            addToast({ title: "Éxito", description: "Herramienta actualizada con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al actualizar la herramienta",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};

const eliminarHerramienta = async (id: number) => {
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

export const useEliminarHerramienta = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => eliminarHerramienta(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
            addToast({ title: "Éxito", description: "Herramienta eliminada con éxito", timeout: 3000, color: "success" });
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
                    description: error.response?.data?.message || "Error al eliminar la herramienta",
                    timeout: 3000,
                    color: "danger",
                });
            }
        },
    });
};