import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

type Herramienta = {
  nombre: string;
  total: string;
};

export default function GraficaHerramienta() {
  const [datos, setDatos] = useState<Herramienta[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/graf/herramientas")
      .then(res => res.json())
      .then(data => setDatos(data))
      .catch(err => console.error("Error al cargar herramientas por nombre:", err));
  }, []);

  const chartData = {
    labels: datos.map(d => d.nombre),
    datasets: [
      {
        label: "Cantidad total",
        data: datos.map(d => parseInt(d.total, 10)),
        backgroundColor: "#f59e0b",
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Cantidad total de herramientas por nombre",
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Inventario por Herramienta</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
