import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/iot/sensores/`;

const deleteSensor = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("[useDeleteSensor] No se encontró el token de autenticación.");
    throw new Error("No se encontró el token de autenticación.");
  }

  console.log("[useDeleteSensor] Enviando DELETE a /iot/sensores/" + id + "/");
  try {
    const response = await api.delete(`${API_URL}${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[useDeleteSensor] Respuesta de DELETE /iot/sensores/" + id + "/: ", response.data);
    return response;
  } catch (error: any) {
    console.error("[useDeleteSensor] Error en DELETE /iot/sensores/" + id + "/: ", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const useDeleteSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSensor,
    onSuccess: () => {
      console.log("[useDeleteSensor] Sensor eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
      addToast({
        title: "Éxito",
        description: "Sensor eliminado con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("[useDeleteSensor] Error al eliminar sensor: ", error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el sensor",
        timeout: 3000,
        color: "danger",
      });
    },
  });
};