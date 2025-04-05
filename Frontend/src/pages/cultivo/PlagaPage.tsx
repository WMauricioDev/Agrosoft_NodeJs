import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { Plaga } from "@/types/cultivo/Plaga"; 
import { useRegistrarPlaga } from "@/hooks/cultivo/useplaga";
import { useTipoPlagas } from "@/hooks/cultivo/usetipoplaga";

const PlagaPage: React.FC = () => {
  const [plaga, setPlaga] = useState<Plaga>({
    fk_tipo_plaga: 0,
    nombre: "",
    descripcion: "",
    img: null,
  });

  const mutation = useRegistrarPlaga();
  const navigate = useNavigate();
  const { data: tiposPlaga } = useTipoPlagas();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPlaga((prev) => ({ ...prev, img: e.target.files![0] }));
    }
  };

  const handleTipoPlagaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tipoPlagaId = parseInt(e.target.value, 10);
    setPlaga((prev) => ({ ...prev, fk_tipo_plaga: tipoPlagaId }));
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Plaga</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo de Plaga</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={plaga.fk_tipo_plaga || ""}
              onChange={handleTipoPlagaChange}
            >
              <option value="">Seleccione un tipo de plaga</option>
            
               {tiposPlaga?.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))} */
            </select>
          </div>

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={plaga.nombre}
            onChange={(e) => setPlaga({ ...plaga, nombre: e.target.value })}
          />

          <ReuInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            type="text"
            value={plaga.descripcion}
            onChange={(e) => setPlaga({ ...plaga, descripcion: e.target.value })}
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
              mutation.mutate(plaga);
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarplaga")}
          >
            Listar Plagas
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PlagaPage;