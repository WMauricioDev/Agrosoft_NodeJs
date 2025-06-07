import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarCultivo } from "@/hooks/cultivo/useCultivo";
import { useEspecies } from "@/hooks/cultivo/useEspecie";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { useNavigate } from "react-router-dom";
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import Formulario from "@/components/globales/Formulario";
import { Plus } from 'lucide-react';
import { ModalUnidadMedida } from "@/components/cultivo/ModalUnidadMedida";
import CustomSpinner from "@/components/globales/Spinner";
import { ModalBancal } from "@/components/cultivo/ModalBancal";
import { ModalEspecie } from "@/components/cultivo/ModalEspecie";
import { Switch } from "@heroui/react";

const CultivoPage: React.FC = () => {
  const [cultivo, setCultivo] = useState({
    nombre: "",
    unidad_de_medida: 0,
    activo: false,
    fechaSiembra: "",
    Especie: 0,
    Bancal: 0,
  });

  const mutation = useRegistrarCultivo();
  const { data: especies, isLoading: loadingEspecies } = useEspecies();
  const { data: bancales, isLoading: loadingBancales } = useBancales();
  const { data: unidadesMedida, isLoading: loadingUnidadesMedida } = useUnidadesMedida();
  const [openUnidadesMedidaModal, setOpenUnidadesMedidaModal] = useState(false);
  const [openBancal, setOpenBancal] = useState(false);
  const [openEspecie, setOpenEspecie] = useState(false);

    
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCultivo((prev) => ({
      ...prev,
      [name]:
        name === "nombre" ||
        name === "unidad_de_medida" ||
        name === "fechaSiembra"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cultivo.nombre && cultivo.unidad_de_medida && cultivo.fechaSiembra && cultivo.Especie && cultivo.Bancal) {
      mutation.mutate(cultivo);
    }
  };

  if (loadingEspecies || loadingBancales) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]"> 
        <CustomSpinner 
          label="Cargando datos..."
          variant="wave"
          color="primary"
          size="md"
          className="my-auto"
        />
      </div>
    );
  }

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Cultivo"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        buttonText="Guardar"
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={cultivo.nombre}
          onChange={(e) => setCultivo({ ...cultivo, nombre: e.target.value })}
        />

      <ModalUnidadMedida 
          isOpen={openUnidadesMedidaModal} 
          onOpenChange={setOpenUnidadesMedidaModal} 
      />
      <ModalBancal
      isOpen={openBancal}
      onOpenChange={setOpenBancal}
      />
      <ModalEspecie
      isOpen={openEspecie}
      onOpenChange={setOpenEspecie}
      />
       <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setOpenUnidadesMedidaModal(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <select
                        value={cultivo.unidad_de_medida}
                        onChange={(e) => setCultivo({ ...cultivo, unidad_de_medida: Number(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        disabled={loadingUnidadesMedida}
                    >
                        <option value="">Seleccione una unidad</option>
                        {unidadesMedida?.map((unidad) => (
                            <option key={unidad.id} value={unidad.id}>
                                {unidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>

        

        <ReuInput
          label="Fecha de Siembra"
          type="date"
          value={cultivo.fechaSiembra}
          onChange={(e) =>
            setCultivo({ ...cultivo, fechaSiembra: e.target.value })
          }
        />
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Especie</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenEspecie(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <select
            name="Especie"
            value={cultivo.Especie || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">Seleccione una especie</option>
            {especies?.map((especie) => (
              <option key={especie.id} value={especie.id}>
                {especie.nombre}
              </option>
            ))}
          </select>
        </div>


        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Bancal</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenBancal(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <select
            name="Bancal"
            value={cultivo.Bancal || ""}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleccione un bancal</option>
            {bancales?.map((bancal) => (
              <option key={bancal.id} value={bancal.id}>
                {bancal.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <Switch
            color="success"
            size="sm"
            isSelected={cultivo.activo}
            onChange={() =>
              setCultivo((prev) => ({ ...prev, activo: !prev.activo }))
            }
          />
        </div>


        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/cultivo/listarcultivos/")}
          >
            Listar cultivos
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default CultivoPage;