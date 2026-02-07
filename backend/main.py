from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import asyncio

from database import Database
from scraper import GoogleMapsScraper
from notifications import NotificationService

app = FastAPI(
    title="LeadHunter API",
    description="API para encontrar y gestionar leads de Google Maps",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancias globales
db = Database()
notifier = NotificationService()

# Estado del scraping
scraping_state = {
    "is_running": False,
    "leads_found": 0,
    "opportunities_found": 0,
    "current_query": None
}

# Modelos Pydantic
class ScrapeRequest(BaseModel):
    query: str
    max_results: int = 20

class TrackingUpdate(BaseModel):
    tipificacion_id: int
    notas: str
    contactado_por: str
    proximo_seguimiento: Optional[datetime] = None

@app.on_event("startup")
async def startup():
    """Inicializa la base de datos al arrancar"""
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            await db.create_tables()
            print("✅ Base de datos inicializada")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"⚠️ Intento {attempt + 1}/{max_retries} falló: {e}")
                print(f"🔄 Reintentando en {retry_delay} segundos...")
                await asyncio.sleep(retry_delay)
            else:
                print(f"❌ Error fatal conectando a la base de datos: {e}")
                raise

@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "online",
        "service": "LeadHunter API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check detallado"""
    try:
        # Verificar conexión a BD
        async with db.pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "online",
        "service": "LeadHunter API",
        "version": "1.0.0",
        "database": db_status,
        "port": 3001
    }

@app.post("/scrape")
async def start_scraping(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Inicia el proceso de scraping"""
    if scraping_state["is_running"]:
        raise HTTPException(status_code=400, detail="Ya hay un scraping en progreso")
    
    background_tasks.add_task(run_scraping, request.query, request.max_results)
    
    return {
        "message": "Scraping iniciado",
        "query": request.query,
        "max_results": request.max_results
    }

async def run_scraping(query: str, max_results: int):
    """Ejecuta el scraping en background"""
    scraping_state["is_running"] = True
    scraping_state["leads_found"] = 0
    scraping_state["opportunities_found"] = 0
    scraping_state["current_query"] = query
    
    print(f"🔍 Iniciando scraping: {query} (max: {max_results})")
    
    try:
        # Crear instancia del scraper con los parámetros
        scraper = GoogleMapsScraper(query, max_results)
        
        lead_count = 0
        async for lead in scraper.scrape():
            lead_count += 1
            print(f"📍 Lead #{lead_count}: {lead.get('nombre', 'Sin nombre')}")
            
            # Guardar en base de datos
            lead_id = await db.insert_lead(lead)
            
            if lead_id:
                scraping_state["leads_found"] += 1
                print(f"✅ Lead guardado con ID: {lead_id}")
                
                if lead["es_reclamable"]:
                    scraping_state["opportunities_found"] += 1
                    print(f"🎯 Oportunidad encontrada! Total: {scraping_state['opportunities_found']}")
                    # Enviar notificación
                    await notifier.send_opportunity_alert(
                        lead, 
                        scraping_state["opportunities_found"]
                    )
            else:
                print(f"⚠️ Lead duplicado o error al guardar")
        
        print(f"✅ Scraping completado: {scraping_state['leads_found']} leads, {scraping_state['opportunities_found']} oportunidades")
    
    except Exception as e:
        print(f"❌ Error en scraping: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        scraping_state["is_running"] = False
        print("🏁 Scraping finalizado")

@app.get("/scrape/status")
async def get_scraping_status():
    """Obtiene el estado actual del scraping"""
    return scraping_state

@app.get("/leads")
async def get_leads(
    reclamable_only: bool = False,
    tipificacion: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """Obtiene la lista de leads"""
    leads = await db.get_leads(reclamable_only, tipificacion, limit, offset)
    return leads

@app.get("/leads/{lead_id}")
async def get_lead(lead_id: int):
    """Obtiene un lead específico con su historial"""
    lead = await db.get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return lead

@app.put("/leads/{lead_id}/tracking")
async def update_tracking(lead_id: int, tracking: TrackingUpdate):
    """Actualiza el tracking de un lead"""
    try:
        await db.update_lead_tracking(
            lead_id,
            tracking.tipificacion_id,
            tracking.notas,
            tracking.contactado_por,
            tracking.proximo_seguimiento
        )
        return {"message": "Tracking actualizado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/leads/{lead_id}")
async def delete_lead(lead_id: int):
    """Elimina un lead"""
    success = await db.delete_lead(lead_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return {"message": "Lead eliminado correctamente"}

@app.get("/stats")
async def get_stats():
    """Obtiene estadísticas generales"""
    stats = await db.get_stats()
    return stats

@app.get("/tipificaciones")
async def get_tipificaciones():
    """Obtiene todas las tipificaciones disponibles"""
    tipificaciones = await db.get_tipificaciones()
    return tipificaciones
