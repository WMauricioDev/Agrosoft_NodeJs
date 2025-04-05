import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Cultivo } from "@/types/cultivo/Cultivo";

const API_URL = "http://localhost:3000/api/cultivo/cultivos/";

const fetchCultivos = async (mostrarInactivos = false): Promise<Cultivo[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const params = mostrarInactivos ? { activo: "false" } : {};
  const response = await axios.get(API_URL, {
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
        const response = await axios.post(API_URL, cultivo, {
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
    return useMutation({
        mutationFn: (cultivo: Cultivo) => registrarCultivo(cultivo),
        onSuccess: () => {
            addToast({
              title: "Éxito",
              description: "Cultivo registrado con éxito",
            });
          },
          onError: () => {
            addToast({
              title: "Error",
              description: "Error al registrar el cultivo",
            });
          },
    });
};

const actualizarCultivo = async (id: number, cultivo: any) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
  
    try {
      const response = await axios.put(`${API_URL}${id}/`, cultivo, {
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
        addToast({ title: "Éxito", description: "Cultivo actualizado con éxito", timeout: 3000 });
      },
      onError: (error: any) => {
        addToast({ 
          title: "Error", 
          description: error.response?.data?.message || "Error al actualizar el cultivo", 
          timeout: 3000 
        });
      },
    });
  };
  
  const eliminarCultivo = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
  
    return axios.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  export const useEliminarCultivo = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => eliminarCultivo(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cultivos"] });
        addToast({ title: "Éxito", description: "Cultivo eliminado con éxito", timeout: 3000 });
      },
      onError: () => {
        addToast({ title: "Error", description: "Error al eliminar el cultivo", timeout: 3000 });
      },
    });
  };