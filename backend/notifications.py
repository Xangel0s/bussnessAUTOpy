import httpx
import os
from typing import Dict

class NotificationService:
    def __init__(self):
        self.webhook_url = os.getenv("NOTIFICATION_WEBHOOK")
    
    async def send_opportunity_alert(self, lead: Dict, total_opportunities: int):
        """Envía notificación cuando se encuentra una oportunidad"""
        if not self.webhook_url:
            return
        
        message = {
            "text": f"🎯 *Nueva Oportunidad Detectada!*",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "🎯 Nueva Oportunidad en Google Maps"
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Negocio:*\n{lead['nombre']}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Teléfono:*\n{lead.get('telefono', 'No disponible')}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Ubicación:*\n{lead.get('direccion', 'No disponible')}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Rating:*\n{'⭐' * int(lead.get('rating', 0))} ({lead.get('reviews', 0)} reviews)"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"✅ *Estado:* NO RECLAMADO\n📊 *Total oportunidades encontradas:* {total_opportunities}"
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Ver en Google Maps"
                            },
                            "url": lead['url'],
                            "style": "primary"
                        }
                    ]
                }
            ]
        }
        
        try:
            async with httpx.AsyncClient() as client:
                await client.post(self.webhook_url, json=message, timeout=5.0)
        except Exception as e:
            print(f"Error enviando notificación: {e}")
    
    async def send_scraping_summary(self, stats: Dict):
        """Envía resumen al finalizar el scraping"""
        if not self.webhook_url:
            return
        
        message = {
            "text": f"📊 Scraping completado: {stats['nuevos_leads']} leads encontrados",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "📊 Resumen de Búsqueda Completada"
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Leads encontrados:*\n{stats['nuevos_leads']}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Oportunidades:*\n{stats['oportunidades']} ({stats['porcentaje_oportunidades']}%)"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Con teléfono:*\n{stats['con_telefono']}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Búsqueda:*\n{stats['query']}"
                        }
                    ]
                }
            ]
        }
        
        try:
            async with httpx.AsyncClient() as client:
                await client.post(self.webhook_url, json=message, timeout=5.0)
        except Exception as e:
            print(f"Error enviando resumen: {e}")
