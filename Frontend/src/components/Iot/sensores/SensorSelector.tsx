import { motion } from "framer-motion";
import { Sensor } from "@/types/iot/type";

interface SensorSelectorProps {
  selectedSensor: number | "todos";
  setSelectedSensor: (sensor: number | "todos") => void;
  filteredSensores: Sensor[];
}

export const SensorSelector: React.FC<SensorSelectorProps> = ({
  selectedSensor,
  setSelectedSensor,
  filteredSensores,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4 w-56 h-32 flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Sensor</label>
      <select
        value={selectedSensor}
        onChange={(e) => setSelectedSensor(e.target.value === "todos" ? "todos" : Number(e.target.value))}
        className="p-2 border rounded w-full text-sm"
      >
        <option value="todos">Todos los sensores</option>
        {filteredSensores.map((sensor) => (
          <option key={sensor.id} value={sensor.id}>
            {sensor.nombre}
          </option>
        ))}
      </select>
    </motion.div>
  );
};