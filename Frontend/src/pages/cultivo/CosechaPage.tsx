import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarCosecha } from "@/hooks/cultivo/usecosecha";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { useNavigate } from "react-router-dom";
import Formulario from "@/components/globales/Formulario";
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { Plus } from 'lucide-react';
import { ModalUnidadMedida } from "@/components/cultivo/ModalUnidadMedida";
import { ModalCultivo } from "@/components/cultivo/ModalCultivo";

const CosechaPage: React.FC = () => {

    const [cosecha, setCosecha] = useState({
        id_cultivo: 0,
        cantidad: 0,
        unidades_de_medida: 0,
        fecha: "",
    });

    const mutation = useRegistrarCosecha();
    const { data: cultivos } = useCultivos();
    const navigate = useNavigate();
    const { data: unidadesMedida, isLoading: loadingUnidadesMedida } = useUnidadesMedida();
    const [openUnidadesMedidaModal, setOpenUnidadesMedidaModal] = useState(false);
    const [openCultivoModal, setOpenCultivoModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCosecha((prev) => ({
            ...prev,
            [name]: name === "unidades_de_medida" || name === "fecha" ? value : Number(value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(cosecha);
    };

    return (
        <DefaultLayout>
               <ModalCultivo 
                    isOpen={openCultivoModal}
                    onOpenChange={setOpenCultivoModal}
                 />
            
            <Formulario title="Registrar Cosecha"
            onSubmit={handleSubmit}
            >

            <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Cultivo</label>
                             <button 
                                    className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    onClick={() => setOpenCultivoModal(true)}
                                    type="button"
                                >
                                <Plus className="h-4 w-4" />
                              </button>
                     </div>
                    <select
                        name="id_cultivo"
                        value={cosecha.id_cultivo || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="">Seleccione un cultivo</option>
                        {cultivos?.map((cultivo) => (
                        <option key={cultivo.id} value={cultivo.id}>
                            {cultivo.nombre}
                        </option>
                        ))}
                    </select>
                    </div>

                        <ReuInput
                            label="Cantidad"
                            type="number"
                            value={cosecha.cantidad}
                            onChange={(e) => setCosecha({ ...cosecha, cantidad: Number(e.target.value) })}
                        />

                    <ModalUnidadMedida 
                            isOpen={openUnidadesMedidaModal} 
                            onOpenChange={setOpenUnidadesMedidaModal} 
                        />
                        <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                                            <button 
                                                className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                onClick={() => setOpenUnidadesMedidaModal(true)}
                                                type="button"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <select
                                            value={cosecha.unidades_de_medida}
                                            onChange={(e) => setCosecha({ ...cosecha, unidades_de_medida: Number(e.target.value)})}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                            disabled={loadingUnidadesMedida}
                                        >
                                            <option value="">Seleccione una unidad</option>
                                            {unidadesMedida?.map((unidad) => (
                                                <option key={unidad.id} value={unidad.id}>
                                                    {unidad.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                        <ReuInput
                            label="Fecha de recolección"
                            type="date"
                            value={cosecha.fecha}
                            onChange={(e) => setCosecha({ ...cosecha, fecha: e.target.value })}
                        />

                      

                            <div className="col-span-1 md:col-span-2 flex justify-center">
                            <button
                                className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
                                type="button"
                                onClick={() => navigate("/cultivo/listarcosechas/")}
                            >
                                Listar cosechas
                            </button>
                            </div>

            </Formulario>
           
        </DefaultLayout>
    );
};

export default CosechaPage;