import DefaultLayout from "@/layouts/default";
import GraficaDatosHistoricos from "@/components/graficas/GraficaDatosHistoricos";

export default function GraficasDatosHistoricosPage() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center my-4">
        Gráfica de Datos Históricos
      </h1>
      <GraficaDatosHistoricos />
    </DefaultLayout>
  );
}