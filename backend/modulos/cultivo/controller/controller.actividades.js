import pool from "../../usuarios/database/Conexion.js";

export const postActividades = async (req, res) => {
    try {
        const { 
            descripcion, 
            fecha_inicio, 
            fecha_fin, 
            tipo_actividad, 
            usuario, 
            cultivo, 
            insumo, 
            cantidadUsada, 
            estado, 
            prioridad, 
            instrucciones_adicionales 
        } = req.body;

        const sql = `
            INSERT INTO actividades (
                descripcion, fecha_inicio, fecha_fin, tipo_actividad, usuario, cultivo, 
                insumo, cantidad_usada, estado, prioridad, instrucciones_adicionales
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id
        `;
        const values = [
            descripcion, fecha_inicio, fecha_fin, tipo_actividad, usuario, cultivo, 
            insumo, cantidadUsada, estado, prioridad, instrucciones_adicionales
        ];
        const result = await pool.query(sql, values);
        
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                message: "Actividad registrada correctamente",
                id: result.rows[0].id
            });
        }
        return res.status(400).json({ message: "No se pudo registrar la actividad" });
    } catch (error) {
        console.error('Error in postActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getActividades = async (req, res) => {
    try {
        const sql = `
            SELECT id, descripcion, fecha_inicio, fecha_fin, tipo_actividad, usuario, 
                   cultivo, insumo, cantidad_usada, estado, prioridad, instrucciones_adicionales 
            FROM actividades
        `;
        const result = await pool.query(sql);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(404).json({ message: "No hay registros de actividades" });
        }
    } catch (error) {
        console.error('Error in getActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getIdActividades = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT id, descripcion, fecha_inicio, fecha_fin, tipo_actividad, usuario, 
                   cultivo, insumo, cantidad_usada, estado, prioridad, instrucciones_adicionales 
            FROM actividades 
            WHERE id = $1
        `;
        const result = await pool.query(sql, [id]);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ message: "Actividad no encontrada" });
        }
    } catch (error) {
        console.error('Error in getIdActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const updateActividades = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            descripcion, 
            fecha_inicio, 
            fecha_fin, 
            tipo_actividad, 
            usuario, 
            cultivo, 
            insumo, 
            cantidadUsada, 
            estado, 
            prioridad, 
            instrucciones_adicionales 
        } = req.body;

        const sql = `
            UPDATE actividades 
            SET descripcion = $1, fecha_inicio = $2, fecha_fin = $3, tipo_actividad = $4, 
                usuario = $5, cultivo = $6, insumo = $7, cantidad_usada = $8, estado = $9, 
                prioridad = $10, instrucciones_adicionales = $11 
            WHERE id = $12
        `;
        const values = [
            descripcion, fecha_inicio, fecha_fin, tipo_actividad, usuario, cultivo, 
            insumo, cantidadUsada, estado, prioridad, instrucciones_adicionales, id
        ];
        const result = await pool.query(sql, values);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Actividad actualizada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo actualizar la actividad" });
    } catch (error) {
        console.error('Error in updateActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const deleteActividades = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM actividades WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Actividad eliminada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar la actividad" });
    } catch (error) {
        console.error('Error in deleteActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};