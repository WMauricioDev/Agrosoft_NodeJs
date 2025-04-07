import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import PricingPage from './pages/globales/pricing';
import BlogPage from './pages/globales/blog';
import AboutPage from './pages/globales/about';
import LoginPage from './pages/usuarios/LoginPage';
import RegisterPage from './pages/usuarios/RegisterPage';
import DashboardPage from './pages/globales/Dashboard';
import PrivateRoute from './components/usuarios/RutaPrivada';
import TipoEspeciePage from './pages/cultivo/TipoEspeciePage';
import TipoActividadPage from './pages/cultivo/TipoActividadPage';
import LotesPage from './pages/cultivo/LotesPage';
import BancalPage from './pages/cultivo/BancalPage';
import EspeciePage from './pages/cultivo/EspeciePage';
import ProgramacionPage from './pages/cultivo/ProgramacionPage';
import CultivoPage from './pages/cultivo/CultivoPage';
import ActividadPage from './pages/cultivo/ActividadPage';
import ListaTipoEspeciePage from './pages/cultivo/ListaTipoEspeciePage';
import ListaTipoActividadPage from './pages/cultivo/listaTipoActividadPage';
import ListarLotesPage from './pages/cultivo/ListaLotesPage';
import ListaBancalPage from './pages/cultivo/ListaBancalPage';
import ListaEspeciePage from './pages/cultivo/ListaEspeciePage';
import ListarCultivoPage from './pages/cultivo/ListaCultivoPage';
import ListaProgramacion from './pages/cultivo/ListaProgramacion';
import ListaActividadPage from './pages/cultivo/ListaActividadPage';
import TipoPlagaPage from './pages/cultivo/TipoPlagaPage';
import ListaTipoPlagaPage from './pages/cultivo/ListaTipoPlagaPage';
import PlagaPage from './pages/cultivo/PlagaPage';
import ListaPlagasPage from './pages/cultivo/ListaPlagaPage';
import CosechaPage from './pages/cultivo/CosechaPage';
import ListaCosechasPage from './pages/cultivo/ListaCosechaPage';
import TipoControlPage from './pages/cultivo/TipoControlPage';
import ListaTipoControlPage from './pages/cultivo/ListaTipoControlPage';
import ProductosControlPage from './pages/cultivo/ProductosControlPage';
import ListaProductoControlPage from './pages/cultivo/ListaProductosControlPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';
import BodegaPage from './pages/inventario/BodegaPage';
import ListaBodegaPage from './pages/inventario/ListaBodegaPage';
import BodegaHerramientaPage from './pages/inventario/BodegaHerramientaPage';
import ListaBodegaHerramientaPage from './pages/inventario/ListaBodegaHerramientaPage';
import HerramientasPage from './pages/inventario/HerramientasPage';
import ListaHerramientaPage from './pages/inventario/ListaHerramientaPage'; 
import BodegaInsumoPage from './pages/inventario/BodegaInsumoPage';
import ListaBodegaInsumoPage from './pages/inventario/ListaBodegaInsumoPage';
import InsumoPage from './pages/inventario/InsumoPage';
import ListaInsumoPage from './pages/inventario/ListaInsumoPage';
import PerfilPage from './pages/usuarios/PerfilPage';
import SensoresPage from './pages/iot/SensoresPage';
import DatosMeteorologicosPage from './pages/iot/DatosMeteorologicosPage';  
import ForgotPasswordPage from './pages/usuarios/ForgotPasswordPage';  
import ResetPasswordPage from './pages/usuarios/ResetPasswordPage';  
import RegistrarSensorPage from './pages/iot/RegistrarSensorPage'
import ListarSensores from "@/components/Iot/ListarSensores";
import Mapa from './pages/globales/Mapa';
import SalarioPage from './pages/finanzas/SalarioPage';
import VentaPage from './pages/finanzas/VentaPage';
import ListaVentaPage from './pages/finanzas/ListaVentaPage';
import ListaSalarioPage from './pages/finanzas/ListaSalarioPage';
import UsuariosSecondPage from './pages/usuarios/RegisterSecondPage';
import Reportes from './pages/reportes/Reportes';
import CosechaGraficasPage from './pages/cultivo/CosechasGraficasPage';
import GraficasPage from './pages/graficas/GraficaUser';
import GraficaInsumos from './pages/graficas/GraficaInsumos';
import GraficaHerramientas from './pages/graficas/GraficaHerramientas';
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/iot/registrar-sensor" element={<RegistrarSensorPage />} />
          <Route path="/iot/listar-sensores" element={<ListarSensores />} />
          <Route element={<ForgotPasswordPage />} path="/forgot-password" />  
          <Route element={<ResetPasswordPage />} path="/reset-password/:token" />  
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><PerfilPage /></PrivateRoute>} />
          <Route path="/inventario/bodega/" element={<PrivateRoute><BodegaPage /></PrivateRoute>} />
          <Route path="/inventario/listarbodega/" element={<PrivateRoute><ListaBodegaPage /></PrivateRoute>} />
          <Route path="/usuarios/secondregis/" element={<PrivateRoute><UsuariosSecondPage /></PrivateRoute>} />
          src\pages\usuarios\RegisterSecondPage.tsx
          <Route
            path="/inventario/bodegaherramienta/"
            element={
              <PrivateRoute>
                <BodegaHerramientaPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/inventario/listarbodegaherramienta/" 
            element={
              <PrivateRoute>
                <ListaBodegaHerramientaPage />
              </PrivateRoute>
            } 
          />
          <Route path="/inventario/herramientas/" element={<PrivateRoute><HerramientasPage /></PrivateRoute>} />
          <Route path="/inventario/listarherramientas/" element={<PrivateRoute><ListaHerramientaPage /></PrivateRoute>} />
          <Route
            path="/inventario/bodegainsumo/"
            element={
              <PrivateRoute>
                <BodegaInsumoPage />
              </PrivateRoute>
            }
          />
          <Route 
            path="/inventario/listarbodegainsumos/" 
            element={
              <PrivateRoute>
                <ListaBodegaInsumoPage />
              </PrivateRoute>
            } 
          />
          
          <Route path="/finanzas/salario/" element={<PrivateRoute><SalarioPage /></PrivateRoute>} />
          <Route path="/finanzas/listarsalarios/" element={<PrivateRoute><ListaSalarioPage /></PrivateRoute>} /> {/* Nueva ruta */}
          <Route path="/finanzas/ventas/" element={<PrivateRoute><VentaPage /></PrivateRoute>} />
          <Route path="/finanzas/listarventas/" element={<PrivateRoute><ListaVentaPage /></PrivateRoute>} />
          <Route path="/inventario/insumos/" element={<PrivateRoute><InsumoPage /></PrivateRoute>} />
          <Route path="/inventario/listarinsumos/" element={<PrivateRoute><ListaInsumoPage /></PrivateRoute>} />
          <Route path="/reportes/" element={<PrivateRoute><Reportes /></PrivateRoute>} />
          <Route path="/cultivo/tipoespecie/" element={<PrivateRoute><TipoEspeciePage /></PrivateRoute>} />
          <Route path="/cultivo/listartipoespecie/" element={<PrivateRoute><ListaTipoEspeciePage /></PrivateRoute>} />
          <Route path="/cultivo/tipo_actividad/" element={<PrivateRoute><TipoActividadPage /></PrivateRoute>} />
          <Route path="/cultivo/listartipoactividad/" element={<PrivateRoute><ListaTipoActividadPage /></PrivateRoute>} />
          <Route path="/cultivo/lotes/" element={<PrivateRoute><LotesPage /></PrivateRoute>} />
          <Route path="/cultivo/listarlotes/" element={<PrivateRoute><ListarLotesPage /></PrivateRoute>} />
          <Route path="/cultivo/bancal/" element={<PrivateRoute><BancalPage /></PrivateRoute>} />
          <Route path="/cultivo/listarbancal/" element={<PrivateRoute><ListaBancalPage /></PrivateRoute>} />
          <Route path="/cultivo/especies/" element={<PrivateRoute><EspeciePage /></PrivateRoute>} />
          <Route path="/cultivo/listarespecies/" element={<PrivateRoute><ListaEspeciePage /></PrivateRoute>} />
          <Route path="/cultivo/programacion/" element={<PrivateRoute><ProgramacionPage /></PrivateRoute>} />
          <Route path="/cultivo/listarprogramaciones/" element={<PrivateRoute><ListaProgramacion /></PrivateRoute>} />
          <Route path="/cultivo/cultivo/" element={<PrivateRoute><CultivoPage /></PrivateRoute>} />
          <Route path="/cultivo/listarcultivos/" element={<PrivateRoute><ListarCultivoPage /></PrivateRoute>} />
          <Route path="/cultivo/actividad/" element={<PrivateRoute><ActividadPage /></PrivateRoute>} />
          <Route path="/cultivo/listaractividad/" element={<PrivateRoute><ListaActividadPage /></PrivateRoute>} />
          <Route path="/cultivo/tipoplaga/" element={<PrivateRoute><TipoPlagaPage /></PrivateRoute>} />
          <Route path="/cultivo/listartipoplaga/" element={<PrivateRoute><ListaTipoPlagaPage /></PrivateRoute>} />
          <Route path="/cultivo/plaga/" element={<PrivateRoute><PlagaPage /></PrivateRoute>} />
          <Route path="/cultivo/listarplaga/" element={<PrivateRoute><ListaPlagasPage /></PrivateRoute>} />
          <Route path="/cultivo/cosecha/" element={<PrivateRoute><CosechaPage /></PrivateRoute>} />
          <Route path="/cultivo/listarcosechas/" element={<PrivateRoute><ListaCosechasPage /></PrivateRoute>} />
          <Route path="/cultivo/tipo_control/" element={<PrivateRoute><TipoControlPage /></PrivateRoute>} />
          <Route path="/cultivo/listartipocontrol/" element={<PrivateRoute><ListaTipoControlPage /></PrivateRoute>} />
          <Route path="/cultivo/productoscontrol/" element={<PrivateRoute><ProductosControlPage /></PrivateRoute>} />
          <Route path="/cultivo/listarproductoscontrol/" element={<PrivateRoute><ListaProductoControlPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />
          <Route path="/iot/sensores" element={<PrivateRoute><SensoresPage /></PrivateRoute>} />
          <Route path="/iot/datosmetereologicos" element={<PrivateRoute><DatosMeteorologicosPage /></PrivateRoute>} />
          <Route path="/pricing" element={<PrivateRoute><PricingPage /></PrivateRoute>} />
          <Route path="/mapa" element={<PrivateRoute><Mapa /></PrivateRoute>} />
          <Route path="/graficas/" element={<PrivateRoute><CosechaGraficasPage /></PrivateRoute>} />
          <Route path="/graficas/usuarios" element={<GraficasPage />} />
          <Route path="/graficas/insumos" element={<GraficaInsumos />} />
          <Route path="/graficas/herramientas" element={<GraficaHerramientas />} />
          <Route path="/blog" element={<PrivateRoute><BlogPage /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
          <Route path="*" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;