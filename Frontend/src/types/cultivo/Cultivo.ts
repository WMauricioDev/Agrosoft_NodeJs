export interface Cultivo {
  id?: number;
  Especie_id: number; 
  Bancal_id: number; 
  nombre: string;
  unidad_de_medida_id: number;
  activo: boolean;
  fechaSiembra: string; 
}