import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

interface Sensor {
  id?: number;
  nombre: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

export const useSensores = () => {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/iot/sensores/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const result: Sensor[] = await response.json();
        setSensores(result);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      }
    };

    if (token) fetchSensores();
    else {
      setError(new Error("Not authenticated"));
      setIsLoading(false);
    }
  }, [token]);

  return { sensores, isLoading, error };
};

export const useRegistrarSensor = () => {
  const token = localStorage.getItem("access_token");
  return useMutation({
    mutationFn: async (sensor: Sensor) => {
      const response = await fetch("http://127.0.0.1:8000/iot/sensores/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensor),
      });
      if (!response.ok) throw new Error("Error al registrar el sensor");
      return response.json();
    },
  });
};