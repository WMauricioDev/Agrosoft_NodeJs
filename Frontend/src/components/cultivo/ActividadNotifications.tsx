import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";

interface Notification {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
  activityId?: number;
  uniqueId?: string;
}

interface ActividadNotificationsProps {
  userId: number;
  isAdmin?: boolean;
}

const ActividadNotifications: React.FC<ActividadNotificationsProps> = ({ 
  userId, 
  isAdmin = false 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const receivedIds = useRef<Set<string>>(new Set());
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if ((!userId || userId === 0) && !isAdmin) return;

    const wsUrl = isAdmin 
      ? `ws://${window.location.hostname}:8000/ws/actividad/admin/` 
      : `ws://${window.location.hostname}:8000/ws/actividad/${userId}/`;

    console.log(`Conectando a WebSocket: ${wsUrl}`);
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("Conexión WebSocket establecida correctamente");
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Verificar duplicados usando unique_id
        if (data.unique_id && receivedIds.current.has(data.unique_id)) {
          console.log("Notificación duplicada ignorada:", data.unique_id);
          return;
        }

        if (data.unique_id) {
          receivedIds.current.add(data.unique_id);
        }

        const newNotification: Notification = {
          message: data.message,
          type: data.type || 'info',
          timestamp: data.timestamp || Date.now(),
          activityId: data.activity_id,
          uniqueId: data.unique_id
        };

        setNotifications(prev => {
          const isDuplicate = prev.some(
            n => n.message === data.message && 
                 n.timestamp === newNotification.timestamp
          );
          
          return isDuplicate ? prev : [newNotification, ...prev.slice(0, 19)]; 
        });

        addToast({
          title: "Nueva Actividad",
          description: data.message,
          timeout: 5000,
        });
      } catch (error) {
        console.error("Error procesando mensaje:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket cerrado. Reconectando...");
      if (!reconnectTimer.current) {
        reconnectTimer.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [userId, isAdmin]);

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <h2 className="text-lg font-semibold mb-2">Notificaciones</h2>
      <div className="max-h-60 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay notificaciones recientes</p>
        ) : (
          notifications.map((notif, index) => (
            <div key={`${notif.uniqueId || index}`} className="mb-2 pb-2 border-b border-gray-100">
              <p className={`text-sm ${
                notif.type === 'error' ? 'text-red-600' :
                notif.type === 'warning' ? 'text-yellow-600' :
                notif.type === 'success' ? 'text-green-600' : ''
              }`}>
                {notif.message}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(notif.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActividadNotifications;