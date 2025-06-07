export interface SensorData {
  id: number;
  device_code: string;
  temperatura: number | null;
  humedad_ambiente: number | null;
  fecha_medicion: string;
}

export interface DataType {
  label: string;
  key: "temperatura" | "humedad_ambiente";
  icon: Element;
  tipo_sensor: string;
  decimals: number;
}

export interface ViewMode {
  id: "realtime" | "allData";
  label: string;
}

export interface Sensor {
  id: number;
  nombre: string;
  tipo_sensor: string;
  device_code: string;
}

export interface SensorChartsProps {
  realTimeData: SensorData[];
  selectedDataType: DataType;
  selectedSensor: number | "todos";
}

export interface SensorStatsProps {
  realTimeData: SensorData[];
  selectedSensor: number | "todos";
}

export interface DataTypeSelectorProps {
  selectedDataType: DataType;
  setSelectedDataType: (type: DataType) => void;
}

export interface ViewModeSelectorProps {
  selectedViewMode: ViewMode;
  setSelectedViewMode: (mode: ViewMode) => void;
}