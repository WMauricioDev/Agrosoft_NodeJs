import { useEffect, useState, useRef } from "react";
import { Sensor, SensorData } from "@/types/iot/type";
import { addToast } from "@heroui/react";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3001/ws/iot/realtime/";

export const useWebSocketData = (sensores: Sensor[]) => {
  const [realTimeData, setRealTimeData] = useState<SensorData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sensoresRef = useRef<Sensor[]>(sensores);

  // Actualizar la referencia de sensores sin disparar el efecto
  useEffect(() => {
    sensoresRef.current = sensores;
  }, [sensores]);

  const connectWebSocket = () => {
    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      console.log("Conexión WebSocket establecida");
      addToast({
        title: "Éxito",
        description: "Conexión WebSocket establecida",
        timeout: 3000,
        color: "success",
      });
    };

    wsRef.current.onmessage = (event: MessageEvent) => {
      console.log("Mensaje recibido del WebSocket:", event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.type === "weather_data") {
          const sensor = sensoresRef.current.find((s) => s.id === message.data.fk_sensor_id);
          if (sensor && sensor.estado === "activo") {
            const newData: SensorData = {
              id: message.data.id || Date.now(),
              fk_sensor: message.data.fk_sensor_id,
              temperatura: message.data.temperatura ?? null,
              humedad_ambiente: message.data.humedad_ambiente ?? null,
              luminosidad: message.data.luminosidad ?? null,
              humedad_suelo: message.data.humedad_suelo ?? null,
              lluvia: message.data.lluvia ?? null,
              ph_suelo: message.data.ph_suelo ?? null,
              direccion_viento: message.data.direccion_viento ?? null,
              velocidad_viento: message.data.velocidad_viento ?? null,
              fecha_medicion: message.data.fecha_medicion || new Date().toISOString(),
            };
            setRealTimeData((prev) => [...prev, newData].slice(-50));
          }
        }
      } catch (error) {
        console.error("Error al parsear mensaje WebSocket:", error);
        addToast({
          title: "Error",
          description: "Error al procesar datos en tiempo real",
          timeout: 3000,
          color: "danger",
        });
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("Error en WebSocket:", error);
      addToast({
        title: "Error",
        description: "Error en la conexión WebSocket",
        timeout: 3000,
        color: "danger",
      });
    };

    wsRef.current.onclose = () => {
      console.log("Conexión WebSocket cerrada");
      addToast({
        title: "Advertencia",
        description: "Conexión WebSocket cerrada, intentando reconectar...",
        timeout: 3000,
        color: "warning",
      });
      // Intentar reconectar después de 5 segundos
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Intentando reconectar WebSocket...");
          connectWebSocket();
          reconnectTimeoutRef.current = null;
        }, 5000);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return { realTimeData };
};