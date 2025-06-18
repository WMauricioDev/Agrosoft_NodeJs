import React, { useState } from "react";
import { useIngresosEgresosGraficas } from "@/hooks/reportes/useIngresosEgresosGraficas";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { addToast } from "@heroui/react";
import Plot from "react-plotly.js";

const GraficaIngresosEgresos: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data, isLoading, isError, refetch } = useIngresosEgresosGraficas(
    fechaInicio,
    fechaFin
  );

  const handleRefetch = () => {
    refetch().then(() => {
      addToast({
        title: "Éxito",
        description: `Datos de ingresos y egresos actualizados (${(data?.resumen.total_transacciones_ingresos + data?.resumen.total_transacciones_egresos) || 0} transacciones encontradas)`,
        timeout: 3000,
      });
    });
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Gráficas de Ingresos y Egresos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ReuInput
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <ReuInput
            label="Fecha Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleRefetch}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Actualizar Gráficas"}
          </button>
          {data?.resumen && (
            <div className="px-4 py-2 bg-gray-100 rounded text-sm">
              Mostrando datos del {data.resumen.fecha_inicio} al {data.resumen.fecha_fin} 
              ({(data.resumen.total_transacciones_ingresos + data.resumen.total_transacciones_egresos).toLocaleString('es-CO')} transacciones)
            </div>
          )}
        </div>

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error al cargar los datos de ingresos y egresos
          </div>
        )}

        {data?.resumen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
              <p className="text-2xl font-bold text-green-600">
                ${data.resumen.total_ingresos.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Egresos Totales</h3>
              <p className="text-2xl font-bold text-red-600">
                ${data.resumen.total_egresos.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Balance Neto</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${data.resumen.balance_neto.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Ingresos vs Egresos por Mes</h2>
                <Plot
                  data={[
                    {
                      x: data.por_mes.meses,
                      y: data.por_mes.ingresos,
                      name: 'Ingresos',
                      type: 'bar',
                      marker: { color: 'rgb(75, 192, 192)' },
                    },
                    {
                      x: data.por_mes.meses,
                      y: data.por_mes.egresos,
                      name: 'Egresos',
                      type: 'bar',
                      marker: { color: 'rgb(255, 99, 132)' },
                    },
                    {
                      x: data.por_mes.meses,
                      y: data.por_mes.balance,
                      name: 'Balance',
                      type: 'line',
                      marker: { color: 'rgb(54, 162, 235)' },
                      yaxis: 'y2'
                    }
                  ]}
                  layout={{
                    xaxis: { title: "Mes" },
                    yaxis: { title: "Monto ($)", side: 'left' },
                    yaxis2: {
                      title: "Balance ($)",
                      overlaying: 'y',
                      side: 'right'
                    },
                    autosize: true,
                    margin: { t: 30 },
                    barmode: 'group'
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Transacciones por Mes</h2>
                <Plot
                  data={[
                    {
                      x: data.por_mes.meses,
                      y: data.por_mes.transaccionesIngresos,
                      name: 'Transacciones Ingresos',
                      type: 'bar',
                      marker: { color: 'rgb(75, 192, 192)' },
                    },
                    {
                      x: data.por_mes.meses,
                      y: data.por_mes.transaccionesEgresos,
                      name: 'Transacciones Egresos',
                      type: 'bar',
                      marker: { color: 'rgb(255, 99, 132)' },
                    }
                  ]}
                  layout={{
                    xaxis: { title: "Mes" },
                    yaxis: { title: "Número de Transacciones" },
                    autosize: true,
                    margin: { t: 30 },
                    barmode: 'group'
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Balance Neto por Mes</h2>
              <Plot
                data={[{
                  x: data.por_mes.meses,
                  y: data.por_mes.balance,
                  type: "bar",
                  marker: { color: 'rgb(54, 162, 235)' }
                }]}
                layout={{
                  xaxis: { title: "Mes" },
                  yaxis: { title: "Balance ($)" },
                  autosize: true,
                  margin: { t: 30 }
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default GraficaIngresosEgresos;