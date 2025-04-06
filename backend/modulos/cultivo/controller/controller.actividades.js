import pool from "../../usuarios/database/Conexion.js";

export const postActividades = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        console.log("Cuerpo de la solicitud:", req.body);

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

        // Validar campos requeridos (NOT NULL en la base de datos)
        if (!descripcion || !fecha_inicio || !fecha_fin || !tipo_actividad || 
            !usuario || !cultivo || !insumo || cantidadUsada === undefined || !estado || !prioridad) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos", 
                required: [
                    "descripcion", "fecha_inicio", "fecha_fin", "tipo_actividad", 
                    "usuario", "cultivo", "insumo", "cantidadUsada", "estado", "prioridad"
                ] 
            });
        }

        const sql = `
            INSERT INTO actividades_actividad (
                descripcion, fecha_inicio, fecha_fin, tipo_actividad_id, usuario_id, cultivo_id, 
                insumo_id, "cantidadUsada", estado, prioridad, instrucciones_adicionales
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id
        `;
        const values = [
            descripcion, 
            fecha_inicio, // Formato "YYYY-MM-DDTHH:MM" será convertido por PostgreSQL
            fecha_fin, 
            tipo_actividad, // Ya es número desde el frontend
            usuario, 
            cultivo, 
            insumo, 
            cantidadUsada, // Ya es número desde el frontend
            estado, 
            prioridad, 
            instrucciones_adicionales || null
        ];
        const result = await pool.query(sql, values);
        
        return res.status(201).json({ 
            message: "Actividad registrada correctamente",
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Error in postActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getActividades = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const sql = `
            SELECT 
                id, 
                descripcion, 
                fecha_inicio, 
                fecha_fin, 
                tipo_actividad_id AS tipo_actividad, 
                usuario_id AS usuario, 
                cultivo_id AS cultivo, 
                insumo_id AS insumo, 
                "cantidadUsada" AS cantidad_usada, 
                estado, 
                prioridad, 
                instrucciones_adicionales 
            FROM actividades_actividad
        `;
        const result = await pool.query(sql);
        
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error in getActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getIdActividades = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { id } = req.params;
        const sql = `
            SELECT 
                id, 
                descripcion, 
                fecha_inicio, 
                fecha_fin, 
                tipo_actividad_id AS tipo_actividad, 
                usuario_id AS usuario, 
                cultivo_id AS cultivo, 
                insumo_id AS insumo, 
                "cantidadUsada" AS cantidad_usada, 
                estado, 
                prioridad, 
                instrucciones_adicionales 
            FROM actividades_actividad 
            WHERE id = $1
        `;
        const result = await pool.query(sql, [id]);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        return res.status(404).json({ message: "Actividad no encontrada" });
    } catch (error) {
        console.error('Error in getIdActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const updateActividades = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { id } = req.params;
        console.log("Cuerpo de la solicitud:", req.body);

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

        if (!descripcion || !fecha_inicio || !fecha_fin || !tipo_actividad || 
            !usuario || !cultivo || !insumo || cantidadUsada === undefined || !estado || !prioridad) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos", 
                required: [
                    "descripcion", "fecha_inicio", "fecha_fin", "tipo_actividad", 
                    "usuario", "cultivo", "insumo", "cantidadUsada", "estado", "prioridad"
                ] 
            });
        }

        const sql = `
            UPDATE actividades_actividad 
            SET 
                descripcion = $1, 
                fecha_inicio = $2, 
                fecha_fin = $3, 
                tipo_actividad_id = $4, 
                usuario_id = $5, 
                cultivo_id = $6, 
                insumo_id = $7, 
                "cantidadUsada" = $8, 
                estado = $9, 
                prioridad = $10, 
                instrucciones_adicionales = $11 
            WHERE id = $12
        `;
        const values = [
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
            instrucciones_adicionales || null, 
            id
        ];
        const result = await pool.query(sql, values);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Actividad actualizada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo actualizar la actividad" });
    } catch (error) {
        console.error('Error in updateActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const deleteActividades = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { id } = req.params;
        const sql = "DELETE FROM actividades_actividad WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Actividad eliminada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar la actividad" });
    } catch (error) {
        console.error('Error in deleteActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};