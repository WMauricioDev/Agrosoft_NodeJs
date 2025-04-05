import pool from "../../usuarios/database/Conexion.js";

export const postBancal = async (req,res) =>{
    try{
        const {fk_lote, tamx, tamy, posx, posy}=req.body
        const sql="INSERT INTO bancal(fk_lote, tamx, tamy, posx, posy)VALUES($1,$2, $3, $4, $5)";
        const result = await pool.query(sql,[fk_lote, tamx, tamy, posx, posy]);
        if (result.rowCount> 0){
            return res.status(200).json({"message":"Bancal registrado correctamente"});
        }
        return res.status(404).json({"message":"No se pudo registra una bancal"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({"message":"Error en el servidor"});
    }
};
export const getBancal = async (req, res) => {
    try{
        console.log("Buscando todos los lotes...");
        const sql = `SELECT
                    b.id,
                    b.fk_lote,
                    b.tamx,
                    b.tamy,
                    b.posx,
                    b.posy,
                    l.id,
                    l.nombre,
                    l.descripcion,
                    l.tamx,
                    l.tamy,
                    l.estado,
                    l.posx,
                    l.posy
                FROM bancal b
                JOIN lotes l ON b.fk_lote = l.id`;
    
        const result = await pool.query(sql);
        if(result.rows.length>0){
            const bancal = result.rows.map(b => ({
                id: b.id,
                tamx: b.tamx,
                tamy: b.tamy,
                posx: b.posx,
                posy: b.posy,
                fk_lote: {
                    id: b.id,
                    nombre: b.nombre,
                    descripcion: b.descripcion,
                    tamx: b.tamx,
                    tamy: b.tamy,
                    estado: b.estado,
                    posx: b.posx,
                    posy: b.posy
                }   
            }));

            res.status(200).json({ bancal });
        } else {
            res.status(404).json({ msg: 'No hay bancales registrados' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const IdBancal = async (req, res) => {
    try{
        const {id} = req.params;
        console.log("Buscando bancales por ID ", id);
        const sql = `SELECT
                    b.id,
                    b.fk_lote,
                    b.tamx,
                    b.tamy,
                    b.posx,
                    b.posy,
                    l.id,
                    l.nombre,
                    l.descripcion,
                    l.tamx,
                    l.tamy,
                    l.estado,
                    l.posx,
                    l.posy
                FROM bancal b
                JOIN lotes l ON b.fk_lote = l.id
                WHERE b.id = $1`;
        const result = await pool.query(sql, [id]);
        if(result.rows.length > 0){
            const bancal = result.rows.map(b => ({
                id: b.id,
                tamx: b.tamx,
                tamy: b.tamy,
                posx: b.posx,
                posy: b.posy,
                fk_lote: {
                    id: b.id,
                    nombre: b.nombre,
                    descripcion: b.descripcion,
                    tamx: b.tamx,
                    tamy: b.tamy,
                    estado: b.estado,
                    posx: b.posx,
                    posy: b.posy
                }   
            }));
            res.status(200).json({bancal}); 
        } else {
            res.status(404).json({msg: 'No se encontro el bancal'})
        }

    }catch(error){
        console.error(error)
        return res.status(500).json({"message": "Error en el servidor"})
    }
};

export const actualizarBancal = async (req, res) => {
    try {
        const { fk_lote, tamx, tamy, posx, posy } = req.body;
        const id = req.params.id;
        const sql = "UPDATE bancal SET fk_lote = $1, tamx = $2, tamy = $3, posx = $4, posy = $5 WHERE id=$6";
        
        const { rowCount } = await pool.query(sql, [fk_lote, tamx, tamy, posx, posy, id]);
        
        if (rowCount > 0) {
            return res.status(200).json({ "message": "Bancal editada correctamente." });
        } else {
            return res.status(404).json({ "message": "No se pudo editar el bancal." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Error en el servidor." });
    }
};