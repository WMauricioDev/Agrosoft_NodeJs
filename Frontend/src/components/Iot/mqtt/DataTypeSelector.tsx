import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FaTemperatureHigh, FaTint } from "react-icons/fa";
import { motion } from "framer-motion";
import { DataType, DataTypeSelectorProps } from "@/types/iot/iotmqtt";

// Definir tipos de datos para selección
const dataTypes: DataType[] = [
  {
    label: "Temperatura (°C)",
    key: "temperatura",
    icon: <FaTemperatureHigh className="text-red-500" />,
    tipo_sensor: "temperatura",
    decimals: 3,
  },
  {
    label: "Humedad (%)",
    key: "humedad_ambiente",
    icon: <FaTint className="text-blue-500" />,
    tipo_sensor: "humedad_ambiente",
    decimals: 1,
  },
];

export const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({ selectedDataType, setSelectedDataType }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4 w-56 h-32 flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tipo de Dato</h3>
      <Listbox value={selectedDataType} onChange={setSelectedDataType}>
        <div className="relative w-full">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-blue-100 py-2 pl-3 pr-10 text-left text-gray-700 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-sm">
            <span className="flex items-center gap-2">
              {selectedDataType.icon}
              {selectedDataType.label}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm z-10">
              {dataTypes.map((type) => (
                <Listbox.Option
                  key={type.key}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                  value={type}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        <div className="flex items-center gap-2">{type.icon} {type.label}</div>
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </motion.div>
  );
};