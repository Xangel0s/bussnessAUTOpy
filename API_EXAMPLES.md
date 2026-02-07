# 📚 Ejemplos de Uso de la API

## Iniciar Scraping

### cURL
```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "restaurantes en Madrid",
    "max_results": 20
  }'
```

### Python
```python
import requests

response = requests.post(
    "http://localhost:8000/scrape",
    json={
        "query": "restaurantes en Madrid",
        "max_results": 20
    }
)
print(response.json())
```

### JavaScript
```javascript
fetch('http://localhost:8000/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'restaurantes en Madrid',
    max_results: 20
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Obtener Estado del Scraping

### cURL
```bash
curl "http://localhost:8000/scrape/status"
```

### Python
```python
import requests

response = requests.get("http://localhost:8000/scrape/status")
status = response.json()
print(f"Scraping activo: {status['is_running']}")
print(f"Leads encontrados: {status['leads_found']}")
```

## Obtener Todos los Leads

### cURL
```bash
# Todos los leads
curl "http://localhost:8000/leads"

# Solo oportunidades (no reclamados)
curl "http://localhost:8000/leads?reclamable_only=true"

# Con paginación
curl "http://localhost:8000/leads?limit=50&offset=0"

# Filtrar por tipificación
curl "http://localhost:8000/leads?tipificacion=Interesado"
```

### Python
```python
import requests

# Obtener solo oportunidades
response = requests.get(
    "http://localhost:8000/leads",
    params={"reclamable_only": True, "limit": 50}
)
leads = response.json()

for lead in leads:
    print(f"{lead['nombre']} - {lead['telefono']}")
```

## Obtener Lead Específico

### cURL
```bash
curl "http://localhost:8000/leads/1"
```

### Python
```python
import requests

lead_id = 1
response = requests.get(f"http://localhost:8000/leads/{lead_id}")
lead = response.json()

print(f"Negocio: {lead['nombre']}")
print(f"Historial de contactos: {len(lead['historial'])}")
```

## Actualizar Tracking de Lead

### cURL
```bash
curl -X PUT "http://localhost:8000/leads/1/tracking" \
  -H "Content-Type: application/json" \
  -d '{
    "tipificacion_id": 2,
    "notas": "Cliente muy interesado, llamar mañana a las 10am",
    "contactado_por": "Juan Pérez",
    "proximo_seguimiento": "2024-02-15T10:00:00"
  }'
```

### Python
```python
import requests
from datetime import datetime, timedelta

lead_id = 1
response = requests.put(
    f"http://localhost:8000/leads/{lead_id}/tracking",
    json={
        "tipificacion_id": 2,  # Contactado
        "notas": "Cliente interesado en nuestros servicios",
        "contactado_por": "Juan Pérez",
        "proximo_seguimiento": (datetime.now() + timedelta(days=1)).isoformat()
    }
)
print(response.json())
```

## Eliminar Lead

### cURL
```bash
curl -X DELETE "http://localhost:8000/leads/1"
```

### Python
```python
import requests

lead_id = 1
response = requests.delete(f"http://localhost:8000/leads/{lead_id}")
print(response.json())
```

## Obtener Estadísticas

### cURL
```bash
curl "http://localhost:8000/stats"
```

### Python
```python
import requests

response = requests.get("http://localhost:8000/stats")
stats = response.json()

print(f"Total de leads: {stats['total']}")
print(f"Oportunidades: {stats['reclamables']}")
print(f"% Oportunidades: {stats['porcentaje_oportunidades']}%")
print(f"Con teléfono: {stats['con_telefono']}")

print("\nPor tipificación:")
for tip in stats['por_tipificacion']:
    print(f"  {tip['nombre']}: {tip['cantidad']}")
```

## Obtener Tipificaciones

### cURL
```bash
curl "http://localhost:8000/tipificaciones"
```

### Python
```python
import requests

response = requests.get("http://localhost:8000/tipificaciones")
tipificaciones = response.json()

for tip in tipificaciones:
    print(f"{tip['nombre']} ({tip['color']}) - {tip['descripcion']}")
```

## Script Completo de Automatización

### Python - Scraping y Notificación Personalizada
```python
import requests
import time

API_URL = "http://localhost:8000"

def buscar_leads(query, max_results=20):
    """Inicia búsqueda de leads"""
    print(f"🔍 Iniciando búsqueda: {query}")
    
    response = requests.post(
        f"{API_URL}/scrape",
        json={"query": query, "max_results": max_results}
    )
    
    if response.status_code == 200:
        print("✅ Scraping iniciado")
        return True
    else:
        print(f"❌ Error: {response.json()}")
        return False

def monitorear_scraping():
    """Monitorea el progreso del scraping"""
    while True:
        response = requests.get(f"{API_URL}/scrape/status")
        status = response.json()
        
        if not status['is_running']:
            print("✅ Scraping completado")
            break
        
        print(f"📊 Progreso: {status['leads_found']} leads | "
              f"{status['opportunities_found']} oportunidades")
        time.sleep(3)

def obtener_mejores_oportunidades():
    """Obtiene las mejores oportunidades"""
    response = requests.get(
        f"{API_URL}/leads",
        params={"reclamable_only": True}
    )
    
    leads = response.json()
    
    # Filtrar los que tienen teléfono y buen rating
    mejores = [
        lead for lead in leads
        if lead['telefono'] and lead.get('rating', 0) >= 4.0
    ]
    
    return sorted(mejores, key=lambda x: x.get('rating', 0), reverse=True)

# Uso
if __name__ == "__main__":
    # 1. Iniciar búsqueda
    buscar_leads("restaurantes en Barcelona", max_results=30)
    
    # 2. Monitorear progreso
    monitorear_scraping()
    
    # 3. Obtener mejores oportunidades
    mejores = obtener_mejores_oportunidades()
    
    print(f"\n🎯 Top {len(mejores)} oportunidades encontradas:\n")
    for i, lead in enumerate(mejores[:10], 1):
        print(f"{i}. {lead['nombre']}")
        print(f"   📞 {lead['telefono']}")
        print(f"   ⭐ {lead['rating']} ({lead['reviews']} reseñas)")
        print(f"   🔗 {lead['url']}\n")
```

## Integración con Webhook Personalizado

### Python - Enviar a tu propio sistema
```python
import requests

def enviar_a_mi_crm(lead):
    """Envía lead a tu CRM personalizado"""
    mi_webhook = "https://tu-sistema.com/webhook"
    
    payload = {
        "nombre": lead['nombre'],
        "telefono": lead['telefono'],
        "email": None,  # Extraer si está disponible
        "fuente": "Google Maps",
        "url": lead['url'],
        "notas": f"Rating: {lead['rating']}, Reviews: {lead['reviews']}"
    }
    
    requests.post(mi_webhook, json=payload)

# Obtener nuevas oportunidades y enviarlas
response = requests.get(f"{API_URL}/leads?reclamable_only=true")
for lead in response.json():
    if lead['telefono']:  # Solo si tiene teléfono
        enviar_a_mi_crm(lead)
```

## Documentación Interactiva

Visita http://localhost:8000/docs para ver la documentación interactiva de Swagger UI donde puedes probar todos los endpoints directamente desde el navegador.
