const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('cron');
const path = require('path');

// Configurar variables de entorno al inicio
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🚀 Iniciando sistema de almacén - v1.0.2...');
console.log('📍 Directorio de trabajo:', __dirname);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🌐 Puerto:', process.env.PORT || 3003);

const app = express();
const PORT = process.env.PORT || 3003;

// Configuración de CORS mejorada
const allowedOrigins = [
  'https://lurinalmacen.onrender.com', // Tu frontend en producción
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://localhost:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 Origen de la petición:', origin);
    
    // Permitir requests sin origin (Postman, curl, apps móviles)
    if (!origin) {
      console.log('✅ Permitido: Sin origen (Postman/curl)');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origen permitido:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origen bloqueado:', origin);
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

// Middleware de seguridad - MODIFICADO PARA PRODUCCIÓN
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar en producción
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
    console.log('✅ Preflight request manejado');
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

// Ruta de salud básica (sin dependencias)
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    message: 'Sistema de control de almacén funcionando correctamente',
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

// Información del sistema
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
        'Alertas automáticas',
        'Gestión de bajas y sobrantes',
        'Integración con SIGA',
        'Reportes detallados'
      ],
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Importar rutas después de configurar las variables de entorno
try {
  const productRoutes = require('./routes/products');
  const movementRoutes = require('./routes/movements');
  const alertRoutes = require('./routes/alerts');
  const withdrawalRoutes = require('./routes/withdrawals');
  const surplusRoutes = require('./routes/surplus');
  const reportRoutes = require('./routes/reports');

  // Usar las rutas
  app.use('/api/products', productRoutes);
  app.use('/api/movements', movementRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/withdrawals', withdrawalRoutes);
  app.use('/api/surplus', surplusRoutes);
  app.use('/api/reports', reportRoutes);

  console.log('✅ Rutas cargadas exitosamente');
} catch (error) {
  console.error('❌ Error al cargar las rutas:', error.message);
  console.error('🔧 Verifica que las variables de entorno estén configuradas correctamente');
  console.error('📋 Asegúrate de ejecutar el script SQL en Supabase');
}

// Importar servicios después de verificar la conexión
try {
  const alertService = require('./services/alertService');
  
  // Configurar cron job para alertas automáticas
  const alertCron = new cron.CronJob(
    process.env.ALERT_CRON_SCHEDULE || '0 8 * * *', // Todos los días a las 8 AM
    async () => {
      console.log('🔔 Ejecutando verificación automática de alertas...');
      try {
        await alertService.generateAutomaticAlerts();
        console.log('✅ Alertas automáticas generadas exitosamente');
      } catch (error) {
        console.error('❌ Error al generar alertas automáticas:', error);
      }
    },
    null, // onComplete
    true, // start
    'America/Lima' // timeZone
  );

  console.log('⏰ Cron job de alertas configurado');
} catch (error) {
  console.error('❌ Error al configurar alertas automáticas:', error.message);
}

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  const duration = Date.now() - req.startTime;
  
  console.error(`❌ Error en ${req.method} ${req.originalUrl} - ${duration}ms:`, err.stack);
  
  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
  }
  
  // Error de autorización
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
      message: 'Token de acceso inválido o expirado'
    });
  }
  
  // Error interno del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
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
  console.log('🔄 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ==============================================');
  console.log(`📦 Sistema de Control de Almacén - Instituto`);
  console.log(`🌐 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Panel disponible en http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Documentación: http://localhost:${PORT}/api/info`);
  console.log(`🔔 Alertas automáticas: ${process.env.ALERT_CRON_SCHEDULE || '8:00 AM diario'}`);
  console.log(`🌐 CORS habilitado para: ${allowedOrigins.join(', ')}`);
  console.log('===============================================');
});

module.exports = app;