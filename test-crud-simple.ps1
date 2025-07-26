# ============================================================================
# SCRIPT DE PRUEBAS COMPLETAS CRUD - SISTEMA DE ALMACEN
# ============================================================================

Write-Host "Iniciando pruebas completas de CRUD - Sistema de Almacen" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green

$baseUrl = "http://localhost:3003/api"
$headers = @{
    "Content-Type" = "application/json"
}

# 1. VERIFICAR CONECTIVIDAD
Write-Host "`n1. VERIFICANDO CONECTIVIDAD..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Servidor funcionando: $($health.message)" -ForegroundColor Green
    Write-Host "   Uptime: $($health.data.uptime)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error de conectividad: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. CRUD DE PRODUCTOS
Write-Host "`n2. PRUEBAS CRUD DE PRODUCTOS..." -ForegroundColor Yellow

# Listar productos
Write-Host "`n2.1 GET /api/products - Listar productos" -ForegroundColor Cyan
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
    Write-Host "✅ Productos obtenidos: $($products.data.Count) productos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo productos: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear producto
Write-Host "`n2.2 POST /api/products - Crear producto" -ForegroundColor Cyan
$newProduct = @{
    codigo_item = "TEST001"
    nombre_item = "Producto de Prueba CRUD"
    nombre_marca = "Marca Test - CRUD-2025"
    orden_compra = "CRUD-2025"
    nombre_medida = "Unidad"
    mayor = 5.50
    sub_cta = "TEST001"
    stock_actual = 100
    fecha_ingreso = "2025-07-24"
    fecha_vencimiento = "2026-07-24"
    estado = "activo"
} | ConvertTo-Json

try {
    $createdProduct = Invoke-RestMethod -Uri "$baseUrl/products" -Method POST -Body $newProduct -Headers $headers
    Write-Host "✅ Producto creado: $($createdProduct.data.codigo_item)" -ForegroundColor Green
    $testProductId = $createdProduct.data.id
    Write-Host "   ID asignado: $testProductId" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando producto: $($_.Exception.Message)" -ForegroundColor Red
    # Buscar si ya existe
    try {
        $existingProducts = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
        $testProduct = $existingProducts.data | Where-Object { $_.codigo_item -eq "TEST001" }
        if ($testProduct) {
            $testProductId = $testProduct.id
            Write-Host "   Producto ya existe, usando ID: $testProductId" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ No se pudo obtener ID del producto" -ForegroundColor Red
    }
}

# Obtener producto específico
if ($testProductId) {
    Write-Host "`n2.3 GET /api/products/$testProductId - Obtener producto específico" -ForegroundColor Cyan
    try {
        $product = Invoke-RestMethod -Uri "$baseUrl/products/$testProductId" -Method GET
        Write-Host "✅ Producto obtenido: $($product.data.nombre_item)" -ForegroundColor Green
        Write-Host "   Stock actual: $($product.data.stock_actual)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error obteniendo producto: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Actualizar producto
if ($testProductId) {
    Write-Host "`n2.4 PUT /api/products/$testProductId - Actualizar producto" -ForegroundColor Cyan
    $updateProduct = @{
        nombre_item = "Producto de Prueba CRUD ACTUALIZADO"
        stock_actual = 150
        mayor = 6.75
    } | ConvertTo-Json

    try {
        $updatedProduct = Invoke-RestMethod -Uri "$baseUrl/products/$testProductId" -Method PUT -Body $updateProduct -Headers $headers
        Write-Host "✅ Producto actualizado: $($updatedProduct.data.nombre_item)" -ForegroundColor Green
        Write-Host "   Nuevo stock: $($updatedProduct.data.stock_actual)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error actualizando producto: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 3. CRUD DE MOVIMIENTOS
Write-Host "`n3. PRUEBAS CRUD DE MOVIMIENTOS..." -ForegroundColor Yellow

# Listar movimientos
Write-Host "`n3.1 GET /api/movements - Listar movimientos" -ForegroundColor Cyan
try {
    $movements = Invoke-RestMethod -Uri "$baseUrl/movements" -Method GET
    Write-Host "✅ Movimientos obtenidos: $($movements.data.Count) movimientos" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo movimientos: $($_.Exception.Message)" -ForegroundColor Red
}

# Crear movimiento de entrada
if ($testProductId) {
    Write-Host "`n3.2 POST /api/movements - Crear movimiento de ENTRADA" -ForegroundColor Cyan
    $newMovement = @{
        producto_id = $testProductId
        tipo_movimiento = "entrada"
        cantidad = 25
        usuario = "Admin Test"
        observaciones = "Prueba CRUD - Movimiento de entrada automatizado"
    } | ConvertTo-Json

    try {
        $createdMovement = Invoke-RestMethod -Uri "$baseUrl/movements" -Method POST -Body $newMovement -Headers $headers
        Write-Host "✅ Movimiento de entrada creado: +$($createdMovement.data.cantidad) unidades" -ForegroundColor Green
        Write-Host "   Stock anterior: $($createdMovement.data.stock_anterior) → Stock final: $($createdMovement.data.stock_post_movimiento)" -ForegroundColor Cyan
        $testMovementId = $createdMovement.data.id
    } catch {
        Write-Host "❌ Error creando movimiento: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Crear movimiento de salida
if ($testProductId) {
    Write-Host "`n3.3 POST /api/movements - Crear movimiento de SALIDA" -ForegroundColor Cyan
    $newMovement = @{
        producto_id = $testProductId
        tipo_movimiento = "salida"
        cantidad = 10
        usuario = "Admin Test"
        observaciones = "Prueba CRUD - Movimiento de salida automatizado"
    } | ConvertTo-Json

    try {
        $createdMovement = Invoke-RestMethod -Uri "$baseUrl/movements" -Method POST -Body $newMovement -Headers $headers
        Write-Host "✅ Movimiento de salida creado: -$($createdMovement.data.cantidad) unidades" -ForegroundColor Green
        Write-Host "   Stock anterior: $($createdMovement.data.stock_anterior) → Stock final: $($createdMovement.data.stock_post_movimiento)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error creando movimiento de salida: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 4. CRUD DE ALERTAS
Write-Host "`n4. PRUEBAS CRUD DE ALERTAS..." -ForegroundColor Yellow

# Listar alertas
Write-Host "`n4.1 GET /api/alerts - Listar alertas" -ForegroundColor Cyan
try {
    $alerts = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method GET
    Write-Host "✅ Alertas obtenidas: $($alerts.data.Count) alertas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo alertas: $($_.Exception.Message)" -ForegroundColor Red
}

# Generar alertas automáticas
Write-Host "`n4.2 POST /api/alerts/generate - Generar alertas automáticas" -ForegroundColor Cyan
try {
    $generatedAlerts = Invoke-RestMethod -Uri "$baseUrl/alerts/generate" -Method POST -Headers $headers
    Write-Host "✅ Alertas generadas:" -ForegroundColor Green
    Write-Host "   Stock bajo: $($generatedAlerts.data.lowStock)" -ForegroundColor Cyan
    Write-Host "   Próximo vencimiento: $($generatedAlerts.data.nearExpiration)" -ForegroundColor Cyan
    Write-Host "   Vencidos: $($generatedAlerts.data.expired)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error generando alertas: $($_.Exception.Message)" -ForegroundColor Red
}

# Estadísticas de alertas
Write-Host "`n4.3 GET /api/alerts/stats - Estadísticas de alertas" -ForegroundColor Cyan
try {
    $alertStats = Invoke-RestMethod -Uri "$baseUrl/alerts/stats" -Method GET
    Write-Host "✅ Estadísticas obtenidas:" -ForegroundColor Green
    Write-Host "   Pendientes: $($alertStats.data.pending)" -ForegroundColor Yellow
    Write-Host "   Resueltas: $($alertStats.data.resolved)" -ForegroundColor Green
    Write-Host "   Ignoradas: $($alertStats.data.ignored)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error obteniendo estadísticas: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. CRUD DE SOBRANTES
Write-Host "`n5. PRUEBAS CRUD DE SOBRANTES..." -ForegroundColor Yellow

# Listar sobrantes
Write-Host "`n5.1 GET /api/surplus - Listar sobrantes" -ForegroundColor Cyan
try {
    $surplus = Invoke-RestMethod -Uri "$baseUrl/surplus" -Method GET
    Write-Host "✅ Sobrantes obtenidos: $($surplus.data.Count) sobrantes" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo sobrantes: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. CRUD DE BAJAS
Write-Host "`n6. PRUEBAS CRUD DE BAJAS..." -ForegroundColor Yellow

# Listar bajas
Write-Host "`n6.1 GET /api/withdrawals - Listar bajas" -ForegroundColor Cyan
try {
    $withdrawals = Invoke-RestMethod -Uri "$baseUrl/withdrawals" -Method GET
    Write-Host "✅ Bajas obtenidas: $($withdrawals.data.Count) bajas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo bajas: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. PRUEBAS DE REPORTES
Write-Host "`n7. PRUEBAS DE REPORTES..." -ForegroundColor Yellow

# Reporte de inventario
Write-Host "`n7.1 GET /api/reports/inventory - Reporte de inventario" -ForegroundColor Cyan
try {
    $inventoryReport = Invoke-RestMethod -Uri "$baseUrl/reports/inventory" -Method GET
    Write-Host "✅ Reporte de inventario obtenido:" -ForegroundColor Green
    Write-Host "   Total productos: $($inventoryReport.data.totalProducts)" -ForegroundColor Cyan
    Write-Host "   Valor total: $($inventoryReport.data.totalValue)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo reporte de inventario: $($_.Exception.Message)" -ForegroundColor Red
}

# Reporte de movimientos
Write-Host "`n7.2 GET /api/reports/movements - Reporte de movimientos" -ForegroundColor Cyan
try {
    $movementsReport = Invoke-RestMethod -Uri "$baseUrl/reports/movements?days=30" -Method GET
    Write-Host "✅ Reporte de movimientos obtenido:" -ForegroundColor Green
    Write-Host "   Total movimientos (30 dias): $($movementsReport.data.totalMovements)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo reporte de movimientos: $($_.Exception.Message)" -ForegroundColor Red
}

# RESUMEN FINAL
Write-Host "`n"
Write-Host "================================================================" -ForegroundColor Green
Write-Host "PRUEBAS CRUD COMPLETADAS - RESUMEN PARA NETBEANS" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "BASE URL: http://localhost:3003/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRODUCTOS (CRUD completo):" -ForegroundColor Yellow
Write-Host "   GET    /api/products           - Listar todos los productos" -ForegroundColor White
Write-Host "   GET    /api/products/{id}      - Obtener producto específico" -ForegroundColor White
Write-Host "   POST   /api/products           - Crear nuevo producto" -ForegroundColor White
Write-Host "   PUT    /api/products/{id}      - Actualizar producto" -ForegroundColor White
Write-Host "   DELETE /api/products/{id}      - Eliminar producto" -ForegroundColor White
Write-Host ""
Write-Host "MOVIMIENTOS (CRUD completo):" -ForegroundColor Yellow
Write-Host "   GET    /api/movements          - Listar todos los movimientos" -ForegroundColor White
Write-Host "   GET    /api/movements/{id}     - Obtener movimiento específico" -ForegroundColor White
Write-Host "   POST   /api/movements          - Crear nuevo movimiento" -ForegroundColor White
Write-Host ""
Write-Host "ALERTAS (CRUD de gestión):" -ForegroundColor Yellow
Write-Host "   GET    /api/alerts             - Listar todas las alertas" -ForegroundColor White
Write-Host "   GET    /api/alerts/stats       - Estadísticas de alertas" -ForegroundColor White
Write-Host "   POST   /api/alerts/generate    - Generar alertas automáticas" -ForegroundColor White
Write-Host "   PUT    /api/alerts/{id}/resolve - Resolver alerta" -ForegroundColor White
Write-Host "   PUT    /api/alerts/{id}/ignore  - Ignorar alerta" -ForegroundColor White
Write-Host ""
Write-Host "SOBRANTES:" -ForegroundColor Yellow
Write-Host "   GET    /api/surplus            - Listar sobrantes" -ForegroundColor White
Write-Host "   POST   /api/surplus/{id}/mark  - Marcar como sobrante" -ForegroundColor White
Write-Host "   POST   /api/surplus/{id}/ship  - Enviar sobrante" -ForegroundColor White
Write-Host ""
Write-Host "BAJAS:" -ForegroundColor Yellow
Write-Host "   GET    /api/withdrawals        - Listar bajas" -ForegroundColor White
Write-Host "   POST   /api/withdrawals/{id}   - Dar de baja producto" -ForegroundColor White
Write-Host ""
Write-Host "REPORTES:" -ForegroundColor Yellow
Write-Host "   GET    /api/reports/inventory  - Reporte de inventario" -ForegroundColor White
Write-Host "   GET    /api/reports/movements  - Reporte de movimientos" -ForegroundColor White
Write-Host ""
Write-Host "NOTAS PARA NETBEANS:" -ForegroundColor Cyan
Write-Host "   • Usar Content-Type: application/json en headers" -ForegroundColor White
Write-Host "   • Endpoints devuelven JSON: success, message, data" -ForegroundColor White
Write-Host "   • Errores devuelven código HTTP + mensaje" -ForegroundColor White
Write-Host "   • CORS configurado para localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "✅ Sistema listo para consumir desde NetBeans!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
