// src/pages/sensores/ListarSensoresPage.tsx
import { useState, useMemo, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { useSensores } from "@/hooks/iot/sensores/useSensores";
import { useUpdateSensor } from "@/hooks/iot/sensores/usePutSensor";
import { useDeleteSensor } from "@/hooks/iot/sensores/useDeleteSensor";
import { useToggleSensor } from "@/hooks/iot/sensores/useToggleSensor";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { useNavigate } from "react-router-dom";
import Tabla from "@/components/globales/Tabla";
import { ModalSensor } from "@/components/Iot/ModalSensor";
import GuideModal from "@/components/Iot/GuideModal";
import { Sensor } from "@/types/iot/type";
import { EditIcon, Trash2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Switcher from "@/components/switch"; 
import { addToast } from "@heroui/toast";

export default function ListarSensoresPage() {
  const { sensores, isLoading, error } = useSensores();
  const updateSensor = useUpdateSensor();
  const deleteSensor = useDeleteSensor();
  const toggleSensor = useToggleSensor();
  const { data: bancales } = useBancales();
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [sensoresLocal, setSensoresLocal] = useState<Sensor[]>([]);  
  const navigate = useNavigate();

  // Sincronizar sensoresLocal con sensores de la API
  useEffect(() => {
    setSensoresLocal(sensores);
  }, [sensores]);

  console.log("[ListarSensoresPage] Estado inicial: ", {
    sensores,
    isLoading,
    error,
    bancales,
  });

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Nombre", uid: "nombre" },
    { name: "Tipo", uid: "tipo_sensor" },
    { name: "Unidad", uid: "unidad_medida" },
    { name: "Código Dispositivo", uid: "device_code" },
    { name: "Bancal", uid: "bancal_nombre" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  const formattedData = useMemo(() => {
    console.log("[ListarSensoresPage] Formateando datos para la tabla: ", { sensores, bancales });
    return sensoresLocal.map((sensor: Sensor) => ({
      id: sensor.id ? sensor.id.toString() : "N/A",
      nombre: sensor.nombre || "Sin nombre",
      tipo_sensor: sensor.tipo_sensor || "Desconocido",
      unidad_medida: sensor.unidad_medida || "N/A",
      device_code: sensor.device_code || "N/A",
      bancal_nombre: sensor.bancal_nombre || "Sin bancal",
      estado: (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            sensor.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {sensor.estado === "activo" ? "Activo" : "Inactivo"}
        </span>
      ),
      acciones: (
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => {
              console.log("[ListarSensoresPage] Abriendo modal de edición para sensor: ", sensor);
              setSelectedSensor({ ...sensor });
              setIsEditModalOpen(true);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <EditIcon size={20} color="black" />
          </motion.button>
          <motion.button
            onClick={() => {
              console.log("[ListarSensoresPage] Abriendo modal de eliminación para sensor: ", sensor);
              setSelectedSensor(sensor);
              setIsDeleteModalOpen(true);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={20} color="red" />
          </motion.button>
          <motion.div
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Switcher
              size="sm"
              isSelected={sensor.estado === "activo"}
              color={sensor.estado === "activo" ? "success" : "danger"}
              onChange={(e) => {
                const activo = e.target.checked;
                console.log("[ListarSensoresPage] Cambiando estado del sensor: ", {
                  sensorId: sensor.id,
                  activo,
                });
                toggleSensor.mutate(
                  { sensorId: sensor.id, activo },
                  {
                    onSuccess: () => {
                      // Actualizar el estado local para reflejar el cambio en la UI
                      setSensoresLocal((prev) =>
                        prev.map((s) =>
                          s.id === sensor.id ? { ...s, estado: activo ? "activo" : "inactivo" } : s
                        )
                      );
                      // El toast ya está manejado en useToggleSensor
                    },
                    onError: () => {
                      // El toast de error ya está manejado en useToggleSensor
                    },
                  }
                );
              }}
            />
          </motion.div>
        </div>
      ),
    }));
  }, [sensoresLocal, bancales, toggleSensor]);

  const handleConfirmEdit = (editedSensor: Sensor | null) => {
    if (editedSensor?.id) {
      console.log("[ListarSensoresPage] Confirmando edición del sensor: ", editedSensor);
      updateSensor.mutate(editedSensor, {
        onSuccess: () => {
          console.log("[ListarSensoresPage] Edición exitosa, cerrando modal");
          setIsEditModalOpen(false);
          setSelectedSensor(null);
        },
        onError: (error: any) => {
          console.error("[ListarSensoresPage] Error al editar sensor: ", error);
        },
      });
    } else {
      console.error("[ListarSensoresPage] No se puede editar: editedSensor.id es inválido", editedSensor);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedSensor?.id) {
      console.log("[ListarSensoresPage] Confirmando eliminación del sensor: ", selectedSensor);
      deleteSensor.mutate(selectedSensor.id, {
        onSuccess: () => {
          console.log("[ListarSensoresPage] Eliminación exitosa, cerrando modal");
          setIsDeleteModalOpen(false);
          setSelectedSensor(null);
        },
        onError: (error: any) => {
          console.error("[ListarSensoresPage] Error al eliminar sensor: ", error);
        },
      });
    } else {
      console.error("[ListarSensoresPage] No se puede eliminar: selectedSensor.id es inválido", selectedSensor);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-4">
            <motion.button
              onClick={() => {
                console.log("[ListarSensoresPage] Abriendo modal de guía");
                setIsGuideModalOpen(true);
              }}
              className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Guía de uso"
            >
              <HelpCircle size={24} />
            </motion.button>
            <h2 className="text-2xl font-bold text-gray-800">Lista de Sensores Registrados</h2>
            <div className="w-10"></div>
          </div>
          <div className="mb-2 flex justify-start gap-2">
            <button
              className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => {
                console.log("[ListarSensoresPage] Navegando a /iot/registrar-sensor");
                navigate("/iot/registrar-sensor");
              }}
            >
              + Registrar Sensor
            </button>
          </div>
          {isLoading ? (
            <p className="text-gray-600 text-center">Cargando sensores...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error.message}</p>
          ) : (
            <>
              <Tabla columns={columns} data={formattedData} responsiveColumns={["nombre", "estado"]} />
              {sensoresLocal.length === 0 && (
                <p className="text-gray-600 text-center mt-4">No hay sensores registrados</p>
              )}
            </>
          )}
        </div>
      </div>
      <ModalSensor
        isOpen={isEditModalOpen}
        onOpenChange={(open) => {
          console.log("[ListarSensoresPage] Cambiando estado del modal de edición: ", open);
          setIsEditModalOpen(open);
        }}
        sensor={selectedSensor!}
        onConfirm={handleConfirmEdit}
      />
      <ModalSensor
        isOpen={isDeleteModalOpen}
        onOpenChange={(open) => {
          console.log("[ListarSensoresPage] Cambiando estado del modal de eliminación: ", open);
          setIsDeleteModalOpen(open);
        }}
        sensor={selectedSensor!}
        onConfirm={handleConfirmDelete}
        isDelete
      />
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => {
          console.log("[ListarSensoresPage] Cerrando modal de guía");
          setIsGuideModalOpen(false);
        }}
      />
    </DefaultLayout>
  );
}