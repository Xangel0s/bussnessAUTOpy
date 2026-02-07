#!/bin/bash

echo "🎯 LeadHunter - Iniciando servicios..."
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Creando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor edítalo con tus valores antes de continuar."
    echo ""
    exit 1
fi

echo "🐳 Construyendo y levantando contenedores Docker..."
docker-compose up --build -d

echo ""
echo "✅ Servicios iniciados!"
echo ""
echo "📍 URLs disponibles:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Detener servicios:"
echo "   docker-compose down"
echo ""
