# Sistema de Control de Almacén - Instituto Educativo

## Descripción
Sistema de gestión de inventario para el control de productos y materiales del almacén del instituto, con integración a Supabase y funcionalidades avanzadas de control de stock.

## Características principales

### 📦 Gestión de productos
- Registro automático de entradas y salidas
- Control de stock en tiempo real
- Separación de marca y orden de compra
- Seguimiento de fechas de vencimiento

### 🔄 Lógica FIFO (PEPS)
- Primero en entrar, primero en salir
- Manejo automático de productos más antiguos
- Prevención de desperdicio por vencimiento

### 🚨 Sistema de alertas
- Notificaciones de bajo stock
- Alertas de productos próximos a vencer
- Alertas de productos vencidos

### 📊 Gestión de bajas y sobrantes
- Registro de productos dados de baja
- Manejo de productos sobrantes para envío a departamental
- Historial completo de movimientos

### 🔗 Integración con SIGA
- Compatibilidad con el sistema estatal
- Exportación de datos para sincronización
- Reportes específicos para departamental de Lima

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus credenciales de Supabase

4. Ejecutar el servidor:
   ```bash
   npm run dev
   ```

## Estructura del proyecto

```
almacen-instituto/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas de la API
│   ├── middleware/     # Middleware personalizado
│   ├── services/       # Servicios de negocio
│   ├── utils/          # Utilidades
│   ├── config/         # Configuración
│   └── app.js          # Aplicación principal
├── tests/              # Pruebas
├── docs/               # Documentación
└── package.json
```

## API Endpoints

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear nuevo producto
- `GET /api/products/:id` - Obtener producto por ID
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Dar de baja producto

### Movimientos
- `GET /api/movements` - Obtener historial de movimientos
- `POST /api/movements/entry` - Registrar entrada
- `POST /api/movements/exit` - Registrar salida

### Alertas
- `GET /api/alerts` - Obtener alertas activas
- `GET /api/alerts/low-stock` - Alertas de bajo stock
- `GET /api/alerts/expiration` - Alertas de vencimiento

## Tecnologías utilizadas

- **Backend**: Node.js + Express
- **Base de datos**: Supabase (PostgreSQL)
- **Validación**: Joi
- **Autenticación**: Supabase Auth
- **Logs**: Morgan
- **Seguridad**: Helmet, CORS

## Equipo de desarrollo

- Cristhian y 2 compañeros del instituto
- Proyecto académico para control de almacén institucional

## Licencia

MIT License - Proyecto educativo
