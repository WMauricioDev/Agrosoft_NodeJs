import DefaultLayout from "@/layouts/default"; 
import GraficaHerramienta from "@/components/graficas/GraficaHerramienta";
export default function GraficaHerramientas() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center my-4">Gráficas de herramientas</h1>
       <GraficaHerramienta/>
    </DefaultLayout>
  );
}
