import React, { useState, useMemo, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import { useToggleStaff } from "@/hooks/usuarios/useUsuarios";
import { Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"; 
import Tabla from "@/components/globales/Tabla";
import { useAuth } from "@/context/AuthContext";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";
import { EditIcon, Trash2 } from "lucide-react";
import RegistroMasivoModal from "@/pages/usuarios/RegistroMasivoModal";
import Switcher from "@/components/switch";
import { addToast } from "@heroui/toast";
const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const {
    data: usuariosAPI = [],
    isLoading,
    error,
    updateUsuario,
    deleteUsuario,
    registrarUsuario,
    roles,
  } = useUsuarios();

  const navigate = useNavigate();

  const [usuariosLocal, setUsuariosLocal] = useState<any[]>([]);
  const toggleStaff = useToggleStaff();

  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [modalMasivoAbierto, setModalMasivoAbierto] = useState(false);

  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    numero_documento: "",
    username: "",
    rol_id: 1, // Por defecto "Aprendiz"
  });

  // Cuando la data de API cambia, actualizamos el estado local para sincronizar
  useEffect(() => {
    setUsuariosLocal(usuariosAPI);
  }, [usuariosAPI]);

  if (!user || user.rol?.rol.toLowerCase() !== "administrador") {
    return <Navigate to="/perfil" replace />;
  }

  const columns = [
    { name: "Nombre", uid: "nombre" },
    { name: "Apellido", uid: "apellido" },
    { name: "Correo electrónico", uid: "email" },
    { name: "Número de documento", uid: "numero_documento" },
    { name: "Username", uid: "username" },
    { name: "Rol", uid: "rol" },
    { name: "Estado", uid: "estado" }, 
    { name: "Acciones", uid: "acciones" },
  ];

  const handleEdit = (usuario: any) => {
    setSelectedUsuario({
      ...usuario,
      rol_id: usuario.rol?.id || "", // Extraemos el ID del rol para que lo tome el select
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (usuario: any) => {
    setSelectedUsuario(usuario);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUsuario && selectedUsuario.id !== undefined) {
      deleteUsuario(selectedUsuario.id);
      setIsDeleteModalOpen(false);
      // También actualizamos el estado local eliminando el usuario
      setUsuariosLocal((prev) =>
        prev.filter((u) => u.id !== selectedUsuario.id)
      );
    }
  };

  const handleRegister = () => {
    registrarUsuario(newUser);
    setIsRegisterModalOpen(false);
    setNewUser({
      nombre: "",
      apellido: "",
      email: "",
      numero_documento: "",
      username: "",
      rol_id: 1,
    });
  };

  // Callback para recibir usuarios registrados masivamente desde el modal
  const handleUsuariosRegistrados = (nuevosUsuarios: any[]) => {
    setUsuariosLocal((prev) => [...prev, ...nuevosUsuarios]);
    setModalMasivoAbierto(false);
  };

  const formattedData = useMemo(() => {
    return usuariosLocal.map((usuario) => ({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      numero_documento: usuario.numero_documento,
      username: usuario.username || "N/A",
      is_staff: usuario.is_staff, // ✅ esto faltaba
      rol: usuario.rol?.rol || "Sin rol",
    estado: (
<Switcher
  size="sm"
  isSelected={usuario.is_staff}
  color={usuario.is_staff ? "success" : "danger"}
  onChange={(e) => {
    const nuevoValor = e.target.checked;
    toggleStaff.mutate(
      { id: usuario.id, nuevoValor },
      {
        onSuccess: () => {
          setUsuariosLocal((prev) =>
            prev.map((u) =>
              u.id === usuario.id ? { ...u, is_staff: nuevoValor } : u
            )
          );
          addToast({
            title: "Éxito",
            description: `Estado actualizado a ${nuevoValor ? "Activo" : "Inactivo"}`,
            timeout: 3000,
            color: "success",
          });
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "No se pudo actualizar el estado.",
            timeout: 3000,
            color: "danger",
          });
        },
      }
    );
  }}
/>
    ),

      acciones: (
        <>
          <button className="mr-2" onClick={() => handleEdit(usuario)}>
            <EditIcon size={22} color="black" />
          </button>
        </>
      ),
    }));
  }, [usuariosLocal]);

  return (
    <DefaultLayout>
      <div className="flex gap-4 mb-2">
        <button
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
          onClick={() => navigate("/usuarios/secondregis/")}
        >
          + Registrar
        </button>

        <button
          onClick={() => setModalMasivoAbierto(true)}
          className="px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
        >
          + Registro Masivo
        </button>
      </div>

      <RegistroMasivoModal
        isOpen={modalMasivoAbierto}
        onOpenChange={setModalMasivoAbierto}
        onUsuariosRegistrados={handleUsuariosRegistrados}
      />

      {isLoading ? (
        <p className="text-gray-600 text-center">Cargando usuarios...</p>
      ) : error ? (
        <p className="text-red-500 text-center">
          Error al cargar usuarios: {error.message}
        </p>
      ) : formattedData.length === 0 ? (
        <p className="text-gray-600 text-center">No hay usuarios disponibles.</p>
      ) : (
        <Tabla columns={columns} data={formattedData} />
      )}

      {/* Modal de Edición */}
      <ReuModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Editar Usuario"
        onConfirm={() => {
          if (selectedUsuario && selectedUsuario.id !== undefined) {
            updateUsuario(selectedUsuario);
            setIsEditModalOpen(false);
          }
        }}
      >
        <ReuInput
          label="Nombre"
          type="text"
          value={selectedUsuario?.nombre || ""}
          onChange={(e) =>
            setSelectedUsuario({ ...selectedUsuario, nombre: e.target.value })
          }
        />
        <ReuInput
          label="Apellido"
          type="text"
          value={selectedUsuario?.apellido || ""}
          onChange={(e) =>
            setSelectedUsuario({ ...selectedUsuario, apellido: e.target.value })
          }
        />
        <ReuInput
          label="Correo Electrónico"
          type="email"
          value={selectedUsuario?.email || ""}
          onChange={(e) =>
            setSelectedUsuario({ ...selectedUsuario, email: e.target.value })
          }
        />
        <ReuInput
          label="Número de documento"
          type="number"
          value={selectedUsuario?.numero_documento || ""}
          onChange={(e) =>
            setSelectedUsuario({
              ...selectedUsuario,
              numero_documento: e.target.value,
            })
          }
        />
        <ReuInput
          label="Nombre de Usuario"
          type="text"
          value={selectedUsuario?.username || ""}
          onChange={(e) =>
            setSelectedUsuario({ ...selectedUsuario, username: e.target.value })
          }
        />
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedUsuario?.rol_id || ""}
            onChange={(e) =>
              setSelectedUsuario({
                ...selectedUsuario,
                rol_id: parseInt(e.target.value),
              })
            }
          >
            <option value="">Seleccione un rol</option>
            {roles?.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.rol}
              </option>
            ))}
          </select>
        </div>
      </ReuModal>

      {/* Modal de Eliminación */}
      <ReuModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="¿Estás seguro de eliminar este usuario?"
        onConfirm={handleConfirmDelete}
      >
        <p>Esta acción es irreversible.</p>
      </ReuModal>

      {/* Modal de Registro Individual */}
      <ReuModal
        isOpen={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        title="Registrar Usuario"
        onConfirm={handleRegister}
      >
        <ReuInput
          label="Nombre"
          type="text"
          value={newUser.nombre}
          onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
        />
        <ReuInput
          label="Apellido"
          type="text"
          value={newUser.apellido}
          onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })}
        />
        <ReuInput
          label="Correo Electrónico"
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <ReuInput
          label="Número de documento"
          type="number"
          value={newUser.numero_documento}
          onChange={(e) =>
            setNewUser({ ...newUser, numero_documento: e.target.value })
          }
        />
        <ReuInput
          label="Nombre de Usuario"
          type="text"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={newUser.rol_id}
            onChange={(e) =>
              setNewUser({ ...newUser, rol_id: parseInt(e.target.value) })
            }
          >
            {roles?.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.rol}
              </option>
            ))}
          </select>
        </div>
      </ReuModal>
    </DefaultLayout>
  );
};

export default UsuariosPage;
