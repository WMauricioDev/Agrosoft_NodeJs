import pool from "../../usuarios/database/Conexion.js";

export const postConfiguracion = async (req, res) => {
    try {
        const { parametros, fk_sensores } = req.body;
        const sql = "INSERT INTO configuraciones (parametros, fk_sensores) VALUES ($1, $2)";
        const rows = await pool.query(sql, [parametros, fk_sensores]);
        
        if (rows.rowCount > 0) {
            return res.status(200).json({ "message": "configuracion registrado correctamente" });
        } else {
            return res.status(404).json({ "message": "No se pudo registrar configuracion" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getConfiguracion = async (req, res) => {
    try {
        const sql = `SELECT 
                        c.id, 
                        c.parametros, 
                        c.fk_sensores, 
                        s.id_sensor, 
                        s.nombre AS nombre_sensor, 
                        s.tipo_sensor, 
                        s.unidad_medida, 
                        s.medida_min, 
                        s.medida_max
                    FROM configuraciones c
                    JOIN sensores s ON c.fk_sensores = s.id_sensor`;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const configuraciones = result.rows.map(config => ({
                id: config.id,
                parametros: config.parametros,
                fk_sensores: config.id_sensor 
                    ? {
                        id_sensor: config.id_sensor,
                        nombre: config.nombre_sensor,
                        tipo_sensor: config.tipo_sensor,
                        unidad_medida: config.unidad_medida,
                        medida_min: config.medida_min,
                        medida_max: config.medida_max
                    }
                    : null
            }));

            return res.status(200).json({ configuraciones });
        } else {
            return res.status(404).json({ msg: "No hay configuraciones registradas" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const IdConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT 
                        c.id, 
                        c.parametros, 
                        c.fk_sensores, 
                        s.id_sensor, 
                        s.nombre AS nombre_sensor, 
                        s.tipo_sensor, 
                        s.unidad_medida, 
                        s.medida_min, 
                        s.medida_max
                    FROM configuraciones c
                    LEFT JOIN sensores s ON c.fk_sensores = s.id_sensor
                    WHERE c.id = $1`;

        const result = await pool.query(sql, [id]);

        if (result.rows.length > 0) {
            const configuracion = result.rows.map(config => ({
                id: config.id,
                parametros: config.parametros,
                fk_sensores: config.id_sensor
                    ? {
                        id_sensor: config.id_sensor,
                        nombre: config.nombre_sensor,
                        tipo_sensor: config.tipo_sensor,
                        unidad_medida: config.unidad_medida,
                        medida_min: config.medida_min,
                        medida_max: config.medida_max
                    }
                    : null
            }));

            return res.status(200).json({ configuracion });
        } else {
            return res.status(404).json({ msg: "No se encontró la configuración" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};

export const actualizarConfiguracion = async (req, res) => {
    try {
        const { parametros, fk_sensores } = req.body;
        const id = req.params.id;

        const sql = "UPDATE configuraciones SET parametros=$1, fk_sensores=$2 WHERE id=$3";
        const { rowCount } = await pool.query(sql, [parametros, fk_sensores, id]);

        if (rowCount > 0) {
            return res.status(200).json({ message: "Configuración editada correctamente." });
        } else {
            return res.status(404).json({ message: "No se pudo editar la configuración." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};
