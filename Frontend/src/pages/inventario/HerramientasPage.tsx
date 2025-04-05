import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarHerramienta } from "@/hooks/inventario/useHerramientas";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";

interface Herramienta {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  estado: string;
  fecha_registro: string;
  activo: boolean;
}

const HerramientaPage: React.FC = () => {
  const [herramienta, setHerramienta] = useState<Herramienta>({
    id: 0,
    nombre: "",
    descripcion: "",
    cantidad: 0,
    estado: "Disponible",
    fecha_registro: new Date().toISOString(),
    activo: true,
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
        });
      },
    });
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
          label="Estado"
          placeholder="Ingrese el estado"
          type="text"
          value={herramienta.estado}
          onChange={(e) =>
            setHerramienta({ ...herramienta, estado: e.target.value })
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
          <input
            type="checkbox"
            checked={herramienta.activo}
            onChange={(e) =>
              setHerramienta({ ...herramienta, activo: e.target.checked })
            }
            className="mr-2 h-5 w-5 text-green-500 border-gray-300 rounded"
          />
          <label className="text-gray-700 text-sm font-medium">Activo</label>
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