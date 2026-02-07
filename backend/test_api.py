"""
Script de prueba básico para verificar que la API funciona correctamente
Ejecutar: python test_api.py
"""

import requests
import time

API_URL = "http://localhost:8000"

def test_health_check():
    """Prueba el endpoint de health check"""
    print("🔍 Probando health check...")
    try:
        response = requests.get(f"{API_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        print("✅ Health check OK")
        return True
    except Exception as e:
        print(f"❌ Health check falló: {e}")
        return False

def test_get_stats():
    """Prueba obtener estadísticas"""
    print("🔍 Probando obtener estadísticas...")
    try:
        response = requests.get(f"{API_URL}/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "reclamables" in data
        print(f"✅ Estadísticas OK - Total leads: {data['total']}")
        return True
    except Exception as e:
        print(f"❌ Estadísticas falló: {e}")
        return False

def test_get_tipificaciones():
    """Prueba obtener tipificaciones"""
    print("🔍 Probando obtener tipificaciones...")
    try:
        response = requests.get(f"{API_URL}/tipificaciones")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        print(f"✅ Tipificaciones OK - {len(data)} tipificaciones encontradas")
        return True
    except Exception as e:
        print(f"❌ Tipificaciones falló: {e}")
        return False

def test_get_leads():
    """Prueba obtener leads"""
    print("🔍 Probando obtener leads...")
    try:
        response = requests.get(f"{API_URL}/leads")
        assert response.status_code == 200
        data = response.json()
        print(f"✅ Leads OK - {len(data)} leads encontrados")
        return True
    except Exception as e:
        print(f"❌ Leads falló: {e}")
        return False

def test_scraping_status():
    """Prueba obtener estado del scraping"""
    print("🔍 Probando estado del scraping...")
    try:
        response = requests.get(f"{API_URL}/scrape/status")
        assert response.status_code == 200
        data = response.json()
        assert "is_running" in data
        print(f"✅ Estado scraping OK - Running: {data['is_running']}")
        return True
    except Exception as e:
        print(f"❌ Estado scraping falló: {e}")
        return False

def run_all_tests():
    """Ejecuta todas las pruebas"""
    print("\n" + "="*50)
    print("🧪 INICIANDO PRUEBAS DE LA API")
    print("="*50 + "\n")
    
    tests = [
        test_health_check,
        test_get_stats,
        test_get_tipificaciones,
        test_get_leads,
        test_scraping_status
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        if test():
            passed += 1
        else:
            failed += 1
        print()
        time.sleep(0.5)
    
    print("="*50)
    print(f"📊 RESULTADOS: {passed} pasadas, {failed} fallidas")
    print("="*50 + "\n")
    
    if failed == 0:
        print("🎉 ¡Todas las pruebas pasaron!")
    else:
        print("⚠️  Algunas pruebas fallaron. Revisa los logs.")

if __name__ == "__main__":
    run_all_tests()
