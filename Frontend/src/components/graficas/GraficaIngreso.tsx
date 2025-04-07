import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

type IngresoDiario = {
  fecha: string;
  total: number;
};

export default function GraficaIngreso() {
  const [datos, setDatos] = useState<IngresoDiario[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    fetch("http://localhost:3000/api/graf/ingresos") 
      .then(res => res.json())
      .then(data => {
        setDatos(data.ingresos || []);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar datos de ingresos:", err);
        setCargando(false);
      });
  }, []);

  const chartData = {
    labels: datos.map(d => d.fecha),
    datasets: [
      {
        label: "Ingresos diarios",
        data: datos.map(d => d.total),
        backgroundColor: "#4CAF50",
        borderColor: "#2E7D32",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ingresos Diarios',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `$${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Ingresos Diarios</h2>
      
      {cargando ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      ) : datos.length > 0 ? (
        <div className="h-96">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-500 py-8 text-center">No hay datos de ingresos disponibles.</p>
      )}
      
      {!cargando && datos.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Total de días registrados: {datos.length}</p>
          <p>Ingresos totales: ${datos.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}