import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { useRegistrarLote } from "../../hooks/cultivo/uselotes";
import { Lote } from "../../types/cultivo/Lotes";
import Formulario from "../../components/globales/Formulario";
import { useNavigate } from "react-router-dom";
const LotesPage: React.FC = () => {
  const [lote, setLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    activo: false,
    tam_x: 0,
    tam_y: 0,
    pos_x: 0,
    pos_y: 0,
  });

 

  const mutation = useRegistrarLote();
  const navigate = useNavigate()


  return (
    <DefaultLayout>
          <Formulario title="Registro de Lote">
            <ReuInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              type="text"
              value={lote.nombre}
              onChange={(e) => setLote({ ...lote, nombre: e.target.value })}
            />

            <ReuInput
              label="Descripción"
              placeholder="Ingrese la descripción"
              type="text"
              value={lote.descripcion}
              onChange={(e) => setLote({ ...lote, descripcion: e.target.value })}
            />

            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                className="w-5 h-5 text-red-600 border-gray-300 rounded"
                checked={lote.activo}
                onChange={(e) => setLote({ ...lote, activo: e.target.checked })}
              />
              <span>Activo</span>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <ReuInput
                label="Tamaño X"
                placeholder="Ingrese tamaño X"
                type="number"
                value={lote.tam_x.toString()}
                onChange={(e) => setLote({ ...lote, tam_x: parseFloat(e.target.value) })}
              />

              <ReuInput
                label="Tamaño Y"
                placeholder="Ingrese tamaño Y"
                type="number"
                value={lote.tam_y.toString()}
                onChange={(e) => setLote({ ...lote, tam_y: parseFloat(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ReuInput
                label="Posición X"
                placeholder="Ingrese posición X"
                type="number"
                value={lote.pos_x.toString()}
                onChange={(e) => setLote({ ...lote, pos_x: parseFloat(e.target.value) })}
              />

              <ReuInput
                label="Posición Y"
                placeholder="Ingrese posición Y"
                type="number"
                value={lote.pos_y.toString()}
                onChange={(e) => setLote({ ...lote, pos_y: parseFloat(e.target.value) })}
              />
            </div>

            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              type="submit"
              disabled={mutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                mutation.mutate(lote);
              }}
            >
              {mutation.isPending ? "Registrando..." : "Guardar"}
            </button>
          </Formulario>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarlotes/")}
          >
            Listar lotes
          </button>
    
    </DefaultLayout>
  );
};

export default LotesPage;