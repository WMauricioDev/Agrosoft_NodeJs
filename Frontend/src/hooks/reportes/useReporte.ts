import { useQuery } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useReporte = (modulo: string, reporte: string, params: { fecha_inicio: string; fecha_fin: string }) => {
    return useQuery({
        queryKey: ["reporte", modulo, reporte, params],
        queryFn: async () => {
            if (!modulo || !reporte || !params.fecha_inicio || !params.fecha_fin) {
                return null;
            }

            const response = await api.get(`${BASE_URL}/${modulo}/${reporte}/reporte_pdf/`, {
                params,
                responseType: "blob", 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            return response.data; 
        },
        enabled: !!modulo && !!reporte && !!params.fecha_inicio && !!params.fecha_fin,
    });
};