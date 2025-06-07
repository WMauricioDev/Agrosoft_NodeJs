import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}`;


export interface Rol {
  id: number | string;
  nombre: string;
}


export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  numero_documento: number;
  username?: string;
  rol: Rol | null;
}

export interface UsuarioUpdate {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  numero_de_documento: number;
  username?: string;
  rol_id: number | null;   
}

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const fetchUsuarios = async (): Promise<Usuario[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    const response = await api.get(`${API_URL}/api/usuarios/`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!Array.isArray(response.data)) throw new Error("La API no devolvió un array de usuarios.");
    return response.data;
  };

  
  const fetchRoles = async (): Promise<Rol[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    const response = await api.get(`${API_URL}/api/roles/`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!Array.isArray(response.data)) throw new Error("La API no devolvió un array de roles.");
    return response.data;
  };

  const updateUsuario = async (usuario: UsuarioUpdate): Promise<Usuario> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    const response = await api.put(`${API_URL}/api/usuarios/${usuario.id}/`, usuario, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data; 
  };
  const deleteUsuario = async (id: number): Promise<void> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    await api.delete(`${API_URL}usuarios/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const usuariosQuery = useQuery<Usuario[], Error>({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    retry: 1,
    enabled: !!localStorage.getItem("access_token"),
  });

  const rolesQuery = useQuery<Rol[], Error>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    retry: 1,
    enabled: !!localStorage.getItem("access_token"),
  });

  const updateMutation = useMutation<Usuario, Error, UsuarioUpdate>({
    mutationFn: updateUsuario,
    onSuccess: (updatedUsuario) => {
      queryClient.setQueryData<Usuario[]>(["usuarios"], (oldData) =>
        oldData ? oldData.map((u) => (u.id === updatedUsuario.id ? updatedUsuario : u)) : [updatedUsuario]
      );
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      addToast({ title: "Éxito", description: "Usuario actualizado con éxito", timeout: 3000, color:"success"});
    },
    onError: (error) => {
      addToast({ title: "Error", description: error.message || "Error al actualizar el usuario", timeout: 3000, color:"danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      addToast({ title: "Éxito", description: "Usuario eliminado con éxito", timeout: 3000, color:"success" });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el usuario", timeout: 3000, color:"danger" });
    },
  });

  return {
    ...usuariosQuery,
    roles: rolesQuery.data,
    isLoadingRoles: rolesQuery.isLoading,
    updateUsuario: updateMutation.mutateAsync,
    deleteUsuario: deleteMutation.mutate,
  };
};

export const useToggleStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nuevoValor }: { id: number; nuevoValor: boolean }) => {
      const response = await api.patch(`${API_URL}/api/usuarios/staff/${id}/`, {
        is_staff: nuevoValor,
      });
      return { id, nuevoValor };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};
