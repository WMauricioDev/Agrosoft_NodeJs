import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "../../components/globales/ReuInput";
import { useRegistrarLote } from "../../hooks/cultivo/uselotes";
import { Lote } from "../../types/cultivo/Lotes";
import Formulario from "../../components/globales/Formulario";
import { useNavigate } from "react-router-dom";
import { Switch } from "@heroui/react";
const LotesPage: React.FC = () => {
  const [lote, setLote] = useState<Lote>({
    nombre: "",
    descripcion: "",
    activo: false,
    tam_x: 0,
    tam_y: 0,
    latitud: 0,
    longitud: 0,
  });

 

  const mutation = useRegistrarLote();
  const navigate = useNavigate()
  const [latitudStr, setLatitudStr] = useState("0");
  const [longitudStr, setLongitudStr] = useState("0");

  const handleSubmit=(e: React.FormEvent)=>{
    e.preventDefault()
  const latitud = parseFloat(latitudStr);
  const longitud = parseFloat(longitudStr);

  const loteFinal: Lote = {
    ...lote,
    latitud: isNaN(latitud) ? 0 : latitud,
    longitud: isNaN(longitud) ? 0 : longitud,
  };
  console.log("Lote a enviar:", loteFinal);

  mutation.mutate(loteFinal, {
    onError: (error: any) => {
      console.error("Error al registrar lote:", error.response?.data || error.message);
      alert("Error al registrar lote: " + JSON.stringify(error.response?.data));
    }
  });
  }

  return (
    <DefaultLayout>
    <Formulario title="Registro de Lote" onSubmit={handleSubmit}>
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
          label="Latitud"
          placeholder="Ingrese la latitud"
          type="text"
          value={latitudStr}
          onChange={(e) => setLatitudStr(e.target.value)}
        />

       <ReuInput
        label="Longitud"
        placeholder="Ingrese la longitud"
        type="text"
        value={longitudStr}
        onChange={(e) => setLongitudStr(e.target.value)}
      />
      </div>

      <div className="flex items-center gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Switch
            color="success"
            size="sm"
            isSelected={lote.activo}
            onChange={() =>
              setLote((prev) => ({ ...prev, activo: !prev.activo }))
            }
          />
        </div>

      <div className="col-span-1 md:col-span-2 flex justify-center">
        <button
          className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
          type="button"
          onClick={() => navigate("/cultivo/listarlotes/")}
        >
          Listar lotes 
        </button>
      </div>
    </Formulario>
</DefaultLayout>
  );
};

export default LotesPage;