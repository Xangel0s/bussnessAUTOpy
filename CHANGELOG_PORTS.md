# 🔄 Changelog - Cambio de Puerto Backend

## Fecha: 2026-02-07

### 🎯 Cambio Realizado

**Backend: Puerto 8000 → 3001**

---

## 📋 Razón del Cambio

**Problema:**
```
Error: Bind for 0.0.0.0:8000 failed: port is already allocated
```

**Causa:**
- Puerto 8000 ocupado por Coolify internamente
- Conflicto al intentar iniciar el contenedor backend
- Build exitoso pero startup fallido

**Solución:**
- Cambiar backend a puerto 3001
- Evita conflictos con servicios de Coolify
- Permite escalabilidad futura con mapeo claro de puertos

---

## 📝 Archivos Modificados

### 1. `docker-compose.yml`
```yaml
# ANTES:
backend:
  ports:
    - "8000:8000"

# DESPUÉS:
backend:
  ports:
    - "3001:3001"
```

### 2. `backend/Dockerfile`
```dockerfile
# ANTES:
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# DESPUÉS:
EXPOSE 3001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
```

### 3. `.env.example`
```env
# ANTES:
NEXT_PUBLIC_API_URL=http://localhost:8000

# DESPUÉS:
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. `README.md`
- Actualizadas todas las referencias de puerto 8000 → 3001
- Diagramas de arquitectura actualizados
- Ejemplos de comandos curl actualizados
- URLs de desarrollo actualizadas

### 5. `PORT_MAPPING.md` (NUEVO)
- Documentación completa de mapeo de puertos
- Guía de escalabilidad futura
- Configuración de Cloudflare Tunnels

---

## 🌐 Configuración de Puertos

### Desarrollo Local

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 (interno) |

### Producción

| Servicio | Puerto Interno | Dominio |
|----------|---------------|---------|
| Frontend | 3000 | https://panel.merckout.me |
| Backend | 3001 | https://api.merckout.me |
| PostgreSQL | 5432 | (no expuesto) |

---

## ✅ Impacto del Cambio

### Código
- ✅ Sin cambios en lógica de negocio
- ✅ Sin cambios en endpoints
- ✅ Sin cambios en base de datos
- ✅ Solo cambio de puerto de escucha

### Configuración
- ⚠️ Actualizar `NEXT_PUBLIC_API_URL` en Coolify
- ⚠️ Actualizar Cloudflare Tunnel config (si aplica)
- ⚠️ Actualizar documentación local

### Compatibilidad
- ✅ Compatible con versiones anteriores (solo cambio de puerto)
- ✅ No requiere migración de datos
- ✅ No afecta funcionalidad existente

---

## 🔧 Acciones Requeridas

### En Coolify

1. **Actualizar variable de entorno:**
   ```
   NEXT_PUBLIC_API_URL=https://api.merckout.me
   ```
   (El dominio sigue igual, solo el puerto interno cambia)

2. **Configurar puerto del backend:**
   - Puerto interno: 3001
   - Dominio: api.merckout.me

3. **Redeploy:**
   - Hacer deploy del nuevo código
   - Verificar que backend inicie en puerto 3001

### En Cloudflare Tunnels (si aplica)

```yaml
ingress:
  - hostname: panel.merckout.me
    service: http://localhost:3000
  - hostname: api.merckout.me
    service: http://localhost:3001  # ← Cambio aquí
  - service: http_status:404
```

---

## 🧪 Verificación Post-Cambio

### 1. Verificar Backend
```bash
curl http://localhost:3001/
# Esperado: {"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

### 2. Verificar Frontend
```bash
curl http://localhost:3000/
# Esperado: HTML de Next.js
```

### 3. Verificar Conexión
```bash
# Desde el frontend, verificar que llama al backend en puerto 3001
# DevTools → Network → Verificar requests a localhost:3001
```

### 4. Verificar Producción
```bash
curl https://api.merckout.me/
# Esperado: {"status":"online",...}

curl https://panel.merckout.me/
# Esperado: HTML de Next.js
```

---

## 📊 Beneficios del Cambio

1. **Evita conflictos** con servicios de Coolify
2. **Mapeo claro** de puertos para escalabilidad
3. **Documentación mejorada** con PORT_MAPPING.md
4. **Preparado para crecimiento** con puertos reservados:
   - 3000: Frontend
   - 3001: Backend
   - 3002-3005: Servicios futuros

---

## 🚀 Escalabilidad Futura

Con este cambio, tenemos un esquema claro para agregar servicios:

| Puerto | Servicio Propuesto |
|--------|-------------------|
| 3000 | Frontend (actual) |
| 3001 | Backend (actual) |
| 3002 | Worker Queue |
| 3003 | WebSocket Server |
| 3004 | Admin Panel |
| 3005 | Metrics/Monitoring |

---

## 📚 Documentación Actualizada

- ✅ README.md - Todas las referencias actualizadas
- ✅ .env.example - Puerto correcto
- ✅ PORT_MAPPING.md - Nueva documentación
- ✅ CHANGELOG_PORTS.md - Este documento

---

## ✅ Checklist de Deployment

- [x] Código actualizado en GitHub
- [x] docker-compose.yml con puerto 3001
- [x] Dockerfile con puerto 3001
- [x] README.md actualizado
- [x] .env.example actualizado
- [ ] Variable NEXT_PUBLIC_API_URL actualizada en Coolify
- [ ] Redeploy en Coolify
- [ ] Verificar backend en puerto 3001
- [ ] Verificar frontend conecta correctamente
- [ ] Cloudflare Tunnel actualizado (si aplica)

---

## 🎉 Resultado Esperado

Después de este cambio:
- ✅ Backend inicia sin conflictos de puerto
- ✅ Frontend se conecta correctamente al backend
- ✅ Sistema completamente funcional
- ✅ Preparado para escalar con más servicios

---

**Commit:** `12fd3ad`  
**Branch:** `main`  
**Estado:** ✅ LISTO PARA DEPLOYMENT
