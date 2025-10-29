# Manual de procedimientos: Solicitud y entrega de productos

Este manual describe el flujo operativo y técnico desde que se realiza una solicitud de un producto hasta su entrega, pensado para integrarse entre el frontend (`almacen-front`) y el backend (`almacen-instituto`). Incluye responsabilidades, pasos, comprobaciones, endpoints relevantes, excepciones y listas de verificación.

## Resumen ejecutivo (contrato)
- Entrada: Solicitud de producto generada por un usuario (formulario web o API). Campos mínimos: producto_id, cantidad_solicitada, solicitante (usuario_id o nombre), motivo, destino (dependencia/área), fecha_requerida.
- Salida: Confirmación de solicitud procesada y registro de movimiento de salida, entrega física al solicitante y actualización de inventario.
- Éxitos: Stock suficiente, solicitud aprobada, entrega registrada.
- Errores esperados: Stock insuficiente, producto vencido/baja, validación de datos, falta de autorización.

## Supuestos
1. El backend expone endpoints REST según la documentación de `almacen-instituto` (`/api/products`, `/api/movements`, `/api/withdrawals`/`/api/bajas` o similares).
2. El frontend presenta una UI donde se crea la solicitud y muestra estados (pendiente, aprobado, denegado, en preparación, entregado).
3. Roles: Solicitante (usuario), Almacenero (personal del almacén), Supervisor/Aprobador (si aplica), Receptor (persona que recibe físicamente).

> Si quieres que coloque este README directamente en `c:\Users\Cris\Desktop\almacen-front`, dame permiso para acceder a esa ruta o muévelo dentro del workspace actual; ahora lo dejo en `almacen-instituto` para que lo copies.

---

## Flujo operativo paso a paso

1. Recepción de la solicitud (Frontend)
   - Usuario completa formulario de solicitud con campos: `producto_id`, `cantidad`, `unidad_medida`, `motivo`, `destino`, `fecha_requerida`, `contacto`.
   - Validaciones en cliente: campos obligatorios, cantidad > 0, formato de contacto.
   - Acción: POST `/api/withdrawals` o POST `/api/movements/exit` (según implementación). El frontend debe mostrar: "Solicitud enviada" y un ID de solicitud.

2. Validación inicial (Backend)
   - Verificar esquema (Joi) y tipos.
   - Verificar existencia del producto (`GET /api/products/:id`).
   - Verificar estado del producto (`estado != 'baja'` y no vencido si aplica).
   - Verificar stock (`stock_actual >= cantidad_solicitada`).
   - Si falla validación: retornar 400 con mensajes claros para mostrar al usuario.

3. Reserva y registro preliminar (Almacén)
   - Si hay stock suficiente:
     - Crear registro de solicitud en tabla `bajas` o `solicitudes` con estado `pendiente` o `en_proceso`.
     - Opcional: decrementar stock disponible marcado como `reservado` si el sistema maneja reserva (recomendado para evitar sobreasignaciones).
   - Si no hay stock suficiente:
     - Retornar 400 o 409 con detalle (stock_actual) y enviar alerta al solicitante y al almacén.

4. Aprobación (si aplica)
   - Flujo manual: un supervisor revisa la solicitud desde el panel y aprueba/deniega.
   - Flujo automático: autorizaciones por monto/usuario.
   - API: PUT `/api/withdrawals/:id/approve` o similar.

5. Preparación física del pedido (Picking)
   - Almacenero consulta la lista de items a preparar (filtro por estado `aprobado` o `en_proceso`).
   - Verificar lotes y fechas de vencimiento (aplicar FIFO/PEPS). Priorizar lotes próximos a vencer.
   - Registrar en sistema el movimiento físico parcial (si aplica). Interactúa con tabla `movimientos` (tipo `salida`).

6. Revisión y embalaje (Packing)
   - Confirmar cantidades, empaquetar y preparar documentos (almacén emite comprobante de entrega interno).
   - Etiquetado: ID de solicitud, nombre del solicitante, cantidad, fecha.

7. Entrega y firma de recepción
   - Entregar al receptor. Obtener firma/confirmación (puede ser firma digital, foto o confirmación manual).
   - Actualizar registro: estado `entregado`, `fecha_entrega`, `receptor`, `observaciones`.
   - Registrar en `movimientos` la salida definitiva con `stock_anterior` y `stock_post_movimiento`.

8. Post-entrega: auditoría y reportes
   - Generar comprobante (PDF/CSV) que enlaza solicitud y movimiento.
   - Disparar alertas para stock bajo si es necesario.
   - Registrar auditoría (quién realizó la entrega, cuándo y observaciones).

---

## Endpoints y llamadas recomendadas (ejemplos)
> Adapta las URLs si tu backend utiliza otras rutas. Basado en `almacen-instituto`.

- Obtener producto: GET /api/products/:id
  - Respuesta clave: { id, codigo_item, nombre_item, stock_actual, fecha_vencimiento, estado }

- Crear solicitud/baja: POST /api/bajas o POST /api/withdrawals
  - Body: { producto_id, cantidad_baja, motivo_baja, usuario, observaciones }
  - Respuesta: objeto creado con `id` y `estado: 'pendiente'` o 'aprobado'

- Registrar movimiento (salida): POST /api/movements/exit
  - Body: { producto_id, cantidad, usuario, observaciones }
  - Respuesta: movimiento creado con stock anterior y stock post movimiento.

- Consultar movimientos: GET /api/movements?producto_id=...&tipo=salida

- Consultar solicitudes/pedidos: GET /api/bajas?page=1&limit=50&estado=pendiente

- Actualizar estado de solicitud: PUT /api/bajas/:id
  - Body: { estado, observaciones, fecha_entrega, receptor }

---

## Reglas de negocio críticas
- No permitir salidas que dejen stock negativo.
- Aplicar FIFO (PEPS) al seleccionar lote para salida; actualizar lotes y stock por lote si el modelo lo soporta.
- Productos vencidos deben marcarse `vencido` y no entregarse (salvo autorización explícita y registro de excepción).
- Reservas temporales: si el sistema soporta "reservado", reservar la cantidad por 15-30 min; si no se confirma, liberar la reserva.
- Control de autorizaciones: ciertas cantidades o categorías requieren aprobación de supervisor.

---

## Roles y responsabilidades
- Solicitante: solicita producto y proporciona datos correctos.
- Almacenero: prepara pedido, comprueba stock y entrega.
- Supervisor/Aprobador: valida solicitudes fuera de política.
- Receptor: confirma recepción y firma.
- Administrador del sistema: revisa logs y reportes.

---

## Formatos y datos mínimos (contratos de API)
- Solicitud (frontend -> backend):
  - producto_id: integer
  - cantidad: integer (>0)
  - usuario: string (id o nombre)
  - motivo: string
  - destino: string (departamento/área)
  - fecha_requerida: date (opcional)

- Movimiento (backend):
  - id, producto_id, tipo_movimiento (entrada/salida), cantidad, fecha_movimiento, usuario, stock_anterior, stock_post_movimiento, observaciones

- Respuestas de error: { error: true, message: string, details?: array }

---

## Checklists (rápido)
- Antes de aprobar una solicitud:
  - [ ] Producto existe y activo
  - [ ] Stock suficiente o reserva creada
  - [ ] Solicitud completa (datos de receptor/destino)
  - [ ] Si aplica, aprobación de supervisor

- Al preparar pedido:
  - [ ] Seleccionar lote con FEFO/FIFO según política
  - [ ] Verificar fecha de vencimiento
  - [ ] Registrar movimiento físico (pre-salida)

- Al entregar:
  - [ ] Confirmación de receptor
  - [ ] Firma/fotografía/registro
  - [ ] Actualizar estado a `entregado`
  - [ ] Generar comprobante y almacenar referencia

---

## Manejo de excepciones y errores
- Stock insuficiente: notificar solicitante y ofertar alternativa (menor cantidad o reabastecimiento).
- Producto no existente o dado de baja: devolver 404 y registro de intento.
- Producto vencido: no entregar y notificar responsable.
- Concurrencia: usar bloqueo optimista/transactiones en la DB o marcar reserva para evitar sobreventa.

---

## Auditoría y trazabilidad
- Registrar siempre: id_solicitud, usuario_accion, timestamp, cambios de estado, stock_anterior y stock_posterior.
- Mantener historial inmutable de `movimientos` para auditoría.

---

## Recomendaciones técnicas y mejoras
- Implementar reserva temporal para evitar race conditions entre solicitudes concurrentes.
- Añadir `lot_id` en `movimientos` para trazabilidad por lote.
- Registrar medios de prueba de entrega (foto, firma digital) y almacenar referencia en la DB/Storage.
- API de webhook: notificar a otros sistemas (SIGA/u otro sistema) cuando se complete una entrega.

---

## Pruebas y validación (QA)
- Tests automatizados sugeridos:
  - Crear solicitud válida -> estado pendiente/aprobado -> preparar -> entregar -> stock decrece correctamente.
  - Intento de solicitud con stock insuficiente -> respuesta 400.
  - Concurrencia: simular N solicitudes simultáneas para el mismo producto.

- Casos manuales:
  - Solicitud de producto con fecha de vencimiento próxima -> verificar lote seleccionado por FIFO.
  - Entrega con firma y observaciones.

---

## Cómo usar este manual
- Copia este archivo como `README.md` en el proyecto `almacen-front` o enlázalo desde el panel de documentación.
- Personaliza las rutas API si en el frontend se usan nombres distintos (por ejemplo `/api/withdrawals` vs `/api/bajas`).
- Si quieres, puedo adaptar el manual incluyendo capturas de pantalla y la lista de campos exactos del formulario si pegas el código del frontend.

---

## Anexos (ejemplos rápidos de payloads)

- Crear solicitud (ejemplo JSON):

{
  "producto_id": 123,
  "cantidad_baja": 5,
  "motivo_baja": "Uso en laboratorio",
  "usuario": "juan.perez",
  "observaciones": "Entrega inmediata"
}

- Registrar movimiento (salida):

{
  "producto_id": 123,
  "cantidad": 5,
  "usuario": "almacenero1",
  "observaciones": "Salida por solicitud #456"
}

---

## ¿Qué hago ahora?
- Puedo:
  1. Ajustar este manual con detalles del `almacen-front` si me pegas los archivos del formulario (o me permites leer la ruta del proyecto).
  2. Crear este mismo `README.md` dentro de `c:\Users\Cris\Desktop\almacen-front` si me das acceso o lo mueves al workspace.

Si quieres que lo modifique o lo coloque en otro archivo/ruta, dime y lo hago.

---

*Generado el 21-10-2025. Archivo creado en: `c:\Users\Cris\Desktop\almacen-instituto\MANUAL_PROCEDIMIENTOS_SOLICITUD_ENTREGA_README.md`*