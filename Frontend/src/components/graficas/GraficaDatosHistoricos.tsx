import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import { useEffect, useState } from 'react';
  
  ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);
  
  interface DatoHistorico {
    fecha_medicion: string;
    temperature: number;
    humidity: number;
  }
  
  export default function GraficaDatosHistoricos() {
    const [datos, setDatos] = useState<DatoHistorico[]>([]);
  
    useEffect(() => {
      fetch("http://localhost:3000/api/graf/datos_historicos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          const formateado = data.map((item: any) => ({
            fecha_medicion: new Date(item.fecha_medicion).toISOString().split("T")[0],
            temperature: parseFloat(item.temperature),
            humidity: parseFloat(item.humidity),
          }));
          setDatos(formateado);
        })
        .catch(err => console.error("Error al cargar datos de la gráfica:", err));
    }, []);
  
    const chartData = {
      labels: datos.map(d => d.fecha_medicion),
      datasets: [
        {
          label: "Temperatura (°C)",
          data: datos.map(d => d.temperature),
          borderColor: "#f87171",
          backgroundColor: "#fecaca",
          fill: false,
        },
        {
          label: "Humedad (%)",
          data: datos.map(d => d.humidity),
          borderColor: "#60a5fa",
          backgroundColor: "#bfdbfe",
          fill: false,
        },
      ],
    };
  
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const, // Leyenda en la parte superior
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Día" }, // Eje X: Día
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Valor" }, // Eje Y: Valor
        },
      },
    };
  
    return (
      <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Datos Históricos - Temperatura y Humedad
        </h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  }
  