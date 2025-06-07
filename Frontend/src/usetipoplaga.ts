import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { TipoPlaga } from "@/types/cultivo/TipoPlaga";

const API_URL = "http://127.0.0.1:8000/cultivo/tipo_plaga/";

const fetchTipoPlagas = async (): Promise<TipoPlaga[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarTipoPlaga = async (tipoPlaga: TipoPlaga) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  const formData = new FormData();
  formData.append("nombre", tipoPlaga.nombre);
  formData.append("descripcion", tipoPlaga.descripcion);
  if (tipoPlaga.img) {
    formData.append("img", tipoPlaga.img);
  }

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarTipoPlaga = async (id: number, tipoPlaga: TipoPlaga) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.put(`${API_URL}${id}/`, tipoPlaga, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarTipoPlaga = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useTipoPlagas = () => {
  return useQuery<TipoPlaga[], Error>({
    queryKey: ["tipoPlagas"],
    queryFn: fetchTipoPlagas,
  });
};

export const useRegistrarTipoPlaga = () => {
  return useMutation({
    mutationFn: registrarTipoPlaga,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Tipo de plaga registrado con éxito", timeout: 3000 });
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
          description: "Error al registrar Tipo de  plaga",
          timeout: 3000,
        });
      }
    },
    
  });
  
};

export const useActualizarTipoPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoPlaga }: { id: number; tipoPlaga: TipoPlaga }) => actualizarTipoPlaga(id, tipoPlaga),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoPlagas"] });
      addToast({ title: "Éxito", description: "Tipo de plaga actualizado con éxito", timeout: 3000 });
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
          description: "Error al actualizar Tipo de  plaga",
          timeout: 3000,
        });
      }
    },
    
  });
  
};

export const useEliminarTipoPlaga = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoPlaga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoPlagas"] });
      addToast({ title: "Éxito", description: "Tipo de plaga eliminado con éxito", timeout: 3000 });
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
          description: "Error al eliminar la plaga",
          timeout: 3000,
        });
      }
    },
    
  });
  
};
