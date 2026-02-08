# 📖 Guía de Usuario - Auto-Py LeadHunter

## 🎯 Introducción

Auto-Py LeadHunter es un sistema completo de prospección automatizada que te ayuda a encontrar, gestionar y convertir oportunidades de negocio en Google Maps.

---

## 🚀 Inicio Rápido

### 1. Acceder al Sistema
```
Desarrollo: http://localhost:3000
Producción: https://panel.merckout.me
```

### 2. Navegación Principal
El sistema cuenta con 7 módulos principales accesibles desde el sidebar:

1. 🏠 **Dashboard** - Vista general
2. 🔍 **Nueva Búsqueda** - Encontrar leads
3. 🎯 **Pipeline CRM** - Gestionar ventas
4. 👥 **Todos los Leads** - Base de datos completa
5. 📞 **Por Contactar** - Leads con teléfono
6. 📅 **Seguimientos** - Contactos programados
7. 🔥 **Mapa de Calor** - Análisis de oportunidades

---

## 📊 Módulo 1: Dashboard

### ¿Qué Muestra?
- **4 Métricas Principales**: Total de leads, oportunidades, contactables, tasa de éxito
- **Pipeline Visual**: Distribución de leads por etapa de venta
- **Leads Recientes**: Últimos 5 leads capturados
- **Acciones Rápidas**: Acceso directo a funciones principales

### Cómo Usarlo
1. Al entrar, verás un resumen completo de tu pipeline
2. Las métricas se actualizan automáticamente
3. Haz click en cualquier acción rápida para navegar

### Métricas Explicadas
- **Total**: Todos los leads en tu base de datos
- **Oportunidades**: Negocios no reclamados (🎯)
- **Contactables**: Leads con número de teléfono
- **Tasa**: Porcentaje de oportunidades vs total

---

## 🔍 Módulo 2: Nueva Búsqueda

### ¿Para Qué Sirve?
Iniciar búsquedas automatizadas en Google Maps para encontrar nuevos leads.

### Paso a Paso

#### 1. Ingresar Búsqueda
```
Ejemplos:
- "restaurantes en Madrid"
- "cafeterías en Lima, Miraflores"
- "hoteles en Barcelona"
- "gimnasios en Buenos Aires"
```

**Consejos:**
- Sé específico con la ubicación
- Usa términos claros
- Incluye ciudad o distrito

#### 2. Configurar Resultados
```
Rango: 1 - 100 leads
Recomendado: 20-30 para empezar
```

#### 3. Iniciar Búsqueda
- Click en "Iniciar Búsqueda"
- El sistema comenzará a scrapear Google Maps
- Verás el progreso en tiempo real

#### 4. Monitorear Progreso
Durante la búsqueda verás:
- Consulta actual
- Leads encontrados
- Oportunidades detectadas
- Barra de progreso animada

#### 5. Historial de Búsquedas
- Se guardan las últimas 10 búsquedas
- Click en cualquiera para reutilizar
- Muestra estadísticas de cada búsqueda

### Tiempo Estimado
- 20 resultados: ~1-2 minutos
- 50 resultados: ~3-5 minutos
- 100 resultados: ~5-8 minutos

---

## 👥 Módulo 3: Todos los Leads

### ¿Para Qué Sirve?
Ver, filtrar y exportar todos los leads capturados.

### Funcionalidades

#### Filtros Disponibles
1. **Búsqueda**: Por nombre o dirección
2. **Oportunidad**: Todos / Sí (No reclamado) / No
3. **Teléfono**: Todos / Con teléfono / Sin teléfono

#### Tabla de Leads
Columnas:
- **Negocio**: Nombre, dirección, badge de oportunidad (🎯)
- **Contacto**: Teléfono o "Sin teléfono"
- **Rating**: Estrellas y número de reseñas
- **Estado**: Oportunidad / Reclamado
- **Etapa**: Tipificación actual con color
- **Acciones**: Ver Detalles / Ver en Maps

#### Ver Detalles (Modal)
Click en "Ver Detalles" para abrir modal con:
- Nombre completo
- Teléfono (con botón de llamar)
- Dirección completa
- Rating y reseñas
- Estado y etapa actual
- Botones de acción (Llamar / Ver en Maps)

#### Exportar a CSV
1. Aplica los filtros deseados
2. Click en "Exportar CSV"
3. Se descarga archivo con todos los campos
4. Compatible con Excel

**Campos Exportados:**
- ID, Nombre, Teléfono, Dirección
- Rating, Reseñas, Oportunidad
- Estado, Etapa

---

## 📅 Módulo 4: Seguimientos

### ¿Para Qué Sirve?
Gestionar contactos programados y no perder oportunidades.

### Estadísticas
- **Total**: Todos los seguimientos programados
- **Hoy**: Contactos para hoy
- **Esta Semana**: Próximos 7 días
- **Vencidos**: Seguimientos pasados

### Filtros
- **Todos**: Todos los seguimientos
- **Hoy**: Solo para hoy (🟠)
- **Esta Semana**: Próximos 7 días (🔵)
- **Vencidos**: Atrasados (🔴)

### Información por Lead
- Nombre del negocio
- Teléfono y rating
- Dirección completa
- Última nota registrada
- Quién realizó el contacto
- Fecha y hora del próximo seguimiento

### Código de Colores
- 🔴 **Rojo**: Vencido (urgente)
- 🟠 **Naranja**: Hoy (importante)
- 🔵 **Azul**: Futuro (planificado)

### Acciones
- **Llamar**: Abre marcador del teléfono
- **Ver Maps**: Abre Google Maps

---

## 📞 Módulo 5: Por Contactar

### ¿Para Qué Sirve?
Acceso rápido a leads con teléfono listos para contactar.

### Estadísticas
- **Total Contactables**: Leads con teléfono
- **Oportunidades**: No reclamados con teléfono
- **Con Rating Alto**: Rating ≥ 4.0 con teléfono

### Vista de Cards
Cada card muestra:
- Nombre del negocio
- Teléfono destacado
- Rating y reseñas
- Dirección
- Etapa actual
- Badge de oportunidad (🎯)

### Acciones por Card
1. **Copiar Teléfono**: Click en icono de copiar
   - Copia al portapapeles
   - Muestra checkmark verde
   - Vuelve a normal en 2 segundos

2. **Llamar**: Click en botón verde
   - Abre marcador del teléfono
   - Listo para llamar

3. **Ver Maps**: Click en botón de mapa
   - Abre Google Maps en nueva pestaña

---

## 🎯 Módulo 6: Pipeline CRM

### ¿Para Qué Sirve?
Vista Kanban para gestionar el proceso de venta.

### Columnas (7 Etapas)
1. 🔵 **Nuevo**: Lead recién descubierto
2. 🟠 **Contactado**: Primer contacto realizado
3. 🟢 **Interesado**: Muestra interés
4. 🔴 **No Interesado**: No tiene interés
5. 🟣 **Seguimiento**: Requiere seguimiento
6. 🟢 **Cerrado**: Negocio cerrado
7. ⚫ **No Contactar**: No volver a contactar

### Información por Card
- Nombre del negocio
- Teléfono (si disponible)
- Rating y reseñas
- Dirección (truncada)
- Badge de oportunidad

### Acciones por Card
- **Nota**: Agregar nota al lead
- **Ver**: Abrir en Google Maps

### Navegación
- Scroll horizontal para ver todas las columnas
- Contador de leads por columna
- Descripción de cada etapa

---

## 🔥 Módulo 7: Mapa de Calor ⭐

### ¿Para Qué Sirve?
Análisis visual de oportunidades para identificar dónde y qué buscar.

### Estadísticas Generales
- **Total Leads**: Todos los leads analizados
- **Oportunidades**: Total de no reclamados
- **Tasa de Éxito**: Porcentaje global
- **Ubicaciones**: Número de zonas únicas

---

### 📍 Análisis Geográfico

#### ¿Qué Muestra?
Top 10 ubicaciones con más oportunidades.

#### Información por Ubicación
- **Ranking**: Posición (#1, #2, #3...)
- **Nombre**: Ciudad o zona
- **Oportunidades**: Número de leads no reclamados
- **Total**: Total de leads en esa zona
- **Porcentaje**: Tasa de éxito
- **Rating**: Promedio de rating
- **Teléfonos**: Cantidad con teléfono

#### Código de Colores
- 🟢 **Verde oscuro** (≥70%): Excelente zona
- 🟢 **Verde** (50-69%): Buena zona
- 🟡 **Amarillo** (30-49%): Zona moderada
- 🟠 **Naranja** (10-29%): Zona baja
- 🔴 **Rojo** (<10%): Zona muy baja

#### Cómo Interpretarlo
- **Porcentaje alto** = Más oportunidades
- **Rating alto** = Negocios de calidad
- **Más teléfonos** = Más contactables

**Ejemplo:**
```
#1 Madrid
45 de 60 leads (75%)
⭐ 4.2 | 📞 52

Interpretación:
- Excelente zona (75% de éxito)
- Buena calidad (4.2 rating)
- Alta contactabilidad (52 teléfonos)
```

---

### 🏪 Análisis por Categoría

#### ¿Qué Muestra?
Tipos de negocio más prometedores.

#### Categorías Detectadas
- Restaurante
- Cafetería
- Tienda
- Hotel
- Bar
- Panadería
- Farmacia
- Peluquería
- Gimnasio
- Consultorio
- Otros

#### Información por Categoría
- **Nombre**: Tipo de negocio
- **Oportunidades**: Leads no reclamados
- **Total**: Total de leads
- **Porcentaje**: Tasa de éxito
- **Barra**: Visual proporcional

#### Cómo Interpretarlo
- **Porcentaje alto** = Categoría prometedora
- **Muchas oportunidades** = Nicho desatendido

**Ejemplo:**
```
Restaurante
28 oportunidades de 35 leads (80%)

Interpretación:
- Categoría muy prometedora
- Alto porcentaje de no reclamados
- Buen nicho para prospectar
```

---

### 📈 Tendencia Temporal

#### ¿Qué Muestra?
Evolución de leads por mes.

#### Información
- **Período**: Mes y año
- **Total**: Leads encontrados (azul)
- **Oportunidades**: No reclamados (verde)
- **Barras**: Visualización proporcional

#### Cómo Interpretarlo
- **Barras grandes** = Períodos productivos
- **Verde alto** = Muchas oportunidades
- **Tendencia** = Crecimiento o decrecimiento

---

### 💡 Insights Automáticos

#### 4 Métricas Clave

1. **Mejor Ubicación**
   - Zona con más oportunidades
   - Porcentaje de éxito
   - Dónde enfocar búsquedas

2. **Mejor Categoría**
   - Tipo de negocio más prometedor
   - Porcentaje de éxito
   - Qué buscar

3. **Promedio de Rating**
   - Rating general de ubicaciones
   - Calidad de los leads
   - Indicador de calidad

4. **Leads Contactables**
   - Porcentaje con teléfono
   - Facilidad de contacto
   - Efectividad potencial

---

## 🎯 Casos de Uso Prácticos

### Caso 1: Vendedor de Marketing Digital

**Objetivo:** Encontrar restaurantes sin presencia digital

**Flujo:**
1. **Búsqueda**: "restaurantes en Barcelona"
2. **Mapa de Calor**: Identificar mejor zona (ej: Eixample 75%)
3. **Nueva Búsqueda**: "restaurantes en Eixample, Barcelona"
4. **Por Contactar**: Filtrar oportunidades con teléfono
5. **Llamar**: Contactar directamente
6. **Pipeline**: Mover a "Contactado" o "Interesado"
7. **Seguimientos**: Programar próximo contacto

**Resultado:** Lista calificada de prospectos en zona óptima

---

### Caso 2: Consultor SEO Local

**Objetivo:** Identificar nichos desatendidos

**Flujo:**
1. **Búsqueda**: Múltiples categorías en una ciudad
2. **Mapa de Calor**: Ver análisis por categoría
3. **Identificar**: Categoría con mayor % (ej: Gimnasios 85%)
4. **Nueva Búsqueda**: Enfocada en esa categoría
5. **Leads**: Exportar a CSV para análisis
6. **Filtrar**: Rating alto + Oportunidad
7. **Contactar**: Priorizar los mejores

**Resultado:** Nicho identificado con alta tasa de éxito

---

### Caso 3: Agencia de Publicidad

**Objetivo:** Pipeline de ventas organizado

**Flujo:**
1. **Búsqueda**: Leads en múltiples zonas
2. **Mapa de Calor**: Priorizar zonas por %
3. **Por Contactar**: Llamar a los contactables
4. **Pipeline CRM**: Organizar por etapa
5. **Seguimientos**: Programar contactos
6. **Dashboard**: Monitorear progreso
7. **Cerrar**: Mover a "Cerrado"

**Resultado:** Pipeline organizado y seguimiento efectivo

---

## 💡 Mejores Prácticas

### Para Búsquedas
✅ Empieza con 20-30 resultados
✅ Sé específico con la ubicación
✅ Usa el historial para repetir búsquedas exitosas
✅ Prueba diferentes categorías

### Para Contacto
✅ Prioriza oportunidades con teléfono
✅ Revisa el rating antes de llamar
✅ Prepara tu pitch de venta
✅ Registra notas después de cada contacto

### Para Seguimientos
✅ Programa seguimientos inmediatamente
✅ Revisa "Hoy" cada mañana
✅ No dejes vencer seguimientos
✅ Agrega notas detalladas

### Para Análisis
✅ Revisa el Mapa de Calor semanalmente
✅ Identifica patrones de éxito
✅ Ajusta estrategia según insights
✅ Exporta datos para análisis externo

---

## 🔧 Atajos y Tips

### Navegación Rápida
- **Dashboard**: Vista general rápida
- **Ctrl+Click**: Abrir en nueva pestaña
- **Filtros**: Combinar para precisión

### Productividad
- **Copiar Teléfono**: Más rápido que escribir
- **Exportar CSV**: Para análisis en Excel
- **Historial**: Reutilizar búsquedas exitosas
- **Modal**: Ver detalles sin cambiar de página

### Organización
- **Pipeline**: Visualizar progreso
- **Seguimientos**: No perder oportunidades
- **Tipificaciones**: Clasificar leads
- **Notas**: Registrar información importante

---

## ❓ Preguntas Frecuentes

### ¿Cuánto tarda una búsqueda?
- 20 resultados: 1-2 minutos
- 50 resultados: 3-5 minutos
- 100 resultados: 5-8 minutos

### ¿Qué es una "oportunidad"?
Un negocio que no ha reclamado su perfil de Google Maps, indicado con 🎯

### ¿Cómo sé si un lead es bueno?
- Es oportunidad (🎯)
- Tiene teléfono (📞)
- Rating alto (≥4.0 ⭐)
- Muchas reseñas

### ¿Puedo hacer múltiples búsquedas?
Sí, pero una a la vez. Espera que termine antes de iniciar otra.

### ¿Se guardan mis búsquedas?
Sí, las últimas 10 en el historial del navegador.

### ¿Cómo exporto los datos?
Módulo "Todos los Leads" → Aplicar filtros → "Exportar CSV"

### ¿Qué significa cada color en el Mapa de Calor?
- 🟢 Verde: Excelente (≥70%)
- 🟡 Amarillo: Moderado (30-49%)
- 🔴 Rojo: Bajo (<10%)

---

## 📞 Soporte

### Documentación
- **README.md**: Documentación técnica completa
- **API_EXAMPLES.md**: Ejemplos de uso de API
- **TROUBLESHOOTING.md**: Solución de problemas

### Recursos
- **Demo**: https://panel.merckout.me
- **API Docs**: https://api.merckout.me/docs
- **GitHub**: https://github.com/Xangel0s/bussnessAUTOpy

---

## 🎉 ¡Listo para Empezar!

1. Accede al Dashboard
2. Inicia tu primera búsqueda
3. Revisa el Mapa de Calor
4. Contacta tus primeros leads
5. Organiza tu pipeline
6. ¡Cierra ventas!

**¡Buena suerte con tu prospección! 🚀**
