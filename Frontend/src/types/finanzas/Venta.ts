export interface Venta {
  id: number;
  fecha: string;
  monto_entregado: number;
  cambio: number;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  id?: number;
  producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  unidades_de_medida: number;
  unidad_medida: string;
}