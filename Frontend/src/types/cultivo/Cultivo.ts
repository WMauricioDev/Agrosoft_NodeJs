export interface Cultivo {
  id?: number;
  Especie: number; 
  Bancal: number; 
  nombre: string;
  unidad_de_medida?: string;
  activo: boolean;
  fechaSiembra: string; 
}