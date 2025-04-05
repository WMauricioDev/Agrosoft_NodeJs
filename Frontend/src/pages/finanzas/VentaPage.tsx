import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useVenta } from "@/hooks/finanzas/useVenta";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { ReuInput } from "@/components/globales/ReuInput";
import { Venta } from "@/types/finanzas/Venta";

const VentaPage: React.FC = () => {
  const [venta, setVenta] = useState<Venta>({
    producto: 0,
    cantidad: 0,
    precio: 0,
    total: 0,
    fecha: new Date().toISOString().split("T")[0],
  });

  const { registrarVenta, isRegistrando } = useVenta();
  const { data: cultivos, isLoading: cultivosLoading } = useCultivos();
  const navigate = useNavigate();

  const handleChange = (field: keyof Venta) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setVenta((prev) => ({
      ...prev,
      [field]: field === "cantidad" || field === "precio" ? Number(value) : value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Venta</h2>

          <label className="block text-sm font-medium text-gray-700 mt-4">Producto</label>
          <select
            name="producto"
            value={venta.producto || ""}
            onChange={handleChange("producto")}
            className="w-full mb-4 p-2 border rounded"
            disabled={cultivosLoading}
          >
            <option value="0">Seleccione un producto</option>
            {cultivos?.map((cultivo) => (
              <option key={cultivo.id} value={cultivo.id}>
                {cultivo.nombre}
              </option>
            ))}
          </select>

          <ReuInput
            label="Cantidad"
            placeholder="Ingrese la cantidad"
            type="number"
            value={String(venta.cantidad)}
            onChange={handleChange("cantidad")}
          />
          <ReuInput
            label="Precio Unitario"
            placeholder="Ingrese el precio"
            type="number"
            value={String(venta.precio)}
            onChange={handleChange("precio")}
          />
          <ReuInput
            label="Fecha"
            placeholder="Seleccione la fecha"
            type="date"
            value={venta.fecha}
            onChange={handleChange("fecha")}
          />

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
            type="submit"
            disabled={isRegistrando || cultivosLoading}
            onClick={(e) => {
              e.preventDefault();
              registrarVenta(
                { ...venta, total: venta.cantidad * venta.precio },
                {
                  onSuccess: () => {
                    setVenta({
                      producto: 0,
                      cantidad: 0,
                      precio: 0,
                      total: 0,
                      fecha: new Date().toISOString().split("T")[0],
                    });
                  },
                }
              );
            }}
          >
            {isRegistrando ? "Registrando..." : "Guardar"}
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={() => navigate("/finanzas/listarventas/")}
          >
            Listar Ventas
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VentaPage;