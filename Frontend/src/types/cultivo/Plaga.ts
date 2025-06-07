export interface Plaga {
    id?: number;
    fk_tipo_plaga: number;
    tipo_plaga: string;
    nombre: string;
    descripcion: string;
    img: File | null;
  }
  