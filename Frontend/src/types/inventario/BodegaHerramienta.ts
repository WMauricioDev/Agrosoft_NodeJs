export interface BodegaHerramienta {
    id: number;
    bodega: number;
    herramienta: number;
    cantidad: number;
    creador?: number;
    costo_total: number | string | null;
    cantidad_prestada: number;
}