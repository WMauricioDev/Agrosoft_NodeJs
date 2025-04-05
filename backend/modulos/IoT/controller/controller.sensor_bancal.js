import pool from "../../usuarios/database/Conexion.js";

export const postSensorBancal = async (req, res) => {
    try {
        const { fk_sensor, fk_bancal } = req.body;
        const sql = "INSERT INTO Sensores_Bancal(fk_sensor, fk_bancal) VALUES($1, $2)";
        const rows = await pool.query(sql, [fk_sensor, fk_bancal]);

        if (rows.rowCount > 0) {
            return res.status(200).json({ "message": "registrada correctamente" });
        } else {
            return res.status(404).json({ "message": "No se pudo registrar el dato" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getSensorBancal = async (req, res) => {
    try {
        const sql = `SELECT 
                    sb.id,
                    sb.fk_sensor,
                    sb.fk_bancal,
                    s.nombre AS sensor_nombre,
                    s.fk_tipo_sensor,
                    b.id AS bancal_id,
                    b.fk_lote,
                    b.tamx,
                    b.tamy,
                    b.posx,
                    b.posy
                FROM Sensores_Bancal sb
                JOIN Sensores s ON sb.fk_sensor = s.id_sensor
                JOIN Bancal b ON sb.fk_bancal = b.id`;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const sensoresBancal = result.rows.map(s => ({
                id: s.id,
                fk_sensor: s.fk_sensor,
                fk_bancal: s.fk_bancal,
                sensor_nombre: s.sensor_nombre,
                tipo_sensor: s.fk_tipo_sensor,
                bancal_id: s.bancal_id,
                fk_lote: s.fk_lote,
                tamx: s.tamx,
                tamy: s.tamy,
                posx: s.posx,
                posy: s.posy
            }));

            res.status(200).json({ sensoresBancal });
        } else {
            res.status(404).json({ "message": 'No se encuentra registro de esta informacion' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const IdSensorBancal = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT 
                        sb.id, 
                        sb.fk_sensor, 
                        sb.fk_bancal, 
                        s.id_sensor, 
                        s.nombre AS nombre_sensor, 
                        s.fk_tipo_sensor, 
                        s.unidad_medida, 
                        s.medida_min, 
                        s.medida_max, 
                        b.id AS bancal_id, 
                        b.fk_lote, 
                        b.tamx, 
                        b.tamy, 
                        b.posx, 
                        b.posy
                    FROM Sensores_Bancal sb
                    LEFT JOIN Sensores s ON sb.fk_sensor = s.id_sensor
                    LEFT JOIN Bancal b ON sb.fk_bancal = b.id
                    WHERE sb.id = $1`;

        const result = await pool.query(sql, [id]);

        if (result.rows.length > 0) {
            const sensorBancal = result.rows.map(config => ({
                id: config.id,
                fk_sensor: config.fk_sensor,
                fk_bancal: config.fk_bancal,
                sensor: {
                    id_sensor: config.id_sensor,
                    nombre: config.nombre_sensor,
                    fk_tipo_sensor: config.fk_tipo_sensor,
                    unidad_medida: config.unidad_medida,
                    medida_min: config.medida_min,
                    medida_max: config.medida_max
                },
                bancal: {
                    bancal_id: config.bancal_id,
                    fk_lote: config.fk_lote,
                    tamx: config.tamx,
                    tamy: config.tamy,
                    posx: config.posx,
                    posy: config.posy
                }
            }));

            return res.status(200).json({ sensorBancal });
        } else {
            return res.status(404).json({ msg: "No se encontró la relación Sensor-Bancal" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};


export const actualizarSensorBancal = async (req, res) => {
    try {
        const { fk_sensor, fk_bancal } = req.body;
        const id = req.params.id;

        const sql = "UPDATE Sensores_Bancal SET fk_sensor=$1, fk_bancal=$2 WHERE id=$3";
        const { rowCount } = await pool.query(sql, [fk_sensor, fk_bancal, id]);

        if (rowCount > 0) {
            return res.status(200).json({ message: "informacion editada correctamente." });
        } else {
            return res.status(404).json({ message: "No se pudo editar la informacion." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};
