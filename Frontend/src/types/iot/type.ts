export interface Sensor {
  id: number;
  nombre: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion?: string;
  medida_minima?: number;
  medida_maxima?: number;
}

export interface SensorData {
  id?: number;
  fk_sensor: number;
  temperature: number;
  humidity: number;
  fecha_medicion?: string;
  message?: string;
}