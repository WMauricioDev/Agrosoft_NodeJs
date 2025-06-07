import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoResiduo } from "../../types/cultivo/TipoResiduo";
import { useRegistrarTipoResiduo } from "../../hooks/cultivo/useTipoResiduo";
import Formulario from "../../components/globales/Formulario";

const TipoResiduoPage: React.FC = () => {
  const [TipoResiduo, setTipoResiduo] = useState<TipoResiduo>({
    nombre: "",
    descripcion: "",
  });

  const mutation = useRegistrarTipoResiduo();
  const navigate = useNavigate();


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(TipoResiduo);
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Tipo de Residuo"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        buttonText="Guardar"
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={TipoResiduo.nombre}
          onChange={(e) => setTipoResiduo({ ...TipoResiduo, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={TipoResiduo.descripcion}
          onChange={(e) => setTipoResiduo({ ...TipoResiduo, descripcion: e.target.value })}
        />


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

export default TipoResiduoPage;