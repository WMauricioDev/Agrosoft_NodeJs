import { motion } from "framer-motion";
import { SensorData, TipoSensor } from "@/types/iot/type";
import { NavigateFunction } from "react-router-dom";

interface SensorDataCardsProps {
  realTimeData: SensorData[];
  selectedSensor: number | "todos";
  dataTypes: TipoSensor[];
  navigate: NavigateFunction;
}

export const SensorDataCards: React.FC<SensorDataCardsProps> = ({
  realTimeData,
  selectedSensor,
  dataTypes,
  navigate,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-4">
      {dataTypes.map((type, index) => {
        const latest = realTimeData
          .filter((d) => selectedSensor === "todos" || d.fk_sensor === selectedSensor)
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
                ? Number(latest[type.key]).toFixed(type.decimals)
                : "N/A"}{" "}
              {type.unidad_medida}
            </p>
          </motion.div>
        );
      })}
      <motion.button
        className="w-56 h-32 bg-green-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg p-4 flex items-center justify-center"
        onClick={() => navigate("/iot/datosmeteorologicos")}
        whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
        whileTap={{ scale: 0.95 }}
      >
        Ver Datos Históricos
      </motion.button>
    </div>
  );
};