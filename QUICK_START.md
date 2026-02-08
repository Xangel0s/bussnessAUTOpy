# 🚀 Quick Start - Auto-Py LeadHunter

## ⚡ Inicio Rápido en 5 Minutos

---

## 📋 Requisitos Previos

### Obligatorios
- ✅ **Docker** y **Docker Compose** instalados
- ✅ **Git** para clonar el repositorio

### Opcionales (para desarrollo)
- Node.js 18+ (para frontend sin Docker)
- Python 3.11+ (para backend sin Docker)

---

## 🎯 Opción 1: Docker (Recomendado)

### Paso 1: Clonar Repositorio
```bash
git clone https://github.com/Xangel0s/bussnessAUTOpy.git
cd bussnessAUTOpy
```

### Paso 2: Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
DB_PASSWORD=tu_password_seguro_aqui
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Paso 3: Levantar Servicios
```bash
docker-compose up --build
```

### Paso 4: Acceder al Sistema
```
Frontend: http://localhost:3000
Backend API: http://localhost:3001
API Docs: http://localhost:3001/docs
```

### ✅ ¡Listo! El sistema está corriendo

---

## 💻 Opción 2: Desarrollo Local (Sin Docker)

### Backend

#### 1. Instalar Dependencias
```bash
cd backend
pip install -r requirements.txt
playwright install chromium
```

#### 2. Configurar Base de Datos
```bash
# Instalar PostgreSQL 16
# Crear base de datos 'leadhunter'
# Configurar usuario 'admin'
```

#### 3. Configurar Variables
```bash
cp .env.local.example .env.local
```

Edita `.env.local`:
```env
DATABASE_URL=postgresql://admin:password@localhost:5432/leadhunter
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/XXX
```

#### 4. Ejecutar Backend
```bash
uvicorn main:app --reload --port 3001
```

### Frontend

#### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

#### 2. Configurar Variables
Crea `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3. Ejecutar Frontend
```bash
npm run dev
```

### ✅ Acceder
```
Frontend: http://localhost:3000
Backend: http://localhost:3001
```

---

## 🧪 Verificar Instalación

### 1. Health Check del Backend
```bash
curl http://localhost:3001/
```

**Respuesta esperada:**
```json
{
  "status": "online",
  "service": "LeadHunter API",
  "version": "1.0.0"
}
```

### 2. Verificar Tipificaciones
```bash
curl http://localhost:3001/tipificaciones
```

**Respuesta esperada:** Array con 7 tipificaciones

### 3. Verificar Frontend
Abre http://localhost:3000 en tu navegador

**Deberías ver:** Dashboard con stats cards

---

## 📊 Primer Uso

### 1. Ir al Dashboard
```
http://localhost:3000
```

### 2. Iniciar Primera Búsqueda
1. Click en "Nueva Búsqueda" en el sidebar
2. Ingresa: "restaurantes en Madrid"
3. Max resultados: 20
4. Click en "Iniciar Búsqueda"
5. Espera 1-2 minutos

### 3. Ver Resultados
1. Ve a "Todos los Leads"
2. Deberías ver los leads encontrados
3. Filtra por "Oportunidad: Sí"

### 4. Explorar Mapa de Calor
1. Click en "Mapa de Calor"
2. Ve el análisis geográfico
3. Identifica la mejor ubicación

---

## 🔧 Comandos Útiles

### Docker

#### Ver Logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

#### Reiniciar Servicios
```bash
# Todos
docker-compose restart

# Solo backend
docker-compose restart backend
```

#### Detener Servicios
```bash
docker-compose down
```

#### Eliminar Todo (incluyendo BD)
```bash
docker-compose down -v
```

### Base de Datos

#### Conectarse a PostgreSQL
```bash
docker-compose exec postgres psql -U admin -d leadhunter
```

#### Ver Tablas
```sql
\dt
```

#### Ver Leads
```sql
SELECT * FROM leads LIMIT 10;
```

#### Ver Oportunidades
```sql
SELECT * FROM leads WHERE es_reclamable = true;
```

#### Salir
```sql
\q
```

---

## 🐛 Solución de Problemas

### Error: "Connection refused to postgres"

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Reiniciar servicios
docker-compose restart postgres
docker-compose restart backend
```

### Error: "Playwright browser not found"

**Solución:**
```bash
# Reconstruir imagen del backend
docker-compose build --no-cache backend
docker-compose up backend
```

### Error: "CORS policy blocked"

**Solución:**
```bash
# Verificar NEXT_PUBLIC_API_URL en .env
# Debe ser: http://localhost:3001

# Reiniciar frontend
docker-compose restart frontend
```

### Frontend no muestra datos

**Solución:**
```bash
# Verificar backend
curl http://localhost:3001/

# Ver logs del frontend
docker-compose logs frontend

# Verificar variable de entorno
docker-compose exec frontend env | grep NEXT_PUBLIC_API_URL
```

### Puerto ya en uso

**Solución:**
```bash
# Cambiar puertos en docker-compose.yml
# Frontend: 3000 → 3002
# Backend: 3001 → 3003

# O detener el proceso que usa el puerto
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Documentación Adicional

### Archivos de Referencia
- **README.md** - Documentación técnica completa
- **USER_GUIDE.md** - Guía de usuario detallada
- **API_EXAMPLES.md** - Ejemplos de uso de API
- **TROUBLESHOOTING.md** - Solución de problemas
- **DEPLOYMENT.md** - Guía de deployment en producción

### Recursos Online
- **Demo en vivo:** https://panel.merckout.me
- **API Docs:** https://api.merckout.me/docs
- **GitHub:** https://github.com/Xangel0s/bussnessAUTOpy

---

## 🎯 Próximos Pasos

### 1. Explorar Módulos
- ✅ Dashboard - Vista general
- ✅ Nueva Búsqueda - Encontrar leads
- ✅ Todos los Leads - Gestionar base de datos
- ✅ Por Contactar - Leads con teléfono
- ✅ Seguimientos - Contactos programados
- ✅ Pipeline CRM - Vista Kanban
- ✅ Mapa de Calor - Análisis de oportunidades

### 2. Configurar Notificaciones
1. Crear webhook en Slack/Discord
2. Copiar URL del webhook
3. Pegar en `.env` como `NOTIFICATION_WEBHOOK`
4. Reiniciar backend

### 3. Realizar Búsquedas
1. Probar diferentes ubicaciones
2. Variar número de resultados
3. Revisar historial de búsquedas
4. Analizar en Mapa de Calor

### 4. Gestionar Leads
1. Filtrar oportunidades
2. Exportar a CSV
3. Programar seguimientos
4. Organizar en Pipeline

---

## 🚀 Comandos de Producción

### Build de Producción

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 3001
```

### Docker Compose (Producción)
```bash
docker-compose -f docker-compose.yml up -d
```

---

## 📊 Estructura del Proyecto

```
bussnessAUTOpy/
├── backend/
│   ├── main.py              # API FastAPI
│   ├── scraper.py           # Scraper de Google Maps
│   ├── database.py          # Conexión a BD
│   ├── notifications.py     # Sistema de notificaciones
│   └── requirements.txt     # Dependencias Python
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Dashboard
│   │   ├── search/          # Búsqueda
│   │   ├── leads/           # Leads
│   │   ├── follow-ups/      # Seguimientos
│   │   ├── to-contact/      # Por Contactar
│   │   ├── crm/             # Pipeline CRM
│   │   └── heatmap/         # Mapa de Calor
│   ├── components/
│   │   └── Sidebar.tsx      # Navegación
│   └── package.json         # Dependencias Node
├── docker-compose.yml       # Orquestación
├── .env                     # Variables de entorno
└── README.md               # Documentación
```

---

## ✅ Checklist de Instalación

### Antes de Empezar
- [ ] Docker instalado
- [ ] Docker Compose instalado
- [ ] Git instalado
- [ ] Puerto 3000 libre
- [ ] Puerto 3001 libre
- [ ] Puerto 5432 libre (PostgreSQL)

### Instalación
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Docker Compose ejecutado
- [ ] Servicios corriendo

### Verificación
- [ ] Backend responde en /
- [ ] Frontend carga en navegador
- [ ] Tipificaciones creadas
- [ ] Primera búsqueda exitosa
- [ ] Leads visibles en tabla

---

## 🎉 ¡Listo para Usar!

Si completaste todos los pasos, tu sistema Auto-Py LeadHunter está **100% funcional** y listo para:

1. ✅ Buscar leads en Google Maps
2. ✅ Detectar oportunidades automáticamente
3. ✅ Analizar con Mapa de Calor
4. ✅ Gestionar pipeline de ventas
5. ✅ Programar seguimientos
6. ✅ Exportar datos

---

## 📞 Soporte

### ¿Problemas?
1. Revisa **TROUBLESHOOTING.md**
2. Verifica logs: `docker-compose logs`
3. Consulta **README.md**
4. Abre un issue en GitHub

### ¿Preguntas?
1. Lee **USER_GUIDE.md**
2. Revisa **API_EXAMPLES.md**
3. Consulta API Docs: http://localhost:3001/docs

---

**Desarrollado con:** Python + FastAPI + Next.js + PostgreSQL + Playwright  
**Estado:** ✅ Producción Ready  
**Versión:** 1.0.0  

🚀 **¡Buena suerte con tu prospección!**
