export interface Actividad {
  id?: number;
  tipo_actividad_id: number;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  cultivo_id: number;
  estado: string;
  prioridad: string;
  instrucciones_adicionales: string;
  usuarios: number[]; // Cambiado de usuarios_id a usuarios para coincidir con el backend
  insumos: { insumo_id: number; cantidad_usada: number; unidad_medida_id?: number | null }[]; // Cambiado de insumo_id a insumos
  herramientas: { herramienta_id: number; cantidad_entregada: number; devuelta: boolean }[]; // Cambiado de herramienta_id a herramientas
  prestamos_insumos?: number[];
  prestamos_herramientas?: number[];
  usuarios_data?: string[];
}