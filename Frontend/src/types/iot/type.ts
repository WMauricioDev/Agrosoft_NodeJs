import React from "react";

export interface SensorData {
  id?: number | string;
  fk_sensor: number;
  sensor_nombre?: string;
  fk_bancal?: number | null;
  bancal_nombre?: string | null;
  temperatura?: number | null;
  humedad_ambiente?: number | null;
  humedad_suelo?: number | null;
  luminosidad?: number | null;
  lluvia?: number | null;
  velocidad_viento?: number | null;
  direccion_viento?: number | null;
  ph_suelo?: number | null;
  fecha_medicion: string;
  [key: string]: number | null | undefined | string;  
}

export interface Sensor {
  id: number;
  nombre: string;
  tipo_sensor: string;
  tipo_sensor_id: number;
  unidad_medida: string;
  descripcion?: string;
  estado: "activo" | "inactivo";
  medida_minima: number;
  medida_maxima: number;
  device_code?: string | null;
  bancal_id?: number | null;
  bancal_nombre?: string | null;
}

export interface TipoSensor {
  id?: number;
  label: string;
  key: string;
  icon: React.ReactNode;
  tipo_sensor_id: number;
  decimals: number;
  unidad_medida?: string;
}

export interface Bancal {
  id?: number;
  nombre: string;
  TamX: number;
  TamY: number;
  posX: number;
  posY: number;
  lote: number;
}

export interface EvapotranspiracionData {
  id: number;
  fk_bancal: number;
  fecha: string;
  valor: string;
  creado: string;
}

export interface DataTypeSelectorProps {
  selectedDataType: TipoSensor;
  setSelectedDataType: (type: TipoSensor) => void;
  dataTypes: TipoSensor[];
  className?: string;
}