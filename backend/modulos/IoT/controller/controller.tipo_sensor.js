
import pool from "../../usuarios/database/Conexion.js";
    
export const postTipoSensor = async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            const sql = "INSERT INTO tipo_sensor (nombre, descripcion) VALUES ($1, $2)";
            const rows = await pool.query(sql, [nombre, descripcion]);
    
            if (rows.rowCount > 0) {
                return res.status(200).json({ "message": "Tipo de sensor registrado correctamente" });
            } else {
                return res.status(404).json({ "message": "No se pudo registrar el tipo de sensor" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ "message": "Error en el servidor" });
        }
    };
    
    export const getTipoSensor = async (req, res) => {
        try {
            const sql = `SELECT 
                            id, 
                            nombre, 
                            descripcion 
                        FROM tipo_sensor`;
    
            const result = await pool.query(sql);
    
            if (result.rows.length > 0) {
                const tipoSensores = result.rows.map(ts => ({
                    id: ts.id,
                    nombre: ts.nombre,
                    descripcion: ts.descripcion
                }));
    
                res.status(200).json({ tipoSensores });
            } else {
                res.status(404).json({ msg: 'No hay tipos de sensores registrados' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error en el servidor' });
        }
    };
    
    export const IdTipoSensor = async (req, res) => {
        try {
            const { id } = req.params;
            const sql = `SELECT 
                            id, 
                            nombre, 
                            descripcion 
                        FROM tipo_sensor 
                        WHERE id = $1`;
    
            const result = await pool.query(sql, [id]);
    
            if (result.rows.length > 0) {
                const tipoSensor = {
                    id: result.rows[0].id,
                    nombre: result.rows[0].nombre,
                    descripcion: result.rows[0].descripcion
                };
    
                res.status(200).json({ tipoSensor });
            } else {
                res.status(404).json({ msg: 'No se encontró el tipo de sensor' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error en el servidor." });
        }
    };
    
    export const actualizarTipoSensor = async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            const id = req.params.id;
    
            const sql =' UPDATE tipo_sensor SET nombre = $1, descripcion = $2 WHERE id = $3';
    
            const { rowCount } = await pool.query(sql, [nombre, descripcion, id]);
    
            if (rowCount > 0) {
                return res.status(200).json({ message: "Tipo de sensor actualizado correctamente." });
            } else {
                return res.status(404).json({ message: "No se pudo actualizar el tipo de sensor." });
            }
        } catch (error) {
            console.error("Error en actualizarTipoSensor:", error);
            return res.status(500).json({ message: "Error en el servidor." });
        }
};

