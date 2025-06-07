import React from "react";
import { motion } from "framer-motion";
import Plot from "react-plotly.js";
import { SensorChartsProps } from "@/types/iot/iotmqtt";

export const SensorCharts: React.FC<SensorChartsProps> = ({ realTimeData, selectedDataType, selectedSensor }) => {
  // Filtrar datos por tipo de dato y device_code
  const filteredData = realTimeData.filter(
    (dato) =>
      dato[selectedDataType.key] != null &&
      (selectedSensor === "todos" || dato.device_code === selectedSensor)
  );

  // Preparar datos para gráfico de barras (últimas 10 lecturas)
  const barChartData = [...filteredData]
    .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime())
    .slice(0, 10)
    .map((dato, i) => ({
      id: `${dato.id}-${i}`,
      name: new Date(dato.fecha_medicion).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      value: typeof dato[selectedDataType.key] === "number" ? Number(dato[selectedDataType.key]) : 0,
    }));

  // Preparar datos para gráfico de líneas (últimas 10 lecturas)
  const lineChartData = [...filteredData]
    .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime())
    .slice(0, 10)
    .map((dato, i) => ({
      id: `${dato.id}-${i}`,
      fecha: new Date(dato.fecha_medicion).toLocaleString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: typeof dato[selectedDataType.key] === "number" ? Number(dato[selectedDataType.key]) : 0,
    }));

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
          data={[
            {
              x: barChartData.map((d) => d.name),
              y: barChartData.map((d) => d.value),
              type: "bar",
              name: selectedDataType.label,
              marker: { color: "#3b82f6" },
            },
          ]}
          layout={{
            title: "",
            xaxis: { title: "Hora" },
            yaxis: { title: selectedDataType.label },
            showlegend: false,
          }}
          style={{ width: "100%", height: "400px" }}
        />
        {barChartData.length === 0 && <p className="text-gray-600 text-center mt-4">No hay datos disponibles.</p>}
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
          data={[
            {
              x: lineChartData.map((d) => d.fecha),
              y: lineChartData.map((d) => d.value),
              type: "scatter",
              mode: "lines+markers",
              name: selectedDataType.label,
              line: { color: "#10b981" },
            },
          ]}
          layout={{
            title: "",
            xaxis: { title: "Fecha" },
            yaxis: { title: selectedDataType.label },
            showlegend: false,
          }}
          style={{ width: "100%", height: "400px" }}
        />
        {lineChartData.length === 0 && <p className="text-gray-600 text-center mt-4">No hay datos disponibles.</p>}
      </motion.div>
    </div>
  );
};

export default SensorCharts;