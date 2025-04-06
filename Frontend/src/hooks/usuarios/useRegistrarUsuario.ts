import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";

const API_URL = "http://localhost:3000/api/";

export interface NuevoUsuario {
  nombre: string;
  apellido: string;
  email: string;
  username?: string;
  password: string;
}

export const useRegistrarUsuario = () => {
  const queryClient = useQueryClient();

  const registrarUsuario = async (usuario: NuevoUsuario) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const response = await axios.post(
      `${API_URL}usuarios/`,
      { 
        ...usuario, 
        rol_id: 1 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: registrarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      addToast({
        title: "Éxito",
        description: "Usuario registrado con éxito",
        timeout: 3000,
      });
    },
    onError: (error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al registrar el usuario",
        timeout: 3000,
      });
    },
  });

  return {
    registrarUsuario: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
  };
};

