import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { Cultivo } from "@/types/cultivo/Cultivo";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/cultivo/cultivos/`;

const fetchCultivos = async (mostrarInactivos = false): Promise<Cultivo[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const params = mostrarInactivos ? { activo: "false" } : {};
  const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params
  });
  return response.data;
}

const registrarCultivo = async (cultivo: Cultivo) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        throw new Error("No se encontró el token de autenticación.");
    }

    try {
        console.log("Enviando datos al backend:", cultivo); 
        const response = await api.post(API_URL, cultivo, {
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

export const useCultivos = (mostrarInactivos = false) => {
  return useQuery<Cultivo[], Error>({
      queryKey: ["cultivos", { mostrarInactivos }],
      queryFn: () => fetchCultivos(mostrarInactivos),
  });
};

export const useRegistrarCultivo = () => {
  const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (cultivo: Cultivo) => registrarCultivo(cultivo),
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey:['cultivos']});
            addToast({
              title: "Éxito",
              description: "Cultivo registrado con éxito",
              color:"success"
            });
          },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al registrar el cultivo",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

const actualizarCultivo = async (id: number, cultivo: any) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
  
    try {
      const response = await api.put(`${API_URL}${id}/`, cultivo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error en la API:", error.response?.data);
      throw error;
    }
  };
  
  export const useActualizarCultivo = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, cultivo }: { id: number; cultivo: any }) => actualizarCultivo(id, cultivo),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cultivos"] });
        addToast({ title: "Éxito", description: "Cultivo actualizado con éxito", timeout: 3000, color:"success" });
      },
      onError: (error: any) => {
        if (error.response?.status === 403) {
          addToast({
            title: "Acceso denegado",
            description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
            timeout: 3000,
            color:"warning"
          });
        } else {
          addToast({
            title: "Error",
            description: "Error al actualizar el cultivo",
            timeout: 3000,
            color:"danger"
          });
        }
      },
    });
  };
    
  const eliminarCultivo = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
  
    return api.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const useEliminarCultivo = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => eliminarCultivo(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cultivos"] });
        addToast({ title: "Éxito", description: "Cultivo eliminado con éxito", timeout: 3000, color:"success" });
      },
      onError: (error: any) => {
        if (error.response?.status === 403) {
          addToast({
            title: "Acceso denegado",
            description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
            timeout: 3000,
          });
        } else {
          addToast({
            title: "Error",
            description: "Error al eliminar el cultivo",
            timeout: 3000,
            color:"danger"
          });
        }
      },
    });
  };
  

  