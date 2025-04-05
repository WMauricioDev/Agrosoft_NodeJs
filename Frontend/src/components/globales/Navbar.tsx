import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLeaf,
  FaDollarSign,
  FaBug,
  FaBox,
  FaCloudRain,
  FaTachometerAlt,
  FaTemperatureHigh,
  FaWarehouse,
  FaFileAlt,
  FaChartBar 
} from "react-icons/fa";
import { GiProcessor } from "react-icons/gi";
import LogoSena from "../../assets/def_AGROSIS_LOGOTIC.png";
import Sena from "../../assets/logo sena.png";

const menuItems = [
  { id: 1, label: "Inicio", path: "/", icon: <FaHome /> },
  { id: 21, label: "Usuarios", path: "/usuarios", icon: <FaUser /> },
  { id: 3, label: "Calendario", path: "/calendario", icon: <FaCalendarAlt /> },
  { id: 4, label: "Mapa", path: "/mapa", icon: <FaMapMarkerAlt /> },
  {
    id: 5,
    label: "Cultivos",
    icon: <FaLeaf />,
    subItems: [
      { id: 6, label: "Cultivo", path: "/cultivo/listarcultivos/" },
      { id: 7, label: "Especies", path: "/cultivo/listarespecies/" },
      { id: 8, label: "Tipo Especie", path: "/cultivo/listartipoespecie/" },
      { id: 9, label: "Bancal", path: "/cultivo/listarbancal/" },
      { id: 10, label: "Lotes", path: "/cultivo/listarlotes/" },
      { id: 11, label: "Tipo Actividad", path: "/cultivo/listartipoactividad/" },
      { id: 12, label: "Actividades", path: "/cultivo/listaractividad/" },
      { id: 13, label: "Programación", path: "/cultivo/listarprogramaciones/" },
      { id: 14, label: "Cosecha", path: "/cultivo/listarcosechas/" },

    ],
  },
  { id: 15, 
    label: "Finanzas",
     icon: <FaDollarSign />,
    subItems:[
      { id: 34, label: "Salario", path: "/finanzas/salario/" },
      { id: 35, label: "Ventas", path: "/finanzas/ventas/" },
    ] },
  {
    id: 16,
    label: "Plagas",
    icon: <FaBug />,
    subItems: [
      { id: 17, label: "Tipo Plaga", path: "/cultivo/listartipoplaga/"},
      { id: 18, label: "Plaga", path: "/cultivo/listarplaga/"},
      { id: 19, label: "Control", path: "/cultivo/control/" },
      { id: 20, label: "Tipo Control", path: "/cultivo/listartipocontrol/" },
      { id: 21, label: "Afecciones", path: "/cultivo/afecciones/" },
      { id: 22, label: "Productos Control", path: "/cultivo/listarproductoscontrol/" },
    ],
  },  {
    id: 23,
    label: "Inventario",
    icon: <FaBox />,
    subItems: [
      { id: 24, label: "Bodega", path: "/inventario/listarbodega", icon: <FaWarehouse /> },
      { id: 25, label: "Bodega Herramienta", path: "/inventario/listarbodegaherramienta", icon: <FaBox /> },
      { id: 26, label: "Herramientas", path: "/inventario/listarherramientas", icon: <FaBox /> },
      { id: 27, label: "Bodega Insumo", path: "/inventario/listarbodegainsumos", icon: <FaBox /> },
      { id: 28, label: "Insumos", path: "/inventario/listarinsumos", icon: <FaBox /> },
    ],
  },
  {
    id: 29,
    label: "IoT",
    icon: <GiProcessor />,
    subItems: [
      { id: 30, label: "Evapotranspiración", path: "/iot/evapotranspiracion", icon: <FaCloudRain /> },
      { id: 31, label: "Sensores", path: "/iot/sensores", icon: <FaTachometerAlt /> },
      { id: 32, label: "Humedad", path: "/iot/humedad", icon: <FaTemperatureHigh /> },
    ],
  },
  { id: 33, label: "Reportes", path: "/reportes/", icon: <FaFileAlt /> },
  { id: 34, label: "Graficas", path: "/graficas/", icon: <FaChartBar /> },
];

export default function Navbar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  return (
    <aside
      className={`h-screen bg-white shadow-lg transition-all duration-300 flex flex-col fixed top-0 bottom-0 z-50
      ${isOpen ? "w-64 p-4" : "w-20 p-2"} rounded-r-2xl`}
    >
      <div className="flex justify-between items-center">
        <Button isIconOnly variant="light" className="mb-4" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      <div className={`flex items-center justify-center transition-all ${!isOpen ? "hidden" : ""}`}>
        <img src={LogoSena} alt="Logo Agrosis" className="w-40 transition-all" />
      </div>

      <nav className="flex flex-col mt-6 gap-4 overflow-y-auto scrollbar-hidden flex-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.id} item={item} isOpen={isOpen} />
        ))}
      </nav>

      <div className={`mt-6 flex items-center justify-center transition-all ${!isOpen ? "hidden" : ""}`}>
        <img src={Sena} alt="Logo Sena" className="w-20 transition-all" />
      </div>
    </aside>
  );
}

function SidebarItem({ item, isOpen }: { item: any; isOpen: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Link
        to={item.path || "#"}
        className={`flex items-center gap-2 p-3 rounded-full transition-all font-medium cursor-pointer
        bg-white shadow-md hover:bg-gray-400 hover:text-white
        ${isOpen ? "w-5/6 mx-auto" : "justify-center w-12 mx-auto"}`}
        onClick={(e) => {
          if (item.subItems) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {item.icon}
        {isOpen && <span>{item.label}</span>}
        {item.subItems && isOpen && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </Link>

      {isOpen && isExpanded && item.subItems && (
        <div className="flex flex-col gap-2 mt-2 ml-8">
          {item.subItems.map((subItem: any) => (
            <Link 
              key={subItem.id} 
              to={subItem.path} 
              className="flex items-center gap-2 p-2 pl-6 rounded-full transition-all font-medium cursor-pointer 
              bg-gray-100 shadow-sm hover:bg-gray-300 hover:text-white text-gray-700 w-5/6 mx-auto
              relative before:absolute before:left-3 before:w-2 before:h-2 before:bg-gray-400 before:rounded-full"
            >
              {subItem.icon && <span className="text-gray-600">{subItem.icon}</span>}
              <span className="text-sm">{subItem.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = `
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hidden {
    -ms-overflow-style: none; /* IE y Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

export function GlobalStyles() {
  return <style>{styles}</style>;
}