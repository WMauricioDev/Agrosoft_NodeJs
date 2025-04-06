// src/components/GraficaUsuariosPorRol.tsx
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

export default function GraficaUsuariosPorRol() {
  const [datos, setDatos] = useState<{ rol: string; cantidad: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/graf/usuarios_rol")
      .then(res => res.json())
      .then(data => {
        const formateado = data.map((item: any) => ({
          rol: item.rol,
          cantidad: parseInt(item.cantidad, 10),
        }));
        setDatos(formateado);
      })
      .catch(err => console.error("Error al cargar datos de la gráfica:", err));
  }, []);

  const chartData = {
    labels: datos.map(d => d.rol),
    datasets: [
      {
        label: "Cantidad de usuarios",
        data: datos.map(d => d.cantidad),
        backgroundColor: "#4caf50",
      },
    ],
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Usuarios por Rol</h2>
      <Bar data={chartData} />
    </div>
  );
}

