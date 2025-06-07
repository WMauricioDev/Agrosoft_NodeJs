import ReuModal from "../globales/ReuModal";
import { ReuInput } from "../globales/ReuInput";
import { useRegistrarPlaga } from "@/hooks/cultivo/useplaga";
import { useTipoPlagas } from "@/hooks/cultivo/usetipoplaga";
import { Plaga } from "@/types/cultivo/Plaga";
import { ModalTipoPlaga } from "./ModalTipoPlaga";
import { useState, ChangeEvent } from "react";
import { Plus } from "lucide-react";
interface ModalPlagaProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
  }


  export const ModalPlaga = ({ isOpen, onOpenChange, onSuccess }: ModalPlagaProps) => {
    const [nuevaPlaga, setNuevaPlaga] = useState<Plaga>({
        fk_tipo_plaga: 0,
        nombre: "",
        descripcion: "",
        img: null,
    });
  
    const { data: tiposPlaga } = useTipoPlagas();
    const registrarPlaga = useRegistrarPlaga();
    const [openTipoPlaga, setOpenTipoPlaga] = useState(false)
   
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setNuevaPlaga((prev) => ({ ...prev, img: e.target.files![0] }));
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNuevaPlaga(prev => ({
        ...prev,
        [name]: name === "nombre" ? value : Number(value)
      }));
    };
  
 
    const handleSubmit = () => {
      registrarPlaga.mutate(nuevaPlaga, {
        onSuccess: () => {
          onOpenChange(false);
          setNuevaPlaga({
            fk_tipo_plaga: 0,
            nombre: "",
            descripcion: "",
            img: null,
          });
          onSuccess?.();
        }
      });
    };


    return (
      
          <ReuModal
            title="Registrar Plaga"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onConfirm={handleSubmit}
            confirmText="Guardar"
            cancelText="Cancelar"
            >
            <ModalTipoPlaga
              isOpen={openTipoPlaga}
              onOpenChange={setOpenTipoPlaga}
            />

          <ReuInput
            label="Nombre"
            placeholder="Ingrese el nombre"
            type="text"
            value={nuevaPlaga.nombre}
            onChange={(e) => setNuevaPlaga({ ...nuevaPlaga, nombre: e.target.value })}
          />

          <ReuInput
            label="Descripción"
            placeholder="Ingrese la descripción"
            type="text"
            value={nuevaPlaga.descripcion}
            onChange={(e) => setNuevaPlaga({ ...nuevaPlaga, descripcion: e.target.value })}
          />

          <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="imagen"
              onChange={handleFileChange}
              accept="image/*"
            />
            
          </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Tipo de Plaga</label>
            <button 
              className="p-1 h-6 w-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => setOpenTipoPlaga(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <select
            name="fk_tipo_plaga"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nuevaPlaga.fk_tipo_plaga}
            onChange={handleChange}
          >
            <option value={0}>Seleccione un tipo de plaga</option>
            {tiposPlaga?.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

          </ReuModal>    

    )} 