export interface CosechaGraficaData {
    por_mes: {
      meses: string[];
      cantidades: number[];
      unidad_medida: string;
    };
    por_cultivo: {
      cultivos: string[];
      cantidades: number[];
      unidad_medida: string;
    };
    por_dia_semana: {
      dias: string[];
      cantidades: number[];
      unidad_medida: string;
    };
    meta: {
      fecha_inicio: string;
      fecha_fin: string;
      total_registros: number;
    };
  }