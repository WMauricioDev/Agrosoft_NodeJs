{/*import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

interface Notification {
  message: string;
  type: "info" | "warning" | "success" | "error" | "low_stock";
  timestamp: number;
  insumoId?: number;
  uniqueId?: string;
}

interface BodegaInsumoNotificationsProps {
  userId2: number;
}

const BodegaInsumoNotifications: React.FC<BodegaInsumoNotificationsProps> = ({ userId2 }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const receivedIds = useRef<Set<string>>(new Set());
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const SOCKET_URL = `ws://${window.location.hostname}:8000/ws/inventario/bodega_insumo/`;

  const connectWebSocket = () => {
    if (!isAuthenticated || !userId2) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log(" No hay token disponible");
      return;
    }

    const wsUrl = `${SOCKET_URL}?token=${token}`;
    console.log(`Conectando a WebSocket: ${wsUrl}`);
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log(" Conexión WebSocket establecida correctamente");
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      socketRef.current?.send(JSON.stringify({ action: "sync" }));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(" Nuevo mensaje recibido:", data);

        const messageId = data.message_id || (data.id ? `${data.type}-${data.id}` : `${data.type}-${Date.now()}`);
        if (receivedIds.current.has(messageId)) {
          console.log("Notificación duplicada ignorada:", messageId);
          return;
        }
        receivedIds.current.add(messageId);

        const newNotification: Notification = {
          message: "",
          type: "info",
          timestamp: data.timestamp ? parseInt(data.timestamp) : Date.now(),
          insumoId: data.id,
          uniqueId: messageId,
        };

        const now = Date.now();
        let lastRefetch = localStorage.getItem("lastRefetch") ? parseInt(localStorage.getItem("lastRefetch")!, 10) : 0;
        if (now - lastRefetch > 2000) {
          queryClient.invalidateQueries({ queryKey: ["bodega_insumos"] });
          localStorage.setItem("lastRefetch", now.toString());
          console.log(" Refetch disparado");
        }

        if (data.type === "initial_state" && data.message) {
          newNotification.message = data.message
            .map((item: any) => `${item.bodega || "Desconocido"} - ${item.insumo || "Desconocido"}: ${item.cantidad || 0} unidades`)
            .join(", ");
          newNotification.type = "info";
        } else if (data.type === "create") {
          newNotification.message = `${data.bodega || "Desconocido"} - ${data.insumo || "Desconocido"}: ${data.cantidad || 0} unidades`;
          newNotification.type = "success";
        } else if (data.type === "update") {
          newNotification.message = `${data.bodega || "Desconocido"} - ${data.insumo || "Desconocido"}: ${data.cantidad || 0} unidades`;
          newNotification.type = "warning";
        } else if (data.type === "delete") {
          newNotification.message = `Registro ID ${data.id || "Desconocido"} eliminado`;
          newNotification.type = "error";
        } else if (data.type === "low_stock") {
          newNotification.message = `${data.bodega || "Desconocido"} - ${data.insumo || "Desconocido"}: Quedan ${data.cantidad || 0} unidades (bajo stock)`;
          newNotification.type = "low_stock";
        } else {
          return;
        }

        setNotifications((prev) => {
          const isDuplicate = prev.some(
            (n) => n.message === newNotification.message && n.timestamp === newNotification.timestamp
          );
          return isDuplicate ? prev : [newNotification, ...prev.slice(0, 19)];
        });

        if (data.type !== "initial_state") {
          addToast({
            title:
              data.type === "create"
                ? "Insumo Creado"
                : data.type === "update"
                ? "Insumo Actualizado"
                : data.type === "delete"
                ? "Insumo Eliminado"
                : "Alerta de Bajo Stock",
            description: newNotification.message,
            timeout: 5000,
          });
        }
      } catch (error) {
        console.error("Error procesando mensaje:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error(" Error en WebSocket:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket cerrado. Reconectando...");
      socketRef.current = null;
      if (!reconnectTimer.current && isAuthenticated) {
        reconnectTimer.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };
  };

  useEffect(() => {
    if (!isAuthenticated || !userId2) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [isAuthenticated, userId2]);

  if (!isAuthenticated || !userId2) return null;

  return (
    <div className="mt-4 w-72 bg-white p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ml-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold">Notificaciones de Bodega Insumos</h2>
        <button
          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expandir notificaciones" : "Colapsar notificaciones"}
        >
          {isCollapsed ? "▲" : "▼"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="max-h-56 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-xs">No hay notificaciones recientes</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.uniqueId} className="mb-2 pb-2 border-b border-gray-200">
                <p
                  className={`text-xs ${
                    notif.type === "error"
                      ? "text-red-600"
                      : notif.type === "warning"
                      ? "text-yellow-600"
                      : notif.type === "success"
                      ? "text-green-600"
                      : notif.type === "low_stock"
                      ? "text-orange-600"
                      : ""
                  }`}
                >
                  {notif.message}
                </p>
                <p className="text-[10px] text-gray-400">{new Date(notif.timestamp).toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BodegaInsumoNotifications;*/}