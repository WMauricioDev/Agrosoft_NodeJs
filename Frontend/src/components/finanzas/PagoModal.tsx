import React, { useState } from "react";
import ReuModal from "@/components/globales/ReuModal";
import { ReuInput } from "@/components/globales/ReuInput";

interface PagoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: (montoEntregado: number) => void;
}

export const PagoModal: React.FC<PagoModalProps> = ({
  isOpen,
  onOpenChange,
  total,
  onConfirm,
}) => {
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split("T")[0]);
  const [montoEntregado, setMontoEntregado] = useState(0);
  const [cambio, setCambio] = useState(0);

  const setQuickPay = (amount: number | 'total') => {
    const newAmount = amount === 'total' ? total : amount;
    setMontoEntregado(newAmount);
    setCambio(newAmount - total);
  };

  const handleMontoEntregadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setMontoEntregado(value);
    setCambio(value - total);
  };

  const handleConfirm = () => {
    onConfirm(montoEntregado);
  };

  return (
    <ReuModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Detalles de Pago"
      size="lg"
      onConfirm={handleConfirm}
      confirmText="Confirmar Pago"
    >
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Valor Total: ${total.toFixed(2)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <ReuInput
          label="Fecha de Pago"
          type="date"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
        />

        <ReuInput
          label="Monto Entregado"
          type="number"
          placeholder="Ingrese el monto entregado"
          value={montoEntregado}
          onChange={handleMontoEntregadoChange}
        />

        <ReuInput
          label="Cambio"
          type="number"
          value={cambio.toFixed(2)}
          readOnly
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Opciones Rápidas de Pago</label>
          <div className="flex flex-wrap gap-2">
            {[20000, 10000, 5000, 50000, 1000].map((amount) => (
              <button
                key={amount}
                type="button"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                onClick={() => setQuickPay(amount)}
              >
                ${amount.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              onClick={() => setQuickPay('total')}
            >
              Valor Total
            </button>
          </div>
        </div>
      </div>
    </ReuModal>
  );
};