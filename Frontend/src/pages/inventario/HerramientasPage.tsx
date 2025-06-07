import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarHerramienta } from "@/hooks/inventario/useHerramientas";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";
import { Herramienta } from "@/types/inventario/Herramientas";
import { Switch } from "@heroui/react";

const HerramientaPage: React.FC = () => {
  const [herramienta, setHerramienta] = useState<Herramienta>({
    id: 0,
    nombre: "",
    descripcion: "",
    cantidad: 0,
    estado: "Disponible",
    fecha_registro: new Date().toISOString(),
    activo: true,
    precio: 0,
  });

  const mutation = useRegistrarHerramienta();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(herramienta, {
      onSuccess: () => {
        setHerramienta({
          id: 0,
          nombre: "",
          descripcion: "",
          cantidad: 0,
          estado: "Disponible",
          fecha_registro: new Date().toISOString(),
          activo: true,
          precio: 0,
        });
      },
    });
  };

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? Number(numericValue) : 0;
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Herramienta"
        onSubmit={handleSubmit}
        buttonText="Guardar"
        isSubmitting={mutation.isPending}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={herramienta.nombre}
          onChange={(e) =>
            setHerramienta({ ...herramienta, nombre: e.target.value })
          }
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={herramienta.descripcion}
          onChange={(e) =>
            setHerramienta({ ...herramienta, descripcion: e.target.value })
          }
        />
        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          value={herramienta.cantidad.toString()}
          onChange={(e) =>
            setHerramienta({
              ...herramienta,
              cantidad: Number(e.target.value),
            })
          }
        />
        <ReuInput
          label="Precio Herramienta (COP)"
          placeholder="Ingrese el precio"
          type="text"
          value={herramienta.precio.toLocaleString("es-CO")}
          onChange={(e) =>
            setHerramienta({
              ...herramienta,
              precio: formatPrice(e.target.value),
            })
          }
        />
        <ReuInput
          label="Fecha de Registro"
          placeholder="Fecha de registro"
          type="datetime-local"
          value={herramienta.fecha_registro.slice(0, 16)}
          onChange={(e) =>
            setHerramienta({ ...herramienta, fecha_registro: e.target.value })
          }
        />
          <div className="flex items-center">
            <Switch
                color="success"
                size="sm"
                isSelected={herramienta.activo}
                onChange={(e) => setHerramienta({ ...herramienta, activo: e.target.checked })}
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Activo</label>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            onClick={() => navigate("/inventario/listarherramientas/")}
          >
            Listar Herramientas
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default HerramientaPage;