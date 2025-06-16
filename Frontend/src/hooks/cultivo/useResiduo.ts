import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Residuo } from "@/types/cultivo/Residuos";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/cultivo/residuos`;

const fetchResiduos = async (): Promise<Residuo[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchResiduoById = async (id: number): Promise<Residuo> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");
  const response = await api.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarResiduo = async (residuo: Residuo) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.post(API_URL, residuo, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarResiduo = async (id: number, residuo: Residuo) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.put(`${API_URL}/${id}`, residuo, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const eliminarResiduo = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useResiduos = () => {
  return useQuery<Residuo[], Error>({
    queryKey: ["residuos"],
    queryFn: fetchResiduos,
  });
};

export const useResiduoById = (id: number) => {
  return useQuery<Residuo, Error>({
    queryKey: ["residuos", id],
    queryFn: () => fetchResiduoById(id),
    enabled: !!id,
  });
};

export const useRegistrarResiduo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registrarResiduo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residuos"] });
      addToast({
        title: "Éxito",
        description: "Residuo registrado con éxito",
        timeout: 3000,
        color: "success",
      });
      navigate("/cultivo/listaresiduo");
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        addToast({
          title: "Sesión expirada",
          description: "Por favor, inicia sesión nuevamente.",
          timeout: 3000,
          color: "warning",
        });
      } else if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción.",
          timeout: 3000,
          color: "warning",
        });
      } else {
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Error al registrar el residuo",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

export const useActualizarResiduo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Asegurar que useNavigate esté definido
  return useMutation({
    mutationFn: ({ id, residuo }: { id: number; residuo: Residuo }) =>
      actualizarResiduo(id, residuo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residuos"] });
      addToast({
        title: "Éxito",
        description: "Residuo actualizado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        addToast({
          title: "Sesión expirada",
          description: "Por favor, inicia sesión nuevamente.",
          timeout: 3000,
          color: "warning",
        });
      } else if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción.",
          timeout: 3000,
          color: "warning",
        });
      } else {
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Error al actualizar el residuo",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};

export const useEliminarResiduo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: number) => eliminarResiduo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residuos"] });
      addToast({
        title: "Éxito",
        description: "Residuo eliminado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        addToast({
          title: "Sesión expirada",
          description: "Por favor, inicia sesión nuevamente.",
          timeout: 3000,
          color: "warning",
        });
      } else if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción.",
          timeout: 3000,
          color: "warning",
        });
      } else {
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Error al eliminar el residuo",
          timeout: 3000,
          color: "danger",
        });
      }
    },
  });
};