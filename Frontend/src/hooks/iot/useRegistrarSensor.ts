import { useMutation } from "@tanstack/react-query";

export const useRegistrarSensor = () => {
  const token = localStorage.getItem("access_token");
  return useMutation({
    mutationFn: async (sensor: { fk_sensor: number; temperature: number; humidity: number }) => {
      const response = await fetch("http://127.0.0.1:8000/iot/datosmetereologicos/", {
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