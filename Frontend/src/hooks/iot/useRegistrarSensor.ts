import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { obtenerNuevoToken } from "@/components/utils/refresh";

const API_URL = "http://192.168.1.12:8000/iot/datosmeteorologicos/";

const registrarSensor = async (sensor: { fk_sensor: number; temperatura: number }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    addToast({
      title: "Sesión expirada",
      description: "No se encontró el token de autenticación, por favor inicia sesión nuevamente.",
      timeout: 3000,
      color: "danger",
    });
    throw new Error("No se encontró el token de autenticación.");
  }

  try {
    const response = await api.post(API_URL, sensor, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        addToast({
          title: "Sesión expirada",
          description: "No se encontró el refresh token, por favor inicia sesión nuevamente.",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("No se encontró el refresh token.");
      }
      try {
        const newToken = await obtenerNuevoToken(refreshToken);
        localStorage.setItem("access_token", newToken);
        const response = await api.post(API_URL, sensor, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });
        return response.data;
      } catch (refreshError) {
        addToast({
          title: "Sesión expirada",
          description: "No se pudo refrescar el token, por favor inicia sesión nuevamente.",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("No se pudo refrescar el token");
      }
    } else if (error.response?.status === 403) {
      addToast({
        title: "Acceso denegado",
        description: "No tienes permiso para realizar esta acción, contacta a un administrador.",
        timeout: 3000,
        color: "danger",
      });
    } else {
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al registrar el sensor",
        timeout: 3000,
        color: "danger",
      });
    }
    throw error;
  }
};

export const useRegistrarSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarSensor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datosMeteorologicos"] });
      addToast({
        title: "Éxito",
        description: "Sensor registrado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: () => { 
    },
  });
};