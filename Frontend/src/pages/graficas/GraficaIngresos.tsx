import DefaultLayout from "@/layouts/default"; 
import GraficaIngreso from "@/components/graficas/GraficaIngreso";
export default function GraficaIngresos() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center my-4">Gráficas de ingresos</h1>
       <GraficaIngreso/>
    </DefaultLayout>
  );
}
