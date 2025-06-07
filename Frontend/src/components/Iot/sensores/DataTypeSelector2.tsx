import { motion } from "framer-motion";
import { TipoSensor } from "@/types/iot/type";

interface DataTypeSelectorProps {
  selectedDataType: TipoSensor;
  setSelectedDataType: (type: TipoSensor) => void;
  dataTypes: TipoSensor[];
}

export const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({
  selectedDataType,
  setSelectedDataType,
  dataTypes,
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4 w-56 h-32 flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Dato</label>
      <div className="grid grid-cols-2 gap-2 w-full">
        {dataTypes.map((type) => (
          <motion.button
            key={type.key}
            className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
              selectedDataType.key === type.key
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedDataType(type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg">{type.icon}</div>
            <span className="font-medium">{type.label.split(" ")[0]}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};