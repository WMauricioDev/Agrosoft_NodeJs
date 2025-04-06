export interface Plaga {
    id?: number;
    fk_tipo_plaga_id: number;
    nombre: string;
    descripcion: string;
    img: File | null;
  }
  