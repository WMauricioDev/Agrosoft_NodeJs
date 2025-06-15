import React from "react";
import { motion } from "framer-motion";
import Plot from "react-plotly.js";
import { SensorChartsProps } from "@/types/iot/iotmqtt";

export const SensorCharts: React.FC<SensorChartsProps> = ({
  realTimeData,
  selectedDataType,
  selectedSensor,
}) => {
  // Agrupar datos por device_code
  const groupedData = realTimeData.reduce((acc, dato) => {
    if (dato[selectedDataType.key] != null) {
      const deviceCode = dato.device_code;
      if (!acc[deviceCode]) {
        acc[deviceCode] = [];
      }
      acc[deviceCode].push(dato);
    }
    return acc;
  }, {} as Record<string, typeof realTimeData>);

  // Preparar datos para gráficos
  const chartData = Object.entries(groupedData)
    .filter(([deviceCode]) => selectedSensor === "todos" || deviceCode === selectedSensor)
    .map(([deviceCode, data]) => {
      const sortedData = [...data].sort(
        (a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime()
      );

      // Datos para gráfico de barras (últimas 10 lecturas)
      const barData = sortedData.slice(0, 10).map((dato, i) => ({
        id: `${dato.id}-${i}`,
        name: new Date(dato.fecha_medicion).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        value: Number(dato[selectedDataType.key]),
      }));

      // Datos para gráfico de líneas (últimas 10 lecturas)
      const lineData = sortedData.slice(0, 10).map((dato, i) => ({
        id: `${dato.id}-${i}`,
        fecha: new Date(dato.fecha_medicion).toLocaleString("es-ES", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: Number(dato[selectedDataType.key]),
      }));

      return { deviceCode, barData, lineData };
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
      {/* Gráfico de barras */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{selectedDataType.label} por Hora</h2>
        <Plot
          data={chartData.map(({ deviceCode, barData }) => ({
            x: barData.map((d) => d.name),
            y: barData.map((d) => d.value),
            type: "bar",
            name: selectedSensor === "todos" ? deviceCode : selectedDataType.label,
            marker: { color: selectedSensor === "todos" ? getColor(deviceCode) : "#3b82f6" },
          }))}
          layout={{
            title: "",
            xaxis: { title: "Hora" },
            yaxis: { title: selectedDataType.label },
            showlegend: selectedSensor === "todos",
          }}
          style={{ width: "100%", height: "400px" }}
        />
        {chartData.length === 0 && (
          <p className="text-gray-600 text-center mt-4">No hay datos disponibles.</p>
        )}
      </motion.div>

      {/* Gráfico de líneas */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{selectedDataType.label} en el Tiempo</h2>
        <Plot
          data={chartData.map(({ deviceCode, lineData }) => ({
            x: lineData.map((d) => d.fecha),
            y: lineData.map((d) => d.value),
            type: "scatter",
            mode: "lines+markers",
            name: selectedSensor === "todos" ? deviceCode : selectedDataType.label,
            line: { color: selectedSensor === "todos" ? getColor(deviceCode) : "#10b981" },
          }))}
          layout={{
            title: "",
            xaxis: { title: "Fecha" },
            yaxis: { title: selectedDataType.label },
            showlegend: selectedSensor === "todos",
          }}
          style={{ width: "100%", height: "400px" }}
        />
        {chartData.length === 0 && (
          <p className="text-gray-600 text-center mt-4">No hay datos disponibles.</p>
        )}
      </motion.div>
    </div>
  );
};

// Función para asignar colores distintivos por sensor
const getColor = (deviceCode: string) => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const index = Math.abs(hashCode(deviceCode)) % colors.length;
  return colors[index];
};

// Función auxiliar para generar un hash simple
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

export default SensorCharts;