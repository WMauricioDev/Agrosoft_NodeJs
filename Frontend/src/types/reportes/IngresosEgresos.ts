export interface IngresosEgresos {
    resumen: {
        fecha_inicio: string;
        fecha_fin: string;
        total_ingresos: number;
        total_egresos: number;
        balance_neto: number;
        total_cantidad: number;
        total_transacciones_ingresos: number;
        total_transacciones_egresos: number;
    };
    por_mes: {
        meses: string[];
        ingresos: number[];
        egresos: number[];
        balance: number[];
        cantidadesVendidas: number[];
        transaccionesIngresos: number[];
        transaccionesEgresos: number[];
    };
}