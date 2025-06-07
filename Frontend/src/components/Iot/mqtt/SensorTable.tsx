import React from "react";
import { motion } from "framer-motion";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SensorTableProps } from "@/types/iot/iotmqtt";

const columnHelper = createColumnHelper<SensorTableProps["realTimeData"][0]>();

const columns = [
  columnHelper.accessor("device_code", {
    header: "Sensor",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("fecha_medicion", {
    header: "Fecha",
    cell: (info) =>
      new Date(info.getValue()).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
  }),
  columnHelper.accessor("temperatura", {
    header: "Temperatura (°C)",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "number" ? value.toFixed(3) : "N/A";
    },
  }),
  columnHelper.accessor("humedad_ambiente", {
    header: "Humedad (%)",
    cell: (info) => {
      const value = info.getValue();
      return typeof value === "number" ? value.toFixed(1) : "N/A";
    },
  }),
];

export const SensorTable: React.FC<SensorTableProps> = ({ realTimeData }) => {
  const table = useReactTable({
    data: realTimeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Datos del Sensor</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {realTimeData.length === 0 && (
        <p className="text-gray-600 text-center mt-4">No hay datos disponibles.</p>
      )}
    </motion.div>
  );
};

export default SensorTable;