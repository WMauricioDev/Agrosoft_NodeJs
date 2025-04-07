import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Insumo = {
  nombre: string;
  fecha_caducidad: string;
  cantidad: number;
};

export default function GraficaInsumo() {
  const [datos, setDatos] = useState<Insumo[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/graf/insumosc")
      .then(res => res.json())
      .then(data => {
        setDatos(data.insumos || []);
      })
      .catch(err => console.error("Error al cargar datos de insumos:", err));
  }, []);

  const chartData = {
    labels: datos.map(d => d.nombre),
    datasets: [
      {
        label: "Cantidad disponible",
        data: datos.map(d => d.cantidad),
        backgroundColor: "#ff9800",
      },
    ],
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Insumos próximos a vencer (10 días)</h2>
      {datos.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p className="text-gray-500">No hay insumos próximos a vencer.</p>
      )}
    </div>
  );
}
