import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarCultivo } from "@/hooks/cultivo/useCultivo";
import { useEspecies } from "@/hooks/cultivo/useEspecie";
import { useBancales } from "@/hooks/cultivo/usebancal";
import { useNavigate } from "react-router-dom";

const CultivoPage: React.FC = () => {
    const [cultivo, setCultivo] = useState({
        nombre: "",
        unidad_de_medida: "",
        activo: false,
        fechaSiembra: "",
        Especie: 0,
        Bancal: 0, 
    });

    const mutation = useRegistrarCultivo();
    const { data: especies } = useEspecies();
    const { data: bancales } = useBancales();
    const navigate = useNavigate()

  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setCultivo((prev) => ({
            ...prev,
            [name]: name === "nombre" || name === "unidad_de_medida" || name === "fechaSiembra" ? value : Number(value),
        }));
    };

    return (
        <DefaultLayout>
            <div className="w-full flex flex-col items-center min-h-screen p-6">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Registro de Cultivo</h2>

                    <ReuInput
                        label="Nombre"
                        placeholder="Ingrese el nombre"
                        type="text"
                        value={cultivo.nombre}
                        onChange={(e) => setCultivo({ ...cultivo, nombre: e.target.value })}
                    />

                    <ReuInput
                        label="Unidad de Medida"
                        placeholder="Ej: kg, g, unidades"
                        type="text"
                        value={cultivo.unidad_de_medida}
                        onChange={(e) => setCultivo({ ...cultivo, unidad_de_medida: e.target.value })}
                    />

                    <ReuInput
                        label="Fecha de Siembra"
                        type="date"
                        value={cultivo.fechaSiembra}
                        onChange={(e) => setCultivo({ ...cultivo, fechaSiembra: e.target.value })}
                    />

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={cultivo.activo}
                            onChange={(e) => setCultivo({ ...cultivo, activo: e.target.checked })}
                            name="activo"
                        />
                        <span>Activo</span>
                    </label>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Especie</label>
                        <select
                            name="Especie"
                            value={cultivo.Especie || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccione una especie</option>
                            {especies?.map((especie) => (
                                <option key={especie.id} value={especie.id}>
                                    {especie.nombre}
                                </option>
                            ))}
                        </select>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Bancal</label>
                        <select
                            name="Bancal"
                            value={cultivo.Bancal || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccione un bancal</option>
                            {bancales?.map((bancal) => (
                                <option key={bancal.id} value={bancal.id}>
                                    {bancal.nombre}
                                </option>
                            ))}
                        </select>

                    <button
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg mt-4"
                        type="submit"
                        disabled={mutation.isPending}
                        onClick={(e) => {
                            e.preventDefault();
                            mutation.mutate(cultivo);
                        }}
                    >
                        {mutation.isPending ? "Registrando..." : "Guardar"}
                    </button>
                    <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700"
            onClick={() => navigate("/cultivo/listarcultivos/")}
          >
            Listar cultivos
          </button>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default CultivoPage;