import { useEffect, useCallback, useRef } from "react";
import { Notification } from "@/types/notificacion";

export const usePlagaNotifications = (
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

    const socketUrl = `ws://${window.location.hostname}:8000/ws/reportes-plagas/notificaciones/${userId}/`;
    const ws = new WebSocket(socketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      console.log('WebSocket de reporte de plagas conectado');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newNotification: Notification = {
          id: `plaga-${Date.now()}-${data.reporte.id}`,
          type: data.type === 'cambio_estado_plaga' ? 'info' : 'reporte_plaga',
          message: data.message,
          plaga: {
            id: data.reporte.id,
            plaga_nombre: data.reporte.plaga.nombre,
            bancal_nombre: data.reporte.bancal.nombre,
            estado: data.reporte.estado,
            observaciones: data.reporte.observaciones,
            fecha_reporte: data.reporte.fecha_reporte
          },
          timestamp: new Date().toISOString(),
          source: 'plagas'
        };
        addNotification(newNotification);
      } catch (error) {
        console.error('Error procesando notificación de reporte de plagas:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket de reporte de plagas:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket reporte de plagas cerrado');
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