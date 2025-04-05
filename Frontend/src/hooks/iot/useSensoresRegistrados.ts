// hooks/iot/useSensoresRegistrados.ts
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sensor } from "@/types/iot/type";

export function useSensoresRegistrados() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const token = localStorage.getItem("access_token") || "";
  const queryClient = useQueryClient();

  // Obtener sensores
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
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchSensores();
    else setError(new Error("No autenticado"));
  }, [token]);

  // Actualizar sensor
  const updateSensor = useMutation({
    mutationFn: async (sensor: Sensor) => {
      const response = await fetch(`http://127.0.0.1:8000/iot/sensores/${sensor.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensor),
      });
      if (!response.ok) throw new Error("Error al actualizar el sensor");
      return response.json() as Promise<Sensor>;
    },
    onSuccess: (updatedSensor: Sensor) => {
      setSensores((prev) => prev.map((s) => (s.id === updatedSensor.id ? updatedSensor : s)));
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
    },
    onError: (err: Error) => setError(err),
  });

  // Eliminar sensor
  const deleteSensor = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://127.0.0.1:8000/iot/sensores/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al eliminar el sensor");
    },
    onSuccess: (_, id: number) => {
      setSensores((prev) => prev.filter((s) => s.id !== id));
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
    },
    onError: (err: Error) => setError(err),
  });

  return { sensores, isLoading, error, updateSensor, deleteSensor };
}