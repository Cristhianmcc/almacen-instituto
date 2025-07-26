require('dotenv').config();

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  // Configuración de Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },

  // Configuración de alertas
  alerts: {
    lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD) || 10,
    criticalStockThreshold: parseInt(process.env.CRITICAL_STOCK_THRESHOLD) || 5,
    expirationAlertDays: parseInt(process.env.EXPIRATION_ALERT_DAYS) || 30,
    cronSchedule: process.env.ALERT_CRON_SCHEDULE || '0 8 * * *'
  },

  // Configuración de la institución
  institution: {
    name: process.env.INSTITUTE_NAME || 'Instituto Educativo',
    code: process.env.INSTITUTE_CODE || 'IE001',
    departamentalCode: process.env.DEPARTAMENTAL_LIMA_CODE || 'DEPT_LIMA'
  },

  // Configuración de la API
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: '/api',
    defaultPageSize: 50,
    maxPageSize: 1000
  },

  // Configuración de logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
  },

  // Configuración de CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'https://tu-dominio.com']
      : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:3001'],
    credentials: true
  },

  // Configuración de la base de datos
  database: {
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000
  },

  // Configuración de seguridad
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 1000 // máximo 1000 requests por ventana
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }
  },

  // Configuración de funciones específicas
  features: {
    autoGenerateAlerts: process.env.AUTO_GENERATE_ALERTS !== 'false',
    enableFIFO: process.env.ENABLE_FIFO !== 'false',
    enableSigaReports: process.env.ENABLE_SIGA_REPORTS !== 'false',
    enableBackups: process.env.ENABLE_BACKUPS !== 'false'
  }
};

// Validación de configuración crítica
const validateConfig = () => {
  const required = [
    'supabase.url',
    'supabase.anonKey'
  ];

  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, prop) => obj && obj[prop], config);
    return !value;
  });

  if (missing.length > 0) {
    console.error('❌ Configuración faltante:', missing);
    console.error('Por favor, verifica tu archivo .env');
    process.exit(1);
  }
};

// Mostrar configuración actual (sin datos sensibles)
const showConfig = () => {
  if (config.server.environment === 'development') {
    console.log('⚙️  Configuración del sistema:');
    console.log(`📡 Servidor: ${config.server.host}:${config.server.port}`);
    console.log(`🏢 Institución: ${config.institution.name} (${config.institution.code})`);
    console.log(`🚨 Umbral stock bajo: ${config.alerts.lowStockThreshold}`);
    console.log(`⏰ Alertas automáticas: ${config.alerts.cronSchedule}`);
    console.log(`🔧 Entorno: ${config.server.environment}`);
    console.log(`🌍 CORS permitido: ${config.cors.origin.join(', ')}`);
  }
};

module.exports = {
  ...config,
  validateConfig,
  showConfig
};
