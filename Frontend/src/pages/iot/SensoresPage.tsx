import React from "react";
import { useDatosMeteorologicos } from "@/hooks/iot/useDatosMeteorologicos";
import DefaultLayout from "@/layouts/default";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function SensoresPage() {
  const { data: latestData = [], chartData = [], isLoading, error } = useDatosMeteorologicos();

  const displayData = latestData.length > 0 ? latestData : [
    { fk_sensor: 1, temperature: 0, humidity: 0, message: error ? "Error al conectar" : "Esperando datos..." }
  ];
  const graphData = chartData.map((sensor, index) => ({
    name: sensor.fecha_medicion ? new Date(sensor.fecha_medicion).toLocaleTimeString() : `Dato ${index + 1}`,
    temperature: sensor.temperature,
    humidity: sensor.humidity,
  }));

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Sensores Activos en Tiempo Real</h2>
          {isLoading ? (
            <p className="text-gray-600 text-center">Cargando datos...</p>
          ) : (
            <>
              {error && <div className="text-center text-red-500 mb-4">Error: {error.message}</div>}
              <LineChart width={600} height={300} data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperatura (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humedad (%)" />
              </LineChart>
              <div className="flex justify-between mt-4">
                <Link to="/iot/registrar-sensor" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Registrar Sensor
                </Link>
                <Link to="/iot/datosmetereologicos" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Ver Datos Históricos
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}