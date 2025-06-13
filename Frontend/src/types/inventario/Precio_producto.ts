export interface UnidadMedida {
    id: number;
    nombre: string;
    descripcion: string | null;
    creada_por_usuario: boolean;
    fecha_creacion: string;
}

export interface PrecioProducto {
    id: number;
    cosecha_id: number | null; 
    nombre_cultivo: string;
    unidad_medida_id: UnidadMedida | null;
    precio: number;
    fecha_registro: string;
    stock: number;
    fecha_caducidad: string | null;
}