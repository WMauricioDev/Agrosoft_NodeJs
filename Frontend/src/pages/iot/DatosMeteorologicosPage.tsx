import { useState, useMemo } from "react";
import DefaultLayout from "@/layouts/default";
import { useDatosMeteorologicosHistoricos } from "@/hooks/iot/useDatosMeteorologicosHistoricos";
import { useSensoresRegistrados } from "@/hooks/iot/useSensoresRegistrados";
import { useNavigate } from "react-router-dom";
import Tabla from "@/components/globales/Tabla";
import { ReuInput } from "@/components/globales/ReuInput";
import { Sensor, SensorData } from "@/types/iot/type";
import { EditIcon, Trash2 } from "lucide-react";

export default function DatosMeteorologicosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: historicos = [], isLoading, error } = useDatosMeteorologicosHistoricos(0, "");
  const { sensores = [], isLoading: sensoresLoading } = useSensoresRegistrados();
  const navigate = useNavigate();

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Sensor", uid: "sensor" },
    { name: "Temperatura (°C)", uid: "temperature" },
    { name: "Humedad (%)", uid: "humidity" },
    { name: "Fecha de Medición", uid: "fecha_medicion" },
    { name: "Acciones", uid: "acciones" },
  ];

  const filteredHistoricos = useMemo(() => {
    if (!searchTerm) return historicos;
    const lowerSearch = searchTerm.toLowerCase();
    const hasColon = lowerSearch.includes(":");
    const hasSlash = lowerSearch.includes("/");
    const hasDot = lowerSearch.includes(".");

    return historicos.filter((dato: SensorData) => {
      const sensor = sensores.find((s: Sensor) => s.id === dato.fk_sensor);
      const sensorName = sensor ? sensor.nombre.toLowerCase() : "";
      const fechaStr = dato.fecha_medicion ? new Date(dato.fecha_medicion).toLocaleString().toLowerCase() : "n/a";
      const fkSensorStr = String(dato.fk_sensor || "");
      const tempStr = String(dato.temperature ?? "");
      const humStr = dato.humidity !== null && dato.humidity !== undefined ? String(dato.humidity) : "";

      if (hasColon || hasSlash) return fechaStr.includes(lowerSearch);
      if (hasDot) return tempStr.includes(lowerSearch) || humStr.includes(lowerSearch);
      return fkSensorStr === lowerSearch || sensorName.includes(lowerSearch);
    });
  }, [historicos, searchTerm, sensores]);

  const formattedData = useMemo(() => {
    return filteredHistoricos.map((dato: SensorData) => ({
      id: dato.id || "N/A",
      sensor: sensores.find((s: Sensor) => s.id === dato.fk_sensor)?.nombre || dato.fk_sensor || "N/A",
      temperature: dato.temperature ?? "N/A",
      humidity: dato.humidity ?? "N/A",
      fecha_medicion: dato.fecha_medicion ? new Date(dato.fecha_medicion).toLocaleString() : "N/A",
      acciones: (
        <>
          <button className="mr-2">
            <EditIcon size={18} color="gray" />
          </button>
          <button>
            <Trash2 size={18} color="red" />
          </button>
        </>
      ),
    }));
  }, [filteredHistoricos, sensores]);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Datos Meteorológicos Históricos</h2>

          <div className="mb-2 flex justify-start">
            <button
              className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => navigate("/iot/sensores")}
            >
              Volver a Tiempo Real
            </button>
            <button
              className="ml-2 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => navigate("/iot/listar-sensores")}
            >
              Listar Sensores
            </button>
          </div>

          {isLoading || sensoresLoading ? (
            <p className="text-gray-600 text-center">Cargando datos históricos...</p>
          ) : (
            <Tabla columns={columns} data={formattedData} />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}