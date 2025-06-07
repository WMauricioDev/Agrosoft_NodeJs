import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ReuInput } from "@/components/globales/ReuInput";
import { useActividades, useInsumos, useUsuarios, useActualizarActividad, useEliminarActividad, useFinalizarActividad } from "@/hooks/cultivo/useActividad";
import { useTipoActividad } from "@/hooks/cultivo/usetipoactividad";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import ReuModal from "@/components/globales/ReuModal";
import Tabla from "@/components/globales/Tabla";
import { useNavigate } from "react-router-dom";
import { EditIcon, Trash2, CheckCircleIcon } from 'lucide-react';
import { useHerramientas } from "@/hooks/inventario/useHerramientas";
const ListaActividadPage: React.FC = () => {
    
    const [actividad, setActividad] = useState({
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        tipo_actividad: 0,
        cultivo: 0,
        usuarios: [] as number[],
        estado: "PENDIENTE",
        prioridad: "MEDIA",
        instrucciones_adicionales: "",
        insumos: [] as Array<{insumo: number, cantidad_usada: number}>,
       herramientas: [] as Array<{
        herramienta: number;
        cantidad_entregada: number;
        devuelta: boolean;
}>
    });

    const [selectedActividad, setSelectedActividad] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const actualizarMutation = useActualizarActividad();
    const eliminarMutation = useEliminarActividad();
    const finalizarMutation = useFinalizarActividad();
    const { data: actividades, isLoading, refetch } = useActividades();
    const { data: tiposActividad } = useTipoActividad();
    const { data: usuarios } = useUsuarios();
    const { data: cultivos } = useCultivos();
    const { data: insumos } = useInsumos();
    const { data: herramientas } = useHerramientas();

    const navigate = useNavigate();
    const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
    const [finalizeData, setFinalizeData] = useState({
        fecha_fin: new Date().toISOString().slice(0, 16),
        herramientas: [] as any[],
        insumos: [] as any[],
    });

    const columns = [
      { name: "Descripción", uid: "descripcion" },
      { name: "Fecha Inicio", uid: "fecha_inicio" },
      { name: "Fecha Fin", uid: "fecha_fin" },
      { name: "Estado", uid: "estado" },
      { name: "Prioridad", uid: "prioridad" },
      { name: "Tipo Actividad", uid: "tipo_actividad" },
      { name: "Usuarios", uid: "usuarios" },
      { name: "Cultivo", uid: "cultivo" },
      { name: "Insumos", uid: "insumos" },
      { name: "Herramientas", uid: "herramientas" },
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
        setActividad({
            ...actividad,
            usuarios: actividad.usuarios_data?.map((u: any) => u.id) || [],
            insumos: actividad.prestamos_insumos?.map((i: any) => ({
                insumo: i.insumo.id,
                cantidad_usada: i.cantidad_usada
            })) || [],
            herramientas: actividad.prestamos_herramientas?.map((h: any) => ({
                herramienta: h.herramienta.id,
                entregada: h.entregada
            })) || []
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (actividad: any) => {
        setSelectedActividad(actividad);
        setIsDeleteModalOpen(true);
    };

   const handleFinalize = (actividad: any) => {
    setSelectedActividad(actividad);
    
    const herramientasData = actividad.prestamos_herramientas?.map((h: any) => ({
        id: h.id,
        herramienta_id: h.herramienta?.id,
        nombre: h.herramienta?.nombre,
        cantidad_entregada: h.cantidad_entregada || 1,
        cantidad_devuelta: h.cantidad_devuelta || 0,
        devuelta: h.devuelta || false,
        fecha_devolucion: h.fecha_devolucion || new Date().toISOString().slice(0, 16)
    })) || [];
  
    const insumosData = actividad.prestamos_insumos?.map((i: any) => ({
        id: i.id,
        insumo_id: i.insumo?.id,
        nombre: i.insumo?.nombre,
        cantidad_usada: i.cantidad_usada || 0,
        cantidad_devuelta: i.cantidad_devuelta || 0
    })) || [];
  
    setFinalizeData({
        fecha_fin: actividad.fecha_fin || new Date().toISOString().slice(0, 16),
        herramientas: herramientasData,
        insumos: insumosData
    });
  
    setIsFinalizeModalOpen(true);
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

    const transformedData = (actividades ?? []).map((actividad) => {
      const usuariosInfo = actividad.usuarios_data?.map((u: any) => u.nombre).join(', ') || 'Sin asignar';
      const herramientasInfo = actividad.prestamos_herramientas?.map((ph: any) => 
            `${ph.herramienta_nombre || ph.herramienta?.nombre || 'Herramienta'} ` +
            `(${ph.cantidad_entregada || 1} ${ph.devuelta ? 'devueltas' : 'prestadas'})`
        ).join(', ') || 'No se usaron herramientas';

    const insumosInfo = actividad.prestamos_insumos?.map((pi: any) => 
        `${pi.insumo_nombre || pi.insumo?.nombre || 'Insumo'} (${pi.cantidad_usada || 0}${pi.unidad_medida || pi.insumo?.unidad_medida?.abreviatura || ''})`
    ).join(', ') || 'No se usaron insumos';


      return {
          id: actividad.id?.toString() || '',
          descripcion: actividad.descripcion,
          fecha_inicio: new Date(actividad.fecha_inicio).toLocaleDateString(),
          fecha_fin: actividad.fecha_fin ? new Date(actividad.fecha_fin).toLocaleDateString() : 'No finalizada',
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
          usuarios: usuariosInfo,
          cultivo: cultivos?.find((cult) => cult.id === actividad.cultivo)?.nombre || 'Sin cultivo',
          insumos: insumosInfo,
          herramientas: herramientasInfo,
          acciones: (
              <>
                  {actividad.estado !== 'COMPLETADA' && (
                      <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleFinalize(actividad)}
                      >
                          <CheckCircleIcon size={22} color='green'/>
                      </button>
                  )}
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
      };
  });

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
                        <label className="block text-sm font-medium text-gray-700">Usuarios</label>
                        <select
                            multiple
                            name="usuarios"
                            value={actividad.usuarios.map(String)}
                            onChange={(e) => {
                                const options = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                setActividad({ ...actividad, usuarios: options });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
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

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Insumos</label>
                        <div className="space-y-2">
                            {actividad.insumos.map((insumo, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <select
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                        value={insumo.insumo}
                                        onChange={(e) => {
                                            const newInsumos = [...actividad.insumos];
                                            newInsumos[index].insumo = parseInt(e.target.value);
                                            setActividad({ ...actividad, insumos: newInsumos });
                                        }}
                                    >
                                        <option value="">Seleccione un insumo</option>
                                        {insumos?.map((ins) => (
                                            <option key={ins.id} value={ins.id}>{ins.nombre}</option>
                                        ))}
                                    </select>
                                    <ReuInput
                                        label="Cantidad"
                                        type="number"
                                        value={insumo.cantidad_usada}
                                        onChange={(e) => {
                                            const newInsumos = [...actividad.insumos];
                                            newInsumos[index].cantidad_usada = Number(e.target.value);
                                            setActividad({ ...actividad, insumos: newInsumos });
                                        }}
                                        placeholder="Cantidad"
                                    />
                                    <button
                                        onClick={() => {
                                            const newInsumos = [...actividad.insumos];
                                            newInsumos.splice(index, 1);
                                            setActividad({ ...actividad, insumos: newInsumos });
                                        }}
                                        className="text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setActividad({
                                    ...actividad,
                                    insumos: [...actividad.insumos, { insumo: 0, cantidad_usada: 0 }]
                                })}
                                className="text-blue-500 text-sm"
                            >
                                + Agregar insumo
                            </button>
                        </div>
                    </div>

                   <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">Herramientas</label>
    <div className="space-y-2">
        {actividad.herramientas.map((herramienta, index) => (
            <div key={index} className="flex gap-2 items-center">
                <select
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    value={herramienta.herramienta}
                    onChange={(e) => {
                        const newHerramientas = [...actividad.herramientas];
                        newHerramientas[index].herramienta = parseInt(e.target.value);
                        setActividad({ ...actividad, herramientas: newHerramientas });
                    }}
                >
                    <option value="">Seleccione una herramienta</option>
                    {herramientas?.map((her) => (
                        <option key={her.id} value={her.id}>{her.nombre}</option>
                    ))}
                </select>
                <ReuInput
                    label="Cantidad"
                    type="number"
                    value={herramienta.cantidad_entregada}
                    onChange={(e) => {
                        const newHerramientas = [...actividad.herramientas];
                        newHerramientas[index].cantidad_entregada = Number(e.target.value);
                        setActividad({ ...actividad, herramientas: newHerramientas });
                    }}
                    min="1"
                    placeholder="Cantidad"
                />
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={herramienta.devuelta}
                        onChange={(e) => {
                            const newHerramientas = [...actividad.herramientas];
                            newHerramientas[index].devuelta = e.target.checked;
                            setActividad({ ...actividad, herramientas: newHerramientas });
                        }}
                        className="mr-2"
                    />
                    Devuelta
                </label>
                <button
                    onClick={() => {
                        const newHerramientas = [...actividad.herramientas];
                        newHerramientas.splice(index, 1);
                        setActividad({ ...actividad, herramientas: newHerramientas });
                    }}
                    className="text-red-500"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
        <button
            onClick={() => setActividad({
                ...actividad,
                herramientas: [...actividad.herramientas, { 
                    herramienta: 0, 
                    cantidad_entregada: 1,
                    devuelta: false 
                }]
            })}
            className="text-blue-500 text-sm"
        >
            + Agregar herramienta
        </button>
    </div>
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

            <ReuModal
                isOpen={isFinalizeModalOpen}
                onOpenChange={setIsFinalizeModalOpen}
                title="Finalizar Actividad"
                size="xl"
                onConfirm={() => {
                    if (selectedActividad) {
                        finalizarMutation.mutate({
                            id: selectedActividad.id,
                            finalizacionData: {
                                fecha_fin: finalizeData.fecha_fin,
                                herramientas: finalizeData.herramientas.map(h => ({
                                    id: h.id,
                                    devuelta: h.devuelta,
                                    fecha_devolucion: h.devuelta ? h.fecha_devolucion : undefined
                                })),
                                insumos: finalizeData.insumos.map(i => ({
                                    id: i.id,
                                    cantidad_devuelta: i.cantidad_devuelta
                                }))
                            }
                        }, {
                            onSuccess: () => {
                                setIsFinalizeModalOpen(false);
                                refetch();
                            }
                        });
                    }
                }}
                confirmText="Confirmar Finalización"
                cancelText="Cancelar"
                isConfirming={finalizarMutation.isPending}
            >
                <div className="space-y-6">
                    <div>
                        <ReuInput
                            label="Fecha y Hora de Finalización"
                            type="datetime-local"
                            value={finalizeData.fecha_fin}
                            onChange={(e) => setFinalizeData({...finalizeData, fecha_fin: e.target.value})}
                        />
                    </div>

                    <div className="border rounded-lg p-4">
    <h3 className="font-medium text-lg mb-3">Herramientas Utilizadas</h3>
    <div className="space-y-3">
        {finalizeData.herramientas.map((herramienta) => (
            <div key={herramienta.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 border-b">
                <div>
                    <span className="font-medium">{herramienta.nombre}</span>
                    <p className="text-sm text-gray-600">Entregadas: {herramienta.cantidad_entregada}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={herramienta.devuelta}
                            onChange={(e) => {
                                const updatedHerramientas = finalizeData.herramientas.map(h => 
                                    h.id === herramienta.id ? {...h, devuelta: e.target.checked} : h
                                );
                                setFinalizeData({...finalizeData, herramientas: updatedHerramientas});
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span>Devuelta</span>
                    </label>
                </div>
                
                {herramienta.devuelta && (
                    <div>
                        <ReuInput
                            label="Cantidad Devuelta"
                            type="number"
                            value={herramienta.cantidad_devuelta}
                            onChange={(e) => {
                                const value = Math.min(Number(e.target.value), herramienta.cantidad_entregada);
                                const updatedHerramientas = finalizeData.herramientas.map(h => 
                                    h.id === herramienta.id ? {...h, cantidad_devuelta: value} : h
                                );
                                setFinalizeData({...finalizeData, herramientas: updatedHerramientas});
                            }}
                            min="0"
                            max={herramienta.cantidad_entregada}
                        />
                        <ReuInput
                            label="Fecha Devolución"
                            type="datetime-local"
                            value={herramienta.fecha_devolucion}
                            onChange={(e) => {
                                const updatedHerramientas = finalizeData.herramientas.map(h => 
                                    h.id === herramienta.id ? {...h, fecha_devolucion: e.target.value} : h
                                );
                                setFinalizeData({...finalizeData, herramientas: updatedHerramientas});
                            }}
                        />
                    </div>
                )}
            </div>
        ))}
    </div>
</div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">Insumos Utilizados</h3>
                        <div className="space-y-3">
                            {finalizeData.insumos.map((insumo) => (
                                <div key={insumo.id} className="flex items-center justify-between p-2 border-b">
                                    <span>{insumo.nombre}</span>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm">Usados: {insumo.cantidad_usada}</span>
                                        <ReuInput
                                            label="Devueltos"
                                            type="number"
                                            value={insumo.cantidad_devuelta}
                                            onChange={(e) => {
                                                const value = Math.min(Number(e.target.value), insumo.cantidad_usada);
                                                const updatedInsumos = finalizeData.insumos.map(i => 
                                                    i.id === insumo.id ? {...i, cantidad_devuelta: value} : i
                                                );
                                                setFinalizeData({...finalizeData, insumos: updatedInsumos});
                                            }}
                                            min={0}
                                            max={insumo.cantidad_usada}
                                            radius="sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-2">Resumen</h3>
                        <p className="text-sm">
                            Al confirmar, la actividad será marcada como <span className="font-semibold">COMPLETADA</span>.
                        </p>
                        <p className="text-sm mt-1">
                            {finalizeData.herramientas.filter(h => !h.devuelta).length} herramientas pendientes por devolver.
                        </p>
                    </div>
                </div>
            </ReuModal>

        </DefaultLayout>
    );
};

export default ListaActividadPage;