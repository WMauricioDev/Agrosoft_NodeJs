import { useMemo } from "react";
import { motion } from "framer-motion";
import Plot from "react-plotly.js";
import { SensorData, TipoSensor } from "@/types/iot/type";

interface SensorChartsProps {
  realTimeData: SensorData[];
  selectedDataType: TipoSensor;
  selectedSensor: number | "todos";
}

export const SensorCharts: React.FC<SensorChartsProps> = ({ realTimeData, selectedDataType, selectedSensor }) => {
  const filteredData = useMemo(() => {
    return realTimeData.filter(
      (dato) =>
        dato[selectedDataType.key as keyof SensorData] !== null &&
        (selectedSensor === "todos" || dato.fk_sensor === selectedSensor)
    );
  }, [realTimeData, selectedDataType, selectedSensor]);

  const barChartData = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime())
      .slice(0, 10)
      .map((dato, i) => ({
        id: `${dato.id}-${i}`,
        name: new Date(dato.fecha_medicion).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        value: Number(dato[selectedDataType.key as keyof SensorData]) || 0,
      }));
  }, [filteredData]);

  const lineChartData = useMemo(() => {
    return [...filteredData]
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
        value: Number(dato[selectedDataType.key as keyof SensorData]) || 0,
      }));
  }, [filteredData]);

  return (
    <div className="w-full max-w-6xl h-[300px] grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-1">{selectedDataType.label} por Hora</h2>
        <div className="flex-1 w-full">
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
              margin: { t: 20, b: 50, l: 50, r: 20 },
              xaxis: { title: { text: "Hora", font: { size: 10 } }, tickfont: { size: 8 }, tickangle: 45 },
              yaxis: { title: { text: selectedDataType.label, font: { size: 10 } }, tickfont: { size: 8 } },
              showlegend: false,
            }}
            style={{ width: "100%", height: "100%" }}
            config={{ responsive: true }}
          />
        </div>
        {barChartData.length === 0 && (
          <p className="text-gray-600 text-center text-xs mt-2">No hay datos disponibles.</p>
        )}
      </motion.div>
      <motion.div
        className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-1">{selectedDataType.label} en el Tiempo</h2>
        <div className="flex-1 w-full">
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
              margin: { t: 20, b: 50, l: 50, r: 20 },
              xaxis: { title: { text: "Fecha", font: { size: 10 } }, tickfont: { size: 8 }, tickangle: 45 },
              yaxis: { title: { text: selectedDataType.label, font: { size: 10 } }, tickfont: { size: 8 } },
              showlegend: false,
            }}
            style={{ width: "100%", height: "100%" }}
            config={{ responsive: true }}
          />
        </div>
        {lineChartData.length === 0 && (
          <p className="text-gray-600 text-center text-xs mt-2">No hay datos disponibles.</p>
        )}
      </motion.div>
    </div>
  );
};