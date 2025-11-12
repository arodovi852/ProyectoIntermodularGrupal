#!/bin/bash

# Script de Despliegue Rápido
# Uso: ./deploy.sh [dominio]
# Ejemplo: ./deploy.sh miapp.com

set -e  # Salir si hay algún error

DOMAIN=${1:-""}
PROJECT_DIR="/opt/proyecto"

echo "🚀 Iniciando despliegue..."

# Verificar que se proporcionó un dominio
if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Debes proporcionar un dominio"
    echo "Uso: ./deploy.sh tudominio.com"
    exit 1
fi

echo "📦 Dominio: $DOMAIN"

# 1. Actualizar sistema
echo "📥 Actualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo "🐋 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    apt install docker-compose -y
else
    echo "✅ Docker ya está instalado"
fi

# 3. Configurar firewall
echo "🔥 Configurando firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# 4. Instalar Certbot si no está instalado
if ! command -v certbot &> /dev/null; then
    echo "🔒 Instalando Certbot..."
    apt install certbot python3-certbot-nginx -y
else
    echo "✅ Certbot ya está instalado"
fi

# 5. Obtener certificado SSL
echo "🔐 Obteniendo certificado SSL..."
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    # Detener cualquier servicio en puerto 80
    docker-compose down 2>/dev/null || true

    certbot certonly --standalone \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email "admin@$DOMAIN"
else
    echo "✅ Certificado SSL ya existe"
fi

# 6. Actualizar configuración con el dominio real
echo "⚙️ Configurando dominio en nginx..."
sed -i "s/tudominio.com/$DOMAIN/g" nginx.prod.conf

# 7. Construir e iniciar contenedores
echo "🏗️ Construyendo aplicación..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 8. Configurar renovación automática de SSL
echo "🔄 Configurando renovación automática de SSL..."
(crontab -l 2>/dev/null | grep -v certbot; echo "0 3 * * * certbot renew --quiet --post-hook 'docker-compose -f $PROJECT_DIR/docker-compose.prod.yml restart frontend'") | crontab -

# 9. Verificar que todo está funcionando
echo "🔍 Verificando servicios..."
sleep 5
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ ¡Despliegue completado!"
echo ""
echo "🌐 Tu aplicación debería estar disponible en:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "📊 Comandos útiles:"
echo "   Ver logs:      docker-compose -f docker-compose.prod.yml logs -f"
echo "   Reiniciar:     docker-compose -f docker-compose.prod.yml restart"
echo "   Detener:       docker-compose -f docker-compose.prod.yml down"
echo ""
echo "⏰ Nota: El DNS puede tardar hasta 30 minutos en propagarse"

