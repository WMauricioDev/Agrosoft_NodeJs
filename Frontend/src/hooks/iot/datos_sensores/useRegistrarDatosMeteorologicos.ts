import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/iot/datosmeteorologicos`;

const registrarDatosMeteorologicos = async (data: any) => {
  console.log("[useRegistrarDatosMeteorologicos] Iniciando registro con datos:", data);
  if (!data.device_code) {
    console.error("[useRegistrarDatosMeteorologicos] device_code es obligatorio", data);
    throw new Error("El device_code es obligatorio");
  }

  const payload = {
    device_code: data.device_code,
    fk_bancal_id: data.fk_bancal_id || null,
    temperatura: data.temperatura != null ? parseFloat(data.temperatura.toFixed(2)) : null,
    humedad_ambiente: data.humedad_ambiente != null ? parseFloat(data.humedad_ambiente.toFixed(2)) : null,
    luminosidad: data.luminosidad != null ? parseFloat(data.luminosidad.toFixed(2)) : null,
    lluvia: data.lluvia != null ? parseFloat(data.lluvia.toFixed(2)) : null,
    velocidad_viento: data.velocidad_viento != null ? parseFloat(data.velocidad_viento.toFixed(2)) : null,
    direccion_viento: data.direccion_viento != null ? parseFloat(data.direccion_viento.toFixed(2)) : null,
    humedad_suelo: data.humedad_suelo != null ? parseFloat(data.humedad_suelo.toFixed(2)) : null,
    ph_suelo: data.ph_suelo != null ? parseFloat(data.ph_suelo.toFixed(2)) : null,
    fecha_medicion: data.fecha_medicion || new Date().toISOString(),
  };

  console.log("[useRegistrarDatosMeteorologicos] Enviando POST a", API_URL, "con payload:", payload);
  try {
    const response = await api.post(API_URL, payload);
    console.log("[useRegistrarDatosMeteorologicos] Respuesta exitosa:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[useRegistrarDatosMeteorologicos] Error detallado en POST:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });
    const errorMessage = error.response?.data?.message || `Error al registrar los datos: ${error.message}`;
    throw new Error(errorMessage);
  }
};

export const useRegistrarDatosMeteorologicos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registrarDatosMeteorologicos,
    onSuccess: (data) => {
      console.log("[useRegistrarDatosMeteorologicos] Registro exitoso:", data);
      queryClient.invalidateQueries({ queryKey: ["datosMeteorologicos"] });
      addToast({
        title: "Éxito",
        description: "Datos meteorológicos registrados con éxito",
        timeout: 3000,
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("[useRegistrarDatosMeteorologicos] Error en registro:", error.message);
      addToast({
        title: "Error",
        description: error.message,
        timeout: 3000,
        color: "danger",
      });
    },
  });
};
