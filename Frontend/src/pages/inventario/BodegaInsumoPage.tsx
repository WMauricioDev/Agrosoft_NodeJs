import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { BodegaInsumo } from "@/types/inventario/BodegaInsumo";
import { useRegistrarBodegaInsumo } from "@/hooks/inventario/useBodegaInsumo";
import { useBodegas } from "@/hooks/inventario/useBodega";
import { useInsumos } from "@/hooks/inventario/useInsumo";
import { Insumo } from "@/types/inventario/Insumo";
import Formulario from "@/components/globales/Formulario";
import BodegaInsumoNotifications from "@/components/inventario/BodegaInsumoNotifications";
import { useAuth } from "@/context/AuthContext";

const BodegaInsumoPage: React.FC = () => {
  const { user } = useAuth();
  const [bodegaInsumo, setBodegaInsumo] = useState<BodegaInsumo>({
    id: 0,
    bodega_id: 0,
    insumo_id: 0,
    cantidad: 0,
  });

  const { data: bodegas } = useBodegas();
  const { data: insumos } = useInsumos();
  const mutation = useRegistrarBodegaInsumo();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBodegaInsumo((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(bodegaInsumo, {
      onSuccess: () => {
        setBodegaInsumo({ id: 0, bodega_id: 0, insumo_id: 0, cantidad: 0 });
        navigate("/inventario/listarbodegainsumos/");
      },
    });
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Bodega Insumo"
        onSubmit={handleSubmit}
        buttonText="Guardar"
        isSubmitting={mutation.isPending}
      >
        <select
          name="bodega_id"
          value={bodegaInsumo.bodega_id}
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
        <select
          name="insumo_id"
          value={bodegaInsumo.insumo_id}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
        >
          <option value="0">Seleccione un Insumo</option>
          {insumos?.map((insumo: Insumo) => (
            <option key={insumo.id} value={insumo.id}>
              {insumo.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="cantidad"
          value={bodegaInsumo.cantidad}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
          placeholder="Cantidad"
        />
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            onClick={() => navigate("/inventario/listarbodegainsumos/")}
          >
            Listar Bodega Insumos
          </button>
        </div>
      </Formulario>
      <BodegaInsumoNotifications userId1={user.id} />
    </DefaultLayout>
  );
};

export default BodegaInsumoPage;