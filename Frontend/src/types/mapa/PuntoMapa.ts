export interface PuntoMapa {
  id?: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  usuario_id?: number | null; 
  cultivo_id?: number | null; 
}