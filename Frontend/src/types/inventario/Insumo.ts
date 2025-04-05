export interface Insumo {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    unidad_medida: string;
    activo: boolean;
    tipo_empacado: string | null;
    fecha_registro: string;
    fecha_caducidad: string | null;
    fecha_actualizacion: string;
}