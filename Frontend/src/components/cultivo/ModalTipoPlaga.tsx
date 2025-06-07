import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarTipoPlaga } from "@/hooks/cultivo/usetipoplaga";
import { TipoPlaga } from "@/types/cultivo/TipoPlaga";
import { useState, ChangeEvent } from "react";


interface ModalTipoPlagaProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalTipoPlaga = ({ isOpen, onOpenChange }: ModalTipoPlagaProps) => {
  const [nuevoTipoPlaga, setNuevoTipoPlaga] = useState<TipoPlaga>({
    nombre: "",
    descripcion: "",
    img: null,
  });

  const mutation = useRegistrarTipoPlaga();

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
       setNuevoTipoPlaga((prev) => ({ ...prev, img: e.target.files![0] }));
     }
   };
 
   const handleSubmit = () => {
     mutation.mutate(nuevoTipoPlaga);
   };


  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Tipo de Plaga"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevoTipoPlaga.nombre}
          onChange={(e) => setNuevoTipoPlaga({... nuevoTipoPlaga, nombre : e.target.value}) }
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={nuevoTipoPlaga.descripcion}
          onChange={(e) => setNuevoTipoPlaga ({... nuevoTipoPlaga, descripcion: e.target.value})}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <input
            type="file"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>
    </ReuModal>
  );
};