import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { PrecioProducto, UnidadMedida } from "@/types/inventario/Precio_producto";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/inv/precio-producto/`;

const fetchPreciosProductos = async (): Promise<PrecioProducto[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    const response = await api.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Datos de la API (preciosProductos):", response.data);
    return response.data.map((item: any) => ({
        id: item.id,
cosecha: item.nombre_producto
  ? {
      id: item.Producto_id,
      nombre: item.nombre_producto || ""
    }
  : null,
        nombre_cultivo: item.nombre_producto|| "",
        unidad_medida: item.unidad_medida_id
            ? {
                  id: item.unidad_medida_id.id,
                  nombre: item.unidad_medida_id.nombre,
                  descripcion: item.unidad_medida_id.descripcion || null,
                  creada_por_usuario: item.unidad_medida_id.creada_por_usuario || false,
                  fecha_creacion: item.unidad_medida_id.fecha_creacion,
              }
            : null,
        precio: Number(item.precio),
        fecha_registro: item.fecha_registro,
        stock: Number(item.stock),
        fecha_caducidad: item.fecha_caducidad || null,
    }));
};

export const usePreciosProductos = () => {
    return useQuery({
        queryKey: ["preciosProductos"],
        queryFn: fetchPreciosProductos,
        staleTime: 1000 * 60,
        refetchInterval:1000,
    });
};

const fetchUnidadesMedida = async (): Promise<UnidadMedida[]> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    const response = await api.get(`${API_URL}unidades_medida/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const useUnidadesMedida = () => {
    return useQuery({
        queryKey: ["unidadesMedida"],
        queryFn: fetchUnidadesMedida,
        staleTime: 1000 * 60,
    });
};

const registrarPrecioProducto = async (
    precioProducto: Omit<PrecioProducto, "id" | "unidad_medida"> & {
        unidad_medida_id?: number;
    }
) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    if (!precioProducto.unidad_medida_id) {
        throw new Error("Debe seleccionar una unidad de medida válida.");
    }
    try {
        const payload = {
            Producto_id: precioProducto.cosecha_id || null,
            unidad_medida_id: precioProducto.unidad_medida_id,
            precio: precioProducto.precio,
            fecha_registro: precioProducto.fecha_registro,
            stock: precioProducto.stock,
            fecha_caducidad: precioProducto.fecha_caducidad,
        };
        console.log("Payload enviado (registrar):", payload);
        const response = await api.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useRegistrarPrecioProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registrarPrecioProducto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["preciosProductos"] });
            addToast({
                title: "Éxito",
                description: "Precio de producto registrado con éxito",
                timeout: 3000,
                color: "success"
            });
        },
        onError: (error: any) => {
            console.error("Error completo:", error.response?.data);
            addToast({
                title: "Error",
                description:
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Error al registrar el precio de producto",
                timeout: 3000,
                color: "danger"
            });
            if (error.response?.status === 403) {
                addToast({
                    title: "Acceso denegado",
                    description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
                    timeout: 3000,
                    color: "danger"
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error al registrar el precio del producto",
                    timeout: 3000,
                    color: "danger"
                });
            }
        },
    });
};

const actualizarPrecioProducto = async (
    id: number,
    precioProducto: PrecioProducto
) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    try {
        const data = {
            Producto_id: precioProducto.cosecha_id || null,
            unidad_medida_id: precioProducto.unidad_medida_id?.id || null,
            precio: precioProducto.precio,
            fecha_registro: precioProducto.fecha_registro,
            stock: precioProducto.stock,
            fecha_caducidad: precioProducto.fecha_caducidad,
        };
        console.log("Payload enviado (actualizar):", data);
        const response = await api.put(`${API_URL}${id}/`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useActualizarPrecioProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            precioProducto,
        }: {
            id: number;
            precioProducto: PrecioProducto;
        }) => actualizarPrecioProducto(id, precioProducto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["preciosProductos"] });
            addToast({
                title: "Éxito",
                description: "Precio de producto actualizado con éxito",
                timeout: 3000,
                color: "success"
            });
        },
        onError: (error: any) => {
            console.error("Error completo:", error.response?.data);
            addToast({
                title: "Error",
                description:
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Error al actualizar el precio de producto",
                timeout: 3000,
                color: "danger"
            });
            if (error.response?.status === 403) {
                addToast({
                    title: "Acceso denegado",
                    description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
                    timeout: 3000,
                    color: "danger"
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error al actualizar el precio del producto",
                    timeout: 3000,
                    color: "danger"
                });
            }
        },
    });
};

const eliminarPrecioProducto = async (id: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    try {
        const response = await api.delete(`${API_URL}${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useEliminarPrecioProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: eliminarPrecioProducto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["preciosProductos"] });
            addToast({
                title: "Éxito",
                description: "Precio de producto eliminado con éxito",
                timeout: 3000,
                color: "success"
            });
        },
        onError: (error: any) => {
            console.error("Error completo:", error.response?.data);
            addToast({
                title: "Error",
                description:
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "No se pudo eliminar el precio de producto",
                timeout: 3000,
                color: "danger"
            });
            if (error.response?.status === 403) {
                addToast({
                    title: "Acceso denegado",
                    description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
                    timeout: 3000,
                    color: "danger"
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error al eliminar el precio del producto",
                    timeout: 3000,
                    color: "danger"
                });
            }
        },
    });
};

const crearUnidadMedida = async (
    unidad: Omit<UnidadMedida, "id" | "fecha_creacion" | "creada_por_usuario">
) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No se encontró el token de autenticación.");
    try {
        const response = await api.post(
            `${API_URL}crear_unidad_medida/`,
            unidad,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error en la API:", error.response?.data);
        throw error;
    }
};

export const useCrearUnidadMedida = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: crearUnidadMedida,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["unidadesMedida"] });
            addToast({
                title: "Éxito",
                description: "Unidad de medida creada con éxito",
                timeout: 3000,
                color: "success"
            });
        },
        onError: (error: any) => {
            console.error("Error completo:", error.response?.data);
            addToast({
                title: "Error",
                description:
                    error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Error al crear la unidad de medida",
                timeout: 3000,
                color: "danger"
            });
            if (error.response?.status === 403) {
                addToast({
                    title: "Acceso denegado",
                    description: "No tienes permiso para realizar esta acción, contacta a un adminstrador.",
                    timeout: 3000,
                    color: "danger"
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Error al crear unidad de medida",
                    timeout: 3000,
                    color: "danger"
                });
            }
        },
    });
};