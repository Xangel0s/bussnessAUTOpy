import asyncpg
import os
from typing import List, Dict, Optional
from datetime import datetime

class Database:
    def __init__(self):
        self.pool = None
        self.database_url = os.getenv("DATABASE_URL")
    
    async def create_tables(self):
        """Crea las tablas necesarias"""
        self.pool = await asyncpg.create_pool(self.database_url)
        
        async with self.pool.acquire() as conn:
            # Tabla de leads
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS leads (
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
                )
            """)
            
            # Tabla de tipificaciones
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS tipificaciones (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL UNIQUE,
                    color VARCHAR(20) NOT NULL,
                    descripcion TEXT,
                    orden INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """)
            
            # Tabla de seguimiento de leads
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS lead_tracking (
                    id SERIAL PRIMARY KEY,
                    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
                    tipificacion_id INTEGER REFERENCES tipificaciones(id),
                    notas TEXT,
                    contactado_por VARCHAR(100),
                    fecha_contacto TIMESTAMP DEFAULT NOW(),
                    proximo_seguimiento TIMESTAMP
                )
            """)
            
            # Insertar tipificaciones por defecto
            await conn.execute("""
                INSERT INTO tipificaciones (nombre, color, descripcion, orden)
                VALUES 
                    ('Nuevo', '#3B82F6', 'Lead recién descubierto', 1),
                    ('Contactado', '#F59E0B', 'Primer contacto realizado', 2),
                    ('Interesado', '#10B981', 'Muestra interés en el servicio', 3),
                    ('No Interesado', '#EF4444', 'No tiene interés', 4),
                    ('Seguimiento', '#8B5CF6', 'Requiere seguimiento posterior', 5),
                    ('Cerrado', '#059669', 'Negocio cerrado exitosamente', 6),
                    ('No Contactar', '#6B7280', 'No volver a contactar', 7)
                ON CONFLICT (nombre) DO NOTHING
            """)
    
    async def insert_lead(self, lead_data: Dict):
        """Inserta un nuevo lead"""
        async with self.pool.acquire() as conn:
            try:
                result = await conn.fetchrow("""
                    INSERT INTO leads (nombre, telefono, url, direccion, rating, reviews, es_reclamable, estado)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (url) DO NOTHING
                    RETURNING id
                """, lead_data["nombre"], lead_data.get("telefono"), lead_data["url"],
                    lead_data.get("direccion"), lead_data.get("rating"), lead_data.get("reviews"),
                    lead_data["es_reclamable"], lead_data["estado"])
                
                # Si es un lead nuevo y reclamable, crear tracking inicial
                if result and lead_data["es_reclamable"]:
                    tipificacion_nuevo = await conn.fetchval(
                        "SELECT id FROM tipificaciones WHERE nombre = 'Nuevo'"
                    )
                    await conn.execute("""
                        INSERT INTO lead_tracking (lead_id, tipificacion_id, notas)
                        VALUES ($1, $2, 'Lead detectado automáticamente')
                    """, result['id'], tipificacion_nuevo)
                    
                return result['id'] if result else None
            except Exception as e:
                print(f"Error insertando lead: {e}")
                return None
    
    async def get_leads(self, reclamable_only: bool = False, tipificacion: str = None, 
                       limit: int = 100, offset: int = 0) -> List[Dict]:
        """Obtiene leads con filtros"""
        async with self.pool.acquire() as conn:
            query = """
                SELECT l.*, 
                       t.nombre as tipificacion_nombre,
                       t.color as tipificacion_color,
                       lt.notas as ultima_nota,
                       lt.fecha_contacto as ultimo_contacto
                FROM leads l
                LEFT JOIN lead_tracking lt ON l.id = lt.lead_id 
                    AND lt.id = (SELECT MAX(id) FROM lead_tracking WHERE lead_id = l.id)
                LEFT JOIN tipificaciones t ON lt.tipificacion_id = t.id
                WHERE 1=1
            """
            
            if reclamable_only:
                query += " AND l.es_reclamable = TRUE"
            
            if tipificacion:
                query += f" AND t.nombre = '{tipificacion}'"
            
            query += f" ORDER BY l.created_at DESC LIMIT {limit} OFFSET {offset}"
            
            rows = await conn.fetch(query)
            return [dict(row) for row in rows]
    
    async def get_lead(self, lead_id: int) -> Optional[Dict]:
        """Obtiene un lead específico con su historial"""
        async with self.pool.acquire() as conn:
            lead = await conn.fetchrow("SELECT * FROM leads WHERE id = $1", lead_id)
            if not lead:
                return None
            
            tracking = await conn.fetch("""
                SELECT lt.*, t.nombre as tipificacion_nombre, t.color as tipificacion_color
                FROM lead_tracking lt
                JOIN tipificaciones t ON lt.tipificacion_id = t.id
                WHERE lt.lead_id = $1
                ORDER BY lt.fecha_contacto DESC
            """, lead_id)
            
            return {
                **dict(lead),
                "historial": [dict(t) for t in tracking]
            }
    
    async def update_lead_tracking(self, lead_id: int, tipificacion_id: int, 
                                   notas: str, contactado_por: str, 
                                   proximo_seguimiento: datetime = None):
        """Actualiza el tracking de un lead"""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO lead_tracking (lead_id, tipificacion_id, notas, contactado_por, proximo_seguimiento)
                VALUES ($1, $2, $3, $4, $5)
            """, lead_id, tipificacion_id, notas, contactado_por, proximo_seguimiento)
    
    async def delete_lead(self, lead_id: int) -> bool:
        """Elimina un lead"""
        async with self.pool.acquire() as conn:
            result = await conn.execute("DELETE FROM leads WHERE id = $1", lead_id)
            return result == "DELETE 1"
    
    async def get_stats(self) -> Dict:
        """Obtiene estadísticas"""
        async with self.pool.acquire() as conn:
            total = await conn.fetchval("SELECT COUNT(*) FROM leads")
            reclamables = await conn.fetchval("SELECT COUNT(*) FROM leads WHERE es_reclamable = TRUE")
            con_telefono = await conn.fetchval("SELECT COUNT(*) FROM leads WHERE telefono IS NOT NULL")
            
            # Stats por tipificación
            tipificaciones_stats = await conn.fetch("""
                SELECT t.nombre, t.color, COUNT(lt.id) as cantidad
                FROM tipificaciones t
                LEFT JOIN lead_tracking lt ON t.id = lt.tipificacion_id
                    AND lt.id = (SELECT MAX(id) FROM lead_tracking WHERE tipificacion_id = t.id)
                GROUP BY t.id, t.nombre, t.color
                ORDER BY t.orden
            """)
            
            return {
                "total": total,
                "reclamables": reclamables,
                "con_telefono": con_telefono,
                "porcentaje_oportunidades": round((reclamables / total * 100) if total > 0 else 0, 1),
                "por_tipificacion": [dict(t) for t in tipificaciones_stats]
            }
    
    async def get_tipificaciones(self) -> List[Dict]:
        """Obtiene todas las tipificaciones"""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("SELECT * FROM tipificaciones ORDER BY orden")
            return [dict(row) for row in rows]
