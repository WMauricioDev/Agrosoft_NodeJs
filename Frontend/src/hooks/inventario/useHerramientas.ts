import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Herramienta } from "@/types/inventario/Herramientas";

const API_URL = "http://localhost:3000/api/inv/herramientas/";

const fetchHerramientas = async (): Promise<Herramienta[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

export const useHerramientas = () => {
    return useQuery<Herramienta[], Error>({
        queryKey: ["herramientas"],
        queryFn: fetchHerramientas,
        staleTime: 1000 * 60,
    });
};

const registrarHerramienta = async (herramienta: Herramienta) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.post(API_URL, herramienta, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const useRegistrarHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registrarHerramienta,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Herramienta registrada con éxito" });
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "Error al registrar la herramienta" });
        },
    });
};

const actualizarHerramienta = async (herramienta: Herramienta) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.put(`${API_URL}${herramienta.id}/`, herramienta, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const useActualizarHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarHerramienta,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Herramienta actualizada con éxito" });
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "Error al actualizar la herramienta" });
        },
    });
};

const eliminarHerramienta = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const useEliminarHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarHerramienta,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Herramienta eliminada con éxito" });
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "No se pudo eliminar la herramienta" });
        },
    });
};
