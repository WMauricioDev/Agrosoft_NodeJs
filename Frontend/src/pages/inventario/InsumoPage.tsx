import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarInsumo, useUnidadesMedida, useCrearUnidadMedida, useTiposInsumo, useCrearTipoInsumo } from "@/hooks/inventario/useInsumo";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";
import ReuModal from "@/components/globales/ReuModal";
import { Insumo, UnidadMedida, TipoInsumo } from "@/types/inventario/Insumo";
import { useAuth } from "@/context/AuthContext";
import { Plus } from 'lucide-react';
import { Switch } from "@heroui/react";

const InsumoPage: React.FC = () => {
    const {} = useAuth();
    const navigate = useNavigate();
    const { data: unidadesMedida, isLoading: isLoadingUnidades } = useUnidadesMedida();
    const { data: tiposInsumo, isLoading: isLoadingTipos } = useTiposInsumo();
    const registrarInsumo = useRegistrarInsumo();
    const crearUnidadMedida = useCrearUnidadMedida();
    const crearTipoInsumo = useCrearTipoInsumo();

    const [insumo, setInsumo] = useState<Omit<Insumo, "id" | "unidad_medida" | "tipo_insumo"> & { unidad_medida_id?: number; tipo_insumo_id?: number }>({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        activo: true,
        tipo_empacado: null,
        fecha_registro: new Date().toISOString(),
        fecha_caducidad: null,
        precio_insumo: 0,
        unidad_medida_id: undefined,
        tipo_insumo_id: undefined,
    });

    const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? Number(numericValue) : 0;
    };

    const [nuevaUnidad, setNuevaUnidad] = useState<Omit<UnidadMedida, "id" | "fecha_creacion" | "creada_por_usuario">>({
        nombre: "",
        descripcion: "",
    });

    const [nuevoTipo, setNuevoTipo] = useState<Omit<TipoInsumo, "id" | "fecha_creacion" | "creada_por_usuario">>({
        nombre: "",
        descripcion: "",
    });

    const [isUnidadModalOpen, setIsUnidadModalOpen] = useState(false);
    const [isTipoModalOpen, setIsTipoModalOpen] = useState(false);

    const handleSubmitInsumo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        registrarInsumo.mutate(insumo, {
            onSuccess: () => {
                setInsumo({
                    nombre: "",
                    descripcion: "",
                    cantidad: 0,
                    activo: true,
                    tipo_empacado: null,
                    fecha_registro: new Date().toISOString(),
                    fecha_caducidad: null,
                    precio_insumo: 0,
                    unidad_medida_id: undefined,
                    tipo_insumo_id: undefined,
                });
            },
        });
    };

    const handleSubmitUnidadMedida = () => {
        crearUnidadMedida.mutate(nuevaUnidad, {
            onSuccess: () => {
                setIsUnidadModalOpen(false);
                setNuevaUnidad({ nombre: "", descripcion: "" });
            },
            onError: () => {
            },
        });
    };

    const handleSubmitTipoInsumo = () => {
        crearTipoInsumo.mutate(nuevoTipo, {
            onSuccess: () => {
                setIsTipoModalOpen(false);
                setNuevoTipo({ nombre: "", descripcion: "" });
            },
            onError: () => {
            },
        });
    };

    const formatDateTimeLocal = (isoString: string) => {
        return isoString.slice(0, 16);
    };

    const formatDate = (date: string | null) => {
        return date || "";
    };

    return (
        <DefaultLayout>
            <Formulario
                title="Registro de Insumo"
                onSubmit={handleSubmitInsumo}
                buttonText="Guardar"
                isSubmitting={registrarInsumo.isPending}
            >
                <ReuInput
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={insumo.nombre}
                    onChange={(e) => setInsumo({ ...insumo, nombre: e.target.value })}
                />
                <ReuInput
                    label="Descripción"
                    placeholder="Ingrese la descripción"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={insumo.descripcion}
                    onChange={(e) => setInsumo({ ...insumo, descripcion: e.target.value })}
                />
                <ReuInput
                    label="Cantidad"
                    placeholder="Ingrese la cantidad"
                    type="number"
                    variant="bordered"
                    radius="md"
                    value={insumo.cantidad}
                    onChange={(e) => setInsumo({ ...insumo, cantidad: Number(e.target.value) })}
                />
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setIsUnidadModalOpen(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <select
                        value={insumo.unidad_medida_id || ""}
                        onChange={(e) => setInsumo({ ...insumo, unidad_medida_id: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled.opacity-50"
                        disabled={isLoadingUnidades}
                    >
                        <option value="">Seleccione una unidad</option>
                        {unidadesMedida?.map((unidad) => (
                            <option key={unidad.id} value={unidad.id}>
                                {unidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Tipo de Insumo</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setIsTipoModalOpen(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <select
                        value={insumo.tipo_insumo_id || ""}
                        onChange={(e) => setInsumo({ ...insumo, tipo_insumo_id: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled.opacity-50"
                        disabled={isLoadingTipos}
                    >
                        <option value="">Seleccione un tipo</option>
                        {tiposInsumo?.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <Switch
                        color="success"
                        size="sm"
                        isSelected={insumo.activo}
                        onChange={(e) => setInsumo({ ...insumo, activo: e.target.checked })}
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">Activo</label>
                </div>
                <ReuInput
                    label="Tipo de Empacado"
                    placeholder="Ingrese el tipo de empacado"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={insumo.tipo_empacado || ""}
                    onChange={(e) => setInsumo({ ...insumo, tipo_empacado: e.target.value || null })}
                />
                <ReuInput
                    label="Fecha de Registro"
                    type="datetime-local"
                    variant="bordered"
                    radius="md"
                    value={formatDateTimeLocal(insumo.fecha_registro)}
                    onChange={(e) => setInsumo({ ...insumo, fecha_registro: new Date(e.target.value).toISOString() })}
                />
                <ReuInput
                    label="Fecha de Caducidad"
                    type="date"
                    variant="bordered"
                    radius="md"
                    value={formatDate(insumo.fecha_caducidad)}
                    onChange={(e) => setInsumo({ ...insumo, fecha_caducidad: e.target.value || null })}
                />
                <ReuInput
                    label="Precio del Insumo (COP)"
                    placeholder="Ingrese el precio"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={insumo.precio_insumo.toLocaleString("es-CO")}
                    onChange={(e) => setInsumo({ ...insumo, precio_insumo: formatPrice(e.target.value) })}
                />
                <div className="col-span-1 sm:col-span-2 flex justify-center">
                    <button
                        type="button"
                        onClick={() => navigate("/inventario/listarinsumos/")}
                        className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                    >
                        Listar Insumos
                    </button>
                </div>
            </Formulario>

            <ReuModal
                isOpen={isUnidadModalOpen}
                onOpenChange={setIsUnidadModalOpen}
                title="Crear Nueva Unidad de Medida"
                onConfirm={handleSubmitUnidadMedida}
            >
                <ReuInput
                    label="Nombre"
                    placeholder="Ej. kg, L"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={nuevaUnidad.nombre}
                    onChange={(e) => setNuevaUnidad({ ...nuevaUnidad, nombre: e.target.value })}
                />
                <ReuInput
                    label="Descripción"
                    placeholder="Descripción de la unidad"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={nuevaUnidad.descripcion || ""}
                    onChange={(e) => setNuevaUnidad({ ...nuevaUnidad, descripcion: e.target.value })}
                />
            </ReuModal>

            <ReuModal
                isOpen={isTipoModalOpen}
                onOpenChange={setIsTipoModalOpen}
                title="Crear Nuevo Tipo de Insumo"
                onConfirm={handleSubmitTipoInsumo}
            >
                <ReuInput
                    label="Nombre"
                    placeholder="Ej. Fertilizante"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={nuevoTipo.nombre}
                    onChange={(e) => setNuevoTipo({ ...nuevoTipo, nombre: e.target.value })}
                />
                <ReuInput
                    label="Descripción"
                    placeholder="Descripción del tipo"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={nuevoTipo.descripcion || ""}
                    onChange={(e) => setNuevoTipo({ ...nuevoTipo, descripcion: e.target.value })}
                />
            </ReuModal>
        </DefaultLayout>
    );
};

export default InsumoPage;