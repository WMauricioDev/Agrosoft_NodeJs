import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import DefaultLayout from "@/layouts/default";
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
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModes[0]);
  const [selectedSensor, setSelectedSensor] = useState<string | "todos">("todos");
  const [sensorActive, setSensorActive] = useState<{ [key: string]: boolean }>({});
  const { mutate: registrarDatos } = useRegistrarDatosMeteorologicos();
  const navigate = useNavigate();
  const publishCommand = usePublishCommand(mqttClient, sensorActive, setSensorActive);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Log inicial para verificar montaje
  console.log("[SensoresPage] Componente montado. realTimeData inicial:", realTimeData);

  // Obtener lista única de sensores desde realTimeData
  const sensores = useMemo(() => {
    const uniqueSensors = new Map();
    realTimeData.forEach((data) => {
      if (!uniqueSensors.has(data.device_code)) {
        uniqueSensors.set(data.device_code, {
          id: data.id,
          device_code: data.device_code,
          nombre: data.device_code || `Sensor ${data.id}`,
        });
      }
    });
    console.log("[SensoresPage] Sensores generados:", Array.from(uniqueSensors.values()));
    return Array.from(uniqueSensors.values());
  }, [realTimeData]);

  // Inicializar estado de sensores activos
  useEffect(() => {
    console.log("[SensoresPage] Inicializando sensorActive con sensores:", sensores);
    const initialSensorActive = sensores.reduce((acc, sensor) => ({
      ...acc,
      [sensor.device_code]: true,
    }), {});
    setSensorActive(initialSensorActive);
  }, [sensores]);

  // Filtrar datos por sensor seleccionado
  const filteredData = useMemo(() => {
    return realTimeData.filter(
      (d) => selectedSensor === "todos" || d.device_code === selectedSensor
    );
  }, [realTimeData, selectedSensor]);

  // Registrar datos cada 10 segundos
  useEffect(() => {
    console.log("[SensoresPage] Configurando useEffect para intervalo de POST");
    if (intervalRef.current) {
      console.log("[SensoresPage] Limpiando intervalo existente");
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      console.log("[SensoresPage] Ejecutando intervalo de 10 segundos. realTimeData:", realTimeData);
      if (!realTimeData.length) {
        console.log("[SensoresPage] No hay datos en realTimeData, omitiendo POST");
        return;
      }

      const sensorDataMap = new Map<string, { temperatura: number | null; humedad_ambiente: number | null }>();
      realTimeData.forEach((data) => {
        if (!sensorDataMap.has(data.device_code)) {
          sensorDataMap.set(data.device_code, { temperatura: null, humedad_ambiente: null });
        }
        const current = sensorDataMap.get(data.device_code)!;
        if (data.temperatura != null) current.temperatura = data.temperatura;
        if (data.humedad_ambiente != null) current.humedad_ambiente = data.humedad_ambiente;
      });

      sensorDataMap.forEach((data, device_code) => {
        console.log(`[SensoresPage] Procesando sensor ${device_code}. Datos:`, data);
        const payload = {
          device_code,
          fk_bancal_id: null,
          temperatura: data.temperatura != null ? parseFloat(data.temperatura.toFixed(2)) : null,
          humedad_ambiente: data.humedad_ambiente != null ? parseFloat(data.humedad_ambiente.toFixed(2)) : null,
          luminosidad: null,
          lluvia: null,
          velocidad_viento: null,
          direccion_viento: null,
          humedad_suelo: null,
          ph_suelo: null,
          fecha_medicion: new Date().toISOString(),
        };

        console.log(`[SensoresPage] Enviando POST para sensor ${device_code}:`, payload);
        registrarDatos(payload, {
          onSuccess: (response) => console.log(`[SensoresPage] POST exitoso para ${device_code}:`, response),
          onError: (err) => console.error(`[SensoresPage] Error en POST para ${device_code}:`, err.message),
        });
      });
    }, 10 * 1000); // 10 segundos

    return () => {
      console.log("[SensoresPage] Limpiando intervalo de POST");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [registrarDatos]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="w-full flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
          <p className="text-gray-700">Cargando datos...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="w-full flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
          <p className="text-red-500 text-center">{error.message || "Error al cargar datos"}</p>
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
      <div className="w-full flex flex-col items-center bg-gray-50 px-3 py-2 min-h-screen">
        <div className="w-full max-w-6xl flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Datos de Sensores</h1>

          {/* Selector de sensor */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Sensor</label>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="p-2 border rounded w-full text-sm"
            >
              <option value="todos">Todos los sensores</option>
              {sensores.map((sensor) => (
                <option key={sensor.device_code} value={sensor.device_code}>
                  {sensor.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tarjetas de datos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {dataTypes.map((type, index) => {
              const latest = filteredData
                .filter((d) => d[type.key] != null)
                .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime())[0];

              return (
                <motion.div
                  key={type.key}
                  className="bg-white rounded-xl shadow-md p-4 text-center w-full sm:w-56 h-32 flex flex-col justify-center items-center"
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
                    {latest && latest[type.key] != null
                      ? Number(latest[type.key]).toFixed(type.decimals)
                      : "N/A"}{" "}
                    {type.key === "temperatura" ? "°C" : "%"}
                  </p>
                </motion.div>
              );
            })}
            <motion.button
              className="bg-green-600 rounded-xl shadow-md p-4 text-center w-full sm:w-56 h-32 flex flex-col justify-center items-center text-white text-sm font-semibold"
              onClick={() => navigate("/iot/datosmeteorologicos")}
              whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Datos Históricos
            </motion.button>
          </div>

          {/* Selectores */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
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

          {/* Botones de control */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {sensores.map((sensor) => (
              <motion.button
                key={sensor.device_code}
                className={`px-3 py-1 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md ${
                  sensorActive[sensor.device_code]
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() =>
                  publishCommand(
                    sensorActive[sensor.device_code] ? "STOP_SENSOR" : "START_SENSOR",
                    sensor.device_code
                  )
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sensorActive[sensor.device_code]
                  ? `Apagar ${sensor.nombre}`
                  : `Encender ${sensor.nombre}`}
              </motion.button>
            ))}
            <motion.button
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-blue-700"
              onClick={() => publishCommand("RESTART_WIFI")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reiniciar WiFi
            </motion.button>
          </div>

          {/* Renderizar gráficos o estadísticas/tabla */}
          <div className="w-full h-80">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  No hay datos disponibles para el sensor seleccionado.
                </p>
              </div>
            ) : selectedViewMode.id === "realtime" ? (
              <SensorCharts
                realTimeData={filteredData}
                selectedDataType={selectedDataType}
                selectedSensor={selectedSensor}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <SensorStats realTimeData={filteredData} selectedSensor={selectedSensor} />
                <div className="max-h-48 overflow-y-auto">
                  <SensorTable realTimeData={filteredData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SensoresPage;