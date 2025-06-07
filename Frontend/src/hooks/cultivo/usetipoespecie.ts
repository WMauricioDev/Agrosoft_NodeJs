import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { TipoEspecie } from "@/types/cultivo/TipoEspecie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/cultivo/tipo_especie/`;

const fetchTipoEspecies = async (): Promise<TipoEspecie[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarTipoEspecie = async (tipoEspecie: TipoEspecie) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const formData = new FormData();
  formData.append("nombre", tipoEspecie.nombre);
  formData.append("descripcion", tipoEspecie.descripcion);
  if (tipoEspecie.img) {
    formData.append("img", tipoEspecie.img);
  }

  return api.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarTipoEspecie = async (id: number, tipoEspecie: TipoEspecie) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.put(`${API_URL}${id}/`, tipoEspecie, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarTipoEspecie = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useTipoEspecies = () => {
  return useQuery<TipoEspecie[], Error>({
    queryKey: ["tipoEspecies"],
    queryFn: fetchTipoEspecies,
  });
};
export const useRegistrarTipoEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarTipoEspecie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({
        title: "Éxito",
        description: "Tipo de especie registrado con éxito",
        timeout: 3000,
        color: "success"
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
          description: "Error al registrar el tipo de especie",
          timeout: 3000,
          color: "danger"
        });
      }
    },
  });
};


export const useActualizarTipoEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoEspecie }: { id: number; tipoEspecie: TipoEspecie }) => actualizarTipoEspecie(id, tipoEspecie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({ title: "Éxito", description: "Tipo de especie actualizado con éxito", timeout: 3000, color:"success" });
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
          description: "Error al actualizar el tipo de especie",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

export const useEliminarTipoEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoEspecie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({ title: "Éxito", description: "Tipo de especie eliminado con éxito", timeout: 3000, color:"success" });
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
          description: "Error al eliminar el tipo de especie",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};
