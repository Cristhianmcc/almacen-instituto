const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const alertasService = require('../services/alertasService');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/notificaciones/preferencias - Guardar preferencias
router.post('/preferencias', async (req, res) => {
  try {
    const preferencias = req.body;
    
    // Guardar en el servicio de alertas
    alertasService.registrarPreferencias(preferencias);
    
    res.json({ 
      success: true, 
      message: 'Preferencias guardadas correctamente',
      data: preferencias
    });
  } catch (error) {
    console.error('Error al guardar preferencias:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar preferencias',
      error: error.message
    });
  }
});

// GET /api/notificaciones/preferencias - Obtener preferencias
router.get('/preferencias', async (req, res) => {
  try {
    const email = req.query.email;
    
    if (!email) {
      return res.json(null);
    }

    const preferencias = alertasService.obtenerPreferencias(email);
    
    res.json(preferencias || null);
  } catch (error) {
    console.error('Error al obtener preferencias:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener preferencias',
      error: error.message
    });
  }
});

// POST /api/notificaciones/test - Enviar email de prueba
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    console.log(' Enviando email de prueba a:', email);

    const { data, error } = await resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: ' Email de Prueba - Sistema de Notificaciones',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;"> ¡Prueba Exitosa!</h1>
          </div>

          <div style="padding: 30px; background: #f9fafb; border-radius: 10px; margin-top: 20px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Este es un email de prueba del sistema de notificaciones de <strong>Almacén Lurín</strong>.
            </p>

            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Si recibiste este mensaje, significa que tu configuración está correcta y empezarás a recibir alertas automáticas sobre:
            </p>

            <ul style="font-size: 16px; color: #374151; line-height: 1.8;">
              <li> Productos con stock bajo</li>
              <li> Productos próximos a vencer</li>
              <li> Productos vencidos</li>
              <li> Resumen diario del inventario</li>
            </ul>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong> Nota:</strong> Este es un email de prueba. Las alertas reales se enviarán automáticamente cuando se detecten productos con las condiciones configuradas.
              </p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p style="margin: 5px 0;">Sistema de Gestión de Almacén Lurín</p>
            <p style="margin: 5px 0;">Este es un mensaje automático, por favor no responder.</p>
            <p style="margin: 5px 0;">Fecha: ${new Date().toLocaleString('es-PE')}</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error(' Error de Resend:', error);
      throw error;
    }

    console.log(' Email enviado correctamente. ID:', data.id);

    res.json({
      success: true,
      data,
      message: 'Email de prueba enviado correctamente'
    });
  } catch (error) {
    console.error(' Error al enviar email de prueba:', error);
    res.status(500).json({
      error: error.message,
      message: 'Error al enviar email de prueba'
    });
  }
});

// POST /api/notificaciones/enviar - Enviar notificación
router.post('/enviar', async (req, res) => {
  try {
    const { email, tipo, asunto, productos } = req.body;

    if (!email || !tipo) {
      return res.status(400).json({ error: 'Email y tipo son requeridos' });
    }

    console.log(' Enviando notificación:', { email, tipo, productos: productos?.length });

    // Usar el servicio de alertas para enviar
    await alertasService.enviarNotificacion(email, tipo, productos || []);

    res.json({
      success: true,
      message: 'Notificación enviada correctamente'
    });
  } catch (error) {
    console.error(' Error al enviar notificación:', error);
    res.status(500).json({
      error: error.message,
      message: 'Error al enviar notificación'
    });
  }
});

module.exports = router;

// DEBUG: Ver todas las preferencias guardadas
router.get('/debug/preferencias', async (req, res) => {
  try {
    const todasPreferencias = [];
    alertasService.obtenerTodasPreferencias().forEach((value, key) => {
      todasPreferencias.push({ email: key, ...value });
    });
    
    res.json({
      total: todasPreferencias.length,
      preferencias: todasPreferencias
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
