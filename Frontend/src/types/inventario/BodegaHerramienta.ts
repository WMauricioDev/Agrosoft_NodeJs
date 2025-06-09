export interface BodegaHerramienta {
    id: number;
    bodega_id: number;
    herramienta_id: number;
    cantidad: number;
    creador_id?: number;
    costo_total: number | string | null;
    cantidad_prestada: number;
}