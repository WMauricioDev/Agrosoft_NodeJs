import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useVenta } from "@/hooks/finanzas/useVenta";
import { ReuInput } from "@/components/globales/ReuInput";
import { DetalleVenta } from "@/types/finanzas/Venta";
import { usePreciosProductos } from "@/hooks/inventario/usePrecio_Producto";
import Tabla from "@/components/globales/Tabla";
import { Trash2, Edit, Plus, ArrowLeft, Printer, List, ShoppingCart } from 'lucide-react';
import { PagoModal } from "@/components/finanzas/PagoModal";
import { TiqueteModal } from "@/components/finanzas/TiqueteModal";
import { useUnidadesMedida } from "@/hooks/inventario/useInsumo";
import { ModalUnidadMedida } from "@/components/cultivo/ModalUnidadMedida";
import { addToast } from "@heroui/react";

const VentaPage: React.FC = () => {
  const [detalle, setDetalle] = useState<DetalleVenta>({
    producto: 0,
    cantidad: 0,
    unidades_de_medida: 0,
    total: 0,
    producto_nombre: '',
    precio_unitario: 0,
    unidad_medida: ''
  });

  const [detallesAgregados, setDetallesAgregados] = useState<DetalleVenta[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTiqueteModalOpen, setIsTiqueteModalOpen] = useState(false);
  const [ventaIdForTiquete, setVentaIdForTiquete] = useState<number | null>(null);
  const { registrarVenta, isRegistrando, agregarDetalleVenta } = useVenta();
  const { data: precioProducto, isLoading: precioProductoLoading, error: precioProductoError } = usePreciosProductos();
  const navigate = useNavigate();
  const { data: unidadesMedida, isLoading: unidadMedidaLoading } = useUnidadesMedida();
  const [openUnidadesMedidaModal, setOpenUnidadesMedidaModal] = useState(false);

  const handleChange = (field: keyof DetalleVenta) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    console.log(`Cambiando ${field} a ${value} (tipo: ${typeof value})`); // DEBUG
    setDetalle((prev) => ({
      ...prev,
      [field]: field === "cantidad" || field === "producto" || field === "unidades_de_medida" 
        ? Number(value) 
        : value,
    }));
  };

  const agregarDetalle = () => {
    console.log("agregarDetalle called with detalle:", detalle); // DEBUG
    if (!precioProducto || precioProducto.length === 0) {
      console.log("No hay productos disponibles"); // DEBUG
      addToast({
        title: "Error",
        description: "No hay productos disponibles",
        color: "danger",
      });
      return;
    }

    if (detalle.producto === 0) {
      console.log("Producto no seleccionado"); // DEBUG
      addToast({
        title: "Error",
        description: "Por favor, selecciona un producto",
        color: "danger",
      });
      return;
    }

    // Convertir p.id a número para manejar IDs como cadenas
    const productoSeleccionado = precioProducto.find(p => Number(p.id) === detalle.producto);
    if (!productoSeleccionado) {
      console.log("Producto no encontrado para ID:", detalle.producto, "en precioProducto:", precioProducto); // DEBUG
      addToast({
        title: "Error",
        description: `Producto no encontrado para ID ${detalle.producto}`,
        color: "danger",
      });
      return;
    }

    console.log("Llamando a agregarDetalleVenta con productoSeleccionado:", productoSeleccionado); // DEBUG
    agregarDetalleVenta(
      detalle,
      detallesAgregados,
      editIndex,
      productoSeleccionado,
      setDetallesAgregados,
      setEditIndex,
      () => {
        console.log("Reseteando detalle"); // DEBUG
        setDetalle({
          producto: 0,
          cantidad: 0,
          unidades_de_medida: 0,
          total: 0,
          producto_nombre: '',
          precio_unitario: 0,
          unidad_medida: ''
        });
      }
    );
  };

  const handleEdit = (index: number) => {
    const detalleAEditar = detallesAgregados[index];
    setDetalle(detalleAEditar);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const nuevosDetalles = detallesAgregados.filter((_, i) => i !== index);
    setDetallesAgregados(nuevosDetalles);
  };

  const columns = [
    { name: "Producto", uid: "producto" },
    { name: "Cantidad", uid: "cantidad" },
    { name: "Unidad", uid: "unidad" },
    { name: "Precio Unitario", uid: "precio" },
    { name: "Total", uid: "total" },
    { name: "Acciones", uid: "acciones" },
  ];
  
  const transformedData = detallesAgregados.map((detalle, index) => ({
    id: index.toString(),
    producto: detalle.producto_nombre || "Desconocido",
    cantidad: detalle.cantidad.toString(),
    unidad: detalle.unidad_medida || "unidad",
    precio: `$${detalle.precio_unitario.toFixed(2)}`,
    total: `$${detalle.total.toFixed(2)}`,
    acciones: (
      <div className="flex gap-2">
        <button
          className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          onClick={() => handleEdit(index)}
          title="Editar"
        >
          <Edit size={18} />
        </button>
        <button
          className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          onClick={() => handleDelete(index)}
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  }));

  const calcularTotalVenta = () => {
    return detallesAgregados.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleFinalizarVenta = (montoEntregado: number) => {
    registrarVenta({
      monto_entregado: montoEntregado,
      detalles: detallesAgregados
    }).then((ventaRegistrada) => {
      setDetallesAgregados([]);
      setDetalle({
        producto: 0,
        cantidad: 0,
        unidades_de_medida: 0,
        total: 0,
        producto_nombre: '',
        precio_unitario: 0,
        unidad_medida: ''
      });
      setIsModalOpen(false);
      setVentaIdForTiquete(ventaRegistrada.id);
      setIsTiqueteModalOpen(true);
    });
  };

  // Depuración adicional para precioProducto
  React.useEffect(() => {
    console.log("precioProducto:", precioProducto); // DEBUG
    if (precioProductoError) {
      console.error("Error en usePreciosProductos:", precioProductoError); // DEBUG
      addToast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        color: "danger",
      });
    }
  }, [precioProducto, precioProductoError]);

  return (
    <DefaultLayout>
      <ModalUnidadMedida 
        isOpen={openUnidadesMedidaModal} 
        onOpenChange={setOpenUnidadesMedidaModal} 
      />
      
      <div className="w-full flex flex-col items-center min-h-screen p-4 md:p-6 bg-gray-50">
        <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {/* Header con acciones */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/finanzas/listarventas/")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <List size={18} />
                <span>Lista de Ventas</span>
              </button>
            </div>
          </div>
          
          {/* Título principal */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Registro de Venta</h1>
            <p className="text-gray-500">Agrega los productos y completa la transacción</p>
          </div>
          
          {/* Formulario de productos */}
          <div className="w-full bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-green-600" />
              Agregar Producto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
                <select
                  name="producto"
                  value={detalle.producto || 0}
                  onChange={handleChange("producto")}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  disabled={precioProductoLoading}
                >
                  <option value="0">Seleccione un producto</option>
                  {precioProducto?.map((producto) => (
                    <option key={producto.id} value={Number(producto.id)}>
                      {producto.nombre_cultivo || producto.nombre_producto || 'Producto'} - ${Number(producto.precio).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <ReuInput
                  label="Cantidad *"
                  placeholder="Ej: 2"
                  type="number"
                  min="1"
                  value={String(detalle.cantidad)}
                  onChange={(e) => {
                    console.log("Cantidad cambiada a:", e.target.value); // DEBUG
                    setDetalle({...detalle, cantidad: parseInt(e.target.value) || 0})
                  }}
                />
                {detalle.producto !== 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Stock disponible: {precioProducto?.find(p => Number(p.id) === detalle.producto)?.stock ?? 'N/A'}
                  </p>
                )}
              </div>

              {/* Unidad de medida */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                  <button 
                    className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                    onClick={() => setOpenUnidadesMedidaModal(true)}
                    type="button"
                  >
                    <Plus size={14} />
                    <span>Agregar unidad</span>
                  </button>
                </div>
                <select
                  value={detalle.unidades_de_medida}
                  onChange={handleChange("unidades_de_medida")}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={unidadMedidaLoading}
                >
                  <option value="0">Seleccione una unidad</option>
                  {unidadesMedida?.map((unidad) => (
                    <option key={unidad.id} value={unidad.id}>
                      {unidad.nombre?.toString() || 'Unidad'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  detalle.producto === 0 || detalle.cantidad <= 0 || detalle.unidades_de_medida === 0 || precioProductoLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                }`}
                onClick={() => agregarDetalle()}
                disabled={detalle.producto === 0 || detalle.cantidad <= 0 || detalle.unidades_de_medida === 0 || precioProductoLoading}
              >
                {editIndex !== null ? (
                  <>
                    <Edit size={18} />
                    <span>Actualizar Producto</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Agregar Producto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lista de productos agregados */}
          {detallesAgregados.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Productos en la venta</h3>
                <span className="text-sm text-gray-500">
                  {detallesAgregados.length} {detallesAgregados.length === 1 ? 'producto' : 'productos'} agregados
                </span>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xs">
                <Tabla columns={columns} data={transformedData} />
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700">
                  Total de la venta: <span className="text-2xl text-green-600 ml-2">${calcularTotalVenta().toFixed(2)}</span>
                </div>

                <button
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    isRegistrando || detallesAgregados.length === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                  }`}
                  disabled={isRegistrando || detallesAgregados.length === 0}
                  onClick={() => setIsModalOpen(true)}
                >
                  <Printer size={18} />
                  <span>{isRegistrando ? "Procesando..." : "Finalizar Venta"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {detallesAgregados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <ShoppingCart size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No hay productos agregados</h3>
              <p className="text-gray-400 text-center max-w-md">
                Comienza agregando productos usando el formulario superior. <br />
                Todos los campos marcados con * son obligatorios.
              </p>
            </div>
          )}
        </div>

        {/* Modales */}
        <PagoModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          total={calcularTotalVenta()}
          onConfirm={handleFinalizarVenta}
        />
        
        <TiqueteModal
          isOpen={isTiqueteModalOpen}
          onOpenChange={setIsTiqueteModalOpen}
          ventaId={ventaIdForTiquete}
        />
      </div>
    </DefaultLayout>
  );
};

export default VentaPage;