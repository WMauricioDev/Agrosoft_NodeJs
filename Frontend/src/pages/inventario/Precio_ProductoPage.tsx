import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DefaultLayout from "@/layouts/default";
import { useRegistrarPrecioProducto, useUnidadesMedida, useCrearUnidadMedida } from "@/hooks/inventario/usePrecio_Producto";
import { useCosechas } from "@/hooks/cultivo/usecosecha";
import { ReuInput } from "@/components/globales/ReuInput";
import Formulario from "@/components/globales/Formulario";
import ReuModal from "@/components/globales/ReuModal";
import { ModalCosecha } from "@/components/cultivo/ModalCosecha";
import { PrecioProducto, UnidadMedida } from "@/types/inventario/Precio_producto";
import { addToast } from "@heroui/react";
import { Plus, Info } from 'lucide-react';

const formatCOPNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseInt(value.replace(/\./g, ''), 10) : value;
    if (isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseCOPNumber = (value: string): number => {
    const cleanValue = value.replace(/\./g, '');
    return parseInt(cleanValue, 10) || 0;
};

const PrecioProductoPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: cosechas } = useCosechas();
    const { data: unidadesMedida, isLoading: isLoadingUnidades } = useUnidadesMedida();
    const registrarPrecioProducto = useRegistrarPrecioProducto();
    const crearUnidadMedida = useCrearUnidadMedida();

    const [precioProducto, setPrecioProducto] = useState<
        Omit<PrecioProducto, "id" | "unidad_medida"> & { unidad_medida_id?: number }
    >({
        cosecha: 0,
        nombre_cultivo: "",
        precio: 0,
        fecha_registro: new Date().toISOString().slice(0, 10),
        stock: 0,
        fecha_caducidad: null,
        unidad_medida_id: undefined,
    });

    const [nuevaUnidad, setNuevaUnidad] = useState<
        Omit<UnidadMedida, "id" | "fecha_creacion" | "creada_por_usuario">
    >({
        nombre: "",
        descripcion: "",
    });
    const [isUnidadModalOpen, setIsUnidadModalOpen] = useState(false);
    const [isCosechaModalOpen, setIsCosechaModalOpen] = useState(false);

    const handleSubmitPrecioProducto = (e: React.FormEvent) => {
        e.preventDefault();
        if (!precioProducto.cosecha) {
            addToast({
                title: "Error",
                description: "Seleccione una cosecha válida",
                timeout: 3000,
            });
            return;
        }
        registrarPrecioProducto.mutate(precioProducto, {
            onSuccess: () => {
                setPrecioProducto({
                    cosecha: 0,
                    nombre_cultivo: "",
                    precio: 0,
                    fecha_registro: new Date().toISOString().slice(0, 10),
                    stock: 0,
                    fecha_caducidad: null,
                    unidad_medida_id: undefined,
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
        });
    };

    const formatDate = (date: string | null) => {
        return date || "";
    };

    return (
        <DefaultLayout>
            <Formulario
                title="Registro de Precio de Producto"
                onSubmit={handleSubmitPrecioProducto}
                buttonText="Guardar"
                isSubmitting={registrarPrecioProducto.isPending}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Cosecha</label>
                        <button 
                            className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={() => setIsCosechaModalOpen(true)}
                            type="button"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <select
                        value={precioProducto.cosecha || ""}
                        onChange={(e) =>
                            setPrecioProducto({
                                ...precioProducto,
                                cosecha: Number(e.target.value),
                            })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Seleccione una cosecha</option>
                        {cosechas?.map((cosecha) => (
                            <option key={cosecha.id} value={cosecha.id}>
                                {`Cosecha ${cosecha.id_cultivo} ${cosecha.cultivo_nombre} - ${cosecha.fecha}`}
                            </option>
                        ))}
                    </select>
                </div>
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
                        value={precioProducto.unidad_medida_id || ""}
                        onChange={(e) =>
                            setPrecioProducto({
                                ...precioProducto,
                                unidad_medida_id: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
                    <ReuInput
                        label="Precio Producto (COP)"
                        placeholder="Ej. 1.000"
                        type="text"
                        variant="bordered"
                        radius="md"
                        value={formatCOPNumber(precioProducto.precio)}
                        onChange={(e) =>
                            setPrecioProducto({
                                ...precioProducto,
                                precio: parseCOPNumber(e.target.value),
                            })
                        }
                    />
                    {precioProducto.cosecha !== 0 && (
                        <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md p-2 shadow-sm">
                            <Info className="h-4 w-4 text-blue-500" />
                            <p className="text-sm text-gray-600">
                                Sugerencia: El precio no debe ser menor al costo de producción. Asegúrese de establecer un valor competitivo.
                            </p>
                        </div>
                    )}
                </div>
                <ReuInput
                    label="Fecha de Registro"
                    type="date"
                    variant="bordered"
                    radius="md"
                    value={precioProducto.fecha_registro}
                    onChange={(e) =>
                        setPrecioProducto({
                            ...precioProducto,
                            fecha_registro: e.target.value,
                        })
                    }
                />
                <ReuInput
                    label="Stock"
                    placeholder="Ingrese el stock inicial"
                    type="number"
                    variant="bordered"
                    radius="md"
                    value={precioProducto.stock.toString()}
                    onChange={(e) =>
                        setPrecioProducto({
                            ...precioProducto,
                            stock: Number(e.target.value),
                        })
                    }
                />
                <ReuInput
                    label="Fecha de Caducidad"
                    type="date"
                    variant="bordered"
                    radius="md"
                    value={formatDate(precioProducto.fecha_caducidad)}
                    onChange={(e) =>
                        setPrecioProducto({
                            ...precioProducto,
                            fecha_caducidad: e.target.value || null,
                        })
                    }
                />
                <div className="col-span-1 md:col-span-2 flex justify-center">
                    <button
                        type="button"
                        className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
                        onClick={() => navigate("/inventario/listarpreciosproductos/")}
                    >
                        Listar Precios de Productos
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
                    onChange={(e) =>
                        setNuevaUnidad({ ...nuevaUnidad, nombre: e.target.value })
                    }
                />
                <ReuInput
                    label="Descripción"
                    placeholder="Descripción de la unidad"
                    type="text"
                    variant="bordered"
                    radius="md"
                    value={nuevaUnidad.descripcion || ""}
                    onChange={(e) =>
                        setNuevaUnidad({
                            ...nuevaUnidad,
                            descripcion: e.target.value,
                        })
                    }
                />
            </ReuModal>

            <ModalCosecha
                isOpen={isCosechaModalOpen}
                onOpenChange={setIsCosechaModalOpen}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["cosechas"] })}
            />
        </DefaultLayout>
    );
};

export default PrecioProductoPage;