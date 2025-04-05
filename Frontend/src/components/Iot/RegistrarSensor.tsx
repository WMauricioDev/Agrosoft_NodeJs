import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useRegistrarSensor } from "@/hooks/iot/useSensore";

interface Sensor {
  nombre: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

const RegistrarSensor: React.FC = () => {
  const [sensor, setSensor] = useState<Sensor>({
    nombre: "",
    tipo_sensor: "",
    unidad_medida: "",
    descripcion: "",
    medida_minima: 0,
    medida_maxima: 0,
  });

  const mutation = useRegistrarSensor();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSensor((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "medida_minima" || e.target.name === "medida_maxima"
        ? Number(e.target.value)
        : e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(sensor);
    setSensor({
      nombre: "",
      tipo_sensor: "",
      unidad_medida: "",
      descripcion: "",
      medida_minima: 0,
      medida_maxima: 0,
    });
  };

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Registrar Sensor</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="nombre"
          value={sensor.nombre}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Tipo de Sensor"
          name="tipo_sensor"
          value={sensor.tipo_sensor}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Unidad de Medida"
          name="unidad_medida"
          value={sensor.unidad_medida}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Descripción"
          name="descripcion"
          value={sensor.descripcion}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Medida Mínima"
          name="medida_minima"
          type="number"
          value={sensor.medida_minima.toString()}
          onChange={handleChange}
          className="mb-4"
        />
        <Input
          label="Medida Máxima"
          name="medida_maxima"
          type="number"
          value={sensor.medida_maxima.toString()}
          onChange={handleChange}
          className="mb-4"
        />
        <Button
          type="submit"
          color="primary"
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? "Registrando..." : "Guardar"}
        </Button>
      </form>
    </div>
  );
};

export default RegistrarSensor;