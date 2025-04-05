import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";

const API_URL = "http://127.0.0.1:8000/usuarios/";

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
    const response = await axios.post(`${API_URL}registro/`, { 
      ...usuario, 
      rol_id: 1  // Se asigna automáticamente el rol "Aprendiz"
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: registrarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      addToast({ title: "Éxito", description: "Usuario registrado con éxito", timeout: 3000 });
    },
    onError: (error) => {
      addToast({ title: "Error", description: error.message || "Error al registrar el usuario", timeout: 3000 });
    },
  });

  return {
    registrarUsuario: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
  };
};
