# Módulo de citaciones y WhatsApp

## Variables de entorno

El backend lee estas variables (en `.env` o en el entorno del proceso):

| Variable | Uso |
|---|---|
| `WHATSAPP_API_URL` | Base de Graph API. Por defecto `https://graph.facebook.com/v25.0`. |
| `WHATSAPP_ACCESS_TOKEN` | Token permanente o token de prueba de Meta. También se usa para validar la firma del webhook. |
| `WHATSAPP_PHONE_NUMBER_ID` | Identificador del número de WhatsApp Business que envía mensajes. |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Identificador de la cuenta Business. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Token compartido usado durante la verificación GET de Meta. |
| `WHATSAPP_APP_SECRET` | Secreto de la aplicación de Meta usado para validar `X-Hub-Signature-256`. |
| `WHATSAPP_TEMPLATE_NAME` | Nombre exacto de la plantilla aprobada. |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Código de idioma exacto de la plantilla, por defecto `es_CO`. |

No deben versionarse tokens reales.

## Endpoints

Todos los endpoints de citaciones requieren JWT y rol `RECTOR` u `ORIENTADOR`.

```text
POST /api/v1/citaciones
GET  /api/v1/citaciones/incidente/{incidenteId}
```

El webhook es público para Meta:

```text
GET  /api/v1/whatsapp/webhook
POST /api/v1/whatsapp/webhook
```

El GET valida `hub.mode=subscribe` y `hub.verify_token`, y retorna `hub.challenge`. El POST valida `X-Hub-Signature-256` con HMAC-SHA256 y `WHATSAPP_APP_SECRET`. Una firma ausente o inválida se rechaza con `401`.

## Flujo de creación

1. Se valida que el incidente exista, no esté cerrado y que el estudiante participe.
2. Se valida el teléfono del acudiente.
3. Se persiste la citación como `PENDIENTE` / `NO_ENVIADO`.
4. El incidente avanza a `CITACION_PADRES` cuando corresponde.
5. `WhatsAppService` envía el template `citacion_incidente_convivencia` directamente a Graph API usando `RestClient`.
6. La citación se marca `ENVIADA` / `ENVIADO` o `FALLIDO`, conservando el detalle del error.
7. Meta notifica `delivered`, `read` o `failed` en el webhook y se actualiza la trazabilidad.

## Prueba local con cURL

Defina un JWT válido en `TOKEN` y use IDs existentes en la base de datos:

```bash
TOKEN="<jwt>"

curl -i -X POST http://localhost/api/v1/citaciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "incidenteId": 1,
    "estudianteId": 1,
    "lugarCitaId": 1,
    "fechaCita": "2030-12-15",
    "horaCita": "08:30",
    "asunto": "Seguimiento del incidente de convivencia",
    "observaciones": "Traer documento de identidad."
  }'

curl -i -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/v1/citaciones/incidente/1
```

Una respuesta exitosa contiene `id`, `lugarCita`, `waEstadoEnvio`, `waEnviadoAt` y `createdAt`.

## Simulación sin enviar a Meta

Para verificar el cuerpo que se construye, use un endpoint Graph API compatible en un entorno de prueba y configure `WHATSAPP_API_URL` con su URL. El cuerpo enviado tiene esta forma:

```json
{
  "messaging_product": "whatsapp",
  "to": "573001234567",
  "type": "template",
  "template": {
    "name": "citacion_incidente_convivencia",
    "language": { "code": "es_CO" },
    "components": [{
      "type": "body",
      "parameters": [{ "type": "text", "text": "..." }]
    }]
  }
}
```

El parámetro `to` se normaliza a dígitos y se antepone `57` a números colombianos de diez dígitos. La plantilla debe tener exactamente diez variables de cuerpo, en el orden documentado por `WhatsAppService`.

## Payload firmado de webhook

El valor firmado es el cuerpo UTF-8 completo. En PowerShell:

```powershell
$body = '{"entry":[{"changes":[{"value":{"statuses":[{"id":"wamid.TEST","status":"delivered"}]}}]}]}'
$appSecret = $env:WHATSAPP_APP_SECRET
$hmac = [System.Security.Cryptography.HMACSHA256]::new([Text.Encoding]::UTF8.GetBytes($appSecret))
$signature = 'sha256=' + ([Convert]::ToHexString($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($body)))).ToLowerInvariant()
curl.exe -i -X POST http://localhost/api/v1/whatsapp/webhook -H "X-Hub-Signature-256: $signature" -H "Content-Type: application/json" --data-raw $body
```

El endpoint responde `200 OK`; si existe una citación con `waMessageId=wamid.TEST`, su estado pasa a `ENTREGADO`.

## Pruebas y preproducción

Ejecute desde `backend`:

```bash
./mvnw test
```

La repetición contra preproducción requiere una URL, credenciales JWT, base de datos y token de Meta de ese entorno. No hay una configuración de preproducción ni credenciales de despliegue versionadas en este repositorio; por seguridad no se inventan ni se reutilizan valores locales.
