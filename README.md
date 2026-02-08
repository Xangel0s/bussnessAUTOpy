# 🎯 Auto-Py LeadHunter - Sistema Inteligente de Prospección

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.41-2EAD33?logo=playwright&logoColor=white)

**Sistema automatizado de prospección de negocios en Google Maps con IA para detectar oportunidades comerciales**

[🌐 Demo](https://panel.merckout.me) • [📚 API Docs](https://api.merckout.me/docs) • [🚀 Deployment](#-deployment)

</div>

---

## 📖 ¿Qué es Auto-Py LeadHunter?

**Auto-Py LeadHunter** es una plataforma completa de prospección automatizada que utiliza web scraping inteligente para identificar negocios no reclamados en Google Maps. El sistema analiza automáticamente miles de negocios, detecta oportunidades comerciales y las organiza en un CRM integrado para facilitar el seguimiento y cierre de ventas.

### 🎯 Propósito del Sistema

Muchos negocios en Google Maps no han reclamado su perfil, lo que representa una oportunidad de oro para:
- **Agencias de Marketing Digital**: Ofrecer servicios de gestión de presencia online
- **Consultores SEO**: Ayudar a negocios a mejorar su visibilidad
- **Vendedores B2B**: Identificar prospectos que necesitan servicios digitales
- **Emprendedores**: Encontrar nichos de mercado desatendidos

**Auto-Py automatiza todo el proceso**: desde la búsqueda hasta la notificación, permitiéndote enfocarte en cerrar ventas.

---

## 🚀 Características Principales

### 🤖 Scraping Inteligente con Playwright
- **Búsquedas personalizadas** en Google Maps por ubicación y categoría
- **Detección automática** de negocios no reclamados
- **Extracción de datos**: nombre, teléfono, dirección, rating, reseñas
- **Procesamiento en tiempo real** con actualizaciones en vivo
- **Anti-detección**: Navegación realista con delays aleatorios
- **Historial de búsquedas**: Últimas 10 búsquedas con estadísticas

### 📊 CRM Integrado (7 Módulos Completos)
1. **Dashboard Principal** - Vista general con métricas clave
2. **Búsqueda de Leads** - Scraping con monitoreo en tiempo real
3. **Gestión de Leads** - Tabla completa con filtros y exportación CSV
4. **Seguimientos** - Calendario de contactos programados
5. **Por Contactar** - Leads con teléfono listos para llamar
6. **Pipeline CRM** - Vista Kanban por etapas de venta
7. **Mapa de Calor** ⭐ - Análisis geográfico y de oportunidades

### 🔥 Mapa de Calor de Oportunidades (NUEVO)
- **Análisis Geográfico**: Top ubicaciones con mayor tasa de éxito
- **Análisis por Categoría**: Tipos de negocio más prometedores
- **Tendencia Temporal**: Evolución de leads por período
- **Insights Automáticos**: Mejor ubicación, categoría, rating promedio
- **Código de Colores**: Visualización intuitiva del % de éxito
- **Métricas Calculadas**: Rating, contactabilidad, oportunidades

### 📋 Sistema de Tipificaciones
- **7 estados predefinidos**: Nuevo, Contactado, Interesado, No Interesado, Seguimiento, Cerrado, No Contactar
- **Historial completo** de interacciones con cada lead
- **Seguimientos programados** con recordatorios y alertas
- **Filtros avanzados** por estado, reclamabilidad, y más
- **Estadísticas en tiempo real** del pipeline de ventas

### 🔔 Notificaciones Automáticas
- **Alertas instantáneas** vía Slack/Discord cuando se encuentra una oportunidad
- **Información completa** del negocio en cada notificación
- **Integración con webhooks** personalizados

### 🎨 Dashboard Moderno
- **Interfaz intuitiva** construida con Next.js 14 y Tailwind CSS
- **Visualización en tiempo real** del progreso de scraping
- **Gestión completa de leads** desde la interfaz web
- **Responsive design** para uso en cualquier dispositivo
- **Exportación a CSV** de todos los datos
- **Modal de detalles** con información completa del lead

### 🗄️ Base de Datos Robusta
- **PostgreSQL 16** para almacenamiento confiable
- **Migraciones automáticas** al iniciar
- **Relaciones optimizadas** entre leads y seguimientos
- **Persistencia de datos** con volúmenes Docker

### 🐳 Deployment Simplificado
- **Docker Compose** para orquestación de servicios
- **Coolify** para deployment en producción
- **Cloudflare Tunnels** para acceso seguro sin exponer puertos
- **SSL automático** y gestión de dominios

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Tunnels                        │
│  panel.merckout.me (Frontend) | api.merckout.me (Backend)   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌───────▼────────┐
│   Frontend     │       │    Backend     │
│   Next.js 14   │◄──────┤   FastAPI      │
│   Port 3000    │       │   Port 3001    │
└────────────────┘       └───────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼──────┐ ┌──▼──────┐ ┌──▼────────┐
            │  PostgreSQL  │ │Playwright│ │ Webhooks  │
            │   Port 5432  │ │ Scraper  │ │Slack/Disc.│
            └──────────────┘ └──────────┘ └───────────┘
```

### Componentes:

1. **Frontend (Next.js 14)**
   - Interfaz de usuario moderna y responsive
   - Comunicación con API vía Axios
   - Actualización en tiempo real del estado de scraping
   - Gestión completa de leads y seguimientos

2. **Backend (FastAPI + Python 3.11)**
   - API RESTful con 10 endpoints
   - Procesamiento asíncrono de scraping
   - Gestión de base de datos con asyncpg
   - Sistema de notificaciones integrado

3. **Scraper (Playwright)**
   - Navegador headless Chromium
   - Scraping inteligente de Google Maps
   - Detección automática de negocios no reclamados
   - Extracción de datos estructurados

4. **Base de Datos (PostgreSQL 16)**
   - 3 tablas principales: leads, tipificaciones, lead_tracking
   - Relaciones optimizadas con foreign keys
   - Índices para búsquedas rápidas
   - Volumen persistente para datos

5. **Hosting (Coolify + Cloudflare)**
   - Deployment automatizado con Coolify
   - Túneles seguros con Cloudflare
   - SSL automático
   - Dominios: panel.merckout.me y api.merckout.me

---

## 🔄 Flujo de Trabajo

```
1. Usuario ingresa búsqueda
   ↓
2. Frontend envía POST /scrape
   ↓
3. Backend inicia Playwright en background
   ↓
4. Scraper navega Google Maps
   ↓
5. Por cada negocio encontrado:
   ├─ Extrae datos (nombre, teléfono, etc.)
   ├─ Detecta si está reclamado
   ├─ Guarda en PostgreSQL
   └─ Si es oportunidad → Envía notificación
   ↓
6. Frontend muestra resultados en tiempo real
   ↓
7. Usuario gestiona leads en el CRM
```

---

## 📊 Modelo de Datos

### Tabla: `leads`
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    url TEXT NOT NULL UNIQUE,
    direccion TEXT,
    rating FLOAT,
    reviews INTEGER,
    es_reclamable BOOLEAN DEFAULT FALSE,
    estado VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `tipificaciones`
```sql
CREATE TABLE tipificaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Tipificaciones predefinidas:**
1. 🔵 **Nuevo** - Lead recién descubierto
2. 🟠 **Contactado** - Primer contacto realizado
3. 🟢 **Interesado** - Muestra interés en el servicio
4. 🔴 **No Interesado** - No tiene interés
5. 🟣 **Seguimiento** - Requiere seguimiento posterior
6. 🟢 **Cerrado** - Negocio cerrado exitosamente
7. ⚫ **No Contactar** - No volver a contactar

### Tabla: `lead_tracking`
```sql
CREATE TABLE lead_tracking (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    tipificacion_id INTEGER REFERENCES tipificaciones(id),
    notas TEXT,
    contactado_por VARCHAR(100),
    fecha_contacto TIMESTAMP DEFAULT NOW(),
    proximo_seguimiento TIMESTAMP
);
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.11** - Lenguaje principal
- **FastAPI 0.109** - Framework web moderno y rápido
- **Playwright 1.41** - Automatización de navegador
- **asyncpg 0.29** - Driver PostgreSQL asíncrono
- **Pydantic 2.5** - Validación de datos
- **httpx 0.26** - Cliente HTTP asíncrono
- **Uvicorn** - Servidor ASGI de alto rendimiento

### Frontend
- **Next.js 14.1** - Framework React con SSR
- **React 18.2** - Librería UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 3.3** - Framework CSS utility-first
- **Axios 1.6** - Cliente HTTP
- **Lucide React** - Iconos modernos
- **date-fns 3.2** - Manipulación de fechas

### Base de Datos
- **PostgreSQL 16 Alpine** - Base de datos relacional

### DevOps
- **Docker & Docker Compose** - Containerización
- **Coolify** - Plataforma de deployment
- **Cloudflare Tunnels** - Acceso seguro sin exponer puertos
- **GitHub** - Control de versiones

---

## 🚀 Instalación y Deployment

### 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **Cuenta de Coolify** (para producción)
- **Cloudflare Tunnel** configurado (para producción)
- (Opcional) Webhook de Slack/Discord para notificaciones

---

### 💻 Desarrollo Local

#### 1. Clonar el repositorio

```bash
git clone https://github.com/Xangel0s/bussnessAUTOpy.git
cd bussnessAUTOpy
```

#### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DB_PASSWORD=tu_password_seguro_aqui
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3. Levantar los servicios

```bash
docker-compose up --build
```

Esto iniciará:
- 🐘 **PostgreSQL** en el puerto 5432
- 🐍 **Backend API** en http://localhost:3001
- ⚛️ **Frontend** en http://localhost:3000

#### 4. Verificar instalación

```bash
# Health check del backend
curl http://localhost:3001/

# Debe responder:
# {"status":"online","service":"LeadHunter API","version":"1.0.0"}
```

---

### 🌐 Deployment en Producción (Coolify + Cloudflare)

#### Configuración en Coolify

1. **Crear nuevo proyecto** en Coolify
2. **Conectar repositorio** de GitHub
3. **Seleccionar "Docker Compose"**
4. **Configurar variables de entorno**:

```env
DB_PASSWORD=tu_password_seguro_produccion
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/XXX/YYY/ZZZ
NEXT_PUBLIC_API_URL=https://api.merckout.me
```

5. **Configurar dominios**:
   - Frontend: `panel.merckout.me` → Puerto 3000
   - Backend: `api.merckout.me` → Puerto 3001

6. **Hacer Deploy** 🚀

#### Configuración de Cloudflare Tunnels

1. **Instalar cloudflared**:
```bash
# En tu servidor
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
```

2. **Autenticar**:
```bash
cloudflared tunnel login
```

3. **Crear túnel**:
```bash
cloudflared tunnel create auto-py-leadhunter
```

4. **Configurar rutas** en `config.yml`:
```yaml
tunnel: <TUNNEL-ID>
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: panel.merckout.me
    service: http://localhost:3000
  - hostname: api.merckout.me
    service: http://localhost:3001
  - service: http_status:404
```

5. **Iniciar túnel**:
```bash
cloudflared tunnel run auto-py-leadhunter
```

#### Verificación Post-Deployment

```bash
# Backend
curl https://api.merckout.me/
curl https://api.merckout.me/stats
curl https://api.merckout.me/tipificaciones

# Frontend
curl https://panel.merckout.me/
```

---

## 📖 Uso del Sistema

### 🖥️ Interfaz Web

1. **Acceder al dashboard**
   ```
   Desarrollo: http://localhost:3000
   Producción: https://panel.merckout.me
   ```

2. **Iniciar una búsqueda**
   - Ingresa tu consulta (ej: "restaurantes en Madrid")
   - Define el número máximo de resultados (1-100)
   - Haz clic en "Buscar"

3. **Monitorear el progreso**
   - El sistema muestra actualizaciones en tiempo real
   - Contador de leads encontrados
   - Contador de oportunidades detectadas

4. **Gestionar leads**
   - Filtra por estado (reclamables, tipificación)
   - Visualiza detalles completos de cada lead
   - Actualiza el estado y agrega notas
   - Programa seguimientos

---

### 🔌 API REST

#### Base URL
```
Desarrollo: http://localhost:3001
Producción: https://api.merckout.me
```

#### Documentación Interactiva
```
Swagger UI: https://api.merckout.me/docs
ReDoc: https://api.merckout.me/redoc
```

---

### 📡 Endpoints Principales

#### 1. Health Check
```bash
GET /
```
**Respuesta:**
```json
{
  "status": "online",
  "service": "LeadHunter API",
  "version": "1.0.0"
}
```

---

#### 2. Iniciar Scraping
```bash
POST /scrape
Content-Type: application/json

{
  "query": "restaurantes en Madrid",
  "max_results": 20
}
```

**Respuesta:**
```json
{
  "message": "Scraping iniciado",
  "query": "restaurantes en Madrid",
  "max_results": 20
}
```

**Ejemplo con cURL:**
```bash
curl -X POST "https://api.merckout.me/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "restaurantes en Madrid",
    "max_results": 20
  }'
```

**Ejemplo con Python:**
```python
import requests

response = requests.post(
    "https://api.merckout.me/scrape",
    json={
        "query": "restaurantes en Madrid",
        "max_results": 20
    }
)
print(response.json())
```

---

#### 3. Estado del Scraping
```bash
GET /scrape/status
```

**Respuesta:**
```json
{
  "is_running": true,
  "leads_found": 15,
  "opportunities_found": 8,
  "current_query": "restaurantes en Madrid"
}
```

---

#### 4. Obtener Leads
```bash
GET /leads?reclamable_only=true&limit=50&offset=0
```

**Parámetros:**
- `reclamable_only` (bool): Solo oportunidades
- `tipificacion` (string): Filtrar por tipificación
- `limit` (int): Número de resultados (default: 100)
- `offset` (int): Paginación (default: 0)

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Restaurante El Buen Sabor",
    "telefono": "+34 912 345 678",
    "url": "https://maps.google.com/?cid=123456789",
    "direccion": "Calle Mayor 1, Madrid",
    "rating": 4.5,
    "reviews": 120,
    "es_reclamable": true,
    "estado": "NO RECLAMADO",
    "created_at": "2024-02-07T10:30:00",
    "tipificacion_nombre": "Nuevo",
    "tipificacion_color": "#3B82F6"
  }
]
```

---

#### 5. Obtener Lead Específico
```bash
GET /leads/{lead_id}
```

**Respuesta:**
```json
{
  "id": 1,
  "nombre": "Restaurante El Buen Sabor",
  "telefono": "+34 912 345 678",
  "url": "https://maps.google.com/?cid=123456789",
  "direccion": "Calle Mayor 1, Madrid",
  "rating": 4.5,
  "reviews": 120,
  "es_reclamable": true,
  "estado": "NO RECLAMADO",
  "created_at": "2024-02-07T10:30:00",
  "historial": [
    {
      "id": 1,
      "tipificacion_nombre": "Nuevo",
      "tipificacion_color": "#3B82F6",
      "notas": "Lead detectado automáticamente",
      "contactado_por": null,
      "fecha_contacto": "2024-02-07T10:30:00",
      "proximo_seguimiento": null
    }
  ]
}
```

---

#### 6. Actualizar Tracking
```bash
PUT /leads/{lead_id}/tracking
Content-Type: application/json

{
  "tipificacion_id": 2,
  "notas": "Cliente muy interesado, llamar mañana a las 10am",
  "contactado_por": "Juan Pérez",
  "proximo_seguimiento": "2024-02-15T10:00:00"
}
```

**Respuesta:**
```json
{
  "message": "Tracking actualizado correctamente"
}
```

---

#### 7. Eliminar Lead
```bash
DELETE /leads/{lead_id}
```

**Respuesta:**
```json
{
  "message": "Lead eliminado correctamente"
}
```

---

#### 8. Obtener Estadísticas
```bash
GET /stats
```

**Respuesta:**
```json
{
  "total": 150,
  "reclamables": 85,
  "con_telefono": 120,
  "porcentaje_oportunidades": 56.7,
  "por_tipificacion": [
    {
      "nombre": "Nuevo",
      "color": "#3B82F6",
      "cantidad": 45
    },
    {
      "nombre": "Contactado",
      "color": "#F59E0B",
      "cantidad": 30
    }
  ]
}
```

---

#### 9. Obtener Tipificaciones
```bash
GET /tipificaciones
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Nuevo",
    "color": "#3B82F6",
    "descripcion": "Lead recién descubierto",
    "orden": 1
  },
  {
    "id": 2,
    "nombre": "Contactado",
    "color": "#F59E0B",
    "descripcion": "Primer contacto realizado",
    "orden": 2
  }
]
```

---

### 🔔 Configurar Notificaciones

#### Slack

1. Ve a https://api.slack.com/apps
2. Crea una nueva app → "From scratch"
3. Selecciona tu workspace
4. En "Incoming Webhooks" → Activa la función
5. Crea un webhook para tu canal
6. Copia la URL del webhook
7. Pégala en `.env` como `NOTIFICATION_WEBHOOK`

**Formato de notificación:**
```
🎯 Nueva Oportunidad Detectada!

📍 Restaurante El Buen Sabor
📞 +34 912 345 678
⭐ 4.5 (120 reseñas)
📍 Calle Mayor 1, Madrid
🔗 https://maps.google.com/?cid=123456789

✅ Negocio NO RECLAMADO - ¡Oportunidad de contacto!
```

#### Discord

1. Ve a la configuración de tu servidor
2. Integraciones → Webhooks → Nuevo Webhook
3. Selecciona el canal donde quieres las notificaciones
4. Copia la URL del webhook
5. Pégala en `.env` como `NOTIFICATION_WEBHOOK`

#### Webhook Personalizado

Puedes usar cualquier servicio que acepte webhooks HTTP POST:

```python
# El sistema envía este payload:
{
  "text": "🎯 Nueva Oportunidad Detectada!",
  "nombre": "Restaurante El Buen Sabor",
  "telefono": "+34 912 345 678",
  "rating": 4.5,
  "reviews": 120,
  "direccion": "Calle Mayor 1, Madrid",
  "url": "https://maps.google.com/?cid=123456789",
  "estado": "NO RECLAMADO"
}
```

---

## 🔧 Comandos Útiles

### Docker

```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo del scraper
docker-compose logs -f backend | grep "Scraping"

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build

# Reiniciar un servicio específico
docker-compose restart backend
```

### Base de Datos

```bash
# Conectarse a PostgreSQL
docker-compose exec postgres psql -U admin -d leadhunter

# Ver tablas
\dt

# Ver leads
SELECT * FROM leads LIMIT 10;

# Ver oportunidades
SELECT * FROM leads WHERE es_reclamable = true;

# Ver estadísticas
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE es_reclamable = true) as oportunidades,
  COUNT(*) FILTER (WHERE telefono IS NOT NULL) as con_telefono
FROM leads;

# Salir
\q
```

### Desarrollo

```bash
# Backend (sin Docker)
cd backend
pip install -r requirements.txt
playwright install chromium
uvicorn main:app --reload

# Frontend (sin Docker)
cd frontend
npm install
npm run dev

# Linting
cd frontend
npm run lint

# Build de producción
cd frontend
npm run build
npm start
```

---

## 📊 Casos de Uso

### 1. Agencia de Marketing Digital

**Objetivo:** Encontrar restaurantes sin presencia digital optimizada

```bash
# Buscar restaurantes en una ciudad
curl -X POST "https://api.merckout.me/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "restaurantes en Barcelona",
    "max_results": 50
  }'

# Obtener solo oportunidades con teléfono
curl "https://api.merckout.me/leads?reclamable_only=true" | \
  jq '.[] | select(.telefono != null)'
```

**Resultado:** Lista de restaurantes no reclamados con teléfono para contactar

---

### 2. Consultor SEO Local

**Objetivo:** Identificar negocios locales que necesitan SEO

```python
import requests

# Buscar múltiples categorías
categorias = [
    "dentistas en Madrid",
    "abogados en Madrid",
    "fontaneros en Madrid"
]

for categoria in categorias:
    requests.post(
        "https://api.merckout.me/scrape",
        json={"query": categoria, "max_results": 30}
    )
    time.sleep(60)  # Esperar entre búsquedas

# Obtener todas las oportunidades
leads = requests.get(
    "https://api.merckout.me/leads",
    params={"reclamable_only": True}
).json()

# Filtrar por rating alto (negocios establecidos)
buenos_prospectos = [
    lead for lead in leads
    if lead['rating'] >= 4.0 and lead['reviews'] >= 20
]
```

---

### 3. Vendedor B2B

**Objetivo:** Pipeline de ventas automatizado

```python
import requests
from datetime import datetime, timedelta

# 1. Buscar leads
requests.post(
    "https://api.merckout.me/scrape",
    json={"query": "tiendas de ropa en Valencia", "max_results": 40}
)

# 2. Obtener oportunidades
leads = requests.get(
    "https://api.merckout.me/leads",
    params={"reclamable_only": True}
).json()

# 3. Marcar como contactado después de llamar
for lead in leads[:10]:  # Primeros 10
    requests.put(
        f"https://api.merckout.me/leads/{lead['id']}/tracking",
        json={
            "tipificacion_id": 2,  # Contactado
            "notas": "Llamada realizada, interesado en demo",
            "contactado_por": "María García",
            "proximo_seguimiento": (datetime.now() + timedelta(days=3)).isoformat()
        }
    )
```

---

### 4. Análisis de Mercado

**Objetivo:** Estudiar competencia y oportunidades en un sector

```python
import requests
import pandas as pd

# Buscar competidores
requests.post(
    "https://api.merckout.me/scrape",
    json={"query": "cafeterías en Sevilla", "max_results": 100}
)

# Obtener todos los leads
leads = requests.get("https://api.merckout.me/leads").json()

# Análisis con pandas
df = pd.DataFrame(leads)

print("Análisis de Mercado:")
print(f"Total negocios: {len(df)}")
print(f"No reclamados: {df['es_reclamable'].sum()}")
print(f"Rating promedio: {df['rating'].mean():.2f}")
print(f"Con teléfono: {df['telefono'].notna().sum()}")

# Oportunidades premium (alto rating, no reclamado)
premium = df[
    (df['es_reclamable'] == True) & 
    (df['rating'] >= 4.5) & 
    (df['reviews'] >= 50)
]
print(f"\nOportunidades premium: {len(premium)}")
```

---

## ⚠️ Consideraciones Importantes

### 🔒 Seguridad y Privacidad

- **Datos públicos**: Solo se extraen datos públicamente visibles en Google Maps
- **Rate limiting**: Implementa delays aleatorios para evitar bloqueos
- **GDPR**: Asegúrate de cumplir con las leyes de protección de datos de tu región
- **Uso ético**: Utiliza los datos de forma responsable y profesional

### 🚦 Limitaciones Técnicas

- **Google Maps puede bloquear IPs** con demasiadas peticiones
  - Solución: Usa proxies rotativos o limita las búsquedas
  
- **Playwright consume recursos**
  - RAM mínima recomendada: 2GB para el backend
  - CPU: Mínimo 2 cores para rendimiento óptimo
  
- **Estructura HTML puede cambiar**
  - Google Maps actualiza su interfaz periódicamente
  - Puede requerir actualizaciones del scraper

### 📈 Rendimiento

- **Velocidad de scraping**: ~3-5 segundos por negocio
- **Búsqueda de 20 resultados**: ~1-2 minutos
- **Búsqueda de 100 resultados**: ~5-8 minutos
- **Concurrencia**: Un scraping a la vez (evita sobrecarga)

### 💾 Almacenamiento

- **Base de datos**: Crece ~1KB por lead
- **1000 leads**: ~1MB de datos
- **100,000 leads**: ~100MB de datos
- **Volumen Docker**: Persistente, no se pierde al reiniciar

---

## 🐛 Troubleshooting

### Error: "Connection refused to postgres"

**Causa:** PostgreSQL no está listo cuando el backend intenta conectar

**Solución:**
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar servicios en orden
docker-compose restart postgres
docker-compose restart backend
```

---

### Error: "Playwright browser not found"

**Causa:** Chromium no se instaló correctamente

**Solución:**
```bash
# Reconstruir imagen del backend
docker-compose build --no-cache backend
docker-compose up backend
```

---

### Error: "CORS policy blocked"

**Causa:** Frontend no puede conectarse al backend

**Solución:**
```bash
# Verificar NEXT_PUBLIC_API_URL en .env
# Desarrollo: http://localhost:3001
# Producción: https://api.merckout.me

# Reiniciar frontend
docker-compose restart frontend
```

---

### Error: "Database migration failed"

**Causa:** Tablas no se crearon correctamente

**Solución:**
```bash
# Eliminar volumen y recrear
docker-compose down -v
docker-compose up -d

# Verificar tablas
docker-compose exec postgres psql -U admin -d leadhunter -c "\dt"
```

---

### Scraping muy lento

**Causa:** Recursos insuficientes o red lenta

**Solución:**
```bash
# Aumentar recursos en docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2'

# Reducir max_results en las búsquedas
# Usar proxies para mejorar velocidad
```

---

### Frontend no muestra datos

**Causa:** API URL incorrecta o backend caído

**Solución:**
```bash
# Verificar backend
curl http://localhost:3001/

# Verificar logs del frontend
docker-compose logs frontend

# Verificar variable de entorno
docker-compose exec frontend env | grep NEXT_PUBLIC_API_URL
```

---

## 📚 Documentación Adicional

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía completa de despliegue en Coolify
- **[COOLIFY_CHECKLIST.md](COOLIFY_CHECKLIST.md)** - Checklist de validación pre-deployment
- **[DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)** - Validación final del sistema
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Ejemplos detallados de uso de la API
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solución de problemas comunes
- **[BEST_PRACTICES.md](BEST_PRACTICES.md)** - Mejores prácticas de uso

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m 'Add: Amazing new feature'
   ```
4. **Push** a la rama
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Abre un **Pull Request**

### Áreas de Mejora

- [ ] Soporte para múltiples idiomas en la interfaz
- [ ] Exportación de leads a CSV/Excel
- [ ] Integración con CRMs populares (HubSpot, Salesforce)
- [ ] Sistema de usuarios y permisos
- [ ] Dashboard de analytics avanzado
- [ ] Scraping de otras plataformas (Yelp, TripAdvisor)
- [ ] API de webhooks para eventos
- [ ] Modo headless configurable
- [ ] Soporte para proxies rotativos
- [ ] Tests automatizados

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2024 Auto-Py LeadHunter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Equipo

**Desarrollado por:** [Xangel0s](https://github.com/Xangel0s)

**Stack:** Python + FastAPI + Next.js + PostgreSQL + Playwright

**Hosting:** Coolify + Cloudflare Tunnels

---

## 📞 Soporte y Contacto

- **Issues:** [GitHub Issues](https://github.com/Xangel0s/bussnessAUTOpy/issues)
- **Documentación:** [Wiki del proyecto](https://github.com/Xangel0s/bussnessAUTOpy/wiki)
- **Demo en vivo:** [https://panel.merckout.me](https://panel.merckout.me)
- **API Docs:** [https://api.merckout.me/docs](https://api.merckout.me/docs)

---

## 🌟 Agradecimientos

- **FastAPI** - Framework web moderno y rápido
- **Playwright** - Automatización de navegador confiable
- **Next.js** - Framework React de producción
- **PostgreSQL** - Base de datos robusta
- **Coolify** - Plataforma de deployment simplificada
- **Cloudflare** - Infraestructura de red global

---

## 📊 Estadísticas del Proyecto

![GitHub stars](https://img.shields.io/github/stars/Xangel0s/bussnessAUTOpy?style=social)
![GitHub forks](https://img.shields.io/github/forks/Xangel0s/bussnessAUTOpy?style=social)
![GitHub issues](https://img.shields.io/github/issues/Xangel0s/bussnessAUTOpy)
![GitHub license](https://img.shields.io/github/license/Xangel0s/bussnessAUTOpy)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

**Hecho con ❤️ para ayudar a encontrar oportunidades de negocio**

[🔝 Volver arriba](#-auto-py-leadhunter---sistema-inteligente-de-prospección)

</div>
