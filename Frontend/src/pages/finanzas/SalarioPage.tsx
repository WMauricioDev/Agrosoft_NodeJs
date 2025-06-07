import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Salario } from "@/types/finanzas/Salario";
import { useRegistrarSalario } from "@/hooks/finanzas/useSalario";
import Formulario from "@/components/globales/Formulario";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";

const SalarioPage: React.FC = () => {
  const [salario, setSalario] = useState<Salario>({
    id: 0,
    rol_id: 0,
    fecha_de_implementacion: "",
    valorJornal: 0,
    activo: true
  });

  const [displayValue, setDisplayValue] = useState(""); 
  const { roles } = useUsuarios(); 
  const mutation = useRegistrarSalario();
  const navigate = useNavigate();

  const formatColombianNumber = (value: string): string => {
    const numStr = value.replace(/[^\d]/g, '');
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseColombianNumber = (value: string): number => {
    return parseFloat(value.replace(/\./g, '')) || 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "valorJornal") {
      const formattedValue = formatColombianNumber(value);
      setDisplayValue(formattedValue);
      setSalario(prev => ({
        ...prev,
        valorJornal: parseColombianNumber(formattedValue)
      }));
    } else {
      setSalario(prev => ({
        ...prev,
        [name]: name === "rol_id" ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(salario, {
      onSuccess: () => {
        setSalario({ 
          id: 0, 
          rol_id: 0,
          fecha_de_implementacion: "", 
          valorJornal: 0,
          activo: true
        });
        setDisplayValue("");
        navigate("/finanzas/listarsalarios/");
      },
    });
  };

return (
  <DefaultLayout>
    <Formulario
      title="Registrar Salario por Rol"
      onSubmit={handleSubmit}
      buttonText="Guardar"
      isSubmitting={mutation.isPending}
    >
      {/* Campo Rol */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
          value={salario.rol_id}
          onChange={(e) =>
            setSalario({ ...salario, rol_id: parseInt(e.target.value) })
          }
        >
          {roles?.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.rol}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Implementación
        </label>
        <input
          type="date"
          name="fecha_de_implementacion"
          value={salario.fecha_de_implementacion}
          onChange={handleChange}
          className="w-full h-10 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor Jornal
        </label>
        <input
          type="text"
          name="valorJornal"
          value={displayValue}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
          placeholder="Ej: 85.500"
          inputMode="numeric"
          pattern="^[\d.]*$"
          required
        />
      </div>

        <div className="col-span-1 md:col-span-2 flex justify-center">
        <button
          type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
          onClick={() => navigate("/finanzas/listarsalarios/")}
        >
          Ver Listado de Salarios
        </button>
      </div>
    </Formulario>
  </DefaultLayout>
);

};

export default SalarioPage;