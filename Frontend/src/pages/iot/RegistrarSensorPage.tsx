import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useNavigate } from "react-router-dom";
import { Sensor } from "@/types/iot/type";

const RegistrarSensorPage: React.FC = () => {
  const [sensor, setSensor] = useState<Partial<Sensor>>({
    nombre: "",
    tipo_sensor: "",
    unidad_medida: "",
    descripcion: "",
    medida_minima: 0,
    medida_maxima: 0,
  });

  const navigate = useNavigate();

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSensor((prev) => ({
      ...prev,
      [name]: name === "medida_minima" || name === "medida_maxima" ? Number(value) : value,
    }));
  };

  // Manejar registro del sensor (POST a /api/iot/sensores)
  const handleRegisterSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token") || "";
    try {
      const response = await fetch("http://localhost:3000/api/iot/sensores", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensor),
      });
      if (!response.ok) throw new Error("Error al registrar el sensor");
      navigate("/iot/listar-sensores"); // Redirige a la lista tras éxito
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Sensor</h2>

          <form onSubmit={handleRegisterSensor} className="space-y-4">
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={sensor.nombre || ""}
              onChange={(e) => setSensor({ ...sensor, nombre: e.target.value })}
            />

            <ReuInput
              label="Tipo de Sensor"
              placeholder="Ej: Temperatura, Humedad"
              type="text"
              value={sensor.tipo_sensor || ""}
              onChange={(e) => setSensor({ ...sensor, tipo_sensor: e.target.value })}
            />

            <ReuInput
              label="Unidad de Medida"
              placeholder="Ej: °C, %"
              type="text"
              value={sensor.unidad_medida || ""}
              onChange={(e) => setSensor({ ...sensor, unidad_medida: e.target.value })}
            />

            <ReuInput
              label="Descripción"
              placeholder="Descripción del sensor"
              type="text"
              value={sensor.descripcion || ""}
              onChange={(e) => setSensor({ ...sensor, descripcion: e.target.value })}
            />

            <ReuInput
              label="Medida Mínima"
              placeholder="Valor mínimo"
              type="number"
              value={sensor.medida_minima?.toString() || "0"}
              onChange={(e) => setSensor({ ...sensor, medida_minima: Number(e.target.value) })}
            />

            <ReuInput
              label="Medida Máxima"
              placeholder="Valor máximo"
              type="number"
              value={sensor.medida_maxima?.toString() || "0"}
              onChange={(e) => setSensor({ ...sensor, medida_maxima: Number(e.target.value) })}
            />

            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              type="submit"
            >
              Guardar
            </button>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
              type="button"
              onClick={() => navigate("/iot/listar-sensores")}
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