import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DefaultLayout from "@/layouts/default";
import { BodegaHerramienta } from "@/types/inventario/BodegaHerramienta";
import { useRegistrarBodegaHerramienta } from "@/hooks/inventario/useBodegaHerramienta";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useHerramientas } from "@/hooks/inventario/useHerramientas";
import Formulario from "@/components/globales/Formulario";
import { useAuth } from "@/context/AuthContext";
import { ReuInput } from "@/components/globales/ReuInput";
import { ModalBodega } from "@/components/cultivo/ModalBodega";
import { ModalHerramienta } from "@/components/cultivo/ModalHerramienta";
import { Plus } from 'lucide-react';

const BodegaHerramientaPage: React.FC = () => {
  const { user } = useAuth();
  const [bodegaHerramienta, setBodegaHerramienta] = useState<Omit<BodegaHerramienta, "id" | "costo_total">>({
    bodega_id: 0,
    herramienta_id: 0,
    cantidad: 0,
    creador_id: user?.id,
    cantidad_prestada: 0,
  });
  const [isBodegaModalOpen, setIsBodegaModalOpen] = useState(false);
  const [isHerramientaModalOpen, setIsHerramientaModalOpen] = useState(false);

  const { data: bodegas } = useBodegas();
  const { data: herramientas } = useHerramientas();
  const mutation = useRegistrarBodegaHerramienta();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBodegaHerramienta((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodegaHerramienta.bodega_id || !bodegaHerramienta.herramienta_id || !bodegaHerramienta.cantidad) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    mutation.mutate(bodegaHerramienta, {
      onSuccess: () => {
        setBodegaHerramienta({ bodega_id: 0, herramienta_id: 0, cantidad: 0, creador_id: user?.id, cantidad_prestada: 0 });
        navigate("/inventario/listarbodegaherramienta/");
      },
    });
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Bodega Herramienta"
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
            name="bodega_id"
            value={bodegaHerramienta.bodega_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
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
            <label className="block text-sm font-medium text-gray-700">Herramienta</label>
            <button
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setIsHerramientaModalOpen(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="herramienta_id"
            value={bodegaHerramienta.herramienta_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
          >
            <option value="0">Seleccione una Herramienta</option>
            {herramientas?.map((herramienta: { id: number; nombre: string }) => (
              <option key={herramienta.id} value={herramienta.id}>
                {herramienta.nombre}
              </option>
            ))}
          </select>
        </div>
        <ReuInput
          label="Cantidad"
          type="number"
          variant="bordered"
          radius="md"
          value={bodegaHerramienta.cantidad}
          onChange={(e) => setBodegaHerramienta((prev) => ({ ...prev, cantidad: Number(e.target.value) }))}
        />
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            onClick={() => navigate("/inventario/listarbodegaherramienta/")}
          >
            Listar Bodega Herramientas
          </button>
        </div>
      </Formulario>
      <ModalBodega
        isOpen={isBodegaModalOpen}
        onOpenChange={setIsBodegaModalOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["bodegas"] })}
      />
      <ModalHerramienta
        isOpen={isHerramientaModalOpen}
        onOpenChange={setIsHerramientaModalOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["herramientas"] })}
      />
    </DefaultLayout>
  );
};

export default BodegaHerramientaPage;