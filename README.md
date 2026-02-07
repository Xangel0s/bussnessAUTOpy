# 🎯 LeadHunter - Google Maps Lead Generator

Sistema completo para encontrar y gestionar leads de negocios no reclamados en Google Maps.

## 🚀 Características

- **Scraping Automatizado**: Busca negocios en Google Maps y detecta cuáles no están reclamados
- **Gestión de Leads**: Sistema completo de CRM con tipificaciones y seguimiento
- **Notificaciones en Tiempo Real**: Alertas automáticas vía Slack/Discord cuando se encuentra una oportunidad
- **Dashboard Interactivo**: Interfaz web moderna con estadísticas y filtros
- **Base de Datos PostgreSQL**: Almacenamiento persistente de todos los leads
- **Dockerizado**: Fácil despliegue con Docker Compose

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- (Opcional) Webhook de Slack/Discord para notificaciones

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd leadhunter
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo con tus valores:

```bash
cp .env.example .env
```

Edita `.env`:

```env
DB_PASSWORD=tu_password_seguro_aqui
NOTIFICATION_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Levantar los servicios

```bash
docker-compose up --build
```

Esto iniciará:
- **PostgreSQL** en el puerto 5432
- **Backend API** en http://localhost:8000
- **Frontend** en http://localhost:3000

## 📖 Uso

### Interfaz Web

1. Abre http://localhost:3000 en tu navegador
2. Ingresa una búsqueda (ej: "restaurantes en Madrid")
3. Define el número máximo de resultados (1-100)
4. Haz clic en "Buscar"
5. El sistema comenzará a scrapear y mostrar resultados en tiempo real

### API Endpoints

#### Iniciar Scraping
```bash
POST http://localhost:8000/scrape
Content-Type: application/json

{
  "query": "restaurantes en Madrid",
  "max_results": 20
}
```

#### Obtener Leads
```bash
GET http://localhost:8000/leads?reclamable_only=true&limit=50
```

#### Obtener Estadísticas
```bash
GET http://localhost:8000/stats
```

#### Ver Estado del Scraping
```bash
GET http://localhost:8000/scrape/status
```

#### Obtener Lead Específico
```bash
GET http://localhost:8000/leads/{lead_id}
```

#### Actualizar Tracking de Lead
```bash
PUT http://localhost:8000/leads/{lead_id}/tracking
Content-Type: application/json

{
  "tipificacion_id": 2,
  "notas": "Cliente interesado, llamar mañana",
  "contactado_por": "Juan Pérez",
  "proximo_seguimiento": "2024-02-15T10:00:00"
}
```

#### Eliminar Lead
```bash
DELETE http://localhost:8000/leads/{lead_id}
```

## 🗄️ Estructura de la Base de Datos

### Tabla: leads
- `id`: ID único
- `nombre`: Nombre del negocio
- `telefono`: Número de teléfono (si está disponible)
- `url`: URL de Google Maps
- `direccion`: Dirección física
- `rating`: Calificación (1-5)
- `reviews`: Número de reseñas
- `es_reclamable`: Boolean - si el negocio está sin reclamar
- `estado`: "NO RECLAMADO" o "YA RECLAMADO"
- `created_at`: Fecha de creación

### Tabla: tipificaciones
Categorías predefinidas:
- Nuevo
- Contactado
- Interesado
- No Interesado
- Seguimiento
- Cerrado
- No Contactar

### Tabla: lead_tracking
Historial de interacciones con cada lead.

## 🔔 Configurar Notificaciones

### Slack

1. Ve a https://api.slack.com/apps
2. Crea una nueva app
3. Activa "Incoming Webhooks"
4. Crea un webhook para tu canal
5. Copia la URL y pégala en `.env` como `NOTIFICATION_WEBHOOK`

### Discord

1. Ve a la configuración de tu servidor
2. Integraciones → Webhooks → Nuevo Webhook
3. Copia la URL del webhook
4. Pégala en `.env` como `NOTIFICATION_WEBHOOK`

## 🐳 Comandos Docker Útiles

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build
```

## 🔧 Desarrollo Local (sin Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt
playwright install chromium
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📊 Tipificaciones y CRM

El sistema incluye un CRM básico con las siguientes tipificaciones:

- **Nuevo** (Azul): Lead recién descubierto
- **Contactado** (Naranja): Primer contacto realizado
- **Interesado** (Verde): Muestra interés
- **No Interesado** (Rojo): No tiene interés
- **Seguimiento** (Morado): Requiere seguimiento
- **Cerrado** (Verde oscuro): Negocio cerrado
- **No Contactar** (Gris): No volver a contactar

## ⚠️ Consideraciones Importantes

1. **Rate Limiting**: Google Maps puede bloquear IPs con demasiadas peticiones. Usa con moderación.
2. **Headless Browser**: El scraping usa Playwright con Chromium, consume recursos.
3. **Datos Públicos**: Solo se extraen datos públicamente visibles en Google Maps.
4. **Cumplimiento Legal**: Asegúrate de cumplir con las leyes de protección de datos de tu país.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🐛 Problemas Conocidos

- El scraping puede ser lento dependiendo del número de resultados
- Algunos negocios pueden no tener toda la información disponible
- Google Maps puede cambiar su estructura HTML, requiriendo actualizaciones del scraper

## 📧 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en GitHub.

---

Hecho con ❤️ para ayudar a encontrar oportunidades de negocio
