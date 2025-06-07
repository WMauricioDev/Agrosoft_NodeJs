export interface ReportePlaga {
    id?: number;
    usuario?: number;
    plaga_id: number;
    bancal_id: number;
    observaciones: string;
    estado?: 'PE' | 'RE' | 'AT';
    fecha_reporte?: string;
  }
  
  export interface ReportePlagaDetalle {
    id: number;
    usuario: {
      id: number;
      username: string;
      email: string;
    };
    plaga: {
      id: number;
      nombre: string;
      descripcion: string;
    };
    bancal: {
      id: number;
      nombre: string;
      ubicacion: string;
    };
    fecha_reporte: string;
    observaciones: string;
    estado: 'PE' | 'RE' | 'AT';
  }