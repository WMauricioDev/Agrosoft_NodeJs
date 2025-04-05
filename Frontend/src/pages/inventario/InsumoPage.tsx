import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarInsumo } from "@/hooks/inventario/useInsumo";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";

interface Insumo {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  activo: boolean;
  tipo_empacado: string | null;
  fecha_registro: string;
  fecha_caducidad: string | null;
  fecha_actualizacion: string;
}

const InsumoPage: React.FC = () => {
  const [insumo, setInsumo] = useState<Insumo>({
    id: 0,
    nombre: "",
    descripcion: "",
    cantidad: 0,
    unidad_medida: "",
    activo: true,
    tipo_empacado: null,
    fecha_registro: new Date().toISOString(),
    fecha_caducidad: null,
    fecha_actualizacion: new Date().toISOString(),
  });

  const mutation = useRegistrarInsumo();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(insumo, {
      onSuccess: () => {
        setInsumo({
          id: 0,
          nombre: "",
          descripcion: "",
          cantidad: 0,
          unidad_medida: "",
          activo: true,
          tipo_empacado: null,
          fecha_registro: new Date().toISOString(),
          fecha_caducidad: null,
          fecha_actualizacion: new Date().toISOString(),
        });
      },
    });
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Insumo"
        onSubmit={handleSubmit}
        buttonText="Guardar"
        isSubmitting={mutation.isPending}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={insumo.nombre}
          onChange={(e) => setInsumo({ ...insumo, nombre: e.target.value })}
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={insumo.descripcion}
          onChange={(e) => setInsumo({ ...insumo, descripcion: e.target.value })}
        />
        <ReuInput
          label="Cantidad"
          placeholder="Ingrese la cantidad"
          type="number"
          value={insumo.cantidad.toString()}
          onChange={(e) =>
            setInsumo({ ...insumo, cantidad: Number(e.target.value) })
          }
        />
        <ReuInput
          label="Unidad de Medida"
          placeholder="Ingrese la unidad de medida"
          type="text"
          value={insumo.unidad_medida}
          onChange={(e) => setInsumo({ ...insumo, unidad_medida: e.target.value })}
        />
        <ReuInput
          label="Tipo de Empacado"
          placeholder="Ingrese el tipo de empacado"
          type="text"
          value={insumo.tipo_empacado || ""}
          onChange={(e) => setInsumo({ ...insumo, tipo_empacado: e.target.value || null })}
        />
        <ReuInput
          label="Fecha de Registro"
          type="datetime-local"
          value={insumo.fecha_registro.slice(0, 16)}
          onChange={(e) => setInsumo({ ...insumo, fecha_registro: new Date(e.target.value).toISOString() })}
        />
        <ReuInput
          label="Fecha de Caducidad"
          type="date"
          value={insumo.fecha_caducidad || ""}
          onChange={(e) => setInsumo({ ...insumo, fecha_caducidad: e.target.value || null })}
        />
        <ReuInput
          label="Fecha de Actualización"
          type="datetime-local"
          value={insumo.fecha_actualizacion.slice(0, 16)}
          onChange={(e) => setInsumo({ ...insumo, fecha_actualizacion: new Date(e.target.value).toISOString() })}
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={insumo.activo}
            onChange={(e) => setInsumo({ ...insumo, activo: e.target.checked })}
            className="mr-2 h-5 w-5 text-green-500 border-gray-300 rounded"
          />
          <label className="text-gray-700 text-sm font-medium">Activo</label>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            onClick={() => navigate("/inventario/listarinsumos/")}
          >
            Listar Insumos
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default InsumoPage;