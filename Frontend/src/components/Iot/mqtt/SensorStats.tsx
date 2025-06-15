import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { SensorStatsProps } from "@/types/iot/iotmqtt";

export const SensorStats: React.FC<SensorStatsProps & { selectedSensor: string | "todos" }> = ({
  realTimeData,
  selectedSensor,
}) => {
  // Calcular estadísticas usando useMemo
  const stats = useMemo(() => {
    const filteredData = realTimeData.filter(
      (d) => selectedSensor === "todos" || d.device_code === selectedSensor
    );

    const tempValues = filteredData
      .filter((d) => d.temperatura != null)
      .map((d) => Number(d.temperatura));
    const humValues = filteredData
      .filter((d) => d.humedad_ambiente != null)
      .map((d) => Number(d.humedad_ambiente));

    return {
      temp: {
        max: tempValues.length ? Math.max(...tempValues) : null,
        min: tempValues.length ? Math.min(...tempValues) : null,
        avg: tempValues.length ? tempValues.reduce((a, b) => a + b, 0) / tempValues.length : null,
      },
      hum: {
        max: humValues.length ? Math.max(...humValues) : null,
        min: humValues.length ? Math.min(...humValues) : null,
        avg: humValues.length ? humValues.reduce((a, b) => a + b, 0) / humValues.length : null,
      },
    };
  }, [realTimeData, selectedSensor]);

  return (
    <motion.div
      className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Temperatura (°C)</h3>
        <p>Max: {stats.temp.max?.toFixed(2) ?? "N/A"}</p>
        <p>Min: {stats.temp.min?.toFixed(2) ?? "N/A"}</p>
        <p>Promedio: {stats.temp.avg?.toFixed(2) ?? "N/A"}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Humedad (%)</h3>
        <p>Max: {stats.hum.max?.toFixed(1) ?? "N/A"}</p>
        <p>Min: {stats.hum.min?.toFixed(1) ?? "N/A"}</p>
        <p>Promedio: {stats.hum.avg?.toFixed(1) ?? "N/A"}</p>
      </div>
    </motion.div>
  );
};

export default SensorStats;