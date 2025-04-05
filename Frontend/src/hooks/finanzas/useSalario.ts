import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Salario } from "@/types/finanzas/Salario";

const API_URL = "http://127.0.0.1:8000/finanzas/salario/";

const fetchSalarios = async (): Promise<Salario[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const registrarSalario = async (salario: Salario): Promise<Salario> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await axios.post(API_URL, salario, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const actualizarSalario = async (salario: Salario): Promise<Salario> => {
  const token = localStorage.getItem("access_token");
  if (!token || !salario.id) throw new Error("Falta token o ID del salario.");
  const response = await axios.put(`${API_URL}${salario.id}/`, salario, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const eliminarSalario = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  await axios.delete(`${API_URL}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useSalario = () => {
  const queryClient = useQueryClient();
  const salariosQuery = useQuery<Salario[], Error>({
    queryKey: ["salarios"],
    queryFn: fetchSalarios,
  });

  const registrarMutation = useMutation({
    mutationFn: registrarSalario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarios"] });
      addToast({ title: "Éxito", description: "Salario registrado con éxito" });
    },
    onError: (error) => {
      addToast({ title: "Error", description: `Error al registrar salario: ${error.message}` });
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: actualizarSalario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarios"] });
      addToast({ title: "Éxito", description: "Salario actualizado con éxito" });
    },
    onError: (error) => {
      addToast({ title: "Error", description: `Error al actualizar salario: ${error.message}` });
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: eliminarSalario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salarios"] });
      addToast({ title: "Éxito", description: "Salario eliminado con éxito" });
    },
    onError: (error) => {
      addToast({ title: "Error", description: `Error al eliminar salario: ${error.message}` });
    },
  });

  return {
    salarios: salariosQuery.data ?? [],
    isLoading: salariosQuery.isLoading,
    isError: salariosQuery.isError,
    error: salariosQuery.error,
    registrarSalario: registrarMutation.mutate,
    isRegistrando: registrarMutation.isPending,
    actualizarSalario: actualizarMutation.mutate,
    isActualizando: actualizarMutation.isPending,
    eliminarSalario: eliminarMutation.mutate,
    isEliminando: eliminarMutation.isPending,
  };
};