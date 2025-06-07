import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarEspecie } from "@/hooks/cultivo/useEspecie";
import { useTipoEspecies } from "@/hooks/cultivo/usetipoespecie";
import { Especie } from "@/types/cultivo/Especie";
import { useState } from "react";
import { ModalTipoEspecie } from "./ModalTipoEspecie";
import { Plus } from "lucide-react";
interface ModalEspecieProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ModalEspecie = ({ isOpen, onOpenChange, onSuccess }: ModalEspecieProps) => {
  const [nuevaEspecie, setNuevaEspecie] = useState<Omit<Especie, 'img'> & { img: File | string }>({
    nombre: "",
    descripcion: "",
    largoCrecimiento: 0,
    fk_tipo_especie: 0,
    img: "",
  });

  const { data: tiposEspecie } = useTipoEspecies();
  const mutation = useRegistrarEspecie();
  const [openTipoEspecie, setOpenTipoEspecie] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaEspecie(prev => ({
      ...prev,
      [name]: name === "nombre" || name === "descripcion" ? value : Number(value)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNuevaEspecie({ ...nuevaEspecie, img: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("nombre", nuevaEspecie.nombre);
    formData.append("descripcion", nuevaEspecie.descripcion);
    formData.append("largoCrecimiento", nuevaEspecie.largoCrecimiento.toString());
    formData.append("fk_tipo_especie", nuevaEspecie.fk_tipo_especie.toString());
    if (typeof nuevaEspecie.img !== 'string') {
      formData.append("img", nuevaEspecie.img);
    }

    mutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setNuevaEspecie({
          nombre: "",
          descripcion: "",
          largoCrecimiento: 0,
          fk_tipo_especie: 0,
          img: "",
        });
        onSuccess?.();
      }
    });
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registrar Nueva Especie"
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
    >
      <ModalTipoEspecie
      isOpen={openTipoEspecie}
      onOpenChange={setOpenTipoEspecie}
      />
      <div className="space-y-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={nuevaEspecie.nombre}
          onChange={(e) => setNuevaEspecie({...nuevaEspecie, nombre: e.target.value})}
        />

        <ReuInput
          label="Descripción"
          placeholder="Ingrese la descripción"
          type="text"
          value={nuevaEspecie.descripcion}
          onChange={(e) => setNuevaEspecie({...nuevaEspecie, descripcion: e.target.value})}
        />

        <ReuInput
          label="Largo de Crecimiento (días)"
          placeholder="Ingrese el tiempo en días"
          type="number"
          value={nuevaEspecie.largoCrecimiento.toString()}
          onChange={(e) => setNuevaEspecie({...nuevaEspecie, largoCrecimiento: Number(e.target.value)})}
        />

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Tipo de especie</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenTipoEspecie(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="fk_tipo_especie"
            value={nuevaEspecie.fk_tipo_especie || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
          >
            <option value="0">Seleccione un tipo</option>
            {tiposEspecie?.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen</label>
          <input
            type="file"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
            name="img"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>
    </ReuModal>
  );
};