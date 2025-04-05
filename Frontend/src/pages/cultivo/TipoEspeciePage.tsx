import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoEspecie } from "../../types/cultivo/TipoEspecie";
import { useRegistrarTipoEspecie } from "../../hooks/cultivo/usetipoespecie";
import Formulario from "../../components/globales/Formulario";

const TipoEspeciePage: React.FC = () => {
  const [tipoEspecie, setTipoEspecie] = useState<TipoEspecie>({
    nombre: "",
    descripcion: "",
    img: null,
  });

  const mutation = useRegistrarTipoEspecie();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTipoEspecie((prev) => ({ ...prev, img: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(tipoEspecie);
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Tipo de Especie"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        buttonText="Guardar"
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={tipoEspecie.nombre}
          onChange={(e) => setTipoEspecie({ ...tipoEspecie, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={tipoEspecie.descripcion}
          onChange={(e) => setTipoEspecie({ ...tipoEspecie, descripcion: e.target.value })}
        />

        <div className="col-span-1 sm:col-span-2">
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

        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/cultivo/listartipoespecie/")}
          >
            Listar Tipo de Especie
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default TipoEspeciePage;