{/*import React, { useEffect } from "react";
import { addToast } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";

const ActividadNotifications: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    const socketUrl = `ws://${window.location.hostname}:8000/ws/actividades/notificaciones/${user.id}/`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("Conexión WebSocket establecida");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'actividad_asignada') {
        addToast({
          title: 'Nueva actividad asignada',
          description: `${data.actividad.tipo_actividad}\nPrioridad: ${data.actividad.prioridad}`,
          timeout: 5000
        });
      }
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`);
      } else {
        console.error('Conexión cerrada abruptamente');
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user?.id]);

  return null;
};

export default ActividadNotifications;*/}