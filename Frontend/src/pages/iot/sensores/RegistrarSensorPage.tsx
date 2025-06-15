import { useState, ChangeEvent, FormEvent } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";
import { useNavigate } from "react-router-dom";
import { Sensor } from "@/types/iot/type";
import { useCreateSensor } from "@/hooks/iot/sensores/usePostSensor";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { addToast } from "@heroui/react";
import Switcher from "@/components/switch";

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

const sensorConfigurations = {
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
  const { data: bancales, isLoading: isLoadingBancales } = useBancales();
  const createSensor = useCreateSensor();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "tipo_sensor") {
      const tipoSensor = sensorTypes.find((type) => type.value === value);
      const config = sensorConfigurations[value] || { unidad_medida: "", medida_minima: 0, medida_maxima: 0 };
      setSensor({
        ...sensor,
        tipo_sensor: value,
        tipo_sensor_id: tipoSensor?.id || 0,
        unidad_medida: config.unidad_medida,
        medida_minima: config.medida_minima,
        medida_maxima: config.medida_maxima,
      });
    } else if (name === "bancal_id") {
      const bancal = bancales?.find((b) => b.id === Number(value));
      setSensor({
        ...sensor,
        bancal_id: value ? Number(value) : null,
        bancal_nombre: bancal?.nombre || null,
      });
    } else {
      setSensor({
        ...sensor,
        [name]: name === "medida_minima" || name === "medida_maxima" ? Number(value) : value,
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sensor.nombre || !sensor.tipo_sensor) {
      addToast({
        title: "Error",
        description: "El nombre y el tipo de sensor son obligatorios.",
        timeout: 3000,
        color: "danger",
      });
      return;
    }

    createSensor.mutate(sensor as Sensor, {
      onSuccess: () => navigate("/iot/listar-sensores"),
      onError: () => {
        addToast({
          title: "Error",
          description: "No se pudo crear el sensor.",
          timeout: 3000,
          color: "danger",
        });
      },
    });
  };

  if (isLoadingBancales) {
    return (
      <DefaultLayout>
        <p className="text-gray-600 text-center">Cargando bancales...</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Sensor"
        onSubmit={handleSubmit}
        isSubmitting={createSensor.isPending}
        buttonText="Guardar"
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre del sensor"
          type="text"
          name="nombre"
          value={sensor.nombre || ""}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Sensor</label>
          <select
            name="tipo_sensor"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <ReuInput
          label="Unidad de Medida"
          placeholder="Ej: °C, %, lux"
          type="text"
          name="unidad_medida"
          value={sensor.unidad_medida || ""}
          disabled
        />

        <ReuInput
          label="Descripción"
          placeholder="Descripción del sensor"
          type="textarea"
          name="descripcion"
          value={sensor.descripcion || ""}
          onChange={handleChange}
        />

        <ReuInput
          label="Código del Dispositivo"
          placeholder="Código del dispositivo"
          type="text"
          name="device_code"
          value={sensor.device_code || ""}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReuInput
            label="Medida Mínima"
            placeholder="Valor mínimo"
            type="number"
            name="medida_minima"
            value={sensor.medida_minima?.toString() || "0"}
            onChange={handleChange}
          />

          <ReuInput
            label="Medida Máxima"
            placeholder="Valor máximo"
            type="number"
            name="medida_maxima"
            value={sensor.medida_maxima?.toString() || "0"}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bancal</label>
          <select
            name="bancal_id"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sensor.bancal_id?.toString() || ""}
            onChange={handleChange}
          >
            <option value="">Sin bancal</option>
            {bancales?.map((bancal) => (
              <option key={bancal.id} value={bancal.id}>
                {bancal.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <Switcher
            size="sm"
            isSelected={sensor.estado === "activo"}
            color={sensor.estado === "activo" ? "success" : "danger"}
            onChange={(e) => {
              setSensor({
                ...sensor,
                estado: e.target.checked ? "activo" : "inactivo",
              });
            }}
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/iot/listar-sensores")}
          >
            Listar Sensores
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default RegistrarSensorPage;