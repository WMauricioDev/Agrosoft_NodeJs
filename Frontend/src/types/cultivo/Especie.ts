export interface Especie {
    id: number;
    fk_tipo_especie: number;
    nombre: string;
    descripcion: string;
    largoCrecimiento: number;
    img?: string;
  }
  