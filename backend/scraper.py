from playwright.async_api import async_playwright
import asyncio
import random
from typing import AsyncGenerator, Dict

class GoogleMapsScraper:
    def __init__(self, query: str, max_results: int = 20):
        self.query = query
        self.max_results = max_results
    
    async def scrape(self) -> AsyncGenerator[Dict, None]:
        """Scraping generador que yielda cada lead encontrado"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox']
            )
            
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                viewport={'width': 1920, 'height': 1080}
            )
            
            page = await context.new_page()
            
            # Navegar a Google Maps
            search_url = f"https://www.google.com/maps/search/{self.query.replace(' ', '+')}"
            await page.goto(search_url, wait_until="domcontentloaded")
            
            try:
                await page.wait_for_selector('div[role="feed"]', timeout=15000)
            except:
                await browser.close()
                return
            
            # Scroll para cargar resultados
            feed = page.locator('div[role="feed"]')
            for _ in range(5):
                await feed.evaluate("node => node.scrollTop += 3000")
                await asyncio.sleep(random.uniform(1.5, 3.0))
            
            # Obtener enlaces de negocios
            links = await page.locator("a[href*='/maps/place/']").all()
            
            for i, link in enumerate(links[:self.max_results]):
                if i >= self.max_results:
                    break
                
                try:
                    url = await link.get_attribute("href")
                    new_page = await context.new_page()
                    await new_page.goto(url, timeout=10000)
                    
                    # Extraer datos
                    lead_data = await self._extract_business_data(new_page, url)
                    
                    if lead_data:
                        yield lead_data
                    
                    await new_page.close()
                    await asyncio.sleep(random.uniform(2, 5))
                
                except Exception as e:
                    print(f"Error procesando negocio: {e}")
                    continue
            
            await browser.close()
    
    async def _extract_business_data(self, page, url: str) -> Dict:
        """Extrae datos de un negocio"""
        try:
            # Nombre
            nombre = await page.locator("h1").first.inner_text(timeout=5000)
            
            # Verificar si es reclamable
            body_text = await page.locator("body").inner_text()
            es_reclamable = (
                "Reclamar esta empresa" in body_text or
                "Propietario de este negocio" in body_text or
                "Claim this business" in body_text or
                "¿Eres el propietario" in body_text
            )
            
            # Teléfono
            telefono = None
            try:
                tel_button = page.locator("button[data-item-id*='phone']")
                if await tel_button.count() > 0:
                    aria_label = await tel_button.first.get_attribute("aria-label")
                    telefono = aria_label.replace("Teléfono: ", "").replace("Phone: ", "")
            except:
                pass
            
            # Dirección
            direccion = None
            try:
                addr_button = page.locator("button[data-item-id*='address']")
                if await addr_button.count() > 0:
                    aria_label = await addr_button.first.get_attribute("aria-label")
                    direccion = aria_label.replace("Dirección: ", "").replace("Address: ", "")
            except:
                pass
            
            # Rating y reviews
            rating = None
            reviews = None
            try:
                rating_text = await page.locator("div.F7nice span[aria-hidden='true']").first.inner_text()
                rating = float(rating_text)
                
                reviews_text = await page.locator("div.F7nice span[aria-label*='reseñas']").first.inner_text()
                reviews = int(reviews_text.replace("(", "").replace(")", "").replace(",", ""))
            except:
                pass
            
            return {
                "nombre": nombre,
                "telefono": telefono,
                "url": url,
                "direccion": direccion,
                "rating": rating,
                "reviews": reviews,
                "es_reclamable": es_reclamable,
                "estado": "NO RECLAMADO" if es_reclamable else "YA RECLAMADO"
            }
        
        except Exception as e:
            print(f"Error extrayendo datos: {e}")
            return None
