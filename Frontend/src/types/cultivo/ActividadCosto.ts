export interface CostoActividad {
  actividad: string;
  costo_total: number;
  desglose: {
    insumos: number;
    herramientas: number;
    mano_de_obra: number;
  };
  tiempo_invertido_horas: number;
  fecha_inicio: string;
  fecha_fin: string;
  usuarios: string[];
}

export interface ActividadCostosData {
  tipo_grafico: string;
  periodo: {
    fecha_inicio?: string;
    fecha_fin?: string;
  };
  data: CostoActividad[];
}

export interface ActividadCosto {
  actividad: string;
  desglose: {
    insumos: number;
    herramientas: number;
    mano_de_obra: number;
  };
  costo_total: number;
  tiempo_invertido_horas: number;
  fecha_inicio: string;
  fecha_fin: string;
  usuarios: string[];
}

export interface ActividadConsolidada {
  actividad: string;
  insumos: number;
  herramientas: number;
  mano_de_obra: number;
  total: number;
  count: number;
}

export interface PlotData {
  x?: string[];
  y?: number[];
  labels?: string[];
  values?: number[];
  name?: string;
  type: string;
  marker?: { color: string };
  textinfo?: string;
  insidetextorientation?: string;
  hoverinfo?: string;
  hole?: number;
}