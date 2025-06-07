import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import {ReuInput} from "@/components/globales/ReuInput";
import { useNavigate } from "react-router-dom";
import { Sensor } from "@/types/iot/type";
import { useCreateSensor } from "@/hooks/iot/sensores/usePostSensor";
import { addToast } from "@heroui/react";

const sensorTypes = [
  { value: "temperatura", label: "Temperatura (°C)", id: 1 },
  { value: "ambient_humidity", label: "Humedad Ambiente (%)", id: 2 },
  { value: "soil_humidity", label: "Humedad Suelo (%)", id: 3 },
  { value: "luminosidad", label: "Luminosidad (lux)", id: 4 },
  { value: "lluvia", label: "Lluvia (mm/h)", id: 5 },
  { value: "velocidad_viento", label: "Velocidad Viento (m/s)", id: 6 },
  { value: "direccion_viento", label: "Dirección Viento (grados)", id: 7 },
  { value: "ph_suelo", label: "pH Suelo (pH)", id: 8 },
];

const sensorConfigurations: { [key: string]: { unidad_medida: string; medida_minima: number; medida_maxima: number } } = {
  temperatura: { unidad_medida: "°C", medida_minima: -40, medida_maxima: 85 },
  ambient_humidity: { unidad_medida: "%", medida_minima: 0, medida_maxima: 100 },
  soil_humidity: { unidad_medida: "%", medida_minima: 0, medida_maxima: 100 },
  luminosidad: { unidad_medida: "lux", medida_minima: 0, medida_maxima: 100000 },
  lluvia: { unidad_medida: "mm/h", medida_minima: 0, medida_maxima: 50 },
  velocidad_viento: { unidad_medida: "m/s", medida_minima: 0, medida_maxima: 60 },
  direccion_viento: { unidad_medida: "grados", medida_minima: 0, medida_maxima: 360 },
  ph_suelo: { unidad_medida: "pH", medida_minima: 0, medida_maxima: 14 },
};

const RegistrarSensorPage: React.FC = () => {
  const [sensor, setSensor] = useState<Partial<Sensor>>({
    nombre: "",
    tipo_sensor: "",
    tipo_sensor_id: 0,
    unidad_medida: "",
    descripcion: "",
    medida_minima: 0,
    medida_maxima: 0,
    estado: "inactivo",
    device_code: null,
    bancal_id: null,
    bancal_nombre: null,
  });
  const createSensor = useCreateSensor();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`[RegistrarSensorPage] Cambio en el campo ${name}: `, value);

    if (name === "tipo_sensor") {
      const tipoSensor = sensorTypes.find((type) => type.value === value);
      const config = sensorConfigurations[value] || { unidad_medida: "", medida_minima: 0, medida_maxima: 0 };
      setSensor((prev) => ({
        ...prev,
        tipo_sensor: value,
        tipo_sensor_id: tipoSensor?.id || 0,
        unidad_medida: config.unidad_medida,
        medida_minima: config.medida_minima,
        medida_maxima: config.medida_maxima,
      }));
    } else {
      setSensor((prev) => ({
        ...prev,
        [name]: name === "medida_minima" || name === "medida_maxima" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[RegistrarSensorPage] Enviando formulario con datos: ", sensor);

    if (!sensor.nombre || !sensor.tipo_sensor || !sensor.tipo_sensor_id) {
      console.error("[RegistrarSensorPage] Validación fallida: nombre o tipo_sensor_id faltante", sensor);
      addToast({
        title: "Error",
        description: "El nombre y el tipo de sensor son obligatorios.",
        timeout: 3000,
        color: "danger",
      });
      return;
    }

    createSensor.mutate(sensor as Sensor, {
      onSuccess: () => {
        console.log("[RegistrarSensorPage] Sensor creado con éxito");
        navigate("/iot/listar-sensores");
      },
      onError: (error: any) => {
        console.error("[RegistrarSensorPage] Error al crear sensor: ", error);
      },
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-3 sm:p-4">
        <div className="w-full max-w-md bg-white p-3 sm:p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 text-center">Registro de Sensor</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-sm">
              <ReuInput
                label="Nombre"
                placeholder="Ingrese el nombre del sensor"
                type="text"
                name="nombre"
                value={sensor.nombre || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Tipo de Sensor</label>
              <select
                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                name="tipo_sensor"
                value={sensor.tipo_sensor || ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo de sensor</option>
                {sensorTypes.map((type) => (
                  <option key={type.id} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm">
              <ReuInput
                label="Unidad de Medida"
                placeholder="Ej: °C, %, lux"
                type="text"
                name="unidad_medida"
                value={sensor.unidad_medida || ""}
                disabled
              />
            </div>

            <div className="text-sm">
              <ReuInput
                label="Descripción"
                placeholder="Descripción del sensor"
                type="text"
                name="descripcion"
                value={sensor.descripcion || ""}
                onChange={handleChange}
              />
            </div>

            <div className="text-sm">
              <ReuInput
                label="Código del Dispositivo"
                placeholder="Código del dispositivo"
                type="text"
                name="device_code"
                value={sensor.device_code || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="text-sm">
                <ReuInput
                  label="Medida Mínima"
                  placeholder="Valor mínimo"
                  type="number"
                  name="medida_minima"
                  value={sensor.medida_minima?.toString() || "0"}
                  onChange={handleChange}
                />
              </div>

              <div className="text-sm">
                <ReuInput
                  label="Medida Máxima"
                  placeholder="Valor máximo"
                  type="number"
                  name="medida_maxima"
                  value={sensor.medida_maxima?.toString() || "0"}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg text-sm"
              type="submit"
            >
              Guardar
            </button>
            <button
              className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg text-sm"
              type="button"
              onClick={() => {
                console.log("[RegistrarSensorPage] Navegando a /iot/listar-sensores");
                navigate("/iot/listar-sensores");
              }}
            >
              Ir a Lista de Sensores
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RegistrarSensorPage;