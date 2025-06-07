import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { ViewMode, ViewModeSelectorProps } from "@/types/iot/iotmqtt";

// Definir modos de vista
const viewModes: ViewMode[] = [
  { id: "realtime", label: "Tiempo Real" },
  { id: "allData", label: "Todos los Datos" },
];

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ selectedViewMode, setSelectedViewMode }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-4xl w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Modo de Visualizacion</h3>
      {// Menu desplegable para seleccionar modo de vista
      }
      <Listbox value={selectedViewMode} onChange={setSelectedViewMode}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-blue-100 py-2 pl-3 pr-10 text-left text-gray-700 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-sm">
            <span className="block truncate">{selectedViewMode.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm z-10">
              {viewModes.map((mode) => (
                <Listbox.Option
                  key={mode.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                  value={mode}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {mode.label}
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