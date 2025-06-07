import React, { FormEvent } from "react";
import { Spinner } from "@heroui/react";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
  buttonText?: string;
  isSubmitting?: boolean;
}

const Formulario: React.FC<FormContainerProps> = ({
  title,
  children,
  onSubmit,
  className = "",
  buttonText = "Guardar",
  isSubmitting = false,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className={`flex justify-center items-center min-h-[calc(100vh-5rem)] py-6 px-4 ${className}`}>
      <div className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl border border-gray-200">
        <h1
          id="form-title"
          className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight"
        >
          {title}
        </h1>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:gap-8"
          onSubmit={handleSubmit}
          aria-labelledby="form-title"
        >
          {children}
          <div className="col-span-1 sm:col-span-2 flex justify-center mt-4 sm:mt-6 md:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] px-4 py-2 sm:py-3 rounded-lg text-white font-medium text-sm sm:text-base uppercase tracking-wide transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <Spinner
                  label="Procesando..."
                  variant="default"
                  color="white"
                  size="sm"
                  className="mx-auto"
                />
              ) : (
                buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formulario;