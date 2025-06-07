export interface ReportePagoDetalle {
    id: number;
    usuario: {
      id: number;
      username: string;
      email: string;
    };
    actividades: {
      id: number;
      nombre: string;
    }[];
    salario: {
      id: number;
      descripcion: string;
      valor: number;
    };
    total_pago: number;
    fecha_pago: string;
    mes: string; 
  }
  