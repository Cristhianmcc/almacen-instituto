# 🎨 DISEÑO FIGMA - SISTEMA DE CONTROL DE ALMACÉN
## Instituto Educativo - Documentación Completa

---

## 📋 ÍNDICE
1. [Design System](#design-system)
2. [Componentes](#componentes)
3. [Wireframes Desktop](#wireframes-desktop)
4. [Wireframes Mobile](#wireframes-mobile)
5. [Flujos de Usuario](#flujos-de-usuario)
6. [Especificaciones Técnicas](#especificaciones-técnicas)

---

## 🎨 DESIGN SYSTEM

### PALETA DE COLORES
```
🔵 PRIMARIOS
#2563EB - Primary Blue (Botones principales, enlaces)
#1E40AF - Primary Dark (Estados hover)
#DBEAFE - Primary Light (Fondos suaves)

🟢 SEMÁNTICOS
#10B981 - Success Green (Estados activos, confirmaciones)
#F59E0B - Warning Yellow (Alertas, stock bajo)
#EF4444 - Error Red (Productos vencidos, errores)
#6B7280 - Neutral Gray (Texto secundario)

⚫ ESCALA DE GRISES
#111827 - Gray 900 (Títulos principales)
#374151 - Gray 700 (Texto principal)
#6B7280 - Gray 500 (Texto secundario)
#D1D5DB - Gray 300 (Bordes)
#F9FAFB - Gray 50 (Fondos)
#FFFFFF - White (Cards, modales)
```

### TIPOGRAFÍA
```
FUENTE: Inter (Google Fonts)

📝 TÍTULOS
H1: 32px Bold, Letter-spacing: -0.5px
H2: 24px Bold, Letter-spacing: -0.25px
H3: 20px Semibold
H4: 18px Semibold
H5: 16px Medium

📄 TEXTO CUERPO
Body Large: 16px Regular, Line-height: 24px
Body Medium: 14px Regular, Line-height: 20px
Body Small: 12px Regular, Line-height: 16px

🏷️ ETIQUETAS
Label Large: 14px Medium
Label Medium: 12px Medium
Label Small: 11px Medium, Uppercase, Letter-spacing: 0.5px
```

### ESPACIADO (Sistema de 8px)
```
4px  - Micro spacing (entre elementos muy cercanos)
8px  - Small spacing (padding interno pequeño)
16px - Medium spacing (separación estándar)
24px - Large spacing (secciones)
32px - XL spacing (bloques grandes)
48px - XXL spacing (separación mayor)
64px - XXXL spacing (espaciado máximo)
```

---

## 🧩 COMPONENTES FIGMA

### BOTONES
```
🔵 BOTÓN PRIMARIO
Tamaño: 40px altura, 16px padding horizontal
Fondo: #2563EB
Texto: Blanco, 14px Medium
Border-radius: 6px
Hover: #1E40AF
Ejemplo: [Guardar Producto]

⚪ BOTÓN SECUNDARIO
Tamaño: 40px altura, 16px padding horizontal
Fondo: Blanco
Borde: 1px solid #D1D5DB
Texto: #374151, 14px Medium
Border-radius: 6px
Hover: #F9FAFB
Ejemplo: [Cancelar]

🔄 BOTÓN ICONO
Tamaño: 40px x 40px
Fondo: Transparente
Icono: 20px, #6B7280
Border-radius: 6px
Hover: #F9FAFB
Ejemplo: [🔍] [✏️] [🗑️]
```

### FORMULARIOS
```
📝 CAMPO DE TEXTO
Altura: 40px
Padding: 0 12px
Borde: 1px solid #D1D5DB
Border-radius: 6px
Fuente: 14px Regular
Focus: Borde #2563EB, Sombra 0 0 0 3px rgba(37,99,235,0.1)

📋 SELECT DROPDOWN
Altura: 40px
Padding: 0 12px
Borde: 1px solid #D1D5DB
Border-radius: 6px
Icono: Chevron down 16px
Fuente: 14px Regular

🔍 CAMPO DE BÚSQUEDA
Altura: 40px
Padding: 0 12px 0 40px
Icono: Search 16px, posición izquierda
Borde: 1px solid #D1D5DB
Border-radius: 6px
Placeholder: "Buscar productos..."
```

### BADGES DE ESTADO
```
✅ ACTIVO
Fondo: #DCFCE7
Texto: #166534, 12px Medium
Padding: 4px 8px
Border-radius: 12px

⚠️ STOCK BAJO
Fondo: #FEF3C7
Texto: #92400E, 12px Medium
Padding: 4px 8px
Border-radius: 12px

❌ VENCIDO
Fondo: #FEE2E2
Texto: #991B1B, 12px Medium
Padding: 4px 8px
Border-radius: 12px

⚫ BAJA
Fondo: #F3F4F6
Texto: #374151, 12px Medium
Padding: 4px 8px
Border-radius: 12px
```

### CARDS
```
📊 CARD DE ESTADÍSTICA
Ancho: 280px
Alto: 120px
Fondo: Blanco
Borde: 1px solid #E5E7EB
Border-radius: 8px
Padding: 24px
Sombra: 0 1px 3px rgba(0,0,0,0.1)

📦 CARD DE PRODUCTO
Ancho: 320px
Alto: Auto
Fondo: Blanco
Borde: 1px solid #E5E7EB
Border-radius: 8px
Padding: 16px
Sombra: 0 1px 3px rgba(0,0,0,0.1)
```

---

## 🖥️ WIREFRAMES DESKTOP (1440px)

### 1. DASHBOARD PRINCIPAL
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📊 SISTEMA DE CONTROL DE ALMACÉN - INSTITUTO                            │
├─────────────────────────────────────────────────────────────────────────┤
│ [📦 Productos] [📋 Movimientos] [⚠️ Alertas] [📊 Reportes] [⚙️ Config] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─── ESTADÍSTICAS RÁPIDAS ────────────────────────────────────────────┐ │
│ │                                                                     │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │ │
│ │ │📦 PRODUCTOS │ │📊 STOCK     │ │✅ ACTIVOS   │ │⚠️ ALERTAS       │ │ │
│ │ │    1,245    │ │   15,678    │ │   1,180     │ │      20         │ │ │
│ │ │Total        │ │Unidades     │ │Productos    │ │Pendientes       │ │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─── ALERTAS CRÍTICAS ───────────┐ ┌─── MOVIMIENTOS RECIENTES ─────────┐ │
│ │                                │ │                                   │ │
│ │ ⚠️ Stock Bajo (12 productos)   │ │ Fecha/Hora    │Producto│Tipo│Cant │ │
│ │ • PROD003 - Papel Bond (8 un.) │ │ 22/07 14:30   │PROD001 │ -  │ 10  │ │
│ │ • PROD007 - Marcadores (5 un.) │ │ 22/07 10:15   │PROD002 │ +  │ 50  │ │
│ │                                │ │ 21/07 16:45   │PROD003 │ -  │  5  │ │
│ │ 📅 Por Vencer (5 productos)    │ │ 21/07 09:20   │PROD001 │ +  │ 25  │ │
│ │ • PROD004 - Borrador (3 días)  │ │                                   │ │
│ │ • PROD008 - Pegamento (5 días) │ │ [Ver Historial Completo] ────────┘ │
│ │                                │ │                                   │ │
│ │ ❌ Vencidos (3 productos)       │ │                                   │ │
│ │ • PROD010 - Tinta (vencido)    │ │                                   │ │
│ │                                │ │                                   │ │
│ │ [Ver Todas las Alertas] ──────┘ │                                   │ │
│ └────────────────────────────────┘ └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES:
- Header: 1440 x 64px
- Stats Cards: 280px cada una, 24px gap
- Content Grid: 2 columnas, 720px cada una, 24px gap
- Total Height: ~800px
```

### 2. GESTIÓN DE PRODUCTOS
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📦 GESTIÓN DE PRODUCTOS                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ [+ Nuevo Producto] [📤 Importar] [📥 Exportar]    [🔍 Buscar_________] │
├─────────────────────────────────────────────────────────────────────────┤
│ Filtros: [Estado ▼] [Marca ▼] [Stock ▼] [Vencimiento ▼] [Limpiar]      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [ ] │Código │Nombre Producto      │Marca        │Stock│Venc. │Estado │ │
│ │─────┼───────┼─────────────────────┼─────────────┼─────┼──────┼───────│ │
│ │ [ ] │PROD01 │Cuaderno Rayado A4   │Marca A-292  │ 100 │12/25 │✅Activo│ │
│ │ [ ] │PROD02 │Lápiz HB             │Marca B-293  │ 500 │01/26 │✅Activo│ │
│ │ [ ] │PROD03 │Papel Bond A4        │Marca C-294  │   8 │06/25 │⚠️Bajo │ │
│ │ [ ] │PROD04 │Borrador Blanco      │Marca D-295  │ 200 │12/25 │✅Activo│ │
│ │ [ ] │PROD05 │Regla 30cm           │Marca E-296  │  75 │02/27 │✅Activo│ │
│ │ [ ] │PROD06 │Marcadores           │Marca F-297  │   5 │08/25 │⚠️Bajo │ │
│ │ [ ] │PROD07 │Pegamento            │Marca G-298  │   0 │07/25 │❌Venc.│ │
│ │                                                                     │ │
│ │ [Acciones: ✏️ Editar | 👁️ Ver | 🗑️ Eliminar]                        │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Mostrando 1-10 de 1,245 productos                                      │
│ [◀ Anterior] [1] [2] [3] [4] [5] [...] [124] [125] [Siguiente ▶]       │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES:
- Toolbar: 1440 x 56px
- Filters: 1440 x 48px
- Table: 1440 x 600px
- Pagination: 1440 x 48px

COLUMNAS:
- Checkbox: 40px
- Código: 100px
- Nombre: 300px
- Marca: 180px
- Stock: 80px
- Vencimiento: 100px
- Estado: 100px
- Acciones: 120px
```

### 3. FORMULARIO DE PRODUCTO (Modal)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                           OVERLAY MODAL                                │
│                    ┌──────────────────────────┐                        │
│                    │ ➕ AGREGAR PRODUCTO      │                        │
│                    ├──────────────────────────┤                        │
│                    │                          │                        │
│                    │ ┌─ INFORMACIÓN BÁSICA ─┐ │                        │
│                    │ │                      │ │                        │
│                    │ │ Código Item*         │ │                        │
│                    │ │ [PROD006___________] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Nombre Item*         │ │                        │
│                    │ │ [Marcador Fluores__] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Marca                │ │                        │
│                    │ │ [Marca F - 297-24__] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Orden Compra         │ │                        │
│                    │ │ [297-24___________] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Unidad Medida*       │ │                        │
│                    │ │ [Unidad        ▼] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Precio Mayor         │ │                        │
│                    │ │ [$2.75___________] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Sub Cuenta           │ │                        │
│                    │ │ [SUB006__________] │ │                        │
│                    │ └──────────────────────┘ │                        │
│                    │                          │                        │
│                    │ ┌─ STOCK E INVENTARIO ─┐ │                        │
│                    │ │                      │ │                        │
│                    │ │ Stock Inicial*       │ │                        │
│                    │ │ [100_____] unidades  │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Fecha Ingreso        │ │                        │
│                    │ │ [📅 22/07/2025]     │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Fecha Vencimiento    │ │                        │
│                    │ │ [📅 22/07/2026]     │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Estado               │ │                        │
│                    │ │ [Activo        ▼] │ │                        │
│                    │ └──────────────────────┘ │                        │
│                    │                          │                        │
│                    │ [❌ Cancelar] [✅ Guardar] │                        │
│                    └──────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES:
- Modal: 640 x 720px, centrado
- Overlay: Full screen, rgba(0,0,0,0.5)
- Padding interno: 24px
- Gap entre secciones: 24px
- Gap entre campos: 16px
```

### 4. SISTEMA DE ALERTAS
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚠️ SISTEMA DE ALERTAS                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ [🔄 Generar Alertas] [✅ Resolver Todas] [❌ Limpiar]  [Filtros ▼]      │
├─────────────────────────────────────────────────────────────────────────┤
│ [Pendientes (15)] [Resueltas (8)] [Ignoradas (3)]                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ STOCK BAJO                                                       │ │
│ │ PROD003 - Papel Bond A4                                             │ │
│ │ Stock actual: 8 unidades (mínimo: 10)                              │ │
│ │ Fecha: 22/07/2025 14:30                                            │ │
│ │ [✅ Resolver] [❌ Ignorar] [📝 Ver Producto] [📋 Reabastecer]       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 📅 PRÓXIMO VENCIMIENTO                                              │ │
│ │ PROD004 - Borrador Blanco                                           │ │
│ │ Vence en 3 días (25/07/2025)                                       │ │
│ │ Fecha: 22/07/2025 08:00                                            │ │
│ │ [✅ Resolver] [❌ Ignorar] [📝 Ver Producto] [📦 Marcar Sobrante]   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ❌ PRODUCTO VENCIDO                                                 │ │
│ │ PROD010 - Pegamento Líquido                                        │ │
│ │ Vencido hace 5 días (17/07/2025)                                   │ │
│ │ Fecha: 18/07/2025 08:00                                            │ │
│ │ [✅ Resolver] [📦 Dar de Baja] [📝 Ver Producto]                   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ [Mostrar más alertas...] [Ver historial completo]                      │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES:
- Header + Toolbar: 1440 x 104px
- Alert Card: 1440 x 120px cada una
- Gap entre cards: 16px
- Padding lateral: 24px
```

### 5. MOVIMIENTOS DE INVENTARIO - DETALLADO
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📋 MOVIMIENTOS DE INVENTARIO                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ [+ Registrar Entrada] [- Registrar Salida] [📊 Reportes] [📥 Exportar]  │
├─────────────────────────────────────────────────────────────────────────┤
│ 🔍 [Buscar movimientos________________] [📅 Desde] [📅 Hasta] [Filtrar] │
├─────────────────────────────────────────────────────────────────────────┤
│ Filtros: [Tipo ▼] [Producto ▼] [Usuario ▼] [Limpiar Filtros]           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ID │Fecha/Hora    │Producto         │Tipo    │Cant│Ant│Post│Usuario │ │
│ │───┼──────────────┼─────────────────┼────────┼────┼───┼────┼────────│ │
│ │001│22/07 14:30:15│PROD001-Cuaderno │📤Salida│ 10 │100│ 90 │Admin   │ │
│ │   │              │Rayado A4        │        │    │   │    │        │ │
│ │   │              │Obs: Entrega Dpto Matemát│    │   │    │[Ver+]  │ │
│ │───┼──────────────┼─────────────────┼────────┼────┼───┼────┼────────│ │
│ │002│22/07 10:15:42│PROD002-Lápiz HB │📥Entra │ 50 │500│550 │Juan    │ │
│ │   │              │                 │        │    │   │    │        │ │
│ │   │              │Obs: Compra nueva remesa  │    │   │    │[Ver+]  │ │
│ │───┼──────────────┼─────────────────┼────────┼────┼───┼────┼────────│ │
│ │003│21/07 16:45:30│PROD003-Papel    │📤Salida│  5 │ 13│  8 │María   │ │
│ │   │              │Bond A4          │        │    │   │    │        │ │
│ │   │              │Obs: Uso oficina director │    │   │    │[Ver+]  │ │
│ │───┼──────────────┼─────────────────┼────────┼────┼───┼────┼────────│ │
│ │004│21/07 09:20:15│PROD001-Cuaderno │📥Entra │ 25 │ 75│100 │Admin   │ │
│ │   │              │Rayado A4        │        │    │   │    │        │ │
│ │   │              │Obs: Restock programado   │    │   │    │[Ver+]  │ │
│ │───┼──────────────┼─────────────────┼────────┼────┼───┼────┼────────│ │
│ │005│20/07 13:10:22│PROD004-Borrador │📤Salida│ 15 │215│200 │Carlos  │ │
│ │   │              │Blanco           │        │    │   │    │        │ │
│ │   │              │Obs: Distribución aulas   │    │   │    │[Ver+]  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Mostrando 1-10 de 1,847 movimientos                                    │
│ [◀ Anterior] [1] [2] [3] [4] [5] [...] [184] [185] [Siguiente ▶]       │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES ESPECÍFICAS:
- Toolbar: 1440 x 56px
- Search + Filters: 1440 x 96px
- Table Header: 1440 x 56px
- Row Height: 72px (2 líneas para observaciones)
- Pagination: 1440 x 48px

COLUMNAS DETALLADAS:
- ID: 50px
- Fecha/Hora: 120px
- Producto: 300px (incluye código + nombre)
- Tipo: 80px (con iconos)
- Cantidad: 60px
- Stock Anterior: 50px
- Stock Post: 60px
- Usuario: 100px
- Acciones: 80px
```

### 6. MODAL REGISTRAR MOVIMIENTO
```
┌─────────────────────────────────────────────────────────────────────────┐
│                           OVERLAY MODAL                                │
│                    ┌──────────────────────────┐                        │
│                    │ 📋 REGISTRAR MOVIMIENTO  │                        │
│                    ├──────────────────────────┤                        │
│                    │                          │                        │
│                    │ ┌─ TIPO DE MOVIMIENTO ─┐ │                        │
│                    │ │                      │ │                        │
│                    │ │ ( ) 📥 Entrada       │ │                        │
│                    │ │ (●) 📤 Salida        │ │                        │
│                    │ └──────────────────────┘ │                        │
│                    │                          │                        │
│                    │ ┌─ SELECCIÓN PRODUCTO ─┐ │                        │
│                    │ │                      │ │                        │
│                    │ │ Buscar Producto*     │ │                        │
│                    │ │ [PROD001 - Cuaderno_] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ ┌─ PREVIEW PRODUCTO ┐ │ │                        │
│                    │ │ │ 📦 PROD001         │ │ │                        │
│                    │ │ │ Cuaderno Rayado A4 │ │ │                        │
│                    │ │ │ Marca: Marca A-292 │ │ │                        │
│                    │ │ │ Stock Actual: 100  │ │ │                        │
│                    │ │ │ Estado: ✅ Activo   │ │ │                        │
│                    │ │ └────────────────────┘ │ │                        │
│                    │ └──────────────────────┘ │                        │
│                    │                          │                        │
│                    │ ┌─ CANTIDAD Y DETALLES ┐ │                        │
│                    │ │                      │ │                        │
│                    │ │ Cantidad*            │ │                        │
│                    │ │ [10______] unidades  │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Usuario Responsable  │ │                        │
│                    │ │ [Admin______________] │ │                        │
│                    │ │                      │ │                        │
│                    │ │ Observaciones        │ │                        │
│                    │ │ [Entrega para_______] │ │                        │
│                    │ │ [departamento_______] │ │                        │
│                    │ │ [de matemáticas_____] │ │                        │
│                    │ └──────────────────────┘ │                        │
│                    │                          │                        │
│                    │ ┌─ RESUMEN OPERACIÓN ──┐ │                        │
│                    │ │                      │ │                        │
│                    │ │ Stock Anterior: 100  │ │                        │
│                    │ │ Movimiento:     -10  │ │                        │
│                    │ │ Stock Final:     90  │ │                        │
│                    │ │                      │ │                        │
│                    │ │ ⚠️ ¿Confirmar esta   │ │                        │
│                    │ │    operación?        │ │                        │
│                    │ └──────────────────────┘ │                        │
│                    │                          │                        │
│                    │ [❌ Cancelar] [✅ Registrar] │                        │
│                    └──────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES:
- Modal: 600 x 800px, centrado
- Secciones: 24px gap
- Campos: 16px gap
- Preview: Fondo #F9FAFB
- Resumen: Fondo #FEF3C7 (amarillo claro)
```

### 7. VISTA DETALLE DE MOVIMIENTO
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Volver a Movimientos                              [✏️ Editar] [🗑️ Del] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─── INFORMACIÓN DEL MOVIMIENTO ─────────────────────────────────────┐   │
│ │                                                                   │   │
│ │ 📋 MOVIMIENTO #001                                                │   │
│ │                                                                   │   │
│ │ ┌─ DATOS GENERALES ────┐  ┌─ PRODUCTO ──────────┐                │   │
│ │ │                      │  │                     │                │   │
│ │ │ 📅 Fecha/Hora        │  │ 📦 Código: PROD001  │                │   │
│ │ │ 22/07/2025 14:30:15  │  │ Cuaderno Rayado A4  │                │   │
│ │ │                      │  │ Marca: Marca A-292  │                │   │
│ │ │ 👤 Usuario           │  │ Estado: ✅ Activo    │                │   │
│ │ │ Admin                │  │                     │                │   │
│ │ │                      │  │ [📝 Ver Producto]   │                │   │
│ │ │ 🔄 Tipo              │  └─────────────────────┘                │   │
│ │ │ 📤 Salida            │                                          │   │
│ │ └──────────────────────┘                                          │   │
│ │                                                                   │   │
│ │ ┌─ CANTIDADES ─────────────────────────────────────────────────┐  │   │
│ │ │                                                              │  │   │
│ │ │ Stock Anterior:     100 unidades                            │  │   │
│ │ │ Cantidad Movida:    -10 unidades                           │  │   │
│ │ │ Stock Resultante:    90 unidades                           │  │   │
│ │ │                                                              │  │   │
│ │ │ ⚠️ Alerta: Este movimiento dejó el stock en nivel bajo     │  │   │
│ │ └──────────────────────────────────────────────────────────────┘  │   │
│ │                                                                   │   │
│ │ ┌─ OBSERVACIONES ──────────────────────────────────────────────┐  │   │
│ │ │                                                              │  │   │
│ │ │ "Entrega para departamento de matemáticas.                  │  │   │
│ │ │ Solicitado por coordinadora María García.                   │  │   │
│ │ │ Autorizado por director académico."                         │  │   │
│ │ └──────────────────────────────────────────────────────────────┘  │   │
│ └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│ ┌─── HISTORIAL RELACIONADO ──────────────────────────────────────────┐   │
│ │                                                                   │   │
│ │ 📊 Últimos movimientos de este producto:                         │   │
│ │                                                                   │   │
│ │ • 21/07 09:20 - Entrada +25 (Stock: 75→100) - Admin             │   │
│ │ • 20/07 15:30 - Salida -15 (Stock: 90→75) - María               │   │
│ │ • 19/07 11:45 - Entrada +40 (Stock: 50→90) - Juan               │   │
│ │                                                                   │   │
│ │ [📋 Ver historial completo del producto]                         │   │
│ └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

DIMENSIONES:
- Header: 1440 x 56px
- Main Info Card: 1440 x 400px
- History Card: 1440 x 200px
- Gaps: 24px entre secciones
```

---

## 📱 WIREFRAMES MOBILE (375px)

### 1. DASHBOARD MOBILE
```
┌─────────────────────────────────┐
│ ☰ Control Almacén        🔔 ⚙️ │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📦 PRODUCTOS                │ │
│ │     1,245                   │ │
│ │ Total en sistema            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📊 STOCK TOTAL              │ │
│ │    15,678                   │ │
│ │ Unidades disponibles        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ⚠️ ALERTAS ACTIVAS           │ │
│ │      20                     │ │
│ │ Requieren atención          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─ ALERTAS CRÍTICAS ─────────┐ │
│ │                            │ │
│ │ ⚠️ Stock Bajo (12)          │ │
│ │ • Papel Bond - 8 unidades  │ │
│ │ • Marcadores - 5 unidades  │ │
│ │                            │ │
│ │ 📅 Por Vencer (5)           │ │
│ │ • Borrador - 3 días        │ │
│ │ • Pegamento - 5 días       │ │
│ │                            │ │
│ │ [Ver Todas] ──────────────┘ │
│ └────────────────────────────┘ │
│                                 │
│ [📦] [📋] [⚠️] [📊] [⚙️]        │
└─────────────────────────────────┘

DIMENSIONES:
- Ancho: 375px
- Cards: 343px (padding 16px)
- Gap entre cards: 16px
- Bottom navigation: 60px
```

### 2. PRODUCTOS MOBILE (Lista)
```
┌─────────────────────────────────┐
│ ← Productos              + 🔍  │
├─────────────────────────────────┤
│ [🔍 Buscar productos_________] │
│ [Filtros ▼] [Estado ▼] [🔄]   │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📦 PROD001                  │ │
│ │ Cuaderno Rayado A4          │ │
│ │ Marca A - 292-24            │ │
│ │ Stock: 100 | Vence: 12/25   │ │
│ │ [✅ Activo]          [⋮]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📦 PROD002                  │ │
│ │ Lápiz HB                    │ │
│ │ Marca B - 293-24            │ │
│ │ Stock: 500 | Vence: 01/26   │ │
│ │ [✅ Activo]          [⋮]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📦 PROD003                  │ │
│ │ Papel Bond A4               │ │
│ │ Marca C - 294-24            │ │
│ │ Stock: 8 | Vence: 06/25     │ │
│ │ [⚠️ Stock Bajo]      [⋮]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Cargar más productos...]       │
│                                 │
│ [📦] [📋] [⚠️] [📊] [⚙️]        │
└─────────────────────────────────┘

DIMENSIONES:
- Product Card: 343 x 120px
- Gap entre cards: 12px
- Padding interno: 16px
```

### 3. MOVIMIENTOS MOBILE (Lista)
```
┌─────────────────────────────────┐
│ ← Movimientos            + 📊  │
├─────────────────────────────────┤
│ [🔍 Buscar movimientos______]  │
│ [Tipo ▼] [Producto ▼] [🔄]     │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📤 MOV-001                  │ │
│ │ 22/07 14:30                 │ │
│ │ PROD001 - Cuaderno A4       │ │
│ │ SALIDA: -10 unidades        │ │
│ │ Stock: 100 → 90             │ │
│ │ Usuario: Admin              │ │
│ │ Obs: Entrega Dpto Matemát.. │ │
│ │                      [⋮]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📥 MOV-002                  │ │
│ │ 22/07 10:15                 │ │
│ │ PROD002 - Lápiz HB          │ │
│ │ ENTRADA: +50 unidades       │ │
│ │ Stock: 500 → 550            │ │
│ │ Usuario: Juan               │ │
│ │ Obs: Compra nueva remesa    │ │
│ │                      [⋮]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📤 MOV-003                  │ │
│ │ 21/07 16:45                 │ │
│ │ PROD003 - Papel Bond A4     │ │
│ │ SALIDA: -5 unidades         │ │
│ │ Stock: 13 → 8 ⚠️            │ │
│ │ Usuario: María              │ │
│ │ Obs: Uso oficina director   │ │
│ │                      [⋮]    │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+ Registrar Movimiento]        │
│                                 │
│ [📦] [📋] [⚠️] [📊] [⚙️]        │
└─────────────────────────────────┘

DIMENSIONES:
- Movement Card: 343 x 160px
- Gap entre cards: 12px
- Padding interno: 16px
- FAB Button: 56px diámetro
```

### 4. MODAL REGISTRAR MOVIMIENTO MOBILE
```
┌─────────────────────────────────┐
│ ✕                    📋 Movim. │
├─────────────────────────────────┤
│                                 │
│ ┌─ TIPO ─────────────────────┐  │
│ │ ( ) 📥 Entrada             │  │
│ │ (●) 📤 Salida              │  │
│ └───────────────────────────────┘  │
│                                 │
│ ┌─ PRODUCTO ─────────────────┐  │
│ │ [Buscar producto_______]   │  │
│ │                            │  │
│ │ ┌─ SELECCIONADO ─────────┐ │  │
│ │ │ 📦 PROD001             │ │  │
│ │ │ Cuaderno Rayado A4     │ │  │
│ │ │ Stock: 100 unidades    │ │  │
│ │ │ Estado: ✅ Activo       │ │  │
│ │ └───────────────────────────┘ │  │
│ └───────────────────────────────┘  │
│                                 │
│ ┌─ CANTIDAD ─────────────────┐  │
│ │ [10______] unidades        │  │
│ └───────────────────────────────┘  │
│                                 │
│ ┌─ USUARIO ──────────────────┐  │
│ │ [Admin________________]    │  │
│ └───────────────────────────────┘  │
│                                 │
│ ┌─ OBSERVACIONES ────────────┐  │
│ │ [Entrega para_____________] │  │
│ │ [departamento_____________] │  │
│ │ [de matemáticas___________] │  │
│ └───────────────────────────────┘  │
│                                 │
│ ┌─ RESUMEN ──────────────────┐  │
│ │ Stock Anterior: 100        │  │
│ │ Movimiento:     -10        │  │
│ │ Stock Final:     90        │  │
│ │ ⚠️ Stock quedará bajo      │  │
│ └───────────────────────────────┘  │
│                                 │
│ [❌ Cancelar] [✅ Registrar]    │
└─────────────────────────────────┘

DIMENSIONES:
- Modal: Full screen mobile
- Secciones: 16px gap
- Campos: 12px gap
- Botones: 48px altura (touch-friendly)
```

---

## 🔄 FLUJOS DE USUARIO

### FLUJO 1: Agregar Nuevo Producto
```
1. Dashboard → 2. Productos → 3. [+ Nuevo Producto] → 4. Modal Formulario → 5. Llenar Datos → 6. [Guardar] → 7. Confirmación → 8. Lista Actualizada

Estados:
- Validación en tiempo real
- Preview de datos
- Mensajes de error
- Confirmación de éxito
```

### FLUJO 2: Gestionar Alerta de Stock Bajo
```
1. Dashboard (Ver alerta) → 2. [Ver Todas] → 3. Lista Alertas → 4. Seleccionar Alerta → 5. [Resolver/Ignorar/Reabastecer] → 6. Confirmación

Opciones:
- Resolver: Marcar como atendida
- Ignorar: Descartar temporalmente
- Reabastecer: Crear movimiento de entrada
```

### FLUJO 3: Registrar Movimiento
```
1. Movimientos → 2. [+ Registrar] → 3. Seleccionar Tipo → 4. Buscar Producto → 5. Ingresar Cantidad → 6. Observaciones → 7. [Registrar] → 8. Actualización Stock

Validaciones:
- Stock suficiente para salidas
- Producto activo
- Cantidad positiva
```

---

## 🔧 ESPECIFICACIONES TÉCNICAS

### CAMPOS DE BASE DE DATOS

#### TABLA: productos
```sql
📋 CAMPOS PARA FORMULARIO:
✅ codigo_item (VARCHAR(50)) - Único, requerido
✅ nombre_item (VARCHAR(255)) - Requerido
✅ nombre_marca (VARCHAR(255)) - Opcional
✅ orden_compra (VARCHAR(50)) - Extraído de marca
✅ nombre_medida (VARCHAR(50)) - Requerido [Unidad, Paquete, Caja, etc.]
✅ mayor (DECIMAL(10,2)) - Precio mayor, opcional
✅ sub_cta (VARCHAR(50)) - Sub cuenta contable
✅ stock_actual (INTEGER) - Stock inicial
✅ fecha_ingreso (DATE) - Fecha de ingreso
✅ fecha_vencimiento (DATE) - Fecha de vencimiento
✅ estado (ENUM) - ['activo', 'vencido', 'baja', 'sobrante']

🤖 CAMPOS AUTOMÁTICOS:
created_at, updated_at (TIMESTAMP)
```

#### TABLA: movimientos
```sql
📋 CAMPOS PARA FORMULARIO:
✅ producto_id (INTEGER) - Selección de producto
✅ tipo_movimiento (ENUM) - ['entrada', 'salida']
✅ cantidad (INTEGER) - Cantidad del movimiento
✅ usuario (VARCHAR(255)) - Usuario responsable
✅ observaciones (TEXT) - Observaciones opcionales

🤖 CAMPOS AUTOMÁTICOS:
fecha_movimiento (TIMESTAMP)
stock_anterior (INTEGER) - Calculado
stock_post_movimiento (INTEGER) - Calculado
```

#### TABLA: alertas
```sql
📋 CAMPOS PARA GESTIÓN:
✅ producto_id (INTEGER) - Producto relacionado
✅ tipo_alerta (ENUM) - ['bajo_stock', 'proximo_vencimiento', 'vencido']
✅ descripcion (TEXT) - Descripción automática
✅ estado_alerta (ENUM) - ['pendiente', 'resuelta', 'ignorada']

🤖 CAMPOS AUTOMÁTICOS:
fecha_alerta (TIMESTAMP)
fecha_resolucion (TIMESTAMP) - Al resolver
```

### VALIDACIONES DE FRONTEND
```javascript
// Producto
- codigo_item: Requerido, único, alfanumérico
- nombre_item: Requerido, máx 255 caracteres
- stock_actual: Número entero, mínimo 0
- fecha_vencimiento: Fecha futura opcional

// Movimiento
- producto_id: Requerido, producto activo
- cantidad: Número entero positivo
- tipo_movimiento: Requerido ['entrada', 'salida']
- stock_suficiente: Para salidas, validar stock disponible

// Estados
- activo: Color verde #10B981
- stock_bajo: Color amarillo #F59E0B (stock <= 10)
- vencido: Color rojo #EF4444
- baja: Color gris #6B7280
```

### RESPONSIVE BREAKPOINTS
```css
/* Mobile First */
📱 Mobile: 375px - 767px
- Navigation: Bottom tabs
- Cards: Full width
- Modal: Full screen
- Table: Card list view

📱 Tablet: 768px - 1199px
- Navigation: Collapsible sidebar
- Cards: 2 columns
- Modal: Centered
- Table: Horizontal scroll

🖥️ Desktop: 1200px+
- Navigation: Fixed sidebar
- Cards: 3-4 columns
- Modal: Centered fixed size
- Table: Full table view
```

---

## 📱 ICONOGRAFÍA (Heroicons/Lucide)

### NAVEGACIÓN
```
📦 package-2 (Productos)
📋 clipboard-list (Movimientos)
⚠️ alert-triangle (Alertas)
📊 bar-chart-3 (Reportes)
🏠 home (Dashboard)
⚙️ settings (Configuración)
```

### ACCIONES
```
➕ plus (Agregar)
✏️ edit-3 (Editar)
🗑️ trash-2 (Eliminar)
👁️ eye (Ver)
🔍 search (Buscar)
📤 upload (Importar)
📥 download (Exportar)
🔄 refresh-cw (Actualizar)
💾 save (Guardar)
❌ x (Cancelar/Cerrar)
```

### ESTADOS
```
✅ check-circle (Activo/Éxito)
⚠️ alert-circle (Advertencia/Stock Bajo)
❌ x-circle (Error/Vencido)
📅 calendar (Fecha)
📊 trending-up (Stock/Tendencia)
🔔 bell (Notificaciones)
```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN FIGMA

### CONFIGURACIÓN INICIAL
- [ ] Crear nuevo proyecto "Sistema Almacén Instituto"
- [ ] Configurar grilla 8px
- [ ] Importar fuente Inter de Google Fonts
- [ ] Crear paleta de colores como estilos
- [ ] Configurar estilos de texto (H1-H5, Body, Labels)

### DESIGN SYSTEM
- [ ] Crear componentes de botones (Primary, Secondary, Icon)
- [ ] Crear componentes de formularios (Input, Select, Search)
- [ ] Crear badges de estado (Activo, Stock Bajo, Vencido, Baja)
- [ ] Crear cards (Estadística, Producto)
- [ ] Crear iconos y símbolos
- [ ] Crear layout grids (Desktop, Tablet, Mobile)

### WIREFRAMES
- [ ] Dashboard desktop (1440px)
- [ ] Gestión productos desktop
- [ ] Sistema alertas desktop
- [ ] Movimientos inventario desktop
- [ ] Modales y overlays
- [ ] Navegación y headers

### RESPONSIVE
- [ ] Versiones tablet (768px)
- [ ] Versiones mobile (375px)
- [ ] Navegación responsive
- [ ] Componentes adaptativos
- [ ] Bottom navigation mobile

### PROTOTYPING
- [ ] Flujos de navegación
- [ ] Interacciones de formularios
- [ ] Estados hover/active/focus
- [ ] Transiciones entre pantallas
- [ ] Validaciones en tiempo real

### DOCUMENTACIÓN
- [ ] Especificaciones de colores
- [ ] Guía de tipografía
- [ ] Espaciado y dimensiones
- [ ] Estados de componentes
- [ ] Flujos de usuario

---

## 📊 MÉTRICAS DE DISEÑO

### PERFORMANCE
- Tiempo de carga: < 3 segundos
- Tiempo de respuesta: < 500ms
- Accesibilidad: WCAG 2.1 AA

### USABILIDAD
- Clicks para completar tarea: < 3
- Tiempo para aprender: < 30 minutos
- Tasa de error: < 5%

### RESPONSIVE
- Mobile: 375px - 767px (100% funcional)
- Tablet: 768px - 1199px (100% funcional)
- Desktop: 1200px+ (100% funcional)

---

**📝 Documento creado:** 22 de Julio, 2025  
**🎨 Versión:** 1.0  
**👨‍💻 Creado por:** GitHub Copilot  
**🏢 Proyecto:** Sistema Control Almacén - Instituto Educativo

---

## 📎 ARCHIVOS ADJUNTOS RECOMENDADOS

1. **database-schema.sql** - Esquema completo de base de datos
2. **componentes-figma.fig** - Archivo de componentes para importar
3. **iconos-sistema.zip** - Set de iconos SVG
4. **guia-colores.ase** - Paleta para Adobe/Figma
5. **wireframes-completos.pdf** - Versión imprimible

**Para usar este documento:**
1. Copia el contenido a un archivo .md
2. Úsalo como referencia para crear en Figma
3. Comparte con tu equipo para revisión
4. Actualiza según feedback recibido
