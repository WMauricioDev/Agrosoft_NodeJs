export interface Plaga {
    id?: number;
    fk_tipo_plaga_id: number;
    tipo_plaga: string;
    nombre: string;
    descripcion: string;
    img: File | null;
    tipo_plaga_nombre: string;

  }
  