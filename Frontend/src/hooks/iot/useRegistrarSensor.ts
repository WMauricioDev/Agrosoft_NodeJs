import { useMutation } from "@tanstack/react-query";
import { Sensor } from "@/types/iot/type";

export const useRegistrarSensor = () => {
  const token = localStorage.getItem("access_token");
  return useMutation({
    mutationFn: async (sensor: Sensor) => {
      const response = await fetch("http://localhost:3000/api/iot/sensores", {
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