// REEMPLAZAR el método verificarAlertasInmediatas COMPLETO en alertasService.js
// Copiar desde aquí ↓

async verificarAlertasInmediatas(productoId = null) {
  console.log('⚡ INICIO verificarAlertasInmediatas - ProductoID:', productoId, '- Umbral:', UMBRAL_STOCK_BAJO);
  try {
    const usuariosActivos = Array.from(notificationPreferences.entries())
      .filter(([_, prefs]) => prefs.enabled)
      .map(([email, prefs]) => ({ email, prefs }));

    console.log('👥 Usuarios activos:', usuariosActivos.length);
    
    if (usuariosActivos.length === 0) {
      console.log('⚠️ No hay usuarios con alertas habilitadas');
      return;
    }

    console.log(`⚡ Verificación inmediata de alertas para ${usuariosActivos.length} usuario(s)...`);

    for (const { email, prefs } of usuariosActivos) {
      console.log(`\n  📧 Verificando para: ${email}`);
      console.log(`  🔔 stockBajo habilitado:`, prefs.alertTypes?.stockBajo);
      
      // Stock Bajo
      if (prefs.alertTypes?.stockBajo) {
        console.log(`  🔍 Consultando productos con stock < ${UMBRAL_STOCK_BAJO}...`);
        
        const productosStockBajo = productoId
          ? await this.obtenerProductoStockBajoPorId(productoId)
          : await this.obtenerProductosStockBajo();

        console.log(`  📦 Productos encontrados:`, productosStockBajo.length);
        
        if (productosStockBajo.length > 0) {
          console.log(`  📋 Detalle de productos:`);
          productosStockBajo.forEach(p => {
            console.log(`     - ${p.nombre_item}: stock=${p.stock_actual} < umbral=${UMBRAL_STOCK_BAJO}`);
          });
          
          console.log(`  📧 Enviando email a ${email}...`);
          await this.enviarNotificacion(email, 'stock_bajo', productosStockBajo);
          console.log(`  ✅ Email enviado exitosamente`);
        } else {
          console.log(`  ℹ️ No se encontraron productos con stock < ${UMBRAL_STOCK_BAJO}`);
        }
      } else {
        console.log(`  ⚠️ Alerta stockBajo NO habilitada para este usuario`);
      }
    }
    
    console.log('\n✅ Verificación inmediata completada\n');
  } catch (error) {
    console.error('❌ Error en verificación inmediata:', error);
  }
}
