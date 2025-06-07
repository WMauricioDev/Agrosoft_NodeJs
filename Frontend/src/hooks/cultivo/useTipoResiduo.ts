import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { TipoResiduo } from "@/types/cultivo/TipoResiduo";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/cultivo/tipos_residuos/`;

const fetchTipoResiduos = async (): Promise<TipoResiduo[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarTipoResiduo = async (tipoResiduo: TipoResiduo) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const formData = new FormData();
  formData.append("nombre", tipoResiduo.nombre);
  formData.append("descripcion", tipoResiduo.descripcion || "");

  return api.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarTipoResiduo = async (id: number, tipoResiduo: TipoResiduo) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.put(`${API_URL}${id}/`, tipoResiduo, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarTipoResiduo = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useTipoResiduos = () => {
  return useQuery<TipoResiduo[], Error>({
    queryKey: ["tipoResiduos"],
    queryFn: fetchTipoResiduos,
  });
};

export const useRegistrarTipoResiduo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registrarTipoResiduo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoResiduos"] });
      addToast({
        title: "Éxito",
        description: "Tipo de residuo registrado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción.",
          timeout: 3000,
          color: "warning",
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al registrar el tipo de residuo",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

export const useActualizarTipoResiduo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoResiduo }: { id: number; tipoResiduo: TipoResiduo }) =>
      actualizarTipoResiduo(id, tipoResiduo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoResiduos"] });
      addToast({
        title: "Éxito",
        description: "Tipo de residuo actualizado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción.",
          timeout: 3000,
          color: "warning",
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al actualizar el tipo de residuo",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

export const useEliminarTipoResiduo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoResiduo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoResiduos"] });
      addToast({
        title: "Éxito",
        description: "Tipo de residuo eliminado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción.",
          timeout: 3000,
          color: "warning",
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al eliminar el tipo de residuo",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};
