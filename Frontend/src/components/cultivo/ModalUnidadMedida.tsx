import { useState } from "react";
import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useCrearUnidadMedida } from "@/hooks/inventario/useInsumo";
import { UnidadMedida } from "@/types/inventario/Insumo";
interface ModalUnidadMedidaProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    unidadEditar?: UnidadMedida | null;
    onSuccess?: () => void;
}

export const ModalUnidadMedida = ({ 
    isOpen, 
    onOpenChange, 
    unidadEditar,
    onSuccess 
}: ModalUnidadMedidaProps) => {
    const [unidad, setUnidad] = useState<Omit<UnidadMedida, "id" | "fecha_creacion" | "creada_por_usuario">>({
        nombre: unidadEditar?.nombre || "",
        descripcion: unidadEditar?.descripcion || null,
    });

    const resetForm = () => {
        setUnidad({
            nombre: "",
            descripcion: null,
        });
    };

    const crearMutation = useCrearUnidadMedida();

    const handleSubmit = () => {
      
            crearMutation.mutate(unidad, {
                onSuccess: () => {
                    onOpenChange(false);
                    resetForm();
                    onSuccess?.();
                },
            });
        
    };

    return (
        <ReuModal
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) resetForm();
                onOpenChange(open);
            }}
            title={unidadEditar ? "Editar Unidad de Medida" : "Crear Nueva Unidad de Medida"}
            onConfirm={handleSubmit}
            confirmText={unidadEditar ? "Actualizar" : "Crear"}
            cancelText="Cancelar"
            isSubmitting={crearMutation.isPending}
        >
            <div className="space-y-4">
                <ReuInput
                    label="Nombre*"
                    placeholder="Ej: Kilogramos, Litros, Unidades"
                    type="text"
                    value={unidad.nombre}
                    onChange={(e) => 
                        setUnidad({...unidad, nombre: e.target.value})
                    }
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Ingrese una descripción (opcional)"
                        value={unidad.descripcion || ""}
                        onChange={(e) => 
                            setUnidad({...unidad, descripcion: e.target.value || null})
                        }
                        rows={3}
                    />
                </div>
            </div>
        </ReuModal>
    );
};