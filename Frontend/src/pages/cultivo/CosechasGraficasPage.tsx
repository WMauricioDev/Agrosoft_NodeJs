import React, { useState } from "react";
import { useCosechaGraficas } from "@/hooks/cultivo/usecosechagrafica";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { addToast } from "@heroui/react";
import Plot from "react-plotly.js";

const CosechaGraficasPage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data, isLoading, isError, refetch } = useCosechaGraficas(
    fechaInicio,
    fechaFin
  );

  const handleRefetch = () => {
    refetch().then(() => {
      addToast({
        title: "Éxito",
        description: `Datos actualizados (${data?.meta.total_registros} registros encontrados)`,
        timeout: 3000,
      });
    });
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Gráficas de Cosechas</h1>

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

        <div className="flex gap-4 mb-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleRefetch}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Actualizar Gráficas"}
          </button>
          
          {data?.meta && (
            <div className="px-4 py-2 bg-gray-100 rounded text-sm">
              Mostrando datos del {data.meta.fecha_inicio} al {data.meta.fecha_fin} 
              ({data.meta.total_registros} registros)
            </div>
          )}
        </div>

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error al cargar los datos de las gráficas
          </div>
        )}

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Cosechas por Mes ({data.por_mes.unidad_medida})
                </h2>
                <Plot
                  data={[{
                    x: data.por_mes.meses,
                    y: data.por_mes.cantidades,
                    type: "bar",
                    marker: { color: "rgb(55, 128, 191)" },
                  }]}
                  layout={{
                    xaxis: { title: "Mes" },
                    yaxis: { title: `Cantidad (${data.por_mes.unidad_medida})` },
                    autosize: true,
                    margin: { t: 30 } // Reduce el espacio superior
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Distribución por Cultivo ({data.por_cultivo.unidad_medida})
                </h2>
                <Plot
                  data={[{
                    labels: data.por_cultivo.cultivos,
                    values: data.por_cultivo.cantidades,
                    type: "pie",
                    textinfo: "label+percent",
                    insidetextorientation: "radial",
                    hoverinfo: "label+value+percent",
                  }]}
                  layout={{
                    height: 400,
                    autosize: true,
                    margin: { t: 30, b: 30 }
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Cosechas por Día de la Semana ({data.por_dia_semana.unidad_medida})
              </h2>
              <Plot
                data={[{
                  x: data.por_dia_semana.dias,
                  y: data.por_dia_semana.cantidades,
                  type: "bar",
                  marker: { 
                    color: data.por_dia_semana.dias.map((_, i) => 
                      `hsl(${i * 360 / data.por_dia_semana.dias.length}, 70%, 50%)`
                    ) 
                  },
                }]}
                layout={{
                  xaxis: { title: "Día de la semana" },
                  yaxis: { title: `Cantidad (${data.por_dia_semana.unidad_medida})` },
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

export default CosechaGraficasPage;