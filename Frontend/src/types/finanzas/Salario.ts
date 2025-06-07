export interface Salario {
  id: number;
  rol_id: number;
  rol?: {
    id: number;
    nombre: string;
  };
  fecha_de_implementacion: string;
  valorJornal: number;
  activo: boolean;
  valorJornalFormatted?: string; 
  rol_nombre?: string;
}