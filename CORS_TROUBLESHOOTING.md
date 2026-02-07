# 🔧 CORS Troubleshooting - Auto-Py LeadHunter

## ❌ Error Actual

```
Access to XMLHttpRequest at 'https://api.merckout.me/leads' from origin 'https://panel.merckout.me' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Además:**
```
net::ERR_FAILED
```

---

## 🔍 Diagnóstico

### Problema Principal: Backend No Responde

Los errores `net::ERR_FAILED` indican que **el backend no está accesible**, no es solo un problema de CORS.

### Posibles Causas:

1. **Backend no está corriendo**
   - El contenedor se cayó después de iniciar
   - Error en la inicialización de la BD

2. **Cloudflare Tunnel no configurado correctamente**
   - No está mapeando `api.merckout.me` al puerto 3001
   - Tunnel caído o desconectado

3. **Puerto incorrecto en Coolify**
   - Coolify no está exponiendo el puerto 3001
   - Configuración de red incorrecta

---

## ✅ Soluciones

### 1. Verificar que el Backend Está Corriendo

```bash
# En Coolify, ver logs del backend
# Buscar: "Uvicorn running on http://0.0.0.0:3001"

# Si no está corriendo, verificar logs de error
# Buscar errores de conexión a PostgreSQL
```

### 2. Verificar Cloudflare Tunnel

**Configuración correcta:**
```yaml
tunnel: <TUNNEL-ID>
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: panel.merckout.me
    service: http://localhost:3000
  - hostname: api.merckout.me
    service: http://localhost:3001  # ← Debe apuntar a 3001
  - service: http_status:404
```

**Verificar:**
```bash
# Ver estado del tunnel
cloudflared tunnel info <TUNNEL-NAME>

# Ver logs del tunnel
cloudflared tunnel run <TUNNEL-NAME>
```

### 3. Verificar Configuración de Coolify

**En Coolify:**
- Backend debe estar configurado en puerto **3001**
- Dominio: `api.merckout.me`
- Health check: `/health`

### 4. Probar Acceso Directo al Backend

```bash
# Desde el servidor donde corre Coolify
curl http://localhost:3001/

# Debería responder:
# {"status":"online","service":"LeadHunter API","version":"1.0.0"}

# Si no responde, el backend no está corriendo
```

### 5. Verificar DNS

```bash
# Verificar que el dominio resuelve
nslookup api.merckout.me

# Debería apuntar a Cloudflare
```

---

## 🔧 Mejoras Aplicadas al Código

### 1. Retry Logic en Startup

```python
@app.on_event("startup")
async def startup():
    """Inicializa la base de datos al arrancar"""
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            await db.create_tables()
            print("✅ Base de datos inicializada")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"⚠️ Intento {attempt + 1}/{max_retries} falló: {e}")
                print(f"🔄 Reintentando en {retry_delay} segundos...")
                await asyncio.sleep(retry_delay)
            else:
                print(f"❌ Error fatal conectando a la base de datos: {e}")
                raise
```

**Beneficio:** El backend reintenta conectarse a PostgreSQL si falla inicialmente.

### 2. Health Check Mejorado

```python
@app.get("/health")
async def health_check():
    """Health check detallado"""
    try:
        async with db.pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "online",
        "service": "LeadHunter API",
        "version": "1.0.0",
        "database": db_status,
        "port": 3001
    }
```

**Beneficio:** Permite verificar el estado de la conexión a la BD.

---

## 📋 Checklist de Verificación

### Backend
- [ ] Contenedor corriendo en Coolify
- [ ] Logs muestran "Uvicorn running on http://0.0.0.0:3001"
- [ ] Logs muestran "✅ Base de datos inicializada"
- [ ] `curl http://localhost:3001/` responde correctamente
- [ ] `curl http://localhost:3001/health` muestra "database": "connected"

### Cloudflare Tunnel
- [ ] Tunnel está corriendo
- [ ] Configuración apunta a puerto 3001
- [ ] DNS de api.merckout.me resuelve
- [ ] `curl https://api.merckout.me/` responde correctamente

### Coolify
- [ ] Puerto 3001 configurado para backend
- [ ] Dominio api.merckout.me asignado
- [ ] Health check configurado en `/health`
- [ ] Variables de entorno correctas

### CORS
- [ ] `allow_origins=["*"]` en main.py
- [ ] `allow_credentials=True`
- [ ] `allow_methods=["*"]`
- [ ] `allow_headers=["*"]`

---

## 🧪 Tests de Verificación

### 1. Test Directo al Backend (desde servidor)
```bash
curl -v http://localhost:3001/
```

**Esperado:**
```
< HTTP/1.1 200 OK
< content-type: application/json
{"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

### 2. Test a través de Cloudflare
```bash
curl -v https://api.merckout.me/
```

**Esperado:**
```
< HTTP/2 200
< content-type: application/json
{"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

### 3. Test de CORS
```bash
curl -v -X OPTIONS https://api.merckout.me/leads \
  -H "Origin: https://panel.merckout.me" \
  -H "Access-Control-Request-Method: GET"
```

**Esperado:**
```
< HTTP/2 200
< access-control-allow-origin: *
< access-control-allow-methods: *
< access-control-allow-headers: *
```

### 4. Test desde Frontend
```javascript
// En la consola del navegador en panel.merckout.me
fetch('https://api.merckout.me/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Esperado:**
```javascript
{status: "online", service: "LeadHunter API", version: "1.0.0"}
```

---

## 🚨 Errores Comunes

### Error: "net::ERR_FAILED"
**Causa:** Backend no está accesible  
**Solución:** Verificar que el backend está corriendo y Cloudflare Tunnel está activo

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Causa:** Backend no está respondiendo headers CORS  
**Solución:** Verificar que FastAPI está corriendo y CORS middleware está configurado

### Error: "Connection refused"
**Causa:** Puerto incorrecto o servicio no escuchando  
**Solución:** Verificar puerto 3001 en Dockerfile, docker-compose.yml y Cloudflare config

### Error: "502 Bad Gateway"
**Causa:** Cloudflare no puede conectarse al backend  
**Solución:** Verificar que el tunnel apunta al puerto correcto (3001)

---

## 📞 Próximos Pasos

1. **Verificar logs del backend en Coolify**
   - ¿Está corriendo?
   - ¿Hay errores?

2. **Probar acceso directo**
   ```bash
   curl http://localhost:3001/
   ```

3. **Verificar Cloudflare Tunnel**
   - ¿Está activo?
   - ¿Apunta a puerto 3001?

4. **Redeploy si es necesario**
   - Con las mejoras de retry logic
   - Con health check mejorado

---

**Última actualización:** 2026-02-07  
**Estado:** Troubleshooting en progreso
