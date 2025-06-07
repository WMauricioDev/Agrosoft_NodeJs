import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import DefaultLayout from "@/layouts/default";
import { useSensores } from "@/hooks/iot/mqtt/useSensores";
import { usePublishCommand } from "@/hooks/iot/mqtt/usePublishCommand";
import { DataTypeSelector } from "@/components/Iot/mqtt/DataTypeSelector";
import { ViewModeSelector } from "@/components/Iot/mqtt/ViewModeSelector";
import { SensorStats } from "@/components/Iot/mqtt/SensorStats";
import { SensorCharts } from "@/components/Iot/mqtt/SensorCharts";
import { SensorTable } from "@/components/Iot/mqtt/SensorTable";
import { DataType, ViewMode } from "@/types/iot/iotmqtt";

// Definir tipos de datos para temperatura y humedad
const dataTypes: DataType[] = [
  {
    label: "Temperatura (°C)",
    key: "temperatura",
    icon: <FaTemperatureHigh className="text-red-500" />,
    tipo_sensor: "temperatura",
    decimals: 3,
  },
  {
    label: "Humedad (%)",
    key: "humedad_ambiente",
    icon: <FaTint className="text-blue-500" />,
    tipo_sensor: "humedad_ambiente",
    decimals: 1,
  },
];

// Definir modos de vista para tiempo real y todos los datos
const viewModes: ViewMode[] = [
  { id: "realtime", label: "Tiempo Real" },
  { id: "allData", label: "Todos los Datos" },
];

const SensoresPage: React.FC = () => {
  const { realTimeData, isLoading, error, mqttClient } = useSensores();
  const [sensorActive, setSensorActive] = useState(true);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModes[0]);
  const publishCommand = usePublishCommand(mqttClient, sensorActive, setSensorActive);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-50">
          <p className="text-gray-700">Cargando datos...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-50">
          <p className="text-red-500 text-center">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Datos del Sensor DHT22</h1>

          {/* Fila 1: Tarjetas de datos */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {dataTypes.map((type, index) => {
              const latest = realTimeData
                .filter((d) => d[type.key] !== null)
                .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime())[0];

              return (
                <motion.div
                  key={type.key}
                  className="bg-white rounded-xl shadow-md p-4 text-center w-56 h-32 flex flex-col justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="text-base font-semibold text-gray-700 flex items-center justify-center gap-2">
                    {type.icon} {type.label}
                  </p>
                  <p
                    className="text-3xl font-bold mt-2"
                    style={{ color: type.key === "temperatura" ? "#dc2626" : "#2563eb" }}
                  >
                    {latest?.[type.key] !== null && typeof latest?.[type.key] === "number"
                      ? latest[type.key].toFixed(type.decimals)
                      : "N/A"}{" "}
                    {type.key === "temperatura" ? "°C" : "%"}
                  </p>
                </motion.div>
              );
            })}
            <motion.button
              className="bg-green-600 rounded-xl shadow-md p-4 text-center w-56 h-32 flex flex-col justify-center items-center text-white text-sm font-semibold"
              onClick={() => navigate("/iot/datosmeteorologicos")}
              whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Datos Históricos
            </motion.button>
          </div>

          {/* Fila 2: Selectores */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <DataTypeSelector selectedDataType={selectedDataType} setSelectedDataType={setSelectedDataType} />
            <ViewModeSelector selectedViewMode={selectedViewMode} setSelectedViewMode={setSelectedViewMode} />
          </div>

          {/* Fila 3: Botones de control */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            <motion.button
              className={`px-3 py-1 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md ${
                sensorActive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => publishCommand(sensorActive ? "STOP_SENSOR" : "START_SENSOR")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sensorActive ? "Apagar Sensor" : "Encender Sensor"}
            </motion.button>
            <motion.button
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-blue-700"
              onClick={() => publishCommand("RESTART_WIFI")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reiniciar WiFi
            </motion.button>
          </div>

          {/* Renderizar gráficos o estadísticas/tabla según modo */}
          {selectedViewMode.id === "realtime" ? (
            <SensorCharts realTimeData={realTimeData} selectedDataType={selectedDataType} />
          ) : (
            <>
              <SensorStats realTimeData={realTimeData} />
              <SensorTable realTimeData={realTimeData} />
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SensoresPage;