# Configuración Rápida en Coolify

## 🚀 Despliegue desde GitHub

Tu repositorio: `https://github.com/Xangel0s/bussnessAUTOpysubelo`

### Paso 1: Crear Proyecto en Coolify

1. Accede a tu instancia de Coolify
2. Click en **"+ New"** → **"Resource"**
3. Selecciona **"Docker Compose"**

### Paso 2: Conectar Repositorio

1. **Source**: Selecciona tu servidor Git (GitHub)
2. **Repository**: `Xangel0s/bussnessAUTOpysubelo`
3. **Branch**: `main` (o la rama que uses)
4. **Build Pack**: Docker Compose (se detecta automáticamente)

### Paso 3: Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

```env
DB_PASSWORD=TuPasswordSeguro123!
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/TU/WEBHOOK/URL
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

**Importante**: 
- Cambia `TuPasswordSeguro123!` por una contraseña fuerte
- Si no usas Slack, puedes dejar NOTIFICATION_WEBHOOK vacío
- Actualiza `NEXT_PUBLIC_API_URL` con tu dominio real después de configurarlo

### Paso 4: Configurar Dominios

1. En **Domains**, configura:
   - **Frontend**: `tuapp.com` (o el dominio que prefieras)
   - **Backend**: `api.tuapp.com`
   - **PostgreSQL**: No necesita dominio público

2. Coolify generará certificados SSL automáticamente

### Paso 5: Desplegar

1. Click en **"Deploy"**
2. Espera 5-10 minutos (primera vez tarda más por Playwright)
3. Monitorea los logs en tiempo real

### Paso 6: Verificar

Una vez desplegado, verifica:

```bash
# Health check del backend
curl https://api.tudominio.com/

# Respuesta esperada:
# {"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

## 📋 Configuración Detallada por Servicio

### PostgreSQL
- **Imagen**: `postgres:16-alpine`
- **Puerto interno**: 5432
- **Volumen**: Se crea automáticamente para persistencia
- **Variables**:
  - `POSTGRES_DB=leadhunter`
  - `POSTGRES_USER=admin`
  - `POSTGRES_PASSWORD=${DB_PASSWORD}`

### Backend (FastAPI)
- **Build context**: `./backend`
- **Puerto**: 8000
- **Dominio sugerido**: `api.tudominio.com`
- **Variables**:
  - `DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/leadhunter`
  - `NOTIFICATION_WEBHOOK=${NOTIFICATION_WEBHOOK}`
- **Recursos mínimos**: 1GB RAM (por Playwright)

### Frontend (Next.js)
- **Build context**: `./frontend`
- **Puerto**: 3000
- **Dominio sugerido**: `tudominio.com`
- **Variables**:
  - `NEXT_PUBLIC_API_URL=https://api.tudominio.com`

## 🔧 Configuración Avanzada (Opcional)

### Health Checks

Coolify puede configurar health checks automáticos:

**Backend**:
- Path: `/`
- Intervalo: 30s
- Timeout: 5s

**Frontend**:
- Path: `/`
- Intervalo: 30s
- Timeout: 5s

### Recursos Recomendados

Si tu instancia de Coolify lo permite, configura:

```yaml
Backend:
  memory: 2GB
  cpu: 1 core

Frontend:
  memory: 512MB
  cpu: 0.5 core

PostgreSQL:
  memory: 512MB
  cpu: 0.5 core
```

### Webhooks de Despliegue Automático

1. En GitHub, ve a: `Settings` → `Webhooks`
2. Coolify te proporciona una URL de webhook
3. Configúrala para que cada push a `main` despliegue automáticamente

## 🔄 Actualizaciones

### Despliegue Manual
1. Haz push a tu repositorio
2. En Coolify, click en **"Redeploy"**

### Despliegue Automático
Si configuraste el webhook, cada push a `main` desplegará automáticamente.

## ⚠️ Problemas Comunes

### "Build failed" en el primer intento
- **Causa**: Playwright descargando Chromium
- **Solución**: Espera, puede tardar hasta 10 minutos

### "Cannot connect to database"
- **Causa**: DATABASE_URL incorrecta
- **Solución**: Verifica que use `postgres` como hostname (no `localhost`)
- Formato correcto: `postgresql://admin:PASSWORD@postgres:5432/leadhunter`

### Frontend no carga
- **Causa**: NEXT_PUBLIC_API_URL apunta a localhost
- **Solución**: Debe ser la URL pública: `https://api.tudominio.com`

### "Out of memory" en backend
- **Causa**: Playwright necesita más RAM
- **Solución**: Aumenta memoria del contenedor a mínimo 1GB

## 📊 Monitoreo Post-Despliegue

### Ver logs en tiempo real
En Coolify, cada servicio tiene su pestaña de logs.

### Endpoints útiles

```bash
# Estadísticas
curl https://api.tudominio.com/stats

# Iniciar scraping de prueba
curl -X POST https://api.tudominio.com/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "query": "restaurantes en Madrid",
    "max_results": 10
  }'

# Ver estado del scraping
curl https://api.tudominio.com/scrape/status

# Ver leads encontrados
curl https://api.tudominio.com/leads?limit=10
```

## 🎯 Checklist Final

Antes de considerar el despliegue completo:

- [ ] Variables de entorno configuradas
- [ ] Dominios asignados y SSL activo
- [ ] Health check del backend responde
- [ ] Frontend carga correctamente
- [ ] Scraping de prueba funciona
- [ ] Base de datos persiste datos
- [ ] Notificaciones funcionan (si configuraste Slack)

## 📞 Soporte

- **Logs de Coolify**: Revisa los logs de cada servicio
- **Documentación**: https://coolify.io/docs
- **Repositorio**: https://github.com/Xangel0s/bussnessAUTOpysubelo

## 🔐 Seguridad

Recomendaciones post-despliegue:

1. **Cambia DB_PASSWORD** a algo fuerte y único
2. **Habilita autenticación** en los endpoints si es necesario
3. **Configura rate limiting** en Coolify
4. **Backups automáticos** de PostgreSQL en Coolify
5. **Monitorea logs** regularmente para detectar problemas

---

**¡Tu aplicación está lista para producción!** 🎉
