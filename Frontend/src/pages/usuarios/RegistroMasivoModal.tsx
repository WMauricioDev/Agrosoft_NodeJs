import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import ReuModal from '@/components/globales/ReuModal';
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}`;

interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  numero_documento: string | number;
}

interface ErrorFila {
  fila: number;
  mensaje: string;
}

interface RegistroMasivoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUsuariosRegistrados?: (usuarios: Usuario[]) => void;
}

const RegistroMasivoModal: React.FC<RegistroMasivoModalProps> = ({
  isOpen,
  onOpenChange,
  onUsuariosRegistrados,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [usuariosRegistrados, setUsuariosRegistrados] = useState<Usuario[]>([]);
  const [errores, setErrores] = useState<ErrorFila[]>([]);

  const [usuariosEjemplo] = useState<Usuario[]>([
    { nombre: '', apellido: '', numero_documento: '' }
  ]);

  const handleSeleccionarArchivo = () => {
    inputFileRef.current?.click();
  };

  const handleArchivoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      const response = await api.post(`${API_URL}/registro_usuarios_masivo/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUsuariosRegistrados([]);
      setErrores([]);

      if (response.data.usuarios) {
        setUsuariosRegistrados(response.data.usuarios);

        if (onUsuariosRegistrados) {
          onUsuariosRegistrados(response.data.usuarios);
        }
      }
      if (response.data.errores) {
        setErrores(response.data.errores);
      }

      addToast({
        title: "Éxito",
        description: "Archivo cargado correctamente.",
        timeout: 3000,
        color: "success",
      });

      // No cerramos el modal para que vean resultados

    } catch (error: any) {
      console.error('Error al enviar el archivo:', error);

      addToast({
        title: "Error",
        description: error?.response?.data?.detail || "No se pudo cargar el archivo.",
        timeout: 3000,
        color: "danger",
      });
    }
  };

  const exportarAExcel = () => {
    try {
      const hoja = usuariosEjemplo.map(({ nombre, apellido, numero_documento }) => ({
        nombre,
        apellido,
        numero_documento,
      }));

      const libro = XLSX.utils.book_new();
      const hojaExcel = XLSX.utils.json_to_sheet(hoja);
      XLSX.utils.book_append_sheet(libro, hojaExcel, 'Usuarios');
      XLSX.writeFile(libro, 'registro_usuarios.xlsx');
    } catch (error) {
      console.error("❌ Error al exportar Excel:", error);

      addToast({
        title: "Error",
        description: "No se pudo exportar el Excel.",
        timeout: 3000,
        color: "danger",
      });
    }
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Registro Masivo de Usuarios"
      confirmText="Cerrar"
      cancelText=""
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={handleSeleccionarArchivo}
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Enviar Excel
        </button>

        <input
          type="file"
          accept=".xlsx, .xls"
          ref={inputFileRef}
          onChange={handleArchivoChange}
          style={{ display: 'none' }}
        />

        <button
          onClick={exportarAExcel}
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Generar Excel
        </button>
      </div>

      {/* Aquí eliminé las tablas de usuarios y errores */}
    </ReuModal>
  );
};

export default RegistroMasivoModal;
