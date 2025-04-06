import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useRegistrarUsuario } from "@/hooks/usuarios/useRegistrarUsuario";
import Formulario from "@/components/globales/Formulario";
import { ReuInput } from "@/components/globales/ReuInput";
import { Eye, EyeOff } from "lucide-react";

const UsuariosSecondPage: React.FC = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: "",
    password: "",  
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { registrarUsuario, isLoading, error } = useRegistrarUsuario();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await registrarUsuario(usuario);
      setUsuario({ nombre: "", apellido: "", email: "", username: "", password: "" });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <DefaultLayout>
      <Formulario
        title="Registro de Usuario"
        onSubmit={handleSubmit}
        buttonText="Registrar Usuario"
        isSubmitting={isLoading}
      >
        <ReuInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={usuario.nombre}
          onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
        />
        <ReuInput
          label="Apellido"
          placeholder="Ingrese el apellido"
          type="text"
          value={usuario.apellido}
          onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
        />
        <ReuInput
          label="Correo Electrónico"
          placeholder="Ingrese el correo"
          type="email"
          value={usuario.email}
          onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
        />
        <ReuInput
          label="Nombre de Usuario"
          placeholder="Ingrese el nombre de usuario"
          type="text"
          value={usuario.username}
          onChange={(e) => setUsuario({ ...usuario, username: e.target.value })}
        />
        <div className="relative">
          <ReuInput
            label="Contraseña"
            placeholder="Ingrese la contraseña"
            type={mostrarPassword ? "text" : "password"}
            value={usuario.password}
            onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="col-span-1 md:col-span-2 flex justify-center">
          <button
            type="button"
            className="w-full max-w-md px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm uppercase tracking-wide"
            onClick={() => navigate("/usuarios")}
          >
            Listar Usuarios
          </button>
        </div>
      </Formulario>
    </DefaultLayout>
  );
};

export default UsuariosSecondPage;
