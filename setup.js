#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando configuración del sistema...\n');

// Verificar que existe el archivo .env
if (!fs.existsSync('.env')) {
  console.log('⚠️  No se encontró el archivo .env');
  console.log('📋 Creando archivo .env desde .env.example...\n');
  
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Archivo .env creado');
    console.log('🔧 Por favor, edita el archivo .env con tus credenciales de Supabase\n');
  } else {
    console.log('❌ No se encontró .env.example');
    process.exit(1);
  }
}

// Verificar que existen las dependencias
if (!fs.existsSync('node_modules')) {
  console.log('📦 Instalando dependencias...\n');
  const { spawn } = require('child_process');
  
  const install = spawn('npm', ['install'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Dependencias instaladas correctamente');
      startSetup();
    } else {
      console.log('\n❌ Error al instalar dependencias');
      process.exit(1);
    }
  });
} else {
  startSetup();
}

function startSetup() {
  console.log('\n🏗️  Estructura del proyecto:');
  console.log('📁 src/');
  console.log('  ├── controllers/     # Controladores de la API');
  console.log('  ├── routes/          # Rutas de la API');
  console.log('  ├── services/        # Servicios de negocio');
  console.log('  ├── middleware/      # Middleware personalizado');
  console.log('  ├── utils/           # Utilidades');
  console.log('  ├── config/          # Configuración');
  console.log('  └── app.js           # Aplicación principal');
  console.log('📁 tests/              # Pruebas');
  console.log('📁 docs/               # Documentación');
  
  console.log('\n🚀 Comandos disponibles:');
  console.log('  npm start            # Iniciar en producción');
  console.log('  npm run dev          # Iniciar en desarrollo');
  console.log('  npm test             # Ejecutar pruebas');
  console.log('  npm run lint         # Verificar código');
  
  console.log('\n📊 Endpoints principales:');
  console.log('  GET  /api/health             # Estado del sistema');
  console.log('  GET  /api/products           # Listar productos');
  console.log('  POST /api/products           # Crear producto');
  console.log('  GET  /api/movements          # Listar movimientos');
  console.log('  POST /api/movements/entry    # Registrar entrada');
  console.log('  POST /api/movements/exit     # Registrar salida');
  console.log('  GET  /api/alerts             # Listar alertas');
  console.log('  GET  /api/reports/dashboard  # Dashboard');
  
  console.log('\n🔧 Configuración necesaria:');
  console.log('1. Editar archivo .env con credenciales de Supabase');
  console.log('2. Ejecutar el script SQL en Supabase (docs/database-schema.sql)');
  console.log('3. Ejecutar: npm run dev');
  console.log('4. Probar: http://localhost:3000/api/health');
  
  console.log('\n📚 Documentación:');
  console.log('  README.md                    # Información general');
  console.log('  docs/api-documentation.md    # Documentación de API');
  console.log('  docs/database-schema.sql     # Esquema de base de datos');
  
  console.log('\n✅ Sistema listo para configurar');
  console.log('🎯 Próximo paso: Configurar variables de entorno en .env');
}
