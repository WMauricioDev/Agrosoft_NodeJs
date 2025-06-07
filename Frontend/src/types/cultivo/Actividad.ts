export interface Actividad {
  id?: number;
  tipo_actividad: number;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  usuarios: number[];
  cultivo: number;
  estado: string;
  prioridad: string;
  instrucciones_adicionales: string;
  insumos?: { insumo: number; cantidad_usada: number }[];
  herramientas?: {
    herramienta: number;
    entregada?: boolean;
    devuelta?: boolean;
    fecha_devolucion?: string | null;
  }[];
  prestamos_insumos?: number[];
  prestamos_herramientas?: number[]
  usuarios_data?:number[]
}
