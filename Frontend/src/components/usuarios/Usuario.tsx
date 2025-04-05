import { useUsuarios } from "../../hooks/usuarios/useUsuarios";
import Tabla from "../globales/Tabla";

const columns = [
  { uid: "id", name: "ID" },
  { uid: "nombre", name: "Nombre" },
  { uid: "apellido", name: "Apellido" },
  { uid: "email", name: "Email" },
  { uid: "rol", name: "Rol" },
];

const Usuarios = () => {
  const { isLoading, error } = useUsuarios();

  if (isLoading) return <div className="text-center text-gray-500">Cargando usuarios...</div>;
  if (error instanceof Error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h1 className="text-lg font-semibold mb-4 text-center">Lista de Usuarios</h1>
      <Tabla apiEndpoint="/api/usuarios" columns={columns} />
    </div>
  );
};

export default Usuarios;




