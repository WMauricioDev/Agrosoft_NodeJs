import React, { useState } from "react";
import { usePagoGraficas } from "@/hooks/finanzas/useEgresosGrafica";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { addToast } from "@heroui/react";
import Plot from "react-plotly.js";

const EgresoPruebaGraficasPage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data, isLoading, isError, refetch } = usePagoGraficas(
    fechaInicio,
    fechaFin
  );

  const handleRefetch = () => {
    refetch().then(() => {
      addToast({
        title: "Éxito",
        description: `Datos actualizados correctamente`,
        timeout: 3000,
        color:"success"
      });
    });
  };

  return (
    <DefaultLayout>
      <div className="p-4 space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
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
          <button
            onClick={handleRefetch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        {isError && (
          <p className="text-red-500">Error al cargar las gráficas.</p>
        )}

        {!data && !isLoading && (
          <p className="text-gray-500">No hay datos disponibles.</p>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gráfica: pagos por mes */}
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Pagos por Mes - Egresos
              </h2>
              <Plot
                data={[
                  {
                    x: data.por_mes.meses,
                    y: data.por_mes.total_pago,
                    type: "bar",
                    name: "Total Pagado",
                    text: data.por_mes.usuario_top,
                    marker: { color: "#3b82f6" },
                  },
                ]}
                layout={{
                  title: "",
                  xaxis: { title: "Mes" },
                  yaxis: { title: "Total ($)" },
                }}
                style={{ width: "100%", height: "400px" }}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Pagos por Usuario
              </h2>
              <Plot
                data={[
                  {
                    x: data.por_usuario.usuarios,
                    y: data.por_usuario.total_pago,
                    type: "bar",
                    marker: { color: "#10b981" },
                  },
                ]}
                layout={{
                  title: "",
                  xaxis: { title: "Usuario" },
                  yaxis: { title: "Total ($)" },
                }}
                style={{ width: "100%", height: "400px" }}
              />
            </div>

            {/* Gráfica: pagos por día de la semana*/}
            {/* <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Pagos por Día de la Semana
              </h2>
              <Plot
                data={[
                  {
                    x: data.por_dia_semana.dias,
                    y: data.por_dia_semana.total_pago,
                    type: "bar",
                    marker: { color: "#f59e0b" },
                  },
                ]}
                layout={{
                  title: "",
                  xaxis: { title: "Día" },
                  yaxis: { title: "Total ($)" },
                }}
                style={{ width: "100%", height: "400px" }}
              />
            </div>  */}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EgresoPruebaGraficasPage;
