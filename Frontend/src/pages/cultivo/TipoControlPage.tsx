import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { useRegistrarTipoControl } from "../../hooks/cultivo/usetipocontrol";
import { TipoControl } from "@/types/cultivo/TipoControl";


const TipoControlPage: React.FC = () => {
  const [tipoControl, setTipoControl] = useState<TipoControl>({
    nombre: "",
    descripcion: "",
  });

  const navigate = useNavigate();
  const mutation = useRegistrarTipoControl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(tipoControl);
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Registro de Tipo de Control
          </h2>

          <form onSubmit={handleSubmit}>
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={tipoControl.nombre}
              onChange={(e) =>
                setTipoControl({ ...tipoControl, nombre: e.target.value })
              }
            />

            <ReuInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              type="text"
              value={tipoControl.descripcion}
              onChange={(e) =>
                setTipoControl({ ...tipoControl, descripcion: e.target.value })
              }
            />

            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registrando..." : "Guardar"}
            </button>
          </form>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listartipocontrol/")}
          >
            Listar Tipos de Control
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TipoControlPage;