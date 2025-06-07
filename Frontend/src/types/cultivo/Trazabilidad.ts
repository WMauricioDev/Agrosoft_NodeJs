export type TrazabilidadItem = {
  tipo: "Cosecha" | "Actividad" | "Siembra" | "Otro";
  fecha: string;
  datos: {
    cantidad?: number;
    nombre?: string;
    tipoActividad?: string;
    [key: string]: any;
  };
};