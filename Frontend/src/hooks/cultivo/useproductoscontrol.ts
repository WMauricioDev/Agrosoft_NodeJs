import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios"; 
import { addToast } from "@heroui/react";
import { ProductoControl } from "@/types/cultivo/ProductosControl";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/cultivo/productoscontrol/`;

const fetchProductoControl = async (): Promise<ProductoControl[]> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const response = await api.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const registrarProductoControl = async (productoControl: ProductoControl) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No se encontró el token de autenticación.");
  }

  const formData = new FormData();
  formData.append("precio", productoControl.precio.toString());
  formData.append("nombre", productoControl.nombre);
  formData.append("compuestoActivo", productoControl.compuestoActivo);
  formData.append("fichaTecnica", productoControl.fichaTecnica);
  formData.append("Contenido", productoControl.Contenido.toString());
  formData.append("tipoContenido", productoControl.tipoContenido);
  formData.append("unidades", productoControl.unidades.toString());

  return api.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

const actualizarProductoControl = async (id: number, productoControl: ProductoControl) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  try {
    const response = await api.put(`${API_URL}${id}/`, productoControl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en la API:", error.response?.data);
    throw error;
  }
};

const eliminarProductoControl = async (id: number) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No se encontró el token de autenticación.");

  return api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const useProductoControl = () => {
  return useQuery<ProductoControl[], Error>({
    queryKey: ["productosControl"],
    queryFn: fetchProductoControl,
  });
};

export const useRegistrarProductoControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productoControl: ProductoControl) => registrarProductoControl(productoControl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productosControl"] });
      addToast({
        title: "Éxito",
        description: "Producto de control registrado con éxito",
        timeout: 3000,
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al registrar el producto de control",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

export const useActualizarProductoControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productoControl }: { id: number; productoControl: ProductoControl }) =>
      actualizarProductoControl(id, productoControl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productosControl"] });
      addToast({
        title: "Éxito",
        description: "Producto de control actualizado con éxito",
        timeout: 3000,
        color:"success"
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        addToast({
          title: "Acceso denegado",
          description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
          timeout: 3000,
          color:"warning"
        });
      } else {
        addToast({
          title: "Error",
          description: "Error al actualizar el producto de control",
          timeout: 3000,
          color:"danger"
        });
      }
    },
  });
};

export const useEliminarProductoControl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarProductoControl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productosControl"] });
      addToast({
        title: "Éxito",
        description: "Producto de control eliminado con éxito",
        timeout: 3000,
        color:"success"
      });
    },
        onError: (error: any) => {
          if (error.response?.status === 403) {
            addToast({
              title: "Acceso denegado",
              description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
              timeout: 3000,
              color:"warning"
            });
          } else {
            addToast({
              title: "Error",
              description: "Error al eliminar el producto de control",
              timeout: 3000,
              color:"danger"
            });
          }
        },
      });
    };
