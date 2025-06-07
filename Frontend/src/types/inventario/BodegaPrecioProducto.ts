export interface BodegaPrecioProducto {
    id: number;
    bodega: number;
    producto: number;
    precio: number;
    cantidad: number;
    creador?: number;
    fecha_creacion: string;
}