import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/react";
import { TipoEspecie } from "@/types/cultivo/TipoEspecie";

const API_URL = "http://127.0.0.1:8000/cultivo/tipo_especies/";

const fetchTipoEspecies = async (): Promise<TipoEspecie[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await axios.get(API_URL, {
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

  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarTipoEspecie = async (id: number, tipoEspecie: TipoEspecie) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.put(`${API_URL}${id}/`, tipoEspecie, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarTipoEspecie = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return axios.delete(`${API_URL}${id}/`, {
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
  return useMutation({
    mutationFn: registrarTipoEspecie,
    onSuccess: () => {
      addToast({ title: "Éxito", description: "Tipo de especie registrado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al registrar el tipo de especie", timeout: 3000 });
    },
  });
};

export const useActualizarTipoEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tipoEspecie }: { id: number; tipoEspecie: TipoEspecie }) => actualizarTipoEspecie(id, tipoEspecie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({ title: "Éxito", description: "Tipo de especie actualizado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al actualizar el tipo de especie", timeout: 3000 });
    },
  });
};

export const useEliminarTipoEspecie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTipoEspecie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipoEspecies"] });
      addToast({ title: "Éxito", description: "Tipo de especie eliminado con éxito", timeout: 3000 });
    },
    onError: () => {
      addToast({ title: "Error", description: "Error al eliminar el tipo de especie", timeout: 3000 });
    },
  });
};
