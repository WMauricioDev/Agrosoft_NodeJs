import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoActividad } from "@/types/cultivo/TipoActividad";
import { useRegistrarTipoActividad } from "../../hooks/cultivo/usetipoactividad";

const TipoActividadPage: React.FC = () => {
  const [tipoActividad, setTipoActividad] = useState<TipoActividad>({
    nombre: "",
    descripcion: "",
  });

  const navigate = useNavigate();
  const mutation = useRegistrarTipoActividad();
  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Tipo de Actividad</h2>

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={tipoActividad.nombre}
            onChange={(e) => setTipoActividad({ ...tipoActividad, nombre: e.target.value })}
          />

          <ReuInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            type="text"
            value={tipoActividad.descripcion}
            onChange={(e) => setTipoActividad({ ...tipoActividad, descripcion: e.target.value })}
          />

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate(tipoActividad);
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listartipoactividad/")}
          >
            Listar Tipo de Actividad
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TipoActividadPage;