# Prueba final completa del backend - 100% funcional
Write-Host "🎯 PRUEBA FINAL - BACKEND 100% FUNCIONAL" -ForegroundColor Magenta
Write-Host "=====================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3003/api"
$totalTests = 0
$passedTests = 0

function Test-Endpoint {
    param($Name, $Method, $Url, $Body = $null)
    
    $global:totalTests++
    try {
        $headers = @{"Content-Type"="application/json"}
        
        if ($Body) {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Body $Body -Headers $headers -ErrorAction Stop
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $headers -ErrorAction Stop
        }
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host "✅ $Name - STATUS: $($response.StatusCode)" -ForegroundColor Green
            $global:passedTests++
            return $true
        } else {
            Write-Host "❌ $Name - STATUS: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $Name - ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "`n🏥 1. HEALTH CHECK" -ForegroundColor Yellow
Test-Endpoint "Health Check" "GET" "$baseUrl/health"

Write-Host "`n📦 2. PRODUCTOS" -ForegroundColor Yellow
Test-Endpoint "GET Productos" "GET" "$baseUrl/products"
Test-Endpoint "GET Producto específico" "GET" "$baseUrl/products/2"

$newProduct = @{
    codigo_item = "FINAL001"
    nombre_item = "Producto Final Test"
    nombre_marca = "FinalBrand"
    nombre_medida = "Unidad"
    mayor = 10.00
    sub_cta = "FINAL"
    stock_actual = 50
    fecha_vencimiento = "2026-12-31"
} | ConvertTo-Json

Test-Endpoint "POST Crear Producto" "POST" "$baseUrl/products" $newProduct

# Obtener ID del producto creado para las siguientes pruebas
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
    $testProduct = $products.data | Where-Object {$_.codigo_item -eq "FINAL001"} | Select-Object -First 1
    $testProductId = $testProduct.id
    
    if ($testProductId) {
        $updateProduct = @{
            nombre_item = "Producto Final Test Actualizado"
            mayor = 12.50
        } | ConvertTo-Json
        
        Test-Endpoint "PUT Actualizar Producto" "PUT" "$baseUrl/products/$testProductId" $updateProduct
    }
} catch {
    Write-Host "⚠️ No se pudo actualizar producto de prueba" -ForegroundColor Yellow
}

Write-Host "`n🔄 3. MOVIMIENTOS" -ForegroundColor Yellow
Test-Endpoint "GET Movimientos" "GET" "$baseUrl/movements"
Test-Endpoint "GET Estadísticas de Movimientos" "GET" "$baseUrl/movements/stats"

$entrada = @{
    producto_id = 2
    cantidad = 10
    usuario = "Test Usuario"
    observaciones = "Entrada final test"
} | ConvertTo-Json

Test-Endpoint "POST Entrada" "POST" "$baseUrl/movements/entry" $entrada

$salida = @{
    producto_id = 2
    cantidad = 3
    usuario = "Test Usuario"
    observaciones = "Salida final test"
} | ConvertTo-Json

Test-Endpoint "POST Salida" "POST" "$baseUrl/movements/exit" $salida

Write-Host "`n🚨 4. ALERTAS" -ForegroundColor Yellow
Test-Endpoint "GET Alertas" "GET" "$baseUrl/alerts"
Test-Endpoint "GET Estadísticas Alertas" "GET" "$baseUrl/alerts/stats"
Test-Endpoint "POST Generar Alertas" "POST" "$baseUrl/alerts/generate"

Write-Host "`n📊 5. REPORTES" -ForegroundColor Yellow
Test-Endpoint "GET Reportes" "GET" "$baseUrl/reports"

Write-Host "`n📦 6. SURPLUS" -ForegroundColor Yellow
Test-Endpoint "GET Surplus" "GET" "$baseUrl/surplus"
Test-Endpoint "GET Estadísticas Surplus" "GET" "$baseUrl/surplus/stats"
Test-Endpoint "GET Reporte Envío" "GET" "$baseUrl/surplus/report"

$surplus = @{
    producto_id = 3
    cantidad = 5
    observaciones = "Surplus final test"
} | ConvertTo-Json

Test-Endpoint "POST Crear Surplus" "POST" "$baseUrl/surplus" $surplus

Write-Host "`n📉 7. WITHDRAWALS (BAJAS)" -ForegroundColor Yellow
Test-Endpoint "GET Withdrawals" "GET" "$baseUrl/withdrawals"
Test-Endpoint "GET Estadísticas Withdrawals" "GET" "$baseUrl/withdrawals/stats"
Test-Endpoint "GET Productos dados de baja" "GET" "$baseUrl/withdrawals/products"

$withdrawal = @{
    producto_id = 4
    cantidad_baja = 2
    motivo_baja = "Producto vencido - Test final"
    usuario = "Test Usuario"
    observaciones = "Baja final test"
} | ConvertTo-Json

Test-Endpoint "POST Crear Withdrawal" "POST" "$baseUrl/withdrawals" $withdrawal

# Resumen final
Write-Host "`n🎉 RESUMEN FINAL" -ForegroundColor Magenta
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Total de pruebas: $totalTests" -ForegroundColor White
Write-Host "Pruebas exitosas: $passedTests" -ForegroundColor Green
Write-Host "Pruebas fallidas: $($totalTests - $passedTests)" -ForegroundColor Red

$percentage = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "Porcentaje de éxito: $percentage%" -ForegroundColor $(if($percentage -eq 100) {"Green"} elseif($percentage -ge 85) {"Yellow"} else {"Red"})

if ($percentage -eq 100) {
    Write-Host "`n🎊 ¡FELICITACIONES! TU BACKEND ESTÁ 100% FUNCIONAL 🎊" -ForegroundColor Green
    Write-Host "✅ Listo para ser consumido por tu frontend en NetBeans" -ForegroundColor Green
} elseif ($percentage -ge 85) {
    Write-Host "`n⚠️ Tu backend está casi completo ($percentage%)" -ForegroundColor Yellow
    Write-Host "Revisa los endpoints que fallaron para completar el 100%" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Necesitas revisar varios endpoints que están fallando" -ForegroundColor Red
}

Write-Host "`n📋 API ENDPOINTS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "GET    /api/health" -ForegroundColor White
Write-Host "GET    /api/products" -ForegroundColor White
Write-Host "POST   /api/products" -ForegroundColor White
Write-Host "PUT    /api/products/:id" -ForegroundColor White
Write-Host "DELETE /api/products/:id" -ForegroundColor White
Write-Host "GET    /api/movements" -ForegroundColor White
Write-Host "POST   /api/movements/entry" -ForegroundColor White
Write-Host "POST   /api/movements/exit" -ForegroundColor White
Write-Host "GET    /api/alerts" -ForegroundColor White
Write-Host "POST   /api/alerts/generate" -ForegroundColor White
Write-Host "GET    /api/surplus" -ForegroundColor White
Write-Host "POST   /api/surplus" -ForegroundColor White
Write-Host "GET    /api/withdrawals" -ForegroundColor White
Write-Host "POST   /api/withdrawals" -ForegroundColor White  
Write-Host "GET    /api/reports" -ForegroundColor White
