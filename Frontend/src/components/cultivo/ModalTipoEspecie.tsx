import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarTipoEspecie } from "@/hooks/cultivo/usetipoespecie";
import { TipoEspecie } from "@/types/cultivo/TipoEspecie";
import { useState, ChangeEvent } from "react";


interface ModalTipoEspecieProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalTipoEspecie = ({ isOpen, onOpenChange }: ModalTipoEspecieProps) => {
  const [nuevoTipoEspecie, setNuevoTipoEspecie] = useState<TipoEspecie>({
    nombre: "",
    descripcion: "",
    img: null,
  });

  const mutation = useRegistrarTipoEspecie();

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
       setNuevoTipoEspecie((prev) => ({ ...prev, img: e.target.files![0] }));
     }
   };
 
   const handleSubmit = () => {
     mutation.mutate(nuevoTipoEspecie);
   };


  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nuevo Tipo de Especie"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevoTipoEspecie.nombre}
          onChange={(e) => setNuevoTipoEspecie({... nuevoTipoEspecie, nombre : e.target.value}) }
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={nuevoTipoEspecie.descripcion}
          onChange={(e) => setNuevoTipoEspecie ({... nuevoTipoEspecie, descripcion: e.target.value})}
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