import { useEffect, useCallback, useRef } from "react";
import { Notification } from "@/types/notificacion";

export const useActivityNotifications = (
  userId: string | undefined,
  addNotification: (notification: Notification) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setupWebSocket = useCallback(() => {
    if (!userId) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const socketUrl = `ws://${window.location.hostname}:8000/ws/actividades/notificaciones/${userId}/`;
    const ws = new WebSocket(socketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      console.log('WebSocket conectado');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newNotification: Notification = {
          id: `notif-${Date.now()}-${data.actividad.id}`,
          type: data.type,
          message: data.message,
          actividad: {
            id: data.actividad.id,
            tipo_actividad_nombre: data.actividad.tipo_actividad_nombre,
            prioridad: data.actividad.prioridad,
            descripcion: data.actividad.descripcion
          },
          timestamp: new Date().toISOString(),
          source: 'activities'
        };
        addNotification(newNotification);
      } catch (error) {
        console.error('Error procesando notificación de actividades:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket de actividades:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket actividades cerrado');
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(3000 * (reconnectAttemptsRef.current + 1), 15000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          setupWebSocket();
        }, delay);
      }
    };

    return ws;
  }, [userId, addNotification]);

  useEffect(() => {
    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [setupWebSocket]);
};