import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useSalario } from "@/hooks/finanzas/useSalario";
import { ReuInput } from "@/components/globales/ReuInput";
import { Salario } from "@/types/finanzas/Salario";

const SalarioPage: React.FC = () => {
  const [salario, setSalario] = useState<Salario>({
    salario_base: 0,
    valor_por_hora: 0,
  });

  const { registrarSalario, isRegistrando } = useSalario();
  const navigate = useNavigate();

  const handleChange = (field: keyof Salario) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setSalario((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center min-h-screen p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Registro de Salario</h2>

          <ReuInput
            label="Salario Base"
            placeholder="Ingrese el salario base"
            type="number"
            value={salario.salario_base}
            onChange={handleChange("salario_base")}
          />
          <ReuInput
            label="Valor por Hora"
            placeholder="Ingrese el valor por hora"
            type="number"
            value={salario.valor_por_hora}
            onChange={handleChange("valor_por_hora")}
          />

          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
            type="submit"
            disabled={isRegistrando}
            onClick={(e) => {
              e.preventDefault();
              registrarSalario(salario, {
                onSuccess: () => {
                  setSalario({
                    salario_base: 0,
                    valor_por_hora: 0,
                  });
                },
              });
            }}
          >
            {isRegistrando ? "Registrando..." : "Guardar"}
          </button>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={() => navigate("/finanzas/listarsalarios/")}
          >
            Listar Salarios
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SalarioPage;