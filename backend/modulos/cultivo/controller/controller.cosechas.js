import pool from "../../usuarios/database/Conexion.js";

export const postCosechas = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        console.log("Cuerpo de la solicitud:", req.body);

        const { id_cultivo, cantidad, unidades_de_medida, fecha } = req.body;
        if (!id_cultivo || !cantidad || !unidades_de_medida || !fecha) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }

        const sql = `
            INSERT INTO cosechas_cosecha (id_cultivo_id, cantidad, unidades_de_medida, fecha) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `;
        const result = await pool.query(sql, [
            parseInt(id_cultivo), // Convertir a entero
            parseInt(cantidad),   // Convertir a entero
            unidades_de_medida,
            fecha
        ]);

        return res.status(201).json({ 
            message: "Cosecha registrada correctamente",
            id: result.rows[0].id
        });
    } catch (error) {
        console.error("Error en postCosechas:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getCosechas = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const sql = `
            SELECT id, id_cultivo_id AS id_cultivo, cantidad, unidades_de_medida, fecha 
            FROM cosechas_cosecha 
            ORDER BY fecha DESC
        `;
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error en getCosechas:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getIdCosechas = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { id } = req.params;
        const sql = `
            SELECT id, id_cultivo_id AS id_cultivo, cantidad, unidades_de_medida, fecha 
            FROM cosechas_cosecha 
            WHERE id = $1
        `;
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        }
        return res.status(404).json({ message: "Cosecha no encontrada" });
    } catch (error) {
        console.error("Error en getIdCosechas:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const updateCosechas = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { id } = req.params;
        console.log("Cuerpo de la solicitud:", req.body);

        const { id_cultivo, cantidad, unidades_de_medida, fecha } = req.body;
        if (!id_cultivo || !cantidad || !unidades_de_medida || !fecha) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }

        const sql = `
            UPDATE cosechas_cosecha 
            SET id_cultivo_id = $1, cantidad = $2, unidades_de_medida = $3, fecha = $4 
            WHERE id = $5
        `;
        const result = await pool.query(sql, [
            parseInt(id_cultivo),
            parseInt(cantidad),  
            unidades_de_medida,
            fecha,
            id
        ]);

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Cosecha actualizada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo actualizar la cosecha" });
    } catch (error) {
        console.error("Error en updateCosechas:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const deleteCosechas = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { id } = req.params;
        const sql = "DELETE FROM cosechas_cosecha WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Cosecha eliminada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar la cosecha" });
    } catch (error) {
        console.error("Error en deleteCosechas:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};