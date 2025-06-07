import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarResiduo } from "@/hooks/cultivo/useResiduo";
import { useCosechas } from "@/hooks/cultivo/usecosecha";
import { useTipoResiduos } from "@/hooks/cultivo/useTipoResiduo";
import { useNavigate } from "react-router-dom";
import Formulario from "@/components/globales/Formulario";
import { Plus } from 'lucide-react';
import { ModalCosecha } from "@/components/cultivo/ModalCosecha";
import { ModalTipoResiduo } from "@/components/cultivo/ModalTipoResiduo";
import CustomSpinner from "@/components/globales/Spinner";

const ResiduoPage: React.FC = () => {
  const [residuo, setResiduo] = useState({
    id_cosecha: 0,
    id_tipo_residuo: 0,
    nombre: "",
    descripcion: "",
    fecha: "",
    cantidad: 0
  });

  const mutation = useRegistrarResiduo();
  const { data: cosechas, isLoading: loadingCosechas } = useCosechas();
  const { data: tiposResiduos, isLoading: loadingTiposResiduos } = useTipoResiduos();
  const [openCosechaModal, setOpenCosechaModal] = useState(false);
  const [openTipoResiduoModal, setOpenTipoResiduoModal] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setResiduo((prev) => ({
      ...prev,
      [name]: name === "nombre" || name === "descripcion" || name === "fecha"
        ? value
        : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (residuo.nombre && residuo.id_cosecha && residuo.id_tipo_residuo && residuo.fecha) {
      mutation.mutate(residuo);
    }
  };

  if (loadingCosechas || loadingTiposResiduos) {
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
        title="Registro de Residuo"
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        buttonText="Guardar"
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre del residuo"
          type="text"
          name="nombre"
          value={residuo.nombre}
          onChange={(e) => setResiduo({... residuo, nombre: e.target.value})}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          name="descripcion"
          value={residuo.descripcion}
          onChange={(e) => setResiduo({... residuo, descripcion: e.target.value})}
        />

        <ReuInput
          label="Fecha"
          placeholder="Seleccione la fecha"
          type="date"
          name="fecha"
          value={residuo.fecha}
          onChange={(e) => setResiduo({... residuo, fecha: e.target.value})}
        />

        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          name="cantidad"
          value={residuo.cantidad.toString()}
          onChange={(e) => setResiduo({... residuo, cantidad: parseInt(e.target.value)})}
        />

        <ModalCosecha 
          isOpen={openCosechaModal} 
          onOpenChange={setOpenCosechaModal} 
        />
        
        <ModalTipoResiduo
          isOpen={openTipoResiduoModal}
          onOpenChange={setOpenTipoResiduoModal}
        />

        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Cosecha</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenCosechaModal(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <select
            name="id_cosecha"
            value={residuo.id_cosecha || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">Seleccione una cosecha</option>
            {cosechas?.map((cosecha) => (
              <option key={cosecha.id} value={cosecha.id}>
                {cosecha.cultivo_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-1">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Tipo de Residuo</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenTipoResiduoModal(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <select
            name="id_tipo_residuo"
            value={residuo.id_tipo_residuo || ""}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleccione un tipo de residuo</option>
            {tiposResiduos?.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/cultivo/listaresiduo/")}
          >
            Listar Residuos
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default ResiduoPage;