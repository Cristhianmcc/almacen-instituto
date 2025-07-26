-- Esquema de base de datos para el sistema de control de almacén
-- Compatible con PostgreSQL (Supabase)

-- Tabla principal de productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo_item VARCHAR(50) NOT NULL UNIQUE,
    nombre_item VARCHAR(255) NOT NULL,
    nombre_marca VARCHAR(255),
    orden_compra VARCHAR(50),
    nombre_medida VARCHAR(50) NOT NULL,
    mayor DECIMAL(10, 2) DEFAULT 0,
    sub_cta VARCHAR(50),
    stock_actual INTEGER DEFAULT 0 CHECK (stock_actual >= 0),
    fecha_ingreso DATE,
    fecha_vencimiento DATE,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'vencido', 'baja', 'sobrante')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de movimientos de inventario
CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(50) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(255),
    observaciones TEXT,
    stock_anterior INTEGER,
    stock_post_movimiento INTEGER
);

-- Tabla de alertas
CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    tipo_alerta VARCHAR(50) NOT NULL CHECK (tipo_alerta IN ('bajo_stock', 'proximo_vencimiento', 'vencido')),
    descripcion TEXT NOT NULL,
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_alerta VARCHAR(50) DEFAULT 'pendiente' CHECK (estado_alerta IN ('pendiente', 'resuelta', 'ignorada')),
    fecha_resolucion TIMESTAMP
);

-- Tabla de productos dados de baja
CREATE TABLE bajas (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    motivo_baja VARCHAR(255) NOT NULL,
    fecha_baja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(255),
    observaciones TEXT
);

-- Tabla de productos sobrantes
CREATE TABLE sobrantes (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_envio TIMESTAMP,
    observaciones TEXT,
    observaciones_envio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX idx_productos_codigo ON productos(codigo_item);
CREATE INDEX idx_productos_estado ON productos(estado);
CREATE INDEX idx_productos_fecha_vencimiento ON productos(fecha_vencimiento);
CREATE INDEX idx_productos_stock ON productos(stock_actual);

CREATE INDEX idx_movimientos_producto ON movimientos(producto_id);
CREATE INDEX idx_movimientos_tipo ON movimientos(tipo_movimiento);
CREATE INDEX idx_movimientos_fecha ON movimientos(fecha_movimiento);

CREATE INDEX idx_alertas_producto ON alertas(producto_id);
CREATE INDEX idx_alertas_tipo ON alertas(tipo_alerta);
CREATE INDEX idx_alertas_estado ON alertas(estado_alerta);
CREATE INDEX idx_alertas_fecha ON alertas(fecha_alerta);

CREATE INDEX idx_bajas_producto ON bajas(producto_id);
CREATE INDEX idx_bajas_fecha ON bajas(fecha_baja);

CREATE INDEX idx_sobrantes_producto ON sobrantes(producto_id);
CREATE INDEX idx_sobrantes_fecha_envio ON sobrantes(fecha_envio);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en productos
CREATE TRIGGER update_productos_updated_at 
    BEFORE UPDATE ON productos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en sobrantes
CREATE TRIGGER update_sobrantes_updated_at 
    BEFORE UPDATE ON sobrantes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar alertas automáticamente
CREATE OR REPLACE FUNCTION generar_alerta_stock_bajo()
RETURNS TRIGGER AS $$
BEGIN
    -- Generar alerta si el stock es bajo (configurable)
    IF NEW.stock_actual <= 10 AND (OLD.stock_actual IS NULL OR OLD.stock_actual > 10) THEN
        INSERT INTO alertas (producto_id, tipo_alerta, descripcion)
        VALUES (NEW.id, 'bajo_stock', 'Stock bajo: ' || NEW.stock_actual || ' unidades restantes');
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para generar alertas automáticamente
CREATE TRIGGER trigger_alerta_stock_bajo
    AFTER INSERT OR UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION generar_alerta_stock_bajo();

-- Datos de ejemplo (opcional)
INSERT INTO productos (codigo_item, nombre_item, nombre_marca, orden_compra, nombre_medida, mayor, sub_cta, stock_actual, fecha_ingreso, fecha_vencimiento) VALUES
('PROD001', 'Cuaderno Rayado A4', 'Marca A - 292-24', '292-24', 'Unidad', 2.50, 'SUB001', 100, '2024-01-15', '2025-12-31'),
('PROD002', 'Lápiz HB', 'Marca B - 293-24', '293-24', 'Unidad', 0.80, 'SUB002', 500, '2024-01-15', '2026-01-15'),
('PROD003', 'Papel Bond A4', 'Marca C - 294-24', '294-24', 'Paquete', 15.00, 'SUB003', 50, '2024-01-20', '2025-06-30'),
('PROD004', 'Borrador Blanco', 'Marca D - 295-24', '295-24', 'Unidad', 1.20, 'SUB004', 200, '2024-01-25', '2025-12-31'),
('PROD005', 'Regla 30cm', 'Marca E - 296-24', '296-24', 'Unidad', 3.00, 'SUB005', 75, '2024-02-01', '2027-02-01');

-- Comentarios sobre las tablas
COMMENT ON TABLE productos IS 'Tabla principal que almacena todos los productos del almacén';
COMMENT ON TABLE movimientos IS 'Registra todos los movimientos de entrada y salida de productos';
COMMENT ON TABLE alertas IS 'Sistema de alertas automáticas para stock bajo y vencimientos';
COMMENT ON TABLE bajas IS 'Productos dados de baja por vencimiento o deterioro';
COMMENT ON TABLE sobrantes IS 'Productos sobrantes que se envían a la departamental';

COMMENT ON COLUMN productos.estado IS 'Estado del producto: activo, vencido, baja, sobrante';
COMMENT ON COLUMN productos.orden_compra IS 'Número de orden de compra extraído del campo nombre_marca';
COMMENT ON COLUMN movimientos.tipo_movimiento IS 'Tipo de movimiento: entrada o salida';
COMMENT ON COLUMN alertas.tipo_alerta IS 'Tipo de alerta: bajo_stock, proximo_vencimiento, vencido';
COMMENT ON COLUMN alertas.estado_alerta IS 'Estado de la alerta: pendiente, resuelta, ignorada';
