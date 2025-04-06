import { useState, useEffect } from "react";
import { SensorData } from "../../types/iot/type";

export const useDatosMeteorologicosHistoricos = (sensorId: number, date: string) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:3000/api/iot/datosmetereologicos";
        if (sensorId !== 0 && date) {
          url += `?fk_sensor=${sensorId}&fecha_medicion__date=${date}`;
        } else if (sensorId !== 0) {
          url += `?fk_sensor=${sensorId}`;
        } else if (date) {
          url += `?fecha_medicion__date=${date}`;
        }

        console.log("Solicitando datos desde:", url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const result: SensorData[] = await response.json();
        console.log("Datos recibidos:", result);
        setData(result);
        setIsLoading(false);
      } catch (err) {
        console.error("Error al fetch:", err);
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError(new Error("No autenticado"));
      setIsLoading(false);
    }
  }, [sensorId, date, token]);

  return { data, isLoading, error };
};