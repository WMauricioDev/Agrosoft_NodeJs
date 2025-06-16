export interface Venta {
  id?: number;
  fecha: string;
  monto_entregado: number;
  cambio: number;
  detalles?: DetalleVenta[];
}

export interface DetalleVenta {
  id?: number;
  venta?: number;
  producto_id: number; 
  cantidad: number;
  unidades_de_medida_id: number; 
  total: number; 
  precio_unitario?: number; 
}