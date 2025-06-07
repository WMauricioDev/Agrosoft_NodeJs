export interface PagoGraficaData {
    por_mes: {
      meses: string[];
      total_pago: number[];
      usuario_top: string[];
    };
    por_usuario: {
      usuarios: string[];
      total_pago: number[];
    };
    por_dia_semana: {
      dias: string[];
      total_pago: number[];
    };
    meta: {
      fecha_inicio: string;
      fecha_fin: string;
      total_registros: number;
    };
  }
  