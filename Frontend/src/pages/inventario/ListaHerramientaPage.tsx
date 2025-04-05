import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useHerramientas, useActualizarHerramienta, useEliminarHerramienta } from "@/hooks/inventario/useHerramientas";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import Tabla from "@/components/globales/Tabla";
import { EditIcon, Trash2 } from "lucide-react";

export interface Herramienta {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    estado: string;
    activo: boolean;
    fecha_registro: string;
}

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

    const transformedData = (herramientas ?? []).map((herramienta) => ({
        id: herramienta.id?.toString() || "",
        nombre: herramienta.nombre,
        descripcion: herramienta.descripcion,
        cantidad: herramienta.cantidad,
        estado: herramienta.estado,
        activo: herramienta.activo ? "Sí" : "No",
        fecha_registro: herramienta.fecha_registro, 
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
    }));

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
                        actualizarMutation.mutate(selectedHerramienta, {
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
                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedHerramienta.activo}
                                onChange={(e) => setSelectedHerramienta({ ...selectedHerramienta, activo: e.target.checked })}
                                className="mr-2 leading-tight"
                            />
                            <label className="text-gray-700 text-sm font-bold">Activo</label>
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