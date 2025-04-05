import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8000"; 

export const useReporte = (modulo: string, reporte: string, params: { fecha_inicio: string; fecha_fin: string }) => {
    return useQuery({
        queryKey: ["reporte", modulo, reporte, params],
        queryFn: async () => {
            if (!modulo || !reporte || !params.fecha_inicio || !params.fecha_fin) {
                return null;
            }

            const response = await axios.get(`${API_URL}/${modulo}/${reporte}/reporte_pdf/`, {
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