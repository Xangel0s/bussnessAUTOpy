# 🔧 Guía de Solución de Problemas

## Problemas Comunes y Soluciones

### 1. Error al iniciar Docker Compose

#### Problema: "port is already allocated"
```
Error: bind: address already in use
```

**Solución:**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Cambiar el puerto en docker-compose.yml
ports:
  - "8001:8000"  # Usar 8001 en lugar de 8000
```

#### Problema: "no configuration file provided"
**Solución:**
```bash
# Asegúrate de estar en el directorio correcto
cd /ruta/al/proyecto
docker-compose up
```

### 2. Errores de Base de Datos

#### Problema: "could not connect to server"
**Solución:**
```bash
# Esperar a que PostgreSQL esté listo
docker-compose logs postgres

# Reiniciar solo el servicio de backend
docker-compose restart backend
```

#### Problema: "relation does not exist"
**Solución:**
```bash
# Recrear las tablas
docker-compose down -v  # Elimina volúmenes
docker-compose up --build
```

### 3. Errores de Scraping

#### Problema: "TimeoutError" o "Navigation timeout"
**Causas posibles:**
- Internet lento
- Google Maps bloqueando la IP
- Demasiados resultados solicitados

**Soluciones:**
```python
# Reducir max_results
{
  "query": "restaurantes en Madrid",
  "max_results": 10  # En lugar de 50
}

# Esperar entre búsquedas
# El sistema ya tiene delays aleatorios, pero puedes aumentarlos
# en scraper.py línea: await asyncio.sleep(random.uniform(2, 5))
```

#### Problema: "No se encuentran resultados"
**Solución:**
- Verifica que la búsqueda sea válida en Google Maps
- Prueba con búsquedas más específicas
- Revisa los logs: `docker-compose logs -f backend`

### 4. Errores del Frontend

#### Problema: "Failed to fetch" o "Network Error"
**Solución:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/

# Verificar variable de entorno
# En .env debe estar:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Problema: Página en blanco
**Solución:**
```bash
# Ver logs del frontend
docker-compose logs -f frontend

# Reconstruir el frontend
docker-compose up --build frontend
```

### 5. Problemas con Playwright

#### Problema: "Executable doesn't exist"
**Solución:**
```bash
# Entrar al contenedor
docker-compose exec backend bash

# Reinstalar Playwright
playwright install chromium
playwright install-deps chromium
```

#### Problema: "Browser closed unexpectedly"
**Solución:**
- Aumentar memoria del contenedor Docker
- Reducir número de resultados simultáneos
- Verificar logs: `docker-compose logs backend`

### 6. Notificaciones no Funcionan

#### Problema: No llegan notificaciones a Slack/Discord
**Verificaciones:**
```bash
# 1. Verificar que el webhook esté configurado
cat .env | grep NOTIFICATION_WEBHOOK

# 2. Probar el webhook manualmente
curl -X POST "TU_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "Prueba"}'

# 3. Ver logs del backend
docker-compose logs backend | grep "notificación"
```

### 7. Problemas de Rendimiento

#### Problema: Scraping muy lento
**Optimizaciones:**
```python
# En scraper.py, ajustar:
- Reducir tiempo de scroll
- Reducir delays entre páginas
- Usar headless=True (ya está por defecto)
```

#### Problema: Base de datos lenta
**Solución:**
```bash
# Agregar índices (ya están creados, pero por si acaso)
docker-compose exec postgres psql -U admin -d leadhunter

CREATE INDEX IF NOT EXISTS idx_leads_reclamable ON leads(es_reclamable);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
```

### 8. Errores de Permisos

#### Problema: "Permission denied" en Linux
**Solución:**
```bash
# Dar permisos al script
chmod +x start.sh

# O ejecutar con sudo
sudo docker-compose up
```

### 9. Logs y Debugging

#### Ver todos los logs
```bash
docker-compose logs -f
```

#### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### Ver últimas 100 líneas
```bash
docker-compose logs --tail=100 backend
```

#### Entrar a un contenedor
```bash
# Backend
docker-compose exec backend bash

# PostgreSQL
docker-compose exec postgres psql -U admin -d leadhunter
```

### 10. Resetear Todo

#### Empezar desde cero
```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Reconstruir desde cero
docker-compose up --build
```

## Comandos Útiles de PostgreSQL

```bash
# Conectar a la base de datos
docker-compose exec postgres psql -U admin -d leadhunter

# Ver todas las tablas
\dt

# Ver estructura de una tabla
\d leads

# Contar leads
SELECT COUNT(*) FROM leads;

# Ver oportunidades
SELECT nombre, telefono, url FROM leads WHERE es_reclamable = TRUE;

# Ver estadísticas por tipificación
SELECT t.nombre, COUNT(lt.id) 
FROM tipificaciones t 
LEFT JOIN lead_tracking lt ON t.id = lt.tipificacion_id 
GROUP BY t.nombre;

# Salir
\q
```

## Verificar Instalación

### Script de verificación rápida
```bash
# 1. Verificar Docker
docker --version
docker-compose --version

# 2. Verificar servicios
docker-compose ps

# 3. Verificar conectividad
curl http://localhost:8000/
curl http://localhost:3000/

# 4. Ejecutar pruebas
cd backend
python test_api.py
```

## Contacto y Soporte

Si ninguna de estas soluciones funciona:

1. Revisa los logs completos: `docker-compose logs > logs.txt`
2. Verifica tu configuración: `cat .env`
3. Abre un issue en GitHub con:
   - Descripción del problema
   - Logs relevantes
   - Sistema operativo
   - Versión de Docker

## Recursos Adicionales

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de Playwright](https://playwright.dev/)
- [Documentación de Next.js](https://nextjs.org/docs)
