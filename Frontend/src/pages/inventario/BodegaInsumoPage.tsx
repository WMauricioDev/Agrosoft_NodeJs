import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";
import { useRegistrarBodegaInsumo } from "@/hooks/inventario/useBodegaInsumo";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useInsumos } from "@/hooks/inventario/useInsumo";
import { Insumo } from "@/types/inventario/Insumo";
import Formulario from "@/components/globales/Formulario";
import { ReuInput } from "@/components/globales/ReuInput";
import { ModalBodega } from "@/components/cultivo/ModalBodega";
import { ModalInsumo } from "@/components/inventario/ModalInsumo";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const BodegaInsumoPage: React.FC = () => {
  useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: bodegas } = useBodegas();
  const { data: insumos } = useInsumos();
  const mutation = useRegistrarBodegaInsumo();
  const [isBodegaModalOpen, setIsBodegaModalOpen] = useState(false);
  const [isInsumoModalOpen, setIsInsumoModalOpen] = useState(false);

  const [bodegaInsumo, setBodegaInsumo] = useState<BodegaInsumo>({
    id: 0,
    bodega: 0,
    insumo: 0,
    cantidad: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBodegaInsumo((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleCantidadChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setBodegaInsumo((prev) => ({
      ...prev,
      cantidad: Number(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(bodegaInsumo, {
      onSuccess: () => {
        setBodegaInsumo({ id: 0, bodega: 0, insumo: 0, cantidad: 0 });
        navigate("/inventario/listarbodegainsumos/");
      },
    });
  };

  const handleBodegaSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["bodegas"] });
    setIsBodegaModalOpen(false);
  };

  const handleInsumoSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["insumos"] });
    setIsInsumoModalOpen(false);
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Bodega Insumo"
        onSubmit={handleSubmit}
        buttonText="Guardar"
        isSubmitting={mutation.isPending}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Bodega</label>
            <button
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setIsBodegaModalOpen(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="bodega"
            value={bodegaInsumo.bodega}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="0">Seleccione una Bodega</option>
            {bodegas?.map((bodega: { id: number; nombre: string }) => (
              <option key={bodega.id} value={bodega.id}>
                {bodega.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Insumo</label>
            <button
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setIsInsumoModalOpen(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="insumo"
            value={bodegaInsumo.insumo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="0">Seleccione un Insumo</option>
            {insumos?.map((insumo: Insumo) => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nombre}
              </option>
            ))}
          </select>
        </div>
        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          variant="bordered"
          radius="md"
          value={bodegaInsumo.cantidad}
          onChange={handleCantidadChange}
        />
        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button
            type="button"
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
            onClick={() => navigate("/inventario/listarbodegainsumos/")}
          >
            Listar Bodega Insumos
          </button>
        </div>
      </Formulario>
      <ModalBodega
        isOpen={isBodegaModalOpen}
        onOpenChange={setIsBodegaModalOpen}
        onSuccess={handleBodegaSuccess}
      />
      <ModalInsumo
        isOpen={isInsumoModalOpen}
        onOpenChange={setIsInsumoModalOpen}
        onSuccess={handleInsumoSuccess}
      />
      
    </DefaultLayout>
  );
};

export default BodegaInsumoPage;