import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoPlaga } from "../../types/cultivo/TipoPlaga"; 
import { useRegistrarTipoPlaga } from "../../hooks/cultivo/usetipoplaga"; 

const TipoPlagaPage: React.FC = () => {
  const [tipoPlaga, setTipoPlaga] = useState<TipoPlaga>({
    nombre: "",
    descripcion: "",
    img: null,
  });

  const mutation = useRegistrarTipoPlaga();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTipoPlaga((prev) => ({ ...prev, img: e.target.files![0] }));
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Tipo de Plaga</h2>

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={tipoPlaga.nombre}
            onChange={(e) => setTipoPlaga({ ...tipoPlaga, nombre: e.target.value })}
          />

          <ReuInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            type="text"
            value={tipoPlaga.descripcion}
            onChange={(e) => setTipoPlaga({ ...tipoPlaga, descripcion: e.target.value })}
          />

          <div className="mb-6">
            <input
              type="file"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="imagen"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label htmlFor="imagen" className="block mt-2 text-sm font-medium text-gray-700">
              Imagen
            </label>
          </div>

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate(tipoPlaga);
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listartipoplaga/")}
          >
            Listar Tipo de Plaga
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TipoPlagaPage;