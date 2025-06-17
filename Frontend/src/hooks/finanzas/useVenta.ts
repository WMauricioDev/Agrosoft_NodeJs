import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/components/utils/axios";
import { addToast } from "@heroui/react";
import { Venta, DetalleVenta } from "@/types/finanzas/Venta";
import { PrecioProducto } from "@/types/inventario/Precio_producto";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/fin/venta/`;

interface CreateVentaData {
  monto_entregado: number;
  detalles: Omit<DetalleVenta, 'id' | 'producto_nombre' | 'precio_unitario' | 'unidad_medida'>[];
}

const fetchVentas = async (): Promise<Venta[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token no encontrado");
  const response = await api.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const registrarVenta = async (ventaData: CreateVentaData): Promise<Venta> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token no encontrado");

  const payload = {
    monto_entregado: ventaData.monto_entregado,
    detalles: ventaData.detalles.map(detalle => ({
      producto: detalle.producto,
      cantidad: detalle.cantidad,
      unidades_de_medida: detalle.unidades_de_medida,
      total: detalle.total
    }))
  };

  console.log("Enviando venta:", payload); // DEBUG

  const response = await api.post(API_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const eliminarVenta = async (id: number): Promise<void> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token no encontrado");

  await api.delete(`${API_URL}${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const fetchDetallesVenta = async (ventaId: number): Promise<DetalleVenta[]> => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Token no encontrado");
  
  const response = await api.get(`${API_URL}${ventaId}/detalles/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useVenta = () => {
  const queryClient = useQueryClient();

  const ventasQuery = useQuery<Venta[], Error>({
    queryKey: ["ventas"],
    queryFn: fetchVentas,
  });

  const registrarMutation = useMutation({
    mutationFn: registrarVenta,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      addToast({
        title: "Éxito",
        description: "Venta registrada con éxito",
        color: "success",
      });
      return data; 
    },
    onError: (error: any) => {
      console.error("Error detalle:", error.response?.data);
      addToast({
        title: "Error",
        description: `Error al registrar venta: ${error.response?.data?.message || error.message}`,
        color: "danger",
      });
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: eliminarVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      addToast({
        title: "Éxito",
        description: "Venta eliminada con éxito",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Error detalle:", error.response?.data);
      addToast({
        title: "Error",
        description: `Error al eliminar venta: ${error.response?.data?.message || error.message}`,
        color: "danger",
      });
    },
  });

const agregarDetalleVenta = (
  detalle: DetalleVenta,
  detallesActuales: DetalleVenta[],
  editIndex: number | null,
  productoSeleccionado: PrecioProducto,
  setDetalles: (d: DetalleVenta[]) => void,
  setEditIndex: (i: number | null) => void,
  resetDetalle: () => void
) => {
  const cantidadYaAgregada = detallesActuales
    .filter(d => d.producto === detalle.producto)
    .reduce((sum, d) => sum + d.cantidad, 0);

  const cantidadEditando =
    editIndex !== null && detallesActuales[editIndex]?.producto === detalle.producto
      ? detallesActuales[editIndex].cantidad
      : 0;

  const cantidadTotal = cantidadYaAgregada - cantidadEditando + detalle.cantidad;

  if (cantidadTotal > productoSeleccionado.stock) {
    addToast({
      title: "Stock insuficiente",
      description: `Stock disponible: ${productoSeleccionado.stock}, solicitado: ${cantidadTotal}`,
      color: "danger",
    });
    return;
  }

  const nuevoDetalle: DetalleVenta = {
    ...detalle,
    total: detalle.cantidad * Number(productoSeleccionado.precio || 0),
    unidades_de_medida: detalle.unidades_de_medida || productoSeleccionado.unidad_medida?.id || 0,
    producto_nombre: productoSeleccionado.nombre_cultivo || 'Desconocido',
    precio_unitario: Number(productoSeleccionado.precio || 0),
    unidad_medida: productoSeleccionado.unidad_medida?.nombre || 'unidad'
  };

  if (editIndex !== null) {
    const nuevosDetalles = [...detallesActuales];
    nuevosDetalles[editIndex] = nuevoDetalle;
    setDetalles(nuevosDetalles);
    setEditIndex(null);
  } else {
    setDetalles([...detallesActuales, nuevoDetalle]);
  }

  resetDetalle();
};

  const useDetallesVenta = (ventaId: number) => {
    return useQuery<DetalleVenta[], Error>({
      queryKey: ["ventas", ventaId, "detalles"],
      queryFn: () => fetchDetallesVenta(ventaId),
      enabled: !!ventaId,
    });
  };

  return {
    ventas: ventasQuery.data ?? [],
    isLoading: ventasQuery.isLoading,
    isError: ventasQuery.isError,
    error: ventasQuery.error,
    registrarVenta: registrarMutation.mutateAsync,
    isRegistrando: registrarMutation.isPending,
    eliminarVenta: eliminarMutation.mutate,
    isEliminando: eliminarMutation.isPending,
    useDetallesVenta, 
    agregarDetalleVenta,
  };
};