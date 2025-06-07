import { useEffect, useCallback, useRef } from 'react';
import { Notification } from '@/types/notificacion';

export const useBodegaNotifications = (
  userId: string | undefined,
  addNotification: (notification: Notification) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIdsRef = useRef<Set<string>>(new Set());

  const setupWebSocket = useCallback(() => {
    if (!userId) return;

    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socketUrl = `${protocol}://${window.location.hostname}:8000/ws/insumo/${userId}/`;
    const ws = new WebSocket(socketUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      console.log('WebSocket de insumos conectado');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (notificationIdsRef.current.has(data.id)) {
          return;
        }

        notificationIdsRef.current.add(data.id);
        const newNotification: Notification = {
          id: data.id,
          type: data.type,
          message: data.message,
          timestamp: new Date(parseInt(data.timestamp)).toISOString(),
          source: data.source,
          insumoId: data.insumo_id,
        };
        addNotification(newNotification);
      } catch (error) {
        console.error('Error procesando notificación de insumos:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket de insumos:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket de insumos cerrado');
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(3000 * (reconnectAttemptsRef.current + 1), 15000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          setupWebSocket();
        }, delay);
      }
    };
  }, [userId, addNotification]);

  useEffect(() => {
    setupWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [setupWebSocket]);

  
  const resetNotifications = () => {
    notificationIdsRef.current.clear();
  };

  return { resetNotifications };
};