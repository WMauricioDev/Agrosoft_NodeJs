import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";
import { TipoActividad } from "@/types/cultivo/TipoActividad";
import { useRegistrarTipoActividad } from "../../hooks/cultivo/usetipoactividad";

const TipoActividadPage: React.FC = () => {
  const [tipoActividad, setTipoActividad] = useState<TipoActividad>({
    nombre: "",
    descripcion: "",
  });

  const mutation = useRegistrarTipoActividad();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(tipoActividad);
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Tipo de Actividad"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        buttonText="Guardar"
      >
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

        <div className="col-span-1 md:col-span-2 flex flex-col items-center gap-12">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/cultivo/listartipoactividad/")}
          >
            Listar Tipo de Actividad
          </button>

        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default TipoActividadPage;
