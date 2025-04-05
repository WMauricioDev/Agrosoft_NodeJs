import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { Programacion } from "../../types/cultivo/Programacion";
import { useRegistrarProgramacion} from "../../hooks/cultivo/useProgramacion";
import { useNavigate } from "react-router-dom";

const ProgramacionPage: React.FC = () => {
  const [programacion, setProgramacion] = useState<Programacion>({
    ubicacion: "",
    hora_prog: "",
    fecha_prog: "",
    estado: false,
  });

  const mutation = useRegistrarProgramacion();
  const navigate = useNavigate()

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Programación</h2>

          <ReuInput
            label="Ubicación"
            placeholder="Ingrese la ubicación"
            type="text"
            value={programacion.ubicacion}
            onChange={(e) => setProgramacion({ ...programacion, ubicacion: e.target.value })}
          />

          <ReuInput
            label="Hora Programada"
            placeholder="Ingrese la hora programada"
            type="datetime-local"
            value={programacion.hora_prog}
            onChange={(e) => setProgramacion({ ...programacion, hora_prog: e.target.value })}
          />

          <ReuInput
            label="Fecha Programada"
            placeholder="Ingrese la fecha programada"
            type="date"
            value={programacion.fecha_prog}
            onChange={(e) => setProgramacion({ ...programacion, fecha_prog: e.target.value })}
          />

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate(programacion);
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarprogramaciones/")}
          >
            Listar programaciones
          </button>
        </div>
      </div>

    </DefaultLayout>
  );
};

export default ProgramacionPage;
