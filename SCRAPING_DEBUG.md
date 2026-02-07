# 🔍 Scraping Debug Guide

## ❌ Problema Actual

**Síntoma:** El scraping inicia (botón muestra "Buscando...") pero no retorna resultados.

**Logs observados:**
- ✅ Backend responde a `/scrape/status` con 200 OK
- ❌ PostgreSQL muestra errores: `FATAL: database "admin" does not exist`
- ❌ No se ven leads en la interfaz después de completar

---

## 🔧 Fixes Aplicados

### 1. PostgreSQL Healthcheck Corregido

**Problema:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U admin"]  # ❌ No especifica la BD
```

**Solución:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U admin -d leadhunter"]  # ✅ Especifica la BD correcta
```

### 2. Logging Detallado Agregado

**Antes:**
```python
async for lead in scraper.scrape():
    lead_id = await db.insert_lead(lead)
    # Sin logs
```

**Después:**
```python
async for lead in scraper.scrape():
    lead_count += 1
    print(f"📍 Lead #{lead_count}: {lead.get('nombre', 'Sin nombre')}")
    
    lead_id = await db.insert_lead(lead)
    
    if lead_id:
        print(f"✅ Lead guardado con ID: {lead_id}")
    else:
        print(f"⚠️ Lead duplicado o error al guardar")
```

---

## 🧪 Cómo Debuggear

### 1. Verificar Logs del Backend en Coolify

Busca estos mensajes después de iniciar una búsqueda:

```
✅ Logs Esperados:
🔍 Iniciando scraping: Cafeteria Lima (max: 20)
📍 Lead #1: Cafetería Central
✅ Lead guardado con ID: 1
🎯 Oportunidad encontrada! Total: 1
📍 Lead #2: Café Express
✅ Lead guardado con ID: 2
...
✅ Scraping completado: 20 leads, 8 oportunidades
🏁 Scraping finalizado
```

```
❌ Logs de Error Posibles:
❌ Error en scraping: TimeoutError
❌ Error en scraping: No se encontró selector
❌ Error extrayendo datos: ...
```

### 2. Verificar Estado de PostgreSQL

```bash
# Ver logs de PostgreSQL
# NO debería mostrar: FATAL: database "admin" does not exist

# Debería mostrar:
database system is ready to accept connections
```

### 3. Probar Endpoints Manualmente

```bash
# 1. Iniciar scraping
curl -X POST https://api.merckout.me/scrape \
  -H "Content-Type: application/json" \
  -d '{"query": "cafeteria lima", "max_results": 5}'

# 2. Ver estado (cada 3 segundos)
watch -n 3 'curl -s https://api.merckout.me/scrape/status | jq'

# 3. Ver leads encontrados
curl https://api.merckout.me/leads | jq

# 4. Ver estadísticas
curl https://api.merckout.me/stats | jq
```

---

## 🐛 Posibles Causas del Problema

### 1. Google Maps Bloqueando el Scraper

**Síntomas:**
- Scraping inicia pero no encuentra resultados
- Timeout al esperar selectores
- Página no carga correctamente

**Solución:**
- Verificar que Playwright puede acceder a Google Maps
- Revisar si Google detecta el bot
- Considerar usar proxies

**Test:**
```python
# Agregar screenshot para debug
await page.screenshot(path="debug.png")
```

### 2. Selectores de Google Maps Cambiaron

**Síntomas:**
- No encuentra `div[role="feed"]`
- No encuentra `a[href*='/maps/place/']`
- Extracción de datos falla

**Solución:**
- Actualizar selectores en `scraper.py`
- Verificar estructura HTML actual de Google Maps

### 3. Base de Datos No Acepta Inserts

**Síntomas:**
- Scraping encuentra leads
- Pero no se guardan en la BD
- `insert_lead()` retorna None

**Solución:**
- Verificar conexión a PostgreSQL
- Revisar constraints de la tabla (UNIQUE url)
- Ver logs de errores de BD

### 4. Playwright No Puede Iniciar Chromium

**Síntomas:**
- Error al iniciar browser
- Timeout en `async_playwright()`
- Recursos insuficientes

**Solución:**
- Verificar que el contenedor tiene suficiente RAM (mín 1GB)
- Revisar que Chromium está instalado
- Verificar permisos de ejecución

---

## 📋 Checklist de Diagnóstico

### Backend
- [ ] Logs muestran "🔍 Iniciando scraping"
- [ ] Logs muestran "📍 Lead #X"
- [ ] Logs muestran "✅ Lead guardado"
- [ ] Logs muestran "🏁 Scraping finalizado"
- [ ] No hay errores de Playwright
- [ ] No hay errores de BD

### PostgreSQL
- [ ] No muestra "FATAL: database admin does not exist"
- [ ] Healthcheck pasa correctamente
- [ ] Tablas existen (leads, tipificaciones, lead_tracking)
- [ ] Se pueden insertar registros

### Frontend
- [ ] Botón cambia a "Buscando..."
- [ ] `/scrape/status` muestra `is_running: true`
- [ ] Después de completar, muestra leads
- [ ] Estadísticas se actualizan

### Scraper
- [ ] Playwright puede iniciar Chromium
- [ ] Puede navegar a Google Maps
- [ ] Encuentra el selector `div[role="feed"]`
- [ ] Encuentra enlaces de negocios
- [ ] Puede extraer datos de cada negocio

---

## 🔧 Comandos de Debug

### Ver Logs en Tiempo Real
```bash
# En Coolify, seguir logs del backend
# Buscar los emojis: 🔍 📍 ✅ 🎯 ❌ 🏁
```

### Probar Scraper Localmente
```python
# test_scraper.py
import asyncio
from scraper import GoogleMapsScraper

async def test():
    scraper = GoogleMapsScraper("cafeteria lima", 5)
    async for lead in scraper.scrape():
        print(f"Lead: {lead['nombre']}")
        print(f"Reclamable: {lead['es_reclamable']}")
        print("---")

asyncio.run(test())
```

### Verificar BD
```sql
-- Conectarse a PostgreSQL
psql -U admin -d leadhunter

-- Ver leads
SELECT id, nombre, es_reclamable, created_at FROM leads ORDER BY id DESC LIMIT 10;

-- Ver estadísticas
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE es_reclamable = true) as oportunidades
FROM leads;
```

---

## 🚀 Próximos Pasos

1. **Redeploy** con los fixes aplicados
2. **Monitorear logs** del backend durante una búsqueda
3. **Verificar** que aparecen los mensajes con emojis
4. **Si no aparecen leads:**
   - Revisar si Playwright puede acceder a Google Maps
   - Verificar selectores actuales de Google Maps
   - Considerar agregar screenshots para debug

---

## 📊 Logs Esperados (Ejemplo Completo)

```
INFO:     Started server process [1]
INFO:     Waiting for application startup.
⚠️ Intento 1/5 falló: the database system is starting up
🔄 Reintentando en 2 segundos...
✅ Base de datos inicializada
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:3001

INFO:     10.0.4.1:38190 - "POST /scrape HTTP/1.1" 200 OK
🔍 Iniciando scraping: cafeteria lima (max: 20)
📍 Lead #1: Cafetería Central
✅ Lead guardado con ID: 1
📍 Lead #2: Café Express  
⚠️ Lead duplicado o error al guardar
📍 Lead #3: Lima Coffee
✅ Lead guardado con ID: 2
🎯 Oportunidad encontrada! Total: 1
...
✅ Scraping completado: 15 leads, 6 oportunidades
🏁 Scraping finalizado

INFO:     10.0.4.1:38190 - "GET /scrape/status HTTP/1.1" 200 OK
INFO:     10.0.4.1:38190 - "GET /leads HTTP/1.1" 200 OK
INFO:     10.0.4.1:38190 - "GET /stats HTTP/1.1" 200 OK
```

---

**Última actualización:** 2026-02-07  
**Commit:** 39a02aa  
**Estado:** Debugging en progreso
