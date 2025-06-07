import { addToast } from "@heroui/react";
import mqtt from "mqtt";

export const usePublishCommand = (
  mqttClient: mqtt.MqttClient | null,
  // sensorActive usado para seguir estado del sensor
  sensorActive: boolean,
  setSensorActive: (active: boolean) => void
) => {
  // Funcion para enviar comandos MQTT
  const publishCommand = (command: string) => {
    // Verificar si hay conexion MQTT activa
    if (!mqttClient || !mqttClient.connected) {
      addToast({
        title: "Error",
        description: "No hay conexion MQTT activa",
        timeout: 3000,
        color: "danger",
      });
      return;
    }

    // Publicar comando en topico MQTT
    mqttClient.publish("sensor/control/command", command, { qos: 1 }, (err) => {
      if (err) {
        addToast({
          title: "Error",
          description: `No se pudo enviar el comando: ${err.message}`,
          timeout: 3000,
          color: "danger",
        });
      } else {
        addToast({
          title: "Exito",
          description: `Comando ${command} enviado`,
          timeout: 3000,
          color: "success",
        });
        // Actualizar estado del sensor segun comando
        if (command === "STOP_SENSOR") {
          setSensorActive(false);
        } else if (command === "START_SENSOR") {
          setSensorActive(true);
        }
      }
    });
  };

  return publishCommand;
};

export default usePublishCommand;