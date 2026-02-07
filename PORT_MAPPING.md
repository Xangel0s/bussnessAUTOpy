# 🔌 Mapeo de Puertos - Auto-Py LeadHunter

## 📋 Configuración de Puertos

### Desarrollo Local

| Servicio | Puerto Interno | Puerto Externo | URL |
|----------|---------------|----------------|-----|
| **Frontend** | 3000 | 3000 | http://localhost:3000 |
| **Backend** | 3001 | 3001 | http://localhost:3001 |
| **PostgreSQL** | 5432 | 5432 | localhost:5432 (interno) |

### Producción (Coolify + Cloudflare Tunnels)

| Servicio | Puerto Interno | Dominio | URL |
|----------|---------------|---------|-----|
| **Frontend** | 3000 | panel.merckout.me | https://panel.merckout.me |
| **Backend** | 3001 | api.merckout.me | https://api.merckout.me |
| **PostgreSQL** | 5432 | (interno) | No expuesto |

---

## 🔄 Cambio de Puerto Backend

**Razón del cambio:**
- Puerto 8000 ocupado por Coolify
- Cambio a 3001 para evitar conflictos
- Permite escalabilidad con múltiples contenedores

**Archivos modificados:**
1. `docker-compose.yml` - Puerto 8000 → 3001
2. `backend/Dockerfile` - EXPOSE y CMD con puerto 3001
3. `.env.example` - NEXT_PUBLIC_API_URL con puerto 3001

---

## 🌐 Variables de Entorno

### Desarrollo Local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Producción
```env
NEXT_PUBLIC_API_URL=https://api.merckout.me
```

**Nota:** En producción, Cloudflare Tunnels mapea:
- `panel.merckout.me` → `localhost:3000` (Frontend)
- `api.merckout.me` → `localhost:3001` (Backend)

---

## 📊 Arquitectura de Red

```
┌─────────────────────────────────────────────────────────┐
│                  Cloudflare Tunnels                      │
│  panel.merckout.me (3000) | api.merckout.me (3001)     │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼────────┐  ┌────▼────────┐
│   Frontend     │  │   Backend   │
│   Port 3000    │◄─┤   Port 3001 │
└────────────────┘  └────┬────────┘
                         │
                    ┌────▼────────┐
                    │ PostgreSQL  │
                    │  Port 5432  │
                    └─────────────┘
```

---

## 🔧 Configuración de Coolify

### Servicios a Configurar:

1. **Frontend**
   - Puerto interno: 3000
   - Dominio: panel.merckout.me
   - Variable: `NEXT_PUBLIC_API_URL=https://api.merckout.me`

2. **Backend**
   - Puerto interno: 3001
   - Dominio: api.merckout.me
   - Variables: `DB_PASSWORD`, `NOTIFICATION_WEBHOOK`

3. **PostgreSQL**
   - Puerto interno: 5432
   - No exponer públicamente
   - Solo accesible desde red interna Docker

---

## 🚀 Escalabilidad Futura

Con este mapeo de puertos, podemos agregar más servicios:

| Servicio Futuro | Puerto Sugerido | Propósito |
|----------------|-----------------|-----------|
| Worker Queue | 3002 | Procesamiento en background |
| WebSocket Server | 3003 | Actualizaciones en tiempo real |
| Admin Panel | 3004 | Panel de administración |
| Metrics/Monitoring | 3005 | Prometheus/Grafana |
| Cache (Redis) | 6379 | Cache en memoria |

---

## ✅ Checklist de Configuración

### Desarrollo Local
- [ ] `docker-compose.yml` con puerto 3001
- [ ] `.env` con `NEXT_PUBLIC_API_URL=http://localhost:3001`
- [ ] Ejecutar `docker-compose up`
- [ ] Verificar backend en http://localhost:3001
- [ ] Verificar frontend en http://localhost:3000

### Producción (Coolify)
- [ ] Backend configurado en puerto 3001
- [ ] Frontend configurado en puerto 3000
- [ ] Variable `NEXT_PUBLIC_API_URL=https://api.merckout.me`
- [ ] Cloudflare Tunnel apuntando a puerto 3001
- [ ] SSL habilitado en ambos dominios

---

## 🔍 Verificación Post-Deployment

```bash
# Verificar backend
curl http://localhost:3001/
# Esperado: {"status":"online","service":"LeadHunter API","version":"1.0.0"}

# Verificar frontend
curl http://localhost:3000/
# Esperado: HTML de Next.js

# Verificar conexión frontend-backend
# Abrir http://localhost:3000 en navegador
# DevTools → Network → Verificar llamadas a localhost:3001
```

---

## 📝 Notas Importantes

1. **Puerto 8000 evitado** - Usado por Coolify internamente
2. **Puerto 3001 para backend** - Evita conflictos
3. **Puerto 3000 para frontend** - Estándar de Next.js
4. **PostgreSQL 5432** - Solo red interna Docker
5. **Cloudflare Tunnels** - Maneja SSL y routing

---

**Última actualización:** 2026-02-07  
**Cambio:** Backend 8000 → 3001 para evitar conflictos con Coolify
