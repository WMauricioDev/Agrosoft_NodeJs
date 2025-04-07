import DefaultLayout from "@/layouts/default"; 
import GraficaInsumo from "@/components/graficas/GraficaInsumo";
export default function GraficaInsumos() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center my-4">Gráficas de insumos</h1>
       <GraficaInsumo/>
    </DefaultLayout>
  );
}
