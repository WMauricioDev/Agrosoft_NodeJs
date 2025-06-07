import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/iot/sensores/`;

const toggleSensor = async ({ sensorId, activo }: { sensorId: number; activo: boolean }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  try {
    const response = await api.patch(
      `${API_URL}${sensorId}/`,
      { estado: activo ? "activo" : "inactivo" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("[useToggleSensor] Error al cambiar el estado del sensor:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Error al cambiar el estado del sensor");
  }
};

export const useToggleSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleSensor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
      addToast({
        title: "Éxito",
        description: "Estado del sensor actualizado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al cambiar el estado del sensor",
        timeout: 3000,
        color: "danger",
      });
    },
  });
};