import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { usePreciosProductos, useActualizarPrecioProducto, useEliminarPrecioProducto, useUnidadesMedida, useCrearUnidadMedida } from "@/hooks/inventario/usePrecio_Producto";
import { useCosechas } from "@/hooks/cultivo/usecosecha";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from "lucide-react";
import { PrecioProducto, UnidadMedida } from "@/types/inventario/Precio_producto";

const formatCOPNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
    if (isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseCOPNumber = (value: string): number => {
    return parseFloat(value.replace(/\./g, '')) || 0;
};

const ListaPrecioProductoPage: React.FC = () => {
    const [selectedPrecioProducto, setSelectedPrecioProducto] =
        useState<PrecioProducto | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUnidadModalOpen, setIsUnidadModalOpen] = useState(false);
    const [nuevaUnidad, setNuevaUnidad] = useState<
        Omit<UnidadMedida, "id" | "fecha_creacion" | "creada_por_usuario">
    >({
        nombre: "",
        descripcion: "",
    });

    const { data: preciosProductos, isLoading, refetch } = usePreciosProductos();
    const { data: cosechas } = useCosechas();
    const { data: unidadesMedida, isLoading: isLoadingUnidades } =
        useUnidadesMedida();
    const actualizarMutation = useActualizarPrecioProducto();
    const eliminarMutation = useEliminarPrecioProducto();
    const crearUnidadMedida = useCrearUnidadMedida();
    const navigate = useNavigate();

    const columns = [
        { name: "Cosecha", uid: "cosecha" },
        { name: "Unidad de Medida", uid: "unidad_medida" },
        { name: "Precio", uid: "precio" },
        { name: "Fecha Registro", uid: "fecha_registro" },
        { name: "Stock", uid: "stock" },
        { name: "Fecha Caducidad", uid: "fecha_caducidad" },
        { name: "Acciones", uid: "acciones" },
    ];

    const transformedData = (preciosProductos ?? []).map((precioProducto) => {
        const nombreProducto = precioProducto.cosecha_id || "Sin nombre";
        return {
            id: precioProducto.id.toString(),
            cosecha: nombreProducto, 
            unidad_medida: precioProducto.unidad_medida_id

                ? precioProducto.unidad_medida_id.id
                : "Sin asignar",
            precio: formatCOPNumber(precioProducto.precio),
            fecha_registro: precioProducto.fecha_registro,
            stock: formatCOPNumber(precioProducto.stock),
            fecha_caducidad: precioProducto.fecha_caducidad || "No especificada",
            acciones: (
                <>
                    <button
                        className="text-green-500 hover:underline mr-2"
                        onClick={() => {
                            setSelectedPrecioProducto({ ...precioProducto });
                            setIsEditModalOpen(true);
                        }}
                    >
                        <EditIcon size={22} color="black" />
                    </button>
                    <button
                        className="text-red-500 hover:underline mr-2"
                        onClick={() => {
                            setSelectedPrecioProducto(precioProducto);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        <Trash2 size={22} color="red" />
                    </button>
                </>
                ),
            };
        });


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
            <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
                Lista de Precios de Productos Registrados
            </h2>
            <br />
            <br />
            <div className="mb-2 flex justify-start gap-4">
                <button
                    className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => navigate("/inventario/preciosproductos/")}
                >
                    + Registrar
                </button>
            </div>

            {isLoading ? (
                <p className="text-gray-600">Cargando...</p>
            ) : (
                <Tabla columns={columns} data={transformedData} />
            )}

            <ReuModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title="Editar Precio de Producto"
                onConfirm={() => {
                    if (
                        selectedPrecioProducto &&
                        selectedPrecioProducto.id !== undefined
                    ) {
                        actualizarMutation.mutate(
                            {
                                id: selectedPrecioProducto.id,
                                precioProducto: selectedPrecioProducto,
                            },
                            {
                                onSuccess: () => {
                                    setIsEditModalOpen(false);
                                    refetch();
                                },
                            }
                        );
                    }
                }}
            >
                {selectedPrecioProducto && (
                    <>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cosecha
                                </label>
                                <select
                                    value={selectedPrecioProducto.cosecha ?? ""}
                                    onChange={(e) =>
                                        setSelectedPrecioProducto({
                                            ...selectedPrecioProducto,
                                            cosecha: e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccione una cosecha</option>
                                    {cosechas?.map((cosecha) => (
                                        <option
                                            key={cosecha.id}
                                            value={cosecha.id}
                                        >
                                            {`Cosecha ${cosecha.cultivo_nombre} - ${cosecha.fecha}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unidad de Medida
                                </label>
                                <select
                                    value={
                                        selectedPrecioProducto.unidad_medida
                                            ?.id ?? ""
                                    }
                                    onChange={(e) =>
                                        setSelectedPrecioProducto({
                                            ...selectedPrecioProducto,
                                            unidad_medida:
                                                unidadesMedida?.find(
                                                    (u) =>
                                                        u.id ===
                                                        Number(e.target.value)
                                                ) || null,
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                    disabled={isLoadingUnidades}
                                >
                                    <option value="">
                                        Seleccione una unidad
                                    </option>
                                    {unidadesMedida?.map((unidad) => (
                                        <option
                                            key={unidad.id}
                                            value={unidad.id}
                                        >
                                            {unidad.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUnidadModalOpen(true)}
                                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Nueva Unidad
                            </button>
                        </div>
                        <ReuInput
                            label="Precio"
                            placeholder="Ingrese el precio"
                            type="text"
                            variant="bordered"
                            radius="md"
                            value={formatCOPNumber(selectedPrecioProducto.precio)}
                            onChange={(e) =>
                                setSelectedPrecioProducto({
                                    ...selectedPrecioProducto,
                                    precio: parseCOPNumber(e.target.value),
                                })
                            }
                        />
                        <ReuInput
                            label="Fecha de Registro"
                            type="date"
                            variant="bordered"
                            radius="md"
                            value={selectedPrecioProducto.fecha_registro}
                            onChange={(e) =>
                                setSelectedPrecioProducto({
                                    ...selectedPrecioProducto,
                                    fecha_registro: e.target.value,
                                })
                            }
                        />
                        <ReuInput
                            label="Stock"
                            placeholder="Ingrese el stock"
                            type="text"
                            variant="bordered"
                            radius="md"
                            value={formatCOPNumber(selectedPrecioProducto.stock)}
                            onChange={(e) =>
                                setSelectedPrecioProducto({
                                    ...selectedPrecioProducto,
                                    stock: parseCOPNumber(e.target.value),
                                })
                            }
                        />
                        <ReuInput
                            label="Fecha de Caducidad"
                            type="date"
                            variant="bordered"
                            radius="md"
                            value={formatDate(
                                selectedPrecioProducto.fecha_caducidad
                            )}
                            onChange={(e) =>
                                setSelectedPrecioProducto({
                                    ...selectedPrecioProducto,
                                    fecha_caducidad: e.target.value || null,
                                })
                            }
                        />
                    </>
                )}
            </ReuModal>

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
                    value={nuevaUnidad.descripcion ?? ""}
                    onChange={(e) =>
                        setNuevaUnidad({
                            ...nuevaUnidad,
                            descripcion: e.target.value,
                        })
                    }
                />
            </ReuModal>

            <ReuModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="¿Estás seguro de eliminar este precio de producto?"
                onConfirm={() => {
                    if (
                        selectedPrecioProducto &&
                        selectedPrecioProducto.id !== undefined
                    ) {
                        eliminarMutation.mutate(selectedPrecioProducto.id, {
                            onSuccess: () => {
                                setIsDeleteModalOpen(false);
                                setSelectedPrecioProducto(null);
                                refetch();
                            },
                        });
                    }
                }}
            >
                <p>Esta acción es irreversible.</p>
            </ReuModal>
        </DefaultLayout>
    );
};

export default ListaPrecioProductoPage;