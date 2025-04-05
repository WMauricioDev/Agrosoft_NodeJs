import pool from "../../usuarios/database/Conexion.js";

export const registrarSalario = async (req, res) => {
  try {
    const { valor, fecha_aplicacion } = req.body;
    const sql = `INSERT INTO salario_minimo (valor, fecha_aplicacion) VALUES ($1, $2)`;
    const { rowCount } = await pool.query(sql, [valor, fecha_aplicacion]);

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
    const sql = 'SELECT * FROM salario_minimo';
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
    const sql = 'DELETE FROM salario_minimo WHERE id = $1';
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
    const { valor, fecha_aplicacion } = req.body;
    const id = req.params.id_salario;
    const sql = `UPDATE salario_minimo SET valor = $1, fecha_aplicacion = $2 WHERE id = $3`;
    const { rowCount } = await pool.query(sql, [valor, fecha_aplicacion, id]);

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