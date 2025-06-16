// ...otros imports
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import { useSensores } from "@/hooks/iot/mqtt/useSensores";
import { usePublishCommand } from "@/hooks/iot/mqtt/usePublishCommand";
import { useRegistrarDatosMeteorologicos } from "@/hooks/iot/datos_sensores/useRegistrarDatosMeteorologicos";
import { DataTypeSelector } from "@/components/Iot/mqtt/DataTypeSelector";
import { ViewModeSelector } from "@/components/Iot/mqtt/ViewModeSelector";
import { SensorStats } from "@/components/Iot/mqtt/SensorStats";
import { SensorCharts } from "@/components/Iot/mqtt/SensorCharts";
import { SensorTable } from "@/components/Iot/mqtt/SensorTable";
import { DataType, ViewMode } from "@/types/iot/iotmqtt";

const dataTypes: DataType[] = [
  {
    label: "Temperatura (°C)",
    key: "temperatura",
    icon: <FaTemperatureHigh className="text-red-500" />,
    tipo_sensor: "temperatura",
    decimals: 2,
  },
  {
    label: "Humedad (%)",
    key: "humedad_ambiente",
    icon: <FaTint className="text-blue-500" />,
    tipo_sensor: "humedad_ambiente",
    decimals: 1,
  },
];

const viewModes: ViewMode[] = [
  { id: "realtime", label: "Tiempo Real" },
  { id: "allData", label: "Todos los Datos" },
];

const SensoresPage: React.FC = () => {
  const { realTimeData = [], isLoading, error, mqttClient } = useSensores();
  const { mutate: registrarDatos } = useRegistrarDatosMeteorologicos();
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModes[0]);
  const [selectedSensor, setSelectedSensor] = useState<string | "todos">("todos");
  const [sensorActive, setSensorActive] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const publishCommand = usePublishCommand(mqttClient, sensorActive, setSensorActive);

  const sensores = useMemo(() => {
    const unique = new Map();
    realTimeData.forEach((d) => {
      if (!unique.has(d.device_code)) {
        unique.set(d.device_code, {
          id: d.id,
          device_code: d.device_code,
          nombre: d.device_code || `Sensor ${d.id}`,
          fk_bancal_id: d.fk_bancal_id || null,
        });
      }
    });
    return Array.from(unique.values());
  }, [realTimeData]);

  useEffect(() => {
    setSensorActive(
      sensores.reduce((acc, s) => ({ ...acc, [s.device_code]: true }), {})
    );
  }, [sensores]);

  const filteredData = useMemo(
    () => realTimeData.filter((d) => selectedSensor === "todos" || d.device_code === selectedSensor),
    [realTimeData, selectedSensor]
  );

  const registroSet = useRef(new Set<string>());
  const alternador = useRef(0);

  useEffect(() => {
    for (const data of realTimeData) {
      const key = `${data.device_code}-${data.fecha_medicion}`;
      if (registroSet.current.has(key)) continue;

      if (alternador.current % 2 === 0) {
        registrarDatos({
          device_code: data.device_code,
          fk_bancal_id: data.fk_bancal_id || null,
          temperatura: data.temperatura ?? null,
          humedad_ambiente: data.humedad_ambiente ?? null,
          luminosidad: null,
          lluvia: null,
          velocidad_viento: null,
          direccion_viento: null,
          humedad_suelo: null,
          ph_suelo: null,
          fecha_medicion: data.fecha_medicion,
        });
      }

      alternador.current += 1;
      registroSet.current.add(key);
    }
  }, [realTimeData]);

  if (isLoading) {
    return <DefaultLayout><p>Cargando sensores...</p></DefaultLayout>;
  }

  if (error) {
    return <DefaultLayout><p className="text-red-600">{error.message}</p></DefaultLayout>;
  }

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Sensores</h1>

        <SensorStats realTimeData={realTimeData} selectedSensor={selectedSensor} />
        <div className="flex gap-4 mb-4">
          <DataTypeSelector
            dataTypes={dataTypes}
            selectedDataType={selectedDataType}
            setSelectedDataType={setSelectedDataType}
          />
          <ViewModeSelector
            viewModes={viewModes}
            selectedViewMode={selectedViewMode}
            setSelectedViewMode={setSelectedViewMode}
          />
        </div>

        {selectedViewMode.id === "realtime" ? (
          <SensorCharts
            realTimeData={filteredData}
            selectedSensor={selectedSensor}
            selectedDataType={selectedDataType}
          />
        ) : (
          <SensorTable realTimeData={filteredData} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default SensoresPage;
