import pool from "../../usuarios/database/Conexion.js";

export const registrarSalario = async (req, res) => {
  try {
    const { auxilio_transporte, salario_minimo, fecha_de_implementacion,fecha_de_vencimiento,
      horas_laborales_mes,valor_hora_ordinaria } = req.body;
    const sql = `INSERT INTO salario_salario (auxilio_transporte, salario_minimo, fecha_de_implementacion,fecha_de_vencimiento,
    horas_laborales_mes,valor_hora_ordinaria) VALUES ($1, $2, $3, $4, $5, $6)`;
    const { rowCount } = await pool.query(sql, [auxilio_transporte, salario_minimo, fecha_de_implementacion,fecha_de_vencimiento,
      horas_laborales_mes,valor_hora_ordinaria]);

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
    const id = req.params.id;
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
    const { auxilio_transporte, salario_minimo, fecha_de_implementacion,fecha_de_vencimiento,
      horas_laborales_mes,valor_hora_ordinaria } = req.body;
    const id = req.params.id;;
    const sql = `UPDATE salario_salario SET auxilio_transporte = $1, salario_minimo = $2, fecha_de_implementacion = $3, fecha_de_vencimiento = $4,
    horas_laborales_mes = $5, valor_hora_ordinaria = $6 WHERE id = $7`;
    const { rowCount } = await pool.query(sql, [auxilio_transporte, salario_minimo, fecha_de_implementacion,fecha_de_vencimiento,
      horas_laborales_mes,valor_hora_ordinaria, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Salario actualizado' });
    } else {
      res.status(404).json({ message: 'Salario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema'});}
};