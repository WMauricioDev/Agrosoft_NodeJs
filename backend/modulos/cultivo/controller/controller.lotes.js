import pool from "../../usuarios/database/Conexion.js"

export const postLote = async (req, res) => {
    try {
        const { nombre, descripcion, tamx, tamy, estado, posx, posy } = req.body;
        const sql = "INSERT INTO lotes(nombre, descripcion, tamx, tamy, estado, posx, posy ) VALUES($1, $2, $3, $4, $5, $6, $7)";
        const rows = await pool.query(sql, [nombre, descripcion, tamx, tamy, estado, posx, posy ]);

        if (rows.rowCount > 0) {
            return res.status(200).json({ "message": "Lote registrado correctamente" });
        } else {
            return res.status(404).json({ "message": "No se pudo registrar el lote" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getLote = async (req, res) => {
    try {
        console.log("Buscando Lotes")
        const sql = `SELECT 
                    id, 
                    nombre, 
                    descripcion,
                    tamx,
                    tamy,
                    estado,
                    posx,
                    posy
                FROM lotes`;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const lotes = result.rows.map(l => ({
                id: l.id,
                nombre: l.nombre,
                descripcion: l.descripcion,
                tamx: l.tamx,
                tamy: l.tamy,
                estado: l.estado,
                posx: l.posx,
                posy: l.posy
            }));

            res.status(200).json({ lotes });
        } else {
            res.status(404).json({ msg: 'No hay lotes registrados' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const IdLote = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Buscando PEA con ID:", id);

        const sql = `SELECT 
                    id, 
                    nombre, 
                    descripcion,
                    tamx,
                    tamy,
                    estado,
                    posx,
                    posy
                FROM lotes
                WHERE id = $1`;

        const result = await pool.query(sql, [id]);

        if (result.rows.length > 0) {
            const lotes = result.rows.map(l => ({
                id: l.id,
                nombre: l.nombre,
                descripcion: l.descripcion,
                tamx: l.tamx,
                tamy: l.tamy,
                estado: l.estado,
                posx: l.posx,
                posy: l.posy
            }));

            res.status(200).json({ lotes });
        } else {
            res.status(404).json({ msg: 'No se encontró el lote' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Error en el servidor." });
    }
};

export const actualizarLote = async (req, res) => {
    try{
        const { nombre, descripcion, tamx, tamy, estado, posx, posy } = req.body;
        const id = req.params.id;
        const sql = `UPDATE lotes SET nombre = $1, descripcion = $2, tamx = $3, tamy = $4, estado = $5, posx = $6, posy = $7 WHERE id = $8`;
        const { rowCount } = await pool.query(sql, [nombre, descripcion, tamx, tamy, estado, posx, posy, id]);
        
        if (rowCount > 0) {
            return res.status(200).json({ "message": "Lote editado correctamente." });
        } else {
            return res.status(404).json({ "message": "No se pudo editar el lote." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Error en el servidor." });
    }
};
