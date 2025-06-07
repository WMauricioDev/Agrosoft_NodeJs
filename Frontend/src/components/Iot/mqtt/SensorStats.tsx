import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { SensorStatsProps } from "@/types/iot/iotmqtt";

export const SensorStats: React.FC<SensorStatsProps> = ({ realTimeData }) => {
  // Calcular estadisticas usando useMemo para optimizar
  const stats = useMemo(() => {
    // Filtrar y mapear valores de temperatura
    const tempValues = realTimeData
      .filter((d) => d.fk_sensor === 1 && d.temperatura != null)
      .map((d) => d.temperatura!);
    // Filtrar y mapear valores de humedad
    const humValues = realTimeData
      .filter((d) => d.fk_sensor === 2 && d.humedad_ambiente != null)
      .map((d) => d.humedad_ambiente!);

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
  }, [realTimeData]);

  return (
    <motion.div
      className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {// Mostrar estadisticas de temperatura
      }
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Temperatura (°C)</h3>
        <p>Max: {stats.temp.max?.toFixed(3) ?? "N/A"}</p>
        <p>Min: {stats.temp.min?.toFixed(3) ?? "N/A"}</p>
        <p>Promedio: {stats.temp.avg?.toFixed(3) ?? "N/A"}</p>
      </div>
      {// Mostrar estadisticas de humedad
      }
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