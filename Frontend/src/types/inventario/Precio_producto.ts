export interface UnidadMedida {
    id: number;
    nombre: string;
    descripcion: string | null;
    creada_por_usuario: boolean;
    fecha_creacion: string;
}

export interface PrecioProducto {
  id: number;
  Producto_id: number; 
  nombre_producto: string;
  unidad_medida: UnidadMedida | null;
  precio: number | string; 
  fecha_registro: string;
  stock: number;
  fecha_caducidad: string | null;
}
