// modulos/IoT/seed/tipoSensorSeed.js
import pool from '../../../modulos/usuarios/database/Conexion';

const defaultTipoSensores = [
  {
    nombre: 'Temperatura',
    unidad_medida: '°C',
    medida_minima: 0.00,
    medida_maxima: 50.00,
    descripcion: 'Sensor para medir la temperatura ambiente en grados Celsius.',
  },
  {
    nombre: 'Humedad Ambiente',
    unidad_medida: '%',
    medida_minima: 0.00,
    medida_maxima: 100.00,
    descripcion: 'Sensor para medir la humedad relativa del ambiente.',
  },
  {
    nombre: 'Luminosidad',
    unidad_medida: 'lux',
    medida_minima: 0.00,
    medida_maxima: 100000.00,
    descripcion: 'Sensor para medir la intensidad lumínica en lux.',
  },
  {
    nombre: 'Lluvia',
    unidad_medida: 'mm',
    medida_minima: 0.00,
    medida_maxima: 100.00,
    descripcion: 'Sensor para medir la cantidad de precipitación en milímetros.',
  },
  {
    nombre: 'Velocidad Viento',
    unidad_medida: 'm/s',
    medida_minima: 0.00,
    medida_maxima: 50.00,
    descripcion: 'Sensor para medir la velocidad del viento en metros por segundo.',
  },
  {
    nombre: 'Dirección Viento',
    unidad_medida: '°',
    medida_minima: 0.00,
    medida_maxima: 360.00,
    descripcion: 'Sensor para medir la dirección del viento en grados.',
  },
  {
    nombre: 'Humedad Suelo',
    unidad_medida: '%',
    medida_minima: 0.00,
    medida_maxima: 100.00,
    descripcion: 'Sensor para medir la humedad del suelo en porcentaje.',
  },
  {
    nombre: 'pH Suelo',
    unidad_medida: 'pH',
    medida_minima: 0.00,
    medida_maxima: 14.00,
    descripcion: 'Sensor para medir el pH del suelo.',
  },
];

const initializeTipoSensores = async () => {
  try {
    for (const tipoSensor of defaultTipoSensores) {
      const { nombre, unidad_medida, medida_minima, medida_maxima, descripcion } = tipoSensor;
      // Verificar si el tipo de sensor ya existe
      const checkSql = 'SELECT id FROM sensores_tiposensor WHERE nombre = $1';
      const { rows: existing } = await pool.query(checkSql, [nombre]);

      if (existing.length === 0) {
        // Insertar si no existe
        const insertSql = `
          INSERT INTO sensores_tiposensor (nombre, unidad_medida, medida_minima, medida_maxima, descripcion)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, nombre
        `;
        const { rows: inserted } = await pool.query(insertSql, [
          nombre,
          unidad_medida,
          medida_minima,
          medida_maxima,
          descripcion,
        ]);
        console.log(`Tipo de sensor creado: ${inserted[0].nombre}`);
      } else {
        console.log(`Tipo de sensor ya existe: ${nombre}`);
      }
    }
    console.log('Inicialización de tipos de sensor completada.');
  } catch (error) {
    console.error('Error al inicializar tipos de sensor:', error);
  }
};

export default initializeTipoSensores;