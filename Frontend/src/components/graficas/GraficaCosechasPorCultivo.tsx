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

export default function GraficaCosechasPorCultivo() {
  const [datos, setDatos] = useState<{ cultivo: string; total_cantidad: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/graf/cosechas_por_cultivo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    })
      .then(res => res.json())
      .then(data => {
        const formateado = data.map((item: any) => ({
          cultivo: item.cultivo,
          total_cantidad: parseInt(item.total_cantidad, 10),
        }));
        setDatos(formateado);
      })
      .catch(err => console.error("Error al cargar datos de la gráfica:", err));
  }, []);

  const chartData = {
    labels: datos.map(d => d.cultivo),
    datasets: [
      {
        label: "Cantidad cosechada",
        data: datos.map(d => d.total_cantidad),
        backgroundColor: "#ff9800",
      },
    ],
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Cosechas por Cultivo</h2>
      <Bar data={chartData} />
    </div>
  );
}