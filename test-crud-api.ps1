# ============================================================================
# SCRIPT DE PRUEBAS COMPLETAS CRUD - SISTEMA DE ALMACÉN
# ============================================================================
# Para usar desde NetBeans, usa estas URLs y métodos HTTP

Write-Host "🚀 INICIANDO PRUEBAS COMPLETAS DE CRUD - SISTEMA DE ALMACÉN" -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Green

$baseUrl = "http://localhost:3003/api"
$headers = @{
    "Content-Type" = "application/json"
}

# ============================================================================
# 1. PRUEBAS DE CONECTIVIDAD Y SALUD DEL SISTEMA
# ============================================================================
Write-Host "`n📡 1. VERIFICANDO CONECTIVIDAD..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Servidor funcionando: $($health.message)" -ForegroundColor Green
    Write-Host "   Uptime: $($health.data.uptime)" -ForegroundColor Cyan
    Write-Host "   Memoria: $($health.data.memory.heapUsed)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error de conectividad: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

try {
    $info = Invoke-RestMethod -Uri "$baseUrl/info" -Method GET
    Write-Host "✅ Info del sistema: $($info.data.instituteName)" -ForegroundColor Green
    Write-Host "   Versión: $($info.data.systemVersion)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo info: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================================================
# 2. CRUD DE PRODUCTOS
# ============================================================================
Write-Host "`n📦 2. PRUEBAS CRUD DE PRODUCTOS..." -ForegroundColor Yellow

# 2.1 GET - Listar todos los productos
Write-Host "`n📋 2.1 GET /api/products - Listar productos" -ForegroundColor Cyan
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
    Write-Host "✅ Productos obtenidos: $($products.data.Count) productos" -ForegroundColor Green
    if ($products.data.Count -gt 0) {
        Write-Host "   Primer producto: $($products.data[0].codigo_item) - $($products.data[0].nombre_item)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error obteniendo productos: $($_.Exception.Message)" -ForegroundColor Red
}

# 2.2 POST - Crear nuevo producto
Write-Host "`n➕ 2.2 POST /api/products - Crear producto" -ForegroundColor Cyan
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
    # Intentar obtener el ID si ya existe
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

# 2.3 GET - Obtener producto específico
if ($testProductId) {
    Write-Host "`n👁️ 2.3 GET /api/products/$testProductId - Obtener producto específico" -ForegroundColor Cyan
    try {
        $product = Invoke-RestMethod -Uri "$baseUrl/products/$testProductId" -Method GET
        Write-Host "✅ Producto obtenido: $($product.data.nombre_item)" -ForegroundColor Green
        Write-Host "   Stock actual: $($product.data.stock_actual)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error obteniendo producto: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 2.4 PUT - Actualizar producto
if ($testProductId) {
    Write-Host "`n✏️ 2.4 PUT /api/products/$testProductId - Actualizar producto" -ForegroundColor Cyan
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

# ============================================================================
# 3. CRUD DE MOVIMIENTOS
# ============================================================================
Write-Host "`n📋 3. PRUEBAS CRUD DE MOVIMIENTOS..." -ForegroundColor Yellow

# 3.1 GET - Listar movimientos
Write-Host "`n📋 3.1 GET /api/movements - Listar movimientos" -ForegroundColor Cyan
try {
    $movements = Invoke-RestMethod -Uri "$baseUrl/movements" -Method GET
    Write-Host "✅ Movimientos obtenidos: $($movements.data.Count) movimientos" -ForegroundColor Green
    if ($movements.data.Count -gt 0) {
        Write-Host "   Último movimiento: $($movements.data[0].tipo_movimiento) - $($movements.data[0].cantidad) unidades" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error obteniendo movimientos: $($_.Exception.Message)" -ForegroundColor Red
}

# 3.2 POST - Crear movimiento de entrada
if ($testProductId) {
    Write-Host "`n📥 3.2 POST /api/movements - Crear movimiento de ENTRADA" -ForegroundColor Cyan
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

# 3.3 POST - Crear movimiento de salida
if ($testProductId) {
    Write-Host "`n📤 3.3 POST /api/movements - Crear movimiento de SALIDA" -ForegroundColor Cyan
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

# 3.4 GET - Obtener movimiento específico
if ($testMovementId) {
    Write-Host "`n👁️ 3.4 GET /api/movements/$testMovementId - Obtener movimiento específico" -ForegroundColor Cyan
    try {
        $movement = Invoke-RestMethod -Uri "$baseUrl/movements/$testMovementId" -Method GET
        Write-Host "✅ Movimiento obtenido: $($movement.data.tipo_movimiento) de $($movement.data.cantidad) unidades" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error obteniendo movimiento: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ============================================================================
# 4. CRUD DE ALERTAS
# ============================================================================
Write-Host "`n⚠️ 4. PRUEBAS CRUD DE ALERTAS..." -ForegroundColor Yellow

# 4.1 GET - Listar alertas
Write-Host "`n📋 4.1 GET /api/alerts - Listar alertas" -ForegroundColor Cyan
try {
    $alerts = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method GET
    Write-Host "✅ Alertas obtenidas: $($alerts.data.Count) alertas" -ForegroundColor Green
    if ($alerts.data.Count -gt 0) {
        Write-Host "   Primera alerta: $($alerts.data[0].tipo_alerta) - $($alerts.data[0].estado_alerta)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error obteniendo alertas: $($_.Exception.Message)" -ForegroundColor Red
}

# 4.2 POST - Generar alertas automáticas
Write-Host "`n🔄 4.2 POST /api/alerts/generate - Generar alertas automáticas" -ForegroundColor Cyan
try {
    $generatedAlerts = Invoke-RestMethod -Uri "$baseUrl/alerts/generate" -Method POST -Headers $headers
    Write-Host "✅ Alertas generadas:" -ForegroundColor Green
    Write-Host "   Stock bajo: $($generatedAlerts.data.lowStock)" -ForegroundColor Cyan
    Write-Host "   Próximo vencimiento: $($generatedAlerts.data.nearExpiration)" -ForegroundColor Cyan
    Write-Host "   Vencidos: $($generatedAlerts.data.expired)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error generando alertas: $($_.Exception.Message)" -ForegroundColor Red
}

# 4.3 GET - Estadísticas de alertas
Write-Host "`n📊 4.3 GET /api/alerts/stats - Estadísticas de alertas" -ForegroundColor Cyan
try {
    $alertStats = Invoke-RestMethod -Uri "$baseUrl/alerts/stats" -Method GET
    Write-Host "✅ Estadísticas obtenidas:" -ForegroundColor Green
    Write-Host "   Pendientes: $($alertStats.data.pending)" -ForegroundColor Yellow
    Write-Host "   Resueltas: $($alertStats.data.resolved)" -ForegroundColor Green
    Write-Host "   Ignoradas: $($alertStats.data.ignored)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error obteniendo estadísticas: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================================================
# 5. CRUD DE SOBRANTES
# ============================================================================
Write-Host "`n📦 5. PRUEBAS CRUD DE SOBRANTES..." -ForegroundColor Yellow

# 5.1 GET - Listar sobrantes
Write-Host "`n📋 5.1 GET /api/surplus - Listar sobrantes" -ForegroundColor Cyan
try {
    $surplus = Invoke-RestMethod -Uri "$baseUrl/surplus" -Method GET
    Write-Host "✅ Sobrantes obtenidos: $($surplus.data.Count) sobrantes" -ForegroundColor Green
    if ($surplus.data.Count -gt 0) {
        Write-Host "   Primer sobrante: $($surplus.data[0].codigo_item) - Estado: $($surplus.data[0].estado)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error obteniendo sobrantes: $($_.Exception.Message)" -ForegroundColor Red
}

# 5.2 POST - Marcar producto como sobrante
if ($testProductId) {
    Write-Host "`n📦 5.2 POST /api/surplus/$testProductId/mark - Marcar como sobrante" -ForegroundColor Cyan
    $markSurplus = @{
        motivo = "Prueba CRUD - Producto marcado como sobrante automaticamente"
        cantidad_sobrante = 5
    } | ConvertTo-Json

    try {
        $markedSurplus = Invoke-RestMethod -Uri "$baseUrl/surplus/$testProductId/mark" -Method POST -Body $markSurplus -Headers $headers
        Write-Host "✅ Producto marcado como sobrante" -ForegroundColor Green
        Write-Host "   Cantidad sobrante: $($markedSurplus.data.cantidad_sobrante)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error marcando sobrante: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ============================================================================
# 6. CRUD DE BAJAS (WITHDRAWALS)
# ============================================================================
Write-Host "`n📤 6. PRUEBAS CRUD DE BAJAS..." -ForegroundColor Yellow

# 6.1 GET - Listar bajas
Write-Host "`n📋 6.1 GET /api/withdrawals - Listar bajas" -ForegroundColor Cyan
try {
    $withdrawals = Invoke-RestMethod -Uri "$baseUrl/withdrawals" -Method GET
    Write-Host "✅ Bajas obtenidas: $($withdrawals.data.Count) bajas" -ForegroundColor Green
    if ($withdrawals.data.Count -gt 0) {
        Write-Host "   Primera baja: $($withdrawals.data[0].codigo_item) - Motivo: $($withdrawals.data[0].motivo_baja)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Error obteniendo bajas: $($_.Exception.Message)" -ForegroundColor Red
}

# 6.2 POST - Dar de baja un producto
if ($testProductId) {
    Write-Host "`n📤 6.2 POST /api/withdrawals/$testProductId - Dar de baja producto" -ForegroundColor Cyan
    $withdrawal = @{
        motivo_baja = "vencido"
        observaciones = "Prueba CRUD - Producto dado de baja automaticamente por vencimiento"
        usuario_baja = "Admin Test"
        cantidad_baja = 3
    } | ConvertTo-Json

    try {
        $withdrawnProduct = Invoke-RestMethod -Uri "$baseUrl/withdrawals/$testProductId" -Method POST -Body $withdrawal -Headers $headers
        Write-Host "✅ Producto dado de baja correctamente" -ForegroundColor Green
        Write-Host "   Cantidad dada de baja: $($withdrawnProduct.data.cantidad_baja)" -ForegroundColor Cyan
        Write-Host "   Motivo: $($withdrawnProduct.data.motivo_baja)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error dando de baja producto: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ============================================================================
# 7. PRUEBAS DE REPORTES
# ============================================================================
Write-Host "`n📊 7. PRUEBAS DE REPORTES..." -ForegroundColor Yellow

# 7.1 GET - Reporte de inventario
Write-Host "`n📋 7.1 GET /api/reports/inventory - Reporte de inventario" -ForegroundColor Cyan
try {
    $inventoryReport = Invoke-RestMethod -Uri "$baseUrl/reports/inventory" -Method GET
    Write-Host "✅ Reporte de inventario obtenido:" -ForegroundColor Green
    Write-Host "   Total productos: $($inventoryReport.data.totalProducts)" -ForegroundColor Cyan
    Write-Host "   Valor total: $($inventoryReport.data.totalValue)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo reporte de inventario: $($_.Exception.Message)" -ForegroundColor Red
}

# 7.2 GET - Reporte de movimientos
Write-Host "`n📋 7.2 GET /api/reports/movements - Reporte de movimientos" -ForegroundColor Cyan
try {
    $movementsReport = Invoke-RestMethod -Uri "$baseUrl/reports/movements?days=30" -Method GET
    Write-Host "✅ Reporte de movimientos obtenido:" -ForegroundColor Green
    Write-Host "   Total movimientos (30 dias): $($movementsReport.data.totalMovements)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error obteniendo reporte de movimientos: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================================================
# 8. LIMPIEZA Y RESUMEN
# ============================================================================
Write-Host "`n🧹 8. LIMPIEZA DE DATOS DE PRUEBA..." -ForegroundColor Yellow

# 8.1 DELETE - Eliminar producto de prueba
if ($testProductId) {
    Write-Host "`n🗑️ 8.1 DELETE /api/products/$testProductId - Eliminar producto de prueba" -ForegroundColor Cyan
    try {
        $deletedProduct = Invoke-RestMethod -Uri "$baseUrl/products/$testProductId" -Method DELETE
        Write-Host "✅ Producto de prueba eliminado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error eliminando producto de prueba: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   (Puede estar siendo referenciado por movimientos)" -ForegroundColor Yellow
    }
}

# ============================================================================
# RESUMEN FINAL
# ============================================================================
Write-Host "`n" -NoNewline
Write-Host "============================================================================" -ForegroundColor Green
Write-Host "🎉 PRUEBAS CRUD COMPLETADAS - RESUMEN PARA NETBEANS" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📡 BASE URL: http://localhost:3003/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 PRODUCTOS (CRUD completo):" -ForegroundColor Yellow
Write-Host "   GET    /api/products           - Listar todos los productos" -ForegroundColor White
Write-Host "   GET    /api/products/{id}      - Obtener producto específico" -ForegroundColor White
Write-Host "   POST   /api/products           - Crear nuevo producto" -ForegroundColor White
Write-Host "   PUT    /api/products/{id}      - Actualizar producto" -ForegroundColor White
Write-Host "   DELETE /api/products/{id}      - Eliminar producto" -ForegroundColor White
Write-Host ""
Write-Host "📋 MOVIMIENTOS (CRUD completo):" -ForegroundColor Yellow
Write-Host "   GET    /api/movements          - Listar todos los movimientos" -ForegroundColor White
Write-Host "   GET    /api/movements/{id}     - Obtener movimiento específico" -ForegroundColor White
Write-Host "   POST   /api/movements          - Crear nuevo movimiento" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ ALERTAS (CRUD de gestión):" -ForegroundColor Yellow
Write-Host "   GET    /api/alerts             - Listar todas las alertas" -ForegroundColor White
Write-Host "   GET    /api/alerts/stats       - Estadísticas de alertas" -ForegroundColor White
Write-Host "   POST   /api/alerts/generate    - Generar alertas automáticas" -ForegroundColor White
Write-Host "   PUT    /api/alerts/{id}/resolve - Resolver alerta" -ForegroundColor White
Write-Host "   PUT    /api/alerts/{id}/ignore  - Ignorar alerta" -ForegroundColor White
Write-Host ""
Write-Host "📦 SOBRANTES:" -ForegroundColor Yellow
Write-Host "   GET    /api/surplus            - Listar sobrantes" -ForegroundColor White
Write-Host "   POST   /api/surplus/{id}/mark  - Marcar como sobrante" -ForegroundColor White
Write-Host "   POST   /api/surplus/{id}/ship  - Enviar sobrante" -ForegroundColor White
Write-Host ""
Write-Host "📤 BAJAS:" -ForegroundColor Yellow
Write-Host "   GET    /api/withdrawals        - Listar bajas" -ForegroundColor White
Write-Host "   POST   /api/withdrawals/{id}   - Dar de baja producto" -ForegroundColor White
Write-Host ""
Write-Host "📊 REPORTES:" -ForegroundColor Yellow
Write-Host "   GET    /api/reports/inventory  - Reporte de inventario" -ForegroundColor White
Write-Host "   GET    /api/reports/movements  - Reporte de movimientos" -ForegroundColor White
Write-Host ""
Write-Host "💡 NOTAS PARA NETBEANS:" -ForegroundColor Cyan
Write-Host "   • Usar Content-Type: application/json en headers" -ForegroundColor White
Write-Host "   • Todos los endpoints devuelven JSON con estructura success, message, data" -ForegroundColor White
Write-Host "   • Los errores devuelven código HTTP apropiado + mensaje de error" -ForegroundColor White
Write-Host "   • El servidor incluye CORS configurado para localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "✅ Sistema listo para consumir desde NetBeans!" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
