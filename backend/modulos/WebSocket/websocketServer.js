import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';
import pool from "../../modulos/usuarios/database/Conexion";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/iot/realtime/' });

wss.on('connection', (ws) => {
  console.log('Cliente conectado a WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const {
        fk_sensor_id, fk_bancal_id = 1, temperatura, humedad_ambiente, luminosidad,
        humedad_suelo, lluvia, ph_suelo, direccion_viento, velocidad_viento
      } = data;
      const fecha_medicion = new Date().toISOString();

      await pool.query(`
        INSERT INTO datos_meteorologicos_datos_metereologicos (
          fecha_medicion, fk_bancal_id, fk_sensor_id, temperatura, humedad_ambiente, luminosidad,
          humedad_suelo, lluvia, ph_suelo, direccion_viento, velocidad_viento
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        fecha_medicion, fk_bancal_id, fk_sensor_id, temperatura, humedad_ambiente, luminosidad,
        humedad_suelo, lluvia, ph_suelo, direccion_viento, velocidad_viento
      ]);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ ...data, fecha_medicion }));
        }
      });
    } catch (error) {
      console.error('Error procesando mensaje WebSocket:', error);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3001, () => {
  console.log('Servidor WebSocket escuchando en el puerto 3001');
});

export default app;