import pool from "../../usuarios/database/Conexion.js";

export const postControles = async (req, res) => {
    try {
        const { descripcion, fecha_control, afeccion_id, producto_id, tipo_control_id, efectividad, observaciones, responsable_id } = req.body;
        const sql = "INSERT INTO controles_control (descripcion, fecha_control, afeccion_id, producto_id, tipo_control_id, efectividad, observaciones, responsable_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
        const result = await pool.query(sql, [descripcion, fecha_control, afeccion_id, producto_id, tipo_control_id, efectividad, observaciones, responsable_id]);
        
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Control registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el control" });
    } catch (error) {
        console.error('Error in postControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getControles = async (req, res) => {
    try {
        const sql = `
            SELECT 
                c.id,
                c.descripcion,
                c.fecha_control,
                c.efectividad,
                c.observaciones,

                -- Afección
                a.id AS afeccion_id,
                a.nombre AS afeccion_nombre,

                -- Tipo de control
                tc.id AS tipo_control_id,
                tc.nombre AS tipo_control_nombre,

                -- Producto
                p.id AS producto_id,
                p.nombre AS producto_nombre,

                -- Responsable
                u.id AS responsable_id,
                u.nombre AS responsable_nombre,
                u.email AS responsable_email
            FROM controles_control c
            JOIN afecciones_afeccion a ON c.afeccion_id = a.id
            JOIN tipo_control_tipocontrol tc ON c.tipo_control_id = tc.id
            JOIN insumos_insumo p ON c.producto_id = p.id
            JOIN usuarios_usuarios u ON c.responsable_id = u.id
        `;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const transformedData = result.rows.map((control) => ({
                id: control.id.toString(),
                afeccion: {
                    id: control.afeccion_id,
                    nombre: control.afeccion_nombre
                },
                tipo_control: {
                    id: control.tipo_control_id,
                    nombre: control.tipo_control_nombre
                },
                producto: {
                    id: control.producto_id,
                    nombre: control.producto_nombre
                },
                responsable: {
                    id: control.responsable_id,
                    nombre: control.responsable_nombre,
                    email: control.responsable_email
                },
                fecha: new Date(control.fecha_control).toLocaleDateString(),
                efectividad: control.efectividad,
            }));

            return res.status(200).json(transformedData);
        } else {
            return res.status(404).json({ message: "No hay registros de controles" });
        }
    } catch (error) {
        console.error('Error in getControles:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getIdControles = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM controles_control WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Control no encontrado" });
        }
    } catch (error) {
        console.error('Error in getIdControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const updateControles = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, fecha_control, afeccion_id, producto_id, tipo_control_id, efectividad, observaciones, responsable_id } = req.body;
        const sql = "UPDATE controles_control SET descripcion = $1, fecha_control = $2, afeccion_id = $3, producto_id = $4, tipo_control_id = $5, efectividad = $6, observaciones= $7, responsable_id= $8 WHERE id = $9";
        const result = await pool.query(sql, [descripcion, fecha_control, afeccion_id, producto_id, tipo_control_id, efectividad, observaciones, responsable_id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Control actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el control" });
    } catch (error) {
        console.error('Error in updateControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const deleteControles = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM controles_control WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Control eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el control" });
    } catch (error) {
        console.error('Error in deleteControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};
