# 📚 Inventario Instituto - Modelo Visual de Interfaz

Este documento te muestra cómo estructurar la interfaz gráfica de tu sistema de inventario en NetBeans, con todos los apartados, campos y acciones basados en los endpoints que tienes en tu backend (`/api/products`, `/api/movements`, `/api/alerts`, `/api/withdrawals`, `/api/surplus`, `/api/reports`).

---

## 🏠 Dashboard
**Endpoint:** `/api/reports/dashboard`

- **Campos mostrados:**
  - Total Productos
  - Total Movimientos
  - Total Bajas
  - Total Sobrantes
  - Total Alertas
- **Acciones:**
  - Ver Reporte SIGA → Navega a Reporte SIGA
  - Ver Inventario → Navega a Reporte Inventario

---

## 📦 Productos
**Endpoint:** `/api/products`

- **Campos mostrados:**
  - ID
  - Nombre
  - Categoría
  - Stock
  - Precio
  - Descripción
  - Estado
- **Acciones:**
  - Nuevo Producto → Abre formulario para crear producto (POST)
  - Editar → Abre formulario para editar producto seleccionado (PUT)
  - Eliminar → Elimina producto seleccionado (DELETE)
  - Buscar → Filtra productos por nombre/categoría

---

## 🔄 Movimientos
**Endpoint:** `/api/movements`

- **Campos mostrados:**
  - ID
  - Fecha
  - Producto
  - Tipo (Entrada/Salida)
  - Cantidad
  - Usuario
  - Observación
- **Acciones:**
  - Nuevo Movimiento → Abre formulario para crear movimiento (POST)
  - Buscar → Filtra movimientos por fecha/producto/tipo

---

## 🚨 Alertas
**Endpoint:** `/api/alerts`

- **Campos mostrados:**
  - ID
  - Fecha
  - Producto
  - Motivo
  - Estado
- **Acciones:**
  - Ver Detalle → Muestra información completa de la alerta
  - Buscar → Filtra alertas por producto/estado

---

## ⬇️ Bajas
**Endpoint:** `/api/withdrawals`

- **Campos mostrados:**
  - ID
  - Fecha
  - Producto
  - Motivo
  - Cantidad
  - Usuario
- **Acciones:**
  - Nueva Baja → Abre formulario para crear baja (POST)
  - Buscar → Filtra bajas por fecha/producto

---

## ⬆️ Sobrantes
**Endpoint:** `/api/surplus`

- **Campos mostrados:**
  - ID
  - Fecha
  - Producto
  - Motivo
  - Cantidad
  - Usuario
- **Acciones:**
  - Nuevo Sobrante → Abre formulario para crear sobrante (POST)
  - Buscar → Filtra sobrantes por fecha/producto

---

## 📊 Reportes
**Endpoints:**
- `/api/reports/inventory` (Inventario)
- `/api/reports/movements` (Movimientos)
- `/api/reports/siga` (SIGA)

- **Campos mostrados:**
  - Área para mostrar el reporte generado (tabla, PDF, etc.)
- **Acciones:**
  - Generar Reporte Inventario → Muestra reporte de inventario
  - Generar Reporte Movimientos → Muestra reporte de movimientos
  - Generar Reporte SIGA → Muestra reporte SIGA

---

## 🗺️ Navegación entre apartados
- Al hacer click en cada botón principal, navegas al panel correspondiente.
- Los formularios de creación/edición usan los endpoints POST/PUT/DELETE según corresponda.
- Los reportes se generan usando los endpoints de `/api/reports`.

---

## Ejemplo de Navegación
  - Click en "Ver Inventario" → Panel de Reporte Inventario
  - Click en "Ver Reporte SIGA" → Panel de Reporte SIGA
  - Click en "Nuevo Producto" → Formulario de creación
  - Click en "Editar" → Formulario de edición
  - Click en "Eliminar" → Elimina producto
  - Click en "Nuevo Movimiento" → Formulario de creación
  - Click en "Ver Detalle" → Panel de detalle de alerta
  - Click en "Nueva Baja"/"Nuevo Sobrante" → Formulario de creación
  - Click en "Generar Reporte" → Muestra el reporte correspondiente


## Modelos Visuales Desktop (NetBeans/Swing)

### 🏠 Dashboard
```
+-------------------------------------------------------------+
| [JLabel] Estadísticas Generales                             |
+-------------------------------------------------------------+
| [JLabel] Total Productos: [valor]   [JLabel] Total Movimientos: [valor] |
| [JLabel] Total Bajas: [valor]       [JLabel] Total Sobrantes: [valor]   |
| [JLabel] Total Alertas: [valor]                              |
+-------------------------------------------------------------+
| [JButton] Ver Reporte SIGA   [JButton] Ver Inventario        |
+-------------------------------------------------------------+
```

### 📦 Productos
```
+-------------------------------------------------------------+
| [JButton] Nuevo Producto   [JButton] Editar   [JButton] Eliminar |
+-------------------------------------------------------------+
| [JTextField] Buscar: [__________] [JButton] Buscar          |
+-------------------------------------------------------------+
| [JTable]                                                      |
|---------------------------------------------------------------|
| ID | Nombre | Categoría | Stock | Precio | Descripción | Estado|
|----|--------|-----------|-------|--------|-------------|-------|
| ...                                                      ...  |
+-------------------------------------------------------------+
```

### 🔄 Movimientos
```
+-------------------------------------------------------------+
| [JButton] Nuevo Movimiento                                  |
+-------------------------------------------------------------+
| [JTextField] Buscar: [__________] [JButton] Buscar          |
+-------------------------------------------------------------+
| [JTable]                                                    |
|-------------------------------------------------------------|
| ID | Fecha | Producto | Tipo | Cantidad | Usuario | Observación |
|----|-------|----------|------|----------|--------|-------------|
| ...                                                      ...  |
+-------------------------------------------------------------+
```

### 🚨 Alertas
```
+-------------------------------------------------------------+
| [JTextField] Buscar: [__________] [JButton] Buscar          |
+-------------------------------------------------------------+
| [JTable]                                                    |
|-------------------------------------------------------------|
| ID | Fecha | Producto | Motivo | Estado | [JButton] Ver Detalle |
|----|-------|----------|--------|--------|----------------------|
| ...                                                      ...  |
+-------------------------------------------------------------+
```

### ⬇️ Bajas
```
+-------------------------------------------------------------+
| [JButton] Nueva Baja                                        |
+-------------------------------------------------------------+
| [JTextField] Buscar: [__________] [JButton] Buscar          |
+-------------------------------------------------------------+
| [JTable]                                                    |
|-------------------------------------------------------------|
| ID | Fecha | Producto | Motivo | Cantidad | Usuario         |
|----|-------|----------|--------|----------|--------         |
| ...                                                      ...|
+-------------------------------------------------------------+
```

### ⬆️ Sobrantes
```
+-------------------------------------------------------------+
| [JButton] Nuevo Sobrante                                    |
+-------------------------------------------------------------+
| [JTextField] Buscar: [__________] [JButton] Buscar          |
+-------------------------------------------------------------+
| [JTable]                                                    |
|-------------------------------------------------------------|
| ID | Fecha | Producto | Motivo | Cantidad | Usuario         |
|----|-------|----------|--------|----------|--------         |
| ...                                                      ...|
+-------------------------------------------------------------+
```

### 📊 Reportes
```
+-------------------------------------------------------------+
| [JButton] Generar Reporte Inventario                        |
| [JButton] Generar Reporte Movimientos                       |
| [JButton] Generar Reporte SIGA                              |
+-------------------------------------------------------------+
| [JTable] o [JTextArea] para mostrar el reporte generado     |
+-------------------------------------------------------------+
```

## Sugerencia Visual (para NetBeans)
- Usa `JPanel` para cada sección.
- Usa `JTable` para mostrar listas.
- Usa `JButton` para acciones.
- Usa `JLabel` para títulos y estadísticas.
- Usa `JTextField` para búsqueda y filtros.

---

> Replica cada apartado como un panel o ventana en NetBeans, conectando los botones a los endpoints correspondientes usando tus servicios Java.

---

¿Quieres que te detalle el modelo de código Java para algún panel específico?

---

# Guía de Diseño Visual y Recomendaciones

## Estructura General

- **Barra de menú superior:**
  - Archivo | Inventario | Movimientos | Ayuda
  - Opciones como “Salir”, “Configuración”, “Acerca de”, etc.

- **Barra de pestañas o botones principales:**
  - Dashboard | Productos | Movimientos | Entrada Rápida | Salida Rápida | Alertas | Bajas | Sobrantes | Reportes
  - Cada pestaña/panel muestra la información y acciones de ese apartado.

---

## Ejemplo Visual Integrado

```
+-------------------------------------------------------------+
| [Menú] Archivo | Inventario | Movimientos | Ayuda           |
+-------------------------------------------------------------+
| [Pestañas] Dashboard | Productos | Movimientos | ...         |
+-------------------------------------------------------------+
| [Panel activo: Productos]                                   |
|-------------------------------------------------------------|
| [JTextField] Buscar: [_____] [JButton] Buscar [JButton] Cargar Datos |
|-------------------------------------------------------------|
| [JTable]                                                    |
| Código | Nombre | Stock | Estado | ...                      |
|-------------------------------------------------------------|
| [JLabel] Productos cargados: X                              |
+-------------------------------------------------------------+
```

---

## Sugerencias de Estilo

- Colores suaves y consistentes (gris claro, azul, blanco).
- Iconos pequeños en los botones para mejor visualización.
- Espaciado entre componentes para evitar saturación.
- Mensajes de estado y ayuda en la parte inferior de cada panel.
- Paneles con bordes redondeados y sombra (si el look&feel lo permite).

---

## Recomendaciones de Navegación

- Mantén la navegación clara y accesible.
- Los paneles deben ser independientes y fáciles de cambiar con las pestañas.
- Los botones de acción deben estar siempre visibles y agrupados.
- La información importante (totales, alertas) debe estar destacada.

---

> Adapta y mejora el diseño visual según tus necesidades y preferencias. Usa NetBeans para organizar los paneles, tablas y botones siguiendo esta guía.

---

# Ejemplo de Paneles

## 🏠 Dashboard
- Panel con estadísticas generales (totales de productos, movimientos, bajas, sobrantes, alertas).
- Gráficos simples (opcional) para visualizar tendencias.
- Botones para acceder rápidamente a reportes.

## 📦 Productos
- Filtros de búsqueda por código, nombre, categoría.
- Botones: Nuevo, Editar, Eliminar, Cargar Datos.
- Tabla con columnas: Código, Nombre, Stock, Estado, Categoría, Precio, Descripción.
- Mensaje inferior: “Productos cargados: X”.

## 🔄 Movimientos
- Filtros por fecha, producto, tipo.
- Botón: Nuevo Movimiento.
- Tabla: ID, Fecha, Producto, Tipo, Cantidad, Usuario, Observación.
- Mensaje inferior: “Movimientos cargados: X”.

## 🚨 Alertas
- Filtro por producto, estado.
- Tabla: ID, Fecha, Producto, Motivo, Estado.
- Botón: Ver Detalle.

## ⬇️ Bajas / ⬆️ Sobrantes
- Filtros por fecha, producto.
- Botón: Nueva Baja / Nuevo Sobrante.
- Tabla: ID, Fecha, Producto, Motivo, Cantidad, Usuario.

## 📊 Reportes
- Botones: Generar Reporte Inventario, Movimientos, SIGA.
- Área para mostrar el reporte generado (tabla, PDF, exportar a Excel).
