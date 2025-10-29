﻿const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('cron');
const path = require('path');

// Configurar variables de entorno al inicio
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('ðŸš€ Iniciando sistema de almacÃ©n - v1.0.2...');
console.log('ðŸ“ Directorio de trabajo:', __dirname);
console.log('ðŸ”§ NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('ðŸŒ Puerto:', process.env.PORT || 3003);

const app = express();
const PORT = process.env.PORT || 3003;

// ConfiguraciÃ³n de CORS mejorada
const allowedOrigins = [
  'https://lurinalmacen.onrender.com', // Tu frontend en producciÃ³n
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://localhost:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('ðŸ” Origen de la peticiÃ³n:', origin);
    
    // Permitir requests sin origin (Postman, curl, apps mÃ³viles)
    if (!origin) {
      console.log('âœ… Permitido: Sin origen (Postman/curl)');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('âœ… Origen permitido:', origin);
      callback(null, true);
    } else {
      console.log('âŒ Origen bloqueado:', origin);
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 204
};

// Middleware de seguridad - MODIFICADO PARA PRODUCCIÃ“N
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar en producciÃ³n
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

app.use(cors(corsOptions));

// Middleware adicional para manejar preflight requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    console.log('âœ… Preflight request manejado');
    return res.status(204).end();
  }
  
  next();
});

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging personalizado
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Ruta de salud bÃ¡sica (sin dependencias)
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    message: 'Sistema de control de almacÃ©n funcionando correctamente',
    data: {
      uptime: `${Math.floor(uptime / 60)} minutos`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
      },
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    }
  });
});

// InformaciÃ³n del sistema
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    data: {
      instituteName: process.env.INSTITUTE_NAME || 'Instituto Educativo',
      instituteCode: process.env.INSTITUTE_CODE || 'IE001',
      systemVersion: '1.0.0',
      features: [
        'Control de inventario en tiempo real',
        'Sistema FIFO (PEPS)',
        'Alertas automÃ¡ticas',
        'GestiÃ³n de bajas y sobrantes',
        'IntegraciÃ³n con SIGA',
        'Reportes detallados'
      ],
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Importar rutas despuÃ©s de configurar las variables de entorno
try {
  const productRoutes = require('./routes/products');
  const movementRoutes = require('./routes/movements');
  const alertRoutes = require('./routes/alerts');
  const withdrawalRoutes = require('./routes/withdrawals');
  const surplusRoutes = require('./routes/surplus');
  const reportRoutes = require('./routes/reports');
  const notificacionesRoutes = require('./routes/notificaciones');
  

  // Usar las rutas
  app.use('/api/products', productRoutes);
  app.use('/api/movements', movementRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/withdrawals', withdrawalRoutes);
  app.use('/api/surplus', surplusRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/notificaciones', notificacionesRoutes);

  console.log('âœ… Rutas cargadas exitosamente');

  // Inicializar servicio de alertas automáticas
  const alertasService = require('./services/alertasService');
  alertasService.init();
} catch (error) {
  console.error('âŒ Error al cargar las rutas:', error.message);
  console.error('ðŸ”§ Verifica que las variables de entorno estÃ©n configuradas correctamente');
  console.error('ðŸ“‹ AsegÃºrate de ejecutar el script SQL en Supabase');
}

// Importar servicios despuÃ©s de verificar la conexiÃ³n
try {
  const alertService = require('./services/alertService');
  
  // Configurar cron job para alertas automÃ¡ticas
  const alertCron = new cron.CronJob(
    process.env.ALERT_CRON_SCHEDULE || '0 8 * * *', // Todos los dÃ­as a las 8 AM
    async () => {
      console.log('ðŸ”” Ejecutando verificaciÃ³n automÃ¡tica de alertas...');
      try {
        await alertService.generateAutomaticAlerts();
        console.log('âœ… Alertas automÃ¡ticas generadas exitosamente');
      } catch (error) {
        console.error('âŒ Error al generar alertas automÃ¡ticas:', error);
      }
    },
    null, // onComplete
    true, // start
    'America/Lima' // timeZone
  );

  console.log('â° Cron job de alertas configurado');
} catch (error) {
  console.error('âŒ Error al configurar alertas automÃ¡ticas:', error.message);
}

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  const duration = Date.now() - req.startTime;
  
  console.error(`âŒ Error en ${req.method} ${req.originalUrl} - ${duration}ms:`, err.stack);
  
  // Error de validaciÃ³n
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validaciÃ³n',
      details: err.message
    });
  }
  
  // Error de autorizaciÃ³n
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: 'Token de acceso invÃ¡lido o expirado'
    });
  }
  
  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo saliÃ³ mal',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en el sistema`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/info',
      'GET /api/products',
      'GET /api/movements',
      'GET /api/alerts',
      'GET /api/reports'
    ]
  });
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('ðŸ”„ Recibida seÃ±al SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('ðŸ”„ Recibida seÃ±al SIGINT, cerrando servidor...');
  process.exit(0);
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log('ðŸš€ ==============================================');
  console.log(`ðŸ“¦ Sistema de Control de AlmacÃ©n - Instituto`);
  console.log(`ðŸŒ Servidor corriendo en puerto ${PORT}`);
  console.log(`ðŸ“Š Panel disponible en http://localhost:${PORT}`);
  console.log(`ðŸ” Health check: http://localhost:${PORT}/api/health`);
  console.log(`ðŸ“‹ DocumentaciÃ³n: http://localhost:${PORT}/api/info`);
  console.log(`ðŸ”” Alertas automÃ¡ticas: ${process.env.ALERT_CRON_SCHEDULE || '8:00 AM diario'}`);
  console.log(`ðŸŒ CORS habilitado para: ${allowedOrigins.join(', ')}`);
  console.log('===============================================');
});

module.exports = app;
