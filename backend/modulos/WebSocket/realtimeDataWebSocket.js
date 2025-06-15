import { WebSocketServer } from 'ws';
import pool from '../../usuarios/database/Conexion.js';
import crypto from 'crypto';

const ALERT_CACHE = {};

const checkThresholds = (data, sensorNombre, bancalNombre) => {
  const thresholds = {
    temperatura: { min: 0, max: 40 },
    humedad_ambiente: { min: 20, max: 90 },
    luminosidad: { min: 100, max: 10000 },
    lluvia: { min: 0, max: 50 },
    velocidad_viento: { min: 0, max: 20 },
    humedad_suelo: { min: 10, max: 80 },
    ph_suelo: { min: 5.5, max: 7.5 },
  };

  const alerts = [];
  const timestamp = Date.now().toString();
  const device_code = data.device_code;

  for (const [field, limits] of Object.entries(thresholds)) {
    const value = data[field];
    if (value != null) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) continue;

      if (numValue < limits.min) {
        const alertId = crypto.createHash('md5').update(`${device_code}_${field}_below_${timestamp}`).digest('hex');
        alerts.push({
          id: alertId,
          type: `${field}_below_threshold`,
          message: `Alerta: ${field.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())} bajo en ${sensorNombre} (${bancalNombre}): ${numValue} (mínimo permitido: ${limits.min})`,
          timestamp,
          device_code,
          fuente: 'meteorological_data',
        });
      } else if (numValue > limits.max) {
        const alertId = crypto.createHash('md5').update(`${device_code}_${field}_above_${timestamp}`).digest('hex');
        alerts.push({
          id: alertId,
          type: `${field}_above_threshold`,
          message: `Alerta: ${field.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())} alto en ${sensorNombre} (${bancalNombre}): ${numValue} (máximo permitido: ${limits.max})`,
          timestamp,
          device_code,
          fuente: 'meteorological_data',
        });
      }
    }
  }
  return alerts;
};

const saveAlert = (alert, device_code) => {
  if (!ALERT_CACHE[device_code]) ALERT_CACHE[device_code] = {};
  ALERT_CACHE[device_code][alert.id] = alert;
};

export const initializeRealtimeData = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws/iot/realtime/' });

  wss.on('connection', (ws) => {
    console.log('Cliente conectado a WebSocket');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        const {
          device_code,
          temperatura,
          humedad_ambiente,
          luminosidad,
          humedad_suelo,
          lluvia,
          ph_suelo,
          direccion_viento,
          velocidad_viento,
        } = data;

        if (!device_code) {
          ws.send(JSON.stringify({ message: 'device_code requerido' }));
          return;
        }

        // Verificar sensor
        const sensorResult = await pool.query(
          'SELECT id, nombre, bancal_id, estado FROM sensores_sensor WHERE device_code = $1 AND estado = $2',
          [device_code, 'activo']
        );
        if (sensorResult.rowCount === 0) {
          ws.send(JSON.stringify({ message: `Sensor con ${device_code} no existe o está inactivo` }));
          return;
        }

        const sensor = sensorResult.rows[0];
        const fk_sensor_id = sensor.id;
        const sensorNombre = sensor.nombre;
        const fk_bancal_id = sensor.bancal_id || null;

        // Obtener nombre del bancal
        let bancalNombre = 'N/A';
        if (fk_bancal_id) {
          const bancalResult = await pool.query('SELECT nombre FROM bancal_bancal WHERE id = $1', [fk_bancal_id]);
          bancalNombre = bancalResult.rows[0]?.nombre || 'N/A';
        }

        // Guardar datos
        const fecha_medicion = new Date().toISOString();
        const sql = `
          INSERT INTO datos_meteorologicos_datos_metereologicos (
            fk_sensor_id, fk_bancal_id, temperatura, humedad_ambiente, luminosidad, humedad_suelo,
            lluvia, ph_suelo, direccion_viento, velocidad_viento, fecha_medicion
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id
        `;
        const values = [
          fk_sensor_id,
          fk_bancal_id,
          temperatura != null ? parseFloat(temperatura) : null,
          humedad_ambiente != null ? parseFloat(humedad_ambiente) : null,
          luminosidad != null ? parseFloat(luminosidad) : null,
          humedad_suelo != null ? parseFloat(humedad_suelo) : null,
          lluvia != null ? parseFloat(lluvia) : null,
          ph_suelo != null ? parseFloat(ph_suelo) : null,
          direccion_viento != null ? parseFloat(direccion_viento) : null,
          velocidad_viento != null ? parseFloat(velocidad_viento) : null,
          fecha_medicion,
        ];
        const result = await pool.query(sql, values);

        if (result.rowCount === 0) {
          ws.send(JSON.stringify({ message: 'Datos no guardados' }));
          return;
        }

        const savedData = {
          id: result.rows[0].id,
          fk_sensor_id,
          sensor_nombre: sensorNombre,
          fk_bancal_id,
          bancal_nombre: bancalNombre,
          temperatura: temperatura != null ? parseFloat(temperatura) : null,
          humedad_ambiente: humedad_ambiente != null ? parseFloat(humedad_ambiente) : null,
          luminosidad: luminosidad != null ? parseFloat(luminosidad) : null,
          lluvia: lluvia != null ? parseFloat(lluvia) : null,
          velocidad_viento: velocidad_viento != null ? parseFloat(velocidad_viento) : null,
          direccion_viento: direccion_viento != null ? parseFloat(direccion_viento) : null,
          humedad_suelo: humedad_suelo != null ? parseFloat(humedad_suelo) : null,
          ph_suelo: ph_suelo != null ? parseFloat(ph_suelo) : null,
          fecha_medicion,
        };

        // Verificar umbrales
        const alerts = checkThresholds(data, sensorNombre, bancalNombre);
        const existingAlerts = ALERT_CACHE[device_code] || {};

        for (const alert of alerts) {
          if (!existingAlerts[alert.id]) {
            saveAlert(alert, device_code);
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'weather_alert', data: alert }));
              }
            });
          }
        }

        // Enviar datos a todos los clientes
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'weather_data', data: savedData }));
          }
        });

        ws.send(JSON.stringify({ message: 'Datos registrados', data: savedData }));
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
        ws.send(JSON.stringify({ message: 'Error en el sistema' }));
      }
    });

    ws.on('close', () => {
      console.log('Cliente desconectado');
    });
  });

  console.log('Servidor WebSocket inicializado en /ws/iot/realtime/');
};