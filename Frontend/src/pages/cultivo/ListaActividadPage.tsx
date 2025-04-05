import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useActividades, useInsumos, useUsuarios, useActualizarActividad, useEliminarActividad } from "@/hooks/cultivo/useActividad";
import { useTipoActividad } from "@/hooks/cultivo/usetipoactividad";
import { useProgramaciones } from "@/hooks/cultivo/useProgramacion";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";
import ActividadNotifications from "@/components/cultivo/ActividadNotifications";
import { useAuth } from "@/context/AuthContext";
import { EditIcon, Trash2 } from 'lucide-react';

const ListaActividadPage: React.FC = () => {
    const { user } = useAuth();
    
    const [actividad, setActividad] = useState({
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_actividad: 0,
        programacion: 0,
        usuario: 0,
        cultivo: 0,
        insumo: 0,
        cantidadUsada: 0,
        estado: "PENDIENTE",
        prioridad: "MEDIA",
        instrucciones_adicionales: ""
    });

    const [selectedActividad, setSelectedActividad] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const actualizarMutation = useActualizarActividad();
    const eliminarMutation = useEliminarActividad();
    const { data: actividades, isLoading, refetch } = useActividades();
    const { data: tiposActividad } = useTipoActividad();
    const { data: programaciones } = useProgramaciones();
    const { data: usuarios } = useUsuarios();
    const { data: cultivos } = useCultivos();
    const { data: insumos } = useInsumos();
    const navigate = useNavigate();

    const columns = [
        { name: "Descripción", uid: "descripcion" },
        { name: "Fecha Inicio", uid: "fecha_inicio" },
        { name: "Fecha Fin", uid: "fecha_fin" },
        { name: "Estado", uid: "estado" },
        { name: "Prioridad", uid: "prioridad" },
        { name: "Tipo Actividad", uid: "tipo_actividad" },
        { name: "Usuario", uid: "usuario" },
        { name: "Cultivo", uid: "cultivo" },
        { name: "Acciones", uid: "acciones" },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'ALTA': return 'bg-red-100 text-red-800';
            case 'MEDIA': return 'bg-yellow-100 text-yellow-800';
            case 'BAJA': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETADA': return 'bg-green-100 text-green-800';
            case 'EN_PROCESO': return 'bg-blue-100 text-blue-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEdit = (actividad: any) => {
        setSelectedActividad(actividad);
        setActividad(actividad);
        setIsEditModalOpen(true);
    };

    const handleDelete = (actividad: any) => {
        setSelectedActividad(actividad);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedActividad && selectedActividad.id !== undefined) {
            eliminarMutation.mutate(selectedActividad.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    refetch();
                },
            });
        }
    };

    const transformedData = (actividades ?? []).map((actividad) => ({
        id: actividad.id?.toString() || '',
        descripcion: actividad.descripcion,
        fecha_inicio: new Date(actividad.fecha_inicio).toLocaleDateString(),
        fecha_fin: new Date(actividad.fecha_fin).toLocaleDateString(),
        estado: (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(actividad.estado)}`}>
                {actividad.estado}
            </span>
        ),
        prioridad: (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(actividad.prioridad)}`}>
                {actividad.prioridad}
            </span>
        ),
        tipo_actividad: tiposActividad?.find((tipo) => tipo.id === actividad.tipo_actividad)?.nombre || 'Sin tipo',
        usuario: usuarios?.find((user) => user.id === actividad.usuario)?.nombre || 'Sin usuario',
        cultivo: cultivos?.find((cult) => cult.id === actividad.cultivo)?.nombre || 'Sin cultivo',
        acciones: (
            <>
                <button
                    className="text-green-500 hover:underline mr-2"
                    onClick={() => handleEdit(actividad)}
                >
                    <EditIcon size={22} color='black'/>
                </button>
                <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(actividad)}
                >
                    <Trash2 size={22} color='red'/>
                </button>
            </>
        ),
    }));

    return (
        <DefaultLayout>
            <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Lista de Actividades</h2>
            <div className="mb-2 flex justify-between items-center">
                <button
                    className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                hover:bg-green-700 transition-all duration-300 ease-in-out 
                                shadow-md hover:shadow-lg transform hover:scale-105"
                    onClick={() => navigate('/cultivo/actividad/')} 
                >
                    + Registrar
                </button>
                <div className="flex space-x-2">
                    <span className="text-xs flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Alta
                    </span>
                    <span className="text-xs flex items-center">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Media
                    </span>
                    <span className="text-xs flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Baja
                    </span>
                </div>
            </div>
            {isLoading ? (
                <p className="text-gray-600">Cargando...</p>
            ) : (
                <>
                    <Tabla columns={columns} data={transformedData} />
                </>
            )}

            <ReuModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                title="Editar Actividad"
                size="lg"
                onConfirm={() => {
                    if (selectedActividad && selectedActividad.id !== undefined) {
                        actualizarMutation.mutate(
                            { id: selectedActividad.id, actividad },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <ReuInput
                            label="Descripción"
                            placeholder="Ingrese la descripción"
                            type="text"
                            value={actividad.descripcion}
                            onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <ReuInput
                            label="Fecha de Inicio"
                            type="datetime-local"
                            value={actividad.fecha_inicio}
                            onChange={(e) => setActividad({ ...actividad, fecha_inicio: e.target.value })}
                        />
                        <ReuInput
                            label="Fecha de Fin"
                            type="datetime-local"
                            value={actividad.fecha_fin}
                            onChange={(e) => setActividad({ ...actividad, fecha_fin: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            name="estado"
                            value={actividad.estado}
                            onChange={(e) => setActividad({ ...actividad, estado: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PROCESO">En proceso</option>
                            <option value="COMPLETADA">Completada</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                        <select
                            name="prioridad"
                            value={actividad.prioridad}
                            onChange={(e) => setActividad({ ...actividad, prioridad: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALTA">Alta</option>
                            <option value="MEDIA">Media</option>
                            <option value="BAJA">Baja</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Actividad</label>
                        <select
                            name="tipo_actividad"
                            value={actividad.tipo_actividad || 0}
                            onChange={(e) => setActividad({ ...actividad, tipo_actividad: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un tipo de actividad</option>
                            {tiposActividad?.map((tipo) => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <select
                            name="usuario"
                            value={actividad.usuario || 0}
                            onChange={(e) => setActividad({ ...actividad, usuario: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un usuario</option>
                            {usuarios?.map((user) => (
                                <option key={user.id} value={user.id}>{user.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cultivo</label>
                        <select
                            name="cultivo"
                            value={actividad.cultivo || 0}
                            onChange={(e) => setActividad({ ...actividad, cultivo: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un cultivo</option>
                            {cultivos?.map((cult) => (
                                <option key={cult.id} value={cult.id}>{cult.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Insumo</label>
                        <select
                            name="insumo"
                            value={actividad.insumo || 0}
                            onChange={(e) => setActividad({ ...actividad, insumo: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un insumo</option>
                            {insumos?.map((ins) => (
                                <option key={ins.id} value={ins.id}>{ins.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <ReuInput
                            label="Cantidad Usada"
                            type="number"
                            value={actividad.cantidadUsada}
                            onChange={(e) => setActividad({ ...actividad, cantidadUsada: Number(e.target.value) })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Instrucciones Adicionales</label>
                        <textarea
                            name="instrucciones_adicionales"
                            value={actividad.instrucciones_adicionales}
                            onChange={(e) => setActividad({ ...actividad, instrucciones_adicionales: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese instrucciones adicionales"
                        />
                    </div>
                </div>
            </ReuModal>

            <ReuModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="¿Estás seguro de eliminar esta actividad?"
                onConfirm={handleConfirmDelete}
            >
                <p>Esta acción es irreversible.</p>
            </ReuModal>

            {user && <ActividadNotifications userId={user.id} />}
        </DefaultLayout>
    );
};

export default ListaActividadPage;