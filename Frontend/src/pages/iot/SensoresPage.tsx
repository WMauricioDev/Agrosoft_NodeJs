import { useState, useMemo } from "react";
import DefaultLayout from "@/layouts/default";
import { useSensores } from "@/hooks/iot/sensores/useSensores";
import { useDatosMeteorologicosHistoricos } from "@/hooks/iot/datos_sensores/useDatosMeteorologicosHistoricos";
import { useNavigate } from "react-router-dom";
import { Sensor, TipoSensor } from "@/types/iot/type";
import { useWebSocketData } from "@/hooks/iot/datos_sensores/useWebSocketData";
import { DataTypeSelector } from "@/components/Iot/sensores/DataTypeSelector2";
import { SensorSelector } from "@/components/Iot/sensores/SensorSelector";
import { SensorDataCards } from "@/components/Iot/sensores/SensorDataCards";
import { SensorCharts } from "@/components/Iot/sensores/SensorCharts";

const dataTypes: TipoSensor[] = [
  {
    label: "Temperatura (°C)",
    key: "temperatura",
    icon: <i className="fas fa-thermometer-half text-red-500" />,
    tipo_sensor_id: 1,
    decimals: 3,
    unidad_medida: "°C",
  },
  {
    label: "Humedad (%)",
    key: "humedad_ambiente",
    icon: <i className="fas fa-tint text-blue-500" />,
    tipo_sensor_id: 2,
    decimals: 1,
    unidad_medida: "%",
  },
];

const SensoresPage: React.FC = () => {
  const [selectedDataType, setSelectedDataType] = useState<TipoSensor>(dataTypes[0]);
  const [selectedSensor, setSelectedSensor] = useState<number | "todos">("todos");
  const { sensores, isLoading: sensoresLoading, error: sensoresError } = useSensores();
  const { isLoading: historicosLoading, error: historicosError } = useDatosMeteorologicosHistoricos();
  const { realTimeData } = useWebSocketData(sensores);
  const navigate = useNavigate();

  const filteredSensores = useMemo(() => {
    return sensores.filter((sensor: Sensor) => sensor.tipo_sensor === selectedDataType.key);
  }, [sensores, selectedDataType]);

  if (sensoresLoading || historicosLoading) {
    return (
      <DefaultLayout>
        <div className="w-full flex items-center justify-center h-screen bg-gray-50">
          <p className="text-gray-700 text-lg">Cargando datos...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (sensoresError || historicosError) {
    return (
      <DefaultLayout>
        <div className="w-full flex flex-col items-center justify-center h-screen bg-gray-50">
          <p className="text-red-500 text-center mb-4">{sensoresError?.message || historicosError?.message}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center bg-gray-50 px-3 py-2">
        <div className="w-full max-w-6xl flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Datos en Tiempo Real</h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <DataTypeSelector
              selectedDataType={selectedDataType}
              setSelectedDataType={(type) => {
                setSelectedDataType(type);
                setSelectedSensor("todos");
              }}
              dataTypes={dataTypes}
            />
            <SensorSelector
              selectedSensor={selectedSensor}
              setSelectedSensor={setSelectedSensor}
              filteredSensores={filteredSensores}
            />
          </div>
          <SensorDataCards
            realTimeData={realTimeData}
            selectedSensor={selectedSensor}
            dataTypes={dataTypes}
            navigate={navigate}
          />
          <SensorCharts
            realTimeData={realTimeData}
            selectedDataType={selectedDataType}
            selectedSensor={selectedSensor}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SensoresPage;