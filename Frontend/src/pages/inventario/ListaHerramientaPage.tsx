import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useHerramientas, useActualizarHerramienta, useEliminarHerramienta } from "@/hooks/inventario/useHerramientas";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from "lucide-react";
import { Herramienta } from "@/types/inventario/Herramientas";
import { Switch } from "@heroui/react";

const ListaHerramientaPage: React.FC = () => {
    const [selectedHerramienta, setSelectedHerramienta] = useState<Herramienta | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: herramientas, isLoading, refetch } = useHerramientas();
    const actualizarMutation = useActualizarHerramienta();
    const eliminarMutation = useEliminarHerramienta();
    const navigate = useNavigate();

    const columns = [
        { name: "Nombre", uid: "nombre" },
        { name: "Descripción", uid: "descripcion" },
        { name: "Cantidad", uid: "cantidad" },
        { name: "Estado", uid: "estado" },
        { name: "Activo", uid: "activo" },
        { name: "Fecha Registro", uid: "fecha_registro" },
        { name: "Precio", uid: "precio" },
        { name: "Acciones", uid: "acciones" },
    ];

    const handleEdit = (herramienta: Herramienta) => {
        setSelectedHerramienta({ ...herramienta });
        setIsEditModalOpen(true);
    };

    const handleDelete = (herramienta: Herramienta) => {
        setSelectedHerramienta(herramienta);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedHerramienta && selectedHerramienta.id !== undefined) {
            eliminarMutation.mutate(selectedHerramienta.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedHerramienta(null);
                    refetch();
                },
            });
        }
    };

    const formatPrice = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        return numericValue ? Number(numericValue) : 0;
    };

    const totalValor = (herramientas ?? []).reduce((sum, herramienta) => {
        return sum + herramienta.cantidad * herramienta.precio;
    }, 0);

    const transformedData = [
        ...(herramientas ?? []).map((herramienta) => ({
            id: herramienta.id?.toString() || "",
            nombre: herramienta.nombre,
            descripcion: herramienta.descripcion,
            cantidad: herramienta.cantidad,
            estado: herramienta.estado,
            activo: herramienta.activo ? "Sí" : "No",
            fecha_registro: new Date(herramienta.fecha_registro).toISOString().split("T")[0],
            precio: `$${Number(herramienta.precio).toLocaleString("es-CO")}`,
            acciones: (
                <>
                    <button className="text-green-500 hover:underline mr-2" onClick={() => handleEdit(herramienta)}>
                        <EditIcon size={22} color="black" />
                    </button>
                    <button className="text-red-500 hover:underline" onClick={() => handleDelete(herramienta)}>
                        <Trash2 size={22} color="red" />
                    </button>
                </>
            ),
        })),
        {
            id: "total",
            nombre: "Total",
            descripcion: "",
            cantidad: "",
            estado: "",
            activo: "",
            fecha_registro: "",
            precio: `$${totalValor.toLocaleString("es-CO")}`,
            acciones: "",
        },
    ];

    return (
        <DefaultLayout>
            <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Herramientas Registradas</h2>
            <br /><br />
            <div className="mb-2 flex justify-start">
                <button
                    className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg
                                hover:bg-green-700 transition-all duration-300 ease-in-out
                                shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => navigate("/inventario/herramientas/")}
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
                title="Editar Herramienta"
                onConfirm={() => {
                    if (selectedHerramienta && selectedHerramienta.id !== undefined) {
                        actualizarMutation.mutate({ id: selectedHerramienta.id, herramienta: selectedHerramienta }, {
                            onSuccess: () => {
                                setIsEditModalOpen(false);
                                refetch();
                            },
                        });
                    }
                }}
            >
                {selectedHerramienta && (
                    <>
                        <ReuInput
                            label="Nombre"
                            placeholder="Ingrese el nombre"
                            type="text"
                            value={selectedHerramienta.nombre}
                            onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, nombre: e.target.value })}
                        />
                        <ReuInput
                            label="Descripción"
                            placeholder="Ingrese la descripción"
                            type="text"
                            value={selectedHerramienta.descripcion}
                            onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, descripcion: e.target.value })}
                        />
                        <ReuInput
                            label="Cantidad"
                            placeholder="Ingrese la cantidad"
                            type="number"
                            value={selectedHerramienta.cantidad.toString()}
                            onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, cantidad: Number(e.target.value) })}
                        />
                        <ReuInput
                            label="Estado"
                            placeholder="Ingrese el estado"
                            type="text"
                            value={selectedHerramienta.estado}
                            onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, estado: e.target.value })}
                        />
                        <ReuInput
                            label="Precio (COP)"
                            placeholder="Ingrese el precio"
                            type="text"
                            value={selectedHerramienta.precio.toLocaleString("es-CO")}
                            onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, precio: formatPrice(e.target.value) })}
                        />
                         <div className="flex items-center">
                            <Switch
                                color="success"
                                size="sm"
                                isSelected={selectedHerramienta.activo}
                                onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, activo: e.target.checked })}
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">Activo</label>
                         </div>
                    </>
                )}
            </ReuModal>

            <ReuModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="¿Estás seguro de eliminar esta herramienta?"
                onConfirm={handleConfirmDelete}
            >
                <p>Esta acción es irreversible.</p>
            </ReuModal>
        </DefaultLayout>
    );
};

export default ListaHerramientaPage;