import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  LayersControl,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DefaultLayout from "@/layouts/default";
import L from "leaflet";
import { ModalPuntoForm } from "@/components/mapa/ModalPuntoForm";
import { usePuntosMapa, useEliminarPuntoMapa } from "@/hooks/mapa/usePuntoMapa";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from "lucide-react";

// Interfaz PuntoMapa
export interface PuntoMapa {
  id?: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
}

// icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const polygonPoints: [number, number][] = [
  [1.891008, -76.092276],
  [1.892501, -76.091993],
  [1.893558, -76.091488],
  [1.893735, -76.090598],
  [1.893477, -76.090153],
  [1.894308, -76.089238],
  [1.893783, -76.087706],
  [1.892062, -76.086786],
  [1.890957, -76.088492],
  [1.891177, -76.088887],
  [1.891438, -76.090228],
  [1.891054, -76.091166],
  [1.891008, -76.092276],
];

const center: [number, number] = [1.8925, -76.0912];

// Componente que restringe el registro a dentro del poligono
function ClickHandler({
  setClickPosition,
}: {
  setClickPosition: (pos: [number, number] | null) => void;
}) {
  useMapEvents({
    click(e) {
      const point = L.latLng(e.latlng.lat, e.latlng.lng);
      const poly = L.polygon(polygonPoints);
      if (poly.getBounds().contains(point)) {
        setClickPosition([e.latlng.lat, e.latlng.lng]);
      } else {
        alert("No puedes registrar un punto fuera del area delimitada.");
      }
    },
  });
  return null;
}

const MapaPage: React.FC = () => {
  const [clickPosition, setClickPosition] = useState<[number, number] | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); 
  const [selectedPunto, setSelectedPunto] = useState<PuntoMapa | null>(null);
  const [infoPunto, setInfoPunto] = useState<PuntoMapa | null>(null); 

  const { data: puntos, isLoading, error, refetch } = usePuntosMapa();
  const eliminarMutation = useEliminarPuntoMapa();

  useEffect(() => {
    console.log("Estado de puntos:", {
      puntos,
      isLoading,
      error: error?.message || error,
    });
  }, [puntos, isLoading, error]);

  const columns = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripcion", uid: "descripcion", sortable: true },
    { name: "Latitud", uid: "latitud", sortable: true },
    { name: "Longitud", uid: "longitud", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const transformedData = (puntos ?? []).map((punto: PuntoMapa) => ({
    id: punto.id?.toString() || "",
    nombre: punto.nombre || "",
    descripcion: punto.descripcion || "Sin descripcion",
    latitud: `${(punto.latitud || 0).toFixed(6)}`, 
    longitud: `${(punto.longitud || 0).toFixed(6)}`,  
    acciones: (
      <div className="flex gap-2">
        <button
          className="text-green-500 hover:underline"
          onClick={() => handleEdit(punto)}
        >
          <EditIcon size={22} color="black" />
        </button>
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleDelete(punto)}
        >
          <Trash2 size={22} color="red" />
        </button>
      </div>
    ),
  }));

  const handleEdit = (punto: PuntoMapa) => {
    setSelectedPunto(punto);
    setIsEditModalOpen(true);
  };

  const handleDelete = (punto: PuntoMapa) => {
    console.log("Abriendo modal de eliminacion para punto:", punto);
    setSelectedPunto(punto);
    setIsDeleteModalOpen(true);
  };

  const handleShowInfo = (punto: PuntoMapa) => {
    setInfoPunto(punto);
    setIsInfoModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedPunto?.id) {
      console.error("No hay ID de punto seleccionado para eliminar");
      return;
    }

    console.log("Eliminando punto con ID:", selectedPunto.id);
    eliminarMutation.mutate(selectedPunto.id, {
      onSuccess: () => {
        console.log("Punto eliminado con exito");
        setIsDeleteModalOpen(false);
        setSelectedPunto(null);
        refetch();
      },
      onError: (error: any) => {
        console.error("Error eliminando punto:", error.response?.data || error.message);
      },
    });
  };

  useEffect(() => {
    if (!isRegisterModalOpen) {
      setClickPosition(null);
    }
  }, [isRegisterModalOpen]);

  if (error) return (
    <DefaultLayout>
      <p className="text-red-500">Error cargando puntos: {error.message}</p>
    </DefaultLayout>
  );

  return (
    <DefaultLayout>
      <div className="container mx-auto p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Gestion de Puntos de Interes
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mapa</h3>
          <MapContainer
            center={center}
            zoom={18}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%", zIndex: 1 }}
            className="rounded-lg border"
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='© <a href="http://www.esri.com/">Esri</a>'
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            <Polygon
              positions={polygonPoints}
              pathOptions={{ color: "deepskyblue", weight: 5, dashArray: "5, 10", fillOpacity: 0.3 }}
            />

            <ClickHandler setClickPosition={setClickPosition} />

            {clickPosition && (
              <Popup position={clickPosition}>
                <div>
                  <b>Coordenadas:</b>
                  <br />
                  Lat: {`${clickPosition[0].toFixed(6)}`}
                  <br />
                  Lng: {`${clickPosition[1].toFixed(6)}`}
                  <br />
                  <button
                    className="mt-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    Registrar Punto
                  </button>
                </div>
              </Popup>
            )}

            {(puntos ?? []).map((punto: PuntoMapa) => {
              const lat = punto.latitud;
              const lng = punto.longitud;
              if (isNaN(lat) || isNaN(lng)) return null;
              return (
                <Marker
                  key={punto.id}
                  position={[lat, lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleShowInfo(punto),
                  }}
                />
              );
            })}
          </MapContainer>
        </div>

        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Lista de Puntos de Interes
          </h3>
          {isLoading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : (
            <Tabla columns={columns} data={transformedData} />
          )}
        </div>

        {clickPosition && (
          <ModalPuntoForm
            isOpen={isRegisterModalOpen}
            onOpenChange={setIsRegisterModalOpen}
            initialLat={clickPosition[0]}
            initialLng={clickPosition[1]}
            onSuccess={() => {
              setClickPosition(null);
              refetch();
            }}
          />
        )}

        {selectedPunto && (
          <ModalPuntoForm
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            initialPunto={selectedPunto}
            onSuccess={() => {
              setSelectedPunto(null);
              refetch();
            }}
          />
        )}

        <ReuModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Eliminar Punto"
          onConfirm={handleConfirmDelete}
        >
          <p>¿Estas seguro de eliminar este punto? Esta accion es irreversible.</p>
        </ReuModal>

        <ReuModal
          isOpen={isInfoModalOpen}
          onOpenChange={setIsInfoModalOpen}
          title="Informacion del Punto"
          onConfirm={() => setIsInfoModalOpen(false)}
          confirmText="Cerrar"
        >
          {infoPunto && (
            <div className="flex flex-col gap-2">
              <p><strong>Nombre:</strong> {infoPunto.nombre}</p>
              <p><strong>Descripcion:</strong> {infoPunto.descripcion || "Sin descripcion"}</p>
              <p><strong>Latitud:</strong> {`${(infoPunto.latitud || 0).toFixed(6)}`}</p>
              <p><strong>Longitud:</strong> {`${(infoPunto.longitud || 0).toFixed(6)}`}</p>
            </div>
          )}
        </ReuModal>
      </div>
    </DefaultLayout>
  );
};

export default MapaPage;