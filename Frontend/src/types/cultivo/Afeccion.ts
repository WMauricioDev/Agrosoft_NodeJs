export interface Afeccion {
    id?: number;
    reporte?: number | null;
    nombre: string;
    descripcion: string;
    fecha_deteccion: string;
    gravedad: 'L' | 'M' | 'G';
    estado?: 'AC' | 'ST' | 'EC' | 'EL';
    plaga_id: number;
    cultivo_id: number;
    bancal_id: number;
  }
  
  export interface AfeccionDetalle {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_deteccion: string;
    gravedad: 'L' | 'M' | 'G';
    estado: 'AC' | 'ST' | 'EC' | 'EL';
    reporte: {
      id: number;
      usuario: string;
    } | null;
    plaga: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    cultivo: {
      id: number;
      nombre: string;
    };
    bancal: {
      id: number;
      nombre: string;
      ubicacion: string;
    };
  }