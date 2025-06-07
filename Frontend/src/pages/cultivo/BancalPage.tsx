import React, {  useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarBancal } from "@/hooks/cultivo/usebancal";
import { useLotes } from "@/hooks/cultivo/uselotes";
import { useNavigate } from "react-router-dom";
import Formulario from "@/components/globales/Formulario";
import { ModalLote } from "@/components/cultivo/ModalLote";
import { Plus } from "lucide-react";
import { Bancal } from "@/types/cultivo/Bancal";
import { LoteResponse } from "@/types/cultivo/Lotes";
const BancalPage: React.FC = () => {
  const [bancal, setBancal] = useState({
    nombre: "",
    tam_x: 0,
    tam_y: 0,
    latitud: 0,
    longitud: 0,
    lote_id: 0,
  });

  const mutation = useRegistrarBancal();
  const navigate = useNavigate()
  const { data: lotes } = useLotes() as { data: LoteResponse | undefined; isLoading: boolean };

  const [latitudStr, setLatitudStr] = useState("0");
  const [longitudStr, setLongitudStr] = useState("0");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBancal((prev) => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) =>{
    e.preventDefault()
     if (bancal.lote_id === 0) {
    alert("Debe seleccionar un lote.");
    return;
  }
    const latitud = parseFloat(latitudStr);
    const longitud = parseFloat(longitudStr);
  
    const bancalFinal: Bancal = {
      ...bancal,
      latitud: isNaN(latitud) ? 0 : latitud,
      longitud: isNaN(longitud) ? 0 : longitud,
    };

    mutation.mutate(bancalFinal)
  }
  const [openLote, setopenLote] = useState(false)

  return (
    <DefaultLayout>
      <Formulario title="Registro de Bancal"
      onSubmit={handleSubmit}
      >
        <ModalLote
        isOpen={openLote}
        onOpenChange={setopenLote}
        />

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
              value={bancal.tam_x.toString()}
              onChange={(e) => setBancal({ ...bancal, tam_x: parseFloat(e.target.value) })}
            />

            <ReuInput
              label="Tamaño Y"
              placeholder="Ingrese tamaño Y"
              type="number"
              value={bancal.tam_y.toString()}
              onChange={(e) => setBancal({ ...bancal, tam_y: parseFloat(e.target.value) })}
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

          <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Lote</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setopenLote(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="lote_id"
              value={bancal.lote_id}
              onChange={handleChange}
            >
              <option value="">Seleccione un lote</option>
               {lotes?.lotes?.map((lote) => (
                <option key={lote.id} value={lote.id}>{lote.nombre}</option>
              ))}
            </select>
            </div>

            


          <div className="col-span-1 md:col-span-2 flex justify-center">
              <button
                  className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
                  type="button"
                  onClick={() => navigate("/cultivo/listarbancal/")}
                  >
                  Listar bancales
                  </button>
              </div>

     

      </Formulario>
      
    </DefaultLayout>
  );
};

export default BancalPage;