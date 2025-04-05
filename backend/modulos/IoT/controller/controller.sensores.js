import pool from "../../usuarios/database/Conexion.js";

export const postSensores = async (req, res) => {
    try {
        const { nombre, tipo_sensor, unidad_medida, medida_min, medida_max } = req.body;
        const sql = "INSERT INTO sensores(nombre, fk_tipo_sensor, unidad_medida, medida_min, medida_max) VALUES($1, $2, $3, $4, $5)";
        const rows = await pool.query(sql, [nombre, tipo_sensor, unidad_medida, medida_min, medida_max]);

        if (rows.rowCount > 0) {
            return res.status(200).json({ "message": "Sensor registrado correctamente" });
        } else {
            return res.status(404).json({ "message": "No se pudo registrar el sensor" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getSensores = async (req, res) => {
    try {
        const sql = `SELECT 
                    id_sensor, 
                    nombre, 
                    fk_tipo_sensor,
                    unidad_medida,
                    medida_min,
                    medida_max
                FROM Sensores`;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const sensores = result.rows.map(s => ({
                id_sensor: s.id_sensor,
                nombre: s.nombre,
                fk_tipo_sensor: s.fk_tipo_sensor,
                unidad_medida: s.unidad_medida,
                medida_min: s.medida_min,
                medida_max: s.medida_max
            }));

            res.status(200).json({ sensores });
        } else {
            res.status(404).json({ msg: 'No hay sensores registrados' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const IdSensor = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT 
                    id_sensor, 
                    nombre, 
                    fk_tipo_sensor,
                    unidad_medida,
                    medida_min,
                    medida_max
                FROM Sensores
                WHERE id_sensor = $1`;

        const result = await pool.query(sql, [id]);

        if (result.rows.length > 0) {
            const sensores = result.rows.map(s => ({
                id_sensor: s.id_sensor,
                nombre: s.nombre,
                fk_tipo_sensor: s.fk_tipo_sensor,
                unidad_medida: s.unidad_medida,
                medida_min: s.medida_min,
                medida_max: s.medida_max
            }));

            res.status(200).json({ sensores });
        } else {
            res.status(404).json({ msg: 'No se encontró el sensor' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Error en el servidor." });
    }
};

export const actualizarSensor = async (req, res) => {
    try {
        const { nombre, tipo_sensor, unidad_medida, medida_min, medida_max } = req.body;
        const id = req.params.id_sensor;

        const sql = `UPDATE sensores SET nombre=$1, fk_tipo_sensor=$2, unidad_medida=$3, medida_min=$4, medida_max=$5  WHERE id_sensor=$6`;

        const { rowCount } = await pool.query(sql, [ nombre, tipo_sensor, unidad_medida, medida_min, medida_max, id]);

        if (rowCount > 0) {
            return res.status(200).json({ message: "Sensor actualizado correctamente." });
        } else {
            return res.status(404).json({ message: "No se pudo actualizar el sensor." });
        }
    } catch (error) {
        console.error("Error en actualizarSensor:", error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};
