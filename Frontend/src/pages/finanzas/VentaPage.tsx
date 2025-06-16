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

const VentaPage: React.FC = () => {
  const [detalle, setDetalle] = useState<DetalleVenta>({
    producto_id: 0,
    cantidad: 0,
    unidades_de_medida_id: 0,
    total: 0,
  });

  const [detallesAgregados, setDetallesAgregados] = useState<DetalleVenta[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTiqueteModalOpen, setIsTiqueteModalOpen] = useState(false);
  const [ventaIdForTiquete, setVentaIdForTiquete] = useState<number | null>(null);
  const { registrarVenta, isRegistrando } = useVenta();
  const { agregarDetalleVenta } = useVenta();
  const { data: precio_producto, isLoading: precioProductoLoading } = usePreciosProductos();
  const navigate = useNavigate();
  const { data: unidadesMedida, isLoading: loadingUnidadesMedida } = useUnidadesMedida();
  const [openUnidadesMedidaModal, setOpenUnidadesMedidaModal] = useState(false);

  const handleChange = (field: keyof DetalleVenta) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setDetalle((prev) => ({
      ...prev,
      [field]: field === "cantidad" || field === "producto_id" || field === "unidades_de_medida_id" 
        ? Number(value) 
        : value,
    }));
  };

  const agregarDetalle = () => {
    const productoSeleccionado = precio_producto?.find(p => p.id=== detalle.producto_id);
    if (!productoSeleccionado) {
      alert("Seleccione un producto válido.");
      return;
    }
  
    if (detalle.cantidad > productoSeleccionado.stock) {
      alert(`La cantidad solicitada (${detalle.cantidad}) excede el stock disponible (${productoSeleccionado.stock}).`);
      return;
    }
  
    if (detalle.unidades_de_medida_id === 0) {
      alert("Seleccione una unidad de medida.");
      return;
    }
  
    agregarDetalleVenta(
      detalle,
      detallesAgregados,
      editIndex,
      productoSeleccionado,
      setDetallesAgregados,
      setEditIndex,
      () =>
        setDetalle({
          producto_id: 0,
          cantidad: 0,
          unidades_de_medida_id: 0,
          total: 0,
        })
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
  
  const transformedData = detallesAgregados.map((detalle, index) => {
    const productoSeleccionado = precio_producto?.find(p => p.id === detalle.producto_id);
    const productoNombre = productoSeleccionado?.nombre_cultivo || "Desconocido";

    const unidadNombre = unidadesMedida?.find(u => u.id === detalle.unidades_de_medida_id)?.nombre?.toString() || "unidad";
    const precio = productoSeleccionado?.precio || 0;
    const total = detalle.total || 0;
    
    return {
      id: index.toString(),
      producto: productoNombre,
      cantidad: detalle.cantidad.toString(),
      unidad: unidadNombre,
      precio: `$${precio.toFixed(2)}`,
      total: `$${total.toFixed(2)}`,
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
    };
  });

  const calcularTotalVenta = () => {
    return detallesAgregados.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleFinalizarVenta = (montoEntregado: number) => {
    const fechaActual = new Date().toISOString();
    
    registrarVenta(
      {
        fecha: fechaActual,
        monto_entregado: montoEntregado,
        cambio: montoEntregado - calcularTotalVenta(),
        detalles: detallesAgregados
      }, 
      {
        onSuccess: (ventaRegistrada) => {
          setDetallesAgregados([]);
          setDetalle({
            producto_id: 0,
            cantidad: 0,
            unidades_de_medida_id: 0,
            total: 0,
          });
          setIsModalOpen(false);
          
          setVentaIdForTiquete(ventaRegistrada.id ?? null);
          setIsTiqueteModalOpen(true);
        },
      }
    );
  };

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
                  name="producto_id"
                  value={detalle.producto_id || ""}
                  onChange={handleChange("producto_id")}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  disabled={precioProductoLoading}
                >
                  <option value="0">Seleccione un producto</option>
                  {precio_producto?.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.id || 'Producto'} - ${producto.precio?.toFixed(2) || '0.00'}
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
                  onChange={(e) => setDetalle({...detalle, cantidad: parseInt(e.target.value) || 0})}
                />

                    {detalle.producto_id !== 0 && (
           <p className="text-sm text-gray-500 mt-1">
           Stock disponible: {
              precio_producto?.find(p => p.id === detalle.producto_id)?.stock ?? 'N/A'
            }
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
                  value={detalle.unidades_de_medida_id}
                  onChange={handleChange("unidades_de_medida_id")}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  disabled={loadingUnidadesMedida}
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
                  detalle.producto_id === 0 || detalle.cantidad <= 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  agregarDetalle();
                }}
                disabled={detalle.producto_id === 0 || detalle.cantidad <= 0}
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