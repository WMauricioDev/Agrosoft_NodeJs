import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DefaultLayout from "@/layouts/default";
import  { Icon } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png?url"; 

const customIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapaPage: React.FC = () => {
    const position: [number, number] = [1.8528, -76.0517]; 

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Mapa de Ubicación
          </h2>
          <MapContainer
            center={position as [number, number]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={position as [number, number]} icon={customIcon}>
              <Popup>📍 Pitalito - Huila</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default MapaPage;
