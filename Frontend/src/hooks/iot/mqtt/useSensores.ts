import { useEffect, useState } from "react";
import { subscribeToMqtt } from "@/components/utils/mqttClient";
import { SensorData } from "@/types/iot/iotmqtt";  
import { addToast } from "@heroui/react";
import mqtt from "mqtt";

export const useSensores = () => {
  const [realTimeData, setRealTimeData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect("wss://92ae5e18dc884fefa81c4f3580a7485b.s1.eu.hivemq.cloud:8884/mqtt", {
      username: "agrosoft",
      password: "Agrosoft2025!",
    });

    client.on("connect", () => {
      console.log("Conectado a MQTT para publicar");
      setMqttClient(client);
    });

    client.on("error", (err) => {
      console.error("Error MQTT:", err);
      addToast({
        title: "Error",
        description: "No se pudo conectar al broker MQTT",
        timeout: 3000,
        color: "danger",
      });
      setError("No se pudo conectar al broker MQTT");
    });

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMqtt(({ realTimeData, isConnected, error }) => {
      setRealTimeData(realTimeData);
      setIsLoading(!isConnected && !error);
      setError(error);
    });
    return unsubscribe;
  }, []);

  return { realTimeData, isLoading, error, mqttClient };
};