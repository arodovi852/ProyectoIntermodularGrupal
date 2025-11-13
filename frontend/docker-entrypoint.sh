#!/usr/bin/env sh
set -e

# Si BACKEND_HOST no está definido, usamos un valor por defecto útil para entornos docker-compose
# (en entorno de Render deberías definir la variable con la URL pública del backend)
if [ -z "$BACKEND_HOST" ]; then
  echo "WARNING: BACKEND_HOST no está definido. Usando por defecto 'backend:3001' (útil para docker-compose local)."
  BACKEND_HOST="backend:3001"
fi

# Normalizar BACKEND_HOST: aceptar valores como
# - play-backend.onrender.com
# - play-backend.onrender.com:3001
# - http://play-backend.onrender.com
# - https://play-backend.onrender.com
# Resultado: BACKEND_SCHEME (http/https) y BACKEND_HOST_CLEAN (host[:port])
# Por defecto scheme=http
BACKEND_SCHEME="http"
BACKEND_HOST_CLEAN="$BACKEND_HOST"

# Si BACKEND_HOST empieza por http:// o https://, extraer esquema y host limpio
case "$BACKEND_HOST" in
  http://*)
    BACKEND_SCHEME="http"
    BACKEND_HOST_CLEAN="${BACKEND_HOST#http://}"
    ;;
  https://*)
    BACKEND_SCHEME="https"
    BACKEND_HOST_CLEAN="${BACKEND_HOST#https://}"
    ;;
esac

# Quitar / final si existe
BACKEND_HOST_CLEAN="$(echo "$BACKEND_HOST_CLEAN" | sed 's:/*$::')"

# Reemplazar la plantilla y generar configuración final
envsubst '$BACKEND_SCHEME $BACKEND_HOST_CLEAN' < /app/default.conf.template > /etc/nginx/conf.d/default.conf

# DEBUG: imprimir la configuración final para facilitar diagnóstico en logs
echo "---- nginx config generated start ----"
cat /etc/nginx/conf.d/default.conf || true
echo "---- nginx config generated end ----"

# Lanzar nginx en primer plano
exec nginx -g 'daemon off;'
