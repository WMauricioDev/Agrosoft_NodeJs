import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './modulos/usuarios/views/Swagger.js';
import cors from 'cors';

// Rutas del módulo Cultivo
// import fase_lunar from "./modulos/cultivo/routers/router.fase_lunar.js";
// import cultivoLuna from "./modulos/cultivo/routers/router.cultivo_luna.js";
import plantaciones from "./modulos/cultivo/routers/router.plantaciones.js";
import tipoPlaga from "./modulos/cultivo/routers/router.tipo_plaga.js";
import plagas from "./modulos/cultivo/routers/router.plagas.js";
import afecciones from "./modulos/cultivo/routers/router.afecciones.js";
import productosControl from "./modulos/cultivo/routers/router.productos_control.js";
import tiposControl from "./modulos/cultivo/routers/router.tipos_control.js";
import controles from "./modulos/cultivo/routers/router.controles.js";
// import tareas from "./modulos/cultivo/routers/router.tareas.js";
// import programacion from "./modulos/cultivo/routers/router.programacion.js";
// import notificaciones from "./modulos/cultivo/routers/router.notificaciones.js";
import tipoActividad from "./modulos/cultivo/routers/router.tipo_actividad.js";
import actividades from "./modulos/cultivo/routers/router.actividades.js";
import cosechas from "./modulos/cultivo/routers/router.cosechas.js";
import tiposResiduo from "./modulos/cultivo/routers/router.tipos_residuo.js";
import residuos from "./modulos/cultivo/routers/router.residuos.js";
import tipoEspecie from "./modulos/cultivo/routers/router.tipo_especie.js";
import especies from "./modulos/cultivo/routers/router.especies.js";
import cultivos from "./modulos/cultivo/routers/router.cultivos.js";
import lotes from "./modulos/cultivo/routers/router.lotes.js";
import bancal from "./modulos/cultivo/routers/router.bancal.js";
import reporteCosechas from "./modulos/cultivo/routers/router.reporteCosechas.js"; // Nueva importación

// Rutas del módulo Usuarios
import Usuarios from './modulos/usuarios/routers/Usuarios.router.js';
import Autenticacion from './modulos/usuarios/routers/Autenticacion.router.js';  
import Roles from './modulos/usuarios/routers/Roles.routes.js';  

// Rutas del módulo Inventario
import Bodega from './modulos/inventario/routers/Bodega.Router.js';
import Bodega_Herramienta from './modulos/inventario/routers/BodegaHerramienta.Router.js';
import Bodega_Insumo from './modulos/inventario/routers/BodegaInsumo.Router.js';
import Herramientas from './modulos/inventario/routers/Herramientas.Router.js';
import Insumos from './modulos/inventario/routers/Insumos.Router.js';
import Semilleros from './modulos/inventario/routers/Semillero.Router.js';
import Semillero_Insumo from './modulos/inventario/routers/SemilleroInsumo.Router.js';
import reporteInsumos from './modulos/inventario/routers/reporteInsumosRouter.js';

// Rutas del módulo IoT
import datosMeteorologicos from "./modulos/IoT/routers/router.datos_meteorologicos.js";
import sensores from "./modulos/IoT/routers/router.sensores.js"; 
import RouterReporteDatosHistoricos from './modulos/IoT/routers/RouterReporteDatosHistoricos.js';
// import tipo_sensor from "./modulos/IoT/router/router.tipo_sensor.js";

// Rutas del módulo Finanzas
import salario_minimo from "./modulos/finanzas/routers/salarioMinimoRoutes.js";
import Registro_venta from "./modulos/finanzas/routers/registroVentaRoutes.js";
import Inventario_producto from "./modulos/finanzas/routers/inventarioProductoRoutes.js";
import Venta from "./modulos/finanzas/routers/ventaRoutes.js";

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
}));

// Middleware
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Rutas del módulo Cultivo
// app.use('/api/cultivo', fase_lunar);
// app.use('/api/cultivo', cultivoLuna);
app.use('/api/cultivo', plantaciones);
app.use('/api/cultivo', tipoPlaga);
app.use('/api/cultivo', plagas);
app.use('/api/cultivo', afecciones);
app.use('/api/cultivo', productosControl);
app.use('/api/cultivo', tiposControl);
app.use('/api/cultivo', controles);
// app.use('/api/cultivo', tareas);
// app.use('/api/cultivo', programacion);
// app.use('/api/cultivo', notificaciones);
app.use('/api/cultivo', tipoActividad);
app.use('/api/cultivo', actividades);
app.use('/api/cultivo', cosechas);
app.use('/api/cultivo', tiposResiduo);
app.use('/api/cultivo', residuos);
app.use('/api/cultivo', tipoEspecie);
app.use('/api/cultivo', especies);
app.use('/api/cultivo', cultivos);
app.use('/api/cultivo', lotes);
app.use('/api/cultivo', bancal);
app.use('/api/cultivo', reporteCosechas);

// Rutas del módulo Usuarios
app.use('/api', Usuarios);
app.use('/api', Autenticacion);
app.use('/api', Roles);

// Rutas del módulo Inventario
app.use('/api/inv', Bodega);
app.use('/api/inv', Bodega_Herramienta);
app.use('/api/inv', Bodega_Insumo);
app.use('/api/inv', Herramientas);
app.use('/api/inv', Insumos);
app.use('/api/inv', Semilleros);
app.use('/api/inv', Semillero_Insumo);
app.use('/api/inv', reporteInsumos);

// Rutas del módulo IoT
app.use('/api/iot', datosMeteorologicos);
app.use('/api/iot', sensores); 
app.use('/api/iot', RouterReporteDatosHistoricos);
// app.use('/api/iot', tipo_sensor);

// Rutas del módulo Finanzas
app.use('/api/fin', salario_minimo);
app.use('/api/fin', Registro_venta);
app.use('/api/fin', Inventario_producto);
app.use('/api/fin', Venta);

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Motor de vistas EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/documents', (req, res) => {
    res.render('documents.ejs');
});

// Inicio del servidor
app.listen(3000, () => {
    console.log('✅ Servidor iniciado en el puerto 3000');
});