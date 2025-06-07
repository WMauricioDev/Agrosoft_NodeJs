import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";
import { useCrearAfeccion } from "@/hooks/cultivo/useAfecciones";
import { usePlagas } from "@/hooks/cultivo/useplaga";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { Afeccion } from "@/types/cultivo/Afeccion";
import { ModalPlaga } from "@/components/cultivo/ModalPlaga";
import { ModalBancal } from "@/components/cultivo/ModalBancal";
import { ModalCultivo } from "@/components/cultivo/ModalCultivo";
import { Plus } from "lucide-react";
const AfeccionesPage: React.FC = () => {
  const [afeccion, setAfeccion] = useState<Omit<Afeccion, 'id' | 'estado'>>({
    nombre: "",
    descripcion: "",
    fecha_deteccion: new Date().toISOString().slice(0, 10),
    gravedad: "M",
    plaga_id: 0,
    cultivo_id: 0,
    bancal_id: 0,
    reporte: null
  });

  const { data: plagas } = usePlagas();
  const { data: cultivos } = useCultivos();
  const { data: bancales } = useBancales();
  const mutation = useCrearAfeccion();
  const navigate = useNavigate();
  const [openPlaga, setopenPlaga] = useState(false)
  const [openCultivo, setopenCultivo] = useState(false)
  const [openBancal, setopenBancal] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(afeccion, {
      onSuccess: () => navigate("/cultivo/listafecciones/")
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAfeccion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Afección"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        buttonText="Guardar"
      >
        <ModalPlaga
        isOpen={openPlaga}
        onOpenChange={setopenPlaga}
        />
        <ModalCultivo
        isOpen={openCultivo}
        onOpenChange={setopenCultivo}
        />
        <ModalBancal
        isOpen={openBancal}
        onOpenChange={setopenBancal}
        />
        <ReuInput
          label="Nombre"
          placeholder="Nombre descriptivo de la afección"
          type="text"
          value={afeccion.nombre}
          onChange={(e) => setAfeccion({...afeccion, nombre: e.target.value})}
        />

        <ReuInput
          label="Descripción"
          placeholder="Detalles de la afección"
          type="textarea"
          value={afeccion.descripcion}
          onChange={(e) => setAfeccion({...afeccion, descripcion: e.target.value})}
        />

        <ReuInput
          label="Fecha de Detección"
          type="date"
          value={afeccion.fecha_deteccion}
          onChange={(e) => setAfeccion({...afeccion, fecha_deteccion: e.target.value})}
          
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gravedad</label>
          <select
            name="gravedad"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={afeccion.gravedad}
            onChange={handleChange}
            required
          >
            <option value="L">Leve</option>
            <option value="M">Moderada</option>
            <option value="G">Grave</option>
          </select>
        </div>
        <div>
        <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Plaga</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setopenPlaga(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
          <select
              name="plaga_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={afeccion.plaga_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una plaga</option>
              {plagas?.map(plaga => (
                <option key={plaga.id} value={plaga.id}>{plaga.nombre}</option>
              ))}
            </select>
        </div>
        <div>
        <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Cultivo</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setopenCultivo(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
          <select
              name="cultivo_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={afeccion.cultivo_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un cultivo</option>
              {cultivos?.map(cultivo => (
                <option key={cultivo.id} value={cultivo.id}>{cultivo.nombre}</option>
              ))}
            </select>
        </div>
        <div>
        <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Bancal</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setopenBancal(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
          <select
              name="bancal_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={afeccion.bancal_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un bancal</option>
              {bancales?.map(bancal => (
                <option key={bancal.id} value={bancal.id}>{bancal.nombre}</option>
              ))}
            </select>
        </div>
         

        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/cultivo/listafecciones/")}
          >
            Listar Afecciones
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default AfeccionesPage;