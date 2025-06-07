import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Importar imagenes locales
import listar1 from "../../assets/iot/listariot1.png";
import listar2 from "../../assets/iot/listariot2.png"; 
import listar3 from "../../assets/iot/listariot3.png";
import listar4 from "../../assets/iot/listariot4.png";
import listar5 from "../../assets/iot/listariot5.png";
import listar6 from "../../assets/iot/listariot6.png";

// Definición de los pasos de la guia
interface GuideStep {
  image: string;
  description: string;
}

const guideSteps: GuideStep[] = [
  {
    image: listar1,
    description: "Bienvenido a la página de sensores. Aquí puedes gestionar tus sensores: activarlos, desactivarlos, editarlos o eliminarlos. Esta guía te mostrará cómo hacerlo.",
  },
  {
    image: listar2,
    description: "En la tabla, selecciona una acción para un sensor: activarlo/desactivarlo con el interruptor, editarlo con el ícono de lápiz (✏️), o eliminarlo con el ícono de basura (🗑️).",
  },
  {
    image: listar3,
    description: "Activa un sensor usando el interruptor en la columna 'Acciones'. Un sensor activo comenzará a enviar datos. Verifica su configuración editándolo si es necesario.",
  },
  {
    image: listar4,
    description: "Haz clic en el ícono de lápiz (✏️) para abrir el formulario de edición. Cada campo tiene un propósito específico; lee con atención antes de guardar los cambios.",
  },
  {
    image: listar5,
    description: "Tras editar, la tabla se actualizará con los nuevos datos del sensor. Revisa que los cambios sean correctos.",
  }, 
  {
    image: listar6, 
    description: "Para registrar un nuevo sensor, haz clic en '+ Registrar Sensor'. Consulta la guía de registro para más detalles.",
  },
];

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Guía de Sensores
        </h3>
        <div className="flex flex-col items-center gap-4">
          <img
            src={guideSteps[currentStep].image}
            alt={`Paso ${currentStep + 1}`}
            className="w-full h-auto rounded-lg shadow-md"
          />
          <p className="text-gray-700 text-center text-sm">
            {guideSteps[currentStep].description}
          </p>
          <div className="flex justify-between items-center w-full mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Paso {currentStep + 1} de {guideSteps.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentStep === guideSteps.length - 1}
              className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                currentStep === guideSteps.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuideModal;