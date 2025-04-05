import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarBodega } from "@/hooks/inventario/useBodega";
import Formulario from "@/components/globales/Formulario";
import { ReuInput } from "@/components/globales/ReuInput";

interface Bodega {
  id: number;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  direccion: string;
  telefono: string;
  activo: boolean;
}

const BodegaPage: React.FC = () => {
  const [bodega, setBodega] = useState<Bodega>({
    id: 0,
    nombre: "",
    ubicacion: "",
    capacidad: 0,
    direccion: "",
    telefono: "",
    activo: true,
  });

  const mutation = useRegistrarBodega();
  const navigate = useNavigate();

  const handleSubmit = () => {
    mutation.mutate(bodega, {
      onSuccess: () => {
        setBodega({
          id: 0,
          nombre: "",
          ubicacion: "",
          capacidad: 0,
          direccion: "",
          telefono: "",
          activo: true,
        });
      },
    });
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Bodega"
        onSubmit={handleSubmit}
        buttonText="Registrar Bodega"
        isSubmitting={mutation.isPending}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={bodega.nombre}
          onChange={(e) => setBodega({ ...bodega, nombre: e.target.value })}
        />
        <ReuInput
          label="Ubicación"
          placeholder="Ingrese la ubicación"
          type="text"
          value={bodega.ubicacion}
          onChange={(e) => setBodega({ ...bodega, ubicacion: e.target.value })}
        />
        <ReuInput
          label="Capacidad"
          placeholder="Ingrese la capacidad"
          type="number"
          value={String(bodega.capacidad)}
          onChange={(e) => setBodega({ ...bodega, capacidad: Number(e.target.value) })}
        />
        <ReuInput
          label="Dirección"
          placeholder="Ingrese la dirección"
          type="text"
          value={bodega.direccion}
          onChange={(e) => setBodega({ ...bodega, direccion: e.target.value })}
        />
        <ReuInput
          label="Teléfono"
          placeholder="Ingrese el teléfono"
          type="text"
          value={bodega.telefono}
          onChange={(e) => setBodega({ ...bodega, telefono: e.target.value })}
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            name="activo"
            checked={bodega.activo}
            onChange={(e) => setBodega({ ...bodega, activo: e.target.checked })}
            className="mr-2 h-5 w-5 text-green-500 border-gray-300 rounded"
          />
          <label className="text-gray-700 text-sm font-medium">Activo</label>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            onClick={() => navigate("/inventario/listarbodega/")}
          >
            Listar Bodegas
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default BodegaPage;