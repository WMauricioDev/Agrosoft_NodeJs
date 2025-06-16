import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { TipoResiduo } from "../../types/cultivo/TipoResiduo";
import { useRegistrarTipoResiduo } from "../../hooks/cultivo/useTipoResiduo";
import Formulario from "../../components/globales/Formulario";
import { addToast } from "@heroui/react";

const TipoResiduoPage: React.FC = () => {
  const [tipoResiduo, setTipoResiduo] = useState<TipoResiduo>({
    nombre: "",
    descripcion: "",
  });

  const mutation = useRegistrarTipoResiduo();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tipoResiduo.nombre) {
      addToast({
        title: "Error",
        description: "El nombre es obligatorio",
        timeout: 3000,
        color: "danger",
      });
      return;
    }
    mutation.mutate(tipoResiduo);
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
          value={tipoResiduo.nombre}
          onChange={(e) => setTipoResiduo({ ...tipoResiduo, nombre: e.target.value })}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={tipoResiduo.descripcion}
          onChange={(e) => setTipoResiduo({ ...tipoResiduo, descripcion: e.target.value })}
        />

        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/cultivo/listartiporesiduo")}
          >
            Listar Tipos de Residuos
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default TipoResiduoPage;