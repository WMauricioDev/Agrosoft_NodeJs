import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarBancal } from "@/hooks/cultivo/usebancal";
import { useLotes } from "@/hooks/cultivo/uselotes";
import { useNavigate } from "react-router-dom";

const BancalPage: React.FC = () => {
  const [bancal, setBancal] = useState({
    nombre: "",
    TamX: 0,
    TamY: 0,
    posX: 0,
    posY: 0,
    fk_lote: 0,
  });

  const mutation = useRegistrarBancal();
  const navigate = useNavigate()
  const {data : lotes} = useLotes()



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBancal((prev) => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value),
    }));
  };




  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Bancal</h2>

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={bancal.nombre}
            onChange={(e) => setBancal({ ...bancal, nombre: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <ReuInput
              label="Tamaño X"
              placeholder="Ingrese tamaño X"
              type="number"
              value={bancal.TamX.toString()}
              onChange={(e) => setBancal({ ...bancal, TamX: parseFloat(e.target.value) })}
            />

            <ReuInput
              label="Tamaño Y"
              placeholder="Ingrese tamaño Y"
              type="number"
              value={bancal.TamY.toString()}
              onChange={(e) => setBancal({ ...bancal, TamY: parseFloat(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ReuInput
              label="Posición X"
              placeholder="Ingrese posición X"
              type="number"
              value={bancal.posX.toString()}
              onChange={(e) => setBancal({ ...bancal, posX: parseFloat(e.target.value) })}
            />

            <ReuInput
              label="Posición Y"
              placeholder="Ingrese posición Y"
              type="number"
              value={bancal.posY.toString()}
              onChange={(e) => setBancal({ ...bancal, posY: parseFloat(e.target.value) })}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Lote</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="lote"
              value={bancal.fk_lote}
              onChange={handleChange}
            >
              <option value="">Seleccione un lote</option>
              {lotes?.map((lote) => (
                <option key={lote.id} value={lote.id}>{lote.nombre}</option>
              ))}
            </select>
          </div>

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate(bancal);
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarbancal/")}
          >
            Listar Bancales
          </button>
        </div>
      </div>

    </DefaultLayout>
  );
};

export default BancalPage;