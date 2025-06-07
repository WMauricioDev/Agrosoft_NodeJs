import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { useEffect } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/finanzas/venta/`;

const fetchFacturaPDF = async (ventaId: number): Promise<Blob> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
  
    const response = await api.get(`${API_URL}${ventaId}/factura_pdf/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Prueba con estos Accept alternativos o quita esta línea
        Accept: "application/pdf, */*",
      },
      responseType: "blob",
    });
    return response.data;
  };

export const useFacturaPDF = (ventaId: number) => {
  const query = useQuery<Blob, Error>({
    queryKey: ["factura_pdf", ventaId],
    queryFn: () => fetchFacturaPDF(ventaId),
    enabled: !!ventaId,
    retry: 1,
  });

  useEffect(() => {
    if (query.isError) {
      const error = query.error;
      if (error.message.includes("403")) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para ver esta factura",
          timeout: 3000,
          color: "warning"
        });
      } else if (error.message.includes("406")) {
        addToast({
          title: "Formato no aceptado",
          description: "No se pudo generar el PDF de la factura",
          timeout: 3000,
          color: "danger"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al obtener la factura PDF",
          timeout: 3000,
          color: "danger"
        });
      }
    }
  }, [query.isError, query.error]);

  return query;
};