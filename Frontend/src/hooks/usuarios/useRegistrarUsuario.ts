import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}`;

export interface NuevoUsuario {
  nombre: string;
  apellido: string;
  email: string;
  numero_documento: number;
  username?: string;
  password: string;
}
  
export const useRegistrarUsuario = () => {
  const queryClient = useQueryClient();

  const registrarUsuario = async (usuario: NuevoUsuario) => {
    const response = await api.post(`${API_URL}/api/usuarios/`, {
      ...usuario,
      rol_id: 1,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: registrarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: () => {
      // Sin notificaciones, solo se maneja desde el componente
    },
  });

  return {
    registrarUsuario: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ?? null,
  };
};
