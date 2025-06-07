export interface Lote {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  tam_x: number;
  tam_y: number;
  latitud: number;
  longitud: number;
}

export interface LoteResponse {
  lotes: Lote[];
}