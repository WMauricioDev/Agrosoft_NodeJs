import DefaultLayout from "@/layouts/default";
import GraficaCosechasPorCultivo from "@/components/graficas/GraficaCosechasPorCultivo";

export default function GraficasCosechasPage() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center my-4">Gráficas de Cosechas</h1>
      <GraficaCosechasPorCultivo />
    </DefaultLayout>
  );
}