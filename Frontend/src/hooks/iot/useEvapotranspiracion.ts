import { useQuery } from "@tanstack/react-query";
import { useDatosMeteorologicosHistoricos } from "@/hooks/iot/datos_sensores/useDatosMeteorologicosHistoricos";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { addToast } from "@heroui/react";
import api from "@/components/utils/axios";
import { EvapotranspiracionData, SensorData } from "@/types/iot/type";
import { Cultivo } from "@/types/cultivo/Cultivo";
import { obtenerNuevoToken } from "@/components/utils/refresh";
 
const fetchBancales = async (): Promise<{ id: number; posY: number | null }[]> => {
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
    const response = await api.get("http://127.0.0.1:8000/cultivo/Bancal/", {
      headers: { Authorization: `Bearer ${token}` },
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
        const response = await api.get("http://127.0.0.1:8000/cultivo/Bancal/", {
          headers: { Authorization: `Bearer ${newToken}` },
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
        description: error.response?.data?.message || "Error al obtener bancales",
        timeout: 3000,
        color: "danger",
      });
    }
    throw error;
  }
};

const calculateRa = (latitude: number, dayOfYear: number): number => {
  const latRad = (latitude * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
  const ws = Math.acos(-Math.tan(latRad) * Math.tan(delta));
  const Ra =
    (24 * 60 / Math.PI) *
    0.082 *
    dr *
    (ws * Math.sin(latRad) * Math.sin(delta) +
      Math.cos(latRad) * Math.cos(delta) * Math.sin(ws));
  return Ra;
};

// Función para calcular ET0 usando el método de Hargreaves
const calculateET0 = (tMax: number, tMin: number, ra: number): number => {
  const tMean = (tMax + tMin) / 2;
  const et0 = 0.0023 * (tMean + 17.8) * Math.sqrt(tMax - tMin) * ra;
  return et0;
};

// Hook principal
export const useEvapotranspiracion = (cultivoId: number) => {
  const { data: datosMeteorologicos = [], isLoading: isLoadingDatos, error: errorDatos } =
    useDatosMeteorologicosHistoricos();
  const { data: cultivos = [], isLoading: isLoadingCultivos, error: errorCultivos } =
    useCultivos(false);
  const { data: bancales = [], isLoading: isLoadingBancales } = useQuery<
    { id: number; posY: number | null }[],
    Error
  >({
    queryKey: ["bancales"],
    queryFn: fetchBancales,
    staleTime: 1000 * 60,
  });

  return useQuery<EvapotranspiracionData[], Error>({
    queryKey: ["evapotranspiracion", cultivoId],
    queryFn: async () => {
      if (errorDatos || errorCultivos) {
        addToast({
          title: "Error",
          description: "Error al cargar datos necesarios para el cálculo de evapotranspiración",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("Error al cargar datos necesarios para el cálculo de evapotranspiración");
      }

      const cultivo = cultivos.find((c: Cultivo) => c.id === cultivoId);
      if (!cultivo) {
        addToast({
          title: "Error",
          description: "Cultivo no encontrado",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("Cultivo no encontrado");
      }

      const bancal = bancales.find((b) => b.id === cultivo.Bancal);
      if (!bancal) {
        addToast({
          title: "Error",
          description: "Bancal no encontrado",
          timeout: 3000,
          color: "danger",
        });
        throw new Error("Bancal no encontrado");
      }

      const latitud = bancal.posY ?? 0;  

      const et0Data: EvapotranspiracionData[] = datosMeteorologicos.map(
        (dato: SensorData, index: number) => {
          const fecha = new Date(dato.fecha_medicion);
          const dayOfYear = Math.floor(
            (fecha.getTime() - new Date(fecha.getFullYear(), 0, 0).getTime()) /
              1000 /
              60 /
              60 /
              24
          );

          const ra = calculateRa(latitud, dayOfYear);
          const tAvg = dato.temperatura ?? 20;  
          const tMax = tAvg + 2;
          const tMin = tAvg - 2;
          const et0 = calculateET0(tMax, tMin, ra);

          return {
            id: index + 1,  
            fk_bancal: cultivo.Bancal, 
            fecha: dato.fecha_medicion,
            valor: et0,
            creado: new Date().toISOString(),
          };
        }
      );

      addToast({
        title: "Éxito",
        description: "Evapotranspiración calculada con éxito",
        timeout: 3000,
        color: "success",
      });
      return et0Data;
    },
    enabled:
      !!datosMeteorologicos.length &&
      !!cultivos.length &&
      !!bancales.length &&
      !isLoadingDatos &&
      !isLoadingCultivos &&
      !isLoadingBancales,
    staleTime: 1000 * 60,
  });
};