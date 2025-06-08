import pool from "../../usuarios/database/Conexion.js";

export const registrarSalario = async (req, res) => {
  try {
    const { rol_id, valorJornal, fecha_de_implementacion, activo = true } = req.body;
    const sql = `INSERT INTO salario_salario (rol_id, "valorJornal", fecha_de_implementacion, activo) VALUES ($1, $2, $3, $4)`;
    const { rowCount } = await pool.query(sql, [rol_id, valorJornal, fecha_de_implementacion, activo]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Salario registrado' });
    } else {
      res.status(400).json({ message: 'Salario no registrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarSalarios = async (req, res) => {
  try {
    const sql = 'SELECT * FROM salario_salario';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de salarios' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const eliminarSalario = async (req, res) => {
  try {
    const id = req.params.id_salario;
    const sql = 'DELETE FROM salario_salario WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Salario eliminado' });
    } else {
      res.status(404).json({ message: 'Salario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const actualizarSalario = async (req, res) => {
  try {
    const { rol_id, valorJornal, fecha_de_implementacion, activo } = req.body;
    const id = req.params.id_salario;
    const sql = `UPDATE salario_salario SET rol_id = $1, "valorJornal" = $2, fecha_de_implementacion = $3, activo = $4 WHERE id = $5`;
    const { rowCount } = await pool.query(sql, [rol_id, valorJornal, fecha_de_implementacion, activo, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Salario actualizado' });
    } else {
      res.status(404).json({ message: 'Salario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};