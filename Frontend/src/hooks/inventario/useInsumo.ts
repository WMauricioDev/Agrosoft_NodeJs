import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Insumo } from "@/types/inventario/Insumo";

const API_URL = "http://localhost:3000/api/inv/insumos/";

const fetchInsumos = async (): Promise<Insumo[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

export const useInsumos = () => {
    return useQuery<Insumo[], Error>({
        queryKey: ["insumos"],
        queryFn: fetchInsumos,
        staleTime: 1000 * 60,
    });
};

const registrarInsumo = async (insumo: Omit<Insumo, "id">) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.post(API_URL, insumo, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const useRegistrarInsumo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registrarInsumo,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Insumo registrado con éxito" });
            queryClient.invalidateQueries({ queryKey: ["insumos"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "Error al registrar el insumo" });
        },
    });
};

const actualizarInsumo = async (insumo: Insumo) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.put(`${API_URL}${insumo.id}/`, insumo, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const useActualizarInsumo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarInsumo,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Insumo actualizado con éxito" });
            queryClient.invalidateQueries({ queryKey: ["insumos"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "Error al actualizar el insumo" });
        },
    });
};

const eliminarInsumo = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const useEliminarInsumo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eliminarInsumo,
        onSuccess: () => {
            addToast({ title: "Éxito", description: "Insumo eliminado con éxito" });
            queryClient.invalidateQueries({ queryKey: ["insumos"] });
        },
        onError: () => {
            addToast({ title: "Error", description: "No se pudo eliminar el insumo" });
        },
    });
};