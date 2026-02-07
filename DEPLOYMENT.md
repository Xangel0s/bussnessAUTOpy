# Guía de Despliegue en Coolify

## ✅ Preparación Completada

El proyecto está listo para desplegarse en Coolify con las siguientes optimizaciones:

### Cambios Realizados:
- ✅ Frontend Dockerfile optimizado para producción (multi-stage build)
- ✅ Next.js configurado con output standalone
- ✅ Eliminados volúmenes de desarrollo del docker-compose
- ✅ Agregados archivos .dockerignore para optimizar builds

## 📋 Pasos para Desplegar en Coolify

### 1. Preparar Variables de Entorno

En Coolify, configura estas variables de entorno:

```env
# Base de datos
DB_PASSWORD=tu_password_seguro_aqui

# Notificaciones (opcional)
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# URL del API (ajusta según tu dominio)
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### 2. Configuración en Coolify

#### Opción A: Docker Compose (Recomendado)
1. Crea un nuevo proyecto en Coolify
2. Selecciona "Docker Compose"
3. Conecta tu repositorio Git
4. Coolify detectará automáticamente el `docker-compose.yml`
5. Configura las variables de entorno
6. Despliega

#### Opción B: Servicios Separados
Si prefieres más control, despliega cada servicio por separado:

**PostgreSQL:**
- Usa la imagen `postgres:16-alpine`
- Configura POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD

**Backend:**
- Build context: `./backend`
- Puerto: 8000
- Variables: DATABASE_URL, NOTIFICATION_WEBHOOK

**Frontend:**
- Build context: `./frontend`
- Puerto: 3000
- Variable: NEXT_PUBLIC_API_URL

### 3. Configurar Dominios

En Coolify, asigna dominios a tus servicios:
- Frontend: `tuapp.com`
- Backend: `api.tuapp.com`

Coolify configurará automáticamente SSL con Let's Encrypt.

### 4. Verificar Despliegue

Después del despliegue, verifica:

```bash
# Health check del backend
curl https://api.tudominio.com/

# Debería responder:
# {"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

## 🔧 Consideraciones Importantes

### Base de Datos
- Coolify creará un volumen persistente para PostgreSQL automáticamente
- Los datos sobrevivirán a reinicios y actualizaciones

### Playwright en Producción
- El Dockerfile del backend ya incluye todas las dependencias necesarias
- Chromium se instala automáticamente durante el build
- Puede tardar 5-10 minutos en el primer despliegue

### Recursos Recomendados
- **Backend**: Mínimo 1GB RAM (2GB recomendado por Playwright)
- **Frontend**: 512MB RAM suficiente
- **PostgreSQL**: 512MB RAM suficiente

### Logs y Monitoreo
Accede a los logs en tiempo real desde Coolify:
- Logs del backend para ver scraping en progreso
- Logs de PostgreSQL para debugging de BD
- Logs del frontend para errores de cliente

## 🚀 Comandos Útiles Post-Despliegue

### Ver estadísticas
```bash
curl https://api.tudominio.com/stats
```

### Iniciar scraping
```bash
curl -X POST https://api.tudominio.com/scrape \
  -H "Content-Type: application/json" \
  -d '{"query": "restaurantes en Madrid", "max_results": 20}'
```

### Ver estado del scraping
```bash
curl https://api.tudominio.com/scrape/status
```

## 🔄 Actualizaciones

Para actualizar tu aplicación:
1. Haz push a tu repositorio Git
2. Coolify detectará los cambios automáticamente
3. O fuerza un redespliegue desde el panel de Coolify

## ⚠️ Troubleshooting

### Error de conexión a base de datos
- Verifica que DATABASE_URL esté correctamente configurada
- Formato: `postgresql://usuario:password@postgres:5432/leadhunter`

### Frontend no se conecta al backend
- Asegúrate de que NEXT_PUBLIC_API_URL apunte al dominio correcto del backend
- Debe ser la URL pública, no la interna de Docker

### Playwright falla
- Verifica que el contenedor tenga suficiente RAM (mínimo 1GB)
- Revisa los logs para errores de dependencias del sistema

## 📞 Soporte

Si encuentras problemas, revisa:
- Logs en Coolify
- Archivo TROUBLESHOOTING.md
- Documentación de Coolify: https://coolify.io/docs
