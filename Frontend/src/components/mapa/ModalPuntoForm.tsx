import React, { useState, useEffect } from "react";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import { useRegistrarPuntoMapa, useActualizarPuntoMapa } from "@/hooks/mapa/usePuntoMapa";
import { PuntoMapa } from "@/types/mapa/PuntoMapa";
import { ChangeEvent } from "react";
import { useUsuarios, Usuario } from "@/hooks/usuarios/useUsuarios";
import { useCultivos } from "@/hooks/cultivo/useCultivo";
import { Select, MenuItem } from "@mui/material";

interface ModalPuntoFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialPunto?: PuntoMapa | null;
  initialLat?: number;
  initialLng?: number;
  onSuccess?: () => void;
}

export const ModalPuntoForm: React.FC<ModalPuntoFormProps> = ({
  isOpen,
  onOpenChange,
  initialPunto,
  initialLat,
  initialLng,
  onSuccess,
}) => {
  const [punto, setPunto] = useState<PuntoMapa>({
    nombre: initialPunto?.nombre || "",
    descripcion: initialPunto?.descripcion || "",
    latitud: initialPunto ? parseFloat(initialPunto.latitud as any) || 0 : initialLat || 0,
    longitud: initialPunto ? parseFloat(initialPunto.longitud as any) || 0 : initialLng || 0,
    usuario_id: initialPunto?.usuario_id || null, // ← nuevo campo opcional

  });

  const registrarMutation = useRegistrarPuntoMapa();
  const actualizarMutation = useActualizarPuntoMapa();
  const { data: usuarios } = useUsuarios();
const { data: cultivos, isLoading: cargandoCultivos } = useCultivos();

  useEffect(() => {
    if (initialPunto) {
      const lat = parseFloat(initialPunto.latitud as any);
      const lng = parseFloat(initialPunto.longitud as any);
      setPunto({
        nombre: initialPunto.nombre || "",
        descripcion: initialPunto.descripcion || "",
        latitud: isNaN(lat) ? 0 : Number(lat.toFixed(6)),
        longitud: isNaN(lng) ? 0 : Number(lng.toFixed(6)),
      });
    } else {
      setPunto({
        nombre: "",
        descripcion: "",
        latitud: initialLat ? Number(initialLat.toFixed(6)) : 0,
        longitud: initialLng ? Number(initialLng.toFixed(6)) : 0,
      });
    }
  }, [initialPunto, initialLat, initialLng]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPunto((prev) => ({
      ...prev,
      [name]: name === "latitud" || name === "longitud" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = () => {
    if (!punto.nombre || punto.nombre.length < 5) {
      console.error("El nombre debe tener al menos 5 caracteres.");
      return;
    }
    if (!punto.descripcion || punto.descripcion.length < 2) {
      console.error("La descripción debe tener al menos 5 caracteres.");
      return;
    }
    if (punto.latitud === 0 || punto.longitud === 0) {
      console.error("Por favor, seleccione coordenadas válidas.");
      return;
    }

    const puntoData: any = {
      nombre: punto.nombre,
      descripcion: punto.descripcion,
      latitud: Number(punto.latitud.toFixed(6)),
      longitud: Number(punto.longitud.toFixed(6)),
    };
    if (punto.usuario_id) {
  puntoData.usuario_id = punto.usuario_id;
}
if (punto.cultivo_id) {
  puntoData.cultivo_id = punto.cultivo_id;
}

    console.log("Enviando punto:", JSON.stringify(puntoData, null, 2));

    if (initialPunto?.id) {
      actualizarMutation.mutate(
        { id: initialPunto.id, punto: puntoData },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
          onError: (error: any) => {
            console.error("Error actualizando punto:", error.message);
          },
        }
      );
    } else {
      registrarMutation.mutate(puntoData, {
        onSuccess: () => {
          onOpenChange(false);
          setPunto({ nombre: "", descripcion: "", latitud: 0, longitud: 0 });
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Error registrando punto:", error.message);
        },
      });
    }
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={initialPunto ? "Editar Punto de Interés" : "Registrar Punto de Interés"}
      onConfirm={handleSubmit}
      confirmText="Guardar"
      cancelText="Cancelar"
      size="md"
    >
      <div className="flex flex-col gap-4">
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          name="nombre"
          value={punto.nombre}
          onChange={handleChange}
        />
        <ReuInput
          label="Descripción"
          placeholder="Ingrese una descripción"
          type="text"
          name="descripcion"
          value={punto.descripcion}
          onChange={handleChange}
        />
        <select
        name="usuario_id"
        value={punto.usuario_id ?? ""}
        onChange={(e) =>
          setPunto((prev) => ({
            ...prev,
            usuario_id: e.target.value ? parseInt(e.target.value) : null,
          }))
        }
      >
        <option value="">Asignar un usuario (opcional)</option>
        {usuarios?.map((usuario: Usuario) => (
          <option key={usuario.id} value={usuario.id}>
            {usuario.nombre} {usuario.apellido}
          </option>
        ))}
      </select>

      
<Select
  value={punto.cultivo_id}
  onChange={(e) => setPunto({ ...punto, cultivo_id: e.target.value })}
  sx={{ width: 400, height: 30, fontSize: 14 }}
  displayEmpty
  renderValue={(selected) => {
    if (!selected) {
      return <em>Seleccionar Cultivo (opcional)</em>;
    }
    const cultivo = cultivos?.find((c) => c.id === selected);
    return cultivo ? cultivo.nombre : selected;
  }}
  MenuProps={{
    disablePortal: true,
    PaperProps: {
      sx: {
        maxHeight: 300,
      },
    },
  }}
>
  {cultivos?.map((cultivo) => (
    <MenuItem key={cultivo.id} value={cultivo.id}>
      {cultivo.nombre}
    </MenuItem>
  ))}
</Select>
        <div className="grid grid-cols-2 gap-4">
          <ReuInput
            label="Latitud"
            placeholder="Coordenada seleccionada"
            type="number"
            name="latitud"
            value={punto.latitud.toString()}
            onChange={handleChange}
            disabled={!!initialLat}
          />
          <ReuInput
            label="Longitud"
            placeholder="Coordenada seleccionada"
            type="number"
            name="longitud"
            value={punto.longitud.toString()}
            onChange={handleChange}
            disabled={!!initialLng}
          />
        </div>
      </div>
    </ReuModal>
  );
};