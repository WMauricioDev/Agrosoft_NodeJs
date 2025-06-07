export interface Ingreso {
    por_mes: {
      meses: string[];
      ingresos: number[];
      cantidades: number[];
      transacciones: number[];
    };
    por_producto: {
      productos: string[];
      ingresos: number[];
      cantidades: number[];
      transacciones: number[];
    };
    por_dia_semana: {
      dias: string[];
      ingresos: number[];
      cantidades: number[];
      transacciones: number[];
    };
    por_cliente?: {
      clientes: string[];
      ingresos: number[];
      cantidades: number[];
      transacciones: number[];
    };
    resumen: {
      total_ingresos: number;
      total_cantidad: number;
      total_transacciones: number;
      fecha_inicio: string;
      fecha_fin: string;
    };
  }