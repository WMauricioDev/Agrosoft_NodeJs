import api from "@/components/utils/axios"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { Plaga } from "@/types/cultivo/Plaga";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/cultivo/plagas/`;

const fetchPlagas = async (): Promise<Plaga[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  
  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const registrarPlaga = async (plaga: Plaga) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const formData = new FormData();

  // Validación explícita para evitar enviar string vacío
if (
  plaga.fk_tipo_plaga_id !== undefined &&
  plaga.fk_tipo_plaga_id !== null
) {
  formData.append("fk_tipo_plaga_id", plaga.fk_tipo_plaga_id.toString());
} else {
  throw new Error("El tipo de plaga es requerido");
}

  formData.append("nombre", plaga.nombre);
  formData.append("descripcion", plaga.descripcion);
  if (plaga.img) {
    formData.append("img", plaga.img);
  }

  // Console log para depurar datos enviados
  console.log("Datos enviados en registrarPlaga:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  return api.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};



const actualizarPlaga = async (id: number, plaga: Plaga) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const formData = new FormData();
  formData.append("fk_tipo_plaga_id", plaga.fk_tipo_plaga_id?.toString() || "");
  formData.append("nombre", plaga.nombre);
  formData.append("descripcion", plaga.descripcion);
  if (plaga.img) {
    formData.append("img", plaga.img);
  }

  return api.put(`${API_URL}${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const eliminarPlaga = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const usePlagas = () => {
  return useQuery<Plaga[], Error>({
    queryKey: ["plagas"],
    queryFn: fetchPlagas,
  });
};

export const useRegistrarPlaga = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: registrarPlaga,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['plagas']})
      addToast({ title: "Éxito", description: "Plaga registrada con éxito", timeout: 3000, color:"success" });
    },
    onError: (error: any) => {
  console.error("Error completo:", error);
  console.error("Respuesta del servidor:", error.response?.data);

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
          description: "Error al registrar la plaga",
          timeout: 3000,
          color:"danger"
        });
      }
    },
    
  });
  
};

export const useActualizarPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plaga }: { id: number; plaga: Plaga }) => actualizarPlaga(id, plaga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plagas"] });
      addToast({ title: "Éxito", description: "Plaga actualizada con éxito", timeout: 3000, color:"success" });
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
          description: "Error al actualizar la plaga",
          timeout: 3000,
          color:"danger"
        });
      }
    },
    
  });
  
};

export const useEliminarPlaga = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarPlaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plagas"] });
      addToast({
        title: "Éxito",
        description: "Plaga eliminada con éxito",
        timeout: 3000,
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
          description: "Error al eliminar la plaga",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};
