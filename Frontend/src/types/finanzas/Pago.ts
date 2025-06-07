export interface Pago {
  id?: number;
  actividades: number[];
  salario: number;
  fecha_inicio: string;
  fecha_fin: string;
  horas_trabajadas: number;
  jornales: number;
  total_pago: number;
  fecha_calculo?: string;
  usuario_nombre?: string; 

}

export interface CalculoPagoParams {
  usuario_id: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface PagoCreateParams {
  fecha_inicio: string;
  fecha_fin: string;
}