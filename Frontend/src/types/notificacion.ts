export interface ActivityData {
  id: number;
  tipo_actividad_nombre: string;
  prioridad: string;
  descripcion: string;
}

export interface PlagaData {
  id: number;
  plaga_nombre: string;
  bancal_nombre: string;
  observaciones: string;
  estado: string;
  fecha_reporte: string;
}

export type NotificationType =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'low_stock'
  | 'reporte_plaga'
  | string;

export interface NotificationBase {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string | number;
  source: 'activities' | 'bodega' | 'plagas';
  read?: boolean; // Added to support tracking read/unread status
}

export interface ActivityNotification extends NotificationBase {
  source: 'activities';
  actividad: ActivityData;
}

export interface BodegaNotification extends NotificationBase {
  source: 'bodega';
  insumoId?: number;
}

export interface PlagaNotification extends NotificationBase {
  source: 'plagas';
  plaga: PlagaData;
}

export type Notification = ActivityNotification | BodegaNotification | PlagaNotification;