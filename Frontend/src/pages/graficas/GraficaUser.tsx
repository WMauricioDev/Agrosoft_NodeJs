import DefaultLayout from "@/layouts/default"; 
import GraficaUsuariosPorRol from "@/components/graficas/GraficaUser";
export default function GraficasPage() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center my-4">Gráficas de usuario</h1>
      <GraficaUsuariosPorRol />
    </DefaultLayout>
  );
}
