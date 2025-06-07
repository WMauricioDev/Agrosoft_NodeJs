import React, { useState } from "react";
import { useActividadCostosGrafica } from "@/hooks/graficas/useActividadCosto";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { addToast } from "@heroui/react";
import Plot from "react-plotly.js";
import Tabla from "@/components/globales/Tabla";
import { ActividadCosto, ActividadConsolidada, PlotData } from "@/types/cultivo/ActividadCosto";

const ActividadCostosGraficasPage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [tipoGrafico, setTipoGrafico] = useState<string>("barra");

  const { data, isLoading, isError, refetch } = useActividadCostosGrafica(
    fechaInicio,
    fechaFin,
    tipoGrafico
  );

  const handleRefetch = () => {
    refetch().then(() => {
      addToast({
        title: "Éxito",
        description: `Datos de costos actualizados`,
        timeout: 3000,
      });
    });
  };

  const validItems: ActividadCosto[] = data && Array.isArray(data.data)
    ? data.data.filter(item => item && item.actividad && item.desglose)
    : [];

  const prepareBarData = (): PlotData[] => {
    if (!validItems.length) return [];
    
    return [
      {
        x: validItems.map((item) => item.actividad),
        y: validItems.map((item) => item.desglose.insumos),
        name: "Insumos",
        type: "bar",
        marker: { color: "rgb(55, 128, 191)" }
      },
      {
        x: validItems.map((item) => item.actividad),
        y: validItems.map((item) => item.desglose.herramientas),
        name: "Herramientas",
        type: "bar",
        marker: { color: "rgb(219, 64, 82)" }
      },
      {
        x: validItems.map((item) => item.actividad),
        y: validItems.map((item) => item.desglose.mano_de_obra),
        name: "Mano de obra",
        type: "bar",
        marker: { color: "rgb(128, 191, 55)" }
      }
    ];
  };

  const preparePieData = (): PlotData[] => {
    if (!validItems.length) return [];
    
    const actividades = validItems.map(item => item.actividad);
    const costosTotales = validItems.map(item => item.costo_total);
    
    return [{
      labels: actividades,
      values: costosTotales,
      type: "pie",
      textinfo: "label+percent",
      insidetextorientation: "radial",
      hoverinfo: "label+value+percent",
      hole: 0.4
    }];
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Costos por Actividad</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Tipo de Gráfico</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={tipoGrafico}
              onChange={(e) => setTipoGrafico(e.target.value)}
            >
              <option value="barra">Barras</option>
              <option value="circular">Circular</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleRefetch}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Actualizar Gráficas"}
          </button>
          
          {data?.periodo && (
            <div className="px-4 py-2 bg-gray-100 rounded text-sm">
              Mostrando datos {data.periodo.fecha_inicio ? `del ${data.periodo.fecha_inicio} al ${data.periodo.fecha_fin}` : "de todos los tiempos"}
            </div>
          )}
        </div>

        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error al cargar los datos de costos
          </div>
        )}

        {validItems.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Costos por Actividad
              </h2>
              
              {tipoGrafico === "barra" ? (
                <Plot
                  data={prepareBarData()}
                  layout={{
                    barmode: "stack",
                    xaxis: { title: "Actividad" },
                    yaxis: { title: "Costo Total ($)" },
                    autosize: true,
                    margin: { t: 30 },
                    legend: { orientation: "h" }
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              ) : (
                <Plot
                  data={preparePieData()}
                  layout={{
                    height: 500,
                    autosize: true,
                    margin: { t: 30, b: 30 },
                    showlegend: true
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Resumen de Costos por Actividad</h2>
              
              {(() => {
                const actividadesConsolidadas = validItems.reduce((acc: Record<string, ActividadConsolidada>, item: ActividadCosto) => {
                  if (!acc[item.actividad]) {
                    acc[item.actividad] = {
                      actividad: item.actividad,
                      insumos: 0,
                      herramientas: 0,
                      mano_de_obra: 0,
                      total: 0,
                      count: 0
                    };
                  }
                  acc[item.actividad].insumos += item.desglose.insumos;
                  acc[item.actividad].herramientas += item.desglose.herramientas;
                  acc[item.actividad].mano_de_obra += item.desglose.mano_de_obra;
                  acc[item.actividad].total += item.costo_total;
                  acc[item.actividad].count += 1;
                  return acc;
                }, {} as Record<string, ActividadConsolidada>);

                const actividadesArray: ActividadConsolidada[] = Object.values(actividadesConsolidadas);
                const totalGeneral: number = actividadesArray.reduce((sum: number, item: ActividadConsolidada) => sum + item.total, 0);

                const actividadMasCostosa: ActividadConsolidada | null = actividadesArray.length > 0 
                  ? actividadesArray.reduce(
                      (max, item) => item.total > max.total ? item : max,
                      actividadesArray[0]
                    )
                  : null;

                return (
                  <>
                    <Tabla
                      columns={[
                        { uid: "actividad", name: "Actividad", sortable: true },
                        { uid: "operaciones", name: "Veces realizada", sortable: true, className: "text-center" },
                        { uid: "insumos", name: "Insumos ($)", sortable: true, className: "text-right" },
                        { uid: "herramientas", name: "Herramientas ($)", sortable: true, className: "text-right" },
                        { uid: "mano_de_obra", name: "Mano de obra ($)", sortable: true, className: "text-right" },
                        { uid: "total", name: "Total ($)", sortable: true, className: "text-right font-medium" },
                        { uid: "porcentaje", name: "% del total", sortable: true, className: "text-right" }
                      ]}
                      data={actividadesArray.map((item: ActividadConsolidada) => ({
                        id: item.actividad,
                        actividad: item.actividad,
                        operaciones: item.count,
                        insumos: item.insumos,
                        herramientas: item.herramientas,
                        mano_de_obra: item.mano_de_obra,
                        total: item.total,
                        porcentaje: totalGeneral > 0 ? ((item.total / totalGeneral) * 100).toFixed(1) + '%' : '0%',
                        esMasCostosa: actividadMasCostosa ? item.actividad === actividadMasCostosa.actividad : false
                      }))}
                      initialVisibleColumns={["actividad", "operaciones", "insumos", "herramientas", "mano_de_obra", "total", "porcentaje"]}
                      renderCell={(item: any, columnKey: string) => {
                        if (columnKey === "actividad") {
                          return (
                            <span className={`font-medium ${item.esMasCostosa ? 'text-red-500' : ''}`}>
                              {item.actividad}
                              {item.esMasCostosa && (
                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                  Mayor costo
                                </span>
                              )}
                            </span>
                          );
                        }
                        if (columnKey === "operaciones") {
                          return <span className="text-center">{item.operaciones}</span>;
                        }
                        if (["insumos", "herramientas", "mano_de_obra", "total"].includes(columnKey)) {
                          return (
                            <span className={`text-right ${item.esMasCostosa && columnKey === 'total' ? 'font-bold text-red-500' : ''}`}>
                              ${item[columnKey].toLocaleString()}
                            </span>
                          );
                        }
                        if (columnKey === "porcentaje") {
                          return (
                            <div className="flex items-center justify-end">
                              <span className="mr-2">{item.porcentaje}</span>
                              <div 
                                className="h-2 bg-blue-100 rounded-full" 
                                style={{ width: `${item.porcentaje.replace('%', '')}%` }}
                              ></div>
                            </div>
                          );
                        }
                        return item[columnKey];
                      }}
                    />

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm text-gray-500 mb-1">Total General</div>
                        <div className="text-2xl font-bold">
                          ${totalGeneral.toLocaleString()}
                        </div>
                      </div>

                      {actividadMasCostosa && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <div className="text-sm text-gray-500 mb-1">Actividad con mayor costo</div>
                          <div className="font-bold text-red-600">
                            {actividadMasCostosa.actividad}
                          </div>
                          <div className="text-lg">
                            ${actividadMasCostosa.total.toLocaleString()} ({totalGeneral > 0 ? ((actividadMasCostosa.total / totalGeneral) * 100).toFixed(1) : 0}%)
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="text-sm text-gray-500 mb-1">Total Insumos</div>
                        <div className="text-xl font-medium text-blue-600">
                          ${actividadesArray.reduce((sum, item) => sum + item.insumos, 0).toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="text-sm text-gray-500 mb-1">Total Herramientas</div>
                        <div className="text-xl font-medium text-green-600">
                          ${actividadesArray.reduce((sum, item) => sum + item.herramientas, 0).toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="text-sm text-gray-500 mb-1">Total Mano de obra</div>
                        <div className="text-xl font-medium text-purple-600">
                          ${actividadesArray.reduce((sum, item) => sum + item.mano_de_obra, 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No hay datos disponibles para mostrar.</div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ActividadCostosGraficasPage;