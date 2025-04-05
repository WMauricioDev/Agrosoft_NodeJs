import pool from "../../usuarios/database/Conexion.js"

export const postDatoMeteorologico = async (req, res) => {
    try {
        const { fecha_hora, tipo_dato, valor, fk_sensor_bancal } = req.body;
        const sql = "INSERT INTO Datos_Meteorologicos (fecha_hora, tipo_dato, valor, fk_sensor_bancal) VALUES ($1, $2, $3, $4)";
        
        const result = await pool.query(sql, [fecha_hora, tipo_dato, valor, fk_sensor_bancal]);

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Dato meteorológico registrado correctamente" });
        } else {
            return res.status(400).json({ message: "No se pudo registrar el dato meteorológico" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getDatosMeteorologicos = async (req, res) => {
    try {
        
        const sql = `SELECT
                dm.id_dato_meteorologico,
                dm.fecha_hora,
                dm.tipo_dato,
                dm.valor,
                dm.fk_sensor_bancal,
                sb.id AS sensor_bancal_id,  
                sb.fk_sensor,
                sb.fk_bancal,
                b.id AS bancal_id,
                b.fk_lote,
                b.tamx,
                b.tamy,
                b.posx,
                b.posy,
                l.id AS lote_id,
                l.nombre AS nombre_lote,
                l.descripcion,
                l.tamx AS lote_tamx,
                l.tamy AS lote_tamy,
                l.estado,
                l.posx AS lote_posx,
                l.posy AS lote_posy
            FROM datos_meteorologicos dm
            JOIN sensores_bancal sb ON dm.fk_sensor_bancal = sb.id
            JOIN bancal b ON sb.fk_bancal = b.id
            JOIN lotes l ON b.fk_lote = l.id`;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const datosMeteorologicos = result.rows.map(dm => ({
                id_dato_meteorologico: dm.id_dato_meteorologico,
                fecha_hora: dm.fecha_hora,
                tipo_dato: dm.tipo_dato,
                valor: dm.valor,
                sensor_bancal: {
                    id: dm.sensor_bancal_id,
                    fk_sensor: dm.fk_sensor,
                    fk_bancal: dm.fk_bancal,
                },
                bancal: {
                    id: dm.bancal_id,
                    fk_lote: dm.fk_lote,
                    tamx: dm.tamx,
                    tamy: dm.tamy,
                    posx: dm.posx,
                    posy: dm.posy,
                },
                lotes: {
                    id: dm.lote_id,
                    nombre: dm.nombre_lote,
                    descripcion: dm.descripcion,
                    tamx: dm.lote_tamx,
                    tamy: dm.lote_tamy,
                    estado: dm.estado,
                    posx: dm.lote_posx,
                    posy: dm.lote_posy,
                }
            }));

            res.status(200).json({ datosMeteorologicos });
        } else {
            res.status(404).json({ msg: 'No hay datos meteorológicos registrados' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const IdDatoMeteorologico = async (req, res) => {
    try {
        const { id_dato_meteorologico } = req.params;
        const sql = `SELECT
                        dm.id_dato_meteorologico,
                        dm.fecha_hora,
                        dm.tipo_dato,
                        dm.valor,
                        dm.fk_sensor_bancal,
                        sb.id AS sensor_bancal_id,  
                        sb.fk_sensor,
                        sb.fk_bancal,
                        b.id AS bancal_id,
                        b.fk_lote,
                        b.tamx,
                        b.tamy,
                        b.posx,
                        b.posy,
                        l.id AS lote_id,
                        l.nombre AS nombre_lote,
                        l.descripcion,
                        l.tamx AS lote_tamx,
                        l.tamy AS lote_tamy,
                        l.estado,
                        l.posx AS lote_posx,
                        l.posy AS lote_posy
                    FROM datos_meteorologicos dm
                    JOIN sensores_bancal sb ON dm.fk_sensor_bancal = sb.id
                    JOIN bancal b ON sb.fk_bancal = b.id
                    JOIN lotes l ON b.fk_lote = l.id
                    WHERE dm.id_dato_meteorologico = $1`;

        const result = await pool.query(sql, [id_dato_meteorologico]);

        if (result.rows.length > 0) {
            const datoMeteorologico = {
                id_dato_meteorologico: result.rows[0].id_dato_meteorologico,
                fecha_hora: result.rows[0].fecha_hora,
                tipo_dato: result.rows[0].tipo_dato,
                valor: result.rows[0].valor,
                sensor_bancal: {
                    id: result.rows[0].sensor_bancal_id,
                    fk_sensor: result.rows[0].fk_sensor,
                    fk_bancal: result.rows[0].fk_bancal,
                },
                bancal: {
                    id: result.rows[0].bancal_id,
                    fk_lote: result.rows[0].fk_lote,
                    tamx: result.rows[0].tamx,
                    tamy: result.rows[0].tamy,
                    posx: result.rows[0].posx,
                    posy: result.rows[0].posy,
                },
                lote: {
                    id: result.rows[0].lote_id,
                    nombre: result.rows[0].nombre_lote,
                    descripcion: result.rows[0].descripcion,
                    tamx: result.rows[0].lote_tamx,
                    tamy: result.rows[0].lote_tamy,
                    estado: result.rows[0].estado,
                    posx: result.rows[0].lote_posx,
                    posy: result.rows[0].lote_posy,
                }
            };

            return res.status(200).json({ datoMeteorologico });
        } else {
            return res.status(404).json({ message: "Dato meteorológico no encontrado" });
        }
    } catch (error) {
        console.error("Error en IdDatoMeteorologico:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const actualizarDatoMeteorologico = async (req, res) => {
    try {
        const { fecha_hora, tipo_dato, valor, fk_sensor_bancal } = req.body;
        const id = req.params.id_dato_meteorologico;

        const sql = `UPDATE Datos_Meteorologicos 
                     SET fecha_hora = $1, tipo_dato = $2, valor = $3, fk_sensor_bancal = $4 
                     WHERE id_dato_meteorologico = $5`;
        
        const { rowCount } = await pool.query(sql, [fecha_hora, tipo_dato, valor, fk_sensor_bancal, id]);

        if (rowCount > 0) {
            return res.status(200).json({ message: "Dato meteorológico actualizado correctamente." });
        } else {
            return res.status(404).json({ message: "No se pudo actualizar el dato meteorológico." });
        }
    } catch (error) {
        console.error("Error en actualizarDatoMeteorologico:", error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};