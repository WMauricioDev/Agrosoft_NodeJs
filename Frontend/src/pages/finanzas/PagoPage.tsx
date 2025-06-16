import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';
import { useCalcularPago } from '@/hooks/finanzas/usePago';
import { useUsuarios } from '@/hooks/cultivo/useActividad';
import Formulario from '@/components/globales/Formulario';
import { ReuInput } from '@/components/globales/ReuInput';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { addToast } from "@heroui/react";

const animatedComponents = makeAnimated();

interface UsuarioOption {
  value: number;
  label: string;
  rol?: string;
}

const formatOptionLabel = ({ label, rol }: UsuarioOption) => (
  <div className="flex justify-between">
    <span>{label}</span>
    {rol && <span className="text-gray-500 ml-2">({rol})</span>}
  </div>
);

const CalcularPagoPage: React.FC = () => {
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioOption | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [searchUsuario, setSearchUsuario] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const calcularPagoMutation = useCalcularPago();
  const { data: usuarios } = useUsuarios();
  const navigate = useNavigate();

  const usuarioOptions: UsuarioOption[] = usuarios?.map(u => ({
    value: u.id,
    label: `${u.nombre} ${u.apellido || ''}`.trim(),
    rol: u.rol?.nombre
  })) || [];

  const filteredUsuarios = usuarioOptions.filter(opt => 
    opt.label.toLowerCase().includes(searchUsuario.toLowerCase())
  );

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const errors: Record<string, string> = {};
      
      if (new Date(fechaInicio) > new Date(fechaFin)) {
        errors.fechas = "La fecha de inicio no puede ser mayor que la fecha fin";
      }
      
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
    }
  }, [fechaInicio, fechaFin]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedUsuario) {
      errors.usuario = "Debe seleccionar un usuario";
    }
    
    if (!fechaInicio) {
      errors.fechaInicio = "La fecha de inicio es requerida";
    }
    
    if (!fechaFin) {
      errors.fechaFin = "La fecha fin es requerida";
    } else if (fechaInicio && new Date(fechaInicio) > new Date(fechaFin)) {
      errors.fechas = "La fecha de inicio no puede ser mayor que la fecha fin";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  if (!selectedUsuario) return;
  
  console.log("Datos enviados al backend:", {
    usuario_id: selectedUsuario.value,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  }); // Añade este log para depurar
  
  calcularPagoMutation.mutate({
    usuario_id: selectedUsuario.value,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  }, {
    onSuccess: () => {
      navigate('/finanzas/listarpagos');
      addToast({
        title: "Pago calculado",
        description: "El pago se ha calculado y registrado correctamente",
        timeout: 3000,
        color: "success"
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error al calcular",
        description: error.response?.data?.detail || "Ocurrió un error al calcular el pago",
        timeout: 3000,
        color: "danger"
      });
    }
  });
};
  return (
    <DefaultLayout>
      <Formulario
        title="Calcular Nuevo Pago"
        onSubmit={handleSubmit}
        isSubmitting={calcularPagoMutation.isPending}
        buttonText="Calcular Pago"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Usuario
          </label>
          <Select
            options={filteredUsuarios}
            value={selectedUsuario}
            onChange={(selected) => setSelectedUsuario(selected as UsuarioOption)}
            onInputChange={setSearchUsuario}
            placeholder="Buscar usuario..."
            components={animatedComponents}
            className="basic-select"
            classNamePrefix="select"
            noOptionsMessage={() => "No hay usuarios disponibles"}
            isClearable
            formatOptionLabel={formatOptionLabel}
          />
          {validationErrors.usuario && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.usuario}</p>
          )}
        </div>

        <ReuInput
          label="Fecha Inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        
        />

        <ReuInput
          label="Fecha Fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        
        />

        {validationErrors.fechas && (
          <p className="text-red-500 text-sm -mt-3 mb-3">{validationErrors.fechas}</p>
        )}

        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            type="button"
            onClick={() => navigate("/finanzas/listarpagos")}
          >
            Ver Lista de Pagos
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default CalcularPagoPage;