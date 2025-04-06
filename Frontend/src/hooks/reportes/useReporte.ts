import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:3000/api/";

export const useReporte = (modulo: string, reporte: string, params: { fecha_inicio: string; fecha_fin: string }) => {
    return useQuery({
        queryKey: ["reporte", modulo, reporte, params],
        queryFn: async () => {
            if (!modulo || !reporte) return null;

            const response = await axios.get(`${API_URL}/${modulo}/${reporte}/pdf`, {
                params,
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            return response.data;
        },
        enabled: !!modulo && !!reporte,
    });
};