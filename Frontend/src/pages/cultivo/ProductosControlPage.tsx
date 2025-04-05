import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";
import { ReuInput } from "../../components/globales/ReuInput";
import { useRegistrarProductoControl } from "../../hooks/cultivo/useproductoscontrol";
import { ProductoControl } from "@/types/cultivo/ProductosControl";
const ProductosControlPage: React.FC = () => {
  const [productoControl, setProductoControl] = useState<ProductoControl>({
    precio: 0,
    nombre: "",
    compuestoActivo: "",
    fichaTecnica: "",
    Contenido: 0,
    tipoContenido: "",
    unidades: 0,
  });

  const navigate = useNavigate();
  const mutation = useRegistrarProductoControl();

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Registro de Producto de Control
          </h2>

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={productoControl.nombre}
            onChange={(e) => setProductoControl({ ...productoControl, nombre: e.target.value })}
          />

          <ReuInput
            label="Precio"
            placeholder="Ingrese el precio"
            type="number"
            value={productoControl.precio.toString()}
            onChange={(e) => setProductoControl({ ...productoControl, precio: parseInt(e.target.value) })}
          />

          <ReuInput
            label="Compuesto Activo"
            placeholder="Ingrese el compuesto activo"
            type="text"
            value={productoControl.compuestoActivo}
            onChange={(e) => setProductoControl({ ...productoControl, compuestoActivo: e.target.value })}
          />

          <ReuInput
            label="Ficha Técnica"
            placeholder="Ingrese la ficha técnica"
            type="text"
            value={productoControl.fichaTecnica}
            onChange={(e) => setProductoControl({ ...productoControl, fichaTecnica: e.target.value })}
          />

          <ReuInput
            label="Contenido"
            placeholder="Ingrese el contenido"
            type="number"
            value={productoControl.Contenido.toString()}
            onChange={(e) => setProductoControl({ ...productoControl, Contenido: parseInt(e.target.value) })}
          />

          <ReuInput
            label="Tipo de Contenido"
            placeholder="Ingrese el tipo de contenido"
            type="text"
            value={productoControl.tipoContenido}
            onChange={(e) => setProductoControl({ ...productoControl, tipoContenido: e.target.value })}
          />

          <ReuInput
            label="Unidades"
            placeholder="Ingrese las unidades"
            type="number"
            value={productoControl.unidades.toString()}
            onChange={(e) => setProductoControl({ ...productoControl, unidades: parseInt(e.target.value) })}
          />

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
            type="submit"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate(productoControl);
            }}
          >
            {mutation.isPending ? "Registrando..." : "Guardar"}
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarproductoscontrol/")}
          >
            Listar Productos de Control
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProductosControlPage;