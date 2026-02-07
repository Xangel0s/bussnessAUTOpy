# ✅ Checklist de Validación para Coolify

## 🔧 Variables de Entorno Requeridas

### ✅ Variables Obligatorias
```env
DB_PASSWORD=tu_password_seguro_123
NEXT_PUBLIC_API_URL=https://api.merckout.me
```

### ⚠️ Variables Opcionales
```env
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/XXX/YYY/ZZZ
```

---

## 🐛 Problemas Comunes y Soluciones

### 1. ❌ Error: "npm ci failed" (RESUELTO)
**Causa:** Falta `package-lock.json`  
**Solución:** Cambiado a `npm install` en el Dockerfile

### 2. ❌ Error: "/app/public not found" (RESUELTO)
**Causa:** Carpeta `public` no existía  
**Solución:** Creada carpeta `frontend/public` con `.gitkeep`

### 3. ⚠️ Error Potencial: "Backend no responde"
**Causa:** Faltaba el archivo `main.py` completo  
**Solución:** Creado `backend/main.py` con todos los endpoints

### 4. ⚠️ Error Potencial: "Database connection failed"
**Posibles causas:**
- Variable `DB_PASSWORD` no configurada
- Formato incorrecto de `DATABASE_URL`
- PostgreSQL no está listo cuando el backend inicia

**Solución:**
- Verificar que `DB_PASSWORD` esté configurada en Coolify
- El `docker-compose.yml` ya tiene `depends_on` con healthcheck
- La URL se construye automáticamente: `postgresql://admin:${DB_PASSWORD}@postgres:5432/leadhunter`

### 5. ⚠️ Error Potencial: "Frontend no se conecta al backend"
**Causa:** `NEXT_PUBLIC_API_URL` apunta a localhost  
**Solución:** Debe ser `https://api.merckout.me` (tu dominio público)

### 6. ⚠️ Error Potencial: "CORS errors"
**Solución:** Ya configurado en `main.py` con `allow_origins=["*"]`

### 7. ⚠️ Error Potencial: "Playwright crashes"
**Causa:** Memoria insuficiente  
**Solución:** Asignar mínimo 1GB RAM al contenedor backend

---

## 📋 Configuración de Dominios en Coolify

### Frontend
- **Dominio:** `panel.merckout.me`
- **Puerto:** 3000
- **SSL:** Automático (Let's Encrypt)

### Backend
- **Dominio:** `api.merckout.me`
- **Puerto:** 8000
- **SSL:** Automático (Let's Encrypt)

### PostgreSQL
- **No necesita dominio público**
- **Puerto interno:** 5432
- **Acceso:** Solo desde red interna de Docker

---

## 🔍 Validación Post-Deployment

### 1. Verificar Backend
```bash
curl https://api.merckout.me/
# Debe responder: {"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

### 2. Verificar Estadísticas
```bash
curl https://api.merckout.me/stats
# Debe responder con: {"total":0,"reclamables":0,...}
```

### 3. Verificar Tipificaciones
```bash
curl https://api.merckout.me/tipificaciones
# Debe responder con array de 7 tipificaciones
```

### 4. Verificar Frontend
```bash
curl https://panel.merckout.me/
# Debe responder con HTML de Next.js
```

### 5. Verificar Conexión Frontend-Backend
- Abrir `https://panel.merckout.me` en el navegador
- Abrir DevTools (F12) → Console
- No debe haber errores de CORS o conexión
- Debe cargar las estadísticas correctamente

---

## 🗄️ Validación de Base de Datos

### Conectarse a PostgreSQL desde Coolify
```bash
# Desde el contenedor de PostgreSQL
psql -U admin -d leadhunter

# Verificar tablas
\dt

# Debe mostrar:
# - leads
# - tipificaciones
# - lead_tracking

# Verificar tipificaciones
SELECT * FROM tipificaciones;

# Debe mostrar 7 registros:
# 1. Nuevo
# 2. Contactado
# 3. Interesado
# 4. No Interesado
# 5. Seguimiento
# 6. Cerrado
# 7. No Contactar
```

---

## 🚀 Recursos Recomendados

### Mínimos
- **Backend:** 1GB RAM, 1 CPU
- **Frontend:** 512MB RAM, 0.5 CPU
- **PostgreSQL:** 512MB RAM, 0.5 CPU

### Recomendados (para mejor rendimiento)
- **Backend:** 2GB RAM, 2 CPU (por Playwright)
- **Frontend:** 1GB RAM, 1 CPU
- **PostgreSQL:** 1GB RAM, 1 CPU

---

## 📝 Variables de Entorno - Resumen Completo

### En Coolify, configura estas variables:

| Variable | Valor | Obligatoria | Descripción |
|----------|-------|-------------|-------------|
| `DB_PASSWORD` | `TuPassword123!` | ✅ Sí | Password de PostgreSQL |
| `NEXT_PUBLIC_API_URL` | `https://api.merckout.me` | ✅ Sí | URL pública del backend |
| `NOTIFICATION_WEBHOOK` | `https://hooks.slack.com/...` | ❌ No | Webhook para notificaciones |

### Variables que se construyen automáticamente:
- `DATABASE_URL` - Se construye en el backend usando `DB_PASSWORD`
- `POSTGRES_DB` - Definida en docker-compose como `leadhunter`
- `POSTGRES_USER` - Definida en docker-compose como `admin`
- `POSTGRES_PASSWORD` - Usa `DB_PASSWORD`

---

## ⚠️ Errores Críticos a Evitar

### ❌ NO HACER:
1. **NO** usar `http://localhost:8000` en `NEXT_PUBLIC_API_URL` en producción
2. **NO** dejar `DB_PASSWORD` vacía o con valor por defecto
3. **NO** exponer el puerto 5432 de PostgreSQL públicamente
4. **NO** usar menos de 1GB RAM para el backend (Playwright lo necesita)

### ✅ SÍ HACER:
1. **SÍ** usar URLs públicas con HTTPS en producción
2. **SÍ** usar contraseñas seguras para `DB_PASSWORD`
3. **SÍ** mantener PostgreSQL en red interna de Docker
4. **SÍ** monitorear logs durante el primer deployment

---

## 🔄 Orden de Inicio de Servicios

Coolify respeta el orden definido en `docker-compose.yml`:

1. **PostgreSQL** inicia primero
2. Espera healthcheck (hasta 5 intentos)
3. **Backend** inicia cuando PostgreSQL está listo
4. Crea tablas y tipificaciones automáticamente
5. **Frontend** inicia cuando backend está listo

---

## 📊 Logs a Monitorear

### Backend
```
✅ Base de datos inicializada
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### PostgreSQL
```
PostgreSQL init process complete; ready for start up.
database system is ready to accept connections
```

### Frontend
```
ready - started server on 0.0.0.0:3000
```

---

## 🆘 Si Todo Falla

1. **Revisar logs en Coolify** de cada servicio
2. **Verificar variables de entorno** están configuradas
3. **Verificar dominios** apuntan correctamente
4. **Reiniciar servicios** en orden: PostgreSQL → Backend → Frontend
5. **Verificar recursos** (RAM/CPU suficientes)

---

## ✅ Checklist Final

- [ ] `DB_PASSWORD` configurada en Coolify
- [ ] `NEXT_PUBLIC_API_URL` apunta a `https://api.merckout.me`
- [ ] Dominios configurados: `panel.merckout.me` y `api.merckout.me`
- [ ] SSL habilitado en ambos dominios
- [ ] Backend tiene mínimo 1GB RAM
- [ ] Código pusheado a GitHub (commit más reciente)
- [ ] Deployment iniciado en Coolify
- [ ] Logs del backend muestran "Base de datos inicializada"
- [ ] Endpoint `/` del backend responde correctamente
- [ ] Frontend carga sin errores de CORS
- [ ] Tipificaciones se crearon automáticamente

---

**Última actualización:** 2026-02-07  
**Commit:** Incluye main.py completo y carpeta public
